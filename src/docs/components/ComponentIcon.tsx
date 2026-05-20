import React from "react";

interface ComponentIconProps {
  name: string;
  className?: string;
}

export function ComponentIcon({ name, className }: ComponentIconProps) {
  // Normalize the name to handle potential casing variations
  const key = name.trim();

  switch (key) {
    case "DragonCursor":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 19c4-4 1-8 6-10s4-5 8-5M15 15l2 5 2-4 4 1-8-8z" />
        </svg>
      );

    case "KoiPond":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 6c-2.5 1.5-4 4-3 7s3 3 5 2" />
          <path d="M14 18c2.5-1.5 4-4 3-7s-3-3-5-2" />
          <path d="M5 14l-2 2 1-3" />
          <path d="M19 10l2-2-1 3" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );

    case "MatrixRain":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 3v6M4 13v2M4 19v2M10 2v12M10 16v2M10 21v1M16 4v4M16 10v10M20 2v3M20 7v6M20 18v4" />
        </svg>
      );

    case "FluidSimulation":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12" />
          <path d="M12 6a6 6 0 0 1 6 6c0 3.3-2.7 6-6 6s-6-2.7-6-6" />
          <path d="M12 10a2 2 0 0 1 2 2" />
        </svg>
      );

    case "FlowField":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 5c4 2 8-2 12 0s8 4 8 0M2 10c4 2 8-2 12 0s8 4 8 0M2 15c4 2 8-2 12 0s8 4 8 0M2 20c4 2 8-2 12 0s8 4 8 0" />
        </svg>
      );

    case "Boids":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 18l3-6-5-1z" />
          <path d="M14 10l4-7-7-1z" />
          <path d="M18 19l2-5-4-1z" />
        </svg>
      );

    case "GlitchOverlay":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M6 21h12M12 17v4M5 7h8M11 11h8" />
        </svg>
      );

    case "PixelDissolve":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="4" height="4" rx="1" fill="currentColor" />
          <rect x="10" y="3" width="4" height="4" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="17" y="3" width="4" height="4" rx="1" fill="currentColor" opacity="0.6" />
          <rect x="3" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.9" />
          <rect x="10" y="10" width="4" height="4" rx="1" fill="currentColor" opacity="0.2" />
          <rect x="17" y="17" width="4" height="4" rx="1" fill="currentColor" opacity="0.4" />
          <rect x="10" y="17" width="4" height="4" rx="1" fill="currentColor" opacity="0.7" />
          <rect x="3" y="17" width="4" height="4" rx="1" fill="currentColor" opacity="0.5" />
        </svg>
      );

    case "Confetti":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 6l2-2 1 2-2 1zM18 5l2 2-1 2-2-1zM9 18l1-3 3 1-2 3z" />
          <circle cx="15" cy="14" r="1.5" fill="currentColor" />
          <circle cx="6" cy="14" r="1" fill="currentColor" />
          <path d="M12 4c1 2-1 3 0 5M10 11c-1 1 1 2 0 3" />
        </svg>
      );

    case "AudioVisualizer":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 10v4M6 6v12M10 3v18M14 8v8M18 5v14M22 11v2" />
        </svg>
      );

    case "Mandala":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5" />
        </svg>
      );

    case "Spotlight":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 18c0 2.2-2.7 4-6 4s-6-1.8-6-4 2.7-4 6-4 6 1.8 6 4z" />
          <path d="M2 3l7 11M22 3l-7 11M9 2h6l-3 4" />
        </svg>
      );

    case "Starfield":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM5 14l.7 1.3 1.3.7-1.3.7-.7 1.3-.7-1.3-1.3-.7 1.3-.7z" />
          <circle cx="19" cy="12" r="1" fill="currentColor" />
          <circle cx="18" cy="18" r="0.8" fill="currentColor" />
        </svg>
      );

    case "NoiseGradient":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 17c4-3 8-3 12 0s8 3 10 0" />
          <path d="M2 12c4-3 8-3 12 0s8 3 10 0" />
          <path d="M2 7c4-3 8-3 12 0s8 3 10 0" />
        </svg>
      );

    case "Shockwave":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="7" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="10" />
        </svg>
      );

    case "Fireworks":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <path d="M12 8V2M12 16v6M8 12H2M16 12h6M9 9L5 5M15 15l4 4M9 15l-4 4M15 9l4-4" />
        </svg>
      );

    case "Wormhole":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="12" cy="12" rx="10" ry="6" />
          <ellipse cx="12" cy="12" rx="7" ry="4.2" />
          <ellipse cx="12" cy="12" rx="4" ry="2.4" />
          <ellipse cx="12" cy="12" rx="1.5" ry="0.9" />
          <path d="M2 12h20M12 2v20" />
        </svg>
      );

    case "BubbleUniverse":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="7" cy="8" r="4" />
          <circle cx="16" cy="6" r="3" />
          <circle cx="18" cy="15" r="5" />
          <circle cx="9" cy="18" r="2.5" />
        </svg>
      );

    case "SakuraBlossom":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="10" r="1.5" fill="currentColor" />
          <path d="M12 10c0-2.5 1.5-4.5 4-4.5s4 2 4 4.5-2 4.5-4 4.5M12 10c-2.5 0-4.5 1.5-4.5 4s2 4 4.5 4 4.5-2 4.5-4M12 10c0 2.5-1.5 4.5-4 4.5s-4-2-4-4.5 2-4.5 4-4.5M12 10c2.5 0 4.5-1.5 4.5-4s-2-4-4.5-4-4.5 2-4.5 4" />
        </svg>
      );

    case "ClothSimulation":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 4h20M2 9h20M2 14h20M2 19h20M4 2v20M9 2v20M14 2v20M19 2v20" />
        </svg>
      );

    case "MagneticBlob":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 12c0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.2-.4 2.3-1 3.2c1.8 1.5 3 3.8 3 6.3c0 4.4-3.6 8-8 8s-8-3.6-8-8c0-2.5 1.2-4.8 3-6.3c-.6-.9-1-2-1-3.2z" />
        </svg>
      );

    case "GameOfLife":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="20" rx="2" strokeDasharray="2 2" />
          <rect x="11" y="6" width="4" height="4" rx="1" fill="currentColor" />
          <rect x="15" y="10" width="4" height="4" rx="1" fill="currentColor" />
          <rect x="7" y="14" width="4" height="4" rx="1" fill="currentColor" />
          <rect x="11" y="14" width="4" height="4" rx="1" fill="currentColor" />
          <rect x="15" y="14" width="4" height="4" rx="1" fill="currentColor" />
        </svg>
      );

    case "Rain":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10 2l-4 6M16 3l-4 6M7 11l-4 6M13 12l-4 6M19 10l-4 6" />
          <path d="M11 20a1.5 1.5 0 0 1 3 0" />
        </svg>
      );

    case "Lightning":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M13 2L4 14h8l-1 8 9-12h-8l2-8z" />
        </svg>
      );

    case "FireEffect":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3.5z" />
        </svg>
      );

    case "LiveChart":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="M3 15c4-4 8 2 12-4s4-8 6-8" />
          <circle cx="15" cy="11" r="1.5" fill="currentColor" />
        </svg>
      );

    case "ParticleField":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="6" cy="6" r="2" fill="currentColor" />
          <circle cx="18" cy="8" r="1.5" fill="currentColor" />
          <circle cx="10" cy="16" r="2.5" fill="currentColor" />
          <circle cx="20" cy="18" r="2" fill="currentColor" />
          <path d="M6 6l4 10M18 8l-8 8M18 8l2 10" />
        </svg>
      );

    case "ReactionDiffusion":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 12a9 9 0 0 1 15-6.7" />
          <path d="M6 18a9 9 0 0 1 12-12" />
          <path d="M9 15a4 4 0 0 1 6-3.4" />
        </svg>
      );

    case "AuroraBorealis":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 8c4-3 8 3 12 0s8-3 10 0" />
          <path d="M2 13c4-3 8 3 12 0s8-3 10 0" />
          <path d="M2 18c4-3 8 3 12 0s8-3 10 0" />
        </svg>
      );

    case "Spirograph":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2C8 6 4 10 2 12c2 2 6 6 10 10c4-4 8-8 10-10c-2-2-6-6-10-10z M12 6C9 9 6 12 5 12c1 0 4 3 7 6c3-3 6-6 7-6c-1 0-4-3-7-6z" />
        </svg>
      );

    case "SandSimulation":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 20h20M4 17h14M7 14h8M10 11h2M12 3v4" />
          <circle cx="12" cy="2" r="0.8" fill="currentColor" />
          <circle cx="11" cy="5" r="0.8" fill="currentColor" />
        </svg>
      );

    case "WaveInterference":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="8" cy="12" r="2" />
          <circle cx="8" cy="12" r="5" />
          <circle cx="8" cy="12" r="8" />
          <circle cx="16" cy="12" r="2" />
          <circle cx="16" cy="12" r="5" />
          <circle cx="16" cy="12" r="8" />
        </svg>
      );

    case "DiffusionAggregation":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 12l-4-4M12 12l4-4M12 12l-4 4M12 12l4 4M8 8l-4 1M8 8l1-4M16 8l4 1M16 8l-1-4M8 16l-4-1M8 16l1 4M16 16l4-1M16 16l-1 4" />
        </svg>
      );

    case "Lissajous":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 6C11 12 6 18 2 12s5-12 10-6c5 6 10 12 14 6s-5-12-10-6z" />
        </svg>
      );

    case "LSystem":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22V14M12 14l-4-4M12 14l4-4M8 10l-2-4M8 10l3-3M16 10l-3-3M16 10l2-4" />
        </svg>
      );

    case "Kaleidoscope":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2L2 22h20L12 2zM12 2v20M2 22l15-9M22 22L7 13" />
        </svg>
      );

    case "VoronoiCells":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 7l6-3 6 4 8-2M8 4v8M14 8l-4 8M20 6v9M2 16l8-4M10 16h12" />
        </svg>
      );

    case "SlimeMold":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 20c2-3 5-3 6-5s-1-4 2-6c3 2 5-1 6-4M10 15c1 1 3 0 4 2M8 9c-1-2-4-2-5-4M14 11c1-1 3-1 4 1" />
        </svg>
      );

    case "InkBleed":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3c3 0 5 1 7 3s2 4 1 6c-1 3 0 5-2 7s-5 2-7 1c-3-1-5-1-6-3s-1-5 1-7s3-4 6-4z" />
        </svg>
      );

    case "WatercolorBloom":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 4c4 0 7 2 8 5s0 6-3 8s-6 1-8-1s-2-6 1-9s1-3 2-3z" />
          <path d="M12 6c3 0 5 1.5 6 4s0 4.5-2.5 6s-4.5.5-6-.5s-1.5-4.5.5-7s1-2.5 2-2.5z" />
        </svg>
      );

    case "PendulaWave":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 4c4 4 8-4 12 0s8 4 8 0M2 9c4 4 8-4 12 0s8 4 8 0M2 14c4 4 8-4 12 0s8 4 8 0M2 19c4 4 8-4 12 0s8 4 8 0" />
        </svg>
      );

    case "CrystalGrowth":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5M12 6l2 2M12 6l-2 2M12 18l2-2M12 18l-2-2M6 12l2 2M6 12l2-2M18 12l-2 2M18 12l-2-2" />
        </svg>
      );

    case "NeuralWeb":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="5" cy="5" r="1.5" fill="currentColor" />
          <circle cx="19" cy="5" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          <circle cx="5" cy="19" r="1.5" fill="currentColor" />
          <circle cx="19" cy="19" r="1.5" fill="currentColor" />
          <path d="M5 5l7 7M19 5l-7 7M5 19l7-7M19 19l-7-7" />
        </svg>
      );

    case "ParticleText":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="4" r="1" fill="currentColor" />
          <circle cx="10" cy="8" r="1" fill="currentColor" />
          <circle cx="14" cy="8" r="1" fill="currentColor" />
          <circle cx="8" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="16" cy="12" r="1" fill="currentColor" />
          <circle cx="6" cy="16" r="1" fill="currentColor" />
          <circle cx="18" cy="16" r="1" fill="currentColor" />
          <circle cx="4" cy="20" r="1" fill="currentColor" />
          <circle cx="20" cy="20" r="1" fill="currentColor" />
        </svg>
      );

    case "Metaballs":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M8 7c2 0 4 1 5 3c1-2 3-3 5-3c3 0 5 2 5 5c0 5-5 7-10 10C8 19 3 17 3 12c0-3 2-5 5-5z" />
        </svg>
      );

    case "AntColony":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 20c4-4 8-2 12-6s4-8 6-12" strokeDasharray="3 3" />
          <circle cx="6" cy="17" r="1" fill="currentColor" />
          <circle cx="10" cy="15" r="1" fill="currentColor" />
          <circle cx="15" cy="11" r="1" fill="currentColor" />
          <circle cx="20" cy="5" r="2" fill="currentColor" />
        </svg>
      );

    case "MagneticField":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="8" y="10" width="8" height="4" rx="1" />
          <path d="M8 12c-4-4-4 4 0 0M16 12c4-4 4 4 0 0M12 10c0-6-6-6-6 2M12 14c0 6-6 6-6-2M12 10c0-6 6-6 6 2M12 14c0 6 6 6 6-2" />
        </svg>
      );

    case "TerrainMesh":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 17l4-4 6 5 6-7 4 3 M2 21h20M2 13l5 3 6-4 4 3 3-2 M2 9l3-2 5 4 6-3 6 1" />
        </svg>
      );

    case "BlackHole":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="3.5" fill="currentColor" />
          <path d="M12 2a10 10 0 0 1 10 10c0 5.5-4.5 10-10 10S2 17.5 2 12" />
          <path d="M12 5a7 7 0 0 1 7 7c0 3.8-3.1 7-7 7S5 15.8 5 12" />
        </svg>
      );

    case "GalaxySpiral":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 12c2-3 6-4 8-2s1 6-2 8-6 1-8-2-1-6 2-8 6-1 8 2M12 12c-2 3-6 4-8 2s-1-6 2-8 6-1 8 2 1 6-2 8-6 1-8-2" />
        </svg>
      );

    case "TornadoVortex":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M2 4h20M4 8h16M7 12h10M9 16h6M11 20h2" />
        </svg>
      );

    case "SolarFlare":
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="6" />
          <path d="M12 6c-2-3-6-3-6 0M18 12c3-2 3-6 0-6M12 18c2 3 6 3 6 0M6 12c-3 2-3 6 0 6" />
        </svg>
      );

    default:
      // Fallback painter's palette
      return (
        <svg
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19C5.03345 19.1749 5.2796 19.2435 5.5147 19.1837C6.7374 18.8719 7.74706 18.0069 8.2433 16.8529C8.73954 15.6989 9.38076 15 10.5 15H13.5C14.8807 15 16 16.1193 16 17.5C16 18.8807 14.8807 20 13.5 20H12v2z" />
        </svg>
      );
  }
}
