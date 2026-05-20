import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useBubbleUniverse } from "./useBubbleUniverse";

type BubbleUniversePreset = "default" | "soap" | "neon" | "deep" | "minimal";

interface BubbleUniversePresetValues {
  backgroundColor?: string;
  shimmerColor?: string;
  bubbleCount?: number;
  gravity?: number;
  minRadius?: number;
  maxRadius?: number;
}

const PRESETS: Record<BubbleUniversePreset, BubbleUniversePresetValues> = {
  default: {},
  soap: {
    backgroundColor: "#050a12",
    shimmerColor: "#ffffff",
    gravity: 0.01,
    minRadius: 25,
    maxRadius: 90,
  },
  neon: {
    backgroundColor: "#000008",
    shimmerColor: "#00ffff",
    gravity: 0.015,
    bubbleCount: 12,
  },
  deep: {
    backgroundColor: "#010510",
    shimmerColor: "#88aaff",
    gravity: 0.008,
    minRadius: 15,
    maxRadius: 60,
    bubbleCount: 20,
  },
  minimal: {
    backgroundColor: "#111111",
    shimmerColor: "#ffffff",
    gravity: 0.025,
    bubbleCount: 8,
    minRadius: 30,
    maxRadius: 100,
  },
};

export interface BubbleUniverseProps extends BaseCanvasProps {
  /** Number of simultaneous bubbles (default: 15) */
  bubbleCount?: number;
  /** Minimum bubble radius in px (default: 20) */
  minRadius?: number;
  /** Maximum bubble radius in px (default: 50) */
  maxRadius?: number;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Specular highlight color (default: "#ffffff") */
  shimmerColor?: string;
  /** Click to pop bubbles with particle burst (default: true) */
  popEffect?: boolean;
  /** Downward gravity force (default: 0.02) */
  gravity?: number;
  /** Velocity friction per frame (default: 0.995) */
  friction?: number;
  /** Hover pushes bubbles; click to pop (default: true) */
  interactive?: boolean;
  /** Bubbles merge when overlapping significantly (default: true) */
  mergeOnCollide?: boolean;
  /** Iridescent glow on bubbles (default: true) */
  glowEffect?: boolean;
  /** Named preset */
  preset?: BubbleUniversePreset | string;
}

export const BubbleUniverse = forwardRef<HTMLCanvasElement, BubbleUniverseProps>(
  (props, ref) => {
    const {
      preset, bubbleCount, minRadius, maxRadius, backgroundColor, shimmerColor,
      popEffect, gravity, friction, interactive, mergeOnCollide, glowEffect,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as BubbleUniversePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useBubbleUniverse(internalRef, {
      bubbleCount:    bubbleCount    ?? p.bubbleCount    ?? 15,
      minRadius:      minRadius      ?? p.minRadius      ?? 20,
      maxRadius:      maxRadius      ?? p.maxRadius      ?? 50,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      shimmerColor:   shimmerColor   ?? p.shimmerColor   ?? "#ffffff",
      popEffect:      popEffect      ?? true,
      gravity:        gravity        ?? p.gravity        ?? 0.02,
      friction:       friction       ?? 0.995,
      interactive:    interactive    ?? true,
      mergeOnCollide: mergeOnCollide ?? true,
      glowEffect:     glowEffect     ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor:   "pointer",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

BubbleUniverse.displayName = "BubbleUniverse";
