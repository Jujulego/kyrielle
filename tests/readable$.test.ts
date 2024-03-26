import { beforeEach, describe, expect, it, vi } from 'vitest';

import { readable$ } from '@/src/readable$.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
});

// Tests
describe('readable$', () => {
  it('should call fn and return it\'s result', () => {
    const fn = vi.fn(() => 42);
    const readable = readable$(fn);

    expect(readable.read()).toBe(42);
    expect(fn).toHaveBeenCalledWith(expect.any(AbortSignal));
  });

  it('should call fn only once while promise is still "running"', async () => {
    const fn = vi.fn(async () => 42);
    const readable = readable$(fn);

    // 2 calls "at the same time"
    await expect(Promise.all([readable.read(), readable.read()]))
      .resolves.toStrictEqual([42, 42]);

    expect(fn).toHaveBeenCalledOnce();

    // Next call should can fn again
    await expect(readable.read()).resolves.toBe(42);

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should cancel call on abort', async () => {
    const controller = new AbortController();
    const readable = readable$((signal) => {
      return new Promise<never>((_, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
      });
    });

    const promise = readable.read(controller.signal);
    controller.abort(new Error('Aborted !'));

    await expect(promise).rejects.toEqual(new Error('Aborted !'));
  });

  it('should not cancel call on abort if another call did not gave a signal', async () => {
    const controller = new AbortController();
    const readable = readable$((signal) => {
      return new Promise<number>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
        setTimeout(() => resolve(42), 1000);
      });
    });

    const promiseA = readable.read(controller.signal);
    const promiseB = readable.read();

    controller.abort(new Error('Aborted !'));
    await expect(promiseA).rejects.toEqual(new Error('Aborted !'));

    await vi.advanceTimersToNextTimerAsync();
    await expect(promiseB).resolves.toBe(42);
  });

  it('should cancel if all calls are aborted', async () => {
    const readable = readable$((signal) => {
      return new Promise<number>((resolve, reject) => {
        signal.addEventListener('abort', () => reject(signal.reason));
        setTimeout(() => resolve(42), 1000);
      });
    });

    const controllerA = new AbortController();
    const promiseA = readable.read(controllerA.signal);

    const controllerB = new AbortController();
    const promiseB = readable.read(controllerB.signal);

    controllerA.abort(new Error('Abort A !'));
    controllerB.abort(new Error('Abort B !'));

    await expect(promiseA).rejects.toEqual(new Error('Abort A !'));
    await expect(promiseB).rejects.toEqual(new Error('Abort B !'));
  });
});
