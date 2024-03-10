/**
 * Transforms a union into an intersection:
 * UnionToIntersection<'a' | 'b'> => 'a' & 'b'
 */
export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Build type as intersection of all map's value types
 * MapValueIntersection<{ a: 'a', b: 'b' }> => 'a' & 'b'
 */
export type MapValueIntersection<M> = UnionToIntersection<M[keyof M]>;

/**
 * Defines an assertion function
 */
export type AssertionFn<in D, out R extends D> = (data: D) => asserts data is R;

/**
 * Defines a predicate function
 */
export type PredicateFn<in D, out R extends D> = (data: D) => data is R;
