import { observable$ } from './observable$.js';
import type { Oncervable } from './types/outputs/Oncervable.js';
import type { Awaitable } from './types/utils.js';
import { isPromise } from './utils/predicates.js';

/**
 * Creates an observable using fn's logic. This observable can only emit once can be awaited.
 *
 * @since 2.6.0
 */
export function oncervable$<D>(fn: OncervableFn<D>): Oncervable<D> {
  const obs = observable$<D>((observer, signal) => {
    const arg: OncervableArg<D> = {
      resolve(result: D) {
        observer.next(result);
        observer.complete();
      },
      reject: (err: unknown) => {
        observer.error(err);
        observer.complete();
      },
      signal,
    };

    try {
      const res = fn(arg);

      if (isPromise<D>(res)) {
        res.then(arg.resolve, arg.reject);
      }
    } catch (err) {
      arg.reject(err);
    }
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
export interface OncervableArg<D> {
  readonly resolve: ResolveFn<D>;
  readonly reject: RejectFn;
  readonly signal: AbortSignal;
}

export type OncervableFn<D> = (arg: OncervableArg<D>) => Promise<D> | void;

export type ResolveFn<in D> = (result: D) => void;
export type RejectFn = (reason: unknown) => void;

export type FulfilledFn<in D, out R> = (result: D) => Awaitable<R>;
export type RejectedFn<out R> = (reason: unknown) => Awaitable<R>;
