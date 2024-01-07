import { expect, vi } from 'vitest';

import { deduplicate$ } from '@/src/pipe/deduplicate.js';
import { pipe$ } from '@/src/pipe/pipe.js';
import { ref$ } from '@/src/refs/ref.js';

// Tests
describe('deduplicate$', () => {
  it('should call read only once and return result to every caller', async () => {
    const read = vi.fn(async () => ({ life: 42 }));

    const deduped = pipe$(
      ref$({ read }),
      deduplicate$('read'),
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
      deduplicate$('mutate'),
    );

    await expect(Promise.all([deduped.mutate('life'), deduped.mutate('life')]))
      .resolves.toStrictEqual([{ life: 42 }, { life: 42 }]);

    expect(mutate).toHaveBeenCalledOnce();
  });
});
