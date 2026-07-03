/**
 * Lenis Provider
 *
 * Initializes Lenis smooth scrolling and connects it to GSAP ScrollTrigger.
 * Exposes the Lenis instance via React Context so child components can
 * use the useScrollTo hook for programmatic navigation.
 *
 * Respects the user's reduced motion preference — when enabled, Lenis
 * is skipped and a native scroll listener tracks position instead.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import Lenis from "lenis";
import { useThemeStore } from "@/store/theme-store";
import { useUiStore } from "@/store/ui-store";

// ============================================================================
// Context
// ============================================================================

interface LenisContextValue {
  lenis: Lenis | null;
  reducedMotion: boolean;
}

const LenisContext = createContext<LenisContextValue>({
  lenis: null,
  reducedMotion: false,
});

export function useLenisContext() {
  return useContext(LenisContext);
}

// ============================================================================
// useScrollTo — programmatic scroll via Lenis or native fallback
// ============================================================================

export function useScrollTo() {
  const { lenis, reducedMotion } = useLenisContext();

  return useCallback(
    (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
      const offset = options?.offset ?? 0;

      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (!el) return;

        if (!reducedMotion && lenis) {
          const rect = el.getBoundingClientRect();
          const absoluteTop = rect.top + lenis.scroll;
          lenis.scrollTo(absoluteTop + offset, {
            duration: options?.duration ?? 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
        }
      } else if (typeof target === "number") {
        if (!reducedMotion && lenis) {
          lenis.scrollTo(target + offset, {
            duration: options?.duration ?? 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          window.scrollTo({ top: target + offset, behavior: reducedMotion ? "instant" : "smooth" });
        }
      } else if (target instanceof HTMLElement) {
        if (!reducedMotion && lenis) {
          const rect = target.getBoundingClientRect();
          const absoluteTop = rect.top + lenis.scroll;
          lenis.scrollTo(absoluteTop + offset, {
            duration: options?.duration ?? 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          target.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
        }
      }
    },
    [lenis, reducedMotion],
  );
}

// ============================================================================
// Provider
// ============================================================================

interface LenisProviderProps {
  children: ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisState, setLenisState] = useState<Lenis | null>(null);
  const reducedMotion = useThemeStore((s) => s.reducedMotion);
  const setScrollY = useUiStore((s) => s.setScrollY);

  useEffect(() => {
    if (reducedMotion) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      setLenisState(null);

      let ticking = false;
      function onScroll() {
        if (!ticking) {
          requestAnimationFrame(() => {
            setScrollY(window.scrollY);
            ticking = false;
          });
          ticking = true;
        }
      }

      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    setLenisState(lenis);

    lenis.on("scroll", () => {
      setScrollY(Math.round(lenis.scroll));
    });

    void import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      lenis.on("scroll", () => ScrollTrigger.update());
    });

    void import("gsap").then(({ gsap }) => {
      gsap.ticker.add((time: number) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      setLenisState(null);
    };
  }, [reducedMotion, setScrollY]);

  return (
    <LenisContext.Provider value={{ lenis: lenisState, reducedMotion }}>
      {children}
    </LenisContext.Provider>
  );
}
