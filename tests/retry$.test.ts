import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { pipe$ } from '@/src/pipe$.js';
import { retry$ } from '@/src/retry$.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Tests
describe('retry$', () => {
  it('should call twice ref defer method', async () => {
    const defer = vi.fn(async () => 42);
    defer.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$({ defer }, retry$('defer'));

    await expect(piped.defer()).resolves.toBe(42);
    expect(defer).toHaveBeenCalledTimes(2);
  });

  it('should call twice ref mutate method', async () => {
    const mutate = vi.fn(async (_: string) => 42);
    mutate.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$(
      { mutate },
      retry$('mutate')
    );

    await expect(piped.mutate('life')).resolves.toBe(42);
    expect(mutate).toHaveBeenCalledTimes(2);
  });

  it('should call onRetry callback and then fail as it returned false', async () => {
    const onRetry = vi.fn(() => false);
    const defer = vi.fn(async () => 42);
    defer.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$(
      { defer },
      retry$('defer', { onRetry })
    );

    await expect(piped.defer()).rejects.toStrictEqual(new Error('Try again !'));

    expect(defer).toHaveBeenCalledOnce();
    expect(onRetry).toHaveBeenCalledWith(new Error('Try again !'), 1);
  });

  it('should wait for onRetry to resolve before retrying', async () => {
    const defer = vi.fn(async () => 42);
    defer.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$(
      { defer },
      retry$('defer', {
        onRetry: () => new Promise((resolve) => setTimeout(() => resolve(), 1000)),
      }),
    );

    const prom = piped.defer();
    expect(defer).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(1000);
    await expect(prom).resolves.toBe(42);

    expect(defer).toHaveBeenCalledTimes(2);
  });

  it('should defer onRetry result before retrying', async () => {
    const defer = vi.fn(async () => 42);
    defer.mockRejectedValueOnce(new Error('Try again !'));

    const retry = {
      defer: vi.fn(() => new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)))
    };

    const piped = pipe$(
      { defer },
      retry$('defer', {
        onRetry: () => retry,
      }),
    );

    const prom = piped.defer();
    expect(defer).toHaveBeenCalledOnce();

    await vi.waitFor(() => expect(retry.defer).toHaveBeenCalled());

    await vi.advanceTimersByTimeAsync(1000);
    await expect(prom).resolves.toBe(42);

    expect(defer).toHaveBeenCalledTimes(2);
  });

  it('should abort call after given timeout', async () => {
    const piped = pipe$(
      { defer: (signal: AbortSignal) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))) },
      retry$('defer', {
        onRetry: () => false,
        tryTimeout: 1000
      })
    );

    const prom = piped.defer();
    await vi.advanceTimersByTimeAsync(1000);

    await expect(prom).rejects.toStrictEqual(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
  });

  it('should abort call if given signal aborts', async () => {
    const piped = pipe$(
      { defer: (signal: AbortSignal) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))) },
      retry$('defer', {
        onRetry: () => false,
      })
    );

    const ctrl = new AbortController();
    const prom = piped.defer(ctrl.signal);

    ctrl.abort(new Error('Abort !'));

    await expect(prom).rejects.toStrictEqual(new Error('Abort !'));
  });

  it('should not call defer if retry were given an aborted signal', async () => {
    const defer = vi.fn(async () => 42);

    const piped = pipe$(
      { defer },
      retry$('defer', {
        onRetry: () => false,
      })
    );

    await expect(piped.defer(AbortSignal.abort(new Error('Abort !'))))
      .rejects.toStrictEqual(new Error('Abort !'));

    expect(defer).not.toHaveBeenCalled();
  });
});
