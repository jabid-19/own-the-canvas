import { BaseCanvasProps } from "../../types";
type LSystemPreset = "default" | "fern" | "dragon" | "sierpinski" | "bush" | "snowflake";
export interface LSystemProps extends BaseCanvasProps {
    /** Starting L-system axiom string */
    axiom?: string;
    /** Production rules map — e.g. { F: "F+F-F" } */
    rules?: Record<string, string>;
    /** Number of rewriting iterations (default: 4) */
    iterations?: number;
    /** Turtle turning angle in degrees (default: 25) */
    angle?: number;
    /** Stroke line width (default: 1) */
    lineWidth?: number;
    /** Branch stroke color (default: "#ffffff") */
    color?: string;
    /** Canvas background color (default: "#111111") */
    backgroundColor?: string;
    /** Segments drawn per animation frame (default: 5) */
    speed?: number;
    /** Restart animation after full draw (default: true) */
    autoReset?: boolean;
    /** Background fade opacity between cycles — 0 = hard clear (default: 0) */
    trailFade?: number;
    /** Enable glow shadow on branches (default: false) */
    glowEffect?: boolean;
    /** Shadow blur radius when glowEffect is enabled (default: 8) */
    glowBlur?: number;
    /** Named preset: "default" | "fern" | "dragon" | "sierpinski" | "bush" | "snowflake" */
    preset?: LSystemPreset | string;
}
export declare const LSystem: import("react").ForwardRefExoticComponent<LSystemProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
