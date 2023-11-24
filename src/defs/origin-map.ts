import { AssertDataMap, DataKey } from './data-map.js';
import { Receiver, Emitter, Listenable, Observable } from './features/index.js';
import { MapValueIntersection, PrependMapKeys } from './utils.js';

/**
 * Matches any kind of data origin
 */
export type AnyOrigin = Receiver | Emitter | Observable | Listenable;

/**
 * Record mapping keys to event sources
 */
export type OriginMap = Record<string, AnyOrigin>;

type _InputValueRecord<K extends string, O> =
  & (O extends Emitter<infer EM> ? PrependMapKeys<K, EM> : unknown)
  & (O extends Receiver<infer D> ? Record<K, D> : unknown);

/**
 * Builds a data map from input values of each sources in the given source map
 */
export type InputDataMap<M extends OriginMap> = AssertDataMap<MapValueIntersection<{
  [K in DataKey<M>]: _InputValueRecord<K, M[K]>;
}>>;

/**
 * Builds a data map from input values of given source, mapped on given key type
 */
export type InputDataRecord<K extends string, O extends AnyOrigin> = InputDataMap<Record<K, O>>;

type _OutputDataRecord<K extends string, O extends AnyOrigin> =
  & (O extends Listenable<infer LM> ? PrependMapKeys<K, LM> : unknown)
  & (O extends Observable<infer D> ? Record<K, D> : unknown);

/**
 * Builds a data map from output values of each sources in the given source map
 */
export type OutputDataMap<M extends OriginMap> = AssertDataMap<MapValueIntersection<{
  [K in DataKey<M>]: _OutputDataRecord<K, M[K]>;
}>>;

/**
 * Builds a data map from output values of given source, mapped on given key type
 */
export type OutputDataRecord<K extends string, O extends AnyOrigin> = OutputDataMap<Record<K, O>>;
