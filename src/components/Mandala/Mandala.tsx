import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useMandala } from "./useMandala";

type MandalaPreset = "default" | "neon" | "lotus" | "cosmic" | "minimal";

interface MandalaPresetValues {
  symmetry?: number;
  colors?: string[];
  lineWidth?: number;
  speed?: number;
  layers?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  strokeOpacity?: number;
  mirror?: boolean;
  noiseAmount?: number;
  backgroundColor?: string;
}

export const PRESETS: Record<MandalaPreset, MandalaPresetValues> = {
  default: {
    symmetry: 8,
    colors: ["#ffffff", "#6b7280"],
    lineWidth: 1.5,
    speed: 1,
    layers: 5,
    glowEffect: true,
    glowBlur: 10,
    strokeOpacity: 0.8,
    mirror: true,
    noiseAmount: 0.3,
    backgroundColor: "#111111",
  },
  neon: {
    symmetry: 12,
    colors: ["#00ffff", "#ff00ff", "#7C3AED", "#00ff41"],
    lineWidth: 1,
    speed: 1.5,
    layers: 6,
    glowEffect: true,
    glowBlur: 20,
    strokeOpacity: 0.9,
    mirror: true,
    noiseAmount: 0.5,
    backgroundColor: "#000000",
  },
  lotus: {
    symmetry: 6,
    colors: ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24"],
    lineWidth: 2,
    speed: 0.5,
    layers: 4,
    glowEffect: true,
    glowBlur: 8,
    strokeOpacity: 0.7,
    mirror: true,
    noiseAmount: 0.2,
    backgroundColor: "#0c0005",
  },
  cosmic: {
    symmetry: 16,
    colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
    lineWidth: 0.8,
    speed: 0.8,
    layers: 7,
    glowEffect: true,
    glowBlur: 15,
    strokeOpacity: 0.6,
    mirror: false,
    noiseAmount: 0.6,
    backgroundColor: "#030014",
  },
  minimal: {
    symmetry: 6,
    colors: ["#e2e8f0", "#94a3b8"],
    lineWidth: 1,
    speed: 0.3,
    layers: 3,
    glowEffect: false,
    strokeOpacity: 0.5,
    mirror: true,
    noiseAmount: 0.1,
    backgroundColor: "#0f172a",
  },
};

export interface MandalaProps extends BaseCanvasProps {
  /** Number of rotational symmetry arms (default: 8) */
  symmetry?: number;
  /** Stroke colors cycled per layer (default: multi-color) */
  colors?: string[];
  /** Stroke line width (default: 1.5) */
  lineWidth?: number;
  /** Rotation animation speed (default: 1) */
  speed?: number;
  /** Number of concentric petal layers (default: 5) */
  layers?: number;
  /** Outer radius as fraction of canvas min dimension (default: 1) */
  radius?: number;
  /** Canvas background color (default: "#050010") */
  backgroundColor?: string;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Glow effect (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 10) */
  glowBlur?: number;
  /** Layer stroke opacity 0–1 (default: 0.8) */
  strokeOpacity?: number;
  /** Mirror each arm for bilateral symmetry (default: true) */
  mirror?: boolean;
  /** Organic noise distortion 0–1 (default: 0.3) */
  noiseAmount?: number;
  /** Named preset */
  preset?: MandalaPreset | string;
}

export const Mandala = forwardRef<HTMLCanvasElement, MandalaProps>(
  (props, ref) => {
    const {
      preset, symmetry, colors, lineWidth, speed, layers, radius,
      backgroundColor, animated, glowEffect, glowBlur,
      strokeOpacity, mirror, noiseAmount,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as MandalaPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useMandala(internalRef, {
      symmetry: symmetry ?? p.symmetry ?? 8,
      colors: colors ?? p.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: lineWidth ?? p.lineWidth ?? 1.5,
      speed: speed ?? p.speed ?? 1,
      layers: layers ?? p.layers ?? 5,
      radius: radius ?? 1,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      animated: animated ?? true,
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 10,
      strokeOpacity: strokeOpacity ?? p.strokeOpacity ?? 0.8,
      mirror: mirror ?? p.mirror ?? true,
      noiseAmount: noiseAmount ?? p.noiseAmount ?? 0.3,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

Mandala.displayName = "Mandala";
