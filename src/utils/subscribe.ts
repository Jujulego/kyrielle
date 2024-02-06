import { Observer } from '../defs/index.js';
import { SubscribeCallbacks } from '../observable$.js';

// Utils
const noop = () => { /* noop */ };

/**
 * Builds an observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: [Observer<D>] | SubscribeCallbacks<D>): Observer<D> {
  if (typeof args[0] === 'object') {
    return args[0];
  }

  return {
    next: args[0],
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  };
}
