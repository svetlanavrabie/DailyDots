---
description: "Use when editing Daily Dots TypeScript or React components, hooks, forms, navigation, repositories, or tests. Preserve strict types and local-first behavior during UI changes."
applyTo: "**/*.ts,**/*.tsx"
---

# TypeScript & React Engineering Standards

## 1. TypeScript Standards

- Use strict TypeScript typing. Assume `strict: true` is enabled.
- Never use `any`. Use `unknown` when the type is genuinely uncertain and narrow it before use.
- Avoid type assertions (`as`) unless strictly necessary and justified.
- Prefer explicit types for function parameters, return values, component props, and public APIs.
- Use type inference for straightforward local variables.
- Prefer `interface` for object contracts and `type` for unions, intersections, and utility types.
- Use discriminated unions to model mutually exclusive states and enforce exhaustive handling.
- Use `never` to ensure exhaustive checks in switch statements.
- Use `readonly` and `ReadonlyArray<T>` where mutation is not required.
- Prefer immutable operations over modifying existing objects or arrays.
- Avoid non-null assertions (`!`). Handle nullable values explicitly.
- Use generics to create reusable, type-safe abstractions without sacrificing readability.
- Prefer built-in utility types (`Partial`, `Pick`, `Omit`, `Record`, `Required`) when appropriate.

## 2. React Component Standards

- Use functional components exclusively. Do not introduce class components.
- Define component props using explicit interfaces or types.
- Avoid unnecessary `React.FC` usage.
- Keep components small, focused, and responsible for a single concern.
- Extract reusable UI and business logic into dedicated components or hooks.
- Keep rendering logic simple. Move complex calculations and business logic outside JSX.
- Use descriptive, consistent PascalCase component names.
- Use meaningful camelCase names for variables, functions, and hooks.
- Use stable, unique keys when rendering lists. Never use array indexes as keys when items can change order or be removed.
- Avoid deeply nested JSX and excessive conditional rendering.
- Prefer composition over complex components with numerous boolean props.
- Keep the shared shell in `src/app/layouts/AppLayout.tsx` and feature content in its existing pages/components. Reposition UI without duplicating navigation or theme/backup controls.
- Preserve existing English interface text, route destinations, accessible names, and main-content focus behavior during layout-only changes.

## 3. React Hooks

- Follow the Rules of Hooks. Never call hooks conditionally, inside loops, or nested functions.
- Use `useState` for local component state.
- Use `useEffect` only for synchronization with external systems, not for derived state.
- Always define appropriate effect dependencies.
- Clean up subscriptions, event listeners, timers, and other external resources.
- Use `useMemo` and `useCallback` only when they provide measurable value or prevent unnecessary work.
- Extract reusable stateful logic into custom hooks.
- Custom hooks must use the `use` prefix.
- Avoid unnecessary effects and duplicated state.

## 4. State Management

- Keep state as close as possible to the components that use it.
- Prefer local state for isolated UI concerns.
- Lift state only when multiple components need to share it.
- Use Context for genuinely shared application-level state, not as a replacement for all state management.
- Use the existing `useState`/`useContext` approach; introducing another state library requires an explicit approved requirement.
- Avoid storing values that can be derived from existing state or props.
- Keep state updates immutable.
- Model asynchronous states explicitly, such as `idle`, `loading`, `success`, and `error`.
- Avoid duplicated or conflicting sources of truth.
- Separate server state from client-side UI state.

## 5. Error Handling

- Handle errors explicitly. Never silently swallow exceptions.
- Use `try/catch` for asynchronous operations and code that can throw.
- Treat caught errors as `unknown` and narrow their types before accessing properties.
- Provide meaningful error messages and appropriate user feedback.
- Handle loading, empty, success, and error states in data-driven components.
- Use Error Boundaries to isolate rendering failures where appropriate.
- Avoid exposing internal implementation details, stack traces, or sensitive information to users.
- Log errors with sufficient context for troubleshooting without exposing confidential data.
- Handle failed API requests, network interruptions, and unexpected response formats.

