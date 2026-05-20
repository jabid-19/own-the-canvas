import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useKoiPond } from "./useKoiPond";

type KoiPondPreset = "default" | "koi" | "night" | "lotus" | "neon";

interface KoiPondPresetValues {
  fishColor?: string;
  scaleColor?: string;
  waterColor?: string;
  rippleColor?: string;
  lilyColor?: string;
  speed?: number;
}

const PRESETS: Record<KoiPondPreset, KoiPondPresetValues> = {
  default: {},
  koi: {
    fishColor: "#ff6030",
    scaleColor: "#ffffff",
    waterColor: "#0a1520",
    rippleColor: "#60a8d0",
    lilyColor: "#50aa50",
    speed: 1,
  },
  night: {
    fishColor: "#c0c0ff",
    scaleColor: "#8080ff",
    waterColor: "#040812",
    rippleColor: "#4050a0",
    lilyColor: "#304030",
  },
  lotus: {
    fishColor: "#ffb0c0",
    scaleColor: "#ffffff",
    waterColor: "#0a1218",
    rippleColor: "#90c0d0",
    lilyColor: "#ff80a0",
    speed: 0.7,
  },
  neon: {
    fishColor: "#00ffcc",
    scaleColor: "#ff00aa",
    waterColor: "#050010",
    rippleColor: "#00aaff",
    lilyColor: "#00ff44",
    speed: 1.2,
  },
};

export interface KoiPondProps extends BaseCanvasProps {
  /** Number of koi fish (default: 6) */
  fishCount?: number;
  /** Primary fish body color (default: "#ffffff") */
  fishColor?: string;
  /** Scale accent color (default: "#6b7280") */
  scaleColor?: string;
  /** Water background color (default: "#111111") */
  waterColor?: string;
  /** Ripple ring color (default: "#6b7280") */
  rippleColor?: string;
  /** Lily pad color (default: "#ffffff") */
  lilyColor?: string;
  /** Fish movement speed multiplier (default: 1) */
  speed?: number;
  /** Cursor causes ripples (default: true) */
  interactive?: boolean;
  /** Show lily pads (default: true) */
  showLilies?: boolean;
  /** Animated caustic light patterns (default: true) */
  caustics?: boolean;
  /** Named preset */
  preset?: KoiPondPreset | string;
}

export const KoiPond = forwardRef<HTMLCanvasElement, KoiPondProps>(
  (props, ref) => {
    const {
      preset, fishCount, fishColor, scaleColor, waterColor, rippleColor,
      lilyColor, speed, interactive, showLilies, caustics,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as KoiPondPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useKoiPond(internalRef, {
      fishCount:   fishCount   ?? 6,
      fishColor:   fishColor   ?? p.fishColor   ?? "#ffffff",
      scaleColor:  scaleColor  ?? p.scaleColor  ?? "#6b7280",
      waterColor:  waterColor  ?? p.waterColor  ?? "#111111",
      rippleColor: rippleColor ?? p.rippleColor ?? "#6b7280",
      lilyColor:   lilyColor   ?? p.lilyColor   ?? "#ffffff",
      speed:       speed       ?? p.speed       ?? 1,
      interactive: interactive ?? true,
      showLilies:  showLilies  ?? true,
      caustics:    caustics    ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor:   "crosshair",
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

KoiPond.displayName = "KoiPond";
