import { multiplexer$ } from '@/src/multiplexer$.js';
import { pick$ } from '@/src/pick$.js';
import { source$ } from '@/src/source$.js';
import type { Subscription } from '@/src/types/outputs/Subscription.js';
import { describe, expect, it, vi } from 'vitest';

describe('pick$', () => {
  it('should only subscribe on event while observable is subscribed', () => {
    const mlt = multiplexer$({
      test: source$<number>(),
    });

    const unsubscribe = vi.fn();
    vi.spyOn(mlt, 'on').mockReturnValue({ unsubscribe } as unknown as Subscription);

    // Pick
    const obs = pick$(mlt, 'test');
    expect(mlt.on).not.toHaveBeenCalled();

    // Subscribe
    const sub = obs.subscribe();
    expect(mlt.on).toHaveBeenCalledExactlyOnceWith('test', expect.anything());

    // Unsubscribe
    sub.unsubscribe();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it('should emit every emitted events', () => {
    const mlt = multiplexer$({
      test: source$<number>(),
    });

    const spy = vi.fn();
    pick$(mlt, 'test').subscribe(spy);

    mlt.emit('test', 42);
    expect(spy).toHaveBeenCalledExactlyOnceWith(42);
  });
});