import { expectTypeOf } from 'vitest';

import { Receiver, ReceivedValue } from '@/src/defs/features/receiver.js';

describe('ReceivedValue', () => {
  it('should be a number', () => {
    expectTypeOf<ReceivedValue<Receiver<number>>>().toBeNumber();
  });
});
