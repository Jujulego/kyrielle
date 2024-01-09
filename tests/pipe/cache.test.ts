import { expect, vi } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { cache$ } from '@/src/pipe/cache.js';
import { ref$, var$ } from '@/src/refs/index.js';

// Tests
describe('cache$', () => {
  it('should call read only once and return result synchronously', () => {
    const read = vi.fn(() => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$({ read }),
      cache$(cache),
    );

    expect(ref.read()).toStrictEqual({ life: 42 });
    expect(ref.read()).toStrictEqual({ life: 42 });

    expect(read).toHaveBeenCalledOnce();
    expect(cache.read()).toStrictEqual({ life: 42 });
  });

  it('should call read only once and return result asynchronously', async () => {
    const read = vi.fn(async () => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$({ read }),
      cache$(cache),
    );

    await expect(Promise.all([ref.read(), ref.read()]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(ref.read()).toStrictEqual({ life: 42 }); // <= synchronous as cached

    expect(read).toHaveBeenCalledOnce();
    expect(cache.read()).toStrictEqual({ life: 42 });
  });

  it('should use target function to get cache reference', () => {
    const read = vi.fn(() => ({ life: 42 }));
    const cache = var$<{ life: number }>();

    const ref = pipe$(
      ref$({ read }),
      cache$(() => cache),
    );

    expect(ref.read()).toStrictEqual({ life: 42 });
    expect(cache.read()).toStrictEqual({ life: 42 });
  });
});
