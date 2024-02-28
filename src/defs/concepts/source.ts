import { Observer } from '../features/index.js';
import { Observable } from './observable.js';

/**
 * Observable object emitting given values.
 */
export interface Source<in out D = unknown> extends Observable<D>, Omit<Observer<D>, 'start'> {
  /**
   * Indicates if source is completed.
   * A completed source does not emit anymore, as no subscription and refuse any new ones.
   */
  readonly isCompleted: boolean;
}
