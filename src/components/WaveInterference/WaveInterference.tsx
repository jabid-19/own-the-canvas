import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useWaveInterference } from "./useWaveInterference";

type WaveInterferencePreset = "default" | "ripple" | "plasma" | "neon" | "cosmic" | "monochrome";

interface WaveInterferencePresetValues {
  colorHigh?: string;
  colorLow?: string;
  wavelength?: number;
  decay?: number;
  backgroundColor?: string;
}

export const PRESETS: Record<WaveInterferencePreset, WaveInterferencePresetValues> = {
  default: { colorHigh: "#88ccff", colorLow: "#001133" },
  monochrome: {},
  ripple: { colorHigh: "#88ccff", colorLow: "#001133", wavelength: 100 },
  plasma: { colorHigh: "#ff4400", colorLow: "#000033", wavelength: 60, decay: 0.001 },
  neon: { colorHigh: "#00ffff", colorLow: "#000000", wavelength: 70 },
  cosmic: { colorHigh: "#cc88ff", colorLow: "#050005", decay: 0.002 },
};

export interface WaveInterferenceProps extends BaseCanvasProps {
  /** Maximum number of wave sources (default: 6) */
  maxSources?: number;
  /** Wave wavelength in pixels (default: 80) */
  wavelength?: number;
  /** Wave propagation speed (default: 1) */
  speed?: number;
  /** Constructive interference color (default: "#88ccff") */
  colorHigh?: string;
  /** Destructive interference color (default: "#001133") */
  colorLow?: string;
  /** Canvas background color (default: "#111111") */
  backgroundColor?: string;
  /** Show source markers (default: true) */
  showSources?: boolean;
  /** Render resolution fraction — lower = faster (default: 0.4) */
  resolution?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Click to add or remove a source, drag to move one; the hovering cursor stirs ripples (default: true) */
  interactive?: boolean;
  /** Amplitude decay with distance (default: 0.003) */
  decay?: number;
  /** Named preset */
  preset?: WaveInterferencePreset | string;
}

export const WaveInterference = forwardRef<HTMLCanvasElement, WaveInterferenceProps>(
  (props, ref) => {
    const {
      preset,
      maxSources,
      wavelength,
      speed,
      colorHigh,
      colorLow,
      backgroundColor,
      showSources,
      resolution,
      animated,
      decay,
      interactive,
      width,
      height,
      className,
      style,
    } = props;

    const p = PRESETS[(preset ?? "default") as WaveInterferencePreset] || {};
    const { canvasRef, canvas } = useWaveInterference({
      maxSources:      maxSources      ?? 6,
      wavelength:      wavelength      ?? p.wavelength     ?? 80,
      speed:           speed           ?? 1,
      colorHigh:       colorHigh       ?? p.colorHigh      ?? "#ffffff",
      colorLow:        colorLow        ?? p.colorLow       ?? "#111111",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      showSources:     showSources     ?? false,
      resolution:      resolution      ?? 0.4,
      animated:        animated        ?? true,
      decay:           decay           ?? p.decay          ?? 0.003,
      interactive:     interactive     ?? true,
    });

    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    return (
      <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={{ cursor: "crosshair", ...style }} />
    );
  }
);

WaveInterference.displayName = "WaveInterference";
