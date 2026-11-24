import type { MinimalObserver } from '../features/minimal-observer.js';
import type { Observer } from './types/observer.js';
import { noop } from '../utils/fn.js';

/**
 * Utility to simplify strict observer creation
 *
 * @since 1.0.0
 * @see Observer
 */
export function observer$<D>(input: MinimalObserver<D>): Observer<D> {
  return {
    start: input.start?.bind(input) ?? noop,
    next: input.next.bind(input),
    error: input.error?.bind(input) ?? noop,
    complete: input.complete?.bind(input) ?? noop,
  };
}
