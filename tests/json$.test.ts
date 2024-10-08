import { describe, expect, it, vi } from 'vitest';

import { json$ } from '@/src/json$.js';
import { observable$ } from '@/src/observable$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';

// Tests
describe('json$', () => {
  it('should subscribe to source and parse emitted values', () => {
    const src = source$<string>();
    vi.spyOn(src, 'subscribe');

    // Setup
    const res = pipe$(src, json$());
    expect(src.subscribe).not.toHaveBeenCalled();

    // Subscribe
    const fn = vi.fn();
    res.subscribe(fn);

    expect(src.subscribe).toHaveBeenCalled();

    // Filter
    src.next('{ "life": 12 }');
    src.next('{ "life": 42 }');

    expect(fn).toHaveBeenCalledWith({ life: 12 });
    expect(fn).toHaveBeenCalledWith({ life: 42 });
  });

  it('should parse defer result', () => {
    const src = { defer: () => '{ "life": 42 }' };
    const res = pipe$(src, json$());

    expect(res.defer()).toEqual({ life: 42 });
    expect(res.defer()).toBe(res.defer());
  });

  it('should parse async defer result', async () => {
    const src = { defer: async () => '{ "life": 42 }' };
    const res = pipe$(src, json$());

    await expect(res.defer()).resolves.toEqual({ life: 42 });
  });

  it('should parse refresh result', () => {
    const src = { refresh: () => '{ "life": 42 }' };
    const res = pipe$(src, json$());

    expect(res.refresh()).toEqual({ life: 42 });
    expect(res.refresh()).toBe(res.refresh());
  });

  it('should parse async refresh result', async () => {
    const src = { refresh: async () => '{ "life": 42 }' };
    const res = pipe$(src, json$());

    await expect(res.refresh()).resolves.toEqual({ life: 42 });
  });

  it('should stringify arg and parse mutate result', () => {
    const src = { mutate: vi.fn((arg: string) => '{ "life": 42 }') };
    const res = pipe$(src, json$());

    expect(res.mutate({ toto: 12 })).toEqual({ life: 42 });
    expect(res.mutate({ toto: 12 })).toBe(res.mutate({ toto: 12 }));
    expect(src.mutate).toHaveBeenCalledWith('{"toto":12}', undefined);
  });

  it('should stringify arg and parse async mutate result', async () => {
    const src = { mutate: vi.fn(async (arg: string) => '{ "life": 42 }') };
    const res = pipe$(src, json$());

    await expect(res.mutate({ toto: 12 })).resolves.toEqual({ life: 42 });
    expect(src.mutate).toHaveBeenCalledWith('{"toto":12}', undefined);
  });

  it('should complete when source completes', () => {
    const src = source$<string>();
    const res = pipe$(src, json$());

    const subscription = res.subscribe(vi.fn());
    expect(subscription.closed).toBe(false);

    src.complete();
    expect(subscription.closed).toBe(true);
  });

  it('should complete source completes', () => {
    const fn = vi.fn();
    const src = observable$<string>((_, signal) => {
      signal.addEventListener('abort', fn, { once: true });
    });
    const res = pipe$(src, json$());

    const subscription = res.subscribe(vi.fn());
    expect(fn).not.toHaveBeenCalled();

    subscription.unsubscribe();
    expect(fn).toHaveBeenCalled();
  });
});
