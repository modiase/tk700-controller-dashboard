import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class FanController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('fanSpeed', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('fanSpeed', await pipe(this.client.getFanSpeed(), RT.toNullable)());
  }
}
