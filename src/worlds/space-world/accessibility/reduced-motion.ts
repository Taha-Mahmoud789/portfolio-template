/**
 * Reduced Motion
 *
 * Handles prefers-reduced-motion detection and fallback behavior.
 */

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function onReducedMotionChange(callback: (reduced: boolean) => void): () => void {
  if (typeof window === "undefined")
    return () => {
      /* no-op */
    };

  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = (e: MediaQueryListEvent) => callback(e.matches);

  mq.addEventListener("change", handler);
  return () => {
    // Cleanup listener
    mq.removeEventListener("change", handler);
  };
}

export function getReducedMotionDuration(normalDuration: number): number {
  return prefersReducedMotion() ? 0 : normalDuration;
}

export function shouldAnimate(): boolean {
  return !prefersReducedMotion();
}

export function announceToScreenReader(message: string) {
  const el = document.querySelector("[aria-live='polite']");
  if (el) {
    el.textContent = message;
    setTimeout(() => {
      el.textContent = "";
    }, 1000);
  }
}
