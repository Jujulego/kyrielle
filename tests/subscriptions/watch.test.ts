import { vi } from 'vitest';

import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { watch$ } from '@/src/subscriptions/watch.js';
import { source$, SourceObj } from '@/src/events/source.js';

// Setup
let src: SourceObj<number>;
let mlt: MultiplexerObj<{ src: SourceObj<number> }>;

beforeEach(() => {
  src = source$();
  mlt = multiplexer$({ src });
});

// Tests
describe('watch$', () => {
  describe('on an observable', () => {
    it('should call fn when the reference changes', () => {
      const fn = vi.fn();

      watch$(src, fn);
      src.next(42);

      expect(fn).toHaveBeenCalledWith(42);
    });

    it('should call cb before next fn call', () => {
      const cb = vi.fn();

      watch$(src, () => cb);
      src.next(41);

      expect(cb).not.toHaveBeenCalled();

      src.next(42);

      expect(cb).toHaveBeenCalled();
    });

    it('should not call fn if off has been called', () => {
      const fn = vi.fn();

      const off = watch$(src, fn);
      off();

      src.next(42);

      expect(fn).not.toHaveBeenCalled();
    });
  });

  describe('on a listenable', () => {
    it('should call fn when the reference changes', () => {
      const fn = vi.fn();

      watch$(mlt, 'src', fn);
      mlt.emit('src', 42);

      expect(fn).toHaveBeenCalledWith(42);
    });

    it('should call cb before next fn call', () => {
      const cb = vi.fn();

      watch$(mlt, 'src', () => cb);
      mlt.emit('src', 41);

      expect(cb).not.toHaveBeenCalled();

      mlt.emit('src', 42);

      expect(cb).toHaveBeenCalled();
    });

    it('should not call fn if off has been called', () => {
      const fn = vi.fn();

      const off = watch$(mlt, 'src', fn);
      off();

      mlt.emit('src', 42);

      expect(fn).not.toHaveBeenCalled();
    });
  });
});
