import { deferrable$ } from './deferrable$.js';
import type { Ref } from './types/outputs/Ref.js';

// Types
export interface FetchOpts<D = Response> extends Omit<RequestInit, 'signal'> {
  /**
   * Called before calling `fetch`, for logging purposes.
   *
   * @since 1.0.0
   */
  readonly onFetch?: (url: string | URL) => void;

  /**
   * Called on a successful fetch (with a status between 200 and 299)
   * Allows to parse the received response.
   *
   * @since 1.0.0
   */
  readonly onSuccess?: (res: Response) => PromiseLike<D>;
}

/**
 * Wraps a fetch call into an asynchronous Ref. Calls are deduplicated, meaning that if "defer" is called while a
 * previous first `fetch` call is still running, "defer" will not call `fetch` again but rather will "subscribe" to the
 * running call.
 *
 * @param url url to be fetched
 * @param opts options given to fetch.
 * @throws FetchError when the fetch call fails (received a response with a status > 200)
 *
 * @since 1.0.0
 * @see deferrable$
 */
export function fetch$<D>(url: string | URL, opts: FetchOpts & { onSuccess(res: Response): PromiseLike<D> }): Ref<Promise<D>>;
export function fetch$(url: string | URL, opts?: FetchOpts): Ref<Promise<Response>>;

export function fetch$<D = Response>(url: string | URL, opts: FetchOpts<D> = {}): Ref<Promise<D>> {
  return deferrable$(async (signal): Promise<D> => {
    if (opts.onFetch) opts.onFetch(url);
    const res = await fetch(url, { ...opts, signal });

    if (!res.ok) {
      throw new FetchError(res);
    }

    return opts.onSuccess ? opts.onSuccess(res) : res as D;
  });
}

/**
 * Error emitted on an unsuccessful fetch (with a status > 200)
 *
 * @since 1.0.0
 */
export class FetchError extends Error {
  // Constructor
  constructor(readonly response: Response) {
    super(response.statusText);
  }

  // Properties
  get status(): number {
    return this.response.status;
  }
}
