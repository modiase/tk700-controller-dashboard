import { logger } from './logger';

export interface State<T> {
  value: T;
  mutable: boolean;
}

interface ExpectedState {
  expectedValue: any;
  timeoutAt: number;
}

export class StateRegistry {
  private states = new Map<string, any>();
  private immutableKeys = new Set<string>();
  private expectedStates = new Map<string, ExpectedState>();
  private readonly DEFAULT_TIMEOUT_MS = 15000;

  setState<T>(key: string, value: T): void {
    this.states.set(key, value);
  }

  getState<T>(key: string): State<T> {
    this.checkExpectedState(key, this.states.get(key));
    return {
      value: this.states.get(key),
      mutable: !this.immutableKeys.has(key),
    };
  }

  setImmutable(key: string): void {
    this.immutableKeys.add(key);
  }

  clearImmutable(key: string): void {
    this.immutableKeys.delete(key);
    this.expectedStates.delete(key);
  }

  setExpectedState(key: string, expectedValue: any, timeoutMs?: number): void {
    logger.info(
      { key, expectedValue, timeoutMs: timeoutMs ?? this.DEFAULT_TIMEOUT_MS },
      'Setting expected state'
    );
    this.immutableKeys.add(key);
    this.expectedStates.set(key, {
      expectedValue,
      timeoutAt: Date.now() + (timeoutMs ?? this.DEFAULT_TIMEOUT_MS),
    });
  }

  private checkExpectedState(key: string, actualValue: any): void {
    const expected = this.expectedStates.get(key);
    if (!expected) return;

    if (Date.now() > expected.timeoutAt) {
      logger.warn(
        { key, expectedValue: expected.expectedValue, actualValue },
        'Expected state timeout'
      );
      this.clearImmutable(key);
      return;
    }

    if (JSON.stringify(actualValue) === JSON.stringify(expected.expectedValue)) {
      logger.info(
        { key, expectedValue: expected.expectedValue, actualValue },
        'Expected state achieved'
      );
      this.clearImmutable(key);
    }
  }

  getAllStates(): Map<string, any> {
    return new Map(this.states);
  }
}
