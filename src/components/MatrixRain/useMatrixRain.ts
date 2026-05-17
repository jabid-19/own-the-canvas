import { useRef, useEffect, RefObject } from "react";

const KATAKANA =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "ァィゥェォッャュョ";
const LATIN = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BINARY = "01";

export type MatrixCharset = "katakana" | "latin" | "binary" | string;

export interface UseMatrixRainOptions {
  color: string;
  backgroundColor: string;
  fontSize: number;
  speed: number;
  charset: string;
  resetThreshold: number;
}

export function resolveCharset(charset: MatrixCharset): string {
  if (charset === "katakana") return KATAKANA;
  if (charset === "latin") return LATIN;
  if (charset === "binary") return BINARY;
  return charset || LATIN;
}

export function useMatrixRain(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseMatrixRainOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const dropsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let w = 0;
    let h = 0;

    function resize(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      w = width;
      h = height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);

      const { fontSize } = optionsRef.current;
      const cols = Math.floor(w / fontSize);
      dropsRef.current = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * -(h / fontSize))
      );
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    let lastTime = 0;
    let elapsed = 0;

    function draw() {
      const { color, backgroundColor, fontSize, charset, resetThreshold } =
        optionsRef.current;
      const chars = charset;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = color;
      ctx.font = `${fontSize}px monospace`;

      const drops = dropsRef.current;
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        drops[i]++;
        if (drops[i] * fontSize > h && Math.random() > resetThreshold) {
          drops[i] = 0;
        }
      }
    }

    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 0;
      lastTime = timestamp;
      elapsed += dt;

      const { speed } = optionsRef.current;
      if (elapsed >= speed) {
        elapsed = elapsed % speed;
        draw();
      }

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, [canvasRef]);
}
