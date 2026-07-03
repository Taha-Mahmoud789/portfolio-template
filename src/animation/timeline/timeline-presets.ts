/**
 * Timeline Presets
 *
 * Pre-configured timeline presets for common animation sequences.
 */

import type { TimelineStep } from "./create-timeline";
import { ANIMATION_DURATIONS, ANIMATION_EASINGS } from "../constants";

/** Page entrance timeline */
export function createPageEntranceTimeline(container: HTMLElement): TimelineStep[] {
  const title = container.querySelector<HTMLElement>("[data-animate='title']");
  const subtitle = container.querySelector<HTMLElement>("[data-animate='subtitle']");
  const content = container.querySelector<HTMLElement>("[data-animate='content']");
  const cta = container.querySelector<HTMLElement>("[data-animate='cta']");

  const steps: TimelineStep[] = [];

  if (title) {
    steps.push({
      target: title,
      from: { y: 50, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
    });
  }

  if (subtitle) {
    steps.push({
      target: subtitle,
      from: { y: 30, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
      position: "-=0.2",
    });
  }

  if (content) {
    steps.push({
      target: content,
      from: { y: 20, opacity: 0 },
      to: { y: 0, opacity: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
      position: "-=0.1",
    });
  }

  if (cta) {
    steps.push({
      target: cta,
      from: { y: 20, opacity: 0, scale: 0.9 },
      to: { y: 0, opacity: 1, scale: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
      position: "-=0.1",
    });
  }

  return steps;
}

/** Card reveal timeline */
export function createCardRevealTimeline(cards: HTMLElement[]): TimelineStep[] {
  return cards.map((card, index) => ({
    target: card,
    from: { y: 30, opacity: 0, scale: 0.95 },
    to: { y: 0, opacity: 1, scale: 1 },
    duration: ANIMATION_DURATIONS.normal,
    ease: ANIMATION_EASINGS.easeOut,
    position: index * 0.1,
  }));
}

/** Menu open timeline */
export function createMenuOpenTimeline(menu: HTMLElement): TimelineStep[] {
  const items = menu.querySelectorAll<HTMLElement>("[data-animate='menu-item']");
  const overlay = menu.querySelector<HTMLElement>("[data-animate='overlay']");

  const steps: TimelineStep[] = [];

  if (overlay) {
    steps.push({
      target: overlay,
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.easeOut,
    });
  }

  items.forEach((item, index) => {
    steps.push({
      target: item,
      from: { x: -30, opacity: 0 },
      to: { x: 0, opacity: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
      position: 0.1 + index * 0.05,
    });
  });

  return steps;
}

/** Modal timeline */
export function createModalTimeline(modal: HTMLElement): TimelineStep[] {
  const overlay = modal.querySelector<HTMLElement>("[data-animate='overlay']");
  const content = modal.querySelector<HTMLElement>("[data-animate='content']");

  const steps: TimelineStep[] = [];

  if (overlay) {
    steps.push({
      target: overlay,
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASINGS.easeOut,
    });
  }

  if (content) {
    steps.push({
      target: content,
      from: { scale: 0.95, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASINGS.easeOut,
      position: "-=0.1",
    });
  }

  return steps;
}
