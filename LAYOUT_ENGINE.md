# Layout Engine

Production-grade, responsive layout system. Composable, theme-aware, accessible, tree-shakeable.

---

## Architecture Overview

The Layout Engine is organized into three layers:

```
Layer 1 — Responsive Foundation
  breakpoints, Responsive<T> type, resolveResponsive(), hooks

Layer 2 — Layout Primitives
  ResponsiveGrid, Section, ContainerQuery, SafeArea

Layer 3 — Composition Presets
  Centered, Sidebar, Split, Fullscreen, Immersive, Bento, Dashboard,
  ScrollSnap, HorizontalScroll, PinnedSection, Overlay, Portal, Canvas
```

**Dependency direction:** Layer 3 → Layer 2 → Layer 1. No circular dependencies.

**Key design decisions:**

- `Responsive<T>` is the universal responsive prop type — any prop on any component can be breakpoint-aware
- Mobile-first cascade (same as Tailwind) — smaller breakpoint values carry forward to larger ones
- All components use `forwardRef` + `displayName` for DevTools and ref forwarding
- Safe area logic is centralized in `safe-area.ts` — presets import, never inline
- Types are defined once in `types.ts` — presets import, never redefine

---

## Folder Responsibilities

```
src/engine/layout/
│
├── responsive/                 Layer 1: Foundation
│   ├── breakpoints.ts          Breakpoint constants, media queries, viewport units
│   ├── responsive-props.ts     Responsive<T> type, resolveResponsive(), resolveResponsiveMap()
│   ├── hooks.ts                useBreakpoint, useWindowSize, useScrollPosition, etc.
│   └── index.ts                Barrel export
│
├── grid/                       Layer 2: Grid primitive
│   ├── responsive-grid.tsx     ResponsiveGrid + GridCell
│   └── index.ts
│
├── section/                    Layer 2: Section primitive
│   ├── section.tsx             Section + sectionPresets
│   └── index.ts
│
├── presets/                    Layer 3: Composition layouts
│   ├── centered.tsx            CenteredLayout
│   ├── sidebar.tsx             SidebarLayout
│   ├── split.tsx               SplitLayout
│   ├── fullscreen.tsx          FullscreenLayout
│   ├── immersive.tsx           ImmersiveLayout + ImmersiveSection
│   ├── bento.tsx               BentoLayout + BentoCard
│   ├── dashboard.tsx           DashboardLayout
│   └── index.ts
│
├── scroll/                     Layer 3: Scroll layouts
│   ├── scroll-snap.tsx         ScrollSnapContainer + ScrollSnapItem
│   ├── horizontal-scroll.tsx   HorizontalScroll + HorizontalScrollItem
│   ├── pinned-section.tsx      PinnedSection
│   └── index.ts
│
├── overlay/                    Layer 3: Overlay/portal/canvas
│   ├── overlay.tsx             OverlayLayout
│   ├── portal.tsx              PortalLayout
│   ├── canvas.tsx              CanvasLayout + CanvasLayer
│   └── index.ts
│
├── container-query.tsx         ContainerQueryProvider + hooks
├── safe-area.ts                Safe area inset/padding/margin utilities
├── registry.ts                 LayoutRegistryImpl singleton
├── defaults.ts                 registerDefaultLayouts()
├── types.ts                    All type definitions
└── index.ts                    Master barrel export
```

**UI layout components** (separate from engine, enhanced with responsive props):

```
src/components/ui/layout/
├── shared.ts                   useResponsiveValue, useResponsiveProps
├── container/container.tsx     Container (responsive size)
├── flex/flex.tsx               Flex (responsive align/justify/gap/wrap)
├── grid/grid.tsx               Grid (responsive columns/gap)
├── stack/stack.tsx             Stack (responsive direction/gap/align/justify/wrap)
├── section/section.tsx         Section (responsive size)
└── spacer/spacer.tsx           Spacer (responsive size)
```

---

## Layout API

### Responsive Props

Every component that accepts a `Responsive<T>` prop can take either a static value or a breakpoint-keyed object:

