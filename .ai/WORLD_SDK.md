# World SDK

Reusable development kit for building worlds in the Frontend Multiverse.

## Overview

The World SDK provides a developer-friendly layer on top of the World Engine. It gives you:

- **WorldContract** — strict interface every world must satisfy
- **Factory** — `createWorld()` to scaffold new worlds from minimal config
- **Validator** — schema validation for world definitions
- **Registration** — simplified helpers for WorldManager integration
- **Loader** — lazy-loading utilities with retry/timeout
- **Metadata** — SEO/Open Graph/structured data generation
- **Configuration** — theme-aware defaults and deep-merge
- **Hooks** — React hooks for lifecycle, assets, and metadata
- **Utilities** — pure functions for ID/slug conversion, filtering, sorting

## Architecture

```
src/sdk/world/
├── types.ts          # WorldContract, SDK types, factory options
├── constants.ts      # Defaults, theme mappings, required fields
├── factory.ts        # createWorld(), createWorlds()
├── validation.ts     # validateWorldSDKConfig(), validateWorldContract()
├── registration.ts   # registerWorld(), registerWorlds(), unregisterWorld()
├── loader.ts         # createWorldLoader(), createBatchLoader()
├── metadata.ts       # generateWorldSDKMeta(), generateWorldOGTags()
├── config.ts         # mergeWorldConfig(), buildWorldDefinition()
├── hooks.ts          # useWorldSDK(), useWorldLifecycle(), useWorldAssets()
├── utilities.ts      # worldIdToSlug(), slugToWorldId(), searchContracts()
└── index.ts          # barrel exports
```

## Quick Start

### Creating a New World

```typescript
import { createWorld } from "@/sdk/world";

const result = createWorld({
  config: {
    id: "my-world" as WorldId,
    name: "My World",
    description: "A custom world",
    theme: "apple",
    components: {
      root: MyWorldComponent,
    },
  },
});

// result.definition — WorldDefinition for the World Engine
// result.contract — WorldContract with route and components
// result.moduleLoader — lazy-loading function
```

### Registering a World

```typescript
import { registerWorld } from "@/sdk/world";
import { worldManager } from "@/engine/world/manager";

registerWorld(worldManager, definition, moduleLoader, assets, {
  validate: true,
  override: false,
});
```

### Using SDK Hooks

```typescript
import { useWorldSDK, useWorldLifecycle } from "@/sdk/world";

function MyComponent() {
  const { world, meta, isActive } = useWorldSDK();
  const { load, activate, phase } = useWorldLifecycle("apple-world");

  return (
    <div>
      <h1>{meta?.title}</h1>
      <p>Phase: {phase}</p>
    </div>
  );
}
```

## WorldContract

The strict interface every world must satisfy:

```typescript
interface WorldContract {
  id: WorldId;
  slug: string;
  name: string;
  description: string;
  route: string;
  theme: ThemeId;
  layout: WorldLayoutConfig;
  animationPreset: WorldAnimationPreset;
  transitionPreset: WorldTransitionPreset;
  background: WorldBackground;
  entrySequence: WorldSequence;
  exitSequence: WorldSequence;
  assets: WorldAssets;
  status: WorldStatus;
  permissions: WorldPermissions;
  metadata: WorldMetadata & { category: string; featured: boolean };
  components: WorldComponentSet;
  routes: WorldRouteConfig[];
}
```

## Factory

### createWorld

Creates a complete world definition from a simplified config:

```typescript
const { definition, contract, moduleLoader } = createWorld({
  config: {
    id: "apple-world",
    name: "Apple World",
    description: "Minimalist design",
    theme: "apple",
    components: { root: AppleWorld },
  },
  validate: true, // validate config (default: true)
  autoRegister: false, // auto-register with WorldManager (default: false)
});
```

### createWorlds

Batch creation:

```typescript
const worlds = createWorlds([
  { id: "apple-world", name: "Apple", theme: "apple", ... },
  { id: "cyberpunk-world", name: "Cyberpunk", theme: "cyberpunk", ... },
]);
```

## Validation

### validateWorldSDKConfig

Validates a simplified SDK config:

```typescript
const result = validateWorldSDKConfig({
  id: "my-world",
  name: "My World",
  theme: "apple",
});

if (!result.valid) {
  for (const error of result.errors) {
    console.error(`${error.field}: ${error.message}`);
  }
}
```

### validateWorldContract

Full contract validation:

```typescript
const result = validateWorldContract(contract);
// Checks all required fields, slug format, route format, etc.
```

## Theme-World Mapping

The SDK includes automatic theme-to-world defaults:

| Theme        | Animation | Transition     | Background     |
| ------------ | --------- | -------------- | -------------- |
| apple        | fade      | crossfade      | light gradient |
| cyberpunk    | glitch    | morph-expand   | dark purple    |
| space        | bloom     | iris           | deep navy      |
| gaming       | scale     | zoom-in        | dark blue      |
| ai           | morph     | dissolve       | dark indigo    |
| editorial    | slide     | page-turn      | warm white     |
| liquid       | wave      | morph-expand   | light blue     |
| retro        | scale     | slide-up       | warm yellow    |
| brutalist    | none      | none           | white          |
| experimental | cinematic | particle-burst | dark gradient  |

## Hooks

### useWorldSDK

Get SDK-enhanced world info:

```typescript
const { world, phase, meta, isActive, isLoading, hasError, error } = useWorldSDK();
```

### useWorldLifecycle

Full lifecycle control:

```typescript
const { load, preload, unload, activate, deactivate, suspend, resume, phase } =
  useWorldLifecycle("apple-world");
```

### useWorldAssets

Track asset loading:

```typescript
const { total, loaded, failed, progress } = useWorldAssets("apple-world");
```

### useWorldMetadata

Get SDK metadata:

```typescript
const meta = useWorldMetadata("apple-world");
// { title, description, ogImage, ogTitle, ogDescription, keywords, canonical, structuredData }
```

## Utilities

```typescript
worldIdToSlug("apple-world"); // "apple"
slugToWorldId("apple"); // "apple-world"
worldIdToRoute("apple-world"); // "/worlds/apple"
routeToWorldId("/worlds/apple"); // "apple-world"
isValidWorldId("apple-world"); // true
isSameWorld("apple-world", "apple-world"); // true

// Contract utilities
getWorldDisplayName(contract); // "Apple World"
isWorldFeatured(contract); // false
getWorldCategory(contract); // "minimal"
getWorldCategories(contracts); // ["minimal", "futuristic", ...]
filterByCategory(contracts, "minimal");
sortByName(contracts);
sortByDate(contracts);
searchContracts(contracts, "apple");
```

## Files Created

```
src/sdk/world/types.ts          — 188 lines
src/sdk/world/constants.ts      — 189 lines
src/sdk/world/factory.ts        — 180 lines
src/sdk/world/validation.ts     — 176 lines
src/sdk/world/registration.ts   — 67 lines
src/sdk/world/loader.ts         — 107 lines
src/sdk/world/metadata.ts       — 117 lines
src/sdk/world/config.ts         — 175 lines
src/sdk/world/hooks.ts          — 183 lines
src/sdk/world/utilities.ts      — 136 lines
src/sdk/world/index.ts          — 96 lines
```
