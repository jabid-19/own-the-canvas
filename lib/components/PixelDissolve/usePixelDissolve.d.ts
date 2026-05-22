import { RefObject } from 'react';

export type DissolveDirection = "in" | "out" | "both";
export type DissolvePattern = "random" | "center" | "edges" | "horizontal";
export interface UsePixelDissolveOptions {
    pixelSize: number;
    speed: number;
    direction: DissolveDirection;
    trigger: boolean;
    color: string;
    onComplete?: () => void;
    progressMultiplier: number;
    dissolvePattern: DissolvePattern;
}
export declare function usePixelDissolve(canvasRef: RefObject<HTMLCanvasElement | null>, _sourceRef: RefObject<HTMLDivElement | null>, options: UsePixelDissolveOptions): void;
