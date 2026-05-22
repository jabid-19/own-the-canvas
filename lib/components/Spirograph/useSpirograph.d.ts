import { RefObject } from 'react';

export interface UseSpirographOptions {
    outerRadius: number;
    innerRadius: number;
    penDistance: number;
    speed: number;
    colors: string[];
    backgroundColor: string;
    lineWidth: number;
    trailFade: number;
    animated: boolean;
    autoReset: boolean;
    layerCount: number;
    symmetry: number;
    glowEffect: boolean;
    glowBlur: number;
}
export declare function useSpirograph(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSpirographOptions): void;
