import { useMemo } from "react";
import type { Variants } from "framer-motion";
import { useReducedMotion } from "framer-motion";

export function useReducedMotionPreference(): boolean {
  return useReducedMotion() ?? false;
}

export function useFadeVariants(duration: number = 0.5): Variants {
  const shouldReduceMotion = useReducedMotionPreference();

  return useMemo(
    () => ({
      initial: { opacity: 0 },
      animate: { opacity: 1, transition: { duration } },
      exit: { opacity: 0, transition: { duration } },
    }),
    [shouldReduceMotion, duration],
  );
}

export function useSlideVariants(direction: "up" | "down" | "left" | "right" = "up"): Variants {
  const shouldReduceMotion = useReducedMotionPreference();

  return useMemo(() => {
    if (shouldReduceMotion) {
      return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
    }

    const axis = direction === "up" || direction === "down" ? "y" : "x";
    const sign = direction === "up" || direction === "left" ? -1 : 1;

    return {
      initial: { [axis]: sign * 50, opacity: 0 },
      animate: { [axis]: 0, opacity: 1 },
      exit: { [axis]: sign * -50, opacity: 0 },
    };
  }, [shouldReduceMotion, direction]);
}
