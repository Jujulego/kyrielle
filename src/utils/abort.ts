export function waitForAbort(signal: AbortSignal): Promise<never> {
  return new Promise<never>((_, reject) => {
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });
}
