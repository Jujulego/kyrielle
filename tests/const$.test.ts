import { const$ } from '@/src/const$.js';
import { describe, expect, it } from 'vitest';

// Tests
describe('const$', () => {
  it('should return given value', () => {
    const ref = const$(42);
    expect(ref.defer()).toBe(42);
  });
});
