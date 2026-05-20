import { RefObject } from 'react';

export type SpirographColorMode = "solid" | "cycle" | "gradient";
export interface UseSpirographOptions {
    outerRadius: number;
    innerRadius: number;
    penDistance: number;
    speed: number;
    color: string;
    color2: string;
    backgroundColor: string;
    lineWidth: number;
    trailFade: number;
    animated: boolean;
    autoReset: boolean;
    layerCount: number;
    colorMode: SpirographColorMode;
    symmetry: number;
    glowEffect: boolean;
    glowBlur: number;
}
export declare function useSpirograph(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseSpirographOptions): void;
