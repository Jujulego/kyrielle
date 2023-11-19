import { expectTypeOf } from 'vitest';

import { Emitter, EmittedValue } from '@/src/defs/emitter.js';

describe('EmittedValue', () => {
  it('should be a number', () => {
    expectTypeOf<EmittedValue<Emitter<number>>>().toBeNumber();
  });
});