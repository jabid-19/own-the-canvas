import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useOwl } from "./useOwl";

type OwlPreset = "default" | "tawny" | "snowy" | "barn" | "spirit" | "monochrome";

interface OwlPresetValues {
  featherColor?: string;
  bellyColor?: string;
  faceColor?: string;
  eyeColor?: string;
  beakColor?: string;
  branchColor?: string;
  backgroundColor?: string;
  earTufts?: boolean;
}

export const PRESETS: Record<OwlPreset, OwlPresetValues> = {
  default: { featherColor: "#6b4a33", bellyColor: "#d9bf9a", faceColor: "#c48a52", eyeColor: "#f2a516", beakColor: "#3a3330", branchColor: "#3b2a1e", backgroundColor: "#070a12", earTufts: true },
  monochrome: {},
  tawny:   { featherColor: "#7f5539", bellyColor: "#cfae86", faceColor: "#b08660", eyeColor: "#3a2416", beakColor: "#d8c7a8", branchColor: "#3b2a1e", backgroundColor: "#080a0c", earTufts: false },
  snowy:   { featherColor: "#e6e8ec", bellyColor: "#f7f8fa", faceColor: "#f3f4f6", eyeColor: "#f5c518", beakColor: "#2b2b2b", branchColor: "#4a4540", backgroundColor: "#0a1220", earTufts: false },
  barn:    { featherColor: "#c99a5b", bellyColor: "#f3e9da", faceColor: "#f7f1e8", eyeColor: "#1a120c", beakColor: "#e8d2b5", branchColor: "#3d2b1c", backgroundColor: "#0b0a10", earTufts: false },
  spirit:  { featherColor: "#3a3f6b", bellyColor: "#8a9ad8", faceColor: "#6c7bc4", eyeColor: "#7af0ff", beakColor: "#c9d2ff", branchColor: "#1b1d33", backgroundColor: "#03040c", earTufts: true },
};

export interface OwlProps extends BaseCanvasProps {
  /** Back, wing and head feathers (default: "#6b4a33") */
  featherColor?: string;
  /** Barred chest feathers (default: "#d9bf9a") */
  bellyColor?: string;
  /** Facial disc (default: "#c48a52") */
  faceColor?: string;
  /** Iris color (default: "#f2a516") */
  eyeColor?: string;
  /** Beak color; talons are a tint of it (default: "#3a3330") */
  beakColor?: string;
  /** Branch color (default: "#3b2a1e") */
  branchColor?: string;
  /** Night sky color; "transparent" drops the scene (default: "#070a12") */
  backgroundColor?: string;
  /** Feather "horns" on the head (default: true) */
  earTufts?: boolean;
  /** Owl scale (default: 1) */
  size?: number;
  /** The head turns to follow the cursor; off = it looks around by itself (default: true) */
  followCursor?: boolean;
  /** Average ms between blinks; 0 = never (default: 5000) */
  blinkInterval?: number;
  /** Fixed full-viewport, click-through layer over the page (default: false) */
  overlay?: boolean;
  /** Perch on top of an element marked `data-otc-solid` instead of a branch (default: false) */
  collide?: boolean;
  /** Overlay z-index (default: 10) */
  zIndex?: number;
  /** Named preset: "default" | "tawny" | "snowy" | "barn" | "spirit" | "monochrome" */
  preset?: OwlPreset | string;
}

export const Owl = forwardRef<HTMLCanvasElement, OwlProps>((props, ref) => {
  const {
    preset, featherColor, bellyColor, faceColor, eyeColor, beakColor, branchColor, backgroundColor,
    earTufts, size, followCursor, blinkInterval, overlay, collide, zIndex, width, height, className, style,
  } = props;
  const p = PRESETS[(preset ?? "default") as OwlPreset] || {};

  const { canvasRef, canvas } = useOwl({
    featherColor:    featherColor    ?? p.featherColor    ?? "#6b7280",
    bellyColor:      bellyColor      ?? p.bellyColor      ?? "#d1d5db",
    faceColor:       faceColor       ?? p.faceColor       ?? "#9ca3af",
    eyeColor:        eyeColor        ?? p.eyeColor        ?? "#e5e7eb",
    beakColor:       beakColor       ?? p.beakColor       ?? "#374151",
    branchColor:     branchColor     ?? p.branchColor     ?? "#4b5563",
    backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
    earTufts:        earTufts        ?? p.earTufts        ?? true,
    size:            size            ?? 1,
    followCursor:    followCursor    ?? true,
    blinkInterval:   blinkInterval   ?? 5000,
    overlay:         overlay         ?? false,
    collide:         collide         ?? false,
  });

  useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

  return (
    <RuntimeCanvas canvasRef={canvasRef} overlay={overlay} zIndex={zIndex} width={width} height={height} className={className} style={style} />
  );
});

Owl.displayName = "Owl";
