import { Observer, SubscribeCallbacks } from '../defs/index.js';
import { observer$ } from '../observer$.js';
import { isPartialObserver } from './predicates.js';

// Utils
const noop = () => { /* noop */ };

/**
 * Builds an observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: [Partial<Observer<D>>] | SubscribeCallbacks<D>): Observer<D> {
  if (isPartialObserver(args[0])) {
    return observer$(args[0]);
  }

  return {
    next: args[0],
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  };
}
