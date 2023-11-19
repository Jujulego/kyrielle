import { Emitter } from './emitter.js';
import { Observable } from './observable.js';

/**
 * Simple data source
 */
export interface Source<D = unknown> extends Observable<D>, Emitter<D> {}
