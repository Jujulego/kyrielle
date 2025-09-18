import { extend$ } from './extend$.js';
import type { PipeStep } from './pipe$.js';
import { reduce$ } from './reduce$.js';
import type { AnyExtendable, Extendable } from './types/inputs/Extendable.js';
import type {
  AnyAsyncIterable,
  AnyAwaitableIterable,
  AnyIterable,
  AsyncIteratedValue,
  IteratedValue
} from './types/inputs/MinimalIterator.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { Observable } from './types/outputs/Observable.js';

// Types
export type CollectOrigin<D = unknown> =
  | AnyAwaitableIterable<D>
  | AnySubscribable<D>;

export type CollectData<O extends CollectOrigin> =
  O extends AnyIterable
    ? IteratedValue<O>
    : O extends AnyAsyncIterable
      ? AsyncIteratedValue<O>
      : O extends AnySubscribable<infer D>
        ? D
        : never;

export type CollectTarget<D = unknown> = AnyExtendable<D>;

export type CollectResult<O extends CollectOrigin, T extends CollectTarget<CollectData<O>> = CollectData<O>[]> =
  O extends AnyIterable
    ? T
    : O extends AnyAsyncIterable
      ? Observable<T>
      : O extends AnySubscribable
        ? Observable<T>
        : never;

/**
 * Collect all emitted items into an array, until observable complete.
 *
 * @since 1.0.0
 * @version 2.5.0 Add support for async iterators
 * @version 2.6.0 Accepts extendable target
 */
export function collect$<O extends CollectOrigin>(): PipeStep<O, CollectResult<O>>;
export function collect$<O extends CollectOrigin, T extends CollectTarget<CollectData<O>>>(target: T): PipeStep<O, CollectResult<O, T>>;

export function collect$(target: Extendable = []): PipeStep<CollectOrigin, Extendable | Observable<Extendable> | undefined> {
  return reduce$<CollectOrigin, Extendable>(extend$, target);
}
