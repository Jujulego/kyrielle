import { expectTypeOf } from 'vitest';

import { AsyncMutable, Mutable, MutateArg } from '@/src/defs/features/mutable.js';

describe('MutateArg', () => {
  it('should be a number (Mutable)', () => {
    expectTypeOf<MutateArg<Mutable<unknown, number>>>().toBeNumber();
  });

  it('should be a number (AsyncMutable)', () => {
    expectTypeOf<MutateArg<AsyncMutable<unknown, number>>>().toBeNumber();
  });
});
