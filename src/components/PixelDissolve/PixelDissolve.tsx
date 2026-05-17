import { forwardRef, useRef, useImperativeHandle, type ReactNode } from "react";
import { BaseCanvasProps } from "../../types";
import { usePixelDissolve, DissolveDirection, DissolvePattern } from "./usePixelDissolve";

export interface PixelDissolveProps extends BaseCanvasProps {
  /** Content to render beneath the dissolve overlay */
  children?: ReactNode;
  /** Pixel block size (default: 8) */
  pixelSize?: number;
  /** Dissolve animation speed 0–2 (default: 0.5) */
  speed?: number;
  /** "in" appear, "out" disappear, "both" out then in (default: "out") */
  direction?: DissolveDirection;
  /** Rising edge triggers the animation */
  trigger?: boolean;
  /** Pixel color (default: "#0a0a0a") */
  color?: string;
  /** Called when animation finishes */
  onComplete?: () => void;
  /** Speed multiplier for progress per frame (default: 0.01) */
  progressMultiplier?: number;
  /** Pixel reveal order: "random" | "center" | "edges" | "horizontal" (default: "random") */
  dissolvePattern?: DissolvePattern;
}

export const PixelDissolve = forwardRef<HTMLCanvasElement, PixelDissolveProps>(
  (
    {
      children,
      pixelSize = 8,
      speed = 0.5,
      direction = "out",
      trigger = false,
      color = "#ffffff",
      onComplete,
      progressMultiplier = 0.01,
      dissolvePattern = "random",
      width,
      height,
      className,
      style,
    },
    ref
  ) => {
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    const sourceRef = useRef<HTMLDivElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    usePixelDissolve(internalRef, sourceRef, {
      pixelSize,
      speed,
      direction,
      trigger,
      color,
      onComplete,
      progressMultiplier,
      dissolvePattern,
    });

    return (
      <div
        className={className}
        style={{ position: "relative", width: width ?? "100%", height: height ?? "100%", overflow: "hidden", ...style }}
      >
        {children && (
          <div ref={sourceRef} style={{ position: "absolute", inset: 0 }}>
            {children}
          </div>
        )}
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ position: "absolute", inset: 0, display: "block", pointerEvents: "none" }}
        />
      </div>
    );
  }
);

PixelDissolve.displayName = "PixelDissolve";
