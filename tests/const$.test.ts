import { describe, expect, it } from 'vitest';
import { const$ } from '@/src/const$.js';

// Tests
describe('const$', () => {
  it('should return given value', () => {
    const ref = const$(42);
    expect(ref.read()).toBe(42);
  });
});