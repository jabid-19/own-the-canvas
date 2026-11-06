import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useIvyGrowth } from "./useIvyGrowth";
import { resolvePreset } from "../../utils/props";

type IvyGrowthPreset = "default" | "english-ivy" | "autumn" | "jungle" | "gilded" | "monochrome";

interface IvyGrowthPresetValues {
  color?: string;
  leafColor?: string;
  backgroundColor?: string;
  leafDensity?: number;
  leafSize?: number;
}

const PRESETS: Record<IvyGrowthPreset, IvyGrowthPresetValues> = {
  default: { color: "#3f5a2a", leafColor: "#5f9e3a", backgroundColor: "#0c120b" },
  monochrome: {},
  "english-ivy": { color: "#3f5a2a", leafColor: "#5f9e3a", backgroundColor: "#0c120b" },
  autumn:        { color: "#5a3a22", leafColor: "#d9622b", backgroundColor: "#140b07" },
  jungle:        { color: "#245c3a", leafColor: "#34d399", backgroundColor: "#04110b", leafDensity: 0.55, leafSize: 11 },
  gilded:        { color: "#8a6a2a", leafColor: "#f5c96a", backgroundColor: "#0e0b06", leafDensity: 0.3 },
};

export interface IvyGrowthProps extends BaseCanvasProps {
  /** Stem and tendril color (default: "#3f5a2a") */
  color?: string;
  /** Leaf color (default: "#5f9e3a") */
  leafColor?: string;
  /** Background color, ignored in overlay mode (default: "#0c120b") */
  backgroundColor?: string;
  /** Root count when growing over the whole canvas (default: 4) */
  vines?: number;
  /** Growth speed multiplier (default: 1) */
  growthSpeed?: number;
  /** How much space the vines fill, 0.3..2 (default: 1) */
  density?: number;
  /** Leaf length in px (default: 9) */
  leafSize?: number;
  /** Leaves per stem segment, 0..1 (default: 0.35) */
  leafDensity?: number;
  /** Vines lean toward the cursor like it's sunlight (default: true) */
  followCursor?: boolean;
  /** With collide: how far vines spread from each element's edges, px (default: 20) */
  hug?: number;
  /** When fully grown, hold, fade, and regrow (default: false) */
  loop?: boolean;
  /** Named preset */
  preset?: IvyGrowthPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Vines climb the edges of elements marked `data-otc-solid` instead of the canvas (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const IvyGrowth = forwardRef<HTMLCanvasElement, IvyGrowthProps>((props, ref) => {
  const {
    preset, color, leafColor, backgroundColor, vines, growthSpeed, density, leafSize, leafDensity,
    followCursor, hug, loop, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("IvyGrowth", PRESETS, props);

  const { canvasRef, canvas } = useIvyGrowth({
    color:           color           ?? p.color           ?? "#6b7280",
    leafColor:       leafColor       ?? p.leafColor       ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    vines:           Math.max(1, Math.round(vines ?? 4)),
    growthSpeed:     growthSpeed     ?? 1,
    density:         Math.min(2, Math.max(0.3, density ?? 1)),
    leafSize:        leafSize        ?? p.leafSize        ?? 9,
    leafDensity:     leafDensity     ?? p.leafDensity     ?? 0.35,
    followCursor:    followCursor    ?? true,
    hug:             hug             ?? 20,
    loop:            loop            ?? false,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
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

IvyGrowth.displayName = "IvyGrowth";
