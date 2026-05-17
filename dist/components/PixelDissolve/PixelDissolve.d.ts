import { ReactNode } from 'react';
import { BaseCanvasProps } from '../../types';
import { DissolveDirection, DissolvePattern } from './usePixelDissolve';

export interface PixelDissolveProps extends BaseCanvasProps {
    /** Content to render beneath the dissolve overlay */
    children?: ReactNode;
    /** Pixel block size (default: 8) */
    pixelSize?: number;
    /** Dissolve animation speed 0–2 (default: 0.5) */
    speed?: number;
    /** "in" appear, "out" disappear, "both" out then in (default: "out") */
    direction?: DissolveDirection;
    /** Rising edge triggers the animation */
    trigger?: boolean;
    /** Pixel color (default: "#0a0a0a") */
    color?: string;
    /** Called when animation finishes */
    onComplete?: () => void;
    /** Speed multiplier for progress per frame (default: 0.01) */
    progressMultiplier?: number;
    /** Pixel reveal order: "random" | "center" | "edges" | "horizontal" (default: "random") */
    dissolvePattern?: DissolvePattern;
}
export declare const PixelDissolve: import('react').ForwardRefExoticComponent<PixelDissolveProps & import('react').RefAttributes<HTMLCanvasElement>>;
