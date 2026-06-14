import { RefObject } from "react";
export interface UseBlackHoleOptions {
    diskColor: string;
    backgroundColor: string;
    particleCount: number;
    gravity: number;
    eventHorizonRadius: number;
    diskWidth: number;
    jetColor: string;
    showJets: boolean;
    lensing: boolean;
    speed: number;
    interactive: boolean;
    starCount: number;
    starColor: string;
    glowingStars: boolean;
    starGlowBlur: number;
}
export declare function useBlackHole(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseBlackHoleOptions): void;
