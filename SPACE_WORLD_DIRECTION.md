# Space World — Design Direction

**The Astronaut.** You are weightless. The void is not empty — it is full of possibility.

---

## Design Manifesto

This is not a website about space. This is a digital cosmos — a place where gravity is a suggestion, where silence has weight, where the distance between two pixels feels like lightyears.

Space World exists at the intersection of awe and solitude. It is the feeling of floating outside a space station, watching Earth rotate below. It is the feeling of looking into the Hubble Deep Field and understanding — truly understanding — that every point of light is a galaxy. It is the feeling of being small in something enormous, and finding peace in that smallness.

We do not display content. We suspend it in orbit. The user does not scroll through space — they drift through it. They do not click on elements — they approach them, as one approaches a distant star. They do not navigate — they travel.

Space World borrows from the physics of the cosmos, the photography of deep space, and the silence between radio transmissions. It borrows from the feeling of watching Interstellar's docking scene — where time dilates, where rotation becomes choreography, where survival depends on precision.

We reject the ordinary. We reject gravity. We reject anything that feels grounded.

What remains floats.

### The Relationship

The cosmos is not alive. It does not care about the user. It does not respond to their presence. It was there before them and will be there after them. This indifference is not hostile — it is peaceful. The user is not the center of this universe. They are a visitor. A witness. An astronaut floating through something that existed long before them and will exist long after.

This relationship — between the temporary human and the eternal cosmos — is the emotional core of Space World. The user feels small. They feel temporary. And in that smallness and temporality, they find something beautiful: the privilege of witnessing infinity.

---

## Visual Identity

### The Cosmic Material Language

Space World is built from materials that exist in the vacuum between stars. These materials are not decorative — they are physical. Each has weight, texture, and behavior.

**The Void.** The primary background is not black. It is the deepest accessible darkness — `#030712` — the color of space at 3am when no light pollution reaches. It has temperature: cool, with a faint indigo undertone that prevents it from feeling flat. The void is not empty space — it is the canvas on which the universe paints itself. It has grain — a subtle noise texture at 5% opacity that simulates the cosmic microwave background radiation. The void breathes.

**Nebulae.** Atmospheric gas clouds that drift across the viewport at glacial speeds. They are not decorative — they are environments. A nebula is a place where stars are born. In Space World, nebulae are the atmospheric fog that creates depth. They exist at Layer 1 (The Atmosphere) — between the void and the content. They catch light from sources outside the frame, creating gradients that shift over 30-60 second cycles. Primary nebula: indigo-to-violet. Secondary nebula: cyan-to-teal. They are always moving — not visibly, but perceptibly. Like watching clouds from orbit.

**Stars.** Points of light at varying distances. Some are close — bright, warm, with visible diffraction spikes. Some are distant — dim, cool, barely visible. Stars are not static — they twinkle with a sinusoidal oscillation at 0.5-2Hz, each star at its own frequency. The star field is parallax-responsive: closer stars move faster during scroll, creating depth. Star density increases toward the galactic center (lower-right of viewport). Stars are the only elements that emit their own light.

**Dust.** Cosmic dust particles — microscopic, barely visible, catching light at grazing angles. They exist at Layer 1, between the nebula and the content. Dust creates the sense of medium — you are not in a vacuum, you are in a space filled with matter too small to see but too significant to ignore. Dust particles drift at 0.5-1px per second in semi-random directions, influenced by an invisible solar wind.

**Planets.** Massive bodies that anchor the composition. They exist at Layer 0 (The Void) — behind everything. Planets are never fully visible — only their curvature catches light, creating crescents of illumination at the edge of the viewport. A planet's presence is felt through its gravitational influence on nearby elements, not through its visual appearance. When a planet is visible, it occupies 30-60% of the viewport, creating a sense of scale that makes the user feel small.

**Fog.** Atmospheric perspective — the mechanism by which distance is communicated. Distant elements fade into a blue-black fog. The fog color shifts: closer to the viewer, it is pure void (`#030712`). At mid-distance, it takes on indigo (`#0f172a`). At far distance, it becomes deep space (`#1e1b4b`). This fog is not uniform — it has density variations that create the sense of cosmic weather.

**Glow.** Light emission from energized elements. In space, there is no ambient light — only light from stars, from engines, from energy. Glow is the visual language of power, importance, and life. A button does not have a background — it has a glow. A heading does not have a color — it radiates. Glow is always cool-toned (indigo, cyan, violet) and always has a physical basis: the element is emitting photons.

### The Signature: The Constellation Pattern

Every other space website has stars. Space World has something no other interface has: **constellations.**

Certain stars in the background are connected by faint, luminous lines — forming patterns that are unique to Space World. These constellations are not random — they are designed. They form geometric shapes that echo the layout of the content. When the user scrolls, the constellations shift — the lines stretch, rotate, and reform, creating the sense that the cosmos itself is rearranging around the user's journey.

The constellation lines are `rgba(99, 102, 241, 0.08)` — barely visible, but present. They create a sense of hidden order in the chaos of the void. They are the visual signature of Space World — the element that makes screenshots instantly recognizable.

Constellations are:

- **Persistent** — they exist across all sections, creating visual continuity
- **Responsive** — they shift with scroll, creating parallax within the background
- **Unique** — 7 constellations per viewport, each with a name and a story
- **Discoverable** — hovering near a constellation reveals its name in faint text

### Depth

