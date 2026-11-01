import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useFrostGlass } from "./useFrostGlass";

type FrostGlassPreset = "default" | "winter-window" | "ice-blue" | "silver" | "rose" | "monochrome";

interface FrostGlassPresetValues {
  color?: string;
  fogColor?: string;
  backgroundColor?: string;
  fog?: number;
}

const PRESETS: Record<FrostGlassPreset, FrostGlassPresetValues> = {
  default: { color: "#e0f2fe", fogColor: "#cbd5e1", backgroundColor: "#0b1220" },
  monochrome: {},
  "winter-window": { color: "#e0f2fe", fogColor: "#cbd5e1", backgroundColor: "#0b1220" },
  "ice-blue": { color: "#a5f3fc", fogColor: "#bae6fd", backgroundColor: "#031018", fog: 0.1 },
  silver: { color: "#f1f5f9", fogColor: "#e2e8f0", backgroundColor: "#18181b" },
  rose: { color: "#ffe4e6", fogColor: "#fecdd3", backgroundColor: "#1a0b10" },
};

export interface FrostGlassProps extends BaseCanvasProps {
  /** Frost crystal color (default: "#e0f2fe") */
  color?: string;
  /** Condensation haze color (default: "#cbd5e1") */
  fogColor?: string;
  /** What's behind the glass; ignored in overlay mode (default: "#0b1220") */
  backgroundColor?: string;
  /** Fraction of the glass the frost grows to cover (default: 0.32) */
  coverage?: number;
  /** Growth speed multiplier (default: 1) */
  growthSpeed?: number;
  /** Chance per step that a crystal splits off a side branch (default: 0.05) */
  branching?: number;
  /** Radius of the patch your cursor melts, px (default: 46) */
  breathRadius?: number;
  /** Condensation haze opacity, 0..1 (default: 0.12) */
  fog?: number;
  /** Cursor melts frost and clears fog (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: FrostGlassPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Frost also nucleates on the edges of elements marked `data-otc-solid` and grows outward (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const FrostGlass = forwardRef<HTMLCanvasElement, FrostGlassProps>((props, ref) => {
  const {
    preset, color, fogColor, backgroundColor, coverage, growthSpeed, branching, breathRadius, fog, interactive,
    overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as FrostGlassPreset] || {};

  const { canvasRef, canvas } = useFrostGlass({
    color:           color ?? p.color ?? "#ffffff",
    fogColor:        fogColor ?? p.fogColor ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    coverage:        coverage ?? 0.32,
    growthSpeed:     growthSpeed ?? 1,
    branching:       branching ?? 0.05,
    breathRadius:    breathRadius ?? 46,
    fog:             fog ?? p.fog ?? 0.12,
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

FrostGlass.displayName = "FrostGlass";
