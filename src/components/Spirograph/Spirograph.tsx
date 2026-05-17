import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSpirograph } from "./useSpirograph";

type SpirographPreset = "default" | "neon" | "minimal" | "cosmic" | "pastel";

interface SpirographPresetValues {
  color?: string;
  backgroundColor?: string;
  lineWidth?: number;
  speed?: number;
  trailFade?: number;
  innerRadius?: number;
  penDistance?: number;
}

const PRESETS: Record<SpirographPreset, SpirographPresetValues> = {
  default: {},
  neon: { color: "#00ffff", backgroundColor: "#000000", lineWidth: 1.5 },
  minimal: { speed: 0.5, lineWidth: 0.5, trailFade: 0.001 },
  cosmic: { color: "#ff00ff", backgroundColor: "#050005", lineWidth: 2 },
  pastel: { color: "#ffb3de", backgroundColor: "#0a080a" },
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
  /** Curve stroke color (default: "#ffffff") */
  color?: string;
  /** Background fill color (default: "#111111") */
  backgroundColor?: string;
  /** Stroke line width (default: 1) */
  lineWidth?: number;
  /** Background fade opacity per frame — lower = longer trails (default: 0.003) */
  trailFade?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Start new pattern after each full cycle (default: true) */
  autoReset?: boolean;
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
      color,
      backgroundColor,
      lineWidth,
      trailFade,
      animated,
      autoReset,
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
      color:           color           ?? p.color         ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      lineWidth:       lineWidth       ?? p.lineWidth     ?? 1,
      trailFade:       trailFade       ?? p.trailFade     ?? 0.003,
      animated:        animated        ?? true,
      autoReset:       autoReset       ?? true,
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
