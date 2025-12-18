/**
 * Server-Sent Events bridge for real-time projector updates.
 * Converts SSE stream to RxJS observables with automatic reconnection.
 * Alternative to polling - provides same Observable API with lower latency.
 */

import { Observable } from 'rxjs';
import { map, distinctUntilChanged, shareReplay, retry } from 'rxjs/operators';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const API_BASE = `${BASE_PATH}${BASE_PATH.endsWith('/') ? '' : '/'}api`;

interface PowerStateData {
  powerOn: boolean | null;
  state: 'OFF' | 'WARMING_UP' | 'ON' | 'COOLING_DOWN' | 'UNKNOWN';
  transitionStartTime: number | null;
  remainingSeconds: number;
}

interface State<T> {
  value: T;
  mutable: boolean;
}

interface PictureSettingsValue {
  brightness: number | null;
  contrast: number | null;
  sharpness: number | null;
}

interface KeystoneValue {
  horizontal: number | null;
  vertical: number | null;
}

interface SSEData {
  powerState: PowerStateData | null;
  temperature: State<number | null>;
  fanSpeed: State<number | null>;
  volume: State<number | null>;
  pictureMode: State<string | null>;
  pictureSettings: State<PictureSettingsValue | null>;
  hdmiSource: State<string | null>;
  blank: State<boolean | null>;
  freeze: State<boolean | null>;
  keystone: State<KeystoneValue | null>;
  menu: State<string | null>;
}

const createSSEObservable = (url: string): Observable<SSEData> =>
  new Observable<SSEData>(subscriber => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = event => {
      try {
        const data = JSON.parse(event.data);
        subscriber.next(data);
      } catch (error) {
        subscriber.error(error);
      }
    };

    eventSource.onerror = error => {
      eventSource.close();
      subscriber.error(error);
    };

    return () => {
      eventSource.close();
    };
  }).pipe(
    retry({ delay: 3000 }),
    shareReplay(1)
  );

const sseStream$ = createSSEObservable(`${API_BASE}/stream`);

export const powerState = sseStream$.pipe(
  map(data => data.powerState),
  distinctUntilChanged(),
  shareReplay(1)
);

export const temperature$ = sseStream$.pipe(
  map(data => data.temperature),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const fanSpeed$ = sseStream$.pipe(
  map(data => data.fanSpeed),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const volume$ = sseStream$.pipe(
  map(data => data.volume),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const pictureMode$ = sseStream$.pipe(
  map(data => data.pictureMode),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const pictureSettings$ = sseStream$.pipe(
  map(data => data.pictureSettings),
  distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  shareReplay(1)
);

export const hdmiSource$ = sseStream$.pipe(
  map(data => data.hdmiSource),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const blank$ = sseStream$.pipe(
  map(data => data.blank),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const freeze$ = sseStream$.pipe(
  map(data => data.freeze),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);

export const keystone$ = sseStream$.pipe(
  map(data => data.keystone),
  distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
  shareReplay(1)
);

export const menu$ = sseStream$.pipe(
  map(data => data.menu),
  distinctUntilChanged((a, b) => a.value === b.value && a.mutable === b.mutable),
  shareReplay(1)
);
