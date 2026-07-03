# Rendering Pipeline Guide

> Complete reference for the rendering engine — architecture, lifecycle, configuration, and extension patterns.

---

## Architecture

The rendering pipeline follows a **3-manager + 1-orchestrator** architecture. Every module implements the `RenderModule` interface and communicates exclusively through the `RenderPipeline` — managers never depend on each other directly.

```
┌─────────────────────────────────────────────────────────┐
│                    RenderPipeline                        │
│                  (orchestrator + rAF)                    │
│                                                         │
│  ┌───────────────┐  ┌──────────────────┐  ┌──────────┐ │
│  │ RendererManager│  │EnvironmentManager│  │PostProc  │ │
│  │                │  │                  │  │Manager   │ │
│  │ WebGLRenderer  │  │ scene.background │  │Composer  │ │
│  │ Tone mapping   │  │ scene.fog        │  │Pass chain│ │
│  │ Exposure anim  │  │ scene.environment│  │Bloom     │ │
│  │ Color mgmt     │  │ Texture loading  │  │Vignette  │ │
│  │ Pixel ratio    │  │ AbortController  │  │Film grain│ │
│  │ Shadows        │  │                  │  │FXAA      │ │
│  └───────┬───────┘  └────────┬─────────┘  └────┬─────┘ │
│          │                   │                  │       │
│          └───────────────────┼──────────────────┘       │
│                              │                          │
│                    ┌─────────▼─────────┐                │
│                    │  Three.js Scene   │                │
│                    │  PerspectiveCamera│                │
│                    └───────────────────┘                │
└─────────────────────────────────────────────────────────┘
```

### Core Principles

| Principle | Implementation |
|-----------|---------------|
| Single source of truth | `RendererManager` owns the WebGLRenderer. No other manager touches renderer properties. |
| Module isolation | Managers never import each other. All coordination happens through `RenderPipeline`. |
| Lifecycle contract | Every module implements `initialize()`, `update(delta)`, `resize(w, h)`, `dispose()`. |
| Memory safety | Reusable objects via mutation (Color, Fog, Vector2). AbortController for async loads. Null references on dispose. |
| No allocations in hot path | Pre-allocated scratch objects. Config spreads only on mutation, not per-frame. |

---

## Folder Structure

```
src/engine/rendering/
├── types.ts                    All type definitions
├── constants.ts                Defaults, quality presets
├── config.ts                   Merge utilities, SPACE_WORLD_RENDERING preset
├── renderer-manager.ts         WebGLRenderer + tone mapping + exposure animation
├── environment-manager.ts      Background + fog + environment maps
├── post-processing-manager.ts  EffectComposer pass chain
├── render-pipeline.ts          Orchestrator, rAF loop, quality management
├── render-context.ts           React context
├── render-provider.tsx         React provider with canvas ref
├── hooks/
│   └── index.ts                useRenderer, useEnvironment, usePostProcessing
├── utils/
│   └── device.ts               Device detection, GPU caps, quality recommendation
└── index.ts                    Barrel exports
```

### Removed Files (consolidated)

| Removed | Merged Into | Reason |
|---------|-------------|--------|
| `color-manager.ts` | `renderer-manager.ts` | `ColorManagement.enabled` + working color space set once in `initialize()` |
| `tone-mapping-manager.ts` | `renderer-manager.ts` | Tone mapping is a renderer property |
| `exposure-manager.ts` | `renderer-manager.ts` | Exposure animation runs in the pipeline's rAF tick |
| `sky-manager.ts` | — | Dead stub until Sky shader is implemented |
| `fog-manager.ts` | `environment-manager.ts` | Fog is a scene-level property tied to environment |
| `environment-renderer.ts` | `environment-manager.ts` | Background + fog + env maps are one cohesive unit |

---

## Pipeline Flow

### Initialization Order

