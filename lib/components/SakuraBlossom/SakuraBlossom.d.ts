import { BaseCanvasProps } from '../../types';

type SakuraBlossomPreset = "default" | "sakura" | "autumn" | "snow" | "neon";
export interface SakuraBlossomProps extends BaseCanvasProps {
    /** Number of petals (default: 80) */
    petalCount?: number;
    /** Petal color (default: "#ffffff") */
    petalColor?: string;
    /** Petal size in px (default: 8) */
    petalSize?: number;
    /** Canvas background (default: "#111111") */
    backgroundColor?: string;
    /** Downward gravity force (default: 0.06) */
    gravity?: number;
    /** Base horizontal wind strength (default: 0.8) */
    windStrength?: number;
    /** Random wind gusts (default: true) */
    windGusts?: boolean;
    /** Petals accumulate at bottom (default: true) */
    showAccumulation?: boolean;
    /** Max accumulation height in px (default: 40) */
    maxAccumulation?: number;
    /** Named preset */
    preset?: SakuraBlossomPreset | string;
}
export declare const SakuraBlossom: import('react').ForwardRefExoticComponent<SakuraBlossomProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
