import { forwardRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { RuntimeCanvas } from "../../runtime/RuntimeCanvas";
import { useBlackHole } from "./useBlackHole";

type BlackHolePreset = "default" | "cosmic" | "inferno" | "neon" | "void" | "monochrome";

interface BlackHolePresetValues {
  diskColor?: string;
  backgroundColor?: string;
  jetColor?: string;
  particleCount?: number;
  diskWidth?: number;
  gravity?: number;
  eventHorizonRadius?: number;
}

export const PRESETS: Record<BlackHolePreset, BlackHolePresetValues> = {
  default: { diskColor: "#ff6600", backgroundColor: "#0d0200", jetColor: "#ff3300" },
  monochrome: {},
  cosmic: {
    diskColor: "#aaccff",
    backgroundColor: "#020510",
    jetColor: "#88aaff",
    diskWidth: 140,
  },
  inferno: {
    diskColor: "#ff6600",
    backgroundColor: "#0d0200",
    jetColor: "#ff3300",
    diskWidth: 100,
  },
  neon: {
    diskColor: "#00ffcc",
    backgroundColor: "#000510",
    jetColor: "#ff00aa",
    diskWidth: 120,
  },
  void: {
    diskColor: "#6b7280",
    backgroundColor: "#050505",
    jetColor: "#4b5563",
    particleCount: 200,
    diskWidth: 80,
  },
};

export interface BlackHoleProps extends BaseCanvasProps {
  /** Accretion disk particle color (default: "#ff6600") */
  diskColor?: string;
  /** Canvas background (default: "#0d0200") */
  backgroundColor?: string;
  /** Number of disk particles (default: 300) */
  particleCount?: number;
  /** Gravitational pull strength (default: 200) */
  gravity?: number;
  /** Event horizon radius in px (default: 30) */
  eventHorizonRadius?: number;
  /** Accretion disk radial extent in px (default: 120) */
  diskWidth?: number;
  /** Polar jet stream color (default: "#ff3300") */
  jetColor?: string;
  /** Show polar particle jets (default: true) */
  showJets?: boolean;
  /** Background grid lensing distortion (default: true) */
  lensing?: boolean;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Cursor shifts the singularity position (default: true) */
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
  preset?: BlackHolePreset | string;
}

export const BlackHole = forwardRef<HTMLCanvasElement, BlackHoleProps>(
  (props, ref) => {
    const {
      preset, diskColor, backgroundColor, particleCount, gravity,
      eventHorizonRadius, diskWidth, jetColor, showJets, lensing, speed, interactive,
      starCount, starColor, glowingStars, starGlowBlur,
      width, height, className, style,
    } = props;

    const p = PRESETS[(preset ?? "default") as BlackHolePreset] || {};

    const { canvasRef, canvas } = useBlackHole({
      diskColor:           diskColor           ?? p.diskColor           ?? "#ffffff",
      backgroundColor:     backgroundColor     ?? p.backgroundColor     ?? "#111111",
      particleCount:       particleCount       ?? p.particleCount       ?? 300,
      gravity:             gravity             ?? p.gravity             ?? 200,
      eventHorizonRadius:  eventHorizonRadius  ?? p.eventHorizonRadius  ?? 30,
      diskWidth:           diskWidth           ?? p.diskWidth           ?? 120,
      jetColor:            jetColor            ?? p.jetColor            ?? "#6b7280",
      showJets:            showJets            ?? true,
      lensing:             lensing             ?? true,
      speed:               speed               ?? 1,
      interactive:         interactive         ?? true,
      starCount:           starCount           ?? 100,
      starColor:           starColor           ?? "#ffffff",
      glowingStars:        glowingStars        ?? false,
      starGlowBlur:        starGlowBlur        ?? 8,
    });

    useImperativeHandle(ref, () => canvas as HTMLCanvasElement, [canvas]);

    return (
      <RuntimeCanvas
        canvasRef={canvasRef}
        width={width}
        height={height}
        className={className}
        style={style}
      />
    );
  }
);

BlackHole.displayName = "BlackHole";
