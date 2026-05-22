import { RefObject } from "react";
export type DLASeedMode = "center" | "ring" | "bottom";
export interface UseDiffusionAggregationOptions {
    particleColor: string;
    walkerColor: string;
    backgroundColor: string;
    particleSize: number;
    walkerCount: number;
    stepsPerFrame: number;
    seedMode: DLASeedMode;
    showWalkers: boolean;
    glowEffect: boolean;
    glowBlur: number;
    interactive: boolean;
}
export declare function useDiffusionAggregation(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseDiffusionAggregationOptions): void;
