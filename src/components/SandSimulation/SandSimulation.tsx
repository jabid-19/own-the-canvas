import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useSandSimulation, SandMaterial } from "./useSandSimulation";

type SandSimulationPreset = "default" | "desert" | "ocean" | "inferno" | "neon" | "monochrome";

interface SandSimulationPresetValues {
  sandColor?: string;
  waterColor?: string;
  fireColor?: string;
  wallColor?: string;
  backgroundColor?: string;
  material?: SandMaterial;
}

export const PRESETS: Record<SandSimulationPreset, SandSimulationPresetValues> = {
  default: { sandColor: "#c8a85a", waterColor: "#0088cc", fireColor: "#ff4400", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  monochrome: {},
  desert: { sandColor: "#c8a85a", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  ocean: { waterColor: "#0088cc", backgroundColor: "#001a2e", wallColor: "#0a3a5a", material: "water" },
  inferno: { fireColor: "#ff4400", backgroundColor: "#0a0000", wallColor: "#2a0000", material: "fire" },
  neon: { sandColor: "#00ffff", waterColor: "#ff00ff", fireColor: "#ffff00", wallColor: "#00ff88", backgroundColor: "#050505" },
};

export interface SandSimulationProps extends BaseCanvasProps {
  /** Cell size in pixels (default: 4) */
  cellSize?: number;
  /** Paint brush radius in cells (default: 3) */
  brushSize?: number;
  /** Active material to paint (default: "sand") */
  material?: SandMaterial;
  /** Sand cell color (default: "#c8a85a") */
  sandColor?: string;
  /** Water cell color (default: "#0088cc") */
  waterColor?: string;
  /** Fire cell color (default: "#ff4400") */
  fireColor?: string;
  /** Wall cell color (default: "#6b4c1a") */
  wallColor?: string;
  /** Empty cell / background color (default: "#1a1200") */
  backgroundColor?: string;
  /** Enable mouse painting (default: true) */
  interactive?: boolean;
  /** Simulation steps per frame: 2 = falls twice as fast, 0 = frozen, max 8 (default: 1) */
  gravity?: number;
  /** Pour sand on its own in drifting colour bands, draining when the pile gets high (default: true) */
  autoPour?: boolean;
  /** Named preset */
  preset?: SandSimulationPreset | string;
}

export const SandSimulation = forwardRef<HTMLCanvasElement, SandSimulationProps>(
  (props, ref) => {
    const {
      preset,
      cellSize,
      brushSize,
      material,
      sandColor,
      waterColor,
      fireColor,
      wallColor,
      backgroundColor,
      interactive,
      gravity,
      autoPour,
      width,
      height,
      className,
      style,
    } = props;

    const p = PRESETS[(preset ?? "default") as SandSimulationPreset] || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useSandSimulation(internalRef, {
      cellSize:        cellSize        ?? 4,
      brushSize:       brushSize       ?? 3,
      material:        material        ?? p.material       ?? "sand",
      sandColor:       sandColor       ?? p.sandColor      ?? "#ffffff",
      waterColor:      waterColor      ?? p.waterColor     ?? "#6b7280",
      fireColor:       fireColor       ?? p.fireColor      ?? "#ffffff",
      wallColor:       wallColor       ?? p.wallColor      ?? "#4b5563",
      backgroundColor: backgroundColor ?? p.backgroundColor ?? "#111111",
      interactive:     interactive     ?? true,
      gravity:         gravity         ?? 1,
      autoPour:        autoPour        ?? true,
    });

    return (
      <div
        className={className}
        style={{
          width:    width  ?? "100%",
          height:   height ?? "100%",
          display:  "block",
          overflow: "hidden",
          cursor: "crosshair",
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

SandSimulation.displayName = "SandSimulation";