```tsx
// Static
<Grid columns={3} />

// Responsive
<Grid columns={{ sm: 1, md: 2, lg: 3 }} />
```

The `Responsive<T>` type:

```ts
type Responsive<T> = T | Partial<Record<Breakpoint, T>>;
// Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl"
```

Cascade rule: values from smaller breakpoints carry forward to larger ones unless overridden.

```tsx
// columns={{ sm: 1, md: 2, lg: 3 }}
// At "xs" => 1 (falls back to sm)
// At "sm" => 1
// At "md" => 2
// At "lg" => 3
// At "xl" => 3 (carries from lg)
// At "2xl" => 3 (carries from lg)
```

### Resolver Functions

Use outside React to resolve responsive values:

```ts
import { resolveResponsive, resolveResponsiveMap, isResponsiveValue } from "@/engine/layout";

resolveResponsive({ sm: 1, md: 2, lg: 3 }, "lg"); // => 3
resolveResponsive(42, "md"); // => 42 (static passthrough)
isResponsiveValue({ sm: 1 }); // => true
isResponsiveValue(42); // => false
resolveResponsiveMap({ sm: 1, md: 2 });
// => { sm: 1, md: 2, lg: 2, xl: 2, "2xl": 2 }
```

### Hooks

All hooks are SSR-safe (return safe defaults on server).

| Hook                          | Returns                                         | Notes                           |
| ----------------------------- | ----------------------------------------------- | ------------------------------- |
| `useBreakpoint()`             | `"xs" \| "sm" \| "md" \| "lg" \| "xl" \| "2xl"` | matchMedia-based, efficient     |
| `useMinBreakpoint(bp)`        | `boolean`                                       | True if viewport >= bp          |
| `useWindowSize(debounceMs?)`  | `{ width, height }`                             | RAF-throttled, equality-checked |
| `useDevicePixelRatio()`       | `number`                                        | Handles zoom/display changes    |
| `useOrientation()`            | `"portrait" \| "landscape"`                     |                                 |
| `useResizeObserver()`         | `[refCallback, { width, height }]`              | Attach ref to element           |
| `usePrefersReducedMotion()`   | `boolean`                                       | Respects OS preference          |
| `useSupportsHover()`          | `boolean`                                       | True for non-touch devices      |
| `useScrollPosition(element?)` | `{ x, y, progress }`                            | RAF-throttled, 0-1 progress     |
| `useScrollTo()`               | `(options) => void`                             | Smooth scroll helper            |

### Container Query Hooks

| Hook                              | Returns                    | Notes                                       |
| --------------------------------- | -------------------------- | ------------------------------------------- |
| `useContainerQuery(name)`         | `{ width, height, query }` | Reads from nearest `ContainerQueryProvider` |
| `useContainerSize(ref, widths)`   | `{ width, height, query }` | Standalone, no provider needed              |
| `useContainerMatch(name, bp)`     | `boolean`                  | Check if container matches breakpoint       |
| `useContainerRange(name, widths)` | `string \| undefined`      | Largest matching breakpoint key             |

### Layout Registry

Runtime registry for layout presets. Worlds and pages register their layouts; components query them.

```ts
import { layoutRegistry, registerDefaultLayouts } from "@/engine/layout";

// Register built-in presets
registerDefaultLayouts();

// Query
layoutRegistry.getAll(); // LayoutPreset[]
layoutRegistry.get("sidebar-left"); // LayoutPreset | undefined
layoutRegistry.getByCategory("grid"); // LayoutPreset[]
layoutRegistry.getCategories(); // string[]
layoutRegistry.has("centered"); // boolean

// Register custom
layoutRegistry.register({
  id: "my-layout",
  name: "My Layout",
  component: MyComponent,
  slots: ["header", "content"],
  category: "custom",
});

// Subscribe to changes
const unsub = layoutRegistry.subscribe(() => {
  /* ... */
});
```

### Safe Area Utilities

