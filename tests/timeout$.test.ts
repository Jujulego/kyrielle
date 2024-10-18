import { timeout$ } from '@/src/timeout$.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('timeout$', () => {
  it('should resolve after 1 second', async () => {
    const prom = timeout$(1000).defer();
    await vi.advanceTimersByTimeAsync(1000);

    await expect(prom).resolves.toBeUndefined();
  });

  it('should cancel timeout', async () => {
    const controller = new AbortController();
    const prom = timeout$(1000).defer(controller.signal);

    controller.abort(new Error('Abort !'));

    await expect(prom).rejects.toEqual(new Error('Abort !'));
  });
});
