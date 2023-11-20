import { Key } from './common.js';

/**
 * Transforms a union into an intersection:
 * UnionToIntersection<'a' | 'b'> => 'a' & 'b'
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

/**
 * Build type as intersection of all map's value types
 * MapValueIntersection<{ a: 'a', b: 'b' }> => 'a' & 'b'
 */
export type MapValueIntersection<M> = UnionToIntersection<M[keyof M]>;

/**
 * Prepends the given key part to all map's keys
 */
export type PrependMapKeys<P extends Key, M extends Record<Key, unknown>> = {
  [MK in keyof M & Key as `${P}.${MK}`]: M[MK]
}
