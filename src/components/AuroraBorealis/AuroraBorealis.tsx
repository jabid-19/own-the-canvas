import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useAuroraBorealis } from "./useAuroraBorealis";

type AuroraBorealisPreset = "default" | "arctic" | "solar" | "tropical" | "neon" | "midnight";

interface AuroraBorealisPresetValues {
  colors?: string[];
  backgroundColor?: string;
  intensity?: number;
  speed?: number;
}

const PRESETS: Record<AuroraBorealisPreset, AuroraBorealisPresetValues> = {
  default: {},
  arctic: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  solar: { colors: ["#ff4400", "#ff8800", "#cc00ff"], backgroundColor: "#0a0005" },
  tropical: { colors: ["#00ffcc", "#0088ff", "#00ff44"], backgroundColor: "#030a0a" },
  neon: { colors: ["#ff00ff", "#00ffff", "#ff0088"], backgroundColor: "#000000", intensity: 1 },
  midnight: { colors: ["#4400cc", "#0033ff", "#2200aa"], backgroundColor: "#000005" },
};

export interface AuroraBorealisProps extends BaseCanvasProps {
  /** Aurora band colors (default: monochrome whites/grays) */
  colors?: string[];
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Band brightness/opacity 0–1 (default: 0.8) */
  intensity?: number;
  /** Number of aurora layers (default: 5) */
  layers?: number;
  /** Sky background color (default: "#111111") */
  backgroundColor?: string;
  /** Wave height as fraction of canvas height (default: 0.15) */
  waveAmplitude?: number;
  /** Wave oscillations across canvas width (default: 2) */
  waveFrequency?: number;
  /** Background star count (default: 80) */
  starCount?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Named preset */
  preset?: AuroraBorealisPreset | string;
}

export const AuroraBorealis = forwardRef<HTMLCanvasElement, AuroraBorealisProps>(
  (props, ref) => {
    const {
      preset,
      colors,
      speed,
      intensity,
      layers,
      backgroundColor,
      waveAmplitude,
      waveFrequency,
      starCount,
      animated,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as AuroraBorealisPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useAuroraBorealis(internalRef, {
      colors:          colors          ?? p.colors          ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed:           speed           ?? p.speed           ?? 1,
      intensity:       intensity       ?? p.intensity       ?? 0.8,
      layers:          layers          ?? 5,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      waveAmplitude:   waveAmplitude   ?? 0.15,
      waveFrequency:   waveFrequency   ?? 2,
      starCount:       starCount       ?? 80,
      animated:        animated        ?? true,
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

AuroraBorealis.displayName = "AuroraBorealis";
