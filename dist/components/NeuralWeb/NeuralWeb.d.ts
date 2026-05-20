import { BaseCanvasProps } from '../../types';

type NeuralWebPreset = "default" | "neon" | "brain" | "minimal" | "plasma" | "circuit";
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
export declare const NeuralWeb: import('react').ForwardRefExoticComponent<NeuralWebProps & import('react').RefAttributes<HTMLCanvasElement>>;
export {};
