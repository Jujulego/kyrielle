import { describe, expectTypeOf, it } from 'vitest';

import { resource$ } from '@/src/resource$.js';

// Test
describe('resourceBuilder$', () => {
  it('should return an empty object type', () => {
    const res = resource$<number>().build();

    expectTypeOf(res).toBeUnknown();
  });

  it('should add readable methods to final object type', () => {
    const res = resource$()
      .add({ defer: () => 42 })
      .build();

    expectTypeOf(res).toHaveProperty('defer');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.defer).returns.toBeNumber();
  });

  it('should add async readable methods to final object type', () => {
    const res = resource$()
      .add({ defer: async () => 42 })
      .build();

    expectTypeOf(res).toHaveProperty('defer');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.defer).returns.resolves.toBeNumber();
  });

  it('should override common methods in final object type', () => {
    const res = resource$()
      .add({ defer: () => 42 })
      .add({ defer: () => '42' })
      .build();

    expectTypeOf(res).toHaveProperty('defer');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.defer).returns.toBeString();
  });
});
