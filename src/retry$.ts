import { Awaitable } from 'vitest';

import { AsyncReadable } from './defs/index.js';
import { PipeStep } from './pipe$.js';
import { abortSignalAny } from './utils/abort.js';

export interface RetryOptions {
  /**
   * Called when origin's call failed, with the error and the count of tries for this retry call.
   * Should return `false` to prevent retry. Can return a promise to generate some back-off.
   *
   * By default, `retry` will always retry, no matter the error or how tries there been until now
   *
   * @param error Error from origin call
   * @param count Number of try
   */
  onRetry?: (error: unknown, count: number) => Awaitable<boolean | void>;

  /**
   * Timeout in milliseconds, applied to each try.
   */
  tryTimeout?: number;
}

/**
 * Retry calls to origin's read method.
 */
export function retry$<O extends AsyncReadable>(options: RetryOptions = {}): PipeStep<O, O> {
  const { onRetry = () => true, tryTimeout } = options;

  async function retryStrategy<D>(fn: (signal?: AbortSignal) => PromiseLike<D>, signal?: AbortSignal): Promise<D> {
    let count = 0;

    while (!signal?.aborted) {
      ++count;

      // Prepare try signal
      const signals = [];
      if (signal) signals.push(signal);
      if (tryTimeout) signals.push(AbortSignal.timeout(tryTimeout));

      try {
        // Try !
        return await fn(signals.length ? abortSignalAny(signals) : undefined);
      } catch (err) {
        // Aborted
        if (signal?.aborted) {
          throw err;
        }

        // No more retries
        if (await onRetry(err, count) === false) {
          throw err;
        }
      }
    }

    throw signal.reason;
  }

  return (origin: O) => {
    const originalRead = origin.read.bind(origin);

    Object.assign(origin, {
      read: (signal?: AbortSignal) => retryStrategy(originalRead, signal)
    });

    return origin;
  };
}