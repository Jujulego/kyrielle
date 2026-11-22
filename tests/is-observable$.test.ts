import { isObservable$ } from '@/src/predicates/is-observable$.js';
import { describe, expect, it, vi } from 'vitest';

describe('isObservable$', () => {
  it('should recognize the Symbol.observable protocol', () => {
    const observable = { [Symbol.observable ?? '@@observable']: vi.fn() };

    expect(isObservable$(observable)).toBe(true);
  });

  it('should recognize the legacy @@observable protocol', () => {
    expect(isObservable$({ '@@observable': vi.fn() })).toBe(true);
  });

  it.each([undefined, null, 42, 'observable', () => {}])(
    'should reject non-objects (%s)',
    (value) => {
      expect(isObservable$(value)).toBe(false);
    },
  );

  it('should reject objects without a callable observable method', () => {
    expect(isObservable$({ '@@observable': true })).toBe(false);
  });
});
