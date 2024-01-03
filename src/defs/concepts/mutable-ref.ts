import { AsyncRef, CopyRefSynchronicity, Ref, SyncRef } from './ref.js';
import { AsyncMutable, CopyMutableSynchronicity, Mutable, SyncMutable } from '../features/mutable.js';

/**
 * Mutable reference
 */
export interface MutableRef<in out D = unknown, in A = D> extends Ref<D>, Mutable<D, A> {}

/**
 * Mutable synchronous reference
 */
export interface SyncMutableRef<in out D = unknown, in A = D> extends SyncRef<D>, SyncMutable<D, A> {}

/**
 * Mutable asynchronous reference
 */
export interface AsyncMutableRef<in out D = unknown, in A = D> extends AsyncRef<D>, AsyncMutable<D, A> {}

/**
 * Build a Mutable type with the same synchronicity and the given value types
 */
export type CopyMutableRefSynchronicity<R extends MutableRef, D, A> = CopyRefSynchronicity<R, D> & CopyMutableSynchronicity<R, D, A>;
