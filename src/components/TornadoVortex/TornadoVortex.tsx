import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useTornadoVortex } from "./useTornadoVortex";

type TornadoVortexPreset = "default" | "storm" | "fire" | "neon" | "void";

interface TornadoVortexPresetValues {
  funnelColor?: string;
  debrisColor?: string;
  lightningColor?: string;
  backgroundColor?: string;
  rotationSpeed?: number;
  funnelHeight?: number;
}

const PRESETS: Record<TornadoVortexPreset, TornadoVortexPresetValues> = {
  default: {},
  storm: {
    funnelColor: "#c8d8e8",
    debrisColor: "#8898a8",
    lightningColor: "#ffffff",
    backgroundColor: "#0a1018",
    funnelHeight: 0.85,
  },
  fire: {
    funnelColor: "#ff6600",
    debrisColor: "#cc3300",
    lightningColor: "#ffaa00",
    backgroundColor: "#0d0200",
    rotationSpeed: 4,
  },
  neon: {
    funnelColor: "#00ffcc",
    debrisColor: "#ff00aa",
    lightningColor: "#ffffff",
    backgroundColor: "#000810",
    rotationSpeed: 5,
  },
  void: {
    funnelColor: "#8866ff",
    debrisColor: "#4433aa",
    lightningColor: "#cc88ff",
    backgroundColor: "#020008",
    rotationSpeed: 2,
  },
};

export interface TornadoVortexProps extends BaseCanvasProps {
  /** Number of funnel wall particles (default: 600) */
  particleCount?: number;
  /** Funnel wall particle color (default: "#ffffff") */
  funnelColor?: string;
  /** Flying debris color (default: "#6b7280") */
  debrisColor?: string;
  /** Internal lightning color (default: "#ffffff") */
  lightningColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Angular rotation speed (default: 3) */
  rotationSpeed?: number;
  /** Funnel height as fraction of canvas height (default: 0.8) */
  funnelHeight?: number;
  /** Inward vortex pull strength (default: 1) */
  vortexStrength?: number;
  /** Show internal lightning bolts (default: true) */
  showLightning?: boolean;
  /** Show ground dust cloud (default: true) */
  showGroundDust?: boolean;
  /** Cursor moves the tornado (default: true) */
  interactive?: boolean;
  /** Animation speed multiplier (default: 1) */
  speed?: number;
  /** Named preset */
  preset?: TornadoVortexPreset | string;
}

export const TornadoVortex = forwardRef<HTMLCanvasElement, TornadoVortexProps>(
  (props, ref) => {
    const {
      preset, particleCount, funnelColor, debrisColor, lightningColor,
      backgroundColor, rotationSpeed, funnelHeight, vortexStrength,
      showLightning, showGroundDust, interactive, speed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as TornadoVortexPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useTornadoVortex(internalRef, {
      particleCount:  particleCount  ?? 600,
      funnelColor:    funnelColor    ?? p.funnelColor    ?? "#ffffff",
      debrisColor:    debrisColor    ?? p.debrisColor    ?? "#6b7280",
      lightningColor: lightningColor ?? p.lightningColor ?? "#ffffff",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      rotationSpeed:  rotationSpeed  ?? p.rotationSpeed  ?? 3,
      funnelHeight:   funnelHeight   ?? p.funnelHeight   ?? 0.8,
      vortexStrength: vortexStrength ?? 1,
      showLightning:  showLightning  ?? true,
      showGroundDust: showGroundDust ?? true,
      interactive:    interactive    ?? true,
      speed:          speed          ?? 1,
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

TornadoVortex.displayName = "TornadoVortex";
