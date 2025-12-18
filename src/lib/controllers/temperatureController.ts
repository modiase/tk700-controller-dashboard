import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class TemperatureController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('temperature', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('temperature', await pipe(this.client.getTemperature(), RT.toNullable)());
  }
}
