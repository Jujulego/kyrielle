import { expectTypeOf } from 'vitest';

import { Observable, ObservedValue } from '@/src/defs/observable.js';

describe('ObservedValue', () => {
  it('should be a number', () => {
    expectTypeOf<ObservedValue<Observable<number>>>().toBeNumber();
  });
});