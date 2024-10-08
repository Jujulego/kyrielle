import type { Awaitable } from '../defs/index.js';
import { isPromise } from './predicates.js';

// Utils
export function applyFn<A, R>(fn: (arg: A) => R, res: Awaitable<A>): Awaitable<R> {
  if (isPromise<A>(res)) {
    return res.then(fn);
  } else {
    return fn(res);
  }
}