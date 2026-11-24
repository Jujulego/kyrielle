import { observer$ } from '../rx/observer$.js';
import type { SubscribeArgs } from '../rx/types/observable.js';
import type { Observer } from '../rx/types/observer.js';
import { noop } from './fn.js';
import { isPartialObserver } from './predicates.js';

/**
 * Builds a strict observer from subscribe args
 * @param args
 */
export function parseSubscribeArgs<D>(args: SubscribeArgs<D>): Observer<D> {
  if (isPartialObserver<D>(args[0])) {
    return observer$(args[0]);
  }

  return observer$({
    next: args[0] ?? noop,
    error: args[1] ?? noop,
    complete: args[2] ?? noop,
  });
}
