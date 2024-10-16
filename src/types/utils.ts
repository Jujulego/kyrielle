/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Defines an assertion function
 */
export type AssertionFn<in D, out R extends D> = (data: D) => asserts data is R;

/**
 * Defines a predicate function
 */
export type PredicateFn<in D, out R extends D> = (data: D) => data is R;