```ts
import {
  safeAreaInset,    // { top, right, bottom, left } — raw CSS env() values
  safeAreaPadding,  // (sides) => CSSProperties
  safeAreaMargin,   // (sides) => CSSProperties
  safeAreaClasses,  // { pt, pr, pb, pl, px, py, p, mt, mr, mb, ml, mx, my, m }
  viewportClasses,  // { hScreen, wScreen, minHScreen, ... }
} from "@/engine/layout";

// Inline styles
<div style={safeAreaPadding("all")}>...</div>
<div style={safeAreaPadding("vertical")}>...</div>

// Tailwind classes
<div className={safeAreaClasses.px}>...</div>
<div className={viewportClasses.hScreen}>...</div>
```

---

## Grid System

### ResponsiveGrid + GridCell (Engine-Level)

Advanced CSS Grid with responsive columns, named areas, auto-fill, and gap tokens.

```tsx
import { ResponsiveGrid, GridCell } from "@/engine/layout";

<ResponsiveGrid columns={{ sm: 1, md: 2, lg: 3 }} gap="lg" align="start" justify="center">
  <GridCell colSpan={{ sm: "full", lg: 2 }}>Feature</GridCell>
  <GridCell>Item</GridCell>
  <GridCell>Item</GridCell>
</ResponsiveGrid>;
```

**ResponsiveGrid props:**

| Prop           | Type                       | Default | Description                                 |
| -------------- | -------------------------- | ------- | ------------------------------------------- |
| `columns`      | `Responsive<GridColumns>`  | `12`    | Column count (1-12)                         |
| `flow`         | `GridAutoFlow`             | `"row"` | CSS grid-auto-flow                          |
| `gap`          | `Responsive<SpacingToken>` | `"md"`  | Gap between items                           |
| `rowGap`       | `Responsive<SpacingToken>` | —       | Override row gap                            |
| `columnGap`    | `Responsive<SpacingToken>` | —       | Override column gap                         |
| `align`        | `GridAlign`                | —       | alignItems                                  |
| `justify`      | `GridJustify`              | —       | justifyItems                                |
| `minItemWidth` | `string`                   | —       | Auto-fill mode (disables columns)           |
| `areas`        | `Responsive<string[]>`     | —       | Named grid template areas                   |
| `rows`         | `number`                   | —       | Fixed row count                             |
| `columnSizes`  | `Responsive<string>`       | —       | Custom column sizes (e.g., `"1fr 2fr 1fr"`) |
| `rowSizes`     | `Responsive<string>`       | —       | Custom row sizes                            |
| `fullWidth`    | `boolean`                  | `false` | Remove max-width                            |
| `centered`     | `boolean`                  | `false` | Center with mx-auto                         |

**GridCell props:**

| Prop       | Type                   | Default  | Description                        |
| ---------- | ---------------------- | -------- | ---------------------------------- |
| `colSpan`  | `Responsive<GridSpan>` | `"auto"` | Column span (1-12, "full", "auto") |
| `rowSpan`  | `Responsive<GridSpan>` | `"auto"` | Row span                           |
| `area`     | `string`               | —        | Grid area name                     |
| `colStart` | `number`               | —        | grid-column-start                  |
| `colEnd`   | `number`               | —        | grid-column-end                    |
| `rowStart` | `number`               | —        | grid-row-start                     |
| `rowEnd`   | `number`               | —        | grid-row-end                       |
| `align`    | `GridAlign`            | —        | alignSelf override                 |
| `justify`  | `GridJustify`          | —        | justifySelf override               |

**Auto-fill mode** (responsive card grids):

```tsx
<ResponsiveGrid minItemWidth="300px" gap="md">
  <GridCell>Auto-sized card</GridCell>
</ResponsiveGrid>
```

**Named areas:**

```tsx
<ResponsiveGrid
  areas={{
    sm: ["header", "main", "footer"],
    lg: ["header header", "sidebar main", "footer footer"],
  }}
>
  <GridCell area="header">Header</GridCell>
  <GridCell area={{ sm: "main", lg: "sidebar" }}>Sidebar</GridCell>
  <GridCell area="main">Main</GridCell>
  <GridCell area="footer">Footer</GridCell>
</ResponsiveGrid>
```

