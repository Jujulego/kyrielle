import { describe, expect, it, vi } from 'vitest';

import { multiplexer$ } from '@/src/multiplexer$.js';
import { once$ } from '@/src/once$.js';
import { source$ } from '@/src/source$.js';

// Tests
describe('once$', () => {
  describe('with an observer', () => {
    it('should be unsubscribed after first call', () => {
      const spy = vi.fn();
      const source = source$<number>();

      const sub = once$(source, spy);
      vi.spyOn(sub, 'unsubscribe');

      // First call
      source.next(42);

      expect(spy).toHaveBeenCalledWith(42);
      expect(sub.unsubscribe).toHaveBeenCalled();

      // Next call
      source.next(1);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should be unsubscribed after first next call', () => {
      const spy = vi.fn();
      const source = source$<number>();

      const sub = once$(source, { next: spy });
      vi.spyOn(sub, 'unsubscribe');

      // First call
      source.next(42);

      expect(spy).toHaveBeenCalledWith(42);
      expect(sub.unsubscribe).toHaveBeenCalled();

      // Next call
      source.next(1);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should be unsubscribed after first error call', () => {
      const spy = vi.fn();
      const source = source$<number>();

      const sub = once$(source, { error: spy });
      vi.spyOn(sub, 'unsubscribe');

      // First call
      source.error(42);

      expect(spy).toHaveBeenCalledWith(42);
      expect(sub.unsubscribe).toHaveBeenCalled();

      // Next call
      source.error(1);

      expect(spy).toHaveBeenCalledOnce();
    });
  });

  describe('with a listener', () => {
    it('should be unsubscribed after first call', () => {
      const spy = vi.fn();
      const mux = multiplexer$({
        test: source$<number>()
      });

      const sub = once$(mux, 'test', spy);
      vi.spyOn(sub, 'unsubscribe');

      // First call
      mux.emit('test', 42);

      expect(spy).toHaveBeenCalledWith(42);
      expect(sub.unsubscribe).toHaveBeenCalled();

      // Next call
      mux.emit('test', 1);

      expect(spy).toHaveBeenCalledOnce();
    });

    it('should be unsubscribed after first next call', () => {
      const spy = vi.fn();
      const mux = multiplexer$({
        test: source$<number>()
      });

      const sub = once$(mux, 'test', { next: spy });
      vi.spyOn(sub, 'unsubscribe');

      // First call
      mux.emit('test', 42);

      expect(spy).toHaveBeenCalledWith(42);
      expect(sub.unsubscribe).toHaveBeenCalled();

      // Next call
      mux.emit('test', 1);

      expect(spy).toHaveBeenCalledOnce();
    });
  });
});