/**
 * Object that can be iterated
 *
 * @since 2.0.0
 */
export interface MinimalIterator<out D = unknown, out R = unknown> {
  /**
   * Returns next item.
   *
   * @since 2.0.0
   */
  next(): MinimalIteratorResult<D, R>;
}

interface IteratorResultValue<out D> {
  readonly done?: false;
  readonly value: D;
}

interface IteratorResultDone<out R> {
  readonly done: true;
  readonly value?: R;
}

export type MinimalIteratorResult<D = unknown, R = unknown> = IteratorResultValue<D> | IteratorResultDone<R>;
export type AnyIterable<D = unknown> = Iterable<D> | MinimalIterator<D>;

type ExtractIterator<I extends AnyIterable> = I extends Iterable<unknown> ? ReturnType<I[typeof Symbol.iterator]> : I;
type ExtractIteratorYield<I extends AnyIterable> = Extract<ReturnType<ExtractIterator<I>['next']>, { done?: false }>;

export type IteratedValue<I extends AnyIterable> = ExtractIteratorYield<I>['value'];
