import { describe, expect, it } from 'vitest';

import { iterate$ } from '@/src/iterate$.js';
import { source$ } from '@/src/source$.js';

// Tests
describe('iterate$', () => {
  it('should create an async iterator returning each emitted value', async () => {
    const source = source$<number>();
    const iterator = iterate$(source);

    const prom = iterator.next();
    source.next(4);
    source.next(2);

    await expect(prom).resolves.toEqual({ value: 4, done: false });
    await expect(iterator.next()).resolves.toEqual({ value: 2, done: false });
  });

  it('should end when source completes', async () => {
    const source = source$<number>();
    const iterator = iterate$(source);

    const prom = iterator.next();
    source.complete();

    await expect(prom).resolves.toEqual({ done: true });
  });

  it('should allow use of for await syntax', async () => {
    const source = source$<number>();

    setTimeout(() => {
      source.next(42);
      source.complete();
    });

    for await (const v of iterate$(source)) {
      expect(v).toBe(42);
    }
  });
});