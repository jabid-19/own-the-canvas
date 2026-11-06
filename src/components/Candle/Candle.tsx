import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useCandle } from "./useCandle";

type CandlePreset = "default" | "ivory" | "rose" | "obsidian" | "spirit" | "monochrome";

interface CandlePresetValues {
  flameColor?: string;
  coreColor?: string;
  waxColor?: string;
  backgroundColor?: string;
  glowIntensity?: number;
}

export const PRESETS: Record<CandlePreset, CandlePresetValues> = {
  default:  { flameColor: "#ff9a3c", coreColor: "#fff3d1", waxColor: "#efe2cc", backgroundColor: "#0b0705" },
  monochrome: {},
  ivory:    { flameColor: "#ffb457", coreColor: "#fffaf0", waxColor: "#f7f1e3", backgroundColor: "#100c09" },
  rose:     { flameColor: "#ff8a5c", coreColor: "#fff0e6", waxColor: "#e8a7a9", backgroundColor: "#0e0608" },
  obsidian: { flameColor: "#ffa340", coreColor: "#fff1cc", waxColor: "#2b2726", backgroundColor: "#060505", glowIntensity: 1.2 },
  spirit:   { flameColor: "#4fd1ff", coreColor: "#e8fbff", waxColor: "#cfd8e6", backgroundColor: "#03060c", glowIntensity: 1.1 },
};

export interface CandleProps extends BaseCanvasProps {
  /** Outer flame and light color (default: "#ff9a3c") */
  flameColor?: string;
  /** White-hot inner flame color (default: "#fff3d1") */
  coreColor?: string;
  /** Wax color (default: "#efe2cc") */
  waxColor?: string;
  /** Room color; "transparent" keeps only the candle and its light (default: "#0b0705") */
  backgroundColor?: string;
  /** Candle scale (default: 1) */
  size?: number;
  /** Pillar height, 0.1–1.2 (default: 0.6) */
  candleHeight?: number;
  /** How restless the flame is, 0–3 (default: 1) */
  flicker?: number;
  /** Strength of the light cast on the room, 0–3 (default: 1) */
  glowIntensity?: number;
  /** Cursor drafts bend the flame; click snuffs and relights it (default: true) */
  interactive?: boolean;
  /** Named preset: "default" | "ivory" | "rose" | "obsidian" | "spirit" | "monochrome" */
  preset?: CandlePreset | string;
}

export const Candle = forwardRef<HTMLCanvasElement, CandleProps>((props, ref) => {
  const {
    preset, flameColor, coreColor, waxColor, backgroundColor, size, candleHeight, flicker,
    glowIntensity, interactive, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as CandlePreset] || {};

  const { canvasRef, canvas } = useCandle({
    flameColor:      flameColor      ?? p.flameColor      ?? "#e5e7eb",
    coreColor:       coreColor       ?? p.coreColor       ?? "#ffffff",
    waxColor:        waxColor        ?? p.waxColor        ?? "#9ca3af",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    size:            size            ?? 1,
    candleHeight:    candleHeight    ?? 0.6,
    flicker:         flicker         ?? 1,
    glowIntensity:   glowIntensity   ?? p.glowIntensity   ?? 1,
    interactive:     interactive     ?? true,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={style} />;
});

Candle.displayName = "Candle";
