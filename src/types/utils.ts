/**
 * Value that can be awaited
 */
export type Awaitable<T> = T | PromiseLike<T>;

/**
 * Defines an assertion function
 */
export type AssertionFn<in D, out R extends D> = (data: D) => asserts data is R;

/**
 * Build type as intersection of all map's value types
 * MapValueIntersection<{ a: 'a', b: 'b' }> => 'a' & 'b'
 */
export type MapValueIntersection<M> = UnionToIntersection<M[keyof M]>;

export interface NonNullObject extends Record<number | string | symbol, unknown> {}

/**
 * Defines a predicate function
 */
export type PredicateFn<in D, out R extends D> = (data: D) => data is R;

/**
 * Transforms a union into an intersection:
 * UnionToIntersection<'a' | 'b'> => 'a' & 'b'
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
