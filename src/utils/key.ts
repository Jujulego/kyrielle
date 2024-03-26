export function splitKey(key: string): [string, string] {
  const idx = key.indexOf('.');

  if (idx === -1) {
    return [key, ''];
  } else {
    return [key.slice(0, idx), key.slice(idx + 1)];
  }
}