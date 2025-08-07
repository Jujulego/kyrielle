import { asyncIterator$ } from './async-iterator$.js';
import { iterator$ } from './iterator$.js';
import { observable$ } from './observable$.js';
import { resource$ } from './resource$.js';
import type { AsyncDeferrable, Deferrable } from './types/inputs/Deferrable.js';
import type {
  AnyAsyncIterable,
  AnyAwaitableIterable,
  AnyIterable,
  MinimalAsyncIterator,
  MinimalIterator
} from './types/inputs/MinimalIterator.js';
import type { AsyncMutable, Mutable } from './types/inputs/Mutable.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { AsyncMutator, Mutator } from './types/outputs/Mutator.js';
import type { Observable } from './types/outputs/Observable.js';
import type { AsyncRef, Ref } from './types/outputs/Ref.js';
import type { SimpleAsyncIterator, SimpleIterator } from './types/outputs/SimpleIterator.js';
import type { Awaitable } from './types/utils.js';
import { applyFn } from './utils/fn.js';
import { extractAwaitableIterator } from './utils/iterator.js';
import {
  isAsyncIterable,
  isAwaitableIterator,
  isDeferrable,
  isIterable,
  isMutable,
  isPromise,
  isSubscribable,
  isSubscribableHolder
} from './utils/predicates.js';
import { extractSubscribable } from './utils/subscribable.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type JsonOrigin =
  | AnyAwaitableIterable<string>
  | AnySubscribable<string>
  | Deferrable<Awaitable<string>>
  | Mutable<string, Awaitable<string>>;

export type JsonMutable<O extends Mutable, D, A> = O extends AsyncMutable ? AsyncMutator<A, D> : Mutator<A, D>;
export type JsonDeferrable<O extends Deferrable, D> = O extends AsyncDeferrable ? AsyncRef<D> : Ref<D>;

export type JsonResult<O, D, A> =
  & (O extends AnyIterable
    ? SimpleIterator<D>
    : O extends AnyAsyncIterable
      ? SimpleAsyncIterator<D>
      : unknown)
  & (O extends AnySubscribable ? Observable<D> : unknown)
  & (O extends Deferrable ? JsonDeferrable<O, D> : unknown)
  & (O extends Mutable ? JsonMutable<O, D, A> : unknown);

/**
 * Parses json items.
 *
 * @since 1.0.0
 */
export function json$<D = unknown, A = unknown>(): <O extends JsonOrigin>(origin: O) => JsonResult<O, D, A>;

export function json$() {
  return <O extends JsonOrigin>(origin: O) => {
    let lastObj: WeakRef<object> | null = null;
    let lastStr = '';

    function parser(json: string): unknown {
      if (json === lastStr && lastObj?.deref()) {
        return lastObj.deref();
      }

      const result: unknown = JSON.parse(json);

      if (result && typeof result === 'object') {
        lastStr = json;
        lastObj = new WeakRef(result);
      } else {
        lastObj = null;
      }

      return result;
    }

    // Builder
    const builder = resource$();

    if (isIterable<string>(origin) || isAsyncIterable<string>(origin) || isAwaitableIterator<string>(origin)) {
      const iterator = extractAwaitableIterator(origin);
      const result = iterator.next();

      if (isPromise(result)) {
        builder.add(asyncIterator$<unknown>((async function* () {
          let res = await result;

          while (!res.done) {
            yield parser(res.value);

            res = await (iterator as MinimalAsyncIterator<string>).next();
          }
        })()));
      } else {
        let res = result;

        builder.add(iterator$<unknown>((function* () {
          while (!res.done) {
            yield parser(res.value);

            res = (iterator as MinimalIterator<string>).next();
          }
        })()));
      }
    }

    if (isSubscribable<string>(origin) || isSubscribableHolder<string>(origin)) {
      const observable = extractSubscribable(origin);
      builder.add(observable$((observer, signal) => {
        boundedSubscription(observable, signal, {
          next: (val) => {
            observer.next(parser(val));
          },
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });
      }));
    }

    if (isDeferrable<string>(origin)) {
      builder.add({
        defer: (signal) => applyFn(parser, origin.defer(signal)),
      });
    }

    if (isMutable<unknown, string>(origin)) {
      builder.add({
        mutate: (arg, signal) => applyFn(parser, origin.mutate(JSON.stringify(arg), signal)),
      });
    }

    return builder.build();
  };
}
