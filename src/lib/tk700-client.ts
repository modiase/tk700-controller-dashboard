/**
 * TK700 projector TCP client with command queue and caching.
 * Handles low-level socket communication, response parsing, and stale-while-revalidate caching.
 */

import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { pipe, flow } from 'fp-ts/function';
import * as RT from './resultTask';
import { tk700Logger as logger } from './logger';
import { TCPTransport } from './tcp-transport';

const tap =
  <T>(fn: (value: T) => void) =>
  (value: T): T => (fn(value), value);

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  consecutiveErrors: number;
}

export class TK700Client {
  private transport: TCPTransport;
  private cache = new Map<string, CacheEntry<any>>();
  private inFlightRequests = new Map<string, Promise<any>>();
  private cacheMaxAge = 1000;
  private maxConsecutiveErrors = 3;

  constructor(host: string, port: number, timeout: number) {
    this.transport = new TCPTransport({
      host,
      port,
      timeout,
      minRequestIntervalMs: 100,
      idleTimeoutMs: 30000,
    });
  }

  private sendCommand = (command: string): TE.TaskEither<Error, string> =>
    TE.tryCatch(
      async () => {
        const formattedCommand = `\r*${command}#\r`;
        const response = await this.transport.sendRequest(formattedCommand);
        return this.extractResponse(response);
      },
      error => (error instanceof Error ? error : new Error(String(error)))
    );

  private extractResponse(responseData: string): string {
    const responses = responseData.split('\r').filter(r => r.trim());
    const actualResponse =
      responses
        .filter(r => !r.startsWith('>'))
        .filter(r => r !== '*Block item#')
        .find(r => r.match(/^\*[A-Z0-9 ]+=?.*#$/)) || responseData;
    return actualResponse.trim();
  }

  private checkBlockItem = (response: string): O.Option<string> =>
    response.includes('Block item') ? O.none : O.some(response);

  private parseResponse =
    (regex: RegExp, transform: (match: string) => any = s => s) =>
    (response: string): O.Option<any> =>
      pipe(
        O.fromNullable(response.match(regex)),
        O.chain(match => (match[1] ? O.some(transform(match[1])) : O.none))
      );

  private optionToTask =
    <T>(logMsg: string) =>
    (option: O.Option<T>): RT.ResultTask<T> =>
      pipe(
        option,
        O.fold(
          () => (logger.debug(logMsg), RT.none()),
          value => (logger.debug({ value }, logMsg), RT.of(value))
        )
      );

  private isStale = (entry: CacheEntry<any>): boolean =>
    Date.now() - entry.timestamp > this.cacheMaxAge;

  private shouldInvalidate = (entry: CacheEntry<any>): boolean =>
    entry.consecutiveErrors >= this.maxConsecutiveErrors;

  private getCached = <T>(key: string): O.Option<T> =>
    pipe(
      O.fromNullable(this.cache.get(key)),
      O.filter(entry => !this.shouldInvalidate(entry)),
      O.map(entry => entry.value)
    );

  private setCached = <T>(key: string, value: T): void => {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      consecutiveErrors: 0,
    });
  };

  private recordError = (key: string): void => {
    const entry = this.cache.get(key);
    if (entry) {
      this.cache.set(key, {
        ...entry,
        consecutiveErrors: entry.consecutiveErrors + 1,
      });
    }
  };

  private updateFromFetch = <T>(key: string, result: E.Either<Error, O.Option<T>>): O.Option<T> =>
    pipe(
      result,
      E.fold(
        () => {
          this.recordError(key);
          return this.getCached<T>(key);
        },
        option =>
          pipe(
            option,
            O.fold(
              () => {
                this.recordError(key);
                return this.getCached<T>(key);
              },
              value => {
                const entry = this.cache.get(key);
                if (entry) {
                  this.cache.set(key, {
                    value,
                    timestamp: Date.now(),
                    consecutiveErrors: 0,
                  });
                } else {
                  this.setCached(key, value);
                }
                return O.some(value);
              }
            )
          )
      )
    );

