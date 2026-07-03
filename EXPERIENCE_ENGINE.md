# Experience Engine

Orchestrates all user interactions — pointer, keyboard, gestures, hover, focus, and scene transitions.

## Architecture

```
User Interaction
       │
       ▼
┌─────────────────────────────────────────────────┐
│              InteractionManager                  │
│         (orchestrates all managers)              │
└─────────┬───────────┬───────────┬───────────────┘
          │           │           │
    ┌─────▼─────┐ ┌───▼───┐ ┌────▼────┐
    │  Input    │ │Pointer│ │ Gesture │
    │  Manager  │ │Manager│ │ Manager │
    └───────────┘ └───┬───┘ └─────────┘
                      │
              ┌───────┼───────┐
              │       │       │
         ┌────▼──┐ ┌──▼──┐ ┌──▼────┐
         │ Hover │ │Focus│ │Scene  │
         │Manager│ │Mgr  │ │Manager│
         └───────┘ └─────┘ └───────┘
              │       │       │
              ▼       ▼       ▼
    ┌─────────────────────────────────┐
    │     Zustand Store + Event Bus   │
    └─────────────┬───────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │   React Context (split actions/ │
    │   state) → Component rerenders  │
    └─────────────────────────────────┘
```

### Data Flow Principle

High-frequency data (`pointerPosition`, `pointerVelocity`) lives in Zustand store only — never in React context. Components use selectors to subscribe to only what they need. This prevents rerender cascades on every pointer move.

```
PointerManager → Zustand Store → useExperienceStore(selector) → Component
                                    (no context rerender)
```

Low-frequency state (`interactionState`, `cursorState`, `activeSceneId`) lives in React context for convenience.

## Folder Structure

```
src/engine/experience/
├── types.ts                # All type definitions (500+ lines)
├── constants.ts            # Default values, thresholds, selectors
├── store.ts                # Zustand store (state + actions)
├── context.ts              # React contexts (actions, state)
├── provider.tsx            # ExperienceProvider wraps app
│
├── input-manager.ts        # Keyboard + wheel events only
├── pointer-manager.ts      # Mouse, touch, pen events (single source)
├── gesture-manager.ts      # Gesture recognition (tap, swipe, pinch, etc.)
├── hover-manager.ts        # Hover tracking with enter/leave callbacks
├── focus-manager.ts        # Focus management and trap
├── scene-manager.ts        # Scene lifecycle (enter/exit/activate/deactivate)
│
├── interaction-manager.ts  # Orchestrator — creates and coordinates all managers
├── lifecycle-manager.ts    # Engine phase management (init → running → destroyed)
├── state-sync.ts           # Synchronizes DOM events to Zustand store
│
├── events.ts               # Typed event bus
├── registry.ts             # Scene and config registry
├── hooks.ts                # 30+ public hooks
└── index.ts                # Barrel export
```

## Interaction Lifecycle

### Engine Lifecycle

```
Provider mounts
    │
    ▼
InteractionManager.init()
    │
    ├── LifecycleManager.init()          → phase: "initializing"
    ├── StateSynchronization.init()      → syncs visibility, motion, resize
    ├── InputManager.init()              → keyboard + wheel listeners
    ├── PointerManager.init()            → pointer event listeners
    ├── GestureManager.init()            → gesture recognition ready
    ├── FocusManager.init()              → focus management ready
    ├── HoverManager.init()              → hover tracking ready
    ├── SceneManager.init()              → scene lifecycle ready
    │
    ├── Store: isInitialized = true
    ├── Store: lifecyclePhase = "running"
    └── Emit: "lifecycle:ready"
            │
            ▼
        Engine running
            │
            ▼
Provider unmounts
    │
    ▼
InteractionManager.destroy()
    │
    ├── SceneManager.destroy()
    ├── HoverManager.destroy()
    ├── FocusManager.destroy()
    ├── GestureManager.destroy()
    ├── PointerManager.destroy()
    ├── InputManager.destroy()
    ├── StateSynchronization.destroy()
    ├── LifecycleManager.destroy()       → phase: "destroying" → "destroyed"
    ├── experienceEvents.removeAllListeners()
    └── Store: isInitialized = false
```

### Lifecycle Phases

| Phase         | Description                              |
|---------------|------------------------------------------|
| `idle`        | Initial state                            |
| `initializing`| Managers being created                   |
| `ready`       | All managers initialized                 |
| `running`     | Engine actively processing interactions  |
| `pausing`     | Engine pausing (e.g., tab hidden)        |
| `paused`      | Engine paused                            |
| `resuming`    | Engine resuming from pause               |
| `destroying`  | Engine being torn down                   |
| `destroyed`   | Engine fully destroyed                   |

