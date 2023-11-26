import { expectTypeOf } from 'vitest';

import { AsyncReadable, MapReadValue, Readable, ReadValue, SyncReadable } from '@/src/defs/features/readable.js';

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

describe('MapReadValue', () => {
  it('should be a number (Readable)', () => {
    expectTypeOf<MapReadValue<Readable<number>, string>>().toEqualTypeOf<Readable<string>>();
  });

  it('should be a string (SyncReadable)', () => {
    expectTypeOf<MapReadValue<SyncReadable<number>, string>>().toEqualTypeOf<SyncReadable<string>>();
  });

  it('should be a string (AsyncReadable)', () => {
    expectTypeOf<MapReadValue<AsyncReadable<number>, string>>().toEqualTypeOf<AsyncReadable<string>>();
  });
});
