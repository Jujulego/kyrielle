import { pipe$ } from '@/src/pipe$.js';
import { yield$ } from '@/src/yield$.js';
import { describe, expect, it, vi } from 'vitest';

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
});
