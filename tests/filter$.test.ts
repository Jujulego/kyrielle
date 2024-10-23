import { filter$ } from '@/src/filter$.js';
import { observable$ } from '@/src/observable$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('filter$', () => {
  it('should subscribe to source and filter emitted values', () => {
    const src = source$<number>();
    vi.spyOn(src, 'subscribe');

    // Setup
    const res = pipe$(src, filter$((n) => n === 42));
    expect(src.subscribe).not.toHaveBeenCalled();

    // Subscribe
    const fn = vi.fn();
    res.subscribe(fn);

    expect(src.subscribe).toHaveBeenCalled();

    // Filter
    src.next(12);
    src.next(42);

    expect(fn).not.toHaveBeenCalledWith(12);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('should complete when source completes', () => {
    const src = source$<number>();
    const res = pipe$(src, filter$((n): n is 42 => n === 42));

    const subscription = res.subscribe(vi.fn());
    expect(subscription.closed).toBe(false);

    src.complete();
    expect(subscription.closed).toBe(true);
  });

  it('should unsubscribe to source, on observable abort', () => {
    const fn = vi.fn();
    const src = observable$<number>((_, signal) => {
      signal.addEventListener('abort', fn, { once: true });
    });
    const res = pipe$(src, filter$((n) => n === 42));

    const subscription = res.subscribe(vi.fn());
    expect(fn).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(fn).toHaveBeenCalled();
  });

  it('should filter iterator values', () => {
    const res = pipe$([1, 2, 3, 4], filter$((n) => (n % 2) === 0));

    expect(res.next()).toStrictEqual({ done: false, value: 2 });
    expect(res.next()).toStrictEqual({ done: false, value: 4 });
    expect(res.next()).toStrictEqual({ done: true });
  });
});
