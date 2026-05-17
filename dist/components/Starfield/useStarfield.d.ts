import { RefObject } from 'react';

export type StarfieldPerspective = "2D" | "3D";
export interface UseStarfieldOptions {
    starCount: number;
    starColor: string;
    backgroundColor: string;
    speed: number;
    twinkle: boolean;
    shootingStars: boolean;
    shootingStarInterval: number;
    perspective: StarfieldPerspective;
    starSizeMin: number;
    starSizeMax: number;
    starOpacityMin: number;
    starOpacityMax: number;
    twinkleSpeed: number;
    shootingStarLength: number;
    shootingStarLifetime: number;
}
export declare function useStarfield(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseStarfieldOptions): void;
