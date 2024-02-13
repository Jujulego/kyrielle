/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, expectTypeOf } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { ref$ } from '@/src/refs/ref.js';
import { var$ } from '@/src/refs/var.js';
import { source$ } from '@/src/events/source.js';
import { each$ } from '@/src/pipe/each.js';

// Tests
describe('each$', () => {
  it('should be a simple source', () => {
    const ref = pipe$(
      source$<number>(),
      each$((val) => val.toString())
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref).not.toHaveProperty('read');
    expectTypeOf(ref).not.toHaveProperty('mutate');
  });

  it('should be a sync readonly reference', () => {
    const ref = pipe$(
      ref$({ read: () => 42 }),
      each$((val) => val.toString())
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref.read).returns.toBeString();
    expectTypeOf(ref).not.toHaveProperty('mutate');
  });

  it('should be a sync reference', () => {
    const ref = pipe$(
      var$(42),
      each$((val) => val.toString())
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref.read).returns.toBeString();
    expectTypeOf(ref.mutate).parameter(0).toBeNumber();
    expectTypeOf(ref.mutate).returns.toBeString();
  });

  it('should be an async reference', () => {
    const ref = pipe$(
      var$(42),
      each$(async (val) => val.toString())
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref.read).returns.resolves.toBeString();
    expectTypeOf(ref.mutate).parameter(0).toBeNumber();
    expectTypeOf(ref.mutate).returns.resolves.toBeString();
  });

  it('should not change read synchronicity of reference', () => {
    const ref = pipe$(
      ref$({
        read: async () => 42,
        mutate: (arg: number) => 42
      }),
      each$((val) => val.toString()) // <= sync but result is still async because initial ref is async
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref.read).returns.resolves.toBeString();
    expectTypeOf(ref.mutate).parameter(0).toBeNumber();
    expectTypeOf(ref.mutate).returns.toBeString();
  });

  it('should not change mutate synchronicity of reference', () => {
    const ref = pipe$(
      ref$({
        read: () => 42,
        mutate: async (arg: number) => 42
      }),
      each$((val) => val.toString()) // <= sync but result is still async because initial ref is async
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeString();
    expectTypeOf(ref.read).returns.toBeString();
    expectTypeOf(ref.mutate).parameter(0).toBeNumber();
    expectTypeOf(ref.mutate).returns.resolves.toBeString();
  });
});