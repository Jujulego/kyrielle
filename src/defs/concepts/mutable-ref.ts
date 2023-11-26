import { AsyncRef, MapRefValue, Ref, SyncRef } from './ref.js';
import { AsyncMutable, MapMutateArg, Mutable, SyncMutable } from '../features/mutable.js';

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
 * A mutable ref where its mutate accept an argument with the same type as its value.
 */
export type SymmetricRef<D = unknown> = MutableRef<D, D>;

/**
 * Build a Mutable type with the same synchronicity and the given value types
 */
export type MapMutableValue<R extends MutableRef, D, A> = MapRefValue<R, D> & MapMutateArg<R, D, A>;
