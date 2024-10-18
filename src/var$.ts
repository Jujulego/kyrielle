import type { Observer } from './types/inputs/Observer.js';
import type { Mutator } from './types/outputs/Mutator.js';
import type { Observable, SubscribeArgs } from './types/outputs/Observable.js';
import type { Ref } from './types/outputs/Ref.js';
import type { Subscription } from './types/outputs/Subscription.js';
import { parseSubscribeArgs } from './utils/subscribe.js';
import { buildSubscription } from './utils/subscription.js';

/**
 * Builds an uninitialized mutable ref.
 *
 * @since 1.0.0
 */
export function var$<D>(): UninitializedVar<D>;

/**
 * Builds an initialized mutable ref.
 * @param initial
 *
 * @since 1.0.0
 */
export function var$<D>(initial: D): Var<D>;

export function var$<D>(initial?: D): UninitializedVar<D> {
  const observers = new Set<Observer<D>>();
  let value = initial;

  const _var = {
    defer: () => value,
    mutate: (arg: D) => {
      value = arg;

      if (value !== undefined) {
        for (const observer of observers) {
          observer.next(value);
        }
      }

      return value;
    },
    [Symbol.observable ?? '@@observable']: () => _var,
    subscribe: (...args: SubscribeArgs<D>): Subscription => {
      const observer = parseSubscribeArgs(args);
      const subscription = buildSubscription({
        onUnsubscribe: () => observers.delete(observer),
        isClosed: () => !observers.has(observer)
      });

      observers.add(observer);
      observer.start?.(subscription);

      if (value !== undefined) {
        observer.next(value);
      }

      return subscription;
    },
  };

  return _var as UninitializedVar<D>;
}

// Types
export interface Var<in out D> extends Observable<D>, Ref<D>, Mutator<D, D> {}
export interface UninitializedVar<in out D> extends Observable<D>, Ref<D | undefined>, Mutator<D, D> {}