The cosmos is infinite, and Space World communicates this through layering. Six distinct depth layers, each with its own parallax speed, blur level, and opacity:

| Layer | Name           | Speed | Blur | Opacity | Contents                                |
| ----- | -------------- | ----- | ---- | ------- | --------------------------------------- |
| 0     | The Void       | 0.1x  | 0px  | 100%    | Background gradient, planets            |
| 1     | The Atmosphere | 0.2x  | 0px  | 95%     | Nebulae, dust, fog, constellation lines |
| 2     | The Stars      | 0.3x  | 0px  | 90%     | Star field, constellation points        |
| 3     | The Structure  | 0.6x  | 0px  | 100%    | Content, cards, panels                  |
| 4     | The Surface    | 0.85x | 0px  | 100%    | Interactive elements                    |
| 5     | The Floating   | 1.0x  | 0px  | 100%    | Tooltips, portals, cursors              |

The gap between layers 0-2 and 3-5 is the "event horizon" — the boundary between the cosmos and the interface. Content exists on the near side of this boundary. The universe exists on the far side. This boundary is not invisible — at rest, a faint glow line (1px, `rgba(99, 102, 241, 0.1)`) marks the event horizon, separating the environment from the interface.

### Texture and Grain

Nothing in Space World is perfectly smooth. The cosmos is not sterile — it is textured with radiation, dust, and time.

- **Noise overlay:** A subtle film grain (5% opacity, monochrome) covers every surface. This grain simulates the cosmic microwave background — the residual radiation from the Big Bang. It makes the void feel like it has texture, like looking at the night sky through a telescope with high ISO.
- **Star bloom:** Bright stars have a soft bloom effect — a gaussian blur of 4-8px at 20-40% opacity around the light source. This simulates the way bright objects bleed light through optical systems. Bloom is the visual language of intensity.
- **Edge quality:** Elements in Space World have generous radius — 12-24px on cards, 8-16px on panels, 4-8px on buttons. Sharp edges feel wrong in a world without atmosphere. The radius creates organic shapes that feel like they've been eroded by cosmic wind.
- **Glass:** Panels float in the cosmos like observation windows. Glass is always tinted with the world's primary color — a faint indigo wash. Glass has `backdrop-filter: blur(24px) saturate(150%)` on `rgba(15, 23, 42, 0.6)` background. The glass catches light from elements behind it, creating depth through transparency. Glass has a 1px border at `rgba(99, 102, 241, 0.12)` — the faintest edge light that catches the stellar point source and defines the panel's shape.

### Material Craft

Luxury is not just restraint — it is the quality of each individual element.

- **Surface texture:** Glass panels have a microscopic noise pattern (2% opacity) that creates the sense of real glass — not a CSS effect, but a material. Matte surfaces have a barely-visible tooth that catches light at grazing angles.
- **Border quality:** Borders are never solid — they are gradients. A border on a glass panel transitions from `rgba(99, 102, 241, 0.15)` at the top-left (catching the stellar light) to `rgba(99, 102, 241, 0.05)` at the bottom-right (in shadow). This creates the sense that light is hitting the panel from a specific direction.
- **Shadow depth:** Shadows are not just blur — they are color. Every shadow has a slight indigo tint (`rgba(3, 7, 18, ...)`) that matches the void's temperature. Shadows are never pure black.
- **Content density:** Space World is sparse. A viewport contains at most 3-4 content elements. The rest is cosmos. The emptiness is not wasted — it is the distance between stars.

### Restraint as Scale

The cosmos communicates scale through emptiness. Between stars: nothing. Between galaxies: nothing. This nothing is not absence — it is the substance of space.

In Space World:

- White space is not empty — it is the distance between celestial bodies. It communicates scale.
- Every element must answer: "Does this need to exist in orbit?" If it can be removed without losing meaning, it is removed.
- Color is rare — used only when it means something. Signal colors appear only at interaction points.
- Animation is not free — each animation must earn its existence against the silence of the void.
- Text is sparse — the cosmos does not have labels. What text exists must feel like a transmission from mission control.

---

## Motion Identity

### The Physics of Weightlessness

Every element in Space World has mass, but no gravity. Motion is not programmed — it is simulated in vacuum.

**Mass:** Light elements (text, labels) respond with 0.3x velocity — they drift into position as if floating. Heavy elements (panels, sections) respond with 0.15x velocity — they move like a space station adjusting orbit. The user feels this weightlessness. It creates the illusion of zero gravity.

**Friction:** There is no friction in space. Elements do not decelerate — they coast. When motion begins, it continues until an equal force stops it. The final 30% of any transition includes a gentle drift — like an object finding equilibrium in microgravity. The settling oscillation is 0.3px amplitude, 400ms duration — barely perceptible, but it separates Space World motion from every other interface.

**Inertia:** When the user stops scrolling, elements continue to drift for 200-400ms before coming to rest. When a drag ends, the element overshoots 3-5px before returning. When a world transitions, the old world's momentum carries it partway into the void before it dissolves. Inertia is the defining characteristic of Space World motion.

### Intent-Responsive Motion

Motion in Space World responds to user intent — not just input.

