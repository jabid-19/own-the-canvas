import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useFireEffect, FirePalette } from "./useFireEffect";

type FirePreset = "default" | "inferno" | "toxic" | "ice" | "plasma";

interface FirePresetValues {
  palette?: FirePalette;
  intensity?: number;
  windStrength?: number;
  cooling?: number;
  spread?: number;
  windDirection?: number;
}

const PRESETS: Record<FirePreset, FirePresetValues> = {
  default: { palette: "smoke" },
  inferno: {
    palette: "inferno",
    intensity: 0.95,
    windStrength: 0.2,
    windDirection: 1,
  },
  toxic: {
    palette: "toxic",
    intensity: 0.9,
    cooling: 0.2,
    spread: 0.8,
    windStrength: 0.1,
  },
  ice: {
    palette: "ice",
    intensity: 0.85,
    windStrength: 0.15,
    windDirection: -1,
    cooling: 0.35,
  },
  plasma: {
    palette: "plasma",
    intensity: 0.92,
    spread: 0.75,
    windStrength: 0.05,
  },
};

export interface FireEffectProps extends BaseCanvasProps {
  /** Color theme (default: "smoke") */
  palette?: FirePalette;
  /** Custom gradient colors — overrides palette when ≥2 colors provided (default: undefined) */
  customColors?: string[];
  /** Flame intensity 0–1 (default: 0.95) */
  intensity?: number;
  /** Wind horizontal strength -1 to 1 (default: 0.3) */
  windStrength?: number;
  /** Wind direction: 1 = right, -1 = left (default: 1) */
  windDirection?: number;
  /** Flame spread 0–1 (default: 0) */
  spread?: number;
  /** Cooling rate 0–1 — higher = shorter flames (default: 0.3) */
  cooling?: number;
  /** Bottom-row seed noise magnitude (default: 60) */
  noiseStrength?: number;
  /** Cooling amount scaling factor (default: 5) */
  coolingScale?: number;
  /** Fire buffer resolution relative to canvas — 0.5 = half size for perf (default: 1) */
  resolution?: number;
  /** Named preset: "default" | "inferno" | "toxic" | "ice" | "plasma" */
  preset?: FirePreset | string;
}

export const FireEffect = forwardRef<HTMLCanvasElement, FireEffectProps>(
  (props, ref) => {
    const {
      preset,
      palette,
      customColors,
      intensity,
      windStrength,
      windDirection,
      spread,
      cooling,
      noiseStrength,
      coolingScale,
      resolution,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as FirePreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useFireEffect(internalRef, {
      palette: palette ?? p.palette ?? "smoke",
      customColors,
      intensity: intensity ?? p.intensity ?? 0.95,
      windStrength: windStrength ?? p.windStrength ?? 0.3,
      windDirection: windDirection ?? p.windDirection ?? 1,
      spread: spread ?? p.spread ?? 0,
      cooling: cooling ?? p.cooling ?? 0.3,
      noiseStrength: noiseStrength ?? 60,
      coolingScale: coolingScale ?? 3,
      resolution: resolution ?? 1,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

FireEffect.displayName = "FireEffect";
