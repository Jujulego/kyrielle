import { describe, expect, it, vi } from 'vitest';

import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { reduce$ } from '@/src/reduce$.js';

// Tests
describe('reduce$', () => {
  it('should emit each result', async () => {
    const spyInit = vi.fn(() => 0);
    const spyCompute = vi.fn((state: number, item: number) => state + item);
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      reduce$(spyCompute, spyInit),
    ).subscribe(spyResult);

    expect(spyInit).toHaveBeenCalledOnce();

    expect(spyCompute).toHaveBeenCalledWith(0, 1);
    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyCompute).toHaveBeenCalledWith(3, 3);

    expect(spyResult).toHaveBeenCalledWith(6);
  });
});