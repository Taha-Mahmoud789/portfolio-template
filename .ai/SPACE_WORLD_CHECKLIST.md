# Space World — Implementation Checklist

Every item in this checklist must be completed before Space World is considered production-ready.

---

## World Identity

- [ ] World is called "Space World" — not "Space", not "Cosmic", not "Stellar"
- [ ] World personality is "The Astronaut" — weightless, vast, indifferent cosmos
- [ ] Emotional arc: Awe → Curiosity → Calm → Wonder → Infinity → Memory
- [ ] Cosmos-user relationship is defined: the universe is indifferent, the user is a witness
- [ ] World story is documented in component comments or README

---

## Configuration

- [ ] `WorldManifest` uses `id: "space-world"`
- [ ] `theme` references the space theme definition (`src/engine/theme/definitions/space.ts`)
- [ ] `route` is `/worlds/space`
- [ ] `layout.type` is `"fullscreen"`
- [ ] `animationPreset` is `"none"` (custom motion, not engine presets)
- [ ] `transitionPreset` is `"zoom-in"` (closest to singularity transition)
- [ ] `background.type` is `"gradient"` (CSS gradient, not image/video)
- [ ] `background.value` matches the void gradient from the color guide
- [ ] `background.fallbackColor` is `#030712`
- [ ] `cursor.type` is `"custom"`
- [ ] `cursor.size` is `8` (default), `24` (hover), `6` (click)
- [ ] `cursor.color` is `rgba(226, 232, 240, 0.9)`
- [ ] `cursor.blendMode` is `"screen"`
- [ ] `typography.headingFont` is `"Space Grotesk"`
- [ ] `typography.bodyFont` is `"Inter"`
- [ ] `typography.monoFont` is `"JetBrains Mono"`
- [ ] `status` is `"active"` or `"coming-soon"`

---

## File Organization

- [ ] All files live under `src/worlds/space-world/`
- [ ] One responsibility per file
- [ ] One responsibility per folder
- [ ] No duplicate utilities across files
- [ ] No duplicate hooks across files
- [ ] Barrel export in `index.ts`
- [ ] Types in `types/` folder
- [ ] World-specific hooks in `hooks/` folder
- [ ] World-specific components in `components/` folder
- [ ] No files outside the `space-world/` directory

---

## Folder Structure

```
src/worlds/space-world/
├── index.ts                    # Barrel exports
├── config.ts                   # WorldManifest configuration
├── types/                      # World-specific type definitions
│   └── index.ts
├── state/                      # World-specific Zustand store (if needed)
│   └── store.ts
├── hooks/                      # World-specific React hooks
│   └── index.ts
├── components/                 # World-specific components
│   ├── space-world.tsx         # Root component
│   ├── space-hero.tsx          # Hero section
│   ├── space-sections.tsx      # Content sections
│   └── ...
└── utils/                      # World-specific utilities (if needed)
    └── index.ts
```

---

## Root Component

- [ ] Root component is named `SpaceWorld`
- [ ] Root component imports and uses `BaseWorld` as its foundation
- [ ] Root component passes `worldId="space-world"`
- [ ] Root component passes `theme="space"`
- [ ] Root component passes `definition` (WorldDefinition from SDK factory)
- [ ] Root component passes `showHeader={true}`
- [ ] Root component passes `showBackground={true}`
- [ ] Root component passes `showOverlays={true}`
- [ ] Root component passes `enableAccessibility={true}`
- [ ] Root component renders `SpaceHero` as first child
- [ ] Root component renders `SpaceSections` after hero
- [ ] Root component does NOT render application UI (no nav, no footer, no sidebar)

---

## Colors — Hardcoded Values

