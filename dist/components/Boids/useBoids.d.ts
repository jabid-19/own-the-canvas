import { RefObject } from 'react';

export interface UseBoidsOptions {
    count: number;
    maxSpeed: number;
    separationRadius: number;
    alignmentRadius: number;
    cohesionRadius: number;
    separationForce: number;
    alignmentForce: number;
    cohesionForce: number;
    color: string;
    trailLength: number;
    trailOpacity: number;
    boidSize: number;
    backgroundColor: string;
    interactive: boolean;
    mouseRadius: number;
    mouseForce: number;
    wrapEdges: boolean;
}
export declare function useBoids(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseBoidsOptions): void;
