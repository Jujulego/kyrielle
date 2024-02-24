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
  it('should call twice ref read method', async () => {
    const read = vi.fn(async () => 42);
    read.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$({ read }, retry$('read'));

    await expect(piped.read()).resolves.toBe(42);
    expect(read).toHaveBeenCalledTimes(2);
  });

  it('should call twice ref mutate method', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    const read = vi.fn(async () => 42);
    read.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$(
      { read },
      retry$('read', { onRetry })
    );

    await expect(piped.read()).rejects.toStrictEqual(new Error('Try again !'));

    expect(read).toHaveBeenCalledOnce();
    expect(onRetry).toHaveBeenCalledWith(new Error('Try again !'), 1);
  });

  it('should wait for onRetry to resolve before retrying', async () => {
    const read = vi.fn(async () => 42);
    read.mockRejectedValueOnce(new Error('Try again !'));

    const piped = pipe$(
      { read },
      retry$('read', {
        onRetry: () => new Promise((resolve) => setTimeout(() => resolve(), 1000)),
      }),
    );

    const prom = piped.read();
    expect(read).toHaveBeenCalledOnce();

    await vi.advanceTimersByTimeAsync(1000);
    await expect(prom).resolves.toBe(42);

    expect(read).toHaveBeenCalledTimes(2);
  });

  it('should read onRetry result before retrying', async () => {
    const read = vi.fn(async () => 42);
    read.mockRejectedValueOnce(new Error('Try again !'));

    const retry = {
      read: vi.fn(() => new Promise<void>((resolve) => setTimeout(() => resolve(), 1000)))
    };

    const piped = pipe$(
      { read },
      retry$('read', {
        onRetry: () => retry,
      }),
    );

    const prom = piped.read();
    expect(read).toHaveBeenCalledOnce();

    await vi.waitFor(() => expect(retry.read).toHaveBeenCalled());

    await vi.advanceTimersByTimeAsync(1000);
    await expect(prom).resolves.toBe(42);

    expect(read).toHaveBeenCalledTimes(2);
  });

  it('should abort call after given timeout', async () => {
    const piped = pipe$(
      { read: (signal: AbortSignal) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason))) },
      retry$('read', {
        onRetry: () => false,
        tryTimeout: 1000
      })
    );

    const prom = piped.read();
    await vi.advanceTimersByTimeAsync(1000);

    await expect(prom).rejects.toStrictEqual(new DOMException('The operation was aborted due to timeout', 'TimeoutError'));
  });

  it('should abort call if given signal aborts', async () => {
    const piped = pipe$(
      { read: (signal: AbortSignal) => new Promise((_, reject) => signal!.addEventListener('abort', () => reject(signal!.reason))) },
      retry$('read', {
        onRetry: () => false,
      })
    );

    const ctrl = new AbortController();
    const prom = piped.read(ctrl.signal);

    ctrl.abort(new Error('Abort !'));

    await expect(prom).rejects.toStrictEqual(new Error('Abort !'));
  });

  it('should not call read if retry were given an aborted signal', async () => {
    const read = vi.fn(async () => 42);

    const piped = pipe$(
      { read },
      retry$('read', {
        onRetry: () => false,
      })
    );

    await expect(piped.read(AbortSignal.abort(new Error('Abort !'))))
      .rejects.toStrictEqual(new Error('Abort !'));

    expect(read).not.toHaveBeenCalled();
  });
});