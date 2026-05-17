import { RefObject } from 'react';

export interface UseWormholeOptions {
    ringCount: number;
    speed: number;
    colors: string[];
    backgroundColor: string;
    twist: number;
    fov: number;
    depth: number;
    lineWidth: number;
    opacity: number;
    starCount: number;
    starColor: string;
    interactive: boolean;
}
export declare function useWormhole(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseWormholeOptions): void;