- [ ] Background uses `#030712` (void) — not `#000000`, not `#09090b`
- [ ] Background variation uses `#0a0f1e` (void-subtle)
- [ ] Atmospheric fog uses `#1e1b4b` (void-deep)
- [ ] Panel backgrounds use `#0f172a` (surface)
- [ ] Interactive surfaces use `#1e293b` (surface-raised)
- [ ] Active/hover states use `#334155` (surface-active)
- [ ] Primary text uses `#e2e8f0` (stellar)
- [ ] Secondary text uses `#94a3b8` (stellar-dim)
- [ ] Tertiary text uses `#64748b` (stellar-faint)
- [ ] Disabled text uses `#475569` (stellar-ghost)
- [ ] Primary action color is `#6366f1` (nebula-primary)
- [ ] Secondary accent is `#a855f7` (nebula-secondary)
- [ ] Information color is `#06b6d4` (nebula-accent)
- [ ] Warm accent (rare) is `#ec4899` (nebula-rose)
- [ ] No pure `#000000` anywhere in the world
- [ ] No pure `#ffffff` anywhere in the world
- [ ] No warm colors (red, orange, yellow) except `nebula-rose` for rare emphasis

---

## Colors — Ratios

- [ ] 85% of viewport is void and surfaces (deep space darkness)
- [ ] 10% of viewport is nebula tints (atmospheric color)
- [ ] 3% of viewport is stellar text (readability)
- [ ] 2% of viewport is signal and glow (interaction)
- [ ] No more than 3 signal colors visible simultaneously

---

## Typography

- [ ] Body text uses Inter Variable at weight 200-300
- [ ] Headings use Space Grotesk
- [ ] Technical content uses JetBrains Mono
- [ ] No more than 3 typefaces in the world
- [ ] Body text tracking is `0.05em`
- [ ] Section heading tracking is `0.15em`
- [ ] Body text weight is 300
- [ ] Section heading weight is 200
- [ ] Body text line-height is 1.6
- [ ] Heading line-height is 1.1
- [ ] Maximum 55 characters per line for body text
- [ ] Paragraph spacing is 1.4em
- [ ] No justified text anywhere
- [ ] No all-caps paragraphs
- [ ] No decorative fonts for body text
- [ ] World titles animate letter by letter (50ms delay per letter)
- [ ] World titles emerge from blur (not fade-in)
- [ ] Coordinates and data use typewriter effect

---

## Layout

- [ ] Layout type is `"fullscreen"`
- [ ] Content density is sparse — maximum 3-4 content elements per viewport
- [ ] Generous whitespace between elements (the distance between stars)
- [ ] No grids without purpose
- [ ] No masonry layouts
- [ ] No fixed navigation bars
- [ ] No footers with social links
- [ ] No sidebars

---

## Background — Star Field

- [ ] Star field has three depth layers (near, mid, far)
- [ ] Near stars: bright, warm-white, 1-3px, twinkle at 1-2Hz
- [ ] Mid stars: dimmer, cool-white, 0.5-1.5px, twinkle at 0.5-1Hz
- [ ] Far stars: barely visible, blue-white, 0.5px, no twinkle
- [ ] Star density is 120 per viewport
- [ ] Star density increases toward lower-right (galactic center)
- [ ] Stars are parallax-responsive (near faster, far slower)
- [ ] Each star has individual twinkle frequency and phase
- [ ] Star field is `aria-hidden="true"`

---

## Background — Constellation System

- [ ] 7 constellations exist in the background
- [ ] Each constellation has a unique name and shape
- [ ] Constellation names: The Compass, The Voyager, The Beacon, The Frontier, The Relay, The Anchor, The Void
- [ ] Constellation lines are `rgba(99, 102, 241, 0.08)` — barely visible
- [ ] Constellation lines brighten to 15% when cursor approaches
- [ ] Constellation lines shift with scroll (parallax-responsive)
- [ ] Constellation labels appear at 5% opacity — readable only on close inspection
- [ ] Constellation lines are `aria-hidden="true"`

---

## Background — Nebula System

- [ ] Primary nebula: indigo-to-violet gradient, upper-left, 40% viewport
- [ ] Secondary nebula: cyan-to-teal gradient, lower-right, 25% viewport
- [ ] Nebulae drift at 0.15-0.2px/second
- [ ] Nebula gradients shift over 30-60 second cycles
- [ ] Nebulae are `aria-hidden="true"`

---

## Background — Dust Field

- [ ] 40-60 dust particles per viewport
- [ ] Dust particles are 1-2px diameter
- [ ] Dust color is `rgba(99, 102, 241, 0.15)`
- [ ] Dust uses `mix-blend-mode: screen`
- [ ] Dust drifts at 0.5-1px/second
- [ ] Dust direction is influenced by shared solar wind vector
- [ ] Dust is `aria-hidden="true"`

