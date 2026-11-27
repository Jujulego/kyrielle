import { toSubscribable$ } from '@/src/rx/to-subscribable$.js';
import { describe, expect, it, vi } from 'vitest';

describe('toSubscribable$', () => {
  it('should return a subscribable unchanged', () => {
    const subscribable = { subscribe: vi.fn() };

    expect(toSubscribable$(subscribable)).toBe(subscribable);
  });

  it('should return the subscribable exposed by the observable protocol', () => {
    const subscribable = { subscribe: vi.fn() };
    const observable = {
      [Symbol.observable ?? '@@observable']: vi.fn(() => subscribable),
    };

    expect(toSubscribable$(observable)).toBe(subscribable);
    expect(observable[Symbol.observable ?? '@@observable']).toHaveBeenCalledOnce();
  });

  it('should extract a subscribable exposed through the legacy protocol when Symbol.observable is unavailable', () => {
    const subscribable = { subscribe: vi.fn() };
    const observable = { '@@observable': vi.fn(() => subscribable) };

    expect(toSubscribable$(observable)).toBe(subscribable);
    expect(observable['@@observable']).toHaveBeenCalledOnce();
  });
});
