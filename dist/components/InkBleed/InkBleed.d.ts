import { BaseCanvasProps } from "../../types";
type InkBleedPreset = "default" | "midnight" | "sepia" | "toxic" | "neon" | "frost";
export interface InkBleedProps extends BaseCanvasProps {
    /** Primary ink color (default: "#ffffff") */
    inkColor?: string;
    /** Background paper color (default: "#111111") */
    paperColor?: string;
    /** Speed ink spreads outward 0–1 (default: 0.3) */
    diffusionRate?: number;
    /** Ink thickness — higher = slower bleed (default: 0.8) */
    viscosity?: number;
    /** How fast ink fades per frame (default: 0.002) */
    evaporationRate?: number;
    /** Drop radius on click in px (default: 8) */
    inkRadius?: number;
    /** Initial ink concentration 0–1 (default: 1) */
    inkStrength?: number;
    /** Click/drag to drop ink (default: true) */
    interactive?: boolean;
    /** Auto-drop ink at intervals (default: true) */
    autoInk?: boolean;
    /** Ms between auto drops (default: 2000) */
    autoInkInterval?: number;
    /** Render resolution fraction (default: 0.5) */
    resolution?: number;
    /** Glow on ink (default: false) */
    glowEffect?: boolean;
    /** Shadow blur for glow (default: 8) */
    glowBlur?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    preset?: InkBleedPreset | string;
}
export declare const InkBleed: import("react").ForwardRefExoticComponent<InkBleedProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
