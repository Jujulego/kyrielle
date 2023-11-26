import { Source } from './source.js';
import { AsyncReadable, MapReadValue, Readable, SyncReadable } from '../features/readable.js';

/**
 * Readonly reference
 */
export interface Ref<in out D = unknown> extends Source<D>, Readable<D> {}

/**
 * Readonly synchronous reference
 */
export interface SyncRef<in out D = unknown> extends Source<D>, SyncReadable<D> {}

/**
 * Readonly asynchronous reference
 */
export interface AsyncRef<in out D = unknown> extends Source<D>, AsyncReadable<D> {}

/**
 * Build a Ref type with the same synchronicity and the given value type
 */
export type MapRefValue<R extends Readable, D> = Source<D> & MapReadValue<R, D>;
