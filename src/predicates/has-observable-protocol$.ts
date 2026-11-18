import type { ObservableProtocol } from '../features/subscribable.js';
import { hasMethod, isNonNullObject } from '../utils/predicates.js';

/**
 * Tests whether a value holds a subscribable through the observable interop
 * protocol.
 *
 * This accepts both `[Symbol.observable]()` and the legacy `@@observable`
 * protocol.
 *
 * @template D - Type of values emitted by the held subscribable.
 * @param value - Value to test.
 * @returns Whether `value` exposes an observable interop method.
 *
 * @since 3.0.0
 * @see {@link ObservableProtocol}
 */
export function hasObservableProtocol$<D = unknown>(
  value: unknown,
): value is ObservableProtocol<D> {
  if (!isNonNullObject(value)) {
    return false;
  }

  if (Symbol.observable && hasMethod(value, Symbol.observable)) {
    return true;
  }

  return hasMethod(value, '@@observable');
}