---

## Background — Depth Fog

- [ ] Near fog (0-100px): transparent
- [ ] Mid fog (100-300px): `rgba(10, 15, 30, 0.2)`
- [ ] Far fog (300-600px): `rgba(30, 27, 75, 0.3)`
- [ ] Deep fog (600px+): `rgba(3, 7, 18, 0.5)`
- [ ] Fog color shifts based on depth layer

---

## Background — Event Horizon

- [ ] Event horizon exists between Layer 2 (Stars) and Layer 3 (Structure)
- [ ] Event horizon is a visible line: 1px, `rgba(99, 102, 241, 0.1)`
- [ ] Event horizon separates cosmos from interface
- [ ] Content exists on the near side of the event horizon
- [ ] Universe exists on the far side

---

## Depth Layers

- [ ] Layer 0 (The Void): 0.1x speed, 100% opacity
- [ ] Layer 1 (The Atmosphere): 0.2x speed, 95% opacity
- [ ] Layer 2 (The Stars): 0.3x speed, 90% opacity
- [ ] Layer 3 (The Structure): 0.6x speed, 100% opacity
- [ ] Layer 4 (The Surface): 0.85x speed, 100% opacity
- [ ] Layer 5 (The Floating): 1.0x speed, 100% opacity
- [ ] Parallax speeds are applied correctly to each layer
- [ ] No blur applied to any layer (blur only in atmospheric entry animation)

---

## Glass

- [ ] Glass panels use `backdrop-filter: blur(24px) saturate(150%)`
- [ ] Glass background is `rgba(15, 23, 42, 0.6)`
- [ ] Glass has 1px border at `rgba(99, 102, 241, 0.12)`
- [ ] Glass has subtle noise texture (2% opacity)
- [ ] Glass catches light from stellar point source (gradient border)

---

## Shadows

- [ ] Elevation 0: no shadow
- [ ] Elevation 1: `0 2px 4px rgba(3, 7, 18, 0.4)`
- [ ] Elevation 2: `0 4px 12px rgba(3, 7, 18, 0.35)`
- [ ] Elevation 3: `0 8px 24px rgba(3, 7, 18, 0.3)`
- [ ] Elevation 4: `0 16px 48px rgba(3, 7, 18, 0.35)`
- [ ] Elevation 5: `0 32px 64px rgba(3, 7, 18, 0.4)`
- [ ] All shadows have indigo tint (cool-blue temperature)
- [ ] No shadow spread used anywhere
- [ ] No inset shadows used anywhere

---

## Glow

- [ ] Precision glow: 2-4px spread, 30-50% opacity (active, focus, selected)
- [ ] Atmospheric glow: 20-40px spread, 5-15% opacity (ambiance)
- [ ] Signal glow: 8-16px spread, 40-60% opacity (notifications, portals)
- [ ] Star glow: 4-8px spread, 20-40% opacity (stars, headings)
- [ ] Glow color is 20% lighter and 15% more saturated than element base
- [ ] Glow breathes: oscillates 80%-100% intensity over 3-5 seconds
- [ ] Each element has unique twinkle frequency and phase

---

## Bloom

- [ ] Star bloom: 4-8px gaussian blur, 20-30% opacity
- [ ] Signal bloom: 8-16px gaussian blur, 15-25% opacity
- [ ] Portal bloom: 16-32px gaussian blur, 30-50% opacity, pulsing
- [ ] Bloom intensity oscillates with luminosity breathing

---

## Noise

- [ ] Film grain covers every surface at 5% opacity
- [ ] Grain is monochrome
- [ ] Grain simulates cosmic microwave background
- [ ] Grain is applied as a CSS overlay (not an image)

---

## Motion — Physics

- [ ] Light elements (text, labels) move at 0.3x velocity
- [ ] Heavy elements (panels, sections) move at 0.15x velocity
- [ ] Elements coast — no instant stops
- [ ] Settling oscillation is 0.3px amplitude, 400ms duration
- [ ] Inertia carries elements 200-400ms after scroll stops
- [ ] Overshoot is 3-5px on drag release

