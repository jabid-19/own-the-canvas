import { BaseCanvasProps } from '../../types';
import { StarfieldPerspective } from './useStarfield';

type StarfieldPreset = "default" | "warp" | "peaceful" | "minimal" | "nebula";
export interface StarfieldProps extends BaseCanvasProps {
    /** Number of stars (default: 200) */
    starCount?: number;
    /** Star color (default: "#ffffff") */
    starColor?: string;
    /** Background color (default: "#000010") */
    backgroundColor?: string;
    /** Movement speed (default: 0.5) */
    speed?: number;
    /** Enable star twinkling (default: true) */
    twinkle?: boolean;
    /** Enable shooting stars (default: true) */
    shootingStars?: boolean;
    /** Milliseconds between shooting stars (default: 3000) */
    shootingStarInterval?: number;
    /** "2D" flat starfield or "3D" warp tunnel (default: "2D") */
    perspective?: StarfieldPerspective;
    /** Minimum star size in px (default: 0.3) */
    starSizeMin?: number;
    /** Maximum star size in px (default: 2.8) */
    starSizeMax?: number;
    /** Minimum star opacity (default: 0.3) */
    starOpacityMin?: number;
    /** Maximum star opacity (default: 1.0) */
    starOpacityMax?: number;
    /** Twinkle animation base speed (default: 0.03) */
    twinkleSpeed?: number;
    /** Shooting star trail length in px (default: 80) */
    shootingStarLength?: number;
    /** Shooting star lifetime in frames (default: 60) */
    shootingStarLifetime?: number;
    /** Named preset: "default" | "warp" | "peaceful" | "minimal" | "nebula" */
    preset?: StarfieldPreset | string;
}
export declare const Starfield: import('react').ForwardRefExoticComponent<StarfieldProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
