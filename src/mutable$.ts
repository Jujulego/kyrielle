import type { Mutable } from './defs/index.js';
import { isPromise } from './utils/predicates.js';
import { Query } from './utils/query.js';

/**
 * Builds a Mutable object around fn. Produced object will deduplicate calls to fn based on given arg,
 * meaning that all mutate calls made with the same arg while fn is running won't call fn again and all will
 * return at the same time.
 *
 * @param fn
 */
export function mutable$<A, D>(fn: (arg: A, signal: AbortSignal) => D): Mutable<A, D> {
  const queries = new Map<A, Query<D>>();

  // Build mutable
  return {
    mutate(arg: A, signal?: AbortSignal): D {
      signal?.throwIfAborted();

      // Execute
      let query = queries.get(arg);

      if (!query || query.completed) {
        const controller = new AbortController();
        const result = fn(arg, controller.signal);

        if (isPromise<D>(result)) {
          query = new Query(result, controller, () => queries.delete(arg));
          queries.set(arg, query);
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
