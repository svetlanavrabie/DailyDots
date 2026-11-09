# Daily Dots

A local-first notebook for observations, moods, and fresh perspectives, built with Vite, React, TypeScript, and Tailwind CSS. One day, one entry: choose a calendar date, record your mood, and write a reflection. Selecting an existing date loads that entry for editing.

## Run locally

Requires Node.js 22.12+ (Node 22 or 24 LTS recommended) and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite.

```sh
npm test          # Vitest + React Testing Library
npm run lint     # ESLint
npm run typecheck
npm run build    # TypeScript checks + production bundle
npm run preview  # Serve the production bundle locally
```

Use a maintained Node version to run the patched Vite and Vitest tooling. No environment variables, Supabase account, authentication, or backend are required.

TypeScript 5.9 supports the declaration syntax used by the Vite React plugin.
The ESLint parser/plugin are kept compatible with this compiler. A scoped npm
override keeps their transitive `minimatch` dependency on the patched 11.x line.

## Features

- **Overview:** a 12-emotion quick check-in, summary, current writing streak, weekly mood dots, recent entries, and a quick link to today's journal. Choosing a mood opens today's entry with that feeling selected; it never saves automatically or discards existing journal text.
- **Journal archive:** newest-first history, text/date search, mood filtering, and entry details with edit/delete actions.
- **New reflection:** native date selection and a **Last week** button revealing the previous Monday–Sunday week as selectable dates; 12 labeled emotions (happy, calm, okay, sad, anxious, angry, excited, grateful, hopeful, proud, tired, overwhelmed), validated plain text, and create-or-update behavior. Existing saved moods remain compatible.
- Larger, consistently styled mood emojis on journal cards, entry details, and weekly history, with text labels and accessible names.
- Confirmed permanent deletion, accessible native dialog, responsive navigation, and reduced-motion support.
- Centered, sidebar-free layout: horizontal navigation on tablets/desktops and a fixed bottom navigation on phones, with room for device safe areas. Theme and JSON backup controls remain available at every screen size. The dashboard pairs its introduction with summary cards, then groups mood check-in and recent pages alongside the weekly overview.
- Pastel lavender, sage, and cream styling with contrasting plum actions, renewed interface copy, and a matching favicon.
- Manual light/dark theme and downloadable JSON backups. The default is light; the selected theme is saved locally. The dark theme uses warm charcoal surfaces with soft lavender and sage accents.

Navigation sits at the bottom below 768px, moves into a horizontal header
from 768px, and shares a row with branding and theme/date controls from
1024px. Mobile content, scroll padding, and toast positioning account for
the fixed navigation and device safe areas.

Mood choices keep three columns through small-tablet widths and expand
to six only when labels fit. Weekly dots shrink on narrow phones, and the
page can fit a 320px viewport even when scrollbars reduce its usable width.

## Data and privacy

Entries live **only in this browser on this device**, under `daily-dots:journals:v1` in localStorage. They are not encrypted, synced, associated with an account, or protected against scripts or other people with access to the browser. Clearing site data, changing browsers, or changing the development server's origin can make entries unavailable. No journal content is sent to external services.

Use **Download JSON backup** regularly, and keep the downloaded file private. This release offers backup export only, not automatic restore/import. Backups contain a format marker, version, export timestamp, and all journal entries; the theme is a separate device preference. Do not clear browser data before saving a backup.

To delete an entry, open its details and select the trash button. The confirmation dialog lets you keep the entry or permanently delete it. Confirmed deletions are saved locally and excluded from subsequent JSON downloads. Previously downloaded backup files are not changed.

Malformed or unsupported stored data blocks journal operations rather than silently deleting or replacing it. For recovery, copy the raw `daily-dots:journals:v1` value from your browser's developer tools (Application/Storage → Local Storage) into a private file before attempting any repairs. Storage quota/access failures are surfaced, and an unsuccessful save leaves the draft visible.

The entry's local `YYYY-MM-DD` date is its unique key, independent of timezone offsets and daylight-saving changes. Saves update that date in place, preserve its creation timestamp, and refresh the update timestamp. Weeks run Monday–Sunday. The current streak includes consecutive entries ending today, or yesterday when today has not yet been written; future entries do not extend it.

Drafts are saved only with the save button. Date switching and cancellation warn before discarding, and closing/reloading the tab warns about unsaved edits. Navigating away through other application links does not save a draft.

On New reflection, **Last week** expands or collapses seven date buttons
for the calendar week before the current week (Monday–Sunday), not a
rolling seven-day window or a week relative to the selected date.
Opening the choices does not change or save the draft. Selecting another
date asks for confirmation, then loads that day's saved reflection or a
blank draft. Cancelling preserves the draft; selecting the current date
does nothing. Date controls show pointer cursors, support keyboard use,
and wrap on phones. The native date input remains available for any date.

## Structure

```text
src/
  app/                      Application, routing, provider, layout
  features/dashboard/       Home summary
  features/journal/         Domain validation, forms, pages, hooks, summaries
  infrastructure/storage/   localStorage journal repository and preferences
  shared/                   Shared UI, dates, privacy-safe diagnostics
  styles/                   Tailwind directives and theme tokens
  test/                     Test setup
```

The UI consumes the asynchronous `JournalRepository` contract through `JournalProvider`. The local implementation owns runtime validation, versioned storage, and date-keyed upserts. A future Supabase repository can implement the same contract and be injected in `App` without putting database calls into components. Supabase persistence and authentication are deliberately not implemented.

## Deployment

`npm run build` creates `dist`. Deploy its contents to a static host configured to serve `index.html` for unknown paths, so React Router deep links work. The development/preview servers bind to localhost by default.

Setup follows [React's Vite guidance](https://react.dev/learn/build-a-react-app-from-scratch#vite), with routing and styling added explicitly.

## Contributor and agent guidance

- [AGENTS.md](AGENTS.md): workflow, architecture boundaries, privacy, and validation.
- [Copilot instructions](.github/copilot-instructions.md): current product scope and project conventions.
- [General engineering](.github/instructions/general.instructions.md): focused changes and documentation consistency.
- [Design](.github/instructions/design.instructions.md): pastel tokens, layout, navigation, accessibility, and responsive validation matrix.
- [CSS and Tailwind](.github/instructions/css-tailwind.instructions.md): styling implementation and mobile safe areas.
- [TypeScript and React](.github/instructions/typescript-react.instructions.md): types, components, state, repositories, and regression coverage.

For UI changes, run the tests, lint, type checks, and build above, then
validate the affected pages at phone, tablet, and desktop sizes in both
themes. Use only synthetic entries on an isolated origin; never replace
real journal data during testing. Documentation-only changes need link,
instruction-frontmatter, and consistency checks rather than an application
rebuild.

## Copyright

© 2026 Svetlana Vrabie
