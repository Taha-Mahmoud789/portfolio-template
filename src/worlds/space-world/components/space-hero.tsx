/**
 * SpaceHero — Solar System Introduction
 *
 * The first moment of the developer solar system.
 * A point of light grows into the core identity.
 */

import { useEffect, useState } from "react";
import type { SpaceHeroProps } from "../types";

export function SpaceHero({ className }: SpaceHeroProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      className={`relative flex h-screen w-full flex-col items-center justify-center overflow-hidden ${className ?? ""}`}
      aria-label="Developer Solar System introduction"
    >
      <div
        className={`relative z-10 flex flex-col items-center transition-all duration-[2000ms] ease-out ${
          visible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        {/* Core point */}
        <div className="relative mb-12">
          <div
            className="h-2 w-2 rounded-full bg-[#C9A96E]"
            style={{
              boxShadow:
                "0 0 20px rgba(201, 169, 110, 0.6), 0 0 60px rgba(201, 169, 110, 0.3), 0 0 100px rgba(201, 169, 110, 0.1)",
              animation: "solar-pulse 4s ease-in-out infinite",
            }}
          />
        </div>

        {/* Title */}
        <h1
          className="font-['Space_Grotesk',_sans-serif] text-3xl font-extralight tracking-[0.2em] text-[#f5f0e8] sm:text-4xl md:text-5xl"
          style={{ animation: "solar-emerge 1.5s ease-out 0.8s both" }}
        >
          {"Solar System".split("").map((letter, i) => (
            <span
              key={`solar-${String(i)}`}
              className="inline-block"
              style={{
                animationDelay: `${String(0.8 + i * 0.04)}s`,
                animation: "solar-letter 0.6s ease-out both",
              }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p
          className="mt-6 font-['Inter',_sans-serif] text-sm font-light tracking-[0.15em] text-[rgba(201,169,110,0.5)] sm:text-base"
          style={{ animation: "solar-emerge 1.5s ease-out 1.5s both" }}
        >
          Developer Solar System
        </p>

        {/* Scroll indicator */}
        <div
          className="absolute -bottom-20 flex flex-col items-center gap-2"
          style={{ animation: "solar-emerge 1.5s ease-out 2.5s both" }}
        >
          <span className="font-['JetBrains_Mono',_monospace] text-[10px] tracking-[0.3em] text-[rgba(201,169,110,0.3)]">
            CLICK TO EXPLORE
          </span>
          <div
            className="h-8 w-px bg-gradient-to-b from-[#C9A96E] to-transparent"
            style={{ animation: "solar-drift 3s ease-in-out infinite" }}
          />
        </div>
      </div>

      <style>{`
        @keyframes solar-pulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes solar-emerge {
          from { opacity: 0; filter: blur(8px); transform: translateY(10px); }
          to { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        @keyframes solar-letter {
          from { opacity: 0; filter: blur(4px); }
          to { opacity: 1; filter: blur(0); }
        }
        @keyframes solar-drift {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(8px); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
