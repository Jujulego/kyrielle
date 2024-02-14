import { observable$ } from '@/src/observable$.js';
import { describe, expect, it, vi } from 'vitest';

import { pipe$ } from '@/src/pipe$.js';

// Tests
describe('pipe$', () => {
  it('should call step with given observable and return its result', () => {
    const obs = observable$(() => {});
    const res = observable$(() => {});

    const step = vi.fn(() => res);

    expect(pipe$(obs, step)).toBe(res);
    expect(step).toHaveBeenCalledWith(obs);
  });

  it('should call each step with previous result', () => {
    const obs = observable$(() => {});
    const mid = observable$(() => {});
    const res = observable$(() => {});

    const step1 = vi.fn(() => mid);
    const step2 = vi.fn(() => res);

    expect(pipe$(obs, step1, step2)).toBe(res);
    expect(step1).toHaveBeenCalledWith(obs);
    expect(step2).toHaveBeenCalledWith(mid);
  });
});
