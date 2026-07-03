import { forwardRef, useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils";
import { getNormalizedMouseOffset } from "../animations";

interface PortalDepthProps {
  children: ReactNode;
  enabled?: boolean;
  perspective?: number;
  maxRotate?: number;
  className?: string;
}

/**
 * PortalDepth — 3D perspective tilt following mouse.
 * Spring-smoothed, snaps back to rest on leave.
 */
export const PortalDepth = forwardRef<HTMLDivElement, PortalDepthProps>(
  ({ children, enabled = true, perspective = 800, maxRotate = 5, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const rotateX = useSpring(rawY, { stiffness: 300, damping: 30 });
    const rotateY = useSpring(rawX, { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !enabled) return;
        const { x, y } = getNormalizedMouseOffset(
          e.clientX,
          e.clientY,
          containerRef.current.getBoundingClientRect(),
        );
        rawX.set(x * maxRotate * 2);
        rawY.set(-y * maxRotate * 2);
      },
      [enabled, maxRotate, rawX, rawY],
    );

    const handleMouseLeave = useCallback(() => {
      setIsHovered(false);
      rawX.set(0);
      rawY.set(0);
    }, [rawX, rawY]);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);

    if (!enabled) {
      return (
        <div ref={ref} className={className}>
          {children}
        </div>
      );
    }

    return (
      <motion.div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={cn("relative", className)}
        style={{ perspective }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        aria-hidden="true"
      >
        <motion.div
          style={{
            rotateX: isHovered ? rotateX : 0,
            rotateY: isHovered ? rotateY : 0,
            transformStyle: "preserve-3d",
          }}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  },
);

PortalDepth.displayName = "PortalDepth";
