/**
 * Supported key type
 */
export type Key = string | number;

/**
 * Callback for any event emitter object
 */
export type Listener<D = unknown> = (data: D) => void;

/**
 * Unsubscribe function type
 */
export type OffFn = () => void;
