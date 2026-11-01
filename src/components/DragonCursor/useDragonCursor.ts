import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";
import { pointerInCanvas } from "../../runtime/fx";

interface Segment {
  x: number;
  y: number;
}

interface FireParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  isGlowing: boolean;
}

export interface UseDragonCursorOptions {
  segmentCount: number;
  segmentSize: number;
  bodyColor: string;
  eyeColor: string;
  fireColor: string;
  backgroundColor: string;
  followSpeed: number;
  wingSpan: number;
  showFire: boolean;
  interactive: boolean;
  starCount: number;
  starColor: string;
  glowingStars: boolean;
  starGlowBlur: number;
}

export function useDragonCursor(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseDragonCursorOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const segmentsRef = useRef<Segment[]>([]);
  const fireRef = useRef<FireParticle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -999, y: -999 });
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0;

    function initSegments() {
      const { segmentCount } = optionsRef.current;
      const cx = w / 2;
      const cy = h / 2;
      segmentsRef.current = Array.from({ length: segmentCount }, (_, i) => ({
        x: cx - i * 12,
        y: cy,
      }));
      mouseRef.current = { x: cx, y: cy };
    }

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
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width;
      h = height;
      initSegments();
      initStars(width, height);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    // Follows the cursor only while it's over the canvas; wanders otherwise.
    let pointerInside = false;
    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const p = pointerInCanvas(e, canvas!);
      pointerInside = !!p;
      if (p) mouseRef.current = p;
    }
    function onMouseLeave() { pointerInside = false; }
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    function spawnFire(headX: number, headY: number, dx: number, dy: number) {
      const { segmentSize } = optionsRef.current;
      const len = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / len;
      const ny = dy / len;
      const count = 3 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const spread = 1.8;
        const maxLife = 40 + Math.random() * 20;
        fireRef.current.push({
          x: headX + nx * segmentSize * 0.9,
          y: headY + ny * segmentSize * 0.9,
          vx: nx * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * spread,
          vy: ny * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * spread - 0.3,
          life: maxLife,
          maxLife,
          size: 3 + Math.random() * 5,
        });
      }
      if (fireRef.current.length > 200) fireRef.current.splice(0, 30);
    }

    /** Colour helpers: mix an "r,g,b" string toward black (f<0) or white (f>0). */
    function shade(rgb: string, f: number): string {
      const [r, g, b] = rgb.split(",").map(Number);
      const t = f < 0 ? 0 : 255;
      const k = Math.abs(f);
      return `${Math.round(r + (t - r) * k)},${Math.round(g + (t - g) * k)},${Math.round(b + (t - b) * k)}`;
    }

    /** Membrane wings: three finger bones, scalloped skin between them, veins, glowing rim. */
    function drawWings(
      x: number, y: number,
      angle: number,
      wingSpan: number,
      flap: number,
      bodyRgb: string,
      fireRgb: string
    ) {
      const tipDots: { x: number; y: number }[] = [];
      const ca = Math.cos(angle);
      const sa = Math.sin(angle);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // finger angles for the +y wing (swept back); the -y wing is the mirror image
      const fingers = [
        { a: Math.PI / 2 - 0.12 + flap, len: wingSpan * 0.92 },
        { a: Math.PI / 2 + 0.46 + flap, len: wingSpan },
        { a: Math.PI / 2 + 0.98 + flap, len: wingSpan * 0.62 },
      ];

      for (const side of [-1, 1]) {
        const tips = fingers.map((f) => ({ x: Math.cos(f.a) * f.len, y: side * Math.sin(f.a) * f.len }));
        const scallop = (i: number) => ({
          x: (tips[i].x + tips[i + 1].x) * 0.5 * 0.7,
          y: (tips[i].y + tips[i + 1].y) * 0.5 * 0.7,
        });

        // skin
        const mid = tips[1];
        const g = ctx.createLinearGradient(0, 0, mid.x, mid.y);
        g.addColorStop(0, `rgba(${shade(bodyRgb, -0.25)},0.88)`);
        g.addColorStop(0.55, `rgba(${bodyRgb},0.5)`);
        g.addColorStop(1, `rgba(${bodyRgb},0.2)`);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(tips[0].x, tips[0].y);
        for (let i = 0; i < tips.length - 1; i++) {
          const c = scallop(i);
          ctx.quadraticCurveTo(c.x, c.y, tips[i + 1].x, tips[i + 1].y);
        }
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();

        // glowing rim
        ctx.save();
        ctx.shadowColor = `rgba(${bodyRgb},0.8)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(tips[0].x, tips[0].y);
        for (let i = 0; i < tips.length - 1; i++) {
          const c = scallop(i);
          ctx.quadraticCurveTo(c.x, c.y, tips[i + 1].x, tips[i + 1].y);
        }
        ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.35)},0.85)`;
        ctx.lineWidth = 1.4;
        ctx.stroke();
        ctx.restore();

        // veins from the root to each scallop
        ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.3)},0.28)`;
        ctx.lineWidth = 0.8;
        for (let i = 0; i < tips.length - 1; i++) {
          const c = scallop(i);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(c.x * 0.4, c.y * 0.55, c.x, c.y);
          ctx.stroke();
        }

        // finger bones, tipped with a claw of accent colour
        for (const tip of tips) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(tip.x, tip.y);
          ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.15)},0.95)`;
          ctx.lineWidth = 2.2;
          ctx.lineCap = "round";
          ctx.stroke();
          tipDots.push({ x: x + ca * tip.x - sa * tip.y, y: y + sa * tip.x + ca * tip.y });
        }
      }

      ctx.restore();

      // claw dots, drawn in canvas coordinates
      ctx.fillStyle = `rgba(${fireRgb},0.95)`;
      for (const d of tipDots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
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

    function draw(dt: number) {
      const {
        segmentCount, segmentSize, bodyColor, eyeColor, fireColor,
        backgroundColor, followSpeed, wingSpan, showFire, interactive,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      drawStars();

      const segments = segmentsRef.current;

      if (!interactive || !pointerInside) {
        mouseRef.current = {
          x: w * 0.5 + Math.sin(t * 0.5) * w * 0.35,
          y: h * 0.5 + Math.cos(t * 0.7) * h * 0.3,
        };
      }

      const mouse = mouseRef.current;

      while (segments.length < segmentCount) {
        const last = segments[segments.length - 1] || { x: w / 2, y: h / 2 };
        segments.push({ x: last.x, y: last.y });
      }
      if (segments.length > segmentCount) segments.length = segmentCount;

      const head = segments[0];
      const spd = Math.min(followSpeed, 1);
      head.x += (mouse.x - head.x) * spd;
      head.y += (mouse.y - head.y) * spd;

      for (let i = 1; i < segments.length; i++) {
        const prev = segments[i - 1];
        const seg = segments[i];
        const dx = prev.x - seg.x;
        const dy = prev.y - seg.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
        const segSpacing = segmentSize * 1.2;
        if (dist > segSpacing) {
          seg.x = prev.x - (dx / dist) * segSpacing;
          seg.y = prev.y - (dy / dist) * segSpacing;
        }
        const perpX = -dy / dist;
        const perpY = dx / dist;
        const wave = Math.sin(t * 4 - i * 0.4) * (segmentSize * 0.25) * (i / segments.length);
        seg.x += perpX * wave;
        seg.y += perpY * wave;
      }

      const headAngle = segments.length >= 2
        ? Math.atan2(segments[0].y - segments[1].y, segments[0].x - segments[1].x)
        : 0;

      const bodyRgb = hexToRgbString(bodyColor);
      const fireRgb = hexToRgbString(fireColor);

      // Spawn fire from jaw
      if (showFire && segments.length >= 2) {
        const head0 = segments[0];
        const next = segments[1];
        const dx = head0.x - next.x;
        const dy = head0.y - next.y;
        if (Math.random() < 0.8) spawnFire(head0.x, head0.y, dx, dy);
      }

      const eyeRgb = hexToRgbString(eyeColor);
      const head0 = segments[0];
      const n = segments.length;

      // soft aura around the dragon so it glows against the night
      {
        const aura = ctx.createRadialGradient(head0.x, head0.y, 0, head0.x, head0.y, segmentSize * 9);
        aura.addColorStop(0, `rgba(${bodyRgb},0.16)`);
        aura.addColorStop(1, `rgba(${bodyRgb},0)`);
        ctx.fillStyle = aura;
        ctx.fillRect(0, 0, w, h);
      }

      // Fire: additive blobs with a hot core (behind the body)
      if (showFire) {
        ctx.globalCompositeOperation = "lighter";
        for (let i = fireRef.current.length - 1; i >= 0; i--) {
          const p = fireRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          if (p.life <= 0) { fireRef.current.splice(i, 1); continue; }
          const ratio = p.life / p.maxLife;
          const r = Math.max(1, p.size * (0.5 + ratio) * 1.5);
          const fg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
          fg.addColorStop(0, `rgba(255,246,222,${ratio * 0.9})`);
          fg.addColorStop(0.35, `rgba(${fireRgb},${ratio * 0.7})`);
          fg.addColorStop(1, `rgba(${fireRgb},0)`);
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";
      }

      const flap = Math.sin(t * 6) * 0.28;

      // Wings sit behind the body, rooted just behind the neck
      if (n >= 4) {
        const ws = segments[2];
        const wsNext = segments[3];
        drawWings(ws.x, ws.y, Math.atan2(ws.y - wsNext.y, ws.x - wsNext.x), wingSpan, flap, bodyRgb, fireRgb);
      }

      if (n >= 3) {
        // body frame: position, forward tangent (toward the head), and half-width per joint
        const tan: { x: number; y: number }[] = [];
        const rad: number[] = [];
        for (let i = 0; i < n; i++) {
          const a0 = segments[Math.max(0, i - 1)];
          const a1 = segments[Math.min(n - 1, i + 1)];
          const dx = a0.x - a1.x;
          const dy = a0.y - a1.y;
          const d = Math.sqrt(dx * dx + dy * dy) || 1;
          tan.push({ x: dx / d, y: dy / d });
          const k = i / (n - 1);
          rad.push(segmentSize * (i === 0 ? 0.62 : 0.86 * Math.pow(1 - k, 0.8) + 0.12));
        }
        const edge = (i: number, f: number, side: number) => ({
          x: segments[i].x - tan[i].y * rad[i] * f * side,
          y: segments[i].y + tan[i].x * rad[i] * f * side,
        });
        const tail = segments[n - 1];
        const tailTip = { x: tail.x - tan[n - 1].x * segmentSize * 1.3, y: tail.y - tan[n - 1].y * segmentSize * 1.3 };

        const outline = (f: number) => {
          const pts: { x: number; y: number }[] = [];
          for (let i = 0; i < n; i++) pts.push(edge(i, f, 1));
          pts.push(tailTip);
          for (let i = n - 1; i >= 0; i--) pts.push(edge(i, f, -1));
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length - 1; i++) {
            const mx = (pts[i].x + pts[i + 1].x) / 2;
            const my = (pts[i].y + pts[i + 1].y) / 2;
            ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
          }
          ctx.closePath();
        };

        // Tail fin
        {
          const tx = tan[n - 1].x;
          const ty = tan[n - 1].y;
          const fw = segmentSize * 0.62;
          ctx.beginPath();
          ctx.moveTo(tail.x, tail.y);
          ctx.quadraticCurveTo(tail.x - tx * segmentSize * 0.5 - ty * fw, tail.y - ty * segmentSize * 0.5 + tx * fw, tail.x - tx * segmentSize * 2 , tail.y - ty * segmentSize * 2);
          ctx.quadraticCurveTo(tail.x - tx * segmentSize * 0.5 + ty * fw, tail.y - ty * segmentSize * 0.5 - tx * fw, tail.x, tail.y);
          ctx.fillStyle = `rgba(${shade(fireRgb, -0.1)},0.88)`;
          ctx.fill();
        }

        // Legs (two pairs), drawn under the body
        for (const li of [Math.round(n * 0.3), Math.round(n * 0.58)]) {
          const swing = Math.sin(t * 4 + li) * segmentSize * 0.22;
          for (const side of [-1, 1]) {
            const tn = tan[li];
            const px = -tn.y * side;
            const py = tn.x * side;
            const hip = { x: segments[li].x + px * rad[li] * 0.7, y: segments[li].y + py * rad[li] * 0.7 };
            const knee = { x: hip.x + px * segmentSize * 0.85 + tn.x * segmentSize * 0.25, y: hip.y + py * segmentSize * 0.85 + tn.y * segmentSize * 0.25 };
            const foot = { x: knee.x + px * segmentSize * 0.45 - tn.x * (segmentSize * 0.7 - swing), y: knee.y + py * segmentSize * 0.45 - tn.y * (segmentSize * 0.7 - swing) };
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.beginPath();
            ctx.moveTo(hip.x, hip.y);
            ctx.lineTo(knee.x, knee.y);
            ctx.lineTo(foot.x, foot.y);
            ctx.strokeStyle = `rgba(${shade(bodyRgb, -0.55)},1)`;
            ctx.lineWidth = segmentSize * 0.34;
            ctx.stroke();
            ctx.strokeStyle = `rgba(${shade(bodyRgb, -0.15)},1)`;
            ctx.lineWidth = segmentSize * 0.16;
            ctx.stroke();
            // claws
            for (const c of [-0.5, 0, 0.5]) {
              const ca = Math.atan2(foot.y - knee.y, foot.x - knee.x) + c;
              ctx.beginPath();
              ctx.moveTo(foot.x, foot.y);
              ctx.lineTo(foot.x + Math.cos(ca) * segmentSize * 0.34, foot.y + Math.sin(ca) * segmentSize * 0.34);
              ctx.strokeStyle = `rgba(${shade(fireRgb, 0.35)},0.95)`;
              ctx.lineWidth = 1.6;
              ctx.stroke();
            }
          }
        }

        // Body: dark silhouette with a glowing rim, then lighter inner bands
        ctx.save();
        outline(1);
        ctx.fillStyle = `rgba(${shade(bodyRgb, -0.68)},1)`;
        ctx.fill();
        ctx.shadowColor = `rgba(${bodyRgb},0.95)`;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.12)},0.95)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        outline(0.62);
        ctx.fillStyle = `rgba(${shade(bodyRgb, -0.42)},1)`;
        ctx.fill();
        outline(0.24);
        ctx.fillStyle = `rgba(${shade(bodyRgb, -0.05)},0.8)`;
        ctx.fill();

        // Scales: overlapping chevrons pointing toward the tail
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        for (let i = 1; i < n - 1; i++) {
          const rr = rad[i];
          const a1 = edge(i, 0.8, 1);
          const a2 = edge(i, 0.8, -1);
          const cx = segments[i].x - tan[i].x * rr * 0.95;
          const cy = segments[i].y - tan[i].y * rr * 0.95;
          ctx.beginPath();
          ctx.moveTo(a1.x, a1.y);
          ctx.quadraticCurveTo(cx, cy, a2.x, a2.y);
          ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.45)},${0.42 - (i / n) * 0.2})`;
          ctx.stroke();
        }

        // Dorsal spines in the accent colour, biggest at the neck
        for (let i = 1; i < n - 1; i++) {
          const rr = rad[i];
          const len = rr * (0.95 - (i / n) * 0.3);
          const sx = segments[i].x;
          const sy = segments[i].y;
          const wv = rr * 0.28;
          ctx.beginPath();
          ctx.moveTo(sx - tan[i].y * wv, sy + tan[i].x * wv);
          ctx.lineTo(sx - tan[i].x * len, sy - tan[i].y * len);
          ctx.lineTo(sx + tan[i].y * wv, sy - tan[i].x * wv);
          ctx.closePath();
          ctx.fillStyle = `rgba(${shade(fireRgb, 0.05)},${0.95 - (i / n) * 0.35})`;
          ctx.fill();
        }
      }

      // Head, drawn in its own frame: +x is the direction of travel
      {
        const S = segmentSize;
        ctx.save();
        ctx.translate(head0.x, head0.y);
        ctx.rotate(headAngle);

        // whiskers that drift behind the head
        ctx.lineCap = "round";
        for (const side of [-1, 1]) {
          const sw = Math.sin(t * 3 + side) * S * 0.45;
          ctx.beginPath();
          ctx.moveTo(S * 1.15, side * S * 0.2);
          ctx.bezierCurveTo(S * 0.4, side * S * 1.1, -S * 0.8, side * (S * 1.4) + sw, -S * 2.1, side * (S * 1.9) + sw * 1.5);
          ctx.strokeStyle = `rgba(${shade(fireRgb, 0.1)},0.75)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        // horns: tapered, swept back
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(S * 0.05, side * S * 0.42);
          ctx.quadraticCurveTo(-S * 0.9, side * S * 0.55, -S * 1.75, side * S * 1.25);
          ctx.quadraticCurveTo(-S * 0.85, side * S * 0.98, -S * 0.3, side * S * 0.78);
          ctx.closePath();
          ctx.fillStyle = `rgba(${shade(fireRgb, 0.2)},1)`;
          ctx.fill();
          ctx.strokeStyle = `rgba(${shade(fireRgb, -0.35)},0.9)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // skull
        const sk: [number, number][] = [
          [1.62, 0], [1.2, 0.3], [0.65, 0.4], [0.3, 0.66], [-0.3, 0.82], [-0.82, 0.5], [-0.98, 0],
          [-0.82, -0.5], [-0.3, -0.82], [0.3, -0.66], [0.65, -0.4], [1.2, -0.3],
        ];
        const trace = () => {
          ctx.beginPath();
          const m0 = [(sk[0][0] + sk[1][0]) / 2, (sk[0][1] + sk[1][1]) / 2];
          ctx.moveTo(S * m0[0], S * m0[1]);
          for (let i = 1; i <= sk.length; i++) {
            const c = sk[i % sk.length];
            const nx = sk[(i + 1) % sk.length];
            ctx.quadraticCurveTo(S * c[0], S * c[1], S * (c[0] + nx[0]) / 2, S * (c[1] + nx[1]) / 2);
          }
          ctx.closePath();
        };
        ctx.save();
        trace();
        const hg = ctx.createLinearGradient(-S, 0, S * 1.6, 0);
        hg.addColorStop(0, `rgba(${shade(bodyRgb, -0.6)},1)`);
        hg.addColorStop(1, `rgba(${shade(bodyRgb, -0.15)},1)`);
        ctx.fillStyle = hg;
        ctx.fill();
        ctx.shadowColor = `rgba(${bodyRgb},0.95)`;
        ctx.shadowBlur = 16;
        ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.15)},0.95)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // snout ridge and brow ridges
        ctx.strokeStyle = `rgba(${shade(bodyRgb, 0.4)},0.5)`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(S * 1.45, 0);
        ctx.lineTo(-S * 0.7, 0);
        ctx.stroke();
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(S * 0.75, side * S * 0.2);
          ctx.quadraticCurveTo(S * 0.45, side * S * 0.62, -S * 0.05, side * S * 0.62);
          ctx.stroke();
        }

        // nostrils
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.ellipse(S * 1.28, side * S * 0.13, S * 0.07, S * 0.04, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(0,0,0,0.75)";
          ctx.fill();
        }

        // eye shapes with slit pupils (glow and highlight are added in canvas coordinates below)
        for (const side of [-1, 1]) {
          const ex = S * 0.5;
          const ey = side * S * 0.42;
          ctx.beginPath();
          ctx.ellipse(ex, ey, S * 0.25, S * 0.15, side * -0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${eyeRgb},1)`;
          ctx.fill();
          ctx.beginPath();
          ctx.ellipse(ex + S * 0.02, ey, S * 0.05, S * 0.13, 0, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(10,6,0,0.95)";
          ctx.fill();
        }

        ctx.restore();

        // glows and highlights in canvas coordinates
        const hw = (lx: number, ly: number) => ({
          x: head0.x + Math.cos(headAngle) * lx - Math.sin(headAngle) * ly,
          y: head0.y + Math.sin(headAngle) * lx + Math.cos(headAngle) * ly,
        });
        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        for (const side of [-1, 1]) {
          const e = hw(S * 0.5, side * S * 0.42);
          const eg = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, S * 0.6);
          eg.addColorStop(0, `rgba(${eyeRgb},0.55)`);
          eg.addColorStop(1, `rgba(${eyeRgb},0)`);
          ctx.fillStyle = eg;
          ctx.beginPath();
          ctx.arc(e.x, e.y, S * 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
        if (showFire) {
          const m = hw(S * 1.55, 0);
          const mg = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, S * 0.95);
          mg.addColorStop(0, "rgba(255,240,210,0.85)");
          mg.addColorStop(0.4, `rgba(${fireRgb},0.5)`);
          mg.addColorStop(1, `rgba(${fireRgb},0)`);
          ctx.fillStyle = mg;
          ctx.beginPath();
          ctx.arc(m.x, m.y, S * 0.95, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        for (const side of [-1, 1]) {
          const e = hw(S * 0.6, side * S * 0.37);
          ctx.beginPath();
          ctx.arc(e.x, e.y, S * 0.035, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    let lastTime = 0;
    function loop(timestamp: number) {
      const dt = lastTime ? timestamp - lastTime : 16;
      lastTime = timestamp;
      draw(dt);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