```
1. new RenderPipeline(config)
   ├── RendererManager(config.renderer)
   ├── EnvironmentManager(config.environment)
   └── PostProcessingManager(config.postProcessing)

2. pipeline.initialize()
   ├── new Scene()
   ├── RendererManager.initialize()
   │   ├── ColorManagement.enabled = true
   │   ├── ColorManagement.workingColorSpace = LinearSRGBColorSpace
   │   ├── new WebGLRenderer({ canvas, antialias, ... })
   │   ├── renderer.setPixelRatio(resolved)
   │   ├── renderer.outputColorSpace = COLOR_SPACE_MAP[config]
   │   ├── renderer.toneMapping = TONE_MAPPING_MAP[config]
   │   ├── renderer.toneMappingExposure = config
   │   ├── renderer.shadowMap.enabled = config
   │   └── renderer.setSize(width, height)
   ├── EnvironmentManager.setScene(scene)
   ├── EnvironmentManager.initialize()
   │   ├── applyBackground() → scene.background = new Color(color)
   │   ├── applyFog() → scene.fog = new Fog/FogExp2(color, params)
   │   └── loadEnvironmentMap(url) → TextureLoader.load() with AbortController
   ├── PostProcessingManager.setRenderer(renderer, scene, camera)
   │   ├── new EffectComposer(renderer)
   │   ├── RenderPass(scene, camera)
   │   ├── UnrealBloomPass(resolution, strength, radius, threshold)
   │   ├── ShaderPass(VignetteShader)
   │   ├── ShaderPass(FilmGrainShader)
   │   ├── ShaderPass(FXAAShader)
   │   └── OutputPass()
   └── PostProcessingManager.initialize()

3. pipeline.start()
   └── requestAnimationFrame(tick)
```

### Per-Frame Update

```
tick()
├── delta = (now - lastFrameTime) / 1000
├── clampedDelta = min(delta, maxDelta)
├── RendererManager.update(clampedDelta)
│   └── if exposureAnimating: lerp exposure, apply ease-in-out
├── EnvironmentManager.update(clampedDelta)
│   └── (no per-frame work currently)
├── PostProcessingManager.update(clampedDelta)
│   └── filmGrainPass.uniforms.time.value += delta
├── render
│   ├── if postProcessing.enabled: composer.render()
│   └── else: renderer.render(scene, camera)
├── updateStats(delta) → fps, drawCalls, triangles, textures, geometries
└── requestAnimationFrame(tick)
```

### Dispose Order

```
pipeline.dispose()
├── stop() → cancelAnimationFrame(rafId)
├── PostProcessingManager.dispose()
│   ├── composer.dispose()
│   └── null all pass references
├── EnvironmentManager.dispose()
│   ├── abortController.abort()
│   ├── loadedTexture.dispose()
│   ├── scene.fog = null
│   ├── scene.background = null
│   ├── scene.environment = null
│   └── scene = null
└── RendererManager.dispose()
    ├── renderer.dispose()
    ├── renderer = null
    └── isExposureAnimating = false
```

---

## Renderer Lifecycle

### Creating a Pipeline

```typescript
import { RenderPipeline } from "@/engine/rendering";

const pipeline = new RenderPipeline({
  renderer: {
    antialias: true,
    toneMapping: "aces",
    toneMappingExposure: 1.0,
    outputColorSpace: "srgb",
    maxPixelRatio: 2,
  },
  environment: {
    background: { type: "color", color: "#030712" },
    fog: { type: "exponential", color: "#030712", density: 0.015 },
  },
  postProcessing: {
    bloom: { enabled: true, threshold: 0.6, strength: 0.4, radius: 0.5 },
    vignette: { enabled: true, offset: 0.5, darkness: 0.6 },
    fxaa: { enabled: true },
  },
  quality: "high",
  autoStart: true,
  maxDelta: 0.1,
});

pipeline.initialize();
pipeline.start();
```

### React Integration

```tsx
import { RenderProvider } from "@/engine/rendering";
import { SPACE_WORLD_RENDERING } from "@/engine/rendering";

function SpaceWorld() {
  return (
    <RenderProvider
      config={SPACE_WORLD_RENDERING}
      autoStart
      onReady={(pipeline) => console.log("Pipeline ready")}
    >
      {/* Canvas is mounted automatically */}
      {/* Scene content goes here */}
    </RenderProvider>
  );
}
```

### Using Hooks

```tsx
import { useRenderer, useEnvironment, usePostProcessing } from "@/engine/rendering";

function Controls() {
  const { state: rendererState, setToneMapping, setToneMappingExposure } = useRenderer();
  const { state: envState, setBackground, setFog } = useEnvironment();
  const { state: ppState, setBloom, setBloomEnabled } = usePostProcessing();

  return (
    <div>
      <p>FPS: {rendererState.fps.toFixed(0)}</p>
      <button onClick={() => setToneMapping("reinhard")}>
        Switch Tone Mapping
      </button>
      <button onClick={() => setBloom(0.8, 0.6, 0.4)}>
        Increase Bloom
      </button>
    </div>
  );
}
```

