import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useHummingbird } from "./useHummingbird";
import { resolvePreset } from "../../utils/props";

type HummingbirdPreset = "default" | "ruby" | "violet" | "sunset" | "frost" | "monochrome";

interface HummingbirdPresetValues {
  bodyColor?: string;
  throatColor?: string;
  bellyColor?: string;
  flowerColor?: string;
  backgroundColor?: string;
}

export const PRESETS: Record<HummingbirdPreset, HummingbirdPresetValues> = {
  default: { bodyColor: "#2f9e6a", throatColor: "#ff2d6f", bellyColor: "#e9e4d4", flowerColor: "#e8433a", backgroundColor: "#0c1712" },
  monochrome: {},
  ruby:    { bodyColor: "#3e8f4f", throatColor: "#ff1f3d", bellyColor: "#f0ece2", flowerColor: "#ff7a2f", backgroundColor: "#0e140c" },
  violet:  { bodyColor: "#2a8f8a", throatColor: "#a55bff", bellyColor: "#e8eef0", flowerColor: "#ff5fa8", backgroundColor: "#0a0e18" },
  sunset:  { bodyColor: "#c0622b", throatColor: "#ffb21f", bellyColor: "#f6e2c8", flowerColor: "#d6336c", backgroundColor: "#1a0d10" },
  frost:   { bodyColor: "#5aa6c8", throatColor: "#dff6ff", bellyColor: "#f4f8fb", flowerColor: "#9db8ff", backgroundColor: "#07101a" },
};

export interface HummingbirdProps extends BaseCanvasProps {
  /** Iridescent back and head (default: "#2f9e6a") */
  bodyColor?: string;
  /** Gorget (throat patch) color; it flashes as the bird turns (default: "#ff2d6f") */
  throatColor?: string;
  /** Belly color (default: "#e9e4d4") */
  bellyColor?: string;
  /** Trumpet flower color (default: "#e8433a") */
  flowerColor?: string;
  /** Garden color; "transparent" drops the scene (default: "#0c1712") */
  backgroundColor?: string;
  /** Number of birds, 0–8 (default: 1) */
  birdCount?: number;
  /** Bird scale (default: 1) */
  size?: number;
  /** Dart speed multiplier (default: 1) */
  speed?: number;
  /** A slow cursor draws a bird over to look; a fast one scares it off (default: true) */
  interactive?: boolean;
  /** Draw the flowers (default: true) */
  showFlowers?: boolean;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Elements marked `data-otc-solid` become flowers; the hovered one is visited first (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "ruby" | "violet" | "sunset" | "frost" | "monochrome" */
  preset?: HummingbirdPreset | string;
}

export const Hummingbird = forwardRef<HTMLCanvasElement, HummingbirdProps>((props, ref) => {
  const {
    preset, bodyColor, throatColor, bellyColor, flowerColor, backgroundColor, birdCount, size, speed,
    interactive, showFlowers, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = resolvePreset("Hummingbird", PRESETS, props);

  const { canvasRef, canvas } = useHummingbird({
    bodyColor:       bodyColor       ?? p.bodyColor       ?? "#6b7280",
    throatColor:     throatColor     ?? p.throatColor     ?? "#e5e7eb",
    bellyColor:      bellyColor      ?? p.bellyColor      ?? "#d1d5db",
    flowerColor:     flowerColor     ?? p.flowerColor     ?? "#9ca3af",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    birdCount:       birdCount       ?? 1,
    size:            size            ?? 1,
    speed:           speed           ?? 1,
    interactive:     interactive     ?? true,
    showFlowers:     showFlowers     ?? true,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Hummingbird.displayName = "Hummingbird";
