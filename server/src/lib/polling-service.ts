import { BehaviorSubject, interval, combineLatest, merge, EMPTY } from 'rxjs';
import {
  switchMap,
  distinctUntilChanged,
  shareReplay,
  catchError,
  tap,
  startWith,
} from 'rxjs/operators';
import {
  getPowerStatus,
  getTemperature,
  getFanSpeed,
  getVolume,
  getPictureMode,
  getBrightness,
  getContrast,
  getSharpness,
} from './api';
import { PowerState, inferPowerState } from './power-state';

// Polling interval in milliseconds
const POLL_INTERVAL = 2000;

// Power state with transition tracking
interface PowerStateData {
  powerOn: boolean | null;
  state: PowerState;
  transitionStartTime: number | null;
}

// Create the power state subject
const powerState$ = new BehaviorSubject<PowerStateData>({
  powerOn: null,
  state: PowerState.UNKNOWN,
  transitionStartTime: null,
});

// SessionStorage keys
const STORAGE_KEY_TIMESTAMP = 'benq-power-transition-timestamp';
const STORAGE_KEY_STATE = 'benq-power-state';

// Load initial state from sessionStorage
function loadPersistedState(): PowerStateData {
  try {
    const timestamp = sessionStorage.getItem(STORAGE_KEY_TIMESTAMP);
    const state = sessionStorage.getItem(STORAGE_KEY_STATE);

    if (timestamp && state) {
      return {
        powerOn: null,
        state: state as PowerState,
        transitionStartTime: parseInt(timestamp),
      };
    }
  } catch (e) {
    console.error('Failed to load persisted power state:', e);
  }

  return {
    powerOn: null,
    state: PowerState.UNKNOWN,
    transitionStartTime: null,
  };
}

// Initialize with persisted state
const initialState = loadPersistedState();
if (initialState.transitionStartTime) {
  powerState$.next(initialState);
}

// Persist state to sessionStorage
function persistState(state: PowerStateData) {
  try {
    if (state.transitionStartTime) {
      sessionStorage.setItem(STORAGE_KEY_TIMESTAMP, state.transitionStartTime.toString());
      sessionStorage.setItem(STORAGE_KEY_STATE, state.state);
    } else {
      sessionStorage.removeItem(STORAGE_KEY_TIMESTAMP);
      sessionStorage.removeItem(STORAGE_KEY_STATE);
    }
  } catch (e) {
    console.error('Failed to persist power state:', e);
  }
}

// Poll power status
const power$ = interval(POLL_INTERVAL).pipe(
  startWith(0),
  switchMap(async () => {
    try {
      const powerOn = await getPowerStatus();
      if (powerOn !== null) {
        const current = powerState$.value;

        // Calculate time since transition
        const timeSinceTransition = current.transitionStartTime
          ? (Date.now() - current.transitionStartTime) / 1000
          : Infinity;

        // Infer the current state
        const newState = inferPowerState(powerOn, current.state, timeSinceTransition);

        // Clear transition time if we've completed a transition
        let transitionStartTime = current.transitionStartTime;
        if (
          newState !== current.state &&
          (newState === PowerState.ON || newState === PowerState.OFF)
        ) {
          transitionStartTime = null;
        }

        const newData: PowerStateData = {
          powerOn,
          state: newState,
          transitionStartTime,
        };

        powerState$.next(newData);
        persistState(newData);
      }
      return powerState$.value;
    } catch (e) {
      console.error('Failed to fetch power status:', e);
      return powerState$.value;
    }
  }),
  shareReplay(1)
);

// Export power state observable
export const powerState = power$;

// Helper to check if projector is on
const isProjectorOn$ = power$.pipe(
  switchMap(state => [state.powerOn === true && state.state === PowerState.ON]),
  distinctUntilChanged(),
  shareReplay(1)
);

// Poll temperature (only when projector is on)
export const temperature$ = isProjectorOn$.pipe(
  switchMap(isOn => {
    if (!isOn) return EMPTY;
    return interval(POLL_INTERVAL).pipe(
      startWith(0),
      switchMap(async () => {
        try {
          return await getTemperature();
        } catch (e) {
          console.error('Failed to fetch temperature:', e);
          return null;
        }
      })
    );
  }),
  shareReplay(1)
);

// Poll fan speed (only when projector is on)
export const fanSpeed$ = isProjectorOn$.pipe(
  switchMap(isOn => {
    if (!isOn) return EMPTY;
    return interval(POLL_INTERVAL).pipe(
      startWith(0),
      switchMap(async () => {
        try {
          return await getFanSpeed();
        } catch (e) {
          console.error('Failed to fetch fan speed:', e);
          return null;
        }
      })
    );
  }),
  shareReplay(1)
);

// Poll volume (only when projector is on)
export const volume$ = isProjectorOn$.pipe(
  switchMap(isOn => {
    if (!isOn) return EMPTY;
    return interval(POLL_INTERVAL).pipe(
      startWith(0),
      switchMap(async () => {
        try {
          return await getVolume();
        } catch (e) {
          console.error('Failed to fetch volume:', e);
          return null;
        }
      })
    );
  }),
  shareReplay(1)
);

// Poll picture mode (only when projector is on)
export const pictureMode$ = isProjectorOn$.pipe(
  switchMap(isOn => {
    if (!isOn) return EMPTY;
    return interval(POLL_INTERVAL).pipe(
      startWith(0),
      switchMap(async () => {
        try {
          return await getPictureMode();
        } catch (e) {
          console.error('Failed to fetch picture mode:', e);
          return null;
        }
      })
    );
  }),
  shareReplay(1)
);

// Poll picture settings (only when projector is on)
export const pictureSettings$ = isProjectorOn$.pipe(
  switchMap(isOn => {
    if (!isOn) return EMPTY;
    return interval(POLL_INTERVAL).pipe(
      startWith(0),
      switchMap(async () => {
        try {
          const [brightness, contrast, sharpness] = await Promise.all([
            getBrightness(),
            getContrast(),
            getSharpness(),
          ]);
          return { brightness, contrast, sharpness };
        } catch (e) {
          console.error('Failed to fetch picture settings:', e);
          return { brightness: null, contrast: null, sharpness: null };
        }
      })
    );
  }),
  shareReplay(1)
);

// Function to update power state (called when user toggles power)
export function setPowerState(powerOn: boolean, targetState: PowerState) {
  const newData: PowerStateData = {
    powerOn,
    state: targetState,
    transitionStartTime: Date.now(),
  };
  powerState$.next(newData);
  persistState(newData);
}
