import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSunbeamDust } from "./useSunbeamDust";
import { resolvePreset } from "../../utils/props";

type SunbeamDustPreset = "default" | "golden-hour" | "chapel" | "morning" | "dusk" | "monochrome";

interface SunbeamDustPresetValues {
  color?: string;
  backgroundColor?: string;
  angle?: number;
  intensity?: number;
  beams?: number;
}

const PRESETS: Record<SunbeamDustPreset, SunbeamDustPresetValues> = {
  default: { color: "#ffcf87", backgroundColor: "#140d07" },
  monochrome: {},
  "golden-hour": { color: "#ffcf87", backgroundColor: "#140d07", angle: 32, intensity: 1.1 },
  chapel:        { color: "#fff1d6", backgroundColor: "#0b0a0c", angle: 12, beams: 3, intensity: 1.2 },
  morning:       { color: "#e0f2fe", backgroundColor: "#0a1016", angle: 22 },
  dusk:          { color: "#fda4af", backgroundColor: "#120a12", angle: 38, intensity: 0.9 },
};

export interface SunbeamDustProps extends BaseCanvasProps {
  /** Light and dust color (default: "#ffcf87") */
  color?: string;
  /** Background color, ignored in overlay mode (default: "#140d07") */
  backgroundColor?: string;
  /** Number of window panes / light shafts (default: 4) */
  beams?: number;
  /** Light angle from vertical in degrees, + slants right (default: 24) */
  angle?: number;
  /** Shaft brightness multiplier (default: 1) */
  intensity?: number;
  /** Number of dust motes (default: 320) */
  dustCount?: number;
  /** Dust mote size multiplier (default: 1) */
  dustSize?: number;
  /** Air drift speed multiplier (default: 1) */
  speed?: number;
  /** Window center along the top edge, 0..1 (default: 0.35) */
  windowX?: number;
  /** Window width as a fraction of canvas width (default: 0.42) */
  windowWidth?: number;
  /** Cursor stirs the dust (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: SunbeamDustPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const SunbeamDust = forwardRef<HTMLCanvasElement, SunbeamDustProps>((props, ref) => {
  const {
    preset, color, backgroundColor, beams, angle, intensity, dustCount, dustSize, speed,
    windowX, windowWidth, interactive, overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("SunbeamDust", PRESETS, props);

  const { canvasRef, canvas } = useSunbeamDust({
    color:           color           ?? p.color           ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    beams:           Math.max(1, Math.round(beams ?? p.beams ?? 4)),
    angle:           Math.max(-60, Math.min(60, angle ?? p.angle ?? 24)),
    intensity:       intensity       ?? p.intensity       ?? 1,
    dustCount:       Math.max(0, dustCount ?? 320),
    dustSize:        dustSize        ?? 1,
    speed:           speed           ?? 1,
    windowX:         windowX         ?? 0.35,
    windowWidth:     windowWidth     ?? 0.42,
    interactive:     interactive     ?? true,
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

SunbeamDust.displayName = "SunbeamDust";
