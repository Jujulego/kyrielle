import { Receiver, Observable } from '../features/index.js';

/**
 * Simple data source
 */
export interface Source<in out D = unknown> extends Observable<D>, Receiver<D> {}
