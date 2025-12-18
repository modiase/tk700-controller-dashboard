import { Hono, type Context } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import { streamSSE } from 'hono/streaming';
import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import { TK700Client } from './lib/tk700-client';
import * as AT from './lib/apiTask';
import { logger } from './lib/logger';

enum PowerState {
  OFF = 'OFF',
  WARMING_UP = 'WARMING_UP',
  ON = 'ON',
  COOLING_DOWN = 'COOLING_DOWN',
  UNKNOWN = 'UNKNOWN',
}

interface PowerStateData {
  powerOn: boolean | null;
  state: PowerState;
  transitionStartTime: number | null;
}

type PowerStateInfo = PowerStateData;

const WARMING_UP_TIME_SECONDS = 30;
const COOLING_DOWN_TIME_SECONDS = 90;

const initialState: PowerStateData = {
  powerOn: null,
  state: PowerState.UNKNOWN,
  transitionStartTime: null,
};

const calculateTimeSinceTransition = (startTime: number | null): number =>
  startTime ? (Date.now() - startTime) / 1000 : Infinity;

const inferPowerState =
  (current: PowerStateData) =>
  (powerOn: boolean): PowerState => {
    const timeSinceTransition = calculateTimeSinceTransition(current.transitionStartTime);

    if (current.state === PowerState.WARMING_UP && timeSinceTransition < WARMING_UP_TIME_SECONDS) {
      return PowerState.WARMING_UP;
    }

    if (
      current.state === PowerState.COOLING_DOWN &&
      timeSinceTransition < COOLING_DOWN_TIME_SECONDS
    ) {
      return PowerState.COOLING_DOWN;
    }

    return powerOn ? PowerState.ON : PowerState.OFF;
  };

const shouldResetTransition = (currentState: PowerState, newState: PowerState): boolean =>
  newState !== currentState && (newState === PowerState.ON || newState === PowerState.OFF);

const updateFromProjector =
  (current: PowerStateData) =>
  (powerOn: boolean | null): PowerStateData =>
    pipe(
      O.fromNullable(powerOn),
      O.map(on => {
        const newState = inferPowerState(current)(on);
        return {
          powerOn: on,
          state: newState,
          transitionStartTime: shouldResetTransition(current.state, newState)
            ? null
            : current.transitionStartTime,
        };
      }),
      O.getOrElse(() => current)
    );

const initiateTransition =
  (current: PowerStateData) =>
  (targetOn: boolean): PowerStateData => {
    const canTurnOn = current.state === PowerState.OFF;
    const canTurnOff = current.state === PowerState.ON;

    if (targetOn && canTurnOn) {
      return {
        powerOn: targetOn,
        state: PowerState.WARMING_UP,
        transitionStartTime: Date.now(),
      };
    }

    if (!targetOn && canTurnOff) {
      return {
        powerOn: targetOn,
        state: PowerState.COOLING_DOWN,
        transitionStartTime: Date.now(),
      };
    }

    return current;
  };

const makePowerStateManager = () => {
  let state = initialState;

  const getState: IO.IO<PowerStateData> = () => state;

  const getStateInfo: IO.IO<PowerStateInfo> = () => state;

  const modifyState =
    (f: (current: PowerStateData) => PowerStateData): IO.IO<PowerStateData> =>
    () => {
      state = f(state);
      return state;
    };

  const updateFromProjectorStatus = (powerOn: boolean | null): IO.IO<PowerStateData> =>
    modifyState(current => updateFromProjector(current)(powerOn));

  const initiateTransitionTo = (targetOn: boolean): IO.IO<PowerStateData> =>
    modifyState(current => initiateTransition(current)(targetOn));

  return {
    getState,
    getStateInfo,
    updateFromProjectorStatus,
    initiateTransitionTo,
  };
};

const app = new Hono();

app.use('/*', cors());

if (!process.env.TK700_HOST || !process.env.TK700_PORT) {
  throw new Error('TK700_HOST and TK700_PORT environment variables are required');
}

const tk700Client = new TK700Client(
  process.env.TK700_HOST,
  parseInt(process.env.TK700_PORT),
  parseInt(process.env.TK700_TIMEOUT || '5000')
);

const powerStateManager = makePowerStateManager();

interface PictureSettings {
  brightness: number | null;
  contrast: number | null;
  sharpness: number | null;
}

interface SSEData {
  powerState: PowerStateInfo;
  temperature: number | null;
  fanSpeed: number | null;
  volume: number | null;
  pictureMode: string | null;
  pictureSettings: PictureSettings | null;
}

class SSEBroadcaster {
  private clients = new Set<any>();
  private pollInterval: Timer | null = null;
  private readonly POLL_INTERVAL_MS = 2000;

  addClient(stream: any) {
    this.clients.add(stream);
    logger.info({ clientCount: this.clients.size }, 'SSE client connected');
    if (!this.pollInterval) {
      this.startPolling();
    }
  }

  removeClient(stream: any) {
    this.clients.delete(stream);
    logger.info({ clientCount: this.clients.size }, 'SSE client disconnected');
    if (this.clients.size === 0) {
      this.stopPolling();
    }
  }

  private startPolling() {
    logger.info('Starting server-side polling for SSE');
    this.pollInterval = setInterval(async () => {
      const data = await this.fetchAllData();
      this.broadcast(data);
    }, this.POLL_INTERVAL_MS);
  }

