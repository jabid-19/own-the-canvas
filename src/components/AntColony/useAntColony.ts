import { useRef, useEffect, RefObject } from "react";
import { hexToRgbString } from "../../utils/color";

export interface UseAntColonyOptions {
  antCount: number;
  evaporationRate: number;
  diffusionRate: number;
  pheromoneStrength: number;
  antSpeed: number;
  sensorAngle: number;
  sensorDistance: number;
  turnSpeed: number;
  antColor: string;
  pheromoneColor: string;
  foodColor: string;
  nestColor: string;
  backgroundColor: string;
  resolution: number;
  animated: boolean;
  interactive: boolean;
  maxFood: number;
}

interface Ant { x: number; y: number; angle: number; hasFood: boolean; step: number }
interface FoodSource { x: number; y: number; amount: number; max: number; seed: number }

const FOOD_AMOUNT = 220;
const mix = (a: string, b: string, k: number) => {
  const A = a.split(",").map(Number), B = b.split(",").map(Number);
  return A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(",");
};

/**
 * Ant colony foraging. Ants leave the anthill, wander, and lay a "home" scent; the ones that
 * find food carry a crumb back while laying a "food" scent, and the others follow it, so
 * glowing trails form between the hill and each food pile and fade once the pile is gone.
 * Food is placed at the start and respawns; click to drop more.
 */
