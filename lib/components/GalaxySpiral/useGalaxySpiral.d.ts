import { RefObject } from 'react';

export interface UseGalaxySpiralOptions {
    starCount: number;
    armCount: number;
    armTightness: number;
    coreColor: string;
    diskColor: string;
    backgroundColor: string;
    rotationSpeed: number;
    tiltX: number;
    interactive: boolean;
    coreGlow: boolean;
    glowBlur: number;
}
export declare function useGalaxySpiral(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseGalaxySpiralOptions): void;
