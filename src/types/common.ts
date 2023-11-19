/**
 * Supported key type
 */
export type Key = string;

/**
 * Key part. A key can be composed of dot separated key parts
 */
export type KeyPart = string | number;

/**
 * Callback for any event emitter object
 */
export type Listener<D = unknown> = (data: D) => void;

/**
 * Unsubscribe function type
 */
export type OffFn = () => void;
