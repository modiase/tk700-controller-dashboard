import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class FreezeController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('freeze', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getFreezeStatus()();
    const freeze = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): boolean | null => null)
    );
    this.registry.setState('freeze', freeze);
  }

  async setFreeze(on: boolean): Promise<void> {
    this.registry.setExpectedState('freeze', on);
    await this.client.setFreeze(on)();
  }
}
