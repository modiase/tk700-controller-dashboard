/**
 * Custom monad combining TaskEither and Option for API operations.
 * Represents async operations that can fail (Error), succeed with data (Some), or return nothing (None).
 * Provides functional composition utilities and JSON response conversion.
 */

import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { pipe, flow } from 'fp-ts/function';
import type { Monad1 } from 'fp-ts/Monad';

export const URI = 'ApiTask';
export type URI = typeof URI;

declare module 'fp-ts/HKT' {
  interface URItoKind<A> {
    readonly [URI]: ApiTask<A>;
  }
}

export interface ApiTask<A> extends TE.TaskEither<Error, O.Option<A>> {}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Constructors
export const of = <A>(a: A): ApiTask<A> => TE.right(O.some(a));

export const none = <A = never>(): ApiTask<A> => TE.right(O.none);

export const left = <A = never>(e: Error): ApiTask<A> => TE.left(e);

export const fromOption = <A>(o: O.Option<A>): ApiTask<A> => TE.right(o);

export const fromEither = <A>(e: E.Either<Error, A>): ApiTask<A> =>
  pipe(e, E.map(O.some), TE.fromEither);

// Functor
export const map =
  <A, B>(f: (a: A) => B) =>
  (fa: ApiTask<A>): ApiTask<B> =>
    pipe(fa, TE.map(O.map(f)));

// Apply
export const ap =
  <A>(fa: ApiTask<A>) =>
  <B>(fab: ApiTask<(a: A) => B>): ApiTask<B> =>
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
  <A, B>(f: (a: A) => ApiTask<B>) =>
  (fa: ApiTask<A>): ApiTask<B> =>
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
export const Do: ApiTask<{}> = of({});

export const bindTo =
  <N extends string>(name: N) =>
  <A>(fa: ApiTask<A>): ApiTask<{ [K in N]: A }> =>
    pipe(
      fa,
      map(a => ({ [name]: a }) as { [K in N]: A })
    );

export const bind =
  <N extends string, A, B>(name: Exclude<N, keyof A>, f: (a: A) => ApiTask<B>) =>
  (ma: ApiTask<A>): ApiTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
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
  <N extends string, A, B>(name: Exclude<N, keyof A>, fb: ApiTask<B>) =>
  (fa: ApiTask<A>): ApiTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
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
  (fa: ApiTask<A>): ApiTask<{ [K in keyof A | N]: K extends keyof A ? A[K] : B }> =>
    pipe(
      fa,
      map(a => Object.assign({}, a, { [name]: f(a) }) as any)
    );

// Additional utilities
export const tap =
  <A>(f: (a: A) => void) =>
  (fa: ApiTask<A>): ApiTask<A> =>
    pipe(
      fa,
      map(a => (f(a), a))
    );

export const tapError =
  (f: (e: Error) => void) =>
  <A>(fa: ApiTask<A>): ApiTask<A> =>
    pipe(
      fa,
      TE.mapLeft(e => (f(e), e))
    );

export const fold =
  <A, B>(onNone: () => B, onSome: (a: A) => B, onError: (e: Error) => B) =>
  (fa: ApiTask<A>): TE.TaskEither<never, B> =>
    pipe(
      fa,
      TE.fold(
        e => TE.right(onError(e)),
        O.fold(() => TE.right(onNone()), flow(onSome, TE.right))
      )
    );

export const getOrElse =
  <A>(onNone: () => A, onError: (e: Error) => A) =>
  (fa: ApiTask<A>): TE.TaskEither<never, A> =>
    pipe(
      fa,
      TE.fold(
        e => TE.right(onError(e)),
        O.fold(() => TE.right(onNone()), TE.right)
      )
    );

export const toNullable =
  <A>(fa: ApiTask<A>) =>
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
