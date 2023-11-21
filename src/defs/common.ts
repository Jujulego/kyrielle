/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Callback for any event emitter object
 */
export type Listener<D = unknown> = (data: D) => void;

/**
 * Unsubscribe function type
 */
export type OffFn = () => void;
