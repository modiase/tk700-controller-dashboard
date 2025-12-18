import { pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import type { TK700Client } from '../tk700-client';
import type { StateRegistry } from '../state-registry';

export enum PowerState {
  OFF = 'OFF',
  WARMING_UP = 'WARMING_UP',
  ON = 'ON',
  COOLING_DOWN = 'COOLING_DOWN',
  UNKNOWN = 'UNKNOWN',
}

export interface PowerStateData {
  powerOn: boolean | null;
  state: PowerState;
  transitionStartTime: number | null;
}

const WARMING_UP_TIME_SECONDS = 30;
const COOLING_DOWN_TIME_SECONDS = 90;

const initialState: PowerStateData = {
  powerOn: null,
  state: PowerState.UNKNOWN,
  transitionStartTime: null,
};

const calculateTimeSinceTransition = (startTime: number | null): number =>
  startTime ? (Date.now() - startTime) / 1000 : Infinity;

const inferPowerState =
  (current: PowerStateData) =>
  (powerOn: boolean): PowerState => {
    const timeSinceTransition = calculateTimeSinceTransition(current.transitionStartTime);

    if (current.state === PowerState.WARMING_UP && timeSinceTransition < WARMING_UP_TIME_SECONDS) {
      return PowerState.WARMING_UP;
    }

    if (
      current.state === PowerState.COOLING_DOWN &&
      timeSinceTransition < COOLING_DOWN_TIME_SECONDS
    ) {
      return PowerState.COOLING_DOWN;
    }

    return powerOn ? PowerState.ON : PowerState.OFF;
  };

const shouldResetTransition = (currentState: PowerState, newState: PowerState): boolean =>
  newState !== currentState && (newState === PowerState.ON || newState === PowerState.OFF);

const updateFromProjector =
  (current: PowerStateData) =>
  (powerOn: boolean | null): PowerStateData =>
    pipe(
      O.fromNullable(powerOn),
      O.map(on => {
        const newState = inferPowerState(current)(on);
        return {
          powerOn: on,
          state: newState,
          transitionStartTime: shouldResetTransition(current.state, newState)
            ? null
            : current.transitionStartTime,
        };
      }),
      O.getOrElse(() => current)
    );

const initiateTransition =
  (current: PowerStateData) =>
  (targetOn: boolean): PowerStateData => {
    const canTurnOn = current.state === PowerState.OFF;
    const canTurnOff = current.state === PowerState.ON;

    if (targetOn && canTurnOn) {
      return {
        powerOn: targetOn,
        state: PowerState.WARMING_UP,
        transitionStartTime: Date.now(),
      };
    }

    if (!targetOn && canTurnOff) {
      return {
        powerOn: targetOn,
        state: PowerState.COOLING_DOWN,
        transitionStartTime: Date.now(),
      };
    }

    return current;
  };

export class PowerController {
  private localState: PowerStateData = initialState;

  constructor(
    private client: TK700Client,
    private registry: StateRegistry
  ) {
    this.registry.setState('powerState', initialState);
  }

  async fetchState(): Promise<void> {
    const powerOnResult = await this.client.getPowerStatus()();

    const powerOn = pipe(
      powerOnResult,
      E.map(O.toNullable),
      E.getOrElse((): boolean | null => null)
    );

    this.localState = updateFromProjector(this.localState)(powerOn);
    this.registry.setState('powerState', this.localState);
  }

  async setPower(on: boolean): Promise<void> {
    this.localState = initiateTransition(this.localState)(on);
    this.registry.setState('powerState', this.localState);

    await this.client.setPower(on)();
  }
}
