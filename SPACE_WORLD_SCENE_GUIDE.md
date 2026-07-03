# SPACE_WORLD_SCENE_GUIDE.md

## Scene Hierarchy

```
SpaceScene (Canvas)
├── DeepSpace              — Void gradient background (r=80 inverted sphere)
├── SpaceEnvironment       — FogExp2 + directional/point/hemisphere lighting
├── ParallaxLayer (0.0005) — Galaxy (spiral particles + dust lanes + core glow)
├── ParallaxLayer (0.001)  — StarField (3-layer points: near/mid/far)
├── ParallaxLayer (0.002)  — NebulaCloud (4 clouds × 4 planes = 16 volumetric layers)
├── ParallaxLayer (0.003)  — Planets (3 spheres with Fresnel atmosphere + ring system)
├── ParallaxLayer (0.004)  — ConstellationLines (7 constellations, dashed connections)
├── ParallaxLayer (0.005)  — CosmicDust (80 foreground particles, noise-based drift)
├── EntranceOverlay        — Fade-from-void plane (opacity 1→0 on mount)
└── CameraRig              — Spring-physics camera with mouse parallax
```

### Depth Budget

| Layer          | Z Range    | Parallax Speed | Particle Count                 | Draw Calls |
| -------------- | ---------- | -------------- | ------------------------------ | ---------- |
| DeepSpace      | -80        | 0.0005         | 1 mesh                         | 1          |
| Galaxy         | -30        | 0.001          | 1200 stars + 400 dust + 1 glow | 3          |
| StarField      | -10 to -50 | 0.002          | 120 points                     | 3          |
| Nebula         | -15 to -35 | 0.003          | 16 planes                      | 16         |
| Planets        | -28 to -55 | 0.004          | 3 spheres + 3 atmos + 1 ring   | 7          |
| Constellations | -5 to -10  | 0.005          | ~25 line segments              | ~25        |
| CosmicDust     | 3 to 20    | 0.008          | 80 points                      | 1          |
| **Total**      |            |                |                                | **~56**    |

---

## Environment Philosophy

> The cosmos is indifferent. You are a witness, not a protagonist.

### Core Principles

1. **Nothing targets the user.** Objects exist independently. The camera drifts through a universe that doesn't know you're there.
2. **Depth through layering, not distance fog alone.** Each layer has independent parallax speed, color temperature, and opacity.
3. **Motion is weightless.** No gravity, no ground plane, no horizon. Everything floats.
4. **Beauty from emptiness.** The void is the canvas. Objects are sparse, deliberate, never cluttered.
5. **Time dilates at 0.3x.** Everything moves slowly. Fast motion breaks the illusion of cosmic scale.

### Visual Language

| Element        | Role                | Metaphor                                     |
| -------------- | ------------------- | -------------------------------------------- |
| DeepSpace      | The void            | Absolute emptiness                           |
| Galaxy         | Focal anchor        | The only "structure" — everything orbits it  |
| Stars          | Ambient texture     | Static points, twinkle as heartbeat          |
| Nebulae        | Atmosphere          | Gas clouds that breathe and drift            |
| Planets        | Scale reference     | Give the eye something solid to rest on      |
| Constellations | Navigation          | Human pattern-seeking imposed on chaos       |
| CosmicDust     | Foreground parallax | Creates depth separation from content layers |

---

## Lighting Guide

### Light Sources

```
SpaceEnvironment
├── fogExp2              — #030712, density 0.012 (atmospheric depth)
├── ambientLight         — 0.03, #c7d2fe (space-tinted, barely visible)
├── hemisphereLight      — sky: #6366f1, ground: #030712, intensity 0.08
├── directionalLight     — 0.8, #e2e8f0, position [10,5,8] (key — drifts slowly)
├── pointLight (fill)    — 0.15, #6366f1, position [-8,-3,-5], distance 50
└── pointLight (rim)     — 0.1, #06b6d4, position [0,8,-10], distance 60
```

### Shader-Light Integration

Custom shaders accept light direction as a uniform:

```glsl
// Planet vertex shader
uniform vec3 uLightDir;
varying vec3 vLightDir;
// ...
vLightDir = normalize((modelViewMatrix * vec4(uLightDir, 0.0)).xyz);
```

Each planet preset passes its own `lightDirection`:

```typescript
lightDirection: [0.5, 0.3, 1.0]; // Planet 1 — slight upper-right
lightDirection: [0.4, 0.5, 0.8]; // Planet 2 — more frontal
lightDirection: [0.3, 0.2, 1.0]; // Planet 3 — mostly frontal
```

### Color Palette

