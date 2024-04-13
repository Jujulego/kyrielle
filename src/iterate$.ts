import { Repeater } from '@repeaterjs/repeater';

import { SubscribableHolder, Subscribable } from './defs/index.js';
import { isSubscribableHolder } from './utils/predicates.js';

/**
 * Wraps given observable into an async iterator.
 */
export function iterate$<D>(observable: Subscribable<D> | SubscribableHolder<D>): Repeater<D> {
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
