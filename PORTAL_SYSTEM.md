# Portal System

Reusable gateway system that renders themed portals to connect the portfolio to a multiverse of frontend worlds. Each portal is a `PortalDefinition` mapped to a `ThemeId` — a card in the grid that, when activated, transitions to a React Router destination.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Components Layer                     │
│  PortalGrid ──▶ PortalCard ──▶ PortalIcon               │
│                    ├── PortalGlow                        │
│                    ├── PortalDepth                       │
│                    ├── PortalMagnetic                    │
│                    └── PortalAnnouncer                   │
├─────────────────────────────────────────────────────────┤
│                     Hooks Layer                          │
│  usePortal · useAllPortals · usePortalById               │
│  usePortalSearch · usePortalActions · usePortalStatus    │
│  usePortalTransition · usePortalFocusManager             │
├─────────────────────────────────────────────────────────┤
│                     State Layer                          │
│  Zustand Store (selection, hover, focus, phase)          │
│  PortalRegistry (sorted in-memory collection)            │
├─────────────────────────────────────────────────────────┤
│                     Logic Layer                          │
│  PortalTransitionManager (async lifecycle orchestrator)  │
│  Validation · Metadata · Navigation                      │
├─────────────────────────────────────────────────────────┤
│                     Foundation Layer                     │
│  Types · Constants · Animation utilities                 │
└─────────────────────────────────────────────────────────┘
```

**Dependency rule:** Upper layers import from lower layers only. Components never import from other component files directly — they import from hooks, store, or animation utilities.

---

## Portal Lifecycle

Every portal progresses through a 7-phase lifecycle managed by the Zustand store and optionally orchestrated by `PortalTransitionManager`.

```
idle ──▶ selected ──▶ expanding ──▶ transitioning ──▶ loading ──▶ entering ──▶ entered
  ▲           │                                                                          │
  └───────────┴──────────────────── cancel ───────────────────────────────────────────────┘
```

| Phase | Store State | What Happens |
|-------|-------------|--------------|
| `idle` | No portal selected | Default resting state. Grid is interactive. |
| `selected` | `selectedPortalId` set | User clicked/pressed a portal. Card shows selection ring. Focus is saved by `usePortalFocusManager`. |
| `expanding` | Phase transitions | Card begins scale/zoom animation toward full-screen. |
| `transitioning` | Phase transitions | Scene transition effect (dissolve, iris, particle-burst, etc.). |
| `loading` | Phase transitions | World resource loading placeholder. |
| `entering` | Phase transitions | World content fades in. |
| `entered` | Phase stays | World is fully loaded. Previous focus can be restored here. |

**Cancellation:** At any point after `selected`, calling `cancelActivation()` resets to `idle` and restores focus.

**Synchronous path:** `store.activatePortal()` sets `selected` phase. The consumer is responsible for calling `navigate()`. `PortalTransitionManager` handles the async multi-stage flow when needed.

---

## Activation Flow

```
User clicks/presses Enter on PortalCard
        │
        ▼
PortalCard.onSelect(portal)          ← single click
PortalCard.onActivate(portal)         ← Enter/Space
        │
        ▼
usePortalActions().selectPortal(id)   ← sets selectedPortalId + phase="selected"
        │
        ▼
usePortalFocusManager.saveFocus()     ← saves document.activeElement
        │
        ▼
store.activatePortal(id)             ← phase stays "selected"
        │
        ▼
navigate(portal.destinationRoute)     ← React Router transition
        │
        ▼
PortalAnnouncer announces             ← "Entering {title} world"
```

---

## Transition Flow

When using `PortalTransitionManager` for full multi-stage orchestration:

```
PortalTransitionManager.execute(onPhaseChange)
        │
        ├──▶ Stage: "selection"        → phase: "selected"
        │        sleep(duration / stages.length)
        │
        ├──▶ Stage: "expansion"        → phase: "expanding"
        │        sleep(duration / stages.length)
        │
        ├──▶ Stage: "scene-transition" → phase: "transitioning"
        │        sleep(duration / stages.length)
        │
        ├──▶ Stage: "world-loading"    → phase: "loading"
        │        sleep(duration / stages.length)
        │
        └──▶ Stage: "world-entry"      → phase: "entering"
                 │
                 ▼
          Returns { success: true, duration, stages[] }
