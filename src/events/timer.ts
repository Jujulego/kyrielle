import { source$ } from './source.js';
import { Observable } from '../defs/index.js';

/**
 * Timer source.
 */
export interface TimerSource extends Observable<number>, Disposable {
  /**
   * Stops timer.
   */
  dispose(): void;
}

/**
 * Builds a timer.
 * Emits numbers in sequence regularly according to given parameters and starting at 1.
 *
 * @param delay in milliseconds until first emit
 * @param period in milliseconds between each next emits
 */
export function timer$(delay: number, period?: number): TimerSource {
  let i = 0;
  let intervalId: NodeJS.Timeout;

  const src = source$<number>();
  const timeoutId = setTimeout(() => {
    src.next(++i);

    if (period) {
      intervalId = setInterval(() => src.next(++i), period);
    }
  }, delay);

  const dispose = () => {
    clearTimeout(timeoutId);
    clearInterval(intervalId);
  };

  return Object.assign(src, {
    dispose,
    [Symbol.dispose ?? Symbol.for('Symbol.dispose')]: dispose
  });
}