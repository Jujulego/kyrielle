import { splitKey } from '@/src/utils/key.js';

// Tests
describe('splitKey', () => {
  it('should split key on first dot', () => {
    expect(splitKey('part.key.test')).toStrictEqual(['part', 'key.test']);
  });

  it('should whole key as first part', () => {
    expect(splitKey('key')).toStrictEqual(['key', '']);
  });
});
