import { multiplexer$ } from '@/src/multiplexer$.js';
import { source$ } from '@/src/source$.js';
import { waitFor$ } from '@/src/waitFor$.js';
import { describe, expect, it } from 'vitest';

// Tests
describe('waitFor$', () => {
  describe('with an observer', () => {
    it('should resolve to emitted value', async () => {
      const source = source$<number>();
      const promise = waitFor$(source);

      // First call
      source.next(42);

      await expect(promise).resolves.toBe(42);
    });

    it('should reject to emitted error', async () => {
      const source = source$<number>();
      const promise = waitFor$(source);

      // First call
      source.error(42);

      await expect(promise).rejects.toBe(42);
    });
  });

  describe('with a listener', () => {
    it('should resolve to emitted value', async () => {
      const mux = multiplexer$({
        test: source$<number>()
      });

      const promise = waitFor$(mux, 'test');

      // First call
      mux.emit('test', 42);

      await expect(promise).resolves.toBe(42);
    });
  });
});