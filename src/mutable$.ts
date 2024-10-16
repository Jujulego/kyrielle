import type { Mutator } from './types/outputs/Mutator.js';
import { isPromise } from './utils/predicates.js';
import { Query } from './utils/query.js';

/**
 * Builds a {@link Mutator} object around fn. If "mutate" is called while a previous mutation is still running,
 * two cases will be handled :
 * 1. the second call uses the same `arg` => the call is deduplicated and will subscribe to the running call results.
 * 2. the second call uses another `arg` => the previous call will be canceled in favor of the new one
 *
 * @param fn
 *
 * @since 1.0.0
 */
export function mutable$<A, D>(fn: MutableCallback<A, D>): Mutator<A, D> {
  let controller: AbortController;
  let previousArg: A | undefined = undefined;
  let query: Query<D> | undefined = undefined;

  // Build mutable
  return {
    mutate: (arg: A, signal?: AbortSignal): D => {
      signal?.throwIfAborted();

      // Cancel previous
      if (query && !query.completed && arg !== previousArg) {
        controller.abort(new Error('A newer mutate call has been made!'));
        query = undefined;
      }

      // Execute
      if (!query || query.completed) {
        previousArg = arg;
        controller = new AbortController();
        const result = fn(arg, controller.signal);

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

// Types
export type MutableCallback<in A = any, out D = unknown> = (arg: A, signal: AbortSignal) => D; // eslint-disable-line @typescript-eslint/no-explicit-any