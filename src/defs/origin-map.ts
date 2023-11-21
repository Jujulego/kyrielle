import { AssertDataMap, DataKey } from './data-map.js';
import { Emitter, KeyEmitter, Listenable, Observable } from './features/index.js';
import { MapValueIntersection, PrependMapKeys } from './utils.js';

/**
 * Matches any kind of data origin
 */
export type AnyOrigin = Emitter | KeyEmitter | Observable | Listenable;

/**
 * Record mapping keys to event sources
 */
export type OriginMap = Record<string, AnyOrigin>;

type _EmittedValueRecord<K extends string, O> =
  & (O extends KeyEmitter<infer EM> ? PrependMapKeys<K, EM> : unknown)
  & (O extends Emitter<infer D> ? Record<K, D> : unknown);

/**
 * Builds a data map from emitted values of each sources in the given source map
 */
export type EmittedDataMap<M extends OriginMap> = AssertDataMap<MapValueIntersection<{
  [K in DataKey<M>]: _EmittedValueRecord<K, M[K]>;
}>>;

/**
 * Builds a data map from emitted values of given source, mapped on given key type
 */
export type EmittedDataRecord<K extends string, O extends AnyOrigin> = EmittedDataMap<Record<K, O>>;

type _ListenedDataRecord<K extends string, O extends AnyOrigin> =
  & (O extends Listenable<infer LM> ? PrependMapKeys<K, LM> : unknown)
  & (O extends Observable<infer D> ? Record<K, D> : unknown);

/**
 * Builds an event map from observed/listened values of each sources in the given source map
 */
export type ListenedDataMap<M extends OriginMap> = AssertDataMap<MapValueIntersection<{
  [K in DataKey<M>]: _ListenedDataRecord<K, M[K]>;
}>>;

/**
 * Builds an event map from observed/listened values of given source, mapped on given key type
 */
export type ListenedDataRecord<K extends string, O extends AnyOrigin> = ListenedDataMap<Record<K, O>>;
