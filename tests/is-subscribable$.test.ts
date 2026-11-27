import { isSubscribable$ } from '@/src/predicates/is-subscribable$.js';
import { describe, expect, it, vi } from 'vitest';

describe('isSubscribable$', () => {
  it('should recognize an object with a subscribe method', () => {
    expect(isSubscribable$({ subscribe: vi.fn() })).toBe(true);
  });

  it.each([undefined, null, 42, 'subscribable', () => {}])(
    'should reject non-objects (%s)',
    (value) => {
      expect(isSubscribable$(value)).toBe(false);
    },
  );

  it('should reject objects without a callable subscribe method', () => {
    expect(isSubscribable$({ subscribe: true })).toBe(false);
  });
});
