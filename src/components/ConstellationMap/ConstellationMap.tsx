import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useConstellationMap, ConstellationLineStyle } from "./useConstellationMap";

type ConstellationPreset = "default" | "cosmos" | "minimal" | "aurora" | "gold";

interface ConstellationPresetValues {
  starColor?: string;
  lineColor?: string;
  backgroundColor?: string;
  glowStars?: boolean;
  lineStyle?: ConstellationLineStyle;
  connectionDistance?: number;
  lineAlpha?: number;
  starCount?: number;
}

const PRESETS: Record<ConstellationPreset, ConstellationPresetValues> = {
  default: {},
  cosmos: {
    starColor: "#e0e7ff",
    lineColor: "#6366f1",
    backgroundColor: "#030014",
    glowStars: true,
    connectionDistance: 120,
  },
  minimal: {
    glowStars: false,
    lineStyle: "solid",
    lineAlpha: 0.2,
    starColor: "#94a3b8",
    lineColor: "#94a3b8",
    backgroundColor: "#0f172a",
  },
  aurora: {
    starColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    glowStars: true,
    connectionDistance: 110,
    lineStyle: "dashed",
  },
  gold: {
    starColor: "#fbbf24",
    lineColor: "#d97706",
    backgroundColor: "#0c0800",
    glowStars: true,
    lineAlpha: 0.4,
  },
};

export interface ConstellationMapProps extends BaseCanvasProps {
  /** Number of stars (default: 80) */
  starCount?: number;
  /** Star color (default: "#ffffff") */
  starColor?: string;
  /** Connection line color (default: "#8888ff") */
  lineColor?: string;
  /** Background color (default: "#050510") */
  backgroundColor?: string;
  /** Star drift speed (default: 0.3) */
  speed?: number;
  /** Enable drag-to-move stars (default: true) */
  interactive?: boolean;
  /** Line style (default: "solid") */
  lineStyle?: ConstellationLineStyle;
  /** Glow effect on stars (default: true) */
  glowStars?: boolean;
  /** Max distance for drawing lines (default: 100) */
  connectionDistance?: number;
  /** Velocity multiplier for initial star speed (default: 0.3) */
  velocityMultiplier?: number;
  /** Drag detection radius in px (default: 20) */
  dragRadius?: number;
  /** Twinkle animation speed (default: 0.03) */
  twinkleSpeed?: number;
  /** Max line opacity (default: 0.5) */
  lineAlpha?: number;
  /** Connection line width (default: 0.8) */
  lineWidth?: number;
  /** Glow blur as multiple of star size (default: 4) */
  glowMultiplier?: number;
  /** Twinkle opacity amplitude 0–1 (default: 0.4) */
  twinkleAmplitude?: number;
  /** Named preset: "default" | "cosmos" | "minimal" | "aurora" | "gold" */
  preset?: ConstellationPreset | string;
}

export const ConstellationMap = forwardRef<HTMLCanvasElement, ConstellationMapProps>(
  (props, ref) => {
    const {
      preset,
      starCount,
      starColor,
      lineColor,
      backgroundColor,
      speed,
      interactive,
      lineStyle,
      glowStars,
      connectionDistance,
      velocityMultiplier,
      dragRadius,
      twinkleSpeed,
      lineAlpha,
      lineWidth,
      glowMultiplier,
      twinkleAmplitude,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as ConstellationPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useConstellationMap(internalRef, {
      starCount: starCount ?? p.starCount ?? 80,
      starColor: starColor ?? p.starColor ?? "#ffffff",
      lineColor: lineColor ?? p.lineColor ?? "#6b7280",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      speed: speed ?? 0.3,
      interactive: interactive ?? true,
      lineStyle: lineStyle ?? p.lineStyle ?? "solid",
      glowStars: glowStars ?? p.glowStars ?? true,
      connectionDistance: connectionDistance ?? p.connectionDistance ?? 100,
      velocityMultiplier: velocityMultiplier ?? 0.3,
      dragRadius: dragRadius ?? 20,
      twinkleSpeed: twinkleSpeed ?? 0.03,
      lineAlpha: lineAlpha ?? p.lineAlpha ?? 0.5,
      lineWidth: lineWidth ?? 0.8,
      glowMultiplier: glowMultiplier ?? 4,
      twinkleAmplitude: twinkleAmplitude ?? 0.4,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "grab" : "default",
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

ConstellationMap.displayName = "ConstellationMap";
