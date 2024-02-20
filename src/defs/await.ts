/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

export type AsAwaitableAs<B extends Awaitable<unknown>, T> = (B extends PromiseLike<unknown> ? PromiseLike<T> : T);
