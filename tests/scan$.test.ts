import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { scan$ } from '@/src/scan$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('scan$', () => {
  it('should emit each result', async () => {
    const spyInit = vi.fn(() => 0);
    const spyCompute = vi.fn((state: number, item: number) => state + item);
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      scan$(spyCompute, spyInit),
    ).subscribe(spyResult);

    expect(spyInit).toHaveBeenCalledOnce();

    expect(spyCompute).toHaveBeenCalledWith(0, 1);
    expect(spyResult).toHaveBeenCalledWith(1);

    expect(spyCompute).toHaveBeenCalledWith(1, 2);
    expect(spyResult).toHaveBeenCalledWith(3);

    expect(spyCompute).toHaveBeenCalledWith(3, 3);
    expect(spyResult).toHaveBeenCalledWith(6);
  });
});