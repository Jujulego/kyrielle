import { expectTypeOf } from 'vitest';

import { Receiver, ReceivedValue } from '@/src/defs/features/receiver.js';

describe('EmittedValue', () => {
  it('should be a number', () => {
    expectTypeOf<ReceivedValue<Receiver<number>>>().toBeNumber();
  });
});
