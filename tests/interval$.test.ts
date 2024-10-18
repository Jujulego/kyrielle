import { interval$ } from '@/src/interval$.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('interval$', () => {
  it('should emit twice in one second', async () => {
    const next = vi.fn();

    const interval = interval$(500);
    interval.subscribe(next);

    await vi.advanceTimersByTimeAsync(1000);

    expect(next).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(1);
    expect(next).toHaveBeenCalledWith(2);
  });

  it('should only emit once in one second, as subscription unsubscribes in the middle', async () => {
    const next = vi.fn();

    const interval = interval$(500);
    const sub = interval.subscribe(next);

    await vi.advanceTimersByTimeAsync(500);

    sub.unsubscribe();

    await vi.advanceTimersByTimeAsync(500);

    expect(next).toHaveBeenCalledOnce();
    expect(next).toHaveBeenCalledWith(1);
  });
});
