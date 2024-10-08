import { observable$ } from '@/src/observable$.js';
import { concatMap$ } from '@/src/concat-map$.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';

// Tests
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('concatMap$', () => {
  it('should emit all values emitted by every returned subscribable', async () => {
    const spyFn = vi.fn((i: number) => observable$((observer) => {
      setTimeout(() => {
        observer.next(i);
        observer.next(i * 10);
        observer.next(i * 100);
        observer.complete();
      }, 1000);
    }));
    const spyResult = vi.fn();
    const spyComplete = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      concatMap$(spyFn),
    ).subscribe({ next: spyResult, complete: spyComplete });

    expect(spyFn).toHaveBeenCalledTimes(1);
    expect(spyFn).toHaveBeenCalledWith(1);

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(3);
    expect(spyResult).toHaveBeenCalledWith(1);
    expect(spyResult).toHaveBeenCalledWith(10);
    expect(spyResult).toHaveBeenCalledWith(100);

    expect(spyFn).toHaveBeenCalledWith(2);

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(6);
    expect(spyResult).toHaveBeenCalledWith(2);
    expect(spyResult).toHaveBeenCalledWith(20);
    expect(spyResult).toHaveBeenCalledWith(200);

    expect(spyFn).toHaveBeenCalledWith(3);

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(9);
    expect(spyResult).toHaveBeenCalledWith(3);
    expect(spyResult).toHaveBeenCalledWith(30);
    expect(spyResult).toHaveBeenCalledWith(300);

    expect(spyFn).toHaveBeenCalledTimes(3);
    expect(spyComplete).toHaveBeenCalledOnce();
  });
});
