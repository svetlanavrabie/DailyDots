# AGENTS.md

## Project Overview

Daily Dots is a local-first journal with one plain-text reflection and one
of 12 moods per calendar date. This project uses:

- **Frontend:** React with Vite
- **Language:** TypeScript (strict mode)
- **Persistence:** Browser localStorage behind a validated repository; no backend or authentication.
- **Styling:** Tailwind CSS
- **Architecture:** Feature-based components and hooks, with domain services and infrastructure repositories.

Supabase is a possible future adapter, not an installed or active backend.
Do not add it, authentication, or other future features without an explicit request.

Agents must follow the existing project structure and established implementation patterns.

## Instruction Hierarchy

The following instruction files are the authoritative sources for project standards:

| File                               | Responsibility                                                      |
| ---------------------------------- | ------------------------------------------------------------------- |
| [.github/instructions/general.instructions.md](.github/instructions/general.instructions.md) | General engineering standards and repository conventions |
| [.github/copilot-instructions.md](.github/copilot-instructions.md) | Product scope, architecture, and repository-specific guidance |
| [.github/instructions/typescript-react.instructions.md](.github/instructions/typescript-react.instructions.md) | TypeScript, React, component, hooks, and state management standards |
| [.github/instructions/css-tailwind.instructions.md](.github/instructions/css-tailwind.instructions.md) | Tailwind utilities, theme tokens, and responsive implementation |
| [.github/instructions/design.instructions.md](.github/instructions/design.instructions.md) | Pastel palette, sidebar-free layout, accessibility, and UI validation |

**Priority rules:**

1. Explicit user instructions for the current task take priority.
2. Applicable repository-specific instructions take priority over general guidance.
3. `AGENTS.md` defines agent workflow, security boundaries, and operational expectations.
4. The remaining instruction files are authoritative for their respective technical domains.
5. When instructions conflict, follow the more specific applicable instruction. Do not silently weaken security or quality requirements. Ask for clarification when a conflict cannot be resolved.

Do not duplicate detailed coding or design rules defined in these files.

## Current UI Baseline

- Preserve the Daily Dots name, existing English interface copy, and `© 2026 Svetlana Vrabie` attribution.
- Follow the pastel lavender, sage, and cream direction and manual light/dark themes defined in the design instructions.
- Keep the centered, sidebar-free layout, horizontal tablet/desktop navigation, and fixed bottom phone navigation.
- Preserve all routes, mood choices, journal operations, search/filter behavior, theme persistence, JSON backup format, and local storage keys during layout-only work.
- Keep the theme and backup controls available at every supported size, and notifications clear of mobile navigation.
- See [README.md](README.md) for implemented features, data/privacy limitations, setup, and project structure.

## Development Workflow

Before making changes:

- Inspect the existing project structure and relevant files.
- Read the applicable instruction files.
- Understand the existing implementation before modifying it.
- Identify related components, hooks, services, and tests.
- Check existing package scripts before running commands.

When implementing changes:

- Keep changes small, focused, and directly related to the requested task.
- Follow established architectural boundaries and existing patterns.
- Reuse existing components, hooks, services, and utilities where appropriate.
- Keep business logic out of presentation components.
- Keep data operations behind the repository/provider boundary; keep browser storage access in infrastructure.
- Avoid unnecessary dependencies.
- Avoid introducing duplicate implementations.
- Do not perform unrelated cleanup or formatting.
- Do not introduce large refactors unless explicitly requested.
- Preserve existing functionality and backward compatibility unless requirements specify otherwise.

When modifying existing functionality, consider its impact on dependent components, services, hooks, and integrations.

## Architecture Boundaries

Maintain clear separation of responsibilities:

- **Components:** UI rendering and user interactions.
- **Hooks:** Reusable React stateful logic and UI-related behavior.
- **Services:** Business operations, filtering, and derived journal summaries.
- **Infrastructure:** Runtime-validated localStorage persistence and theme preferences.
- **Types:** Explicit TypeScript models and shared contracts.
- **Utilities:** Reusable, framework-independent helper functions.

