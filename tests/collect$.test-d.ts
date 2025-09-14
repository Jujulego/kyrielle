import { collect$ } from '@/src/collect$.js';
import { filter$ } from '@/src/filter$.js';
import { map$ } from '@/src/map$.js';
import { pipe$ } from '@/src/pipe$.js';
import { assertType, describe, expectTypeOf, it } from 'vitest';

// Tests
describe('collect$', () => {
  it('should return an array of numbers', () => {
    const res = pipe$(
      [1, 2, 3],
      collect$(),
    );

    expectTypeOf(res).toBeArray();
    expectTypeOf(res).items.toBeNumber();
  });

  it('should return an array of numbers (with middle steps)', () => {
    const res = pipe$(
      ['1', '2', '3'],
      map$((v) => parseInt(v)),
      filter$((v) => (v % 2 === 0)),
      collect$(),
    );

    expectTypeOf(res).toBeArray();
    expectTypeOf(res).items.toBeNumber();
  });

  it('should return a set', () => {
    const res = pipe$(
      [1, 2, 3],
      collect$(new Set()),
    );

    expectTypeOf(res).toEqualTypeOf<Set<unknown>>();
  });

  it('should only accepts extendable with right item type', () => {
    // @ts-expect-error a collect$ receiving "number" cannot accept a target containing "string"
    assertType(pipe$([1], collect$(new Set<string>())));
  });
});
