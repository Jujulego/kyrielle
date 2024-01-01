import { vi } from 'vitest';

import { Listener } from '@/src/defs/index.js';
import { group$, GroupObj } from '@/src/events/group.js';
import { multiplexer$, MultiplexerObj } from '@/src/events/multiplexer.js';
import { source$, SourceObj } from '@/src/events/source.js';

// Setup
let int: SourceObj<number>;
let str: SourceObj<string>;
let boo: SourceObj<boolean>;
let grp: GroupObj<{
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
  grp = group$({
    int,
    str,
    deep: multiplexer$({
      boo
    })
  });
});

// Tests
describe('group$', () => {
  it('should call group listener when emitting a child event', () => {
    const listener: Listener<number | string | boolean> = vi.fn();

    grp.subscribe(listener);
    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).toHaveBeenCalledWith(1);
    expect(listener).toHaveBeenCalledWith('toto');
    expect(listener).toHaveBeenCalledWith(true);
  });

  it('should call group listener when a child emits', () => {
    const listener: Listener<number | string | boolean> = vi.fn();

    grp.subscribe(listener);
    int.next(1);

    expect(listener).toHaveBeenCalledWith(1);
  });

  it('should not call removed listeners (off method)', () => {
    const listener: Listener<number | string | boolean> = vi.fn();

    grp.subscribe(listener);
    grp.unsubscribe(listener);

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  it('should not call removed listeners (returned off)', () => {
    const listener: Listener<number | string | boolean> = vi.fn();

    const off = grp.subscribe(listener);
    off();

    grp.emit('int', 1);
    grp.emit('str', 'toto');
    grp.emit('deep.boo', true);

    expect(listener).not.toHaveBeenCalled();
  });

  describe('emit', () => {
    it('should emit child event', () => {
      vi.spyOn(int, 'next');

      grp.emit('int', 1);

      expect(int.next).toHaveBeenCalledWith(1);
    });

    it('should emit deep child event', () => {
      vi.spyOn(boo, 'next');

      grp.emit('deep.boo', true);

      expect(boo.next).toHaveBeenCalledWith(true);
    });

    it('should not emit child event as child doesn\'t exists', () => {
      expect(() => grp.emit('toto' as 'int', 1))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      grp.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should subscribe to deep child event', () => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      grp.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledWith(listener);
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => grp.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('off', () => {
    it('should unsubscribe from child source', () => {
      vi.spyOn(int, 'unsubscribe');
      const listener = vi.fn();

      grp.off('int', listener);

      expect(int.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should unsubscribe from deep child event', () => {
      vi.spyOn(boo, 'unsubscribe');
      const listener = vi.fn();

      grp.off('deep.boo', listener);

      expect(boo.unsubscribe).toHaveBeenCalledWith(listener);
    });

    it('should not unsubscribe from child event as child doesn\'t exists', () => {
      expect(() => grp.off('toto' as 'int', vi.fn()))
        .toThrow(new Error('Child origin toto not found'));
    });
  });

  describe('clear', () => {
    it('should clear child source', () => {
      vi.spyOn(int, 'clear');
      grp.clear('int');

      expect(int.clear).toHaveBeenCalled();
    });

    it('should clear deep child source', () => {
      vi.spyOn(boo, 'clear');
      grp.clear('deep.boo');

      expect(boo.clear).toHaveBeenCalled();
    });

    it('should clear all child sources', () => {
      vi.spyOn(int, 'clear');
      vi.spyOn(str, 'clear');
      vi.spyOn(boo, 'clear');
      grp.clear();

      expect(int.clear).toHaveBeenCalled();
      expect(str.clear).toHaveBeenCalled();
      expect(boo.clear).toHaveBeenCalled();
    });

    it('should not clear child as child doesn\'t exists', () => {
      expect(() => grp.clear('toto' as 'int'))
        .toThrow(new Error('Child origin toto not found'));
    });
  });
});
