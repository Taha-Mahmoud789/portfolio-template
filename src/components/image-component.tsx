/**
 * ImageComponent — Premium image display with lazy loading, WEBP support, and fallback.
 *
 * Features:
 * - Native lazy loading
 * - WEBP format optimization
 * - Graceful fallback to gradient placeholder
 * - Proper width/height to prevent layout shift
 * - Accessible alt text
 */

import { useState, useCallback } from "react";

interface ImageComponentProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  style?: React.CSSProperties;
  accentRgb?: string;
}

export function ImageComponent({
  src,
  alt,
  width,
  height,
  className,
  style,
  accentRgb = "59, 130, 246",
}: ImageComponentProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={className}
        style={{
          width: "100%",
          height: "100%",
          background: `
            radial-gradient(
              1200px circle at 50% 50%,
              rgba(${accentRgb}, 0.12) 0%,
              rgba(${accentRgb}, 0.04) 40%,
              rgba(0, 0, 0, 0.8) 100%
            ),
            linear-gradient(
              180deg,
              rgba(${accentRgb}, 0.08) 0%,
              #050608 100%
            )
          `,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...style,
        }}
      >
        <div
          aria-hidden="true"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            color: `rgba(${accentRgb}, 0.3)`,
            userSelect: "none",
          }}
        >
          {alt}
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Loading placeholder — shown before image loads */}
      {!isLoaded && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(
                600px circle at 50% 50%,
                rgba(${accentRgb}, 0.06) 0%,
                transparent 60%
              )
            `,
            filter: "blur(40px)",
          }}
        />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.6s ease",
          willChange: "opacity",
          ...style,
        }}
      />
    </>
  );
}
