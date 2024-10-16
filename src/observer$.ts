import type { PartialObserver } from './types/inputs/Observer.js';
import type { StrictObserver } from './types/outputs/StrictObserver.js';
import { noop } from './utils/fn.js';

/**
 * Utility to simplify strict observer creation
 *
 * @since 1.0.0
 * @see StrictObserver
 */
export function observer$<D>(input: PartialObserver<D>): StrictObserver<D> {
  const observer: StrictObserver<D> = {
    next: input.next?.bind(input) ?? noop,
    error: input.error?.bind(input) ?? noop,
    complete: input.complete?.bind(input) ?? noop,
  };

  if (input.start) {
    Object.assign(observer, { start: input.start.bind(input) });
  }

  return observer;
}
