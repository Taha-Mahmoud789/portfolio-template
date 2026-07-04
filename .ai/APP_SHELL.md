# Application Shell

> Architecture documentation for the Frontend Multiverse application shell.

---

## Table of Contents

1. [Application Startup](#application-startup)
2. [Provider Order](#provider-order)
3. [Rendering Lifecycle](#rendering-lifecycle)
4. [Initialization Lifecycle](#initialization-lifecycle)
5. [Error Handling Strategy](#error-handling-strategy)
6. [Suspense Strategy](#suspense-strategy)
7. [Folder Responsibilities](#folder-responsibilities)
8. [Future Extension Guide](#future-extension-guide)
9. [Best Practices](#best-practices)

---

## Application Startup

The application starts from `src/app/main.tsx`. Startup is split into two phases: **pre-React** (imperative) and **React render** (declarative).

### Phase 1: Pre-React Bootstrap

Runs synchronously before `createRoot`. Sets up systems that must exist before any component renders.

```
bootstrap()
  ├── initGlobalErrorHandler()   — window.error, unhandledrejection listeners
  ├── initFeatureFlags()         — load flag overrides from localStorage
  └── applyDocumentMetadata()    — title, description, theme-color meta tags
```

If bootstrap fails, the error is caught and logged. The application still attempts to render — the error handler and feature flags degrade gracefully.

### Phase 2: React Render

```
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
```

`StrictMode` enables additional development checks (double-invocation of effects, deprecated API warnings). It has no effect in production.

### Entry Point Files

| File               | Role                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------- |
| `index.html`       | Shell HTML. Contains `<div id="root">` and `<script type="module">` pointing to `main.tsx`. |
| `src/app/main.tsx` | Entry point. Calls `bootstrap()`, then renders `<App />`.                                   |
| `src/app/App.tsx`  | Provider composition. Owns the entire provider tree.                                        |

---

## Provider Order

The provider tree in `App.tsx` defines the initialization and context order. Each layer has exactly one responsibility.

```
AppShell                          — GSAP registration, body class, keyboard nav
  ErrorBoundary                   — catches rendering errors from everything below
    ThemeEngineProvider           — CSS variables, theme switching, reduced motion, high contrast
      LenisProvider               — smooth scrolling, scroll position tracking, GSAP ScrollTrigger bridge
        BrowserRouter             — routing context (React Router)
          Suspense                — lazy route loading
            RootLayout            — semantic HTML structure, composable slots
              AppRouter           — route definitions
```

### Why This Order

| Layer                 | Must come after       | Reason                                                                                |
| --------------------- | --------------------- | ------------------------------------------------------------------------------------- |
| `AppShell`            | nothing               | Outermost. Sets up globals.                                                           |
| `ErrorBoundary`       | `AppShell`            | Catches errors from all providers below.                                              |
| `ThemeEngineProvider` | `ErrorBoundary`       | Needs to render inside the error boundary. Provides CSS variables used by everything. |
| `LenisProvider`       | `ThemeEngineProvider` | Reads `reducedMotion` from the theme engine store to decide whether to enable Lenis.  |
| `BrowserRouter`       | `LenisProvider`       | Routing context must exist before any component reads route params.                   |
| `Suspense`            | `BrowserRouter`       | Lazy routes need routing context to resolve.                                          |
| `RootLayout`          | `Suspense`            | Semantic shell wraps the rendered route content.                                      |

### What Was Removed (and Why)

| Removed Layer           | Reason                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `AccessibilityProvider` | Duplicated `ThemeEngineProvider`'s reduced-motion detection on a separate Zustand store. Two stores, one media query, out of sync by design. |
| `LoadingBoundary`       | Thin wrapper around `Suspense` with no added logic. Use `Suspense` directly.                                                                 |
| `EffectsProvider`       | Applied `theme-light`/`theme-dark` CSS classes. Redundant — `ThemeEngineProvider` applies CSS custom properties directly.                    |

---

## Rendering Lifecycle

### First Render

```
1.  bootstrap()                          — imperative setup (error handler, flags, metadata)
2.  <StrictMode>                         — enables dev checks
3.  <AppShell>                           — registers GSAP plugins (side-effect import)
4.  <ErrorBoundary>                      — installs error boundary (class component)
5.  <ThemeEngineProvider>                — reads persisted theme ID from Zustand
6.  <LenisProvider>                      — reads reducedMotion from store
7.    useEffect: init theme engine       — loads theme definition, applies CSS vars to :root
8.    useEffect: detect OS preferences   — listens for prefers-reduced-motion changes
9.    useEffect: init Lenis              — creates Lenis instance (or native scroll fallback)
10. <BrowserRouter>                      — provides routing context
11. <Suspense>                           — wraps route content
12.   <RootLayout>                       — renders semantic HTML shell (skip link, header, main, slots)
13.     <AppRouter>                      — React Router resolves route, lazy-loads page component
14.       <HomePage />                   — first render of matched route
```

### Subsequent Renders

Only components whose state or props changed re-render. The provider tree is stable — no new context values are created unless the relevant store state changes.

| Store Change                 | Components That Re-render                                           |
| ---------------------------- | ------------------------------------------------------------------- |
| `themeEngine.currentThemeId` | `ThemeEngineProvider` → anything consuming `ThemeEngineContext`     |
| `themeEngine.reducedMotion`  | `ThemeEngineProvider`, `LenisProvider` (destroys/recreates Lenis)   |
| `themeStore.reducedMotion`   | `LenisProvider` (reads this for the Lenis/native fallback decision) |
| `uiStore.scrollY`            | Only components subscribing to `scrollY` (not the provider tree)    |
| `worldStore.currentWorld`    | Only components subscribing to `currentWorld`                       |

### Scroll Position Tracking

Scroll position is tracked by a single source: `LenisProvider`.

- **Lenis enabled** (normal): Lenis callback fires on each frame, updates `useUiStore.setScrollY`.
- **Lenis disabled** (reduced motion): Native `window.scroll` listener with `requestAnimationFrame` throttling updates the same store.

No other component listens to scroll events. All scroll-dependent logic reads from `useUiStore.scrollY`.

---

## Initialization Lifecycle

### Complete Startup Sequence

```
 Browser
   │
   ├── HTML parses, loads /src/app/main.tsx as ES module
   │
   ├── main.tsx executes
   │   ├── import "@/styles/global.css"        — CSS loads (Tailwind, design tokens, keyframes)
   │   ├── import { bootstrap } from infra     — bootstrap module loads
   │   └── bootstrap() runs synchronously
   │       ├── initGlobalErrorHandler()         — attaches window.error, unhandledrejection
   │       ├── initFeatureFlags()               — loads overrides from localStorage
   │       └── applyDocumentMetadata()          — sets document.title, meta tags
   │
   ├── createRoot(root).render(<App />)         — React begins rendering
   │
   ├── AppShell mount
   │   ├── import "@/animation/gsap-setup"      — GSAP + ScrollTrigger registered
   │   └── useEffect: body.classList.add("app-loaded")
   │
   ├── ThemeEngineProvider mount
   │   ├── useEffect (init): loads theme definition, applies CSS vars to :root
   │   ├── useEffect (init): preloads all themes after 2s delay
   │   ├── useEffect: detects prefers-reduced-motion, syncs to store
   │   ├── useEffect: applies --theme-motion-duration-multiplier CSS var
   │   ├── useEffect: applies/removes .high-contrast class
   │   └── useEffect: sets data-color-blind attribute
   │
   ├── LenisProvider mount
   │   └── useEffect: creates Lenis instance (or native scroll fallback)
   │       ├── Connects to GSAP ticker
   │       ├── Connects to ScrollTrigger.update
   │       └── Updates useUiStore.scrollY on each frame
   │
   ├── BrowserRouter mount
   │
   ├── Suspense mount (wraps route content)
   │
   ├── RootLayout mount
   │   └── Renders: skip link, <header>, <main>, <footer>, slot containers
   │
   └── AppRouter mount
       └── React Router resolves current URL → lazy-loads matched page
```

### Theme Engine Initialization Detail

The `ThemeEngineProvider` uses a `useRef` guard to run initialization exactly once:

1. Try `ThemeRegistry.getOrThrow(persistedThemeId)` — synchronous lookup
2. If not in registry, `await ThemeLoader.loadTheme(id)` — dynamic import
3. `applyThemeToElement(theme)` — generates CSS custom properties, sets on `document.documentElement`
4. If both fail, falls back to `ThemeRegistry.getDefaultTheme()`
5. After 2s, `ThemeLoader.preloadAllThemes()` pre-caches remaining theme definitions

### Lenis Initialization Detail

1. Check `reducedMotion` from `useThemeStore`
2. If reduced motion: destroy any existing Lenis, attach native `window.scroll` listener
3. If normal: create `new Lenis(config)`, attach GSAP ticker integration
4. GSAP ticker drives Lenis: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
5. Lenis scroll events trigger `ScrollTrigger.update()`

---

## Error Handling Strategy

Error handling operates at three levels with clear isolation boundaries.

### Level 1: Window-Level Errors

**File:** `src/infrastructure/error/global-error-handler.ts`

Catches errors that escape React entirely.

| Source                       | Listener                                             |
| ---------------------------- | ---------------------------------------------------- |
| Uncaught JS errors           | `window.addEventListener("error", ...)`              |
| Unhandled promise rejections | `window.addEventListener("unhandledrejection", ...)` |

Errors are buffered (max 50), deduplicated by message, and flushed to console on a 30s interval or when the buffer fills. This avoids log spam from cascading failures.

`reportError(error, context)` is the programmatic API for reporting errors from React error boundaries.

### Level 2: React Error Boundaries

**File:** `src/infrastructure/error/error-boundary.tsx`

Class component that catches rendering errors in its subtree.

| Boundary                          | Scope              | Fallback                                                                  |
| --------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| Root (`boundaryId="root"`)        | Entire app         | `ErrorFallback` — full-screen crash UI with "Try Again" and "Reload Page" |
| World (`boundaryId="world-{id}"`) | Single world route | Static fallback — "Failed to load world" message                          |

**Key behaviors:**

- `getDerivedStateFromError` sets `hasError: true` — renders fallback
- `componentDidCatch` calls `reportError(error, boundaryId)` — feeds the window-level buffer
- `resetError()` clears the error state — user clicks "Try Again"
- Fallback UI uses inline styles (not Tailwind) because CSS may be broken when this renders

### Level 3: Graceful Degradation

Components that can fail asynchronously (theme loading, dynamic imports) have their own try/catch with fallback behavior:

| System                | Failure Mode                      | Fallback                                                   |
| --------------------- | --------------------------------- | ---------------------------------------------------------- |
| Theme loading         | `ThemeLoader.loadTheme()` rejects | Falls back to `defaultTheme`                               |
| Theme CSS application | `applyThemeToElement()` throws    | Logs error, keeps previous theme                           |
| Bootstrap             | Any step throws                   | Caught, logged, app still renders                          |
| Lazy route loading    | Dynamic import fails              | `Suspense` renders fallback, user can retry via navigation |

### Error Flow Diagram

```
Window error
  └── global-error-handler buffers → console.error

React render error (inside ErrorBoundary)
  └── ErrorBoundary.getDerivedStateFromError
      ├── reportError() → global-error-handler buffer
      └── renders ErrorFallback UI

React render error (outside ErrorBoundary)
  └── Thrown to parent boundary (or crashes the app)

Async failure (theme, lazy load)
  └── Caught in component-level try/catch
      └── Fallback behavior (default theme, loading state)
```

---

## Suspense Strategy

### Architecture

A single `Suspense` boundary wraps all route content. Lazy routes suspend inside this boundary.

```
BrowserRouter
  └── <Suspense fallback={<SuspenseFallback />}>
        └── <RootLayout>
              └── <AppRouter />   ← lazy routes suspend here
```

### Why One Boundary

- Route-level boundaries add complexity without value — the user sees the same loading experience regardless of which route loads
- Multiple boundaries create partial loading states (header visible, content spinning) which is worse UX than a full-screen transition
- The `SuspenseFallback` is a full-screen spinner — it replaces the entire viewport during load

### Lazy Route Loading

All page components are lazy-loaded via `React.lazy`:

```tsx
const HomePage = lazy(() => import("@/pages/home"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));
const WorldIndexPage = lazy(() => import("@/pages/world-index"));
```

World routes render `null` as placeholder content (wrapped in `WorldRoute` which provides the layout and store sync).

### Preloading

The `createLazyComponent` utility from `src/infrastructure/loading/suspense-strategy.ts` supports preloading:

```tsx
const LazyHome = createLazyComponent(() => import("@/pages/home"));

// Preload on hover (without rendering):
LazyHome.preload();

// Render:
<LazyHome.component />;
```

### SuspenseFallback Design

- Uses inline styles (not Tailwind) — CSS may not be loaded during initial suspend
- `aria-busy="true"` and `aria-label="Loading"` for screen readers
- Spinner animation uses `@keyframes app-spinner` defined in `global.css`
- Style objects are module-level constants — no new references on render

### Future: Streaming SSR

When streaming server-side rendering is added:

- `Suspense` boundaries align with streaming chunks
- Each lazy route becomes a streaming boundary
- The `SuspenseFallback` becomes the shell visible before the first chunk arrives

---

## Folder Responsibilities

```
src/
├── app/                          Application entry and composition
│   ├── main.tsx                  Entry point. Bootstrap + React render.
│   └── App.tsx                   Provider tree. Layout composition.
│
├── infrastructure/               Framework-agnostic systems
│   ├── app-shell/                Outermost wrapper. GSAP init, keyboard nav.
│   ├── bootstrap/                Pre-React initialization.
│   ├── config/                   Environment, constants, metadata, feature flags.
│   ├── error/                    Error boundary, global error handler, fallback UI.
│   ├── hooks/                    Infrastructure hooks (config, flags, animation).
│   ├── loading/                  Suspense boundary, lazy component factory.
│   ├── providers/                Infrastructure providers (EffectsProvider).
│   ├── store/                    Infrastructure Zustand stores (app settings).
│   └── types/                    Infrastructure type definitions.
│
├── engine/                       Pluggable theme engine
│   └── theme/                    Registry, loader, store, provider, CSS generator, definitions.
│
├── layouts/                      Application layout components
│   ├── root-layout/              Semantic HTML shell. Composable slots.
│   └── world-layout/             World error boundary. Route-level store sync.
│
├── providers/                    App-level providers
│   ├── lenis-provider/           Smooth scrolling, GSAP ScrollTrigger bridge.
│   └── (accessibility-provider/) Deprecated. Do not use.
│
├── router/                       Route definitions
│   └── routes.tsx                React Router Routes. Lazy page imports.
│
├── store/                        Application Zustand stores
│   ├── theme-store.ts            Theme mode, reduced motion (persisted).
│   ├── ui-store.ts               Menu, world switcher, scroll position.
│   └── world-store.ts            Current world, history, transitions.
│
├── hooks/                        Application-level hooks
├── components/                   Shared and UI components
├── animation/                    Animation engine (GSAP, Framer, presets)
├── theme/                        Design token system (primitives, semantic, CSS vars)
├── types/                        Shared type definitions
├── utils/                        Utility functions
├── constants/                    Route constants, breakpoints, z-index
├── config/                       World manifests, navigation config
├── styles/                       Global CSS, Tailwind config
├── assets/                       Fonts, icons, images
└── worlds/                       World-specific code (per-world config, components, hooks)
```

### Import Hierarchy

```
main.tsx
  └── imports from: infrastructure, app/App

App.tsx
  └── imports from: infrastructure, engine, providers, layouts, router, components

Layouts
  └── import from: infrastructure, store, types

Providers
  └── import from: store, animation, engine

Routes
  └── import from: layouts, pages (lazy)
```

**Rule:** `infrastructure` never imports from `app/`, `layouts/`, `providers/`, or `pages/`. It is a leaf dependency.

---

## Future Extension Guide

### Adding a New Provider

1. Create `src/providers/{name}/index.tsx`
2. The provider should do exactly one thing (detect preferences, provide context, apply side effects)
3. Import it in `src/app/App.tsx` and place it at the correct depth in the tree
4. Update the provider tree comment at the top of `App.tsx`

**Placement rules:**

- Needs route context? Place inside `BrowserRouter`.
- Needs theme CSS vars? Place inside `ThemeEngineProvider`.
- Needs scroll position? Place inside `LenisProvider`.
- Provides context to everything? Place outside `ErrorBoundary` (but then errors in it won't be caught).

### Adding a New Layout Slot

1. Add the prop to `RootLayoutProps` in `src/layouts/root-layout/index.tsx`
2. Add the conditional rendering block in `RootLayout`
3. Extract any inline styles to module-level constants
4. Pass the slot from `App.tsx` or a parent layout

### Adding a New World

1. Create `src/worlds/{name}-world/config.ts` with a `WorldManifest`
2. Add the `WorldId` to the union in `src/types/world.ts`
3. Add the route to `WORLD_ROUTES` in `src/constants/routes.ts`
4. Add the route to `src/router/routes.tsx` wrapped in `<WorldRoute>`
5. Add the world ID to `VALID_WORLD_IDS` in `src/layouts/world-layout/world-route.tsx`

### Adding a New Route

1. Create the page component in `src/pages/{name}/index.tsx` (default export)
2. Add the route constant to `src/constants/routes.ts`
3. Add the lazy import and `<Route>` to `src/router/routes.tsx`

### Adding Authentication

1. Create `src/providers/auth-provider/index.tsx`
2. Place inside `BrowserRouter` but outside `Suspense` (auth state must resolve before routes render)
3. Add a `<Suspense>` boundary inside the auth provider for auth-dependent route loading
4. Use a layout route pattern for protected routes:

```tsx
<Route
  element={
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  }
>
  <Route path="/dashboard" element={<ProtectedPage />} />
</Route>
```

### Adding Analytics

1. Create `src/infrastructure/analytics/index.ts`
2. Initialize in `bootstrap()` (before React renders)
3. Use the `onFeatureFlagChange` subscriber to gate analytics by the `analytics` flag
4. For route-based tracking, create a `RouteTracker` component inside `BrowserRouter`

### Adding Modals / Notifications

1. Create `src/components/ui/modal/` and `src/components/ui/notification/`
2. Use React Portal to render into the `RootLayout` slot containers:

```tsx
// In the consuming component:
createPortal(<ModalContent />, document.querySelector(".root-layout__modals"));
```

3. The `RootLayout` modals container is positioned at `z-index: 50`
4. The notifications container is at `z-index: 60` with `aria-live="polite"`

### Adding Global Keyboard Shortcuts

1. Create `src/infrastructure/keyboard/index.ts`
2. Register shortcuts with `window.addEventListener("keydown", ...)`
3. Initialize in `bootstrap()` or in a new provider placed inside `AppShell`

---

## Best Practices

### Provider Composition

- **One responsibility per provider.** If a provider does two things, split it.
- **Stable references.** Use `useRef` for mutable state that shouldn't trigger re-renders. Use `useMemo`/`useCallback` for values passed via context.
- **Single source of truth.** Never have two providers managing the same state (the reduced-motion duplication was removed for this reason).

### Error Boundaries

- **One per logical boundary.** Root boundary catches everything. World boundaries isolate world-specific errors.
- **Inline styles in fallback.** CSS may be broken when the error boundary renders. Never use Tailwind or CSS modules in fallback UI.
- **No auto-reset.** The user clicks "Try Again" — the app doesn't reset on its own.

### Suspense

- **One boundary for route transitions.** Multiple boundaries create confusing partial loading states.
- **Fallback uses inline styles.** Same reason as error fallbacks — CSS may not be loaded.
- **Preload on hover.** Use `createLazyComponent` + `preload()` for instant-feeling navigation.

### Scroll Tracking

- **Single source.** `LenisProvider` is the only component that writes to `uiStore.scrollY`.
- **Both paths, one store.** Lenis path (normal) and native path (reduced motion) both write to the same store. Consumers don't need to know which path is active.
- **Throttled.** Both paths use `requestAnimationFrame` to avoid layout thrashing.

### Layout

- **Extract inline styles.** Module-level `const` objects avoid creating new references on every render.
- **Semantic HTML.** `<header>`, `<main>`, `<footer>`, `<aside>` with appropriate ARIA roles.
- **Skip link.** Always present, visually hidden until focused. Targets `#main-content`.

### Imports

- **Infrastructure is a leaf.** `src/infrastructure/` never imports from `app/`, `layouts/`, `providers/`, or `pages/`.
- **Barrel exports.** Each directory has an `index.ts` barrel. Import from the barrel, not the file.
- **Lazy pages.** All page components are lazy-loaded. Never import a page directly in the router.

### Stores

- **Zustand selectors.** Always use granular selectors: `useStore((s) => s.specificField)`. Never `useStore()` without a selector.
- **Persisted state.** Only persist what survives a page reload (theme mode, sound preference). Ephemeral state (scroll position, menu open) is not persisted.
- **Action stability.** Zustand actions are stable references. They don't need `useCallback`.
