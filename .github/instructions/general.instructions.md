---
description: "Use for project-wide engineering, refactoring, documentation, and change management. Preserve existing Daily Dots behavior and keep repository guidance consistent."
applyTo: "**/*"
---

# General Engineering Instructions

## 1. Naming Conventions
- Use clear, descriptive names that communicate purpose and intent.
- Follow the established naming conventions of the language, framework, and repository.
- Keep names consistent across files, symbols, tests, and documentation.
- Avoid ambiguous abbreviations, misleading names, and unnecessary prefixes or suffixes.

## 2. File and Folder Structure
- Follow the repository's existing organization before introducing new patterns.
- Group related files by feature or responsibility where appropriate.
- Keep files focused; split them when they contain unrelated responsibilities or become difficult to navigate.
- Place shared functionality in clearly defined shared locations.
- Avoid unnecessary nesting, duplicate files, and speculative folders.

## 3. Readability and Maintainability
- Prefer simple, explicit solutions over clever or unnecessarily complex ones.
- Keep functions, modules, and components focused on a clear responsibility.
- Reduce duplication when a reusable abstraction improves clarity and consistency.
- Use consistent terminology and predictable patterns throughout the codebase.
- Make control flow and data transformations easy to follow.

## 4. Comments and Documentation
- Write comments to explain intent, constraints, trade-offs, or non-obvious behavior—not to restate the code.
- Keep comments accurate and update or remove them when implementation changes.
- Document public interfaces, important decisions, setup requirements, and non-obvious operational behavior.
- Prefer self-explanatory code over excessive inline commentary.
- Keep README, AGENTS.md, and applicable instruction files aligned when product scope, layout, styling, or commands change. Distinguish implemented features from optional future work.
- For date-selection changes, keep the documented Monday–Sunday week definition and draft-confirmation behavior consistent across all input paths.

## 5. Refactoring Discipline
- Make the smallest coherent change that satisfies the requirement.
- Preserve existing behavior unless a behavior change is explicitly requested.
- For layout-only work, preserve copy, branding, accessibility, routes, data formats, and all existing actions; reposition controls rather than removing functionality.
- Avoid unrelated cleanup, broad rewrites, and speculative abstractions within focused changes.
- Refactor incrementally and keep changes easy to review.
- Remove obsolete code only when its removal is safe and within scope.
- Add or update tests when refactoring affects behavior or important contracts.

## 6. Error Handling
- Handle errors at appropriate boundaries and preserve useful diagnostic context.
- Fail clearly and predictably; do not silently ignore unexpected failures.
- Provide actionable, user-appropriate error messages without exposing internal details or sensitive data.
- Validate untrusted input at system boundaries.
- Do not use broad error suppression or empty error handlers.
- Log errors responsibly; never log credentials, secrets, or sensitive user data.

## 7. Imports and Dependencies
- Keep imports explicit, relevant, and consistently organized.
- Remove unused imports and dependencies.
- Prefer existing repository utilities and approved dependencies over adding new packages.
- Avoid circular dependencies and unnecessary coupling between modules.
- Add a dependency only when its value justifies its maintenance, security, and bundle/runtime costs.
- Do not introduce or upgrade dependencies without checking compatibility and repository conventions.

## 8. Formatting and Code Quality
- Follow the repository's formatter, linter, and static-analysis configuration.
- Do not introduce formatting changes unrelated to the task.
- Use consistent whitespace, indentation, line length, and file encoding.
- Keep generated files and hand-maintained files distinct; do not manually edit generated output unless required.
- Resolve relevant lint, type, build, and test failures introduced by the change.
- Do not disable quality checks merely to make a change pass.

## 9. Testing and Verification
- Add or update tests for new behavior, bug fixes, and meaningful refactoring.
- Test observable behavior and important edge cases.
- Keep tests deterministic, isolated, and readable.
- Run the most relevant available checks before considering work complete.
- Clearly report checks that could not be run and why.

## 10. Collaboration and Change Management
- Inspect the relevant code and repository guidance before making changes.
- Respect existing architecture, conventions, ownership boundaries, and in-progress work.
- Do not overwrite or revert user changes.
- Ask for clarification when requirements are materially ambiguous; otherwise make conservative, well-reasoned assumptions.
- Do not commit, push, publish, deploy, or perform destructive operations unless explicitly authorized.
- Keep changes focused and reviewable; summarize what changed, key decisions, and verification results.
