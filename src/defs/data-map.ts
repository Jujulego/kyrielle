/**
 * Record mapping keys to event data types
 */
export type DataMap = Record<string, unknown>;

/**
 * Extract keys type from an event map
 */
export type DataKey<M extends DataMap> = keyof M & string;

/**
 * Extract values type from an event map
 */
export type DataValue<M extends DataMap, K extends DataKey<M> = DataKey<M>> = M[K];

/**
 * Build listener type for a given key in an event map
 */
export type DataListener<M extends DataMap, K extends DataKey<M> = DataKey<M>> = (data: M[K]) => void;

/**
 * Ensure that the given type is a data map
 */
export type AssertDataMap<M> = M extends DataMap ? M : never;
