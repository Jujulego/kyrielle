import type { Observer } from '@/src/types/inputs/Observer.js';
import { parseSubscribeArgs } from '@/src/utils/subscribe.js';
import { describe, expect, it, vi } from 'vitest';

// Tests
describe('parseSubscribeArgs', () => {
  it('should return a valid observer', () => {
    const observer = parseSubscribeArgs([]);

    expect(observer).toHaveProperty('next', expect.any(Function));
    expect(observer).toHaveProperty('error', expect.any(Function));
    expect(observer).toHaveProperty('complete', expect.any(Function));
  });

  it('should return given observer', () => {
    const arg: Observer = {
      next: vi.fn(),
      error: vi.fn(),
      complete: vi.fn(),
    };
    const observer = parseSubscribeArgs([arg]);

    expect(observer).toHaveProperty('next', expect.any(Function));
    expect(observer).toHaveProperty('error', expect.any(Function));
    expect(observer).toHaveProperty('complete', expect.any(Function));

    observer.next(42);
    expect(arg.next).toHaveBeenCalledWith(42);

    observer.error(new Error('Failed!'));
    expect(arg.error).toHaveBeenCalledWith(new Error('Failed!'));

    observer.complete();
    expect(arg.complete).toHaveBeenCalledOnce();
  });

  it('should keep given onNext function', () => {
    const onNext = () => null;
    const observer = parseSubscribeArgs([onNext]);

    expect(observer).toHaveProperty('next', onNext);
    expect(observer).toHaveProperty('error', expect.any(Function));
    expect(observer).toHaveProperty('complete', expect.any(Function));
  });

  it('should only call onNext callback', () => {
    const onNext = vi.fn();
    const onError = vi.fn();
    const onComplete = vi.fn();

    const observer = parseSubscribeArgs([onNext, onError, onComplete]);
    observer.next(42);

    expect(onNext).toHaveBeenCalledWith(42);
    expect(onError).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should only call onError callback', () => {
    const onNext = vi.fn();
    const onError = vi.fn();
    const onComplete = vi.fn();

    const observer = parseSubscribeArgs([onNext, onError, onComplete]);
    observer.error(new Error('Failed !'));

    expect(onNext).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(new Error('Failed !'));
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('should only call onComplete callback', () => {
    const onNext = vi.fn();
    const onError = vi.fn();
    const onComplete = vi.fn();

    const observer = parseSubscribeArgs([onNext, onError, onComplete]);
    observer.complete();

    expect(onNext).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
    expect(onComplete).toHaveBeenCalled();
  });
});
