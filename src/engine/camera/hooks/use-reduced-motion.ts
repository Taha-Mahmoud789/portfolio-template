/**
 * Cinematic Camera System — useReducedMotion
 *
 * Accessibility hook for reduced motion preference.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCameraContext } from "../providers/camera-provider";

export function useReducedMotion() {
  const { manager } = useCameraContext();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    manager.setReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      manager.setReducedMotion(e.matches);
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [manager]);

  const setReducedMotion = useCallback(
    (enabled: boolean) => {
      setPrefersReducedMotion(enabled);
      manager.setReducedMotion(enabled);
    },
    [manager],
  );

  return useMemo(
    () => ({
      prefersReducedMotion,
      setReducedMotion,
    }),
    [prefersReducedMotion, setReducedMotion],
  );
}
