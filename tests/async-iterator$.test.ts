import { asyncIterator$ } from '@/src/async-iterator$.js';
import { describe, expect, it, vi } from 'vitest';

describe('asyncIterator$', () => {
  it('should call given next function', async () => {
    const next = vi.fn(async () => ({ value: 42 }));
    const iterator = asyncIterator$({ next });

    await expect(iterator.next()).resolves.toStrictEqual({ done: false, value: 42 });
    expect(next).toHaveBeenCalledOnce();
  });

  it('should accept an async generator', async () => {
    const generator = (async function* () { yield 1; yield 2; yield 3; })();
    const iterator = asyncIterator$(generator);

    await expect(iterator.next()).resolves.toStrictEqual({ done: false, value: 1 });
    await expect(iterator.next()).resolves.toStrictEqual({ done: false, value: 2 });
    await expect(iterator.next()).resolves.toStrictEqual({ done: false, value: 3 });
    await expect(iterator.next()).resolves.toStrictEqual({ done: true });
  });
});