import { describe, expectTypeOf, it } from 'vitest';

import { map$ } from '@/src/map$.js';
import { pipe$ } from '@/src/pipe$.js';
import { resource$ } from '@/src/resource$.js';

// Tests
describe('map$', () => {
  it('should have a synchronous defer method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ defer: () => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('defer');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.defer).returns.toBeString();
  });

  it('should have an asynchronous defer method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ defer: async () => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('defer');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.defer).returns.resolves.toBeString();
  });

  it('should have a synchronous refresh method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ refresh: () => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('defer');
    expectTypeOf(res).toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.refresh).returns.toBeString();
  });

  it('should have an asynchronous refresh method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ refresh: async () => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('defer');
    expectTypeOf(res).toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.refresh).returns.resolves.toBeString();
  });

  it('should have a synchronous mutate method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ mutate: (arg: string) => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('defer');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).toHaveProperty('mutate');
    expectTypeOf(res.mutate).parameter(0).toBeString();
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.mutate).returns.toBeString();
  });

  it('should have an asynchronous mutate method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ mutate: async (arg: string) => 42 })
        .build(),
      map$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('defer');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).toHaveProperty('mutate');
    expectTypeOf(res.mutate).parameter(0).toBeString();
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.mutate).returns.resolves.toBeString();
  });
});
