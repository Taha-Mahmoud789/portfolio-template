# Base World Foundation

Reusable foundation from which every world in the Frontend Multiverse inherits.

## Overview

The Base World is not a visual world. It is the architectural foundation that provides:

- World lifecycle management
- Theme injection
- Layout mounting
- Background management
- Content areas
- Overlay system
- Transition layer
- Accessibility setup
- Focus restoration
- Cleanup lifecycle

Every future world inherits this foundation and adds its own personality on top.

## Architecture

```
src/worlds/base-world/
├── index.ts                    # Barrel exports
├── types.ts                    # All type definitions
├── constants.ts                # Default values, timing, classes
├── config.ts                   # Configuration and merge utilities
├── state/
│   ├── index.ts                # State barrel exports
│   └── store.ts                # Zustand store for world state
├── layers/
│   ├── background/
│   │   └── index.tsx           # Background layer (gradient, image, video, canvas, three.js)
│   ├── content/
│   │   └── index.tsx           # Content layer (hero, sections, canvas, floating, overlay)
│   ├── overlay/
│   │   └── index.tsx           # Overlay layer (hud, dialog, notification, debug)
│   └── transition/
│       └── index.tsx           # Transition layer (enter/exit animations)
├── components/
│   ├── base-world.tsx          # Root component (composes all layers)
│   ├── world-header.tsx        # Reusable header (back, title, controls)
│   ├── world-wrapper.tsx       # Outermost container (theme injection)
│   ├── world-layout.tsx        # Layout structure (fullscreen, sidebar, split, etc.)
│   └── world-loader.tsx        # Loading states and error recovery
└── hooks/
    └── index.ts                # React hooks for Base World
```

## Lifecycle

Every Base World progresses through these phases:

```
idle → initializing → ready → active
                                  ↓
                           transitioning-out → idle
                                  ↓
                              suspended → active
                                  ↓
                              destroying → idle
```

| Phase               | What Happens                                         |
| ------------------- | ---------------------------------------------------- |
| `idle`              | World exists but is not initialized                  |
| `initializing`      | World is being set up (theme, layout, accessibility) |
| `ready`             | World is mounted and ready to become active          |
| `active`            | World is currently displayed and interactive         |
| `transitioning-in`  | World is entering (another world is leaving)         |
| `transitioning-out` | World is leaving (another world is entering)         |
| `suspended`         | World is paused (another world is active)            |
| `destroying`        | World is being torn down                             |
| `error`             | World encountered an error (recoverable)             |

## State Flow

```
┌─────────────────────────────────────────────────┐
│                 Zustand Store                     │
│  phase · isMounted · isReady · isActive           │
│  isTransitioning · hasError · error               │
│  theme · worldId                                  │
├─────────────────────────────────────────────────┤
│                 Actions                           │
│  setPhase · setMounted · setReady · setActive     │
│  setTransitioning · setError · setTheme            │
│  setWorldId · reset                               │
├─────────────────────────────────────────────────┤
│                 Selectors                         │
│  selectBaseWorldPhase · selectBaseWorldMounted     │
│  selectBaseWorldReady · selectBaseWorldActive      │
│  selectBaseWorldTheme · selectBaseWorldId          │
└─────────────────────────────────────────────────┘
```

## Layer System

### Background Layer

Renders the world background based on variant type.

| Variant    | Description                 |
| ---------- | --------------------------- |
| `gradient` | CSS gradient background     |
| `image`    | Static image background     |
| `video`    | Looping video background    |
| `mesh`     | Mesh gradient (future)      |
| `particle` | Particle system (future)    |
| `canvas`   | HTML Canvas (future)        |
| `three`    | Three.js scene (future)     |
| `none`     | No background (solid color) |

### Content Layer

Provides named content areas for world components.

| Area       | Purpose                       |
| ---------- | ----------------------------- |
| `hero`     | Hero section (above the fold) |
| `sections` | Main content sections         |
| `canvas`   | Interactive canvas area       |
| `floating` | Floating UI elements          |
| `overlay`  | Content overlays              |

