import { describe, expectTypeOf, it } from 'vitest';

import { EmptyResource, resourceBuilder$ } from '@/src/resource-builder$.js';

// Test
describe('resourceBuilder$', () => {
  it('should return an empty object type', () => {
    const res = resourceBuilder$<number>().build();

    expectTypeOf(res).toEqualTypeOf<EmptyResource>();
  });

  it('should add readable methods to final object type', () => {
    const res = resourceBuilder$()
      .add({ read: () => 42 })
      .build();

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res.read).returns.toBeNumber();
  });

  it('should override common methods in final object type', () => {
    const res = resourceBuilder$()
      .add({ read: () => 42 })
      .add({ read: () => '42' })
      .build();

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res.read).returns.toBeString();
  });
});
