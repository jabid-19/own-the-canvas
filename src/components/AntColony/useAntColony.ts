import { useRef, useEffect, RefObject } from "react";
import { sampleGradient } from "../../utils/color";

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

interface Ant {
  x: number;
  y: number;
  angle: number;
  hasFood: boolean;
}

interface FoodSource {
  x: number;
  y: number;
  amount: number;
}

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

    let cssW = 0;
    let cssH = 0;
    let rafId = 0;

    let ants: Ant[] = [];
    let foods: FoodSource[] = [];
    let foodPheromone: Float32Array = new Float32Array(0);  // guides foragers
    let homePheromone: Float32Array = new Float32Array(0);  // guides food-carriers home
    let gridW = 0;
    let gridH = 0;
    let nestX = 0;
    let nestY = 0;

    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d")!;
    let imgData: ImageData | null = null;
    let currentResolution = -1;

    const NEST_RADIUS = 18;
    const FOOD_RADIUS = 12;

    function initGrid(w: number, h: number) {
      const { resolution } = optionsRef.current;
      if (resolution === currentResolution && gridW > 0) return;
      currentResolution = resolution;
      gridW = Math.max(1, Math.round(w * resolution));
      gridH = Math.max(1, Math.round(h * resolution));
      foodPheromone = new Float32Array(gridW * gridH);
      homePheromone = new Float32Array(gridW * gridH);
      offscreen.width = gridW;
      offscreen.height = gridH;
      imgData = offCtx.createImageData(gridW, gridH);
    }

    function initAnts(w: number, h: number) {
      const { antCount } = optionsRef.current;
      nestX = w / 2;
      nestY = h / 2;
      ants = Array.from({ length: antCount }, () => ({
        x: nestX,
        y: nestY,
        angle: Math.random() * Math.PI * 2,
        hasFood: false,
      }));
    }

    function resize(w: number, h: number) {
      const dpr = window.devicePixelRatio || 1;
      cssW = w;
      cssH = h;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      currentResolution = -1;
      initGrid(w, h);
      initAnts(w, h);
      foods = [];
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) resize(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) resize(rect.width, rect.height);

    function onMouseDown(e: MouseEvent) {
      if (!optionsRef.current.interactive) return;
      const r = canvas!.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      if (foods.length < optionsRef.current.maxFood) {
        foods.push({ x: mx, y: my, amount: 200 });
      }
    }
    function onTouchStart(e: TouchEvent) {
      if (!optionsRef.current.interactive) return;
      e.preventDefault();
      const r = canvas!.getBoundingClientRect();
      const mx = e.touches[0].clientX - r.left;
      const my = e.touches[0].clientY - r.top;
      if (foods.length < optionsRef.current.maxFood) {
        foods.push({ x: mx, y: my, amount: 200 });
      }
    }

    parent.addEventListener("mousedown", onMouseDown);
    parent.addEventListener("touchstart", onTouchStart, { passive: false });

    function samplePheromone(grid: Float32Array, gx: number, gy: number): number {
      const ix = Math.max(0, Math.min(gridW - 1, gx | 0));
      const iy = Math.max(0, Math.min(gridH - 1, gy | 0));
      return grid[iy * gridW + ix];
    }

    function loop() {
      const {
        evaporationRate, diffusionRate, pheromoneStrength,
        antSpeed, sensorAngle, sensorDistance, turnSpeed,
        antColor, pheromoneColor, backgroundColor, foodColor, nestColor,
        resolution, animated,
      } = optionsRef.current;

      if (resolution !== currentResolution) {
        currentResolution = -1;
        initGrid(cssW, cssH);
      }

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, cssW, cssH);

      if (!animated || gridW === 0 || !imgData) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      const scaleX = cssW / gridW;
      const scaleY = cssH / gridH;

      // Evaporate pheromones
      for (let i = 0; i < foodPheromone.length; i++) {
        foodPheromone[i] *= (1 - evaporationRate);
        homePheromone[i] *= (1 - evaporationRate);
        if (foodPheromone[i] < 0.001) foodPheromone[i] = 0;
        if (homePheromone[i] < 0.001) homePheromone[i] = 0;
      }

      // Diffuse (simple box blur approximation — skip for perf if diffusionRate = 0)
      if (diffusionRate > 0) {
        const dfactor = diffusionRate * 0.25;
        for (let y = 1; y < gridH - 1; y++) {
          for (let x = 1; x < gridW - 1; x++) {
            const idx = y * gridW + x;
            const fp = foodPheromone;
            const hp = homePheromone;
            const fpNeighbor = fp[idx-1] + fp[idx+1] + fp[idx-gridW] + fp[idx+gridW];
            const hpNeighbor = hp[idx-1] + hp[idx+1] + hp[idx-gridW] + hp[idx+gridW];
            fp[idx] += (fpNeighbor * 0.25 - fp[idx]) * dfactor;
            hp[idx] += (hpNeighbor * 0.25 - hp[idx]) * dfactor;
          }
        }
      }

      // Update ants
      for (const ant of ants) {
        // Sense pheromone on 3 directions
        const followGrid = ant.hasFood ? homePheromone : foodPheromone;
        const straight = ant.angle;
        const left = ant.angle - sensorAngle;
        const right = ant.angle + sensorAngle;

        const sense = (angle: number) => {
          const sx = ant.x + Math.cos(angle) * sensorDistance;
          const sy = ant.y + Math.sin(angle) * sensorDistance;
          return samplePheromone(followGrid, sx / scaleX, sy / scaleY);
        };

        const sL = sense(left);
        const sC = sense(straight);
        const sR = sense(right);

        if (sC >= sL && sC >= sR) {
          // keep going
        } else if (sL > sR) {
          ant.angle -= turnSpeed * Math.random();
        } else if (sR > sL) {
          ant.angle += turnSpeed * Math.random();
        } else {
          // equal — random wander
          ant.angle += (Math.random() - 0.5) * turnSpeed;
        }

        // Random wander component
        ant.angle += (Math.random() - 0.5) * 0.2;

        ant.x += Math.cos(ant.angle) * antSpeed;
        ant.y += Math.sin(ant.angle) * antSpeed;

        // Bounce off walls
        if (ant.x < 0) { ant.x = 0; ant.angle = Math.PI - ant.angle; }
        else if (ant.x >= cssW) { ant.x = cssW - 1; ant.angle = Math.PI - ant.angle; }
        if (ant.y < 0) { ant.y = 0; ant.angle = -ant.angle; }
        else if (ant.y >= cssH) { ant.y = cssH - 1; ant.angle = -ant.angle; }

        // Deposit pheromone
        const gx = Math.max(0, Math.min(gridW - 1, (ant.x / scaleX) | 0));
        const gy = Math.max(0, Math.min(gridH - 1, (ant.y / scaleY) | 0));
        const pidx = gy * gridW + gx;
        if (ant.hasFood) {
          foodPheromone[pidx] = Math.min(255, foodPheromone[pidx] + pheromoneStrength);
        } else {
          homePheromone[pidx] = Math.min(255, homePheromone[pidx] + pheromoneStrength);
        }

        // Check nest
        const dNestX = ant.x - nestX;
        const dNestY = ant.y - nestY;
        if (ant.hasFood && dNestX * dNestX + dNestY * dNestY < NEST_RADIUS * NEST_RADIUS) {
          ant.hasFood = false;
          ant.angle += Math.PI;
        }

        // Check food sources
        if (!ant.hasFood) {
          for (let fi = foods.length - 1; fi >= 0; fi--) {
            const f = foods[fi];
            const dx = ant.x - f.x;
            const dy = ant.y - f.y;
            if (dx * dx + dy * dy < FOOD_RADIUS * FOOD_RADIUS && f.amount > 0) {
              ant.hasFood = true;
              ant.angle += Math.PI;
              f.amount--;
              if (f.amount <= 0) foods.splice(fi, 1);
              break;
            }
          }
        }
      }

      // Render pheromone grid to ImageData
      const [bgR, bgG, bgB] = sampleGradient([backgroundColor], 0);
      const [phR, phG, phB] = sampleGradient([pheromoneColor], 0);
      const data = imgData!.data;
      const total = gridW * gridH;

      const normFactor = Math.max(1, pheromoneStrength * 8);
      for (let i = 0; i < total; i++) {
        const fp = foodPheromone[i] / normFactor;
        const hp = homePheromone[i] / normFactor;
        const t = Math.min(1, fp + hp);
        const i4 = i * 4;
        data[i4]     = (bgR + (phR - bgR) * t) | 0;
        data[i4 + 1] = (bgG + (phG - bgG) * t) | 0;
        data[i4 + 2] = (bgB + (phB - bgB) * t) | 0;
        data[i4 + 3] = 255;
      }

      offCtx.putImageData(imgData!, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "medium";
      ctx.drawImage(offscreen, 0, 0, cssW, cssH);

      // Draw nest
      ctx.save();
      ctx.beginPath();
      ctx.arc(nestX, nestY, NEST_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = nestColor;
      ctx.fill();
      ctx.restore();

      // Draw food sources
      ctx.save();
      for (const f of foods) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, FOOD_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = foodColor;
        ctx.fill();
      }
      ctx.restore();

      // Draw ants
      ctx.save();
      ctx.fillStyle = antColor;
      for (const ant of ants) {
        ctx.beginPath();
        ctx.arc(ant.x, ant.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafId = requestAnimationFrame(loop);
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