### Grid (UI Primitive)

Simpler grid for everyday use:

```tsx
import { Grid } from "@/components/ui/layout";

<Grid columns={{ sm: 1, md: 2, lg: 3 }} gap={{ sm: "sm", lg: "lg" }}>
  <div>Item 1</div>
  <div>Item 2</div>
</Grid>;
```

---

## Section Engine

### Section (Engine-Level)

Semantic `<section>` with responsive padding, backgrounds, container constraints, sticky, and snap.

```tsx
import { Section, sectionPresets } from "@/engine/layout";

<Section
  size={{ sm: "md", lg: "xl" }}
  background="surface"
  container="xl"
  sticky="top"
  snap="start"
>
  {children}
</Section>;
```

**Props:**

| Prop              | Type                                          | Default     | Description                             |
| ----------------- | --------------------------------------------- | ----------- | --------------------------------------- |
| `size`            | `Responsive<SectionSize>`                     | `"md"`      | Padding scale (xs-2xl)                  |
| `padding`         | `Responsive<SpacingToken>`                    | —           | Override horizontal padding             |
| `margin`          | `Responsive<SpacingToken>`                    | —           | Horizontal margin                       |
| `background`      | `SectionBackground`                           | `"none"`    | Surface/primary/secondary backgrounds   |
| `backgroundColor` | `string`                                      | —           | Custom color (when background="custom") |
| `container`       | `ContainerSize \| "full" \| "none"`           | `"none"`    | Max-width constraint                    |
| `sticky`          | `boolean \| "top" \| "bottom"`                | —           | Sticky positioning                      |
| `stickyOffset`    | `string \| number`                            | —           | Sticky offset                           |
| `fullscreen`      | `boolean`                                     | `false`     | 100dvh height                           |
| `minHeight`       | `string`                                      | —           | Custom min-height                       |
| `snap`            | `"none" \| "start" \| "center" \| "end"`      | `"none"`    | Scroll snap alignment                   |
| `overflow`        | `"visible" \| "hidden" \| "auto" \| "scroll"` | `"visible"` | Overflow behavior                       |
| `clip`            | `boolean`                                     | `false`     | Clip content                            |
| `border`          | `"none" \| "top" \| "bottom" \| "both"`       | `"none"`    | Border                                  |

**Presets:**

```ts
sectionPresets = {
  hero: { size: "xl", background: "surface", fullscreen: true },
  feature: { size: "lg", background: "surface" },
  narrow: { size: "md", container: "prose" },
  wide: { size: "lg", container: "xl" },
  fullscreen: { size: "md", fullscreen: true },
};
```

### Section (UI Primitive)

Simpler section for basic padding:

```tsx
import { Section } from "@/components/ui/layout";

<Section size={{ sm: "sm", lg: "xl" }} padded>
  {children}
</Section>;
```

---

## Responsive Rules

### Breakpoints

| Token | Min-width | Device                      |
| ----- | --------- | --------------------------- |
| `xs`  | 0px       | Below sm (default fallback) |
| `sm`  | 640px     | Mobile landscape            |
| `md`  | 768px     | Tablet portrait             |
| `lg`  | 1024px    | Tablet landscape / Desktop  |
| `xl`  | 1280px    | Desktop                     |
| `2xl` | 1536px    | Large desktop               |

### Cascade Behavior

Mobile-first: `sm` values apply to `md`, `lg`, `xl`, `2xl` unless overridden.

```tsx
// Only specify mobile, it carries forward
<Stack direction="col" />                    // col at all breakpoints

// Specify mobile and desktop override
<Stack direction={{ sm: "col", md: "row" }} />  // col on mobile, row on tablet+

// Full control
<Grid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }} />
```

### Available Responsive Props

Every prop marked `Responsive<T>` in the API tables above accepts responsive values. Summary:

