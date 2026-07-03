# SPACE_SCENE.md — Immersive Space World Scene

## Overview

The Space World scene renders a full 3D cosmos inside an R3F Canvas positioned behind the HTML content layers. The universe is indifferent — the user is a witness, not a protagonist.

**Vision**: Beauty from absolute, uncaring emptiness. No ground, no horizon, no gravity.

---

## Scene Composition (Depth Order)

| Layer | Component            | Depth         | Description                             |
| ----- | -------------------- | ------------- | --------------------------------------- |
| 0     | `DeepSpace`          | z: -80        | Inverted gradient sphere — the void     |
| 1     | `SpaceEnvironment`   | —             | 3-point lighting (ambient + key + fill) |
| 2     | `Galaxy`             | z: -25 to -35 | Spiral particle galaxy, 800 particles   |
| 3     | `StarField`          | z: -10 to -50 | 3-layer point geometry (near/mid/far)   |
| 4     | `NebulaCloud`        | z: -15 to -25 | Shader-based volumetric gas clouds      |
| 5     | `Planets`            | z: -30 to -50 | Spheres with Fresnel atmospheric glow   |
| 6     | `ConstellationLines` | z: -5 to -10  | Dashed line connections between stars   |
| 7     | `CosmicDust`         | z: 5 to 20    | Foreground particle drift               |

---

## Components

### `DeepSpace`

- **File**: `scene/DeepSpace.tsx`
- Inverted sphere (scale [-1, 1, 1]) with multi-band gradient shader
- Gradient bands: `#030712` → `#0a0f1e` → `#1e1b4b` → `#0a0f1e` → `#030712`
- Subtle time-based shimmer (cosmic breathing)
- Radius: 80 units

### `Galaxy`

- **File**: `scene/Galaxy.tsx`
- Particle system with logarithmic spiral arm distribution
- 800 particles across 4 spiral arms
- Central bulge (20% of particles) with larger, brighter stars
- Color gradient: warm core (yellow-white) → cool edges (blue-indigo)
- Self-rotating around z-axis at 0.003 rad/frame

### `StarField`

- **File**: `scene/StarField.tsx`
- 3 depth layers: near (20 stars), mid (50 stars), far (50 stars)
- Custom GLSL vertex shader: twinkle animation + size attenuation
- Custom GLSL fragment shader: soft glow circles
- Biased distribution toward galactic center

### `NebulaCloud`

- **File**: `scene/Nebula.tsx`
- 3 preset clouds with noise-based volumetric shader
- 3D simplex noise for organic appearance
- Radial falloff + noise-based opacity
- Each cloud drifts independently

### `Planets`

- **File**: `scene/Planet.tsx`
- 3 preset planets at different distances/sizes
- Fresnel-based atmospheric glow (outer shell)
- Surface shader with terminator gradient
- Independent rotation speeds

### `ConstellationLines`

- **File**: `scene/ConstellationLines.tsx`
- 7 constellations defined in config (Compass, Voyager, Beacon, Frontier, Relay, Anchor, Void)
- Dashed lines connecting star points
- Opacity based on star brightness

### `CosmicDust`

- **File**: `scene/CosmicDust.tsx`
- 50 particles with drift movement
- Custom GLSL: per-particle speed + angle + size
- Wraps around bounds (mod 20)

### `SpaceEnvironment`

- **File**: `scene/SpaceEnvironment.tsx`
- Ambient light (0.05, starlight)
- Key light (0.3, starlight, moves slowly)
- Fill light (0.15, indigo accent)
- No rim light (space is dark)

---

## Camera

- **File**: `camera/space-camera.ts`
- Position: [0, 0, 5], FOV: 60, near: 0.1, far: 200
- Weightless orbital drift via `CameraRig` inside Canvas
- 3 presets: orbital, focus, portal
- Drift effect: gentle sin/cos oscillation
- No bob, no sway (weightless)

---

## Rendering Pipeline Integration

- **Config**: `src/engine/rendering/config.ts` → `SPACE_WORLD_RENDERING`
- ACES tone mapping, exposure 1.0
- Bloom: threshold 0.6, strength 0.4, radius 0.5
- Vignette: offset 0.5, darkness 0.6
- Film grain: intensity 0.03
- FXAA antialiasing
- Exponential fog: density 0.015, color `#030712`
- **Note**: Post-processing not yet wired to R3F Canvas (requires `@react-three/postprocessing`)

---

## Performance

- **Geometry reuse**: All particles use shared `Points` geometry
- **Buffer attributes**: Custom attributes via `bufferAttribute` (not per-vertex state)
- **Frustum culling**: Disabled on particle systems (static positions)
- **Adaptive DPR**: `AdaptiveDpr` + `AdaptiveEvents` from Drei
- **Reduced motion**: All animations gated by `useReducedMotion()`
- **Vendor chunk**: Three.js split into 185KB gzip 58KB

---

## Reduced Motion

When `prefers-reduced-motion: reduce`:

- Galaxy rotation stops
- Star twinkle stops
- Nebula drift stops
- Dust drift stops
- Camera rig stops
- Deep space shimmer stops
- `AdaptiveDpr` and `AdaptiveEvents` disabled

---

## File Structure

```
src/worlds/space-world/
├── scene/
│   ├── SpaceScene.tsx        — Canvas + composition + camera rig
│   ├── DeepSpace.tsx          — Void gradient background
│   ├── Galaxy.tsx             — Spiral particle galaxy
│   ├── StarField.tsx          — 3-layer star points
│   ├── Nebula.tsx             — Volumetric shader nebulae
│   ├── Planet.tsx             — Spheres with atmospheric glow
│   ├── ConstellationLines.tsx — Line connections
│   ├── CosmicDust.tsx         — Foreground particles
│   ├── SpaceEnvironment.tsx   — Lighting
│   └── index.ts               — Barrel exports
├── camera/
│   └── space-camera.ts        — Presets + effects + timeline
├── config.ts                   — Constellations, motion, cursor
├── hooks/
│   └── index.ts               — useReducedMotion, etc.
├── types/
│   └── index.ts               — Type definitions
└── components/
    ├── space-world.tsx         — Root component
    ├── space-hero.tsx          — Hero section
    └── space-sections.tsx      — Content sections
```

---

## Acceptance Criteria

| Criterion                            | Status                             |
| ------------------------------------ | ---------------------------------- |
| Galaxy with spiral arms              | ✅ 800-particle logarithmic spiral |
| Nebulae with volumetric feeling      | ✅ Noise shader + radial falloff   |
| Stars at multiple depths             | ✅ 3 layers: near/mid/far          |
| Planets with atmospheric glow        | ✅ Fresnel outer shell             |
| Deep space background                | ✅ Gradient sphere                 |
| Depth layers (foreground/background) | ✅ 8 composited layers             |
| Camera system integrated             | ✅ Orbital drift + presets         |
| Rendering Pipeline configured        | ✅ SPACE_WORLD_RENDERING           |
| Graceful reduced motion fallback     | ✅ All animations gated            |
| 60 FPS target                        | ✅ Points + buffer attributes      |
| Responsive behavior                  | ✅ DPR scaling + adaptive          |
