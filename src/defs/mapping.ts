import type { Emitter, Listenable, Observer, Subscribable } from './features/index.js';
import type { MapValueIntersection } from './utils.js';

/**
 * Ensure that the given type is a data map
 */
export type AssertMapping<M> = M extends Mapping ? M : never;

/**
 * Type mapping
 */
export type Mapping = Record<string, unknown>;

/**
 * Extract keys type from a type mapping
 */
export type MappingKey<M extends Mapping> = Extract<keyof M, string>;

/**
 * Builds a mapping from input values of each sources in the given source mapping
 */
export type InputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _InputRecord<K, M[K]>;
}>>;

type _InputRecord<K extends string, O> =
  | (O extends Emitter<infer EM> ? PrependMapping<K, EM> : never)
  | (O extends Observer<infer D> ? Record<K, D> : never);

/**
 * Builds a mapping from output values of each sources in the given source mapping
 */
export type OutputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _OutputRecord<K, M[K]>;
}>>;

type _OutputRecord<K extends string, O> =
  | (O extends Listenable<infer LM> ? PrependMapping<K, LM> : never)
  | (O extends Subscribable<infer D> ? Record<K, D> : never);

/**
 * Prepends the given key part to all map's keys
 */
export type PrependMapping<P extends string, M extends Mapping> = {
  [K in MappingKey<M> as `${P}.${K}`]: M[K]
}