- **Fast scroll (escape velocity):** When the user scrolls quickly (>800px/s), elements accelerate beyond their normal 0.3x speed. The cosmos cannot keep up — elements blur slightly (1px motion blur), parallax distances increase, and the event horizon glow brightens. The user is breaking free of orbit.
- **Slow scroll (orbital drift):** When the user scrolls slowly (<200px/s), elements move at their full 0.3x weightlessness. Every detail is visible. The cosmos breathes around them. They are in stable orbit.
- **No scroll (station-keeping):** When the user is not scrolling, the camera oscillates 0.5px over 8-12 seconds. Nebulae drift. Stars twinkle. Dust particles float. The cosmos is alive even when the user is still.
- **Rapid interaction (urgency):** When the user clicks rapidly (<200ms between clicks), micro-feedback accelerates to 100ms. The cosmos acknowledges urgency without breaking its physics.

### The Timing Signature

Space World breathes at 0.33 Hz — three times slower than the Frontend Multiverse default. This creates the sense of time dilation, of existing in a frame of reference where seconds feel like minutes.

| Motion           | Duration  | Easing                         | Character                    |
| ---------------- | --------- | ------------------------------ | ---------------------------- |
| Micro-feedback   | 180ms     | cubic-bezier(0.16, 1, 0.3, 1)  | Acknowledgment through drift |
| Hover response   | 350ms     | cubic-bezier(0.33, 0, 0.2, 1)  | Gravitational approach       |
| Element entrance | 750ms     | cubic-bezier(0.16, 1, 0.3, 1)  | Emerging from the void       |
| Scene transition | 1200ms    | cubic-bezier(0.65, 0, 0.35, 1) | Orbital insertion            |
| World transition | 2400ms    | custom bezier                  | Crossing the event horizon   |
| Ambient drift    | 8-15s     | sinusoidal                     | Cosmic breathing             |
| Scroll parallax  | per-frame | lerp(0.02-0.08)                | Spatial depth                |

### The Signature Motions

**The Orbital Drift.** Elements do not sit still. Every element has a subtle drift — 1-2px per second in a random direction, influenced by a shared "solar wind" vector. This drift is so slow that users don't see it. They feel it. The interface is alive, floating, weightless. The drift changes direction every 8-15 seconds, creating organic movement patterns.

**The Atmospheric Entry.** Elements don't fade in — they emerge from the cosmic fog. An element entering the viewport starts at 20% opacity, 4px below its final position, with a 2px blur. Over 750ms, it sharpens, rises, and solidifies. The blur creates the sense of an object coming into focus through a telescope. The element is arriving from deep space.

**The Gravitational Settle.** When an element reaches its final position, it does not stop. It oscillates — a gentle, decaying sine wave that mimics orbital mechanics. The oscillation is 0.3px amplitude, 400ms duration, with a frequency that decreases as amplitude decreases. The element is finding its orbit.

**The Nebula Wash.** Background gradients do not transition instantly — they wash across the viewport over 30-60 seconds, like nebulae drifting through space. The wash follows the solar wind vector, creating the sense that the entire cosmos is in motion around the user.

**The Star Twinkle.** Bright elements have a subtle luminosity oscillation — breathing between 85% and 100% opacity over 3-5 seconds. This mimics the twinkling of stars through atmospheric distortion. The twinkle is unique to each element — different frequency, different phase. No two elements breathe the same way.

### Motion-Sound Sync

Every significant motion in Space World has a corresponding sound. The two are inseparable — motion without sound is incomplete, sound without motion is hollow.

| Motion           | Sound               | Sync Character                                              |
| ---------------- | ------------------- | ----------------------------------------------------------- |
| Element entrance | Stellar wind hiss   | Sound begins 100ms before visual — anticipation             |
| Element exit     | Low drone fade      | Sound fades with visual — departure                         |
| Hover approach   | Gravitational chime | Chime pitch rises as cursor approaches — proximity          |
| Click            | Metallic tap        | Tap plays at peak compression — impact                      |
| Scroll start     | Ambient swell       | Drone volume increases with scroll velocity — acceleration  |
| Scroll stop      | Ambient decay       | Drone volume decays over 500ms — deceleration               |
| Portal approach  | Wormhole whoosh     | Whoosh frequency follows portal glow intensity — attraction |
| Portal enter     | Singularity pulse   | Single bass hit at moment of entry — impact                 |

### Scroll as Orbital Mechanics

Scroll in Space World is not navigation — it is orbital mechanics. The user is a satellite adjusting its orbit.

- **Orbital parallax:** Background layers move at 0.1x scroll speed, midground at 0.3x, foreground at 0.5x. This creates the sense of orbiting a massive object — the closer to the surface, the faster you move.
- **Gravitational snap:** Full-screen sections snap with gravitational easing — the snap decelerates as if approaching a Lagrange point. The snap takes 600ms, not 400ms.
- **Overscroll as escape velocity:** At section boundaries, the scroll creates elastic resistance. The resistance increases exponentially — as if trying to escape a gravity well. The user must "accelerate" (scroll faster) to break free.
- **Velocity as distance:** Fast scroll = close to the surface (elements move faster, blur increases slightly). Slow scroll = high orbit (elements move slower, everything is sharper). The user's scroll speed determines their altitude.

### Portal Choreography in Space

Crossing a portal in Space World is not a transition — it is a journey through the cosmos.

1. **Recognition (300ms):** The portal comes into focus — not through sharpness, but through gravitational pull. The portal's glow intensifies. Nearby stars bend toward it. The user understands: this is a wormhole.

2. **Attraction (500ms):** The portal pulses with increasing frequency. An accretion disk forms — rings of light orbiting the portal's center. The cursor is magnetically pulled toward it. The user feels the gravitational attraction.

