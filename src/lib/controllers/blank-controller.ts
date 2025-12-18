import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class BlankController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('blank', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getBlankStatus()();
    const blank = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): boolean | null => null)
    );
    this.registry.setState('blank', blank);
  }

  async setBlank(on: boolean): Promise<void> {
    this.registry.setExpectedState('blank', on);
    await this.client.setBlank(on)();
  }
}
