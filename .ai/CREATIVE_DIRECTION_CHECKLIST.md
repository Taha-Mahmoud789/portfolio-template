# Creative Direction Checklist

Use this checklist before every design decision, component creation, and animation implementation.

---

## Before You Start

- [ ] Read `CREATIVE_DIRECTION.md` in full
- [ ] Understand which world you are building for
- [ ] Know the world's personality, motion, color, and sound
- [ ] Confirm the decision aligns with the 8 design principles

---

## Materials

### Matte Black Void

- [ ] Background is not pure black — it is #09090b (warm void) or #0a0e1a (cool void)
- [ ] Background has subtle noise overlay (1-3% opacity, monochrome)
- [ ] Background is never perfectly still — breathing motion at 0.1Hz

### Frosted Glass

- [ ] Glass uses `backdrop-filter: blur(24px) saturate(150%)`
- [ ] Glass background is rgba(255,255,255,0.03-0.08)
- [ ] Glass has 1px border with rgba(255,255,255,0.06-0.12)
- [ ] Glass has internal highlight gradient (top-left to bottom-right)
- [ ] Glass moves — not visibly, but perceptibly

### Liquid Metal

- [ ] Accent surfaces reflect and distort their environment
- [ ] Metal catches light and holds it
- [ ] Metal feels heavy even when weightless

### Raw Concrete

- [ ] Some surfaces are unfinished
- [ ] Texture is visible
- [ ] Imperfection is celebrated, not hidden

### Brushed Aluminum

- [ ] Interactive elements feel cool to the touch
- [ ] Elements have weight
- [ ] Elements resist before they yield

---

## Depth System

### Layer Hierarchy

- [ ] Layer 0 (Void): deepest background, where light dies
- [ ] Layer 1 (Atmosphere): fog, ambient particles, distant elements
- [ ] Layer 2 (Structure): cards, panels, containers
- [ ] Layer 3 (Surface): interactive elements, buttons, controls
- [ ] Layer 4 (Floating): tooltips, modals, portals
- [ ] Layer 5 (Cursor): user's hand in this space

### Layer Behavior

- [ ] Each layer has different parallax speed
- [ ] Each layer has different blur level
- [ ] Each layer has different opacity
- [ ] Depth is created through atmospheric perspective, not just shadow

### Texture and Grain

- [ ] Noise overlay covers every surface (1-3% opacity)
- [ ] Glass panels have microscopic imperfections
- [ ] Matte surfaces have barely-visible tooth
- [ ] Even the void has texture
- [ ] Elements have radius (2-4px small, 8-12px cards, 16-24px panels)
- [ ] Radius is not always uniform — corners can differ

---

## Restraint

### Before Adding an Element

- [ ] Ask: "Does this need to exist?"
- [ ] Ask: "Does this serve the same purpose as something already present?"
- [ ] Confirm: If yes to the second question, one of them is removed

### Space

- [ ] White space is treated as expensive
- [ ] Every empty area is a design decision
- [ ] The measure is maximum 60 characters per line

### Animation

- [ ] Every animation earns its existence
- [ ] Animation is not free — each one has a cost
- [ ] No animation exists without purpose

### Color

- [ ] 90% of the interface is neutral (void, surfaces, text)
- [ ] 8% is world-specific color (subtle tints, atmospheric gradients)
- [ ] 2% is signal color (actions, feedback, emphasis)
- [ ] When color appears, it means something

---

## Motion

### The Physics Engine

- [ ] Every element has mass, friction, and inertia
- [ ] Light elements respond quickly
- [ ] Heavy elements resist movement
- [ ] Elements decelerate — the final 20% is where magic lives
- [ ] When the user stops, elements continue to drift (inertia)

### Timing Signature

- [ ] Micro-feedback: 120ms, cubic-bezier(0.25, 0.1, 0.25, 1)
- [ ] Hover response: 200ms, cubic-bezier(0.33, 0, 0.2, 1)
- [ ] Element entrance: 500ms, cubic-bezier(0.16, 1, 0.3, 1)
- [ ] Scene transition: 800ms, cubic-bezier(0.65, 0, 0.35, 1)
- [ ] World transition: 1200ms, custom bezier
- [ ] Ambient drift: 4-8s, sinusoidal
- [ ] Scroll parallax: per-frame, lerp(0.05-0.15)