3. **Commitment (200ms):** The user clicks. The portal absorbs the click. A burst of light — not white, but the accent color of the destination world, stretched and blue-shifted by relativistic effects.

4. **Compression (600ms):** The current world stretches toward the portal. Elements elongate in the direction of travel. The world compresses along the axis of entry. Spacetime warps.

5. **The Void (400ms):** Complete darkness. Complete silence. The space between worlds. The user exists in the gap between dimensions. A single point of light appears in the center — the destination.

6. **Expansion (800ms):** The new world erupts from the singularity. Elements expand outward, carrying momentum from the transition. Light rays streak past the user. The new world establishes itself.

Total duration: 2.8 seconds. Long enough to feel like travel. Short enough to not feel slow.

---

## Camera Guide

### The Orbital Camera

The user's viewport is a camera in orbit around a massive object — the content. The camera has mass, momentum, and constraints.

**Distance:** The camera maintains a default distance that shows the full scope of the current scene. This distance communicates scale — the user is far from the content, observing it like an astronaut observes a planet from orbit. Zooming in is rare and intentional — it should feel like a powered descent, not a scroll.

**Movement:** The camera moves in three axes:

- **X (lateral):** Subtle, driven by cursor position. The camera pans 2-5px toward the cursor, creating the sense that the camera is tracking the user's gaze. This movement has 0.5x velocity — the camera resists, then follows.
- **Y (vertical):** Primary axis, driven by scroll. The camera orbits vertically around the content. Movement is weightless — momentum carries after scroll stops.
- **Z (depth):** Rare, driven by interaction. Zooming in/out. The Z-axis movement has gravitational easing — accelerating toward the target, decelerating at the destination.

**Weight:** The camera has perceived mass. It does not respond instantly — it resists movement, then follows with 0.3x velocity. When the user scrolls quickly, the camera lags 2-3 frames behind, creating the sense of a heavy object in motion. When the user stops, the camera drifts for 200-400ms before settling.

**Floating:** The camera is never perfectly still. Even when the user is not interacting, the camera has a subtle oscillation — 0.5px in X and Y over 8-12 second cycles. This oscillation simulates orbital station-keeping — the constant micro-adjustments needed to maintain orbit. The user is floating.

**Acceleration:** Camera acceleration follows rocket physics — thrust is constant, but velocity increases exponentially. A small scroll input produces a small camera movement. A large scroll input produces a disproportionately large movement. This creates the sense of acceleration through the cosmos.

**Rotation:** The camera has a subtle rotation response to scroll velocity. Fast scroll = 0.5° rotation in the scroll direction. Slow scroll = no rotation. This rotation creates the sense of the camera tumbling slightly in space — a realistic behavior for an object without atmospheric stabilization.

**Zoom:** Zoom changes feel gravitational — as if falling toward (or away from) the content. Zoom-in has acceleration (falling toward the surface). Zoom-out has deceleration (escaping orbit). The zoom range is 0.8x to 2.0x — the user cannot zoom out to nothingness or in to microscopic detail. The cosmos has limits.

### Camera Constraints

- **Maximum rotation:** ±2° — beyond this, the user feels disoriented
- **Maximum zoom speed:** 0.5x per second — beyond this, the gravitational illusion breaks
- **Drift amplitude:** 0.5px — beyond this, the user notices the camera is moving
- **Lag frames:** 2-3 frames at 60fps — beyond this, the interface feels unresponsive

---

## Lighting Guide

### The Cosmic Light Model

Space World exists in deep space — far from any star. Light is scarce, precious, and meaningful.

**Primary Light — Stellar Point Source.** A single bright source at the upper-left (315°), color temperature 9000K (blue-white). This light creates subtle gradients on all surfaces — a slight brightening toward the upper-left, a slight dimming toward the lower-right. The light is not visible — only its effects are visible. Intensity: 40%.

**Secondary Light — Ambient Scatter.** A diffuse light from all directions, color temperature 12000K (deep blue). This light fills shadows without eliminating them. It creates the sense of existing in a space filled with scattered starlight. Intensity: 15%.

**Emissive Elements — Self-Illumination.** The only elements that generate their own light: glows, signals, interactive highlights, star fields. Emissive elements are the visual language of energy, life, and importance. They are always cool-toned (indigo, cyan, violet).

### Shadow System

In space, shadows are long, soft, and blue-tinted. They have no hard edges — light wraps around objects because it comes from infinitely distant sources.

| Elevation | Shadow      | Color                  | Character               |
| --------- | ----------- | ---------------------- | ----------------------- |
| 0         | none        | —                      | Floating in void        |
| 1         | 0 2px 4px   | `rgba(3, 7, 18, 0.4)`  | Slight presence         |
| 2         | 0 4px 12px  | `rgba(3, 7, 18, 0.35)` | Elevated panel          |
| 3         | 0 8px 24px  | `rgba(3, 7, 18, 0.3)`  | Floating structure      |
| 4         | 0 16px 48px | `rgba(3, 7, 18, 0.35)` | Major element           |
| 5         | 0 32px 64px | `rgba(3, 7, 18, 0.4)`  | Portal / world boundary |

- **Shadow temperature:** Always cool-blue — add 10% indigo to the rgba
- **Shadow blur:** Higher elevation = more blur = more distance from the void surface
- **Shadow spread:** Never — it creates artificial-looking shadows
- **Inset shadows:** Never — they break the illusion of floating

