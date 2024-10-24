import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { reduce$ } from '@/src/reduce$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('reduce$', () => {
  it('should call compute on each emitted value and emit final result', () => {
    const spyCompute = vi.fn((state: number, item: number) => state + item);
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      reduce$(spyCompute, 0),
    ).subscribe(spyResult);

    expect(spyCompute).toHaveBeenCalledWith(0, 1);
    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyCompute).toHaveBeenCalledWith(3, 3);

    expect(spyResult).toHaveBeenCalledWith(6);
  });

  it('should call compute on each iterated value and emit final result', () => {
    const spyCompute = vi.fn((state: number, item: number) => state + item);

    expect(pipe$(
      [1, 2, 3],
      reduce$(spyCompute, 0),
    )).toBe(6);

    expect(spyCompute).toHaveBeenCalledWith(0, 1);
    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyCompute).toHaveBeenCalledWith(3, 3);
  });
});