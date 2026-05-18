import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useLissajous, LissajousColorMode } from "./useLissajous";

type LissajousPreset = "default" | "butterfly" | "star" | "web" | "neon" | "crystal";

interface LissajousPresetValues {
  freqX?: number;
  freqY?: number;
  phaseSpeed?: number;
  lineWidth?: number;
  trailFade?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  colorMode?: LissajousColorMode;
  color?: string;
  backgroundColor?: string;
}

const PRESETS: Record<LissajousPreset, LissajousPresetValues> = {
  default:   {},
  butterfly: { freqX: 3, freqY: 2 },
  star:      { freqX: 5, freqY: 4 },
  web:       { freqX: 7, freqY: 6, colorMode: "cycle" },
  neon:      { glowEffect: true, colorMode: "cycle", backgroundColor: "#000000", lineWidth: 2 },
  crystal:   { freqX: 5, freqY: 3, glowEffect: true, lineWidth: 2, colorMode: "cycle", backgroundColor: "#000510" },
};

export interface LissajousProps extends BaseCanvasProps {
  /** Horizontal frequency a (default: 3) */
  freqX?: number;
  /** Vertical frequency b (default: 2) */
  freqY?: number;
  /** Initial phase delta δ in degrees (default: 0) */
  phaseShift?: number;
  /** Phase advance per frame in degrees (default: 0.5) */
  phaseSpeed?: number;
  /** Curve amplitude as fraction of canvas half-size (default: 0.9) */
  amplitude?: number;
  /** Curve stroke color (default: "#ffffff") */
  color?: string;
  /** Background fill color (default: "#111111") */
  backgroundColor?: string;
  /** Stroke line width (default: 1.5) */
  lineWidth?: number;
  /** Background fade opacity per frame (default: 0.04) */
  trailFade?: number;
  /** Enable glow shadow on stroke (default: false) */
  glowEffect?: boolean;
  /** Shadow blur radius when glowEffect is enabled (default: 12) */
  glowBlur?: number;
  /** "solid" | "cycle" — hue cycles with phase (default: "solid") */
  colorMode?: LissajousColorMode;
  /** Parametric curve sample count (default: 600) */
  curvePoints?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Named preset */
  preset?: LissajousPreset | string;
}

export const Lissajous = forwardRef<HTMLCanvasElement, LissajousProps>(
  (props, ref) => {
    const {
      preset, freqX, freqY, phaseShift, phaseSpeed, amplitude,
      color, backgroundColor, lineWidth, trailFade,
      glowEffect, glowBlur, colorMode, curvePoints, animated, speed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as LissajousPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useLissajous(internalRef, {
      freqX:           freqX           ?? p.freqX           ?? 3,
      freqY:           freqY           ?? p.freqY           ?? 2,
      phaseShift:      phaseShift      ?? 0,
      phaseSpeed:      phaseSpeed      ?? p.phaseSpeed      ?? 0.5,
      amplitude:       amplitude       ?? 0.9,
      color:           color           ?? p.color           ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      lineWidth:       lineWidth       ?? p.lineWidth       ?? 1.5,
      trailFade:       trailFade       ?? p.trailFade       ?? 0.04,
      glowEffect:      glowEffect      ?? p.glowEffect      ?? false,
      glowBlur:        glowBlur        ?? p.glowBlur        ?? 12,
      colorMode:       colorMode       ?? p.colorMode       ?? "solid",
      curvePoints:     curvePoints     ?? 600,
      animated:        animated        ?? true,
      speed:           speed           ?? 1,
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

Lissajous.displayName = "Lissajous";