### Glow System

Glow is the primary visual language of Space World. It communicates energy, importance, and life in a universe where most things are cold and dark.

- **Precision glow:** 2-4px spread, 30-50% opacity — for active states, focus rings, selected elements
- **Atmospheric glow:** 20-40px spread, 5-15% opacity — for world ambiance, background energy
- **Signal glow:** 8-16px spread, 40-60% opacity — for notifications, portal proximity, critical actions
- **Star glow:** 4-8px spread, 20-40% opacity — for bright stars, headings, important text
- **Color rule:** Glow color is always 20% lighter and 15% more saturated than the element's base color
- **Animation:** Glow breathes — oscillating between 80% and 100% intensity over 3-5 seconds, unique per element

### Bloom

Bright light sources bleed into surrounding space. This is bloom — the visual language of intensity.

- **Star bloom:** 4-8px gaussian blur, 20-30% opacity, monochrome matching star color
- **Signal bloom:** 8-16px gaussian blur, 15-25% opacity, matching signal color
- **Portal bloom:** 16-32px gaussian blur, 30-50% opacity, matching portal color, pulsing
- **Bloom animation:** Bloom intensity oscillates with the element's luminosity breathing

### Color Temperature

Space World is cold. Every light source is above 6500K. There is no warm light — the user is far from any star.

- **Void:** 10000K (deep indigo-black)
- **Nebulae:** 8000K (blue-violet)
- **Stars:** 6500-9000K (white to blue-white)
- **Glow:** 7000-10000K (cyan to indigo)
- **Signal:** 6500K (cool white) or world-specific accent

---

## Color Guide

### The Deep Space Palette

| Token            | Hex       | Role                 | Usage                    |
| ---------------- | --------- | -------------------- | ------------------------ |
| `void`           | `#030712` | Primary background   | The deepest darkness     |
| `void-subtle`    | `#0a0f1e` | Background variation | Slight depth shift       |
| `void-deep`      | `#1e1b4b` | Atmospheric fog      | Distant nebula base      |
| `surface`        | `#0f172a` | Panel backgrounds    | Elevated content         |
| `surface-raised` | `#1e293b` | Interactive surfaces | Buttons, inputs          |
| `surface-active` | `#334155` | Active/hover states  | Feedback                 |
| `stellar`        | `#e2e8f0` | Primary text         | Headings, important text |
| `stellar-dim`    | `#94a3b8` | Secondary text       | Body, descriptions       |
| `stellar-faint`  | `#64748b` | Tertiary text        | Labels, metadata         |
| `stellar-ghost`  | `#475569` | Disabled text        | Barely visible           |

### The Nebula Palette

| Token              | Hex       | Role             | Usage                      |
| ------------------ | --------- | ---------------- | -------------------------- |
| `nebula-primary`   | `#6366f1` | Primary indigo   | Main actions, focus, links |
| `nebula-secondary` | `#a855f7` | Secondary violet | Accents, highlights        |
| `nebula-accent`    | `#06b6d4` | Tertiary cyan    | Information, signals       |
| `nebula-rose`      | `#ec4899` | Warm accent      | Rare, used for emphasis    |

### The Glow Palette

| Token            | Hex                        | Role        | Usage                  |
| ---------------- | -------------------------- | ----------- | ---------------------- |
| `glow-primary`   | `rgba(99, 102, 241, 0.5)`  | Indigo glow | Focus, active states   |
| `glow-secondary` | `rgba(168, 85, 247, 0.5)`  | Violet glow | Accents, highlights    |
| `glow-accent`    | `rgba(6, 182, 212, 0.5)`   | Cyan glow   | Information, signals   |
| `glow-star`      | `rgba(226, 232, 240, 0.4)` | White glow  | Stars, bright elements |

### Color Ratios

Following the Frontend Multiverse's chromatic restraint:

- **85%** — Void and surfaces (deep space darkness)
- **10%** — Nebula tints (atmospheric color)
- **3%** — Stellar text (readability)
- **2%** — Signal and glow (interaction)

### Color as Meaning

| Color              | Meaning                     | When Used                   |
| ------------------ | --------------------------- | --------------------------- |
| `nebula-primary`   | Primary action, focus       | Buttons, links, focus rings |
| `nebula-secondary` | Accent, highlight           | Secondary actions, tags     |
| `nebula-accent`    | Information, neutral signal | Info badges, status         |
| `nebula-rose`      | Rare emphasis               | Warning-adjacent, special   |
| `stellar`          | Readable content            | Text, icons                 |
| Void gradient      | The cosmos                  | Background, atmosphere      |

---

## Interaction Guide

### Hover as Gravitational Approach

When the cursor approaches an interactive element, the element responds — not with a highlight, but with a gravitational shift.

- **Response time:** 150ms maximum. The element acknowledges the cursor's presence within this window.
- **Response type:** The element shifts 2-3px toward the cursor, as if attracted by the cursor's gravity. Simultaneously, the element's glow intensifies — from 0% to 30% opacity.
- **Depth response:** Elements at different layers respond differently. Layer 3 (Structure): 3px shift, 30% glow. Layer 4 (Surface): 2px shift, 40% glow. Layer 5 (Floating): 1px shift, 50% glow.
- **Duration:** 350ms — the approach is slow, weighted, gravitational.
- **Departure:** The element returns to rest over 350ms — the same duration as the approach. Symmetry creates elegance.
- **Cursor influence:** The cursor exerts gravitational influence on elements within 120px. Not all elements — only interactive ones. Static text does not respond to gravity.
- **Constellation response:** When the cursor approaches a constellation line, the line brightens — from 8% to 15% opacity. The constellation acknowledges the user's presence.

