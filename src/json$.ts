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
import type { PipeStep } from './pipe$.js';
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

export type JsonMutable<O extends Mutable> = O extends AsyncMutable ? AsyncMutable : Mutable;
export type JsonReadable<O extends Readable> = O extends AsyncReadable ? AsyncReadable : Readable;
export type JsonRefreshable<O extends Refreshable> = O extends AsyncRefreshable ? AsyncRefreshable : Refreshable;

export type JsonResult<O> =
  & (O extends Subscribable ? Observable : unknown)
  & (O extends Readable ? JsonReadable<O> : unknown)
  & (O extends Refreshable ? JsonRefreshable<O> : unknown)
  & (O extends Mutable ? JsonMutable<O> : unknown);

/**
 * Parses json items
 */
export function json$<O extends JsonOrigin>(): PipeStep<O, JsonResult<O>>;

export function json$() {
  return (origin: unknown) => {
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