---
description: "Use when changing Daily Dots UI, layout, navigation, responsive behavior, themes, or colors. Defines the pastel lavender, sage, and cream design and accessibility checks."
applyTo: "**/*.tsx,**/*.ts,**/*.css"
---

# Design & UI/UX Guidelines

## 1. Core Design Principles

- Prioritize clarity, simplicity, consistency, and usability.
- Design interfaces around user needs and common workflows.
- Prefer intuitive interactions over unnecessary visual complexity.
- Keep interfaces clean, predictable, and easy to navigate.
- Avoid unnecessary decoration, visual noise, and redundant information.
- Ensure every UI element has a clear purpose.

## 2. Layout & Structure

- Maintain consistent page layouts, alignment, and content hierarchy.
- Use a predictable structure across pages and sections.
- Establish clear visual separation between content areas.
- Prioritize readable content widths and balanced layouts.
- Avoid overcrowding; provide sufficient space for content and interactions.
- Design layouts to adapt naturally to different screen sizes.
- Keep the application centered within its existing `max-w-7xl` container, without a desktop sidebar or sidebar-width content offset.
- Below `md` (768px), use one fixed bottom navigation with labeled icon links. From `md`, place it horizontally in the header; from `lg` (1024px), align brand, navigation, and theme/date controls on one row.
- Preserve the three main destinations: Overview (`/`), Journal archive (`/journals`), and New reflection (`/new`), plus entry detail and not-found routes.
- Keep the theme toggle in the header, JSON backup control in the upper utility area, and the encouragement/privacy/copyright content in the footer.
- On the dashboard, pair the introduction with summary cards at large sizes. Below, group mood check-in and latest pages alongside the weekly overview and writing prompt; stack these groups on smaller screens.
- Preserve existing English copy, the Daily Dots brand, and `© 2026 Svetlana Vrabie`. A layout-only task must not rewrite text or change journal behavior.

## 3. Spacing System

- Follow a consistent spacing scale throughout the application.
- Prefer reusable spacing values over arbitrary measurements.
- Apply consistent spacing between related elements.
- Use larger spacing to separate distinct sections and content groups.
- Maintain consistent padding and margins across similar components.
- Avoid excessive whitespace or unnecessarily compact layouts.

## 4. Typography & Hierarchy

- Use a consistent typography system across the application.
- Establish a clear hierarchy for page titles, section headings, body text, and supporting text.
- Use font size, weight, and line height to communicate importance.
- Keep body text comfortable to read.
- Avoid excessive font variations and unnecessary text styling.
- Use consistent text alignment and capitalization conventions.

## 5. Color & Visual Language

- Use a consistent and limited color palette.
- Use soft lavender, sage, and cream surfaces, with contrasting plum actions in light mode and lavender actions on warm charcoal in dark mode. Do not restore the former electric-blue brand palette unless explicitly requested.
- Keep these semantic tokens aligned with `src/styles/globals.css`:

| Token | Light | Dark |
| --- | --- | --- |
| `canvas` | `#FAF7F2` | `#1D1920` |
| `surface` | `#FFFDFA` | `#28232C` |
| `ink` | `#2F2A33` | `#F5EFF7` |
| `muted` | `#655C69` | `#C0B3C6` |
| `line` | `#D8CFDA` | `#4F4356` |
| `accent-soft` | `#EDE3F4` | `#3D2F48` |
| `accent-alt` | `#E3ECE0` | `#2B3B31` |
| `primary` | `#73558B` | `#D5BEE9` |
| `primary-hover` | `#5D4273` | `#E8D6F6` |

- Use shared `primary`, `primary-hover`, `accent-soft`, and `accent-alt` tokens for actions, focus indicators, navigation, summary cards, and decorative surfaces. Keep illustrations, favicon, and browser theme color consistent with the brand.
- Use the `notebook-*` tokens for the notebook illustration. Keep light/dark definitions in CSS, not hardcoded component colors.
- Keep the manual toggle and `data-theme` application mechanism. Light is the default for an absent or invalid saved preference; persist valid choices through the existing preferences service.
- Reserve peach, mint, and rose for mood/status meaning, not general decorative surfaces; keep mood labels and emoji alongside color.
- Assign clear roles to primary, secondary, accent, background, and text colors.
- Use colors consistently to communicate meaning and interaction states.
- Maintain sufficient contrast between text, backgrounds, and interactive elements.
- Do not rely on color alone to communicate status or important information.
- Use emphasis and accent colors selectively to preserve visual clarity.

