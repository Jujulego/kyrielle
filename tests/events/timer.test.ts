import { beforeEach, describe, expect, it, vi } from 'vitest';

import { timer$ } from '@/src/events/timer.js';

// Setup
beforeEach(() => {
  vi.useFakeTimers();
});

// Tests
describe('timer$', () => {
  it('should emit event after given timeout', () => {
    const spy = vi.fn();

    using timer = timer$(1000);
    timer.subscribe(spy);

    vi.advanceTimersByTime(1000);

    expect(spy).toHaveBeenCalledWith(1);

    vi.advanceTimersByTime(1000);

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should not emit event after given timeout as it was disposed', () => {
    const spy = vi.fn();

    using timer = timer$(1000);
    timer.subscribe(spy);
    timer.dispose();

    vi.advanceTimersByTime(2000);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should emit event after given timeout and then every given period', () => {
    const spy = vi.fn();

    using timer = timer$(1000, 2000);
    timer.subscribe(spy);

    vi.advanceTimersByTime(1000);

    expect(spy).toHaveBeenCalledWith(1);

    vi.advanceTimersByTime(2000);

    expect(spy).toHaveBeenCalledWith(2);

    vi.advanceTimersByTime(2000);

    expect(spy).toHaveBeenCalledWith(3);
    expect(spy).toHaveBeenCalledTimes(3);
  });

  it('should emit event after given timeout but not after has it was disposed', () => {
    const spy = vi.fn();

    using timer = timer$(1000, 2000);
    timer.subscribe(spy);

    vi.advanceTimersByTime(1000);

    expect(spy).toHaveBeenCalledWith(1);

    timer.dispose();
    vi.advanceTimersByTime(4000);

    expect(spy).toHaveBeenCalledOnce();
  });
});