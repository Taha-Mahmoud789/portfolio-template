/**
 * Scroll Utilities
 *
 * Utility functions for scroll-based animations.
 */

/** Check if element is in viewport */
export function isInViewport(
  element: HTMLElement,
  options: {
    threshold?: number;
    rootMargin?: string;
  } = {},
): boolean {
  const { threshold = 0 } = options;

  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const verticalInView =
    rect.top <= windowHeight * (1 - threshold) &&
    rect.bottom >= windowHeight * threshold;
  const horizontalInView =
    rect.left <= windowWidth * (1 - threshold) &&
    rect.right >= windowWidth * threshold;

  return verticalInView && horizontalInView;
}

/** Get scroll progress for an element */
export function getScrollProgress(element: HTMLElement): number {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const elementTop = rect.top;
  const elementHeight = rect.height;

  // Progress from 0 (element entering viewport) to 1 (element leaving viewport)
  return Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight)));
}

/** Get scroll position */
export function getScrollPosition(): { x: number; y: number } {
  if (typeof window === "undefined") {
    return { x: 0, y: 0 };
  }

  return {
    x: window.scrollX || window.pageXOffset,
    y: window.scrollY || window.pageYOffset,
  };
}

/** Get document scroll height */
export function getDocumentHeight(): number {
  return Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  );
}

/** Get viewport height */
export function getViewportHeight(): number {
  return window.innerHeight || document.documentElement.clientHeight;
}

/** Get viewport width */
export function getViewportWidth(): number {
  return window.innerWidth || document.documentElement.clientWidth;
}

/** Smooth scroll to position */
export function scrollTo(
  y: number,
  options: { behavior?: ScrollBehavior; smooth?: boolean } = {},
): void {
  const { behavior = "smooth" } = options;
  window.scrollTo({ top: y, behavior });
}

/** Smooth scroll to element */
export function scrollToElement(
  element: HTMLElement | string,
  options: { behavior?: ScrollBehavior; block?: ScrollLogicalPosition } = {},
): void {
  const { behavior = "smooth", block = "start" } = options;
  const el =
    typeof element === "string" ? document.querySelector(element) : element;

  if (el) {
    el.scrollIntoView({ behavior, block });
  }
}

/** Calculate parallax value */
export function calculateParallax(
  scrollProgress: number,
  speed: number,
  direction: "vertical" | "horizontal" | "diagonal" = "vertical",
): { x: number; y: number } {
  const normalizedProgress = scrollProgress * 2 - 1; // -1 to 1

  switch (direction) {
    case "horizontal":
      return { x: normalizedProgress * speed, y: 0 };
    case "diagonal":
      return {
        x: normalizedProgress * speed * 0.707,
        y: normalizedProgress * speed * 0.707,
      };
    case "vertical":
    default:
      return { x: 0, y: normalizedProgress * speed };
  }
}

/** Throttle function */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastTime = 0;

  return (...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = wait - (now - lastTime);

    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      lastTime = now;
      func(...args);
    } else if (!timeout) {
      timeout = setTimeout(() => {
        lastTime = Date.now();
        timeout = null;
        func(...args);
      }, remaining);
    }
  };
}

/** Debounce function */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/** RAF-based throttle for smooth animations */
export function rafThrottle<T extends (...args: unknown[]) => unknown>(
  func: T,
): { (...args: Parameters<T>): void; cancel(): void } {
  let rafId: number | null = null;

  const throttled = (...args: Parameters<T>) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };

  throttled.cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  };

  return throttled;
}
