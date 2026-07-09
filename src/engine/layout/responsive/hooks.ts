/**
 * Responsive Hooks
 *
 * Hooks for querying breakpoints, viewport size, and element dimensions.
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { BREAKPOINTS, BREAKPOINT_ORDER, type Breakpoint } from "./breakpoints";

/**
 * Returns the current active breakpoint based on viewport width.
 *
 * Uses mobile-first min-width matching (same as Tailwind).
 *
 * @returns The largest matching breakpoint ("xs" if below sm)
 *
 * @example
 * const bp = useBreakpoint(); // "md"
 * const isDesktop = bp === "lg" || bp === "xl" || bp === "2xl";
 */
export function useBreakpoint(): Breakpoint | "xs" {
  const [breakpoint, setBreakpoint] = useState<Breakpoint | "xs">(() => {
    if (typeof window === "undefined") return "xs";
    return getBreakpointFromWidth(window.innerWidth);
  });

  useEffect(() => {
    function handleResize() {
      setBreakpoint(getBreakpointFromWidth(window.innerWidth));
    }

    // Use matchMedia for each breakpoint for efficiency
    const mqls = BREAKPOINT_ORDER.map((bp) => {
      const mql = window.matchMedia(`(min-width: ${String(BREAKPOINTS[bp])}px)`);
      mql.addEventListener("change", handleResize);
      return mql;
    });

    handleResize();

    return () => {
      mqls.forEach((mql) => mql.removeEventListener("change", handleResize));
    };
  }, []);

  return breakpoint;
}

function getBreakpointFromWidth(width: number): Breakpoint | "xs" {
  let result: Breakpoint | "xs" = "xs";
  for (const bp of BREAKPOINT_ORDER) {
    if (width >= BREAKPOINTS[bp]) {
      result = bp;
    }
  }
  return result;
}

/**
 * Returns true if the current viewport matches or exceeds the given breakpoint.
 *
 * @param bp - Minimum breakpoint to match
 *
 * @example
 * const isDesktop = useMinBreakpoint("lg");
 * const isMobile = !useMinBreakpoint("md");
 */
export function useMinBreakpoint(bp: Breakpoint): boolean {
  const current = useBreakpoint();
  const currentIndex = BREAKPOINT_ORDER.indexOf(current as Breakpoint);
  const targetIndex = BREAKPOINT_ORDER.indexOf(bp);

  if (current === "xs") return false;
  return currentIndex >= targetIndex;
}

/**
 * Returns viewport width and height.
 *
 * Updates on resize with optional debounce.
 *
 * @param debounceMs - Optional debounce in ms (0 = no debounce)
 */
export function useWindowSize(debounceMs = 0) {
  const [size, setSize] = useState(() => {
    if (typeof window === "undefined") return { width: 0, height: 0 };
    return { width: window.innerWidth, height: window.innerHeight };
  });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;

    function handleResize() {
      if (debounceMs > 0) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSize((prev) => {
            const next = { width: window.innerWidth, height: window.innerHeight };
            return prev.width === next.width && prev.height === next.height ? prev : next;
          });
        }, debounceMs);
      } else {
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          setSize((prev) => {
            const next = { width: window.innerWidth, height: window.innerHeight };
            return prev.width === next.width && prev.height === next.height ? prev : next;
          });
        });
      }
    }

    window.addEventListener("resize", handleResize, { passive: true });
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [debounceMs]);

  return size;
}

/**
 * Returns device pixel ratio.
 */
export function useDevicePixelRatio(): number {
  const [dpr, setDpr] = useState(() => {
    if (typeof window === "undefined") return 1;
    return window.devicePixelRatio || 1;
  });

  useEffect(() => {
    function handleChange() {
      setDpr(window.devicePixelRatio || 1);
    }

    // Listen for resolution changes (zoom, display changes)
    const mql = window.matchMedia(`(resolution: ${String(dpr)}dppx)`);
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [dpr]);

  return dpr;
}

/**
 * Returns screen orientation.
 */
export function useOrientation(): "portrait" | "landscape" {
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(() => {
    if (typeof window === "undefined") return "portrait";
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  });

  useEffect(() => {
    function handleResize() {
      setOrientation(window.innerWidth > window.innerHeight ? "landscape" : "portrait");
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}

/**
 * Observe size changes on an element using ResizeObserver.
 *
 * @returns [ref, size] — attach ref to the element to observe
 *
 * @example
 * const [ref, size] = useResizeObserver();
 * <div ref={ref}>Width: {size.width}</div>
 */
export function useResizeObserver(): [
  React.RefCallback<HTMLElement>,
  { width: number; height: number },
] {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const observerRef = useRef<ResizeObserver | null>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  const ref = useCallback((element: HTMLElement | null) => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    elementRef.current = element;

    if (element) {
      observerRef.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          const { width, height } = entry.contentRect;
          setSize((prev) =>
            prev.width === width && prev.height === height ? prev : { width, height },
          );
        }
      });
      observerRef.current.observe(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return [ref, size];
}

/**
 * Returns true if the user prefers reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    function handleChange() {
      setPrefersReduced(mql.matches);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return prefersReduced;
}

/**
 * Returns true if the device supports hover (non-touch).
 */
export function useSupportsHover(): boolean {
  const [supports, setSupports] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(hover: hover)").matches;
  });

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover)");
    function handleChange() {
      setSupports(mql.matches);
    }
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return supports;
}

/**
 * Returns current scroll position and progress.
 *
 * @param element - Optional scroll container (defaults to window)
 */
export function useScrollPosition(element?: React.RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 0, y: 0, progress: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const target = element?.current ?? window;

    function handleScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        if (target === window) {
          const scrollY = window.scrollY;
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
          setPosition({
            x: window.scrollX,
            y: scrollY,
            progress: maxScroll > 0 ? scrollY / maxScroll : 0,
          });
        } else {
          const el = target as HTMLElement;
          setPosition({
            x: el.scrollLeft,
            y: el.scrollTop,
            progress:
              el.scrollHeight > el.clientHeight
                ? el.scrollTop / (el.scrollHeight - el.clientHeight)
                : 0,
          });
        }
      });
    }

    target.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      target.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [element]);

  return position;
}

/**
 * Smooth scroll to an element or position.
 */
export function useScrollTo() {
  return useCallback((options: ScrollToOptions | HTMLElement | number) => {
    if (typeof options === "number") {
      window.scrollTo({ top: options, behavior: "smooth" });
    } else if (options instanceof HTMLElement) {
      options.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (typeof options === "object" && "top" in options) {
      window.scrollTo({ ...options, behavior: options.behavior ?? "smooth" });
    }
  }, []);
}