### Overlay Layer

Manages HUD, dialogs, notifications, and debug panels.

| Type           | Elevation | Purpose             |
| -------------- | --------- | ------------------- |
| `hud`          | z-30      | Heads-up display    |
| `notification` | z-40      | Toast notifications |
| `dialog`       | z-50      | Modal dialogs       |
| `debug`        | z-60      | Debug panels        |

### Transition Layer

Manages enter/exit transitions for the world.

| Phase      | Description          |
| ---------- | -------------------- |
| `none`     | No transition active |
| `entering` | World is entering    |
| `entered`  | World has entered    |
| `exiting`  | World is exiting     |
| `exited`   | World has exited     |

## Components

### BaseWorld

Root component that composes all layers.

```tsx
import { BaseWorld } from "@/worlds/base-world";

<BaseWorld
  worldId="apple-world"
  theme="apple"
  showHeader={true}
  showBackground={true}
  showOverlays={true}
  enableAccessibility={true}
  onReady={() => console.log("World ready")}
  onError={(error) => console.error(error)}
>
  <MyWorldContent />
</BaseWorld>;
```

### BaseWorldHeader

Reusable header with back navigation, title, and controls.

```tsx
import { BaseWorldHeader } from "@/worlds/base-world";

<BaseWorldHeader
  showBack={true}
  showTitle={true}
  showControls={true}
  onBack={() => window.history.back()}
>
  <ThemeToggle />
</BaseWorldHeader>;
```

### BaseWorldWrapper

Outermost container that handles theme injection.

```tsx
import { BaseWorldWrapper } from "@/worlds/base-world";

<BaseWorldWrapper worldId="apple-world" theme="apple">
  {children}
</BaseWorldWrapper>;
```

### BaseWorldLayout

Layout structure supporting multiple layout types.

```tsx
import { BaseWorldLayout } from "@/worlds/base-world";

<BaseWorldLayout
  config={{ type: "sidebar", sidebar: { position: "left", width: "280px", collapsible: true } }}
>
  <Sidebar />
  <MainContent />
</BaseWorldLayout>;
```

### BaseWorldLoader

Loading states and error recovery.

```tsx
import { BaseWorldLoader } from "@/worlds/base-world";

<BaseWorldLoader onReady={() => console.log("Ready")} onError={handleError}>
  <WorldContent />
</BaseWorldLoader>;
```

## Hooks

### useBaseWorld

Get full world state and actions.

```tsx
import { useBaseWorld } from "@/worlds/base-world";

const { state, actions } = useBaseWorld();
// state.phase, state.isMounted, state.isReady, state.isActive
// actions.setPhase("active"), actions.setError(error)
```

### useBaseWorldBackground

Get background layer state.

```tsx
import { useBaseWorldBackground } from "@/worlds/base-world";

const { variant, config, isLoaded } = useBaseWorldBackground();
```

### useBaseWorldContent

Manage content areas.

```tsx
import { useBaseWorldContent } from "@/worlds/base-world";

const { areas, registerArea, unregisterArea } = useBaseWorldContent();
```

### useBaseWorldOverlay

Manage overlay visibility.

```tsx
import { useBaseWorldOverlay } from "@/worlds/base-world";

const { visibleOverlays, show, hide, toggle } = useBaseWorldOverlay();
show("dialog"); // show the dialog overlay
```

### useBaseWorldTransition

Control transition phases.

```tsx
import { useBaseWorldTransition } from "@/worlds/base-world";

const { phase, enter, exit } = useBaseWorldTransition();
enter(); // start entering transition
await exit(); // exit transition (returns promise)
```

## Configuration

### BaseWorldConfig

```typescript
interface BaseWorldConfig {
  theme: ThemeId;
  layout: WorldLayoutConfig;
  background: WorldBackground;
  backgroundVariant: BaseBackgroundVariant;
  contentAreas: BaseContentArea[];
  showHeader: boolean;
  showBackground: boolean;
  showOverlays: boolean;
  enableTransitions: boolean;
  enableAccessibility: boolean;
  enableReducedMotion: boolean;
  transitionEnterDuration: number;
  transitionExitDuration: number;
}
```

