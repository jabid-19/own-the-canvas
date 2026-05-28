import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useRain } from "./useRain";

type RainPreset = "default" | "storm" | "drizzle" | "neon" | "golden";

interface RainPresetValues {
  dropCount?: number;
  speed?: number;
  wind?: number;
  windSpeed?: number;
  dropLength?: number;
  dropWidth?: number;
  dropOpacity?: number;
  dropColor?: string;
  splashColor?: string;
  showSplashes?: boolean;
  backgroundColor?: string;
}

const PRESETS: Record<RainPreset, RainPresetValues> = {
  default: {
    dropColor: "#000000",
    splashColor: "#000000",
    backgroundColor: "#ffffff",
  },
  storm: {
    dropCount: 500,
    speed: 25,
    wind: 1.5,
    windSpeed: 1,
    dropOpacity: 0.8,
    dropLength: 30,
    dropColor: "#94a3b8",
    splashColor: "#cbd5e1",
    backgroundColor: "#0a0a14",
  },
  drizzle: {
    dropCount: 80,
    speed: 8,
    wind: 0.1,
    dropOpacity: 0.3,
    dropLength: 12,
    dropColor: "#7C3AED",
    splashColor: "#0891B2",
    backgroundColor: "#050010",
  },
  neon: {
    dropColor: "#00ffff",
    splashColor: "#ff00ff",
    backgroundColor: "#000000",
    dropOpacity: 0.7,
    dropWidth: 1.5,
  },
  golden: {
    dropColor: "#f59e0b",
    splashColor: "#fbbf24",
    backgroundColor: "#0a0500",
    dropOpacity: 0.65,
    dropLength: 18,
  },
};

export interface RainProps extends BaseCanvasProps {
  /** Number of rain drops. (default: 200) */
  dropCount?: number;
  /** Drop fall speed in px/frame. (default: 15) */
  speed?: number;
  /** Horizontal wind drift strength. (default: 0.3) */
  wind?: number;
  /** Wind oscillation frequency. (default: 0.5) */
  windSpeed?: number;
  /** Drop streak length in px. (default: 20) */
  dropLength?: number;
  /** Drop stroke width in px. (default: 1) */
  dropWidth?: number;
  /** Drop opacity 0–1. (default: 0.6) */
  dropOpacity?: number;
  /** Drop color. (default: "#2563eb") */
  dropColor?: string;
  /** Splash particle color. (default: "#1e40af") */
  splashColor?: string;
  /** Show splash particles when drops hit bottom. (default: true) */
  showSplashes?: boolean;
  /** Canvas background color. (default: "#ffffff") */
  backgroundColor?: string;
  /** Number of background stars (default: 0) */
  starCount?: number;
  /** Star color (default: "#ffffff") */
  starColor?: string;
  /** Enable glow on some stars (default: false) */
  glowingStars?: boolean;
  /** Glow blur radius for glowing stars (default: 8) */
  starGlowBlur?: number;
  /** Named preset. */
  preset?: RainPreset | string;
}

export const Rain = forwardRef<HTMLCanvasElement, RainProps>((props, ref) => {
  const {
    preset,
    dropCount, speed, wind, windSpeed, dropLength, dropWidth,
    dropOpacity, dropColor, splashColor, showSplashes, backgroundColor,
    starCount, starColor, glowingStars, starGlowBlur,
    width, height, className, style,
  } = props;

  const p = (preset && PRESETS[preset as RainPreset]) || {};

  const internalRef = useRef<HTMLCanvasElement | null>(null);
  useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

  useRain(internalRef, {
    dropCount:    dropCount    ?? p.dropCount    ?? 200,
    speed:        speed        ?? p.speed        ?? 15,
    wind:         wind         ?? p.wind         ?? 0.3,
    windSpeed:    windSpeed    ?? p.windSpeed    ?? 0.5,
    dropLength:   dropLength   ?? p.dropLength   ?? 28,
    dropWidth:    dropWidth    ?? p.dropWidth    ?? 1.5,
    dropOpacity:  dropOpacity  ?? p.dropOpacity  ?? 0.85,
    dropColor:    dropColor    ?? p.dropColor    ?? "#000000",
    splashColor:  splashColor  ?? p.splashColor  ?? "#000000",
    showSplashes: showSplashes ?? p.showSplashes ?? true,
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#ffffff",
    starCount:    starCount    ?? 60,
    starColor:    starColor    ?? "#ffffff",
    glowingStars: glowingStars ?? false,
    starGlowBlur: starGlowBlur ?? 8,
  });

  return (
    <div
      className={className}
      style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
    >
      <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
    </div>
  );
});

Rain.displayName = "Rain";
