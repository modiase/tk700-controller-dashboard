import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class FanController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('fanSpeed', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getFanSpeed()();
    const fanSpeed = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );
    this.registry.setState('fanSpeed', fanSpeed);
  }
}
