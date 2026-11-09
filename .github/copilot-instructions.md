# GitHub Copilot Instructions

## 1. Project overview

This repository contains **Daily Dots**, a local-first daily journal with
a 12-emotion mood selector, built
with:

- **Vite**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (planned for future persistence; the initial
  implementation uses browser `localStorage`)

The application helps users write one plain-text reflection per calendar
date, record a mood, browse/search/filter entries, review weekly mood
history, and download JSON backups. Mood intensity, rich text, imports,
charts, and other extensions described below are not implemented.

Preserve the Daily Dots name, existing English interface copy, and
`© 2026 Svetlana Vrabie` attribution during layout-only changes.
Follow [AGENTS.md](../AGENTS.md) for workflow and the scoped
[design](instructions/design.instructions.md),
[CSS/Tailwind](instructions/css-tailwind.instructions.md), and
[TypeScript/React](instructions/typescript-react.instructions.md)
instructions for their respective technical domains.

When making changes, first inspect the existing repository,
`package.json`, TypeScript/Vite configuration, and current
implementation. Respect established working patterns where they do not
conflict with these instructions. Do not assume a dependency is
installed merely because it is mentioned here.

## 2. Core engineering principles

Follow a **clean, pragmatic architecture**:

- Prefer readable, maintainable, well-typed code.
- Apply SOLID principles, separation of concerns, DRY, and single
  responsibility where they provide practical value.
- Avoid overengineering, speculative abstractions, unnecessary design
  patterns, and premature optimization.
- Keep components and functions focused.
- Reuse existing functionality before creating a new abstraction.
- Make the smallest coherent change that solves the requirement.
- Do not introduce dependencies without a clear benefit.
- Do not silently change unrelated functionality.

## 3. Technology and implementation choices

Use these existing project decisions as the default:

| Area | Current implementation |
| --- | --- |
| Language | Strict TypeScript |
| UI | React functional components and Hooks |
| Build tooling | Vite |
| Styling | Tailwind CSS utilities and shared CSS theme tokens |
| UI components | Custom React components; no general-purpose UI framework |
| Project organization | Feature-based |
| State management | React `useState` and `useContext` |
| Routing | React Router |
| Forms | React Hook Form + Zod |
| Entry content | Validated plain text, not HTML or editor JSON |
| Dates | date-fns and a native date input |
| Icons | Font Awesome; labeled emoji for moods |
| Testing | Vitest + React Testing Library |
| Persistence | localStorage behind a repository/provider boundary |
| Themes | Manual light/dark toggle; saved preference, light default |
| Typography | Inter/system sans-serif with existing serif display accents |
| Accessibility | WCAG 2.2 AA target |

Supabase, Tiptap, Recharts, monthly calendars, tags, reminders, CSV export,
and backup import are possible future extensions, not installed or
implemented features. Do not introduce them during UI maintenance or
solely because they appear in future-feature guidance.

Before adding or upgrading packages, inspect the existing dependencies
and versions. Use compatible versions and the package manager already
used by the repository.

## 4. Project structure

Use the existing **feature-based structure**:

```text
src/
  app/                      Application, router, provider, shared layout
  features/dashboard/       Overview and mood check-in
  features/journal/         Forms, pages, domain schemas, hooks, summaries
  infrastructure/storage/   Journal repository and theme preferences
  shared/                   Shared UI, dates, privacy-safe diagnostics
  styles/globals.css        Tailwind layers, theme tokens, motion rules
  test/                     Test setup
  main.tsx
```

This is a guide, not a requirement to create every folder in advance.
Create folders when they are needed.

### Structure rules

- Keep feature-specific UI, hooks, types, and logic inside that
  feature.
- Put genuinely reusable UI in `shared/components`.
- Put reusable hooks in `shared/hooks`.
- Put cross-feature utilities and constants in their corresponding
  shared folders.
- Keep application setup, providers, layouts, and routing under `app`.
- Keep persistence implementations and adapters in `infrastructure`.
- Do not create duplicate shared components for one-off feature UI.
- Avoid excessively deep folder nesting.

## 5. Naming conventions and imports

Use consistent React and TypeScript naming:

- React components and component files: `PascalCase`,
  e.g. `JournalEntry.tsx`.
