import type { Mutable, Observable, Readable } from './defs/index.js';
import type { EachOrigin, EachOriginValue } from './each$.js';
import { observable$, type SubscriberObserver } from './observable$.js';
import type { PipeStep } from './pipe$.js';
import { resource$ } from './resource$.js';
import { isMutable, isPromise, isReadable, isSubscribable } from './utils/predicates.js';

// Types
export type YieldOrigin<D = unknown> = EachOrigin<D>;

export type YieldResult<O extends YieldOrigin> =
  & Pick<O, Extract<keyof O, keyof Readable | keyof Mutable>>
  & Observable<Awaited<EachOriginValue<O>>>;

/**
 * Adds an observable feature to a resource. The added observable will emit each result from read & mutate.
 */
export function yield$<O extends YieldOrigin>(): PipeStep<O, YieldResult<O>> {
  return (origin: YieldOrigin) => {
    const builder = resource$();
    let observer: SubscriberObserver;

    // Utils
    function emitResult(result: unknown) {
      if (isPromise(result)) {
        result.then((value) => observer?.next(value));
      } else {
        observer?.next(result);
      }
    }

    // Add read
    if (isReadable(origin)) {
      builder.add({
        read(signal) {
          const result = origin.read(signal);
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