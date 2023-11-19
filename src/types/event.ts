import { Key, Listener } from './common.js';

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
