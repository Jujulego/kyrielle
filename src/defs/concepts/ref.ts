import { Source } from './source.js';
import { AsyncReadable, CopyReadableSynchronicity, Readable, SyncReadable } from '../features/readable.js';

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
export type CopyRefSynchronicity<R extends Readable, D> = Source<D> & CopyReadableSynchronicity<R, D>;
