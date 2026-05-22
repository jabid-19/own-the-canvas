import { RefObject } from "react";
export interface UseNoiseGradientOptions {
    colors: string[];
    speed: number;
    scale: number;
    octaves: number;
    animated: boolean;
    blendMode: string;
    timeOffsetY: number;
    persistence: number;
    resolution: number;
}
export declare function useNoiseGradient(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseNoiseGradientOptions): void;
