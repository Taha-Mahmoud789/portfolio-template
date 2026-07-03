# Core Infrastructure

Internal application infrastructure for Frontend Multiverse. Every feature builds on these modules.

---

## Architecture

```
src/infrastructure/
├── app-shell/         Post-render effects
├── bootstrap/         Pre-render initialization
├── config/            Environment, constants, metadata, feature flags
├── error/             Error boundary, global error handler
├── hooks/             Infrastructure hooks
├── loading/           Suspense wrapper, lazy loading utilities
├── providers/         CSS class side-effect provider
├── store/             Zustand store for app settings
├── types/             Shared type definitions
└── index.ts           Public API barrel export
```

**Dependency direction:** Infrastructure never imports from `@/` (app code). The app imports from infrastructure. This is enforced — if you see `@/` inside `src/infrastructure/`, it's wrong.

---

## Bootstrap

`bootstrap()` runs once before React renders. It initializes systems that must exist before any component mounts.

**Sequence:**

1. `initGlobalErrorHandler()` — window error/rejection listeners
2. `initFeatureFlags()` — load flag overrides from localStorage
3. `applyDocumentMetadata()` — set `<title>`, meta tags

**Usage in `main.tsx`:**

```ts
import { bootstrap } from "@/infrastructure";

bootstrap();
createRoot(root).render(<App />);
```

**Adding a bootstrap step:** Add it to the `try` block in `bootstrap/index.ts`. If it must run before React, it belongs here. If it can run after mount, use `useEffect` in a component instead.

---

## Providers

Infrastructure provides exactly one provider. The app owns all provider composition.

### EffectsProvider

Applies CSS class side effects to `<html>` based on store state. Accepts a store selector as a prop to stay decoupled from specific stores.

**Responsibilities:**

- Adds/removes `theme-light` / `theme-dark` class based on theme mode
- Adds/removes `reduced-motion` class based on OS preference
- Resolves `system` mode by checking `prefers-color-scheme`

**Why a provider and not a hook?** Because CSS classes must be applied at the root level, and multiple components would need to call the hook. A provider runs the effect once.

**Usage:**

```tsx
import { EffectsProvider } from "@/infrastructure";
import { useThemeStore } from "@/store/theme-store";

function useThemeState() {
  const mode = useThemeStore((s) => s.mode);
  const reducedMotion = useThemeStore((s) => s.reducedMotion);
  return { mode, reducedMotion };
}

<EffectsProvider useThemeState={useThemeState}>{children}</EffectsProvider>;
```

The `useThemeState` prop is a hook that returns `{ mode: string; reducedMotion: boolean }`. This keeps the provider generic — it works with any store.

### Provider Composition

The app owns the provider tree in `App.tsx`. Infrastructure provides building blocks; the app decides nesting order.

```
AppShell                          (infrastructure — body class)
  ErrorBoundary                   (infrastructure — catches crashes)
    EffectsProvider               (infrastructure — CSS classes)
      ThemeProvider               (app — theme context)
        WorldProvider             (app — world state)
          LenisProvider           (app — smooth scroll)
            AccessibilityProvider (app — a11y context)
              LoadingBoundary     (infrastructure — Suspense)
                BrowserRouter     (app — routing)
```

**Adding a new provider:**

1. Create it in `src/providers/your-provider/`
2. Import and place it in the tree in `App.tsx`
3. If it applies CSS classes, consider whether `EffectsProvider` should handle it instead

---

## Configuration

Four layers, each with a single responsibility.

### Environment (`config/env.ts`)

Reads `import.meta.env` through a single access point. Never read `import.meta.env` directly elsewhere.

```ts
import { getAppConfig, isDevelopment } from "@/infrastructure";

const config = getAppConfig();
// config.title, config.version, config.environment, config.debug, config.baseUrl
```

`getAppConfig()` returns a frozen object, cached after first call. Safe to call anywhere, anytime.

