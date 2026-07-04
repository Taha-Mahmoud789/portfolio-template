# Cinematic Camera System

Reusable camera engine for the Frontend Multiverse. Every future world uses this system — never write world-specific camera logic.

---

## Architecture

```
CameraManager (orchestrator — coordinates all subsystems)
├── CameraRig (transform hierarchy: camera, target, offsets)
├── CameraStateMachine (state tracking: idle, moving, focused, locked, etc.)
├── CameraController (physics: spring, damping, inertia, velocity)
├── CameraEffects (additive offsets: shake, drift, bob, sway)
├── CameraTimeline (keyframe sequences: play, pause, loop, interrupt)
└── CameraTransitionManager (mode transitions: fade, zoom, orbit, dolly, portal)
```

**Dependency rule:** Camera modules never communicate directly. Everything goes through CameraManager.

**Lifecycle:** Every module exposes `initialize()`, `update(delta)`, `dispose()`.

---

## Folder Structure

```
src/engine/camera/
├── index.ts                    # Barrel exports
├── types.ts                    # All type definitions
├── config.ts                   # Defaults, presets, merge utilities
├── math.ts                     # Spring, lerp, easing, vector math
├── vector-pool.ts              # Zero-allocation Vector3/Quaternion pooling
├── camera-manager.ts           # Top-level orchestrator
├── camera-rig.ts               # Transform hierarchy (camera, target, pivot)
├── camera-controller.ts        # Physics engine (spring, damping, inertia)
├── camera-state-machine.ts     # State tracking with validated transitions
├── camera-timeline.ts          # Keyframe sequences (play, pause, loop)
├── camera-transition-manager.ts # Mode transitions (fade, zoom, portal)
├── camera-effects.ts           # Additive offsets (shake, drift, bob, sway)
├── hooks/
│   ├── index.ts                # Hooks barrel
│   ├── use-camera.ts           # Full camera API
│   ├── use-camera-mode.ts      # Mode tracking
│   ├── use-camera-focus.ts     # Focus and follow targets
│   ├── use-camera-timeline.ts  # Timeline playback
│   ├── use-camera-effects.ts   # Effects control
│   └── use-reduced-motion.ts   # Accessibility
└── providers/
    └── camera-provider.tsx     # React context provider
```

---

## Camera Lifecycle

```
uninitialized → initialized → running → disposed
                                  ↓
                            ticking (requestAnimationFrame)
                            ├── update(delta)
                            │   ├── transition.update()
                            │   ├── followTarget.update()
                            │   ├── timeline.update()
                            │   ├── controller.update()
                            │   ├── effects.update()
                            │   └── rig.update()
                            └── render (delegated to scene renderer)
```

---

## State Machine

| State           | Description                               |
| --------------- | ----------------------------------------- |
| `idle`          | Camera at rest, subtle drift active       |
| `moving`        | Camera transitioning between positions    |
| `transitioning` | Camera changing modes                     |
| `focused`       | Camera locked on a target                 |
| `locked`        | Camera cannot be moved (portal, cutscene) |
| `disabled`      | Camera system inactive                    |

### Valid Transitions

```
idle         → moving, transitioning, focused, locked, disabled
moving       → idle, transitioning, focused, locked, disabled
transitioning → idle, moving, focused, locked, disabled
focused      → idle, moving, transitioning, locked, disabled
locked       → idle, transitioning, disabled
disabled     → idle
```

Invalid transitions throw errors to catch bugs early.

---

## Camera Modes

| Mode         | Behavior                                       |
| ------------ | ---------------------------------------------- |
| `idle`       | Subtle drift, no intentional movement          |
| `floating`   | Weightless drift, orbital motion               |
| `orbit`      | Circular orbit around target with constraints  |
| `focus`      | Zoom to specific point with smooth easing      |
| `cinematic`  | Timeline-driven pre-defined path               |
| `follow`     | Track a target object with offset and damping  |
| `inspect`    | Orbit + zoom for close examination             |
| `portal`     | Wormhole transition with compression/expansion |
| `transition` | Moving between modes                           |
| `vr`         | Future VR support (head tracking, stereo)      |

