/**
 * Power state machine for BenQ projector transitions.
 * Manages warming (30s) and cooling (90s) states with validation rules.
 * Based on: https://www.manualslib.com/manual/215079/Benq-Ms612st.html
 */

export enum PowerState {
  OFF = 'OFF',
  WARMING_UP = 'WARMING_UP',
  ON = 'ON',
  COOLING_DOWN = 'COOLING_DOWN',
  UNKNOWN = 'UNKNOWN',
}

export interface PowerStateInfo {
  state: PowerState;
  canTurnOn: boolean;
  canTurnOff: boolean;
  label: string;
  estimatedTransitionTimeSeconds?: number;
}

export const WARMING_UP_TIME_SECONDS = 30;
export const COOLING_DOWN_TIME = 90;

export function getPowerStateInfo(state: PowerState): PowerStateInfo {
  switch (state) {
    case PowerState.OFF:
      return {
        state: PowerState.OFF,
        canTurnOn: true,
        canTurnOff: false,
        label: 'Off',
      };

    case PowerState.WARMING_UP:
      return {
        state: PowerState.WARMING_UP,
        canTurnOn: false,
        canTurnOff: false,
        label: 'Powering On',
        estimatedTransitionTimeSeconds: WARMING_UP_TIME_SECONDS,
      };

    case PowerState.ON:
      return {
        state: PowerState.ON,
        canTurnOn: false,
        canTurnOff: true,
        label: 'On',
      };

    case PowerState.COOLING_DOWN:
      return {
        state: PowerState.COOLING_DOWN,
        canTurnOn: false,
        canTurnOff: false,
        label: 'Powering Off',
        estimatedTransitionTimeSeconds: COOLING_DOWN_TIME,
      };

    case PowerState.UNKNOWN:
    default:
      return {
        state: PowerState.UNKNOWN,
        canTurnOn: false,
        canTurnOff: false,
        label: 'Unknown',
      };
  }
}

export function inferPowerState(
  powerOn: boolean,
  previousState: PowerState,
  timeSinceTransitionSeconds: number
): PowerState {
  if (
    previousState === PowerState.WARMING_UP &&
    timeSinceTransitionSeconds < WARMING_UP_TIME_SECONDS
  ) {
    return PowerState.WARMING_UP;
  }

  if (previousState === PowerState.COOLING_DOWN && timeSinceTransitionSeconds < COOLING_DOWN_TIME) {
    return PowerState.COOLING_DOWN;
  }

  return powerOn ? PowerState.ON : PowerState.OFF;
}

export function getNextState(currentState: PowerState, commandTurnOn: boolean): PowerState {
  const info = getPowerStateInfo(currentState);

  if (commandTurnOn && info.canTurnOn) {
    return PowerState.WARMING_UP;
  }

  if (!commandTurnOn && info.canTurnOff) {
    return PowerState.COOLING_DOWN;
  }

  return currentState;
}