| Component          | Responsive Props                                                            |
| ------------------ | --------------------------------------------------------------------------- |
| `Container`        | `size`                                                                      |
| `Grid` (UI)        | `columns`, `gap`                                                            |
| `Flex`             | `align`, `justify`, `gap`, `wrap`                                           |
| `Stack`            | `direction`, `gap`, `align`, `justify`, `wrap`                              |
| `Section` (UI)     | `size`                                                                      |
| `Spacer`           | `size`                                                                      |
| `Section` (Engine) | `size`, `padding`, `margin`                                                 |
| `ResponsiveGrid`   | `columns`, `gap`, `rowGap`, `columnGap`, `areas`, `columnSizes`, `rowSizes` |
| `GridCell`         | `colSpan`, `rowSpan`                                                        |
| `SidebarLayout`    | `position`, `width`                                                         |
| `SplitLayout`      | `direction`, `ratio`                                                        |
| `BentoLayout`      | `columns`                                                                   |
| `DashboardLayout`  | `sidebarWidth`                                                              |

### Using Hooks Directly

For custom components that need responsive behavior:

```tsx
import { useBreakpoint, useMinBreakpoint } from "@/engine/layout";

function MyComponent({ layout }) {
  const bp = useBreakpoint();
  const isDesktop = useMinBreakpoint("lg");

  return isDesktop ? <DesktopView /> : <MobileView />;
}
```

---

## Accessibility Rules

### Mandatory for All Components

1. **`forwardRef`** — Every component must forward refs for composition flexibility
2. **`displayName`** — Every component must set `displayName` for DevTools
3. **No hardcoded IDs** — Use `useId()` for any generated IDs (aria-controls, aria-labelledby)
4. **Focus management** — Overlays must trap focus; closing must restore focus to trigger
5. **Keyboard support** — Escape closes overlays; Tab navigates interactive elements

### Semantic HTML Requirements

| Component           | Required Element                               | Reason                       |
| ------------------- | ---------------------------------------------- | ---------------------------- |
| `Section` (engine)  | `<section>`                                    | Content section              |
| `SidebarLayout`     | `<aside>` + `<main>`                           | Complementary + main content |
| `DashboardLayout`   | `<aside>` + `<header>` + `<main>` + `<footer>` | App shell semantics          |
| `BentoCard`         | `<article>`                                    | Self-contained content       |
| `SplitLayout` panes | `<section>`                                    | Content groupings            |
| `OverlayLayout`     | `role="dialog"`                                | Modal/dialog semantics       |

### ARIA Requirements

| Component                | Requirement                                          |
| ------------------------ | ---------------------------------------------------- |
| `OverlayLayout`          | `role="dialog"`, optional `ariaLabel` → `aria-label` |
| `OverlayLayout` backdrop | `aria-hidden="true"`                                 |
| Decorative elements      | `aria-hidden="true"` (arrows, icons, spacers)        |
| `Spacer`                 | `aria-hidden="true"`                                 |

### Reduced Motion

- `ImmersiveLayout` scroll indicator: hidden when `prefers-reduced-motion: reduce`
- All CSS animations: use `motion-safe:` or `motion-reduce:` Tailwind variants
- Scroll snap: works with reduced motion (no animation, just position jump)
- Never auto-play animations without checking `usePrefersReducedMotion()`

### Screen Reader Considerations

- Layout components are structural, not content — no `aria-label` needed unless interactive
- `role="dialog"` on overlays must have an accessible name (`ariaLabel` or `aria-labelledby`)
- Scroll snap containers: add `aria-label` or `aria-roledescription="scroll snap container"` if the snap behavior is meaningful
- Hidden scrollbar CSS (`scrollbar-width: none`) does not affect screen readers

---

## Performance Recommendations

### Hook Usage

| Hook                  | Throttle       | Notes                                                          |
| --------------------- | -------------- | -------------------------------------------------------------- |
| `useBreakpoint()`     | matchMedia     | Efficient — fires only on breakpoint crossing, not every pixel |
| `useWindowSize(0)`    | RAF            | Use `useWindowSize(150)` for non-critical updates              |
| `useScrollPosition()` | RAF            | Throttled to 1 frame per scroll event                          |
| `useResizeObserver()` | Equality check | No re-render if dimensions unchanged                           |
| `useOrientation()`    | None           | Lightweight — compare string values                            |