  private stopPolling() {
    if (this.pollInterval) {
      logger.info('Stopping server-side polling (no SSE clients)');
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  async fetchAllData(): Promise<SSEData> {
    pipe(
      await tk700Client.getPowerStatus()(),
      E.map(O.toNullable),
      E.getOrElse((): boolean | null => null),
      powerOn => powerStateManager.updateFromProjectorStatus(powerOn)()
    );

    const currentState = powerStateManager.getStateInfo();

    if (!(currentState.powerOn === true && currentState.state === PowerState.ON)) {
      return {
        powerState: currentState,
        temperature: null,
        fanSpeed: null,
        volume: null,
        pictureMode: null,
        pictureSettings: {
          brightness: null,
          contrast: null,
          sharpness: null,
        },
      };
    }

    const [temp, fan, vol, mode, brightness, contrast, sharpness] = await Promise.all([
      tk700Client.getTemperature()(),
      tk700Client.getFanSpeed()(),
      tk700Client.getVolume()(),
      tk700Client.getPictureMode()(),
      tk700Client.getBrightness()(),
      tk700Client.getContrast()(),
      tk700Client.getSharpness()(),
    ]);

    return {
      powerState: currentState,
      temperature: pipe(
        temp,
        E.getOrElse((): O.Option<number> => O.none),
        O.toNullable
      ),
      fanSpeed: pipe(
        fan,
        E.getOrElse((): O.Option<number> => O.none),
        O.toNullable
      ),
      volume: pipe(
        vol,
        E.getOrElse((): O.Option<number> => O.none),
        O.toNullable
      ),
      pictureMode: pipe(
        mode,
        E.getOrElse((): O.Option<string> => O.none),
        O.toNullable
      ),
      pictureSettings: {
        brightness: pipe(
          brightness,
          E.getOrElse((): O.Option<number> => O.none),
          O.toNullable
        ),
        contrast: pipe(
          contrast,
          E.getOrElse((): O.Option<number> => O.none),
          O.toNullable
        ),
        sharpness: pipe(
          sharpness,
          E.getOrElse((): O.Option<number> => O.none),
          O.toNullable
        ),
      },
    };
  }

  private broadcast(data: SSEData) {
    this.clients.forEach(async stream => {
      try {
        await stream.writeSSE({ data: JSON.stringify(data) });
      } catch (error) {
        logger.error({ error }, 'Failed to send SSE message to client');
        this.clients.delete(stream);
      }
    });
  }
}

const sseBroadcaster = new SSEBroadcaster();

const handleTask = async <T>(task: AT.ApiTask<T>, c: Context) =>
  pipe(await task(), AT.toApiResponse, response => c.json(response, response.error ? 500 : 200));

app.get('/api/stream', c =>
  streamSSE(c, async stream => {
    sseBroadcaster.addClient(stream);

    const initialData = await sseBroadcaster.fetchAllData();
    await stream.writeSSE({
      data: JSON.stringify(initialData),
    });

    const keepAlive = setInterval(async () => {
      try {
        await stream.writeSSE({ data: ':keep-alive' });
      } catch {
        clearInterval(keepAlive);
      }
    }, 30000);

    stream.onAbort(() => {
      clearInterval(keepAlive);
      sseBroadcaster.removeClient(stream);
    });
  })
);

app.get('/api/power-state', async c => {
  const powerStatus = await tk700Client.getPowerStatus()();
  pipe(
    powerStatus,
    E.map(O.toNullable),
    E.getOrElse((): boolean | null => null),
    powerOn => powerStateManager.updateFromProjectorStatus(powerOn)()
  );
  return c.json({ error: null, data: powerStateManager.getStateInfo() });
});

app.get('/api/power', async c => handleTask(tk700Client.getPowerStatus(), c));

app.post('/api/power', async c => {
  const { on } = await c.req.json();
  powerStateManager.initiateTransitionTo(on)();
  return handleTask(tk700Client.setPower(on), c);
});

app.get('/api/temperature', async c => handleTask(tk700Client.getTemperature(), c));

app.get('/api/fan', async c => handleTask(tk700Client.getFanSpeed(), c));

app.get('/api/volume', async c => handleTask(tk700Client.getVolume(), c));

app.post('/api/volume', async c => {
  const { level } = await c.req.json();
  return handleTask(tk700Client.setVolume(level), c);
});

app.get('/api/picture-mode', async c => handleTask(tk700Client.getPictureMode(), c));

app.post('/api/picture-mode', async c => {
  const { mode } = await c.req.json();
  return handleTask(tk700Client.setPictureMode(mode), c);
});

app.get('/api/brightness', async c => handleTask(tk700Client.getBrightness(), c));

app.post('/api/brightness', async c => {
  const body = await c.req.json();

  if (body.direction) {
    return handleTask(tk700Client.adjustBrightness(body.direction), c);
  } else if (body.value !== undefined) {
    return handleTask(tk700Client.setBrightness(body.value), c);
  }

  return c.json({ error: 'Invalid request', data: null }, 400);
});

app.get('/api/contrast', async c => handleTask(tk700Client.getContrast(), c));

app.post('/api/contrast', async c => {
  const { value } = await c.req.json();
  return handleTask(tk700Client.setContrast(value), c);
});

app.get('/api/sharpness', async c => handleTask(tk700Client.getSharpness(), c));

app.post('/api/sharpness', async c => {
  const { value } = await c.req.json();
  return handleTask(tk700Client.setSharpness(value), c);
});

app.use('/*', serveStatic({ root: './dist' }));
app.use('/*', serveStatic({ path: './dist/index.html' }));

if (!process.env.PORT) {
  throw new Error('PORT environment variable is required');
}

const port = parseInt(process.env.PORT);
const hostname = process.env.HOST;

const logConfig: any = { port, tk700Host: process.env.TK700_HOST };
if (hostname) {
  logConfig.hostname = hostname;
}
logger.info(logConfig, 'TK700 Control Server starting');

const serverConfig: any = { port, fetch: app.fetch };
if (hostname) {
  serverConfig.hostname = hostname;
}

export default serverConfig;
