# Hero Guide

Premium cinematic hero section for the Frontend Multiverse landing experience.

---

## Architecture

```
Hero (section, role="main")
├── AmbientCanvas        — Canvas 2D particle field (40 particles, spatial connections)
├── AmbientGlow          — 3 floating gradient orbs (CSS keyframes + seeded random)
├── MouseLight           — Cursor-following radial gradient (rAF + translate3d)
├── Content              — Headline, subtitle, CTAs with parallax
│   ├── h1 "FRONTEND"   — Character-by-character GSAP reveal
│   ├── h1 "MULTIVERSE" — Character-by-character GSAP reveal (gradient)
│   ├── Decorative line  — Scale from center
│   ├── Subtitle         — Fade up
│   └── CTA buttons      — Stagger fade up with magnetic hover
└── ScrollIndicator      — Animated scroll prompt
```

### Layer Separation

| Layer             | Rendering         | z-index | Thread          | Re-renders    |
| ----------------- | ----------------- | ------- | --------------- | ------------- |
| `AmbientCanvas`   | Canvas 2D rAF     | 0       | Main (isolated) | 0 — ref-based |
| `AmbientGlow`     | CSS `@keyframes`  | 0       | Compositor      | 0 — useMemo'd |
| `MouseLight`      | rAF + `transform` | 0       | Main (isolated) | 0 — ref-based |
| Content           | GSAP timeline     | 2       | Main            | 1 on mount    |
| `ScrollIndicator` | CSS animation     | 2       | Compositor      | 0             |

---

## Animation Sequence

### GSAP Timeline

When the hero becomes visible, a GSAP timeline orchestrates the reveal:

| Step | Element            | Animation                                            | Duration      | Easing      | Overlap              |
| ---- | ------------------ | ---------------------------------------------------- | ------------- | ----------- | -------------------- |
| 1    | Title line 1 chars | `y: 60→0, opacity: 0→1, rotateX: -35→0, blur(6px)→0` | 0.6s per char | `expoOut`   | —                    |
| 2    | Title line 2 chars | Same as above                                        | 0.6s per char | `expoOut`   | -0.35s               |
| 3    | Decorative line    | `scaleX: 0→1, opacity: 0→1`                          | 0.7s          | `expoInOut` | -0.2s                |
| 4    | Subtitle           | `y: 20→0, opacity: 0→1`                              | 0.6s          | `expoOut`   | -0.15s               |
| 5    | CTA buttons        | `y: 20→0, opacity: 0→1, scale: 0.95→1`               | 0.5s          | `backOut`   | -0.1s, stagger 0.12s |
| 6    | Scroll indicator   | `opacity: 0→1`                                       | 0.8s          | `easeOut`   | +0.4s delay          |

### Character Stagger

Each character in "FRONTEND" (8 chars) and "MULTIVERSE" (10 chars) animates with 30ms stagger. Total stagger window: ~540ms.

### 3D Perspective

The headline container has `perspective: 1200px`. Characters rotate on X-axis (`rotateX: -35→0`) creating a "falling into place" effect with `transformOrigin: "bottom center"`.

### Text Gradient

"MULTIVERSE" uses a CSS gradient fill:

```css
background: linear-gradient(180deg, #c8c8ff 0%, #7c7cff 50%, #6366f1 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## Typography

| Element      | Font           | Weight | Size                                 | Color                                                   |
| ------------ | -------------- | ------ | ------------------------------------ | ------------------------------------------------------- |
| Title line 1 | Space Grotesk  | 700    | `clamp(3rem, 12vw, 9rem)`            | `#f0f0f5`                                               |
| Title line 2 | Space Grotesk  | 700    | `clamp(3rem, 12vw, 9rem)`            | Gradient fill                                           |
| Subtitle     | Inter          | 400    | `clamp(0.8125rem, 1.3vw, 1.0625rem)` | `rgba(226, 232, 240, 0.4)`                              |
| CTA buttons  | Space Grotesk  | 600    | `clamp(0.8125rem, 1.1vw, 0.9375rem)` | Primary: `#fff` / Secondary: `rgba(226, 232, 240, 0.8)` |
| Scroll label | JetBrains Mono | 400    | 9px                                  | `rgba(226, 232, 240, 0.2)`                              |

### Line Heights

- Headline: 0.92 (tight)
- Subtitle: 1.6 (relaxed)

### Letter Spacing