## Pointer Lifecycle

The PointerManager is the single source of truth for all pointer events (mouse, touch, pen).

### Event Flow

```
DOM PointerEvent
    │
    ▼
PointerManager.attachPointerListeners()
    │
    ├── pointermove → getPositionFromEvent()
    │                  ├── Update store (position, velocity)
    │                  ├── Emit "input:pointer-move"
    │                  ├── Check magnetic targets
    │                  └── Update drag state (if dragging)
    │
    ├── pointerdown → getButton()
    │                  ├── Emit "input:pointer-down"
    │                  ├── Set interactionState: "pressed"
    │                  └── Start drag tracking (after threshold)
    │
    ├── pointerup   → Emit "input:pointer-up"
    │                  ├── End drag (if dragging)
    │                  ├── Emit gesture recognition results
    │                  └── Reset interactionState
    │
    └── pointerleave → Reset position/velocity
                       └── Emit "input:pointer-leave"
```

### Velocity Calculation

Velocity is calculated from a sliding window of recent positions:

```
positionHistory: [{x, y, time}, ...]  (max: velocitySampleSize)
    │
    ▼
vx = (last.x - first.x) / dt
vy = (last.y - first.y) / dt
magnitude = sqrt(vx² + vy²)
angle = atan2(vy, vx)
```

### Magnetic Targets

Magnetic targets pull the pointer when close enough:

```
1. Register target with element, radius, strength
2. Cache bounding rect (refreshed every 200ms)
3. On each pointer move:
   ├── For each target:
   │   ├── Read cachedRect (no DOM read)
   │   ├── Calculate distance to center
   │   └── If distance < radius → magnetize
   └── Closest target wins
4. On magnetize: emit "pointer:magnetize"
5. On release: emit "pointer:release"
```

### Keyboard Gesture Equivalents

| Key          | Gesture       | Source       |
|--------------|---------------|--------------|
| Enter/Space  | `tap`         | keyboard     |
| Arrow Up     | `swipe-up`    | keyboard     |
| Arrow Down   | `swipe-down`  | keyboard     |
| Arrow Left   | `swipe-left`  | keyboard     |
| Arrow Right  | `swipe-right` | keyboard     |
| `+` / `=`    | `zoom` (1.1)  | keyboard     |
| `-`          | `zoom` (0.9)  | keyboard     |
| Escape       | `cancel`      | keyboard     |

Keyboard gestures are ignored when focus is on `INPUT`, `TEXTAREA`, or `contentEditable` elements.

## Gesture Lifecycle

The GestureManager recognizes gestures from pointer data — no direct DOM listeners.

### Recognition Flow

```
PointerManager events (via event bus)
    │
    ▼
GestureManager consumes events
    │
    ├── pointerdown → record start position + time
    │                  └── Start long-press timer
    │
    ├── pointermove → check thresholds
    │                  ├── Cancel long-press (if moved > tapThreshold)
    │                  ├── Update pinch/rotate state (if 2 fingers)
    │                  └── Update swipe state
    │
    └── pointerup   → evaluate gesture
                       ├── Tap: distance < tapThreshold && elapsed < tapTimeout
                       ├── Double-tap: tap within doubleTapTimeout of last tap
                       ├── Long-press: elapsed > longPressDelay
                       ├── Swipe: distance > swipeThreshold && elapsed < swipeTimeout
                       ├── Pinch: 2-finger distance change > pinchThreshold
                       ├── Zoom: 2-finger scale > pinchThreshold
                       └── Rotate: 2-finger angle change > rotateThreshold
                               │
                               ▼
                       Emit "gesture:{type}" event
```

### Gesture Types

| Type          | Trigger                           | Event Data                  |
|---------------|-----------------------------------|-----------------------------|
| `tap`         | Quick touch + release             | position                    |
| `double-tap`  | Two quick taps                    | position                    |
| `long-press`  | Hold > 500ms                      | position, duration          |
| `swipe`       | Flick > 50px                      | direction, velocity         |
| `pinch`       | Two fingers move apart            | scale (< 1)                 |
| `zoom`        | Two fingers move together         | scale (> 1)                 |
| `rotate`      | Two fingers rotate                | rotation (degrees)          |

### Gesture Configuration

