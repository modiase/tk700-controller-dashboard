import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class HdmiSourceController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('hdmiSource', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getHdmiSource()();
    const hdmiSource = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): string | null => null)
    );
    this.registry.setState('hdmiSource', hdmiSource);
  }

  async setHdmiSource(source: string): Promise<void> {
    this.registry.setExpectedState('hdmiSource', source);
    await this.client.setHdmiSource(source)();
  }
}
