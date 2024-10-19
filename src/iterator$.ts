import type { AnyIterable } from './types/inputs/Iterable.js';
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
    next: iterable.next.bind(iterable),
  } as SimpleIterator<D>;

  iterator[Symbol.iterator] = () => iterator;

  return iterator;
}