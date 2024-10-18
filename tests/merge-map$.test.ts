import { mergeMap$ } from '@/src/merge-map$.js';
import { observable$ } from '@/src/observable$.js';

import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('mergeMap$', () => {
  it('should emit all values emitted by last returned subscribable', async () => {
    const spyFn = vi.fn((i: number) => observable$((observer) => {
      setTimeout(() => observer.next(i), 1000);
      setTimeout(() => observer.next(i * 10), 2000);
      setTimeout(() => observer.next(i * 100), 3000);
      setTimeout(() => observer.complete(), 4000);
    }));
    const spyResult = vi.fn();
    const spyComplete = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      mergeMap$(spyFn),
    ).subscribe({ next: spyResult, complete: spyComplete });

    expect(spyFn).toHaveBeenCalledTimes(3);
    expect(spyFn).toHaveBeenCalledWith(1);
    expect(spyFn).toHaveBeenCalledWith(2);
    expect(spyFn).toHaveBeenCalledWith(3);

    expect(spyComplete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(3);
    expect(spyResult).toHaveBeenCalledWith(1);
    expect(spyResult).toHaveBeenCalledWith(2);
    expect(spyResult).toHaveBeenCalledWith(3);

    expect(spyComplete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(6);
    expect(spyResult).toHaveBeenCalledWith(10);
    expect(spyResult).toHaveBeenCalledWith(20);
    expect(spyResult).toHaveBeenCalledWith(30);

    expect(spyComplete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(9);
    expect(spyResult).toHaveBeenCalledWith(100);
    expect(spyResult).toHaveBeenCalledWith(200);
    expect(spyResult).toHaveBeenCalledWith(300);

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyComplete).toHaveBeenCalledOnce();
  });
});
