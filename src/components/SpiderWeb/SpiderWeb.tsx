// src/components/SpiderWeb/SpiderWeb.tsx
import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSpiderWeb } from "./useSpiderWeb";

type SpiderWebPreset = "default" | "night" | "forest" | "neon" | "frost";

interface SpiderWebPresetValues {
  webColor?: string;
  backgroundColor?: string;
  spiderColor?: string;
  glowColor?: string;
}

export const PRESETS: Record<SpiderWebPreset, SpiderWebPresetValues> = {
  default: { webColor: "#d8d8d8", backgroundColor: "#0a0a0a", spiderColor: "#c0c0c0", glowColor: "#e0e0e0" },
  night:   { webColor: "#c0c8e0", backgroundColor: "#04081a", spiderColor: "#404060", glowColor: "#8899cc" },
  forest:  { webColor: "#90b890", backgroundColor: "#050f05", spiderColor: "#2a4a2a", glowColor: "#66aa66" },
  neon:    { webColor: "#00ffcc", backgroundColor: "#000000", spiderColor: "#003322", glowColor: "#00ffff" },
  frost:   { webColor: "#e0f0ff", backgroundColor: "#040810", spiderColor: "#203040", glowColor: "#aaddff" },
};

export interface SpiderWebProps extends BaseCanvasProps {
  /** Number of radial spokes (default: 12) */
  spokeCount?: number;
  /** Number of concentric rings (default: 10) */
  ringCount?: number;
  /** Strand color (default: "#d8d8d8") */
  webColor?: string;
  /** Canvas background color (default: "#0a0a0a") */
  backgroundColor?: string;
  /** Spider body color (default: "#c0c0c0") */
  spiderColor?: string;
  /** Show dew drop glow points (default: true) */
  dewDrops?: boolean;
  /** Dew drop glow color (default: "#e0e0e0") */
  glowColor?: string;
  /** Ambient sway speed multiplier (default: 1) */
  swaySpeed?: number;
  /** Cursor disturbance radius in px (default: 80) */
  disturbRadius?: number;
  /** Enable cursor disturbance (default: true) */
  interactive?: boolean;
  /** Show spider (default: true) */
  showSpider?: boolean;
  /** Named preset */
  preset?: SpiderWebPreset | string;
}

export const SpiderWeb = forwardRef<HTMLCanvasElement, SpiderWebProps>(
  (props, ref) => {
    const {
      preset, spokeCount, ringCount, webColor, backgroundColor, spiderColor,
      dewDrops, glowColor, swaySpeed, disturbRadius, interactive, showSpider,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SpiderWebPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSpiderWeb(internalRef, {
      spokeCount:    spokeCount    ?? 12,
      ringCount:     ringCount     ?? 10,
      webColor:      webColor      ?? p.webColor      ?? "#d8d8d8",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#0a0a0a",
      spiderColor:   spiderColor   ?? p.spiderColor   ?? "#c0c0c0",
      dewDrops:      dewDrops      ?? true,
      glowColor:     glowColor     ?? p.glowColor     ?? "#e0e0e0",
      swaySpeed:     swaySpeed     ?? 1,
      disturbRadius: disturbRadius ?? 80,
      interactive:   interactive   ?? true,
      showSpider:    showSpider    ?? true,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

SpiderWeb.displayName = "SpiderWeb";
