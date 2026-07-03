# Frontend Multiverse — AI Rules

## General

- Think before writing code.
- Never rush implementation.
- Always explain architectural decisions before coding.
- Do not modify unrelated files.

---

## Code Style

- Use React 19.
- Use TypeScript strict mode.
- Never use `any`.
- Never disable ESLint.
- Never ignore TypeScript errors.
- Prefer composition over inheritance.
- Use functional components only.
- Keep components small and focused.

---

## Imports

- Always use absolute imports.
- Never use deep relative imports like ../../../
- Respect project aliases.

---

## Components

- Every component has a single responsibility.
- Components must be reusable.
- Components must support accessibility.
- Components must support future theme overrides.
- Components must be animation-ready.

---

## State

- Use Zustand only when global state is required.
- Prefer local state when possible.
- Never duplicate state.

---

## Styling

- Tailwind CSS only.
- Never use inline styles.
- Never hardcode colors.
- Use Design Tokens.
- Use CSS variables from the Theme Engine.

---

## Performance

- Lazy load heavy modules.
- Use dynamic imports.
- Avoid unnecessary rerenders.
- Memoize only when necessary.
- Clean up effects correctly.

---

## Accessibility

- Keyboard navigation is mandatory.
- Focus management is required.
- Respect prefers-reduced-motion.
- Use semantic HTML.
- Add ARIA where appropriate.

---

## Animations

- Use GSAP through the Animation Engine only.
- Never write page-specific animation utilities.
- Reuse animation presets.
- Prefer transform and opacity.
- Avoid layout thrashing.

---

## Routing

- Use React Router.
- Lazy load pages.
- Route transitions must integrate with the Animation Engine.

---

## Theme

- Never hardcode colors.
- Never access theme values directly.
- Use Theme Provider only.

---

## File Organization

- One responsibility per file.
- One responsibility per folder.
- Never create duplicate utilities.
- Never create duplicate hooks.

---

## Before Finishing Any Task

Always run:

npm run lint

npm run typecheck

npm run build

Fix every issue before considering the task complete.

---

## Never

- Never install unnecessary packages.
- Never remove existing architecture.
- Never generate placeholder code.
- Never generate dead code.
- Never break previous stages.
- Never duplicate logic.
