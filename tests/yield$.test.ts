import { source$ } from '@/src/source$.js';
import { describe, expect, it, vi } from 'vitest';

import { pipe$ } from '@/src/pipe$.js';
import { yield$ } from '@/src/yield$.js';

// Tests
describe('yield$', () => {
  it('should emit defer result', () => {
    const res = pipe$(
      { defer: () => 42 },
      yield$()
    );

    const cb = vi.fn();
    res.subscribe(cb);

    expect(res.defer()).toBe(42);
    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should emit resolved defer result', async () => {
    const res = pipe$(
      { defer: async () => 42 },
      yield$()
    );

    const cb = vi.fn();
    res.subscribe(cb);

    await expect(res.defer()).resolves.toBe(42);
    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should emit mutate result', () => {
    const res = pipe$(
      { mutate: (_: string) => 42 },
      yield$()
    );

    const cb = vi.fn();
    res.subscribe(cb);

    expect(res.mutate('life')).toBe(42);
    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should emit resolved mutate result', async () => {
    const res = pipe$(
      { mutate: async (_: string) => 42 },
      yield$()
    );

    const cb = vi.fn();
    res.subscribe(cb);

    await expect(res.mutate('life')).resolves.toBe(42);
    expect(cb).toHaveBeenCalledWith(42);
  });

  it('should emit each emitted value', () => {
    const src = source$<number>();
    vi.spyOn(src, 'subscribe');

    const res = pipe$(src, yield$());
    expect(src.subscribe).not.toHaveBeenCalled();

    const cb = vi.fn();
    res.subscribe(cb);
    expect(src.subscribe).toHaveBeenCalledOnce();

    src.next(42);
    expect(cb).toHaveBeenCalledWith(42);
  });
});
