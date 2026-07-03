/**
 * World Header
 *
 * Reusable header for all worlds.
 * Provides back navigation, title display, and controls area.
 * Zero world-specific styling — all visual properties come from theme.
 */

import type { BaseWorldHeaderProps } from "../types";
import { useBaseWorldStore, selectBaseWorldTheme, selectBaseWorldId } from "../state";

// ============================================================================
// Component
// ============================================================================

export function BaseWorldHeader({
  className = "",
  showBack = true,
  showTitle = true,
  showControls = true,
  onBack,
}: BaseWorldHeaderProps) {
  const theme = useBaseWorldStore(selectBaseWorldTheme);
  const worldId = useBaseWorldStore(selectBaseWorldId);

  return (
    <header
      className={`base-world__header relative z-20 flex items-center justify-between px-6 py-4 ${className}`}
      data-world-theme={theme}
      data-world-id={worldId}
      role="banner"
    >
      <div className="flex items-center gap-4">
        {showBack && onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full transition-colors"
            aria-label="Go back"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        {showTitle && worldId && (
          <h1 className="text-sm font-medium tracking-wide uppercase">
            {worldId.replace("-world", "")}
          </h1>
        )}
      </div>
      {showControls && (
        <div className="flex items-center gap-2" role="toolbar" aria-label="World controls" />
      )}
    </header>
  );
}