### Focus as Navigation Beacon

Focus in Space World is not a ring — it is a beacon. A focused element broadcasts its position through the cosmos.

- **Focus ring:** 2px outline, offset 3px, using `nebula-primary` color. The outline follows the element's border-radius.
- **Focus glow:** A pulsing glow (8px spread, 30% opacity) accompanies the focus ring. The glow oscillates between 80% and 100% intensity over 2 seconds — like a satellite beacon.
- **Focus sound:** A soft chime plays when focus arrives — spatialized to the element's position. The chime fades over 500ms.
- **Focus visibility:** Focus rings appear only on keyboard navigation (`:focus-visible`), never on mouse click.
- **Tab order:** Tab order follows visual hierarchy — the user navigates through the cosmos in a choreographed path. Each tab stop triggers the atmospheric entry animation — the focused element emerges from the void.

### Selection as Capture

Selecting an element in Space World is capturing it — bringing it into your orbit.

- **Selection indicator:** A glowing border (2px, `nebula-primary`) appears around the selected element, with a subtle pulse.
- **Selection glow:** The element's glow intensifies to 50% — it is energized, captured.
- **Selection drift:** The selected element's orbital drift pauses — it is now locked in the user's reference frame.
- **Selection sound:** A metallic tone plays — the sound of magnetic capture.

### Loading as Cosmic Assembly

Loading in Space World is not a spinner — it is the assembly of matter from the void.

- **Phase 1 (0-30%):** Particles appear from the void, scattered across the loading area. They drift inward, attracted by an invisible center of mass.
- **Phase 2 (30-70%):** Particles converge, forming a loose cluster. Lines of energy connect nearby particles — a neural network forming.
- **Phase 3 (70-100%):** The cluster solidifies into the content structure. Particles settle into position. The structure breathes once — a final expansion-contraction that signals completion.
- **Duration:** 1.5-3 seconds depending on content complexity.
- **Sound:** A low drone builds during phase 1-2, peaks at phase 3 transition, then fades to ambient.
- **Reduced motion:** Particles fade in simultaneously, then the structure appears.

### Portal Activation as Wormhole

Activating a portal is opening a wormhole — bending spacetime to create a shortcut between worlds.

- **Approach:** As the cursor nears the portal, the portal's glow intensifies. Nearby elements drift toward the portal — gravitational lensing.
- **Hover:** The portal pulses with increasing frequency. An accretion disk forms — rings of light orbiting the center. The cursor decelerates — it is entering the portal's gravity well.
- **Click:** The portal absorbs the click. A flash of the destination world's color, stretched by relativistic effects. The current world begins to compress toward the portal.
- **Transition:** The world collapses into the portal point. The void. The new world erupts.

### Browser Integration

Space World does not fight the browser — it transforms it.

- **Scrollbar:** The default scrollbar is hidden. A custom scrollbar appears: 4px wide, `rgba(99, 102, 241, 0.2)` track, `rgba(99, 102, 241, 0.5)` thumb with 8px border-radius. The scrollbar fades to 0% opacity after 2 seconds of no scroll activity. It reappears on scroll.
- **Text selection:** Selected text uses the world's selection color: `rgba(99, 102, 241, 0.3)` background, `#e2e8f0` foreground. Selection has a subtle glow (2px, 10% opacity).
- **Cursor:** The system cursor is replaced with a custom cursor: a circle, 8px diameter, `rgba(226, 232, 240, 0.9)` fill. On hover over interactive elements, the cursor expands to 24px with a 1px border. On click, the cursor compresses to 6px. The cursor follows the mouse with 1-frame delay — just enough to feel physical.
- **Full-screen:** Space World requests full-screen on entry (with user permission). The browser chrome fades to 0% opacity. The cosmos fills the entire screen. On exit, the browser chrome fades back.

---

## Environment Guide

### The Cosmic Environment

Space World is not a single scene — it is a living cosmos that evolves as the user explores.

### The Star Field

The foundation of Space World's environment. A parallax-responsive star field with three depth layers:

- **Near stars (Layer 2):** Bright, warm-white, 1-3px diameter. These stars twinkle at 1-2Hz with individual phase offsets. They move at 0.3x scroll speed.
- **Mid stars (Layer 1.5):** Dimmer, cool-white, 0.5-1.5px diameter. These stars twinkle at 0.5-1Hz. They move at 0.15x scroll speed.
- **Far stars (Layer 1):** Barely visible, blue-white, 0.5px diameter. These stars do not twinkle — they are too distant. They move at 0.05x scroll speed.

Star density: 120 stars per viewport, distributed with higher density toward the lower-right (galactic center).

### The Constellation System

Seven constellations exist in the background, each with a name, a shape, and a story:

| Constellation  | Shape        | Position    | Story                             |
| -------------- | ------------ | ----------- | --------------------------------- |
| _The Compass_  | Triangle     | Upper-left  | Points toward the portal          |
| _The Voyager_  | Arc          | Center      | The traveler's path               |
| _The Beacon_   | Cross        | Lower-right | A signal from home                |
| _The Frontier_ | Line         | Top edge    | The boundary of known space       |
| _The Relay_    | Zigzag       | Left edge   | Communication across distance     |
| _The Anchor_   | Diamond      | Bottom edge | Gravity well                      |
| _The Void_     | Empty circle | Right edge  | The absence that defines presence |

