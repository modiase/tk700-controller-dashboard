import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';
import { logger } from '../logger';

export class PictureModeController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('pictureMode', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getPictureMode()();
    const pictureMode = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): string | null => null)
    );
    this.registry.setState('pictureMode', pictureMode);
  }

  async setPictureMode(mode: string): Promise<void> {
    logger.info({ mode }, 'PictureModeController.setPictureMode called');
    this.registry.setExpectedState('pictureMode', mode);
    await this.client.setPictureMode(mode)();
  }
}
