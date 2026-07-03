# Frontend Multiverse Design System

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Token Categories](#token-categories)
  - [Colors](#colors)
  - [Typography](#typography)
  - [Spacing](#spacing)
  - [Radius](#radius)
  - [Elevation](#elevation)
  - [Motion](#motion)
  - [Border](#border)
  - [Opacity](#opacity)
  - [Size](#size)
  - [Grid](#grid)
  - [Z-Index](#z-index)
- [Usage Guide](#usage-guide)
  - [Tailwind CSS](#tailwind-css)
  - [CSS Variables](#css-variables)
  - [TypeScript](#typescript)
- [World Theming](#world-theming)
- [Best Practices](#best-practices)
- [File Structure](#file-structure)

---

## Overview

The Frontend Multiverse design system uses a **three-layer token architecture**:

1. **Primitives** — Raw values (colors, sizes, timing)
2. **Semantic** — Meaning-based assignments (primary, danger, spacing-lg)
3. **CSS Variables** — Runtime custom properties for theme switching

**Key Principle**: Components never reference primitives directly. Always use semantic tokens.

---

## Architecture

```
src/theme/
├── tokens/
│   ├── primitives/          # Layer 1: Raw values
│   │   ├── colors.ts        # gray, brand, success, warning, danger, info
│   │   ├── typography.ts    # fontFamily, fontSize, fontWeight, letterSpacing, lineHeight
│   │   ├── spacing.ts       # spacing (4px grid), containerWidth
│   │   ├── motion.ts        # duration, easing
│   │   ├── radius.ts        # border-radius values
│   │   ├── shadow.ts        # box-shadow, blur
│   │   ├── z-index.ts       # layer levels
│   │   ├── opacity.ts       # opacity scale
│   │   └── border.ts        # borderWidth
│   └── semantic/            # Layer 2: Meaning-based
│       ├── color.ts         # primary, surface, foreground, status, etc.
│       ├── typography.ts    # font-sans, text-base, font-bold, etc.
│       ├── spacing.ts       # padding-sm, gap-md, section-lg, etc.
│       ├── radius.ts        # button, card, modal, badge, etc.
│       ├── elevation.ts     # card, dropdown, modal, glass, blur
│       ├── motion.ts        # duration-fast, ease-out, spring, etc.
│       ├── border.ts        # default, emphasis, focus
│       ├── opacity.ts       # hidden, translucent, visible, disabled
│       ├── size.ts          # icon-md, button-lg, avatar-xl, etc.
│       ├── grid.ts          # gap-xs, margin-lg, etc.
│       └── z-index.ts       # modal, dropdown, sticky, cursor, etc.
├── css/
│   └── variables.ts         # Layer 3: CSS variable generation
└── types.ts                 # TypeScript types
```

---

## Token Categories

### Colors

**Primitive source**: `src/theme/tokens/primitives/colors.ts`

| Palette       | Values                                               |
| ------------- | ---------------------------------------------------- |
| `gray`        | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 |
| `brand`       | 50–950 (blue scale)                                  |
| `success`     | 50–950 (green scale)                                 |
| `warning`     | 50–950 (amber scale)                                 |
| `danger`      | 50–950 (red scale)                                   |
| `info`        | 50–950 (cyan scale)                                  |
| `white`       | `#ffffff`                                            |
| `black`       | `#000000`                                            |
| `transparent` | `transparent`                                        |

**Semantic tokens** (`src/theme/tokens/semantic/color.ts`):

```typescript
// Core
(primary, primary - hover, primary - active, primary - subtle, primary - muted);
(secondary, secondary - hover, secondary - active, secondary - subtle, secondary - muted);
(accent, accent - hover, accent - active, accent - subtle);

// Surface
(background,
  background - alt,
  surface,
  surface - raised,
  surface - overlay,
  surface - sunken,
  surface - inset);

// Foreground
(foreground, foreground - secondary, foreground - muted, foreground - subtle, foreground - inverse);

// Border
(border, border - strong, border - subtle, border - focus);

// Status
(success, success - hover, success - subtle, success - foreground);
(warning, warning - hover, warning - subtle, warning - foreground);
(danger, danger - hover, danger - subtle, danger - foreground);
(info, info - hover, info - subtle, info - foreground);

// Interaction
(focus - ring, hover - overlay, active - overlay, disabled - bg, disabled - fg, disabled - border);

// Selection
(selection - bg, selection - fg);

// Overlay
(overlay - heavy(0.5), overlay - medium(0.3), overlay - light(0.1), overlay - lightest(0.05));
```

**CSS variable**: `--color-{token}` (e.g., `--color-primary`, `--color-surface`)

---

### Typography

**Primitive source**: `src/theme/tokens/primitives/typography.ts`

#### Font Families

| Token     | Value                                |
| --------- | ------------------------------------ |
| `sans`    | Inter, system fallbacks              |
| `heading` | Space Grotesk, system fallbacks      |
| `mono`    | JetBrains Mono, Fira Code, monospace |

#### Font Sizes

| Token  | Size     | Line Height |
| ------ | -------- | ----------- |
| `2xs`  | 0.625rem | 0.875rem    |
| `xs`   | 0.75rem  | 1rem        |
| `sm`   | 0.875rem | 1.25rem     |
| `base` | 1rem     | 1.5rem      |
| `lg`   | 1.125rem | 1.75rem     |
| `xl`   | 1.25rem  | 1.75rem     |
| `2xl`  | 1.5rem   | 2rem        |
| `3xl`  | 1.875rem | 2.25rem     |
| `4xl`  | 2.25rem  | 2.5rem      |
| `5xl`  | 3rem     | 1           |
| `6xl`  | 3.75rem  | 1           |
| `7xl`  | 4.5rem   | 1           |
| `8xl`  | 6rem     | 1           |
| `9xl`  | 8rem     | 1           |

#### Font Weights

| Token        | Value |
| ------------ | ----- |
| `thin`       | 100   |
| `extralight` | 200   |
| `light`      | 300   |
| `regular`    | 400   |
| `medium`     | 500   |
| `semibold`   | 600   |
| `bold`       | 700   |
| `extrabold`  | 800   |
| `black`      | 900   |

#### Letter Spacing

| Token     | Value    |
| --------- | -------- |
| `tighter` | -0.05em  |
| `tight`   | -0.025em |
| `normal`  | 0em      |
| `wide`    | 0.025em  |
| `wider`   | 0.05em   |
| `widest`  | 0.1em    |

#### Line Heights

| Token     | Value |
| --------- | ----- |
| `none`    | 1     |
| `tight`   | 1.25  |
| `snug`    | 1.375 |
| `normal`  | 1.5   |
| `relaxed` | 1.625 |
| `loose`   | 2     |

**CSS variable**: `--{token}` (e.g., `--font-sans`, `--text-base`, `--font-bold`)

---

### Spacing

**Primitive source**: `src/theme/tokens/primitives/spacing.ts`

Built on a **4px grid**. Values range from `0px` to `24rem` (384px).

#### Semantic Tokens

```typescript
// Component Padding
padding-xs (0.25rem), padding-sm (0.5rem), padding-md (0.75rem),
padding-lg (1rem), padding-xl (1.5rem), padding-2xl (2rem)

// Component Gap
gap-xs (0.25rem), gap-sm (0.5rem), gap-md (0.75rem),
gap-lg (1rem), gap-xl (1.5rem)

// Section Spacing
section-xs (2rem), section-sm (3rem), section-md (4rem),
section-lg (6rem), section-xl (8rem), section-2xl (12rem)

// Container Widths
container-sm (640px), container-md (768px), container-lg (1024px),
container-xl (1280px), container-2xl (1536px), container-3xl (1728px),
container-prose (65ch)

// Content Widths
content-narrow (65ch), content-medium (1024px),
content-wide (1280px), content-full (100%)
```

**CSS variable**: `--spacing-{token}` (e.g., `--spacing-padding-md`, `--spacing-section-lg`)

---

### Radius

**Primitive source**: `src/theme/tokens/primitives/radius.ts`

| Token  | Value  |
| ------ | ------ |
| `none` | 0px    |
| `xs`   | 2px    |
| `sm`   | 4px    |
| `md`   | 8px    |
| `lg`   | 12px   |
| `xl`   | 16px   |
| `2xl`  | 24px   |
| `3xl`  | 32px   |
| `full` | 9999px |

#### Component-Specific

| Token     | Maps To       |
| --------- | ------------- |
| `button`  | md (8px)      |
| `input`   | md (8px)      |
| `card`    | lg (12px)     |
| `badge`   | full (9999px) |
| `avatar`  | full (9999px) |
| `modal`   | xl (16px)     |
| `tooltip` | sm (4px)      |

**CSS variable**: `--radius-{token}` (e.g., `--radius-card`, `--radius-button`)

---

### Elevation

**Primitive source**: `src/theme/tokens/primitives/shadow.ts`

#### Shadow Levels

| Token   | Value                                                               |
| ------- | ------------------------------------------------------------------- |
| `none`  | none                                                                |
| `xs`    | 0 1px 2px 0 rgb(0 0 0 / 0.05)                                       |
| `sm`    | 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)       |
| `md`    | 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)    |
| `lg`    | 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)  |
| `xl`    | 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) |
| `2xl`   | 0 25px 50px -12px rgb(0 0 0 / 0.25)                                 |
| `inner` | inset 0 2px 4px 0 rgb(0 0 0 / 0.05)                                 |

#### Semantic Elevation

| Token      | Maps To |
| ---------- | ------- |
| `card`     | sm      |
| `dropdown` | lg      |
| `modal`    | 2xl     |
| `popover`  | lg      |
| `toast`    | xl      |
| `tooltip`  | sm      |
| `sticky`   | sm      |
| `inner`    | inner   |

#### Blur

| Token  | Value |
| ------ | ----- |
| `none` | 0px   |
| `sm`   | 4px   |
| `md`   | 8px   |
| `lg`   | 12px  |
| `xl`   | 16px  |
| `2xl`  | 24px  |
| `3xl`  | 40px  |

#### Glass

| Token      | Description            |
| ---------- | ---------------------- |
| `bg`       | Glass background color |
| `bg-heavy` | Heavier glass opacity  |
| `bg-light` | Lighter glass opacity  |
| `border`   | Glass border color     |
| `shadow`   | Glass shadow           |

**CSS variable**: `--elevation-{token}`, `--blur-{token}`, `--glass-{token}`

---

### Motion

**Primitive source**: `src/theme/tokens/primitives/motion.ts`

#### Durations

| Token     | Value  |
| --------- | ------ |
| `instant` | 0ms    |
| `fast`    | 150ms  |
| `normal`  | 300ms  |
| `slow`    | 500ms  |
| `slower`  | 700ms  |
| `slowest` | 1000ms |

#### Easing

| Token           | Value                                   |
| --------------- | --------------------------------------- |
| `linear`        | linear                                  |
| `ease`          | ease                                    |
| `ease-in`       | cubic-bezier(0.4, 0, 1, 1)              |
| `ease-out`      | cubic-bezier(0, 0, 0.2, 1)              |
| `ease-in-out`   | cubic-bezier(0.4, 0, 0.2, 1)            |
| `ease-in-expo`  | cubic-bezier(0.95, 0.05, 0.795, 0.035)  |
| `ease-out-expo` | cubic-bezier(0.19, 1, 0.22, 1)          |
| `spring`        | cubic-bezier(0.175, 0.885, 0.32, 1.275) |
| `bounce`        | cubic-bezier(0.68, -0.55, 0.265, 1.55)  |

**CSS variable**: `--motion-{token}` (e.g., `--motion-fast`, `--motion-ease-out`)

---

### Border

**Primitive source**: `src/theme/tokens/primitives/border.ts`

| Token      | Value |
| ---------- | ----- |
| `none`     | 0px   |
| `thin`     | 1px   |
| `medium`   | 2px   |
| `thick`    | 4px   |
| `heavy`    | 8px   |
| `default`  | 1px   |
| `emphasis` | 2px   |
| `focus`    | 2px   |

**CSS variable**: `--border-{token}` (e.g., `--border-default`, `--border-focus`)

---

### Opacity

**Primitive source**: `src/theme/tokens/primitives/opacity.ts`

#### Semantic

| Token         | Value |
| ------------- | ----- |
| `hidden`      | 0     |
| `translucent` | 0.5   |
| `visible`     | 1     |
| `disabled`    | 0.5   |
| `hover`       | 0.8   |
| `active`      | 0.9   |
| `overlay`     | 0.5   |

#### Levels

| Token       | Value |
| ----------- | ----- |
| `level-0`   | 0     |
| `level-5`   | 0.05  |
| `level-10`  | 0.1   |
| `level-20`  | 0.2   |
| `level-25`  | 0.25  |
| `level-30`  | 0.3   |
| `level-40`  | 0.4   |
| `level-50`  | 0.5   |
| `level-60`  | 0.6   |
| `level-70`  | 0.7   |
| `level-75`  | 0.75  |
| `level-80`  | 0.8   |
| `level-90`  | 0.9   |
| `level-95`  | 0.95  |
| `level-100` | 1     |

**CSS variable**: `--opacity-{token}` (e.g., `--opacity-disabled`, `--opacity-level-50`)

---

### Size

**Semantic tokens** (`src/theme/tokens/semantic/size.ts`):

#### Icon Sizes

| Token     | Value          |
| --------- | -------------- |
| `icon-xs` | 0.75rem (12px) |
| `icon-sm` | 1rem (16px)    |
| `icon-md` | 1.25rem (20px) |
| `icon-lg` | 1.5rem (24px)  |
| `icon-xl` | 2rem (32px)    |

#### Avatar Sizes

| Token       | Value         |
| ----------- | ------------- |
| `avatar-xs` | 1.5rem (24px) |
| `avatar-sm` | 2rem (32px)   |
| `avatar-md` | 2.5rem (40px) |
| `avatar-lg` | 3rem (48px)   |
| `avatar-xl` | 4rem (64px)   |

#### Button Heights

| Token       | Value          |
| ----------- | -------------- |
| `button-xs` | 1.75rem (28px) |
| `button-sm` | 2rem (32px)    |
| `button-md` | 2.5rem (40px)  |
| `button-lg` | 3rem (48px)    |
| `button-xl` | 3.5rem (56px)  |

#### Input Heights

| Token      | Value          |
| ---------- | -------------- |
| `input-xs` | 1.75rem (28px) |
| `input-sm` | 2rem (32px)    |
| `input-md` | 2.5rem (40px)  |
| `input-lg` | 3rem (48px)    |

#### Control Heights (Generic)

| Token        | Value          |
| ------------ | -------------- |
| `control-xs` | 1.75rem (28px) |
| `control-sm` | 2rem (32px)    |
| `control-md` | 2.5rem (40px)  |
| `control-lg` | 3rem (48px)    |

**CSS variable**: `--size-{token}` (e.g., `--size-button-md`, `--size-icon-lg`)

---

### Grid

**Semantic tokens** (`src/theme/tokens/semantic/grid.ts`):

#### Grid Gaps

| Token    | Value         |
| -------- | ------------- |
| `gap-xs` | 0.5rem (8px)  |
| `gap-sm` | 1rem (16px)   |
| `gap-md` | 1.5rem (24px) |
| `gap-lg` | 2rem (32px)   |
| `gap-xl` | 3rem (48px)   |

#### Grid Margins

| Token       | Value         |
| ----------- | ------------- |
| `margin-xs` | 0.5rem (8px)  |
| `margin-sm` | 1rem (16px)   |
| `margin-md` | 1.5rem (24px) |
| `margin-lg` | 2rem (32px)   |
| `margin-xl` | 3rem (48px)   |

**CSS variable**: `--grid-{token}` (e.g., `--grid-gap-md`, `--grid-margin-lg`)

---

### Z-Index

**Primitive source**: `src/theme/tokens/primitives/z-index.ts`

| Token      | Value | Use Case                |
| ---------- | ----- | ----------------------- |
| `base`     | 0     | Default layer           |
| `raised`   | 10    | Elevated elements       |
| `dropdown` | 20    | Dropdowns, select menus |
| `sticky`   | 30    | Sticky headers          |
| `overlay`  | 40    | Overlays, backdrops     |
| `modal`    | 50    | Modals, dialogs         |
| `toast`    | 60    | Toast notifications     |
| `tooltip`  | 70    | Tooltips                |
| `cursor`   | 80    | Custom cursors          |
| `max`      | 9999  | Maximum priority        |

**CSS variable**: `--z-{token}` (e.g., `--z-modal`, `--z-dropdown`)

---

## Usage Guide

### Tailwind CSS

All semantic tokens are mapped to Tailwind utilities:

```tsx
// Colors
<div className="bg-primary text-foreground">
<div className="border border-border-strong">
<div className="text-success-foreground">

// Typography
<h1 className="font-heading text-4xl font-bold">
<p className="text-base leading-relaxed tracking-wide">

// Spacing
<div className="p-padding-md gap-gap-lg">
<section className="py-section-lg">

// Radius
<button className="rounded-button">
<div className="rounded-card">

// Elevation
<div className="shadow-card">
<div className="shadow-dropdown">

// Motion
<div className="transition-all duration-fast ease-out-expo">

// Border
<div className="border-2 border-default">

// Size
<button className="h-button-md w-button-md">
<Avatar className="h-avatar-lg w-avatar-lg">

// Z-Index
<div className="z-modal">
<div className="z-dropdown">
```

### CSS Variables

Use CSS variables directly in stylesheets or inline styles:

```css
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  box-shadow: var(--elevation-card);
  padding: var(--spacing-padding-lg);
}
```

```tsx
<div style={{ color: "var(--color-foreground)" }}>
```

### TypeScript

Import tokens for programmatic use:

```typescript
import { color } from "@/theme/tokens/semantic/color";
import { spacingSemantic } from "@/theme/tokens/semantic/spacing";
import { motion } from "@/theme/tokens/semantic/motion";

// Access token values
const primaryColor = color.primary; // "#3b82f6"
const padding = spacingSemantic["padding-md"]; // "0.75rem"
const duration = motion.fast; // "150ms"
```

---

## World Theming

Each world can override semantic tokens to create distinct visual identities:

```typescript
// src/worlds/cyberpunk/config.ts
import { color } from "@/theme/tokens/semantic/color";

export const cyberpunkTheme = {
  color: {
    ...color,
    primary: "#00ff00", // Neon green
    "primary-hover": "#00cc00",
    background: "#0a0a0a",
    foreground: "#00ff00",
    surface: "#1a1a1a",
    border: "#00ff00",
  },
};
```

**Override rules**:

- Worlds override **semantic tokens only**
- Never modify **primitives** directly
- Use the `useWorld()` hook to apply theme overrides

---

## Best Practices

### Do

- Use semantic tokens for all visual properties
- Use Tailwind utilities when available
- Use CSS variables for dynamic theming
- Import types for type-safe token access

### Don't

- Use raw color values (`#3b82f6`)
- Use hardcoded spacing (`16px`, `1rem`)
- Use numeric z-index (`zIndex: 9999`)
- Import primitives directly in components

### Token Naming Convention

```
{category}-{variant}-{state}

Examples:
- color-primary-hover
- spacing-padding-lg
- radius-button
- motion-duration-fast
- z-modal
```

### Accessibility

- Use `focus-ring` for focus indicators
- Use `disabled-*` tokens for disabled states
- Respect `prefers-reduced-motion` (built into motion tokens)
- Ensure sufficient color contrast (WCAG AA minimum)

---

## File Structure

```
src/theme/
├── tokens/
│   ├── primitives/     # Layer 1: Raw values (never use directly)
│   │   ├── index.ts
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   ├── spacing.ts
│   │   ├── motion.ts
│   │   ├── radius.ts
│   │   ├── shadow.ts
│   │   ├── z-index.ts
│   │   ├── opacity.ts
│   │   └── border.ts
│   └── semantic/       # Layer 2: Meaning-based (use these)
│       ├── index.ts
│       ├── color.ts
│       ├── typography.ts
│       ├── spacing.ts
│       ├── radius.ts
│       ├── elevation.ts
│       ├── motion.ts
│       ├── border.ts
│       ├── opacity.ts
│       ├── size.ts
│       ├── grid.ts
│       └── z-index.ts
├── css/
│   └── variables.ts    # Layer 3: CSS variable generation
├── index.ts            # Barrel export
└── types.ts            # TypeScript types
```

---

## Quick Reference

| Category   | CSS Variable Pattern             | Tailwind Pattern                     |
| ---------- | -------------------------------- | ------------------------------------ |
| Color      | `--color-{name}`                 | `bg-{name}`, `text-{name}`           |
| Typography | `--font-{name}`, `--text-{name}` | `font-{name}`, `text-{name}`         |
| Spacing    | `--spacing-{name}`               | `p-{name}`, `m-{name}`, `gap-{name}` |
| Radius     | `--radius-{name}`                | `rounded-{name}`                     |
| Elevation  | `--elevation-{name}`             | `shadow-{name}`                      |
| Blur       | `--blur-{name}`                  | `blur-{name}`                        |
| Motion     | `--motion-{name}`                | `duration-{name}`, `ease-{name}`     |
| Border     | `--border-{name}`                | `border-{name}`                      |
| Opacity    | `--opacity-{name}`               | `opacity-{name}`                     |
| Size       | `--size-{name}`                  | `w-{name}`, `h-{name}`               |
| Grid       | `--grid-{name}`                  | `gap-{name}`                         |
| Z-Index    | `--z-{name}`                     | `z-{name}`                           |
