import { is$, pipe$, source$ } from '@/src/index.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('is$', () => {
  it('should subscribe to source and keep only emitted "42"', () => {
    const spy = vi.fn();

    // Setup
    const src = source$<number>();
    const res = pipe$(src, is$(42));
    res.subscribe(spy);

    // Filter
    src.next(41);
    src.next(42);
    src.next(43);

    expect(spy).toHaveBeenCalledExactlyOnceWith(42);
  });
});