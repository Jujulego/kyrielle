import { Ref } from '../defs/index.js';

// Types
export type RefMethod<R extends Ref> = (this: R, ...args: any[]) => unknown; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * Binds all given method to given ref. Methods will receive ref as "this".
 * Returns ref object augmented with given methods.
 *
 * @param ref
 * @param methods
 */
export function bind$<R extends Ref, M extends Record<string, RefMethod<R>>>(ref: R, methods: M): R & Omit<M, keyof R> {
  for (const key in methods) {
    if (key in ref) {
      continue;
    }

    Object.assign(ref, {
      [key]: methods[key]!.bind(ref),
    });
  }

  return ref as R & Omit<M, keyof R>;
}