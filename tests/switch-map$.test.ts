import { observable$ } from '@/src/observable$.js';
import { switchMap$ } from '@/src/switch-map$.js';
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

describe('switchMap$', () => {
  it('should emit all values emitted by last returned subscribable', async () => {
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
      switchMap$(spyFn),
    ).subscribe({ next: spyResult, complete: spyComplete });

    expect(spyFn).toHaveBeenCalledTimes(3);
    expect(spyFn).toHaveBeenCalledWith(1);
    expect(spyFn).toHaveBeenCalledWith(2);
    expect(spyFn).toHaveBeenCalledWith(3);

    expect(spyComplete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(3);
    expect(spyResult).toHaveBeenCalledWith(3);
    expect(spyResult).toHaveBeenCalledWith(30);
    expect(spyResult).toHaveBeenCalledWith(300);

    expect(spyComplete).toHaveBeenCalledOnce();
  });

  it('should unsubscribe from intermediate observable', async () => {
    const spyCancel = vi.fn();
    const spyFn = vi.fn((i: number) => observable$((observer, signal) => {
      const id = setTimeout(() => {
        observer.next(i);
        observer.next(i * 10);
        observer.next(i * 100);
        observer.complete();
      }, 1000);

      signal.addEventListener('abort', () => {
        spyCancel(i);
        clearTimeout(id);
      }, { once: true });
    }));
    const spyResult = vi.fn();
    const spyComplete = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      switchMap$(spyFn),
    ).subscribe({ next: spyResult, complete: spyComplete });

    expect(spyCancel).toHaveBeenCalledTimes(2);
    expect(spyCancel).toHaveBeenCalledWith(1);
    expect(spyCancel).toHaveBeenCalledWith(2);

    expect(spyComplete).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1000);

    expect(spyResult).toHaveBeenCalledTimes(3);

    expect(spyComplete).toHaveBeenCalledOnce();
  });
});