### Signature Motions

- [ ] **Breathing Void:** Background pulses at 0.1Hz — barely perceptible
- [ ] **Weighted Settle:** Last 50ms of transition has 0.5px oscillation
- [ ] **Atmospheric Entry:** Elements emerge from blur, not fade
- [ ] **Portal Implosion:** World collapses toward portal point
- [ ] **Magnetic Cursor:** Cursor lags 1-2 frames, influences nearby elements

### Hover

- [ ] Response within 150ms
- [ ] Response is a shift, not a highlight
- [ ] Elements at different layers respond with different intensity
- [ ] Duration matches element's perceived weight
- [ ] Departure mirrors entrance (symmetry)

### Scroll

- [ ] Scroll is cinematography, not navigation
- [ ] Each section is a scene
- [ ] Parallax depth creates spatial hierarchy
- [ ] Scroll velocity influences animation speed
- [ ] Scroll snap decelerates over 400ms
- [ ] Overscroll creates elastic resistance
- [ ] Animations fire at 30% visibility, not 0%

### Click

- [ ] Feedback within 50ms
- [ ] Elements compress 0.97-0.99 on mousedown
- [ ] Subtle ripple emanates from click point
- [ ] 100ms delay before action executes (acknowledgment)

### Drag

- [ ] Element lifts on drag (shadow, scale, rotation)
- [ ] Element follows cursor with 2-frame delay
- [ ] Drop zones highlight with elevation, not color
- [ ] Successful drop settles with 200ms spring
- [ ] Failed drop returns to origin over 400ms

### Focus

- [ ] Focus ring is 2px outline, offset 2px
- [ ] Focus ring follows element's border-radius
- [ ] Focus glow: 4px spread, 30% opacity
- [ ] Focus appears only on keyboard navigation (`:focus-visible`)
- [ ] Tab order follows visual hierarchy

### Transitions

- [ ] Enter transitions are 1.5x slower than exit transitions
- [ ] Multiple elements are staggered (30-50ms between each)
- [ ] Major state changes include a void moment (100-200ms)
- [ ] Every transition ends with a settle

---

## Portal Choreography

### 6-Stage Sequence

- [ ] **Recognition (200ms):** Portal sharpens, center brightens
- [ ] **Attraction (300ms):** Portal pulses, cursor is pulled
- [ ] **Commitment (150ms):** Click absorbs, flash of destination color
- [ ] **Implosion (400ms):** Current world collapses toward portal
- [ ] **Void (200ms):** Darkness, silence, space between worlds
- [ ] **Explosion (500ms):** New world erupts from portal point

### Total Duration

- [ ] 1.75 seconds — long enough to feel significant, short enough to not feel slow

---

## Typography

### Font Usage

- [ ] **Inter Variable:** Body text, UI elements, general content
- [ ] **Clash Display:** Headlines, world titles, moments of impact
- [ ] **Instrument Serif:** Warmth, craft, human touch (used rarely)
- [ ] **JetBrains Mono:** Code, technical content, Brutalist/AI worlds

### Scale

- [ ] Scale follows perfect fourth ratio (1.333)
- [ ] xs: 0.75rem — labels, metadata
- [ ] sm: 0.875rem — captions, secondary text
- [ ] base: 1rem — body text
- [ ] lg: 1.125rem — large body, small headings
- [ ] xl: 1.333rem — section headings
- [ ] 2xl: 1.777rem — page headings
- [ ] 3xl: 2.369rem — display
- [ ] 4xl: 3.157rem — hero
- [ ] 5xl: 4.209rem — statement
- [ ] 6xl: 5.61rem — world title
- [ ] 7xl: 7.478rem — monument

### Rhythm

- [ ] Measure: maximum 60 characters per line
- [ ] Leading: body 1.5, headings 1.1-1.2, display 1.0 or tighter
- [ ] Tracking: headings -0.03em, body 0, labels +0.08em, mono 0
- [ ] Paragraph spacing: 1.2em (not 1.5)
- [ ] No orphan lines — entire paragraph moves if one line would orphan

