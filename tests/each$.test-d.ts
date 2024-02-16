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

    expectTypeOf(res.read).returns.resolves.toBeString();
  });
});