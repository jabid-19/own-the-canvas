import { RefObject } from "react";
export interface UseParticleTextOptions {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    particleSize: number;
    particleGap: number;
    repelRadius: number;
    repelForce: number;
    snapSpeed: number;
    friction: number;
    glowEffect: boolean;
    glowBlur: number;
    animated: boolean;
    interactive: boolean;
}
export declare function useParticleText(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseParticleTextOptions): void;
