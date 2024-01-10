import { describe, expectTypeOf, it } from 'vitest';

import { map$ } from '@/src/collections/map.js';
import { ref$ } from '@/src/refs/ref.js';
import { var$ } from '@/src/refs/var.js';

// Tests
describe('RefMap.values', () => {
  it('should be a sync iterable iterator on number for synchronous map', () => {
    const map = map$((key: string, value: number) => var$(value));

    expectTypeOf(map.values()).toEqualTypeOf<IterableIterator<number>>();

    for (const v of map.values()) {
      expectTypeOf(v).toBeNumber();
    }
  });

  it('should be a sync iterator on Promise<number> for asynchronous map', () => {
    const map = map$((key: string, val: number) => ref$({
      read: async () => val,
      mutate: (arg: number) => arg
    }));

    expectTypeOf(map.values()).toEqualTypeOf<IterableIterator<Promise<number>>>();

    for (const v of map.values()) {
      expectTypeOf(v).resolves.toBeNumber();
    }
  });

  it('should be an async iterable iterator on number for asynchronous map', async () => {
    const map = map$((key: string, val: number) => ref$({
      read: async () => val,
      mutate: (arg: number) => arg
    }));

    for await (const v of map.values()) {
      expectTypeOf(v).toBeNumber();
    }
  });
});

describe('RefMap.entries', () => {
  it('should be a sync iterable iterator on [string, number] for synchronous map', () => {
    const map = map$((key: string, value: number) => var$(value));

    expectTypeOf(map.entries()).toEqualTypeOf<IterableIterator<readonly [string, number]>>();

    for (const [k, v] of map.entries()) {
      expectTypeOf(k).toBeString();
      expectTypeOf(v).toBeNumber();
    }
  });

  it('should be an async iterable on [string, number] for synchronous map', async () => {
    const map = map$((key: string, value: number) => var$(value));

    for await (const [k, v] of map.entries()) {
      expectTypeOf(k).toBeString();
      expectTypeOf(v).toBeNumber();
    }
  });

  it('should be a sync iterable on [string, Promise<number>] for asynchronous map', () => {
    const map = map$((key: string, val: number) => ref$({
      read: async () => val,
      mutate: (arg: number) => arg
    }));

    expectTypeOf(map.entries()).toEqualTypeOf<IterableIterator<PromiseLike<readonly [string, number]>>>();

    for (const p of map.entries()) {
      expectTypeOf(p).resolves.toEqualTypeOf<readonly [string, number]>();
    }
  });

  it('should be an async iterable iterator on [string, number] for asynchronous map', async () => {
    const map = map$((key: string, val: number) => ref$({
      read: async () => val,
      mutate: (arg: number) => arg
    }));

    for await (const [k, v] of map.entries()) {
      expectTypeOf(k).toBeString();
      expectTypeOf(v).toBeNumber();
    }
  });
});