### Imperative API (via ref)

```typescript
const pipelineRef = pipeline.getRef();

// Scene manipulation
pipelineRef.addObject(mesh);
pipelineRef.removeObject(mesh);

// Camera
pipelineRef.setCamera(customCamera);

// Tone mapping
pipelineRef.setToneMapping("aces");
pipelineRef.setExposure(1.5);
pipelineRef.animateExposure(0.5, 2.0); // target, duration in seconds

// Environment
pipelineRef.setBackground("color", "#1a1a2e");
pipelineRef.setFog("linear", { color: "#000", near: 5, far: 50 });

// Post processing
pipelineRef.setBloom(0.6, 0.5, 0.4);
pipelineRef.setBloomEnabled(false);
pipelineRef.setVignetteEnabled(true);
pipelineRef.setFilmGrainEnabled(true);
pipelineRef.setFXAAEnabled(true);

// Quality
pipelineRef.setQuality("low");

// Resize (usually handled by React provider)
pipelineRef.resize(window.innerWidth, window.innerHeight);
```

---

## Color Workflow

The pipeline implements a **linear workflow** — physically correct lighting calculations.

### Flow

```
1. Textures (sRGB) ──→ uploaded as sRGB, converted to linear on GPU read
2. Lighting math ────→ all calculations in linear space
3. Tone mapping ─────→ ACES Filmic compresses HDR → LDR
4. Output ───────────→ converted back to sRGB for display
```

### Configuration

```typescript
// Linear workflow is automatic — ColorManagement.enabled = true
// Working color space is LinearSRGBColorSpace

pipelineRef.setToneMapping("aces");     // none | linear | reinhard | cineon | aces
pipelineRef.setExposure(1.0);           // HDR exposure multiplier
pipelineRef.animateExposure(0.5, 2.0);  // smooth transition
```

### Color Space Map

| Config Value | Three.js Constant | Usage |
|-------------|-------------------|-------|
| `"srgb"` | `SRGBColorSpace` | Output for displays (default) |
| `"linear"` | `LinearSRGBColorSpace` | Linear output (rare) |

### Tone Mapping Modes

| Mode | Character | Best For |
|------|-----------|----------|
| `"none"` | Raw HDR values | Debug only |
| `"linear"` | Simple clamp | Flat illustration |
| `"reinhard"` | Classic filmic | General purpose |
| `"cineon"` | Film-like curve | Warm cinematic look |
| `"aces"` | ACES Filmic (default) | Cinematic, wide dynamic range |

---

## Performance Guide

### Quality Presets

| Setting | Low | Medium | High | Ultra |
|---------|-----|--------|------|-------|
| Pixel ratio max | 1.0 | 1.5 | 2.0 | 2.0 |
| Antialias | off | on | on | on |
| Bloom | off | on | on | on |
| FXAA | off | on | on | on |
| Film grain | off | off | on | on |
| Vignette | off | on | on | on |
| Shadows | off | off | on | on |
| Shadow map size | 512 | 1024 | 2048 | 4096 |
| Max lights | 4 | 8 | 16 | 32 |

### Device Detection

```typescript
import {
  isMobile, isTablet, isLowEndDevice,
  recommendQuality, getMaxPixelRatio,
  getFrameBudget, isFrameBudgetExceeded,
} from "@/engine/rendering";

// Auto-recommend quality based on device
const quality = recommendQuality(); // "low" | "medium" | "high" | "ultra"

// Check frame budget (16.67ms for 60fps at high quality)
if (isFrameBudgetExceeded(frameTimeMs, "high")) {
  pipeline.setQuality("medium");
}
```

### Performance Tips

1. **Use `autoStart: true`** — avoids manual `start()` call and ensures rAF begins immediately.
2. **Set `maxDelta: 0.1`** — prevents physics explosion when tab is backgrounded (delta jumps to seconds).
3. **Respect `maxPixelRatio`** — on mobile, `"auto"` pixel ratio with `maxPixelRatio: 1.5` prevents over-rendering.
4. **Disable unused effects** — bloom is the most expensive. Film grain adds noise that may mask detail.
5. **Use `animateExposure` for transitions** — smooth exposure changes avoid jarring visual jumps.
6. **Monitor stats** — `pipeline.getState()` exposes `fps`, `drawCalls`, `triangles` for runtime profiling.

