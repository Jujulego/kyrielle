import { describe, vi } from 'vitest';

import { pipe$ } from '@/src/operators/pipe.js';
import { filter$ } from '@/src/steps/filter.js';
import { source$ } from '@/src/source.js';

// Test
describe('filter$', () => {
  it('should emit valid events according to predicate', () => {
    const base = source$<string | number>();
    const fn = vi.fn((arg: string | number) => typeof arg === 'number');
    const spy = vi.fn();

    const ref = pipe$(base, filter$(fn));
    ref.subscribe(spy);

    base.next(42);
    expect(fn).toHaveBeenCalledWith(42);
    expect(spy).toHaveBeenCalledWith(42);
  });

  it('should not emit invalid events according to predicate', () => {
    const base = source$<string | number>();
    const fn = vi.fn((arg: string | number) => typeof arg === 'number');
    const spy = vi.fn();

    const ref = pipe$(base, filter$(fn));
    ref.subscribe(spy);

    base.next('life');
    expect(fn).toHaveBeenCalledWith('life');
    expect(spy).not.toHaveBeenCalledWith();
  });
});
