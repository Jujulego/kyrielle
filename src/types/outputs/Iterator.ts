import type { Iterable, IterableResult } from '../inputs/Iterable.js';

/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface Iterator<out D> extends Iterable<D> {
  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(this: void): IterableResult<D>;
}