Do not bypass these boundaries for convenience.

## Security Requirements

Security requirements are mandatory:

- Never hardcode, expose, or commit secrets, passwords, tokens, or private credentials.
- Never expose Supabase service-role keys or privileged credentials in frontend code.
- Use environment variables for configuration.
- Only expose environment variables intentionally designated as public.
- Never bypass authentication or authorization checks.
- Never weaken Supabase Row Level Security (RLS) policies to make functionality work.
- Never introduce insecure database access patterns.
- Validate and handle untrusted input appropriately.
- Never send journal or mood content to external services, include real personal data in tests/screenshots, or log entry content.
- Never silently replace malformed storage with empty data or overwrite user data during validation.
- Never disable security checks or TypeScript strictness to resolve implementation issues.
- Do not introduce `any`, unsafe type assertions, or other type-system workarounds to conceal errors.

If a requested change introduces a security concern, explain the risk before proceeding.

## Files and Generated Artifacts

Agents must not directly modify:

- `dist/` — Vite build output.
- `node_modules/` — Installed dependencies.
- Package lockfiles (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, etc.).
- Generated files and build artifacts.
- Automatically generated Supabase types or database artifacts unless explicitly requested.
- Other generated configuration or output files.

Do not manually edit lockfiles. If dependency changes are explicitly required, use the appropriate package manager and explain the resulting changes.

Do not modify generated files to fix issues that should be resolved in their source definitions.

## Common Commands

Use the package manager and scripts already established in the repository. The following commands assume npm; adapt them if the project uses pnpm or Yarn.

| Purpose                  | Command             |
| ------------------------ | ------------------- |
| Install dependencies     | `npm install`       |
| Start development server | `npm run dev`       |
| Production build         | `npm run build`     |
| Run lint                 | `npm run lint`      |
| Type checking            | `npm run typecheck` |
| Run tests                | `npm run test`      |

These are the existing scripts; there is no format script. On Windows,
use `npm.cmd` if PowerShell blocks the `npm.ps1` launcher. Do not change
the machine's execution policy to run project commands.

Before executing a command:

- Verify that the corresponding script exists in `package.json`.
- Do not invent missing scripts.
- Do not modify package scripts without a clear requirement.
- Run the relevant checks after implementation.
- Report commands that could not be executed.

A successful production build does not replace linting, type checking, or tests.

## Testing and Validation

- Add or update tests when functionality changes.
- Verify affected functionality after implementation.
- Run TypeScript checks to catch type errors.
- Run linting to identify code quality issues.
- Run relevant tests.
- Run the production build when appropriate.
- Do not claim that checks passed unless they were actually executed successfully.
- Report existing failures separately from issues introduced by your changes.
- For layout changes, follow the viewport/theme matrix in the design instructions and exercise populated, empty, error, and dialog states using synthetic data.
- Verify active navigation, route-change focus, backup availability, and mobile navigation/notification clearance.
- Documentation-only changes do not require application tests or builds unless documentation tests exist; validate links, instruction frontmatter, and consistency instead.

## Change Reporting

After completing a task, provide a concise summary containing:

1. **Changes made:** What was implemented or modified.
2. **Files affected:** Important files created, updated, or removed.
3. **Architecture impact:** Any changes to component, hook, service, or data boundaries.
4. **Validation:** Commands executed and their results.
5. **Limitations:** Remaining issues, skipped checks, assumptions, or risks.

Clearly distinguish completed work from recommendations or future improvements.

Do not claim functionality is implemented, tested, or verified when it is not.

## General Agent Principles

- Prioritize correctness, maintainability, security, and simplicity.
- Prefer minimal solutions over unnecessary abstractions.
- Respect existing project conventions.
- Do not make assumptions about business requirements.
- Ask for clarification when requirements are ambiguous or incomplete.
- Never silently introduce breaking changes.
- Keep the repository clean and avoid unrelated modifications.

**Primary objective:** Deliver focused, production-ready changes that preserve the project's architecture, security, and established engineering standards.