---

## Motion — Timing

- [ ] Micro-feedback: 180ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- [ ] Hover response: 350ms, `cubic-bezier(0.33, 0, 0.2, 1)`
- [ ] Element entrance: 750ms, `cubic-bezier(0.16, 1, 0.3, 1)`
- [ ] Scene transition: 1200ms, `cubic-bezier(0.65, 0, 0.35, 1)`
- [ ] World transition: 2400ms, custom bezier
- [ ] Ambient drift: 8-15s, sinusoidal
- [ ] Scroll parallax: per-frame, `lerp(0.02-0.08)`

---

## Motion — Signature Animations

- [ ] Orbital Drift: 1-2px/second, random direction, shared solar wind vector
- [ ] Atmospheric Entry: 20% opacity → 100%, 4px below → final, 2px blur → 0, over 750ms
- [ ] Gravitational Settle: decaying sine wave, 0.3px amplitude, 400ms
- [ ] Nebula Wash: gradient shifts over 30-60 seconds, follows solar wind
- [ ] Star Twinkle: 85%-100% opacity oscillation, 3-5 seconds, unique per element

---

## Motion — Intent-Responsive

- [ ] Fast scroll (>800px/s): elements accelerate, 1px motion blur, event horizon brightens
- [ ] Slow scroll (<200px/s): full 0.3x weightlessness, all details visible
- [ ] No scroll: camera oscillates 0.5px over 8-12 seconds, cosmos is alive
- [ ] Rapid interaction (<200ms between clicks): micro-feedback accelerates to 100ms

---

## Motion — Scroll

- [ ] Orbital parallax: background 0.1x, midground 0.3x, foreground 0.5x
- [ ] Gravitational snap: 600ms deceleration at section boundaries
- [ ] Overscroll: exponential resistance at section boundaries
- [ ] Velocity as distance: fast = close (blur), slow = high orbit (sharp)

---

## Camera

- [ ] Camera pans 2-5px toward cursor (X-axis)
- [ ] Camera lags 2-3 frames behind fast scroll
- [ ] Camera drifts 200-400ms after scroll stops
- [ ] Camera oscillates 0.5px over 8-12 seconds when idle
- [ ] Camera rotation is ±2° maximum
- [ ] Zoom range is 0.8x to 2.0x
- [ ] Zoom-in has gravitational easing (acceleration)
- [ ] Zoom-out has gravitational easing (deceleration)

---

## Lighting

- [ ] Primary light: upper-left (315°), 9000K, 40% intensity
- [ ] Secondary light: ambient scatter, 12000K, 15% intensity
- [ ] Emissive elements generate their own light (glow, signals, stars)
- [ ] No warm light anywhere in the world
- [ ] All light sources are above 6500K

---

## Interactions — Hover

- [ ] Hover response within 150ms
- [ ] Element shifts 2-3px toward cursor
- [ ] Glow intensifies from 0% to 30%
- [ ] Layer 3: 3px shift, 30% glow
- [ ] Layer 4: 2px shift, 40% glow
- [ ] Layer 5: 1px shift, 50% glow
- [ ] Hover duration is 350ms
- [ ] Departure mirrors entrance (350ms return)
- [ ] Cursor influence range is 120px
- [ ] Only interactive elements respond to cursor gravity
- [ ] Static text does NOT respond to hover

---

## Interactions — Focus

- [ ] Focus ring: 2px outline, offset 3px, `nebula-primary` color
- [ ] Focus ring follows element border-radius
- [ ] Focus glow: 8px spread, 30% opacity, pulsing (80%-100% over 2 seconds)
- [ ] Focus sound: soft chime, spatialized to element position, fades over 500ms
- [ ] Focus appears only on `:focus-visible` (keyboard navigation)
- [ ] Focus does NOT appear on mouse click
- [ ] Tab order follows visual hierarchy
- [ ] Each tab stop triggers atmospheric entry animation

---

## Interactions — Selection

- [ ] Selection indicator: 2px glowing border, `nebula-primary`, subtle pulse
- [ ] Selection glow intensifies to 50%
- [ ] Selected element's orbital drift pauses
- [ ] Selection sound: metallic tone (magnetic capture)

---

