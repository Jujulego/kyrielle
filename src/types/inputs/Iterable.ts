/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface MinimalIterator<D> {
  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(): MinimalIteratorResult<D>;
}

interface IteratorResultValue<out D> {
  readonly done?: false;
  readonly value: D;
}

interface IteratorResultDone {
  readonly done: true;
  readonly value?: undefined;
}

export type MinimalIteratorResult<D> = IteratorResultValue<D> | IteratorResultDone;
export type AnyIterable<D = unknown> = Iterable<D> | MinimalIterator<D>;
