import { writable, type Readable } from 'svelte/store';
import type { Observable } from 'rxjs';

export interface ObservableStoreValue<T> {
  value: T | null;
  loading: boolean;
}

/**
 * Converts an RxJS Observable to a Svelte readable store with loading state.
 * Implements "keep last known value" pattern - only updates when new value is not null.
 *
 * @param observable$ - The RxJS Observable to convert
 * @param initialValue - Optional initial value (defaults to null)
 * @returns A Svelte store with { value, loading } shape
 */
export function fromObservable<T>(
  observable$: Observable<T | null>,
  initialValue: T | null = null
): Readable<ObservableStoreValue<T>> {
  const store = writable<ObservableStoreValue<T>>({
    value: initialValue,
    loading: true,
  });

  observable$.subscribe(newValue => {
    store.update(current => {
      if (newValue !== null) {
        return { value: newValue, loading: false };
      }
      return { ...current, loading: false };
    });
  });

  return {
    subscribe: store.subscribe,
  };
}
