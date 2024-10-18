import { observer$ } from '../observer$.js';
import type { SubscribeArgs } from '../types/outputs/Observable.js';
import type { StrictObserver } from '../types/outputs/StrictObserver.js';
import { noop } from './fn.js';
import { isPartialObserver } from './predicates.js';

/**
 * Builds a strict observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: SubscribeArgs<D>): StrictObserver<D> {
  if (isPartialObserver<D>(args[0])) {
    return observer$(args[0]);
  }

  return {
    next: args[0] ?? noop,
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  };
}
