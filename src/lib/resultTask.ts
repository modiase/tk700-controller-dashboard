/**
 * Custom monad combining TaskEither and Option for async result operations.
 * Represents async operations that can fail (Error), succeed with data (Some), or return nothing (None).
 * Provides functional composition utilities and JSON response conversion.
 */

import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import type { Monad1 } from 'fp-ts/Monad';

export const URI = 'ResultTask';
export type URI = typeof URI;

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: ResultTask<A>;
  }
}

export interface ResultTask<A> extends TE.TaskEither<Error, O.Option<A>> {}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Constructors
export const of = <A>(a: A): ResultTask<A> => TE.right(O.some(a));

export const none = <A = never>(): ResultTask<A> => TE.right(O.none);

export const left = <A = never>(e: Error): ResultTask<A> => TE.left(e);

export const fromOption = <A>(o: O.Option<A>): ResultTask<A> => TE.right(o);

export const fromEither = <A>(e: E.Either<Error, A>): ResultTask<A> =>
  pipe(e, E.map(O.some), TE.fromEither);

// Functor
export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: ResultTask<A>): ResultTask<B> =>
    pipe(fa, TE.map(O.map(f)));

// Apply
export const ap =
  <A>(fa: ResultTask<A>) =>
  <B>(fab: ResultTask<(a: A) => B>): ResultTask<B> =>
    pipe(
      fab,
      TE.chain(optF =>
        pipe(
          fa,
          TE.map(optA =>
            pipe(
              optF,
              O.chain(f => pipe(optA, O.map(f)))
            )
          )
        )
      )
    );

// Monad
export const chain =
  <A, B>(f: (a: A) => ResultTask<B>) =>
  (fa: ResultTask<A>): ResultTask<B> =>
    pipe(
      fa,
      TE.chain(
        O.fold(
          () => TE.right(O.none),
          a => f(a)
        )
      )
    );

export const chainW = chain;

// Do notation
export const Do: ResultTask<{}> = of({});

export const bindTo =
  <N extends string>(name: N) =>
  <A>(fa: ResultTask<A>): ResultTask<{ [K in N]: A }> =>
    pipe(
      fa,
      map(a => ({ [name]: a }) as { [K in N]: A })
    );

export const bind =
  <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => ResultTask<B>) =>
  (ma: ResultTask<A>): ResultTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
    pipe(
      ma,
      chain(a =>
        pipe(
          f(a),
          map(b => Object.assign({}, a, { [name]: b }) as any)
        )
      )
    );

export const apS =
  <N extends string, A, B>(name: Exclude<N, keyof A>, fb: ResultTask<B>) =>
  (fa: ResultTask<A>): ResultTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
    pipe(
      fa,
      chain(a =>
        pipe(
          fb,
          map(b => Object.assign({}, a, { [name]: b }) as any)
        )
      )
    );

export const letIn =
  <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => B) =>
  (fa: ResultTask<A>): ResultTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
    pipe(
      fa,
      map(a => Object.assign({}, a, { [name]: f(a) }) as any)
    );

// Additional utilities
export const tap =
  <A>(f: (a: A) => void) =>
  (fa: ResultTask<A>): ResultTask<A> =>
    pipe(
      fa,
      map(a => (f(a), a))
    );

export const tapError =
  (f: (e: Error) => void) =>
  <A>(fa: ResultTask<A>): ResultTask<A> =>
    pipe(
      fa,
      TE.mapLeft(e => (f(e), e))
    );

export const fold =
  <A, B>(onNone: () => B, onSome: (a: A) => B, onError: (e: Error) => B) =>
  (fa: ResultTask<A>): TE.TaskEither<never, B> =>
    pipe(
      fa,
      TE.fold(
        e => TE.right(onError(e)),
        O.fold(() => TE.right(onNone()), flow(onSome, TE.right))
      )
    );

export const getOrElse =
  <A>(onNone: () => A, onError: (e: Error) => A) =>
  (fa: ResultTask<A>): TE.TaskEither<never, A> =>
    pipe(
      fa,
      TE.fold(
        e => TE.right(onError(e)),
        O.fold(() => TE.right(onNone()), TE.right)
      )
    );

export const toNullable =
  <A>(fa: ResultTask<A>) =>
  async (): Promise<A | null> =>
    pipe(
      await fa(),
      E.fold(
        (): A | null => null,
        O.fold(
          (): A | null => null,
          (a): A | null => a
        )
      )
    );

// Monad instance
export const Monad: Monad1<URI> = {
  URI,
  map: (fa, f) => pipe(fa, map(f)),
  of,
  ap: (fab, fa) => pipe(fab, ap(fa)),
  chain: (fa, f) => pipe(fa, chain(f)),
};

// Response conversion
export const toApiResponse = <T>(either: E.Either<Error, O.Option<T>>): ApiResponse<T> =>
  pipe(
    either,
    E.fold(
      (error): ApiResponse<T> => ({ data: null, error: error.message }),
      (option): ApiResponse<T> =>
        pipe(
          option,
          O.fold(
            (): ApiResponse<T> => ({ data: null, error: null }),
            (data): ApiResponse<T> => ({ data, error: null })
          )
        )
    )
  );