  private queryPipeline =
    <T>(
      command: string,
      regex: RegExp,
      transform: (match: string) => T = s => s as unknown as T,
      logContext: string = command
    ): RT.ResultTask<T> =>
    async () => {
      const cacheKey = command;
      const cached = this.getCached<T>(cacheKey);

      return pipe(
        cached,
        O.fold(
          async () => {
            const existingRequest = this.inFlightRequests.get(cacheKey);
            if (existingRequest) {
              return existingRequest;
            }

            const request = pipe(
              this.sendCommand(command),
              TE.map(tap(response => logger.debug({ response }, `${logContext} raw response`))),
              TE.map(this.checkBlockItem),
              TE.chain(
                flow(
                  O.chain(this.parseResponse(regex, transform)),
                  this.optionToTask(`Parsed ${logContext}`)
                )
              ),
              RT.tapError(error => logger.error({ error, command }, `Failed to get ${logContext}`))
            )();

            this.inFlightRequests.set(cacheKey, request);

            try {
              const result = await request;
              this.inFlightRequests.delete(cacheKey);
              return E.right(this.updateFromFetch(cacheKey, result));
            } catch (error) {
              this.inFlightRequests.delete(cacheKey);
              throw error;
            }
          },
          async value => {
            const entry = this.cache.get(cacheKey);
            if (entry && this.isStale(entry)) {
              pipe(
                this.sendCommand(command),
                TE.map(tap(response => logger.debug({ response }, `${logContext} raw response`))),
                TE.map(this.checkBlockItem),
                TE.chain(
                  flow(
                    O.chain(this.parseResponse(regex, transform)),
                    this.optionToTask(`Parsed ${logContext}`)
                  )
                ),
                RT.tapError(error =>
                  logger.error({ error, command }, `Failed to get ${logContext}`)
                )
              )()
                .then(result => this.updateFromFetch(cacheKey, result))
                .catch(() => this.recordError(cacheKey));
            }
            return E.right(O.some(value));
          }
        )
      );
    };

  private commandPipeline = (
    command: string,
    logInfo: any,
    logContext: string
  ): RT.ResultTask<undefined> =>
    pipe(
      this.sendCommand(command),
      TE.map(() => (logger.info(logInfo, `${logContext} command sent`), O.some(undefined))),
      RT.tapError(error => logger.error({ error, ...logInfo }, `Failed to ${logContext}`))
    );

  getPowerStatus = (): RT.ResultTask<boolean> =>
    this.queryPipeline(
      'pow=?',
      /POW=(ON|OFF)/i,
      match => match.toUpperCase() === 'ON',
      'power status'
    );

  setPower = (on: boolean): RT.ResultTask<undefined> =>
    this.commandPipeline(on ? 'pow=on' : 'pow=off', { on }, 'set power');

  getTemperature = (): RT.ResultTask<number> =>
    this.queryPipeline('tmp1=?', /TMP1=(\d+)/i, match => parseInt(match) / 10, 'temperature');

  getFanSpeed = (): RT.ResultTask<number> =>
    this.queryPipeline('fan1=?', /FAN\w*=(\d+)/i, parseInt, 'fan speed');

  getVolume = (): RT.ResultTask<number> =>
    this.queryPipeline('vol=?', /VOL=(\d+)/i, parseInt, 'volume');

  setVolume = (level: number): RT.ResultTask<undefined> =>
    this.commandPipeline(`vol=${Math.max(0, Math.min(20, level))}`, { level }, 'set volume');

  getPictureMode = (): RT.ResultTask<string> =>
    this.queryPipeline(
      'appmod=?',
      /APPMOD=([A-Z0-9]+)/i,
      match => match.toLowerCase(),
      'picture mode'
    );

  setPictureMode = (mode: string): RT.ResultTask<undefined> =>
    this.commandPipeline(`appmod=${mode}`, { mode }, 'set picture mode');

  getBrightness = (): RT.ResultTask<number> =>
    this.queryPipeline('bri=?', /BRI=(\d+)/i, parseInt, 'brightness');

  adjustBrightness = (direction: 'up' | 'down'): RT.ResultTask<undefined> =>
    this.commandPipeline(
      direction === 'up' ? 'bri=+' : 'bri=-',
      { direction },
      'adjust brightness'
    );