```typescript
{
  tapThreshold: 10,        // px — max distance for tap
  tapTimeout: 300,         // ms — max duration for tap
  longPressDelay: 500,     // ms — hold duration for long-press
  swipeThreshold: 50,      // px — min distance for swipe
  swipeTimeout: 300,       // ms — max duration for swipe
  pinchThreshold: 0.1,     // scale — min change for pinch
  rotateThreshold: 15,     // degrees — min rotation
}
```

## Event Flow

### Event Naming Convention

| Prefix        | Source              | Example                    |
|---------------|---------------------|----------------------------|
| `input:*`     | Raw DOM events      | `input:pointer-move`       |
| `pointer:*`   | PointerManager      | `pointer:drag-start`       |
| `gesture:*`   | GestureManager      | `gesture:tap`              |
| `scene:*`     | SceneManager        | `scene:enter`              |
| `lifecycle:*` | LifecycleManager    | `lifecycle:phase-change`   |
| `interaction:*`| FocusManager       | `interaction:focus`        |
| `a11y:*`      | Accessibility       | `a11y:announce`            |
| `system:*`    | StateSynchronization| `system:resize`            |

### Full Event List

```typescript
type ExperienceEventType =
  // Input (raw DOM)
  | "input:pointer-down"  | "input:pointer-up"
  | "input:pointer-move"  | "input:pointer-leave"
  | "input:wheel"
  | "input:key-down"      | "input:key-up"
  | "input:focus"         | "input:blur"
  // Pointer (PointerManager)
  | "pointer:hover-enter" | "pointer:hover-leave"
  | "pointer:drag-start"  | "pointer:drag-move"  | "pointer:drag-end"
  | "pointer:magnetize"   | "pointer:release"
  // Gesture (GestureManager)
  | "gesture:tap"         | "gesture:double-tap"
  | "gesture:long-press"  | "gesture:swipe"
  | "gesture:pinch"       | "gesture:zoom"       | "gesture:rotate"
  // Scene (SceneManager)
  | "scene:enter"         | "scene:exit"
  | "scene:activate"      | "scene:deactivate"
  // Lifecycle (LifecycleManager)
  | "lifecycle:phase-change"  | "lifecycle:ready"
  // Interaction (FocusManager)
  | "interaction:focus"   | "interaction:blur"
  // Accessibility
  | "a11y:announce"
  // System (StateSynchronization)
  | "system:resize"       | "system:visibility-change"
  | "system:motion-preference-change";
```

### Subscribing to Events

```tsx
import { useExperienceEvents } from "@/engine/experience";

function MyComponent() {
  const events = useExperienceEvents();

  useEffect(() => {
    const unsub = events.on("gesture:tap", (e) => {
      console.log("Tapped at", e.position);
    });
    return unsub;
  }, [events]);
}
```

## Priority-Based State Machine

Interaction states resolve by priority to prevent conflicts:

| Priority | State           | Set By                     |
|----------|-----------------|----------------------------|
| 0        | `idle`          | Default / after transition  |
| 1        | `loading`       | SceneManager (on enter)    |
| 2        | `transitioning` | SceneManager (during)      |
| 3        | `scrolling`     | PointerManager (wheel)     |
| 4        | `hover`         | PointerManager (pointerover)|
| 5        | `focused`       | FocusManager               |
| 6        | `pressed`       | PointerManager (pointerdown)|
| 7        | `dragging`      | PointerManager (after threshold)|

Higher priority wins. Dragging overrides hover. Pressed overrides hover. Idle only applies when nothing else is happening.

```typescript
// In store.ts
const STATE_PRIORITY: Record<InteractionState, number> = {
  idle: 0,
  loading: 1,
  transitioning: 2,
  scrolling: 3,
  hover: 4,
  focused: 5,
  pressed: 6,
  dragging: 7,
};

function setInteractionState(state: InteractionState) {
  const current = get().interactionState;
  const currentPriority = STATE_PRIORITY[current] ?? 0;
  const newPriority = STATE_PRIORITY[state] ?? 0;
  if (newPriority >= currentPriority) {
    set({ interactionState: state });
  }
}
```

## Performance Guide

### High-Frequency Data Avoids React Context

`pointerPosition` and `pointerVelocity` update on every pointer move (~60fps). Putting them in React context would rerender every consumer on every frame.

```tsx
// ✅ Correct — Zustand selector, only rerenders when position changes
const pos = useExperienceStore(selectPointerPosition);

// ❌ Wrong — would rerender every context consumer 60fps
const { pointerPosition } = useExperienceStateContext();
```

