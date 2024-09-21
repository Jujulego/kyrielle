import { Observer, SubscribeCallbacks } from '../defs/index.js';
import { observer$ } from '../observer$.js';
import { isPartialObserver } from './predicates.js';

// Utils
const noop = () => { /* noop */ };

// Types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SubscribeArgs<D = any> = [] | [Partial<Observer<D>>] | SubscribeCallbacks<D>;

/**
 * Builds an observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: SubscribeArgs<D>): Observer<D> {
  if (isPartialObserver(args[0])) {
    return observer$(args[0]);
  }

  return {
    next: args[0] ?? noop,
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  };
}
