/**
 * Performance Utilities
 *
 * Utility functions for animation performance.
 */

/** Check if device is low-end */
export function isLowEndDevice(): boolean {
  if (typeof navigator === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    hardwareConcurrency?: number;
  };

  // Check for low memory
  if (nav.deviceMemory && nav.deviceMemory < 4) return true;

  // Check for low CPU cores
  if (nav.hardwareConcurrency && nav.hardwareConcurrency < 4) return true;

  // Check for reduced motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;

  return false;
}

/** Check if prefers-reduced-motion is enabled */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Get optimal animation count based on device */
export function getOptimalAnimationCount(): number {
  if (isLowEndDevice()) return 10;
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    if (navigator.hardwareConcurrency >= 8) return 50;
    if (navigator.hardwareConcurrency >= 4) return 30;
  }
  return 20;
}

/** Check if element is visible (for lazy initialization) */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight &&
    rect.bottom > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0
  );
}

/** Check if Intersection Observer is available */
export function isIntersectionObserverAvailable(): boolean {
  return typeof IntersectionObserver !== "undefined";
}

/** Create a performance observer for animation metrics */
export function observeAnimationPerformance(
  callback: (metric: { duration: number; startTime: number }) => void,
): PerformanceObserver | null {
  if (typeof PerformanceObserver === "undefined") return null;

  try {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "measure") {
          callback({
            duration: entry.duration,
            startTime: entry.startTime,
          });
        }
      }
    });

    observer.observe({ entryTypes: ["measure"] });
    return observer;
  } catch {
    return null;
  }
}

/** Measure animation execution time */
export function measureAnimation(
  name: string,
  callback: () => void,
): void {
  if (typeof performance === "undefined") {
    callback();
    return;
  }

  performance.mark(`${name}-start`);
  callback();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);

  // Clean up marks
  performance.clearMarks(`${name}-start`);
  performance.clearMarks(`${name}-end`);
}

/** Check if GPU acceleration is supported */
export function isGPUAccelerationSupported(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;

    if (!gl) return false;

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) return true;

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
  // Check for common software renderers
  const softwareRenderers = ["SwiftShader", "Google SwiftShader", "llvmpipe"];
  return !softwareRenderers.some((sw) => renderer.includes(sw));
}

/** Get animation frame budget based on device */
export function getAnimationFrameBudget(): number {
  if (isLowEndDevice()) return 32; // 30 FPS
  return 16; // 60 FPS
}
