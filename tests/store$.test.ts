import { pipe$ } from '@/src/pipe$.js';
import { resource$ } from '@/src/resource$.js';
import { source$ } from '@/src/source$.js';
import { store$ } from '@/src/store$.js';
import { var$ } from '@/src/var$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('store$', () => {
  it('should save result inside given reference', () => {
    // Setup
    const origin = source$<number>();
    vi.spyOn(origin, 'subscribe');

    const reference = var$<number>();
    vi.spyOn(reference, 'mutate');

    const result = pipe$(origin, store$(reference));
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

    const result = pipe$(origin, store$(reference));

    // Defer !
    expect(result.defer()).toBe(42);
    expect(reference.defer).toHaveBeenCalled();
  });

  it('should defer value from given async reference', async () => {
    // Setup
    const origin = source$<number>();

    const reference = resource$<number>()
      .add({ defer: vi.fn(async () => 42) })
      .add({ mutate: vi.fn() })
      .build();

    const result = pipe$(origin, store$(reference));

    // Defer !
    await expect(result.defer()).resolves.toBe(42);
    expect(reference.defer).toHaveBeenCalled();
  });
});
