import { forwardRef, useCallback, useRef, useMemo } from "react";
import { motion, useMotionValue, AnimatePresence } from "framer-motion";
import { cn } from "@/utils";
import type { PortalCardProps } from "../types";
import {
  PORTAL_ANIMATION_PRESETS,
  PORTAL_STATUS_DEFAULTS,
  PORTAL_INTERACTION_DEFAULTS,
} from "../constants";
import { getNormalizedMouseOffset } from "../animations";
import { PortalIcon } from "./PortalIcon";
import { PortalGlow } from "./PortalGlow";

/**
 * PortalCard — a single world gateway.
 *
 * Single-click selects. Enter/Space activates.
 * Keyboard arrow navigation is handled by PortalGrid.
 * Respects prefers-reduced-motion via config.
 */
export const PortalCard = forwardRef<HTMLDivElement, PortalCardProps>(
  ({ portal, index, isSelected = false, onSelect, onActivate, className, children }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const statusConfig = PORTAL_STATUS_DEFAULTS[portal.status];
    const animPreset = PORTAL_ANIMATION_PRESETS[portal.animationPreset];

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        const el = innerRef.current;
        if (!el || !statusConfig.interactive) return;
        const rect = el.getBoundingClientRect();
        const { x, y } = getNormalizedMouseOffset(e.clientX, e.clientY, rect);
        mouseX.set(x);
        mouseY.set(y);
      },
      [mouseX, mouseY, statusConfig.interactive],
    );

    const handleMouseLeave = useCallback(() => {
      mouseX.set(0);
      mouseY.set(0);
    }, [mouseX, mouseY]);

    const handleClick = useCallback(() => {
      if (!statusConfig.interactive) return;
      onSelect?.(portal.id);
    }, [portal.id, onSelect, statusConfig.interactive]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (statusConfig.interactive) {
            onActivate?.(portal.id);
          }
        }
      },
      [portal.id, onActivate, statusConfig.interactive],
    );

    const backgroundStyle = useMemo(() => {
      switch (portal.background.type) {
        case "gradient":
          return { background: portal.background.value };
        case "image":
          return {
            background: `url(${portal.background.value}) center/cover no-repeat`,
          };
        case "mesh":
          return { background: portal.background.value };
        default:
          return { background: portal.background.fallbackColor };
      }
    }, [portal.background]);

    const entranceDelay = index * 0.08;
    const entrance = animPreset.entrance;

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="gridcell"
        tabIndex={statusConfig.tabIndex}
        aria-label={`${portal.title} world portal — ${portal.description}`}
        aria-selected={isSelected}
        aria-disabled={!statusConfig.interactive}
        className={cn(
          "relative rounded-2xl overflow-hidden outline-none",
          "transition-shadow duration-300",
          "focus-visible:ring-2 focus-visible:ring-offset-2",
          !statusConfig.interactive && "pointer-events-none select-none",
          className,
        )}
        style={{
          opacity: statusConfig.opacity,
          perspective: 800,
          ["--tw-ring-color" as string]: PORTAL_INTERACTION_DEFAULTS.focus.ringColor,
          ["--tw-ring-offset-width" as string]: `${String(PORTAL_INTERACTION_DEFAULTS.focus.ringOffset)}px`,
        }}
        initial={{ opacity: 0, scale: 0.9, y: 30, ...entrance }}
        animate={{
          opacity: statusConfig.opacity,
          scale: 1,
          y: 0,
          ...(!isSelected ? {} : {}),
        }}
        transition={{
          duration: 0.6,
          delay: entranceDelay,
          ease: [0.23, 1, 0.32, 1],
        }}
        whileHover={
          statusConfig.interactive
            ? {
                scale: animPreset.hover.scale ?? 1.03,
                y: animPreset.hover.y ?? -8,
                transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
              }
            : undefined
        }
        whileTap={statusConfig.interactive ? { scale: 0.98 } : undefined}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        data-portal-id={portal.id}
        data-portal-status={portal.status}
        data-selected={isSelected}
      >
        {/* Background layer */}
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={backgroundStyle}
        />

        {/* Accent overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${portal.accent.color}22 0%, transparent 50%)`,
          }}
        />

        {/* Custom overlay */}
        {portal.background.overlay && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: portal.background.overlay.color,
              opacity: portal.background.overlay.opacity,
              mixBlendMode: portal.background.overlay
                .blendMode as React.CSSProperties["mixBlendMode"],
            }}
          />
        )}

        {/* Glow on hover */}
        <PortalGlow
          color={portal.accent.color}
          intensity={isSelected ? 0.6 : 0}
          spread={30}
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
          <div className="flex items-start justify-between">
            <PortalIcon icon={portal.icon} size={48} className="text-white drop-shadow-lg" />
            {portal.status !== "active" && (
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                  portal.status === "coming-soon" && "bg-yellow-500/30 text-yellow-200",
                  portal.status === "disabled" && "bg-red-500/30 text-red-200",
                  portal.status === "locked" && "bg-gray-500/30 text-gray-200",
                )}
              >
                {portal.status === "coming-soon"
                  ? "Coming Soon"
                  : portal.status === "locked"
                    ? "Locked"
                    : "Unavailable"}
              </span>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{portal.title}</h3>
            <p className="text-sm text-white/70 mb-2 font-medium">{portal.subtitle}</p>
            <p className="text-xs text-white/50 line-clamp-2">{portal.description}</p>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <div
              className="h-1 flex-1 rounded-full opacity-60"
              style={{ background: portal.accent.gradient }}
            />
            <svg
              className="w-4 h-4 text-white/60 group-hover:text-white/90 transition-all duration-300 group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Selection ring */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              className="absolute inset-0 border-2 rounded-2xl pointer-events-none"
              style={{ borderColor: portal.accent.color }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>

        {children}
      </motion.div>
    );
  },
);

PortalCard.displayName = "PortalCard";