```

**Cancellation:** Call `manager.cancel()` at any time. The `AbortController` signal stops the async loop and resets phase to `idle`.

**Preset durations:** Each `PortalTransitionPreset` defines its own `totalDuration` (0–1600ms) and `stages[]` array. The manager divides total duration evenly across stages.

---

## Folder Structure

```
src/engine/portal/
├── index.ts                  # Barrel exports (single public API)
├── types.ts                  # All TypeScript type definitions
├── constants.ts              # Default configs, presets, a11y strings
├── store.ts                  # Zustand store + selectors
├── hooks.ts                  # React hooks (usePortal, usePortalTransition, etc.)
├── validation.ts             # Portal definition validation
├── registry.ts               # PortalRegistry class (Map-based, sorted cache)
├── metadata.ts               # SEO metadata + JSON-LD structured data
├── navigation.ts             # React Router integration hook
├── transition-manager.ts     # Async multi-stage lifecycle orchestrator
├── animations.ts             # Framer Motion variants + mouse math utilities
└── components/
    ├── index.ts              # Component barrel exports
    ├── PortalCard.tsx         # Individual portal card (background, icon, a11y)
    ├── PortalGrid.tsx         # Responsive grid + keyboard nav + lazy render
    ├── PortalIcon.tsx         # Multi-type icon renderer (component/emoji/svg)
    ├── PortalGlow.tsx         # Box-shadow glow overlay
    ├── PortalDepth.tsx        # 3D perspective tilt effect
    ├── PortalMagnetic.tsx     # Magnetic cursor-follow effect
    └── PortalAnnouncer.tsx    # Screen reader aria-live region
```

---

## API

### Types

```typescript
type PortalStatus = "active" | "coming-soon" | "disabled" | "locked";

type PortalActivationPhase =
  | "idle" | "selected" | "expanding" | "transitioning"
  | "loading" | "entering" | "entered";

type PortalAnimationPreset =
  | "fade" | "slide" | "scale" | "rotate"
  | "morph" | "glitch" | "bloom" | "wave";

type PortalTransitionPreset =
  | "zoom-in" | "slide-up" | "morph-expand" | "dissolve"
  | "iris" | "page-turn" | "particle-burst" | "none";

interface PortalDefinition {
  id: string;
  worldId: string;
  title: string;
  subtitle: string;
  description: string;
  theme: ThemeId;
  background: PortalBackground;
  icon: PortalIcon;
  accent: PortalAccent;
  animationPreset: PortalAnimationPreset;
  transitionPreset: PortalTransitionPreset;
  destinationRoute: string;
  status: PortalStatus;
  order: number;
  metadata: PortalMetadata;
}
```

### Hooks

| Hook | Returns | Description |
|------|---------|-------------|
| `usePortal(id)` | `UsePortalReturn` | Single portal state + `select()` / `activate()` |
| `useAllPortals()` | `PortalDefinition[]` | All registered portals |
| `usePortalById(id)` | `PortalDefinition \| undefined` | Find by ID |
| `usePortalSearch(query)` | `PortalDefinition[]` | Filter by title/subtitle/description/tags |
| `usePortalActions()` | Actions object | `selectPortal`, `clearSelection`, `setHoveredPortal`, `setFocusedPortal`, `activatePortal`, `cancelActivation` |
| `usePortalStatus(id)` | Status object | `status`, `isInteractive`, `isLocked`, `isComingSoon`, `isDisabled` |
| `usePortalTransition()` | Transition object | `transition(id): boolean`, `isTransitioning`, `phase`, `cancel()` |
| `usePortalFocusManager()` | Focus object | `saveFocus()`, `restoreFocus()`, `announce(msg)`, `phase` |

### Components

```tsx
// Basic grid usage
<PortalGrid portals={portals} columns={3} onSelect={handleSelect} />

// Custom card with depth + magnetic effects
<PortalCard portal={portal} index={0} onSelect={handleSelect}>
  <PortalDepth maxRotate={8}>
    <PortalMagnetic strength={0.2}>
      {/* custom card content */}
    </PortalMagnetic>
  </PortalDepth>
