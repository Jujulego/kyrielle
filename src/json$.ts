import type {
  AsyncMutable,
  AsyncDeferrable, AsyncRefreshable,
  Awaitable,
  Mutable, Observable,
  Deferrable,
  Refreshable,
  Subscribable
} from './defs/index.js';
import { observable$ } from './observable$.js';
import { resource$ } from './resource$.js';
import { applyFn } from './utils/fn.js';
import { isMutable, isDeferrable, isRefreshable, isSubscribable } from './utils/predicates.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type JsonOrigin =
  | Subscribable<string>
  | Deferrable<Awaitable<string>>
  | Refreshable<Awaitable<string>>
  | Mutable<string, Awaitable<string>>;

export type JsonMutable<O extends Mutable, D, A> = O extends AsyncMutable ? AsyncMutable<D, A> : Mutable<D, A>;
export type JsonDeferrable<O extends Deferrable, D> = O extends AsyncDeferrable ? AsyncDeferrable<D> : Deferrable<D>;
export type JsonRefreshable<O extends Refreshable, D> = O extends AsyncRefreshable ? AsyncRefreshable<D> : Refreshable<D>;

export type JsonResult<O, D, A> =
  & (O extends Subscribable ? Observable<D> : unknown)
  & (O extends Deferrable ? JsonDeferrable<O, D> : unknown)
  & (O extends Refreshable ? JsonRefreshable<O, D> : unknown)
  & (O extends Mutable ? JsonMutable<O, D, A> : unknown);

/**
 * Parses json items.
 */
export function json$<D = unknown, A = any>(): <O extends JsonOrigin>(origin: O) => JsonResult<O, D, A>; // eslint-disable-line @typescript-eslint/no-explicit-any

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

    if (isRefreshable<string>(origin)) {
      builder.add({
        refresh: (signal) => applyFn(parser, origin.refresh(signal)),
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
