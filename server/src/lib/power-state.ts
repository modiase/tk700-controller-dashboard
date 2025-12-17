// Power state machine for BenQ projector
// Based on: https://www.manualslib.com/manual/215079/Benq-Ms612st.html

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
  estimatedTransitionTime?: number; // seconds
}

// Typical transition times (can vary by model)
export const WARMING_UP_TIME = 30; // seconds
export const COOLING_DOWN_TIME = 90; // seconds (15 with Quick Cooling)

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
        canTurnOff: false, // Projector ignores power off during warmup
        label: 'Powering On',
        estimatedTransitionTime: WARMING_UP_TIME,
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
        canTurnOn: false, // Projector ignores power on during cooling
        canTurnOff: false,
        label: 'Powering Off',
        estimatedTransitionTime: COOLING_DOWN_TIME,
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

// Infer state from power status and previous state
export function inferPowerState(
  powerOn: boolean,
  previousState: PowerState,
  timeSinceTransition: number // seconds
): PowerState {
  // If we're in a transition state and enough time hasn't passed, stay in transition
  if (previousState === PowerState.WARMING_UP && timeSinceTransition < WARMING_UP_TIME) {
    return PowerState.WARMING_UP;
  }

  if (previousState === PowerState.COOLING_DOWN && timeSinceTransition < COOLING_DOWN_TIME) {
    return PowerState.COOLING_DOWN;
  }

  // Otherwise, use the power status
  return powerOn ? PowerState.ON : PowerState.OFF;
}

// Predict next state after a command
export function getNextState(currentState: PowerState, commandTurnOn: boolean): PowerState {
  const info = getPowerStateInfo(currentState);

  if (commandTurnOn && info.canTurnOn) {
    return PowerState.WARMING_UP;
  }

  if (!commandTurnOn && info.canTurnOff) {
    return PowerState.COOLING_DOWN;
  }

  // Command not allowed in current state
  return currentState;
}