</PortalCard>

// Mount announcer once at the grid level
<PortalAnnouncer />
```

### PortalRegistry

```typescript
const registry = new PortalRegistry({ enableValidation: true });

registry.register(portal);           // validates + adds
registry.registerAll([p1, p2]);      // batch
registry.get("world-1");             // lookup by ID
registry.getAll();                   // sorted by order
registry.getByTheme("cyberpunk");    // filter by theme
registry.getByStatus("active");      // filter by status
registry.search("three");            // full-text search
registry.remove("world-1");         // remove + invalidate cache
```

### Validation

```typescript
const result = validatePortal(portal);
// { valid: boolean, errors: string[], warnings: string[] }

isValidPortal(portal);               // boolean
isValidPortalStatus("active");       // type guard
isValidAnimationPreset("scale");     // type guard
```

### Metadata

```typescript
const meta = getPortalMeta(portal);
// { title: "My World - Frontend Multiverse", description, ogImage, keywords }

const jsonLd = generatePortalStructuredData(portal);
// schema.org WebPage structured data object
```

---

## Performance Recommendations

### Rendering

- **Lazy rendering:** `PortalGrid` uses `IntersectionObserver` with `rootMargin: 100px` to defer off-screen cards. Cards outside the viewport render as empty placeholders until they enter the observer zone.
- **Staggered entrance:** Cards animate in with `index * 0.08s` delay. Keep stagger below 0.1s per card to avoid long wait times on large grids.
- **Memoization:** All hooks use `useMemo` and `useCallback` with stable dependencies. The Zustand store uses selector functions to prevent unnecessary rerenders.

### Animations

- **GPU acceleration:** Framer Motion uses CSS `transform` by default — no layout thrashing. `PortalDepth` uses `transformStyle: "preserve-3d"` for proper layering.
- **Spring physics:** `PortalDepth` and `PortalMagnetic` use Framer Motion springs instead of CSS transitions for natural-feeling motion that automatically settles.
- **Reduced motion:** Respect `prefers-reduced-motion` by disabling depth/magnetic effects and using the `fade` or `scale` animation presets (minimal movement).

### State

- **Selector pattern:** Always use named selectors (`selectSelectedPortalId`, `selectActivationPhase`) instead of inline arrow functions to avoid creating new references on every render.
- **Registry cache:** `PortalRegistry.getAll()` caches the sorted result. The cache is invalidated only on `register`, `remove`, or `clear`. Call `getAll()` freely — it's O(1) after the first sort.
- **Metadata cache:** `getPortalMeta()` caches up to 50 entries (LRU-style FIFO eviction). Call it in render paths without worry.

### Network

- **No fetch during transitions:** All portal data is local (Zustand store). The `transition()` function only triggers `navigate()`. World-specific data loading happens at the destination route, not during the portal transition.

---

## Accessibility Guide

### ARIA Roles

| Element | Role | Attributes |
|---------|------|------------|
| `PortalGrid` | `grid` | `aria-label="World portals"` |
| `PortalCard` | `gridcell` | `aria-label`, `aria-selected`, `aria-disabled` |
| `PortalIcon` (emoji) | — | `role="img"`, `aria-hidden="true"` |
| `PortalGlow` | — | `aria-hidden="true"` |
| `PortalDepth` | — | `aria-hidden="true"` |
| `PortalMagnetic` | — | `aria-hidden="true"` |
| `PortalAnnouncer` | `status` | `aria-live="polite"`, `aria-atomic="true"` |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `ArrowRight` | Move focus to next cell |
| `ArrowLeft` | Move focus to previous cell |
| `ArrowDown` | Move focus to cell below (advances by column count) |
| `ArrowUp` | Move focus to cell above |
| `Home` | Move focus to first cell |
| `End` | Move focus to last cell |
| `Enter` / `Space` | Activate focused portal |
| `Tab` | Move between interactive elements (portals with `tabIndex=0`) |

**Focus management:** `usePortalFocusManager` saves `document.activeElement` before activation and restores it after the transition completes or is cancelled, with a 100ms settle delay.

### Focus Indicators

Focus rings use Tailwind `focus-visible:` — they appear only on keyboard navigation, not mouse clicks. Colors and widths are driven by `PORTAL_INTERACTION_DEFAULTS.focus` and rendered via CSS custom properties (`--tw-ring-color`, `--tw-ring-offset-width`).

### Screen Reader Announcements

`PortalAnnouncer` renders a visually hidden `aria-live="polite"` region. It announces:

- **Selection:** "Selected {title} world"
- **Activation:** "Entering {title} world"
- **Completion:** "Entered {title} world"

Mount `<PortalAnnouncer />` once at the top level of your portal grid.

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- Disable `PortalDepth` and `PortalMagnetic` via their `enabled` prop
- Use `"fade"` or `"scale"` animation presets (minimal movement)
- Transition manager stages complete instantly (`totalDuration: 0`)

---

## Future Extension Guide

### Adding a New Portal

1. Define the portal in your world configuration:

```typescript
const myPortal: PortalDefinition = {
  id: "my-world",
  worldId: "my-world",
  title: "My World",
  subtitle: "A new frontend world",
  description: "Description for search and accessibility",
  theme: "cyberpunk",           // must be a valid ThemeId
  background: { type: "gradient", value: "...", fallbackColor: "#000" },
  icon: { type: "emoji", emoji: "🚀", size: 48 },
  accent: { color: "#00f", glow: "#00f3", gradient: "...", shadow: "..." },
  animationPreset: "glitch",
  transitionPreset: "zoom-in",
  destinationRoute: "/worlds/my-world",
  status: "active",
  order: 5,
  metadata: { author: "You", version: "1.0", createdAt: "...", tags: ["3d"], category: "Creative", featured: false },
};
```

2. Register it:

```typescript
registry.register(myPortal);
```

3. Create the world route at `/worlds/my-world` (outside portal system scope).

### Adding a New Animation Preset

1. Add the preset name to `PortalAnimationPreset` in `types.ts`
2. Add the preset config to `PORTAL_ANIMATION_PRESETS` in `constants.ts`:

```typescript
my-preset: {
  entrance: { hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } },
  idle: { scale: 1, rotateZ: 0 },
  hover: { scale: 1.05, rotateZ: 2 },
  selected: { scale: 1.1, rotateZ: 0 },
},
```

3. The animation utilities in `animations.ts` will pick it up automatically.

### Adding a New Transition Preset

1. Add the preset name to `PortalTransitionPreset` in `types.ts`
2. Add the preset config to `PORTAL_TRANSITION_PRESETS` in `constants.ts`:

```typescript
"my-transition": {
  type: "custom",
  duration: 1200,
  easing: "easeInOut",
  stages: ["selection", "expansion", "custom-phase", "world-loading", "world-entry"],
},
```

3. If the stage name maps to a new `PortalActivationPhase`, update `PHASE_MAP` in `transition-manager.ts`.

### Adding a New Portal Status

1. Add the status to `PortalStatus` in `types.ts`
2. Add defaults to `PORTAL_STATUS_DEFAULTS` in `constants.ts`
3. Update `isValidPortalStatus` in `validation.ts`
4. Update `usePortalStatus` in `hooks.ts` to expose the new boolean

### Composing Custom Cards

Use the low-level components to build entirely custom portal cards:

```tsx
<PortalCard portal={portal} index={0} onSelect={handleSelect}>
  <PortalDepth enabled={prefersReducedMotion === false} maxRotate={10}>
    <PortalMagnetic enabled={prefersReducedMotion === false} strength={0.2}>
      <PortalGlow color={portal.accent.glow} intensity={0.5} />
      <PortalIcon icon={portal.icon} size={64} />
      <h3>{portal.title}</h3>
      <p>{portal.subtitle}</p>
    </PortalMagnetic>
  </PortalDepth>
</PortalCard>
```

### Extending the Store

To add global portal state (e.g., a filter mode):

1. Add the field to `PortalState` in `types.ts`
2. Add the action to `PortalActions` in `types.ts`
3. Implement in `store.ts`
4. Add a selector in `store.ts`
5. Export from `index.ts`
