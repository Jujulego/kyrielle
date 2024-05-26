import { yield$ } from '@/src/yield$.js';
import { describe, expect, it, vi } from 'vitest';

import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';
import { store$ } from '@/src/store$.js';
import { var$ } from '@/src/var$.js';

// Tests
describe('store$', () => {
  it('should save result inside given reference', () => {
    // Setup
    const origin = source$<number>();
    const reference = var$<number>();
    const result = pipe$(origin, store$(reference));

    // Mocks
    vi.spyOn(origin, 'subscribe');
    vi.spyOn(reference, 'mutate');

    const spy = vi.fn();
    result.subscribe(spy);

    // Emit !
    origin.next(42);

    expect(spy).toHaveBeenCalledWith(42);
    expect(reference.mutate).toHaveBeenCalledWith(42);
  });

  it('should defer value from given reference', () => {
    // Setup
    const origin = source$<number>();

    const reference = var$<number>(42);
    vi.spyOn(reference, 'defer');

    // Defer !
    const result = pipe$(origin, store$(reference));

    expect(result.defer()).toBe(42);
    expect(reference.defer).toHaveBeenCalled();
  });

  it('should refresh value using origin defer', () => {
    // Setup
    const origin = { defer: () => 42 };
    const reference = var$<number>();
    const result = pipe$(origin, yield$(), store$(reference));

    // Mocks
    vi.spyOn(origin, 'defer');
    vi.spyOn(reference, 'mutate');

    // Defer !
    expect(result.refresh()).toBe(42);
    expect(origin.defer).toHaveBeenCalled();
    expect(reference.mutate).toHaveBeenCalledWith(42);
  });

  it('should refresh value using origin defer (async)', async () => {
    // Setup
    const origin = { defer: async () => 42, mutate: async (v: number) => v + 1 };
    const reference = var$<number>();
    const result = pipe$(origin, yield$(), store$(reference));

    // Mocks
    vi.spyOn(origin, 'defer');
    vi.spyOn(reference, 'mutate');

    // Defer !
    await expect(result.refresh()).resolves.toBe(42);
    expect(origin.defer).toHaveBeenCalled();
    expect(reference.mutate).toHaveBeenCalledWith(42);
  });

  it('should mutate value using origin mutate', () => {
    // Setup
    const origin = { mutate: (v: number) => v + 1 };
    const reference = var$<number>();
    const result = pipe$(origin, yield$(), store$(reference));

    // Mocks
    vi.spyOn(origin, 'mutate');
    vi.spyOn(reference, 'mutate');

    // Defer !
    expect(result.mutate(42)).toBe(43);
    expect(origin.mutate).toHaveBeenCalledWith(42, undefined);
    expect(reference.mutate).toHaveBeenCalledWith(43);
  });

  it('should mutate value using origin mutate (async)', async () => {
    // Setup
    const origin = { defer: async () => 42, mutate: async (v: number) => v + 1 };
    const reference = var$<number>();
    const result = pipe$(origin, yield$(), store$(reference));

    // Mocks
    vi.spyOn(origin, 'mutate');
    vi.spyOn(reference, 'mutate');

    // Defer !
    await expect(result.mutate(42)).resolves.toBe(43);
    expect(origin.mutate).toHaveBeenCalledWith(42, undefined);
    expect(reference.mutate).toHaveBeenCalledWith(43);
  });

  it('should emit values emitted by reference', () => {
    // Setup
    const origin = source$<number>();
    const reference = var$<number>();
    const result = pipe$(origin, store$(reference));

    // Mocks
    const spy = vi.fn();
    result.subscribe(spy);

    // Emit !
    reference.mutate(42);

    expect(spy).toHaveBeenCalledWith(42);
  });
});
