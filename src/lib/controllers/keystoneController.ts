import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as RT from '../resultTask';
import type { TCPClient } from '../tcp/client';
import type { StateRegistry } from '../stateRegistry';

export interface KeystoneValue {
  horizontal: number | null;
  vertical: number | null;
}

export class KeystoneController {
  constructor(
    private client: TCPClient,
    private registry: StateRegistry
  ) {
    this.registry.setState('keystone', { horizontal: null, vertical: null });
  }

  async fetchState(): Promise<void> {
    this.registry.setState(
      'keystone',
      await pipe(
        RT.Do,
        RT.apS('vertical', this.client.getVerticalKeystone()),
        RT.apS('horizontal', this.client.getHorizontalKeystone()),
        RT.fold(
          (): KeystoneValue => ({ vertical: null, horizontal: null }),
          ({ vertical, horizontal }): KeystoneValue => ({
            vertical: vertical ?? null,
            horizontal: horizontal ?? null,
          }),
          (): KeystoneValue => ({ vertical: null, horizontal: null })
        ),
        TE.getOrElse(() => async (): Promise<KeystoneValue> => ({ vertical: null, horizontal: null }))
      )()
    );
  }

  async adjustVertical(direction: '+' | '-'): Promise<void> {
    const current = this.registry.getState<KeystoneValue>('keystone').value;

    this.registry.setExpectedState('keystone', {
      vertical: (current.vertical ?? 0) + (direction === '+' ? 1 : -1),
      horizontal: current.horizontal,
    });

    await this.client.adjustVerticalKeystone(direction)();

    this.registry.setState('keystone', {
      vertical: await pipe(this.client.getVerticalKeystone(10), RT.toNullable)(),
      horizontal: current.horizontal,
    });
  }

  async adjustHorizontal(direction: '+' | '-'): Promise<void> {
    const current = this.registry.getState<KeystoneValue>('keystone').value;

    this.registry.setExpectedState('keystone', {
      vertical: current.vertical,
      horizontal: (current.horizontal ?? 0) + (direction === '+' ? 1 : -1),
    });

    await this.client.adjustHorizontalKeystone(direction)();

    this.registry.setState('keystone', {
      vertical: current.vertical,
      horizontal: await pipe(this.client.getHorizontalKeystone(10), RT.toNullable)(),
    });
  }
}
