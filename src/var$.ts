import { Mutable, Observable, Observer, Readable, SubscribeCallbacks, Subscription } from './defs/index.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

export interface Var<in out D> extends Observable<D>, Readable<D>, Mutable<D> {}

/**
 * Builds an uninitialized var
 */
export function var$<D>(): Var<D | undefined>;

/**
 * Builds an initialized var
 * @param initial
 */
export function var$<D>(initial: D): Var<D>;

export function var$<D>(initial?: D): Var<D | undefined> {
  const observers = new Set<Observer<D | undefined>>();
  let value = initial;

  const _var = {
    read: () => value,
    mutate: (arg: D | undefined) => value = arg,
    [Symbol.observable ?? '@@observable']: () => _var,
    subscribe(...args: [Partial<Observer<D | undefined>>] | SubscribeCallbacks<D | undefined>): Subscription {
      const observer = parseSubscribeArgs(args);
      const subscription = buildSubscription({
        onUnsubscribe: () => observers.delete(observer),
        isClosed: () => !observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);
      observer.next(value);

      return subscription;
    },
  };

  return _var;
}