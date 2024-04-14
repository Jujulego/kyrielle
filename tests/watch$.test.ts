import { multiplexer$ } from '@/src/multiplexer$.js';
import { watch$ } from '@/src/watch$.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Multiplexer, Source } from '@/src/defs/index.js';
import { source$ } from '@/src/source$.js';

// Tests
describe('watch$', () => {
  describe('on an observable', () => {
    let source: Source<number>;

    beforeEach(() => {
      source = source$();
    });

    it('should call cleanup before next callback call', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, callback);

      // 1st emit
      source.next(1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // 2nd emit
      source.next(2);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(2);
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup when source completes (from callback)', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, callback);

      // emit
      source.next(1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // complete
      source.complete();

      expect(callback).toHaveBeenCalledOnce();
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup before next observer call', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, { next: callback });

      // 1st emit
      source.next(1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // 2nd emit
      source.next(2);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(2);
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup when source completes (from next)', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, { next: callback });

      // emit
      source.next(1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // complete
      source.complete();

      expect(callback).toHaveBeenCalledOnce();
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup before next observer error call', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, { error: callback });

      // 1st emit
      source.error(new Error('Failed once !'));

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(new Error('Failed once !'));
      expect(cleanup).not.toHaveBeenCalled();

      // 2nd emit
      source.error(new Error('Failed twice !'));

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(new Error('Failed twice !'));
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup when source completes (from error)', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(source, { error: callback });

      // emit
      source.error(new Error('Failed once !'));

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(new Error('Failed once !'));
      expect(cleanup).not.toHaveBeenCalled();

      // complete
      source.complete();

      expect(callback).toHaveBeenCalledOnce();
      expect(cleanup).toHaveBeenCalledOnce();
    });
  });

  describe('on a listenable', () => {
    let multiplexer: Multiplexer<{ life: Source<number> }>;

    beforeEach(() => {
      multiplexer = multiplexer$({
        life: source$<number>(),
      });
    });

    it('should call cleanup before next callback call', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(multiplexer, 'life', callback);

      // 1st emit
      multiplexer.emit('life', 1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // 2nd emit
      multiplexer.emit('life', 2);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(2);
      expect(cleanup).toHaveBeenCalledOnce();
    });

    it('should call cleanup before next observer call', () => {
      const cleanup = vi.fn();
      const callback = vi.fn().mockReturnValue(cleanup);
      watch$(multiplexer, 'life', { next: callback });

      // 1st emit
      multiplexer.emit('life', 1);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(1);
      expect(cleanup).not.toHaveBeenCalled();

      // 2nd emit
      multiplexer.emit('life', 2);

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith(2);
      expect(cleanup).toHaveBeenCalledOnce();
    });
  });
});