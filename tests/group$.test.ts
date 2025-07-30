import { type Group, group$ } from '@/src/group$.js';
import { merge$ } from '@/src/merge$.js';
import { observable$ } from '@/src/observable$.js';
import { type Source, source$ } from '@/src/source$.js';
import type { Observer } from '@/src/types/inputs/Observer.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Setup
let int: Source<number>;
let str: Source<string>;
let boo: Source<boolean>;
let grp: Group<{
  int: Source<number>,
  str: Source<string>,
  deep: Group<{
    boo: Source<boolean>,
  }>
}>;

beforeEach(() => {
  int = source$();
  str = source$();
  boo = source$();
  grp = group$({
    int,
    str,
    deep: group$({
      boo
    }),
  });
});

// Tests
describe('group$', () => {
  it('should emit all events from given sources', () => {
    const spy = vi.fn();
    grp.subscribe(spy);

    int.next(97);
    str.next('98');
    boo.next(true);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(97);
    expect(spy).toHaveBeenCalledWith('98');
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('should only complete once all sources have completed', () => {
    const spy = vi.fn();
    grp.subscribe({ complete: spy });

    int.complete();
    expect(spy).not.toHaveBeenCalled();

    str.complete();
    expect(spy).not.toHaveBeenCalled();

    boo.complete();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should unsubscribe to all sources, on observable abort', () => {
    const fn = vi.fn();
    const grouped = group$({
      a: observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
      b: observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
      c: observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
    });

    const sub = grouped.subscribe(vi.fn());
    sub.unsubscribe();

    expect(fn).toHaveBeenCalledTimes(3);
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
        .toThrow(new Error('Unsupported emit key toto'));
    });
  });

  describe('on', () => {
    it('should subscribe to child source', () => {
      vi.spyOn(int, 'subscribe');
      const listener = vi.fn();

      grp.on('int', listener);

      expect(int.subscribe).toHaveBeenCalledWith(expect.objectContaining({
        next: listener
      }));
    });

    it('should subscribe to deep child event', () => {
      vi.spyOn(boo, 'subscribe');
      const listener = vi.fn();

      grp.on('deep.boo', listener);

      expect(boo.subscribe).toHaveBeenCalledOnce();

      (vi.mocked(boo.subscribe).mock.calls[0]![0] as unknown as Observer<boolean>).next(true);
      expect(listener).toHaveBeenCalledWith(true);
    });

    it('should not subscribe to child event as child doesn\'t exists', () => {
      expect(() => grp.on('toto' as 'int', vi.fn()))
        .toThrow(new Error('Unsupported listen key toto'));
    });
  });
});
