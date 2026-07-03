# Navigation Engine

Scalable, accessible, animation-ready navigation system built on React Router.

---

## Architecture

The Navigation Engine follows a **single source of truth** pattern: React Router owns all URL state (`currentPath`, `history`, `direction`). The Zustand store owns only engine-level state (`activeTransition`, `scrollPositions`, `isTransitioning`).

Two React contexts prevent unnecessary rerenders:

```
NavigationActionsContext (stable — never rerenders)
  └─ navigate, goBack, goForward, replace, prefetch

NavigationStateContext (reactive — rerenders on navigation)
  └─ currentPath, previousPath, isTransitioning, activeTransition, direction, breadcrumbs
```

Components using only `useNav()` (actions) never rerender on route changes.

### Data Flow

```
User Action → useNav() → navigate() → React Router
                                         ↓
                              useLocation() updates
                                         ↓
                    NavigationStateContext rerenders consumers
                                         ↓
                    AnimatedRoutes detects transition type
                                         ↓
                    Framer Motion / GSAP runs animation
```

---

## Folder Structure

```
src/engine/navigation/
├── index.ts              # Barrel export — all public APIs
├── types.ts              # TypeScript interfaces and type aliases
├── constants.ts          # Default values, config, magic numbers
├── store.ts              # Zustand store — engine-only state
├── context.ts            # Split contexts (actions vs state)
├── provider.tsx          # NavigationProvider — wires everything
├── hooks.ts              # Public hooks API (useNav, useRoute, etc.)
├── registry.ts           # RouteRegistry — register, match, lookup
├── animated-routes.tsx   # AnimatedRoutes + AnimatedPage wrappers
├── scroll.ts             # ScrollPositionManager + useScrollRestoration
├── accessibility.tsx     # SkipLink, Announcer, useFocusTrap, ARIA utils
├── breadcrumbs.tsx       # Breadcrumbs component
├── route-errors.tsx      # RouteErrorBoundary, NotFoundPage, RouteErrorDisplay
├── guards.ts             # Route guard infrastructure
└── utilities.ts          # Pure utility functions (no React)
```

---

## Lifecycle

### 1. Provider Mount

```
App
└─ NavigationProvider
    ├─ Register initial routes (if provided)
    ├─ Create NavigationActionsContext (stable)
    ├─ Create NavigationStateContext (reactive)
    └─ Wrap children
```

### 2. Navigation

```
navigate("/worlds/apple")
  ├─ setTransition(transition)         // Update store
  ├─ setIsTransitioning(true)          // Update store
  ├─ routerNavigate(path)              // React Router changes URL
  ├─ useLocation() fires               // URL state updates
  ├─ stateValue recomputes             // useMemo recalculates
  ├─ StateContext rerenders            // Consumers get new values
  ├─ AnimatedPage runs enter animation // Framer Motion
  └─ setTimeout → setIsTransitioning(false) // After 300ms
```

### 3. Scroll Restoration

```
Leave route:
  └─ useEffect cleanup saves scrollPositionManager.save(path, scrollY)

Arrive at route:
  └─ useEffect restores scrollPositionManager.get(path)
     ├─ If saved position → scrollTo(x, y)
     └─ If no position    → scrollToTop()
```

### 4. Focus Management

```
After navigate():
  └─ setTimeout(100ms)
     └─ document.querySelector("#main-content")?.focus()
```

---

## Route Registration

### Static Registration

```tsx
// src/app/App.tsx
import { NavigationProvider } from "@/engine/navigation";
import { homeRoute, worldIndexRoute } from "@/engine/navigation/routes";

const initialRoutes = [homeRoute, worldIndexRoute];

export default function App() {
  return (
    <NavigationProvider initialRoutes={initialRoutes}>
      <AppRouter />
    </NavigationProvider>
  );
}
```

### Programmatic Registration

