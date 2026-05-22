import { RefObject } from 'react';

export interface UseParticleFieldOptions {
    particleCount: number;
    particleColor: string;
    lineColor: string;
    lineDistance: number;
    particleSize: number;
    speed: number;
    connectParticles: boolean;
    interactive: boolean;
    backgroundColor: string;
    repelRadius: number;
    repelStrength: number;
    friction: number;
    maxVelocityMultiplier: number;
    lineWidth: number;
    lineOpacity: number;
    wrapEdges: boolean;
    twinkle: boolean;
    twinkleSpeed: number;
    twinkleAmplitude: number;
    glowParticles: boolean;
    glowBlur: number;
    lineStyle: "solid" | "dashed";
    dragParticles: boolean;
    dragRadius: number;
    velocityMultiplier: number;
}
export declare function useParticleField(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseParticleFieldOptions): void;
