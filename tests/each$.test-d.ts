import { describe, expectTypeOf, it } from 'vitest';

import { each$ } from '@/src/each$.js';
import { pipe$ } from '@/src/pipe$.js';
import { resource$ } from '@/src/resource$.js';

// Tests
describe('each$', () => {
  it('should have a synchronous read method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ read: () => 42 })
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.read).returns.toBeString();
  });

  it('should have an asynchronous read method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ read: async () => 42 })
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).not.toHaveProperty('mutate');
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.read).returns.resolves.toBeString();
  });

  it('should have a synchronous refresh method', () => {
    const res = pipe$(
      resource$<number>()
        .add({ refresh: () => 42 })
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
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
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
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
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
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
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
    expectTypeOf(res).not.toHaveProperty('refresh');
    expectTypeOf(res).toHaveProperty('mutate');
    expectTypeOf(res.mutate).parameter(0).toBeString();
    // eslint-disable-next-line vitest/valid-expect
    expectTypeOf(res.mutate).returns.resolves.toBeString();
  });
});
