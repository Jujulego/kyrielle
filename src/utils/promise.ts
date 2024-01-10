import { Awaitable } from '../defs/index.js';

// Utils
export function isPromise<T>(obj: Awaitable<T>): obj is PromiseLike<T> {
  return typeof obj === 'object' && obj !== null && 'then' in obj;
}

export function awaitedChain<A, R>(arg: A, fn: (arg: Awaited<A>) => Awaitable<R>): Awaitable<R>;
export function awaitedChain<A, R>(arg: Awaitable<A>, fn: (arg: A) => Awaitable<R>): Awaitable<R> {
  return isPromise(arg) ? arg.then(fn) : fn(arg);
}

export interface DedupeAwaiter<R> {
  call(fn: () => R, signal?: AbortSignal): R;
}

export function dedupeAwaiter<R>(): DedupeAwaiter<R> {
  let promise: PromiseLike<unknown> | null = null;

  return {
    call(fn: () => R, signal?: AbortSignal): R {
      if (promise) {
        return new Promise((resolve, reject) => {
          if (signal?.aborted) {
            reject(signal.reason);
          } else {
            promise!.then(resolve, reject);
            signal?.addEventListener('abort', () => reject(signal.reason));
          }
        }) as R;
      }

      const res = fn();

      if (isPromise(res)) {
        promise = res.then((value) => {
          promise = null;
          return value;
        });
      }

      return res;
    }
  };
}
