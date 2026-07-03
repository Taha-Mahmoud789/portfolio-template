import { forwardRef } from "react";
import { cn } from "@/utils";
import type { PortalGlowProps } from "../types";

function toHexOpacity(intensity: number): string {
  return Math.round(intensity * 255)
    .toString(16)
    .padStart(2, "0");
}

/**
 * PortalGlow — colored glow effect overlay.
 */
export const PortalGlow = forwardRef<HTMLDivElement, PortalGlowProps>(
  ({ color, intensity = 0.4, spread = 20, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("pointer-events-none", className)}
        style={{
          boxShadow: `0 0 ${String(spread)}px ${color}${toHexOpacity(intensity)}`,
        }}
        aria-hidden="true"
      />
    );
  },
);

PortalGlow.displayName = "PortalGlow";
