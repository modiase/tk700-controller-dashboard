import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class BlankController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('blank', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('blank', await pipe(this.client.getBlankStatus(), RT.toNullable)());
  }

  async setBlank(on: boolean): Promise<void> {
    this.registry.setExpectedState('blank', on);
    await this.client.setBlank(on)();
    this.registry.setState('blank', await pipe(this.client.getBlankStatus(10), RT.toNullable)());
  }
}
