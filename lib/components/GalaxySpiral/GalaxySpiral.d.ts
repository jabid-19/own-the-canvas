import { BaseCanvasProps } from '../../types';

type GalaxySpiralPreset = "default" | "andromeda" | "neon" | "void" | "golden";
export interface GalaxySpiralProps extends BaseCanvasProps {
    /** Total star particle count (default: 3000) */
    starCount?: number;
    /** Number of spiral arms (default: 2) */
    armCount?: number;
    /** Arm winding tightness (default: 0.5) */
    armTightness?: number;
    /** Galactic core color (default: "#ffffff") */
    coreColor?: string;
    /** Outer disk star color (default: "#6b7280") */
    diskColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Rotation speed in radians/frame (default: 0.0003) */
    rotationSpeed?: number;
    /** Initial viewing tilt in radians (default: 0.3) */
    tiltX?: number;
    /** Cursor tilts viewing angle (default: true) */
    interactive?: boolean;
    /** Core radial glow overlay (default: true) */
    coreGlow?: boolean;
    /** Core glow shadow blur (default: 30) */
    glowBlur?: number;
    /** Named preset */
    preset?: GalaxySpiralPreset | string;
}
export declare const GalaxySpiral: import('react').ForwardRefExoticComponent<GalaxySpiralProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
