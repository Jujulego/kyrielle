import { SubscribableHolder, Subscribable } from '../defs/index.js';
import { isSubscribableHolder } from './predicates.js';

/**
 * Extract observable from given object
 * @param object
 */
export function extractObservable<D>(object: SubscribableHolder<D> | Subscribable<D>): Subscribable<D> {
  if (isSubscribableHolder(object)) {
    return object[Symbol.observable ?? '@@observable']();
  }

  return object;
}
