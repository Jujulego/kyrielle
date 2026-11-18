import type { Subscribable } from '../features/subscribable.js';
import { hasMethod, isNonNullObject } from '../utils/predicates.js';

/**
 * Tests whether a value implements the {@link Subscribable} contract.
 *
 * @template D - Type of values emitted by the subscribable.
 * @param value - Value to test.
 * @returns Whether `value` has a `subscribe` method.
 *
 * @since 3.0.0
 * @see {@link isSubscribableHolder}
 */
export function isSubscribable$<D = unknown>(value: unknown): value is Subscribable<D> {
  return isNonNullObject(value) && hasMethod(value, 'subscribe');
}
