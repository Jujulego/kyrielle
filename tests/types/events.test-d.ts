import { expectTypeOf } from 'vitest';

import { PrependEventMapKeys } from '@/src/types/events.js';

// Tests
describe('PrependEventMapKeys', () => {
  it('should prepend keys in map', () => {
    expectTypeOf<PrependEventMapKeys<'add', { life: 42 }>>()
      .toMatchTypeOf<{ 'add.life': 42 }>();
  });

  it('should prepend generic key in map', () => {
    expectTypeOf<PrependEventMapKeys<'add', Record<string, boolean>>>()
      .toMatchTypeOf<Record<`add.${string}`, boolean>>();
  });
});
