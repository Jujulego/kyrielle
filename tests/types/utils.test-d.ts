import { expectTypeOf } from 'vitest';

import { MapValueIntersection, UnionToIntersection } from '@/src/types/utils.js';

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
