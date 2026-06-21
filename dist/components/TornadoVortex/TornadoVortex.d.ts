import { BaseCanvasProps } from "../../types";
type TornadoVortexPreset = "default" | "storm" | "fire" | "neon" | "void";
interface TornadoVortexPresetValues {
    funnelColor?: string;
    debrisColor?: string;
    lightningColor?: string;
    backgroundColor?: string;
    rotationSpeed?: number;
    funnelHeight?: number;
}
export declare const PRESETS: Record<TornadoVortexPreset, TornadoVortexPresetValues>;
export interface TornadoVortexProps extends BaseCanvasProps {
    /** Number of funnel wall particles (default: 600) */
    particleCount?: number;
    /** Funnel wall particle color (default: "#ffffff") */
    funnelColor?: string;
    /** Flying debris color (default: "#6b7280") */
    debrisColor?: string;
    /** Internal lightning color (default: "#ffffff") */
    lightningColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Angular rotation speed (default: 3) */
    rotationSpeed?: number;
    /** Funnel height as fraction of canvas height (default: 0.8) */
    funnelHeight?: number;
    /** Inward vortex pull strength (default: 1) */
    vortexStrength?: number;
    /** Show internal lightning bolts (default: true) */
    showLightning?: boolean;
    /** Show ground dust cloud (default: true) */
    showGroundDust?: boolean;
    /** Cursor moves the tornado (default: true) */
    interactive?: boolean;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Named preset */
    preset?: TornadoVortexPreset | string;
}
export declare const TornadoVortex: import("react").ForwardRefExoticComponent<TornadoVortexProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
