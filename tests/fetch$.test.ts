import { fetch$, FetchError } from '@/src/fetch$.js';
import { afterEach, beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

// Setup
let mockFetch: Mock<typeof fetch>;

beforeEach(() => {
  mockFetch = vi.fn();
  vi.stubGlobal('fetch', mockFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

// Tests
describe('fetch$', () => {
  it('should call fetch on defer and resolve to its response', async () => {
    const res = Response.json({ life: 42 });
    mockFetch.mockResolvedValue(res);

    const ref = fetch$('life');
    await expect(ref.defer()).resolves.toBe(res);

    expect(mockFetch).toHaveBeenCalledWith('life', { signal: expect.any(AbortSignal) as AbortSignal });
  });

  it('should call onFetch with url just before initiating the request', async () => {
    const onFetch = vi.fn();
    const res = Response.json({ life: 42 });
    mockFetch.mockResolvedValue(res);

    const ref = fetch$('life', { onFetch });
    await expect(ref.defer()).resolves.toBeDefined();

    expect(onFetch).toHaveBeenCalledWith('life');
  });

  it('should use onSuccess to handle the response', async () => {
    const res = Response.json({ life: 42 });
    mockFetch.mockResolvedValue(res);

    const ref = fetch$('life', { onSuccess: (res) => res.json()});
    await expect(ref.defer()).resolves.toStrictEqual({ life: 42 });
  });

  it('should a FetchError on error response', async () => {
    const res = Response.error();
    mockFetch.mockResolvedValue(res);

    const ref = fetch$('life');
    await expect(ref.defer()).rejects.toStrictEqual(new FetchError(res));
  });
});
