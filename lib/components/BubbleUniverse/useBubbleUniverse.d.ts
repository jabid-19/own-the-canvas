import { RefObject } from 'react';

export interface UseBubbleUniverseOptions {
    bubbleCount: number;
    minRadius: number;
    maxRadius: number;
    backgroundColor: string;
    shimmerColor: string;
    popEffect: boolean;
    gravity: number;
    friction: number;
    interactive: boolean;
    mergeOnCollide: boolean;
    glowEffect: boolean;
}
export declare function useBubbleUniverse(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseBubbleUniverseOptions): void;
