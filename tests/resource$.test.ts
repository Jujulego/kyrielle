import { describe, expect, it } from 'vitest';

import { Mutable, Deferrable } from '@/src/defs/index.js';
import { resource$ } from '@/src/resource$.js';

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
