import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useAudioVisualizer, VisualizerMode } from "./useAudioVisualizer";

type AudioVisualizerPreset = "default" | "neon" | "minimal" | "fire" | "ocean";

interface AudioVisualizerPresetValues {
  barColor?: string;
  waveColor?: string;
  gradientEndColor?: string;
  backgroundColor?: string;
  glowEffect?: boolean;
  glowBlur?: number;
  gradient?: boolean;
  rounded?: boolean;
  mode?: VisualizerMode;
}

const PRESETS: Record<AudioVisualizerPreset, AudioVisualizerPresetValues> = {
  default: {},
  neon: {
    barColor: "#7C3AED",
    waveColor: "#7C3AED",
    gradientEndColor: "#e0b0ff",
    backgroundColor: "#050010",
    glowEffect: true,
    glowBlur: 20,
    gradient: true,
    rounded: true,
  },
  minimal: {
    gradient: false,
    rounded: false,
    glowEffect: false,
    barColor: "#4ade80",
    waveColor: "#4ade80",
    backgroundColor: "transparent",
    gradientEndColor: "#4ade80",
  },
  fire: {
    barColor: "#ff6b00",
    waveColor: "#ff6b00",
    gradientEndColor: "#ffff00",
    backgroundColor: "#0a0000",
    glowEffect: true,
    glowBlur: 15,
    mode: "bars",
  },
  ocean: {
    barColor: "#0891B2",
    waveColor: "#0891B2",
    gradientEndColor: "#67e8f9",
    backgroundColor: "#020f1a",
    glowEffect: true,
    glowBlur: 14,
    mode: "wave",
  },
};

export interface AudioVisualizerProps extends BaseCanvasProps {
  /** MediaStream from getUserMedia (default: null — shows idle animation) */
  audioSource?: MediaStream | null;
  /** Number of frequency bars (default: 64) */
  barCount?: number;
  /** Bar fill color (default: "#00cfff") */
  barColor?: string;
  /** Wave stroke color (default: "#00cfff") */
  waveColor?: string;
  /** Visualization mode (default: "bars") */
  mode?: VisualizerMode;
  /** Amplitude sensitivity multiplier (default: 1) */
  sensitivity?: number;
  /** Gap between bars in px (default: 2) */
  gapBetweenBars?: number;
  /** Rounded bar caps (default: true) */
  rounded?: boolean;
  /** Color gradient on bars/wave (default: true) */
  gradient?: boolean;
  /** Gradient top/end color (default: "#ffffff") */
  gradientEndColor?: string;
  /** Canvas background color (default: "transparent") */
  backgroundColor?: string;
  /** Enable glow effect (default: true) */
  glowEffect?: boolean;
  /** Glow color — defaults to barColor */
  glowColor?: string;
  /** Glow blur radius in px (default: 12) */
  glowBlur?: number;
  /** Web Audio FFT size — must be power of 2 (default: 2048) */
  fftSize?: number;
  /** Analyser smoothing time constant 0–1 (default: 0.8) */
  smoothingTimeConstant?: number;
  /** Circular mode inner radius as fraction of min(w,h) (default: 0.25) */
  circularRadiusRatio?: number;
  /** Idle animation wave amplitude in px (default: 5) */
  idleAmplitude?: number;
  /** Idle animation speed multiplier (default: 1) */
  idleAnimationSpeed?: number;
  /** Named preset: "default" | "neon" | "minimal" | "fire" | "ocean" */
  preset?: AudioVisualizerPreset | string;
}

export const AudioVisualizer = forwardRef<HTMLCanvasElement, AudioVisualizerProps>(
  (props, ref) => {
    const {
      preset,
      audioSource = null,
      barCount,
      barColor,
      waveColor,
      mode,
      sensitivity,
      gapBetweenBars,
      rounded,
      gradient,
      gradientEndColor,
      backgroundColor,
      glowEffect,
      glowColor,
      glowBlur,
      fftSize,
      smoothingTimeConstant,
      circularRadiusRatio,
      idleAmplitude,
      idleAnimationSpeed,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as AudioVisualizerPreset]) || {};

    const resolvedBarColor = barColor ?? p.barColor ?? "#ffffff";
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useAudioVisualizer(internalRef, {
      audioSource,
      barCount: barCount ?? 64,
      barColor: resolvedBarColor,
      waveColor: waveColor ?? p.waveColor ?? resolvedBarColor,
      mode: mode ?? p.mode ?? "bars",
      sensitivity: sensitivity ?? 1,
      gapBetweenBars: gapBetweenBars ?? 2,
      rounded: rounded ?? p.rounded ?? true,
      gradient: gradient ?? p.gradient ?? true,
      gradientEndColor: gradientEndColor ?? p.gradientEndColor ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      glowEffect: glowEffect ?? p.glowEffect ?? true,
      glowColor: glowColor ?? resolvedBarColor,
      glowBlur: glowBlur ?? p.glowBlur ?? 12,
      fftSize: fftSize ?? 2048,
      smoothingTimeConstant: smoothingTimeConstant ?? 0.8,
      circularRadiusRatio: circularRadiusRatio ?? 0.25,
      idleAmplitude: idleAmplitude ?? 5,
      idleAnimationSpeed: idleAnimationSpeed ?? 1,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          ...style,
        }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

AudioVisualizer.displayName = "AudioVisualizer";
