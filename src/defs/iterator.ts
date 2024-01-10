import { Readable } from './features/index.js';

/**
 * Iterator over read values from a collection of references
 */
export interface RefIterator<R extends Readable> extends Iterator<ReturnType<R['read']>> {}

/**
 * Iterable over reference read result
 */
export interface RefIterable<R extends Readable> extends Iterable<ReturnType<R['read']>> {}

/**
 * IterableIterator over reference read result
 */
export interface RefIterableIterator<R extends Readable> extends IterableIterator<ReturnType<R['read']>> {}
