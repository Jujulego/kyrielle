import { collect$ } from '@/src/collect$.js';
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

  it('should return a promise to an array of numbers', () => {
    const res = pipe$(
      of$([1, 2, 3]),
      collect$(),
    );

    expectTypeOf(res).resolves.toBeArray();
    expectTypeOf(res).resolves.items.toBeNumber(); // eslint-disable-line vitest/valid-expect
  });
});
