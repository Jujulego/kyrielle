import { flat$ } from '@/src/flat$.js';
import { of$ } from '@/src/of$.js';
import { pipe$ } from '@/src/pipe$.js';
import { describe, expect, it, vi } from 'vitest';

describe('flat$', () => {
  it('should emit each item from iterated iterator', () => {
    const res = pipe$(
      [[1, 2], [], [3, 4]],
      flat$()
    );

    expect(res.next()).toStrictEqual({ done: false, value: 1 });
    expect(res.next()).toStrictEqual({ done: false, value: 2 });
    expect(res.next()).toStrictEqual({ done: false, value: 3 });
    expect(res.next()).toStrictEqual({ done: false, value: 4 });
    expect(res.next()).toStrictEqual({ done: true });
  });

  it('should emit each item from async iterated iterator', async () => {
    const generator = (async function* () { yield [1, 2]; yield []; yield [3, 4]; })();
    const res = pipe$(
      generator,
      flat$()
    );

    await expect(res.next()).resolves.toStrictEqual({ done: false, value: 1 });
    await expect(res.next()).resolves.toStrictEqual({ done: false, value: 2 });
    await expect(res.next()).resolves.toStrictEqual({ done: false, value: 3 });
    await expect(res.next()).resolves.toStrictEqual({ done: false, value: 4 });
    await expect(res.next()).resolves.toStrictEqual({ done: true });
  });

  it('should emit each item from emitted iterator', () => {
    const spy = vi.fn();

    pipe$(
      of$([[1, 2], [], [3, 4]]),
      flat$()
    ).subscribe(spy);

    expect(spy).toHaveBeenCalledWith(1);
    expect(spy).toHaveBeenCalledWith(2);
    expect(spy).toHaveBeenCalledWith(3);
    expect(spy).toHaveBeenCalledWith(4);
  });
});