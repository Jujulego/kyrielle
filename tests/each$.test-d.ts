import { mutable$ } from '@/src/mutable$.js';
import { describe, expectTypeOf, it } from 'vitest';

import { each$ } from '@/src/each$.js';
import { pipe$ } from '@/src/pipe$.js';
import { source$ } from '@/src/source$.js';
import { resourceBuilder$ } from '@/src/resource-builder$.js';
import { readable$ } from '@/src/readable$.js';

// Tests
describe('each$', () => {
  it('should have a synchronous read method', () => {
    const res = pipe$(
      resourceBuilder$<number>()
        .add(source$<number>())
        .add(readable$(() => 42))
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res).not.toHaveProperty('mutate');
    expectTypeOf(res.read).returns.toBeString();
  });

  it('should have an asynchronous read method', () => {
    const res = pipe$(
      resourceBuilder$<number>()
        .add(source$<number>())
        .add(readable$(async () => 42))
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).toHaveProperty('read');
    expectTypeOf(res).not.toHaveProperty('mutate');
    expectTypeOf(res.read).returns.resolves.toBeString();
  });

  it('should have a synchronous mutate method', () => {
    const res = pipe$(
      resourceBuilder$<number>()
        .add(source$<number>())
        .add(mutable$((arg: string) => 42)) // eslint-disable-line @typescript-eslint/no-unused-vars
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
    expectTypeOf(res).toHaveProperty('mutate');
    expectTypeOf(res.mutate).parameter(0).toBeString();
    expectTypeOf(res.mutate).returns.toBeString();
  });

  it('should have an asynchronous mutate method', () => {
    const res = pipe$(
      resourceBuilder$<number>()
        .add(source$<number>())
        .add(mutable$(async (arg: string) => 42)) // eslint-disable-line @typescript-eslint/no-unused-vars
        .build(),
      each$((n) => n.toString())
    );

    expectTypeOf(res).not.toHaveProperty('read');
    expectTypeOf(res).toHaveProperty('mutate');
    expectTypeOf(res.mutate).parameter(0).toBeString();
    expectTypeOf(res.mutate).returns.resolves.toBeString();
  });
});
