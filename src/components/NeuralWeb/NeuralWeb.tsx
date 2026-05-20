import { forwardRef, useRef, useImperativeHandle } from "react";
import { BaseCanvasProps } from "../../types";
import { useNeuralWeb } from "./useNeuralWeb";

type NeuralWebPreset = "default" | "neon" | "brain" | "minimal" | "plasma" | "circuit";

interface NeuralWebPresetValues {
  nodeColor?: string;
  edgeColor?: string;
  signalColor?: string;
  backgroundColor?: string;
  connectionRadius?: number;
  nodeRadius?: number;
  pulseInterval?: number;
  pulseDecay?: number;
  glowEffect?: boolean;
  glowBlur?: number;
  wanderSpeed?: number;
}

const PRESETS: Record<NeuralWebPreset, NeuralWebPresetValues> = {
  default: {},
  neon: {
    nodeColor: "#00ffcc",
    edgeColor: "#00ffcc",
    signalColor: "#ffffff",
    backgroundColor: "#000000",
    glowEffect: true,
    glowBlur: 20,
    pulseInterval: 1500,
    pulseDecay: 0.9,
  },
  brain: {
    nodeColor: "#f472b6",
    edgeColor: "#ec4899",
    signalColor: "#fbbf24",
    backgroundColor: "#0f0005",
    connectionRadius: 130,
    glowEffect: true,
    glowBlur: 18,
    pulseDecay: 0.88,
    wanderSpeed: 0.4,
  },
  minimal: {
    nodeColor: "#6b7280",
    edgeColor: "#374151",
    signalColor: "#9ca3af",
    backgroundColor: "#111111",
    glowEffect: false,
    pulseInterval: 3000,
    nodeRadius: 3,
  },
  plasma: {
    nodeColor: "#c084fc",
    edgeColor: "#7c3aed",
    signalColor: "#f0abfc",
    backgroundColor: "#050010",
    connectionRadius: 170,
    glowEffect: true,
    glowBlur: 25,
    pulseDecay: 0.92,
    wanderSpeed: 0.2,
  },
  circuit: {
    nodeColor: "#22c55e",
    edgeColor: "#166534",
    signalColor: "#86efac",
    backgroundColor: "#020a02",
    connectionRadius: 100,
    nodeRadius: 3,
    glowEffect: true,
    glowBlur: 12,
    pulseInterval: 1000,
    pulseDecay: 0.8,
    wanderSpeed: 0.1,
  },
};

export interface NeuralWebProps extends BaseCanvasProps {
  /** Number of network nodes (default: 40) */
  nodeCount?: number;
  /** Resting node color (default: "#ffffff") */
  nodeColor?: string;
  /** Edge line color (default: "#6b7280") */
  edgeColor?: string;
  /** Traveling signal color (default: "#ffffff") */
  signalColor?: string;
  /** Canvas background (default: "#111111") */
  backgroundColor?: string;
  /** Max px distance to draw edges (default: 150) */
  connectionRadius?: number;
  /** Node circle radius in px (default: 4) */
  nodeRadius?: number;
  /** Edge stroke width (default: 1) */
  lineWidth?: number;
  /** Signal travel speed multiplier (default: 1) */
  speed?: number;
  /** Ms between auto-pulses (default: 2000) */
  pulseInterval?: number;
  /** Signal strength multiplier per hop (default: 0.85) */
  pulseDecay?: number;
  /** Glow on active nodes/signals (default: true) */
  glowEffect?: boolean;
  /** Shadow blur for glow (default: 15) */
  glowBlur?: number;
  /** Hover to highlight; click to fire signal (default: true) */
  interactive?: boolean;
  /** Enable animation (default: true) */
  animated?: boolean;
  /** Nodes drift slowly (default: true) */
  wander?: boolean;
  /** Node drift speed (default: 0.3) */
  wanderSpeed?: number;
  preset?: NeuralWebPreset | string;
}

export const NeuralWeb = forwardRef<HTMLCanvasElement, NeuralWebProps>(
  (props, ref) => {
    const {
      preset, nodeCount, nodeColor, edgeColor, signalColor, backgroundColor,
      connectionRadius, nodeRadius, lineWidth, speed, pulseInterval, pulseDecay,
      glowEffect, glowBlur, interactive, animated, wander, wanderSpeed,
      width, height, className, style,
    } = props;

    const p = (preset && PRESETS[preset as NeuralWebPreset]) || {};
    const internalRef = useRef<HTMLCanvasElement | null>(null);
    useImperativeHandle(ref, () => internalRef.current as HTMLCanvasElement);

    useNeuralWeb(internalRef, {
      nodeCount:        nodeCount        ?? 40,
      nodeColor:        nodeColor        ?? p.nodeColor        ?? "#ffffff",
      edgeColor:        edgeColor        ?? p.edgeColor        ?? "#6b7280",
      signalColor:      signalColor      ?? p.signalColor      ?? "#ffffff",
      backgroundColor:  backgroundColor  ?? p.backgroundColor  ?? "#111111",
      connectionRadius: connectionRadius ?? p.connectionRadius ?? 150,
      nodeRadius:       nodeRadius       ?? p.nodeRadius       ?? 4,
      lineWidth:        lineWidth        ?? 1,
      speed:            speed            ?? 1,
      pulseInterval:    pulseInterval    ?? p.pulseInterval    ?? 2000,
      pulseDecay:       pulseDecay       ?? p.pulseDecay       ?? 0.85,
      glowEffect:       glowEffect       ?? p.glowEffect       ?? true,
      glowBlur:         glowBlur         ?? p.glowBlur         ?? 15,
      interactive:      interactive      ?? true,
      animated:         animated         ?? true,
      wander:           wander           ?? true,
      wanderSpeed:      wanderSpeed      ?? p.wanderSpeed      ?? 0.3,
    });

    return (
      <div
        className={className}
        style={{
          width: width ?? "100%",
          height: height ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: (interactive ?? true) ? "pointer" : "default",
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

NeuralWeb.displayName = "NeuralWeb";
