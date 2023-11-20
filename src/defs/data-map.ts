import { Key, Listener } from './common.js';

/**
 * Record mapping keys to event data types
 */
export type DataMap = Record<Key, unknown>;

/**
 * Extract keys type from an event map
 */
export type DataKey<M extends DataMap> = keyof M & Key;

/**
 * Build listener type for a given key in an event map
 */
export type DataListener<M extends DataMap, K extends DataKey<M> = DataKey<M>> = Listener<M[K]>;

/**
 * Ensure that the given type is a data map
 */
export type AssertDataMap<M> = M extends DataMap ? M : never;
