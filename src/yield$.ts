import type { Mutable, Observable, Deferrable } from './defs/index.js';
import type { MapOrigin, MapOriginValue } from './map$.js';
import { observable$, type SubscriberObserver } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { isMutable, isPromise, isDeferrable, isSubscribable } from './utils/predicates.js';

// Types
export type YieldOrigin<D = unknown> = MapOrigin<D>;

export type YieldResult<O extends YieldOrigin> =
  & Pick<O, Extract<keyof O, keyof Deferrable | keyof Mutable>>
  & Observable<Awaited<MapOriginValue<O>>>;

/**
 * Adds an observable feature to a resource. The added observable will emit each result from defer & mutate.
 */
export function yield$<O extends YieldOrigin>(): PipeStep<O, YieldResult<O>> {
  return (origin: YieldOrigin) => {
    const builder = resource$();
    let observer: SubscriberObserver;

    // Utils
    function emitResult(result: unknown) {
      if (isPromise(result)) {
        void result.then((value) => observer?.next(value));
      } else {
        observer?.next(result);
      }
    }

    // Add defer
    if (isDeferrable(origin)) {
      builder.add({
        defer(signal) {
          const result = origin.defer(signal);
          emitResult(result);

          return result;
        }
      });
    }

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
    builder.add(observable$((obs) => {
      observer = obs;

      if (isSubscribable(origin)) {
        origin.subscribe(obs);
      }
    }));

    return builder.build() as YieldResult<O>;
  };
}
