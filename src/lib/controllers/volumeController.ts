import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class VolumeController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('volume', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('volume', await pipe(this.client.getVolume(), RT.toNullable)());
  }

  async setVolume(level: number): Promise<void> {
    this.registry.setExpectedState('volume', level);
    await this.client.setVolume(level)();
    this.registry.setState('volume', await pipe(this.client.getVolume(10), RT.toNullable)());
  }
}
