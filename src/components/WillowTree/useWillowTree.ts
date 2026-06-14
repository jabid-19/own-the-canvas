// src/components/WillowTree/useWillowTree.ts
import { useRef, useEffect, RefObject } from "react";
import { hexToRgba } from "../../utils/color";

interface StrandNode {
  x: number; y: number;
  vx: number; vy: number;
  baseX: number; baseY: number;
}

interface Strand {
  nodes: StrandNode[];
  phase: number;
}

interface BranchPoint {
  x: number; y: number;
  strands: Strand[];
}

interface FallingLeaf {
  x: number; y: number;
  vx: number; vy: number;
  rotation: number;
  rotSpeed: number;
  alpha: number;
  size: number;
}

interface TrunkSegment {
  x1: number; y1: number;
  x2: number; y2: number;
  w: number;
}

export interface UseWillowTreeOptions {
  trunkColor: string;
  leafColor: string;
  skyColor: string;
  groundColor: string;
  branchCount: number;
  strandCount: number;
  interactive: boolean;
  showFallingLeaves: boolean;
}

const STRAND_SPRING = 0.04;
const STRAND_DAMPING = 0.82;
const NODES_PER_STRAND = 12;

export function useWillowTree(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  options: UseWillowTreeOptions
) {
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, t = 0;

    const trunk: TrunkSegment[] = [];
    const branches: BranchPoint[] = [];
    const fallingLeaves: FallingLeaf[] = [];
    const mouse = { x: -1, normalizedX: 0 };

    function buildTree() {
      const { branchCount, strandCount } = optionsRef.current;
      trunk.length = 0; branches.length = 0;

      const cx = w / 2;
      const trunkBaseY = h;
      const trunkTopY = h * 0.35;
      const trunkH = trunkBaseY - trunkTopY;
      const segs = 6;

      for (let i = 0; i < segs; i++) {
        const t0 = i / segs, t1 = (i + 1) / segs;
        const lean = Math.sin(t0 * Math.PI) * w * 0.02;
        trunk.push({
          x1: cx + lean, y1: trunkBaseY - t0 * trunkH,
          x2: cx + lean * 1.1, y2: trunkBaseY - t1 * trunkH,
          w: 18 * (1 - t0 * 0.6),
        });
      }

      for (let b = 0; b < branchCount; b++) {
        const frac = 0.1 + (b / branchCount) * 0.85;
        const segIdx = Math.min(Math.floor(frac * segs), segs - 1);
        const seg = trunk[segIdx];
        const bx = seg.x2 + (Math.random() - 0.5) * w * 0.08;
        const by = seg.y2 + (Math.random() - 0.5) * h * 0.04;
        const branchReach = w * (0.15 + Math.random() * 0.2) * (Math.random() < 0.5 ? 1 : -1);
        const hangX = bx + branchReach;
        const hangY = by - h * 0.02;

        const strands: Strand[] = [];
        for (let s = 0; s < strandCount; s++) {
          const startX = hangX + (s / strandCount - 0.5) * Math.abs(branchReach) * 0.8;
          const strandLen = h * (0.3 + Math.random() * 0.25);
          const nodes: StrandNode[] = [];
          for (let n = 0; n < NODES_PER_STRAND; n++) {
            const frac2 = n / (NODES_PER_STRAND - 1);
            const bx2 = startX, by2 = hangY + frac2 * strandLen;
            nodes.push({ x: bx2, y: by2, vx: 0, vy: 0, baseX: bx2, baseY: by2 });
          }
          strands.push({ nodes, phase: Math.random() * Math.PI * 2 });
        }
        branches.push({ x: bx, y: by, strands });
      }
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      w = width; h = height;
      buildTree();
    }

    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) applyDpr(width, height);
    });
    ro.observe(parent);
    const rect = parent.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) applyDpr(rect.width, rect.height);

    function onMouseMove(e: MouseEvent) {
      const r = canvas!.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.normalizedX = (mouse.x / w) * 2 - 1;
    }
    function onMouseLeave() { mouse.x = -1; mouse.normalizedX = 0; }
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);

    let raf = 0;
    function loop() {
      t += 0.016;
      const opts = optionsRef.current;

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, opts.skyColor);
      grad.addColorStop(1, opts.groundColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const windX = opts.interactive && mouse.x >= 0
        ? mouse.normalizedX * 1.8
        : Math.sin(t * 0.4) * 0.6;

      // rebuild if branch count changed
      if (branches.length !== opts.branchCount) buildTree();

      for (const branch of branches) {
        for (const strand of branch.strands) {
          const { nodes, phase } = strand;
          nodes[0].x = nodes[0].baseX; nodes[0].y = nodes[0].baseY;
          for (let n = 1; n < nodes.length; n++) {
            const nd = nodes[n];
            const windForce = windX * (n / nodes.length) * 0.8;
            const sway = Math.sin(t * 0.9 + phase + n * 0.3) * 0.15;
            const fx = nd.baseX - nd.x + windForce + sway;
            const fy = nd.baseY - nd.y;
            nd.vx = (nd.vx + fx * STRAND_SPRING) * STRAND_DAMPING;
            nd.vy = (nd.vy + fy * STRAND_SPRING) * STRAND_DAMPING;
            nd.x += nd.vx; nd.y += nd.vy;
          }
        }
      }

      // draw trunk
      ctx.lineCap = "round";
      for (const seg of trunk) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = seg.w;
        ctx.stroke();
      }

      // draw branch stubs + strands
      const lastSeg = trunk[trunk.length - 1];
      for (const branch of branches) {
        ctx.beginPath();
        ctx.moveTo(lastSeg.x2, lastSeg.y2);
        ctx.quadraticCurveTo(branch.x, branch.y - h * 0.05, branch.x, branch.y);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = 4;
        ctx.stroke();

        for (const strand of branch.strands) {
          const { nodes } = strand;
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          for (let n = 1; n < nodes.length; n++) ctx.lineTo(nodes[n].x, nodes[n].y);
          ctx.strokeStyle = hexToRgba(opts.leafColor, 0.7);
          ctx.lineWidth = 1.5;
          ctx.stroke();

          for (let n = 0; n < nodes.length; n += 2) {
            ctx.beginPath();
            ctx.ellipse(nodes[n].x, nodes[n].y, 3, 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(opts.leafColor, 0.8);
            ctx.fill();
          }
        }
      }

      // falling leaves
      if (opts.showFallingLeaves) {
        if (Math.random() < 0.03 && fallingLeaves.length < 30 && branches.length > 0) {
          const branch = branches[Math.floor(Math.random() * branches.length)];
          const strand = branch.strands[Math.floor(Math.random() * branch.strands.length)];
          const nd = strand.nodes[Math.floor(Math.random() * strand.nodes.length)];
          fallingLeaves.push({ x: nd.x, y: nd.y, vx: windX * 0.5 + (Math.random() - 0.5) * 0.5, vy: 0.5 + Math.random() * 0.8, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.08, alpha: 0.9, size: 3 + Math.random() * 3 });
        }
        for (let i = fallingLeaves.length - 1; i >= 0; i--) {
          const leaf = fallingLeaves[i];
          leaf.x += leaf.vx + windX * 0.3;
          leaf.y += leaf.vy;
          leaf.rotation += leaf.rotSpeed;
          leaf.alpha -= 0.003;
          if (leaf.alpha <= 0 || leaf.y > h + 10) { fallingLeaves.splice(i, 1); continue; }
          ctx.save();
          ctx.translate(leaf.x, leaf.y);
          ctx.rotate(leaf.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, leaf.size, leaf.size * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(opts.leafColor, leaf.alpha);
          ctx.fill();
          ctx.restore();
        }
      }

      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [canvasRef]);
}
