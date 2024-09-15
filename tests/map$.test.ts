import { describe, expect, it, vi } from 'vitest';

import { map$ } from '@/src/map$.js';
import { observable$ } from '@/src/observable$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';

// Tests
describe('map$', () => {
  it('should subscribe to source and transform emitted values', () => {
    const src = source$<number>();
    vi.spyOn(src, 'subscribe');

    // Setup
    const res = pipe$(src, map$((n) => n.toString()));
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

  it('should transform defer result', () => {
    const src = { defer: () => 42 };
    const res = pipe$(src, map$((n) => n.toString()));

    expect(res.defer()).toBe('42');
  });

  it('should transform async defer result', async () => {
    const src = { defer: async () => 42 };
    const res = pipe$(src, map$((n) => n.toString()));

    await expect(res.defer()).resolves.toBe('42');
  });

  it('should transform refresh result', () => {
    const src = { refresh: () => 42 };
    const res = pipe$(src, map$((n) => n.toString()));

    expect(res.refresh()).toBe('42');
  });

  it('should transform async refresh result', async () => {
    const src = { refresh: async () => 42 };
    const res = pipe$(src, map$((n) => n.toString()));

    await expect(res.refresh()).resolves.toBe('42');
  });

  it('should transform mutate result', () => {
    const src = { mutate: vi.fn((arg: string) => 42) };
    const res = pipe$(src, map$((n) => n.toString()));

    expect(res.mutate('life')).toBe('42');
    expect(src.mutate).toHaveBeenCalledWith('life', undefined);
  });

  it('should transform async mutate result', async () => {
    const src = { mutate: vi.fn(async (arg: string) => 42) };
    const res = pipe$(src, map$((n) => n.toString()));

    await expect(res.mutate('life')).resolves.toBe('42');
    expect(src.mutate).toHaveBeenCalledWith('life', undefined);
  });

  it('should complete when source completes', () => {
    const src = source$<number>();
    const res = pipe$(src, map$((n) => n.toString()));

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
    const res = pipe$(src, map$((n) => n.toString()));

    const subscription = res.subscribe(vi.fn());
    expect(fn).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(fn).toHaveBeenCalled();
  });
});
