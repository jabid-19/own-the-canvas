import { RefObject } from "react";
export type PendulaWaveColorMode = "solid" | "cycle" | "gradient";
export interface UsePendulaWaveOptions {
    color: string;
    color2: string;
    backgroundColor: string;
    lineWidth: number;
    trailFade: number;
    speed: number;
    damping: number;
    freq1: number;
    freq2: number;
    freq3: number;
    amplitude: number;
    colorMode: PendulaWaveColorMode;
    glowEffect: boolean;
    glowBlur: number;
    animated: boolean;
    autoReset: boolean;
}
export declare function usePendulaWave(canvasRef: RefObject<HTMLCanvasElement | null>, options: UsePendulaWaveOptions): void;
