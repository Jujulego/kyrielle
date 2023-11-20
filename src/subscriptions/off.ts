import { OffFn } from '../defs/index.js';

// Types
export interface OffGroup extends OffFn {
  add(fn: OffFn): void;
}

export function off$(...offs: OffFn[]): OffGroup {
  const fns = new Set<OffFn>(offs);
  
  // Create group
  const off = () => {
    for (const fn of fns) {
      fn();
    }
  };
  
  return Object.assign(off, {
    add: (fn: OffFn) => fns.add(fn),
  });
}
