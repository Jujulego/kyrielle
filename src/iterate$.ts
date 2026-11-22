import { Repeater } from '@repeaterjs/repeater';
import type { AnySubscribable } from './features/subscribable.js';
import { toSubscribable$ } from './rx/to-subscribable$.js';

/**
 * Wraps given observable into an async iterator.
 *
 * @since 1.0.0
 */
export function iterate$<D>(observable: AnySubscribable<D>): Repeater<D> {
  return new Repeater<D>(async (push, stop) => {
    const sub = toSubscribable$(observable).subscribe({
      next: (data) => void push(data),
      error: (err) => stop(err),
      complete: () => stop(),
    });

    await stop;

    sub.unsubscribe();
  });
}
