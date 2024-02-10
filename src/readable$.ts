import { Readable } from './defs/index.js';
import { isPromise } from './utils/promise.js';

/**
 * Builds a Readable object around fn. Produced object will deduplicate calls to fn, meaning that all read calls made
 * while fn is running won't call fn again and all will return at the same time.
 *
 * @param fn
 */
export function readable$<D>(fn: (signal: AbortSignal) => D): Readable<D> {
  let calls = 0;
  let controller: AbortController;
  let promise: (D & PromiseLike<unknown>) | null = null;
  const signals = new Set<AbortSignal>();

  // Utils
  function cancel(this: AbortSignal) {
    --calls;

    if (calls === 0) {
      controller.abort(this.reason);
    }
  }

  function cleanup() {
    calls = 0;
    promise = null;

    for (const signal of signals) {
      signal.removeEventListener('abort', cancel);
    }

    signals.clear();
  }

  // Build readable
  return {
    read(signal?: AbortSignal): D {
      signal?.throwIfAborted();

      // Execute
      if (!promise) {
        controller = new AbortController();
        const result = fn(controller.signal);

        if (isPromise(result)) {
          promise = result;
          promise.then(cleanup, cleanup);
        } else {
          return result;
        }
      }

      // Manage signal
      if (signal) {
        if (!signals.has(signal)) {
          ++calls;

          signals.add(signal);
          signal.addEventListener('abort', cancel, { once: true });
        }

        return <D>Promise.race([
          promise,
          new Promise<never>((_, reject) => signal!.addEventListener('abort', () => reject(signal!.reason), { once: true }))
        ]);
      } else {
        ++calls;
      }

      return promise;
    }
  };
}
