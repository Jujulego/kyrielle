/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Defines a predicate function
 */
export type PredicateFn<in D, out R extends D> = (data: D) => data is R;
