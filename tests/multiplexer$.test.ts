import type { Multiplexer } from '@/src/bases/_multiplexer.js';
import { multiplexer$ } from '@/src/multiplexer$.js';
import { type Source, source$ } from '@/src/source$.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Setup
let int: Source<number>;
let str: Source<string>;
let boo: Source<boolean>;
let mlt: Multiplexer<{
  int: Source<number>,
  str: Source<string>,
  deep: Multiplexer<{
    boo: Source<boolean>,
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
        .toThrow(new Error('Unsupported emit key toto'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      mlt.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(expect.objectContaining({
        next: listener
      }));
    });

    it('should subscribe to deep child event', () => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      mlt.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(expect.objectContaining({
        next: listener
      }));
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => mlt.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Unsupported listen key toto'));
    });
  });
});
