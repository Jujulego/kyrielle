import type { AnyIterable } from './types/inputs/MinimalIterator.js';
import type { SimpleIterator } from './types/outputs/SimpleIterator.js';
import { extractIterator } from './utils/iterator.js';

/**
 * Wraps an iterable into an iterator
 * @param base
 *
 * @since 2.0.0
 */
export function iterator$<D>(base: AnyIterable<D>): SimpleIterator<D> {
  const iterable = extractIterator(base);
  const iterator = {
    [Symbol.iterator]: () => iterator,
    next: () => {
      const { done, value } = iterable.next();

      if (done) {
        return { done: true } as const;
      } else {
        return { done: false, value } as const;
      }
    },
  };

  return iterator;
}
