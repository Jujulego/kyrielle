import { describe, expect, it, vi } from 'vitest';

import { bind$ } from '@/src/refs/bind.js';
import { const$ } from '@/src/refs/const.js';
import { Ref } from '@/src/defs/index.js';

// Test
describe('bind$', () => {
  it('should bind methods to ref', () => {
    const test = vi.fn(function (this: Ref<42>, arg: string) {
      expect(this.read()).toBe(42);
      return arg;
    });

    const ref = bind$(const$(42), { test });
    expect(ref).toHaveProperty('test');

    expect(ref.test('life')).toBe('life');
    expect(test).toHaveBeenCalledWith('life');
  });
});
