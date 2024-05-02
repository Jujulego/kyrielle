import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { describe, expect, it, vi } from 'vitest';

import { scan$ } from '@/src/scan$.js';

// Tests
describe('scan$', () => {
  it('should emit each result', async () => {
    const spyCompute = vi.fn((state: number = 0, item: number) => state + item);
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      scan$(spyCompute),
    ).subscribe(spyResult);

    expect(spyCompute).toHaveBeenCalledWith(undefined, 1);
    expect(spyResult).toHaveBeenCalledWith(1);

    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyResult).toHaveBeenCalledWith(3);

    expect(spyCompute).toHaveBeenCalledWith(3, 3);
    expect(spyResult).toHaveBeenCalledWith(6);
  });
});