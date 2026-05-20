import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useWatercolorBloom } from "./useWatercolorBloom";

type WatercolorBloomPreset = "default" | "sunset" | "ocean" | "spring" | "monochrome" | "neon";

interface WatercolorBloomPresetValues {
  colors?: string[];
  backgroundColor?: string;
  bloomRadius?: number;
  opacity?: number;
  wetEdge?: number;
  layerCount?: number;
  noiseAmount?: number;
}

const PRESETS: Record<WatercolorBloomPreset, WatercolorBloomPresetValues> = {
  default: {},
  sunset: {
    colors: ["#f97316", "#ec4899", "#8b5cf6", "#fbbf24"],
    backgroundColor: "#0a0005",
    bloomRadius: 100,
    opacity: 0.18,
    wetEdge: 0.5,
  },
  ocean: {
    colors: ["#0ea5e9", "#06b6d4", "#6366f1", "#38bdf8"],
    backgroundColor: "#020b18",
    bloomRadius: 90,
    opacity: 0.15,
    wetEdge: 0.35,
  },
  spring: {
    colors: ["#86efac", "#d9f99d", "#fde68a", "#fbcfe8", "#c4b5fd"],
    backgroundColor: "#0a0f05",
    bloomRadius: 80,
    opacity: 0.2,
    layerCount: 8,
  },
  monochrome: {
    colors: ["#ffffff", "#d1d5db", "#9ca3af"],
    backgroundColor: "#111111",
    bloomRadius: 100,
    opacity: 0.12,
    wetEdge: 0.6,
  },
  neon: {
    colors: ["#f0abfc", "#67e8f9", "#a5f3fc", "#c084fc"],
    backgroundColor: "#050010",
    bloomRadius: 110,
    opacity: 0.2,
    wetEdge: 0.7,
    noiseAmount: 0.6,
  },
};

export interface WatercolorBloomProps extends BaseCanvasProps {
  /** Bloom color palette (default: ["#ffffff","#6b7280","#9ca3af"]) */
  colors?: string[];
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Max bloom radius in px (default: 80) */
  bloomRadius?: number;
  /** Bloom expansion speed 0–2 (default: 0.5) */
  bloomSpeed?: number;
  /** Per-layer opacity 0–1 (default: 0.15) */
  opacity?: number;
  /** Wet-edge darkening strength 0–1 (default: 0.4) */
  wetEdge?: number;
  /** Concentric layers per bloom (default: 6) */
  layerCount?: number;
  /** Edge noise/organic distortion 0–1 (default: 0.5) */
  noiseAmount?: number;
  /** Bloom fade rate per frame (default: 0.001) */
  fadeSpeed?: number;
  /** Click to spawn blooms (default: true) */
  interactive?: boolean;
  /** Auto-spawn blooms at intervals (default: true) */
  autoBloom?: boolean;
  /** Ms between auto blooms (default: 1500) */
  autoBloomInterval?: number;
  /** Render resolution fraction (default: 0.5) */
  resolution?: number;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Max concurrent blooms (default: 12) */
  maxBlooms?: number;
  preset?: WatercolorBloomPreset | string;
}

export const WatercolorBloom = forwardRef<HTMLCanvasElement, WatercolorBloomProps>(
  (props, ref) => {
    const {
      preset, colors, backgroundColor, bloomRadius, bloomSpeed, opacity, wetEdge,
      layerCount, noiseAmount, fadeSpeed, interactive, autoBloom, autoBloomInterval,
      resolution, animated, maxBlooms, width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as WatercolorBloomPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useWatercolorBloom(internalRef, {
      colors:            colors            ?? p.colors            ?? ["#ffffff", "#6b7280", "#9ca3af"],
      backgroundColor:   backgroundColor   ?? p.backgroundColor   ?? "#111111",
      bloomRadius:       bloomRadius       ?? p.bloomRadius       ?? 80,
      bloomSpeed:        bloomSpeed        ?? 0.5,
      opacity:           opacity           ?? p.opacity           ?? 0.15,
      wetEdge:           wetEdge           ?? p.wetEdge           ?? 0.4,
      layerCount:        layerCount        ?? p.layerCount        ?? 6,
      noiseAmount:       noiseAmount       ?? p.noiseAmount       ?? 0.5,
      fadeSpeed:         fadeSpeed         ?? 0.001,
      interactive:       interactive       ?? true,
      autoBloom:         autoBloom         ?? true,
      autoBloomInterval: autoBloomInterval ?? 1500,
      resolution:        resolution        ?? 0.5,
      animated:          animated          ?? true,
      maxBlooms:         maxBlooms         ?? 12,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "crosshair" : "default",
          ...style,
        }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block" }}
        />
      </div>
    );
  }
);

WatercolorBloom.displayName = "WatercolorBloom";
