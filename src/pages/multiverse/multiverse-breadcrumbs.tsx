/**
 * MultiverseBreadcrumbs — Location indicator for Multiverse worlds.
 *
 * Shows where the user is and where they can go.
 * Persistent at the bottom of each world page.
 *
 * Reduced motion: no animations.
 */

import { memo } from "react";
import { WORLDS } from "./worlds.config";

interface MultiverseBreadcrumbsProps {
  /** Current world ID */
  currentWorldId: string;
}

const S = {
  wrapper: `
    fixed bottom-0 left-0 right-0 z-50
    flex items-center justify-center
    px-6 py-4 md:px-10 md:py-5
    pointer-events-none
    bg-gradient-to-t from-[#050507] via-[#050507cc] to-transparent
  `,
  inner: `
    flex items-center gap-3
    pointer-events-auto
  `,
  dot: `
    w-1.5 h-1.5 rounded-full
    transition-all duration-300 ease-out
  `,
  activeDot: `
    w-6 h-1.5 rounded-full
    bg-[rgba(245,240,232,0.5)]
  `,
  label: `
    font-[family-name:var(--font-mono)] text-[0.5rem] font-medium
    tracking-[0.15em] uppercase
    text-[rgba(245,240,232,0.15)]
    ml-2
  `,
} as const;

export const MultiverseBreadcrumbs = memo(function MultiverseBreadcrumbs({
  currentWorldId,
}: MultiverseBreadcrumbsProps) {
  return (
    <div className={S.wrapper} aria-label="World location">
      <div className={S.inner}>
        {WORLDS.map((world) => {
          const isActive = world.id === currentWorldId;
          return (
            <div
              key={world.id}
              className={`${S.dot} ${isActive ? S.activeDot : ""}`}
              style={{
                background: isActive ? world.accentColor : "rgba(245, 240, 232, 0.12)",
              }}
              aria-label={`${world.name}${isActive ? " (current)" : ""}`}
            />
          );
        })}
        <span className={S.label}>{WORLDS.find((w) => w.id === currentWorldId)?.name ?? ""}</span>
      </div>
    </div>
  );
});
