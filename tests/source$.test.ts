import { Observer, Source, Subscription } from '@/src/defs/index.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { source$ } from '@/src/source$.js';

// Tests
let observer: Observer<number>;
let source: Source<number>;
let subscription: Subscription;

beforeEach(() => {
  observer = {
    start: vi.fn(),
    next: vi.fn(),
    error: vi.fn(),
    complete: vi.fn(),
  };

  source = source$();
  subscription = source.subscribe(observer);
});

describe('source$', () => {
  it('should call observer\'s start method on subscription', () => {
    expect(observer.start).toHaveBeenCalledWith(subscription);
  });

  describe('next', () => {
    it('should call observer\'s next method', () => {
      source.next(42);

      expect(observer.next).toHaveBeenCalledWith(42);
    });

    it('should not call observer\'s next method after unsubscribe', () => {
      subscription.unsubscribe();
      source.next(42);

      expect(observer.next).not.toHaveBeenCalled();
      expect(subscription.closed).toBe(true);
    });

    it('should throw as calling next on completed source', () => {
      source.complete();

      expect(() => source.next(42)).toThrow();
    });
  });

  describe('error', () => {
    it('should call observer\'s error method', () => {
      source.error(new Error('Failed !'));

      expect(observer.error).toHaveBeenCalledWith(new Error('Failed !'));
    });

    it('should not call observer\'s error method after unsubscribe', () => {
      subscription.unsubscribe();
      source.error(new Error('Failed !'));

      expect(observer.error).not.toHaveBeenCalled();
      expect(subscription.closed).toBe(true);
    });

    it('should throw as calling error on completed source', () => {
      source.complete();

      expect(() => source.error(new Error('Failed !'))).toThrow();
    });
  });

  describe('complete', () => {
    it('should call observer\'s complete method, and close subscription', () => {
      source.complete();

      expect(observer.complete).toHaveBeenCalled();
      expect(subscription.closed).toBe(true);
    });

    it('should not call observer\'s complete method after unsubscribe', () => {
      subscription.unsubscribe();
      source.complete();

      expect(observer.complete).not.toHaveBeenCalled();
      expect(subscription.closed).toBe(true);
    });

    it('should throw as calling complete on completed source', () => {
      source.complete();

      expect(() => source.complete()).toThrow();
    });
  });
});
