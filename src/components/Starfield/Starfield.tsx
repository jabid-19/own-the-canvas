import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useStarfield, StarfieldPerspective } from "./useStarfield";

type StarfieldPreset = "default" | "warp" | "peaceful" | "minimal" | "nebula";

interface StarfieldPresetValues {
  starColor?: string;
  shootingStarColor?: string;
  backgroundColor?: string;
  perspective?: StarfieldPerspective;
  speed?: number;
  starCount?: number;
  twinkle?: boolean;
  shootingStars?: boolean;
  shootingStarInterval?: number;
}

const PRESETS: Record<StarfieldPreset, StarfieldPresetValues> = {
  default: {},
  warp: {
    perspective: "3D",
    speed: 2,
    starCount: 300,
    shootingStars: false,
    backgroundColor: "#000000",
  },
  peaceful: {
    perspective: "2D",
    speed: 0.2,
    twinkle: true,
    shootingStars: true,
    shootingStarInterval: 2000,
    backgroundColor: "#000818",
  },
  minimal: {
    starColor: "#94a3b8",
    backgroundColor: "#0f172a",
    twinkle: false,
    shootingStars: false,
    speed: 0.3,
  },
  nebula: {
    starColor: "#c4b5fd",
    backgroundColor: "#0d0118",
    twinkle: true,
    shootingStars: true,
    starCount: 250,
    speed: 0.4,
  },
};

export interface StarfieldProps extends BaseCanvasProps {
  /** Number of stars (default: 200) */
  starCount?: number;
  /** Star color (default: "#ffffff") */
  starColor?: string;
  /** Shooting star trail color (default: "#ffffff") */
  shootingStarColor?: string;
  /** Background color (default: "#000010") */
  backgroundColor?: string;
  /** Movement speed (default: 0.5) */
  speed?: number;
  /** Enable star twinkling (default: true) */
  twinkle?: boolean;
  /** Enable shooting stars (default: true) */
  shootingStars?: boolean;
  /** Milliseconds between shooting stars (default: 3000) */
  shootingStarInterval?: number;
  /** "2D" flat starfield or "3D" warp tunnel (default: "2D") */
  perspective?: StarfieldPerspective;
  /** Minimum star size in px (default: 0.3) */
  starSizeMin?: number;
  /** Maximum star size in px (default: 2.8) */
  starSizeMax?: number;
  /** Minimum star opacity (default: 0.3) */
  starOpacityMin?: number;
  /** Maximum star opacity (default: 1.0) */
  starOpacityMax?: number;
  /** Twinkle animation base speed (default: 0.03) */
  twinkleSpeed?: number;
  /** Shooting star trail length in px (default: 80) */
  shootingStarLength?: number;
  /** Shooting star lifetime in frames (default: 60) */
  shootingStarLifetime?: number;
  /** Named preset: "default" | "warp" | "peaceful" | "minimal" | "nebula" */
  preset?: StarfieldPreset | string;
}

export const Starfield = forwardRef<HTMLCanvasElement, StarfieldProps>(
  (props, ref) => {
    const {
      preset,
      starCount,
      starColor,
      shootingStarColor,
      backgroundColor,
      speed,
      twinkle,
      shootingStars,
      shootingStarInterval,
      perspective,
      starSizeMin,
      starSizeMax,
      starOpacityMin,
      starOpacityMax,
      twinkleSpeed,
      shootingStarLength,
      shootingStarLifetime,
      width,
      height,
      className,
      style,
    } = props;

    const p = (preset && PRESETS[preset as StarfieldPreset]) || {};

    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useStarfield(internalRef, {
      starCount: starCount ?? p.starCount ?? 200,
      starColor: starColor ?? p.starColor ?? "#ffffff",
      shootingStarColor: shootingStarColor ?? p.shootingStarColor ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      speed: speed ?? p.speed ?? 0.5,
      twinkle: twinkle ?? p.twinkle ?? true,
      shootingStars: shootingStars ?? p.shootingStars ?? true,
      shootingStarInterval: shootingStarInterval ?? p.shootingStarInterval ?? 3000,
      perspective: perspective ?? p.perspective ?? "2D",
      starSizeMin: starSizeMin ?? 0.3,
      starSizeMax: starSizeMax ?? 2.8,
      starOpacityMin: starOpacityMin ?? 0.3,
      starOpacityMax: starOpacityMax ?? 1.0,
      twinkleSpeed: twinkleSpeed ?? 0.03,
      shootingStarLength: shootingStarLength ?? 80,
      shootingStarLifetime: shootingStarLifetime ?? 60,
    });

    return (
      <div
        className={className}
        style={{ width: width ?? "100%", height: height ?? "100%", display: "block", overflow: "hidden", ...style }}
      >
        <canvas ref={internalRef} aria-hidden="true" role="presentation" style={{ display: "block" }} />
      </div>
    );
  }
);

Starfield.displayName = "Starfield";
