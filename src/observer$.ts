import { Observer } from './defs/index.js';

// Types
export interface ObserverInput<in D> extends Pick<Observer<D>, 'next'>, Partial<Omit<Observer<D>, 'next'>> {}

// Utils
const noop = () => { /* noop */ };

/**
 * Utility to simplify observer creation
 */
export function observer$<D>(input: ObserverInput<D>): Observer<D> {
  const observer: Observer<D> = {
    next: input.next,
    error: input.error ?? noop,
    complete: input.complete ?? noop,
  };

  if (input.start) {
    Object.assign(observer, { start: input.start });
  }

  return observer;
}