## 6. Accessibility & Usability

- Target WCAG 2.2 AA accessibility principles.
- Ensure sufficient color contrast for text and interactive elements.
- Support keyboard navigation across all interactive components.
- Provide visible and consistent focus indicators.
- Use semantic HTML elements and appropriate ARIA attributes when necessary.
- Associate form labels with their respective inputs.
- Provide meaningful alternative text for informative images.
- Ensure interactive elements have clear labels and accessible names.
- Design touch targets with sufficient size and spacing.
- Communicate validation errors clearly and close to the relevant fields.
- Support reduced-motion preferences where animations are used.
- Keep visible text contrast at least 4.5:1 for normal text and 3:1 for large text; do not make actions illegible in pursuit of a paler palette.
- Preserve the skip link, one main landmark, active-route `aria-current`, and route-change focus on main content.

## 7. Component Consistency

- Reuse existing components and established design patterns.
- Maintain consistent appearance and behavior for similar components.
- Standardize buttons, inputs, dropdowns, dialogs, cards, tables, and navigation elements.
- Ensure component states are consistently designed:
  - Default
  - Hover
  - Focus
  - Active
  - Disabled
  - Loading
  - Error
  - Success
- Keep component responsibilities focused and predictable.
- Avoid introducing duplicate components with slightly different visual behavior.
- Prefer reusable design tokens for shared visual properties.

## 8. Responsive Design

- Design for mobile, tablet, and desktop experiences.
- Maintain content readability and usability across screen sizes.
- Adapt navigation and layouts according to available space.
- Prevent horizontal overflow and unnecessary scrolling.
- Ensure interactive elements remain accessible on touch devices.
- Prioritize content and functionality over preserving desktop layouts on smaller screens.
- Reserve space beneath page content for fixed phone navigation, including `env(safe-area-inset-bottom)`. Match scroll padding so focused controls and the footer remain reachable.
- Position toast notifications above phone navigation, not over it; restore the normal bottom spacing on tablet/desktop.
- Keep navigation links at least 44px in each dimension and keep backup/theme controls usable without a sidebar.
- Check widths 320, 360, 390, 640, 768, 1024, 1280, 1440, and 1920px in both themes. Include short viewports, landscape, zoom, and reduced motion where practical.
- Check overview, archive, new/edit form, entry detail, and not-found pages, including empty/populated data, errors, dialogs, and notifications. Use synthetic data on an isolated origin; never overwrite or export real journals for testing.
- Assert no horizontal overflow, clipped labels, obstructed actions, or covered footer; do not treat successful compilation alone as responsive validation.

## 9. Interaction & Feedback

- Make interactive elements visually recognizable.
- Provide immediate and meaningful feedback after user actions.
- Use clear loading, success, warning, and error states.
- Prevent accidental destructive actions through appropriate confirmation.
- Keep navigation behavior predictable.
- Avoid unnecessary animations and transitions.
- Ensure interactions are consistent across the application.

## 10. Design Discipline

- Follow existing project design conventions before introducing new patterns.
- Centralize reusable design values and avoid hardcoded inconsistencies.
- Avoid one-off styling unless justified by a specific requirement.
- Do not sacrifice accessibility for visual appearance.
- Keep visual changes focused and avoid unrelated UI modifications.
- Prioritize maintainability and consistency over unnecessary customization.

## 11. Definition of Done

Before considering a UI implementation complete, verify that:

- The interface is clear, intuitive, and visually consistent.
- Layout and spacing follow established design conventions.
- Typography and colors maintain a clear hierarchy.
- Components behave consistently across the application.
- Responsive behavior works across supported screen sizes.
- Keyboard navigation and visible focus states are supported.
- Accessibility and contrast requirements are respected.
- Loading, empty, error, and success states are handled where applicable.
