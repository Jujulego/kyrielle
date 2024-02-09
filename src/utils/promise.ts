export function isPromise(obj: unknown): obj is PromiseLike<unknown> {
  return typeof obj === 'object' && obj !== null && 'then' in obj;
}