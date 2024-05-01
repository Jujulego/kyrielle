import { beforeEach, describe, expect, it, vi } from 'vitest';

import { of$ } from '@/src/of$.js';

beforeEach(() => {
  vi.useFakeTimers();
});

// Tests
describe('of$', () => {
  it('should emit every item from given array', () => {
    const spyNext = vi.fn();
    const spyComplete = vi.fn();

    const result = of$([1, 2, 3]);
    result.subscribe({ next: spyNext, complete: spyComplete });

    expect(spyNext).toHaveBeenCalledWith(1);
    expect(spyNext).toHaveBeenCalledWith(2);
    expect(spyNext).toHaveBeenCalledWith(3);
    expect(spyNext).toHaveBeenCalledTimes(3);
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should emit every item from given async iterator', async () => {
    const spyNext = vi.fn();
    const spyComplete = vi.fn();

    const result = of$((async function* () {
      yield 1;
      yield 2;
      yield 3;
    })());
    result.subscribe({ next: spyNext, complete: spyComplete });

    await vi.waitFor(() => expect(spyNext).toHaveBeenCalledWith(1));
    await vi.waitFor(() => expect(spyNext).toHaveBeenCalledWith(2));
    await vi.waitFor(() => expect(spyNext).toHaveBeenCalledWith(3));
    expect(spyNext).toHaveBeenCalledTimes(3);
    expect(spyComplete).toHaveBeenCalled();
  });

  it('should stop emitting on unsub', async () => {
    const spyNext = vi.fn();
    const spyComplete = vi.fn();

    const result = of$((async function* () {
      yield 1;

      await new Promise((resolve) => setTimeout(resolve, 1000));
      yield 2;
      yield 3;
    })());
    const unsub = result.subscribe({ next: spyNext, complete: spyComplete });

    await vi.waitFor(() => expect(spyNext).toHaveBeenCalledWith(1));
    unsub.unsubscribe();

    await vi.advanceTimersByTimeAsync(2000);
    expect(spyNext).toHaveBeenCalledTimes(1);
  });
});