```tsx
import { NavigationRegistry } from "@/engine/navigation";

// Single route
NavigationRegistry.register({
  path: "/worlds/apple",
  index: false,
  metadata: {
    id: "worlds-apple",
    label: "Apple World",
    group: "worlds",
    icon: "apple",
    order: 2,
  },
  component: () => import("@/pages/worlds/apple"),
});

// Batch registration
NavigationRegistry.registerAll([route1, route2, route3]);
```

### Route Definition Shape

```ts
interface NavigationRoute {
  path: string;                    // URL path
  index?: boolean;                 // Is this an index route?
  metadata: RouteMetadata;         // ID, label, group, icon, order, etc.
  component: () => Promise<{ default: ComponentType }>; // Lazy import
  children?: NavigationRoute[];    // Nested routes
  guards?: NavigationGuard[];      // Route guards
  transition?: TransitionType;     // Page transition type
  preload?: boolean;               // Eagerly preload?
}
```

---

## Adding New Pages

### 1. Create the page component

```tsx
// src/pages/about/index.tsx
export default function AboutPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>About</h1>
    </main>
  );
}
```

### 2. Define the route

```ts
// src/constants/routes.ts
export const ROUTES = {
  ABOUT: "/about",
} as const;
```

### 3. Register in router

```tsx
// src/router/routes.tsx
import { lazy } from "react";
import { Routes, Route } from "react-router";

const AboutPage = lazy(() => import("@/pages/about"));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/about" element={<AboutPage />} />
    </Routes>
  );
}
```

### 4. Register in navigation registry

```ts
// src/engine/navigation/routes.ts
import type { NavigationRoute } from "./types";

export const aboutRoute: NavigationRoute = {
  path: "/about",
  metadata: {
    id: "about",
    label: "About",
    group: "main",
    icon: "info",
    order: 3,
  },
  component: () => import("@/pages/about"),
  transition: "fade",
};
```

### 5. Add to provider

```tsx
// src/app/App.tsx
import { aboutRoute } from "@/engine/navigation/routes";

const initialRoutes = [homeRoute, worldIndexRoute, aboutRoute];
```

---

## Adding New Worlds

Worlds are routes under `/worlds/:id`. Each world has its own page component and route definition.

### 1. Create the world page

```tsx
// src/pages/worlds/neon/index.tsx
export default function NeonWorldPage() {
  return (
    <main id="main-content" tabIndex={-1}>
      <h1>Neon World</h1>
    </main>
  );
}
```

### 2. Add route constant

```ts
// src/constants/routes.ts
export const ROUTES = {
  WORLDS_NEON: "/worlds/neon",
} as const;
```

### 3. Register in router

```tsx
// src/router/routes.tsx
const NeonWorldPage = lazy(() => import("@/pages/worlds/neon"));

export function AppRouter() {
  return (
    <Routes>
      <Route path="/worlds/neon" element={<NeonWorldPage />} />
    </Routes>
  );
}
```

### 4. Register in navigation registry

```ts
// src/engine/navigation/routes.ts
export const neonWorldRoute: NavigationRoute = {
  path: "/worlds/neon",
  metadata: {
    id: "worlds-neon",
    label: "Neon World",
    group: "worlds",
    icon: "zap",
    order: 10,
    color: "#ff00ff",
  },
  component: () => import("@/pages/worlds/neon"),
  transition: "crossfade",
};
```

### 5. Add to provider and world store

```tsx
// src/app/App.tsx
import { neonWorldRoute } from "@/engine/navigation/routes";

const initialRoutes = [...existingRoutes, neonWorldRoute];
```

```ts
// src/store/world-store.ts — add to WORLD_IDS if needed
```

---

## Animation Integration

### AnimatedRoutes

Wraps React Router `Routes` with Framer Motion `AnimatePresence`. Detects transition type from registry and applies the correct animation.

```tsx
// src/router/routes.tsx
import { AnimatedRoutes } from "@/engine/navigation";

export function AppRouter() {
  return (
    <AnimatedRoutes>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/worlds/:id" element={<WorldPage />} />
      </Routes>
    </AnimatedRoutes>
  );
}
```

