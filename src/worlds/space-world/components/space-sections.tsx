/**
 * SpaceSections — Content from the Solar System
 *
 * Information about each orbit, displayed as transmissions.
 * Sparse, premium typography.
 */

import type { SpaceSectionsProps } from "../types";

const SECTIONS = [
  {
    id: "projects",
    label: "ORBIT 01 — PROJECTS",
    content: "Real products, delivered to real clients.",
    sub: "Over Benefits · Window Corner · MTS MED",
  },
  {
    id: "code",
    label: "ORBIT 02 — CODE",
    content: "The tools that make it possible.",
    sub: "React · TypeScript · GSAP · Three.js",
  },
  {
    id: "creative",
    label: "ORBIT 03 — CREATIVE",
    content: "Where design meets motion.",
    sub: "Motion · Design · Experiments",
  },
  {
    id: "future",
    label: "ORBIT 04 — FUTURE",
    content: "Always moving forward.",
    sub: "Learning · Roadmap · Ideas",
  },
] as const;

export function SpaceSections({ className }: SpaceSectionsProps) {
  return (
    <section className={`relative w-full ${className ?? ""}`} aria-label="Solar System content">
      <div
        className="absolute left-0 right-0 top-0 h-px"
        style={{ background: "rgba(201, 169, 110, 0.08)" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-4xl px-6 py-32 sm:px-8 md:py-48">
        <div className="flex flex-col gap-24 md:gap-32">
          {SECTIONS.map((section) => (
            <article key={section.id} className="group relative max-w-md">
              <div className="mb-4 font-['JetBrains_Mono',_monospace] text-[10px] font-medium tracking-[0.3em] text-[rgba(201,169,110,0.4)]">
                {section.label}
              </div>

              <h2 className="font-['Space_Grotesk',_sans-serif] text-xl font-extralight leading-[1.6] tracking-[0.05em] text-[#f5f0e8] sm:text-2xl">
                {section.content}
              </h2>

              <p className="mt-3 font-['Inter',_sans-serif] text-sm font-light tracking-[0.05em] text-[rgba(201,169,110,0.3)]">
                {section.sub}
              </p>

              <div className="mt-6 h-px w-12 bg-gradient-to-r from-[rgba(201,169,110,0.2)] to-transparent" />
            </article>
          ))}
        </div>

        <div className="mt-32 border-t border-[rgba(201,169,110,0.06)] pt-8">
          <p className="font-['JetBrains_Mono',_monospace] text-[10px] tracking-[0.3em] text-[rgba(201,169,110,0.15)]">
            END TRANSMISSION — ORBIT COMPLETE
          </p>
        </div>
      </div>
    </section>
  );
}
