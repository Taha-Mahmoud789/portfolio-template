# Spatial Object System

## Overview

The Spatial Object System is the unified object layer for every visible object in every world. It provides complete lifecycle management, spatial queries, event-driven communication, priority-based updates, and performance-optimized object pooling.

**Location:** `src/engine/spatial/`

## Architecture

```
ObjectManager (orchestrator)
├── ObjectRegistry (indexed lookup, priority iteration)
├── ObjectLifecycle (O(1) state machine)
├── ObjectEvents (typed event bus with priority)
├── ObjectFactory (validated creation + cache recycling)
├── ObjectCache (global LRU pool with Object3D reset)
└── ObjectLoader (lazy asset loading with dedup)
```

**Rule:** Objects communicate only through ObjectManager. No object-to-object direct communication.

## Lifecycle States

```
idle → registered → loaded → initializing → initialized → mounting → mounted
                                                                     ↓
                                                              updating ↔ suspending
                                                                     ↓
                                                              destroying → destroyed → disposing → disposed
```

Invalid transitions throw errors. The state machine validates all transitions via O(1) Set lookup.

## Key Design Decisions

### Performance

- **Cached triangle count** — computed once per object, not per frame
- **Dirty-flag state** — ObjectManager only recomputes state when objects change
- **Cached world position** — invalidated only on movement, not per query
- **Scratch objects** — zero-allocation reads for position/rotation/scale
- **Single-pass query** — no intermediate array allocations
- **O(1) lifecycle transitions** — Set-based instead of Array.includes()

### Memory

- **Global cache cap** — shared across all types, not per-type
- **Object3D reset on acquire** — cached objects get fresh transforms
- **Proper dispose flow** — destroyed→disposing→disposed (no skip)

### Architecture

- **Priority-based updates** — higher priority objects update first
- **Event priority** — critical listeners execute before non-critical
- **Batch operations** — `addObjects()` and `removeObjectBatch()` for spawning
- **Mutable scratch types** — internal use only, public API remains readonly

## Core Types

```typescript
// Object types
type SpatialObjectType =
  | "static"
  | "dynamic"
  | "interactive"
  | "background"
  | "decoration"
  | "particle"
  | "npc"
  | "physics";

// Configuration
interface SpatialObjectConfig {
  type: SpatialObjectType;
  id?: string;
  position?: Partial<SpatialPosition>;
  rotation?: Partial<SpatialRotation>;
  scale?: Partial<SpatialScale>;
  visible?: boolean;
  layer?: number; // 0-31
  priority?: number; // 0-1000 (higher = updates first)
  metadata?: Record<string, unknown>;
  object3d?: Object3D;
}
```

## Usage

### React Integration

```tsx
import { SpatialProvider, useObjectManager, useSpatialObject } from "@/engine/spatial";

function Scene() {
  return (
    <SpatialProvider scene={threeScene} config={{ maxObjects: 500 }}>
      <ObjectSpawner />
    </SpatialProvider>
  );
}

function ObjectSpawner() {
  const { addObject, addObjects, removeObject, state } = useObjectManager();

  // Single object
  const spawn = () => addObject({ type: "interactive", position: { x: 0, y: 1, z: 0 } });

  // Batch spawn (100 particles in one call)
  const spawnParticles = () => {
    const configs = Array.from({ length: 100 }, (_, i) => ({
      type: "particle" as const,
      position: { x: Math.random() * 10, y: Math.random() * 10, z: 0 },
      priority: 100,
    }));
    return addObjects(configs);
  };

  return <div>Objects: {state.objectCount}</div>;
}
```

### Direct API

```typescript
import { ObjectManager, EVENT_PRIORITY } from "@/engine/spatial";

const manager = new ObjectManager({ maxObjects: 1000 });
manager.initialize(scene);

// Add with priority (higher = updates first)
const id = manager.addObject({
  type: "interactive",
  position: { x: 0, y: 1, z: 0 },
  priority: 500,
});

// Subscribe with priority (lower number = executes first)
manager.on(
  "object:mounted",
  (event) => {
    console.log(`Mounted: ${event.objectId}`);
  },
  EVENT_PRIORITY.CRITICAL,
);

// Query with limit
const nearby = manager.query({
  type: "interactive",
  maxDistance: 50,
  cameraPosition: camera.position,
  limit: 20,
});

// Update loop (priority-ordered)
function animate(delta: number) {
  manager.update(delta); // only recomputes state when dirty
}
```

## Event System

```typescript
import { EVENT_PRIORITY } from "@/engine/spatial";

// Priority ordering: CRITICAL(0) → HIGH(1) → NORMAL(2) → LOW(3)
manager.on("object:mounted", handler, EVENT_PRIORITY.HIGH);

// Available event types:
// "object:loaded"       — object created and loaded
// "object:mounted"      — object added to scene
// "object:visible"      — object became visible
// "object:hidden"       — object became hidden
// "object:updated"      — object updated this frame
// "object:positionChanged" — object moved
// "object:layerChanged" — object layer changed
// "object:destroyed"    — object destroyed
```

## Cache Behavior

- **Global cap**: `maxObjects` limits total cached objects across all types
- **LRU eviction**: least-recently-used evicted first
- **Object3D reset**: position/rotation/scale/visibility reset on acquire
- **GPU disposal**: geometry and materials disposed on eviction

```typescript
// Cache is managed automatically
// Manual control:
manager.clearCache();
manager.getCachedCount(); // total cached across all types
```

## File Reference

| File                  | Responsibility                                          |
| --------------------- | ------------------------------------------------------- |
| `types.ts`            | All type definitions + mutable scratch types            |
| `constants.ts`        | Default values, status sets, initialize sequence        |
| `spatial-object.ts`   | Core object class with cached computations              |
| `object-manager.ts`   | Orchestrator with dirty-flag state + batch ops          |
| `object-registry.ts`  | Indexed lookup + priority iteration + single-pass query |
| `object-lifecycle.ts` | O(1) state machine + batch transitions                  |
| `object-events.ts`    | Typed event bus with priority ordering                  |
| `object-factory.ts`   | Validated creation + cache recycling                    |
| `object-cache.ts`     | Global LRU pool + Object3D reset                        |
| `object-loader.ts`    | Lazy asset loading with deduplication                   |
| `object-utilities.ts` | Spatial math + GPU disposal                             |
| `object-validator.ts` | Config validation                                       |
| `object-context.ts`   | React context                                           |
| `object-provider.tsx` | React provider                                          |
| `object-hooks.ts`     | React hooks (batch API)                                 |
| `index.ts`            | Barrel exports                                          |
