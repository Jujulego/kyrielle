import { observable$, type SubscriberObserver } from '@/src/observable$.js';
import type { Observer } from '@/src/types/inputs/Observer.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Tests
describe('observable$', () => {
  it('should call subscriber on first subscribe', async () => {
    const subscriber = vi.fn(() => {});
    const observable = observable$(subscriber);

    expect(subscriber).not.toHaveBeenCalled();

    observable.subscribe(() => {});

    await vi.waitFor(() => expect(subscriber).toHaveBeenCalledWith(expect.anything(), expect.any(AbortSignal)));
  });

  it('should abort subscriber using signal when all subscription are unsubscribed & call subscriber again on next subscription', async () => {
    const subscriber = vi.fn<(obs: SubscriberObserver, sig: AbortSignal) => Promise<void>>(() => new Promise<void>(() => {}));
    const observable = observable$(subscriber);

    // first subscription
    const sub1 = observable.subscribe(() => {});

    await vi.waitFor(() => expect(subscriber).toHaveBeenCalledOnce());

    const signal1 = subscriber.mock.calls[0]![1];
    expect(signal1.aborted).toBe(false);

    sub1.unsubscribe();

    expect(signal1.aborted).toBe(true);

    // second subscription
    observable.subscribe(() => {});

    await vi.waitFor(() => expect(subscriber).toHaveBeenCalledTimes(2));

    const signal2 = subscriber.mock.calls[1]![1];
    expect(signal2.aborted).toBe(false);
  });

  describe('subscribe', () => {
    let observer: Observer;

    beforeEach(() => {
      observer = {
        start: vi.fn(),
        next: vi.fn(),
        error: vi.fn(),
        complete: vi.fn(),
      };
    });

    it('should call start with subscription, on subscribe', () => {
      const observable = observable$(() => {});
      const sub = observable.subscribe(observer);

      expect(observer.start).toHaveBeenCalledWith(sub);
    });

    it('should call next when subscriber calls next', () => {
      const observable = observable$<number>((observer) => {
        observer.next(42);
      });

      observable.subscribe(observer);

      expect(observer.next).toHaveBeenCalledWith(42);
    });

    it('should call error when subscriber calls error', () => {
      const observable = observable$((observer) => {
        observer.error(new Error('Failed !'));
      });

      observable.subscribe(observer);

      expect(observer.error).toHaveBeenCalledWith(new Error('Failed !'));
    });

    it('should call error when subscriber throws, completes, and close subscription', () => {
      const observable = observable$(() => {
        throw new Error('Failed !');
      });

      const sub = observable.subscribe(observer);

      expect(observer.error).toHaveBeenCalledWith(new Error('Failed !'));
      expect(observer.complete).toHaveBeenCalledOnce();

      expect(sub.closed).toBe(true);
    });

    it('should call complete when subscriber calls complete, and close subscription', async () => {
      const observable = observable$((observer) => {
        observer.complete();
      });

      const sub = observable.subscribe(observer);

      expect(observer.complete).toHaveBeenCalledOnce();

      expect(sub.closed).toBe(true);
    });

    it('should unsubscribe from observable', () => {
      const observable = observable$<number>((observer) => {
        queueMicrotask(() => observer.next(42));
      });

      const sub = observable.subscribe(observer);
      sub.unsubscribe();

      expect(sub.closed).toBe(true);

      expect(observer.next).not.toHaveBeenCalled();
      expect(observer.error).not.toHaveBeenCalled();
      expect(observer.complete).not.toHaveBeenCalled();
    });
  });
});
