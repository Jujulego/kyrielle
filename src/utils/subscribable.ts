import type { Subscribable, SubscribableHolder } from '../types/inputs/Subscribable.js';
import { isSubscribableHolder } from './predicates.js';

/**
 * Extract a subscribable from given object
 * @param object
 */
export function extractSubscribable<D>(object: Subscribable<D> | SubscribableHolder<D>): Subscribable<D> {
  if (isSubscribableHolder(object)) {
    return object[Symbol.observable ?? '@@observable']();
  }

  return object;
}
