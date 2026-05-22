import { BaseCanvasProps } from "../../types";
import { VoronoiColorMode } from "./useVoronoiCells";
type VoronoiPreset = "default" | "stained-glass" | "neon" | "frost" | "ember" | "void";
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
export declare const VoronoiCells: import("react").ForwardRefExoticComponent<VoronoiCellsProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
