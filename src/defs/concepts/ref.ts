import { Source } from './source.js';
import { AsyncReadable, Readable } from '../features/readable.js';

/**
 * Readonly reference
 */
export interface Ref<in out D = any> extends Source<Awaited<D>>, Readable<D> {} // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Readonly asynchronous reference
 */
export interface AsyncRef<in out D = unknown> extends Source<D>, AsyncReadable<D> {}