### Magnetic Target Rect Caching

Bounding rects are cached on registration and refreshed every 200ms via `setInterval`. Pointer move handlers read from cache — zero DOM reads per frame.

```typescript
// Registration: cache rect
addMagneticTarget(target) {
  target.cachedRect = cacheRect(target.element.getBoundingClientRect());
}

// Every 200ms: refresh all rects
startMagneticRectRefresh() {
  setInterval(() => {
    for (const [id, target] of this.magneticTargets) {
      target.cachedRect = cacheRect(target.element.getBoundingClientRect());
    }
  }, PERFORMANCE.magneticRectRefreshInterval);
}

// Pointer move: read from cache (no DOM read)
checkMagneticTargets(position) {
  for (const [, target] of this.magneticTargets) {
    const rect = target.cachedRect; // ← cached, not live
    const dist = Math.sqrt((position.x - rect.centerX) ** 2 + ...);
  }
}
```

### Memoized Context Values

Actions context never changes (stable function references). State context only changes when low-frequency state changes.

```tsx
// Provider
const actionsValue = useMemo(() => ({
  setInteractionState,
  setCursorState,
  setActiveScene,
  on: (event, cb) => experienceEvents.on(event, cb),
  emit: (event, data) => experienceEvents.emit(event, data),
}), []); // Never changes

const stateValue = useMemo(() => ({
  interactionState,
  cursorState,
  isInitialized,
  // ... only low-frequency fields
}), [interactionState, cursorState, isInitialized, ...]);
```

### Passive Event Listeners

All pointer and wheel listeners use `{ passive: true }` to avoid blocking scroll performance.

### Throttled Pointer Move

Pointer move events are throttled to 16ms (60fps) via the store's update cycle.

### Performance Constants

```typescript
{
  maxListeners: 50,                    // Max event listeners per type
  pointerMoveThrottle: 16,            // ms between pointer move updates
  scrollThrottle: 16,                 // ms between scroll updates
  resizeDebounce: 150,                // ms debounce for resize
  maxDragDistance: 1000,              // px before drag cancelled
  magneticRectRefreshInterval: 200,   // ms between rect cache refreshes
}
```

## Accessibility Guide

### Keyboard Navigation

All gestures have keyboard equivalents:

| Gesture     | Key           |
|-------------|---------------|
| Tap         | Enter / Space |
| Swipe Up    | Arrow Up      |
| Swipe Down  | Arrow Down    |
| Swipe Left  | Arrow Left    |
| Swipe Right | Arrow Right   |
| Zoom In     | `+` / `=`     |
| Zoom Out    | `-`           |
| Cancel      | Escape        |

### Focus Management

**Focus trap** for modals and dialogs:

```tsx
function Modal({ children }) {
  const trapRef = useFocusTrap(true);

  return (
    <div ref={trapRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

Focus trap handles empty containers by making the container itself focusable (`tabindex="-1"`).

**Focus save/restore** across scene transitions:

```
1. Save document.activeElement before transition
2. Run transition
3. Restore focus to saved element (if still connected)
```

### Reduced Motion

SceneManager respects `prefers-reduced-motion`. When active:

- Transition durations set to 0ms
- Skip animations honored

```tsx
const reducedMotion = useExperienceStore(selectReducedMotion);
```

### Screen Reader Announcements

```tsx
import { useAnnounce } from "@/engine/experience";

function MyComponent() {
  const announce = useAnnounce();

  useEffect(() => {
    announce("Content loaded");
  }, [announce]);
}
```

Creates an `aria-live` region and announces to screen readers.

### Focusable Selectors

Comprehensive selectors for focus management:

```
a[href], button:not([disabled]), input:not([disabled]),
select:not([disabled]), textarea:not([disabled]),
[tabindex]:not([tabindex='-1']),
[role="button"], [role="link"], [role="tab"],
[role="menuitem"], [role="option"], [role="switch"],
[role="checkbox"], [role="radio"],
[contenteditable="true"]
```

## Extension Guide

### Adding a New Scene

```tsx
// src/scenes/my-scene/index.tsx
import { ExperienceProvider } from "@/engine/experience";