**Adding an env variable:** Add it to `.env`, `.env.example`, and the `AppConfig` type in `types/index.ts`. Then read it in `buildConfig()`.

### Constants (`config/constants.ts`)

Application identity, storage keys, timeouts, and log prefixes. No logic, no imports.

| Constant       | Purpose                                 |
| -------------- | --------------------------------------- |
| `APP`          | Name, short name, version               |
| `STORAGE_KEYS` | localStorage key names (prevents typos) |
| `TIMEOUTS`     | Duration values in ms                   |
| `LOG_PREFIXES` | Console output prefixes                 |

**Adding a constant:** Add it to the appropriate object. Use `as const` for literal types.

### Metadata (`config/metadata.ts`)

Application identity for `<head>` tags and document manipulation.

```ts
import { METADATA, getDocumentTitle, applyDocumentMetadata } from "@/infrastructure";

getDocumentTitle("Apple World"); // "Apple World | Frontend Multiverse"
```

`applyDocumentMetadata()` is called during bootstrap. Call `getDocumentTitle()` in components that need dynamic `<title>` values.

### Feature Flags (`config/feature-flags.ts`)

Toggle features without deploying. Flags persist in localStorage.

```ts
import { isFeatureEnabled, setFeatureFlag } from "@/infrastructure";

// Imperative check
if (isFeatureEnabled("sound-effects")) {
  /* ... */
}

// Runtime toggle
setFeatureFlag("sound-effects", true);
```

**Adding a flag:** Add it to `DEFAULT_FLAGS` in `config/feature-flags.ts`:

```ts
"my-new-feature": {
  key: "my-new-feature",
  description: "What it does",
  enabled: false,
},
```

---

## Stores

### Existing Stores (app layer)

These live in `src/store/` and are maintained by the app, not infrastructure.

| Store         | Responsibility                                                 |
| ------------- | -------------------------------------------------------------- |
| `theme-store` | Theme mode (`light`/`dark`/`system`), reduced motion           |
| `ui-store`    | Menu open, world switcher open, loading state, scroll position |
| `world-store` | Current world, world history, transition state                 |

### App Settings Store (`store/app-store.ts`)

Infrastructure's Zustand store. Holds settings **not** covered by existing stores.

| Field               | Type                          | Persisted |
| ------------------- | ----------------------------- | --------- |
| `soundEnabled`      | `boolean`                     | Yes       |
| `locale`            | `string`                      | Yes       |
| `debugPanelVisible` | `boolean`                     | No        |
| `animationQuality`  | `"low" \| "medium" \| "high"` | No        |

```ts
import { useAppSettingsStore } from "@/infrastructure";

const soundEnabled = useAppSettingsStore((s) => s.soundEnabled);
const toggleSound = useAppSettingsStore((s) => s.toggleSound);
```

**Adding a setting:** Add the field to `AppSettingsState`, add an action to `AppSettingsActions`, set a default in the `create()` call. If it should survive page reload, add it to `partialize`.

**Where does a new setting go?**

| Concern                       | Store                        |
| ----------------------------- | ---------------------------- |
| Theme, reduced motion         | `theme-store`                |
| Menu, scroll, loading         | `ui-store`                   |
| Current world, history        | `world-store`                |
| Sound, locale, debug, quality | `app-store` (infrastructure) |

---

## Hooks

### useAppConfig

Returns the frozen `AppConfig` object. No memoization — the object is created once and cached.

```ts
const config = useAppConfig();
// config.environment === "production"
```

### useFeatureFlag

Reactive feature flag check. Re-renders the component when the flag changes. Uses `useSyncExternalStore` internally.

```ts
const showDebug = useFeatureFlag("debug-panel");
if (!showDebug) return null;
```

### useAnimationConfig

Derives animation configuration from stores. Returns a memoized object.

```ts
const { enabled, quality, durationMultiplier, threeDEnabled } = useAnimationConfig();
```

