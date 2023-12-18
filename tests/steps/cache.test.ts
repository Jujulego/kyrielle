import { expect, vi } from 'vitest';

import { pipe$ } from '@/src/operators/pipe.js';
import { cache$ } from '@/src/steps/cache.js';
import { ref$, var$ } from '@/src/refs/index.js';

// Tests
describe('cache$', () => {
  it('should call fn only once and return result synchronously', () => {
    const fn = vi.fn(() => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$(fn),
      cache$(cache),
    );

    expect(ref.read()).toStrictEqual({ life: 42 });
    expect(ref.read()).toStrictEqual({ life: 42 });

    expect(fn).toHaveBeenCalledOnce();
    expect(cache.read()).toStrictEqual({ life: 42 });
  });

  it('should call fn only once and return result asynchronously', async () => {
    const fn = vi.fn(async () => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$(fn),
      cache$(cache),
    );

    await expect(Promise.all([ref.read(), ref.read()]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(ref.read()).toStrictEqual({ life: 42 }); // <= synchronous as cache

    expect(fn).toHaveBeenCalledOnce();
    expect(cache.read()).toStrictEqual({ life: 42 });
  });

  it('should use target function to get cache reference', () => {
    const fn = vi.fn(() => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$(fn),
      cache$(() => cache),
    );

    expect(ref.read()).toStrictEqual({ life: 42 });
    expect(cache.read()).toStrictEqual({ life: 42 });
  });
});
