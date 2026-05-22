import { RefObject } from 'react';

export type VisualizerMode = "bars" | "wave" | "circular" | "mirror";
export interface UseAudioVisualizerOptions {
    audioSource: MediaStream | null;
    barCount: number;
    barColor: string;
    waveColor: string;
    mode: VisualizerMode;
    sensitivity: number;
    gapBetweenBars: number;
    rounded: boolean;
    gradient: boolean;
    gradientEndColor: string;
    backgroundColor: string;
    glowEffect: boolean;
    glowColor: string;
    glowBlur: number;
    fftSize: number;
    smoothingTimeConstant: number;
    circularRadiusRatio: number;
    idleAmplitude: number;
    idleAnimationSpeed: number;
}
export declare function useAudioVisualizer(canvasRef: RefObject<HTMLCanvasElement | null>, options: UseAudioVisualizerOptions): void;
