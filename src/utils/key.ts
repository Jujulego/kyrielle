import { Key } from '../defs/index.js';

export function splitKey(key: Key): [Key, string] {
  const idx = typeof key === 'number' ? -1 : key.indexOf('.');

  if (typeof key === 'number' || idx === -1) {
    return [key, ''];
  } else {
    return [key.slice(0, idx), key.slice(idx + 1)];
  }
}
