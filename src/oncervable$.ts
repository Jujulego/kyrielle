import { observable$ } from './observable$.js';
import type { Oncervable } from './types/outputs/Oncervable.js';
import type { Awaitable } from './types/utils.js';

/**
 * Creates an observable using fn's logic. This observable can only emit once can be awaited.
 *
 * @since 2.6.0
 */
export function oncervable$<D>(subscriber: (signal: AbortSignal) => Promise<D>): Oncervable<D> {
  const obs = observable$<D>((observer, signal) => {
    subscriber(signal)
      .then(observer.next)
      .catch(observer.error)
      .finally(observer.complete);
  });

  return {
    ...obs,
    then<RF = D, RR = never>(onFulfill?: FulfilledFn<D, RF> | null, onReject?: RejectedFn<RR> | null): Promise<RF | RR> {
      return new Promise<D>((resolve, reject) => {
        obs.subscribe({ next: resolve, error: reject });
      })
        .then(onFulfill, onReject);
    }
  };
}

// Types
export type FulfilledFn<in D, out R> = (data: D) => Awaitable<R>;
export type RejectedFn<out R> = (reason: unknown) => Awaitable<R>;