---

## Movement System

The CameraController supports multiple movement strategies, all built on spring physics:

### Spring Motion

```typescript
// Critically damped spring — fastest convergence without oscillation
springStepVec3(current, target, velocity, stiffness, damping, mass, dt);
```

### Smooth Damping

```typescript
// Unity-style SmoothDamp — smooth acceleration/deceleration
smoothDamp(current, target, velocity, smoothTime, maxSpeed, dt);
```

### Inertia

```typescript
// Apply impulse — velocity persists after input stops
controller.applyImpulse(new Vector3(0, 0, -5));
controller.dampVelocity(0.95); // Friction
```

### Preset Movement Configs

| Preset    | Stiffness | Damping | Mass | Character                |
| --------- | --------- | ------- | ---- | ------------------------ |
| `DEFAULT` | 120       | 14      | 1    | Balanced                 |
| `SPRING`  | 180       | 12      | 1    | Snappy, slight overshoot |
| `DAMPED`  | 80        | 20      | 1    | Smooth, no overshoot     |
| `HEAVY`   | 60        | 8       | 3    | Slow, massive            |
| `LIGHT`   | 200       | 18      | 0.5  | Fast, responsive         |

---

## Focus System

```typescript
// Focus on a point
camera.focus({
  position: [0, 0, 0],
  distance: 5,
  duration: 1.5,
  easing: "easeInOut",
});

// Follow an object
const followId = camera.addObject(mesh, [0, 3, 8]);
camera.setFollowTarget(followId);
```

---

## Camera Timeline

### Keyframes

```typescript
import { createKeyframe, createSequence } from "@/engine/camera";

const keyframes = [
  createKeyframe(0, [0, 2, 8], [0, 0, 0], 60, "easeInOut"),
  createKeyframe(0.3, [5, 3, 10], [0, 0, 0], 45, "easeInOut"),
  createKeyframe(0.7, [-3, 4, 6], [0, 0, 0], 50, "easeInOut"),
  createKeyframe(1, [0, 2, 8], [0, 0, 0], 60, "easeInOut"),
];

const sequence = createSequence("orbital-tour", keyframes, {
  loop: false,
  duration: 10,
});

camera.playSequence(sequence);
```

### Timeline Control

```typescript
camera.pauseTimeline();
camera.resumeTimeline();
camera.stopTimeline();
```

---

## Effects System

Additive offsets applied AFTER the controller computes base position:

| Effect  | Description                | Signature                              |
| ------- | -------------------------- | -------------------------------------- |
| `shake` | Decaying oscillation       | `intensity, frequency, decay, damping` |
| `drift` | Constant directional drift | `amplitude, frequency, direction`      |
| `bob`   | Vertical oscillation       | `amplitude, frequency, phase`          |
| `sway`  | Horizontal oscillation     | `amplitude, frequency, damping`        |

### Effect Weights

```typescript
// Blend effects (0 = off, 1 = full)
camera.setEffectWeight("shake", 0.5);
camera.setEffectWeight("drift", 0);

// Trigger shake
camera.triggerShake({ intensity: 0.8, frequency: 40 });
```

---

## Transitions

```typescript
camera.transitions.start(
  { type: "portal", duration: 2.8, easing: "easeInOut" },
  currentPosition,
  currentLookAt,
  currentFov,
  [0, 0, 15], // target position
  [0, 0, 0], // target lookAt
  75, // target fov
  () => console.log("Transition complete"),
);
```

### Transition Types

| Type     | Description                    |
| -------- | ------------------------------ |
| `fade`   | Cross-fade between positions   |
| `zoom`   | Zoom in/out transition         |
| `orbit`  | Orbital transition             |
| `dolly`  | Linear dolly movement          |
| `portal` | Wormhole compression/expansion |
| `custom` | User-defined easing            |

---

## Presets

Named camera configurations that combine mode, position, movement, and effects:

