import { Observable, Observer, Subscription } from './defs/index.js';

// Types
export interface SubscriberObserver<in D> extends Omit<Observer<D>, 'start'> {}
export type SubscriberFn<out D> = (observer: SubscriberObserver<D>, signal: AbortSignal) => Promise<void> | void;

export type SubscribeCallbacks<D> = [onNext: (data: D) => void, onError?: ((error: Error) => void) | undefined, onComplete?: (() => void) | undefined];

// Enum
const enum State {
  Inactive,
  Activating,
  Active,
}

/**
 * Creates an observable using fn's logic
 * @param fn
 */
export function observable$<D>(fn: SubscriberFn<D>): Observable<D> {
  const observers = new Set<Observer<D>>();

  // Subscriber
  const observer: SubscriberObserver<D> = {
    next(data: D) {
      for (const obs of observers) {
        obs.next(data);
      }
    },
    error(err: unknown) {
      for (const obs of observers) {
        obs.error(err);
      }
    },
    complete() {
      for (const obs of observers) {
        obs.complete();
      }
    }
  };

  // Inner state
  let state = State.Inactive;
  const controller = new AbortController();

  async function activate() {
    try {
      state = State.Active;

      await fn(observer, controller.signal);
    } catch (err: unknown) {
      for (const obs of observers) {
        obs.error(err);
      }
    } finally {
      state = State.Inactive;

      for (const obs of observers) {
        obs.complete();
      }
    }
  }

  // Build observable
  const observable = {
    subscribe(...args: [Observer<D>] | SubscribeCallbacks<D>): Subscription {
      if (state === State.Inactive) {
        queueMicrotask(activate);
        state = State.Activating;
      }

      const observer = parseSubscribeArgs(args);
      const sub = buildSubscription(() => {
        observers.delete(observer);

        if (observers.size === 0) {
          controller.abort();
        }
      });

      observers.add(observer);
      observer.start(sub);

      return sub;
    }
  };

  Object.assign(observable, { [Symbol.observable ?? Symbol.for('observable')]: observable });

  return observable as Observable<D>;
}

// Utils
function parseSubscribeArgs<D>(args: [Observer<D>] | SubscribeCallbacks<D>): Observer<D> {
  if (typeof args[0] === 'object') {
    return args[0];
  }

  return {
    start() {},
    next: args[0],
    error: args[1] ?? (() => {}),
    complete: args[2] ?? (() => {}),
  };
}

function buildSubscription(unsubscribe: () => void): Subscription {
  let closed = false;

  unsubscribe = () => {
    unsubscribe();
    closed = true;
  };

  return {
    [Symbol.dispose ?? Symbol.for('Symbol.dispose')]: unsubscribe,
    unsubscribe,
    get closed() {
      return closed;
    }
  };
}