| Field                | Type                          | Meaning                                           |
| -------------------- | ----------------------------- | ------------------------------------------------- |
| `quality`            | `"low" \| "medium" \| "high"` | User preference                                   |
| `enabled`            | `boolean`                     | `false` if quality is low or reduced motion is on |
| `threeDEnabled`      | `boolean`                     | `true` only if high quality and no reduced motion |
| `durationMultiplier` | `number`                      | `1` (high), `1.5` (medium), `2` (low)             |

**Usage:** Components check `enabled` before rendering expensive animations. Use `durationMultiplier` to scale animation durations proportionally.

---

## Error Handling

### ErrorBoundary

Class component that catches rendering errors in its subtree.

```tsx
<ErrorBoundary boundaryId="world-canvas" onError={(e) => log(e)}>
  <WorldCanvas />
</ErrorBoundary>
```

| Prop         | Type                                       | Purpose                                   |
| ------------ | ------------------------------------------ | ----------------------------------------- |
| `boundaryId` | `string`                                   | Identifies this boundary in error reports |
| `fallback`   | `ReactNode \| (error, reset) => ReactNode` | Custom fallback UI                        |
| `onError`    | `(error, errorInfo) => void`               | Callback when error is caught             |

**Nesting:** Use multiple boundaries to isolate failures. If a world crashes, the outer boundary keeps the rest of the app alive.

### ErrorFallback

Default crash UI. Uses inline styles because Tailwind may be broken when this renders. Shows error details in development only.

### Global Error Handler

Catches `window.onerror` and `unhandledrejection`. Buffers errors, deduplicates by message, and flushes to console.

**Key behavior:**

- Timer only allocates when errors exist (zero cost when clean)
- Flushes immediately when buffer reaches `maxBufferSize`
- `reportError(error, context)` for programmatic reporting from try/catch blocks

```ts
import { reportError } from "@/infrastructure";

try {
  riskyOperation();
} catch (e) {
  reportError(e as Error, "riskyOperation");
}
```

### Extending for External Services

To send errors to Sentry, LogRocket, etc.:

1. Add your service initialization to `bootstrap/index.ts`
2. In `global-error-handler.ts`, the `flushBuffer` function has a comment marking where to call your service
3. Set `reportToService: true` in the config passed to `initGlobalErrorHandler()`

---

## Loading

### LoadingBoundary

Thin Suspense wrapper. Pass it a `fallback` for loading states.

```tsx
<LoadingBoundary fallback={<Spinner />}>
  <LazyComponent />
</LoadingBoundary>
```

### createLazyComponent

Wraps `React.lazy` with a `preload` function. Use preload for route hover prefetching.

```ts
import { createLazyComponent } from "@/infrastructure";

const LazyHome = createLazyComponent(() => import("@/pages/home"));

// In route:
<Suspense>
  <LazyHome.component />
</Suspense>

// On link hover:
<button onMouseEnter={LazyHome.preload}>Home</button>
```

### preloadAll

Batch-preload multiple components. Useful for preloading all visible route links on mount.

```ts
import { preloadAll } from "@/infrastructure";

preloadAll([LazyHome, LazyAbout, LazyContact]);
```

---

## Extending the Infrastructure

### Adding a New Provider

1. Create `src/providers/your-provider/index.tsx`
2. If it applies CSS classes, make it a candidate for `EffectsProvider`
3. If it provides context, add it to the tree in `App.tsx`
4. Document the nesting order requirement

### Adding a New Store

1. If it duplicates an existing store's concerns, extend that store instead
2. If it's genuinely new, create `src/store/your-store.ts`
3. Export the hook from `src/store/index.ts`
4. If infrastructure needs to read it, pass it as a prop (not an import)

### Adding a New Hook

1. Create `src/infrastructure/hooks/use-your-hook.ts`
2. Add it to `hooks/index.ts`
3. If it reads from app stores, accept them as parameters or use the store's hook directly
4. Infrastructure hooks should never import from `@/`

