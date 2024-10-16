import { Repeater } from '@repeaterjs/repeater';
import type { AnySubscribable } from './types/inputs/Subscribable.js';
import { isSubscribableHolder } from './utils/predicates.js';

/**
 * Wraps given observable into an async iterator.
 *
 * @since 1.0.0
 */
export function iterate$<D>(observable: AnySubscribable<D>): Repeater<D> {
  const obs = isSubscribableHolder(observable) ? observable[Symbol.observable ?? '@@observable']() : observable;

  return new Repeater<D>(async (push, stop) => {
    const sub = obs.subscribe({
      next: (data) => void push(data),
      error: (err) => stop(err),
      complete: () => stop(),
    });

    await stop;

    sub.unsubscribe();
  });
}
