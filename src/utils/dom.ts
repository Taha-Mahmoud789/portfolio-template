export function getElementBounds(el: Element): DOMRect {
  return el.getBoundingClientRect();
}

export function isReducedMotionPreferred(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function scrollTo(top: number, behavior: ScrollBehavior = "smooth"): void {
  window.scrollTo({ top, behavior });
}

export function requestAnimationFrameSafe(callback: FrameRequestCallback): number {
  return isBrowser() ? requestAnimationFrame(callback) : 0;
}
