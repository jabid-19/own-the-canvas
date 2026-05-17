import { BaseCanvasProps } from '../../types';

type RipplePreset = "default" | "neon" | "minimal" | "sunset" | "cosmic";
export interface RippleEffectProps extends BaseCanvasProps {
    /** Ripple stroke color (default: "#00cfff") */
    color?: string;
    /** Maximum ripple radius (default: 150) */
    maxRadius?: number;
    /** Expansion speed (default: 2) */
    speed?: number;
    /** Stroke width (default: 1.5) */
    lineWidth?: number;
    /** Opacity decay rate — higher = faster fade (default: 0.8) */
    decay?: number;
    /** Allow multiple simultaneous ripples (default: true) */
    multiRipple?: boolean;
    /** Canvas background (default: "transparent") */
    backgroundColor?: string;
    /** Spawn ripple on click (default: true) */
    interactive?: boolean;
    /** Milliseconds between auto-ripples when not interactive (default: 1500) */
    autoInterval?: number;
    /** Radius growth multiplier per frame (default: 2) */
    radiusGrowthRate?: number;
    /** Opacity decay multiplier per frame (default: 0.02) */
    opacityDecayRate?: number;
    /** Auto-ripples spawn from center when true, random position when false (default: true) */
    autoCenter?: boolean;
    /** Named preset: "default" | "neon" | "minimal" | "sunset" | "cosmic" */
    preset?: RipplePreset | string;
}
export declare const RippleEffect: import('react').ForwardRefExoticComponent<RippleEffectProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
