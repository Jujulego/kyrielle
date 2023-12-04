import { Awaitable } from '../defs/index.js';

// Utils
export function isPromise<T>(obj: Awaitable<T>): obj is PromiseLike<T> {
  return typeof obj === 'object' && obj !== null && 'then' in obj;
}

export function awaitedCall<A, R>(fn: (arg: A) => PromiseLike<R>, arg: PromiseLike<A>): PromiseLike<R>;
export function awaitedCall<A, R>(fn: (arg: A) => R, arg: PromiseLike<A>): PromiseLike<R>;
export function awaitedCall<A, R>(fn: (arg: A) => PromiseLike<R>, arg: A): PromiseLike<R>;
export function awaitedCall<A, R>(fn: (arg: A) => R, arg: A): R;
export function awaitedCall<A, R>(fn: (arg: A) => Awaitable<R>, arg: Awaitable<A>): Awaitable<R>;

export function awaitedCall<A, R>(fn: (arg: A) => Awaitable<R>, arg: Awaitable<A>): Awaitable<R> {
  return isPromise(arg) ? arg.then(fn) : fn(arg);
}

export interface CachedAwaiter {
  call<R>(fn: () => PromiseLike<R>): PromiseLike<R>;
  call<R>(fn: () => R): R;
  call<R>(fn: () => Awaitable<R>): Awaitable<R>;
}

export function cachedAwaiter(): CachedAwaiter {
  let promise: PromiseLike<unknown> | null = null;

  return {
    call(fn) {
      if (promise) {
        return promise;
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
