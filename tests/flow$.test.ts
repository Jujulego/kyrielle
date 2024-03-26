import { observable$ } from '@/src/observable$.js';
import { observer$ } from '@/src/observer$.js';
import { describe, expect, it, vi } from 'vitest';

import { flow$ } from '@/src/flow$.js';

// Tests
describe('flow$', () => {
  it('should call step with given observable and return its result', () => {
    const obs = observable$(() => {});
    const res = observable$(() => {});
    const end = observer$({ next: () => {} });

    vi.spyOn(res, 'subscribe');

    const step = vi.fn(() => res);

    flow$(obs, step, end);
    expect(step).toHaveBeenCalledWith(obs);

    expect(res.subscribe).toHaveBeenCalledWith(end);
  });

  it('should call each step with previous result', () => {
    const obs = observable$(() => {});
    const mid = observable$(() => {});
    const res = observable$(() => {});
    const end = observer$({ next: () => {} });

    vi.spyOn(res, 'subscribe');

    const step1 = vi.fn(() => mid);
    const step2 = vi.fn(() => res);

    flow$(obs, step1, step2, end);
    expect(step1).toHaveBeenCalledWith(obs);
    expect(step2).toHaveBeenCalledWith(mid);

    expect(res.subscribe).toHaveBeenCalledWith(end);
  });
});
