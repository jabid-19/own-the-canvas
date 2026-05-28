import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useDragonCursor } from "./useDragonCursor";

type DragonCursorPreset = "default" | "emerald" | "inferno" | "void" | "ice";

interface DragonCursorPresetValues {
  bodyColor?: string;
  eyeColor?: string;
  fireColor?: string;
  backgroundColor?: string;
  segmentSize?: number;
  wingSpan?: number;
}

const PRESETS: Record<DragonCursorPreset, DragonCursorPresetValues> = {
  default: {},
  emerald: {
    bodyColor: "#00ff88",
    eyeColor: "#00ff00",
    fireColor: "#00ffaa",
    backgroundColor: "#0a1a0f",
  },
  inferno: {
    bodyColor: "#ff6600",
    eyeColor: "#ff0000",
    fireColor: "#ffaa00",
    backgroundColor: "#1a0500",
  },
  void: {
    bodyColor: "#9900ff",
    eyeColor: "#cc00ff",
    fireColor: "#6600cc",
    backgroundColor: "#050010",
  },
  ice: {
    bodyColor: "#88ddff",
    eyeColor: "#ffffff",
    fireColor: "#aaeeff",
    backgroundColor: "#050a14",
  },
};

export interface DragonCursorProps extends BaseCanvasProps {
  /** Body joint count (default: 20) */
  segmentCount?: number;
  /** Head radius in px (default: 18) */
  segmentSize?: number;
  /** Dragon body color (default: "#ffffff") */
  bodyColor?: string;
  /** Eye pupil color (default: "#111111") */
  eyeColor?: string;
  /** Fire breath color (default: "#ffffff") */
  fireColor?: string;
  /** Canvas background (default: "transparent") */
  backgroundColor?: string;
  /** Cursor follow lerp speed 0–1 (default: 0.15) */
  followSpeed?: number;
  /** Wing length in px (default: 60) */
  wingSpan?: number;
  /** Show fire breath particles (default: true) */
  showFire?: boolean;
  /** Dragon follows cursor (default: true) */
  interactive?: boolean;
  /** Number of background stars (default: 0) */
  starCount?: number;
  /** Star color (default: "#ffffff") */
  starColor?: string;
  /** Enable glow on some stars (default: false) */
  glowingStars?: boolean;
  /** Glow blur radius for glowing stars (default: 8) */
  starGlowBlur?: number;
  /** Named preset */
  preset?: DragonCursorPreset | string;
}

export const DragonCursor = forwardRef<HTMLCanvasElement, DragonCursorProps>(
  (props, ref) => {
    const {
      preset, segmentCount, segmentSize, bodyColor, eyeColor, fireColor,
      backgroundColor, followSpeed, wingSpan, showFire, interactive,
      starCount, starColor, glowingStars, starGlowBlur,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as DragonCursorPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useDragonCursor(internalRef, {
      segmentCount:    segmentCount    ?? 20,
      segmentSize:     segmentSize     ?? p.segmentSize     ?? 18,
      bodyColor:       bodyColor       ?? p.bodyColor       ?? "#ffffff",
      eyeColor:        eyeColor        ?? p.eyeColor        ?? "#111111",
      fireColor:       fireColor       ?? p.fireColor       ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "transparent",
      followSpeed:     followSpeed      ?? 0.15,
      wingSpan:        wingSpan         ?? p.wingSpan        ?? 60,
      showFire:        showFire         ?? false,
      interactive:     interactive      ?? true,
      starCount:       starCount        ?? 60,
      starColor:       starColor        ?? "#ffffff",
      glowingStars:    glowingStars     ?? false,
      starGlowBlur:    starGlowBlur     ?? 8,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor:   "none",
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

DragonCursor.displayName = "DragonCursor";
