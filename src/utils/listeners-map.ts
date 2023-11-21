import { Listener } from '../defs/index.js';

// Utils
export function listenersMap() {
  const map = new Map<string, Set<Listener>>();

  return {
    add(key: string, listener: Listener): [Set<Listener>, boolean] {
      let set = map.get(key);

      if (set) {
        set.add(listener);

        return [set, false];
      } else {
        set = new Set([listener]);
        map.set(key, set);

        return [set, true];
      }
    },
    list: (key: string) => map.get(key),
    entries: () => map.entries(),
    delete: (key: string, listener: Listener) => map.get(key)?.delete(listener),
    clear: (key?: string) => key ? map.delete(key) : map.clear(),
  };
}
