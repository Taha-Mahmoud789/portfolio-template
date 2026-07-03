/**
 * SpaceHero — The First Moment
 *
 * A single point of light in the void.
 * It pulses. It waits. It is the beginning.
 * The 3D scene is rendered behind this component.
 */

import { useEffect, useState } from "react";
import type { SpaceHeroProps } from "../types";

// ============================================================================
// Component
// ============================================================================

export function SpaceHero({ className }: SpaceHeroProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`relative flex h-screen w-full flex-col items-center justify-center overflow-hidden ${className ?? ""}`}
      aria-label="Space World introduction"
    >
      {/* The Singularity — single pulsing point of light */}
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-[2000ms] ease-out ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {/* Core point */}
        <div className="relative mb-12">
          <div
            className="h-2 w-2 rounded-full bg-[#e2e8f0]"
            style={{
              boxShadow:
                "0 0 20px rgba(99, 102, 241, 0.6), 0 0 60px rgba(99, 102, 241, 0.3), 0 0 100px rgba(99, 102, 241, 0.1)",
              animation: "space-pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* World title — emerges from blur */}
        <h1
          className="font-['Space_Grotesk',_sans-serif] text-3xl font-extralight tracking-[0.2em] text-[#e2e8f0] sm:text-4xl md:text-5xl"
          style={{
            animation: "space-emerge 1.5s ease-out 0.8s both",
          }}
        >
          {"Space".split("").map((letter, i) => (
            <span
              key={`space-${String(i)}`}
              className="inline-block"
              style={{
                animationDelay: `${String(0.8 + i * 0.05)}s`,
                animation: "space-letter 0.6s ease-out both",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Subtitle — transmission from mission control */}
        <p
          className="mt-6 font-['Inter',_sans-serif] text-sm font-light tracking-[0.15em] text-[#64748b] sm:text-base"
          style={{
            animation: "space-emerge 1.5s ease-out 1.5s both",
          }}
        >
          The cosmos is indifferent
        </p>

        {/* Scroll indicator — gravitational pull */}
        <div
          className="absolute -bottom-20 flex flex-col items-center gap-2"
          style={{
            animation: "space-emerge 1.5s ease-out 2.5s both",
          }}
        >
          <span className="font-['JetBrains_Mono',_monospace] text-[10px] tracking-[0.3em] text-[#475569]">
            SCROLL TO EXPLORE
          </span>
          <div
            className="h-8 w-px bg-gradient-to-b from-[#6366f1] to-transparent"
            style={{
              animation: "space-drift 3s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes space-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes space-emerge {
          from { opacity: 0; filter: blur(8px); transform: translateY(10px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes space-letter {
          from { opacity: 0; filter: blur(4px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes space-drift {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
