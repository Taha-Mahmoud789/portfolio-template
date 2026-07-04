/**
 * Story Overlay
 *
 * Cinematic UI for Story Mode.
 * Staggered text reveals. Minimal controls.
 * Apple Keynote–inspired: the content is the experience.
 */

import { useState, useEffect } from "react";
import type { StoryState, StoryControls } from "./types";

interface StoryOverlayProps {
  readonly state: StoryState;
  readonly controls: StoryControls;
  readonly caption: {
    readonly primary: string;
    readonly secondary?: string;
    readonly secondaryDelay?: number;
  } | null;
  readonly isVisible: boolean;
}

export function StoryOverlay({ state, controls, caption, isVisible }: StoryOverlayProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  // Staggered reveal: primary appears immediately, secondary after delay
  useEffect(() => {
    if (!caption?.secondary || !isVisible) {
      setShowSecondary(false);
      return;
    }

    const delay = caption.secondaryDelay ?? 800;
    const timer = setTimeout(() => setShowSecondary(true), delay);
    return () => clearTimeout(timer);
  }, [caption, isVisible, state.currentScene]);

  if (!isVisible || state.phase === "idle") return null;

  const isCompleted = state.phase === "completed";

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* Caption — centered, cinematic, staggered */}
      {caption && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-lg px-8">
            {/* Primary — appears immediately */}
            <p
              className="font-['Space_Grotesk'] text-2xl font-light tracking-wide text-[var(--color-warm-white)] transition-all duration-700 ease-out md:text-3xl"
              style={{
                opacity: 1,
                transform: "translateY(0)",
              }}
            >
              {caption.primary}
            </p>

            {/* Secondary — appears after delay */}
            {caption.secondary && (
              <p
                className="mt-3 text-sm tracking-widest text-[var(--color-muted)] transition-all duration-700 ease-out"
                style={{
                  opacity: showSecondary ? 1 : 0,
                  transform: showSecondary ? "translateY(0)" : "translateY(8px)",
                }}
              >
                {caption.secondary}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Progress — top center, minimal */}
      <div className="absolute left-1/2 top-6 -translate-x-1/2">
        <span className="text-[11px] tabular-nums tracking-wider text-[var(--color-muted)]/60">
          {String(state.currentScene + 1).padStart(2, "0")}
          <span className="mx-1 text-[var(--color-border)]">/</span>
          {String(state.totalScenes).padStart(2, "0")}
        </span>
      </div>

      {/* Scene dots — top right, minimal */}
      <div className="absolute right-6 top-6">
        <div className="flex gap-1.5">
          {Array.from({ length: state.totalScenes }, (_, i) => (
            <div
              key={String(i)}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === state.currentScene
                  ? "w-4 bg-[var(--color-warm-white)]"
                  : i < state.currentScene
                    ? "w-1 bg-[var(--color-muted)]/40"
                    : "w-1 bg-[var(--color-border)]/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Exit — bottom right, unobtrusive */}
      <div className="pointer-events-auto absolute bottom-6 right-6">
        <button
          onClick={controls.exit}
          className="text-[10px] tracking-widest text-[var(--color-muted)]/50 uppercase transition-colors hover:text-[var(--color-warm-white)]"
          aria-label="Exit story"
        >
          {isCompleted ? "Done" : "Exit"}
        </button>
      </div>

      {/* Skip hint — bottom left, fades after first scene */}
      {state.currentScene === 0 && (
        <div
          className="absolute bottom-6 left-6 transition-opacity duration-1000"
          style={{ opacity: state.sceneElapsed > 3000 ? 0 : 0.4 }}
        >
          <span className="text-[10px] tracking-wider text-[var(--color-muted)]">
            Space to pause · → to skip
          </span>
        </div>
      )}
    </div>
  );
}
