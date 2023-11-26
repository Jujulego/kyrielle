import { expectTypeOf } from 'vitest';

import { AsyncMutable, CopyMutableSynchronicity, Mutable, MutateArg, SyncMutable } from '@/src/defs/features/mutable.js';

describe('MutateArg', () => {
  it('should be a number (Mutable)', () => {
    expectTypeOf<MutateArg<Mutable<unknown, number>>>().toBeNumber();
  });

  it('should be a number (SyncMutable)', () => {
    expectTypeOf<MutateArg<SyncMutable<unknown, number>>>().toBeNumber();
  });

  it('should be a number (AsyncMutable)', () => {
    expectTypeOf<MutateArg<AsyncMutable<unknown, number>>>().toBeNumber();
  });
});

describe('CopyMutableSynchronicity', () => {
  it('should be a number (Mutable)', () => {
    expectTypeOf<CopyMutableSynchronicity<Mutable<number, number>, string, string>>().toEqualTypeOf<Mutable<string, string>>();
  });

  it('should be a string (SyncMutable)', () => {
    expectTypeOf<CopyMutableSynchronicity<SyncMutable<number, number>, string, string>>().toEqualTypeOf<SyncMutable<string, string>>();
  });

  it('should be a string (AsyncMutable)', () => {
    expectTypeOf<CopyMutableSynchronicity<AsyncMutable<number, number>, string, string>>().toEqualTypeOf<AsyncMutable<string, string>>();
  });
});
