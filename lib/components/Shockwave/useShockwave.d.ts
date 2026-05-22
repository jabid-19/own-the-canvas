import { RefObject } from 'react';

export interface UseShockwaveOptions {
    color: string;
    secondaryColor: string;
    ringCount: number;
    ringSpacing: number;
    speed: number;
    maxRadius: number;
    lineWidth: number;
    fadeSpeed: number;
    autoFire: boolean;
    autoInterval: number;
    glowEffect: boolean;
    glowBlur: number;
    backgroundColor: string;
}
export declare function useShockwave(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseShockwaveOptions): {
    fire: (x: number, y: number) => void;
};
