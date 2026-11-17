# Kyrielle

## Commands

- Install dependencies with `yarn install --immutable`; Yarn 4 is pinned in `package.json` and `.yarnrc.yml` uses the checked-in release.
- Run the full runtime and typecheck suite with `yarn test`.
- Run one runtime test file with `yarn vitest run tests/<name>.test.ts --typecheck`.
- Run only the compile-time tests with `yarn test:types`.
- Run one compile-time test file with `yarn vitest run tests/<name>.test-d.ts --typecheck`.
- Run lint with `yarn lint`.
- Build ESM and declarations with `yarn build`; remove generated `dist` output with `yarn clean`.
- The CI test matrix also uses `yarn test --coverage`, and both coverage and JUnit output are configured in `vitest.config.ts`.

## Architecture

- `src/index.ts` is the package export surface. Public modules, input/output interfaces, operators, and utilities are exported from here with `.js` specifiers for NodeNext resolution.
- Source modules are split into:
  - root operators/functions, whose filenames use the `$` suffix (`map$.ts`, `pipe$.ts`, `source$.ts`, and similar);
  - `src/types/inputs/` for observer/subscription and composability contracts;
  - `src/types/outputs/` for concrete public contracts;
  - `src/utils/` for shared parsing, subscription, iterator, predicate, and function helpers;
  - `src/bases/` for reusable implementations such as the multiplexer base.
- Data flow uses composable `PipeStep` functions. `pipe$` applies steps to a value, `step$` composes them into a new step, and `flow$` applies the composed steps to a subscribable before forwarding to an observer.
- `observable$` is the lazy push source implementation: activation starts once, subscribers share the source, subscriptions stop activation when the last observer leaves, and `AbortSignal` is passed to subscriber functions.
- `source$` is the imperative push source; it broadcasts `next`, `error`, and `complete` to current observers and prevents use after completion.
- Subscriptions are built through shared helpers in `src/utils/`; observer inputs are normalized with `parseSubscribeArgs`, while subscription closed state is centralized in `buildSubscription`.
- The build emits JavaScript with SWC and declarations with `tsc`; the declaration build starts at `src/index.ts` and follows its exports.

## Repository conventions

- Relative imports use `.js` extensions even though the implementation files are `.ts`, as required by the NodeNext module setup.
- Public operator and factory names end in `$` and usually correspond to a file with the same name.
- Public APIs rely on explicit overload chains to preserve useful types through multi-step pipes and flows; update the overload set when changing a public multi-step signature instead of relying on `unknown` in the public surface.
- Generic declarations use variance annotations and exact/strict TypeScript settings. Preserve `in`/`out`/`in out` variance and `exactOptionalPropertyTypes` behavior when modifying interfaces or mappings.
- Keep runtime and compile-time coverage together: paired `.test.ts` and `.test-d.ts` files live in `tests/` and use `@/src/*` imports. Use Vitest `expectTypeOf` and `assertType` for compile-time API contracts.
- Exported source modules must be included from `src/index.ts`; type-only exports belong in the input/output type directories and should use `import type`.
- Follow existing JSDoc style, including `@since` for public declarations and `@see`/`@param` where they clarify contracts.
- ESLint requires single quotes, semicolons, consistent type-only imports, and type-aware TypeScript rules. Console output is limited to `warn` and `error`.
- Test files and test declarations relax selected strict lint rules, but source changes must remain compatible with the strict root `tsconfig.json`.
