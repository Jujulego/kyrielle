import type { PartialObserver } from '../features/partial-observer.js';
import { isMinimalObserver$ } from './is-minimal-observer$.js';
import { hasMethod } from '../utils/predicates.js';

/**
 * Tests if given value is a fully defined Observer object
 */
export function isObserver$<T = unknown>(value: unknown): value is PartialObserver<T> {
  return (
    isMinimalObserver$(value)
    && hasMethod(value, 'error')
    && value.error.length > 0
    && hasMethod(value, 'complete')
  );
}
