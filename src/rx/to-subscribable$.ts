import type { AnySubscribable, Subscribable } from '../features/subscribable.js';
import { assert } from '../utils/assert.js';
import { hasMethod, isNonNullObject } from '../utils/predicates.js';

/**
 * Extracts the {@link Subscribable} from a subscribable or subscribable holder.
 *
 * For a {@link ObservableProtocol}, this calls its `[Symbol.observable]()` method
 * (falling back to `@@observable` in environments without `Symbol.observable`).
 *
 * @template D - Type of values emitted by the subscribable.
 * @param object - Subscribable or object holding one.
 * @returns The underlying subscribable.
 *
 * @since 1.0.0
 * @see AnySubscribable
 * @see Subscribable
 */
export function toSubscribable$<D>(object: AnySubscribable<D>): Subscribable<D> {
  assert(isNonNullObject(object));

  if (Symbol.observable && hasMethod(object, Symbol.observable)) {
    return object[Symbol.observable]();
  } else if (hasMethod(object, '@@observable')) {
    return object['@@observable']();
  } else {
    return object as Subscribable<D>;
  }
}

/**
 * @deprecated Renamed to {@link toSubscribable$}
 */
export const extractSubscribable = toSubscribable$;
