import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useGrassField } from "./useGrassField";
import { resolvePreset } from "../../utils/props";

type GrassFieldPreset = "default" | "meadow" | "dusk" | "wheat" | "frost" | "monochrome";

interface GrassFieldPresetValues {
  baseColor?: string;
  tipColor?: string;
  backgroundColor?: string;
  flowerColor?: string;
  flowers?: number;
  bladeHeight?: number;
}

const PRESETS: Record<GrassFieldPreset, GrassFieldPresetValues> = {
  default: { baseColor: "#14301a", tipColor: "#8fd16a", backgroundColor: "#0a1420", flowerColor: "#fef3c7" },
  monochrome: {},
  meadow: { baseColor: "#14301a", tipColor: "#8fd16a", backgroundColor: "#0a1420", flowerColor: "#fef3c7", flowers: 0.04 },
  dusk:   { baseColor: "#1b1433", tipColor: "#a78bfa", backgroundColor: "#0d0a1a", flowerColor: "#fda4af", flowers: 0.03 },
  wheat:  { baseColor: "#4a3512", tipColor: "#f0cf7a", backgroundColor: "#140e06", bladeHeight: 0.5 },
  frost:  { baseColor: "#1e2a38", tipColor: "#e2ecf7", backgroundColor: "#070b10" },
};

export interface GrassFieldProps extends BaseCanvasProps {
  /** Blades per 100px of width, per row (default: 45) */
  density?: number;
  /** Tallest blade as a fraction of canvas height (default: 0.38) */
  bladeHeight?: number;
  /** Color at the blade root (default: "#14301a") */
  baseColor?: string;
  /** Color at the blade tip (default: "#8fd16a") */
  tipColor?: string;
  /** Background color, ignored in overlay mode (default: "#0a1420") */
  backgroundColor?: string;
  /** Flower head color (default: "#fef3c7") */
  flowerColor?: string;
  /** Fraction of blades topped with a flower, 0..1 (default: 0) */
  flowers?: number;
  /** Wind strength (default: 1) */
  wind?: number;
  /** Strength of gust bands rolling across the field (default: 1) */
  gusts?: number;
  /** Depth rows, back to front (default: 3) */
  rows?: number;
  /** Cursor parts the grass (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: GrassFieldPreset | string;
  /** Fixed full-viewport, click-through layer: grass along the bottom of the screen (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const GrassField = forwardRef<HTMLCanvasElement, GrassFieldProps>((props, ref) => {
  const {
    preset, density, bladeHeight, baseColor, tipColor, backgroundColor, flowerColor,
    flowers, wind, gusts, rows, interactive, overlay, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("GrassField", PRESETS, props);

  const { canvasRef, canvas } = useGrassField({
    density:         density         ?? 45,
    height:          bladeHeight     ?? p.bladeHeight     ?? 0.38,
    baseColor:       baseColor       ?? p.baseColor       ?? "#374151",
    tipColor:        tipColor        ?? p.tipColor        ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    flowerColor:     flowerColor     ?? p.flowerColor     ?? "#ffffff",
    flowers:         flowers         ?? p.flowers         ?? 0,
    wind:            wind            ?? 1,
    gusts:           gusts           ?? 1,
    rows:            Math.max(1, Math.round(rows ?? 3)),
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

GrassField.displayName = "GrassField";