### Merging Config

```typescript
import { mergeBaseWorldConfig, BASE_WORLD_DEFAULT_CONFIG } from "@/worlds/base-world";

const customConfig = mergeBaseWorldConfig(BASE_WORLD_DEFAULT_CONFIG, {
  theme: "cyberpunk",
  layout: { type: "sidebar", sidebar: { position: "right", width: "320px", collapsible: true } },
});
```

### Deriving from WorldDefinition

```typescript
import { deriveBaseWorldConfig } from "@/worlds/base-world";

const config = deriveBaseWorldConfig(worldDefinition);
```

## Extending the Base World

### Creating a New World

1. Create `src/worlds/<world-name>/` directory
2. Create `config.ts` with world configuration
3. Create `components/` with world-specific components
4. Create `hooks/` with world-specific hooks
5. Create `types/` with world-specific types
6. Import and use `BaseWorld` as the root component

### Example: Apple World

```tsx
// src/worlds/apple-world/components/apple-world.tsx
import { BaseWorld, useBaseWorld } from "@/worlds/base-world";
import { APPLE_WORLD_CONFIG } from "../config";

export function AppleWorld() {
  return (
    <BaseWorld
      worldId="apple-world"
      theme="apple"
      definition={appleWorldDefinition}
      showHeader={true}
      showBackground={true}
    >
      <AppleHero />
      <AppleSections />
    </BaseWorld>
  );
}
```

### Adding World-Specific State

```typescript
// src/worlds/apple-world/state/store.ts
import { create } from "zustand";

interface AppleWorldState {
  selectedProduct: string | null;
  setSelectedProduct: (id: string | null) => void;
}

export const useAppleWorldStore = create<AppleWorldState>()((set) => ({
  selectedProduct: null,
  setSelectedProduct: (id) => set({ selectedProduct: id }),
}));
```

### Adding World-Specific Hooks

```typescript
// src/worlds/apple-world/hooks/index.ts
import { useAppleWorldStore } from "../state/store";

export function useSelectedProduct() {
  return useAppleWorldStore((s) => s.selectedProduct);
}
```

## Performance

- **Lazy initialization:** World state is initialized only when the world is mounted
- **Minimal rerenders:** Zustand selectors prevent unnecessary rerenders
- **GPU-friendly:** Animations use transform and opacity only
- **Memory safe:** All effects are cleaned up on unmount

## Accessibility

- **Reduced Motion:** Respects `prefers-reduced-motion` media query
- **Keyboard Navigation:** Full keyboard support with visible focus indicators
- **Focus Management:** Focus is restored to the correct element after transitions
- **Semantic Landmarks:** Proper ARIA roles and landmarks
- **Screen Reader Support:** Meaningful labels and announcements

## Files Created

```
src/worlds/base-world/types.ts          — 227 lines
src/worlds/base-world/constants.ts      — 110 lines
src/worlds/base-world/config.ts         — 85 lines
src/worlds/base-world/state/store.ts    — 80 lines
src/worlds/base-world/state/index.ts    — 12 lines
src/worlds/base-world/layers/background/index.tsx — 170 lines
src/worlds/base-world/layers/content/index.tsx    — 92 lines
src/worlds/base-world/layers/overlay/index.tsx    — 120 lines
src/worlds/base-world/layers/transition/index.tsx — 78 lines
src/worlds/base-world/components/base-world.tsx   — 95 lines
src/worlds/base-world/components/world-header.tsx — 55 lines
src/worlds/base-world/components/world-wrapper.tsx — 30 lines
src/worlds/base-world/components/world-layout.tsx — 65 lines
src/worlds/base-world/components/world-loader.tsx — 60 lines
src/worlds/base-world/hooks/index.ts    — 110 lines
src/worlds/base-world/index.ts          — 100 lines
```
