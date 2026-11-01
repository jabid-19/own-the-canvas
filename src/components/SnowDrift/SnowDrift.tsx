import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSnowDrift } from "./useSnowDrift";

type SnowDriftPreset = "default" | "winter-night" | "blizzard" | "nordic" | "dusk" | "monochrome";

interface SnowDriftPresetValues {
  color?: string;
  backgroundColor?: string;
  wind?: number;
  maxDepth?: number;
}

const PRESETS: Record<SnowDriftPreset, SnowDriftPresetValues> = {
  default: { color: "#f8fafc", backgroundColor: "#0b1220" },
  monochrome: {},
  "winter-night": { color: "#f8fafc", backgroundColor: "#0b1220" },
  blizzard: { color: "#e2e8f0", backgroundColor: "#1e293b", wind: 1.8 },
  nordic: { color: "#ffffff", backgroundColor: "#10141c", maxDepth: 34 },
  dusk: { color: "#fde2e4", backgroundColor: "#1a1020", wind: -0.3 },
};

export interface SnowDriftProps extends BaseCanvasProps {
  /** Number of falling flakes (default: 220) */
  count?: number;
  /** Snow color (default: "#f8fafc") */
  color?: string;
  /** Background color, ignored in overlay mode (default: "#0b1220") */
  backgroundColor?: string;
  /** Flake radius in px (default: 2.2) */
  flakeSize?: number;
  /** Horizontal wind; negative blows left (default: 0.4) */
  wind?: number;
  /** Fall speed multiplier (default: 1) */
  fallSpeed?: number;
  /** Deepest snow on an element, px (default: 26) */
  maxDepth?: number;
  /** Deepest snow on the ground, px (default: 60) */
  floorDepth?: number;
  /** Angle of repose as rise over run; lower = flatter drifts (default: 0.7) */
  slope?: number;
  /** Cursor brushes snow off drifts (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: SnowDriftPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Snow piles up on elements marked `data-otc-solid` and slides off their edges (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const SnowDrift = forwardRef<HTMLCanvasElement, SnowDriftProps>((props, ref) => {
  const {
    preset, count, color, backgroundColor, flakeSize, wind, fallSpeed, maxDepth, floorDepth, slope, interactive,
    overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as SnowDriftPreset] || {};

  const { canvasRef, canvas } = useSnowDrift({
    count:           Math.max(0, Math.round((count ?? 220))),
    color:           color ?? p.color ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    flakeSize:       flakeSize ?? 2.2,
    wind:            wind ?? p.wind ?? 0.4,
    fallSpeed:       fallSpeed ?? 1,
    maxDepth:        maxDepth ?? p.maxDepth ?? 26,
    floorDepth:      floorDepth ?? 60,
    slope:           slope ?? 0.7,
    interactive:     interactive ?? true,
    overlay:         overlay ?? false,
    collide:         collide ?? false,
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

SnowDrift.displayName = "SnowDrift";