export function useAntColony(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseAntColonyOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext("2d")!;

    let cssW = 0, cssH = 0, dpr = 1, rafId = 0, t = 0;
    let ants: Ant[] = [];
    let foods: FoodSource[] = [];
    let foodPheromone = new Float32Array(0); // guides foragers to food
    let homePheromone = new Float32Array(0); // guides carriers home
    let gridW = 0, gridH = 0, nestX = 0, nestY = 0;
    let respawnAt = 0;

    const trail = document.createElement("canvas");
    const trailCtx = trail.getContext("2d")!;
    const ground = document.createElement("canvas");
    const groundCtx = ground.getContext("2d")!;
    let groundKey = "";
    let imgData: ImageData | null = null;
    let currentResolution = -1;

    const NEST_RADIUS = 18;
    const FOOD_RADIUS = 14;

    function initGrid(w: number, h: number) {
      const { resolution } = optionsRef.current;
      if (resolution === currentResolution && gridW > 0) return;
      currentResolution = resolution;
      gridW = Math.max(1, Math.round(w * resolution));
      gridH = Math.max(1, Math.round(h * resolution));
      foodPheromone = new Float32Array(gridW * gridH);
      homePheromone = new Float32Array(gridW * gridH);
      trail.width = gridW;
      trail.height = gridH;
      imgData = trailCtx.createImageData(gridW, gridH);
    }

    function placeFood(): FoodSource {
      const m = Math.min(cssW, cssH);
      for (let tries = 0; tries < 30; tries++) {
        const x = 30 + Math.random() * (cssW - 60);
        const y = 30 + Math.random() * (cssH - 60);
        if (Math.hypot(x - nestX, y - nestY) > m * 0.32 && foods.every((f) => Math.hypot(f.x - x, f.y - y) > 80)) {
          return { x, y, amount: FOOD_AMOUNT, max: FOOD_AMOUNT, seed: Math.random() * 100 };
        }
      }
      return { x: cssW * 0.15, y: cssH * 0.2, amount: FOOD_AMOUNT, max: FOOD_AMOUNT, seed: Math.random() * 100 };
    }

    function initScene(w: number, h: number) {
      const { antCount, maxFood } = optionsRef.current;
      nestX = w / 2;
      nestY = h / 2;
      ants = Array.from({ length: antCount }, () => ({ x: nestX, y: nestY, angle: Math.random() * Math.PI * 2, hasFood: false, step: Math.random() * 10 }));
      foods = [];
      for (let i = 0; i < Math.min(3, maxFood); i++) foods.push(placeFood());
    }

    function resize(w: number, h: number) {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      currentResolution = -1;
      groundKey = "";
      initGrid(w, h);
      initScene(w, h);
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function dropFood(clientX: number, clientY: number) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      if (foods.length < optionsRef.current.maxFood) {
        foods.push({ x: clientX - r.left, y: clientY - r.top, amount: FOOD_AMOUNT, max: FOOD_AMOUNT, seed: Math.random() * 100 });
      }
    }
    function onMouseDown(e: MouseEvent) { dropFood(e.clientX, e.clientY); }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      if (e.touches[0]) dropFood(e.touches[0].clientX, e.touches[0].clientY);
    }
    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    /** Soil texture: specks, grit, and a few fallen-leaf silhouettes, painted once per size/colour. */
    function paintGround(bg: string) {
      const key = `${cssW}|${cssH}|${bg}`;
      if (key === groundKey) return;
      groundKey = key;
      ground.width = Math.max(1, Math.round(cssW * dpr));
      ground.height = Math.max(1, Math.round(cssH * dpr));
      groundCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      groundCtx.fillStyle = `rgb(${bg})`;
      groundCtx.fillRect(0, 0, cssW, cssH);
      const n = Math.round((cssW * cssH) / 90);
      for (let i = 0; i < n; i++) {
        const light = Math.random() < 0.5;
        groundCtx.fillStyle = `rgba(${light ? mix(bg, "255,236,200", 0.25) : mix(bg, "0,0,0", 0.35)},${0.25 + Math.random() * 0.4})`;
        groundCtx.fillRect(Math.random() * cssW, Math.random() * cssH, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
      }
      for (let i = 0; i < Math.round((cssW * cssH) / 9000); i++) {
        const x = Math.random() * cssW, y = Math.random() * cssH, s = 10 + Math.random() * 18, a = Math.random() * Math.PI;
        groundCtx.save();
        groundCtx.translate(x, y);
        groundCtx.rotate(a);
        groundCtx.fillStyle = `rgba(${mix(bg, Math.random() < 0.5 ? "120,90,40" : "70,90,40", 0.35)},0.5)`;
        groundCtx.beginPath();
        groundCtx.ellipse(0, 0, s, s * 0.38, 0, 0, Math.PI * 2);
        groundCtx.fill();
        groundCtx.strokeStyle = `rgba(${mix(bg, "0,0,0", 0.3)},0.45)`;
        groundCtx.lineWidth = 0.8;
        groundCtx.beginPath();
        groundCtx.moveTo(-s, 0);
        groundCtx.lineTo(s, 0);
        groundCtx.stroke();
        groundCtx.restore();
      }
      const vg = groundCtx.createRadialGradient(cssW / 2, cssH / 2, Math.min(cssW, cssH) * 0.3, cssW / 2, cssH / 2, Math.hypot(cssW, cssH) / 2);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(0,0,0,0.4)");
      groundCtx.fillStyle = vg;
      groundCtx.fillRect(0, 0, cssW, cssH);
    }

    function samplePheromone(grid: Float32Array, gx: number, gy: number): number {
      const ix = Math.max(0, Math.min(gridW - 1, gx | 0));
      const iy = Math.max(0, Math.min(gridH - 1, gy | 0));
      return grid[iy * gridW + ix];
    }

    function drawAnt(a: Ant, body: string, food: string) {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.angle);
      // six legs, alternating tripod gait
      ctx.strokeStyle = `rgba(${mix(body, "0,0,0", 0.25)},0.95)`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const swing = Math.sin(a.step * 1.4 + (i % 2 ? Math.PI : 0)) * 1.2;
        const x = 0.6 - i * 1.3;
        ctx.moveTo(x, 0); ctx.lineTo(x + 1.2 + swing, -3.2);
        ctx.moveTo(x, 0); ctx.lineTo(x + 1.2 - swing, 3.2);
      }
      ctx.stroke();
      ctx.fillStyle = `rgb(${body})`;
      ctx.beginPath(); ctx.ellipse(-3.2, 0, 2.3, 1.6, 0, 0, Math.PI * 2); ctx.fill(); // abdomen
      ctx.beginPath(); ctx.ellipse(-0.2, 0, 1.3, 0.85, 0, 0, Math.PI * 2); ctx.fill(); // thorax
      ctx.beginPath(); ctx.ellipse(2, 0, 1.25, 1.05, 0, 0, Math.PI * 2); ctx.fill(); // head
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath(); ctx.ellipse(-3.6, -0.6, 1, 0.5, 0, 0, Math.PI * 2); ctx.fill();
      if (a.hasFood) {
        ctx.fillStyle = `rgb(${food})`;
        ctx.beginPath(); ctx.ellipse(3.9, 0, 1.4, 1.2, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }

    let last = 0;
    function loop(now: number) {
      rafId = requestAnimationFrame(loop);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;
      t += dt;
      const o = optionsRef.current;
      if (cssW === 0) return;
      if (o.resolution !== currentResolution) { currentResolution = -1; initGrid(cssW, cssH); }
      if (!imgData) return;
      // live antCount / maxFood: new ants hatch at the nest, extras retire
      if (ants.length > o.antCount) ants.length = Math.max(0, o.antCount);
      while (ants.length < o.antCount) ants.push({ x: nestX, y: nestY, angle: Math.random() * Math.PI * 2, hasFood: false, step: Math.random() * 10 });
      if (foods.length > o.maxFood) foods.length = Math.max(0, o.maxFood);

      const bg = hexToRgbString(o.backgroundColor);
      const ph = hexToRgbString(o.pheromoneColor);
      const antRgb = hexToRgbString(o.antColor);
      const foodRgb = hexToRgbString(o.foodColor);
      const nestRgb = hexToRgbString(o.nestColor);
      paintGround(bg);

      const scaleX = cssW / gridW, scaleY = cssH / gridH;

      if (o.animated) {
        for (let i = 0; i < foodPheromone.length; i++) {
          foodPheromone[i] *= 1 - o.evaporationRate;
          homePheromone[i] *= 1 - o.evaporationRate;
          if (foodPheromone[i] < 0.001) foodPheromone[i] = 0;
          if (homePheromone[i] < 0.001) homePheromone[i] = 0;
        }
        if (o.diffusionRate > 0) {
          const df = o.diffusionRate * 0.25;
          for (let y = 1; y < gridH - 1; y++) {
            for (let x = 1; x < gridW - 1; x++) {
              const idx = y * gridW + x;
              const fp = foodPheromone, hp = homePheromone;
              fp[idx] += ((fp[idx - 1] + fp[idx + 1] + fp[idx - gridW] + fp[idx + gridW]) * 0.25 - fp[idx]) * df;
              hp[idx] += ((hp[idx - 1] + hp[idx + 1] + hp[idx - gridW] + hp[idx + gridW]) * 0.25 - hp[idx]) * df;
            }
          }
        }

        for (const ant of ants) {
          const follow = ant.hasFood ? homePheromone : foodPheromone;
          const sense = (angle: number) =>
            samplePheromone(follow, (ant.x + Math.cos(angle) * o.sensorDistance) / scaleX, (ant.y + Math.sin(angle) * o.sensorDistance) / scaleY);
          const sL = sense(ant.angle - o.sensorAngle), sC = sense(ant.angle), sR = sense(ant.angle + o.sensorAngle);
          if (sC >= sL && sC >= sR) { /* keep going */ }
          else if (sL > sR) ant.angle -= o.turnSpeed * Math.random();
          else if (sR > sL) ant.angle += o.turnSpeed * Math.random();
          else ant.angle += (Math.random() - 0.5) * o.turnSpeed;
          // carriers also feel a gentle pull home, so trails close into loops
          if (ant.hasFood) {
            const home = Math.atan2(nestY - ant.y, nestX - ant.x);
            ant.angle += Math.atan2(Math.sin(home - ant.angle), Math.cos(home - ant.angle)) * 0.04;
          }
          ant.angle += (Math.random() - 0.5) * 0.2;
          ant.x += Math.cos(ant.angle) * o.antSpeed;
          ant.y += Math.sin(ant.angle) * o.antSpeed;
          ant.step += o.antSpeed * 0.6;

          if (ant.x < 0) { ant.x = 0; ant.angle = Math.PI - ant.angle; }
          else if (ant.x >= cssW) { ant.x = cssW - 1; ant.angle = Math.PI - ant.angle; }
          if (ant.y < 0) { ant.y = 0; ant.angle = -ant.angle; }
          else if (ant.y >= cssH) { ant.y = cssH - 1; ant.angle = -ant.angle; }

          const gx = Math.max(0, Math.min(gridW - 1, (ant.x / scaleX) | 0));
          const gy = Math.max(0, Math.min(gridH - 1, (ant.y / scaleY) | 0));
          const pidx = gy * gridW + gx;
          if (ant.hasFood) foodPheromone[pidx] = Math.min(255, foodPheromone[pidx] + o.pheromoneStrength);
          else homePheromone[pidx] = Math.min(255, homePheromone[pidx] + o.pheromoneStrength);

          if (ant.hasFood && (ant.x - nestX) ** 2 + (ant.y - nestY) ** 2 < NEST_RADIUS * NEST_RADIUS) {
            ant.hasFood = false;
            ant.angle += Math.PI;
          }
          if (!ant.hasFood) {
            for (let fi = foods.length - 1; fi >= 0; fi--) {
              const f = foods[fi];
              if ((ant.x - f.x) ** 2 + (ant.y - f.y) ** 2 < FOOD_RADIUS * FOOD_RADIUS && f.amount > 0) {
                ant.hasFood = true;
                ant.angle += Math.PI;
                f.amount--;
                if (f.amount <= 0) foods.splice(fi, 1);
                break;
              }
            }
          }
        }

        // keep a few food piles around
        if (foods.length < Math.min(3, o.maxFood)) {
          if (respawnAt === 0) respawnAt = t + 3;
          else if (t > respawnAt) { foods.push(placeFood()); respawnAt = 0; }
        }
      }

      // trails: food scent glows in the trail colour, home scent is a faint pale wash
      const data = imgData.data;
      const norm = Math.max(1, o.pheromoneStrength * 8);
      const [pr, pg, pb] = ph.split(",").map(Number);
      for (let i = 0; i < gridW * gridH; i++) {
        const tf = Math.min(1, foodPheromone[i] / norm);
        const th = Math.min(1, homePheromone[i] / norm) * 0.35;
        const i4 = i * 4;
        data[i4] = Math.min(255, pr * tf + 230 * th);
        data[i4 + 1] = Math.min(255, pg * tf + 215 * th);
        data[i4 + 2] = Math.min(255, pb * tf + 180 * th);
        data[i4 + 3] = Math.min(255, (tf * 1.15 + th) * 255);
      }
      trailCtx.putImageData(imgData, 0, 0);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.drawImage(ground, 0, 0, cssW, cssH);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(trail, 0, 0, cssW, cssH);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.45;
      ctx.drawImage(trail, -2, -2, cssW + 4, cssH + 4);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";

      // anthill: a mound with a dark entrance
      const mound = ctx.createRadialGradient(nestX - 6, nestY - 8, 2, nestX, nestY, NEST_RADIUS * 2.1);
      mound.addColorStop(0, `rgb(${mix(nestRgb, "255,230,190", 0.25)})`);
      mound.addColorStop(0.6, `rgb(${nestRgb})`);
      mound.addColorStop(1, `rgba(${nestRgb},0)`);
      ctx.fillStyle = mound;
      ctx.beginPath();
      ctx.arc(nestX, nestY, NEST_RADIUS * 2.1, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 26; i++) {
        const a = i * 2.39996, r = NEST_RADIUS * (0.6 + ((i * 37) % 13) / 13 * 1.2);
        ctx.fillStyle = `rgba(${mix(nestRgb, i % 2 ? "0,0,0" : "255,230,190", 0.3)},0.8)`;
        ctx.fillRect(nestX + Math.cos(a) * r, nestY + Math.sin(a) * r, 1.6, 1.6);
      }
      const hole = ctx.createRadialGradient(nestX, nestY, 0, nestX, nestY, NEST_RADIUS * 0.5);
      hole.addColorStop(0, "rgba(10,6,2,1)");
      hole.addColorStop(1, "rgba(10,6,2,0)");
      ctx.fillStyle = hole;
      ctx.beginPath();
      ctx.arc(nestX, nestY, NEST_RADIUS * 0.5, 0, Math.PI * 2);
      ctx.fill();

      // food piles: berry clusters that shrink as they're carried off
      for (const f of foods) {
        const left = Math.ceil((f.amount / f.max) * 14);
        const halo = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, FOOD_RADIUS * 2);
        halo.addColorStop(0, `rgba(${foodRgb},0.25)`);
        halo.addColorStop(1, `rgba(${foodRgb},0)`);
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(f.x, f.y, FOOD_RADIUS * 2, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < left; i++) {
          const a = i * 2.39996 + f.seed, r = Math.sqrt(i / 14) * FOOD_RADIUS * 0.85;
          const x = f.x + Math.cos(a) * r, y = f.y + Math.sin(a) * r;
          const g = ctx.createRadialGradient(x - 1, y - 1, 0.3, x, y, 3.2);
          g.addColorStop(0, `rgb(${mix(foodRgb, "255,255,255", 0.55)})`);
          g.addColorStop(1, `rgb(${mix(foodRgb, "0,0,0", 0.25)})`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(x, y, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const ant of ants) drawAnt(ant, antRgb, foodRgb);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
      parent.removeEventListener("mousedown", onMouseDown);
      parent.removeEventListener("touchstart", onTouchStart);
    };
  }, [canvasRef]);
}
