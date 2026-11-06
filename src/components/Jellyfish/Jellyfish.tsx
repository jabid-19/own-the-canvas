import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useJellyfish } from "./useJellyfish";

type JellyfishPreset = "default" | "sea-nettle" | "crystal" | "lions-mane" | "ghost" | "monochrome";

interface JellyfishPresetValues {
  bellColor?: string;
  glowColor?: string;
  backgroundColor?: string;
  tentacleLength?: number;
  count?: number;
}

export const PRESETS: Record<JellyfishPreset, JellyfishPresetValues> = {
  default:      { bellColor: "#c9a7e8", glowColor: "#8fd8ff", backgroundColor: "#04122a" },
  monochrome:   {},
  "sea-nettle": { bellColor: "#f0a050", glowColor: "#ffcf7a", backgroundColor: "#031722", tentacleLength: 1.6 },
  crystal:      { bellColor: "#b9f3ff", glowColor: "#5ef0e0", backgroundColor: "#010c18", tentacleLength: 0.8 },
  "lions-mane": { bellColor: "#e2564a", glowColor: "#ff9a6a", backgroundColor: "#0a0714", tentacleLength: 2, count: 3 },
  ghost:        { bellColor: "#e8ecf4", glowColor: "#c6d4ff", backgroundColor: "#06070d", count: 6 },
};

export interface JellyfishProps extends BaseCanvasProps {
  /** Number of jellyfish (default: 4) */
  count?: number;
  /** Bell and oral-arm tint (default: "#c9a7e8") */
  bellColor?: string;
  /** Rim light, tentacles and flash color (default: "#8fd8ff") */
  glowColor?: string;
  /** Water color; "transparent" drops the scene (default: "#04122a") */
  backgroundColor?: string;
  /** Tentacle length multiplier (default: 1) */
  tentacleLength?: number;
  /** Bell pulse speed multiplier (default: 1) */
  pulseRate?: number;
  /** Jellies turn away from the cursor, which stirs the water; taps make them flash (default: true) */
  interactive?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Nudge off elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "sea-nettle" | "crystal" | "lions-mane" | "ghost" | "monochrome" */
  preset?: JellyfishPreset | string;
}

export const Jellyfish = forwardRef<HTMLCanvasElement, JellyfishProps>((props, ref) => {
  const {
    preset, count, bellColor, glowColor, backgroundColor, tentacleLength, pulseRate,
    interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as JellyfishPreset] || {};

  const { canvasRef, canvas } = useJellyfish({
    count:           count           ?? p.count           ?? 4,
    bellColor:       bellColor       ?? p.bellColor       ?? "#d1d5db",
    glowColor:       glowColor       ?? p.glowColor       ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    tentacleLength:  tentacleLength  ?? p.tentacleLength  ?? 1,
    pulseRate:       pulseRate       ?? 1,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Jellyfish.displayName = "Jellyfish";