### AnimatedPage

Wraps individual page content with enter/exit animations.

```tsx
import { AnimatedPage } from "@/engine/navigation";

export default function HomePage() {
  return (
    <AnimatedPage>
      <main id="main-content" tabIndex={-1}>
        <h1>Home</h1>
      </main>
    </AnimatedPage>
  );
}
```

### Transition Types

| Type | Animation |
|------|-----------|
| `fade` | Opacity 0→1→0 |
| `slide-up` | Translate Y +100%→0→-100% |
| `slide-down` | Translate Y -100%→0→+100% |
| `slide-left` | Translate X +100%→0→-100% |
| `slide-right` | Translate X -100%→0→+100% |
| `zoom` | Scale 0.8→1→0.8 + opacity |
| `portal` | Scale 0.5 + blur→1→0.5 |
| `crossfade` | Both pages fade simultaneously |
| `none` | No animation (instant) |

### Custom Transition Per Route

```ts
export const worldRoute: NavigationRoute = {
  path: "/worlds/apple",
  transition: "crossfade", // Override default
  // ...
};
```

### Duration Constants

```ts
TRANSITION_DURATIONS = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};
```

---

## Best Practices

### Use action hooks, not state hooks

```tsx
// ✅ Good — never rerenders on navigation
const { navigate, goBack } = useNav();

// ⚠️ Rerenders on every route change
const { currentPath, navigate } = useNavigationContext();
```

### Use specific selector hooks

```tsx
// ✅ Good — only rerenders when path changes
const currentPath = useCurrentPath();

// ⚠️ Rerenders on any state change
const state = useNavigationState();
```

### Always provide focus target

```tsx
// ✅ Good
<main id="main-content" tabIndex={-1}>
  <h1>Page Title</h1>
</main>

// ❌ Bad — focus management breaks
<div>
  <h1>Page Title</h1>
</div>
```

### Use registry for breadcrumbs, not manual arrays

```tsx
// ✅ Good — auto-generated from registry
const breadcrumbs = useBreadcrumbs();

// ❌ Bad — manual maintenance required
const breadcrumbs = [
  { label: "Home", path: "/" },
  { label: "Worlds", path: "/worlds" },
];
```

### Lazy load all page components

```tsx
// ✅ Good — code split
const HomePage = lazy(() => import("@/pages/home"));

// ❌ Bad — bundled into main chunk
import HomePage from "@/pages/home";
```

### Use `navigate()` over `<Link>` for programmatic nav

```tsx
// ✅ Good — programmatic with transition config
const { navigate } = useNav();
navigate("/worlds/apple", { transition: "crossfade" });

// ✅ Good — declarative
<Link to="/worlds/apple">Apple World</Link>
```

### Clean up subscriptions

```tsx
useEffect(() => {
  const unsubscribe = NavigationRegistry.subscribe(listener);
  return unsubscribe; // Cleanup on unmount
}, []);
```

---

## Performance Guide

### Context Architecture

The split context pattern prevents the **rerender cascade**:

```
NavigationActionsContext   ← Stable (useCallback refs never change)
  └─ Components using useNav() NEVER rerender

NavigationStateContext     ← Reactive (useMemo recalculates on nav)
  └─ Components using useCurrentPath() rerender ONLY when path changes
```

### Zustand Selectors

Use granular selectors to avoid unnecessary store subscriptions:

```tsx
// ✅ Only subscribes to activeTransition
const transition = useNavigationStore(selectActiveTransition);

// ❌ Subscribes to entire store
const store = useNavigationStore();
```

### Memoization Pattern

```tsx
// Actions — wrapped in useCallback, stable references
const navigate = useCallback(
  (path: string, options?: NavigateOptions) => { ... },
  [defaultTransition, setTransition, setIsTransitioning, routerNavigate]
);

// State — wrapped in useMemo, recalculates on deps change
const stateValue = useMemo<NavigationState>(
  () => ({ currentPath, previousPath, isTransitioning, ... }),
  [currentPath, previousPath, isTransitioning, activeTransition, direction, breadcrumbs]
);
```

