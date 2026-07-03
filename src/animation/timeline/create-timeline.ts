/**
 * Timeline Factory
 *
 * Creates GSAP timelines for complex animations.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

export interface TimelineOptions {
  delay?: number;
  paused?: boolean;
  repeat?: number;
  yoyo?: boolean;
  scrollTrigger?: {
    trigger: HTMLElement | string;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    pin?: boolean;
  };
}

export interface TimelineStep {
  target: HTMLElement | string | HTMLElement[];
  from?: Record<string, unknown>;
  to?: Record<string, unknown>;
  position?: number | string;
  duration?: number;
  ease?: string;
}

/**
 * Create a GSAP timeline with steps.
 *
 * @example
 * ```ts
 * const tl = createTimeline({ delay: 0.5 });
 *
 * tl.addStep({
 *   target: ".title",
 *   from: { y: 50, opacity: 0 },
 *   to: { y: 0, opacity: 1 },
 *   duration: 0.5,
 * });
 *
 * tl.addStep({
 *   target: ".subtitle",
 *   from: { y: 30, opacity: 0 },
 *   to: { y: 0, opacity: 1 },
 *   duration: 0.3,
 *   position: "-=0.2",
 * });
 *
 * tl.play();
 * ```
 */
export function createTimeline(options: TimelineOptions = {}) {
  const { delay = 0, paused = false, repeat = 0, yoyo = false, scrollTrigger } = options;

  const tl = gsap.timeline({
    delay,
    paused,
    repeat,
    yoyo,
  });

  if (scrollTrigger) {
    const trigger =
      typeof scrollTrigger.trigger === "string"
        ? document.querySelector(scrollTrigger.trigger)
        : scrollTrigger.trigger;

    if (trigger) {
      ScrollTrigger.create({
        trigger,
        start: scrollTrigger.start || "top center",
        end: scrollTrigger.end || "bottom center",
        scrub: scrollTrigger.scrub || false,
        pin: scrollTrigger.pin || false,
        animation: tl,
      });
    }
  }

  return {
    /**
     * Add a step to the timeline
     */
    addStep(step: TimelineStep) {
      const {
        target,
        from,
        to = {},
        position,
        duration = ANIMATION_DURATIONS.normal,
        ease = ANIMATION_EASINGS.easeOut,
      } = step;

      if (from) {
        tl.fromTo(
          target,
          from,
          {
            ...to,
            duration,
            ease,
          },
          position,
        );
      } else {
        tl.to(
          target,
          {
            ...to,
            duration,
            ease,
          },
          position,
        );
      }

      return this;
    },

    /**
     * Add a label to the timeline
     */
    addLabel(label: string, position?: number | string) {
      tl.addLabel(label, position);
      return this;
    },

    /**
     * Add a callback to the timeline
     */
    addCallback(callback: () => void, position?: number | string) {
      tl.call(callback, undefined, position);
      return this;
    },

    /**
     * Add a delay to the timeline
     */
    addDelay(duration: number, position?: number | string) {
      tl.to({}, { duration }, position);
      return this;
    },

    /**
     * Play the timeline
     */
    play() {
      tl.play();
      return this;
    },

    /**
     * Pause the timeline
     */
    pause() {
      tl.pause();
      return this;
    },

    /**
     * Reverse the timeline
     */
    reverse() {
      tl.reverse();
      return this;
    },

    /**
     * Restart the timeline
     */
    restart() {
      tl.restart();
      return this;
    },

    /**
     * Seek to a specific time
     */
    seek(time: number | string) {
      tl.seek(time);
      return this;
    },

    /**
     * Get the timeline progress
     */
    progress(): number {
      return tl.progress();
    },

    /**
     * Kill the timeline
     */
    kill() {
      tl.kill();
    },

    /**
     * Get the underlying GSAP timeline
     */
    getTimeline() {
      return tl;
    },
  };
}

/**
 * Create a looping timeline.
 */
export function createLoopingTimeline(
  steps: TimelineStep[],
  options: {
    duration?: number;
    repeat?: number;
    yoyo?: boolean;
  } = {},
) {
  const { duration = ANIMATION_DURATIONS.slower, repeat = -1, yoyo = true } = options;

  const tl = createTimeline({ repeat, yoyo });

  steps.forEach((step, index) => {
    const position = (index / steps.length) * duration;
    tl.addStep({ ...step, position: `${String(position)}s` });
  });

  return tl;
}

/**
 * Create a staggered timeline.
 */
export function createStaggeredTimeline(
  elements: HTMLElement[],
  animation: Omit<TimelineStep, "target">,
  stagger: number = 0.1,
) {
  const tl = createTimeline();

  elements.forEach((element, index) => {
    tl.addStep({
      target: element,
      ...animation,
      position: index * stagger,
    });
  });

  return tl;
}