| Token         | Hex       | Usage                                    |
| ------------- | --------- | ---------------------------------------- |
| Void Black    | `#030712` | Background, fog, DeepSpace base          |
| Deep Blue     | `#0a0f1e` | DeepSpace mid-band                       |
| Indigo        | `#1e1b4b` | DeepSpace accent band, nebula color      |
| Starlight     | `#e2e8f0` | Key light, near stars                    |
| Indigo Accent | `#6366f1` | Fill light, galaxy color, nebula 1       |
| Cyan          | `#06b6d4` | Rim light, nebula 2, planet 2 atmosphere |
| Violet        | `#8b5cf6` | Nebula 3, planet 3 atmosphere            |

---

## Asset Organization

```
src/worlds/space-world/
├── scene/
│   ├── SpaceScene.tsx        — Canvas, composition, camera rig, entrance
│   ├── DeepSpace.tsx          — Void gradient (inverted sphere, gradient shader)
│   ├── Galaxy.tsx             — Spiral galaxy (stars + dust lanes + core glow)
│   ├── StarField.tsx          — 3-layer star points (twinkle vertex shader)
│   ├── Nebula.tsx             — Volumetric nebulae (4-plane multi-layer)
│   ├── Planet.tsx             — Planets with atmosphere + optional rings
│   ├── ConstellationLines.tsx — Line connections (Drei Line)
│   ├── CosmicDust.tsx         — Foreground particles (noise drift)
│   ├── SpaceEnvironment.tsx   — Fog + lighting rig
│   └── index.ts               — Barrel exports
├── camera/
│   └── space-camera.ts        — Presets, effects, state machine, timeline
├── config.ts                   — Constellations, motion timing, cursor, field configs
├── hooks/
│   └── index.ts               — useReducedMotion, useScrollIntent, useStarField, etc.
├── types/
│   └── index.ts               — Type definitions
├── components/
│   ├── space-world.tsx         — Root component (BaseWorld wrapper)
│   ├── space-hero.tsx          — Hero section
│   └── space-sections.tsx      — Content sections
└── index.ts                    — World barrel exports
```

### Naming Conventions

| Type            | Convention                             | Example                              |
| --------------- | -------------------------------------- | ------------------------------------ |
| Component files | PascalCase                             | `Galaxy.tsx`, `SpaceEnvironment.tsx` |
| Config files    | kebab-case                             | `space-camera.ts`                    |
| Hook files      | use-prefix                             | `useReducedMotion`                   |
| Type files      | index.ts barrel                        | `types/index.ts`                     |
| Constants       | SCREAMING_SNAKE                        | `GALAXY_CONFIG`, `CAMERA_CONFIG`     |
| Shader strings  | `*_VERTEX_SHADER`, `*_FRAGMENT_SHADER` | `STAR_VERTEX_SHADER`                 |
| Component names | PascalCase, single export              | `export function Galaxy()`           |

---

## Performance Recommendations

### Current Budget

| Metric           | Value                        | Limit     |
| ---------------- | ---------------------------- | --------- |
| Total draw calls | ~56                          | <100 ✅   |
| Galaxy particles | 1600 (1200 stars + 400 dust) | <5000 ✅  |
| Star particles   | 120                          | <500 ✅   |
| Nebula planes    | 16                           | <50 ✅    |
| Planet segments  | 48 body / 24 atmosphere      | <64 ✅    |
| Dust particles   | 80                           | <200 ✅   |
| Three.js vendor  | 185KB (58KB gzip)            | <250KB ✅ |
| Build time       | ~8s                          | <15s ✅   |

### Optimization Strategies Already Applied

1. **Buffer attributes** — All particles use `Float32Array` + `bufferAttribute`, not per-vertex JSX.
2. **Frustum culling disabled** — Static particle positions don't benefit from culling (overhead > savings).
3. **Adaptive DPR** — `AdaptiveDpr pixelated` scales resolution on low-end devices.
4. **Reduced geometry** — Planets: 48 segments (down from 64). Atmosphere: 24 (down from 32).
5. **Shared uniforms** — `useMemo` prevents uniform recreation on re-render.
6. **Passive event listeners** — Mouse tracking uses `{ passive: true }`.
7. **RAF cleanup** — Mouse interpolation loop cancels on unmount.

### Future Optimization Checklist

- [ ] **Instanced mesh** for planets if count exceeds 5
- [ ] **LOD** — Switch to simpler shaders at distance
- [ ] **Object pooling** for particle positions if count exceeds 5000
- [ ] **WebWorker** for galaxy position generation (currently blocks main thread ~2ms)
- [ ] **Texture atlas** if adding star textures (currently all procedural)
- [ ] **Offscreen canvas** for noise texture generation
- [ ] **throttle** mouse move handler if experiencing jank on low-end devices