## Interactions — Click

- [ ] Click feedback within 50ms
- [ ] Element compresses to 0.97-0.99 scale on mousedown
- [ ] Element returns to 1.0 scale on mouseup
- [ ] Subtle ripple emanates from click point (single ring, 300ms)
- [ ] Click sound: metallic tap, no reverb
- [ ] Action executes 100ms after click (commitment delay)

---

## Interactions — Portal

- [ ] Portal approach: glow intensifies, nearby elements drift toward portal
- [ ] Portal hover: pulsing frequency increases, accretion disk forms
- [ ] Portal hover: cursor decelerates (entering gravity well)
- [ ] Portal click: flash of destination world color, relativistic stretch
- [ ] Portal compression: world stretches toward portal, 600ms
- [ ] Portal void: complete darkness and silence, 400ms
- [ ] Portal expansion: new world erupts from singularity, 800ms
- [ ] Total portal duration: 2.8 seconds
- [ ] Portal sound: deep whoosh (200Hz-2kHz sweep over 600ms) + bright chime

---

## Loading

- [ ] Phase 1 (0-30%): particles appear from void, drift inward
- [ ] Phase 2 (30-70%): particles converge, energy lines connect
- [ ] Phase 3 (70-100%): cluster solidifies, structure breathes once
- [ ] Duration: 1.5-3 seconds
- [ ] Sound: low drone builds during phases 1-2, peaks at transition, fades
- [ ] Reduced motion: particles fade in simultaneously, structure appears

---

## Sound

- [ ] Ambient drone: 40-80Hz, always present at 3% volume
- [ ] Stellar wind: 8-12kHz hiss, 2-4% volume, shifts with nebula
- [ ] Gravitational chime: single note, low-pass filtered at 2kHz, spatialized, 5-8% volume
- [ ] Wormhole transit: 200Hz-2kHz sweep over 600ms + bright chime, 10-12% volume
- [ ] Metallic tap: no reverb, 8-10% volume
- [ ] Error: 200Hz-80Hz descend over 400ms, 6-8% volume
- [ ] Success: 400Hz-800Hz ascend over 300ms, 6-8% volume
- [ ] Master volume maximum: 15%
- [ ] Ambient drone ducks to 0% over 300ms during portal transition
- [ ] Ambient drone fades in over 1500ms on world load

---

## Sound-Motion Sync

- [ ] Element entrance: stellar wind hiss begins 100ms before visual
- [ ] Element exit: low drone fades with visual
- [ ] Hover approach: chime pitch rises as cursor approaches
- [ ] Click: metallic tap at peak compression
- [ ] Scroll start: ambient swell with scroll velocity
- [ ] Scroll stop: ambient decay over 500ms
- [ ] Portal approach: whoosh frequency follows portal glow
- [ ] Portal enter: single bass hit at moment of entry

---

## Browser Integration

- [ ] Default scrollbar is hidden
- [ ] Custom scrollbar: 4px wide, `rgba(99, 102, 241, 0.2)` track, `rgba(99, 102, 241, 0.5)` thumb
- [ ] Scrollbar thumb has 8px border-radius
- [ ] Scrollbar fades to 0% opacity after 2 seconds of no scroll
- [ ] Scrollbar reappears on scroll
- [ ] Text selection: `rgba(99, 102, 241, 0.3)` background, `#e2e8f0` foreground
- [ ] Text selection has subtle glow (2px, 10% opacity)
- [ ] Custom cursor: circle, 8px, `rgba(226, 232, 240, 0.9)`
- [ ] Cursor hover: expands to 24px with 1px border
- [ ] Cursor click: compresses to 6px
- [ ] Cursor follows mouse with 1-frame delay
- [ ] Full-screen mode requested on entry (with user permission)
- [ ] Browser chrome fades to 0% in full-screen
- [ ] Browser chrome fades back on exit

---

## Accessibility