Constellation lines are `rgba(99, 102, 241, 0.08)` — barely visible. They brighten to 15% when the cursor approaches. Each constellation has a faint label that appears at 5% opacity, readable only on close inspection.

### The Nebula System

Atmospheric gas clouds that create depth and color. Two primary nebulae:

- **Primary nebula:** Indigo-to-violet gradient, positioned upper-left. Drifts at 0.2px/second. Occupies 40% of viewport. Creates the dominant atmospheric color.
- **Secondary nebula:** Cyan-to-teal gradient, positioned lower-right. Drifts at 0.15px/second. Occupies 25% of viewport. Creates accent atmosphere.

Nebulae are always moving — not visibly, but perceptibly. Their gradients shift over 30-60 second cycles, creating the sense of cosmic weather.

### The Dust Field

Cosmic dust particles that catch light at grazing angles. 40-60 dust particles per viewport, drifting at 0.5-1px/second in semi-random directions influenced by a shared solar wind vector.

Dust particles are 1-2px diameter, `rgba(99, 102, 241, 0.15)` color, with `mix-blend-mode: screen`. They are barely visible individually, but collectively they create the sense of medium — the user is not in a vacuum, they are in a space filled with matter.

### The Depth Fog

Atmospheric perspective that creates the sense of infinite distance. Elements at Layer 0 (The Void) are partially obscured by fog. The fog color shifts with depth:

- **Near fog (0-100px):** `rgba(3, 7, 18, 0)` — transparent, no effect
- **Mid fog (100-300px):** `rgba(10, 15, 30, 0.2)` — slight indigo wash
- **Far fog (300-600px):** `rgba(30, 27, 75, 0.3)` — visible nebula tint
- **Deep fog (600px+):** `rgba(3, 7, 18, 0.5)` — approaching void

### The Ambient Oscillation

The entire environment breathes. Every 8-15 seconds, the solar wind vector shifts direction, causing all drift-dependent elements (dust, nebulae, star field parallax) to change their movement vector. This oscillation is:

- **Frequency:** 0.07-0.12 Hz (8-15 second cycles)
- **Amplitude:** 0.5-1px displacement
- **Phase:** Randomized per element
- **Character:** Sinusoidal, organic, breathing

The user does not see this oscillation. They feel it. The cosmos is alive.

### Responsive Environment

The cosmic environment adapts to viewport size:

- **Desktop (1200px+):** Full environment — all layers, all particles, full parallax range, all constellations
- **Tablet (768-1199px):** Reduced environment — 60% particle count, reduced parallax range, simplified nebula, 4 constellations
- **Mobile (<768px):** Minimal environment — 30% particle count, no parallax, static nebula, reduced ambient oscillation, 2 constellations

The cosmos scales with the viewer's window into it.

---

## Typography Guide

### The Voice of the Cosmos

Typography in Space World is sparse, precise, and cold. Text is a transmission from mission control — functional, essential, stripped of excess.

**Primary — Inter Variable (weight 200-300)**
The voice of the cosmos. Used for body text, descriptions, and any content that must be read. Inter Variable at weight 200-300 creates the sense of thin, distant text — like a signal from far away. Wide tracking (0.1em) makes letters float apart like stars.

**Display — Space Grotesk**
The voice of technology. Used for headings, world titles, and moments of impact. Space Grotesk has geometric precision and cosmic character. It commands attention without shouting — like a mission control announcement.

**Mono — JetBrains Mono**
The voice of data. Used for technical content, coordinates, timestamps, and moments where the interface reveals its machinery. JetBrains Mono with ligatures creates a fluid reading experience for technical content.

### Typography Craft

- **Measure:** Maximum 55 characters per line for body text. Slightly narrower than standard — creates the sense of reading a transmission, not a document.
- **Leading:** Body text at 1.6 (generous — the text floats). Headings at 1.1 (tight — the text commands).
- **Paragraph spacing:** 1.4em. Slightly larger than standard — more space between thoughts, more room to breathe.
- **Orphan control:** No orphan lines. If a paragraph would leave one line on a new line, the entire paragraph moves to the next section.
- **Text alignment:** Never justified. Always left-aligned. Justified text creates rivers of whitespace — in Space World, the whitespace is already infinite.

### Typography Moments

- **World titles** animate letter by letter, each letter arriving with a 50ms delay (slower than default 30ms). The letters don't fade in — they emerge from the void, materializing from blur like stars coming into focus.
- **Coordinates and data** appear with a typewriter effect — characters appearing one at a time, as if being received from a distant probe.
- **Section headings** have wide tracking (0.15em) and weight 200 — they feel distant, like labels on a star chart.
- **Body text** has tracking 0.05em and weight 300 — readable but airy, like a report from deep space.
- **Error text** appears with a subtle horizontal shake — 2px left, 1px right, 0.5px left, rest. Like a signal losing lock.

---

## Sound Direction

### The Sound of the Universe

Space World has sound — but it is not music. It is the sound of the cosmos itself.

**Ambient — Deep Drone.** A continuous, low-frequency drone at 40-80Hz. This is the sound of nothing, amplified — the cosmic microwave background translated to audio. The drone is always present at 3% volume. It creates the sense of existing in a space filled with invisible energy.

