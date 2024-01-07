import { expect, vi } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { dedupe$ } from '@/src/pipe/dedupe.js';
import { ref$ } from '@/src/refs/index.js';

// Tests
describe('dedupeRead$', () => {
  it('should call fn only once and return result to every caller', async () => {
    const fn = vi.fn(async () => ({ life: 42 }));

    const ref = pipe$(
      ref$(fn),
      dedupe$(),
    );

    await expect(Promise.all([ref.read(), ref.read()]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(fn).toHaveBeenCalledOnce();
  });
});
