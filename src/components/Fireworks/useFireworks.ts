import { useRef, useEffect, RefObject } from "react";

const MAX_PARTICLES = 400;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
}

interface Shell {
  x: number;
  y: number;
  vx: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
}

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  isGlowing: boolean;
}

export interface UseFireworksOptions {
  colors: string[];
  particleCount: number;
  gravity: number;
  friction: number;
  fadeSpeed: number;
  particleSize: number;
  trailLength: number;
  spread: number;
  autoLaunch: boolean;
  autoInterval: number;
  glowEffect: boolean;
  glowBlur: number;
  backgroundColor: string;
  shellSpeed: number;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

// Extract base RGB from any CSS color string for fade overlay
function toFadeOverlay(bg: string, opacity: number): string {
  const m = bg.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (m) return `rgba(${m[1]},${m[2]},${m[3]},${opacity})`;
  if (bg.startsWith("#")) {
    const h = bg.slice(1);
    const f = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
    const r = parseInt(f.slice(0, 2), 16);
    const g = parseInt(f.slice(2, 4), 16);
    const b = parseInt(f.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${opacity})`;
  }
  return `rgba(0,0,0,${opacity})`;
}

export function useFireworks(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseFireworksOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const particlesRef = useRef<Particle[]>([]);
  const shellsRef = useRef<Shell[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persistent color→particles map — reused every frame, no GC
  const colorGroupsRef = useRef<Map<string, Particle[]>>(new Map());

  const launch = (x?: number) => {
    const { colors, shellSpeed } = optionsRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth || canvas.width;
    const h = canvas.clientHeight || canvas.height;
    const sx = x ?? (w * 0.2 + Math.random() * w * 0.6);
    shellsRef.current.push({
      x: sx, y: h,
      vx: (Math.random() - 0.5) * 2,
      vy: -(shellSpeed + Math.random() * 3),
      targetY: h * 0.15 + Math.random() * h * 0.35,
      color: colors[Math.floor(Math.random() * colors.length)],
      exploded: false,
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initStars(width: number, height: number) {
      const { starCount } = optionsRef.current;
      starsRef.current = Array.from({ length: starCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28,
      }));
    }

    function applyDpr(width: number, height: number) {
      const cvs = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;
      cvs.width = Math.round(width * dpr);
      cvs.height = Math.round(height * dpr);
      cvs.style.width = `${width}px`;
      cvs.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      initStars(width, height);
    }

    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onClick(e: MouseEvent) {
      const bounding = canvasRef.current!.getBoundingClientRect();
      launch(e.clientX - bounding.left);
    }
    parent.addEventListener("click", onClick);

    function scheduleAuto() {
      const { autoLaunch, autoInterval } = optionsRef.current;
      if (!autoLaunch) return;
      autoTimerRef.current = setTimeout(() => {
        launch();
        scheduleAuto();
      }, autoInterval * (0.7 + Math.random() * 0.6));
    }
    scheduleAuto();

    function explode(shell: Shell) {
      const { colors, particleCount, spread, particleSize } = optionsRef.current;
      const room = MAX_PARTICLES - particlesRef.current.length;
      if (room <= 0) return;
      const count = Math.min(particleCount, room);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const speed = spread * (0.4 + Math.random() * 0.6);
        const color = Math.random() < 0.15
          ? colors[Math.floor(Math.random() * colors.length)]
          : shell.color;
        particlesRef.current.push({
          x: shell.x, y: shell.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1, color,
          size: particleSize * (0.5 + Math.random() * 0.8),
        });
      }
    }

    let prevStarCount = options.starCount;

    function drawStars() {
      const { starCount, starColor, glowingStars, starGlowBlur } = optionsRef.current;
      if (starCount !== prevStarCount) {
        prevStarCount = starCount;
        initStars(w, h);
      }
      const stars = starsRef.current;
      if (stars.length === 0) return;
      ctx.fillStyle = starColor;
      for (const star of stars) {
        if (glowingStars && star.isGlowing) continue;
        ctx.globalAlpha = star.opacity;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (glowingStars) {
        ctx.shadowColor = starColor;
        ctx.shadowBlur = starGlowBlur;
        for (const star of stars) {
          if (!star.isGlowing) continue;
          ctx.globalAlpha = star.opacity * 0.12;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = star.opacity * 0.35;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = star.opacity;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.r * 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = "rgba(0,0,0,0)";
      }
      ctx.globalAlpha = 1;
    }

    function draw() {
      const { gravity, friction, fadeSpeed, glowEffect, glowBlur, backgroundColor, trailLength } = optionsRef.current;
      const isTransparent = !backgroundColor || backgroundColor === "transparent";

      // ── Background / trail fade ────────────────────────────────────────────
      // Fade overlay replaces explicit per-particle trail drawing entirely.
      // Previous frame's dots persist and fade toward background color = free trails.
      if (isTransparent) {
        ctx.clearRect(0, 0, w, h);
      } else {
        // Full opaque fill first frame; then semi-transparent fade for trail effect
        const trailOpacity = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, trailLength)));
        ctx.fillStyle = toFadeOverlay(backgroundColor, trailOpacity);
        ctx.fillRect(0, 0, w, h);
      }

      drawStars();

      // ── Shells ───────────────────────────────────────────────────────────────
      let shellWrite = 0;
      for (let si = 0; si < shellsRef.current.length; si++) {
        const shell = shellsRef.current[si];
        shell.x += shell.vx;
        shell.y += shell.vy;
        shell.vy += gravity * 0.3;
        if (shell.y <= shell.targetY && !shell.exploded) {
          shell.exploded = true;
          explode(shell);
          continue;
        }
        if (!shell.exploded) {
          shellsRef.current[shellWrite++] = shell;
          ctx.beginPath();
          ctx.arc(shell.x, shell.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = shell.color;
          ctx.globalAlpha = 0.9;
          if (glowEffect) { ctx.shadowColor = shell.color; ctx.shadowBlur = 6; }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      shellsRef.current.length = shellWrite;

      // ── Particles: update in-place + group by color ───────────────────────
      const groups = colorGroupsRef.current;
      groups.forEach(arr => (arr.length = 0)); // reuse arrays, skip GC

      let write = 0;
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.vx *= friction;
        p.vy *= friction;
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= fadeSpeed;
        if (p.alpha <= 0) continue;
        particlesRef.current[write++] = p;

        let grp = groups.get(p.color);
        if (!grp) { grp = []; groups.set(p.color, grp); }
        grp.push(p);
      }
      particlesRef.current.length = write;

      // ── Draw dots — one fillStyle set per color, one arc+fill per particle ──
      // globalAlpha varies per particle so we still need per-particle fill(),
      // but we cut fillStyle + shadowColor changes to once per color group.
      if (glowEffect) ctx.shadowBlur = glowBlur;
      for (const [color, grp] of groups) {
        if (grp.length === 0) continue;
        ctx.fillStyle = color;
        if (glowEffect) ctx.shadowColor = color;
        for (let i = 0; i < grp.length; i++) {
          const p = grp[i];
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, p.size * p.alpha), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      parent.removeEventListener("click", onClick);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [canvasRef]);

  return { launch };
}
