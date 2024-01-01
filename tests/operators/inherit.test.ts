import { vi } from 'vitest';

import { Listener } from '@/src/defs/common.js';
import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { inherit$ } from '@/src/operators/inherit.js';
import { source$, SourceObj } from '@/src/events/source.js';

// Setup
let mlt: MultiplexerObj<{
  a: SourceObj<'a'>,
  b: SourceObj<'b'>,
}>;
let src: SourceObj<'c'>;
let int: SourceObj<number>;

beforeEach(() => {
  mlt = multiplexer$({
    a: source$(),
    b: source$(),
  });
  src = source$();
  int = source$<number>();
});

// Tests
describe('inherit$', () => {
  describe('next', () => {
    it('should emit from int', () => {
      vi.spyOn(int, 'next');
      vi.spyOn(src, 'next');

      const child = inherit$(int, { c: src });
      child.next(42);

      expect(int.next).toHaveBeenCalledWith(42);
      expect(src.next).not.toHaveBeenCalled();
    });

    it('should emit from src', () => {
      vi.spyOn(mlt, 'emit');
      vi.spyOn(src, 'next');

      const child = inherit$(mlt, { c: src });
      child.emit('c', 'c');

      expect(mlt.emit).not.toHaveBeenCalled();
      expect(src.next).toHaveBeenCalledWith('c');
    });

    it('should emit from src (overriding mlt)', () => {
      vi.spyOn(mlt, 'emit');
      vi.spyOn(src, 'next');

      const child = inherit$(mlt, { a: src });
      child.emit('a', 'c');

      expect(mlt.emit).not.toHaveBeenCalled();
      expect(src.next).toHaveBeenCalledWith('c');
    });

    it('should emit from mlt', () => {
      vi.spyOn(mlt, 'emit');
      vi.spyOn(src, 'next');

      const child = inherit$(mlt, { c: src });
      child.emit('a', 'a');

      expect(mlt.emit).toHaveBeenCalledWith('a', 'a');
      expect(src.next).not.toHaveBeenCalled();
    });
  });

  describe('subscribe', () => {
    it('should subscribe from int', () => {
      vi.spyOn(int, 'subscribe');

      const listener: Listener<number> = vi.fn();
      const child = inherit$(int, { c: src });
      child.subscribe(listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe from int', () => {
      vi.spyOn(int, 'unsubscribe');

      const listener: Listener<number> = vi.fn();
      const child = inherit$(int, { c: src });
      child.unsubscribe(listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });
  });

  describe('on', () => {
    it('should subscribe to src', () => {
      vi.spyOn(mlt, 'on');
      vi.spyOn(src, 'subscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { c: src });
      child.on('c', listener);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to src (overriding mlt)', () => {
      vi.spyOn(mlt, 'on');
      vi.spyOn(src, 'subscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { a: src });
      child.on('a', listener);

      expect(mlt.on).not.toHaveBeenCalled();
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to mlt', () => {
      vi.spyOn(mlt, 'on');
      vi.spyOn(src, 'subscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { c: src });
      child.on('a', listener);

      expect(mlt.on).toHaveBeenCalledWith('a', listener);
      expect(src.subscribe).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should unsubscribe from src', () => {
      vi.spyOn(mlt, 'off');
      vi.spyOn(src, 'unsubscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { c: src });
      child.off('c', listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from src (overriding mlt)', () => {
      vi.spyOn(mlt, 'off');
      vi.spyOn(src, 'unsubscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { a: src });
      child.off('a', listener);

      expect(mlt.off).not.toHaveBeenCalled();
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from mlt', () => {
      vi.spyOn(mlt, 'off');
      vi.spyOn(src, 'unsubscribe');
      const listener = vi.fn();

      const child = inherit$(mlt, { c: src });
      child.off('a', listener);

      expect(mlt.off).toHaveBeenCalledWith('a', listener);
      expect(src.unsubscribe).not.toHaveBeenCalled();
    });
  });

  describe('clear', () => {
    it('should clear src', () => {
      vi.spyOn(mlt, 'clear');
      vi.spyOn(src, 'clear');

      const child = inherit$(mlt, { c: src });
      child.clear('c');

      expect(mlt.clear).not.toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear from src (overriding mlt)', () => {
      vi.spyOn(mlt, 'clear');
      vi.spyOn(src, 'clear');

      const child = inherit$(mlt, { a: src });
      child.clear('a');

      expect(mlt.clear).not.toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
    });

    it('should unsubscribe from mlt', () => {
      vi.spyOn(mlt, 'clear');
      vi.spyOn(src, 'clear');

      const child = inherit$(mlt, { c: src });
      child.clear('a');

      expect(mlt.clear).toHaveBeenCalledWith('a');
      expect(src.clear).not.toHaveBeenCalled();
    });

    it('should unsubscribe from src and mlt', () => {
      vi.spyOn(mlt, 'clear');
      vi.spyOn(src, 'clear');

      const child = inherit$(mlt, { c: src });
      child.clear();

      expect(mlt.clear).toHaveBeenCalled();
      expect(src.clear).toHaveBeenCalled();
    });
  });
});