### Do Not

- Never use `MeshStandardMaterial` or `MeshPhongMaterial` — custom shaders are lighter.
- Never create new `Float32Array` inside `useFrame` — always pre-allocate.
- Never use `new THREE.Color()` inside `useFrame` — mutate existing instances.
- Never set `frustumCulled={true}` on particle systems — positions are static.
- Never use `React.memo` on R3F components — R3F handles its own reconciliation.

---

## Best Practices

### Adding a New Scene Component

1. Create `src/worlds/space-world/scene/YourComponent.tsx`
2. Follow the pattern:
   ```typescript
   import { useMemo, useRef } from "react";
   import { useFrame } from "@react-three/fiber";
   import type { ShaderMaterial } from "three";
   import { useReducedMotion } from "../hooks";
   ```
3. Define shaders as `const` strings at module level
4. Use `useMemo` for uniforms and geometry data
5. Gate all animation with `useReducedMotion()`
6. Export a single named function
7. Add to `scene/index.ts` barrel
8. Add to `SpaceScene.tsx` inside appropriate `ParallaxLayer`

### Writing Shaders

- **Vertex**: Transform position, pass varyings (UV, normal, depth)
- **Fragment**: Use `smoothstep` for soft edges, never `step`
- **Transparency**: Always `depthWrite={false}` + `transparent` + `blending={2}` (Additive)
- **Performance**: Avoid `texture2D` in fragment unless necessary
- **Uniforms**: Name with `u` prefix (`uTime`, `uColor`, `uPixelRatio`)
- **Attributes**: Name with `a` prefix (`aSize`, `aBrightness`, `aDepth`)

### Reduced Motion Protocol

Every animated component must:

```typescript
const reducedMotion = useReducedMotion();

useFrame((state, delta) => {
  if (reducedMotion) return;
  // ... animation logic
});
```

This ensures:

- Galaxy rotation stops
- Star twinkle stops
- Nebula drift stops
- Dust drift stops
- Camera rig stops
- DeepSpace shimmer stops
- Entrance animation skips to end

### Mouse Parallax Protocol

Every depth layer wraps in `ParallaxLayer`:

```tsx
<ParallaxLayer speed={PARALLAX_SPEEDS.layerName} mouseOffset={mouseOffset}>
  <YourComponent />
</ParallaxLayer>
```

Speeds increase from background (0.0005) to foreground (0.008). Never exceed 0.01 — the effect should be subtle, not disorienting.

---

## Future Expansion Guide

### Phase 1: Post-Processing

Add `@react-three/postprocessing` dependency:

```bash
npm install @react-three/postprocessing
```

Wire into `SpaceScene.tsx`:

```tsx
import { EffectComposer, Bloom, Vignette, Noise } from "react/postprocessing";

// Inside Canvas, after SceneContents:
<EffectComposer>
  <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.4} />
  <Vignette offset={0.5} darkness={0.6} />
  <Noise opacity={0.03} />
</EffectComposer>;
```

Config already defined in `SPACE_WORLD_RENDERING.postProcessing`.

### Phase 2: Interactive Constellations

Make constellation points clickable/hoverable:

1. Add raycasting to constellation star positions
2. On hover: glow effect + tooltip with constellation name
3. On click: camera focus animation (use `SPACE_CAMERA_PRESETS.focus`)
4. Add hover state to `useReducedMotion` — constellations respond even in reduced motion

### Phase 3: Scroll-Driven Camera

Map scroll position to camera Z-axis:

```typescript
const scrollProgress = useScroll(); // 0 → 1
camera.position.z = lerp(6, -5, scrollProgress);
```

This creates a "flying through space" effect as the user scrolls content.

### Phase 4: Dynamic Starfield

Regenerate star positions based on time of day or user interaction:

1. Use deterministic seed (date hash) for consistent daily positions
2. Add "shooting star" events at random intervals
3. Fade constellation lines based on camera proximity

### Phase 5: Audio Integration

Add spatial audio for cosmic atmosphere:

1. Web Audio API with `PannerNode` for 3D positioning
2. Low drone for the void
3. Subtle chime on constellation hover
4. Volume scales with camera proximity to objects

### Phase 6: Mobile Optimization

1. Reduce particle counts by 50% on mobile
2. Disable mouse parallax (use device orientation instead)
3. Simplify shaders (reduce noise octaves)
4. Use `devicePixelRatio: 1` cap on mobile

