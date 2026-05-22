import { RefObject } from "react";
export interface UseMetaballsOptions {
    blobCount: number;
    color: string;
    backgroundColor: string;
    threshold: number;
    speed: number;
    minRadius: number;
    maxRadius: number;
    glowEffect: boolean;
    glowBlur: number;
    resolution: number;
    animated: boolean;
    interactive: boolean;
}
export declare function useMetaballs(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseMetaballsOptions): void;
