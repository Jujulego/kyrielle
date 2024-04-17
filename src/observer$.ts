import { Observer, type PartialObserver } from './defs/index.js';
import { isObserver } from './utils/predicates.js';

// Utils
const noop = () => { /* noop */ };

/**
 * Utility to simplify observer creation
 */
export function observer$<D>(input: PartialObserver<D>): Observer<D> {
  if (isObserver(input)) {
    return input;
  }

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
