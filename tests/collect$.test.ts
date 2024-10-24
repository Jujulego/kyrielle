import { collect$ } from '@/src/collect$.js';
import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('collect$', () => {
  it('should collect iterated items into an array', () => {
    expect(pipe$(
      [1, 2, 3],
      collect$()
    )).toStrictEqual([1, 2, 3]);
  });

  it('should collect generated items into an array', () => {
    expect(pipe$(
      (function* () { yield 1; yield 2; yield 3; return 'toto'; })(),
      collect$()
    )).toStrictEqual([1, 2, 3]);
  });

  it('should collect emitted items into an array', () => {
    const spyResult = vi.fn();

    pipe$(
      of$([1, 2, 3]),
      collect$()
    ).subscribe(spyResult);

    expect(spyResult).toHaveBeenCalledWith([1, 2, 3]);
  });
});