  setBrightness = (value: number): RT.ResultTask<undefined> =>
    this.commandPipeline(`bri=${value}`, { value }, 'set brightness');

  getContrast = (): RT.ResultTask<number> =>
    this.queryPipeline('con=?', /CON=(\d+)/i, parseInt, 'contrast');

  setContrast = (value: number): RT.ResultTask<undefined> =>
    this.commandPipeline(`con=${value}`, { value }, 'set contrast');

  getSharpness = (): RT.ResultTask<number> =>
    this.queryPipeline('sharp=?', /SHARP=(\d+)/i, parseInt, 'sharpness');

  setSharpness = (value: number): RT.ResultTask<undefined> =>
    this.commandPipeline(`sharp=${value}`, { value }, 'set sharpness');

  getHdmiSource = (): RT.ResultTask<string> =>
    this.queryPipeline(
      'sour=?',
      /SOUR=([A-Z0-9]+)/i,
      match => match.toLowerCase(),
      'HDMI source'
    );

  setHdmiSource = (source: string): RT.ResultTask<undefined> =>
    this.commandPipeline(`sour=${source}`, { source }, 'set HDMI source');

  getBlankStatus = (): RT.ResultTask<boolean> =>
    this.queryPipeline(
      'blank=?',
      /BLANK=(ON|OFF)/i,
      match => match.toUpperCase() === 'ON',
      'blank status'
    );

  setBlank = (on: boolean): RT.ResultTask<undefined> =>
    this.commandPipeline(on ? 'blank=on' : 'blank=off', { on }, 'set blank');

  getFreezeStatus = (): RT.ResultTask<boolean> =>
    this.queryPipeline(
      'freeze=?',
      /FREEZE=(ON|OFF)/i,
      match => match.toUpperCase() === 'ON',
      'freeze status'
    );

  setFreeze = (on: boolean): RT.ResultTask<undefined> =>
    this.commandPipeline(on ? 'freeze=on' : 'freeze=off', { on }, 'set freeze');

  getVerticalKeystone = (): RT.ResultTask<number> =>
    this.queryPipeline('vkeystone=?', /VKEYSTONE=(-?\d+)/i, parseInt, 'vertical keystone');

  adjustVerticalKeystone = (direction: '+' | '-'): RT.ResultTask<undefined> =>
    this.commandPipeline(`vkeystone=${direction}`, { direction }, 'adjust vertical keystone');

  getHorizontalKeystone = (): RT.ResultTask<number> =>
    this.queryPipeline('hkeystone=?', /HKEYSTONE=(-?\d+)/i, parseInt, 'horizontal keystone');

  adjustHorizontalKeystone = (direction: '+' | '-'): RT.ResultTask<undefined> =>
    this.commandPipeline(`hkeystone=${direction}`, { direction }, 'adjust horizontal keystone');

  getMenuStatus = (): RT.ResultTask<string> =>
    this.queryPipeline(
      'menu=?',
      /MENU=([A-Z0-9]+)/i,
      match => match.toLowerCase(),
      'menu status'
    );

  setMenuOn = (on: boolean): RT.ResultTask<undefined> =>
    this.commandPipeline(on ? 'menu=on' : 'menu=off', { on }, 'set menu');

  menuUp = (): RT.ResultTask<undefined> => this.commandPipeline('up', { action: 'up' }, 'menu up');

  menuDown = (): RT.ResultTask<undefined> =>
    this.commandPipeline('down', { action: 'down' }, 'menu down');

  menuRight = (): RT.ResultTask<undefined> =>
    this.commandPipeline('right', { action: 'right' }, 'menu right');

  menuLeft = (): RT.ResultTask<undefined> =>
    this.commandPipeline('left', { action: 'left' }, 'menu left');

  menuEnter = (): RT.ResultTask<undefined> =>
    this.commandPipeline('enter', { action: 'enter' }, 'menu enter');

  menuBack = (): RT.ResultTask<undefined> =>
    this.commandPipeline('back', { action: 'back' }, 'menu back');
}