### Prefetching

Triggered on hover/focus with 200ms debounce:

```tsx
const prefetchHandlers = usePrefetch("worlds-apple");

<Link to="/worlds/apple" {...prefetchHandlers}>
  Apple World
</Link>
```

This calls `route.component()` to preload the chunk before the user navigates.

### Scroll Position Management

- Positions saved to `ScrollPositionManager` (class singleton)
- Persisted to `localStorage` under `fm-scroll-positions`
- Max 30 positions stored (configurable via `SCROLL_RESTORATION_DEFAULTS.maxPositions`)
- Restored with 50ms delay to allow layout to settle

---

## Accessibility Guide

### Skip Link

Renders a visually hidden link that becomes visible on focus:

```tsx
import { SkipLink } from "@/engine/navigation";

// In your layout
<SkipLink targetId="main-content" text="Skip to content" />
```

CSS: `sr-only` → `focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999]`

### Navigation Announcer

Live region that announces route changes to screen readers:

```tsx
import { NavigationAnnouncer } from "@/engine/navigation";

// Render once at app root
<NavigationAnnouncer />
```

Creates `<div id="navigation-announcer" role="status" aria-live="polite" aria-atomic="true" class="sr-only">`.

Also available as a hook:

```tsx
import { useNavigationAnnouncer } from "@/engine/navigation";

function MyComponent() {
  useNavigationAnnouncer(); // Announces "Navigated to {title}"
  return null;
}
```

### Focus Trap

Trap focus within a modal or dialog:

```tsx
import { useFocusTrap } from "@/engine/navigation";

function Modal({ isOpen }) {
  const containerRef = useRef(null);
  useFocusTrap(containerRef, isOpen);

  return (
    <div ref={containerRef}>
      <button>First focusable</button>
      <button>Last focusable</button>
    </div>
  );
}
```

Behavior:
- Auto-focuses first focusable element on activation
- Traps Tab and Shift+Tab
- Restores focus to previously focused element on deactivation
- Checks `isConnected` before restoring (prevents errors on unmount)

### Keyboard Navigation

Arrow key navigation within a container:

```tsx
import { useKeyboardNavigation } from "@/engine/navigation";

function NavMenu() {
  const { onKeyDown } = useKeyboardNavigation({
    itemSelector: "a[href]",
    orientation: "vertical",
    onActivate: (el) => (el as HTMLElement).click(),
  });

  return (
    <nav data-keyboard-nav onKeyDown={onKeyDown}>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  );
}
```

Supported keys: ArrowUp/Down/Left/Right, Home, End, Enter, Space.

### ARIA Utilities

```tsx
import {
  getNavAriaProps,
  getCurrentPageAriaProps,
  getActiveItemAriaProps,
} from "@/engine/navigation";

// Navigation landmark
<nav {...getNavAriaProps("Main navigation")}>
  <a href="/about" {...getActiveItemAriaProps(currentPath === "/about")}>
    About
  </a>
</nav>
```

### Focus Management After Navigation

Automatic focus management is handled by the provider:

```ts
// After every navigate() call:
setTimeout(() => {
  document.querySelector("#main-content")?.focus();
}, 100); // FOCUS_MANAGEMENT.focusDelay
```

Every page component **must** include a focusable target:

```tsx
<main id="main-content" tabIndex={-1}>
  {/* Page content */}
</main>
```

### WCAG Compliance Checklist

- [x] Skip link present and functional
- [x] Live region announces route changes
- [x] Focus managed after navigation (main content focused)
- [x] Focus trap restores focus on deactivation
- [x] Keyboard navigation for menus (Arrow keys, Home, End)
- [x] ARIA landmarks on navigation elements
- [x] `aria-current="page"` on active links
- [x] All interactive elements focusable and operable via keyboard