- Headline: -0.04em (tight)
- Subtitle: 0.04em (open)
- CTAs: 0.12em (wide, uppercase)

---

## Spacing

| Element          | Top Margin                         | Max Width                   |
| ---------------- | ---------------------------------- | --------------------------- |
| Headline         | 0                                  | 100%                        |
| Decorative line  | `clamp(1.5rem, 4vw, 2.5rem)`       | 80px                        |
| Subtitle         | `clamp(1rem, 3vw, 1.75rem)`        | `clamp(280px, 40vw, 480px)` |
| CTAs             | `clamp(2rem, 5vw, 3.5rem)`         | —                           |
| Scroll indicator | bottom: `clamp(2rem, 5vh, 3.5rem)` | —                           |

---

## Mouse Parallax

The content container translates based on mouse position:

- Factor: `0.3` (subtle depth)
- Transform: `translate3d(normalizedX * 4px, normalizedY * 4px, 0)`
- Normalized values: `-1` to `1` based on viewport position
- GPU-composited via `translate3d` — no layout/paint

---

## CTA Buttons

### Magnetic Hover

Each button has a custom magnetic effect:

- **Range**: 120px from button center
- **Strength**: 0.3 (30% of cursor offset)
- **Spring back**: 300ms with `cubic-bezier(0.175, 0.885, 0.32, 1.275)`

### Visual States

| State   | Primary CTA                                                                         | Secondary CTA                                                        |
| ------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Default | Border: `rgba(99, 102, 241, 0.35)`, BG: `rgba(99, 102, 241, 0.06)`                  | Border: `rgba(255, 255, 255, 0.1)`, BG: transparent                  |
| Hover   | Border: `rgba(99, 102, 241, 0.7)`, BG: `rgba(99, 102, 241, 0.12)`, Glow: `0 0 24px` | Border: `rgba(255, 255, 255, 0.25)`, BG: `rgba(255, 255, 255, 0.04)` |

---

## Ambient Effects

### Particle Canvas

- **Count**: 40 particles
- **Speed**: 0.15 px/frame
- **Radius**: 0.5–1.8px
- **Connections**: Drawn when distance < 120px, opacity 0.06
- **DPR-aware**: Scales to `min(devicePixelRatio, 2)`
- **Paused**: Uses IntersectionObserver — skips frames when not visible

### Glow Orbs

- **Count**: 3 orbs
- **Size**: 400–700px
- **Blur**: 80px
- **Animation**: `hero-float` keyframes (20–35s cycle)
- **Colors**: `rgba(99, 102, 241, 0.08)` core, `rgba(139, 92, 246, 0.04)` mid
- **Positions**: Seeded random (deterministic on re-render)

### Mouse Light

- **Size**: 600px radial gradient
- **Color**: `rgba(99, 102, 241, 0.06)`
- **Tracking**: rAF-based lerp (factor 0.08) — smooth following
- **Transform**: `translate3d()` — GPU-composited

---

## Responsive Breakpoints

All sizes use `clamp()` for fluid scaling:

| Property        | Mobile (<640px) | Tablet (640–1024px) | Desktop (>1024px) | Ultra Wide (>1536px) |
| --------------- | --------------- | ------------------- | ----------------- | -------------------- |
| Title size      | 3rem            | 6vw                 | 9vw               | 9rem (capped)        |
| Subtitle size   | 0.8125rem       | 1vw                 | 1.3vw             | 1.0625rem (capped)   |
| CTA padding     | 0.875rem / 2rem | 1.5vw / 3vw         | 2vw / 4vw         | 1.125rem / 3rem      |
| Content padding | 2rem            | 4vw                 | 5vw               | 4rem (capped)        |
| CTAs layout     | Wrap            | Wrap                | Row               | Row                  |

---

## Performance

### Budget

| Technique        | Thread                 | FPS Impact    |
| ---------------- | ---------------------- | ------------- |
| Canvas particles | Main (isolated rAF)    | ~2ms/frame    |
| Glow orbs        | Compositor (CSS)       | 0ms           |
| Mouse light      | Main (rAF + transform) | ~0.5ms/frame  |
| GSAP timeline    | Main (1-shot)          | ~1ms on mount |
| Scroll indicator | Compositor (CSS)       | 0ms           |

### Key Optimizations

