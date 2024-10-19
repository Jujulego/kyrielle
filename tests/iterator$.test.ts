import { iterator$ } from '@/src/iterator$.js';
import { describe, expect, it, vi } from 'vitest';

describe('iterator$', () => {
  it('should call given next function', () => {
    const next = vi.fn(() => ({ value: 42 }));
    const iterator = iterator$({ next });

    expect(iterator.next()).toStrictEqual({ value: 42 });
    expect(next).toHaveBeenCalledOnce();
  });

  it('should accept an array', () => {
    const iterator = iterator$([1, 2, 3]);

    expect(iterator.next()).toStrictEqual({ value: 1, done: false });
    expect(iterator.next()).toStrictEqual({ value: 2, done: false });
    expect(iterator.next()).toStrictEqual({ value: 3, done: false });
    expect(iterator.next()).toStrictEqual({ value: undefined, done: true });
  });
});