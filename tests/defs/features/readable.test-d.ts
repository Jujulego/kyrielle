import { expectTypeOf } from 'vitest';

import { AsyncReadable, Readable, ReadValue } from '@/src/defs/features/readable.js';

describe('ReadValue', () => {
  it('should be a number (Readable)', () => {
    expectTypeOf<ReadValue<Readable<number>>>().toBeNumber();
  });

  it('should be a number (AsyncReadable)', () => {
    expectTypeOf<ReadValue<AsyncReadable<number>>>().toBeNumber();
  });
});
