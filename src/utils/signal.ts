import { off$, once$ } from '../subscriptions/index.js';
import { dom$ } from '../browser/index.js';

/**
 * Polyfill for AbortSignal.any
 */
export function abortSignalAnyPolyfill(signals: AbortSignal[]): AbortSignal {
  // Easy cases
  if (signals.length === 0) return new AbortSignal();
  if (signals.length === 1) return signals[0]!;

  // One is already aborted
  const aborted = signals.find((sig) => sig.aborted);
  if (aborted) return aborted;

  // Dynamically abort
  const ctrl = new AbortController();
  const off = off$();

  for (const sig of signals) {
    off.add(
      once$(dom$(sig), 'abort', () => {
        ctrl.abort(sig.reason);
      }, { off })
    );
  }

  return ctrl.signal;
}

export const abortSignalAny = ('any' in AbortSignal)
  ? (AbortSignal.any as typeof abortSignalAnyPolyfill).bind(AbortSignal)
  : abortSignalAnyPolyfill;