## 6. API & Data Handling

- Define explicit types for API requests and responses.
- Do not trust external data to match TypeScript interfaces automatically.
- Validate external data at runtime when necessary.
- Keep API communication separate from presentation components.
- Centralize shared API clients, authentication handling, and request configuration.
- Handle cancellation of obsolete asynchronous requests when appropriate.
- Avoid duplicating API calls and data transformation logic.
- Keep data transformation predictable and testable.
- Keep journal operations behind `useJournals`/`JournalProvider` and the `JournalRepository` contract. Theme storage belongs in the infrastructure preferences service, not directly in JSX components.
- Reuse the Zod domain schemas and central `MOODS` definitions; layout changes must not change date keys, stored mood values, plain-text entries, or versioned backup payloads.

## 7. Code Organization & Readability

- Organize files by feature or domain when appropriate.
- Keep components, hooks, services, types, and utilities logically separated.
- Use clear and consistent file naming conventions.
- Keep imports organized and remove unused imports.
- Prefer named exports for reusable components, hooks, and utilities.
- Avoid circular dependencies.
- Avoid deeply nested folders and unnecessary abstraction layers.
- Extract repeated logic into reusable functions or hooks.
- Avoid magic numbers and hardcoded configuration values.
- Keep functions short, focused, and easy to understand.

## 8. Performance & Optimization

- Avoid unnecessary component re-renders.
- Use React's memoization APIs only when justified.
- Avoid expensive calculations during rendering when they can be optimized.
- Use lazy loading and code splitting for large features when beneficial.
- Avoid unnecessary state updates and duplicated computations.
- Optimize list rendering and large data sets appropriately.
- Prioritize maintainability and correctness over premature optimization.

## 9. Code Quality & Refactoring

- Follow SOLID principles where applicable.
- Prefer simple, maintainable solutions over unnecessary abstractions.
- Keep business logic independent of UI components whenever possible.
- Follow the DRY principle without creating premature abstractions.
- Refactor incrementally and preserve existing behavior unless a change is explicitly required.
- Avoid unrelated modifications during bug fixes and feature development.
- Remove dead code and unused dependencies when safe.
- Do not introduce new dependencies without a clear justification.

## 10. Testing

- Write unit tests for business logic, utilities, and custom hooks.
- Test components based on observable behavior rather than implementation details.
- Cover success, failure, loading, and edge cases.
- Test important user interactions and accessibility behavior.
- Mock external dependencies and API calls where appropriate.
- Keep tests deterministic, isolated, and maintainable.
- Ensure existing tests pass before considering a change complete.
- For shell changes, cover all three navigation destinations, active links, route-change focus, single theme/backup controls, theme persistence, and backup disabling on storage failures.
- Keep create/update/delete, mood prefill, search/filter, dialog, and backup regression coverage intact. Verify real responsive geometry in the browser as described in [design.instructions.md](design.instructions.md), not through jsdom alone.

## 11. Formatting & Collaboration

- Follow the repository's existing ESLint, Prettier, and formatting configuration.
- Use consistent indentation, spacing, and quote conventions.
- Do not disable linting rules without a valid technical reason.
- Preserve existing project conventions unless there is a clear improvement.
- Do not modify unrelated files or configuration.
- Before introducing a new pattern, check whether an established project convention already exists.
- Review changes for type safety, readability, maintainability, and potential regressions.
- Prefer clear, self-documenting code over excessive comments.
- Document complex business rules, non-obvious decisions, and important architectural constraints.

## 12. General Principles

- Type safety is mandatory; avoid bypassing the compiler.
- Immutability is preferred over mutation.
- Explicit behavior is preferred over implicit assumptions.
- Reusable code should remain simple and focused.
- Components should handle presentation; business logic should remain independently testable.
- Reliability, maintainability, security, and readability take priority over clever implementations.