- [ ] Skip link rendered: "Skip to main content"
- [ ] Skip link target: `#space-world-main`
- [ ] Main landmark: `role="main"` on content container
- [ ] Banner landmark: `role="banner"` on header
- [ ] All background elements are `aria-hidden="true"`
- [ ] All decorative elements are `aria-hidden="true"`
- [ ] Loading state has `aria-busy="true"` and `aria-label="Loading space world"`
- [ ] Error state has `role="alert"`
- [ ] Interactive elements have `aria-label`
- [ ] Portal has `role="link"` and `aria-label` describing destination
- [ ] Focus management: focus restored to correct element after transitions
- [ ] Keyboard navigation: all interactions available via keyboard
- [ ] Tab order follows visual hierarchy
- [ ] `prefers-reduced-motion` is respected:
  - [ ] Orbital drift is disabled
  - [ ] Atmospheric entry becomes simple fade
  - [ ] Star twinkle is disabled
  - [ ] Nebula wash is disabled
  - [ ] Camera oscillation is disabled
  - [ ] Gravitational settle is disabled
  - [ ] Ambient sound is reduced

---

## Performance

- [ ] Star field uses `requestAnimationFrame` for twinkle animation
- [ ] Dust particles use `requestAnimationFrame` for drift
- [ ] Nebula gradient shifts use CSS transitions (not JS)
- [ ] Parallax uses `transform: translateY()` (GPU-accelerated)
- [ ] Glow effects use `box-shadow` or `filter` (GPU-accelerated)
- [ ] Bloom uses `filter: blur()` (GPU-accelerated)
- [ ] No layout thrashing — all animations use transform and opacity only
- [ ] All effects are cleaned up on unmount
- [ ] All subscriptions are unsubscribed on unmount
- [ ] All timeouts are cleared on unmount
- [ ] Star field renders maximum 120 stars (not more)
- [ ] Dust field renders maximum 60 particles (not more)
- [ ] Constellation lines use `will-change: opacity` for performance

---

## Responsive

- [ ] Desktop (1200px+): full environment, all layers, all particles, all constellations
- [ ] Tablet (768-1199px): 60% particle count, reduced parallax, simplified nebula, 4 constellations
- [ ] Mobile (<768px): 30% particle count, no parallax, static nebula, 2 constellations
- [ ] Touch interactions replace hover on mobile
- [ ] Scroll snap works on mobile
- [ ] Custom cursor is hidden on touch devices

---

## Content

- [ ] No "About" section
- [ ] No "Projects" section
- [ ] No "Skills" section
- [ ] No "Contact" section
- [ ] No "Portfolio" section
- [ ] No application UI (no nav, no footer, no sidebar)
- [ ] Content is sparse — the cosmos is the primary visual
- [ ] Text feels like a transmission from mission control
- [ ] Maximum 3-4 content elements per viewport

---

## What NOT to Build

- [ ] NO generic portfolio grid
- [ ] NO standard navigation bar
- [ ] NO full-screen hero with centered text and button
- [ ] NO footer with social links
- [ ] NO sidebar navigation
- [ ] NO masonry grid
- [ ] NO centered single-column layout without depth
- [ ] NO generic hover effects (scale 1.05, opacity 0.8)
- [ ] NO spring animations on everything
- [ ] NO bounce easing on UI elements
- [ ] NO Material Design spinners
- [ ] NO gradient text
- [ ] NO more than 3 typefaces
- [ ] NO decorative fonts for body text
- [ ] NO all-caps paragraphs
- [ ] NO justified text
- [ ] NO hyphenation
- [ ] NO click-through targets smaller than 44px
- [ ] NO invisible focus rings
- [ ] NO keyboard traps
- [ ] NO animations that cannot be reduced
- [ ] NO sound that cannot be muted
- [ ] NO auto-playing video with sound
- [ ] NO cookie banners
- [ ] NO standard form inputs
- [ ] NO generic loading screens
- [ ] NO skeleton screens that look like loading bars
- [ ] NO standard cursor trails
- [ ] NO chat widgets
- [ ] NO pop-ups

---

## Validation Commands

Before marking any task complete, run:

- [ ] `npm run lint` — 0 errors
- [ ] `npm run typecheck` — 0 errors
- [ ] `npm run build` — builds successfully

---

## Sign-Off

- [ ] All checklist items completed
- [ ] All validation commands pass
- [ ] Space World feels weightless
- [ ] Space World feels vast
- [ ] Space World feels like the cosmos is indifferent — and that is beautiful
