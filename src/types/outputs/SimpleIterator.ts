import type { MinimalIterator, MinimalIteratorResult } from '../inputs/MinimalIterator.js';

/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface SimpleIterator<out D = unknown> extends MinimalIterator<D, never> {
  [Symbol.iterator](): SimpleIterator<D>;

  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(this: void): MinimalIteratorResult<D, never>;
}