### Typographic Moments

- [ ] World titles: letter-by-letter, 30ms delay, materialize from blur
- [ ] Loading text: weight cycles 300→500→300 in wave
- [ ] Error messages: horizontal shake (3px left, 2px right, 1px left)
- [ ] Success states: microscopic 0.5% scale expansion

---

## Color

### Void Palette

- [ ] --void: #09090b (matte black)
- [ ] --void-warm: #0c0a09 (organic black)
- [ ] --void-cool: #0a0e1a (deep space)
- [ ] --surface-1: #18181b (first elevation)
- [ ] --surface-2: #27272a (second elevation)
- [ ] --surface-3: #3f3f46 (third elevation)
- [ ] --surface-4: #52525b (fourth elevation)

### Signal Colors

- [ ] --signal-primary: #3b82f6 (electric blue)
- [ ] --signal-secondary: #f97316 (warm coral)
- [ ] --signal-success: #22c55e (forest green)
- [ ] --signal-warning: #eab308 (golden yellow)
- [ ] --signal-error: #ef4444 (arterial red)
- [ ] --signal-info: #06b6d4 (cyan)

### Neutral Gradient

- [ ] Headings: #fafafa → #e2e8f0 (warm to cool)
- [ ] Body: #d4d4d8 → #a1a1aa (neutral to cool)
- [ ] Secondary: #a1a1aa → #71717a (cool to muted)
- [ ] Disabled: #52525b → #3f3f46 (barely visible)

### World Color Signatures

- [ ] Apple: #fafafa / #f5f5f7 / #0071e3 (warm neutral)
- [ ] Cyberpunk: #0a0a0f / #7c3aed / #00ff88 (cold electric)
- [ ] Space: #0a0f1a / #1e3a5f / #60a5fa (deep cold)
- [ ] Gaming: #0f172a / #2563eb / #f59e0b (dark electric)
- [ ] AI: #1e1b4b / #06b6d4 / #a855f7 (cool mystery)
- [ ] Editorial: #fafaf9 / #f5f5dc / #1a1a1a (warm classic)
- [ ] Liquid: #e0f2fe / #0d9488 / #38bdf8 (cool fluid)
- [ ] Retro: #fef3c7 / #f59e0b / #78350f (warm nostalgic)
- [ ] Brutalist: #fafafa / #d1d5db / #000000 (raw neutral)
- [ ] Experimental: #0a0a0f / gradient / spectrum (shifting)

### Glass System

- [ ] Frosted: blur(24px) saturate(150%) on rgba(255,255,255,0.05)
- [ ] Clear: blur(12px) on rgba(255,255,255,0.02)
- [ ] Tinted: frosted + 5% world color overlay
- [ ] Edge light: 1px border rgba(255,255,255,0.08)
- [ ] Internal highlight: gradient from top-left to transparent

### Gradient Rules

- [ ] Background gradients: 2-3 stops, 30-60s animation, max 15% saturation
- [ ] Text gradients: FORBIDDEN
- [ ] Border gradients: 2 stops, 90° or 135° angle
- [ ] Mesh gradients: encouraged for world backgrounds

### Glow Rules

- [ ] Precision: 2-4px spread, 20-40% opacity
- [ ] Atmospheric: 20-40px spread, 5-15% opacity
- [ ] Signal: 8-16px spread, 30-50% opacity
- [ ] Color: always 20% lighter and 10% more saturated than element
- [ ] Animation: can breathe 80-100% over 2-3 seconds

---

## Lighting

### Light Sources

- [ ] Primary: top-left, 45°, warm white (3000K)
- [ ] Secondary: bottom-right, cool blue (6500K)
- [ ] Ambient: 40% intensity, neutral
- [ ] Emissive: screens, glows, signals (only self-lit elements)

### Shadow System