export function MyScene() {
  return (
    <ExperienceProvider sceneId="my-scene">
      {/* Scene content */}
    </ExperienceProvider>
  );
}
```

Register the scene in the registry:

```typescript
ExperienceRegistry.registerScene({
  id: "my-scene",
  label: "My Scene",
  onEnter: () => console.log("Entering"),
  onExit: () => console.log("Exiting"),
  entryTransition: "fade",
  exitTransition: "fade",
});
```

### Adding a Custom Gesture

Extend the gesture recognition system:

```typescript
// 1. Add gesture type to GestureType union
type GestureType = "tap" | "double-tap" | ... | "custom-gesture";

// 2. Add event type to ExperienceEventType
type ExperienceEventType = ... | "gesture:custom-gesture";

// 3. Add to KEYBOARD_GESTURES in constants.ts
export const KEYBOARD_GESTURES = {
  ...,
  customGesture: ["KeyX"],  // X key triggers custom gesture
};

// 4. Handle in GestureManager
private checkCustomGesture(state: GestureState) {
  if (/* custom condition */) {
    this.emitGesture("custom-gesture", state.startPosition);
  }
}
```

### Adding a New Manager

```typescript
// 1. Create manager
class MyManagerImpl {
  private cleanupFns: (() => void)[] = [];

  init(config?: Partial<MyManagerConfig>): void {
    // Attach listeners
    this.cleanupFns.push(() => { /* cleanup */ });
  }

  destroy(): void {
    for (const cleanup of this.cleanupFns) cleanup();
    this.cleanupFns = [];
  }

  updateConfig(config: Partial<MyManagerConfig>): void {
    // Update config
  }
}

export const MyManager = new MyManagerImpl();
export function createMyManager() { return new MyManagerImpl(); }

// 2. Wire into InteractionManager
class InteractionManagerImpl {
  init(config) {
    // ...existing managers...
    MyManager.init(config?.my);
  }

  destroy() {
    MyManager.destroy();
    // ...existing managers...
  }
}

// 3. Export from index.ts
export { MyManager, createMyManager } from "./my-manager";
```

### Adding System Synchronization

Extend StateSynchronization to sync new DOM state:

```typescript
private syncMyState(): void {
  const observer = new MutationObserver((mutations) => {
    // Sync state to store
    useExperienceStore.getState().setMyState(computed);
    experienceEvents.emit("system:my-change", { ... });
  });

  observer.observe(document.body, { attributes: true });
  this.cleanupFns.push(() => observer.disconnect());
}
```

### Custom Hook Pattern

```typescript
export function useMyFeature(options?: MyOptions) {
  const events = useExperienceEvents();
  const store = useExperienceStore;

  useEffect(() => {
    const unsub = events.on("gesture:tap", handler);
    return unsub;
  }, [events]);

  return {
    // Expose computed state
  };
}
```

## Hooks Reference

| Hook                        | Purpose                              |
|-----------------------------|--------------------------------------|
| `useExperience`             | Full context (state + actions)       |
| `useExperienceActionsOnly`  | Actions only (stable)                |
| `useExperienceStateOnly`    | State only                           |
| `useExperienceStore`        | Zustand store with selector          |
| `useExperienceEvents`       | Typed event bus                      |
| `useInteractionState`       | Current interaction state            |
| `usePointerPosition`        | Pointer position (store selector)    |
| `usePointerVelocity`        | Pointer velocity (store selector)    |
| `useCursorState`            | Current cursor state                 |
| `useReducedMotion`          | Reduced motion preference            |
| `useLifecyclePhase`         | Current lifecycle phase              |
| `useActiveSceneId`          | Current active scene ID              |
| `usePageVisible`            | Page visibility                      |
| `useExperienceInitialized`  | Engine initialization state          |
| `useSetInteractionState`    | Setter for interaction state         |
| `useSetCursorState`         | Setter for cursor state              |
| `useSetActiveScene`         | Setter for active scene              |
| `useExperienceEvent`        | Subscribe to single event            |
| `usePointerTrack`           | Track pointer on element             |
| `useGesture`                | Register single gesture handler      |
| `useGestures`               | Register multiple gesture handlers   |
| `useFocusTrap`              | Focus trap management                |
| `useFocusMainContent`       | Focus main content area              |
| `useHoverTarget`            | Track hover on element               |
| `useActiveScene`            | Get active scene state               |
| `useIsSceneActive`          | Check if scene is active             |
| `useOnExperienceReady`      | Run callback on engine ready         |
| `useOnExperienceDestroy`    | Run callback on engine destroy       |
| `useResize`                 | Track window resize                  |
| `useVisibilityChange`       | Track page visibility                |
| `useMotionPreferenceChange` | Track motion preference changes      |
| `useAnnounce`               | Screen reader announcements          |
