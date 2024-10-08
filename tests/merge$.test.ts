import { observable$ } from '@/src/observable$.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Source } from '@/src/defs/index.js';
import { merge$ } from '@/src/merge$.js';
import { source$ } from '@/src/source$.js';

// Tests
let a: Source<number>;
let b: Source<number>;
let c: Source<number>;

beforeEach(() => {
  a = source$<number>();
  b = source$<number>();
  c = source$<number>();
});

describe('merge$', () => {
  it('should emit all events from given sources', () => {
    const merged = merge$(a, b, c);
    const spy = vi.fn();

    merged.subscribe(spy);

    a.next(97);
    b.next(98);
    c.next(99);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith(97);
    expect(spy).toHaveBeenCalledWith(98);
    expect(spy).toHaveBeenCalledWith(99);
  });

  it('should only complete once all sources have completed', () => {
    const merged = merge$(a, b, c);
    const spy = vi.fn();

    merged.subscribe({ complete: spy });

    a.complete();
    expect(spy).not.toHaveBeenCalled();

    b.complete();
    expect(spy).not.toHaveBeenCalled();

    c.complete();
    expect(spy).toHaveBeenCalledOnce();
  });

  it('should unsubscribe to all sources, on observable abort', () => {
    const fn = vi.fn();
    const merged = merge$(
      observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
      observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
      observable$<number>((_, signal) => {
        signal.addEventListener('abort', fn, { once: true });
      }),
    );

    const sub = merged.subscribe(vi.fn());
    sub.unsubscribe();

    expect(fn).toHaveBeenCalledTimes(3);
  });
});
