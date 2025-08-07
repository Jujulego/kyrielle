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

/**
 * Object that can be iterated asynchronously
 *
 * @since 2.5.0
 */
export interface MinimalAsyncIterator<out D = unknown, out R = unknown> {
  /**
   * Returns next item.
   *
   * @since 2.5.0
   */
  next(): Promise<MinimalIteratorResult<D, R>>;
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
export type AnyAsyncIterable<D = unknown> = AsyncIterable<D> | MinimalAsyncIterator<D>;

/**
 * Extracts iterator yielded value type from an iterable
 *
 * @since 2.0.0
 */
export type IteratedValue<I extends AnyIterable> = ExtractIteratorYield<I>['value'];

type ExtractIteratorYield<I extends AnyIterable> = Extract<ReturnType<ExtractIterator<I>['next']>, { done?: false }>;
type ExtractIterator<I extends AnyIterable> = I extends Iterable<unknown> ? ReturnType<I[typeof Symbol.iterator]> : I;

/**
 * Extracts iterator yielded value type from an async iterable
 *
 * @since 2.5.0
 */
export type AsyncIteratedValue<I extends AnyAsyncIterable> = ExtractAsyncIteratorYield<I>['value'];

type ExtractAsyncIteratorYield<I extends AnyAsyncIterable> = Extract<Awaited<ReturnType<ExtractAsyncIterator<I>['next']>>, { done?: false }>;
type ExtractAsyncIterator<I extends AnyAsyncIterable> = I extends AsyncIterable<unknown> ? ReturnType<I[typeof Symbol.asyncIterator]> : I;