- [ ] Level 0: none
- [ ] Level 1: 0 1px 2px rgba(0,0,0,0.3)
- [ ] Level 2: 0 4px 8px -1px rgba(0,0,0,0.25)
- [ ] Level 3: 0 12px 16px -2px rgba(0,0,0,0.3)
- [ ] Level 4: 0 24px 32px -4px rgba(0,0,0,0.35)
- [ ] Level 5: 0 48px 64px -8px rgba(0,0,0,0.4)
- [ ] Shadows are always slightly warm (+5% orange)
- [ ] Never use spread — it looks artificial
- [ ] Never use inset — it breaks depth illusion

### Atmospheric Perspective

- [ ] Distance 1: 95% opacity, 100% saturation
- [ ] Distance 2: 85% opacity, 90% saturation
- [ ] Distance 3: 70% opacity, 80% saturation
- [ ] Distance 4: 50% opacity, 70% saturation
- [ ] Distance 5: 30% opacity, 60% saturation
- [ ] Fog color matches world's temperature

---

## Cursor

### Default

- [ ] Circle, 8px diameter
- [ ] rgba(255,255,255,0.9) fill, no border
- [ ] 1-frame follow delay

### States

- [ ] Hover interactive: 24px circle, border appears
- [ ] Hover text: standard I-beam, transparent
- [ ] Click: 6px circle, compresses 25%, springs back in 200ms
- [ ] Drag: 16px grabbed circle, trails 2-3 frames, elevated shadow
- [ ] Loading: 20px ring, rotates at 1Hz, pulsing opacity
- [ ] Portal proximity: 32px pulsing circle

### Magnetic Behavior

- [ ] Range: 120px from cursor center
- [ ] Force: 1-4px displacement, proportional to proximity
- [ ] Easing: 200ms spring with damping 12
- [ ] Targets: buttons, links, interactive elements respond
- [ ] Static text does not respond
- [ ] Cursor decelerates slightly over interactive elements

### Cursor Color

- [ ] Default: white at 90% opacity
- [ ] Over dark surface: white at 90% opacity
- [ ] Over light surface: black at 90% opacity
- [ ] Over accent: accent color at 80% opacity
- [ ] Over glass: glass tint at 70% opacity

---

## Sound

### Design Principles

- [ ] Sound is felt more than heard
- [ ] Sound has direction and distance
- [ ] Sounds are derived from physical interactions
- [ ] Sound accompanies only significant interactions

### Sound Library

- [ ] Portal hover: distant chime, filtered
- [ ] Portal enter: deep whoosh + chime
- [ ] World arrival: ambient swell
- [ ] Element entrance: soft paper slide
- [ ] Click feedback: subtle metallic tap
- [ ] Error: low tone, descending
- [ ] Success: bright tone, ascending
- [ ] Scroll snap: soft thud
- [ ] Drag start: paper lift
- [ ] Drop: soft landing

### Ambient Sound per World

- [ ] Apple: silence
- [ ] Cyberpunk: distant rain, electrical hum
- [ ] Space: deep drone
- [ ] Gaming: heartbeat
- [ ] AI: soft computation
- [ ] Editorial: page turning
- [ ] Liquid: water, flow
- [ ] Retro: vinyl crackle
- [ ] Brutalist: silence
- [ ] Experimental: variable

### Volume

- [ ] Master: 20% maximum
- [ ] Ambient: 5% maximum
- [ ] UI sounds: 10-15%
- [ ] Portal transition: ambient ducks to 0% over 200ms
- [ ] World load: ambient fades in over 1000ms

---

## World Identity

### Apple World

- [ ] Personality: precision, warmth, simplicity
- [ ] Motion: every animation follows same easing curve
- [ ] Sound: silence
- [ ] Typography: Inter Variable, weights 300-400, tight tracking
- [ ] Signature: minimal parallax, depth from material not position
- [ ] Emotional arc: order, clarity, everything in its place

### Cyberpunk World

- [ ] Personality: danger, energy, rebellion
- [ ] Motion: 30% animations have intentional glitch
- [ ] Sound: distant electrical hum, rain
- [ ] Typography: JetBrains Mono, uppercase, tight leading
- [ ] Signature: chromatic aberration on hover (1-2px RGB separation)
- [ ] Emotional arc: danger, energy, somewhere you shouldn't be

