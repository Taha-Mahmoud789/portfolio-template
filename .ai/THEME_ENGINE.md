# Theme Engine

A pluggable, type-safe theme system for the Frontend Multiverse. Every visual world inherits from this engine. Changing a theme requires one configuration object.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Theme Lifecycle](#theme-lifecycle)
3. [Theme Registration](#theme-registration)
4. [Theme Switching](#theme-switching)
5. [Adding a New Theme](#adding-a-new-theme)
6. [API Reference](#api-reference)
7. [Best Practices](#best-practices)
8. [Common Mistakes](#common-mistakes)
9. [Performance](#performance)
10. [Accessibility](#accessibility)

---

## Architecture

```
src/engine/theme/
  types.ts          — All TypeScript interfaces
  constants.ts      — Defaults, prefixes, presets
  definitions/      — Built-in theme definitions
    base.ts         — Shared defaults every theme extends
    apple.ts        — 10 theme files (one per visual identity)
    ...
  registry.ts       — Central theme registry (register, lookup, query)
  loader.ts         — Lazy loading with caching
  store.ts          — Zustand state (persisted to localStorage)
  provider.tsx      — React provider (applies CSS variables to DOM)
  context.ts        — React context
  hooks.ts          — React hooks for consuming theme state
  api.ts            — Imperative API (setTheme, getTheme, etc.)
  css-generator.ts  — Converts theme objects to CSS custom properties
  validation.ts     — Validates theme definitions
  utilities.ts      — Merge, compare, transform utilities
  initializer.ts    — One-call initialization
```

**Data flow:**

```
ThemeDefinition → Registry → Store → Provider → CSS Variables → DOM
```

---

## Theme Lifecycle

### 1. Initialization

Call `initializeThemeEngine()` once at app startup. This registers all built-in themes in the registry with lazy loading enabled.

### 2. Hydration

The Zustand store reads the persisted `themeId` from localStorage. The provider applies the stored theme's CSS variables to `document.documentElement` on mount.

### 3. Active State

One theme is active at a time. Its full `ThemeDefinition` object is the source of truth for all visual properties. Components consume values via CSS variables (`var(--theme-color-primary)`) or the `useTheme()` hook.

### 4. Switching

When `setTheme("cyberpunk")` is called:

1. The loader resolves the theme (from cache or dynamic import)
2. CSS variables are generated and applied to the DOM
3. The store updates `currentThemeId` and appends to history
4. The provider's `useEffect` hooks update DOM classes for accessibility

### 5. Persistence

The store persists `currentThemeId`, `themeHistory`, and accessibility settings to localStorage. On next visit, the same theme restores automatically.

---

## Theme Registration

Themes register with the central registry:

```typescript
import { ThemeRegistry } from "@/engine/theme";

// Register a single theme
ThemeRegistry.register(myTheme, true); // true = lazy loaded

// Register multiple themes
ThemeRegistry.registerAll([themeA, themeB], true);
```

**Registry operations:**

| Method                  | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `register(theme, lazy)` | Add a theme to the registry                      |
| `get(id)`               | Get a theme by ID (returns undefined if missing) |
| `getOrThrow(id)`        | Get a theme or throw                             |
| `has(id)`               | Check if a theme exists                          |
| `isLoaded(id)`          | Check if a lazy theme has been loaded            |
| `markLoaded(id)`        | Mark a lazy theme as loaded                      |
| `getAllThemes()`        | Get all registered themes                        |
| `getByCategory(cat)`    | Filter by category                               |
| `getIds()`              | Get all registered IDs                           |

**Lazy loading:**

Themes register with `lazy: true` by default. The loader resolves them via dynamic import on first access, then caches the result.

---

## Theme Switching

### Via React Hooks

```typescript
import { useTheme, useSetTheme, useAvailableThemes } from "@/engine/theme";

function ThemePicker() {
  const theme = useTheme();
  const setTheme = useSetTheme();
  const themes = useAvailableThemes();

  return (
    <select value={theme.id} onChange={(e) => setTheme(e.target.value)}>
      {themes.map((t) => (
        <option key={t.id} value={t.id}>{t.name}</option>
      ))}
    </select>
  );
}
```

### Via Imperative API

```typescript
import { themeAPI } from "@/engine/theme";

await themeAPI.setTheme("cyberpunk");
const current = themeAPI.getTheme();
const id = themeAPI.getThemeId();
```

### Navigation Helpers

```typescript
import { useNextTheme, usePreviousTheme, useRandomTheme } from "@/engine/theme";

const goNext = useNextTheme(); // cycles through all themes
const goPrev = usePreviousTheme(); // cycles backwards
const shuffle = useRandomTheme(); // picks a random different theme
```

### History

The store tracks theme history (capped at 20 entries). Use `themeAPI.goBack()` to revert to the previous theme.

---

## Adding a New Theme

### Step 1: Create the definition file

Create `src/engine/theme/definitions/my-theme.ts`:

```typescript
import type { ThemeDefinition } from "../types";
import { baseTheme } from "./base";
import { mergeThemes } from "../utilities";

export const myTheme: ThemeDefinition = mergeThemes(baseTheme, {
  id: "my-theme",
  name: "My Theme",
  description: "A brief description of the visual identity",
  category: "minimal", // see ThemeCategory for options
  thumbnail: "/icons/themes/my-theme.svg",
  tags: ["custom", "minimal"],

  // Only override what differs from baseTheme.
  // Everything else is inherited.

  colors: {
    ...baseTheme.colors,
    primary: "#your-primary",
    background: "#your-background",
    foreground: "#your-foreground",
  },

  typography: {
    ...baseTheme.typography,
    "font-heading": "'Your Font', sans-serif",
    "font-sans": "'Your Font', sans-serif",
  },

  // Add any other overrides...
});

export default myTheme;
```

### Step 2: Register it

In `src/engine/theme/definitions/index.ts`:

```typescript
import { myTheme } from "./my-theme";
export { myTheme };

// Add to allThemes array
export const allThemes: ThemeDefinition[] = [
  // ...existing themes
  myTheme,
];
```

### Step 3: Add the ThemeId

In `src/engine/theme/types.ts`, add to the `ThemeId` union:

```typescript
export type ThemeId =
  | "apple"
  | "cyberpunk"
  // ...existing IDs
  | "my-theme";
```

In `src/engine/theme/constants.ts`, add to `ALL_THEME_IDS`:

```typescript
export const ALL_THEME_IDS: readonly ThemeId[] = [
  // ...existing IDs
  "my-theme",
] as const;
```

### Step 4: Verify

Run `npx tsc --noEmit`. If it compiles, the theme is valid.

---

## What a Theme Must Define

Every theme definition requires these sections. All values not overridden are inherited from `base.ts`.

| Section                     | Purpose                                                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------- |
| `id`, `name`, `description` | Identity                                                                                  |
| `category`                  | Grouping (minimal, futuristic, cosmic, etc.)                                              |
| `colors`                    | 60+ color tokens (primary, surfaces, borders, status)                                     |
| `gradients`                 | 14 gradient presets (linear, radial, mesh, conic)                                         |
| `typography`                | Font families, sizes, weights, tracking, leading                                          |
| `spacing`                   | 50+ spacing tokens, gaps, sections, containers                                            |
| `radius`                    | 17 radius tokens (button, card, input, badge, etc.)                                       |
| `shadows`                   | 27 shadow tokens (levels, semantic, glow, colored)                                        |
| `blur`                      | 7 blur levels                                                                             |
| `glass`                     | Background, border, shadow, blur, saturation                                              |
| `motion`                    | 37 animation tokens (durations, easings, springs)                                         |
| `particles`                 | Enabled, count, type, color, opacity, size, speed                                         |
| `noise`                     | Intensity, opacity, size, blend mode, type                                                |
| `background`                | Color, gradients, pattern, noise                                                          |
| `foreground`                | Color variants                                                                            |
| `surface`                   | Color, border, shadow, backdrop                                                           |
| `border`                    | Color, width, style, radius                                                               |
| `buttonStyle`               | Radius, padding, font, transition, shadow                                                 |
| `cardStyle`                 | Radius, padding, background, border, shadow                                               |
| `inputStyle`                | Radius, padding, background, border, focus                                                |
| `cursorStyle`               | Cursor presets                                                                            |
| `scrollbarStyle`            | Width, track, thumb, radius                                                               |
| `selectionStyle`            | Background, foreground                                                                    |
| `focusStyle`                | Ring color, width, offset                                                                 |
| `spacingOverrides`          | Component-specific spacing                                                                |
| `animationPreset`           | none, subtle, moderate, expressive, dramatic, kinetic, glitch, organic, mechanical, fluid |
| `motionIntensity`           | off, reduced, normal, increased, max                                                      |
| `isDark`                    | Boolean                                                                                   |
| `isHighContrast`            | Boolean                                                                                   |
| `supportsReducedMotion`     | Boolean                                                                                   |

---

## API Reference

### Hooks

| Hook                       | Returns             | Purpose                                            |
| -------------------------- | ------------------- | -------------------------------------------------- |
| `useTheme()`               | `ThemeDefinition`   | Current theme object                               |
| `useThemeToken(path)`      | `string`            | Resolve a dot-path token (e.g. `"colors.primary"`) |
| `useAvailableThemes()`     | `ThemeDefinition[]` | All registered themes                              |
| `useThemesByCategory(cat)` | `ThemeDefinition[]` | Themes in a category                               |
| `useSearchThemes(query)`   | `ThemeDefinition[]` | Search by name/description/tags                    |
| `useThemesByTag(tag)`      | `ThemeDefinition[]` | Filter by tag                                      |
| `useNextTheme()`           | `() => void`        | Navigate to next theme                             |
| `usePreviousTheme()`       | `() => void`        | Navigate to previous theme                         |
| `useRandomTheme()`         | `() => void`        | Pick a random theme                                |
| `useThemeTransitioning()`  | `boolean`           | Whether a transition is in progress                |

### Imperative API

```typescript
import { themeAPI } from "@/engine/theme";

themeAPI.setTheme(id); // async, applies CSS vars
themeAPI.getTheme(); // current ThemeDefinition
themeAPI.getThemeId(); // current ThemeId
themeAPI.getThemeToken(path); // resolve dot-path token
themeAPI.getAvailableThemes(); // all themes
themeAPI.getThemesByCategory(c); // filter by category
themeAPI.getThemeById(id); // lookup by ID
themeAPI.validateTheme(obj); // validate a partial theme
themeAPI.mergeThemes(base, ovr); // deep merge two themes
themeAPI.generateCSSVariables(t); // generate CSS var map
themeAPI.goBack(); // revert to previous theme
themeAPI.getThemeHistory(); // last 20 theme IDs
```

### Accessibility API

```typescript
themeAPI.setReducedMotion(true);
themeAPI.setHighContrast(true);
themeAPI.setColorBlindMode("protanopia"); // none | protanopia | deuteranopia | tritanopia
```

### CSS Variables

Variables generate automatically with the prefix `--theme-`. Examples:

```
--theme-color-primary: #3b82f6
--theme-font-heading: 'Inter', sans-serif
--theme-space-4: 1rem
--theme-radius-card: 0.75rem
--theme-shadow-lg: 0 10px 15px ...
--theme-motion-duration-300: 300ms
--theme-glass-bg: rgba(255, 255, 255, 0.8)
```

Access in CSS: `color: var(--theme-color-primary);`

---

## Best Practices

### Only override what differs

```typescript
// Good: minimal overrides, inherits everything else
const myTheme = mergeThemes(baseTheme, {
  id: "my-theme",
  name: "My Theme",
  colors: { ...baseTheme.colors, primary: "#ff0000" },
});

// Bad: redefining values identical to base
const myTheme = mergeThemes(baseTheme, {
  id: "my-theme",
  name: "My Theme",
  colors: {
    ...baseTheme.colors,
    primary: "#ff0000",
    "destructive-foreground": "#ffffff", // same as base, remove
    "destructive-hover": "#dc2626", // same as base, remove
  },
});
```

### Use baseTheme spreads for partial overrides

When overriding a nested object, spread the base first so you only specify changes:

```typescript
colors: {
  ...baseTheme.colors,
  primary: "#ff0000",
  background: "#0a0a0a",
}
```

### Define theme IDs in two places

`ThemeId` type union AND `ALL_THEME_IDS` array. Both must match.

### Keep theme files self-contained

Each theme file exports one `ThemeDefinition`. No cross-imports between theme files.

### Use the correct ThemeCategory

| Category      | Use for                       |
| ------------- | ----------------------------- |
| `minimal`     | Clean, simple, Apple-like     |
| `futuristic`  | High-tech, neon, cyberpunk    |
| `cosmic`      | Space, celestial, dark matter |
| `interactive` | Gaming, arcade, playful       |
| `intelligent` | AI, neural, adaptive          |
| `typographic` | Magazine, editorial, serif    |
| `organic`     | Fluid, liquid, natural        |
| `nostalgic`   | Retro, vintage, terminal      |
| `raw`         | Brutalist, bold, stark        |
| `avant-garde` | Experimental, unconventional  |

---

## Common Mistakes

### 1. Redefining base values

The most frequent mistake. Every value identical to `base.ts` is wasted code and a maintenance burden. Only specify what changes.

### 2. Forgetting to add to ThemeId and ALL_THEME_IDS

A theme that compiles but cannot be switched to because the ID is not in the union type or the constants array.

### 3. Missing required color tokens

`ThemeColorPalette` has 60+ required fields. If you override `colors` without spreading `...baseTheme.colors`, you must provide all of them. Always spread first.

### 4. Using context hooks for simple access

```typescript
// Unnecessary: wraps context for a single property
const themeId = useThemeId();

// Direct: same result, fewer re-renders
const { themeId } = useThemeEngine();
```

### 5. Calling setTheme in render

```typescript
// Bad: triggers state update on every render
function Component() {
  setTheme("apple");
  return <div />;
}

// Good: call in effect or handler
function Component() {
  useEffect(() => setTheme("apple"), []);
  return <div />;
}
```

### 6. Inconsistent color formats

Mix hex, rgb(), hsl() within the same palette. Pick one format per theme and stick with it. Hex is simplest.

### 7. Ignoring dark/light mode

If `isDark: true`, ensure background is dark and foreground is light. Mismatched polarity causes invisible text.

---

## Performance

### Lazy loading

Themes register with `lazy: true`. The loader uses dynamic imports (`import()`) so theme definitions are code-split. Only the active theme's code loads immediately.

### Caching

Loaded themes cache in memory. Subsequent switches to the same theme skip the import.

### CSS variables over inline styles

All theme values apply as CSS custom properties on `:root`. Components read them via `var()`. This avoids:

- JavaScript recalculations on every render
- React re-renders when theme changes (CSS updates without JS)
- Inline style serialization overhead

### Zustand selectors

Hooks use granular selectors to avoid re-renders:

```typescript
// Re-renders only when currentThemeId changes
const themeId = useThemeEngineStore(selectCurrentThemeId);

// Avoids: subscribes to entire store
const { currentThemeId, isTransitioning, reducedMotion } = useThemeEngineStore();
```

### History cap

Theme history caps at 20 entries to prevent unbounded memory growth.

### No unnecessary memoization

- `useTheme()` memoizes via `useMemo` keyed on `themeId`
- `useThemeToken()` memoizes via `useMemo` keyed on `[theme, tokenPath]`
- Pure utility functions (`validateTheme`, `mergeThemes`, `isValidThemeId`) are NOT wrapped in hooks — call them directly

---

## Accessibility

### Reduced Motion

When `reducedMotion: true`:

- CSS variable `--theme-motion-duration-multiplier` set to `0`
- All `--theme-motion-duration-*` variables should respect this via CSS
- Particles disable automatically
- Theme definitions with `supportsReducedMotion: true` provide appropriate motion presets

Detect system preference:

```typescript
const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
if (mediaQuery.matches) {
  themeAPI.setReducedMotion(true);
}
```

### High Contrast

When `highContrast: true`:

- CSS class `high-contrast` added to `<html>`
- Use this class in CSS to increase contrast ratios

```css
.high-contrast {
  --theme-color-foreground: #000000;
  --theme-color-border: #000000;
}
```

### Color Blind Modes

When `colorBlindMode` is set:

- Data attribute `data-color-blind` set on `<html>`
- Use this to apply adjusted palettes

```css
[data-color-blind="protanopia"] {
  --theme-color-success: #0077bb;
  --theme-color-danger: #cc3311;
}
```

### Minimum Contrast

Ensure all color combinations meet WCAG AA (4.5:1 for normal text, 3:1 for large text). Use the validation system to check:

```typescript
import { validateTheme } from "@/engine/theme";

const result = validateTheme(myTheme);
if (result.warnings.length > 0) {
  console.warn("Potential contrast issues:", result.warnings);
}
```

### Focus Indicators

Every theme defines `focusStyle` with ring color, width, and offset. Ensure focus rings are visible against the theme's background:

```typescript
focusStyle: {
  "ring-color": "#3b82f6",    // high-visibility color
  "ring-width": "2px",
  "ring-offset": "2px",
  "ring-style": "solid",
}
```

### Keyboard Navigation

Theme switching must be keyboard-accessible. The `<select>` pattern shown earlier is natively keyboard-accessible. Custom dropdowns must implement arrow key navigation and Enter/Space activation.
