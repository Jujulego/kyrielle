import { Draft, Immer, produce } from 'immer';

import { AsyncMutable, AsyncReadable, ObservedValue, SymmetricRef } from './defs/index.js';
import { awaitedCall } from './utils/promise.js';

/**
 * Function returning a reducer modifying the current value of a reference
 */
export type ActionReducer<P extends unknown[], D> = (...params: P) => (old: Draft<D>) => Draft<D> | void;

/**
 * Record of {@link ActionReducer}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionReducers<D = unknown> = Record<string, ActionReducer<any[], D>>;

/**
 * Result of an {@link Action}. If the reference is fully synchronous the action will return the final value stored in
 * the reference, which was returned by its mutate method.
 * If either read or mutate (or both) is asynchronous then the action will also be asynchronous.
 */
export type ActionResult<R extends SymmetricRef, D> = R extends AsyncReadable | AsyncMutable ? Promise<D> : D;

/**
 * Final method added to an {@link ActionRef}
 */
export type Action<P extends unknown[], R extends SymmetricRef> = (...params: P) => ActionResult<R, ObservedValue<R>>;

/**
 * Add actions from an {@link ActionReducers} to the given ref type.
 */
export type ActionRef<R extends SymmetricRef, A extends Record<string, ActionReducer<unknown[], ObservedValue<R>>>> = R & {
  [K in keyof A]: A[K] extends ActionReducer<infer P, ObservedValue<R>> ? Action<P, R> : never;
};

export interface ActionsOpts {
  /**
   * Custom instance of Immer to use. By default, it will use the global instance.
   */
  immer?: Immer;
}

/**
 * Wrap a reference, adding some methods to modify stored data.
 *
 * Based on [immer](https://immerjs.github.io/immer/), those methods should return a reducer receiving current stored data.
 * Then they can modify the data in place. Immer will produce an updated data objet that will be given to ref's mutate method
 * to store the changes.
 *
 * @param ref reference to wrap (must be a symmetric reference)
 * @param actions actions reducers
 * @param opts
 *
 * @example
 * const counter = action$(var$({ count: 1 }), {
 *   add: (i: number) => (old) => {
 *     old.count += i;
 *   },
 *   reset: () => (old) => {
 *     old.count = 0;
 *   },
 * });
 *
 * counter.add(1); // <= this will increment count by 1
 * counter.reset(); // <= this will reset count to 0
 */
export function actions$<R extends SymmetricRef, A extends ActionReducers<ObservedValue<R>>>(ref: R, actions: A, opts: ActionsOpts = {}): ActionRef<R, A> {
  const { immer } = opts;

  for (const [key, act] of Object.entries(actions)) {
    Object.assign(ref, {
      [key]: (...params: unknown[]) => awaitedCall(
        (result) => ref.mutate(result),
        awaitedCall(
          (old) => (immer?.produce ?? produce)(old, act(...params)),
          ref.read()
        )
      ),
    });
  }

  return ref as ActionRef<R, A>;
}
