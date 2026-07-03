import { forwardRef, useCallback, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/utils";

interface PortalMagneticProps {
  children: ReactNode;
  strength?: number;
  range?: number;
  enabled?: boolean;
  className?: string;
}

/**
 * PortalMagnetic — magnetic hover follow effect.
 * Element is attracted toward cursor within range, snaps back on leave.
 */
export const PortalMagnetic = forwardRef<HTMLDivElement, PortalMagneticProps>(
  ({ children, strength = 0.15, range = 120, enabled = true, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [, setIsHovered] = useState(false);

    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const springX = useSpring(rawX, { stiffness: 300, damping: 30 });
    const springY = useSpring(rawY, { stiffness: 300, damping: 30 });

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !enabled) return;
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance < range) {
          rawX.set(deltaX * strength);
          rawY.set(deltaY * strength);
        }
      },
      [enabled, strength, range, rawX, rawY],
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
        style={{ x: springX, y: springY }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        aria-hidden="true"
      >
        {children}
      </motion.div>
    );
  },
);

PortalMagnetic.displayName = "PortalMagnetic";
