import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export interface KeystoneValue {
  horizontal: number | null;
  vertical: number | null;
}

export class KeystoneController {
  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('keystone', { horizontal: null, vertical: null });
  }

  async fetchState(): Promise<void> {
    const [verticalResult, horizontalResult] = await Promise.all([
      this.client.getVerticalKeystone()(),
      this.client.getHorizontalKeystone()(),
    ]);

    const vertical = pipe(
      verticalResult,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );

    const horizontal = pipe(
      horizontalResult,
      E.map(O.toNullable),
      E.getOrElse((): number | null => null)
    );

    this.registry.setState('keystone', { vertical, horizontal });
  }

  async adjustVertical(direction: '+' | '-'): Promise<void> {
    const currentState = this.registry.getState<KeystoneValue>('keystone');
    const current = currentState.value;

    const expectedVertical = (current.vertical ?? 0) + (direction === '+' ? 1 : -1);
    this.registry.setExpectedState('keystone', {
      vertical: expectedVertical,
      horizontal: current.horizontal,
    });

    await this.client.adjustVerticalKeystone(direction)();
  }

  async adjustHorizontal(direction: '+' | '-'): Promise<void> {
    const currentState = this.registry.getState<KeystoneValue>('keystone');
    const current = currentState.value;

    const expectedHorizontal = (current.horizontal ?? 0) + (direction === '+' ? 1 : -1);
    this.registry.setExpectedState('keystone', {
      vertical: current.vertical,
      horizontal: expectedHorizontal,
    });

    await this.client.adjustHorizontalKeystone(direction)();
  }
}
