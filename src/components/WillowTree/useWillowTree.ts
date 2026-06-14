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

interface Branch {
  originX: number; originY: number;  // point on trunk where branch starts
  tipX: number; tipY: number;        // branch endpoint (where strands hang from)
  width: number;
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

const STRAND_SPRING = 0.035;
const STRAND_DAMPING = 0.80;
const NODES_PER_STRAND = 14;

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
    const branches: Branch[] = [];
    const fallingLeaves: FallingLeaf[] = [];
    const mouse = { x: -1, normalizedX: 0 };

    function buildTree() {
      const { branchCount, strandCount } = optionsRef.current;
      trunk.length = 0; branches.length = 0;

      const cx = w / 2;
      const trunkBaseY = h * 0.97;
      const trunkTopY  = h * 0.22;
      const trunkH = trunkBaseY - trunkTopY;
      const segs = 8;

      // Build trunk with slight natural lean
      for (let i = 0; i < segs; i++) {
        const t0 = i / segs, t1 = (i + 1) / segs;
        const xOff = Math.sin(t0 * Math.PI * 0.9) * w * 0.012;
        trunk.push({
          x1: cx + xOff,     y1: trunkBaseY - t0 * trunkH,
          x2: cx + xOff * 1.05, y2: trunkBaseY - t1 * trunkH,
          w: 24 * (1 - t0 * 0.72),
        });
      }

      // Spread branches along upper 50-100% of trunk
      for (let b = 0; b < branchCount; b++) {
        // Alternate left/right, denser near top
        const side = b % 2 === 0 ? 1 : -1;
        // Distribute from top down so topmost branches are first
        const fracAlongTrunk = 0.45 + (b / branchCount) * 0.52;
        const segIdx = Math.min(Math.floor(fracAlongTrunk * segs), segs - 1);
        const seg = trunk[segIdx];
        // Origin: midpoint of that trunk segment
        const originX = (seg.x1 + seg.x2) * 0.5;
        const originY = (seg.y1 + seg.y2) * 0.5;

        // Branch tip: arches outward and slightly upward
        const reach = w * (0.18 + Math.random() * 0.16);
        const tipX  = originX + side * reach;
        const tipY  = originY - h * (0.03 + Math.random() * 0.04);

        // Build hanging strands distributed across the branch
        const strandArr: Strand[] = [];
        for (let s = 0; s < strandCount; s++) {
          // Space strands from 20% along the branch to the tip
          const tParam = 0.2 + (s / Math.max(strandCount - 1, 1)) * 0.8;
          const hangX  = originX + (tipX - originX) * tParam;
          const hangY  = originY + (tipY - originY) * tParam;
          const len    = h * (0.35 + Math.random() * 0.25);

          const nodes: StrandNode[] = [];
          for (let n = 0; n < NODES_PER_STRAND; n++) {
            const frac = n / (NODES_PER_STRAND - 1);
            nodes.push({
              x: hangX,           y: hangY + frac * len,
              vx: 0,              vy: 0,
              baseX: hangX,       baseY: hangY + frac * len,
            });
          }
          strandArr.push({ nodes, phase: Math.random() * Math.PI * 2 });
        }

        branches.push({
          originX, originY,
          tipX, tipY,
          width: 3.5 * (1 - fracAlongTrunk * 0.5),
          strands: strandArr,
        });
      }
    }

