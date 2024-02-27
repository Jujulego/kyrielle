import { Repeater } from '@repeaterjs/repeater';

import { ObservableHolder, Subscribable } from './defs/index.js';
import { isObservableHolder } from './utils/predicates.js';

/**
 * Wraps given observable into an async iterator.
 */
export function iterate$<D>(observable: Subscribable<D> | ObservableHolder<D>): Repeater<D> {
  const obs = isObservableHolder(observable) ? observable[Symbol.observable ?? '@@observable']() : observable;

  return new Repeater<D>(async (push, stop) => {
    const sub = obs.subscribe({
      next: (data) => push(data),
      error: (err) => stop(err),
      complete: () => stop(),
    });

    await stop;

    sub.unsubscribe();
  });
}