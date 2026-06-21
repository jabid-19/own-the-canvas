import { RefObject } from "react";
export interface UseDeepSeaBioluminescenceOptions {
    jellyfishCount: number;
    planktonCount: number;
    jellyfishColor: string;
    glowColor: string;
    waterColor: string;
    interactive: boolean;
    speed: number;
}
export declare function useDeepSeaBioluminescence(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseDeepSeaBioluminescenceOptions): void;
