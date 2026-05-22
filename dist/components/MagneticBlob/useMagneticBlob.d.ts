import { RefObject } from "react";
export interface UseMagneticBlobOptions {
    count: number;
    colors: string[];
    radius: number;
    speed: number;
    magnetStrength: number;
    magnetRadius: number;
    threshold: number;
    glowEffect: boolean;
    glowBlur: number;
    backgroundColor: string;
    animated: boolean;
    followMouse: boolean;
    wanderStrength: number;
}
export declare function useMagneticBlob(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseMagneticBlobOptions): void;
