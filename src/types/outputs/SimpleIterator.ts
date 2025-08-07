import type { MinimalAsyncIterator, MinimalIterator } from '../inputs/MinimalIterator.js';

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
  next(this: void): SimpleIteratorResult<D>;
}

/**
 * Object that can be iterated asynchronously
 *
 * @since 2.5.0
 */
export interface SimpleAsyncIterator<out D = unknown> extends MinimalAsyncIterator<D, never> {
  [Symbol.asyncIterator](): SimpleAsyncIterator<D>;

  /**
   * Returns next item.
   *
   * @since 2.5.0
   */
  next(this: void): Promise<SimpleIteratorResult<D>>;
}

interface IteratorResultValue<out D> {
  readonly done: false;
  readonly value: D;
}

interface IteratorResultDone {
  readonly done: true;
  readonly value?: never;
}

export type SimpleIteratorResult<D = unknown> = IteratorResultValue<D> | IteratorResultDone;