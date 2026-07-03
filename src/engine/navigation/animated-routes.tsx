/**
 * Animated Routes
 *
 * Wraps React Router's Routes with Framer Motion AnimatePresence.
 * Uses engine transition constants for consistent durations.
 */

import type { ReactNode } from "react";
import { useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigationStore, selectActiveTransition } from "./store";
import { usePageTransition } from "@/animation/hooks/use-page-transition";
import { TRANSITION_DEFAULTS } from "./constants";
import type { TransitionType } from "./types";

// ============================================================================
// AnimatedRoutes
// ============================================================================

interface AnimatedRoutesProps {
  children: ReactNode;
  transition?: TransitionType;
}

export function AnimatedRoutes({ children, transition }: AnimatedRoutesProps) {
  const location = useLocation();
  const activeTransition = useNavigationStore(selectActiveTransition);
  const transitionType = transition ?? activeTransition;

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} {...getPageTransitionProps(transitionType)}>
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// AnimatedPage
// ============================================================================

interface AnimatedPageProps {
  children: ReactNode;
  transition?: TransitionType;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function AnimatedPage({
  children,
  transition = "fade",
  direction,
  className,
}: AnimatedPageProps) {
  const { variants } = usePageTransition({
    type: transition as "fade" | "slide" | "scale" | "rotate" | "portal",
    direction,
  });

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// Transition Helper (uses engine constants)
// ============================================================================

function getPageTransitionProps(type: TransitionType) {
  const config = TRANSITION_DEFAULTS[type];
  const duration = config?.duration ?? 0.3;
  const exitDuration = duration * 0.67;

  switch (type) {
    case "fade":
    case "crossfade":
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "slide-up":
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, y: -20, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "slide-down":
      return {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, y: 20, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "slide-left":
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, x: -20, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "slide-right":
      return {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, x: 20, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "zoom":
      return {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1, transition: { duration, ease: "easeOut" } },
        exit: { opacity: 0, scale: 1.05, transition: { duration: exitDuration, ease: "easeIn" } },
      };
    case "portal":
      return {
        initial: { opacity: 0, scale: 0.8, filter: "blur(8px)" },
        animate: {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration, ease: "easeOut" },
        },
        exit: {
          opacity: 0,
          scale: 0.8,
          filter: "blur(8px)",
          transition: { duration: exitDuration, ease: "easeIn" },
        },
      };
    case "none":
      return {
        initial: {},
        animate: {},
        exit: {},
      };
    default:
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      };
  }
}
