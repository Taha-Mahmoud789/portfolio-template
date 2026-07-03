/**
 * SpaceSections — Content from Mission Control
 *
 * Text feels like a transmission.
 * Sparse. Distant. The cosmos is the primary visual.
 * The 3D scene is rendered behind this component.
 */

import type { SpaceSectionsProps } from "../types";

// ============================================================================
// Data
// ============================================================================

const SECTIONS = [
  {
    id: "coordinates",
    label: "COORDINATES",
    content: "RA 17h 45m 40.0s / Dec -29° 0′ 28″",
    sub: "Galactic Center — Sagittarius A*",
  },
  {
    id: "signal",
    label: "SIGNAL",
    content: "Voyager 1 —Pale Blue Dot",
    sub: "40.5 billion km from Earth",
  },
  {
    id: "mission",
    label: "MISSION LOG",
    content: "The universe is under no obligation to make sense to you.",
    sub: "Entry 7,342 — Still observing",
  },
] as const;

// ============================================================================
// Component
// ============================================================================

export function SpaceSections({ className }: SpaceSectionsProps) {
  return (
    <section className={`relative w-full ${className ?? ""}`} aria-label="Space World content">
      {/* Event Horizon — visible boundary between cosmos and interface */}
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "rgba(99, 102, 241, 0.1)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 py-32 sm:px-8 md:py-48">
        {/* Transmission grid — sparse, weighted left */}
        <div className="flex flex-col gap-24 md:gap-32">
          {SECTIONS.map((section) => (
            <article key={section.id} className="group relative max-w-md">
              {/* Label — typewriter mono */}
              <div className="mb-4 font-['JetBrains_Mono',_monospace] text-[10px] font-medium tracking-[0.3em] text-[#6366f1]">
                {section.label}
              </div>

              {/* Content — serif, distant */}
              <h2 className="font-['Space_Grotesk',_sans-serif] text-xl font-extralight leading-[1.6] tracking-[0.05em] text-[#e2e8f0] sm:text-2xl">
                {section.content}
              </h2>

              {/* Sub — ghost text */}
              <p className="mt-3 font-['Inter',_sans-serif] text-sm font-light tracking-[0.05em] text-[#475569]">
                {section.sub}
              </p>

              {/* Bottom line — event horizon reference */}
              <div className="mt-6 h-px w-12 bg-gradient-to-r from-[rgba(99,102,241,0.3)] to-transparent" />
            </article>
          ))}
        </div>

        {/* Coordinates footer — transmission metadata */}
        <div className="mt-32 border-t border-[rgba(99,102,241,0.08)] pt-8">
          <p className="font-['JetBrains_Mono',_monospace] text-[10px] tracking-[0.3em] text-[#334155]">
            TRANSMISSION END — SIGNAL LOST
          </p>
        </div>
      </div>
    </section>
  );
}
