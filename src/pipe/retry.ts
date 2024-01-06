import { AsyncReadable, AsyncMutable, Observable, Awaitable, PipeStep } from '../defs/index.js';
import { abortSignalAny } from '../utils/signal.js';
import { isMutable } from '../utils/predicate.js';

// Types
export type RetryableMethod = 'read' | 'mutate' | 'both';

export interface RetryableReadableOrigin<out D = unknown> extends AsyncReadable<D>, Partial<Observable<D>> {}
export interface RetryableMutableOrigin<out D = unknown, in A = D> extends AsyncReadable<D>, AsyncMutable<D, A>, Partial<Observable<D>> {}
export interface RetryableOrigin<out D = unknown, in A = D> extends AsyncReadable<D>, Partial<Observable<D> & AsyncMutable<D, A>> {}

export interface RetryOptions {
  /**
   * Called when origin's call failed, with the error and the count of tries for this retry call.
   * Should return `true` to allow retry, `false` to make retry call fail. Can return a promise to generate some back-off.
   *
   * By default, `retry` will always retry, no matter the error or how tries there been until now
   *
   * @param error Error from origin call
   * @param count Number of try
   */
  onRetry?: (error: unknown, count: number) => Awaitable<boolean>;

  /**
   * Timeout in milliseconds, applied to each try.
   */
  tryTimeout?: number;
}

/**
 * Retry calls to selected methods.
 */
export function retry$<R extends RetryableReadableOrigin>(method: 'read', options?: RetryOptions): PipeStep<R, R>;

/**
 * Retry calls to selected methods.
 */
export function retry$<R extends RetryableMutableOrigin>(method: RetryableMethod, options?: RetryOptions): PipeStep<R, R>;

export function retry$<D, A>(method: RetryableMethod, options: RetryOptions = {}): PipeStep<RetryableOrigin<D, A>, RetryableOrigin<D, A>> {
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
        if (signal?.aborted) throw err;

        // No more retries
        const retry = await onRetry(err, count);
        if (!retry) throw err;
      }
    }

    throw signal.reason;
  }

  return (origin: RetryableOrigin<D, A>) => {
    if (['read', 'both'].includes(method)) {
      const originalRead = origin.read.bind(origin);

      Object.assign(origin, {
        read: (signal?: AbortSignal) => retryStrategy(originalRead, signal)
      });
    }

    if (isMutable<AsyncMutable<D, A>>(origin) && ['mutate', 'both'].includes(method)) {
      const originalMutate = origin.mutate.bind(origin);

      Object.assign(origin, {
        mutate: (arg: A, signal?: AbortSignal) => retryStrategy((sig) => originalMutate(arg, sig), signal)
      });
    }

    return origin;
  };
}
