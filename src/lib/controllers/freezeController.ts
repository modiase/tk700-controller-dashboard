import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class FreezeController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('freeze', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('freeze', await pipe(this.client.getFreezeStatus(), RT.toNullable)());
  }

  async setFreeze(on: boolean): Promise<void> {
    this.registry.setExpectedState('freeze', on);
    await this.client.setFreeze(on)();
    this.registry.setState('freeze', await pipe(this.client.getFreezeStatus(10), RT.toNullable)());
  }
}