- Custom hooks: `camelCase` with the `use` prefix,
  e.g. `useJournal.ts`.
- Services and utilities: `camelCase`, e.g. `journalService.ts`,
  `dateUtils.ts`.
- Types and interfaces: descriptive `PascalCase` names.
- CSS classes: `kebab-case`.
- Constants: use clear descriptive names; use `UPPER_SNAKE_CASE` for
  true module-level constants where appropriate.

Configure the `@/` alias to point to `src/` consistently in both Vite
and TypeScript configuration. Prefer aliased imports for cross-feature
and shared modules. Keep imports grouped consistently:

1.  React and framework imports.
2.  Third-party packages.
3.  Internal aliased imports.
4.  Relative imports where appropriate.
5.  CSS and asset imports.

Do not introduce barrel `index.ts` files everywhere by default. Use them
only when they make a module's public API clearer.

## 6. TypeScript standards

- Use strict TypeScript settings where the existing project
  configuration allows.
- Define explicit types for component props, service inputs/outputs,
  domain models, and persisted data.
- Prefer `type` or `interface` based on the shape and intended use; be
  consistent.
- Avoid `any`. Use `unknown` for untrusted values and narrow it
  safely.
- Do not use non-null assertions to silence errors unless the
  invariant is genuinely guaranteed and documented.
- Model optional and nullable values accurately.
- Use discriminated unions for states with distinct variants when they
  improve correctness.
- Validate data loaded from `localStorage`, imported files, and other
  untrusted boundaries at runtime; TypeScript types alone do not
  validate runtime data.
- Keep domain types independent of React and storage implementation
  details.

## 7. React component and Hooks standards

- Use functional components and React Hooks; do not introduce class
  components.
- Keep components small and focused on one clear responsibility.
- Extract complex UI into smaller components when doing so improves
  readability or reuse.
- Keep presentation separate from business and persistence logic.
- Use custom hooks for reusable React behavior and stateful
  interactions.
- Follow the Rules of Hooks.
- Do not call Hooks conditionally or inside loops or nested functions.
- Use stable, meaningful keys when rendering lists.
- Avoid unnecessary effects. Derive values during render when possible
  rather than synchronizing redundant state with `useEffect`.
- Keep controlled inputs predictable.
- Use `useContext` for state that genuinely needs to be shared across
  distant parts of the component tree; do not turn all state into
  global context.
- Use `useState` for local UI state.
- Do not add Redux, Zustand, or another state library unless
  requirements materially change and the choice is explicitly
  approved.

## 8. State management

Use React's built-in `useState` and `useContext` initially.

- Keep transient UI state local to the component or feature where
  possible.
- Use context for cross-cutting state such as theme or shared
  application preferences when appropriate.
- Keep persisted domain data behind repository/service APIs rather
  than accessing storage from components.
- Do not store the same state in multiple places without a clear
  synchronization strategy.
- Avoid using context for rapidly changing state that causes broad,
  unnecessary rerenders.

## 9. Styling, design system, and themes

### Tailwind CSS and shared styles

Use the installed Tailwind CSS utilities as the default styling approach.
Follow [CSS/Tailwind instructions](instructions/css-tailwind.instructions.md).
Do not introduce a competing framework, CSS-in-JS, or Sass without an
explicit requirement.

- Keep component styling close to JSX through existing utility patterns.
- Keep shared button, field, card, and eyebrow styles in the existing
  components layer in `src/styles/globals.css`.
- Keep resets, typography, theme variables, scroll padding,
  reduced-motion rules, and notebook pseudo-elements in shared CSS.
- Add component CSS only when utilities are insufficient or a focused
  stylesheet is clearer.
- Avoid inline styles for ordinary styling.

### CSS variables and design tokens

Centralize design values with CSS custom properties. Define semantic
tokens for:

- Backgrounds and surfaces.
- Primary, secondary, accent, and mood colors.
- Text and muted text.
- Borders and focus rings.
- Spacing.
- Typography.
- Border radii.
- Shadows.
- Transitions and animation durations.

Do not scatter repeated literal color values throughout component CSS.
Use the existing `--surface`, `--ink`, `--primary`, `--accent-soft`, and
related RGB-triplet variables, exposed through the Tailwind configuration.

### Visual direction

