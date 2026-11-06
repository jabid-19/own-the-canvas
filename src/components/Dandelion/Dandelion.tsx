import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useDandelion } from "./useDandelion";
import { resolvePreset } from "../../utils/props";

type DandelionPreset = "default" | "meadow" | "sunset" | "moonlit" | "ink" | "monochrome";

interface DandelionPresetValues {
  color?: string;
  stemColor?: string;
  backgroundColor?: string;
  wind?: number;
}

const PRESETS: Record<DandelionPreset, DandelionPresetValues> = {
  default: { color: "#dbeafe", stemColor: "#3b4a63", backgroundColor: "#05080f" },
  monochrome: {},
  meadow:  { color: "#f8fafc", stemColor: "#5f8f3e", backgroundColor: "#0b1a14" },
  sunset:  { color: "#ffe8cc", stemColor: "#8a5a2b", backgroundColor: "#1a0c08", wind: 1.2 },
  moonlit: { color: "#dbeafe", stemColor: "#3b4a63", backgroundColor: "#05080f", wind: 0.6 },
  ink:     { color: "#1f2937", stemColor: "#4b5563", backgroundColor: "#f5f1e8" },
};

export interface DandelionProps extends BaseCanvasProps {
  /** Number of dandelion heads (default: 3) */
  headCount?: number;
  /** Seeds per head (default: 110) */
  seedsPerHead?: number;
  /** Seed and pappus color (default: "#dbeafe") */
  color?: string;
  /** Stem and seed-body color (default: "#3b4a63") */
  stemColor?: string;
  /** Background color, ignored in overlay mode (default: "#05080f") */
  backgroundColor?: string;
  /** Horizontal wind; negative blows left (default: 0.9) */
  wind?: number;
  /** How easily a cursor sweep strips seeds (default: 1) */
  blowStrength?: number;
  /** Occasional gusts release a few seeds on their own (default: true) */
  autoBlow?: boolean;
  /** Bald heads regrow their seeds after a few seconds (default: true) */
  regrow?: boolean;
  /** Sweep the cursor across a head to blow it (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: DandelionPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Seeds land on elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const Dandelion = forwardRef<HTMLCanvasElement, DandelionProps>((props, ref) => {
  const {
    preset, headCount, seedsPerHead, color, stemColor, backgroundColor, wind, blowStrength,
    autoBlow, regrow, interactive, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Dandelion", PRESETS, props);

  const { canvasRef, canvas } = useDandelion({
    headCount:       Math.max(0, Math.round(headCount ?? 3)),
    seedsPerHead:    Math.max(8, Math.round(seedsPerHead ?? 110)),
    color:           color           ?? p.color           ?? "#ffffff",
    stemColor:       stemColor       ?? p.stemColor       ?? "#6b7280",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    wind:            wind            ?? p.wind            ?? 0.9,
    blowStrength:    blowStrength    ?? 1,
    autoBlow:        autoBlow        ?? true,
    regrow:          regrow          ?? true,
    interactive:     interactive     ?? true,
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

Dandelion.displayName = "Dandelion";
