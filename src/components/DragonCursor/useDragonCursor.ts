import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

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

    function onMouseMove(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    canvas.addEventListener("mousemove", onMouseMove);

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

    function drawBoneWings(
      x: number, y: number,
      angle: number,
      wingSpan: number,
      flapT: number,
      bodyRgb: string,
      alpha: number
    ) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      for (const side of [-1, 1]) {
        // 3 finger bones per wing — fan in perpendicular direction
        const baseAngle = side * Math.PI / 2;
        const fingers = [
          { a: baseAngle + flapT * side - 0.35, len: wingSpan * 0.7 },
          { a: baseAngle + flapT * side,        len: wingSpan },
          { a: baseAngle + flapT * side + 0.3,  len: wingSpan * 0.75 },
        ];

        const tips = fingers.map(f => ({
          x: Math.cos(f.a) * f.len,
          y: Math.sin(f.a) * f.len,
        }));

        // Bone shafts + knuckle joints
        for (const tip of tips) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(tip.x, tip.y);
          ctx.strokeStyle = `rgba(${bodyRgb},${alpha * 0.85})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.stroke();
          // Knuckle at 55% along
          ctx.beginPath();
          ctx.arc(tip.x * 0.55, tip.y * 0.55, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${bodyRgb},${alpha * 0.9})`;
          ctx.fill();
          // Tip joint
          ctx.beginPath();
          ctx.arc(tip.x, tip.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Thin membrane arcs between finger tips
        for (let f = 0; f < tips.length - 1; f++) {
          const t1 = tips[f];
          const t2 = tips[f + 1];
          const cpX = (t1.x + t2.x) * 0.42;
          const cpY = (t1.y + t2.y) * 0.42 + side * 10;
          ctx.beginPath();
          ctx.moveTo(t1.x, t1.y);
          ctx.quadraticCurveTo(cpX, cpY, t2.x, t2.y);
          ctx.strokeStyle = `rgba(${bodyRgb},${alpha * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        // Root membrane from attachment to first finger
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(tips[0].x * 0.3, tips[0].y * 0.3, tips[0].x, tips[0].y);
        ctx.strokeStyle = `rgba(${bodyRgb},${alpha * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
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
        segmentCount, segmentSize, bodyColor, fireColor,
        backgroundColor, followSpeed, wingSpan, showFire, interactive,
      } = optionsRef.current;

      timeRef.current += dt * 0.001;
      const t = timeRef.current;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, w, h);

      drawStars();

      const segments = segmentsRef.current;

      if (!interactive) {
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

      // Draw spectral ghostly fire (behind body)
      if (showFire) {
        for (let i = fireRef.current.length - 1; i >= 0; i--) {
          const p = fireRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 1;
          if (p.life <= 0) { fireRef.current.splice(i, 1); continue; }
          const ratio = p.life / p.maxLife;
          const alpha = ratio * 0.75;
          const r = p.size * ratio;
          const rgb = fireRgb;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.5, r), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${alpha})`;
          ctx.fill();
        }
      }

      const flapT = Math.sin(t * 6) * 0.3;

      // Bone wings behind body
      if (segments.length >= 4) {
        const ws = segments[2];
        const wsNext = segments[3];
        const wa = Math.atan2(ws.y - wsNext.y, ws.x - wsNext.x);
        drawBoneWings(ws.x, ws.y, wa, wingSpan, flapT, bodyRgb, 0.85);
      }

      // Draw skeleton body (tail → head direction, skip segment 0)
      for (let i = segments.length - 1; i >= 1; i--) {
        const seg = segments[i];
        const prev = segments[i - 1];
        const t0 = i / (segments.length - 1);
        const radius = segmentSize * (1 - t0 * 0.75);
        const jointR = Math.max(2, radius * 0.55);

        // Bone shaft: two parallel lines from seg to prev
        const dx = prev.x - seg.x;
        const dy = prev.y - seg.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = dx / dist;
        const ny = dy / dist;
        const shaftW = radius * 0.28;
        const perpX = -ny * shaftW;
        const perpY = nx * shaftW;
        const shaftAlpha = 0.4 + (1 - t0) * 0.15;

        ctx.beginPath();
        ctx.moveTo(seg.x + perpX, seg.y + perpY);
        ctx.lineTo(prev.x + perpX, prev.y + perpY);
        ctx.strokeStyle = `rgba(${bodyRgb},${shaftAlpha})`;
        ctx.lineWidth = 1;
        ctx.lineCap = "butt";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(seg.x - perpX, seg.y - perpY);
        ctx.lineTo(prev.x - perpX, prev.y - perpY);
        ctx.stroke();

        // Vertebra joint: hollow outer ring + filled inner knot
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, jointR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${bodyRgb},${0.7 + (1 - t0) * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, jointR * 0.38, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${bodyRgb},${0.8 + (1 - t0) * 0.2})`;
        ctx.fill();

        // Ribs every 3rd segment — two ribs per side, bezier curves
        if (i % 3 === 0 && i > 2 && i < segments.length - 3) {
          const ang = Math.atan2(seg.y - prev.y, seg.x - prev.x);
          const rPerpX = -Math.sin(ang);
          const rPerpY = Math.cos(ang);
          const ribLen = segmentSize * (1.1 + (1 - t0) * 0.9);

          for (const side of [-1, 1]) {
            // Outer rib (longer, more curved)
            const rl1 = ribLen * 0.9;
            const tipX1 = seg.x + rPerpX * side * rl1;
            const tipY1 = seg.y + rPerpY * side * rl1;
            const cp1X = seg.x + rPerpX * side * rl1 * 0.55 + Math.cos(ang) * rl1 * -0.22;
            const cp1Y = seg.y + rPerpY * side * rl1 * 0.55 + Math.sin(ang) * rl1 * -0.22;
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            ctx.quadraticCurveTo(cp1X, cp1Y, tipX1, tipY1);
            ctx.strokeStyle = `rgba(${bodyRgb},0.62)`;
            ctx.lineWidth = 1.2;
            ctx.lineCap = "round";
            ctx.stroke();

            // Inner rib (shorter)
            const rl2 = ribLen * 0.55;
            const tipX2 = seg.x + rPerpX * side * rl2;
            const tipY2 = seg.y + rPerpY * side * rl2;
            const cp2X = seg.x + rPerpX * side * rl2 * 0.5 + Math.cos(ang) * rl2 * 0.18;
            const cp2Y = seg.y + rPerpY * side * rl2 * 0.5 + Math.sin(ang) * rl2 * 0.18;
            ctx.beginPath();
            ctx.moveTo(seg.x, seg.y);
            ctx.quadraticCurveTo(cp2X, cp2Y, tipX2, tipY2);
            ctx.strokeStyle = `rgba(${bodyRgb},0.38)`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      // Draw skull head
      if (segments.length > 0) {
        const head0 = segments[0];
        const fwdX = Math.cos(headAngle);
        const fwdY = Math.sin(headAngle);
        const perpX = -Math.sin(headAngle);
        const perpY = Math.cos(headAngle);

        // Skull cranium — oval outline with faint fill
        const craneW = segmentSize * 1.05;
        const craneH = segmentSize * 0.82;
        ctx.save();
        ctx.translate(head0.x, head0.y);
        ctx.rotate(headAngle);
        const skullGrad = ctx.createRadialGradient(-craneW * 0.1, 0, craneW * 0.05, 0, 0, craneW);
        skullGrad.addColorStop(0, `rgba(${bodyRgb},0.07)`);
        skullGrad.addColorStop(1, `rgba(${bodyRgb},0)`);
        ctx.beginPath();
        ctx.ellipse(0, 0, craneW, craneH, 0, 0, Math.PI * 2);
        ctx.fillStyle = skullGrad;
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, 0, craneW, craneH, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${bodyRgb},0.88)`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();

        // Bone spur horns
        const hornBase = segmentSize * 0.58;
        for (const side of [-1, 1]) {
          const hx = head0.x + perpX * hornBase * side;
          const hy = head0.y + perpY * hornBase * side;
          const midX = hx + perpX * side * segmentSize * 0.28 + Math.cos(headAngle - Math.PI) * segmentSize * 0.88;
          const midY = hy + perpY * side * segmentSize * 0.28 + Math.sin(headAngle - Math.PI) * segmentSize * 0.88;
          const tipX = midX + perpX * side * segmentSize * 0.14 + Math.cos(headAngle - Math.PI) * segmentSize * 0.48;
          const tipY = midY + perpY * side * segmentSize * 0.14 + Math.sin(headAngle - Math.PI) * segmentSize * 0.48;
          ctx.beginPath();
          ctx.moveTo(hx, hy);
          ctx.lineTo(midX, midY);
          ctx.strokeStyle = `rgba(${bodyRgb},0.9)`;
          ctx.lineWidth = 2.5;
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(tipX, tipY);
          ctx.lineWidth = 1.2;
          ctx.stroke();
          // Small lateral spur at mid-point
          const spurX = midX + perpX * side * segmentSize * 0.2;
          const spurY = midY + perpY * side * segmentSize * 0.2;
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(spurX, spurY);
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }

        // Hollow eye sockets
        const eyeOffset = segmentSize * 0.4;
        const eyeForward = segmentSize * 0.22;
        const eyeR = segmentSize * 0.26;
        for (const side of [-1, 1]) {
          const ex = head0.x + perpX * eyeOffset * side + fwdX * eyeForward;
          const ey = head0.y + perpY * eyeOffset * side + fwdY * eyeForward;
          // Dark empty socket
          ctx.beginPath();
          ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,0,0,0.72)`;
          ctx.fill();
          // Socket rim
          ctx.beginPath();
          ctx.arc(ex, ey, eyeR, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${bodyRgb},0.82)`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          // Tiny specular glint (bone catching light)
          ctx.beginPath();
          ctx.arc(
            ex + fwdX * eyeR * 0.28 - perpX * eyeR * 0.28 * side,
            ey + fwdY * eyeR * 0.28 - perpY * eyeR * 0.28 * side,
            eyeR * 0.16, 0, Math.PI * 2
          );
          ctx.fillStyle = `rgba(${bodyRgb},0.32)`;
          ctx.fill();
        }

        // Jaw with teeth
        const jawFwdOffset = segmentSize * 0.55;
        const jawOpenAmt = Math.sin(t * 3) * 0.1 + 0.08;
        const upperJawY = -segmentSize * 0.14;
        const lowerJawY = segmentSize * 0.14 + jawOpenAmt * segmentSize * 0.55;
        const jawW = segmentSize * 0.82;
        const jawH = segmentSize * 0.2;

        ctx.save();
        ctx.translate(head0.x + fwdX * jawFwdOffset, head0.y + fwdY * jawFwdOffset);
        ctx.rotate(headAngle);

        // Upper jaw arc (bottom edge faces mouth gap)
        ctx.beginPath();
        ctx.ellipse(0, upperJawY, jawW, jawH, 0, 0, Math.PI);
        ctx.strokeStyle = `rgba(${bodyRgb},0.85)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Lower jaw arc (top edge faces mouth gap)
        ctx.beginPath();
        ctx.ellipse(0, lowerJawY, jawW * 0.88, jawH * 0.88, 0, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Upper teeth — 5 triangles pointing downward
        const uTeeth = 5;
        for (let ti = 0; ti < uTeeth; ti++) {
          const tx = -jawW * 0.78 + jawW * 1.56 * (ti + 0.5) / uTeeth;
          const arcFrac = Math.max(0, 1 - (tx / jawW) ** 2);
          const baseY = upperJawY + jawH * Math.sqrt(arcFrac);
          const th = segmentSize * (0.12 + Math.sin(ti * 1.5) * 0.04);
          const tw = jawW / uTeeth * 0.38;
          ctx.beginPath();
          ctx.moveTo(tx - tw, baseY);
          ctx.lineTo(tx, baseY + th);
          ctx.lineTo(tx + tw, baseY);
          ctx.strokeStyle = `rgba(${bodyRgb},0.75)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Lower teeth — 4 triangles pointing upward
        const lTeeth = 4;
        const lJawW = jawW * 0.88;
        for (let ti = 0; ti < lTeeth; ti++) {
          const tx = -lJawW * 0.78 + lJawW * 1.56 * (ti + 0.5) / lTeeth;
          const arcFrac = Math.max(0, 1 - (tx / lJawW) ** 2);
          const baseY = lowerJawY - jawH * 0.88 * Math.sqrt(arcFrac);
          const th = segmentSize * (0.1 + Math.sin(ti * 1.9) * 0.04);
          const tw = lJawW / lTeeth * 0.36;
          ctx.beginPath();
          ctx.moveTo(tx - tw, baseY);
          ctx.lineTo(tx, baseY - th);
          ctx.lineTo(tx + tw, baseY);
          ctx.strokeStyle = `rgba(${bodyRgb},0.7)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
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
      canvas.removeEventListener("mousemove", onMouseMove);
    };
  }, [canvasRef]);
}
