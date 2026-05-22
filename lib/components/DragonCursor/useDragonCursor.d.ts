import { RefObject } from 'react';

export interface UseDragonCursorOptions {
    segmentCount: number;
    segmentSize: number;
    bodyColor: string;
    eyeColor: string;
    fireColor: string;
    backgroundColor: string;
    followSpeed: number;
    wingSpan: number;
    showFire: boolean;
    interactive: boolean;
}
export declare function useDragonCursor(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseDragonCursorOptions): void;
