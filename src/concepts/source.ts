import { Emitter, Observable } from '../features/index.js';

/**
 * Simple data source
 */
export interface Source<D = unknown> extends Observable<D>, Emitter<D> {}
