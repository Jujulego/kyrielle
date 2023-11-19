import { Key, KeyPart, Listener } from './common.js';

/**
 * Record mapping keys to event data types
 */
export type EventMap = Record<Key, unknown>;

/**
 * Extract keys type from an event map
 */
export type EventKey<M extends EventMap> = keyof M & Key;

/**
 * Extract data types from an event map with matching key
 */
export type EventData<M extends EventMap, K extends EventKey<M> = EventKey<M>> = M[K];

/**
 * Build listener type for a given key in an event map
 */
export type EventListener<M extends EventMap, K extends EventKey<M> = EventKey<M>> = Listener<EventData<M, K>>;

/**
 * Ensure that the given type is an event map
 */
export type AssertEventMap<M> = M extends EventMap ? M : never;

/**
 * Prepends the given key part to all map's keys
 */
export type PrependEventMapKeys<P extends KeyPart, M extends EventMap> = {
  [MK in EventKey<M> as `${P}.${MK}`]: M[MK]
}
