import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useBlackHole } from "./useBlackHole";

type BlackHolePreset = "default" | "cosmic" | "inferno" | "neon" | "void";

interface BlackHolePresetValues {
  diskColor?: string;
  backgroundColor?: string;
  jetColor?: string;
  particleCount?: number;
  diskWidth?: number;
  gravity?: number;
  eventHorizonRadius?: number;
}

const PRESETS: Record<BlackHolePreset, BlackHolePresetValues> = {
  default: {},
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
  /** Accretion disk particle color (default: "#ffffff") */
  diskColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Number of disk particles (default: 300) */
  particleCount?: number;
  /** Gravitational pull strength (default: 200) */
  gravity?: number;
  /** Event horizon radius in px (default: 30) */
  eventHorizonRadius?: number;
  /** Accretion disk radial extent in px (default: 120) */
  diskWidth?: number;
  /** Polar jet stream color (default: "#6b7280") */
  jetColor?: string;
  /** Show polar particle jets (default: true) */
  showJets?: boolean;
  /** Background grid lensing distortion (default: true) */
  lensing?: boolean;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Cursor shifts the singularity position (default: true) */
  interactive?: boolean;
  /** Named preset */
  preset?: BlackHolePreset | string;
}

export const BlackHole = forwardRef<HTMLCanvasElement, BlackHoleProps>(
  (props, ref) => {
    const {
      preset, diskColor, backgroundColor, particleCount, gravity,
      eventHorizonRadius, diskWidth, jetColor, showJets, lensing, speed, interactive,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as BlackHolePreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useBlackHole(internalRef, {
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
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
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

BlackHole.displayName = "BlackHole";
