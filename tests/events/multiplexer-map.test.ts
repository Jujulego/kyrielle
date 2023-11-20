import { vi } from 'vitest';

import { Emitter, KeyEmitter, Listenable, Observable } from '@/src/defs/index.js';
import { multiplexerMap$ } from '@/src/events/multiplexer-map.js';
import { multiplexer$ } from '@/src/events/multiplexer.js';
import { source$ } from '@/src/source.js';

// Tests
describe('multiplexerMap', () => {
  it('should return all available keys', () => {
    const mlt = multiplexerMap$(() => multiplexer$({
      int: source$<number>(),
      deep: multiplexer$({
        boo: source$<boolean>()
      })
    }));

    expect(Array.from(mlt.eventKeys())).toEqual([]);

    // "create" a child source
    mlt.emit('test.int', 42);

    expect(Array.from(mlt.eventKeys())).toEqual(['test.int', 'test.deep.boo']);
  });

  describe('emit', () => {
    it('should emit child event', () => {
      const src: Emitter<number> = {
        next: vi.fn(),
      };

      const builder = vi.fn(() => src);

      const mlt = multiplexerMap$(builder);
      mlt.emit('life', 42);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.next).toHaveBeenCalledWith(42);
    });

    it('should emit deep child event', () => {
      const deep: KeyEmitter<{ 'life': number }> = {
        emit: vi.fn(),
      };

      const builder = vi.fn(() => deep);

      const mlt = multiplexerMap$(builder);
      mlt.emit('deep.life', 42);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.emit).toHaveBeenCalledWith('life', 42);
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const builder = vi.fn(() => src);
      const mlt = multiplexerMap$(builder);

      const listener = vi.fn();
      expect(mlt.on('life', listener)).toBe(off);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        eventKeys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const builder = vi.fn(() => deep);
      const mlt = multiplexerMap$(builder);

      const listener = vi.fn();
      expect(mlt.on('deep.life', listener)).toBe(off);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.on).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const builder = vi.fn(() => src);
      const mlt = multiplexerMap$(builder);

      const listener = vi.fn();
      mlt.off('life', listener);

      expect(builder).toHaveBeenCalledWith('life');
      expect(src.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        eventKeys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const builder = vi.fn(() => deep);
      const mlt = multiplexerMap$(builder);

      const listener = vi.fn();
      mlt.off('deep.life', listener);

      expect(builder).toHaveBeenCalledWith('deep');
      expect(deep.off).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      const off = vi.fn();
      const src: Observable<number> = {
        subscribe: vi.fn(() => off),
        unsubscribe: vi.fn(),
        clear: vi.fn(),
      };

      const mlt = multiplexerMap$(() => src);
      mlt.on('life', () => null); // <= creates source
      mlt.clear('life');

      expect(src.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        eventKeys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const mlt = multiplexerMap$(() => deep);
      mlt.on('deep.life', () => null); // <= creates source
      mlt.clear('deep.life');

      expect(deep.clear).toHaveBeenCalledWith('life');
    });

    it('should clear all child sources', () => {
      const off = vi.fn();
      const deep: Listenable<{ 'life': number }> = {
        eventKeys: () => ['life'],
        on: vi.fn(() => off),
        off: vi.fn(),
        clear: vi.fn(),
      };

      const mlt = multiplexerMap$(() => deep);
      mlt.on('deep1.life', () => null); // <= creates source
      mlt.on('deep2.life', () => null); // <= creates source
      mlt.clear();

      expect(deep.clear).toHaveBeenCalledTimes(2); // (one for each "created" sources)
    });
  });
});