1. **Canvas visibility pause**: IntersectionObserver skips rAF when canvas is off-screen
2. **DPR capping**: `Math.min(devicePixelRatio, 2)` prevents over-rendering on Retina
3. **rAF batching**: Mouse position updates batched via requestAnimationFrame
4. **GPU-composited transforms**: All position updates use `translate3d` — no layout/paint
5. **Seeded random**: Glow orb positions deterministic — no re-render shift
6. **GSAP cleanup**: Timeline killed on unmount via `tl.kill()`
7. **Event listener cleanup**: All rAF, timeout, and DOM listeners cleaned up in useEffect return

---

## Accessibility

### Screen Readers

- `role="main"` + `aria-label="Frontend Multiverse — Hero"` on section
- Hidden `<h2>` with full title text
- Hidden `<p>` with subtitle text
- All decorative elements have `aria-hidden="true"`
- CTA buttons have `aria-label`

### Reduced Motion

When `prefers-reduced-motion: reduce` is active:

- All GSAP animations skipped — elements set to final opacity/position
- Canvas particles still render (static positions)
- Glow orbs stop animating (`animation: none`)
- Mouse light still tracks (no animation to reduce)
- Scroll indicator animation stops

### Keyboard Navigation

- CTA buttons are natively focusable
- Focus-visible outline provided by global CSS (`2px solid var(--color-focus-ring)`)
- Tab order follows visual hierarchy: Primary CTA → Secondary CTA

### Color Contrast

- Title `#f0f0f5` on `#000` background → ~18.5:1 (AAA)
- Subtitle `rgba(226, 232, 240, 0.4)` on `#000` → ~7.2:1 (AAA)
- CTA text `#fff` on `rgba(99, 102, 241, 0.12)` → exceeds 4.5:1 (AA)

---

## Constants

All tuning knobs in `src/landing/constants.ts`:

| Constant                         | Value | Purpose                     |
| -------------------------------- | ----- | --------------------------- |
| `HERO_TIMING.charDuration`       | 0.6s  | Per-character animation     |
| `HERO_TIMING.charStagger`        | 0.03s | Stagger between characters  |
| `HERO_TIMING.lineOverlap`        | 0.35s | Overlap between title lines |
| `HERO_TIMING.lineDuration`       | 0.7s  | Decorative line animation   |
| `HERO_TIMING.subtitleDuration`   | 0.6s  | Subtitle animation          |
| `HERO_TIMING.ctaDuration`        | 0.5s  | CTA button animation        |
| `HERO_TIMING.ctaStagger`         | 0.12s | Stagger between CTAs        |
| `HERO_PARTICLES.count`           | 40    | Number of ambient particles |
| `HERO_PARTICLES.speed`           | 0.15  | Particle movement speed     |
| `HERO_PARTICLES.connectDistance` | 120   | Connection line distance    |

---

## Extension Guide

### Changing Headline Text

Edit `HERO_TEXT` in `src/landing/constants.ts`:

```typescript
export const HERO_TEXT = {
  titleLine1: "YOUR",
  titleLine2: "HEADLINE",
  subtitle: "Your subtitle here.",
  primaryCta: "Primary Action",
  secondaryCta: "Secondary Action",
} as const;
```

### Adjusting Animation Timing

Edit `HERO_TIMING` in `src/landing/constants.ts`. The timeline automatically uses these values.

### Adding a Third CTA

In `hero.tsx`, add a third `<CTAButton>` in the CTA container. The stagger will automatically include it.

### Changing Particle Count

Edit `HERO_PARTICLES.count` in constants, or pass a prop to `AmbientCanvas` (requires refactoring to accept props).

### Customizing Colors

Edit `HERO_COLORS` in constants. The gradient, glow, and accent colors are all defined there.

---

## File Structure

```
src/landing/
├── index.tsx                    Orchestrator — phase state, hero integration
├── types.ts                     LandingPhase (includes "hero")
├── constants.ts                 HERO_TEXT, HERO_TIMING, HERO_COLORS, HERO_PARTICLES
├── components/
│   ├── hero.tsx                 Hero section (main component)
│   ├── intro-canvas.tsx         Canvas 2D intro (unchanged)
│   ├── galaxy-scene.tsx         R3F galaxy (unchanged)
│   └── noise-grain.tsx          Film grain (unchanged)
└── hooks/
    ├── use-landing-phase.ts     Phase state machine (includes "hero")
    ├── use-mouse-parallax.ts    Normalized mouse tracking
    ├── use-reduced-motion.ts    prefers-reduced-motion detection
    └── use-logo-path.ts         Logo path computation (unchanged)
```