### State Updates

All hooks use functional state updaters with equality checks:

```ts
// Good — no re-render if dimensions unchanged
setSize((prev) => {
  const next = { width: window.innerWidth, height: window.innerHeight };
  return prev.width === next.width && prev.height === next.height ? prev : next;
});
```

### Memoization

- `ContainerQueryProvider`: `sortedWidths` memoized via `useMemo(widths)`
- `ContainerQueryProvider`: context value includes `state` in dependency array
- `cssContainerQuerySupported()`: cached at module level (computed once)

### Event Listeners

- All scroll/resize handlers use `{ passive: true }`
- All effects return cleanup functions
- `useScrollPosition` uses `cancelAnimationFrame` on cleanup
- `useWindowSize` uses both `clearTimeout` and `cancelAnimationFrame` on cleanup

### Bundle Impact

- Layout engine code lives in the main app chunk
- No separate layout chunk needed — tree-shakeable via named exports
- `registerDefaultLayouts()` is opt-in — only imported when called
- Hooks are individually importable — no forced inclusion

### Do Not

- Call `resolveResponsive()` in loops or hot paths (creates new objects)
- Use `useWindowSize()` for CSS-driven layouts (use Tailwind responsive classes instead)
- Create new `Responsive<T>` objects inline on every render — define outside component or memoize
- Use `useScrollPosition()` for non-visual logic (use IntersectionObserver instead)

---

## Future Extension Guide

### Adding a New Layout Preset

1. Create `src/engine/layout/presets/my-layout.tsx`
2. Follow the pattern: `forwardRef`, `displayName`, props interface extending `ComponentPropsWithoutRef`
3. Import responsive utilities from `../responsive/hooks` and `../responsive/responsive-props`
4. Import shared types from `../types` — never redefine locally
5. Use `safeAreaPadding()` from `../safe-area` — never inline safe-area CSS
6. Export from `presets/index.ts`
7. Register in `defaults.ts` if it should be a built-in preset

```tsx
// presets/my-layout.tsx
import { forwardRef, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/utils";

interface MyLayoutProps extends ComponentPropsWithoutRef<"div"> {
  children: ReactNode;
  className?: string;
}

export const MyLayout = forwardRef<HTMLDivElement, MyLayoutProps>(
  ({ children, className, ...props }, ref) => (
    <div ref={ref} className={cn("...", className)} {...props}>
      {children}
    </div>
  ),
);
MyLayout.displayName = "MyLayout";
```

### Adding a New Responsive Hook

1. Create in `src/engine/layout/responsive/hooks.ts`
2. SSR-safe: guard with `typeof window === "undefined"` for initial state
3. Use `matchMedia` for media queries (not resize events)
4. Use RAF for scroll/resize handlers
5. Equality-check state updates to prevent unnecessary re-renders
6. Return cleanup in effects
7. Export from `responsive/index.ts` and `layout/index.ts`

### Adding a New Container Query Breakpoint

```tsx
<ContainerQueryProvider name="card" widths={{ sm: 200, md: 400, lg: 600 }}>
  <Card />
</ContainerQueryProvider>
```

Consumer:

```tsx
const { query } = useContainerQuery("card");
if (query.md) {
  /* container >= 400px */
}
```

### Integrating with GSAP ScrollTrigger

```tsx
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PinnedSection } from "@/engine/layout";

function AnimatedSection() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(ref.current, {
        scrollTrigger: {
          trigger: ref.current,
          pin: true,
          scrub: true,
        },
      });
    },
    { scope: ref },
  );

  return (
    <PinnedSection height="200vh">
      <div ref={ref}>Animated content</div>
    </PinnedSection>
  );
}
```

### Registering World-Specific Layouts

```tsx
// In world initialization
import { layoutRegistry } from "@/engine/layout";

layoutRegistry.register({
  id: "cyberpunk-hero",
  name: "Cyberpunk Hero",
  component: CyberpunkHeroLayout,
  slots: ["title", "subtitle", "background"],
  category: "world:cyberpunk",
});

// In world component
const heroLayout = layoutRegistry.get("cyberpunk-hero");
if (heroLayout) {
  const Hero = heroLayout.component;
  return <Hero title="..." subtitle="..." background={...} />;
}
```

