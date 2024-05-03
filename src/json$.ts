import type {
  AsyncMutable,
  AsyncReadable, AsyncRefreshable,
  Awaitable,
  Mutable, Observable,
  Readable,
  Refreshable,
  Subscribable
} from './defs/index.js';
import { observable$ } from './observable$.js';
import { resource$ } from './resource$.js';
import { applyFn } from './utils/fn.js';
import { isMutable, isReadable, isRefreshable, isSubscribable } from './utils/predicates.js';
import { boundedSubscription } from './utils/subscription.js';

// Types
export type JsonOrigin =
  | Subscribable<string>
  | Readable<Awaitable<string>>
  | Refreshable<Awaitable<string>>
  | Mutable<string, Awaitable<string>>;

export type JsonMutable<O extends Mutable, D, A> = O extends AsyncMutable ? AsyncMutable<D, A> : Mutable<D, A>;
export type JsonReadable<O extends Readable, D> = O extends AsyncReadable ? AsyncReadable<D> : Readable<D>;
export type JsonRefreshable<O extends Refreshable, D> = O extends AsyncRefreshable ? AsyncRefreshable<D> : Refreshable<D>;

export type JsonResult<O, D, A> =
  & (O extends Subscribable ? Observable<D> : unknown)
  & (O extends Readable ? JsonReadable<O, D> : unknown)
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

    if (isReadable<string>(origin)) {
      builder.add({
        read: (signal) => applyFn(parser, origin.read(signal)),
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