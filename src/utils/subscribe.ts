import { Observer } from '../defs/index.js';
import { SubscribeCallbacks } from '../observable$.js';

// Utils
const noop = () => { /* noop */ };

/**
 * Builds an observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: [Partial<Observer<D>>] | SubscribeCallbacks<D>): Observer<D> {
  if (typeof args[0] === 'object') {
    return {
      start: args[0].start ?? noop,
      next: args[0].next ?? noop,
      error: args[0].error ?? noop,
      complete: args[0].complete ?? noop,
    };
  }

  return {
    next: args[0],
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  };
}
