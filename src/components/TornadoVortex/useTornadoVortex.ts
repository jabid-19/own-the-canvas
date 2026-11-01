import { useRef } from "react";
import { useCanvasSetup, type FrameInfo } from "../../hooks/useCanvasSetup";
import { usePointer, readPointer, glowSprite } from "../../runtime/fx";
import { hexToRgba, sampleGradient } from "../../utils/color";

export interface UseTornadoVortexOptions {
  particleCount: number;
  funnelColor: string;
  debrisColor: string;
  lightningColor: string;
  backgroundColor: string;
  rotationSpeed: number;
  funnelHeight: number;
  vortexStrength: number;
  showLightning: boolean;
  showGroundDust: boolean;
  interactive: boolean;
  speed: number;
}

interface Streak { u: number; theta: number; len: number; jitter: number; bright: number }
interface Dust { x: number; y: number; theta: number; r: number; vy: number; life: number; size: number }
interface Debris { x: number; y: number; vx: number; vy: number; rot: number; spin: number; size: number; life: number }
interface Puff { theta: number; ring: number; size: number; shade: number }

/**
 * Funnel radius at height fraction u (0 = ground, 1 = cloud base).
 * Narrow rope at the ground flaring into the wall cloud.
 */
export function funnelRadius(u: number, top: number, base: number): number {
  return base + (top - base) * Math.pow(Math.max(0, Math.min(1, u)), 1.9);
}

/** Angular speed by height: conservation of angular momentum spins the narrow base fastest. */
export function spinAt(u: number, rotation: number): number {
  return rotation * 0.012 * (0.55 + 1.6 * (1 - u));
}

