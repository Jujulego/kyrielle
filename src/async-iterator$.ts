import type { AnyAsyncIterable } from './types/inputs/MinimalIterator.js';
import type { SimpleAsyncIterator } from './types/outputs/SimpleIterator.js';
import { extractAsyncIterator } from './utils/iterator.js';

/**
 * Wraps an async iterable into an async iterator
 *
 * @since 2.5.0
 */
export function asyncIterator$<D>(base: AnyAsyncIterable<D>): SimpleAsyncIterator<D> {
  const iterable = extractAsyncIterator(base);
  const iterator = {
    [Symbol.asyncIterator]: () => iterator,
    next: async () => {
      const { done, value } = await iterable.next();

      if (done) {
        return { done: true } as const;
      } else {
        return { done: false, value } as const;
      }
    },
  };

  return iterator;
}
