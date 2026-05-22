import { RefObject } from 'react';

export interface UseSakuraBlossomOptions {
    petalCount: number;
    petalColor: string;
    backgroundColor: string;
    gravity: number;
    windStrength: number;
    windGusts: boolean;
    showAccumulation: boolean;
    maxAccumulation: number;
    petalSize: number;
}
export declare function useSakuraBlossom(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSakuraBlossomOptions): void;
