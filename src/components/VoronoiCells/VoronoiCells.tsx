import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useVoronoiCells, VoronoiColorMode } from "./useVoronoiCells";

type VoronoiPreset = "default" | "stained-glass" | "neon" | "frost" | "ember" | "void";

interface VoronoiPresetValues {
  colorMode?: VoronoiColorMode;
  cellColor?: string;
  backgroundColor?: string;
  edgeColor?: string;
  showEdges?: boolean;
  cellCount?: number;
}

const PRESETS: Record<VoronoiPreset, VoronoiPresetValues> = {
  "default":       {},
  "stained-glass": { colorMode: "cycle", edgeColor: "#111111", cellCount: 25 },
  "neon":          { colorMode: "cycle", backgroundColor: "#000000", edgeColor: "#000000", showEdges: false },
  "frost":         { colorMode: "gradient", cellColor: "#88ccff", backgroundColor: "#001833", edgeColor: "#ffffff" },
  "ember":         { colorMode: "cycle", backgroundColor: "#0a0200", edgeColor: "#0a0200", showEdges: false },
  "void":          { cellColor: "#ffffff", backgroundColor: "#000000", showEdges: false },
};

export interface VoronoiCellsProps extends BaseCanvasProps {
  /** Number of Voronoi seed points (default: 20) */
  cellCount?: number;
  /** Seed drift/animation speed (default: 1) */
  speed?: number;
  /** "solid" | "gradient" | "cycle" — per-cell coloring (default: "solid") */
  colorMode?: VoronoiColorMode;
  /** Base cell color in solid/gradient mode (default: "#ffffff") */
  cellColor?: string;
  /** Background / empty space color (default: "#111111") */
  backgroundColor?: string;
  /** Draw 1px cell boundary lines (default: true) */
  showEdges?: boolean;
  /** Edge line color (default: "#333333") */
  edgeColor?: string;
  /** Render resolution fraction — lower is faster (default: 0.25) */
  resolution?: number;
  /** Lloyd centroid pull strength per frame (default: 0.05) */
  relaxation?: number;
  /** Click to add seed; drag to move nearest seed (default: true) */
  interactive?: boolean;
  /** Enable continuous drift animation (default: true) */
  animated?: boolean;
  /** Named preset */
  preset?: VoronoiPreset | string;
}

export const VoronoiCells = forwardRef<HTMLCanvasElement, VoronoiCellsProps>(
  (props, ref) => {
    const {
      preset, cellCount, speed, colorMode, cellColor,
      backgroundColor, showEdges, edgeColor,
      resolution, relaxation, interactive, animated,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as VoronoiPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useVoronoiCells(internalRef, {
      cellCount:       cellCount       ?? p.cellCount       ?? 20,
      speed:           speed           ?? 1,
      colorMode:       colorMode       ?? p.colorMode       ?? "solid",
      cellColor:       cellColor       ?? p.cellColor       ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      showEdges:       showEdges       ?? p.showEdges       ?? true,
      edgeColor:       edgeColor       ?? p.edgeColor       ?? "#333333",
      resolution:      resolution      ?? 0.25,
      relaxation:      relaxation      ?? 0.05,
      interactive:     interactive     ?? true,
      animated:        animated        ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

VoronoiCells.displayName = "VoronoiCells";
