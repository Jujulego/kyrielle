import { Observer } from './defs/index.js';

// Utils
const noop = () => { /* noop */ };

/**
 * Utility to simplify observer creation
 */
export function observer$<D>(input: Partial<Observer<D>>): Observer<D> {
  const observer: Observer<D> = {
    next: input.next ?? noop,
    error: input.error ?? noop,
    complete: input.complete ?? noop,
  };

  if (input.start) {
    Object.assign(observer, { start: input.start });
  }

  return observer;
}