### Extending the Responsive System

To add a new breakpoint:

1. Add to `BREAKPOINTS` in `responsive/breakpoints.ts`
2. Add to `BREAKPOINT_ORDER` array
3. Add to `VIEWPORT_RANGES` and `MEDIA_QUERIES`
4. Update Tailwind config `screens` to match

---

## Best Practices

### Component Composition

```tsx
// Good — compose primitives
<Section size="lg" background="surface" container="xl">
  <ResponsiveGrid columns={{ sm: 1, md: 2 }} gap="lg">
    <GridCell>...</GridCell>
    <GridCell>...</GridCell>
  </ResponsiveGrid>
</Section>

// Good — use presets for page structure
<DashboardLayout header={<TopBar />} sidebar={<Nav />}>
  <Section size="md">{content}</Section>
</DashboardLayout>

// Bad — nest presets inside presets
<SidebarLayout sidebar={...}>
  <SplitLayout second={...}>
    <DashboardLayout header={...} sidebar={...}>
      ...
    </DashboardLayout>
  </SplitLayout>
</SidebarLayout>
```

### Responsive Props

```tsx
// Good — mobile-first, minimal overrides
<Stack direction={{ sm: "col", md: "row" }} gap="md">

// Good — only specify breakpoints that differ
<Grid columns={{ sm: 1, lg: 3 }}>

// Bad — specify every breakpoint when cascade works
<Grid columns={{ sm: 1, md: 2, lg: 3, xl: 3, "2xl": 3 }}>

// Bad — static value when responsive needed
<Container size="xl">  {/* Too wide on mobile */}
```

### Accessibility

```tsx
// Good — overlay with label and escape
<OverlayLayout
  position="center"
  backdrop
  onBackdropClick={close}
  ariaLabel="Confirm deletion"
>
  <DeleteConfirm />
</OverlayLayout>

// Good — decorative elements hidden
<Spacer size="lg" aria-hidden="true" />

// Bad — overlay without accessible name
<OverlayLayout position="center" backdrop>
  <Modal />
</OverlayLayout>
```

### Performance

```tsx
// Good — debounced resize for non-critical updates
const size = useWindowSize(150);

// Good — use breakpoint hook instead of resize for layout decisions
const isDesktop = useMinBreakpoint("lg");

// Bad — resize listener for layout decisions (use breakpoint hook)
const { width } = useWindowSize();
const isDesktop = width >= 1024;

// Good — memoize expensive responsive objects
const columns = useMemo(() => ({
  sm: 1, md: 2, lg: isWide ? 4 : 3,
}), [isWide]);

// Bad — create new object every render
<Grid columns={{ sm: 1, md: 2, lg: isWide ? 4 : 3 }}>
```

### Safe Areas

```tsx
// Good — use utility
<div style={safeAreaPadding("vertical")}>

// Good — use Tailwind classes
<div className={safeAreaClasses.py}>

// Bad — inline env() values
<div style={{ paddingTop: "env(safe-area-inset-top)" }}>
```

### File Organization

- Types → `types.ts` (never redefine in presets)
- Responsive logic → `responsive/` (import from barrel)
- Safe area → `safe-area.ts` (import, never inline)
- New preset → `presets/` (register in `defaults.ts` if built-in)
- New hook → `responsive/hooks.ts` (SSR-safe, RAF-throttled)
- New container query → `container-query.tsx` (use provider or ref-based hook)

---

## File Reference

