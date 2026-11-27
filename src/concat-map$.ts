import type { AnySubscribable } from './features/subscribable.js';
import type { PipeStep } from './pipe$.js';
import { observable$, type SubscriberObserver } from './rx/observable$.js';
import { observer$ } from './rx/observer$.js';
import { toSubscribable$ } from './rx/to-subscribable$.js';
import type { Observable } from './rx/types/observable.js';
import { boundedSubscription } from './utils/subscription.js';

/**
 * For each value emitted by the origin, this step will call `fn`, then will subscribe to its result and re-emit each
 * emitted value, until this "inner" subscription completes. All value emitted by the origin will be queued, and
 * processed in order
 * @param fn
 *
 * @since 1.0.0
 */
export function concatMap$<T, R>(
  fn: (item: T) => AnySubscribable<R>,
): PipeStep<AnySubscribable<T>, Observable<R>> {
  return (origin: AnySubscribable<T>) => {
    origin = toSubscribable$(origin);
    const queue: T[] = [];
    let childRunning = false;
    let originCompleted = false;

    function childSubscription(item: T, observer: SubscriberObserver<R>, signal: AbortSignal) {
      boundedSubscription(
        toSubscribable$(fn(item)),
        signal,
        observer$({
          next: observer.next,
          error: observer.error,
          complete: () => {
            const next = queue.pop();

            if (next) {
              childSubscription(next, observer, signal);
            } else {
              childRunning = false;

              if (originCompleted) {
                observer.complete();
              }
            }
          },
        }),
      );
    }

    return observable$((observer, signal) => {
      boundedSubscription(
        toSubscribable$(origin),
        signal,
        observer$({
          next: (item) => {
            if (!childRunning) {
              childRunning = true;
              childSubscription(item, observer, signal);
            } else {
              queue.unshift(item);
            }
          },
          error: observer.error,
          complete: () => {
            originCompleted = true;

            if (!childRunning) {
              observer.complete();
            }
          },
        }),
      );
    });
  };
}
