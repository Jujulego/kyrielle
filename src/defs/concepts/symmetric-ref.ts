import { AsyncMutableRef, MutableRef, SyncMutableRef } from './mutable-ref.js';

/**
 * A mutable ref where its mutate accept an argument with the same type as its value.
 */
export interface SymmetricRef<in out D = unknown> extends MutableRef<D, D> {}

/**
 * A mutable ref where its mutate accept an argument with the same type as its value.
 */
export interface SyncSymmetricRef<in out D = unknown> extends SyncMutableRef<D, D> {}

/**
 * A mutable ref where its mutate accept an argument with the same type as its value.
 */
export interface AsyncSymmetricRef<in out D = unknown> extends AsyncMutableRef<D, D> {}