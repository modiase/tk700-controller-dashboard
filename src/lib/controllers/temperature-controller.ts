import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class TemperatureController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('temperature', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getTemperature()();
    const temperature = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );
    this.registry.setState('temperature', temperature);
  }
}
