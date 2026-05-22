import { RefObject } from "react";
export interface UseTerrainMeshOptions {
    gridCols: number;
    gridRows: number;
    noiseScale: number;
    heightScale: number;
    wireColor: string;
    backgroundColor: string;
    fov: number;
    rotateX: number;
    rotateY: number;
    autoRotate: boolean;
    autoRotateSpeed: number;
    glowEffect: boolean;
    glowBlur: number;
    interactive: boolean;
    animated: boolean;
    lineWidth: number;
    colorByHeight: boolean;
}
export declare function useTerrainMesh(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseTerrainMeshOptions): void;
