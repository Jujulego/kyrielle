import type { AsyncDeferrable, AsyncMutable, Awaitable, Deferrable, Mutable } from './defs/index.js';
import type { PipeStep } from './pipe$.js';
import { abortSignalAny } from './utils/abort.js';
import { isDeferrable, isMutable } from './utils/predicates.js';

// Types
export type RetryableMethod = 'defer' | 'mutate' | 'both';

export type RetriedDeferrable<O> = O extends AsyncDeferrable<infer D> ? Deferrable<Promise<D>> : never;
export type RetriedMutable<O> = O extends AsyncMutable<infer A, infer D> ? Mutable<A, Promise<D>> : never;

export type OnRetryResult = Awaitable<boolean | void> | Deferrable<Awaitable<boolean | void>>;

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
 * Retry calls to origin's defer method.
 */
export function retry$<O extends AsyncDeferrable>(method: 'defer', options?: RetryOptions): PipeStep<O, Omit<O, 'defer'> & RetriedDeferrable<O>>

/**
 * Retry calls to origin's mutate method.
 */
export function retry$<O extends AsyncMutable>(method: 'mutate', options?: RetryOptions): PipeStep<O, Omit<O, 'mutate'> & RetriedMutable<O>>

/**
 * Retry calls to origin's both defer & mutate methods.
 */
export function retry$<O extends AsyncDeferrable & AsyncMutable>(method: 'both', options?: RetryOptions): PipeStep<O, Omit<O, 'defer' | 'mutate'> & RetriedDeferrable<O> & RetriedMutable<O>>

/**
 * Retry calls to origin's defer method.
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
    if (isDeferrable<PromiseLike<unknown>>(origin) && ['defer', 'both'].includes(method)) {
      const originalDefer = origin.defer.bind(origin);

      Object.assign(origin, {
        defer: (signal?: AbortSignal) => retryStrategy(originalDefer, signal)
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
  if (isDeferrable(result)) {
    result = result.defer(signal);
  }

  return !(await result ?? true);
}
