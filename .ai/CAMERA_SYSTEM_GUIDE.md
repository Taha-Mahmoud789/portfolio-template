# Camera System Guide

Complete reference for the Cinematic Camera System. Every world in the Frontend Multiverse uses this system — never write world-specific camera logic.

---

## Table of Contents

1. [Architecture](#architecture)
2. [Lifecycle](#lifecycle)
3. [State Machine](#state-machine)
4. [Camera Presets](#camera-presets)
5. [Motion Guide](#motion-guide)
6. [Extension Guide](#extension-guide)
7. [Best Practices](#best-practices)

---

## Architecture

### Module Dependency Graph

```
CameraManager (orchestrator — owns the update loop)
│
├── CameraStateMachine    (state tracking, validated transitions)
├── CameraController      (spring physics, velocity, momentum)
├── CameraRig             (transform hierarchy, PerspectiveCamera)
├── CameraEffects         (additive offsets: shake, drift, bob, sway)
├── CameraTimeline        (keyframe sequences, easing, loop)
└── CameraTransitionManager  (cross-fade, zoom, orbit, dolly, portal)
```

### Dependency Rule

Modules never communicate directly. All coordination flows through `CameraManager`:

```
CameraController ──→ CameraManager ──→ CameraRig
CameraTimeline   ──→ CameraManager ──→ CameraEffects
CameraStateMachine ─→ CameraManager ──→ CameraTransitionManager
```

This prevents circular dependencies and keeps every module independently testable.

### Folder Structure

```
src/engine/camera/
├── index.ts                    # Public API barrel
├── types.ts                    # All type definitions
├── config.ts                   # Defaults, presets, merge utilities
├── math.ts                     # Spring, easing, lerp, vector math
├── vector-pool.ts              # Zero-allocation Vector3/Quaternion pooling
├── camera-manager.ts           # Top-level orchestrator
├── camera-rig.ts               # Transform hierarchy + PerspectiveCamera
├── camera-controller.ts        # Spring physics + velocity
├── camera-state-machine.ts     # State tracking with transition validation
├── camera-timeline.ts          # Keyframe sequences
├── camera-transition-manager.ts # Cross-mode transitions
├── camera-effects.ts           # Additive offset effects
├── hooks/
│   ├── index.ts
│   ├── use-camera.ts           # Full camera API
│   ├── use-camera-state.ts     # Subscription-based reactive state
│   ├── use-camera-mode.ts      # Mode tracking
│   ├── use-camera-focus.ts     # Focus + follow targets
│   ├── use-camera-timeline.ts  # Timeline playback
│   ├── use-camera-effects.ts   # Effects control
│   └── use-reduced-motion.ts   # Accessibility
└── providers/
    └── camera-provider.tsx     # React context (subscribe/callback)
```

### Data Flow

Every frame (`requestAnimationFrame`), the update loop executes in this exact order:

```
1. TransitionManager.update(delta)   → interpolated transition position
2. FollowTarget update               → sets controller target from tracked Object3D
3. Timeline.update(delta)            → interpolated keyframe position + FOV
4. Controller.update(delta)          → spring physics resolves current position
5. Effects.update(delta)             → computes additive offsets
6. Rig.setBasePosition()             → applies controller output
7. Effects offset applied            → position += combinedOffset
8. Rig.update(delta)                 → lookAt, projection matrix, constraints
9. State machine auto-transition     → moving→idle when settled
10. State snapshot rebuilt            → exposed to React via getState()
```

### Key Design Decisions

| Decision                                 | Rationale                                                          |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Spring physics as foundation             | Configurable stiffness/damping/mass covers all movement styles     |
| Sensitivity scales stiffness² + damping  | Preserves damping ratio (no oscillation character change)          |
| Effects are additive offsets             | Composable, weight-blended, zero coupling to base movement         |
| Timeline keyframe time is normalized 0-1 | Sequence duration is independent of keyframe spacing               |
| State machine validates transitions      | Invalid transitions throw errors to catch bugs at development time |
| Vector pool with bounded max size        | Prevents unbounded memory growth under heavy allocation            |

---

## Lifecycle

### State Progression

```
uninitialized → initialized → running → disposed
                                  │
                            requestAnimationFrame loop
                            ├── _tick()
                            │   ├── delta = (now - lastFrameTime) / 1000
                            │   ├── delta = min(delta, 0.1)    // spiral-of-death cap
                            │   └── update(delta)
                            │       ├── transition.update()
                            │       ├── followTarget.update()
                            │       ├── timeline.update()
                            │       ├── controller.update()
                            │       ├── effects.update()
                            │       ├── rig.update()
                            │       └── stateMachine.autoTransition()
                            └── (next frame)
```

### API

```typescript
const camera = new CameraManager(config);

camera.initialize(); // Sets up rig, controller, effects, timeline
camera.start(); // Starts rAF loop (seeds lastFrameTime)
camera.stop(); // Cancels rAF loop (can restart)
camera.dispose(); // Stops loop, disposes all subsystems, clears refs
```

### First-Frame Delta

`start()` seeds `lastFrameTime = performance.now()` before the first tick, so the initial delta is approximately 0 (not the time since construction). This prevents a massive first-frame jump.

### Delta Clamping

Delta is clamped to `0.1s` (100ms) in both `CameraManager` and `CameraController`. If a tab is backgrounded and `requestAnimationFrame` pauses, the next frame produces a capped delta rather than an unbounded spike.

---

## State Machine

### States

| State           | Description                         | Typical Trigger                                |
| --------------- | ----------------------------------- | ---------------------------------------------- |
| `idle`          | Camera at rest, subtle drift active | Spring settled, timeline finished              |
| `moving`        | Spring physics driving position     | `setTarget()`, follow target, timeline playing |
| `transitioning` | Mode change in progress             | `setMode()` with transition                    |
| `focused`       | Locked on a specific target         | `focus()` called                               |
| `locked`        | Cannot be moved externally          | Portal, cutscene, debug                        |
| `disabled`      | Camera system inactive              | `dispose()` called                             |

### Transition Rules

```
idle         → moving, transitioning, focused, locked, disabled
moving       → idle, transitioning, focused, locked, disabled
transitioning → idle, moving, focused, locked, disabled
focused      → idle, moving, transitioning, locked, disabled
locked       → idle, transitioning, disabled
disabled     → idle
```

Invalid transitions throw:

```
Error: Invalid camera state transition: locked → focused
Valid transitions from locked: idle, transitioning, disabled
```

### Auto-Transitions

The manager automatically transitions `moving → idle` when the controller's spring has settled (`isSettled()` returns `true`). This check runs at the end of every update cycle.

### History

The state machine maintains a history of the last 10 transitions, accessible via `getStateHistory()`. Useful for debugging camera behavior.

---

## Camera Presets

Presets combine mode, position, FOV, movement, and effects into named configurations.

### Built-in Presets

| Preset      | Mode      | Position      | FOV | Movement                      | Effects                            |
| ----------- | --------- | ------------- | --- | ----------------------------- | ---------------------------------- |
| `idle`      | idle      | `[0, 2, 8]`   | 60  | LIGHT (stiff: 200, damp: 18)  | drift (amp: 0.3)                   |
| `floating`  | floating  | `[0, 2, 8]`   | 60  | SPRING (stiff: 180, damp: 12) | drift (amp: 0.8) + bob (amp: 0.15) |
| `orbit`     | orbit     | `[0, 2, 8]`   | 55  | DAMPED (stiff: 80, damp: 20)  | drift (amp: 0.2)                   |
| `focus`     | focus     | `[0, 1, 3]`   | 45  | SPRING                        | none                               |
| `cinematic` | cinematic | `[5, 3, 10]`  | 35  | HEAVY (stiff: 60, damp: 8)    | none                               |
| `follow`    | follow    | `[0, 3, 8]`   | 50  | DAMPED                        | bob (amp: 0.1, freq: 2)            |
| `inspect`   | inspect   | `[2, 1, 3]`   | 40  | SPRING                        | none                               |
| `portal`    | portal    | `[0, 0, 15]`  | 75  | HEAVY                         | shake (intensity: 0.8)             |
| `vr`        | vr        | `[0, 1.7, 0]` | 75  | LIGHT                         | none                               |

### Applying a Preset

```typescript
import { CAMERA_PRESETS, mergePresetWithDefaults } from "@/engine/camera";

// Merge preset with defaults (fills missing fields)
const config = mergePresetWithDefaults(CAMERA_PRESETS.orbit);

// Apply to camera
const camera = new CameraManager(config);
```

### Creating Custom Presets

```typescript
import type { CameraPresetConfig } from "@/engine/camera";

const myPreset: CameraPresetConfig = {
  mode: "floating",
  position: [0, 5, 12],
  lookAt: [0, 0, 0],
  fov: 50,
  movement: {
    stiffness: 150,
    damping: 16,
    mass: 1,
    maxSpeed: 60,
    acceleration: 12,
    deceleration: 14,
  },
  constraints: { minDistance: 5, maxDistance: 20 },
  effects: {
    drift: { enabled: true, amplitude: 0.6, frequency: 0.07, direction: [1, 0.3, 0.5] },
  },
};
```

---

## Motion Guide

### Movement Configs

| Preset    | Stiffness | Damping | Mass | Character                |
| --------- | --------- | ------- | ---- | ------------------------ |
| `DEFAULT` | 120       | 14      | 1    | Balanced, versatile      |
| `SPRING`  | 180       | 12      | 1    | Snappy, slight overshoot |
| `DAMPED`  | 80        | 20      | 1    | Smooth, no overshoot     |
| `HEAVY`   | 60        | 8       | 3    | Slow, massive feel       |
| `LIGHT`   | 200       | 18      | 0.5  | Fast, responsive         |

### Spring Physics

All movement is spring-based. The formula:

```
acceleration = (-stiffness × displacement - damping × velocity) / mass
velocity += acceleration × dt
position += velocity × dt
```

**Damping ratio** (`zeta`) determines oscillation character:

```
zeta = damping / (2 × sqrt(stiffness × mass))
```

| zeta  | Character                                               |
| ----- | ------------------------------------------------------- |
| < 1.0 | Underdamped (overshoots, oscillates)                    |
| = 1.0 | Critically damped (fastest convergence, no oscillation) |
| > 1.0 | Overdamped (sluggish, no overshoot)                     |

Default config (`stiffness: 120, damping: 14, mass: 1`) gives `zeta ≈ 0.64` — slightly underdamped for a natural feel.

### Sensitivity Scaling

Sensitivity scales `stiffness²` and `damping` proportionally:

```
effectiveStiffness = stiffness × sensitivity²
effectiveDamping = damping × sensitivity
```

This preserves the damping ratio (oscillation character stays the same) while scaling speed. A sensitivity of `0.5` halves the speed but keeps the same spring personality.

### Smooth Damp

Unity-style `SmoothDamp` for cinematic moves:

```typescript
import { smoothDamp } from "@/engine/camera";

const velocity = { value: 0 };
const result = smoothDamp(current, target, velocity, smoothTime, maxSpeed, dt);
```

Parameters:

- `smoothTime` — approximate time to reach target (seconds)
- `maxSpeed` — maximum velocity clamped
- `dt` — frame delta

### Vector Pool

Pre-allocated `Vector3` / `Quaternion` instances to avoid per-frame GC pressure:

```typescript
import { vector3Pool, quaternionPool } from "@/engine/camera";

const v = vector3Pool.acquire(); // Pop from pool (or new Vector3)
// ... use v ...
vector3Pool.release(v); // Return to pool (bounded max size)
```

The pool is bounded (default max 128 Vector3, 32 Quaternion). Excess objects are garbage collected.

---

## Extension Guide

### Adding a New Camera Mode

**Step 1:** Add the mode to `CameraMode` in `types.ts`:

```typescript
export type CameraMode =
  | "idle"
  | "floating"
  | // ... existing modes
  | "myNewMode";
```

**Step 2:** Add valid transitions in `VALID_CAMERA_TRANSITIONS`:

```typescript
export const VALID_CAMERA_TRANSITIONS: Record<CameraState, readonly CameraState[]> = {
  idle: ["moving", "transitioning", "focused", "locked", "disabled", "myNewState"],
  // ... other states
};
```

**Step 3:** Add a preset in `config.ts`:

```typescript
export const CAMERA_PRESETS: Record<string, CameraPresetConfig> = {
  // ... existing presets
  myNewMode: {
    mode: "myNewMode",
    position: [0, 2, 8],
    lookAt: [0, 0, 0],
    fov: 60,
    movement: DEFAULT_MOVEMENT,
    constraints: {},
    effects: {},
  },
};
```

**Step 4:** Handle the mode in `CameraController.update()` if it needs special behavior.

### Adding a New Effect

**Step 1:** Add config type in `types.ts`:

```typescript
export interface MyEffectConfig {
  readonly enabled: boolean;
  readonly amplitude: number;
  readonly frequency: number;
}

export interface CameraEffectsConfig {
  readonly shake: ShakeConfig;
  readonly drift: DriftConfig;
  readonly bob: BobConfig;
  readonly sway: SwayConfig;
  readonly myEffect: MyEffectConfig; // add here
}
```

**Step 2:** Add default in `config.ts`:

```typescript
export const DEFAULT_MY_EFFECT: MyEffectConfig = {
  enabled: false,
  amplitude: 0.5,
  frequency: 1.0,
};
```

**Step 3:** Implement in `CameraEffects` class:

```typescript
// In initialize()
this.myEffectState = { offset: new Vector3(), time: 0 };

// In update()
private updateMyEffect(delta: number): void {
  if (!this.config.myEffect.enabled) return;
  this.myEffectState.time += delta * this.config.myEffect.frequency;
  const { amplitude } = this.config.myEffect;
  this.myEffectState.offset.set(
    Math.sin(this.myEffectState.time) * amplitude,
    0,
    0,
  );
}

// In getCombinedOffset()
offset.add(this.myEffectState.offset);
```

**Step 4:** Add weight support and exposure via `CameraManager`.

### Adding a New Transition Type

**Step 1:** Add to `TransitionType` in `types.ts`:

```typescript
export type TransitionType =
  "fade" | "zoom" | "orbit" | "dolly" | "portal" | "custom" | "myTransition";
```

**Step 2:** Implement interpolation in `CameraTransitionManager.update()`:

```typescript
case "myTransition": {
  const t = this.easing(this.progress);
  result.position.lerpVectors(this.from, this.to, t);
  result.lookAt.lerpVectors(this.lookAtFrom, this.lookAtTo, t);
  result.fov = this.fovFrom + (this.fovTo - this.fovFrom) * t;
  break;
}
```

### Adding a New Movement Preset

```typescript
export const MY_MOVEMENT: MovementConfig = {
  stiffness: 160, // Higher = snappier
  damping: 15, // Higher = less oscillation
  mass: 1, // Higher = more sluggish
  maxSpeed: 70, // Velocity cap
  acceleration: 14, // How fast velocity builds
  deceleration: 18, // How fast velocity decays
};
```

---

## Best Practices

### DO

- **Always use the CameraManager as the single entry point.** Never reach into `manager.rig`, `manager.controller`, etc. directly.
- **Use presets for common setups.** `mergePresetWithDefaults()` fills all missing fields from defaults.
- **Use `setTarget()` for intentional movement.** The spring system handles easing automatically.
- **Use `teleportTo()` for hard cuts.** It kills velocity instantly (no spring overshoot).
- **Use `setFollowTarget()` for tracking.** The manager handles offset and lookAt automatically.
- **Use `setReducedMotion(true)` for accessibility.** Disables all effects and reduces movement.
- **Dispose when done.** `camera.dispose()` cancels the rAF loop and releases all resources.
- **Use `useCameraState()` for reactive state.** It subscribes to the provider without polling.
- **Use `useCameraFocus()` for fire-and-forget actions.** It never re-renders on state changes.

### DON'T

- **Don't create camera managers per frame.** Create once, reuse, dispose when done.
- **Don't call `update()` directly.** The manager owns its own rAF loop via `start()`/`stop()`.
- **Don't bypass the state machine.** Invalid transitions throw errors — this is intentional.
- **Don't allocate Vector3 in the update loop.** Use `vector3Pool.acquire()` or pre-allocated scratch vectors.
- **Don't set `position` directly on the camera.** Use `setPosition()` or `setTarget()` to go through the controller.
- **Don't use `setTimeout` / `setInterval` for camera updates.** Use the built-in rAF loop.
- **Don't mutate config objects.** Create new configs via `mergeCameraConfig()` or `mergePresetWithDefaults()`.

### Performance

| Practice                                    | Why                                           |
| ------------------------------------------- | --------------------------------------------- |
| Pre-allocate all Vector3/Quaternion         | Zero GC pressure in the hot path              |
| Use squared distances (`distanceToSquared`) | Avoids `Math.sqrt` per frame                  |
| Delta clamp at 0.1s                         | Prevents physics explosions from tab switches |
| Spring settling detection                   | Stops updating when movement is negligible    |
| Vector pool with bounded max                | Prevents unbounded memory growth              |
| `Object.assign` for config updates          | In-place mutation, no spreading               |

### Memory

| Resource       | Cleanup                                 |
| -------------- | --------------------------------------- |
| rAF loop       | `stop()` calls `cancelAnimationFrame`   |
| Subsystems     | `dispose()` calls `dispose()` on all 6  |
| Follow targets | `dispose()` clears the Map              |
| Timeline       | `dispose()` nulls sequence + onComplete |
| Vector pool    | `releaseAll()` or GC on dispose         |

### Accessibility

```typescript
// Detect system preference
import { useReducedMotion } from "@/engine/camera";

function MyComponent() {
  const { prefersReducedMotion } = useReducedMotion();
  // Automatically syncs with CameraManager
}

// Manual control
camera.setReducedMotion(true); // Disables all effects
camera.setSensitivity(0.5); // Half speed
camera.setEffectWeight("drift", 0.3); // Reduce specific effect
```

### React Integration

```tsx
import { CameraProvider, useCamera, useCameraMode, useCameraEffects } from "@/engine/camera";

// Wrap world in provider
<CameraProvider config={{ fov: 60, sensitivity: 1 }}>
  <MyWorld />
</CameraProvider>;

// Use hooks in components
function MyComponent() {
  const { state, setTarget, setFov } = useCamera();
  const { mode, setMode } = useCameraMode();
  const { triggerShake } = useCameraEffects();

  return (
    <button
      onClick={() => {
        setMode("orbit");
        setTarget([0, 2, 8], [0, 0, 0]);
        triggerShake({ intensity: 0.8 });
      }}
    >
      Enter Orbit
    </button>
  );
}
```

### Hook Selection Guide

| Hook                | Use When                  | Re-Renders On          |
| ------------------- | ------------------------- | ---------------------- |
| `useCamera`         | Need full state + actions | Any state change       |
| `useCameraState`    | Only need reactive state  | Any state change       |
| `useCameraMode`     | Only need mode tracking   | Mode/state changes     |
| `useCameraFocus`    | Fire-and-forget actions   | Never                  |
| `useCameraTimeline` | Timeline playback control | Timeline state changes |
| `useCameraEffects`  | Effects control           | Effects state changes  |
| `useReducedMotion`  | Accessibility check       | Media query changes    |
