// Polyfill observable symbol
declare global {
  interface SymbolConstructor {
    readonly observable: unique symbol;
  }
}

// Symbols
export const SymbolDispose = Symbol.dispose ?? Symbol.for('Symbol.dispose');
export const SymbolObservable = Symbol.observable ?? Symbol.for('observable');