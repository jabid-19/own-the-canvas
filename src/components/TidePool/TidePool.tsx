import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useTidePool } from "./useTidePool";
import { resolvePreset } from "../../utils/props";

type TidePoolPreset = "default" | "tropical" | "kelp-coast" | "sunset" | "night" | "monochrome";

interface TidePoolPresetValues {
  waterColor?: string;
  rockColor?: string;
  anemoneColor?: string;
  starfishColor?: string;
}

export const PRESETS: Record<TidePoolPreset, TidePoolPresetValues> = {
  default:      { waterColor: "#2a8a8f", rockColor: "#6e6457", anemoneColor: "#5fbf7a", starfishColor: "#e0702e" },
  monochrome:   {},
  tropical:     { waterColor: "#22b5c4", rockColor: "#c8b48a", anemoneColor: "#b05fd0", starfishColor: "#3a6ad8" },
  "kelp-coast": { waterColor: "#1f5a48", rockColor: "#4a4a40", anemoneColor: "#e07aa0", starfishColor: "#8a3aa0" },
  sunset:       { waterColor: "#c0704a", rockColor: "#5a4a40", anemoneColor: "#f0c050", starfishColor: "#d8402e" },
  night:        { waterColor: "#0e2a4a", rockColor: "#2a2c34", anemoneColor: "#4ae0d0", starfishColor: "#c06a3a" },
};

export interface TidePoolProps extends BaseCanvasProps {
  /** Water tint (default: "#2a8a8f") */
  waterColor?: string;
  /** Rocks and sand on the pool floor (default: "#6e6457") */
  rockColor?: string;
  /** Sea anemone color (default: "#5fbf7a") */
  anemoneColor?: string;
  /** Starfish color (default: "#e0702e") */
  starfishColor?: string;
  /** Number of small fish (default: 7) */
  fishCount?: number;
  /** Number of sea anemones (default: 5) */
  anemoneCount?: number;
  /** Sunlight caustics strength, 0..2 (default: 1) */
  causticIntensity?: number;
  /** Anemones close and fish flee from the cursor; moving it ripples the water, taps splash (default: true) */
  interactive?: boolean;
  /** Named preset: "default" | "tropical" | "kelp-coast" | "sunset" | "night" | "monochrome" */
  preset?: TidePoolPreset | string;
}

export const TidePool = forwardRef<HTMLCanvasElement, TidePoolProps>((props, ref) => {
  const {
    preset, waterColor, rockColor, anemoneColor, starfishColor, fishCount, anemoneCount,
    causticIntensity, interactive, width, height, className, style,
  } = props;
  const p = resolvePreset("TidePool", PRESETS, props);

  const { canvasRef, canvas } = useTidePool({
    waterColor:       waterColor       ?? p.waterColor       ?? "#6b7280",
    rockColor:        rockColor        ?? p.rockColor        ?? "#4b5563",
    anemoneColor:     anemoneColor     ?? p.anemoneColor     ?? "#d1d5db",
    starfishColor:    starfishColor    ?? p.starfishColor    ?? "#9ca3af",
    fishCount:        fishCount        ?? 7,
    anemoneCount:     anemoneCount     ?? 5,
    causticIntensity: causticIntensity ?? 1,
    interactive:      interactive      ?? true,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={style} />
  );
});

TidePool.displayName = "TidePool";
