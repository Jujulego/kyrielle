import { AsAwaitableAs, Awaitable, Mutable, Observable, ObservedValue, Readable } from './defs/index.js';
import { observable$ } from './observable$.js';
import { PipeStep } from './pipe$.js';
import { resourceBuilder$ } from './resource-builder$.js';
import { isPromise } from './utils/promise.js';

// Types
export type EachOrigin<D = unknown> = Observable<D>
  & Partial<
    & Readable<Awaitable<D>>
    & Mutable<any, Awaitable<D>> // eslint-disable-line @typescript-eslint/no-explicit-any
  >;

export type EachResult<O extends Observable, R> =
  & Observable<R>
  & (O extends Readable<infer RD> ? Readable<AsAwaitableAs<RD, R>> : unknown)
  & (O extends Mutable<infer A, infer RD> ? Mutable<A, AsAwaitableAs<RD, R>> : unknown);

/**
 * Applies given function on every emitted values,
 * including values returned by read and mutate if present.
 */
export function each$<O extends Observable, R>(fn: (arg: ObservedValue<O>) => R): PipeStep<O, EachResult<O, R>>;

export function each$<A, R>(fn: (arg: A) => R): PipeStep<EachOrigin<A>, EachOrigin<R>> {
  return (origin) => {
    const builder = resourceBuilder$<R>()
      .add(observable$<R>((observer, signal) => {
        const subscription = origin.subscribe({
          next(val) {
            observer.next(fn(val));
          },
          error: observer.error,
          complete() {
            signal.removeEventListener('abort', subscription.unsubscribe);
            observer.complete();
          }
        });

        signal.addEventListener('abort', subscription.unsubscribe, { once: true });
      })
    );

    if ('read' in origin) {
      builder.add({
        read(signal) {
          const res = origin.read!(signal);

          if (isPromise(res)) {
            return res.then(fn);
          } else {
            return fn(res);
          }
        }
      });
    }

    if ('mutate' in origin) {
      builder.add({
        mutate(arg, signal) {
          const res = origin.mutate!(arg, signal);

          if (isPromise(res)) {
            return res.then(fn);
          } else {
            return fn(res);
          }
        }
      });
    }

    return builder.build();
  };
}
