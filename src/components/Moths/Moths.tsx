import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useMoths } from "./useMoths";

type MothsPreset = "default" | "porch-lamp" | "moonlight" | "candle" | "neon" | "monochrome";

interface MothsPresetValues {
  color?: string;
  lightColor?: string;
  backgroundColor?: string;
  angle?: number;
}

const PRESETS: Record<MothsPreset, MothsPresetValues> = {
  default: { color: "#c8b28f", lightColor: "#ffd27a", backgroundColor: "#0b0805" },
  monochrome: {},
  "porch-lamp": { color: "#c8b28f", lightColor: "#ffd27a", backgroundColor: "#0b0805" },
  moonlight:    { color: "#cbd5e1", lightColor: "#dbeafe", backgroundColor: "#04070f", angle: 86 },
  candle:       { color: "#d6a77a", lightColor: "#ff9a3c", backgroundColor: "#0a0503", angle: 76 },
  neon:         { color: "#a78bfa", lightColor: "#f0abfc", backgroundColor: "#07020c" },
};

export interface MothsProps extends BaseCanvasProps {
  /** Number of moths (default: 26) */
  count?: number;
  /** Moth wing color (default: "#c8b28f") */
  color?: string;
  /** Light / glow color (default: "#ffd27a") */
  lightColor?: string;
  /** Background color, ignored in overlay mode (default: "#0b0805") */
  backgroundColor?: string;
  /** Angle in degrees each moth keeps to the light: < 90 spirals in, 90 orbits, > 90 spirals out (default: 80) */
  angle?: number;
  /** Flight speed multiplier (default: 1) */
  speed?: number;
  /** Moth size in px (default: 8) */
  size?: number;
  /** Light halo radius in px (default: 120) */
  glowRadius?: number;
  /** Lamp position when the cursor is away, 0..1 of width (default: 0.5) */
  lightX?: number;
  /** Lamp position when the cursor is away, 0..1 of height (default: 0.42) */
  lightY?: number;
  /** Draw the light itself (default: true) */
  showLight?: boolean;
  /** The cursor becomes the light; tap to scatter (default: true) */
  followCursor?: boolean;
  /** Named preset */
  preset?: MothsPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const Moths = forwardRef<HTMLCanvasElement, MothsProps>((props, ref) => {
  const {
    preset, count, color, lightColor, backgroundColor, angle, speed, size, glowRadius,
    lightX, lightY, showLight, followCursor, overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as MothsPreset] || {};

  const { canvasRef, canvas } = useMoths({
    count:           count           ?? 26,
    color:           color           ?? p.color           ?? "#9ca3af",
    lightColor:      lightColor      ?? p.lightColor      ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    angle:           angle           ?? p.angle           ?? 80,
    speed:           speed           ?? 1,
    size:            size            ?? 8,
    glowRadius:      glowRadius      ?? 120,
    lightX:          lightX          ?? 0.5,
    lightY:          lightY          ?? 0.42,
    showLight:       showLight       ?? true,
    followCursor:    followCursor    ?? true,
    overlay:         overlay         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas
      canvasRef={canvasRef}
      overlay={overlay}
      zIndex={zIndex}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
});

Moths.displayName = "Moths";
