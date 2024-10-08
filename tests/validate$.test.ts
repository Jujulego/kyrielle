import { describe, expect, it, vi } from 'vitest';

import { pipe$ } from '@/src/pipe$.js';
import { validate$, ValidateError } from '@/src/validate$.js';

// Tests
describe('validate$', () => {
  it('should validate defer result using given assertion', () => {
    const src = { defer: vi.fn(() => 42) };

    // Setup
    const res = pipe$(src, validate$((n): asserts n is 42 => {
      if (n !== 42) throw new Error('Not 42 !');
    }));

    // Ok
    expect(res.defer()).toBe(42);

    // Ko
    src.defer.mockReturnValue(1);
    expect(res.defer).toThrow(new Error('Not 42 !'));
  });

  it('should validate defer result using given predicate', () => {
    const src = { defer: vi.fn(() => 42) };

    // Setup
    const res = pipe$(src, validate$((n): n is 42 => n === 42));

    // Ok
    expect(res.defer()).toBe(42);

    // Ko
    src.defer.mockReturnValue(1);
    expect(res.defer).toThrow(new ValidateError(1));
  });

  it('should use onMiss option', () => {
    const src = { defer: vi.fn(() => 1) };
    const onMiss = vi.fn(() => {
      throw new Error('Missed !');
    });

    // Setup
    const res = pipe$(src, validate$((n): n is 42 => n === 42, { onMiss }));

    // Ko
    expect(res.defer).toThrow(new Error('Missed !'));
    expect(onMiss).toHaveBeenCalledWith(1);
  });
});
