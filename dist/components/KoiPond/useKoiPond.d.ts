import { RefObject } from "react";
export interface UseKoiPondOptions {
    fishCount: number;
    fishColor: string;
    scaleColor: string;
    waterColor: string;
    rippleColor: string;
    lilyColor: string;
    speed: number;
    interactive: boolean;
    showLilies: boolean;
    caustics: boolean;
}
export declare function useKoiPond(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseKoiPondOptions): void;
