import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export class VolumeController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('volume', null);
  }

  async fetchState(): Promise<void> {
    const result = await this.client.getVolume()();
    const volume = pipe(
      result,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );
    this.registry.setState('volume', volume);
  }

  async setVolume(level: number): Promise<void> {
    this.registry.setExpectedState('volume', level);
    await this.client.setVolume(level)();
  }
}
