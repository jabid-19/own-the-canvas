import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useRippleEffect } from "./useRippleEffect";

type RipplePreset = "default" | "neon" | "minimal" | "sunset" | "cosmic";

interface RipplePresetValues {
  color?: string;
  backgroundColor?: string;
  glowEffect?: boolean;
  maxRadius?: number;
  lineWidth?: number;
}

const PRESETS: Record<RipplePreset, RipplePresetValues> = {
  default: {},
  neon: {
    color: "#7C3AED",
    backgroundColor: "#050010",
    maxRadius: 200,
    lineWidth: 2,
  },
  minimal: {
    color: "#94a3b8",
    backgroundColor: "transparent",
    lineWidth: 1,
    maxRadius: 120,
  },
  sunset: {
    color: "#f97316",
    backgroundColor: "#0a0500",
    lineWidth: 2,
    maxRadius: 180,
  },
  cosmic: {
    color: "#0891B2",
    backgroundColor: "#020f1a",
    maxRadius: 220,
    lineWidth: 1.5,
  },
};

export interface RippleEffectProps extends BaseCanvasProps {
  /** Ripple stroke color (default: "#00cfff") */
  color?: string;
  /** Maximum ripple radius (default: 150) */
  maxRadius?: number;
  /** Expansion speed (default: 2) */
  speed?: number;
  /** Stroke width (default: 1.5) */
  lineWidth?: number;
  /** Opacity decay rate — higher = faster fade (default: 0.8) */
  decay?: number;
  /** Allow multiple simultaneous ripples (default: true) */
  multiRipple?: boolean;
  /** Canvas background (default: "transparent") */
  backgroundColor?: string;
  /** Spawn ripple on click (default: true) */
  interactive?: boolean;
  /** Milliseconds between auto-ripples when not interactive (default: 1500) */
  autoInterval?: number;
  /** Radius growth multiplier per frame (default: 2) */
  radiusGrowthRate?: number;
  /** Opacity decay multiplier per frame (default: 0.02) */
  opacityDecayRate?: number;
  /** Auto-ripples spawn from center when true, random position when false (default: true) */
  autoCenter?: boolean;
  /** Named preset: "default" | "neon" | "minimal" | "sunset" | "cosmic" */
  preset?: RipplePreset | string;
}

export const RippleEffect = forwardRef<HTMLCanvasElement, RippleEffectProps>(
  (props, ref) => {
    const {
      preset,
      color,
      maxRadius,
      speed,
      lineWidth,
      decay,
      multiRipple,
      backgroundColor,
      interactive,
      autoInterval,
      radiusGrowthRate,
      opacityDecayRate,
      autoCenter,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as RipplePreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useRippleEffect(internalRef, {
      color: color ?? p.color ?? "#ffffff",
      maxRadius: maxRadius ?? p.maxRadius ?? 150,
      speed: speed ?? 2,
      lineWidth: lineWidth ?? p.lineWidth ?? 1.5,
      decay: decay ?? 0.8,
      multiRipple: multiRipple ?? true,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "transparent",
      interactive: interactive ?? true,
      autoInterval: autoInterval ?? 1500,
      radiusGrowthRate: radiusGrowthRate ?? 2,
      opacityDecayRate: opacityDecayRate ?? 0.02,
      autoCenter: autoCenter ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "pointer" : "default",
          ...style,
        }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

RippleEffect.displayName = "RippleEffect";