The visual style is **calm, expressive, and pastel**, using lavender,
sage, cream, and contrasting plum rather than the former electric-blue
brand. The complete token table lives in
[design instructions](instructions/design.instructions.md).

- Light theme: plum primary `#73558B`, hover `#5D4273`, lavender
  `#EDE3F4`, sage `#E3ECE0`, cream canvas `#FAF7F2`, ink `#2F2A33`.
- Dark theme: warm charcoal canvas `#1D1920`, surface `#28232C`,
  lavender primary `#D5BEE9`, hover `#E8D6F6`, accent surfaces
  `#3D2F48` and `#2B3B31`, ink `#F5EFF7`.
- Use shared `primary`, `primary-hover`, `accent-soft`, and `accent-alt`
  tokens for actions, navigation, focus rings, branding, illustrations,
  and decorative surfaces; do not hardcode these colors in components.
- Reserve peach, mint, and rose for mood/status meaning rather than
  general decoration.

Use color intentionally without sacrificing readability or
accessibility. Mood colors should be
consistent throughout selectors, calendars, charts, and summaries.

Use a modern sans-serif typeface, preferably Inter if it is already
available or can be added appropriately. Establish a clear typography
hierarchy and comfortable line lengths for journal writing.

### Light and dark themes

Support both light and dark themes with a **manual theme toggle**.

- Define theme values using CSS custom properties.
- Keep the selected theme in `localStorage`.
- Apply the theme consistently across all existing features, forms,
  dialogs, notifications, and navigation.
- Avoid hardcoded light-only colors in component styles.
- Ensure both themes maintain accessible contrast.
- Use the existing preferences service and `data-theme` mechanism;
  default to light when the saved preference is absent or invalid.

## 10. Responsive design and application layout

Use a **mobile-first** approach:

- Start with layouts suitable for narrow screens.
- Progressively enhance using the existing Tailwind breakpoints.
- Use flexible layouts, relative sizing, and CSS Grid/Flexbox
  appropriately.
- Avoid fixed widths that cause horizontal overflow.
- Ensure forms, mood selectors, weekly history, dialogs, and notifications
  remain usable on small screens.

Keep the **centered, sidebar-free layout** in `AppLayout`:

- Below 768px, use one fixed bottom navigation with labeled icons.
- From 768px, place navigation horizontally in the header; from 1024px,
  align brand, navigation, and theme/date controls on one row.
- Preserve Overview (`/`), Journal archive (`/journals`), New reflection
  (`/new`), and the entry-detail route (`/journals/:date`).
- Keep one theme toggle in the header and one JSON backup action in the
  upper utility area, available at every supported size.
- Keep encouragement, privacy wording, and copyright in the footer.
- Reserve mobile navigation space using safe-area-aware page/scroll
  padding; display toasts above the navigation.
- On the dashboard, pair introduction and statistics at large sizes,
  then group mood check-in/latest pages beside weekly history and the
  writing prompt. Stack groups on smaller screens.
- Preserve active-route indication, skip navigation, and main-content
  focus on route changes. Do not add placeholder destinations.

## 11. Routing

Use React Router.

- Keep route definitions centralized in the app routing module.
- Use clear route paths and feature page components.
- Use shared layouts where appropriate.
- Handle unknown routes with a useful not-found page.
- Do not implement authentication or protected routes in the initial
  version; authentication is intentionally deferred.
- Keep the route structure ready for future authentication without
  adding unused auth scaffolding now.

## 12. Reusable UI components

Use a hybrid component strategy:

- Shared components for generic UI such as buttons, cards, inputs,
  dialogs/modals, dropdowns, badges, loading states, empty states, and
  toast notifications.
- Feature components for domain-specific UI such as the journal
  editor, mood selector, mood calendar cell, and mood summary.
- Keep business-specific components within their feature.
- Promote a component to shared only when it is genuinely reused or
  clearly represents a cross-feature primitive.
- Define typed props and accessible interaction behavior.
- Avoid building a component abstraction for a one-off element without
  a clear reuse or complexity benefit.

Build shared UI with React, existing Tailwind utilities, and shared CSS
rather than adopting a general-purpose UI framework.

## 13. Forms and validation

Use React Hook Form with Zod for forms.

