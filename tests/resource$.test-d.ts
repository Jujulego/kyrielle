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
      .add({ read: () => 42 })
      .build();

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res.read).returns.toBeNumber();
  });

  it('should add async readable methods to final object type', () => {
    const res = resource$()
      .add({ read: async () => 42 })
      .build();

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res.read).returns.resolves.toBeNumber();
  });

  it('should override common methods in final object type', () => {
    const res = resource$()
      .add({ read: () => 42 })
      .add({ read: () => '42' })
      .build();

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res.read).returns.toBeString();
  });
});
