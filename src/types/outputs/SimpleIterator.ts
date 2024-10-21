import type { MinimalIterator, MinimalIteratorResult } from '../inputs/Iterable.js';

/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface SimpleIterator<out D> extends MinimalIterator<D> {
  [Symbol.iterator](): SimpleIterator<D>;

  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(this: void): MinimalIteratorResult<D>;
}
