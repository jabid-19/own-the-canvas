import { RefObject } from "react";
export interface UseReactionDiffusionOptions {
    feedRate: number;
    killRate: number;
    diffusionU: number;
    diffusionV: number;
    resolution: number;
    speed: number;
    colorA: string;
    colorB: string;
    backgroundColor: string;
    interactive: boolean;
}
export declare function useReactionDiffusion(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseReactionDiffusionOptions): void;
