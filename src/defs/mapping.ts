import { Emitter, Listenable, Observer, Subscribable } from './features/index.js';
import { MapValueIntersection } from './utils.js';

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
export type MappingKey<M extends Mapping> = keyof M & string;

/**
 * Builds a mapping from input values of each sources in the given source mapping
 */
export type InputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _InputRecord<K, M[K]>;
}>>;

type _InputRecord<K extends string, O> =
  & (O extends Emitter<infer EM> ? PrependMapping<K, EM> : unknown)
  & (O extends Pick<Observer<infer D>, 'next'> ? Record<K, D> : unknown);

/**
 * Builds a mapping from output values of each sources in the given source mapping
 */
export type OutputMapping<M extends Mapping> = AssertMapping<MapValueIntersection<{
  [K in MappingKey<M>]: _OutputDataRecord<K, M[K]>;
}>>;

type _OutputDataRecord<K extends string, O> =
  & (O extends Listenable<infer LM> ? PrependMapping<K, LM> : unknown)
  & (O extends Subscribable<infer D> ? Record<K, D> : unknown);

/**
 * Builds a mapping from output value of given source, mapped to given key type
 */
export type OutputRecord<K extends string, O> = OutputMapping<Record<K, O>>;

/**
 * Prepends the given key part to all map's keys
 */
export type PrependMapping<P extends string, M extends Mapping> = {
  [K in MappingKey<M> as `${P}.${K}`]: M[K]
}