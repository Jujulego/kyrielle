import type { AnySubscribable, Subscribable } from '../features/subscribable.js';
import { isObservable$ } from '../predicates/is-observable$.js';

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
 * @see {@link AnySubscribable}
 * @see {@link Subscribable}
 */
export function toSubscribable$<D>(object: AnySubscribable<D>): Subscribable<D> {
  if (isObservable$(object)) {
    return object[Symbol.observable ?? '@@observable']();
  }

  return object;
}

/**
 * @deprecated Renamed to {@link toSubscribable$}
 */
export const extractSubscribable = toSubscribable$;
