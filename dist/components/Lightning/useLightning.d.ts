import { RefObject } from "react";
export interface UseLightningOptions {
    segments: number;
    roughness: number;
    branchChance: number;
    branchDecay: number;
    flickerCount: number;
    glowBlur: number;
    color: string;
    coreColor: string;
    backgroundColor: string;
    autoInterval: number;
    interactive: boolean;
    startX: number;
    startY: number;
    endY: number;
}
export declare function useLightning(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseLightningOptions): void;
