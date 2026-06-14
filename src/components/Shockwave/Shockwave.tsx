import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useShockwave } from "./useShockwave";

type ShockwavePreset = "default" | "neon" | "explosion" | "ripple" | "minimal";

interface ShockwavePresetValues {
  color?: string;
  secondaryColor?: string;
  ringCount?: number;
  ringSpacing?: number;
  speed?: number;
  maxRadius?: number;
  lineWidth?: number;
  fadeSpeed?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  backgroundColor?: string;
}

export const PRESETS: Record<ShockwavePreset, ShockwavePresetValues> = {
  default: {
    color: "#ffffff",
    secondaryColor: "#6b7280",
    ringCount: 3,
    speed: 4,
    glowEffect: true,
    glowBlur: 15,
    backgroundColor: "transparent",
  },
  neon: {
    color: "#00ffff",
    secondaryColor: "#ff00ff",
    ringCount: 4,
    speed: 5,
    glowEffect: true,
    glowBlur: 25,
    lineWidth: 2.5,
    backgroundColor: "#050010",
  },
  explosion: {
    color: "#f97316",
    secondaryColor: "#fbbf24",
    ringCount: 5,
    speed: 6,
    maxRadius: 300,
    lineWidth: 3,
    glowEffect: true,
    glowBlur: 20,
    backgroundColor: "#0c0000",
  },
  ripple: {
    color: "#06b6d4",
    secondaryColor: "#0891B2",
    ringCount: 6,
    ringSpacing: 15,
    speed: 2,
    fadeSpeed: 0.015,
    lineWidth: 1,
    glowEffect: false,
    backgroundColor: "#020f1a",
  },
  minimal: {
    color: "#e2e8f0",
    secondaryColor: "#94a3b8",
    ringCount: 2,
    speed: 3,
    glowEffect: false,
    lineWidth: 1,
    backgroundColor: "transparent",
  },
};

export interface ShockwaveProps extends BaseCanvasProps {
  /** Primary ring color (default: "#7C3AED") */
  color?: string;
  /** Alternating ring color (default: "#0891B2") */
  secondaryColor?: string;
  /** Number of rings per shockwave (default: 3) */
  ringCount?: number;
  /** Pixel gap between rings at spawn (default: 20) */
  ringSpacing?: number;
  /** Expansion speed px/frame (default: 4) */
  speed?: number;
  /** Max radius before ring fades (default: 200) */
  maxRadius?: number;
  /** Stroke line width (default: 2) */
  lineWidth?: number;
  /** Opacity decrease per frame (default: 0.02) */
  fadeSpeed?: number;
  /** Auto-fire shockwaves without clicks (default: true) */
  autoFire?: boolean;
  /** Interval between auto-fires in ms (default: 2000) */
  autoInterval?: number;
  /** Glow effect on rings (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 15) */
  glowBlur?: number;
  /** Canvas background (default: "transparent") */
  backgroundColor?: string;
  /** Named preset */
  preset?: ShockwavePreset | string;
}

export const Shockwave = forwardRef<HTMLCanvasElement, ShockwaveProps>(
  (props, ref) => {
    const {
      preset, color, secondaryColor, ringCount, ringSpacing, speed,
      maxRadius, lineWidth, fadeSpeed, autoFire, autoInterval,
      glowEffect, glowBlur, backgroundColor,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as ShockwavePreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useShockwave(internalRef, {
      color: color ?? p.color ?? "#ffffff",
      secondaryColor: secondaryColor ?? p.secondaryColor ?? "#6b7280",
      ringCount: ringCount ?? p.ringCount ?? 3,
      ringSpacing: ringSpacing ?? p.ringSpacing ?? 20,
      speed: speed ?? p.speed ?? 4,
      maxRadius: maxRadius ?? p.maxRadius ?? 200,
      lineWidth: lineWidth ?? p.lineWidth ?? 2,
      fadeSpeed: fadeSpeed ?? p.fadeSpeed ?? 0.02,
      autoFire: autoFire ?? true,
      autoInterval: autoInterval ?? 2000,
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 15,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "transparent",
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

Shockwave.displayName = "Shockwave";