- Define reusable Zod schemas close to the feature or domain they
  validate.
- Infer TypeScript form types from schemas where practical.
- Use clear, actionable validation messages.
- Display validation errors accessibly and associate them with their
  inputs.
- Validate at form boundaries and validate imported or persisted data
  at runtime.
- Do not duplicate the same validation rules in multiple components.
- Keep form components focused on presentation and user interaction.

## 14. Supabase and persistence architecture

### Initial implementation: localStorage

The current version uses **browser `localStorage` only** for date-keyed
journal entries (including each entry's mood) and the theme preference.
Supabase is a future option, not an installed or active backend.

Keep `daily-dots:journals:v1` and `daily-dots:theme:v1` compatible.
Layout and styling changes must not migrate, rename, reset, or replace
stored records.

Do not add Supabase authentication or make Supabase database calls in
the initial implementation unless explicitly requested.

### Storage abstraction

Prepare for future Supabase integration using repository/storage
abstractions:

- Define clear repository interfaces for domain operations.
- Implement localStorage-backed repositories initially.
- Keep components and feature hooks independent of the concrete
  storage implementation.
- Inject or compose repository implementations at an appropriate
  application boundary.
- Keep domain models independent of browser storage and Supabase SDK
  types.
- Do not create a complex generic repository framework; define only
  the operations the application actually needs.
- A future Supabase implementation should be replaceable without
  rewriting UI components or business rules.

### localStorage safety

- Centralize browser storage access in infrastructure/storage modules.
- Do not call `localStorage` directly from UI components.
- Handle missing, malformed, or outdated stored data safely.
- Catch JSON parse and storage access errors.
- Use stable, namespaced storage keys and version persisted data where
  appropriate.
- Consider browser storage availability and quota failures.
- Do not silently discard user data when parsing or migration fails;
  provide safe error handling and recovery guidance.
- Avoid storing duplicate or derivable data unnecessarily.

### Future Supabase integration

When Supabase is explicitly introduced:

- Keep the Supabase client in a dedicated infrastructure module.
- Read public client configuration from Vite environment variables.
- Never expose a Supabase service-role key or any other secret in
  browser code.
- Use Row Level Security (RLS) for user-owned records once
  authentication exists.
- Do not assume client-side checks provide database security.
- Keep Supabase-specific queries inside repository implementations.
- Do not add future Supabase code preemptively when it is not needed
  by the current task.

## 15. Authentication

Authentication is **not part of the initial version**.

- Do not add login, registration, password reset, OAuth, magic-link
  flows, auth providers, or protected routes unless explicitly
  requested.
- Do not invent a default user identity or pretend local data is
  securely associated with an account.
- Keep the current local-only experience straightforward.
- If authentication is later requested, design it around Supabase Auth
  and ensure data ownership and RLS are addressed together.

## 16. Domain features

### Current implementation

- One entry per local `YYYY-MM-DD` date, with validated plain text,
  a stable mood value, and creation/update timestamps.
- Create, read, update-in-place, and confirmed permanent deletion.
- Twelve centrally defined emotions: happy, calm, okay, sad, anxious,
  angry, excited, grateful, hopeful, proud, tired, and overwhelmed.
- Mood quick check-in opens a draft without saving or discarding the
  existing text; changes apply only on explicit save.
- Newest-first archive, text/date search, mood filter, and filter reset.
- Total entries, writing streak, weekly counts/dots, and recent entries
  derived from persisted records, not invented history.
- Native date selection; existing dates load their saved entries.

Keep the existing schemas, `MOODS` definitions, repository/provider
boundary, and summary services authoritative.

### Future extensions: explicit request required

The remaining domain guidance describes optional future capabilities,
not work to implement automatically or claims about current behavior.
Keep current plain-text storage and routes unchanged unless a feature
and any required migration are explicitly approved.

### Future journal capabilities

Journal entries should support:

- A title.
- Rich text content.
- Creation and update timestamps.
- Date association.
- Mood association where appropriate.
- Predefined categories and user-created tags.
- Multiple tags per entry.
- Search by title and content.
- Filtering by date range, mood, and tags.
- Sorting and chronological browsing.
- Create, read, update, and delete operations.

Keep journal domain logic and persistence out of the editor component.

### Future rich text editor: Tiptap

Use Tiptap with its React integration for rich text editing.

- Store the canonical editor document as **Tiptap JSON**, not HTML.
- Support the agreed basic formatting: headings, bold, italic, bullet
  lists, and numbered lists.
- Keep the toolbar accessible and keyboard-friendly.
- Reuse editor configuration where appropriate.
- Validate imported editor JSON before rendering or editing it.
- Treat rendered user-authored content as untrusted; do not inject
  arbitrary HTML.
- If HTML is needed for export or display, derive it safely from the
  structured document rather than maintaining duplicate canonical
  copies.
- Keep editor-specific code within the journal feature or a clearly
  named shared editor module if genuinely reused.

### Future mood intensity tracking

Use an emoji-based emotion selector with a separate mood-intensity
value.

- Provide a predefined, consistent set of emotions (for example:
  happy, calm, neutral, sad, anxious, and angry).
- Store the selected emotion as a stable value, not only as display
  text or an emoji glyph.
- Store intensity using a clearly defined and consistently validated
  scale.
- Keep labels, emoji, and colors in a central mood definition rather
  than duplicating them throughout the app.
- Make the selector keyboard accessible and provide text labels for
  assistive technology.
- Allow users to review mood history and relevant journal
  associations.

### Future mood statistics and charts

Use Recharts for mood history and statistics.

- Support weekly and monthly mood trends and summaries.
- Visualize mood distribution and intensity where useful.
- Derive chart data from persisted domain records; do not store
  redundant chart datasets.
- Handle empty and insufficient data states gracefully.
- Provide accessible labels, legends, and textual summaries where
  appropriate.
- Ensure charts resize responsively and work in both themes.
- Do not imply medical or diagnostic conclusions from mood data.

### Future monthly calendar

Build a custom React calendar with CSS; do not add a calendar library
for the initial implementation.

- Support monthly navigation.
- Show mood and journal-entry indicators on relevant dates.
- Support selecting a date and navigating to its entries.
- Keep date calculations in reusable utilities using date-fns.
- Ensure keyboard accessibility and clear focus/selected states.
- Make the calendar usable on mobile and desktop.

### Future search extensions, tags, and categories

Support:

- Search by journal title and content.
- Date-range filters.
- Mood filters.
- Tag filters.
- Predefined categories and custom user-created tags.
- Multiple tags per entry.

Keep filtering and sorting logic in feature services or utilities, not
embedded in large page components. Handle combinations of filters
predictably and provide a clear way to reset them.

### Future reminders

Implement optional **in-app reminders** only.

- Allow users to configure reminder preferences.
- Persist preferences locally.
- Display reminders within the application when appropriate.
- Do not request browser notification permission or implement
  push/browser notifications unless explicitly requested.
- Do not claim that a reminder will fire when the application is
  closed if the implementation cannot guarantee that behavior.

## 17. Data export and import

The current release provides **JSON backup export only**, not restore,
merge/import, or CSV export.

### Current JSON backup

- Preserve the `daily-dots` format marker, version `1`, export timestamp,
  and complete array of journal entries.
- Preserve the `daily-dots-YYYY-MM-DD.json` download filename.
- The theme remains a separate local preference and is not included in
  the backup payload.
- Keep the action disabled while journals are loading or storage is
  invalid; never export a success-shaped empty backup after a read failure.
- Confirmed deleted entries are excluded from later exports; existing
  downloaded files are not changed.
- Keep privacy and recovery wording clear. A download is a manual backup,
  not cloud sync or automatic restore.

### Future JSON restore/import

Only add import when explicitly requested. Define and document its
versioned format and compatibility with existing exports first.

- Validate imported files before applying them.
- Handle unsupported versions, malformed JSON, missing fields, and
  invalid records gracefully.
- Show a clear confirmation before replacing or merging existing data.
- Never overwrite existing data without an explicit user action.
- Prefer an atomic import process: validate the complete backup before
  committing changes.

### Future CSV export

Only add CSV export when explicitly requested.

- Support CSV export of journal entries and mood records.
- Use stable, documented column headers.
- Escape commas, quotes, and line breaks correctly.
- Handle dates consistently.
- Make clear that CSV is an export format and may not preserve the
  complete rich-text structure or all application metadata.

## 18. Error handling, notifications, and logging

### Error handling

Use centralized error handling in service/repository boundaries and
reusable toast notifications.

- Convert low-level storage or service failures into useful
  application-level errors.
- Show concise, user-friendly messages.
- Do not expose stack traces or implementation details to users.
- Use inline messages for field validation and local form errors.
- Use toast notifications for appropriate success and failure
  feedback.
- Add React Error Boundaries for unexpected rendering failures where
  appropriate; they complement rather than replace service error
  handling.

### Logging

Create a small centralized logging utility with levels such as `debug`,
`info`, `warn`, and `error`.

- Keep development diagnostics useful.
- Avoid noisy production logs.
- Never log journal content, mood notes, imported personal data,
  credentials, or other sensitive information.
- Do not add Sentry or another external monitoring service unless
  explicitly requested.

## 19. Animations and interaction design

Use **rich but purposeful animations** to support the creative and
expressive visual direction.

Appropriate examples include:

- Animated mood selection and feedback.
- Smooth page transitions where they do not disrupt navigation.
- Interactive cards and hover/focus feedback.
- Gentle entry and exit transitions for dialogs and notifications.
- Small celebratory or encouraging visual effects when appropriate.

Use CSS transitions and keyframes by default. Do not add an animation
library unless the requirement justifies it.

Animation rules:

- Keep animations short and purposeful.
- Do not animate every element.
- Avoid motion that delays or blocks user actions.
- Support `prefers-reduced-motion`.
- Preserve keyboard and screen-reader usability.
- Avoid effects that cause layout shifts or poor performance.

## 20. Accessibility

Target **WCAG 2.2 AA**.

- Use semantic HTML elements.
- Ensure all interactive functionality is keyboard accessible.
- Provide visible focus indicators.
- Use appropriate accessible names and labels.
- Associate form fields and validation messages correctly.
- Provide text alternatives for meaningful images and icons.
- Use ARIA only when native HTML semantics are insufficient.
- Maintain sufficient color contrast in light and dark themes.
- Do not communicate mood or status using color alone; include labels,
  icons, or text.
- Ensure dialogs manage focus appropriately.
- Support reduced motion.
- Make charts and custom calendar interactions accessible to keyboard
  and assistive technology users.
- Test responsive layouts with zoom and narrow viewports.

## 21. Icons and visual assets

Use **Font Awesome** for interface icons.

- Follow the package and version already installed, if present.
- If it is not installed, choose the appropriate React integration and
  compatible icon package before adding it.
- Prefer consistent icon families and sizes.
- Use accessible labels for icon-only buttons.
- Decorative icons should not create redundant screen-reader
  announcements.
- Use emojis specifically where they represent mood choices or
  meaningful emotional content; do not replace every interface icon
  with an emoji.
- Do not introduce an additional icon library without a clear reason.

## 22. Environment configuration and secrets

Use Vite environment files and a centralized typed configuration module.

The current app needs no environment variables or backend configuration.
Only introduce configuration files when an approved feature needs them.

- Support `.env`, `.env.development`, and `.env.production` where
  needed.
- Maintain a `.env.example` containing variable names and safe
  placeholder values.
- Keep real environment files out of version control.
- Remember that variables prefixed with `VITE_` are exposed to browser
  code.
- Never put passwords, private API keys, Supabase service-role keys,
  or other secrets in client-side environment variables.
- Validate required configuration at the application boundary and
  provide actionable development errors.
- Do not hardcode environment-specific URLs or credentials in
  components.

## 23. Performance

Optimize when there is a demonstrated need.

- Prefer straightforward React code first.
- Use `React.memo`, `useMemo`, and `useCallback` only when they
  address a real rendering or computation concern.
- Use route-level lazy loading and code splitting when appropriate.
- Avoid unnecessary large dependencies.
- Avoid repeated expensive calculations in render paths.
- Keep charts and rich-text editor code scoped to the features that
  need them.
- Measure or identify the bottleneck before introducing complex
  optimizations.
- Do not sacrifice readability for speculative performance gains.

## 24. Testing

Use **Vitest** and **React Testing Library**.

- Write unit tests for business rules, date calculations, mood
  calculations, filtering, validation, and storage/repository
  behavior.
- Write component tests that exercise user-visible behavior and
  interactions.
- Prefer queries by role, label, and accessible name.
- Avoid testing implementation details such as internal state or
  private component methods.
- Test loading, empty, success, and error states where applicable.
- Test malformed or missing localStorage data and import validation.
- Test theme and responsive behavior where practical.
- Mock external boundaries rather than mocking the component's
  internal implementation.
- Keep tests deterministic and independent of real personal data.
- Do not add Playwright or another end-to-end framework unless
  explicitly requested.
- For UI changes, use available browser tools to check the affected
  pages in both themes at 320, 360, 390, 640, 768, 1024, 1280, 1440, and
  1920px. Check navigation clearance, overflow, readable labels, dialog
  geometry, focus, and notifications; include short screens and reduced
  motion where practical.
- Browser verification must use synthetic data on an isolated origin
  without overwriting real journals. jsdom tests do not establish
  responsive geometry.
- For documentation-only changes, validate links, instruction
  frontmatter, and consistency; application tests/builds are unnecessary
  unless documentation-specific tests exist.

## 25. Documentation

Maintain a useful README with:

- Project purpose and main features.
- Technology stack.
- Prerequisites.
- Installation and local development instructions.
- Environment configuration.
- Test and build commands.
- High-level project structure.
- Notes about local-only data storage and backup/export.

Document complex business rules, non-obvious decisions, and public
interfaces where useful. Prefer clear naming and simple code over
comments that merely repeat what the code does. Update documentation
when a change materially alters setup, behavior, or architecture.

## 26. Git conventions

Use **Conventional Commits**:

- `feat:` for new functionality.
- `fix:` for bug fixes.
- `refactor:` for code restructuring without behavior changes.
- `test:` for tests.
- `docs:` for documentation.
- `chore:` for maintenance and tooling.

Prefer focused feature branches and pull-request-oriented changes. Do
not create commits, push branches, or open pull requests unless the user
explicitly asks.

## 27. Copilot working behavior

When implementing a request:

1.  Inspect the relevant files and existing patterns before editing.
2.  Identify the feature and layer that should own the change.
3.  Reuse existing components, hooks, services, types, and utilities
    where appropriate.
4.  Keep UI, business logic, and persistence responsibilities separate.
5.  Implement the smallest complete solution that satisfies the request.
6.  Add or update tests for changed behavior.
7.  Update documentation when necessary.
8.  Run relevant tests, linting, and build/type checks when available.
9.  Review the final diff for unrelated changes, duplicated logic,
    unsafe data handling, and accessibility issues.
10. Summarize what changed and mention any checks that could not be run.

Additional rules:

- Do not fabricate files, package scripts, APIs, or existing
  functionality. Inspect the repository first.
- Do not silently install dependencies or change major versions.
- Do not add authentication, Supabase persistence, browser
  notifications, analytics, or external monitoring unless requested.
- Do not send journal or mood content to external services.
- Do not make destructive changes to stored data or import/export
  behavior without explicit confirmation and a safe migration/recovery
  approach.
- Ask a concise clarification only when a requirement is genuinely
  ambiguous and cannot be resolved from the repository or request.
- When a task conflicts with these instructions, explain the conflict
  and follow the user's explicit, informed direction.

## 28. Product and privacy constraints

This application handles private journal entries and mood information.
Treat all such information as sensitive user content.

- Keep data local in the initial version.
- Do not add telemetry, analytics, advertising, or external content
  processing without explicit approval.
- Do not include real journal content in examples, fixtures, logs,
  screenshots, or tests.
- Use synthetic data for tests and development examples.
- Make backup and restore behavior transparent to the user.
- Clearly communicate that browser `localStorage` is
  device/browser-local storage, not encrypted cloud backup. Users can
  lose data if they clear browser storage or change devices; encourage
  JSON backups.
- Do not describe localStorage as secure storage or as protection
  against other people or scripts with access to the browser origin.

---

**Primary goal:** Build a polished, expressive, responsive, accessible
Daily Dots journal with clean TypeScript/React code, Tailwind CSS,
pastel light/dark themes, responsive sidebar-free navigation, local-first
persistence, and a clear path to future Supabase integration---without
unnecessary complexity.
