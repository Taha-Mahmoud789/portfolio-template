# World Engine

Scalable infrastructure that loads, activates, suspends, and unloads visual worlds in the Frontend Multiverse. Each world is a self-contained React application with its own theme, layout, assets, and lifecycle — managed by a central orchestrator that coordinates registry, caching, loading, memory, transitions, and events.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Orchestration Layer                   │
│  WorldManager (coordinates all subsystems)               │
├─────────────────────────────────────────────────────────┤
│                     React Layer                           │
│  WorldProvider · WorldErrorBoundary · Hooks               │
│  useWorld · useWorldLoader · useWorldTransition           │
│  useWorldEvents · useWorldPhase · useWorldSwitcher        │
├─────────────────────────────────────────────────────────┤
│                     State Layer                           │
│  Zustand Store (instances, transitions, ready/cached)     │
│  WorldActionsContext · WorldStateContext                   │
├─────────────────────────────────────────────────────────┤
│                     Subsystem Layer                       │
│  WorldRegistry · WorldEventBus · WorldCache               │
│  WorldLoader · WorldLifecycle · WorldTransitionManager    │
│  WorldMemoryManager · WorldAssetManager · WorldMetadata   │
├─────────────────────────────────────────────────────────┤
│                     Foundation Layer                      │
│  Types · Constants · Validation                           │
└─────────────────────────────────────────────────────────┘
```

**Dependency rule:** Upper layers import from lower layers only. Subsystems are pure TypeScript — no React imports. The React layer (hooks, provider, error boundary) is the only layer that uses React.

---

## Lifecycle

Every world progresses through a 20-phase lifecycle managed by `WorldLifecycle` state machine and the Zustand store.

```
unregistered ──▶ registered ──▶ preloading ──▶ preloaded ──▶ loading ──▶ loaded
                                                                               │
mounted ◀── loaded                                                              │
  │                                                                            │
active ◀── mounting                                                             │
  │                                                                            │
suspending ──▶ suspended ──▶ resuming ──▶ active                               │
  │                                                                            │
deactivating ──▶ inactive                                                      │
  │                                                                            │
unloading ──▶ unloaded                                                         │
  │                                                                            │
destroying ──▶ destroyed                                                       │
  │                                                                            │
error ◀── (any phase on failure) ──────────────────────────────────────────────┘
```

| Phase          | What Happens                                                     |
| -------------- | ---------------------------------------------------------------- |
| `unregistered` | World exists in config but not registered with the engine        |
| `registered`   | Definition added to registry, instance state created             |
| `preloading`   | Module preload initiated (React.lazy wrapper loaded into memory) |
| `preloaded`    | Module preload complete, component not yet imported              |
| `loading`      | Module actively loading (async import in progress)               |
| `loaded`       | Module loaded and cached, component available                    |
| `mounting`     | React component being mounted into DOM                           |
| `mounted`      | Component mounted, not yet active                                |
| `activating`   | World becoming the active/visible world                          |
| `active`       | World is currently displayed and interactive                     |
| `suspending`   | World being suspended (another world activating)                 |
| `suspended`    | World suspended, DOM may be hidden                               |
| `resuming`     | Suspended world being resumed                                    |
| `deactivating` | World losing active status                                       |
| `inactive`     | World loaded but not currently active                            |
| `unloading`    | Module being unloaded from cache                                 |
| `unloaded`     | Module unloaded, memory freed                                    |
| `destroying`   | World being fully destroyed                                      |
| `destroyed`    | World fully destroyed, must re-register                          |
| `error`        | World entered error state (recoverable via `clearError`)         |

**Valid transitions** are enforced by `VALID_LIFECYCLE_TRANSITIONS` in constants. Invalid transitions throw errors.

---

## Activation Flow

```
User navigates to /worlds/cyberpunk
        │
        ▼
useWorldSwitcher().switchToWorld(id)
        │
        ▼
WorldManager.activate(worldId)
        │
        ├──▶ WorldLifecycle.transition("activating")
        │
        ├──▶ WorldEventBus.emit("world:activating")
        │
        ├──▶ WorldTransitionManager.transition(from, to)
        │        │
        │        ├──▶ onBeforeTransition()   → suspend previous world
        │        ├──▶ performTransition()    → store.activate(worldId)
        │        └──▶ onAfterTransition()    → lifecycle → "active"
        │
        ├──▶ WorldLifecycle.transition("active")
        │
        └──▶ WorldEventBus.emit("world:active")