**Atmospheric — Stellar Wind.** A barely audible high-frequency hiss (8-12kHz) that shifts in intensity with the nebula drift. When a nebula is near, the hiss intensifies slightly. When the void is clear, it fades. Volume: 2-4%.

**Interaction — Gravitational Chime.** When the user approaches an interactive element, a distant chime plays — a single note, filtered through a low-pass filter at 2kHz. The chime is spatialized — it comes from the direction of the element. Volume: 5-8%.

**Portal — Wormhole Transit.** When the user crosses a portal, a deep whoosh (frequency sweep from 200Hz to 2kHz over 600ms) followed by a bright chime (the destination world's accent frequency). Volume: 10-12%.

**Click — Metallic Tap.** A subtle, physical tap — like touching a metal surface in vacuum. The tap has no reverb (no atmosphere to carry it). Volume: 8-10%.

**Error — Low Descend.** A gentle, descending tone (200Hz to 80Hz over 400ms). Not punishing — informative. Like a system status change. Volume: 6-8%.

**Success — Bright Ascend.** A bright, ascending tone (400Hz to 800Hz over 300ms). Like a signal lock. Volume: 6-8%.

### Volume Envelope

- Master volume: 15% maximum
- Ambient drone: 3% maximum
- UI sounds: 5-10%
- Portal sounds: 10-12%
- When a portal transition begins, ambient drone ducks to 0% over 300ms
- When a world loads, ambient drone fades in over 1500ms

---

## Emotional Arc

### The Journey Through Space World

**Entry — Awe.** The user arrives. The void is vast. Stars surround them. They are small. They are weightless. The first feeling is awe — the recognition that this is not a normal interface. This is a place. The first thing they see: a single point of light in the center of the void. It pulses. It waits. The cosmos was here before them. It will be here after them.

**Exploration — Curiosity.** The user begins to move. Elements drift in response. The cursor exerts gravity. The cosmos responds to their presence — not with warmth, but with physics. Curiosity builds — what is out there? What happens if I go deeper? The constellations shift as they scroll. Hidden details emerge.

**Immersion — Calm.** The user settles into the rhythm. The slow drift, the gentle oscillation, the breathing glow. The cosmos is not chaotic — it is ordered, peaceful, eternal. The user finds calm in the weightlessness. The drone hums. The stars twinkle. Time slows.

**Discovery — Wonder.** The user discovers something unexpected — a constellation they haven't seen before, a portal that wasn't there a moment ago, a glow that responds to their presence in a way they didn't anticipate. Wonder erupts — the feeling of finding something beautiful in the vastness. The cosmos rewards those who look closely.

**Connection — Infinity.** The user understands. This world is infinite. There is always more to discover. The cosmos extends beyond the viewport, beyond the session, beyond comprehension. The user connects with something larger than themselves. They are not the center of this universe — they are a witness to it. And that is enough.

**Departure — Memory.** The user leaves Space World, but the void stays with them. The feeling of weightlessness, the sense of scale, the peace of the cosmos. The drone fades. The stars dim. The cosmos was waiting before they arrived. It will be waiting when they return.

---

## Self Review

### What Makes Space World Original

1. **The Orbital Drift** — No other interface has elements that drift 1-2px per second in random directions. This is not decoration — it is physics. The interface is alive in a way that no other website achieves.

2. **The Gravitational Cursor** — The cursor does not just hover — it exerts gravitational force. Elements shift toward it. The cursor decelerates over interactive elements. This is not a UI pattern — it is a physical interaction model.

3. **The Event Horizon** — The boundary between the cosmos (Layers 0-2) and the interface (Layers 3-5) creates a clear separation between environment and content. Content floats in front of the universe. The universe is always behind it.

4. **Time Dilation** — Everything in Space World is 0.3x speed. This is not "slow" — it is the experience of existing in a different frame of reference. The user feels the weight of cosmic time.

5. **The Singularity Transition** — Portal crossings collapse the world into a single point of light before expanding the new world. This is not a page transition — it is a journey through spacetime.

6. **The Constellation System** — Background stars are connected by luminous lines, forming unique patterns that shift with scroll. No other interface has designed constellations as a visual signature.

7. **Intent-Responsive Motion** — Fast scroll creates urgency. Slow scroll creates contemplation. No scroll creates stillness. The cosmos responds to the user's intent, not just their input.

8. **Motion-Sound Inseparability** — Every significant motion has a corresponding sound. The two are designed together. Motion without sound is incomplete. Sound without motion is hollow.

9. **The Cosmos-User Relationship** — The cosmos is indifferent. It does not care about the user. This indifference is not hostile — it is peaceful. The user is a witness, not a protagonist.

10. **Designed Loneliness** — Space World embraces the loneliness of the cosmos. The emptiness is not wasted space — it is the substance of the experience. The user feels small, and in that smallness, they find beauty.

### What This Document Is Not

This is not a UI spec. This is not a component library. This is the soul of Space World — the emotional and physical philosophy that guides every pixel, every animation, every interaction.

### The Test

If someone experiences Space World, will they feel weightless? Will they feel small in something enormous? Will they feel the peace of the cosmos? Will they feel the loneliness of infinity — and find it beautiful?

The answer must be yes.

Space World is not a website. It is a universe. It has physics. It has atmosphere. It has memory. It has soul.

Let's build it like one.
