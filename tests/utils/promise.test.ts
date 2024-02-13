import { awaitedChain, isPromise } from '@/src/utils/promise.js';

// Tests
describe('isPromise', () => {
  it('should return true for a promise', () => {
    const promise = new Promise(() => null);

    expect(isPromise(promise)).toBe(true);
  });

  it('should return true for a promise like', () => {
    const like = { then() {} };

    expect(isPromise(like)).toBe(true);
  });

  it('should return false for anything else', () => {
    expect(isPromise(true)).toBe(false);
    expect(isPromise(42)).toBe(false);
    expect(isPromise('life')).toBe(false);
    expect(isPromise({ life: 42 })).toBe(false);
    expect(isPromise(['life', 42])).toBe(false);
    expect(isPromise(() => 42)).toBe(false);
  });
});

describe('awaitedCall', () => {
  it('should fn with given arg without creating a promise', () => {
    const fn = vi.fn(() => 42);

    expect(awaitedChain('life', fn)).toBe(42);
    expect(fn).toHaveBeenCalledWith('life');
  });

  it('should fn with resolved arg', async () => {
    const fn = vi.fn(() => 42);

    await expect(awaitedChain(Promise.resolve('life'), fn)).resolves.toBe(42);
    expect(fn).toHaveBeenCalledWith('life');
  });
});