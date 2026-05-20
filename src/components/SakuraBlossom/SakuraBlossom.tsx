import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSakuraBlossom } from "./useSakuraBlossom";

type SakuraBlossomPreset = "default" | "sakura" | "autumn" | "snow" | "neon";

interface SakuraBlossomPresetValues {
  petalColor?: string;
  backgroundColor?: string;
  windStrength?: number;
  gravity?: number;
  petalSize?: number;
}

const PRESETS: Record<SakuraBlossomPreset, SakuraBlossomPresetValues> = {
  default: {},
  sakura: {
    petalColor: "#ffb7c5",
    backgroundColor: "#1a0a10",
    windStrength: 1.0,
  },
  autumn: {
    petalColor: "#e06030",
    backgroundColor: "#0d0805",
    windStrength: 1.4,
    gravity: 0.09,
  },
  snow: {
    petalColor: "#ddeeff",
    backgroundColor: "#050a14",
    windStrength: 0.5,
    gravity: 0.03,
    petalSize: 5,
  },
  neon: {
    petalColor: "#ff00aa",
    backgroundColor: "#050005",
    windStrength: 0.9,
  },
};

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

export const SakuraBlossom = forwardRef<HTMLCanvasElement, SakuraBlossomProps>(
  (props, ref) => {
    const {
      preset, petalCount, petalColor, petalSize, backgroundColor,
      gravity, windStrength, windGusts, showAccumulation, maxAccumulation,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SakuraBlossomPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSakuraBlossom(internalRef, {
      petalCount:       petalCount       ?? 80,
      petalColor:       petalColor       ?? p.petalColor       ?? "#ffffff",
      petalSize:        petalSize        ?? p.petalSize        ?? 8,
      backgroundColor:  backgroundColor  ?? p.backgroundColor  ?? "#111111",
      gravity:          gravity          ?? p.gravity          ?? 0.06,
      windStrength:     windStrength     ?? p.windStrength     ?? 0.8,
      windGusts:        windGusts        ?? true,
      showAccumulation: showAccumulation ?? true,
      maxAccumulation:  maxAccumulation  ?? 40,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
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

SakuraBlossom.displayName = "SakuraBlossom";