| File                             | Exports                                                                                                                                                                                                                                                                                                                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `responsive/breakpoints.ts`      | `BREAKPOINTS`, `BREAKPOINT_ORDER`, `VIEWPORT_RANGES`, `MEDIA_QUERIES`, `SAFE_AREAS`, `VIEWPORT_UNITS`                                                                                                                                                                                                                                                                                   |
| `responsive/responsive-props.ts` | `Responsive<T>`, `isResponsiveValue()`, `resolveResponsive()`, `resolveResponsiveMap()`                                                                                                                                                                                                                                                                                                 |
| `responsive/hooks.ts`            | `useBreakpoint`, `useMinBreakpoint`, `useWindowSize`, `useDevicePixelRatio`, `useOrientation`, `useResizeObserver`, `usePrefersReducedMotion`, `useSupportsHover`, `useScrollPosition`, `useScrollTo`                                                                                                                                                                                   |
| `types.ts`                       | `ContainerSize`, `SpacingToken`, `SectionSize`, `SectionBackground`, `GridColumns`, `GridAutoFlow`, `GridAlign`, `GridJustify`, `GridSpan`, `ResponsiveColumns`, `GridAreas`, `SplitRatio`, `SplitDirection`, `SplitDivider`, `SidebarPosition`, `SidebarWidth`, `SidebarCollapse`, `ScrollSnapType`, `ScrollSnapAxis`, `ScrollSnapAlign`, `LayoutSlot`, `LayoutConfig`, `LayoutPreset` |
| `registry.ts`                    | `layoutRegistry`                                                                                                                                                                                                                                                                                                                                                                        |
| `defaults.ts`                    | `registerDefaultLayouts()`, `getDefaultPresetIds()`                                                                                                                                                                                                                                                                                                                                     |
| `grid/responsive-grid.tsx`       | `ResponsiveGrid`, `GridCell`                                                                                                                                                                                                                                                                                                                                                            |
| `section/section.tsx`            | `Section`, `sectionPresets`                                                                                                                                                                                                                                                                                                                                                             |
| `presets/centered.tsx`           | `CenteredLayout`                                                                                                                                                                                                                                                                                                                                                                        |
| `presets/sidebar.tsx`            | `SidebarLayout`                                                                                                                                                                                                                                                                                                                                                                         |
| `presets/split.tsx`              | `SplitLayout`                                                                                                                                                                                                                                                                                                                                                                           |
| `presets/fullscreen.tsx`         | `FullscreenLayout`                                                                                                                                                                                                                                                                                                                                                                      |
| `presets/immersive.tsx`          | `ImmersiveLayout`, `ImmersiveSection`                                                                                                                                                                                                                                                                                                                                                   |
| `presets/bento.tsx`              | `BentoLayout`, `BentoCard`                                                                                                                                                                                                                                                                                                                                                              |
| `presets/dashboard.tsx`          | `DashboardLayout`                                                                                                                                                                                                                                                                                                                                                                       |
| `scroll/scroll-snap.tsx`         | `ScrollSnapContainer`, `ScrollSnapItem`                                                                                                                                                                                                                                                                                                                                                 |
| `scroll/horizontal-scroll.tsx`   | `HorizontalScroll`, `HorizontalScrollItem`                                                                                                                                                                                                                                                                                                                                              |
| `scroll/pinned-section.tsx`      | `PinnedSection`                                                                                                                                                                                                                                                                                                                                                                         |
| `overlay/overlay.tsx`            | `OverlayLayout`                                                                                                                                                                                                                                                                                                                                                                         |
| `overlay/portal.tsx`             | `PortalLayout`                                                                                                                                                                                                                                                                                                                                                                          |
| `overlay/canvas.tsx`             | `CanvasLayout`, `CanvasLayer`                                                                                                                                                                                                                                                                                                                                                           |
| `safe-area.ts`                   | `safeAreaInset`, `safeAreaPadding()`, `safeAreaMargin()`, `safeAreaClasses`, `viewportClasses`                                                                                                                                                                                                                                                                                          |
| `container-query.tsx`            | `ContainerQueryProvider`, `useContainerQuery()`, `useContainerSize()`, `useContainerMatch()`, `useContainerRange()`, `containerQueryCSS()`                                                                                                                                                                                                                                              |
| `shared.ts` (UI)                 | `useResponsiveValue()`, `useResponsiveProps()`                                                                                                                                                                                                                                                                                                                                          |
