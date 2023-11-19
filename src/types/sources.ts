import { Emitter, KeyEmitter, Listenable, Observable } from '../features/index.js';
import { AnySource, KeyPart } from './common.js';
import { AssertEventMap, EventKey, PrependEventMapKeys } from './events.js';
import { MapValueIntersection } from './utils.js';

/**
 * Record mapping keys to event sources
 */
export type SourceMap = Record<KeyPart, AnySource>;

type _EmitEventRecord<K extends KeyPart, S> =
  & (S extends KeyEmitter<infer EM> ? PrependEventMapKeys<K, EM> : unknown)
  & (S extends Emitter<infer D> ? Record<K, D> : unknown);

/**
 * Builds an event map from emitted values of each sources in the given source map
 */
export type EmitEventMap<M extends SourceMap> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<M>]: _EmitEventRecord<K, M[K]>;
}>>;

/**
 * Builds an event map from emitted values of given source, mapped on given key type
 */
export type EmitEventRecord<K extends KeyPart, S extends AnySource> = EmitEventMap<Record<K, S>>;

type _ListenEventRecord<K extends KeyPart, S extends AnySource> =
  & (S extends Listenable<infer LM> ? PrependEventMapKeys<K, LM> : unknown)
  & (S extends Observable<infer D> ? Record<K, D> : unknown);

/**
 * Builds an event map from observed/listened values of each sources in the given source map
 */
export type ListenEventMap<M extends SourceMap> = AssertEventMap<MapValueIntersection<{
  [K in EventKey<M>]: _ListenEventRecord<K, M[K]>;
}>>;

/**
 * Builds an event map from observed/listened values of given source, mapped on given key type
 */
export type ListenEventRecord<K extends KeyPart, S extends AnySource> = ListenEventMap<Record<K, S>>;
