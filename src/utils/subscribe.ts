import { observer$ } from '../rx/observer$.js';
import type { SubscribeArgs } from '../rx/types/observable.js';
import type { Observer } from '../rx/types/observer.js';
import { noop } from './fn.js';

/**
 * Builds a strict observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: SubscribeArgs<D>): Observer<D> {
  if (typeof args[0] === 'function' || !args[0]) {
    return {
      start: noop,
      next: args[0] ?? noop,
      error: args[1] ?? noop,
      complete: args[2] ?? noop,
    };
  }

  return observer$(args[0]);
}
