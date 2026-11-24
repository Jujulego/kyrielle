import type { PartialObserver } from './features/minimal-observer.js';
import type { Observer } from './rx/types/observer.js';
import { noop } from './utils/fn.js';

/**
 * Utility to simplify strict observer creation
 *
 * @since 1.0.0
 * @see Observer
 */
export function observer$<D>(input: PartialObserver<D>): Observer<D> {
  const observer: Observer<D> = {
    next: input.next?.bind(input) ?? noop,
    error: input.error?.bind(input) ?? noop,
    complete: input.complete?.bind(input) ?? noop,
  };

  if (input.start) {
    Object.assign(observer, { start: input.start.bind(input) });
  }

  return observer;
}
