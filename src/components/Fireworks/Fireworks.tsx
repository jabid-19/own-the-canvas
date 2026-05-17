import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useFireworks } from "./useFireworks";

type FireworksPreset = "default" | "celebration" | "subtle" | "neon" | "golden";

interface FireworksPresetValues {
  colors?: string[];
  particleCount?: number;
  gravity?: number;
  friction?: number;
  fadeSpeed?: number;
  spread?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  backgroundColor?: string;
  shellSpeed?: number;
  trailLength?: number;
  particleSize?: number;
}

const PRESETS: Record<FireworksPreset, FireworksPresetValues> = {
  default: {
    colors: ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
    particleCount: 80,
    gravity: 0.08,
    glowEffect: true,
    glowBlur: 8,
    backgroundColor: "#111111",
  },
  celebration: {
    colors: ["#f43f5e", "#f59e0b", "#4ade80", "#06b6d4", "#7C3AED", "#ffffff"],
    particleCount: 120,
    gravity: 0.06,
    spread: 6,
    glowEffect: true,
    glowBlur: 12,
    backgroundColor: "#050010",
  },
  subtle: {
    colors: ["#94a3b8", "#cbd5e1", "#e2e8f0"],
    particleCount: 50,
    gravity: 0.1,
    spread: 3.5,
    glowEffect: false,
    backgroundColor: "#0f172a",
  },
  neon: {
    colors: ["#00ffff", "#ff00ff", "#00ff41", "#ff6600"],
    particleCount: 100,
    gravity: 0.05,
    spread: 7,
    glowEffect: true,
    glowBlur: 20,
    backgroundColor: "#000000",
  },
  golden: {
    colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff", "#fef3c7"],
    particleCount: 90,
    gravity: 0.07,
    spread: 5,
    glowEffect: true,
    glowBlur: 15,
    backgroundColor: "#0c0500",
  },
};

export interface FireworksProps extends BaseCanvasProps {
  /** Particle burst colors (default: multi-color) */
  colors?: string[];
  /** Particles per explosion (default: 80) */
  particleCount?: number;
  /** Gravity pull per frame (default: 0.08) */
  gravity?: number;
  /** Velocity friction 0–1 (default: 0.97) */
  friction?: number;
  /** Alpha fade per frame (default: 0.015) */
  fadeSpeed?: number;
  /** Particle base size in px (default: 2) */
  particleSize?: number;
  /** Trail history length (default: 6) */
  trailLength?: number;
  /** Explosion spread speed (default: 5) */
  spread?: number;
  /** Auto-launch shells (default: true) */
  autoLaunch?: boolean;
  /** Average ms between auto-launches (default: 1800) */
  autoInterval?: number;
  /** Glow on particles (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 8) */
  glowBlur?: number;
  /** Canvas background (default: "#050010") */
  backgroundColor?: string;
  /** Shell upward speed (default: 12) */
  shellSpeed?: number;
  /** Named preset */
  preset?: FireworksPreset | string;
}

export const Fireworks = forwardRef<HTMLCanvasElement, FireworksProps>(
  (props, ref) => {
    const {
      preset, colors, particleCount, gravity, friction, fadeSpeed,
      particleSize, trailLength, spread, autoLaunch, autoInterval,
      glowEffect, glowBlur, backgroundColor, shellSpeed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as FireworksPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useFireworks(internalRef, {
      colors: colors ?? p.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: particleCount ?? p.particleCount ?? 80,
      gravity: gravity ?? p.gravity ?? 0.08,
      friction: friction ?? p.friction ?? 0.97,
      fadeSpeed: fadeSpeed ?? p.fadeSpeed ?? 0.015,
      particleSize: particleSize ?? p.particleSize ?? 2,
      trailLength: trailLength ?? p.trailLength ?? 6,
      spread: spread ?? p.spread ?? 5,
      autoLaunch: autoLaunch ?? true,
      autoInterval: autoInterval ?? 1800,
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowBlur: glowBlur ?? p.glowBlur ?? 8,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      shellSpeed: shellSpeed ?? p.shellSpeed ?? 12,
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

Fireworks.displayName = "Fireworks";
