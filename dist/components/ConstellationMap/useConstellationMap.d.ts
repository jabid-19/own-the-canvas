import { RefObject } from 'react';

export type ConstellationLineStyle = "solid" | "dashed";
export interface UseConstellationMapOptions {
    starCount: number;
    starColor: string;
    lineColor: string;
    backgroundColor: string;
    speed: number;
    interactive: boolean;
    lineStyle: ConstellationLineStyle;
    glowStars: boolean;
    connectionDistance: number;
    velocityMultiplier: number;
    dragRadius: number;
    twinkleSpeed: number;
    lineAlpha: number;
    lineWidth: number;
    glowMultiplier: number;
    twinkleAmplitude: number;
}
export declare function useConstellationMap(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseConstellationMapOptions): void;
