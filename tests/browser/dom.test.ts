import { vi } from 'vitest';

import { dom$, DomEmitter } from '@/src/browser/dom.js';

// Types
interface TestElementEventMap {
  life: number;
  test: boolean;
}

// Tests
describe('dom$', () => {
  describe('on', () => {
    it('should register listener with addEventListener', () => {
      // Setup
      const listener = vi.fn();
      const element: DomEmitter<TestElementEventMap> = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Register event
      const src = dom$<TestElementEventMap>(element);
      src.on('life', listener);

      expect(element.addEventListener).toHaveBeenCalledWith('life', listener);
    });

    it('should use removeEventListener when calling off', () => {
      // Setup
      const listener = vi.fn();
      const element: DomEmitter<TestElementEventMap> = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Register event
      const src = dom$<TestElementEventMap>(element);
      const off = src.on('life', listener);
      off();

      expect(element.removeEventListener).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('off', () => {
    it('should unregister listener with removeEventListener', () => {
      // Setup
      const listener = vi.fn();
      const element: DomEmitter<TestElementEventMap> = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Register event
      const src = dom$<TestElementEventMap>(element);
      src.off('life', listener);

      expect(element.removeEventListener).toHaveBeenCalledWith('life', listener);
    });
  });

  describe('clear', () => {
    it('should unregister all listeners', () => {
      // Setup
      const listenerA = vi.fn();
      const listenerB = vi.fn();
      const listenerC = vi.fn();
      const element: DomEmitter<TestElementEventMap> = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Register event
      const src = dom$<TestElementEventMap>(element);
      src.on('life', listenerA);
      src.on('life', listenerB);
      src.on('test', listenerC);

      src.clear();

      expect(element.removeEventListener).toHaveBeenCalledWith('life', listenerA);
      expect(element.removeEventListener).toHaveBeenCalledWith('life', listenerB);
      expect(element.removeEventListener).toHaveBeenCalledWith('test', listenerC);
    });

    it('should unregister all life listeners', () => {
      // Setup
      const listenerA = vi.fn();
      const listenerB = vi.fn();
      const listenerC = vi.fn();
      const element: DomEmitter<TestElementEventMap> = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      };

      // Register event
      const src = dom$<TestElementEventMap>(element);
      src.on('life', listenerA);
      src.on('life', listenerB);
      src.on('test', listenerC);

      src.clear('life');

      expect(element.removeEventListener).toHaveBeenCalledWith('life', listenerA);
      expect(element.removeEventListener).toHaveBeenCalledWith('life', listenerB);
      expect(element.removeEventListener).not.toHaveBeenCalledWith('test', listenerC);
    });
  });
});
