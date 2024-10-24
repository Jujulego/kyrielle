import type { Awaitable } from '../types/utils.js';
import { isPromise } from './predicates.js';

// Utils
export function applyFn<A, R>(fn: (arg: A) => R, res: Awaitable<A>): Awaitable<R> {
  if (isPromise<A>(res)) {
    return res.then(fn);
  } else {
    return fn(res);
  }
}

export const noop = () => { /* noop */ };
