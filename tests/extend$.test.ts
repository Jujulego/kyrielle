import { extend$ } from '@/src/extend$.js';
import { describe, expect, it, vi } from 'vitest';

describe('extend$', () => {
  it('should add item to array using push', () => {
    const arr: number[] = [];
    vi.spyOn(arr, 'push');

    extend$(arr, 42);

    expect(arr).toStrictEqual([42]);
    expect(arr.push).toHaveBeenCalledWith(42);
  });

  it('should add item to set using add', () => {
    const set = new Set();
    vi.spyOn(set, 'add');

    extend$(set, 42);

    expect(set.has(42)).toBe(true);
    expect(set.add).toHaveBeenCalledWith(42);
  });
});
