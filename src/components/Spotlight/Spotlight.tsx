import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSpotlight } from "./useSpotlight";

type SpotlightPreset = "default" | "soft" | "dramatic" | "neon" | "ellipse";

interface SpotlightPresetValues {
  radius?: number;
  color?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  edgeSoftness?: number;
  followSpeed?: number;
  glowColor?: string;
  glowSize?: number;
  showGlow?: boolean;
  shape?: "circle" | "ellipse";
  ellipseRatio?: number;
}

export const PRESETS: Record<SpotlightPreset, SpotlightPresetValues> = {
  default: {
    radius: 120,
    overlayColor: "#000000",
    overlayOpacity: 0.75,
    edgeSoftness: 0.4,
    followSpeed: 0.1,
    showGlow: true,
    glowColor: "#6b7280",
    glowSize: 30,
  },
  soft: {
    radius: 160,
    overlayOpacity: 0.6,
    edgeSoftness: 0.8,
    followSpeed: 0.06,
    showGlow: false,
  },
  dramatic: {
    radius: 90,
    overlayOpacity: 0.92,
    edgeSoftness: 0.15,
    followSpeed: 0.15,
    showGlow: true,
    glowColor: "#ffffff",
    glowSize: 20,
  },
  neon: {
    radius: 110,
    overlayColor: "#050010",
    overlayOpacity: 0.85,
    edgeSoftness: 0.3,
    followSpeed: 0.12,
    showGlow: true,
    glowColor: "#0891B2",
    glowSize: 50,
  },
  ellipse: {
    radius: 120,
    overlayOpacity: 0.78,
    edgeSoftness: 0.35,
    shape: "ellipse",
    ellipseRatio: 0.55,
    showGlow: true,
    glowColor: "#7C3AED",
    glowSize: 25,
  },
};

export interface SpotlightProps extends BaseCanvasProps {
  /** Spotlight radius in px (default: 120) */
  radius?: number;
  /** Spotlight inner tint color — drawn as a radial gradient inside the reveal area (default: "#ffffff", tint only visible for non-white colors) */
  color?: string;
  /** Overlay fill color (default: "#000000") */
  overlayColor?: string;
  /** Overlay opacity 0–1 (default: 0.75) */
  overlayOpacity?: number;
  /** Edge softness 0–1: 0=hard edge, 1=very soft (default: 0.4) */
  edgeSoftness?: number;
  /** Mouse follow lerp speed 0–1 (default: 0.1) */
  followSpeed?: number;
  /** Glow ring color (default: "#7C3AED") */
  glowColor?: string;
  /** Glow ring size in px (default: 30) */
  glowSize?: number;
  /** Show glow ring (default: true) */
  showGlow?: boolean;
  /** Shape of spotlight (default: "circle") */
  shape?: "circle" | "ellipse";
  /** Y/X ratio when shape is "ellipse" (default: 0.6) */
  ellipseRatio?: number;
  /** React to mouse movement (default: true) */
  interactive?: boolean;
  /** Default X position as fraction of width (default: 0.5) */
  defaultX?: number;
  /** Default Y position as fraction of height (default: 0.5) */
  defaultY?: number;
  /** Named preset */
  preset?: SpotlightPreset | string;
}

export const Spotlight = forwardRef<HTMLCanvasElement, SpotlightProps>(
  (props, ref) => {
    const {
      preset, radius, color, overlayColor, overlayOpacity,
      edgeSoftness, followSpeed, glowColor, glowSize, showGlow,
      shape, ellipseRatio, interactive, defaultX, defaultY,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as SpotlightPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSpotlight(internalRef, {
      radius: radius ?? p.radius ?? 120,
      color: color ?? p.color ?? "#ffffff",
      overlayColor: overlayColor ?? p.overlayColor ?? "#000000",
      overlayOpacity: overlayOpacity ?? p.overlayOpacity ?? 0.75,
      edgeSoftness: edgeSoftness ?? p.edgeSoftness ?? 0.4,
      followSpeed: followSpeed ?? p.followSpeed ?? 0.1,
      glowColor: glowColor ?? p.glowColor ?? "#6b7280",
      glowSize: glowSize ?? p.glowSize ?? 30,
      showGlow: showGlow ?? p.showGlow ?? true,
      shape: shape ?? p.shape ?? "circle",
      ellipseRatio: ellipseRatio ?? p.ellipseRatio ?? 0.6,
      interactive: interactive ?? true,
      defaultX: defaultX ?? 0.5,
      defaultY: defaultY ?? 0.5,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", position: "relative", ...style }}
      >
        <canvas
          ref={internalRef}
          aria-hidden="true"
          role="presentation"
          style={{ display: "block", position: "absolute", inset: 0, pointerEvents: "none" }}
        />
      </div>
    );
  }
);

Spotlight.displayName = "Spotlight";
