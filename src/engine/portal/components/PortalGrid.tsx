import { forwardRef, useCallback, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils";
import type { PortalGridProps, PortalGridColumns } from "../types";
import { PortalCard } from "./PortalCard";
import { usePortalStore } from "../store";
import { getPortalGridTransition } from "../animations";

const GRID_COLUMNS: Record<PortalGridColumns, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  6: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  10: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  auto: "grid-cols-[repeat(auto-fill,minmax(280px,1fr))]",
};

/**
 * PortalGrid — responsive grid of PortalCards.
 *
 * Uses ARIA grid pattern with proper row wrappers.
 * Handles keyboard arrow navigation between cells.
 * IntersectionObserver for lazy rendering.
 */
export const PortalGrid = forwardRef<HTMLDivElement, PortalGridProps>(
  ({ portals, columns = 3, gap = "1.5rem", onSelect, onActivate, className }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const setGridReady = usePortalStore((s) => s.setGridReady);
    const setVisiblePortals = usePortalStore((s) => s.setVisiblePortals);

    // IntersectionObserver for lazy rendering
    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((e) => e.isIntersecting)
            .map((e) => e.target.getAttribute("data-portal-id"))
            .filter((id): id is string => id !== null);
          setVisiblePortals(visible);
        },
        { rootMargin: "100px", threshold: 0.1 },
      );

      const cards = el.querySelectorAll("[data-portal-id]");
      cards.forEach((card) => observer.observe(card));
      setGridReady(true);

      return () => observer.disconnect();
    }, [portals.length, setGridReady, setVisiblePortals]);

    // Arrow key navigation between grid cells
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (!target.hasAttribute("data-portal-id")) return;

        const grid = containerRef.current;
        if (!grid) return;

        const cells = Array.from(grid.querySelectorAll<HTMLElement>("[data-portal-id]"));
        const currentIndex = cells.indexOf(target);
        if (currentIndex === -1) return;

        const columnsCount =
          columns === "auto"
            ? Math.round(grid.getBoundingClientRect().width / 300)
            : columns === 10
              ? 5
              : columns;

        let nextIndex = currentIndex;
        switch (e.key) {
          case "ArrowRight":
            nextIndex = Math.min(currentIndex + 1, cells.length - 1);
            break;
          case "ArrowLeft":
            nextIndex = Math.max(currentIndex - 1, 0);
            break;
          case "ArrowDown":
            nextIndex = Math.min(currentIndex + columnsCount, cells.length - 1);
            break;
          case "ArrowUp":
            nextIndex = Math.max(currentIndex - columnsCount, 0);
            break;
          case "Home":
            nextIndex = 0;
            break;
          case "End":
            nextIndex = cells.length - 1;
            break;
          default:
            return;
        }

        if (nextIndex !== currentIndex) {
          e.preventDefault();
          cells[nextIndex]?.focus();
        }
      },
      [columns],
    );

    const gridClasses = useMemo(() => GRID_COLUMNS[columns], [columns]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        role="grid"
        aria-label="World portals"
        onKeyDown={handleKeyDown}
        className={cn("grid", gridClasses, className)}
        style={{ gap }}
      >
        {portals.map((portal, index) => (
          <motion.div
            key={portal.id}
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: getPortalGridTransition(index),
              },
            }}
          >
            <PortalCard
              portal={portal}
              index={index}
              onSelect={onSelect}
              onActivate={onActivate}
              className="h-full"
            />
          </motion.div>
        ))}
      </div>
    );
  },
);

PortalGrid.displayName = "PortalGrid";
