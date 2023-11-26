import { expectTypeOf } from 'vitest';

import { AsyncReadable, CopyReadableSynchronicity, Readable, ReadValue, SyncReadable } from '@/src/defs/features/readable.js';

describe('ReadValue', () => {
  it('should be a number (Readable)', () => {
    expectTypeOf<ReadValue<Readable<number>>>().toBeNumber();
  });

  it('should be a number (SyncReadable)', () => {
    expectTypeOf<ReadValue<SyncReadable<number>>>().toBeNumber();
  });

  it('should be a number (AsyncReadable)', () => {
    expectTypeOf<ReadValue<AsyncReadable<number>>>().toBeNumber();
  });
});

describe('CopyReadableSynchronicity', () => {
  it('should be a number (Readable)', () => {
    expectTypeOf<CopyReadableSynchronicity<Readable<number>, string>>().toEqualTypeOf<Readable<string>>();
  });

  it('should be a string (SyncReadable)', () => {
    expectTypeOf<CopyReadableSynchronicity<SyncReadable<number>, string>>().toEqualTypeOf<SyncReadable<string>>();
  });

  it('should be a string (AsyncReadable)', () => {
    expectTypeOf<CopyReadableSynchronicity<AsyncReadable<number>, string>>().toEqualTypeOf<AsyncReadable<string>>();
  });
});
