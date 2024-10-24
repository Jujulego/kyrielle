import { collect$ } from '@/src/collect$.js';
import { filter$ } from '@/src/filter$.js';
import { map$ } from '@/src/map$.js';
import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { describe, expectTypeOf, it } from 'vitest';

// Tests
describe('collect$', () => {
  it('should return an array of numbers', () => {
    const res = pipe$(
      [1, 2, 3],
      collect$(),
    );

    expectTypeOf(res).toBeArray();
    expectTypeOf(res).items.toBeNumber(); // eslint-disable-line vitest/valid-expect
  });

  it('should return an array of numbers (with middle steps)', () => {
    const res = pipe$(
      ['1', '2', '3'],
      map$((v) => parseInt(v)),
      filter$((v) => (v % 2 === 0)),
      collect$(),
    );

    expectTypeOf(res).toBeArray();
    expectTypeOf(res).items.toBeNumber(); // eslint-disable-line vitest/valid-expect
  });
});