### Space World

- [ ] Personality: vastness, mystery, solitude
- [ ] Motion: 0.3x velocity multiplier, transitions 1.5x longer
- [ ] Sound: deep drone, universe breathing
- [ ] Typography: Inter Variable, weight 200-300, wide tracking (0.1em)
- [ ] Signature: elements drift 1-2px per second
- [ ] Emotional arc: vastness, solitude, being small in something enormous

### Gaming World

- [ ] Personality: energy, competition, achievement
- [ ] Motion: 0.7x velocity, overshoot 3-5px, animations reward user
- [ ] Sound: brighter, louder, success sounds rewarding
- [ ] Typography: Clash Display, bold, angular
- [ ] Signature: elements scale 2% hover, 5% click
- [ ] Emotional arc: anticipation, achievement, winning

### AI World

- [ ] Personality: intelligence, mystery, potential
- [ ] Motion: morphing transitions, elements transform not move
- [ ] Sound: soft computation, gentle rhythm
- [ ] Typography: geometric sans-serif, precise, mathematical
- [ ] Signature: neural network visualizations, pulsing data flow
- [ ] Emotional arc: mystery, intelligence, something vast considering you

### Editorial World

- [ ] Personality: authority, craft, storytelling
- [ ] Motion: page-turning transitions, scroll reveals like turning pages
- [ ] Sound: paper sounds, craft of physical media
- [ ] Typography: Instrument Serif headings, Inter body
- [ ] Signature: pull quotes with 2px left border that grows
- [ ] Emotional arc: authority, craft, reading something important

### Liquid World

- [ ] Personality: fluidity, adaptability, playfulness
- [ ] Motion: morphing transitions, elements flow into each other
- [ ] Sound: water, flow, movement
- [ ] Typography: rounded sans-serif, friendly
- [ ] Signature: border-radius 2-4px animates on hover
- [ ] Emotional arc: fluidity, adaptability, everything connected

### Retro World

- [ ] Personality: nostalgia, warmth, personality
- [ ] Motion: frame-by-frame at 12fps, hand-drawn quality
- [ ] Sound: vinyl crackle, warmth
- [ ] Typography: display fonts with personality
- [ ] Signature: dithered gradients, 1-bit color transitions
- [ ] Emotional arc: warmth, nostalgia, remembering something beautiful

### Brutalist World

- [ ] Personality: raw, honest, unapologetic
- [ ] Motion: abrupt, linear, no easing
- [ ] Sound: silence, raw and honest
- [ ] Typography: monospace only, uppercase
- [ ] Signature: raw HTML visible, no border-radius, no shadows, no glass
- [ ] Emotional arc: honesty, rawness, seeing something unfiltered

### Experimental World

- [ ] Personality: unpredictable, innovative, boundary-pushing
- [ ] Motion: variable, every interaction creates new motion language
- [ ] Sound: whatever fits
- [ ] Typography: variable fonts, weight/width/slant respond to interaction
- [ ] Signature: no signature (that is the signature)
- [ ] Emotional arc: surprise, discovery, stepping into the unknown

---

## Emotion

### Arrival Sequence

- [ ] Void (0-500ms): screen nearly black, single particle
- [ ] Breath (500-1500ms): particle expands, more appear
- [ ] Emergence (1500-2500ms): particles connect, structure forms
- [ ] Invitation (2500-3500ms): structure pulses, portal appears
- [ ] Wonder (3500ms+): user realizes this is not normal

### Portal Crossing

- [ ] 6 stages followed exactly
- [ ] Total duration: 1.75 seconds
- [ ] Each stage has specific timing and character

### Inside a World

- [ ] Rules are predictable and never break
- [ ] Hover reveals hidden details
- [ ] Scroll reveals new layers
- [ ] Every action has meaningful reaction
- [ ] World acknowledges returning users

### Error States

