import { beforeEach, describe, expect, it, vi } from 'vitest';

import { mutable$ } from '@/src/mutable$.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
});

// Tests
describe('mutable$', () => {
  it('should call fn and return it\'s result', () => {
    const fn = vi.fn(() => 42);
    const mutable = mutable$(fn);

    expect(mutable.mutate('life')).toBe(42);
    expect(fn).toHaveBeenCalledWith('life', expect.any(AbortSignal));
  });

  it('should call fn only once while promise is still "running"', async () => {
    const fn = vi.fn(async () => 42);
    const mutable = mutable$(fn);

    // 2 calls "at the same time"
    await expect(Promise.all([mutable.mutate('life'), mutable.mutate('life')]))
      .resolves.toStrictEqual([42, 42]);

    expect(fn).toHaveBeenCalledOnce();

    // Next call should can fn again
    await expect(mutable.mutate('life')).resolves.toBe(42);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should call fn twice while promise is still "running" as args are different', async () => {
    const fn = vi.fn(async () => 42);
    const mutable = mutable$(fn);

    // 2 calls "at the same time"
    await expect(Promise.all([mutable.mutate('life'), mutable.mutate('toto')]))
      .resolves.toStrictEqual([42, 42]);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should cancel call on abort', async () => {
    const controller = new AbortController();
    const mutable = mutable$((_: string, signal) => {
      return new Promise<never>((_, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
      });
    });

    const promise = mutable.mutate('life', controller.signal);
    controller.abort(new Error('Aborted !'));

    await expect(promise).rejects.toEqual(new Error('Aborted !'));
  });

  it('should not cancel call on abort if another call did not gave a signal', async () => {
    const controller = new AbortController();
    const mutable = mutable$((_: string, signal) => {
      return new Promise<number>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
        setTimeout(() => resolve(42), 1000);
      });
    });

    const promiseA = mutable.mutate('life', controller.signal);
    const promiseB = mutable.mutate('life');

    controller.abort(new Error('Aborted !'));
    await expect(promiseA).rejects.toEqual(new Error('Aborted !'));

    await vi.advanceTimersToNextTimerAsync();
    await expect(promiseB).resolves.toBe(42);
  });

  it('should cancel if all calls are aborted', async () => {
    const readable = mutable$((_: string, signal) => {
      return new Promise<number>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
        setTimeout(() => resolve(42), 1000);
      });
    });

    const controllerA = new AbortController();
    const promiseA = readable.mutate('life', controllerA.signal);

    const controllerB = new AbortController();
    const promiseB = readable.mutate('life', controllerB.signal);

    controllerA.abort(new Error('Abort A !'));
    controllerB.abort(new Error('Abort B !'));

    await expect(promiseA).rejects.toEqual(new Error('Abort A !'));
    await expect(promiseB).rejects.toEqual(new Error('Abort B !'));
  });

  it('should cancel only first call on abort as args are different', async () => {
    const readable = mutable$((_: string, signal) => {
      return new Promise<number>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
        setTimeout(() => resolve(42), 1000);
      });
    });

    const controllerA = new AbortController();
    const promiseA = readable.mutate('life', controllerA.signal);

    const controllerB = new AbortController();
    const promiseB = readable.mutate('toto', controllerB.signal);

    controllerA.abort(new Error('Abort A !'));

    await expect(promiseA).rejects.toEqual(new Error('Abort A !'));

    await vi.advanceTimersToNextTimerAsync();
    await expect(promiseB).resolves.toEqual(42);
  });
});
