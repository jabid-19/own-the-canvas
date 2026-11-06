import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useAuroraBorealis } from "./useAuroraBorealis";

type AuroraBorealisPreset = "default" | "arctic" | "solar" | "tropical" | "neon" | "midnight" | "monochrome";

interface AuroraBorealisPresetValues {
  colors?: string[];
  backgroundColor?: string;
  intensity?: number;
  speed?: number;
}

export const PRESETS: Record<AuroraBorealisPreset, AuroraBorealisPresetValues> = {
  default: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  monochrome: {},
  arctic: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  solar: { colors: ["#ff4400", "#ff8800", "#cc00ff"], backgroundColor: "#0a0005" },
  tropical: { colors: ["#00ffcc", "#0088ff", "#00ff44"], backgroundColor: "#030a0a" },
  neon: { colors: ["#ff00ff", "#00ffff", "#ff0088"], backgroundColor: "#000000", intensity: 1 },
  midnight: { colors: ["#4400cc", "#0033ff", "#2200aa"], backgroundColor: "#000005" },
};

export interface AuroraBorealisProps extends BaseCanvasProps {
  /** Aurora band colors (default: ["#00ff88", "#00ccff", "#88ff00"]) */
  colors?: string[];
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Band brightness/opacity 0–1 (default: 0.8) */
  intensity?: number;
  /** Number of aurora curtains (default: 5) */
  layers?: number;
  /** Sky background color (default: "#050a0f") */
  backgroundColor?: string;
  /** How far the curtains fold, as a fraction of the sky height (default: 0.15) */
  waveAmplitude?: number;
  /** Folds across the width (default: 2) */
  waveFrequency?: number;
  /** Background star count (default: 80) */
  starCount?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** The cursor brightens the curtains near it; a tap sets off a substorm surge (default: true) */
  interactive?: boolean;
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
      interactive,
      width,
      height,
      className,
      style,
    } = props;

    const p = PRESETS[(preset ?? "default") as AuroraBorealisPreset] || {};
    const { canvasRef, canvas } = useAuroraBorealis({
      colors:          colors          ?? p.colors          ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed:           speed           ?? p.speed           ?? 1,
      intensity:       intensity       ?? p.intensity       ?? 0.8,
      layers:          layers          ?? 5,
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      waveAmplitude:   waveAmplitude   ?? 0.15,
      waveFrequency:   waveFrequency   ?? 2,
      starCount:       starCount       ?? 80,
      animated:        animated        ?? true,
      interactive:     interactive     ?? true,
    });

    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    return (
      <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={style} />
    );
  }
);

AuroraBorealis.displayName = "AuroraBorealis";
