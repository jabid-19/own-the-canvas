import { BaseCanvasProps } from "../../types";
type ReactionDiffusionPreset = "default" | "coral" | "spots" | "maze" | "waves" | "neon";
export interface ReactionDiffusionProps extends BaseCanvasProps {
    /** Feed rate f — controls pattern type (default: 0.055) */
    feedRate?: number;
    /** Kill rate k — controls pattern density (default: 0.062) */
    killRate?: number;
    /** Diffusion rate for U chemical — keep dU/dV ratio at 2 (default: 0.2) */
    diffusionU?: number;
    /** Diffusion rate for V chemical — keep dU/dV ratio at 2 (default: 0.1) */
    diffusionV?: number;
    /** Render resolution fraction — lower = faster (default: 0.5) */
    resolution?: number;
    /** Simulation steps per frame (default: 8) */
    speed?: number;
    /** Color at low V concentration (default: "#111111") */
    colorA?: string;
    /** Color at high V concentration (default: "#ffffff") */
    colorB?: string;
    /** Canvas background color (default: "#111111") */
    backgroundColor?: string;
    /** Mouse disturbs the field (default: true) */
    interactive?: boolean;
    /** Named preset */
    preset?: ReactionDiffusionPreset | string;
}
export declare const ReactionDiffusion: import("react").ForwardRefExoticComponent<ReactionDiffusionProps & import("react").RefAttributes<HTMLCanvasElement>>;
export {};
