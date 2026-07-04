# Animation Engine

A reusable, composable animation system built on GSAP and Framer Motion. Every animation in the application is powered by this engine. No page should contain custom animation logic.

## Table of Contents

- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Hooks](#hooks)
  - [useReveal](#usereveal)
  - [useParallax](#useparallax)
  - [useMagnetic](#usemagnetic)
  - [useSplitText](#usesplittext)
  - [useFloating](#usefloating)
  - [useNumberCounter](#usenumbercounter)
  - [useStagger](#usestagger)
  - [useClipPath](#useclippath)
  - [useMaskReveal](#usemaskreveal)
  - [usePageTransition](#usepagetransition)
  - [useHover](#usehover)
  - [usePress](#usepress)
  - [useInfiniteLoop](#useinfiniteloop)
  - [useLoadingSequence](#useloadingsequence)
  - [useSceneEntrance](#usesceneentrance)
  - [useSceneExit](#usesceneexit)
  - [useScrollReveal](#usescrollreveal)
  - [useAnimationConfig](#useanimationconfig)
- [Presets](#presets)
- [Timeline](#timeline)
- [Factory](#factory)
- [Scroll Integration](#scroll-integration)
- [Constants](#constants)
- [Utilities](#utilities)
- [Best Practices](#best-practices)
- [Performance](#performance)
- [Accessibility](#accessibility)

---

## Architecture

```
src/animation/
├── index.ts                    # Barrel export
├── gsap-setup.ts               # Single GSAP plugin registration
├── types/                      # TypeScript types
├── constants/                  # Duration, easing, default values
├── presets/                    # Pre-configured animation objects
├── hooks/                      # React hooks (primary API)
├── utils/                      # GSAP, Framer, scroll, performance utils
├── timeline/                   # GSAP timeline builder
├── factory/                    # Animation factory + registry
├── context/                    # React context provider
└── scroll/                     # Lenis, ScrollTrigger, IntersectionObserver
```

**Design principles:**

- Every hook reads `useAnimationConfig()` which respects `prefers-reduced-motion` and the `animationQuality` store
- All animations use `transform` and `opacity` only — no layout properties
- All GSAP tweens are wrapped in `gsap.context()` for automatic cleanup on unmount
- All scroll handlers are throttled via `requestAnimationFrame`

---

## Quick Start

```tsx
import { useReveal, useParallax, useMagnetic } from "@/animation";

function Component() {
  const { ref, framerProps } = useReveal({ direction: "up" });
  const { ref: parallaxRef, transform } = useParallax({ speed: 0.5 });
  const { ref: magneticRef, animate } = useMagnetic({ strength: 0.3 });

  return (
    <div ref={parallaxRef} style={{ transform }}>
      <motion.div ref={ref} {...framerProps}>
        <motion.button ref={magneticRef} animate={animate}>
          Magnetic Button
        </motion.button>
      </motion.div>
    </div>
  );
}
```

---

## Hooks

### useReveal

Animates an element into view with configurable direction and distance. Uses Framer Motion under the hood.

```tsx
import { useReveal } from "@/animation";

const { ref, framerProps } = useReveal({
  direction: "up", // "up" | "down" | "left" | "right"
  distance: 50, // pixels
  duration: 0.3, // seconds
  delay: 0, // seconds
  ease: "ease-out", // CSS easing
  triggerOnMount: true,
  scrollTrigger: false,
  viewportPosition: "center", // "top" | "center" | "bottom"
});

<div ref={ref} {...framerProps}>
  Content
</div>;
```

| Option             | Type                                  | Default      | Description                          |
| ------------------ | ------------------------------------- | ------------ | ------------------------------------ |
| `direction`        | `"up" \| "down" \| "left" \| "right"` | `"up"`       | Direction the element slides in from |
| `distance`         | `number`                              | `50`         | Translation distance in pixels       |
| `duration`         | `number`                              | `0.3`        | Animation duration in seconds        |
| `delay`            | `number`                              | `0`          | Delay before animation starts        |
| `ease`             | `string`                              | `"ease-out"` | CSS easing function                  |
| `triggerOnMount`   | `boolean`                             | `true`       | Animate immediately on mount         |
| `scrollTrigger`    | `boolean`                             | `false`      | Animate when element enters viewport |
| `viewportPosition` | `"top" \| "center" \| "bottom"`       | `"center"`   | Viewport trigger position            |

**Returns:**

| Property      | Type                     | Description                                                                                  |
| ------------- | ------------------------ | -------------------------------------------------------------------------------------------- |
| `ref`         | `RefObject<HTMLElement>` | Attach to the element                                                                        |
| `state`       | `AnimationState`         | `"idle"` or `"running"`                                                                      |
| `framerProps` | `object`                 | Spread onto `<motion.div>` — contains `variants`, `initial`, `animate`, `exit`, `transition` |

---

### useParallax

Creates a parallax scrolling effect. Element shifts based on scroll position relative to viewport center.

```tsx
import { useParallax } from "@/animation";

const { ref, progress, transform } = useParallax({
  speed: 0.5,
  direction: "vertical", // "vertical" | "horizontal" | "diagonal"
});

<div ref={ref} style={{ transform }}>
  Parallax content
</div>;
```

| Option      | Type                                       | Default      | Description               |
| ----------- | ------------------------------------------ | ------------ | ------------------------- |
| `speed`     | `number`                                   | `0.5`        | Parallax speed multiplier |
| `direction` | `"vertical" \| "horizontal" \| "diagonal"` | `"vertical"` | Movement axis             |

**Returns:**

| Property    | Type                     | Description                   |
| ----------- | ------------------------ | ----------------------------- |
| `ref`       | `RefObject<HTMLElement>` | Attach to the element         |
| `progress`  | `number`                 | Scroll progress from -1 to 1  |
| `transform` | `string`                 | CSS transform string to apply |

---

### useMagnetic

Creates a magnetic effect where elements are attracted toward the cursor. Also supports a "follow" mode.

```tsx
import { useMagnetic } from "@/animation";

// Magnetic mode (default)
const { ref, animate } = useMagnetic({ strength: 0.3 });
<motion.button ref={ref} animate={animate}>
  Magnetic
</motion.button>;

// Follow mode
const { ref, animate } = useMagnetic({ mode: "follow", scale: 0.1 });
<div ref={ref} style={{ transform: `translate(${animate.x}px, ${animate.y}px)` }} />;
```

| Option     | Type                       | Default                           | Description                          |
| ---------- | -------------------------- | --------------------------------- | ------------------------------------ |
| `strength` | `number`                   | `0.3`                             | Magnetic pull strength (0-1)         |
| `range`    | `number`                   | `100`                             | Pixel radius for magnetic activation |
| `mode`     | `"magnetic" \| "follow"`   | `"magnetic"`                      | Effect type                          |
| `scale`    | `number`                   | `1`                               | Movement multiplier (follow mode)    |
| `spring`   | `{ stiffness?, damping? }` | `{ stiffness: 100, damping: 10 }` | Spring physics                       |

**Returns:**

| Property    | Type                       | Description                    |
| ----------- | -------------------------- | ------------------------------ |
| `ref`       | `RefObject<HTMLElement>`   | Attach to the element          |
| `position`  | `{ x: number, y: number }` | Current offset from center     |
| `isHovered` | `boolean`                  | Whether cursor is over element |
| `animate`   | `{ x, y }`                 | Framer Motion animate prop     |

---

### useSplitText

Splits text content into individual characters, words, or lines for animation.

```tsx
import { useSplitText } from "@/animation";

const { ref, chars, animateChars } = useSplitText({ type: "chars" });

// Call animation manually
useEffect(() => {
  animateChars();
}, []);

<p ref={ref}>Hello World</p>;
```

| Option | Type                                     | Default   | Description        |
| ------ | ---------------------------------------- | --------- | ------------------ |
| `type` | `"chars" \| "words" \| "lines" \| "all"` | `"chars"` | What to split into |

**Returns:**

| Property                   | Type                     | Description                  |
| -------------------------- | ------------------------ | ---------------------------- |
| `ref`                      | `RefObject<HTMLElement>` | Attach to text container     |
| `chars`                    | `HTMLElement[]`          | Array of character elements  |
| `words`                    | `HTMLElement[]`          | Array of word elements       |
| `lines`                    | `HTMLElement[]`          | Array of line elements       |
| `animateChars(from?, to?)` | `(from?, to?) => void`   | Animate characters with GSAP |
| `animateWords(from?, to?)` | `(from?, to?) => void`   | Animate words with GSAP      |
| `animateLines(from?, to?)` | `(from?, to?) => void`   | Animate lines with GSAP      |

**Best practice:** Store the original text content. The hook restores `innerHTML` on unmount.

---

### useFloating

Creates a continuous floating animation using sine/cosine waves.

```tsx
import { useFloating } from "@/animation";

const { ref, offset } = useFloating({
  amplitude: 10,
  frequency: 0.02,
  offset: 0,
});

<div ref={ref} style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }} />;
```

| Option      | Type     | Default | Description              |
| ----------- | -------- | ------- | ------------------------ |
| `amplitude` | `number` | `10`    | Movement range in pixels |
| `frequency` | `number` | `0.02`  | Oscillation speed        |
| `offset`    | `number` | `0`     | Phase offset             |

**Returns:**

| Property | Type                       | Description             |
| -------- | -------------------------- | ----------------------- |
| `ref`    | `RefObject<HTMLElement>`   | Attach to the element   |
| `offset` | `{ x: number, y: number }` | Current position offset |

**Performance:** Automatically pauses when element leaves viewport via IntersectionObserver.

---

### useNumberCounter

Animates a number counting from one value to another.

```tsx
import { useNumberCounter } from "@/animation";

const { ref, value } = useNumberCounter({
  from: 0,
  to: 1000,
  duration: 2,
  decimals: 0,
  separator: true,
});

<span ref={ref}>{value.toLocaleString()}</span>;
```

| Option           | Type      | Default          | Description                     |
| ---------------- | --------- | ---------------- | ------------------------------- |
| `from`           | `number`  | `0`              | Start value                     |
| `to`             | `number`  | `100`            | End value                       |
| `duration`       | `number`  | `0.7`            | Duration in seconds             |
| `ease`           | `string`  | `"easeOutCubic"` | Easing function name            |
| `decimals`       | `number`  | `0`              | Decimal places                  |
| `separator`      | `boolean` | `false`          | Use `toLocaleString` formatting |
| `triggerOnMount` | `boolean` | `true`           | Start counting on mount         |

**Returns:**

| Property  | Type                     | Description                |
| --------- | ------------------------ | -------------------------- |
| `ref`     | `RefObject<HTMLElement>` | Attach to the element      |
| `value`   | `number`                 | Current displayed value    |
| `start()` | `() => void`             | Manually start the counter |
| `reset()` | `() => void`             | Reset to initial value     |

---

### useStagger

Creates staggered animation effects for lists of elements.

```tsx
import { useStagger } from "@/animation";

const { containerRef, getStaggerProps } = useStagger({
  staggerDelay: 0.1,
  direction: "forward",
});

<div ref={containerRef}>
  {items.map((item, i) => (
    <motion.div key={item.id} {...getStaggerProps(i)}>
      {item.name}
    </motion.div>
  ))}
</div>;
```

| Option         | Type                                 | Default     | Description                    |
| -------------- | ------------------------------------ | ----------- | ------------------------------ |
| `staggerDelay` | `number`                             | `0.1`       | Delay between items in seconds |
| `direction`    | `"forward" \| "reverse" \| "center"` | `"forward"` | Stagger direction              |

**Returns:**

| Property                 | Type                        | Description                                           |
| ------------------------ | --------------------------- | ----------------------------------------------------- |
| `containerRef`           | `RefObject<HTMLElement>`    | Attach to the container                               |
| `getStaggerProps(index)` | `(index: number) => object` | Returns Framer Motion variant props for item at index |
| `play()`                 | `() => void`                | Trigger stagger animation with GSAP                   |
| `reset()`                | `() => void`                | Reset all items to initial state                      |

---

### useClipPath

Animates CSS `clip-path` between two states.

```tsx
import { useClipPath } from "@/animation";

const { ref, reveal, hide } = useClipPath({
  from: "inset(100% 0 0 0)",
  to: "inset(0 0 0 0)",
  duration: 0.7,
});

<div ref={ref}>Clipped content</div>
<button onClick={reveal}>Reveal</button>
<button onClick={hide}>Hide</button>
```

| Option     | Type     | Default               | Description         |
| ---------- | -------- | --------------------- | ------------------- |
| `from`     | `string` | `"inset(100% 0 0 0)"` | Starting clip-path  |
| `to`       | `string` | `"inset(0 0 0 0)"`    | Ending clip-path    |
| `duration` | `number` | `0.7`                 | Duration in seconds |
| `ease`     | `string` | `"ease-out"`          | Easing function     |

**Returns:**

| Property   | Type                     | Description             |
| ---------- | ------------------------ | ----------------------- |
| `ref`      | `RefObject<HTMLElement>` | Attach to the element   |
| `clipPath` | `string`                 | Current clip-path value |
| `reveal()` | `() => void`             | Animate to `to` state   |
| `hide()`   | `() => void`             | Animate to `from` state |

---

### useMaskReveal

Animates CSS `mask-image` for gradient reveal effects.

```tsx
import { useMaskReveal } from "@/animation";

const { ref, reveal, hide } = useMaskReveal({
  direction: "left",
  duration: 0.7,
});

<div ref={ref}>Masked content</div>;
```

| Option      | Type                            | Default      | Description         |
| ----------- | ------------------------------- | ------------ | ------------------- |
| `direction` | `"left" \| "right" \| "center"` | `"left"`     | Reveal direction    |
| `duration`  | `number`                        | `0.7`        | Duration in seconds |
| `ease`      | `string`                        | `"ease-out"` | Easing function     |

**Returns:**

| Property   | Type                     | Description              |
| ---------- | ------------------------ | ------------------------ |
| `ref`      | `RefObject<HTMLElement>` | Attach to the element    |
| `mask`     | `string`                 | Current mask-image value |
| `reveal()` | `() => void`             | Animate reveal           |
| `hide()`   | `() => void`             | Animate hide             |

---

### usePageTransition

Creates page transition variants for use with Framer Motion's `AnimatePresence`.

```tsx
import { usePageTransition, AnimatePresence, motion } from "@/animation";

const { variants } = usePageTransition({
  type: "slide", // "fade" | "slide" | "scale" | "rotate" | "portal"
  direction: "up",
  duration: 0.3,
});

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={variants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
</AnimatePresence>;
```

| Option      | Type                                                   | Default      | Description                   |
| ----------- | ------------------------------------------------------ | ------------ | ----------------------------- |
| `type`      | `"fade" \| "slide" \| "scale" \| "rotate" \| "portal"` | `"fade"`     | Transition type               |
| `direction` | `"up" \| "down" \| "left" \| "right"`                  | `"up"`       | Direction (slide/portal only) |
| `duration`  | `number`                                               | `0.3`        | Duration in seconds           |
| `ease`      | `string`                                               | `"ease-out"` | Easing function               |

**Returns:**

| Property   | Type       | Description                                              |
| ---------- | ---------- | -------------------------------------------------------- |
| `variants` | `Variants` | Framer Motion variants with `initial`, `animate`, `exit` |

---

### useHover

Creates hover effect animations. Use with Framer Motion.

```tsx
import { useHover } from "@/animation";

const { ref, isHovered, whileHover } = useHover({
  type: "scale", // "scale" | "rotate" | "glow" | "lift" | "tilt"
  intensity: 1,
  duration: 0.15,
});

<motion.div ref={ref} whileHover={whileHover}>
  Hover me
</motion.div>;
```

| Option      | Type                                                | Default   | Description                |
| ----------- | --------------------------------------------------- | --------- | -------------------------- |
| `type`      | `"scale" \| "rotate" \| "glow" \| "lift" \| "tilt"` | `"scale"` | Effect type                |
| `intensity` | `number`                                            | `1`       | Effect strength multiplier |
| `duration`  | `number`                                            | `0.15`    | Duration in seconds        |

**Returns:**

| Property     | Type                      | Description                     |
| ------------ | ------------------------- | ------------------------------- |
| `ref`        | `RefObject<HTMLElement>`  | Attach to the element           |
| `isHovered`  | `boolean`                 | Whether element is hovered      |
| `whileHover` | `Record<string, unknown>` | Framer Motion `whileHover` prop |

**Deprecated alias:** `useHoverEffect`

---

### usePress

Creates press/tap effect animations. Use with Framer Motion.

```tsx
import { usePress } from "@/animation";

const { ref, isPressed, whileTap } = usePress({
  type: "scale", // "scale" | "bounce" | "rotate" | "squeeze"
  intensity: 1,
});

<motion.button ref={ref} whileTap={whileTap}>
  Press me
</motion.button>;
```

| Option      | Type                                           | Default   | Description                |
| ----------- | ---------------------------------------------- | --------- | -------------------------- |
| `type`      | `"scale" \| "bounce" \| "rotate" \| "squeeze"` | `"scale"` | Effect type                |
| `intensity` | `number`                                       | `1`       | Effect strength multiplier |
| `duration`  | `number`                                       | `0.15`    | Duration in seconds        |

**Returns:**

| Property    | Type                      | Description                   |
| ----------- | ------------------------- | ----------------------------- |
| `ref`       | `RefObject<HTMLElement>`  | Attach to the element         |
| `isPressed` | `boolean`                 | Whether element is pressed    |
| `whileTap`  | `Record<string, unknown>` | Framer Motion `whileTap` prop |

**Deprecated alias:** `usePressEffect`

---

### useInfiniteLoop

Creates infinite looping animations using GSAP.

```tsx
import { useInfiniteLoop } from "@/animation";

const { ref, pause, resume } = useInfiniteLoop({
  type: "rotate", // "rotate" | "bounce" | "pulse" | "float"
  duration: 2,
});

<div ref={ref}>Rotating element</div>;
```

| Option     | Type                                         | Default    | Description                    |
| ---------- | -------------------------------------------- | ---------- | ------------------------------ |
| `type`     | `"rotate" \| "bounce" \| "pulse" \| "float"` | `"rotate"` | Loop type                      |
| `duration` | `number`                                     | `2`        | Full cycle duration in seconds |
| `ease`     | `string`                                     | `"linear"` | Easing function                |

**Returns:**

| Property   | Type                     | Description           |
| ---------- | ------------------------ | --------------------- |
| `ref`      | `RefObject<HTMLElement>` | Attach to the element |
| `pause()`  | `() => void`             | Pause the loop        |
| `resume()` | `() => void`             | Resume the loop       |

---

### useLoadingSequence

Creates a loading progress animation.

```tsx
import { useLoadingSequence } from "@/animation";

const { progress, isComplete, start } = useLoadingSequence({
  duration: 2,
  steps: 100,
  onComplete: () => console.log("Done"),
});

<progress value={progress} max={100} />
<button onClick={start}>Start</button>
```

| Option       | Type         | Default | Description               |
| ------------ | ------------ | ------- | ------------------------- |
| `duration`   | `number`     | `2`     | Total duration in seconds |
| `steps`      | `number`     | `100`   | Number of progress steps  |
| `onComplete` | `() => void` | —       | Callback when complete    |

**Returns:**

| Property     | Type         | Description                 |
| ------------ | ------------ | --------------------------- |
| `progress`   | `number`     | Current progress (0-100)    |
| `isComplete` | `boolean`    | Whether loading is complete |
| `start()`    | `() => void` | Start the sequence          |
| `reset()`    | `() => void` | Reset to 0                  |

---

### useSceneEntrance

Creates entrance animations for scenes/sections. Uses GSAP.

```tsx
import { useSceneEntrance } from "@/animation";

const { ref, play } = useSceneEntrance({
  type: "cinematic",  // "fade" | "slide" | "scale" | "cinematic"
  direction: "up",
  duration: 0.5,
});

<div ref={ref}>Scene content</div>
<button onClick={play}>Enter</button>
```

| Option      | Type                                          | Default      | Description            |
| ----------- | --------------------------------------------- | ------------ | ---------------------- |
| `type`      | `"fade" \| "slide" \| "scale" \| "cinematic"` | `"fade"`     | Entrance type          |
| `direction` | `"up" \| "down" \| "left" \| "right"`         | `"up"`       | Direction (slide only) |
| `duration`  | `number`                                      | `0.3`        | Duration in seconds    |
| `ease`      | `string`                                      | `"ease-out"` | Easing function        |
| `delay`     | `number`                                      | `0`          | Delay before animation |

**Returns:**

| Property  | Type                     | Description                |
| --------- | ------------------------ | -------------------------- |
| `ref`     | `RefObject<HTMLElement>` | Attach to the element      |
| `play()`  | `() => void`             | Trigger entrance animation |
| `reset()` | `() => void`             | Reset to initial state     |

---

### useSceneExit

Creates exit animations for scenes/sections. Returns a Promise that resolves on completion.

```tsx
import { useSceneExit } from "@/animation";

const { ref, play } = useSceneExit({
  type: "cinematic",
  direction: "up",
  duration: 0.5,
});

const handleExit = async () => {
  await play();
  // Navigate after animation completes
  router.push("/next-page");
};

<div ref={ref}>Scene content</div>
<button onClick={handleExit}>Exit</button>
```

| Option      | Type                                          | Default     | Description            |
| ----------- | --------------------------------------------- | ----------- | ---------------------- |
| `type`      | `"fade" \| "slide" \| "scale" \| "cinematic"` | `"fade"`    | Exit type              |
| `direction` | `"up" \| "down" \| "left" \| "right"`         | `"up"`      | Direction (slide only) |
| `duration`  | `number`                                      | `0.3`       | Duration in seconds    |
| `ease`      | `string`                                      | `"ease-in"` | Easing function        |

**Returns:**

| Property | Type                     | Description                                  |
| -------- | ------------------------ | -------------------------------------------- |
| `ref`    | `RefObject<HTMLElement>` | Attach to the element                        |
| `play()` | `() => Promise<void>`    | Trigger exit animation, resolves on complete |

---

### useScrollReveal

GSAP ScrollTrigger-based reveal animation. Returns scrub progress for scroll-linked animations.

```tsx
import { useScrollReveal } from "@/animation";

const { ref, progress, isActive } = useScrollReveal({
  type: "slide",
  direction: "up",
  scrub: true,
  start: "top 80%",
  end: "bottom 20%",
});

<div ref={ref} style={{ opacity: isActive ? 1 : 0 }}>
  Scroll-linked content
</div>;
```

| Option      | Type                                       | Default        | Description                       |
| ----------- | ------------------------------------------ | -------------- | --------------------------------- |
| `type`      | `"fade" \| "slide" \| "scale" \| "reveal"` | `"fade"`       | Reveal type                       |
| `direction` | `"up" \| "down" \| "left" \| "right"`      | `"up"`         | Direction (slide/reveal only)     |
| `duration`  | `number`                                   | `0.3`          | Duration (non-scrub mode)         |
| `ease`      | `string`                                   | `"ease-out"`   | Easing function                   |
| `delay`     | `number`                                   | `0`            | Delay                             |
| `start`     | `string`                                   | `"top 80%"`    | ScrollTrigger start position      |
| `end`       | `string`                                   | `"bottom 20%"` | ScrollTrigger end position        |
| `scrub`     | `boolean \| number`                        | `false`        | Link animation to scroll position |
| `once`      | `boolean`                                  | `true`         | Only trigger once                 |

**Returns:**

| Property   | Type                     | Description                                 |
| ---------- | ------------------------ | ------------------------------------------- |
| `ref`      | `RefObject<HTMLElement>` | Attach to the element                       |
| `progress` | `number`                 | Scroll progress (0-1) when scrub is enabled |
| `isActive` | `boolean`                | Whether element is in viewport trigger zone |

---

### useAnimationConfig

Returns the current animation configuration based on device capabilities and user preferences. Used internally by all hooks.

```tsx
import { useAnimationConfig } from "@/animation";

const { enabled, durationMultiplier, engine, quality } = useAnimationConfig();

if (!enabled) {
  // Render without animations
}
```

| Property             | Type                          | Description                                                                |
| -------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| `enabled`            | `boolean`                     | Whether animations should run                                              |
| `durationMultiplier` | `number`                      | Multiplier for animation durations (1 for high, 1.5 for medium, 2 for low) |
| `engine`             | `"gsap" \| "framer" \| "css"` | Recommended engine                                                         |
| `quality`            | `"low" \| "medium" \| "high"` | Current quality setting                                                    |

---

## Presets

Pre-configured animation objects that can be used with the factory API or imported directly.

### Fade Presets

| Preset        | Description                |
| ------------- | -------------------------- |
| `fadeIn`      | Simple opacity 0 → 1       |
| `fadeInUp`    | Fade in from below         |
| `fadeInDown`  | Fade in from above         |
| `fadeInLeft`  | Fade in from left          |
| `fadeInRight` | Fade in from right         |
| `fadeSlow`    | Slow fade (0.5s)           |
| `fadeInScale` | Fade in with scale 0.9 → 1 |

### Slide Presets

| Preset              | Description                      |
| ------------------- | -------------------------------- |
| `slideUp`           | Slide from 100% below            |
| `slideDown`         | Slide from 100% above            |
| `slideLeft`         | Slide from 100% left             |
| `slideRight`        | Slide from 100% right            |
| `slideInFromBottom` | Slide 100px from below with fade |
| `slideInFromTop`    | Slide 100px from above with fade |
| `slideInFromLeft`   | Slide 100px from left with fade  |
| `slideInFromRight`  | Slide 100px from right with fade |

### Scale Presets

| Preset        | Description                         |
| ------------- | ----------------------------------- |
| `scaleIn`     | Scale from 0 with fade              |
| `scaleUp`     | Scale from 0.8 with fade            |
| `scaleDown`   | Scale from 1.2 with fade            |
| `scaleBounce` | Spring-based scale bounce           |
| `scalePulse`  | Continuous scale pulse [1, 1.05, 1] |

### Rotate Presets

| Preset             | Description              |
| ------------------ | ------------------------ |
| `rotateIn`         | Rotate -180° with fade   |
| `rotateLeft`       | Rotate -90° with fade    |
| `rotateRight`      | Rotate 90° with fade     |
| `rotateContinuous` | Continuous 360° rotation |

### Stagger Presets

| Preset                  | Description                       |
| ----------------------- | --------------------------------- |
| `staggerUpContainer`    | Container for stagger-up children |
| `staggerUpItem`         | Item with spring-based stagger    |
| `staggerFadeContainer`  | Container for fade stagger        |
| `staggerFadeItem`       | Item with fade stagger            |
| `staggerScaleContainer` | Container for scale stagger       |
| `staggerScaleItem`      | Item with spring scale stagger    |

### Reveal Presets

| Preset             | Description                        |
| ------------------ | ---------------------------------- |
| `revealFromBottom` | Clip-path inset reveal from bottom |
| `revealFromTop`    | Clip-path inset reveal from top    |
| `revealFromLeft`   | Clip-path inset reveal from left   |
| `revealFromRight`  | Clip-path inset reveal from right  |
| `revealCircle`     | Clip-path circle reveal            |
| `revealDiamond`    | Clip-path diamond reveal           |

### Mask Reveal Presets

| Preset                  | Description                      |
| ----------------------- | -------------------------------- |
| `maskRevealLeftToRight` | Gradient mask left → right       |
| `maskRevealRightToLeft` | Gradient mask right → left       |
| `maskRevealTopToBottom` | Gradient mask top → bottom       |
| `maskRevealBottomToTop` | Gradient mask bottom → top       |
| `maskRevealCenter`      | Radial gradient mask from center |

### Clip Path Presets

| Preset            | Description              |
| ----------------- | ------------------------ |
| `clipPathCircle`  | Circle clip-path reveal  |
| `clipPathInset`   | Inset clip-path reveal   |
| `clipPathPolygon` | Polygon clip-path reveal |
| `clipPathDiamond` | Diamond clip-path reveal |

### Split Text Presets

| Preset           | Description                   |
| ---------------- | ----------------------------- |
| `splitTextChars` | Animate individual characters |
| `splitTextWords` | Animate individual words      |
| `splitTextLines` | Animate individual lines      |
| `splitTextBlur`  | Blur-to-sharp text reveal     |

### Number Counter Presets

| Preset              | Description             |
| ------------------- | ----------------------- |
| `numberCounter`     | Standard counter (0.7s) |
| `numberCounterFast` | Fast counter (0.3s)     |
| `numberCounterSlow` | Slow counter (2s)       |

### Floating Presets

| Preset             | Description             |
| ------------------ | ----------------------- |
| `floatingGentle`   | Gentle float ±5px       |
| `floatingModerate` | Moderate float ±10px    |
| `floatingStrong`   | Strong float ±15px      |
| `floating3D`       | 3D float with rotateX/Y |

### Mouse Follow Presets

| Preset               | Description           |
| -------------------- | --------------------- |
| `mouseFollowDefault` | Default spring follow |
| `mouseFollowSmooth`  | Smooth spring follow  |
| `mouseFollowSnappy`  | Snappy spring follow  |

### Magnetic Presets

| Preset            | Description           |
| ----------------- | --------------------- |
| `magneticDefault` | Default magnetic pull |
| `magneticStrong`  | Strong magnetic pull  |
| `magneticGentle`  | Gentle magnetic pull  |

### Parallax Presets

| Preset           | Description     |
| ---------------- | --------------- |
| `parallaxSlow`   | Slow parallax   |
| `parallaxMedium` | Medium parallax |
| `parallaxFast`   | Fast parallax   |

### Infinite Loop Presets

| Preset           | Description           |
| ---------------- | --------------------- |
| `infiniteRotate` | Continuous rotation   |
| `infiniteBounce` | Continuous bounce     |
| `infinitePulse`  | Continuous pulse      |
| `infiniteGlow`   | Continuous glow pulse |

### Page Transition Presets

| Preset          | Description           |
| --------------- | --------------------- |
| `pageFade`      | Fade transition       |
| `pageSlideUp`   | Slide up transition   |
| `pageSlideLeft` | Slide left transition |
| `pageScale`     | Scale transition      |

### Portal Transition Presets

| Preset         | Description            |
| -------------- | ---------------------- |
| `portalShrink` | Shrink into portal     |
| `portalExpand` | Expand from portal     |
| `portalBlur`   | Blur portal transition |

### Hover Presets

| Preset        | Description               |
| ------------- | ------------------------- |
| `hoverScale`  | Scale up on hover         |
| `hoverLift`   | Lift with shadow on hover |
| `hoverRotate` | Slight rotate on hover    |
| `hoverGlow`   | Blue glow on hover        |
| `hoverTilt`   | 3D tilt on hover          |

### Press Presets

| Preset         | Description         |
| -------------- | ------------------- |
| `pressScale`   | Scale down on press |
| `pressBounce`  | Bounce on press     |
| `pressRotate`  | Rotate on press     |
| `pressSqueeze` | Squeeze on press    |

### Loading Presets

| Preset           | Description           |
| ---------------- | --------------------- |
| `loadingSpinner` | Continuous rotation   |
| `loadingDots`    | Pulsing opacity dots  |
| `loadingPulse`   | Scale + opacity pulse |
| `loadingBar`     | Horizontal bar fill   |

### Scene Entrance Presets

| Preset           | Description                       |
| ---------------- | --------------------------------- |
| `sceneFadeIn`    | Scene fade in                     |
| `sceneSlideIn`   | Scene slide in from below         |
| `sceneScaleIn`   | Scene scale in                    |
| `sceneCinematic` | Cinematic entrance (scale + blur) |

### Scene Exit Presets

| Preset               | Description                   |
| -------------------- | ----------------------------- |
| `sceneFadeOut`       | Scene fade out                |
| `sceneSlideOut`      | Scene slide out upward        |
| `sceneScaleOut`      | Scene scale out               |
| `sceneCinematicExit` | Cinematic exit (scale + blur) |

---

## Timeline

Build complex sequenced animations with GSAP timelines.

### createTimeline

```tsx
import { createTimeline } from "@/animation";

const tl = createTimeline({ delay: 0.5 });

tl.addStep({
  target: ".title",
  from: { y: 50, opacity: 0 },
  to: { y: 0, opacity: 1 },
  duration: 0.5,
})
  .addStep({
    target: ".subtitle",
    from: { y: 30, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 0.3,
    position: "-=0.2",
  })
  .addDelay(0.3)
  .addCallback(() => console.log("Done"))
  .play();
```

| Option          | Type      | Default | Description                               |
| --------------- | --------- | ------- | ----------------------------------------- |
| `delay`         | `number`  | `0`     | Delay before timeline starts              |
| `paused`        | `boolean` | `false` | Start paused                              |
| `repeat`        | `number`  | `0`     | Number of repeats (-1 for infinite)       |
| `yoyo`          | `boolean` | `false` | Reverse on repeat                         |
| `scrollTrigger` | `object`  | —       | `{ trigger, start?, end?, scrub?, pin? }` |

**TimelineStep:**

| Property   | Type                                     | Description                                               |
| ---------- | ---------------------------------------- | --------------------------------------------------------- |
| `target`   | `HTMLElement \| string \| HTMLElement[]` | Animation target                                          |
| `from`     | `Record<string, unknown>`                | Starting values                                           |
| `to`       | `Record<string, unknown>`                | Ending values                                             |
| `position` | `number \| string`                       | Position on timeline (seconds or relative like `"-=0.2"`) |
| `duration` | `number`                                 | Duration in seconds                                       |
| `ease`     | `string`                                 | Easing function                                           |

### createLoopingTimeline

```tsx
import { createLoopingTimeline } from "@/animation";

const tl = createLoopingTimeline(steps, {
  duration: 2,
  repeat: -1,
  yoyo: true,
});
```

### createStaggeredTimeline

```tsx
import { createStaggeredTimeline } from "@/animation";

const tl = createStaggeredTimeline(
  elements,
  { from: { opacity: 0 }, to: { opacity: 1 }, duration: 0.3 },
  0.1, // stagger
);
```

---

## Factory

Create animations from presets by name.

```tsx
import { createAnimation, animateElement, getPresetNames } from "@/animation";

// List available presets
console.log(getPresetNames());

// Create animation config
const animation = createAnimation("fadeInUp", { duration: 0.5 });

// Animate an element directly
animateElement(".hero-title", "fadeInUp", { duration: 0.5 });
```

### createAnimation

```ts
createAnimation(presetName: string, options?: {
  engine?: "gsap" | "framer";
  duration?: number;
  delay?: number;
  ease?: string;
}): { engine, vars } | { engine, initial, animate, exit, transition } | null
```

### animateElement

```ts
animateElement(
  target: HTMLElement | string,
  presetName: string,
  options?: AnimationFactoryOptions
): gsap.core.Tween | null
```

### Animation Registry

```tsx
import { animationRegistry } from "@/animation";

// Register a custom preset
animationRegistry.register({
  name: "customReveal",
  preset: myPreset,
  tags: ["reveal", "custom"],
  description: "My custom reveal animation",
});

// Query presets
const reveals = animationRegistry.getByTag("reveal");
const all = animationRegistry.getAll();
```

---

## Scroll Integration

### Lenis

```tsx
import { createLenis, connectLenisToScrollTrigger } from "@/animation";

const lenis = createLenis({
  duration: 1.2,
  smoothWheel: true,
});

// Connect to GSAP ScrollTrigger
connectLenisToScrollTrigger(lenis);
```

### ScrollTrigger

```tsx
import { createScrollTrigger, createParallaxTrigger, createRevealTrigger } from "@/animation";

// Generic ScrollTrigger
const trigger = createScrollTrigger({
  trigger: element,
  start: "top 80%",
  end: "bottom 20%",
  scrub: true,
  onUpdate: (self) => console.log(self.progress),
});

// Parallax trigger
createParallaxTrigger(element, { speed: 0.5, direction: "vertical" });

// Reveal trigger
createRevealTrigger(element, {
  from: { opacity: 0, y: 50 },
  to: { opacity: 1, y: 0 },
  duration: 0.5,
});
```

### IntersectionObserver

```tsx
import { createAnimationObserver, waitForElementInViewport } from "@/animation";

// Observe element entering viewport
const observer = createAnimationObserver(
  element,
  {
    onEnter: () => console.log("visible"),
    onLeave: () => console.log("hidden"),
  },
  { triggerOnce: true },
);

// Wait for element to enter viewport
await waitForElementInViewport(element);
```

---

## Constants

### ANIMATION_DURATIONS

All values in seconds.

| Name        | Value  |
| ----------- | ------ |
| `instant`   | `0`    |
| `fast`      | `0.15` |
| `normal`    | `0.3`  |
| `slow`      | `0.5`  |
| `slower`    | `0.7`  |
| `slowest`   | `1`    |
| `ultra`     | `1.5`  |
| `cinematic` | `2`    |

### ANIMATION_EASINGS

| Name        | Value                                     |
| ----------- | ----------------------------------------- |
| `linear`    | `"linear"`                                |
| `ease`      | `"ease"`                                  |
| `easeIn`    | `"ease-in"`                               |
| `easeOut`   | `"ease-out"`                              |
| `easeInOut` | `"ease-in-out"`                           |
| `expoIn`    | `cubic-bezier(0.95, 0.05, 0.795, 0.035)`  |
| `expoOut`   | `cubic-bezier(0.19, 1, 0.22, 1)`          |
| `expoInOut` | `cubic-bezier(0.87, 0, 0.13, 1)`          |
| `backIn`    | `cubic-bezier(0.36, 0, 0.66, -0.56)`      |
| `backOut`   | `cubic-bezier(0.34, 1.56, 0.64, 1)`       |
| `backInOut` | `cubic-bezier(0.68, -0.6, 0.32, 1.6)`     |
| `elastic`   | `cubic-bezier(0.175, 0.885, 0.32, 1.275)` |
| `bounce`    | `cubic-bezier(0.68, -0.55, 0.265, 1.55)`  |

### DEFAULT_DISTANCES

| Name     | Value |
| -------- | ----- |
| `small`  | `20`  |
| `medium` | `50`  |
| `large`  | `100` |
| `xlarge` | `200` |

### DEFAULT_SPRING

```ts
{ stiffness: 100, damping: 10, mass: 1 }
```

---

## Utilities

### GSAP Utilities

```ts
import {
  animate, // gsap.to() wrapper
  animateFrom, // gsap.fromTo() wrapper
  killAnimations, // Kill tweens on element
  createGsapContext, // Create gsap.context for cleanup
  easings, // JS easing functions (linear, easeInCubic, etc.)
  clamp, // Clamp value between min/max
  lerp, // Linear interpolation
  mapRange, // Map value from one range to another
} from "@/animation";
```

### Framer Motion Utilities

```ts
import {
  createFadeVariants, // Generate fade variants
  createSlideVariants, // Generate slide variants
  createScaleVariants, // Generate scale variants
  createRotateVariants, // Generate rotate variants
  createStaggerContainer, // Generate stagger container variants
  createStaggerItem, // Generate stagger item variants
  createClipPathVariants, // Generate clip-path variants
  combineVariants, // Merge multiple variant objects
} from "@/animation";
```

### Scroll Utilities

```ts
import {
  throttle, // Throttle function calls
  debounce, // Debounce function calls
  rafThrottle, // RAF-throttled function (with .cancel())
  isInViewport, // Check if element is in viewport
  getScrollProgress, // Get element scroll progress
  scrollTo, // Smooth scroll to position
  scrollToElement, // Smooth scroll to element
} from "@/animation";
```

### Performance Utilities

```ts
import {
  isLowEndDevice, // Detect low-end device
  prefersReducedMotion, // Check prefers-reduced-motion
  getOptimalAnimationCount, // Max concurrent animations
  isElementVisible, // Check element visibility
  isIntersectionObserverAvailable,
  isWebGLAvailable,
  observeAnimationPerformance, // PerformanceObserver wrapper
  measureAnimation, // Measure animation timing
} from "@/animation";
```

---

## Best Practices

### 1. Always use the animation engine

Never write custom animation logic in components. Use the hooks:

```tsx
// Bad
useEffect(() => {
  gsap.to(ref.current, { opacity: 1, y: 0 });
}, []);

// Good
const { ref, framerProps } = useReveal({ direction: "up" });
```

### 2. Choose the right hook for the use case

| Use Case                  | Hook                                |
| ------------------------- | ----------------------------------- |
| Element appears on scroll | `useReveal` or `useScrollReveal`    |
| Parallax scrolling        | `useParallax`                       |
| Button follows cursor     | `useMagnetic`                       |
| Text character animation  | `useSplitText`                      |
| Continuous floating       | `useFloating`                       |
| Animated number display   | `useNumberCounter`                  |
| List stagger animation    | `useStagger`                        |
| Clip-path reveal          | `useClipPath`                       |
| Gradient mask reveal      | `useMaskReveal`                     |
| Page transitions          | `usePageTransition`                 |
| Hover effects             | `useHover`                          |
| Press/tap effects         | `usePress`                          |
| Infinite loops            | `useInfiniteLoop`                   |
| Loading progress          | `useLoadingSequence`                |
| Scene enter/exit          | `useSceneEntrance` / `useSceneExit` |

### 3. Use presets for common animations

```tsx
// Instead of configuring from scratch
import { fadeInUp } from "@/animation";
const props = { variants: fadeInUp.variants };

// Or use the factory
import { animateElement } from "@/animation";
animateElement(".title", "fadeInUp");
```

### 4. Compose animations with timelines

```tsx
const tl = createTimeline();
tl.addStep({ target: ".hero", from: { opacity: 0 }, to: { opacity: 1 } })
  .addStep({ target: ".subtitle", from: { y: 20 }, to: { y: 0 }, position: "-=0.2" })
  .play();
```

### 5. Use the config hook for conditional animations

```tsx
const { enabled, durationMultiplier } = useAnimationConfig();

// Skip expensive animations when disabled
if (enabled) {
  // Render animated version
} else {
  // Render static version
}
```

### 6. Prefer Framer Motion for declarative animations

Use Framer Motion hooks (`useReveal`, `useHover`, `usePress`, `usePageTransition`) for declarative, React-integrated animations.

### 7. Prefer GSAP for imperative animations

Use GSAP hooks (`useSceneEntrance`, `useSceneExit`, `useScrollReveal`, `useClipPath`, `useMaskReveal`) for imperative, timeline-based animations.

---

## Performance

### What the engine does automatically

- **GPU acceleration:** All animations use `transform` and `opacity` only — no layout-triggering properties
- **RAF throttling:** All scroll handlers and mouse handlers are throttled via `requestAnimationFrame`
- **Visibility pausing:** `useFloating` pauses its rAF loop when the element leaves the viewport
- **Value diffing:** `useParallax` skips state updates when values haven't changed
- **GSAP context cleanup:** All GSAP tweens are wrapped in `gsap.context()` and automatically killed on unmount
- **Reduced motion:** All hooks read `useAnimationConfig()` which respects `prefers-reduced-motion`
- **Duration scaling:** Durations are multiplied based on the `animationQuality` store (1x high, 1.5x medium, 2x low)

### What you should do

1. **Don't animate layout properties.** Never animate `width`, `height`, `top`, `left`, `margin`, or `padding`. Use `transform` instead.

2. **Batch DOM reads.** If you need to read layout values, read them all at once before writing.

3. **Avoid animating many elements simultaneously.** Use `getOptimalAnimationCount()` to check device limits.

4. **Use `once: true` for scroll reveals.** Re-animating elements on every scroll is expensive. Only `useScrollReveal` with `scrub: true` should re-trigger.

5. **Prefer Framer Motion for simple animations.** GSAP is more powerful but has higher overhead for simple fades and slides.

6. **Use `IntersectionObserver` for lazy initialization.** Don't initialize animations for elements that are far off-screen.

7. **Monitor with `measureAnimation`.** Wrap expensive animations in `measureAnimation("name", callback)` to track performance.

```ts
import { measureAnimation } from "@/animation";

measureAnimation("hero-entrance", () => {
  // Your animation code
});
```

---

## Accessibility

### Reduced Motion

The engine automatically respects `prefers-reduced-motion`:

- When enabled, animations are either skipped or degraded to opacity-only transitions
- The `useAnimationConfig()` hook returns `enabled: false` when reduced motion is active
- All hooks check this before starting animations

### Best Practices

1. **Never rely on animation alone for information.** If an element appears/disappears with animation, ensure the state change is also communicated via text or ARIA attributes.

2. **Provide a manual trigger.** For important animations (page transitions, modals), ensure there's a way to trigger them without waiting for animation.

3. **Test with reduced motion enabled.** In your OS settings, enable "Reduce motion" and verify the application still works.

4. **Use semantic HTML.** Animation hooks attach to elements — ensure those elements have proper roles and labels.

5. **Don't auto-play animations that flash or strobe.** Use `triggerOnMount: false` and let the user initiate.

6. **Ensure sufficient contrast.** Animated elements should maintain WCAG contrast ratios throughout their animation lifecycle.

### Hook-specific accessibility

| Hook                 | Consideration                                                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------------- |
| `useReveal`          | Content is invisible until animated. Use `scrollTrigger: true` so content is accessible when scrolled to. |
| `useSplitText`       | Modifies DOM structure. Ensure the original text is semantically meaningful.                              |
| `useFloating`        | Continuous motion. Respects reduced motion (pauses).                                                      |
| `useInfiniteLoop`    | Continuous motion. Use `pause()` for user-initiated pauses.                                               |
| `useLoadingSequence` | Progress is conveyed numerically, not just visually.                                                      |

---

## File Reference

| File                              | Purpose                                |
| --------------------------------- | -------------------------------------- |
| `index.ts`                        | Barrel export for all public APIs      |
| `gsap-setup.ts`                   | Single GSAP plugin registration        |
| `types/animation.ts`              | Core animation types                   |
| `types/hooks.ts`                  | Hook option and return types           |
| `types/config.ts`                 | Configuration types                    |
| `constants/durations.ts`          | Duration constants (seconds)           |
| `constants/easings.ts`            | Easing constants (CSS strings)         |
| `constants/defaults.ts`           | Default configurations                 |
| `presets/*.ts`                    | 20 preset categories with 100+ presets |
| `hooks/*.ts`                      | 17 animation hooks                     |
| `utils/gsap.ts`                   | GSAP utility functions                 |
| `utils/framer.ts`                 | Framer Motion utility functions        |
| `utils/scroll.ts`                 | Scroll utility functions               |
| `utils/performance.ts`            | Performance utility functions          |
| `timeline/create-timeline.ts`     | GSAP timeline builder                  |
| `timeline/timeline-presets.ts`    | Pre-built timeline sequences           |
| `factory/animation-factory.ts`    | Create animations from preset names    |
| `factory/animation-registry.ts`   | Singleton registry for custom presets  |
| `context/animation-context.tsx`   | React context provider                 |
| `scroll/lenis-integration.ts`     | Lenis smooth scroll integration        |
| `scroll/scroll-trigger.ts`        | GSAP ScrollTrigger factories           |
| `scroll/intersection-observer.ts` | IntersectionObserver wrappers          |
