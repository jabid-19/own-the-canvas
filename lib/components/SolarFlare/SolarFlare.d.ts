import { BaseCanvasProps } from '../../types';

type SolarFlarePreset = "default" | "inferno" | "plasma" | "neon" | "white-dwarf";
interface SolarFlarePresetValues {
    sunColor?: string;
    coronaColor?: string;
    flareColor?: string;
    backgroundColor?: string;
    sunRadius?: number;
    glowBlur?: number;
}
export declare const PRESETS: Record<SolarFlarePreset, SolarFlarePresetValues>;
export interface SolarFlareProps extends BaseCanvasProps {
    /** Photosphere color (default: "#ffffff") */
    sunColor?: string;
    /** Corona glow color (default: "#6b7280") */
    coronaColor?: string;
    /** Eruption/flare color (default: "#ffffff") */
    flareColor?: string;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Sun radius as fraction of min(w,h)/2 (default: 0.35) */
    sunRadius?: number;
    /** Number of convection cells on surface (default: 20) */
    convectionCells?: number;
    /** Simultaneous active flares (default: 3) */
    flareCount?: number;
    /** Auto-spawn flares (default: true) */
    autoFlare?: boolean;
    /** Interval between auto-flares in ms (default: 3000) */
    autoFlareInterval?: number;
    /** Click to trigger flare at cursor angle (default: true) */
    interactive?: boolean;
    /** Iridescent glow (default: true) */
    glowEffect?: boolean;
    /** Glow blur radius in px (default: 40) */
    glowBlur?: number;
    /** Animation speed multiplier (default: 1) */
    speed?: number;
    /** Named preset */
    preset?: SolarFlarePreset | string;
}
export declare const SolarFlare: import('react').ForwardRefExoticComponent<SolarFlareProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
