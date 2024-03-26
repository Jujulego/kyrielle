// Polyfill observable symbol
declare global {
  interface SymbolConstructor {
    readonly observable: unique symbol;
  }
}