### Phase 7: VR/XR Support

1. Add `@react-three/xr` dependency
2. Replace `CameraRig` with XR camera
3. Add hand-tracking for constellation interaction
4. Scale scene for room-scale play area

---

## Shader Reference

### Galaxy Star Shader

| Attribute     | Type  | Description                    |
| ------------- | ----- | ------------------------------ |
| `aSize`       | float | Point size (0.2–2.5)           |
| `aBrightness` | float | Base brightness (0.3–1.0)      |
| `aColor`      | vec3  | RGB color (warm→cool gradient) |
| `aDepth`      | float | Distance from center (0–1)     |

| Uniform       | Type  | Description                |
| ------------- | ----- | -------------------------- |
| `uTime`       | float | Elapsed seconds            |
| `uPixelRatio` | float | `min(devicePixelRatio, 2)` |

### Nebula Shader

| Uniform       | Type  | Description                  |
| ------------- | ----- | ---------------------------- |
| `uTime`       | float | Elapsed seconds              |
| `uColor1`     | vec3  | Primary nebula color         |
| `uColor2`     | vec3  | Secondary nebula color       |
| `uOpacity`    | float | Base opacity (0.07–0.2)      |
| `uPlaneIndex` | float | Layer index (0–3) for offset |

### Planet Shader

| Uniform                | Type  | Description                |
| ---------------------- | ----- | -------------------------- |
| `uColor`               | vec3  | Surface base color         |
| `uAtmosphereColor`     | vec3  | Fresnel glow color         |
| `uAtmosphereIntensity` | float | Glow strength (0.9–1.5)    |
| `uLightDir`            | vec3  | Normalized light direction |

### DeepSpace Shader

| Uniform          | Type  | Description     |
| ---------------- | ----- | --------------- |
| `uTime`          | float | Elapsed seconds |
| `uReducedMotion` | float | 0.0 or 1.0      |

---

## Color Tokens

```
#030712  — Void Black (background, fog, DeepSpace base)
#0a0f1e  — Deep Blue (DeepSpace mid-band)
#1e1b4b  — Indigo (DeepSpace accent, nebula color)
#6366f1  — Indigo Accent (primary, fill light, galaxy, nebula 1)
#818cf8  — Indigo Light (hover states, dust particles)
#8b5cf6  — Violet (nebula 3, planet 3 atmosphere)
#06b6d4  — Cyan (rim light, nebula 2, planet 2 atmosphere)
#e2e8f0  — Starlight (key light, near stars, foreground text)
#94a3b8  — Slate (mid stars, subtle text)
#64748b  — Muted (far stars, disabled text)
#c7d2fe  — Lavender (ambient light tint, core glow)
```

---

## Acceptance Criteria Checklist

| Criterion                            | Status | File                                                                       |
| ------------------------------------ | ------ | -------------------------------------------------------------------------- |
| Galaxy with spiral arms              | ✅     | `Galaxy.tsx` — 1200-particle logarithmic spiral + 400 dust lanes           |
| Nebulae with volumetric feeling      | ✅     | `Nebula.tsx` — 4-plane multi-layer, noise-animated edges, light scattering |
| Stars at multiple depths             | ✅     | `StarField.tsx` — 3 layers (near/mid/far), twinkle, depth attenuation      |
| Planets with atmospheric glow        | ✅     | `Planet.tsx` — Fresnel atmosphere, light-responsive, optional rings        |
| Deep space background                | ✅     | `DeepSpace.tsx` — Gradient sphere, cosmic breathing shimmer                |
| Depth layers (foreground/background) | ✅     | `SpaceScene.tsx` — 7 ParallaxLayers with independent speeds                |
| Camera system integrated             | ✅     | `SpaceScene.tsx` — Spring physics + mouse parallax + entrance              |
| Rendering Pipeline configured        | ✅     | `config.ts` — `SPACE_WORLD_RENDERING` (ACES, bloom, vignette, grain)       |
| Theme integration                    | ✅     | `space-world.tsx` — `theme="space"`, 60+ tokens in `space.ts`              |
| Graceful reduced motion fallback     | ✅     | All 8 components gate animation via `useReducedMotion()`                   |
| 60 FPS target                        | ✅     | ~56 draw calls, buffer attributes, AdaptiveDpr, reduced geometry           |
| Responsive behavior                  | ✅     | DPR [1,2], viewport-relative canvas, normalized mouse parallax             |
| Clean architecture                   | ✅     | One component per file, named constants, barrel exports                    |
| No duplicated assets                 | ✅     | Each component unique, shared hooks from single source                     |
