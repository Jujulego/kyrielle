import type { ObserverNextCallback } from '../features/partial-observer.js';
import type { NonNullObject } from '../types/utils.js';
import { hasMethod, isNonNullObject } from '../utils/predicates.js';

export interface MinimalObserver<D> {
  readonly next: ObserverNextCallback<D>;
}

/**
 * Tests if given value is a minimal Observer object (with at least a next method)
 */
export function isMinimalObserver$<T = unknown>(
  value: unknown,
): value is MinimalObserver<T> & NonNullObject {
  return isNonNullObject(value) && hasMethod(value, 'next') && value.next.length > 0;
}
