import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useSakuraBlossom } from "./useSakuraBlossom";
import { resolvePreset } from "../../utils/props";

type SakuraBlossomPreset = "default" | "sakura" | "autumn" | "snow" | "neon" | "monochrome";

interface SakuraBlossomPresetValues {
  petalColor?: string;
  backgroundColor?: string;
  windStrength?: number;
  gravity?: number;
  petalSize?: number;
}

const PRESETS: Record<SakuraBlossomPreset, SakuraBlossomPresetValues> = {
  default: { petalColor: "#ffb7c5", backgroundColor: "#1a0a10" },
  monochrome: {},
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
  /** Petal color (default: "#ffb7c5") */
  petalColor?: string;
  /** Petal size in px (default: 8) */
  petalSize?: number;
  /** Canvas background (default: "#1a0a10") */
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
  /** Fixed full-viewport, click-through layer over the page; background is transparent (default: false) */
  overlay?: boolean;
  /** Petals land on elements marked `data-otc-solid` (default: false) */
  collide?: boolean;
  /** Bounce on solids: 0 = petals rest and slide off, >0 = bounce (default: 0) */
  restitution?: number;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
}

export const SakuraBlossom = forwardRef<HTMLCanvasElement, SakuraBlossomProps>(
  (props, ref) => {
    const {
      preset, petalCount, petalColor, petalSize, backgroundColor,
      gravity, windStrength, windGusts, showAccumulation, maxAccumulation,
      overlay, collide, restitution, zIndex,
      width, height, className, style,
    } = props;

    const p = resolvePreset("SakuraBlossom", PRESETS, props);

    const { canvasRef, canvas } = useSakuraBlossom({
      petalCount:       petalCount       ?? 80,
      petalColor:       petalColor       ?? p.petalColor       ?? "#ffffff",
      petalSize:        petalSize        ?? p.petalSize        ?? 8,
      backgroundColor:  backgroundColor  ?? p.backgroundColor  ?? "#111111",
      gravity:          gravity          ?? p.gravity          ?? 0.06,
      windStrength:     windStrength     ?? p.windStrength     ?? 0.8,
      windGusts:        windGusts        ?? true,
      showAccumulation: showAccumulation ?? true,
      maxAccumulation:  maxAccumulation  ?? 40,
      overlay:          overlay          ?? false,
      collide:          collide          ?? false,
      restitution:      restitution      ?? 0,
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
  }
);

SakuraBlossom.displayName = "SakuraBlossom";
