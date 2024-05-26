import { Deferrable } from './defs/index.js';
import { isPromise } from './utils/predicates.js';
import { Query } from './utils/query.js';

/**
 * Builds a Deferrable object around fn. Produced object will deduplicate calls to fn, meaning that all defer calls made
 * while fn is running won't call fn again and all will return at the same time.
 *
 * @param fn
 */
export function deferrable$<D>(fn: (signal: AbortSignal) => D): Deferrable<D> {
  let query: Query<D> | null = null;

  // Build deferrable
  return {
    defer(signal?: AbortSignal): D {
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