export function useTornadoVortex(options: UseTornadoVortexOptions) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const s = useRef({
    streaks: [] as Streak[],
    dust: [] as Dust[],
    debris: [] as Debris[],
    puffs: [] as Puff[],
    baseX: 0,
    topX: 0,
    t: 0,
    flash: 0,
    bolt: null as { pts: [number, number][]; life: number } | null,
    nextBolt: 2,
    sprite: { color: "", img: null as HTMLCanvasElement | null },
    dustSprite: { color: "", img: null as HTMLCanvasElement | null },
  }).current;
  const pointer = usePointer();
  const canvasEl = useRef<HTMLCanvasElement | null>(null);

  function seed(w: number) {
    s.baseX = s.topX = w / 2;
    s.puffs = Array.from({ length: 70 }, (_, i) => ({
      theta: Math.random() * Math.PI * 2,
      ring: Math.pow(i / 70, 0.7),
      size: 0.6 + Math.random() * 0.8,
      shade: 0.35 + Math.random() * 0.4,
    }));
    s.streaks = [];
  }

  function draw(ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, frame: FrameInfo) {
    const o = optionsRef.current;
    const k = (dt / 16.67) * o.speed;
    s.t += dt * 0.001 * o.speed;
    const t = s.t;

    const groundY = h * 0.94;
    const cloudY = groundY - h * Math.min(0.92, Math.max(0.3, o.funnelHeight));
    const H = groundY - cloudY;
    const topR = Math.min(w * 0.2, H * 0.32);
    const baseR = Math.max(5, topR * 0.07);

    // Sky: storm light falling off toward the ground
    if (!frame.overlay) {
      ctx.fillStyle = o.backgroundColor;
      ctx.fillRect(0, 0, w, h);
      // Faint storm light under the cloud deck
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, hexToRgba(o.funnelColor, 0.07));
      sky.addColorStop(0.6, hexToRgba(o.funnelColor, 0));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);
    }

    // Steering: the base chases the cursor, the top lags (the funnel leans and snakes)
    const p = readPointer(pointer.current, canvasEl.current);
    const target = o.interactive && p.inside ? p.x : w / 2 + Math.sin(t * 0.23) * w * 0.18;
    s.baseX += (target - s.baseX) * (1 - Math.pow(0.975, k));
    s.topX += (s.baseX - s.topX) * (1 - Math.pow(0.992, k));
    const axisX = (u: number) => {
      const lean = s.baseX + (s.topX - s.baseX) * u;
      const snake = Math.sin(t * 0.9 + u * 4.2) * topR * 0.18 * Math.sin(u * Math.PI);
      return lean + snake;
    };
    const yAt = (u: number) => groundY - u * H;

    // Wall cloud is dark storm vapour: the funnel color sunk most of the way into the sky
    const cloudRgb = sampleGradient([o.backgroundColor, o.funnelColor], 0.38);
    const cloudHex = "#" + cloudRgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    if (spriteNeeded(s.sprite, cloudHex)) s.sprite = { color: cloudHex, img: glowSprite(cloudHex, 64) };
    if (spriteNeeded(s.dustSprite, o.debrisColor)) s.dustSprite = { color: o.debrisColor, img: glowSprite(o.debrisColor, 64) };

    // Lightning: occasional bolt inside the cloud, flashing the whole scene
    if (o.showLightning && t > s.nextBolt) {
      s.nextBolt = t + 1.5 + Math.random() * 4;
      s.flash = 1;
      const x0 = s.topX + (Math.random() - 0.5) * topR * 2.4;
      const pts: [number, number][] = [[x0, cloudY - H * 0.12]];
      let x = x0, y = cloudY - H * 0.12;
      const steps = 7 + ((Math.random() * 5) | 0);
      for (let i = 0; i < steps; i++) {
        x += (Math.random() - 0.5) * topR * 0.5;
        y += H * 0.035 + Math.random() * H * 0.03;
        pts.push([x, y]);
      }
      s.bolt = { pts, life: 1 };
    }
    s.flash *= Math.pow(0.86, k);

    // Wall cloud: rotating soft puffs, lit from inside by lightning
    const cloudW = Math.min(w * 0.75, topR * 4.2);
    if (s.sprite.img) {
      for (const pf of s.puffs) {
        pf.theta += spinAt(1, o.rotationSpeed) * 0.35 * k * (1.2 - pf.ring * 0.6);
        const rx = cloudW * 0.5 * pf.ring, ry = H * 0.07 * pf.ring;
        const px = s.topX + Math.cos(pf.theta) * rx;
        const py = cloudY - H * 0.04 + Math.sin(pf.theta) * ry;
        const sz = topR * (0.55 + pf.size * 0.55) * (1 - pf.ring * 0.3);
        ctx.globalAlpha = Math.min(1, (0.1 + pf.shade * 0.14) * (1 + s.flash * 2.5));
        ctx.drawImage(s.sprite.img, px - sz, py - sz * 0.55, sz * 2, sz * 1.1);
      }
      ctx.globalAlpha = 1;
    }

    // Funnel body: translucent cone, denser at the core
    ctx.beginPath();
    const N = 40;
    for (let i = 0; i <= N; i++) {
      const u = i / N;
      const x = axisX(u) - funnelRadius(u, topR, baseR);
      if (i === 0) ctx.moveTo(x, yAt(u)); else ctx.lineTo(x, yAt(u));
    }
    for (let i = N; i >= 0; i--) {
      const u = i / N;
      ctx.lineTo(axisX(u) + funnelRadius(u, topR, baseR), yAt(u));
    }
    ctx.closePath();
    const body = ctx.createLinearGradient(0, cloudY, 0, groundY);
    body.addColorStop(0, hexToRgba(o.funnelColor, 0.32));
    body.addColorStop(0.6, hexToRgba(o.funnelColor, 0.16));
    body.addColorStop(1, hexToRgba(o.funnelColor, 0.08));
    ctx.fillStyle = body;
    ctx.fill();

    // Condensation streaks orbiting the axis: motion-blurred arcs, far side dimmer
    const want = Math.ceil(o.particleCount * frame.quality);
    while (s.streaks.length < want) {
      s.streaks.push({ u: Math.pow(Math.random(), 0.8), theta: Math.random() * Math.PI * 2, len: 0.25 + Math.random() * 0.5, jitter: Math.random(), bright: 0.4 + Math.random() * 0.6 });
    }
    if (s.streaks.length > want) s.streaks.length = want;
    const front = new Path2D(), back = new Path2D();
    for (const st of s.streaks) {
      st.theta += spinAt(st.u, o.rotationSpeed) * k * (0.8 + st.jitter * 0.4);
      st.u += 0.0009 * o.vortexStrength * k * (0.5 + st.jitter);
      if (st.u > 1) st.u -= 1;
      const r = funnelRadius(st.u, topR, baseR) * (0.75 + st.jitter * 0.3);
      const cx = axisX(st.u), cy = yAt(st.u);
      const tilt = 0.22;
      const a0 = st.theta - st.len, a1 = st.theta;
      const path = Math.sin(st.theta) > 0 ? front : back;
      const steps = 4;
      for (let j = 0; j <= steps; j++) {
        const a = a0 + (a1 - a0) * (j / steps);
        const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * tilt;
        if (j === 0) path.moveTo(x, y); else path.lineTo(x, y);
      }
    }
    ctx.lineCap = "round";
    ctx.strokeStyle = hexToRgba(o.funnelColor, 0.22 + s.flash * 0.3);
    ctx.lineWidth = 1;
    ctx.stroke(back);
    ctx.strokeStyle = hexToRgba(o.funnelColor, 0.6 + s.flash * 0.4);
    ctx.lineWidth = 1.3;
    ctx.stroke(front);

    // Ground: dust skirt swirling up around the base, debris flung outward
    if (o.showGroundDust) {
      const spawn = 3 * frame.quality * k;
      for (let i = 0; i < Math.floor(spawn) + (Math.random() < spawn % 1 ? 1 : 0); i++) {
        s.dust.push({ x: s.baseX, y: groundY, theta: Math.random() * Math.PI * 2, r: baseR * (1 + Math.random() * 2), vy: -(0.3 + Math.random() * 0.6), life: 1, size: 8 + Math.random() * 18 });
      }
      if (Math.random() < 0.12 * o.vortexStrength * k) {
        const a = Math.random() * Math.PI * 2;
        const sp = (2 + Math.random() * 3) * o.vortexStrength;
        s.debris.push({ x: s.baseX + Math.cos(a) * baseR * 2, y: groundY - 4, vx: Math.cos(a) * sp, vy: -(2 + Math.random() * 4) * o.vortexStrength, rot: 0, spin: (Math.random() - 0.5) * 0.4, size: 1.5 + Math.random() * 3, life: 1 });
      }
      let alive = 0;
      for (const d of s.dust) {
        d.theta += spinAt(0, o.rotationSpeed) * 0.8 * k;
        d.r += 0.35 * k;
        d.y += d.vy * k;
        d.life -= 0.006 * k;
        if (d.life <= 0) continue;
        s.dust[alive++] = d;
        if (s.dustSprite.img) {
          const x = s.baseX + Math.cos(d.theta) * d.r;
          const y = d.y + Math.sin(d.theta) * d.r * 0.2;
          ctx.globalAlpha = d.life * 0.35;
          ctx.drawImage(s.dustSprite.img, x - d.size, y - d.size * 0.6, d.size * 2, d.size * 1.2);
        }
      }
      s.dust.length = alive;
      ctx.globalAlpha = 1;
      ctx.fillStyle = o.debrisColor;
      alive = 0;
      for (const d of s.debris) {
        d.vy += 0.12 * k;
        d.vx *= Math.pow(0.99, k);
        d.x += d.vx * k;
        d.y += d.vy * k;
        d.rot += d.spin * k;
        if (d.y > groundY) { d.y = groundY; d.vy *= -0.3; d.vx *= 0.6; d.life -= 0.25; }
        d.life -= 0.004 * k;
        if (d.life <= 0) continue;
        s.debris[alive++] = d;
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.globalAlpha = Math.min(1, d.life * 1.5);
        ctx.fillRect(-d.size, -d.size * 0.4, d.size * 2, d.size * 0.8);
        ctx.restore();
      }
      s.debris.length = alive;
      ctx.globalAlpha = 1;
    }

    // Bolt and flash
    if (s.bolt && s.bolt.life > 0) {
      ctx.strokeStyle = hexToRgba(o.lightningColor, s.bolt.life);
      ctx.lineWidth = 1.6;
      ctx.shadowColor = o.lightningColor;
      ctx.shadowBlur = 12 * s.bolt.life;
      ctx.beginPath();
      s.bolt.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
      ctx.shadowBlur = 0;
      s.bolt.life -= 0.08 * k;
    }
    if (s.flash > 0.02) {
      ctx.fillStyle = hexToRgba(o.lightningColor, s.flash * 0.12);
      ctx.fillRect(0, 0, w, h);
    }
  }

  const setup = useCanvasSetup({
    onResize: (w) => seed(w),
    onFrame: draw,
  });
  canvasEl.current = setup.canvas;
  return setup;
}

function spriteNeeded(sp: { color: string }, color: string) {
  return sp.color !== color;
}
