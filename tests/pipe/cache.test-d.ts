import { describe, expectTypeOf, it } from 'vitest';

import { Awaitable } from '@/src/defs/common.js';
import { ref$ } from '@/src/refs/ref.js';
import { cache$ } from '@/src/pipe/cache.js';
import { pipe$ } from '@/src/pipe/pipe.js';

// Tests
describe('cache$', () => {
  it('should be synchronous (sync origin, sync read cache, sync mutate cache)', () => {
    const ref = pipe$(
      ref$(() => 42),
      cache$(ref$({ read: () => 42, mutate: () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toBeNumber();
  });

  it('should be awaitable (async origin, sync read cache, sync mutate cache)', () => {
    const ref = pipe$(
      ref$(async () => 42),
      cache$(ref$({ read: () => 42, mutate: () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<Awaitable<number>>();
  });

  it('should be asynchronous (async origin, async read cache, sync mutate cache)', () => {
    const ref = pipe$(
      ref$(async () => 42),
      cache$(ref$({ read: async () => 42, mutate: () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<PromiseLike<number>>();
  });

  it('should be awaitable (async origin, sync read cache, async mutate cache)', () => {
    const ref = pipe$(
      ref$(async () => 42),
      cache$(ref$({ read: () => 42, mutate: async () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<Awaitable<number>>();
  });

  it('should be asynchronous (async origin, async read cache, async mutate cache)', () => {
    const ref = pipe$(
      ref$(async () => 42),
      cache$(ref$({ read: async () => 42, mutate: async () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<PromiseLike<number>>();
  });

  it('should be asynchronous (sync origin, async read cache, sync mutate cache)', () => {
    const ref = pipe$(
      ref$(() => 42),
      cache$(ref$({ read: async () => 42, mutate: () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<PromiseLike<number>>();
  });

  it('should be asynchronous (sync origin, async read cache, async mutate cache)', () => {
    const ref = pipe$(
      ref$(() => 42),
      cache$(ref$({ read: async () => 42, mutate: async () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<PromiseLike<number>>();
  });

  it('should be awaitable (sync origin, sync read cache, async mutate cache)', () => {
    const ref = pipe$(
      ref$(() => 42),
      cache$(ref$({ read: () => 42, mutate: async () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<Awaitable<number>>();
  });

  it('should be awaitable (async origin, async read cache, async mutate cache)', () => {
    const ref = pipe$(
      ref$(async () => 42),
      cache$(ref$({ read: async () => 42, mutate: async () => 42 }))
    );

    expectTypeOf(ref.subscribe).parameter(0).parameter(0).toBeNumber();
    expectTypeOf(ref.read).returns.toEqualTypeOf<PromiseLike<number>>();
  });
});
