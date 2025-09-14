import type { Observable } from './Observable.js';

/**
 * Observable that only emits once, and that can be awaited.
 *
 * @since 2.6.0
 */
export interface Oncervable<out D = unknown> extends Observable<D>, PromiseLike<D> {}
