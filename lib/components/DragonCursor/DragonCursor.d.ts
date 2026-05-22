import { BaseCanvasProps } from '../../types';

type DragonCursorPreset = "default" | "emerald" | "inferno" | "void" | "ice";
export interface DragonCursorProps extends BaseCanvasProps {
    /** Body joint count (default: 20) */
    segmentCount?: number;
    /** Head radius in px (default: 18) */
    segmentSize?: number;
    /** Dragon body color (default: "#ffffff") */
    bodyColor?: string;
    /** Eye pupil color (default: "#111111") */
    eyeColor?: string;
    /** Fire breath color (default: "#ffffff") */
    fireColor?: string;
    /** Canvas background (default: "transparent") */
    backgroundColor?: string;
    /** Cursor follow lerp speed 0–1 (default: 0.15) */
    followSpeed?: number;
    /** Wing length in px (default: 60) */
    wingSpan?: number;
    /** Show fire breath particles (default: true) */
    showFire?: boolean;
    /** Dragon follows cursor (default: true) */
    interactive?: boolean;
    /** Named preset */
    preset?: DragonCursorPreset | string;
}
export declare const DragonCursor: import('react').ForwardRefExoticComponent<DragonCursorProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
