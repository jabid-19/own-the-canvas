import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useKomorebi } from "./useKomorebi";
import { resolvePreset } from "../../utils/props";

type KomorebiPreset = "default" | "morning" | "forest" | "golden-hour" | "moonlight" | "monochrome";

interface KomorebiPresetValues {
  lightColor?: string;
  shadowColor?: string;
  backgroundColor?: string;
  sunHeight?: number;
}

export const PRESETS: Record<KomorebiPreset, KomorebiPresetValues> = {
  default:       { lightColor: "#ffd9a0", shadowColor: "#3a4a3a", backgroundColor: "#c9b49a" },
  monochrome:    {},
  morning:       { lightColor: "#fff2d6", shadowColor: "#5a6a78", backgroundColor: "#d8d4cc", sunHeight: 0.5 },
  forest:        { lightColor: "#e6f5a8", shadowColor: "#1e3a22", backgroundColor: "#4a5e40", sunHeight: 0.85 },
  "golden-hour": { lightColor: "#ffb060", shadowColor: "#4a2a2a", backgroundColor: "#b88a6a", sunHeight: 0.3 },
  moonlight:     { lightColor: "#c8d8ff", shadowColor: "#0a1020", backgroundColor: "#28324a", sunHeight: 0.6 },
};

export interface KomorebiProps extends BaseCanvasProps {
  /** Sunlight color (default: "#ffd9a0") */
  lightColor?: string;
  /** Leaf shade tint (default: "#3a4a3a") */
  shadowColor?: string;
  /** The wall the light falls on; "transparent" drops it (default: "#c9b49a") */
  backgroundColor?: string;
  /** Light spot density multiplier (default: 1) */
  density?: number;
  /** Canopy sway strength (default: 1) */
  wind?: number;
  /** Sun height 0..1: lower suns stretch the spots into ovals (default: 0.7) */
  sunHeight?: number;
  /** The cursor is a breeze that stirs the leaves; a tap sends a gust rippling out (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer that dapples the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "morning" | "forest" | "golden-hour" | "moonlight" | "monochrome" */
  preset?: KomorebiPreset | string;
}

export const Komorebi = forwardRef<HTMLCanvasElement, KomorebiProps>((props, ref) => {
  const {
    preset, lightColor, shadowColor, backgroundColor, density, wind, sunHeight,
    interactive, overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Komorebi", PRESETS, props);

  const { canvasRef, canvas } = useKomorebi({
    lightColor:      lightColor      ?? p.lightColor      ?? "#ffffff",
    shadowColor:     shadowColor     ?? p.shadowColor     ?? "#374151",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    density:         density         ?? 1,
    wind:            wind            ?? 1,
    sunHeight:       sunHeight       ?? p.sunHeight       ?? 0.7,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Komorebi.displayName = "Komorebi";
