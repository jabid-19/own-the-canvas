import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useKelpForest } from "./useKelpForest";

type KelpForestPreset = "default" | "pacific" | "tropical" | "midnight" | "golden" | "monochrome";

interface KelpForestPresetValues {
  kelpColor?: string;
  fishColor?: string;
  backgroundColor?: string;
  current?: number;
}

const PRESETS: Record<KelpForestPreset, KelpForestPresetValues> = {
  default: { kelpColor: "#8a7a2c", fishColor: "#e2e8f0", backgroundColor: "#052637" },
  monochrome: {},
  pacific:  { kelpColor: "#8a7a2c", fishColor: "#e2e8f0", backgroundColor: "#052637" },
  tropical: { kelpColor: "#2fa36b", fishColor: "#ffb36b", backgroundColor: "#04354a" },
  midnight: { kelpColor: "#2b5a6b", fishColor: "#9be7ff", backgroundColor: "#020a14", current: 0.7 },
  golden:   { kelpColor: "#b8902e", fishColor: "#fff1c1", backgroundColor: "#141006" },
};

export interface KelpForestProps extends BaseCanvasProps {
  /** Number of kelp stalks (default: 9) */
  kelpCount?: number;
  /** Number of fish (default: 16) */
  fishCount?: number;
  /** Kelp color; far stalks fade toward the background (default: "#8a7a2c") */
  kelpColor?: string;
  /** Fish and bubble color (default: "#e2e8f0") */
  fishColor?: string;
  /** Water color, ignored in overlay mode (default: "#052637") */
  backgroundColor?: string;
  /** Ocean current strength; negative flows left (default: 1) */
  current?: number;
  /** Rising bubbles (default: true) */
  bubbles?: boolean;
  /** Light rays from the surface (default: true) */
  lightRays?: boolean;
  /** Cursor pushes the water: kelp bends, fish dart (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: KelpForestPreset | string;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const KelpForest = forwardRef<HTMLCanvasElement, KelpForestProps>((props, ref) => {
  const {
    preset, kelpCount, fishCount, kelpColor, fishColor, backgroundColor, current, bubbles,
    lightRays, interactive, overlay, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as KelpForestPreset] || {};

  const { canvasRef, canvas } = useKelpForest({
    kelpCount:       Math.max(0, Math.round(kelpCount ?? 9)),
    fishCount:       Math.max(0, Math.round(fishCount ?? 16)),
    kelpColor:       kelpColor       ?? p.kelpColor       ?? "#6b7280",
    fishColor:       fishColor       ?? p.fishColor       ?? "#ffffff",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    current:         current         ?? p.current         ?? 1,
    bubbles:         bubbles         ?? true,
    lightRays:       lightRays       ?? true,
    interactive:     interactive     ?? true,
    overlay:         overlay         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas
      canvasRef={canvasRef}
      overlay={overlay}
      zIndex={zIndex}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
});

KelpForest.displayName = "KelpForest";
