import type { AnyAwaitableIterable } from './types/inputs/MinimalIterator.js';
import type { SimpleAsyncIterator } from './types/outputs/SimpleIterator.js';
import { extractAwaitableIterator } from './utils/iterator.js';

/**
 * Wraps an awaitable iterable into an async iterator
 *
 * @since 2.5.0
 */
export function asyncIterator$<D>(base: AnyAwaitableIterable<D>): SimpleAsyncIterator<D> {
  const iterable = extractAwaitableIterator(base);
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
