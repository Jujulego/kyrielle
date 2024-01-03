import { Immer } from 'immer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { SyncMutableRef } from '@/src/defs/concepts/mutable-ref.js';
import { produce$, RecipeFn } from '@/src/refs/produce.js';
import { var$ } from '@/src/refs/var.js';

// Types
interface TestData {
  readonly id: string;
  readonly life: number;
}

// Setup
let ref: SyncMutableRef<TestData>;
let recipe: RecipeFn<TestData>;

beforeEach(() => {
  ref = var$({ id: 'test', life: 42 });
  recipe = vi.fn((old) => {
    old.life = 0;
  });
});

// Tests
describe('produce$', () => {
  it('should mutate ref using given recipe', () => {
    vi.spyOn(ref, 'mutate');

    expect(produce$(ref, recipe)).toStrictEqual({ id: 'test', life: 0 });
    expect(ref.mutate).toHaveBeenCalledWith({ id: 'test', life: 0 }, undefined);
  });

  it('should pass given signal to read', () => {
    vi.spyOn(ref, 'read');
    const signal = AbortSignal.abort();

    expect(produce$(ref, recipe, { signal })).toStrictEqual({ id: 'test', life: 0 });
    expect(ref.read).toHaveBeenCalledWith(signal);
  });

  it('should use given Immer instance', () => {
    const immer = new Immer();
    vi.spyOn(immer, 'produce');

    expect(produce$(ref, recipe, { immer })).toStrictEqual({ id: 'test', life: 0 });
    expect(immer.produce).toHaveBeenCalled();
  });
});
