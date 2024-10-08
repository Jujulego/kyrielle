export function waitForAbort(signal: AbortSignal): Promise<never> {
  return new Promise<never>((_, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason as Error), { once: true });
  });
}

/**
 * Polyfill for AbortSignal.any
 */
export function abortSignalAnyPolyfill(signals: AbortSignal[]): AbortSignal {
  // Easy cases
  if (signals.length === 0) return new AbortSignal();
  if (signals.length === 1) return signals[0]!;

  // One is already aborted
  const aborted = signals.find((sig) => sig.aborted);

  if (aborted) {
    return aborted;
  }

  // Dynamically abort
  const ctrl = new AbortController();

  Promise.race(signals.map(waitForAbort))
    .catch((reason) => ctrl.abort(reason));

  return ctrl.signal;
}

export const abortSignalAny = ('any' in AbortSignal)
  ? (AbortSignal.any as typeof abortSignalAnyPolyfill).bind(AbortSignal)
  : abortSignalAnyPolyfill;