### Frame Budget Reference

| Quality | Budget | Target FPS |
|---------|--------|------------|
| Low | 32ms | 30 fps |
| Medium | 20ms | 50 fps |
| High | 16.67ms | 60 fps |
| Ultra | 16.67ms | 60 fps |

---

## Extension Guide

### Adding a New Effect

To add a post-processing effect (e.g., chromatic aberration):

**1. Define the config type** in `types.ts`:

```typescript
export interface ChromaticAberrationConfig {
  readonly enabled: boolean;
  readonly offset: number;
}
```

**2. Add to `PostProcessingConfig`**:

```typescript
export interface PostProcessingConfig {
  readonly bloom: BloomConfig;
  readonly vignette: VignetteConfig;
  readonly filmGrain: FilmGrainConfig;
  readonly fxaa: FXAAConfig;
  readonly chromaticAberration: ChromaticAberrationConfig; // new
}
```

**3. Add defaults** in `constants.ts`:

```typescript
export const CHROMATIC_ABERRATION_DEFAULTS: ChromaticAberrationConfig = {
  enabled: false,
  offset: 0.001,
};
```

**4. Add shader** in `post-processing-manager.ts`:

```typescript
const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    offset: { value: 0.001 },
  },
  vertexShader: `...`,
  fragmentShader: `...`,
};
```

**5. Add pass** in `setRenderer()`:

```typescript
// After FXAA, before Output
if (this.config.chromaticAberration.enabled) {
  this.chromaticAberrationPass = new ShaderPass(ChromaticAberrationShader);
  this.chromaticAberrationPass.uniforms.offset.value = this.config.chromaticAberration.offset;
  this.composer.addPass(this.chromaticAberrationPass);
}
```

**6. Add enable/disable toggle**:

```typescript
setChromaticAberrationEnabled(enabled: boolean): void {
  this.config = { ...this.config, chromaticAberration: { ...this.config.chromaticAberration, enabled } };
  if (this.chromaticAberrationPass) {
    this.chromaticAberrationPass.enabled = enabled;
  }
  this.state = { ...this.state, activeEffects: this.computeActiveEffects() };
}
```

### Adding a New Render Module

To add a module that runs alongside the existing managers:

**1. Implement `RenderModule`**:

```typescript
import type { RenderModule } from "./types";

export class MyNewModule implements RenderModule {
  initialize(): void { /* setup */ }
  update(delta: number): void { /* per-frame */ }
  resize(width: number, height: number): void { /* handle resize */ }
  dispose(): void { /* cleanup */ }
}
```

**2. Add to `RenderPipeline`**:

```typescript
// In constructor
this.myModule = new MyNewModule(config);

// In initialize()
this.myModule.initialize();

// In update()
this.myModule.update(clampedDelta);

// In resize()
this.myModule.resize(width, height);

// In dispose()
this.myModule.dispose();
```

**3. Expose via `RenderPipelineRef`** if React hooks need access.

### Adding a World-Specific Preset

```typescript
// In config.ts
export const CYBERPUNK_WORLD_RENDERING: Partial<RenderPipelineConfig> = {
  renderer: {
    toneMapping: "cineon",
    toneMappingExposure: 0.8,
  },
  environment: {
    background: { type: "color", color: "#0a0a0f" },
    fog: { type: "exponential", color: "#0a0a0f", density: 0.03 },
  },
  postProcessing: {
    bloom: { enabled: true, threshold: 0.4, strength: 0.6, radius: 0.6 },
    vignette: { enabled: true, offset: 0.4, darkness: 0.7 },
    filmGrain: { enabled: true, intensity: 0.04 },
    fxaa: { enabled: true },
  },
  quality: "high",
};

// Usage
<RenderProvider config={CYBERPUNK_WORLD_RENDERING}>
```

---

## Best Practices

### Do

