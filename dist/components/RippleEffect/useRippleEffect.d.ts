import { RefObject } from 'react';

export interface UseRippleEffectOptions {
    color: string;
    maxRadius: number;
    speed: number;
    lineWidth: number;
    decay: number;
    multiRipple: boolean;
    backgroundColor: string;
    interactive: boolean;
    autoInterval: number;
    radiusGrowthRate: number;
    opacityDecayRate: number;
    autoCenter: boolean;
}
export declare function useRippleEffect(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseRippleEffectOptions): void;
