import type { PartialObserver } from '../features/partial-observer.js';
import { hasMethod, isNonNullObject } from '../utils/predicates.js';

/**
 * Tests if given value is a partial Observer object
 */
export function isPartialObserver$<T = unknown>(value: unknown): value is PartialObserver<T> {
  return (
    isNonNullObject(value)
    && (hasMethod(value, 'start')
      || (hasMethod(value, 'next') && value.next.length > 0)
      || (hasMethod(value, 'error') && value.error.length > 0)
      || hasMethod(value, 'complete'))
  );
}
