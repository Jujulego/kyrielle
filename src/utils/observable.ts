import { ObservableHolder, Subscribable } from '../defs/index.js';
import { isObservableHolder } from './predicates.js';

/**
 * Extract observable from given object
 * @param object
 */
export function extractObservable<D>(object: ObservableHolder<D> | Subscribable<D>): Subscribable<D> {
  if (isObservableHolder(object)) {
    return object[Symbol.observable ?? '@@observable']();
  }

  return object;
}
