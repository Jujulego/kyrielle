import { Mutable, Readable } from '@/src/defs/index.js';
import { describe, expect, it } from 'vitest';

import { resource$ } from '@/src/resource$.js';

// Tests
describe('resourceBuilder$', () => {
  it('should return an empty object', () => {
    expect(resource$().build()).toStrictEqual({});
  });

  it('should add methods from given readable feature', () => {
    const readable: Readable<number> = {
      read(): number {
        return 42;
      }
    };

    const resource = resource$<number>()
      .add(readable)
      .build();

    expect(resource).toHaveProperty('read', readable.read);
  });

  it('should add methods from given mutable feature', () => {
    const mutable: Mutable<string, number> = {
      mutate(): number {
        return 42;
      }
    };

    const resource = resource$<number>()
      .add(mutable)
      .build();

    expect(resource).toHaveProperty('mutate', mutable.mutate);
  });

  it('should add methods from many features', () => {
    const readable: Readable<number> = {
      read(): number {
        return 42;
      }
    };

    const mutable: Mutable<string, number> = {
      mutate(): number {
        return 42;
      }
    };

    const resource = resource$<number>()
      .add(readable)
      .add(mutable)
      .build();

    expect(resource).toHaveProperty('read', readable.read);
    expect(resource).toHaveProperty('mutate', mutable.mutate);
  });
});
