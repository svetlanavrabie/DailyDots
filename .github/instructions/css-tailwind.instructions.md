---
description: "Use when editing Daily Dots CSS or React styling. Covers Tailwind utilities, semantic pastel theme tokens, responsive navigation, and mobile safe areas."
applyTo: "**/*.css,**/*.ts,**/*.tsx"
---

# CSS & Tailwind CSS Guidelines

## 1. Styling Approach

- Use **Tailwind CSS utility classes as the default styling approach**.
- Prefer existing design system tokens, theme variables, and reusable components.
- Avoid unnecessary custom CSS when an equivalent Tailwind utility exists.
- Keep styling consistent, predictable, and maintainable.
- Avoid inline styles unless values are genuinely dynamic and cannot be expressed through Tailwind.
- Do not introduce additional CSS frameworks or styling libraries without approval.
- Use the pastel palette and sidebar-free layout in [design.instructions.md](design.instructions.md); do not introduce a competing palette or styling approach.
- Keep theme RGB triplets in `src/styles/globals.css` and expose colors through `tailwind.config.js` as `rgb(var(--token) / <alpha-value>)` so opacity utilities work in both themes.

## 2. Tailwind Class Organization

Organize utility classes consistently in the following order:

1. Layout and positioning (`container`, `block`, `flex`, `grid`, `relative`).
2. Sizing (`w-*`, `h-*`, `min-*`, `max-*`).
3. Spacing (`m-*`, `p-*`, `gap-*`).
4. Typography (`text-*`, `font-*`, `leading-*`, `tracking-*`).
5. Backgrounds and colors (`bg-*`, `text-*`, `border-*`).
6. Borders and effects (`rounded-*`, `shadow-*`, `ring-*`).
7. Interactions and states (`hover:*`, `focus:*`, `disabled:*`).
8. Responsive variants (`sm:*`, `md:*`, `lg:*`, `xl:*`).

- Group related utilities logically.
- Remove duplicate, conflicting, and unnecessary classes.
- Avoid excessively long class lists; extract reusable components when appropriate.
- Use consistent class ordering across the codebase.

## 3. Responsive Design

- Follow a mobile-first development approach.
- Use Tailwind responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) when necessary.
- Design layouts to work across mobile, tablet, and desktop screen sizes.
- Avoid fixed widths and heights when flexible alternatives are more appropriate.
- Use responsive grid and flex layouts instead of unnecessary positioning.
- Prevent horizontal overflow and ensure content remains readable on smaller screens.
- Test important layouts at different viewport sizes.
- Use `md` for the bottom-to-header navigation transition and `lg` for the single-row desktop header and dashboard columns.
- Keep labels unwrapped in horizontal navigation and allow cards/forms to shrink or stack without overflowing.
- Preserve coordinated page padding, root scroll padding, and toast offsets for the phone navigation. Safe-area calculations using `env(safe-area-inset-bottom)` are a justified use of arbitrary values.

## 4. Accessibility

- Use semantic HTML elements whenever possible.
- Ensure sufficient color contrast between text and backgrounds.
- Do not rely on color alone to communicate information.
- Provide accessible labels for interactive elements and form controls.
- Use appropriate ARIA attributes only when native HTML semantics are insufficient.
- Ensure interactive elements are keyboard accessible.
- Provide visible focus states using `focus-visible:` utilities.
- Never remove focus outlines without providing an accessible alternative.
- Support reduced motion preferences using `motion-reduce:` when animations are present.

## 5. Interactive States

- Define appropriate states for interactive components:
  - Default
  - Hover (`hover:`)
  - Focus (`focus-visible:`)
  - Active (`active:`)
  - Disabled (`disabled:`)
- Use consistent transition utilities where they improve usability.
- Ensure disabled states are visually distinguishable and prevent interaction.
- Avoid relying exclusively on hover interactions.

## 6. Custom CSS Rules

Custom CSS is allowed only when Tailwind utilities are insufficient or when it provides a clearer, more maintainable solution.

Acceptable use cases:

- Complex animations and keyframes.
- Advanced selectors or pseudo-elements.
- Third-party library overrides.
- Complex reusable styling patterns.
- CSS features not adequately supported by existing Tailwind utilities.

Rules:

- Keep custom styles scoped and modular.
- Prefer CSS variables for shared design tokens.
- Avoid global styles unless they are intentional (e.g., resets, typography, theme configuration).
- Keep shared button, field, and card patterns in the existing components layer; keep root scroll padding, reduced-motion rules, and notebook pseudo-elements in the shared stylesheet.
- Do not duplicate existing Tailwind functionality.
- Avoid excessive use of `!important`.
- Do not use `@apply` as a replacement for normal utility classes; reserve it for justified reusable patterns.

## 7. Maintainability

- Extract repeated UI patterns into reusable components.
- Keep styling close to the component it belongs to.
- Use consistent spacing, typography, colors, and border-radius values.
- Avoid arbitrary values (`[...]`) when existing design tokens or utilities are available.
- Remove unused CSS and obsolete classes.
- Avoid deeply nested selectors and overly complex styling logic.

## 8. Quality Standards

- Ensure all layouts are responsive and accessible.
- Keep visual behavior consistent across the application.
- Avoid unnecessary specificity and CSS overrides.
- Verify hover, focus, active, and disabled states.
- Follow the existing project's Tailwind configuration and conventions.
- Prioritize readability, consistency, and long-term maintainability over styling shortcuts.
