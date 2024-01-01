import { describe, expectTypeOf, it } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { filter$ } from '@/src/pipe/filter.js';
import { source$ } from '@/src/events/source.js';

// Tests
describe('filter$', () => {
  it('should use type from predicate', () => {
    const ref = pipe$(
      source$<number | string>(),
      filter$((arg): arg is number => typeof arg === 'number')
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref).not.toHaveProperty('read');
    expectTypeOf(ref).not.toHaveProperty('mutate');
  });
});
