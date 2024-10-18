/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface Iterable<out D = unknown> {
  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(): IterableResult<D>;
}

/**
 * Object holding an {@link Iterable} feature
 *
 * @since 2.0.0
 */
export interface IterableHolder<out D = unknown> {
  [Symbol.iterator](): Iterable<D>;
}

export type AnyIterable<D = unknown> = Iterable<D> | IterableHolder<D>;

export interface IterableResultValue<out D> {
  readonly value: D;
  readonly done?: false;
}

export interface IterableResultDone {
  readonly done: true;
}

export type IterableResult<D> = IterableResultValue<D> | IterableResultDone;