import { BaseCanvasProps } from '../../types';

type MagneticBlobPreset = "default" | "neon" | "plasma" | "ocean" | "lava" | "minimal";
export interface MagneticBlobProps extends BaseCanvasProps {
    /** Number of blobs (default: 5) */
    count?: number;
    /** Blob colors (default: purple/cyan/green) */
    colors?: string[];
    /** Base blob radius in px (default: 80) */
    radius?: number;
    /** Wander animation speed (default: 1) */
    speed?: number;
    /** Mouse attraction force (default: 0.08) */
    magnetStrength?: number;
    /** Mouse influence radius in px (default: 150) */
    magnetRadius?: number;
    /** Metaball merge threshold — higher = earlier merge (default: 1.8) */
    threshold?: number;
    /** Glow effect (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 20) */
    glowBlur?: number;
    /** Canvas background (default: "#050010") */
    backgroundColor?: string;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Blobs follow cursor (default: true) */
    followMouse?: boolean;
    /** Organic wander amplitude 0–1 (default: 0.4) */
    wanderStrength?: number;
    /** Named preset */
    preset?: MagneticBlobPreset | string;
}
export declare const MagneticBlob: import('react').ForwardRefExoticComponent<MagneticBlobProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
