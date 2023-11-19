import { expectTypeOf } from 'vitest';

import { Observable, ObservedValue } from '@/src/features/observable.js';

describe('ObservedValue', () => {
  it('should be a number', () => {
    expectTypeOf<ObservedValue<Observable<number>>>().toBeNumber();
  });
});