/**
 * MultiverseNav — Shared navigation for all Multiverse worlds.
 *
 * Persistent top bar with:
 *   Left: ← Multiverse (back to hub)
 *   Center: World number + name (location indicator)
 *   Right: Portfolio (exit to main portfolio)
 *
 * Reduced motion: no transitions.
 * Keyboard: all buttons focusable.
 */

import { useCallback, useRef, useEffect, memo } from "react";
import { useNavigate } from "react-router";
import { ROUTES } from "@/constants/routes";
import { useMultiverseTransition } from "@/landing/components/multiverse-transition-store";

interface MultiverseNavProps {
  /** Current world number (e.g., "01") */
  worldNumber: string;
  /** Current world name (e.g., "Projects") */
  worldName: string;
}

const S = {
  nav: `
    fixed top-0 left-0 right-0 z-50 flex items-center justify-between
    px-6 py-4 md:px-10 md:py-5
    pointer-events-none
  `,
  button: `
    inline-flex items-center gap-2
    font-[family-name:var(--font-mono)] text-[0.6rem] font-medium
    tracking-[0.15em] uppercase
    text-[rgba(245,240,232,0.35)] hover:text-[rgba(245,240,232,0.7)]
    px-4 py-2.5 rounded-full
    border border-[rgba(245,240,232,0.06)] hover:border-[rgba(245,240,232,0.12)]
    bg-[rgba(8,7,6,0.6)] backdrop-blur-[12px]
    cursor-pointer pointer-events-auto
    transition-colors duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
  `,
  backIcon: `
    transition-transform duration-300 ease-out group-hover:-translate-x-0.5
  `,
  location: `
    font-[family-name:var(--font-mono)] text-[0.55rem] font-medium
    tracking-[0.2em] uppercase
    text-[rgba(245,240,232,0.2)]
    pointer-events-none
    hidden md:block
  `,
  exitButton: `
    inline-flex items-center gap-2
    font-[family-name:var(--font-mono)] text-[0.6rem] font-medium
    tracking-[0.15em] uppercase
    text-[rgba(245,240,232,0.25)] hover:text-[rgba(245,240,232,0.6)]
    px-4 py-2.5 rounded-full
    border border-[rgba(245,240,232,0.04)] hover:border-[rgba(245,240,232,0.1)]
    bg-transparent
    cursor-pointer pointer-events-auto
    transition-colors duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
  `,
} as const;

export const MultiverseNav = memo(function MultiverseNav({
  worldNumber,
  worldName,
}: MultiverseNavProps) {
  const navigate = useNavigate();
  const startExit = useMultiverseTransition((s) => s.startExit);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup exit timer on unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    };
  }, []);

  const handleBackToHub = useCallback(() => {
    void navigate(ROUTES.MULTIVERSE);
  }, [navigate]);

  const handleExit = useCallback(() => {
    startExit();
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      void navigate(ROUTES.HOME);
    }, 400);
  }, [startExit, navigate]);

  return (
    <nav aria-label={`${worldName} navigation`} className={S.nav}>
      {/* Left: Back to Multiverse */}
      <button type="button" onClick={handleBackToHub} className={`group ${S.button}`}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={S.backIcon}
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Multiverse
      </button>

      {/* Center: Location */}
      <span className={S.location}>
        {worldNumber} {worldName}
      </span>

      {/* Right: Exit to Portfolio */}
      <button type="button" onClick={handleExit} className={S.exitButton}>
        Portfolio
      </button>
    </nav>
  );
});
