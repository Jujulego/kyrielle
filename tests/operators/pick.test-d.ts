import { expectTypeOf } from 'vitest';

import { Emitter, Listenable } from '@/src/defs/index.js';
import { multiplexer$ } from '@/src/events/multiplexer.js';
import { pick$ } from '@/src/operators/pick.js';
import { source$ } from '@/src/events/source.js';

// Setup
const mlt = multiplexer$({
  life: source$<number>(),
});

// Tests
describe('pick$', () => {
  it('should return an observable only type', () => {
    const ref = pick$(mlt as Listenable<{ life: number }>, 'life');

    expectTypeOf(ref).not.toHaveProperty('next');
    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.unsubscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.clear).toBeFunction();
  });

  it('should return an emitter only type', () => {
    const ref = pick$(mlt as Emitter<{ life: number }>, 'life');

    expectTypeOf(ref.next).parameter(0).toBeNumber();
    expectTypeOf(ref).not.toHaveProperty('subscribe');
    expectTypeOf(ref).not.toHaveProperty('unsubscribe');
    expectTypeOf(ref).not.toHaveProperty('clear');
  });

  it('should return an observable & emitter type', () => {
    const ref = pick$(mlt, 'life');

    expectTypeOf(ref.next).parameter(0).toBeNumber();
    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.unsubscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.clear).toBeFunction();
  });
});
