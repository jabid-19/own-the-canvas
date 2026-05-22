import { RefObject } from "react";
export type SandMaterial = "sand" | "water" | "fire" | "wall" | "erase";
export interface UseSandSimulationOptions {
    cellSize: number;
    brushSize: number;
    material: SandMaterial;
    sandColor: string;
    waterColor: string;
    fireColor: string;
    wallColor: string;
    backgroundColor: string;
    interactive: boolean;
    gravity: number;
}
export declare function useSandSimulation(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSandSimulationOptions): void;
