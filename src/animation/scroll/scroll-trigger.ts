/**
 * ScrollTrigger Integration
 *
 * Utilities for GSAP ScrollTrigger.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface ScrollTriggerConfig {
  trigger: HTMLElement | string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  pin?: boolean | string;
  pinSpacing?: boolean;
  markers?: boolean;
  toggleActions?: string;
  onUpdate?: (self: ScrollTrigger) => void;
  onEnter?: (self: ScrollTrigger) => void;
  onLeave?: (self: ScrollTrigger) => void;
  onEnterBack?: (self: ScrollTrigger) => void;
  onLeaveBack?: (self: ScrollTrigger) => void;
}

/** Create a ScrollTrigger instance */
export function createScrollTrigger(config: ScrollTriggerConfig): ScrollTrigger {
  const {
    trigger,
    start = "top 80%",
    end = "bottom 20%",
    scrub = false,
    pin = false,
    pinSpacing = true,
    markers = false,
    toggleActions = "play none none reverse",
    onUpdate,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = config;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    pin,
    pinSpacing,
    markers,
    toggleActions,
    onUpdate,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  });
}

/** Create a parallax ScrollTrigger */
export function createParallaxTrigger(
  element: HTMLElement,
  options: {
    speed?: number;
    direction?: "vertical" | "horizontal";
    start?: string;
    end?: string;
  } = {},
): ScrollTrigger {
  const { speed = 0.5, direction = "vertical", start = "top bottom", end = "bottom top" } = options;

  const prop = direction === "horizontal" ? "x" : "y";

  return ScrollTrigger.create({
    trigger: element,
    start,
    end,
    scrub: true,
    onUpdate: (self) => {
      const progress = self.progress;
      const offset = (progress - 0.5) * speed * 100;

      gsap.set(element, {
        [prop]: offset,
        willChange: direction === "horizontal" ? "transform" : "transform",
      });
    },
  });
}

/** Create a reveal ScrollTrigger */
export function createRevealTrigger(
  element: HTMLElement,
  options: {
    from?: Record<string, unknown>;
    to?: Record<string, unknown>;
    duration?: number;
    ease?: string;
    start?: string;
    once?: boolean;
  } = {},
): ScrollTrigger {
  const {
    from = { opacity: 0, y: 50 },
    to = { opacity: 1, y: 0 },
    duration = 0.5,
    ease = "power2.out",
    start = "top 80%",
    once = true,
  } = options;

  gsap.set(element, from);

  return ScrollTrigger.create({
    trigger: element,
    start,
    once,
    onEnter: () => {
      gsap.to(element, { ...to, duration, ease });
    },
  });
}

/** Kill all ScrollTriggers */
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

/** Refresh all ScrollTriggers */
export function refreshAllScrollTriggers(): void {
  ScrollTrigger.refresh();
}

/** Get all active ScrollTriggers */
export function getActiveScrollTriggers(): ScrollTrigger[] {
  return ScrollTrigger.getAll();
}
