import type { Ref } from './types/outputs/Ref.js';
import { isPromise } from './utils/predicates.js';
import { Query } from './utils/query.js';

/**
 * Builds a Ref object around fn.
 * Produced object will deduplicate calls to fn, meaning that all "defer" calls made while fn is running won't call fn
 * again and all will return at the same time.
 *
 * @example
 * let value = 1;
 *
 * const ref = deferrable$(() => value);
 * console.log(ref.defer()); // prints 1
 *
 * value = 2;
 * console.log(ref.defer()); // prints 2
 *
 * @param fn function returning deferred value
 *
 * @since 1.0.0
 */
export function deferrable$<D>(fn: (signal: AbortSignal) => D): Ref<D> {
  let query: Query<D> | null = null;

  return {
    defer: (signal?: AbortSignal): D => {
      signal?.throwIfAborted();

      // Execute
      if (!query || query.completed) {
        const controller = new AbortController();
        const result = fn(controller.signal);

        if (isPromise<D>(result)) {
          query = new Query(result, controller);
        } else {
          return result;
        }
      }

      // Manage signal
      if (signal) {
        return <D> query.registerSignal(signal);
      } else {
        query.preventCancel();
      }

      return <D> query.promise;
    }
  };
}
