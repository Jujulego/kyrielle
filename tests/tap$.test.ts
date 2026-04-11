import { observable$ } from '@/src/observable$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';
import { tap$ } from '@/src/tap$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('tap$', () => {
  it('should subscribe to source and transform emitted values', () => {
    const src = source$<number>();
    const spy = vi.fn();
    vi.spyOn(src, 'subscribe');

    // Setup
    const res = pipe$(src, tap$(spy));
    expect(src.subscribe).not.toHaveBeenCalled();

    // Subscribe
    const fn = vi.fn();
    res.subscribe(fn);

    expect(src.subscribe).toHaveBeenCalled();

    // Filter
    src.next(42);

    expect(spy).toHaveBeenCalledWith(42);
    expect(fn).toHaveBeenCalledWith(42);
  });

  it('should call with defer result', () => {
    const src = { defer: () => 42 };
    const spy = vi.fn();

    const res = pipe$(src, tap$(spy));

    expect(res.defer()).toBe(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should call with async defer result', async () => {
    const src = { defer: async () => 42 };
    const spy = vi.fn();

    const res = pipe$(src, tap$(spy));

    await expect(res.defer()).resolves.toBe(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should call with mutate result', () => {
    const src = { mutate: vi.fn((arg: string) => 42) };
    const spy = vi.fn();

    const res = pipe$(src, tap$(spy));

    expect(res.mutate('life')).toBe(42);
    expect(src.mutate).toHaveBeenCalledWith('life', undefined);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should transform async mutate result', async () => {
    const src = { mutate: vi.fn(async (arg: string) => 42) };
    const spy = vi.fn();

    const res = pipe$(src, tap$(spy));

    await expect(res.mutate('life')).resolves.toBe(42);
    expect(src.mutate).toHaveBeenCalledWith('life', undefined);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should complete when source completes', () => {
    const src = source$<number>();
    const res = pipe$(src, tap$(() => null));

    const subscription = res.subscribe(vi.fn<(arg: number) => void>());
    expect(subscription.closed).toBe(false);

    src.complete();
    expect(subscription.closed).toBe(true);
  });

  it('should complete source completes', () => {
    const fn = vi.fn();
    const src = observable$<number>((_, signal) => {
      signal.addEventListener('abort', fn, { once: true });
    });
    const res = pipe$(src, tap$(() => null));

    const subscription = res.subscribe(vi.fn<(arg: number) => void>());
    expect(fn).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(fn).toHaveBeenCalled();
  });

  it('should call with next value', () => {
    const src = { next: () => ({ done: false, value: 42 }) as const };
    const spy = vi.fn();

    const res = pipe$(src, tap$(spy));

    expect(res.next()).toStrictEqual({ done: false, value: 42 });
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should transform iterated values', () => {
    const spy = vi.fn();

    const res = pipe$([42], tap$(spy));

    expect(res.next()).toStrictEqual({ done: false, value: 42 });
    expect(res.next()).toStrictEqual({ done: true });
    expect(spy).toHaveBeenCalledWith(42);
    expect(spy).toHaveBeenCalledOnce();
  });
});
