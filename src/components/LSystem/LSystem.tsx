import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useLSystem } from "./useLSystem";

type LSystemPreset = "default" | "fern" | "dragon" | "sierpinski" | "bush" | "snowflake";

interface LSystemPresetValues {
  axiom: string;
  rules: Record<string, string>;
  iterations: number;
  angle: number;
}

const LSYSTEM_PRESETS: Record<LSystemPreset, LSystemPresetValues> = {
  default: {
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    iterations: 4,
    angle: 25,
  },
  fern: {
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    iterations: 5,
    angle: 22,
  },
  dragon: {
    axiom: "FX",
    rules: { X: "X+YF+", Y: "-FX-Y" },
    iterations: 12,
    angle: 90,
  },
  sierpinski: {
    axiom: "F-G-G",
    rules: { F: "F-G+F+G-F", G: "GG" },
    iterations: 5,
    angle: 120,
  },
  bush: {
    axiom: "Y",
    rules: { X: "X[-FFF][+FFF]FX", Y: "YFX[+Y][-Y]" },
    iterations: 5,
    angle: 25,
  },
  snowflake: {
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    iterations: 4,
    angle: 60,
  },
};

export interface LSystemProps extends BaseCanvasProps {
  /** Starting L-system axiom string */
  axiom?: string;
  /** Production rules map — e.g. { F: "F+F-F" } */
  rules?: Record<string, string>;
  /** Number of rewriting iterations (default: 4) */
  iterations?: number;
  /** Turtle turning angle in degrees (default: 25) */
  angle?: number;
  /** Stroke line width (default: 1) */
  lineWidth?: number;
  /** Branch stroke color (default: "#ffffff") */
  color?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Segments drawn per animation frame (default: 5) */
  speed?: number;
  /** Restart animation after full draw (default: true) */
  autoReset?: boolean;
  /** Background fade opacity between cycles — 0 = hard clear (default: 0) */
  trailFade?: number;
  /** Enable glow shadow on branches (default: false) */
  glowEffect?: boolean;
  /** Shadow blur radius when glowEffect is enabled (default: 8) */
  glowBlur?: number;
  /** Named preset: "default" | "fern" | "dragon" | "sierpinski" | "bush" | "snowflake" */
  preset?: LSystemPreset | string;
}

export const LSystem = forwardRef<HTMLCanvasElement, LSystemProps>(
  (props, ref) => {
    const {
      preset,
      axiom, rules, iterations, angle,
      lineWidth, color, backgroundColor,
      speed, autoReset, trailFade,
      glowEffect, glowBlur,
      width, height, className, style,
    } = props;

    const p = LSYSTEM_PRESETS[(preset as LSystemPreset) ?? "default"] ?? LSYSTEM_PRESETS.default;
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useLSystem(internalRef, {
      axiom:           axiom           ?? p.axiom,
      rules:           rules           ?? p.rules,
      iterations:      iterations      ?? p.iterations,
      angle:           angle           ?? p.angle,
      lineWidth:       lineWidth       ?? 1,
      color:           color           ?? "#ffffff",
      backgroundColor: backgroundColor ?? "#111111",
      speed:           speed           ?? 5,
      autoReset:       autoReset       ?? true,
      trailFade:       trailFade       ?? 0,
      glowEffect:      glowEffect      ?? false,
      glowBlur:        glowBlur        ?? 8,
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

LSystem.displayName = "LSystem";
