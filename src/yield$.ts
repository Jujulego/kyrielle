import type { Mutable, Observable, Readable, ReadValue, Subscribable } from './defs/index.js';
import { off$ } from './off$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { source$ } from './source$.js';
import { isMutable, isPromise, isSubscribable } from './utils/predicates.js';

// Types
export type YieldOrigin<D = unknown> = Readable<D>
  & Partial<Mutable<any, D>> // eslint-disable-line @typescript-eslint/no-explicit-any
  & Partial<Subscribable<D>>;

export type YieldResult<O extends YieldOrigin> = O & Observable<Awaited<ReadValue<O>>>;

/**
 * Adds an observable feature to a resource
 */
export function yield$<O extends YieldOrigin>(): PipeStep<O, YieldResult<O>> {
  return (origin: YieldOrigin) => {
    const builder = resource$();
    const source = source$();

    // Utils
    function emitResult(result: unknown) {
      if (isPromise(result)) {
        result.then((value) => source.next(value));
      } else {
        source.next(result);
      }
    }

    // Add read
    builder.add({
      read(signal) {
        const result = origin.read(signal);
        emitResult(result);

        return result;
      }
    });

    // Add mutable
    if (isMutable(origin)) {
      builder.add({
        mutate(arg, signal) {
          const result = origin.mutate(arg, signal);
          emitResult(result);

          return result;
        }
      });
    }

    // Add observable
    if (isSubscribable(origin)) {
      builder.add({
        subscribe: (...args) => off$(
          origin.subscribe(...args),
          source.subscribe(...args),
        )
      });
    } else {
      builder.add({ subscribe: source.subscribe });
    }

    return builder.build() as YieldResult<O>;
  };
}