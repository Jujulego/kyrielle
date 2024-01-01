/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expectTypeOf } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { const$ } from '@/src/refs/const.js';
import { ref$ } from '@/src/refs/ref.js';
import { var$ } from '@/src/refs/var.js';
import { json$ } from '@/src/pipe/index.js';
import { source$ } from '@/src/source.js';

// Tests
describe('json$', () => {
  it('should be a simple source', () => {
    const ref = pipe$(
      source$<string>(),
      json$((val): val is number => typeof val === 'number')
    );

    expectTypeOf(ref.next).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref).not.toHaveProperty('read');
    expectTypeOf(ref).not.toHaveProperty('mutate');
  });

  it('should be a sync readonly reference', () => {
    const ref = pipe$(
      const$('42'),
      json$((val): val is number => typeof val === 'number')
    );

    expectTypeOf(ref.next).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.read).returns.toEqualTypeOf<number | null>();
    expectTypeOf(ref).not.toHaveProperty('mutate');
  });

  it('should be a sync reference', () => {
    const ref = pipe$(
      var$('42'),
      json$((val): val is number => typeof val === 'number')
    );

    expectTypeOf(ref.next).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.read).returns.toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).returns.toEqualTypeOf<number | null>();
  });

  it('should not change read synchronicity of reference', () => {
    const ref = pipe$(
      ref$({
        read: async () => '42',
        mutate: (arg: string) => '42'
      }),
      json$((val): val is number => typeof val === 'number')
    );

    expectTypeOf(ref.next).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.read).returns.resolves.toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).returns.toEqualTypeOf<number | null>();
  });

  it('should not change mutate synchronicity of reference', () => {
    const ref = pipe$(
      ref$({
        read: () => '42',
        mutate: async (arg: string) => '42'
      }),
      json$((val): val is number => typeof val === 'number')
    );

    expectTypeOf(ref.next).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.read).returns.toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).parameter(0).toEqualTypeOf<number | null>();
    expectTypeOf(ref.mutate).returns.resolves.toEqualTypeOf<number | null>();
  });
});
