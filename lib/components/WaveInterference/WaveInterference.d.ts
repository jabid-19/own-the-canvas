import { BaseCanvasProps } from '../../types';

type WaveInterferencePreset = "default" | "ripple" | "plasma" | "neon" | "cosmic";
interface WaveInterferencePresetValues {
    colorHigh?: string;
    colorLow?: string;
    wavelength?: number;
    decay?: number;
    backgroundColor?: string;
}
export declare const PRESETS: Record<WaveInterferencePreset, WaveInterferencePresetValues>;
export interface WaveInterferenceProps extends BaseCanvasProps {
    /** Maximum number of wave sources (default: 6) */
    maxSources?: number;
    /** Wave wavelength in pixels (default: 80) */
    wavelength?: number;
    /** Wave propagation speed (default: 1) */
    speed?: number;
    /** Constructive interference color (default: "#ffffff") */
    colorHigh?: string;
    /** Destructive interference color (default: "#111111") */
    colorLow?: string;
    /** Canvas background color (default: "#111111") */
    backgroundColor?: string;
    /** Show source markers (default: true) */
    showSources?: boolean;
    /** Render resolution fraction — lower = faster (default: 0.4) */
    resolution?: number;
    /** Enable animation (default: true) */
    animated?: boolean;
    /** Amplitude decay with distance (default: 0.003) */
    decay?: number;
    /** Named preset */
    preset?: WaveInterferencePreset | string;
}
export declare const WaveInterference: import('react').ForwardRefExoticComponent<WaveInterferenceProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
