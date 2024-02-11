import { waitForAbort } from './abort.js';

export class Query<T = unknown> {
  // Attributes
  private _cancelable = true;
  private _completed = false;
  private _signals = new Set<AbortSignal>();

  // Constructor
  constructor(
    readonly promise: PromiseLike<T>,
    readonly controller: AbortController,
    readonly onCleanUp?: () => void
  ) {
    promise.then(this._cleanup, this._cleanup);
  }

  // Methods
  private _cancel(signal: AbortSignal) {
    this._signals.delete(signal);

    if (this._cancelable && this._signals.size === 0) {
      this.controller.abort(signal.reason);
    }
  }

  private _cleanup = () => {
    this._completed = true;
    this._cancelable = false;

    if (this.onCleanUp) {
      this.onCleanUp();
    }
  };

  preventCancel() {
    this._cancelable = false;
  }

  registerSignal(signal: AbortSignal): PromiseLike<T> {
    if (!this._signals.has(signal)) {
      this._signals.add(signal);
      signal.addEventListener('abort', () => this._cancel(signal), { once: true });
    }

    return Promise.race([this.promise, waitForAbort(signal)]);
  }

  // Properties
  get completed() {
    return this._completed;
  }
}
