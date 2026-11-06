import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useKoiPond } from "./useKoiPond";

type KoiPondPreset = "default" | "koi" | "night" | "lotus" | "neon" | "monochrome";

interface KoiPondPresetValues {
  fishColor?: string;
  scaleColor?: string;
  waterColor?: string;
  rippleColor?: string;
  lilyColor?: string;
  speed?: number;
}

const PRESETS: Record<KoiPondPreset, KoiPondPresetValues> = {
  default: { fishColor: "#ff6030", scaleColor: "#ffffff", waterColor: "#0a1520", rippleColor: "#60a8d0", lilyColor: "#50aa50" },
  monochrome: {},
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
  /** Primary fish body color (default: "#ff6030") */
  fishColor?: string;
  /** Patch color of the markings; every third koi swaps body and patch (default: "#ffffff") */
  scaleColor?: string;
  /** Water background color (default: "#0a1520") */
  waterColor?: string;
  /** Ripple ring color (default: "#60a8d0") */
  rippleColor?: string;
  /** Lily pad color (default: "#50aa50") */
  lilyColor?: string;
  /** Fish movement speed multiplier (default: 1) */
  speed?: number;
  /** Cursor leaves ripples; tap to drop food the koi swim up to eat (default: true) */
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

    const p = PRESETS[(preset ?? "default") as KoiPondPreset] || {};
    const { canvasRef, canvas } = useKoiPond({
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

    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    return (
      <RuntimeCanvas canvasRef={canvasRef} width={width} height={height} className={className} style={{ cursor: "crosshair", ...style }} />
    );
  }
);

KoiPond.displayName = "KoiPond";
