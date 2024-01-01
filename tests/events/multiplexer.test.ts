import { vi } from 'vitest';

import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { source$, SourceObj } from '@/src/events/source.js';

// Setup
let int: SourceObj<number>;
let str: SourceObj<string>;
let boo: SourceObj<boolean>;
let mlt: MultiplexerObj<{
  int: SourceObj<number>,
  str: SourceObj<string>,
  deep: MultiplexerObj<{
    boo: SourceObj<boolean>,
  }>
}>;

beforeEach(() => {
  int = source$();
  str = source$();
  boo = source$();
  mlt = multiplexer$({
    int,
    str,
    deep: multiplexer$({
      boo
    })
  });
});

// Tests
describe('multiplexer$', () => {
  it('should return all available keys', () => {
    expect(Array.from(mlt.eventKeys())).toEqual(['int', 'str', 'deep.boo']);
  });

  describe('emit', () => {
    it('should emit child event', () => {
      vi.spyOn(int, 'next');

      mlt.emit('int', 1);

      expect(int.next).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', () => {
      vi.spyOn(boo, 'next');

      mlt.emit('deep.boo', true);

      expect(boo.next).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', () => {
      expect(() => mlt.emit('toto' as 'int', 1))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      mlt.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      mlt.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => mlt.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      vi.spyOn(int, 'unsubscribe');
      const listener = vi.fn();

      mlt.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      vi.spyOn(boo, 'unsubscribe');
      const listener = vi.fn();

      mlt.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', () => {
      expect(() => mlt.off('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      vi.spyOn(int, 'clear');
      mlt.clear('int');

      expect(int.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      vi.spyOn(boo, 'clear');
      mlt.clear('deep.boo');

      expect(boo.clear).toHaveBeenCalled();
    });

    it('should clear all child sources', () => {
      vi.spyOn(int, 'clear');
      vi.spyOn(str, 'clear');
      vi.spyOn(boo, 'clear');
      mlt.clear();

      expect(int.clear).toHaveBeenCalled();
      expect(str.clear).toHaveBeenCalled();
      expect(boo.clear).toHaveBeenCalled();
    });

    it('should not clear child as child doesn\'t exists', () => {
      expect(() => mlt.clear('toto' as 'int'))
        .toThrow(new Error('Child origin toto not found'));
    });
  });
});
