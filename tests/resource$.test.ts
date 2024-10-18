import { resource$ } from '@/src/resource$.js';
import type { Deferrable } from '@/src/types/inputs/Deferrable.js';
import type { Mutable } from '@/src/types/inputs/Mutable.js';
import { describe, expect, it } from 'vitest';

// Tests
describe('resourceBuilder$', () => {
  it('should return an empty object', () => {
    expect(resource$().build()).toStrictEqual({});
  });

  it('should add methods from given readable feature', () => {
    const deferrable: Deferrable<number> = {
      defer: () => 42
    };

    const resource = resource$<number>()
      .add(deferrable)
      .build();

    expect(resource).toHaveProperty('defer', deferrable.defer);
  });

  it('should add methods from given mutable feature', () => {
    const mutable: Mutable<string, number> = {
      mutate: () => 42
    };

    const resource = resource$<number>()
      .add(mutable)
      .build();

    expect(resource).toHaveProperty('mutate', mutable.mutate);
  });

  it('should add methods from many features', () => {
    const deferrable: Deferrable<number> = {
      defer: () => 42
    };

    const mutable: Mutable<string, number> = {
      mutate: () => 42
    };

    const resource = resource$<number>()
      .add(deferrable)
      .add(mutable)
      .build();

    expect(resource).toHaveProperty('defer', deferrable.defer);
    expect(resource).toHaveProperty('mutate', mutable.mutate);
  });
});
