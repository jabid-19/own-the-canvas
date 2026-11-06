import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSeasonsTree } from "./useSeasonsTree";
import type { Season } from "./useSeasonsTree";
import { resolvePreset } from "../../utils/props";

type SeasonsTreePreset = "default" | "japanese" | "maple" | "moonlight" | "ink" | "monochrome";

interface SeasonsTreePresetValues {
  trunkColor?: string;
  leafColor?: string;
  blossomColor?: string;
  autumnColor?: string;
  backgroundColor?: string;
}

const PRESETS: Record<SeasonsTreePreset, SeasonsTreePresetValues> = {
  default: { trunkColor: "#4a362a", leafColor: "#5b8c3e", blossomColor: "#ffb7c5", autumnColor: "#d9622b", backgroundColor: "#0e0c0a" },
  monochrome: {},
  japanese: { trunkColor: "#4a362a", leafColor: "#5b8c3e", blossomColor: "#ffb7c5", autumnColor: "#d9622b", backgroundColor: "#0e0c0a" },
  maple: { trunkColor: "#4a3020", leafColor: "#3f7d3a", blossomColor: "#fde68a", autumnColor: "#c2410c", backgroundColor: "#120a06" },
  moonlight: { trunkColor: "#64748b", leafColor: "#94a3b8", blossomColor: "#e2e8f0", autumnColor: "#cbd5e1", backgroundColor: "#050810" },
  ink: { trunkColor: "#1f2937", leafColor: "#374151", blossomColor: "#9ca3af", autumnColor: "#4b5563", backgroundColor: "#f5f1e8" },
};

export interface SeasonsTreeProps extends BaseCanvasProps {
  /** Season to show, or cycle through all four (default: "cycle") */
  season?: Season;
  /** Seconds for a full year when cycling (default: 48) */
  cycleSeconds?: number;
  /** Trunk and branch color (default: "#4a362a") */
  trunkColor?: string;
  /** Summer leaf color (default: "#5b8c3e") */
  leafColor?: string;
  /** Spring blossom color (default: "#ffb7c5") */
  blossomColor?: string;
  /** Autumn leaf color (default: "#d9622b") */
  autumnColor?: string;
  /** Background color, ignored in overlay mode (default: "#0e0c0a") */
  backgroundColor?: string;
  /** Trunk position, 0..1 of width (default: 0.5) */
  treeX?: number;
  /** Tree size multiplier (default: 1) */
  treeSize?: number;
  /** Base wind; negative blows left (default: 0.6) */
  wind?: number;
  /** Cursor movement blows wind through the branches (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: SeasonsTreePreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Falling leaves and petals land on elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const SeasonsTree = forwardRef<HTMLCanvasElement, SeasonsTreeProps>((props, ref) => {
  const {
    preset, season, cycleSeconds, trunkColor, leafColor, blossomColor, autumnColor, backgroundColor, treeX, treeSize, wind, interactive,
    overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("SeasonsTree", PRESETS, props);

  const { canvasRef, canvas } = useSeasonsTree({
    season:          season ?? "cycle",
    cycleSeconds:    cycleSeconds ?? 48,
    trunkColor:      trunkColor ?? p.trunkColor ?? "#6b7280",
    leafColor:       leafColor ?? p.leafColor ?? "#d1d5db",
    blossomColor:    blossomColor ?? p.blossomColor ?? "#ffffff",
    autumnColor:     autumnColor ?? p.autumnColor ?? "#9ca3af",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    treeX:           treeX ?? 0.5,
    treeSize:        Math.max(0, treeSize ?? 1),
    wind:            wind ?? 0.6,
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

SeasonsTree.displayName = "SeasonsTree";
