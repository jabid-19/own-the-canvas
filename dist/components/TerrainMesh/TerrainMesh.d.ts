import { BaseCanvasProps } from '../../types';

type TerrainMeshPreset = "default" | "volcanic" | "arctic" | "neon" | "golden" | "minimal";
export interface TerrainMeshProps extends BaseCanvasProps {
    /** Columns in the wireframe grid (default: 40) */
    gridCols?: number;
    /** Rows in the wireframe grid (default: 30) */
    gridRows?: number;
    /** Perlin noise frequency (default: 0.12) */
    noiseScale?: number;
    /** Max terrain height in px (default: 120) */
    heightScale?: number;
    /** Wireframe line color (default: "#ffffff") */
    wireColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Perspective focal length (default: 500) */
    fov?: number;
    /** Initial X rotation in radians (default: 0.4) */
    rotateX?: number;
    /** Initial Y rotation in radians (default: 0) */
    rotateY?: number;
    /** Slowly auto-rotate Y axis (default: true) */
    autoRotate?: boolean;
    /** Radians per frame for auto-rotate (default: 0.003) */
    autoRotateSpeed?: number;
    /** Glow on wireframe (default: false) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 8) */
    glowBlur?: number;
    /** Mouse drag to orbit (default: true) */
    interactive?: boolean;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Wireframe line width (default: 0.5) */
    lineWidth?: number;
    /** Color vertices by height (default: true) */
    colorByHeight?: boolean;
    preset?: TerrainMeshPreset | string;
}
export declare const TerrainMesh: import('react').ForwardRefExoticComponent<TerrainMeshProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
