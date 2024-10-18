import { observable$ } from './observable$.js';
import { resource$ } from './resource$.js';
import type { AsyncDeferrable, Deferrable } from './types/inputs/Deferrable.js';
import type { AsyncMutable, Mutable } from './types/inputs/Mutable.js';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import type { AsyncMutator, Mutator } from './types/outputs/Mutator.js';
import type { Observable } from './types/outputs/Observable.js';
import type { AsyncRef, Ref } from './types/outputs/Ref.js';
import type { Awaitable } from './types/utils.js';
import { applyFn } from './utils/fn.js';
import { isDeferrable, isMutable, isSubscribable } from './utils/predicates.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type JsonOrigin =
  | AnySubscribable<string>
  | Deferrable<Awaitable<string>>
  | Mutable<string, Awaitable<string>>;

export type JsonMutable<O extends Mutable, D, A> = O extends AsyncMutable ? AsyncMutator<A, D> : Mutator<A, D>;
export type JsonDeferrable<O extends Deferrable, D> = O extends AsyncDeferrable ? AsyncRef<D> : Ref<D>;

export type JsonResult<O, D, A> =
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

    if (isSubscribable<string>(origin)) {
      builder.add(observable$((observer, signal) => {
        boundedSubscription(origin, signal, {
          next(val) {
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
