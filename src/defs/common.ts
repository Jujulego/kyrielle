/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

export type AsAwaitableAs<B extends Awaitable<unknown>, T> =
  | (B extends Awaited<B> ? T : never)
  | (B extends PromiseLike<unknown> ? PromiseLike<T> : never);

/**
 * Callback for handling output data
 */
export type Listener<D = unknown> = (data: D) => void;

/**
 * Unsubscribe function type
 */
export type OffFn = () => void;
