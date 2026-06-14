import { BaseCanvasProps } from '../../types';

type BlackHolePreset = "default" | "cosmic" | "inferno" | "neon" | "void";
export interface BlackHoleProps extends BaseCanvasProps {
    /** Accretion disk particle color (default: "#ffffff") */
    diskColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Number of disk particles (default: 300) */
    particleCount?: number;
    /** Gravitational pull strength (default: 200) */
    gravity?: number;
    /** Event horizon radius in px (default: 30) */
    eventHorizonRadius?: number;
    /** Accretion disk radial extent in px (default: 120) */
    diskWidth?: number;
    /** Polar jet stream color (default: "#6b7280") */
    jetColor?: string;
    /** Show polar particle jets (default: true) */
    showJets?: boolean;
    /** Background grid lensing distortion (default: true) */
    lensing?: boolean;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Cursor shifts the singularity position (default: true) */
    interactive?: boolean;
    /** Number of background stars (default: 0) */
    starCount?: number;
    /** Star color (default: "#ffffff") */
    starColor?: string;
    /** Enable glow on some stars (default: false) */
    glowingStars?: boolean;
    /** Glow blur radius for glowing stars (default: 8) */
    starGlowBlur?: number;
    /** Named preset */
    preset?: BlackHolePreset | string;
}
export declare const BlackHole: import('react').ForwardRefExoticComponent<BlackHoleProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
