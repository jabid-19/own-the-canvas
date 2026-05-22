import React from "react";
/** Base props shared by every canvas component */
export interface BaseCanvasProps {
    /** Canvas width — number (px) or CSS string like "100%" */
    width?: number | string;
    /** Canvas height — number (px) or CSS string like "100%" */
    height?: number | string;
    /** Additional CSS class */
    className?: string;
    /** Inline styles applied to the wrapper div */
    style?: React.CSSProperties;
    /** Named preset — sets themed defaults; explicit props override preset values */
    preset?: string;
}
export interface CanvasSetupOptions {
    width?: number | string;
    height?: number | string;
    /** Provide a custom draw callback; if omitted the consumer drives the loop */
    onFrame?: (ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => void;
    /** Skip the built-in rAF loop (component manages its own) */
    noLoop?: boolean;
}
export interface CanvasSetupResult {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
}
