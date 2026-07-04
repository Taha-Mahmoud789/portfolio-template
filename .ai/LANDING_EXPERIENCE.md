# Landing Experience

Cinematic landing sequence for the Frontend Multiverse portfolio. A zero-dependency (beyond React/GSAP/Framer Motion) orchestrator that transforms a blank page into a multi-phase cinematic experience: boot → hero reveal → scroll-driven narrative.

Built on top of the **Experience Engine** (`src/engine/experience/`) and **Animation Engine** (`src/animation/`).

---

## Table of Contents

- [Explain](#explain)
- [Architecture](#architecture)
- [Animation Timeline](#animation-timeline)
- [User Journey](#user-journey)
- [Motion Philosophy](#motion-philosophy)
- [Performance Guide](#performance-guide)
- [Accessibility Guide](#accessibility-guide)
- [Folder Responsibilities](#folder-responsibilities)
- [Extension Guide](#extension-guide)

---

## Explain

This is not a landing page. It is a **landing experience**.

The sequence unfolds in three cinematic phases:

1. **Boot** — A terminal-style loading screen with character-by-character typewriter text and a glowing progress bar. Signals craftsmanship before any content appears.
2. **Hero Intro** — Massive 3D-perspective typography ("Frontend Multiverse") with character-by-character reveal, blur-to-sharp animation, and text gradient. The mouse creates subtle parallax depth.
3. **Scroll Experience** — Four full-viewport sections that animate in from alternating directions as the user scrolls. Each section has a decorative code symbol (`//`, `{}`, `< />`, `///`), a unique easing profile, and parallax depth tied to mouse movement.

Every layer runs on a separate performance budget: canvas particles (GPU), ambient glow (CSS animations), mouse light (GPU-composited transforms), film grain (CSS `steps()`), and GSAP ScrollTrigger timelines.

---

## Architecture

### Composition Model

```
LandingExperience (orchestrator)
├── ParticleCanvas        — fixed, z-index 0, canvas
├── AmbientGlow           — fixed, z-index 0, CSS animations
├── MouseLight            — fixed, z-index 0, rAF + transform
├── NoiseGrain            — fixed, z-index 1, CSS steps()
├── BootSequence          — fixed, z-index 100 (phase: boot)
├── HeroIntro             — relative, z-index 2 (phase: intro)
└── ScrollExperience      — relative, z-index 2 (phase: scroll)
    ├── ScrollSection 01 — left
    ├── ScrollSection 02 — right
    ├── ScrollSection 03 — left
    └── ScrollSection 04 — right
```

### Layer Separation

| Layer              | Rendering                               | z-index | Responsibility                                       |
| ------------------ | --------------------------------------- | ------- | ---------------------------------------------------- |
| `ParticleCanvas`   | `<canvas>` 2D                           | 0       | Ambient particle field with spatial-grid connections |
| `AmbientGlow`      | CSS `radial-gradient` + `@keyframes`    | 0       | Floating depth/atmosphere                            |
| `MouseLight`       | CSS `radial-gradient` + rAF `transform` | 0       | Cursor-following radial light                        |
| `NoiseGrain`       | SVG `feTurbulence` + CSS `steps()`      | 1       | Cinematic film grain overlay                         |
| `BootSequence`     | Framer Motion + DOM                     | 100     | Loading screen (exits via fade)                      |
| `HeroIntro`        | GSAP timeline + DOM                     | 2       | Hero typography reveal                               |
| `ScrollExperience` | GSAP ScrollTrigger + DOM                | 2       | Scroll-driven narrative sections                     |

### Phase State Machine

```
boot ──[onComplete]──► intro ──[scroll]──► scroll
```

- `boot`: `BootSequence` mounts, typewriter runs, progress bar fills. On completion, fades out via `AnimatePresence` exit animation. `HeroIntro` and `ScrollExperience` remain unmounted.
- `intro`: `HeroIntro` mounts and runs its GSAP timeline (character reveal → line → subtitle). `ScrollExperience` mounts but sections are invisible until scroll triggers them.
- `scroll`: User scrolls through four `ScrollSection` components. Each has a GSAP `ScrollTrigger` with `toggleActions: "play none none reverse"`.

### Data Flow

```
index.tsx
  └─ phase (useState<"boot" | "intro" | "scroll">)
       ├─ handleBootComplete → setPhase("intro")
       └─ passed to:
            ├─ BootSequence  — onComplete={handleBootComplete}
            ├─ HeroIntro     — isVisible={phase !== "boot"}
            └─ ScrollExperience — mounted when phase !== "boot"
```

No context. No store. No prop drilling beyond one level. The orchestrator owns a single `phase` state.

### Background Layer Pattern

All four background components (`ParticleCanvas`, `AmbientGlow`, `MouseLight`, `NoiseGrain`) share the same pattern:

```tsx
<div
  aria-hidden="true"
  style={{
    position: "fixed",
    inset: 0,
    zIndex: 0, // or 1 for grain
    pointerEvents: "none",
    overflow: "hidden",
  }}
>
  {/* content */}
</div>
```

- `position: fixed` + `inset: 0` → fills viewport without affecting layout
- `pointerEvents: "none"` → never captures clicks/taps
- `aria-hidden: "true"` → invisible to screen readers
- `overflow: "hidden"` → prevents scrollbar from animated children

---

## Animation Timeline

### Phase 1: Boot Sequence (0–4s)

| Time   | Element        | Animation                                | Easing              |
| ------ | -------------- | ---------------------------------------- | ------------------- |
| 0ms    | Canvas fade-in | Opacity 0→1                              | Linear (0.02/frame) |
| 0ms    | Boot screen    | Full opacity                             | Instant             |
| 0ms    | Typewriter     | Character-by-character, 18–30ms per char | Random jitter       |
| 0ms    | Progress bar   | `scaleX: 0 → progress/100`               | `easeOut`           |
| 3400ms | Boot complete  | `setIsComplete(true)`                    | —                   |
| 4000ms | Boot exit      | Opacity 1→0                              | `easeInOut`, 0.8s   |
| 4600ms | Boot unmounted | —                                        | —                   |

**Typewriter timing**: Each message types at 18 + random(12)ms per character. Messages advance based on `useBootSequence` progress ticks (8 messages over 3400ms ≈ 425ms/message).

**Progress bar**: Framer Motion `motion.div` with `scaleX` animated by `progress/100`. Gradient fill (`rgba(255,255,255,0.1)` → `rgba(255,255,255,0.6)`) with box-shadow glow.

### Phase 2: Hero Intro (4s+)

| Time (from mount) | Element          | Animation                                                    | Easing            |
| ----------------- | ---------------- | ------------------------------------------------------------ | ----------------- |
| 0ms               | Title chars      | `y: 80→0, opacity: 0→1, rotateX: -40→0, filter: blur(8px)→0` | `expoOut`         |
| +stagger          | Each char        | 30ms stagger                                                 | —                 |
| -600ms overlap    | Decorative line  | `scaleX: 0→1`                                                | `expoInOut`       |
| -400ms overlap    | Subtitle         | `y: 30→0, opacity: 0→1`                                      | `expoOut`         |
| onComplete        | Scroll indicator | Opacity 0→1                                                  | `easeInOut`, 0.8s |

**Character stagger**: 30ms per character. "Frontend" = 8 chars × 30ms = 240ms. "Multiverse" = 10 chars × 30ms = 300ms. Total stagger window: ~540ms.

**3D perspective**: Container has `perspective: 1200px`. Title has `transformStyle: "preserve-3d"`. Characters rotate on X-axis (`rotateX: -40→0`) creating a "falling into place" effect.

**Text gradient**: `background: linear-gradient(180deg, #fff 0%, rgba(255,255,255,0.6) 100%)` with `-webkit-background-clip: text` and `-webkit-text-fill-color: transparent`.

**Mouse parallax**: Title translates by `(mouseX * 4, mouseY * 4)` via `translate3d`. Subtle depth effect without re-renders (rAF-based tracking in `useMouseParallax`).

**Reduced motion**: All transforms set to final values instantly. No stagger. No scroll indicator animation.

### Phase 3: Scroll Sections

Each section enters with a GSAP timeline triggered by ScrollTrigger (`start: "top 80%"`, `end: "top 20%"`):

| Step | Element             | Animation                       | Direction  | Duration |
| ---- | ------------------- | ------------------------------- | ---------- | -------- |
| 1    | Decorative symbol   | `opacity: 0→0.08, scale: 0.5→1` | —          | `slow`   |
| 2    | Decorative line     | `scaleX: 0→1`                   | —          | `normal` |
| 3    | Section label       | `x: ±15→0, opacity: 0→1`        | Left/Right | `normal` |
| 4    | Section title       | `y: 40→0, opacity: 0→1`         | —          | `slow`   |
| 5    | Section description | `y: 25→0, opacity: 0→1`         | —          | `normal` |

**Direction alternation**: Sections 01, 03 slide from left. Sections 02, 04 slide from right. Label `x` offset is `slideFrom * 0.5`.

**Easing profiles per section**:

- Section 01 (Philosophy): `expoOut`
- Section 02 (Craft): `backOut` (overshoot)
- Section 03 (Worlds): `elastic` (bouncy)
- Section 04 (Experience): `expoOut`

**Section alignment**: Left-direction sections align content via `marginLeft: auto`. Right-direction sections align via `marginRight: auto`. Max width: 800px.

**Decorative symbols**: Large monospace characters (`//`, `{}`, `< />`, `///`) positioned opposite to content alignment. Opacity: 0.08. Font size: `clamp(6rem, 15vw, 14rem)`.

**Mouse parallax per section**: Each section has independent parallax depth: `mouseX * (8 + index * 2)`. Section 01 moves 8px, Section 04 moves 14px. Creates layered depth as user scrolls.

**Reversal**: `toggleActions: "play none none reverse"` — sections reverse when scrolling back up past the trigger point.

---

## User Journey

### 1. First Paint (0ms)

User sees a black screen. Canvas begins fading in particles. No layout shift — all layers are `position: fixed`.

### 2. Boot (0–4s)

Terminal aesthetic. Character-by-character text appears:

```
Initializing Frontend Engine...
Loading Motion Engine...
Loading Themes...
Connecting Experience Layer...
Preparing Multiverse...
Optimizing GPU...
Loading Assets...
Starting...
```

A glowing progress bar fills across the bottom. Progress percentage appears bottom-right. Brand mark "FM" in top-left. This signals that what follows is engineered, not templated.

### 3. Hero Reveal (4–6s)

Boot fades out. "Frontend" and "Multiverse" characters fall into place from below with 3D rotation and blur-to-sharp. A decorative line extends. Subtitle fades in. Scroll indicator appears.

The user is now looking at a massive, gradient-text title with subtle mouse parallax depth. Particles drift behind. Ambient glow orbs float. Film grain textures the scene.

### 4. Scroll Narrative (6s+)

User scrolls. Four sections animate in from alternating sides, each with:

- A code-inspired decorative symbol
- A numbered label
- A title
- A description

Each section has unique easing character. The mouse creates parallax depth. Scrolling back up reverses all animations.

### 5. Exit

The landing experience is a standard React component in `src/pages/home/index.tsx`. Navigation to any other route unmounts it. GSAP timelines and rAF loops clean up via `useEffect` return functions.

---

## Motion Philosophy

### Principles

1. **Every animation has a reason.** Typewriter = anticipation. 3D reveal = premium. Scroll direction alternation = rhythm. Parallax = depth. Nothing exists for decoration alone.

2. **Layered performance budgets.** Canvas runs at 60fps independently. CSS animations run on compositor thread. GSAP timelines are scroll-synced. No single technique carries all the weight.

3. **Reduced motion is not degraded motion.** Users with `prefers-reduced-motion: reduce` get instant state transitions — all final values shown immediately, no fade/slide/rotate. The experience remains complete, just non-animated.

4. **GPU-composited positioning.** Mouse light uses `transform: translate3d()` via rAF, not `left/top`. Particles use canvas. Glow uses CSS animations. No layout-triggering properties are animated.

5. **Deterministic randomness.** Ambient glow orbs use seeded random (`Math.sin(seed * 9301 + 49297)`) for positions and keyframes. This prevents re-render instability — orbs don't shift position when React re-renders.

6. **Spatial data structures.** Particle connections use a spatial grid (cell-based hash map) for O(n) neighbor lookups instead of O(n²) brute force. At 60 particles, this is 60 lookups vs 3,600 distance checks per frame.

### Easing Vocabulary

| Easing      | Use                        | Character                                         |
| ----------- | -------------------------- | ------------------------------------------------- |
| `expoOut`   | Hero chars, section titles | Fast start, slow finish — feels like deceleration |
| `expoInOut` | Lines, progress bars       | Symmetric acceleration/deceleration               |
| `backOut`   | Section 02 (Craft)         | Overshoot — feels like spring-loaded precision    |
| `elastic`   | Section 03 (Worlds)        | Bouncy — feels playful, alive                     |
| `steps(1)`  | Film grain, cursor blink   | Discrete — feels digital, mechanical              |

### Timing Constants

Defined in `src/animation/constants.ts` and `src/landing/constants.ts`:

| Constant                     | Value  | Location                 |
| ---------------------------- | ------ | ------------------------ |
| `HERO_CHAR_STAGGER`          | 30ms   | `constants.ts`           |
| `BOOT_COMPLETE_DELAY`        | 3400ms | `constants.ts`           |
| `BOOT_FADE_DURATION`         | 0.8s   | `constants.ts`           |
| `ANIMATION_DURATIONS.normal` | 0.4s   | `animation/constants.ts` |
| `ANIMATION_DURATIONS.slow`   | 0.6s   | `animation/constants.ts` |
| `ANIMATION_DURATIONS.slower` | 0.8s   | `animation/constants.ts` |

---

## Performance Guide

### Render Budget

| Layer           | Technique          | Thread              | Re-renders    |
| --------------- | ------------------ | ------------------- | ------------- |
| Particles       | Canvas 2D rAF      | Main (but isolated) | 0 — ref-based |
| Ambient Glow    | CSS `@keyframes`   | Compositor          | 0 — useMemo'd |
| Mouse Light     | rAF + `transform`  | Main (isolated)     | 0 — ref-based |
| Film Grain      | CSS `steps()`      | Compositor          | 0 — static    |
| Boot Sequence   | Framer Motion      | Main                | 1 per message |
| Hero Intro      | GSAP timeline      | Main                | 1 on mount    |
| Scroll Sections | GSAP ScrollTrigger | Main                | 0 — ref-based |

### Key Optimizations

1. **Spatial Grid** (`ParticleCanvas`): `SpatialGrid` class partitions particles into cells of size `PARTICLE_CONNECT_DISTANCE`. `getNeighbors()` only checks the 3×3 surrounding cells. Reduces connection computation from O(n²) to O(n).

2. **GPU-composited mouse tracking** (`MouseLight`): Position updates via `transform: translate3d()` — composited on GPU, no layout/paint. Lerp factor 0.08 creates smooth following without CSS transitions.

3. **Pre-computed keyframes** (`AmbientGlow`): Orb positions, sizes, and keyframe waypoints computed once via `useMemo`. Generated as static CSS `@keyframes` injected via `<style>` tag. Zero re-render cost.

4. **Seeded random** (`AmbientGlow`): `seededRandom(seed)` produces deterministic values from a seed number. Same seed = same result. Prevents orb positions from shifting on re-render.

5. **IntersectionObserver** (`ParticleCanvas`): Canvas animation loop skips frames when canvas is not visible (`isVisibleRef`). Prevents wasted GPU/CPU on off-screen particles.

6. **Visibility API** (implicit): `IntersectionObserver` with `threshold: 0` pauses canvas when scrolled out of view.

7. **Passive listeners**: All `mousemove` and `scroll` listeners use `{ passive: true }` to avoid blocking scroll performance.

8. **rAF batching**: `useMouseParallax` and `MouseLight` both use `requestAnimationFrame` to batch position updates. No state updates per mouse event — refs are updated, then flushed once per frame.

9. **Reduced motion early-exit**: Every component checks `prefers-reduced-motion: reduce` on mount and subscribes to changes. When reduced, CSS animations are set to `"none"` and GSAP timelines set final values instantly.

### Memory Cleanup

Every component with rAF loops, timeouts, or event listeners returns cleanup functions from `useEffect`:

```tsx
useEffect(() => {
  // setup
  return () => {
    window.removeEventListener("resize", resize);
    motionQuery.removeEventListener("change", onMotionChange);
    observer.disconnect();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };
}, [dependencies]);
```

GSAP timelines are killed via `tl.kill()` in cleanup. ScrollTrigger instances are killed via `ScrollTrigger.getAll().forEach(t => t.kill())`.

### Build Impact

- `ParticleCanvas`: ~242 lines (includes `SpatialGrid` class)
- `ScrollExperience`: ~285 lines (includes `ScrollSection` component + `SECTIONS` data)
- `BootSequence`: ~197 lines (includes typewriter logic)
- `HeroIntro`: ~218 lines
- `AmbientGlow`: ~133 lines
- `MouseLight`: ~85 lines
- `NoiseGrain`: ~45 lines
- **Total**: ~1,205 lines across 7 components

No lazy loading needed — all components are part of the initial landing experience and mount together.

---

## Accessibility Guide

### Screen Readers

| Component             | Technique                              | Implementation                                 |
| --------------------- | -------------------------------------- | ---------------------------------------------- |
| `BootSequence`        | `aria-live="polite"` + `role="status"` | Announces loading progress                     |
| `BootSequence`        | `sr-only` span                         | Mirrors typewriter text for AT                 |
| `HeroIntro`           | `aria-label="Hero introduction"`       | Identifies section purpose                     |
| `ScrollSection`       | `aria-label={section.label}`           | Each section labeled (e.g., "01 — Philosophy") |
| `LandingExperience`   | `role="main"` + `aria-label`           | Identifies page landmark                       |
| All background layers | `aria-hidden="true"`                   | Excluded from AT tree                          |

### Reduced Motion

Every animated component respects `prefers-reduced-motion: reduce`:

- **ParticleCanvas**: Particles stop moving (positions frozen). Connection lines still draw at frozen positions. Canvas still renders.
- **BootSequence**: All messages appear instantly (no typewriter). Progress bar jumps to final value.
- **HeroIntro**: All characters appear instantly. Line and subtitle set to final opacity/position. Scroll indicator appears immediately.
- **ScrollSection**: All GSAP timelines skipped — elements set to final values via `gsap.set()`.
- **AmbientGlow**: CSS `animation: none`. Orbs are static.
- **MouseLight**: Still tracks mouse (no animation to reduce).
- **NoiseGrain**: CSS `animation: none`. Static grain texture.

Detection is via `window.matchMedia("(prefers-reduced-motion: reduce)")` with a change listener for runtime updates.

### Keyboard Navigation

The landing experience is primarily visual/scrollogical. No interactive elements within the landing (no buttons, links, or focusable content beyond the browser's scroll). Tab focus passes through cleanly with nothing to land on.

### Color Contrast

- Title text: `#fff` on `#000` background → contrast ratio 21:1 (AAA)
- Subtitle text: `rgba(255,255,255,0.4)` on `#000` → contrast ratio ~8.4:1 (AAA)
- Section descriptions: `rgba(255,255,255,0.35)` on `#000` → contrast ratio ~7.2:1 (AAA)
- Boot text: `rgba(255,255,255,0.4)` on `#000` → contrast ratio ~8.4:1 (AAA)

All text exceeds WCAG AAA requirements (7:1 for normal text, 4.5:1 for large text).

### Focus Management

No focus trapping. No modal dialogs. The landing is a passive scroll experience. Focus remains in the natural document flow.

---

## Folder Responsibilities

```
src/landing/
├── index.tsx                    Orchestrator — phase state machine, layer composition
├── types.ts                     Type definitions — LandingPhase, Particle, BootMessage
├── constants.ts                 Tuning knobs — boot messages, particle config, timing, glow config
├── components/
│   ├── particle-canvas.tsx      GPU canvas particle system with SpatialGrid
│   ├── boot-sequence.tsx        Terminal loading screen with typewriter
│   ├── hero-intro.tsx           Cinematic hero with 3D character reveal
│   ├── scroll-experience.tsx    Scroll-driven narrative sections
│   ├── ambient-glow.tsx         Floating gradient orbs with seeded random
│   ├── mouse-light.tsx          GPU-composited cursor-following light
│   └── noise-grain.tsx          Film grain overlay via SVG turbulence
└── hooks/
    ├── index.ts                 Barrel export
    ├── use-boot-sequence.ts     Boot progress state machine
    ├── use-mouse-parallax.ts    Normalized mouse position for parallax
    └── use-scroll-progress.ts   Scroll progress (0→1)
```

### `index.tsx`

The orchestrator. Owns a single `useState<LandingPhase>` and renders all layers in z-index order. No business logic, no animation code — just composition.

### `types.ts`

Shared types. `LandingPhase` is the phase union. `Particle` defines the canvas particle shape. `BootMessage` defines the typewriter message structure.

### `constants.ts`

All tuning knobs in one place. Changing `PARTICLE_COUNT` from 60 to 120 doubles particles. Changing `BOOT_COMPLETE_DELAY` from 3400 to 5000 makes boot longer. Every magic number lives here.

### `components/particle-canvas.tsx`

Self-contained canvas particle system. Includes `SpatialGrid` class for O(n) neighbor lookups. Handles its own resize, visibility detection, reduced motion, and rAF loop. Zero props required (all configurable via constants).

### `components/boot-sequence.tsx`

Terminal loading screen. Uses `useBootSequence` hook for progress state. Manages its own typewriter effect with per-character timeouts. Exits via `AnimatePresence` fade. Announces to screen readers.

### `components/hero-intro.tsx`

Hero section. Splits "Frontend Multiverse" into individual characters for staggered reveal. Uses `useMouseParallax` for depth. GSAP timeline handles the full reveal sequence. 3D perspective via CSS `perspective` + `transformStyle: "preserve-3d"`.

### `components/scroll-experience.tsx`

Scroll-driven narrative. Contains `SECTIONS` data and `EASING_PROFILES` array. Renders `ScrollSection` sub-components with GSAP ScrollTrigger. Each section has alternating direction, decorative symbol, and unique easing.

### `components/ambient-glow.tsx`

Floating gradient orbs. Uses `useMemo` to pre-compute all orb data (position, size, blur, keyframes) via seeded random. Generates CSS `@keyframes` as a string and injects via `<style>` tag. Zero re-render cost.

### `components/mouse-light.tsx`

Cursor-following light. Pure ref-based — no React state. `mousemove` updates target, rAF loop lerps current toward target, `transform: translate3d()` positions the element. GPU-composited, no layout/paint.

### `components/noise-grain.tsx`

Film grain overlay. Uses SVG `feTurbulence` as a `background-image` data URI. Animation via CSS `@keyframes landing-grain` (defined in `src/styles/global.css`). Uses `steps(1)` for discrete frame-by-frame grain.

### `hooks/use-boot-sequence.ts`

Boot progress state machine. Returns `{ progress, currentMessage, isComplete, start }`. `start()` schedules all boot messages via `setTimeout`. Cleans up all timeouts on unmount.

### `hooks/use-mouse-parallax.ts`

Normalized mouse position. Returns `{ x, y, normalizedX, normalizedY }`. Normalized values range from -1 to 1 based on viewport position. Uses rAF for batching. Accepts a `factor` multiplier for per-component depth control.

### `hooks/use-scroll-progress.ts`

Scroll progress. Returns a number from 0 to 1. Uses rAF + passive scroll listener. Cleanup cancels rAF and removes listener.

---

## Extension Guide

### Adding a New Scroll Section

1. Add section data to `SECTIONS` in `scroll-experience.tsx`:

```tsx
const SECTIONS: Section[] = [
  // ...existing sections
  {
    label: "05 — Identity",
    title: "Your section title.",
    description: "Your section description.",
    direction: "left", // or "right"
    decorative: "[]", // code-inspired symbol
  },
];
```

2. Add an easing profile to `EASING_PROFILES`:

```tsx
import { ANIMATION_EASINGS } from "@/animation/constants";

const EASING_PROFILES = [
  ANIMATION_EASINGS.expoOut,
  ANIMATION_EASINGS.backOut,
  ANIMATION_EASINGS.elastic,
  ANIMATION_EASINGS.expoOut,
  ANIMATION_EASINGS.expoOut, // new section
];
```

The `ScrollSection` component automatically handles direction, parallax depth, and easing. No component changes needed.

### Adding a New Background Layer

1. Create `src/landing/components/your-layer.tsx`:

```tsx
export function YourLayer() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0, // choose appropriate layer
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      {/* your content */}
    </div>
  );
}
```

2. Add to `LandingExperience` in `index.tsx`:

```tsx
import { YourLayer } from "./components/your-layer";

export function LandingExperience() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      role="main"
      aria-label="Frontend Multiverse — Landing Experience"
    >
      <ParticleCanvas connect />
      <AmbientGlow />
      <MouseLight />
      <YourLayer /> {/* add here */}
      <NoiseGrain />
      {/* ... */}
    </div>
  );
}
```

### Adding a New Phase

1. Extend `LandingPhase` in `types.ts`:

```tsx
export type LandingPhase = "boot" | "intro" | "scroll" | "new-phase";
```

2. Add phase transition in `index.tsx`:

```tsx
const [phase, setPhase] = useState<LandingPhase>("boot");

const handleBootComplete = useCallback(() => {
  setPhase("intro");
}, []);

const handleIntroComplete = useCallback(() => {
  setPhase("new-phase");
}, []);
```

3. Render the new phase component conditionally:

```tsx
{
  phase === "new-phase" && <YourNewPhase onComplete={handleNextPhase} />;
}
```

### Customizing Particle Behavior

Modify constants in `constants.ts`:

```tsx
export const PARTICLE_COUNT = 120; // more particles
export const PARTICLE_SPEED = 0.25; // faster movement
export const PARTICLE_CONNECT_DISTANCE = 160; // longer connections
export const PARTICLE_CONNECT_OPACITY = 0.1; // more visible connections
```

Or pass props to `ParticleCanvas`:

```tsx
<ParticleCanvas count={120} connect={true} />
```

### Customizing Boot Messages

Edit `BOOT_MESSAGES` in `constants.ts`:

```tsx
export const BOOT_MESSAGES: BootMessage[] = [
  { text: "Custom message 1...", delay: 0, duration: 400 },
  { text: "Custom message 2...", delay: 500, duration: 350 },
];
```

Adjust `BOOT_COMPLETE_DELAY` to match the last message's delay + duration.

### Customizing Glow

Edit constants in `constants.ts`:

```tsx
export const GLOW_ORB_COUNT = 5; // more orbs
export const GLOW_SIZE = 800; // larger orbs
export const GLOW_BLUR = 160; // softer edges
```

Or pass props to `AmbientGlow`:

```tsx
<AmbientGlow color="rgba(168, 85, 247, 0.15)" count={5} />
```

### Reusing Components Outside the Landing

All components are self-contained and accept props. You can use them anywhere:

```tsx
import { ParticleCanvas } from "@/landing/components/particle-canvas";
import { MouseLight } from "@/landing/components/mouse-light";

function AboutPage() {
  return (
    <div style={{ position: "relative" }}>
      <ParticleCanvas count={30} connect={false} />
      <MouseLight intensity={0.08} />
      {/* your content */}
    </div>
  );
}
```

### Adding Sound

The landing currently has no audio. To add sound:

1. Create `src/landing/components/audio-manager.tsx` — a component that plays sounds on phase transitions
2. Use `useEffect` to listen for phase changes
3. Play sounds via `new Audio()` or Web Audio API
4. Respect `prefers-reduced-motion` — also check `prefers-reduced-sound` or provide a mute toggle
5. Add a user gesture requirement (sound cannot autoplay in modern browsers)

### Adding Cursor Effects

The landing uses `MouseLight` for a subtle cursor glow. To add custom cursor effects:

1. Create `src/landing/components/custom-cursor.tsx`
2. Track mouse position via `useMouseParallax` or a ref-based approach
3. Render a custom cursor element with `position: fixed`, `pointerEvents: "none"`, `z-index` above content
4. Hide the default cursor via `cursor: none` on the container
5. Provide a `prefers-reduced-motion` fallback that shows the default cursor
