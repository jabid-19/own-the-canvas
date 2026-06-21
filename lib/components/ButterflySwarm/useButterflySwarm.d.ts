import { RefObject } from 'react';

export interface UseButterflySwarmOptions {
    butterflyCount: number;
    wingColor: string;
    patternColor: string;
    backgroundColor: string;
    flapSpeed: number;
    speed: number;
    attractRadius: number;
    interactive: boolean;
    showTrails: boolean;
}
export declare function useButterflySwarm(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseButterflySwarmOptions): void;
