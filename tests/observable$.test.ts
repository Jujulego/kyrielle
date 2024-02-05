import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Observer } from '@/src/defs/index.js';
import { observable$, SubscriberObserver } from '@/src/observable$.js';

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
    const subscriber = vi.fn<[SubscriberObserver, AbortSignal], Promise<void>>(() => new Promise<void>(() => {}));
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

  describe('subscribe with callbacks', () => {
    it('should call onNext when subscriber calls next', async () => {
      const observable = observable$<number>((observer) => {
        observer.next(42);
      });

      const onNext = vi.fn();
      observable.subscribe(onNext);

      await vi.waitFor(() => expect(onNext).toHaveBeenCalledWith(42));
    });

    it('should call onError when subscriber calls error', async () => {
      const observable = observable$((observer) => {
        observer.error(new Error('Failed !'));
      });

      const onError = vi.fn();
      observable.subscribe(() => {}, onError);

      await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(new Error('Failed !')));
    });

    it('should call onError when subscriber throws, completes, and close subscription', async () => {
      const observable = observable$(() => {
        throw new Error('Failed !');
      });

      const onError = vi.fn();
      const onComplete = vi.fn();
      const sub = observable.subscribe(() => {}, onError, onComplete);

      await vi.waitFor(() => expect(onError).toHaveBeenCalledWith(new Error('Failed !')));
      await vi.waitFor(() => expect(onComplete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should call onComplete when subscriber calls complete, and close subscription', async () => {
      const observable = observable$((observer) => {
        observer.complete();
      });

      const onComplete = vi.fn();
      const sub = observable.subscribe(() => {}, () => {}, onComplete);

      await vi.waitFor(() => expect(onComplete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should call onComplete when subscriber ends, and close subscription', async () => {
      const observable = observable$(() => {});

      const onComplete = vi.fn();
      const sub = observable.subscribe(() => {}, () => {}, onComplete);

      await vi.waitFor(() => expect(onComplete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should unsubscribe from observable', () => {
      const observable = observable$<number>((observer) => {
        observer.next(42);
      });

      const onNext = vi.fn();
      const onError = vi.fn();
      const onComplete = vi.fn();

      const sub = observable.subscribe(onNext, onError, onComplete);
      sub.unsubscribe();

      expect(sub.closed).toBe(true);

      expect(onNext).not.toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(onComplete).not.toHaveBeenCalled();
    });
  });

  describe('subscribe with observer', () => {
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

    it('should call next when subscriber calls next', async () => {
      const observable = observable$<number>((observer) => {
        observer.next(42);
      });

      observable.subscribe(observer);

      await vi.waitFor(() => expect(observer.next).toHaveBeenCalledWith(42));
    });

    it('should call error when subscriber calls error', async () => {
      const observable = observable$((observer) => {
        observer.error(new Error('Failed !'));
      });

      observable.subscribe(observer);

      await vi.waitFor(() => expect(observer.error).toHaveBeenCalledWith(new Error('Failed !')));
    });

    it('should call error when subscriber throws, completes, and close subscription', async () => {
      const observable = observable$(() => {
        throw new Error('Failed !');
      });

      const sub = observable.subscribe(observer);

      await vi.waitFor(() => expect(observer.error).toHaveBeenCalledWith(new Error('Failed !')));
      await vi.waitFor(() => expect(observer.complete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should call complete when subscriber calls complete, and close subscription', async () => {
      const observable = observable$((observer) => {
        observer.complete();
      });

      const sub = observable.subscribe(observer);

      await vi.waitFor(() => expect(observer.complete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should call complete when subscriber ends, and close subscription', async () => {
      const observable = observable$(() => {});
      const sub = observable.subscribe(observer);

      await vi.waitFor(() => expect(observer.complete).toHaveBeenCalledOnce());

      expect(sub.closed).toBe(true);
    });

    it('should unsubscribe from observable', () => {
      const observable = observable$<number>((observer) => {
        observer.next(42);
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
