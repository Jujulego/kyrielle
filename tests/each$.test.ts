import { describe, expect, it, vi } from 'vitest';

import { each$ } from '@/src/each$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';
import { observable$ } from '@/src/observable$.js';

// Tests
describe('each$', () => {
  it('should subscribe to source and transform emitted values', () => {
    const src = source$<number>();
    vi.spyOn(src, 'subscribe');

    // Setup
    const res = pipe$(src, each$((n) => n.toString()));
    expect(src.subscribe).not.toHaveBeenCalled();

    // Subscribe
    const fn = vi.fn();
    res.subscribe(fn);

    expect(src.subscribe).toHaveBeenCalled();

    // Filter
    src.next(12);
    src.next(42);

    expect(fn).toHaveBeenCalledWith('12');
    expect(fn).toHaveBeenCalledWith('42');
  });

  it('should complete when source completes', () => {
    const src = source$<number>();
    const res = pipe$(src, each$((n) => n.toString()));

    const subscription = res.subscribe(vi.fn());
    expect(subscription.closed).toBe(false);

    src.complete();
    expect(subscription.closed).toBe(true);
  });

  it('should complete source completes', () => {
    const fn = vi.fn();
    const src = observable$<number>((_, signal) => {
      signal.addEventListener('abort', fn, { once: true });
    });
    const res = pipe$(src, each$((n) => n.toString()));

    const subscription = res.subscribe(vi.fn());
    expect(fn).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(fn).toHaveBeenCalled();
  });
});