import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useNBodyGravity } from "./useNBodyGravity";

type NBodyGravityPreset = "default" | "solar" | "neon" | "chaos" | "binary" | "minimal";

interface NBodyGravityPresetValues {
  bodyCount?: number;
  G?: number;
  trailLength?: number;
  speed?: number;
  bodyColor?: string;
  backgroundColor?: string;
  trailOpacity?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  mergeOnCollide?: boolean;
  newBodyMass?: number;
  colorMode?: "solid" | "hue";
  showTrails?: boolean;
}

const PRESETS: Record<NBodyGravityPreset, NBodyGravityPresetValues> = {
  default: {},
  solar: {
    bodyCount: 6,
    G: 0.8,
    trailLength: 150,
  },
  neon: {
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 25,
    colorMode: "hue",
    trailOpacity: 0.7,
  },
  chaos: {
    bodyCount: 5,
    G: 0.3,
    trailLength: 300,
  },
  binary: {
    bodyCount: 3,
  },
  minimal: {
    glowEffect: false,
    trailOpacity: 0.3,
    backgroundColor: "#111111",
    colorMode: "solid",
    bodyColor: "#ffffff",
  },
};

export interface NBodyGravityProps extends BaseCanvasProps {
  /** Initial body count for random presets (default: 3) */
  bodyCount?: number;
  /** Gravitational constant (default: 0.5) */
  G?: number;
  /** Trail history length per body (default: 200) */
  trailLength?: number;
  /** Simulation speed multiplier (default: 1) */
  speed?: number;
  /** Body color when colorMode is "solid" (default: "#ffffff") */
  bodyColor?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Maximum trail opacity (default: 0.6) */
  trailOpacity?: number;
  /** Glow on bodies (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 20) */
  glowBlur?: number;
  /** Click to add new bodies (default: true) */
  interactive?: boolean;
  /** Gravitational softening in px — prevents singularities (default: 20) */
  softening?: number;
  /** Merge bodies on close approach (default: true) */
  mergeOnCollide?: boolean;
  /** Mass of click-spawned bodies (default: 5) */
  newBodyMass?: number;
  /** "hue" = rainbow cycling, "solid" = bodyColor (default: "hue") */
  colorMode?: "solid" | "hue";
  /** Show orbital trail history (default: true) */
  showTrails?: boolean;
  /** Named preset */
  preset?: NBodyGravityPreset | string;
}

export const NBodyGravity = forwardRef<HTMLCanvasElement, NBodyGravityProps>(
  (props, ref) => {
    const {
      preset,
      bodyCount, G, trailLength, speed,
      bodyColor, backgroundColor, trailOpacity,
      glowEffect, glowBlur, interactive, softening,
      mergeOnCollide, newBodyMass, colorMode, showTrails,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as NBodyGravityPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useNBodyGravity(internalRef, {
      bodyCount:      bodyCount      ?? p.bodyCount      ?? 3,
      G:              G              ?? p.G              ?? 0.5,
      trailLength:    trailLength    ?? p.trailLength    ?? 200,
      speed:          speed          ?? p.speed          ?? 1,
      bodyColor:      bodyColor      ?? p.bodyColor      ?? "#ffffff",
      backgroundColor:backgroundColor ?? p.backgroundColor ?? "#111111",
      trailOpacity:   trailOpacity   ?? p.trailOpacity   ?? 0.6,
      glowEffect:     glowEffect     ?? p.glowEffect     ?? true,
      glowBlur:       glowBlur       ?? p.glowBlur       ?? 20,
      interactive:    interactive    ?? true,
      softening:      softening      ?? 20,
      mergeOnCollide: mergeOnCollide ?? p.mergeOnCollide ?? true,
      newBodyMass:    newBodyMass    ?? p.newBodyMass    ?? 5,
      colorMode:      colorMode      ?? p.colorMode      ?? "hue",
      showTrails:     showTrails     ?? p.showTrails     ?? true,
      preset:         preset         ?? "default",
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
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

NBodyGravity.displayName = "NBodyGravity";
