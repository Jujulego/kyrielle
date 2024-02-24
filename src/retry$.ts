import { Awaitable } from 'vitest';

import { AsyncMutable, AsyncReadable, Readable } from './defs/index.js';
import { PipeStep } from './pipe$.js';
import { abortSignalAny } from './utils/abort.js';
import { isMutable, isReadable } from './utils/predicates.js';

// Types
export type RetryableMethod = 'read' | 'mutate' | 'both';
export type OnRetryResult = Awaitable<boolean | void> | Readable<Awaitable<boolean | void>>;

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
  onRetry?: (error: unknown, count: number) => OnRetryResult;

  /**
   * Timeout in milliseconds, applied to each try.
   */
  tryTimeout?: number;
}

/**
 * Retry calls to origin's read method.
 */
export function retry$<O extends AsyncReadable>(method: 'read', options?: RetryOptions): PipeStep<O, O>

/**
 * Retry calls to origin's mutate method.
 */
export function retry$<O extends AsyncMutable>(method: 'mutate', options?: RetryOptions): PipeStep<O, O>

/**
 * Retry calls to origin's both read & mutate methods.
 */
export function retry$<O extends AsyncReadable & AsyncMutable>(method: 'both', options?: RetryOptions): PipeStep<O, O>

/**
 * Retry calls to origin's read method.
 */
export function retry$<O>(method: RetryableMethod, options: RetryOptions = {}): PipeStep<O, O> {
  const { onRetry = () => true, tryTimeout } = options;

  async function retryStrategy(fn: (signal?: AbortSignal) => PromiseLike<unknown>, signal?: AbortSignal): Promise<unknown> {
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
        if (await shouldStop(onRetry(err, count), signal)) {
          throw err;
        }
      }
    }

    throw signal.reason;
  }

  return (origin: O) => {
    if (isReadable<PromiseLike<unknown>>(origin) && ['read', 'both'].includes(method)) {
      const originalRead = origin.read.bind(origin);

      Object.assign(origin, {
        read: (signal?: AbortSignal) => retryStrategy(originalRead, signal)
      });
    }

    if (isMutable<unknown, PromiseLike<unknown>>(origin) && ['mutate', 'both'].includes(method)) {
      const originalMutate = origin.mutate.bind(origin);

      Object.assign(origin, {
        mutate: (arg: unknown, signal?: AbortSignal) => retryStrategy((sig) => originalMutate(arg, sig), signal)
      });
    }

    return origin;
  };
}

async function shouldStop(result: OnRetryResult, signal?: AbortSignal): Promise<boolean> {
  if (isReadable(result)) {
    result = result.read(signal);
  }

  return !(await result ?? true);
}