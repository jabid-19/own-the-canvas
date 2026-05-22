import { RefObject } from 'react';

export type CrystalGrowthColorMode = "solid" | "age" | "cycle";
export interface UseCrystalGrowthOptions {
    crystalColor: string;
    activeColor: string;
    backgroundColor: string;
    growthSpeed: number;
    symmetry: number;
    branchProbability: number;
    noiseAmount: number;
    cellSize: number;
    glowEffect: boolean;
    glowBlur: number;
    interactive: boolean;
    autoReset: boolean;
    colorMode: CrystalGrowthColorMode;
    animated: boolean;
}
export declare function useCrystalGrowth(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseCrystalGrowthOptions): void;