    function applyDpr(width: number, height: number) {
      const dpr = window.devicePixelRatio || 1;
      canvas!.width  = Math.round(width  * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width  = `${width}px`;
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

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, opts.skyColor);
      grad.addColorStop(1, opts.groundColor);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      const windX = opts.interactive && mouse.x >= 0
        ? mouse.normalizedX * 2.0
        : Math.sin(t * 0.35) * 0.7 + Math.sin(t * 0.17) * 0.3;

      // Rebuild if branch count changed
      if (branches.length !== opts.branchCount) buildTree();

      // Physics: pin node[0] to its base, simulate rest
      for (const br of branches) {
        for (const strand of br.strands) {
          const { nodes, phase } = strand;
          nodes[0].x = nodes[0].baseX;
          nodes[0].y = nodes[0].baseY;
          for (let n = 1; n < nodes.length; n++) {
            const nd = nodes[n];
            const depthFactor = n / nodes.length;
            const windForce = windX * depthFactor * 1.0;
            const sway      = Math.sin(t * 0.8 + phase + n * 0.25) * 0.18;
            const fx = (nd.baseX - nd.x) + windForce + sway;
            const fy = (nd.baseY - nd.y);
            nd.vx = (nd.vx + fx * STRAND_SPRING) * STRAND_DAMPING;
            nd.vy = (nd.vy + fy * STRAND_SPRING) * STRAND_DAMPING;
            nd.x += nd.vx;
            nd.y += nd.vy;
          }
        }
      }

      // Draw trunk (bottom-to-top so wider segments are behind thinner)
      ctx.lineCap = "round";
      for (const seg of trunk) {
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = seg.w;
        ctx.stroke();
      }

      // Draw branches: arc from origin on trunk out to tip
      for (const br of branches) {
        ctx.beginPath();
        ctx.moveTo(br.originX, br.originY);
        // Control point pulls slightly upward for a natural arch
        const cpX = br.originX + (br.tipX - br.originX) * 0.45;
        const cpY = br.originY - h * 0.06;
        ctx.quadraticCurveTo(cpX, cpY, br.tipX, br.tipY);
        ctx.strokeStyle = opts.trunkColor;
        ctx.lineWidth = Math.max(br.width, 1);
        ctx.stroke();

        // Draw hanging strands
        for (const strand of br.strands) {
          const { nodes } = strand;
          // Strand line
          ctx.beginPath();
          ctx.moveTo(nodes[0].x, nodes[0].y);
          for (let n = 1; n < nodes.length; n++) {
            ctx.lineTo(nodes[n].x, nodes[n].y);
          }
          ctx.strokeStyle = hexToRgba(opts.leafColor, 0.75);
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Leaf clusters at every other node
          for (let n = 1; n < nodes.length; n += 2) {
            const alpha = 0.6 + (n / nodes.length) * 0.3;
            ctx.beginPath();
            ctx.ellipse(nodes[n].x, nodes[n].y, 3.5, 2, Math.PI / 4, 0, Math.PI * 2);
            ctx.fillStyle = hexToRgba(opts.leafColor, alpha);
            ctx.fill();
          }
        }
      }

      // Falling leaves
      if (opts.showFallingLeaves) {
        if (Math.random() < 0.04 && fallingLeaves.length < 40 && branches.length > 0) {
          const br = branches[Math.floor(Math.random() * branches.length)];
          const st = br.strands[Math.floor(Math.random() * br.strands.length)];
          const nd = st.nodes[Math.floor(Math.random() * (st.nodes.length - 1)) + 1];
          fallingLeaves.push({
            x: nd.x, y: nd.y,
            vx: windX * 0.4 + (Math.random() - 0.5) * 0.4,
            vy: 0.4 + Math.random() * 0.7,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.1,
            alpha: 0.85,
            size: 3 + Math.random() * 3,
          });
        }
        for (let i = fallingLeaves.length - 1; i >= 0; i--) {
          const lf = fallingLeaves[i];
          lf.x  += lf.vx + windX * 0.25;
          lf.y  += lf.vy;
          lf.rotation += lf.rotSpeed;
          lf.alpha -= 0.0025;
          if (lf.alpha <= 0 || lf.y > h + 10) { fallingLeaves.splice(i, 1); continue; }
          ctx.save();
          ctx.translate(lf.x, lf.y);
          ctx.rotate(lf.rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, lf.size, lf.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = hexToRgba(opts.leafColor, lf.alpha);
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
