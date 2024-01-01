import { expectTypeOf } from 'vitest';

import { merge$ } from '@/src/operators/merge.js';
import { source$ } from '@/src/events/source.js';

// Tests
describe('merge$', () => {
  it('should emit union of input types', () => {
    const int = source$<number>();
    const str = source$<string>();
    const src = merge$(int, str);

    expectTypeOf(src.subscribe).parameter(0).parameter(0).toEqualTypeOf<number | string>();
  });
});
