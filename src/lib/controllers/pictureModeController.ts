import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class PictureModeController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('pictureMode', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('pictureMode', await pipe(this.client.getPictureMode(), RT.toNullable)());
  }

  async setPictureMode(mode: string): Promise<void> {
    this.registry.setExpectedState('pictureMode', mode);
    await this.client.setPictureMode(mode)();
    this.registry.setState('pictureMode', await pipe(this.client.getPictureMode(10), RT.toNullable)());
  }
}
