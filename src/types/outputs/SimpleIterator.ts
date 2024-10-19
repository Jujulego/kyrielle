/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface SimpleIterator<out D> {
  [Symbol.iterator](): SimpleIterator<D>;

  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(this: void): SimpleIterableResult<D>;
}

interface IterableResultValue<out D> {
  readonly value: D;
  readonly done?: false;
}

interface IterableResultDone {
  readonly done: true;
}

export type SimpleIterableResult<D> = IterableResultValue<D> | IterableResultDone;