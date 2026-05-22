import { RefObject } from "react";
export type VoronoiColorMode = "solid" | "gradient" | "cycle";
export interface UseVoronoiCellsOptions {
    cellCount: number;
    speed: number;
    colorMode: VoronoiColorMode;
    cellColor: string;
    backgroundColor: string;
    showEdges: boolean;
    edgeColor: string;
    resolution: number;
    relaxation: number;
    interactive: boolean;
    animated: boolean;
}
export declare function useVoronoiCells(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseVoronoiCellsOptions): void;
