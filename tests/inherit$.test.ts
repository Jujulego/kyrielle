import { type Inherit, inherit$ } from '@/src/inherit$.js';
import { type Multiplexer, multiplexer$ } from '@/src/multiplexer$.js';
import { type Source, source$ } from '@/src/source$.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Setup
let a: Source<'a'>;
let b1: Source<'b1'>;
let b2: Source<'b2'>;
let c: Source<'c'>;
let base: Multiplexer<{
  a: typeof a,
  b: typeof b1,
}>;
let override: Multiplexer<{
  b: typeof b2,
  c: typeof c,
}>;
let inherited: Inherit<[typeof base, typeof override]>;

beforeEach(() => {
  a = source$();
  b1 = source$();
  b2 = source$();
  c = source$();

  base = multiplexer$({ a, b: b1 });
  override = multiplexer$({ b: b2, c });

  inherited = inherit$(base, override);
});

// Tests
describe('inherit$', () => {
  describe('getOrigin', () => {
    it('should return origin from base', () => {
      expect(inherited.getOrigin('a')).toBe(a);
      expect(inherited.getOrigin('b')).not.toBe(b1);
    });

    it('should return origin from override', () => {
      expect(inherited.getOrigin('b')).toBe(b2);
      expect(inherited.getOrigin('c')).toBe(c);
    });
  });

  describe('emit', () => {
    it('should emit base child event', () => {
      vi.spyOn(a, 'next');

      inherited.emit('a', 'a');

      expect(a.next).toHaveBeenCalledWith('a');
    });

    it('should emit overridden child event', () => {
      vi.spyOn(b1, 'next');
      vi.spyOn(b2, 'next');

      inherited.emit('b', 'b2');

      expect(b1.next).not.toHaveBeenCalled();
      expect(b2.next).toHaveBeenCalledWith('b2');
    });

    it('should not emit child event as child doesn\'t exists', () => {
      expect(() => inherited.emit('toto' as 'a', 'a'))
        .toThrow(new Error('Unsupported emit key toto'));
    });
  });

  describe('on', () => {
    it('should subscribe to base child event', () => {
      vi.spyOn(a, 'subscribe');
      const listener = vi.fn();

      inherited.on('a', listener);

      expect(a.subscribe).toHaveBeenCalledWith(expect.objectContaining({
        next: listener
      }));
    });

    it('should subscribe to overridden child event', () => {
      vi.spyOn(b1, 'subscribe');
      vi.spyOn(b2, 'subscribe');
      const listener = vi.fn();

      inherited.on('b', listener);

      expect(b1.subscribe).not.toHaveBeenCalled();
      expect(b2.subscribe).toHaveBeenCalledWith(expect.objectContaining({
        next: listener
      }));
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => inherited.on('toto' as 'a', () => null))
        .toThrow(new Error('Unsupported listen key toto'));
    });
  });
});
