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
}
export declare function useParticleField(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseParticleFieldOptions): void;
