import { var$ } from '@/src/var$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('var$', () => {
  it('should return initial value, and emit it', () => {
    const ref = var$(42);

    expect(ref.defer()).toBe(42);

    const cb = vi.fn();
    ref.subscribe(cb);

    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should return undefined, and emit nothing', () => {
    const ref = var$<number>();

    expect(ref.defer()).toBeUndefined();

    const cb = vi.fn();
    ref.subscribe(cb);

    expect(cb).not.toHaveBeenCalled();
  });

  it('should emit value on mutate calls', () => {
    const ref = var$<number>();
    const cb = vi.fn();

    ref.subscribe(cb);
    ref.mutate(42);

    expect(ref.defer()).toBe(42);
    expect(cb).toHaveBeenCalledWith(42);
  });
});
