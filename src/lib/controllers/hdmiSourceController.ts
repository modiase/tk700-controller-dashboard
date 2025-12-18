import { pipe } from 'fp-ts/function';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export class HdmiSourceController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('hdmiSource', null);
  }

  async fetchState(): Promise<void> {
    this.registry.setState('hdmiSource', await pipe(this.client.getHdmiSource(), RT.toNullable)());
  }

  async setHdmiSource(source: string): Promise<void> {
    this.registry.setExpectedState('hdmiSource', source);
    await this.client.setHdmiSource(source)();
    this.registry.setState('hdmiSource', await pipe(this.client.getHdmiSource(10), RT.toNullable)());
  }
}
