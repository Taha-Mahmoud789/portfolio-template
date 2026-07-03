/**
 * Intersection Observer Utilities
 *
 * Utilities for using Intersection Observer with animations.
 */

export interface IntersectionObserverConfig {
  root?: HTMLElement | null;
  rootMargin?: string;
  threshold?: number | number[];
  triggerOnce?: boolean;
}

export interface IntersectionObserverCallbacks {
  onEnter?: (entry: IntersectionObserverEntry) => void;
  onLeave?: (entry: IntersectionObserverEntry) => void;
  onChange?: (entry: IntersectionObserverEntry) => void;
}

/** Create an Intersection Observer for animation triggers */
export function createAnimationObserver(
  element: HTMLElement,
  callbacks: IntersectionObserverCallbacks,
  config: IntersectionObserverConfig = {},
): IntersectionObserver {
  const { root = null, rootMargin = "0px", threshold = 0.25, triggerOnce = true } = config;

  let hasTriggered = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbacks.onEnter?.(entry);

          if (triggerOnce && !hasTriggered) {
            hasTriggered = true;
            observer.unobserve(element);
          }
        } else {
          callbacks.onLeave?.(entry);
        }

        callbacks.onChange?.(entry);
      });
    },
    { root, rootMargin, threshold },
  );

  observer.observe(element);

  return observer;
}

/** Create an Intersection Observer for multiple elements */
export function createMultiElementObserver(
  elements: HTMLElement[],
  callbacks: IntersectionObserverCallbacks,
  config: IntersectionObserverConfig = {},
): IntersectionObserver {
  const { root = null, rootMargin = "0px", threshold = 0.25, triggerOnce = true } = config;

  const triggeredElements = new WeakSet<HTMLElement>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callbacks.onEnter?.(entry);

          if (triggerOnce && !triggeredElements.has(entry.target as HTMLElement)) {
            triggeredElements.add(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        } else {
          callbacks.onLeave?.(entry);
        }

        callbacks.onChange?.(entry);
      });
    },
    { root, rootMargin, threshold },
  );

  elements.forEach((element) => observer.observe(element));

  return observer;
}

/** Check if element is in viewport */
export function isElementInViewport(
  element: HTMLElement,
  options: { rootMargin?: string; threshold?: number } = {},
): Promise<boolean> {
  const { rootMargin = "0px", threshold = 0 } = options;

  return new Promise<boolean>((resolve) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        resolve(entry?.isIntersecting ?? false);
        observer.disconnect();
      },
      { rootMargin, threshold },
    );

    observer.observe(element);
  });
}

/** Wait for element to enter viewport */
export function waitForElementInViewport(
  element: HTMLElement,
  options: { rootMargin?: string; threshold?: number } = {},
): Promise<void> {
  return new Promise((resolve) => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        resolve();
        observer.disconnect();
      }
    }, options);

    observer.observe(element);
  });
}
