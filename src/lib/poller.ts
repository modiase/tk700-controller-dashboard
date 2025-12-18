import { BehaviorSubject, interval, EMPTY, Observable, of } from 'rxjs';
import { switchMap, distinctUntilChanged, shareReplay, startWith, map } from 'rxjs/operators';
import { pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
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
import { PowerState, inferPowerState } from './powerState';

const POLL_INTERVAL = 2000;

interface PowerStateData {
  powerOn: boolean | null;
  state: PowerState;
  transitionStartTime: number | null;
}

const powerState$ = new BehaviorSubject<PowerStateData>({
  powerOn: null,
  state: PowerState.UNKNOWN,
  transitionStartTime: null,
});

const STORAGE_KEY_TIMESTAMP = 'benq-power-transition-timestamp';
const STORAGE_KEY_STATE = 'benq-power-state';

const defaultPowerState: PowerStateData = {
  powerOn: null,
  state: PowerState.UNKNOWN,
  transitionStartTime: null,
};

const loadPersistedState = (): Promise<PowerStateData> =>
  pipe(
    TE.tryCatch(
      () =>
        Promise.resolve({
          timestamp: sessionStorage.getItem(STORAGE_KEY_TIMESTAMP),
          state: sessionStorage.getItem(STORAGE_KEY_STATE),
        }),
      e => new Error(`Failed to load persisted power state: ${e}`)
    ),
    TE.map(({ timestamp, state }) =>
      timestamp && state
        ? {
            powerOn: null as boolean | null,
            state: state as PowerState,
            transitionStartTime: parseInt(timestamp),
          }
        : defaultPowerState
    ),
    TE.match(
      () => defaultPowerState,
      state => state
    )
  )();

loadPersistedState().then(state => {
  if (state.transitionStartTime) {
    powerState$.next(state);
  }
});

const persistState = (state: PowerStateData): TE.TaskEither<Error, void> =>
  TE.tryCatch(
    () =>
      Promise.resolve(
        state.transitionStartTime
          ? (sessionStorage.setItem(STORAGE_KEY_TIMESTAMP, state.transitionStartTime.toString()),
            sessionStorage.setItem(STORAGE_KEY_STATE, state.state))
          : (sessionStorage.removeItem(STORAGE_KEY_TIMESTAMP),
            sessionStorage.removeItem(STORAGE_KEY_STATE))
      ),
    e => new Error(`Failed to persist power state: ${e}`)
  );

const calculateTimeSinceTransition = (startTime: number | null): number =>
  startTime ? (Date.now() - startTime) / 1000 : Infinity;

const shouldResetTransition = (newState: PowerState, currentState: PowerState): boolean =>
  newState !== currentState && (newState === PowerState.ON || newState === PowerState.OFF);

const updatePowerStateData = (powerOn: boolean, current: PowerStateData): PowerStateData =>
  pipe(
    calculateTimeSinceTransition(current.transitionStartTime),
    timeSinceTransition => inferPowerState(powerOn, current.state, timeSinceTransition),
    newState => ({
      powerOn,
      state: newState,
      transitionStartTime: shouldResetTransition(newState, current.state)
        ? null
        : current.transitionStartTime,
    })
  );

const fetchAndUpdatePowerState = (): TE.TaskEither<Error, PowerStateData> =>
  pipe(
    TE.tryCatch(
      () => getPowerStatus(),
      e => new Error(`Failed to fetch power status: ${e}`)
    ),
    TE.chain(powerOn =>
      powerOn !== null
        ? pipe(
            TE.of(updatePowerStateData(powerOn, powerState$.value)),
            TE.chainFirst(newData => TE.fromIO(() => powerState$.next(newData))),
            TE.chainFirst(persistState)
          )
        : TE.of(powerState$.value)
    ),
    TE.orElse(() => TE.of(powerState$.value))
  );

const power$ = interval(POLL_INTERVAL).pipe(
  startWith(0),
  switchMap(() => fetchAndUpdatePowerState()().then(E.getOrElse(() => powerState$.value))),
  shareReplay(1)
);

export const powerState = power$;

const isProjectorOn$ = power$.pipe(
  map(state => state.powerOn === true && state.state === PowerState.ON),
  distinctUntilChanged(),
  shareReplay(1)
);

const createPollingTask = <T>(
  fetchFn: () => Promise<T>,
  errorMsg: string
): TE.TaskEither<Error, T | null> =>
  pipe(
    TE.tryCatch(fetchFn, e => new Error(`${errorMsg}: ${e}`)),
    TE.orElse(() => TE.of(null as T | null))
  );

const createConditionalPoller$ = <T>(
  condition$: Observable<boolean>,
  task: TE.TaskEither<Error, T | null>
): Observable<T | null> =>
  condition$.pipe(
    switchMap(isOn =>
      isOn
        ? interval(POLL_INTERVAL).pipe(
            startWith(0),
            switchMap(() => task().then(E.getOrElse(() => null as T | null)))
          )
        : of(null)
    ),
    shareReplay(1)
  );

export const temperature$ = createConditionalPoller$(
  isProjectorOn$,
  createPollingTask(getTemperature, 'Failed to fetch temperature')
);

export const fanSpeed$ = createConditionalPoller$(
  isProjectorOn$,
  createPollingTask(getFanSpeed, 'Failed to fetch fan speed')
);

export const volume$ = createConditionalPoller$(
  isProjectorOn$,
  createPollingTask(getVolume, 'Failed to fetch volume')
);

export const pictureMode$ = createConditionalPoller$(
  isProjectorOn$,
  createPollingTask(getPictureMode, 'Failed to fetch picture mode')
);

interface PictureSettings {
  brightness: number | null;
  contrast: number | null;
  sharpness: number | null;
}

const fetchPictureSettings: TE.TaskEither<Error, PictureSettings> = pipe(
  TE.tryCatch(
    () => Promise.all([getBrightness(), getContrast(), getSharpness()]),
    e => new Error(`Failed to fetch picture settings: ${e}`)
  ),
  TE.map(
    ([brightness, contrast, sharpness]): PictureSettings => ({ brightness, contrast, sharpness })
  ),
  TE.orElse(
    (): TE.TaskEither<Error, PictureSettings> =>
      TE.of({ brightness: null, contrast: null, sharpness: null })
  )
);

export const pictureSettings$ = createConditionalPoller$(isProjectorOn$, fetchPictureSettings);

export const setPowerState = (powerOn: boolean, targetState: PowerState): void => {
  const newData: PowerStateData = {
    powerOn,
    state: targetState,
    transitionStartTime: Date.now(),
  };
  powerState$.next(newData);
  persistState(newData)();
};