| Preset      | Mode      | Character                    |
| ----------- | --------- | ---------------------------- |
| `idle`      | idle      | Subtle drift, light movement |
| `floating`  | floating  | Weightless, spring motion    |
| `orbit`     | orbit     | Orbital, damped movement     |
| `focus`     | focus     | Zoomed, spring motion        |
| `cinematic` | cinematic | Heavy, dramatic              |
| `follow`    | follow    | Tracked, damped with bob     |
| `inspect`   | inspect   | Close orbit, spring motion   |
| `portal`    | portal    | Heavy with shake             |
| `vr`        | vr        | First-person, light movement |

---

## React Integration

### Provider

```tsx
import { CameraProvider } from "@/engine/camera";

<CameraProvider config={{ fov: 60, sensitivity: 1 }}>
  <MyWorld />
</CameraProvider>;
```

### Hooks

```tsx
import { useCamera, useCameraMode, useCameraEffects } from "@/engine/camera";

function MyComponent() {
  const { setTarget, setFov } = useCamera();
  const { mode, setMode } = useCameraMode();
  const { triggerShake } = useCameraEffects();

  return (
    <button
      onClick={() => {
        setMode("orbit");
        setTarget([0, 2, 8], [0, 0, 0]);
        triggerShake();
      }}
    >
      Enter Orbit
    </button>
  );
}
```

---

## Accessibility

- **Reduced Motion:** Detects `prefers-reduced-motion` media query. When active, disables all camera effects (shake, drift, bob, sway).
- **Camera Sensitivity:** Scales all movement by a configurable factor (0.1–3.0).
- **Motion Intensity:** Individual effect weights can be reduced for accessibility.

```typescript
camera.setReducedMotion(true); // Disables all effects
camera.setSensitivity(0.5); // Half speed movement
camera.setEffectWeight("drift", 0.3); // Reduce drift
```

---

## Performance

- **Zero allocations in hot path:** Vector3/Quaternion pooling via `vectorPool` and `quaternionPool`.
- **Frame-rate independent:** All movement uses `delta` (seconds since last frame).
- **Capped delta:** Maximum delta of 0.1s prevents spiral of death.
- **Pre-allocated scratch vectors:** `acquireScratch()` / `releaseScratch()` for temporary computations.
- **Spring settling:** Controllers detect when movement has settled and stop updating.

---

## Extension Guide

### Adding a New Camera Mode

1. Add the mode to `CameraMode` union in `types.ts`
2. Add valid transitions to `VALID_CAMERA_TRANSITIONS`
3. Add a preset to `CAMERA_PRESETS` in `config.ts`
4. Handle the mode in `CameraController.update()` if it needs special behavior

### Adding a New Effect

1. Add config type to `CameraEffectsConfig` in `types.ts`
2. Add default to `DEFAULT_EFFECTS` in `config.ts`
3. Implement the effect in `CameraEffects` class
4. Add weight support in `CameraEffects.getCombinedOffset()`

### Adding a New Transition Type

1. Add the type to `TransitionType` in `types.ts`
2. Implement the interpolation in `CameraTransitionManager.update()`

---

## Integration with Scene Architecture

The Cinematic Camera System works alongside the Scene Architecture:

- **SceneManager.CameraManager** — Simple camera for worlds that don't need cinematic features
- **CameraManager (cinematic)** — Full-featured camera for worlds that need orbital, spring, timeline, etc.

Worlds choose which camera system to use based on their needs. The cinematic system can optionally use the scene's PerspectiveCamera via `CameraRig`.

---

## Self Review

### Architecture

- Clean separation: 8 modules, each with single responsibility
- No circular dependencies — all communication through CameraManager
- Every module follows `initialize()` / `update(delta)` / `dispose()` lifecycle

### Performance

- Zero allocations in the update loop
- Spring physics with configurable stiffness/damping/mass
- Pre-allocated scratch vectors and object pools
- Frame-rate independent with capped delta

### Memory

- All effects, timelines, and follow targets are cleaned up on dispose
- Vector pools prevent GC pressure
- Event listeners and intervals are properly cleaned up

### Scalability

- New modes, effects, transitions, and presets can be added without modifying existing code
- Timeline system supports any number of keyframes
- Follow target system supports multiple simultaneous targets

### Accessibility

- Reduced motion detection and support
- Configurable sensitivity
- Individual effect weight control