```

---

## Loading Flow

```
WorldManager.load(worldId)
        │
        ├──▶ Check WorldCache → if hit, return cached component
        │
        ├──▶ WorldLifecycle.transition("loading")
        │
        ├──▶ WorldLoader.load(worldId, loaderFn)
        │        │
        │        ├──▶ Check loadedModules cache → if hit, return
        │        ├──▶ loaderFn() → React.lazy import
        │        ├──▶ Timeout guard (default 10s)
        │        └──▶ Retry with exponential backoff (3 attempts)
        │
        ├──▶ WorldCache.set(worldId, component, module)
        │
        ├──▶ WorldLifecycle.transition("loaded")
        │
        └──▶ Store.mount(worldId)
```

---

## Memory Management

`WorldMemoryManager` tracks memory usage per world and across the engine.

| Threshold        | Default | Action                                                       |
| ---------------- | ------- | ------------------------------------------------------------ |
| Warning          | 50 MB   | Logs warning, triggers idle cleanup                          |
| Critical         | 100 MB  | Forces immediate cleanup of all suspended/inactive worlds    |
| Cleanup interval | 30s     | Periodic check for idle worlds                               |
| Idle timeout     | 5 min   | Worlds inactive for this duration are candidates for cleanup |

**Cleanup priority:** Suspended worlds → Inactive worlds → Oldest loaded worlds.

**GC integration:** Calls `globalThis.gc?.()` when available (Node.js / `--expose-gc` environments).

---

## Events

`WorldEventBus` provides typed pub/sub for all world lifecycle events.

| Event                | Payload                 | When                             |
| -------------------- | ----------------------- | -------------------------------- |
| `world:registered`   | `worldId`               | Definition added to registry     |
| `world:unregistered` | `worldId`               | Definition removed from registry |
| `world:preloading`   | `worldId`               | Module preload started           |
| `world:preloaded`    | `worldId`               | Module preload complete          |
| `world:loading`      | `worldId`               | Module loading started           |
| `world:loaded`       | `worldId`               | Module loaded successfully       |
| `world:mounting`     | `worldId`               | Component mounting               |
| `world:mounted`      | `worldId`               | Component mounted                |
| `world:activating`   | `worldId`               | World becoming active            |
| `world:active`       | `worldId`               | World is active                  |
| `world:suspending`   | `worldId`               | World being suspended            |
| `world:suspended`    | `worldId`               | World suspended                  |
| `world:resuming`     | `worldId`               | Suspended world resuming         |
| `world:deactivating` | `worldId`               | World losing active status       |
| `world:inactive`     | `worldId`               | World inactive                   |
| `world:unloading`    | `worldId`               | Module being unloaded            |
| `world:unloaded`     | `worldId`               | Module unloaded                  |
| `world:destroying`   | `worldId`               | World being destroyed            |
| `world:destroyed`    | `worldId`               | World destroyed                  |
| `world:error`        | `worldId, from?, error` | Error in any lifecycle phase     |

**History:** Events are buffered (max 100) for debugging and replay.

---

## Caching

`WorldCache` supports three eviction strategies:

| Strategy | Behavior                                            |
| -------- | --------------------------------------------------- |
| `lru`    | Least Recently Used — evicts oldest accessed entry  |
| `lfu`    | Least Frequently Used — evicts least accessed entry |
| `fifo`   | First In First Out — evicts oldest inserted entry   |

**Configuration:**

- `maxEntries`: 50 (default)
- `maxAge`: 30 minutes
- `evictionStrategy`: `lru`

**Memory estimation:** Each cached module is estimated at 50KB. Total memory usage is tracked in the store.

---

## Folder Structure

```
src/engine/world/
├── index.ts              # Barrel exports (public API)
├── types.ts              # All TypeScript type definitions (545 lines)
├── constants.ts          # Lifecycle transitions, defaults, presets, a11y
├── registry.ts           # WorldRegistry class (Map-based, sorted cache)
├── events.ts             # WorldEventBus class (typed pub/sub, history)
├── validation.ts         # WorldValidator (definition validation)
├── cache.ts              # WorldCache class (LRU/LFU/FIFO eviction)
├── loader.ts             # WorldLoader class (React.lazy, retry, timeout)
├── assets.ts             # WorldAssetManager class (image/font/script/style)
├── memory.ts             # WorldMemoryManager class (thresholds, idle cleanup)
├── lifecycle.ts          # WorldLifecycle state machine (valid transitions)
├── transitions.ts        # WorldTransitionManager class (stage-based)
├── metadata.ts           # SEO metadata, structured data, LRU cache
├── store.ts              # Zustand store (state + actions + selectors)
├── context.ts            # Split actions/state React contexts
├── provider.tsx          # WorldProvider (wires store to context)
├── manager.ts            # WorldManager orchestrator (coordinates all)
├── error-boundary.tsx    # WorldErrorBoundary (isolates world errors)
└── hooks.ts              # Public React hooks API
```

---

## State Flow

```
┌─────────────────────────────────────────────────────────┐
│                    WorldManager                          │
│  register → preload → load → mount → activate           │
│  deactivate → suspend → resume → unload → destroy       │
├─────────────────────────────────────────────────────────┤
│                    Zustand Store                          │
│  currentWorldId · previousWorldId · loadingWorldId       │
│  worldInstances (Map) · registeredWorlds (Map)           │
│  readyWorlds (Set) · cachedWorlds (Set)                  │
│  transitioning · transitionType                          │
├─────────────────────────────────────────────────────────┤
│                    React Context                          │
│  WorldActionsContext (load, activate, transition, etc.)  │
│  WorldStateContext (currentWorldId, instances, phase)    │
└─────────────────────────────────────────────────────────┘
```

---

## Hooks API

| Hook                        | Returns                                              | Description                                                |
| --------------------------- | ---------------------------------------------------- | ---------------------------------------------------------- |
| `useWorld(worldId?)`        | `UseWorldReturn`                                     | Get world definition, instance state, loading/error status |
| `useCurrentWorld()`         | `UseWorldReturn`                                     | Shorthand for the active world                             |
| `useWorldLoader(worldId)`   | `UseWorldLoaderReturn`                               | Load, preload, unload a specific world                     |
| `useWorldTransition()`      | `UseWorldTransitionReturn`                           | Transition between worlds with progress tracking           |
| `useWorldEvents()`          | `{ subscribe, on }`                                  | Subscribe to world lifecycle events                        |
| `useWorldPhase(worldId)`    | `WorldLifecyclePhase`                                | Get current lifecycle phase of a world                     |
| `useIsWorldReady(worldId)`  | `boolean`                                            | Check if a world is ready                                  |
| `useIsWorldCached(worldId)` | `boolean`                                            | Check if a world module is cached                          |
| `useWorldSwitcher()`        | `{ currentWorldId, switchToWorld, isTransitioning }` | Open/close world switcher                                  |
| `useWorldActions()`         | `WorldEngineActions`                                 | Access raw store actions                                   |
| `useWorldState()`           | `WorldEngineState`                                   | Access raw store state                                     |

---

## Performance

- **Lazy loading:** World modules are loaded via `React.lazy` — code-split per world.
- **LRU cache:** Most recently used modules stay in memory; old modules are evicted.
- **Memory thresholds:** Warning at 50MB, critical at 100MB — auto-cleanup of idle worlds.
- **Abort support:** Asset loading can be cancelled via `AbortController`.
- **Concurrent preloading:** Multiple worlds can preload in parallel with configurable concurrency.
- **Sorted cache:** `WorldRegistry.getAll()` caches sorted results — sort only on mutation.

---

## Extension Guide

### Adding a new world

1. Create `src/worlds/new-world/` with config, components, hooks, types
2. Add `WorldManifest` to `src/types/world.ts`
3. Register with `WorldManager.register(definition, loader, assets)`
4. The engine handles the rest — lifecycle, caching, memory, transitions

### Custom transition

1. Define a `TransitionPreset` with stages and duration
2. Pass to `WorldTransitionManager.transition()` as the `transitionType` parameter
3. The manager orchestrates the multi-stage flow with abort support

### Event integration

1. Subscribe via `WorldEventBus.on(eventType, callback)`
2. Use for debugging, analytics, or triggering side effects
3. Events are buffered — safe to subscribe after events fire

---

## Integration Points

- **Theme Engine:** Each world declares a `themeId` — the engine applies it via `ThemeEngine.setTheme()`
- **Layout Engine:** Each world declares a `layoutType` — the engine renders via `LayoutEngine`
- **Animation Engine:** Transition animations use GSAP presets from the Animation Engine
- **Portal System:** Portal activation triggers `WorldManager.activate()` for the target world
- **Navigation Engine:** World routes are registered with React Router — the engine manages lifecycle
- **Experience Engine:** World metadata feeds into the Experience Engine for sequencing
