/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Callback for handling output data
 */
export type Listener<D = unknown> = (data: D) => void;

/**
 * Unsubscribe function type
 */
export type OffFn = () => void;