- **Use `RenderProvider` for React apps** — it handles canvas mounting, lifecycle, and resize.
- **Use `getRef()` for imperative control** — scene manipulation, camera changes, quality switches.
- **Use `animateExposure` for transitions** — avoids jarring visual jumps.
- **Use `setQuality` for dynamic scaling** — automatically toggles bloom/fxaa/filmGrain/vignette/shadows.
- **Use `maxDelta: 0.1`** — prevents physics explosion when tab is backgrounded.
- **Dispose in correct order** — pipeline handles this automatically; manual dispose should follow: stop → post-processing → environment → renderer.

### Don't

- **Don't create multiple `RenderPipeline` instances** — one WebGLRenderer per canvas.
- **Don't touch `renderer.toneMapping` directly** — use `setToneMapping()` or `setExposure()`.
- **Don't allocate objects in `update()`** — reuse via mutation (Color, Vector2, etc.).
- **Don't skip `dispose()`** — WebGL contexts leak if not released.
- **Don't use `any` types** — the pipeline is strictly typed.
- **Don't modify files in `src/engine/scene/`** — that's the SceneManager, separate from this pipeline.

### Common Patterns

**Fade to black:**

```typescript
pipelineRef.animateExposure(0, 1.5); // fade out over 1.5s
// ... wait for transition ...
pipelineRef.setBackground("color", "#000000");
pipelineRef.animateExposure(1, 1.5); // fade in
```

**Dynamic quality based on FPS:**

```typescript
const state = pipeline.getState();
if (state.fps < 30 && state.quality !== "low") {
  const levels: QualityLevel[] = ["low", "medium", "high", "ultra"];
  const current = levels.indexOf(state.quality);
  pipeline.setQuality(levels[Math.max(0, current - 1)]);
}
```

**Conditional post-processing:**

```typescript
// Enable film grain only during specific moments
pipelineRef.setFilmGrainEnabled(isNightmareSequence);

// Pulse bloom intensity
pipelineRef.animateExposure(0.5, 0.1); // flash bright
setTimeout(() => pipelineRef.setExposure(1.0), 100);
```

---

## API Reference

### RenderPipeline

| Method | Description |
|--------|-------------|
| `initialize()` | Creates renderer, scene, camera, environment, post-processing |
| `start()` | Begins rAF loop |
| `stop()` | Cancels rAF loop |
| `update(delta)` | Manual frame update (if not using internal rAF) |
| `resize(w, h)` | Updates camera aspect, projection, renderer, composer |
| `dispose()` | Tears down everything in correct order |
| `getRef()` | Returns `RenderPipelineRef` for imperative control |
| `getScene()` | Returns the Three.js `Scene` |
| `getCamera()` | Returns the `PerspectiveCamera` |
| `getState()` | Returns `RenderPipelineState` (fps, drawCalls, etc.) |

### RenderPipelineRef

| Method | Description |
|--------|-------------|
| `getRenderer()` | Returns `WebGLRenderer` or null |
| `getScene()` | Returns `Scene` or null |
| `getCamera()` | Returns `PerspectiveCamera` |
| `getComposer()` | Returns `EffectComposer` or null |
| `setCamera(camera)` | Replaces the active camera and rebuilds post-processing |
| `setPixelRatio(ratio)` | Sets pixel ratio (`"auto"` or number) |
| `setQuality(level)` | Applies quality preset (low/medium/high/ultra) |
| `setToneMapping(mode)` | Sets tone mapping algorithm |
| `setExposure(value)` | Sets exposure instantly |
| `animateExposure(target, duration)` | Animates exposure over duration (seconds) |
| `setBackground(type, color)` | Sets scene background |
| `setFog(type, config?)` | Sets fog type and optional params |
| `setBloom(strength, radius, threshold)` | Sets bloom parameters |
| `setBloomEnabled(enabled)` | Toggles bloom |
| `setVignetteEnabled(enabled)` | Toggles vignette |
| `setFilmGrainEnabled(enabled)` | Toggles film grain |
| `setFXAAEnabled(enabled)` | Toggles FXAA |
| `addObject(object)` | Adds Object3D to scene |
| `removeObject(object)` | Removes Object3D from scene |
| `resize(w, h)` | Triggers resize |

### React Hooks

| Hook | Returns |
|------|---------|
| `useRenderer()` | `{ state, setPixelRatio, setToneMapping, setToneMappingExposure }` |
| `useEnvironment()` | `{ state, setBackground, setFog }` |
| `usePostProcessing()` | `{ state, setBloom, setBloomEnabled, setVignetteEnabled, setFilmGrainEnabled, setFXAAEnabled }` |
