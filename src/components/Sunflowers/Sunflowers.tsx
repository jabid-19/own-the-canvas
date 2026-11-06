import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSunflowers } from "./useSunflowers";
import { resolvePreset } from "../../utils/props";

type SunflowersPreset = "default" | "dawn" | "dusk" | "velvet" | "moonlight" | "monochrome";

interface SunflowersPresetValues {
  petalColor?: string;
  centerColor?: string;
  stemColor?: string;
  backgroundColor?: string;
}

export const PRESETS: Record<SunflowersPreset, SunflowersPresetValues> = {
  default:    { petalColor: "#f6b51e", centerColor: "#4a2a12", stemColor: "#4f7a2a", backgroundColor: "#f0a868" },
  monochrome: {},
  dawn:       { petalColor: "#ffd34d", centerColor: "#5a3a1a", stemColor: "#5d8a3a", backgroundColor: "#f6c2b0" },
  dusk:       { petalColor: "#f08a1c", centerColor: "#2e1a0e", stemColor: "#3a5a26", backgroundColor: "#a8577a" },
  velvet:     { petalColor: "#a8323a", centerColor: "#2a140e", stemColor: "#46632a", backgroundColor: "#e8a070" },
  moonlight:  { petalColor: "#d8d080", centerColor: "#2a2420", stemColor: "#2e4a3a", backgroundColor: "#1c2a4a" },
};

export interface SunflowersProps extends BaseCanvasProps {
  /** Number of sunflowers (default: 5) */
  count?: number;
  /** Petal color (default: "#f6b51e") */
  petalColor?: string;
  /** Seed disc color (default: "#4a2a12") */
  centerColor?: string;
  /** Stems and leaves (default: "#4f7a2a") */
  stemColor?: string;
  /** Sky color at the sun's height; "transparent" drops the scene (default: "#f0a868") */
  backgroundColor?: string;
  /** Wind strength (default: 1) */
  wind?: number;
  /** Your cursor is the sun and the heads turn to face it; off = the sun crosses the sky by itself (default: true) */
  followCursor?: boolean;
  /** The cursor's wake pushes stems; tap a head to shake petals loose (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "dawn" | "dusk" | "velvet" | "moonlight" | "monochrome" */
  preset?: SunflowersPreset | string;
}

export const Sunflowers = forwardRef<HTMLCanvasElement, SunflowersProps>((props, ref) => {
  const {
    preset, count, petalColor, centerColor, stemColor, backgroundColor, wind, followCursor,
    interactive, overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Sunflowers", PRESETS, props);

  const { canvasRef, canvas } = useSunflowers({
    count:           count           ?? 5,
    petalColor:      petalColor      ?? p.petalColor      ?? "#d1d5db",
    centerColor:     centerColor     ?? p.centerColor     ?? "#374151",
    stemColor:       stemColor       ?? p.stemColor       ?? "#6b7280",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    wind:            wind            ?? 1,
    followCursor:    followCursor    ?? true,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Sunflowers.displayName = "Sunflowers";
