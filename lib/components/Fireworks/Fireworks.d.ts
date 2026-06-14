import { BaseCanvasProps } from '../../types';

type FireworksPreset = "default" | "celebration" | "subtle" | "neon" | "golden";
export interface FireworksProps extends BaseCanvasProps {
    /** Particle burst colors (default: multi-color) */
    colors?: string[];
    /** Particles per explosion (default: 80) */
    particleCount?: number;
    /** Gravity pull per frame (default: 0.08) */
    gravity?: number;
    /** Velocity friction 0–1 (default: 0.97) */
    friction?: number;
    /** Alpha fade per frame (default: 0.015) */
    fadeSpeed?: number;
    /** Particle base size in px (default: 2) */
    particleSize?: number;
    /** Trail history length (default: 6) */
    trailLength?: number;
    /** Explosion spread speed (default: 5) */
    spread?: number;
    /** Auto-launch shells (default: true) */
    autoLaunch?: boolean;
    /** Average ms between auto-launches (default: 1800) */
    autoInterval?: number;
    /** Glow on particles (default: true) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 8) */
    glowBlur?: number;
    /** Canvas background (default: "#050010") */
    backgroundColor?: string;
    /** Shell upward speed (default: 12) */
    shellSpeed?: number;
    /** Number of background stars (default: 0) */
    starCount?: number;
    /** Star color (default: "#ffffff") */
    starColor?: string;
    /** Enable glow on some stars (default: false) */
    glowingStars?: boolean;
    /** Glow blur radius for glowing stars (default: 8) */
    starGlowBlur?: number;
    /** Named preset */
    preset?: FireworksPreset | string;
}
export declare const Fireworks: import('react').ForwardRefExoticComponent<FireworksProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
