import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useLorenzAttractor, ColorMode } from "./useLorenzAttractor";

type LorenzAttractorPreset = "default" | "neon" | "cosmic" | "ghost" | "chaos" | "minimal";

interface PresetValues {
  sigma?: number;
  rho?: number;
  beta?: number;
  traceColor?: string;
  backgroundColor?: string;
  trailLength?: number;
  speed?: number;
  rotationSpeed?: number;
  lineWidth?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  colorMode?: ColorMode;
}

const PRESETS: Record<LorenzAttractorPreset, PresetValues> = {
  default: {},
  neon: {
    traceColor: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 8,
    colorMode: "cycle",
  },
  cosmic: {
    traceColor: "#c084fc",
    backgroundColor: "#030014",
    glowEffect: true,
    colorMode: "age",
  },
  ghost: {
    traceColor: "#ffffff",
    backgroundColor: "#111111",
    lineWidth: 0.5,
    trailLength: 5000,
  },
  chaos: {
    sigma: 14,
    rho: 35,
    beta: 2.2,
    traceColor: "#ff4444",
    backgroundColor: "#0a0000",
  },
  minimal: {
    traceColor: "#6b7280",
    backgroundColor: "#111111",
    lineWidth: 1,
    colorMode: "solid",
  },
};

export interface LorenzAttractorProps extends BaseCanvasProps {
  /** Lorenz sigma parameter (default 10) */
  sigma?: number;
  /** Lorenz rho parameter (default 28) */
  rho?: number;
  /** Lorenz beta parameter (default 2.667) */
  beta?: number;
  /** Trail stroke color (default "#ffffff") */
  traceColor?: string;
  /** Canvas background color (default "#111111") */
  backgroundColor?: string;
  /** Maximum trail points in ring buffer (default 3000) */
  trailLength?: number;
  /** Integration speed multiplier (default 1) */
  speed?: number;
  /** Auto-rotation radians per frame (default 0.003) */
  rotationSpeed?: number;
  /** Trail stroke width in pixels (default 1) */
  lineWidth?: number;
  /** Enable glow/bloom effect on trail (default false) */
  glowEffect?: boolean;
  /** Glow blur radius in pixels (default 10) */
  glowBlur?: number;
  /** Enable mouse-drag orbit control (default true) */
  interactive?: boolean;
  /** Zoom scale multiplier (default 1) */
  scale?: number;
  /** Color mode: "solid" | "age" | "cycle" (default "age") */
  colorMode?: ColorMode;
  /** Enable animation loop (default true) */
  animated?: boolean;
  preset?: LorenzAttractorPreset | string;
}

export const LorenzAttractor = forwardRef<HTMLCanvasElement, LorenzAttractorProps>(
  (props, ref) => {
    const {
      preset,
      sigma,
      rho,
      beta,
      traceColor,
      backgroundColor,
      trailLength,
      speed,
      rotationSpeed,
      lineWidth,
      glowEffect,
      glowBlur,
      interactive,
      scale,
      colorMode,
      animated,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as LorenzAttractorPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useLorenzAttractor(internalRef, {
      sigma:         sigma         ?? p.sigma         ?? 10,
      rho:           rho           ?? p.rho           ?? 28,
      beta:          beta          ?? p.beta          ?? 2.667,
      traceColor:    traceColor    ?? p.traceColor    ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      trailLength:   trailLength   ?? p.trailLength   ?? 3000,
      speed:         speed         ?? p.speed         ?? 1,
      rotationSpeed: rotationSpeed ?? p.rotationSpeed ?? 0.003,
      lineWidth:     lineWidth     ?? p.lineWidth     ?? 1,
      glowEffect:    glowEffect    ?? p.glowEffect    ?? false,
      glowBlur:      glowBlur      ?? p.glowBlur      ?? 10,
      interactive:   interactive   ?? true,
      scale:         scale         ?? 1,
      colorMode:     colorMode     ?? p.colorMode     ?? "age",
      animated:      animated      ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "grab",
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

LorenzAttractor.displayName = "LorenzAttractor";
