// Types
export type YieldMap<V, R> = (val: V) => R;

// Utils
export function iterMapper<A, const I>(it: Iterator<A>, map: YieldMap<A, I>): IterableIterator<I> {
  return {
    next() {
      const next = it.next();
      return next.done ? next : { value: map(next.value) };
    },
    [Symbol.iterator]() { return this; }
  };
}
