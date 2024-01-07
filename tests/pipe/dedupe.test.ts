import { expect, vi } from 'vitest';

import { pipe$ } from '@/src/pipe/pipe.js';
import { dedupe$ } from '@/src/pipe/dedupe.js';
import { ref$ } from '@/src/refs/index.js';

// Tests
describe('dedupe$', () => {
  it('should call read only once and return result to every caller', async () => {
    const read = vi.fn(async () => ({ life: 42 }));

    const deduped = pipe$(
      ref$({ read }),
      dedupe$('read'),
    );

    await expect(Promise.all([deduped.read(), deduped.read()]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(read).toHaveBeenCalledOnce();
  });

  it('should call mutate only once and return result to every caller', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const mutate = vi.fn(async (_: string) => ({ life: 42 }));

    const deduped = pipe$(
      ref$({
        read: async () => ({ life: 42 }),
        mutate,
      }),
      dedupe$('mutate'),
    );

    await expect(Promise.all([deduped.mutate('life'), deduped.mutate('life')]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(mutate).toHaveBeenCalledOnce();
  });
});
