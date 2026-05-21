import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSpirograph } from "./useSpirograph";

type SpirographPreset = "default" | "neon" | "prismatic" | "mandala" | "cosmic" | "minimal";

interface SpirographPresetValues {
  colors?: string[];
  backgroundColor?: string;
  lineWidth?: number;
  speed?: number;
  trailFade?: number;
  innerRadius?: number;
  penDistance?: number;
  layerCount?: number;
  symmetry?: number;
  glowEffect?: boolean;
  glowBlur?: number;
}

const PRESETS: Record<SpirographPreset, SpirographPresetValues> = {
  default: {},
  neon: {
    colors: ["#00ffff", "#ff00ff"],
    backgroundColor: "#000000",
    lineWidth: 1.5,
    glowEffect: true,
    glowBlur: 15,
    trailFade: 0.005,
  },
  prismatic: {
    colors: ["#ff2244", "#22aaff", "#44ff88"],
    layerCount: 3,
    symmetry: 2,
    lineWidth: 1,
    trailFade: 0.004,
    backgroundColor: "#050005",
  },
  mandala: {
    colors: ["#ff00ff", "#00ffff"],
    symmetry: 6,
    layerCount: 2,
    glowEffect: true,
    glowBlur: 12,
    trailFade: 0.002,
    backgroundColor: "#000000",
  },
  cosmic: {
    colors: ["#ff4488", "#44ffff", "#ffff44", "#44ff88"],
    layerCount: 4,
    glowEffect: true,
    glowBlur: 10,
    trailFade: 0.002,
    backgroundColor: "#020008",
    lineWidth: 1,
  },
  minimal: {
    colors: ["#ffffff"],
    speed: 0.5,
    lineWidth: 0.5,
    trailFade: 0.001,
  },
};

export interface SpirographProps extends BaseCanvasProps {
  /** Outer circle R as fraction of min(w,h)/2 (default: 0.85) */
  outerRadius?: number;
  /** Inner circle r as fraction of outerRadius (default: 0.4) */
  innerRadius?: number;
  /** Pen arm d as fraction of innerRadius (default: 0.9) */
  penDistance?: number;
  /** Degrees drawn per frame (default: 2) */
  speed?: number;
  /** Stroke colors — each layer picks cyclically (default: ["#ffffff"]) */
  colors?: string[];
  /** Background fill color (default: "#111111") */
  backgroundColor?: string;
  /** Stroke line width (default: 1) */
  lineWidth?: number;
  /** Background fade opacity per frame — lower = longer trails (default: 0.003) */
  trailFade?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Randomize and restart after each full cycle (default: true) */
  autoReset?: boolean;
  /** Number of overlapping curve layers with slight radius offsets (default: 1) */
  layerCount?: number;
  /** Rotational symmetry — draw N copies around center (default: 1) */
  symmetry?: number;
  /** Enable glow/shadow effect (default: false) */
  glowEffect?: boolean;
  /** Shadow blur radius for glow (default: 10) */
  glowBlur?: number;
  /** Named preset */
  preset?: SpirographPreset | string;
}

export const Spirograph = forwardRef<HTMLCanvasElement, SpirographProps>(
  (props, ref) => {
    const {
      preset,
      outerRadius,
      innerRadius,
      penDistance,
      speed,
      colors,
      backgroundColor,
      lineWidth,
      trailFade,
      animated,
      autoReset,
      layerCount,
      symmetry,
      glowEffect,
      glowBlur,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as SpirographPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSpirograph(internalRef, {
      outerRadius:     outerRadius     ?? 0.85,
      innerRadius:     innerRadius     ?? p.innerRadius   ?? 0.4,
      penDistance:     penDistance     ?? p.penDistance   ?? 0.9,
      speed:           speed           ?? p.speed         ?? 2,
      colors:          colors          ?? p.colors        ?? ["#ffffff"],
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      lineWidth:       lineWidth       ?? p.lineWidth     ?? 1,
      trailFade:       trailFade       ?? p.trailFade     ?? 0.003,
      animated:        animated        ?? true,
      autoReset:       autoReset       ?? true,
      layerCount:      layerCount      ?? p.layerCount    ?? 2,
      symmetry:        symmetry        ?? p.symmetry      ?? 1,
      glowEffect:      glowEffect      ?? p.glowEffect    ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur      ?? 10,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
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

Spirograph.displayName = "Spirograph";