- [ ] Errors do not punish
- [ ] Problem is immediately understood (no error codes)
- [ ] Path forward is obvious (one button)
- [ ] Error messages have personality (match world's voice)
- [ ] User can always return to where they were

### Session Arc

- [ ] Entry: wonder (not normal website)
- [ ] Exploration: curiosity (traveling between worlds)
- [ ] Engagement: immersion (finding a world that resonates)
- [ ] Connection: memory (world responds to presence)
- [ ] Departure: reluctance (leaving, but remembering)

---

## Forbidden Patterns

### Layouts — DO NOT USE

- [ ] Generic portfolio grids (cards with hover effects)
- [ ] Standard navigation (fixed top bar with links)
- [ ] Full-screen hero with centered text and button
- [ ] Footer with social links and copyright
- [ ] Sidebar navigation with icons
- [ ] Masonry grids without purpose
- [ ] Centered single-column layouts without depth

### Motion — DO NOT USE

- [ ] Everything moving all the time
- [ ] Generic hover effects (scale 1.05, opacity 0.8)
- [ ] Parallax for the sake of parallax
- [ ] Scroll-triggered animations without choreography
- [ ] Spring animations on everything
- [ ] Bounce easing on UI elements
- [ ] Material Design loading spinners

### Color — DO NOT USE

- [ ] Pure neon (#ff00ff, #00ffff) without nuance
- [ ] Gradient text
- [ ] More than 3 signal colors visible at once
- [ ] Colors outside world's palette
- [ ] Color as the only differentiator between states

### Materials — DO NOT USE

- [ ] Flat design without depth
- [ ] Shadows without physical basis
- [ ] Glass without blur
- [ ] Borders without purpose
- [ ] Decorative grain (grain is material, not filter)

### Typography — DO NOT USE

- [ ] More than 3 typefaces in a single world
- [ ] Decorative fonts for body text
- [ ] All-caps for paragraphs
- [ ] Justified text
- [ ] Hyphenation

### Interaction — DO NOT USE

- [ ] Click targets smaller than 44px
- [ ] Focus rings that are not visible
- [ ] Keyboard traps
- [ ] Animations that cannot be reduced
- [ ] Sound that cannot be muted
- [ ] Auto-playing video with sound

### Patterns — DO NOT USE

- [ ] Cookie banners that break the experience
- [ ] Standard form inputs without custom styling
- [ ] Generic loading screens
- [ ] Skeleton screens that look like loading bars
- [ ] Standard cursor trails or particles
- [ ] Chat widgets that appear without invitation
- [ ] Pop-ups that interrupt the experience

---

## Performance

- [ ] 60fps is minimum — below 60fps, illusion of physicality breaks
- [ ] Jank is not acceptable under any circumstances
- [ ] Loading states are designed experiences, not technical necessities
- [ ] Perceived performance is as important as actual performance
- [ ] Every effect is cleaned up
- [ ] Every subscription is unsubscribed
- [ ] No memory leaks

---

## Accessibility

- [ ] `prefers-reduced-motion` disables all non-essential animation
- [ ] Focus rings are designed, not defaulted
- [ ] Keyboard navigation is choreographed
- [ ] Color contrast: WCAG AAA for body, WCAG AA for large text
- [ ] Every image has alt text
- [ ] Every interactive element has a label
- [ ] Every region has a landmark
- [ ] Every mouse interaction is available via keyboard
- [ ] Tab order follows visual hierarchy

---

## Platform

- [ ] Desktop: full depth, full motion, full sound
- [ ] Tablet: touch replaces hover, depth reduced, motion simplified
- [ ] Mobile: swipe replaces scroll, tap replaces click, designed for thumbs
- [ ] Performance budgets scale with device capability
- [ ] Input methods are respected (mouse, trackpad, touch, keyboard, stylus)

---

## Before Shipping

- [ ] Run `npm run lint`
- [ ] Run `npm run typecheck`
- [ ] Run `npm run build`
- [ ] Verify 60fps on target devices
- [ ] Verify keyboard navigation works
- [ ] Verify screen reader can navigate
- [ ] Verify reduced motion mode works
- [ ] Verify sound can be muted
- [ ] Verify all worlds load correctly
- [ ] Verify portal transitions feel significant
- [ ] Verify error states are recoverable
- [ ] Verify the experience lingers after closing
