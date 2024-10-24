import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { scan$ } from '@/src/scan$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('scan$', () => {
  it('should call compute on each emitted value', () => {
    const spyCompute = vi.fn((state: number, item: number) => state + item);
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      scan$(spyCompute, 0),
    ).subscribe(spyResult);

    expect(spyCompute).toHaveBeenCalledWith(0, 1);
    expect(spyResult).toHaveBeenCalledWith(1);

    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyResult).toHaveBeenCalledWith(3);

    expect(spyCompute).toHaveBeenCalledWith(3, 3);
    expect(spyResult).toHaveBeenCalledWith(6);
  });

  it('should call compute on each iterated value', () => {
    const spyCompute = vi.fn((state: number, item: number) => state + item);

    const iterator = pipe$(
      [1, 2, 3],
      scan$(spyCompute, 0),
    );

    expect(iterator.next()).toStrictEqual({ done: false, value: 1 });
    expect(spyCompute).toHaveBeenCalledWith(0, 1);

    expect(iterator.next()).toStrictEqual({ done: false, value: 3 });
    expect(spyCompute).toHaveBeenCalledWith(1, 2);

    expect(iterator.next()).toStrictEqual({ done: false, value: 6 });
    expect(spyCompute).toHaveBeenCalledWith(3, 3);

    expect(iterator.next()).toStrictEqual({ done: true });
  });
});