### Adding a New Config Constant

1. Add it to the appropriate object in `config/constants.ts`
2. Use `as const` for literal types
3. Group by domain (app identity, storage, timing, logging)

### Adding a New Feature Flag

1. Add to `DEFAULT_FLAGS` in `config/feature-flags.ts`
2. Use `useFeatureFlag("your-flag")` in components
3. Use `isFeatureEnabled("your-flag")` for non-reactive checks
4. Toggle at runtime with `setFeatureFlag("your-flag", true)`

### Adding a New Bootstrap Step

1. Add it to the `try` block in `bootstrap/index.ts`
2. If it must run before React renders, it belongs here
3. If it can run after mount, use `useEffect` instead

---

## Best Practices

### Do

- Import from `@/infrastructure` — never from internal paths like `@/infrastructure/config/env`
- Use `useFeatureFlag` for feature gating in components
- Use `useAnimationConfig` to check animation capabilities before rendering expensive effects
- Use `reportError` in catch blocks for programmatic error reporting
- Use `createLazyComponent` for route-level code splitting
- Use `getDocumentTitle` for dynamic page titles
- Add new settings to `app-store` only if they don't fit existing stores

### Don't

- Import from `@/` inside `src/infrastructure/` — this creates circular dependencies
- Create Context when a Zustand selector or derived hook suffices
- Read `import.meta.env` outside of `config/env.ts`
- Hardcode storage keys — use `STORAGE_KEYS`
- Hardcode timeout values — use `TIMEOUTS`
- Add provider nesting without documenting the order requirement
- Store settings in infrastructure that belong in app stores (theme, UI, world)

### When to Use What

| Need                             | Use                                    |
| -------------------------------- | -------------------------------------- |
| Feature toggle                   | `useFeatureFlag` or `isFeatureEnabled` |
| App configuration                | `useAppConfig` or `getAppConfig`       |
| Animation capabilities           | `useAnimationConfig`                   |
| User preferences (sound, locale) | `useAppSettingsStore`                  |
| Theme / reduced motion           | `useThemeStore` (existing)             |
| UI state (menus, scroll)         | `useUiStore` (existing)                |
| World state                      | `useWorldStore` (existing)             |
| Error reporting                  | `reportError`                          |
| Code splitting                   | `createLazyComponent`                  |
| Document title                   | `getDocumentTitle`                     |
| Environment check                | `isDevelopment` / `isProduction`       |

---

## File Reference

| File                            | Lines | Purpose                     |
| ------------------------------- | ----- | --------------------------- |
| `app-shell/index.tsx`           | 17    | Post-render body class      |
| `bootstrap/index.ts`            | 28    | Pre-render initialization   |
| `config/env.ts`                 | 52    | Environment variable access |
| `config/constants.ts`           | 30    | Application constants       |
| `config/metadata.ts`            | 40    | Document metadata           |
| `config/feature-flags.ts`       | 88    | Feature flag system         |
| `error/error-boundary.tsx`      | 60    | Error Boundary component    |
| `error/error-fallback.tsx`      | 70    | Crash recovery UI           |
| `error/global-error-handler.ts` | 130   | Window error handler        |
| `hooks/use-app-config.ts`       | 12    | Config access hook          |
| `hooks/use-feature-flag.ts`     | 30    | Reactive flag hook          |
| `hooks/use-animation-config.ts` | 45    | Animation config hook       |
| `loading/loading-boundary.tsx`  | 15    | Suspense wrapper            |
| `loading/suspense-strategy.ts`  | 45    | Lazy loading utilities      |
| `providers/effects/index.tsx`   | 45    | CSS class side effects      |
| `store/app-store.ts`            | 55    | App settings store          |
| `types/index.ts`                | 35    | Type definitions            |
| `index.ts`                      | 50    | Public API barrel           |
