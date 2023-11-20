import { expectTypeOf } from 'vitest';

import { MapValueIntersection, PrependMapKeys, UnionToIntersection } from '@/src/defs/utils.js';

// Tests
describe('UnionToIntersection', () => {
  it('should convert union into intersection', () => {
    expectTypeOf<UnionToIntersection<{ a: 1 } | { life: 42 }>>()
      .toMatchTypeOf<{ a: 1, life: 42 }>();
  });
});

describe('MapValueIntersection', () => {
  it('should return intersection of record value types', () => {
    expectTypeOf<MapValueIntersection<{ a: { a: 1 }, life: { life: 42 } }>>()
      .toMatchTypeOf<{ a: 1, life: 42 }>();
  });
});

describe('PrependMapKeys', () => {
  it('should prepend keys in map', () => {
    expectTypeOf<PrependMapKeys<'add', { life: 42 }>>()
      .toMatchTypeOf<{ 'add.life': 42 }>();
  });

  it('should prepend generic key in map', () => {
    expectTypeOf<PrependMapKeys<'add', Record<string, boolean>>>()
      .toMatchTypeOf<Record<`add.${string}`, boolean>>();
  });
});
