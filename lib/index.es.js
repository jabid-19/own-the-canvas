import { jsx as it, jsxs as Te } from "react/jsx-runtime";
import { useRef as G, useEffect as ft, forwardRef as ht, useImperativeHandle as gt } from "react";
const Le = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ", de = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", ze = "01";
function De(a) {
  return a === "katakana" ? Le : a === "latin" ? de : a === "binary" ? ze : a || de;
}
function qe(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0);
  ft(() => {
    const o = a.current;
    if (!o) return;
    const f = o.parentElement;
    if (!f) return;
    const y = o.getContext("2d");
    let h = 0, t = 0;
    function p(I, W) {
      const B = window.devicePixelRatio || 1;
      h = I, t = W, o.width = Math.round(h * B), o.height = Math.round(t * B), o.style.width = `${h}px`, o.style.height = `${t}px`, y.scale(B, B);
      const { fontSize: $ } = n.current, l = Math.floor(h / $);
      i.current = Array.from(
        { length: l },
        () => Math.floor(Math.random() * -(t / $))
      );
    }
    const e = new ResizeObserver((I) => {
      const { width: W, height: B } = I[0].contentRect;
      W > 0 && B > 0 && p(W, B);
    });
    e.observe(f);
    const s = f.getBoundingClientRect();
    s.width > 0 && s.height > 0 && p(s.width, s.height);
    let v = 0, S = 0;
    function z() {
      const { color: I, backgroundColor: W, fontSize: B, charset: $, resetThreshold: l } = n.current, r = $;
      y.fillStyle = W, y.fillRect(0, 0, h, t), y.fillStyle = I, y.font = `${B}px monospace`;
      const b = i.current;
      for (let F = 0; F < b.length; F++) {
        const M = r[Math.floor(Math.random() * r.length)];
        y.fillText(M, F * B, b[F] * B), b[F]++, b[F] * B > t && Math.random() > l && (b[F] = 0);
      }
    }
    function D(I) {
      const W = v ? I - v : 0;
      v = I, S += W;
      const { speed: B } = n.current;
      S >= B && (S = S % B, z()), c.current = requestAnimationFrame(D);
    }
    return c.current = requestAnimationFrame(D), () => {
      e.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [a]);
}
const We = {
  default: {},
  cyberpunk: {
    color: "#bf5fff",
    backgroundColor: "rgba(5,0,20,0.12)"
  },
  binary: {
    charset: "binary",
    color: "#00cfff",
    fontSize: 12,
    speed: 50
  },
  minimal: {
    color: "#4ade80",
    backgroundColor: "rgba(0,0,0,0.08)",
    speed: 40
  },
  blood: {
    color: "#dc2626",
    backgroundColor: "rgba(10,0,0,0.1)",
    charset: "latin"
  }
}, Ye = ht(
  (a, g) => {
    const {
      preset: n,
      color: i,
      backgroundColor: c,
      fontSize: o,
      speed: f,
      charset: y,
      resetThreshold: h,
      width: t,
      height: p,
      className: e,
      style: s
    } = a, v = n && We[n] || {}, S = G(null);
    gt(g, () => S.current);
    const z = De(y ?? v.charset ?? "latin");
    qe(S, {
      color: i ?? v.color ?? "#ffffff",
      backgroundColor: c ?? v.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: o ?? v.fontSize ?? 14,
      speed: f ?? v.speed ?? 33,
      charset: z,
      resetThreshold: h ?? v.resetThreshold ?? 0.95
    });
    const D = {
      width: t ?? "100%",
      height: p ?? "100%",
      display: "block",
      overflow: "hidden",
      ...s
    };
    return /* @__PURE__ */ it("div", { style: D, className: e, children: /* @__PURE__ */ it(
      "canvas",
      {
        ref: S,
        "aria-hidden": "true",
        role: "presentation",
        style: { display: "block" }
      }
    ) });
  }
);
Ye.displayName = "MatrixRain";
const Ot = /* @__PURE__ */ new Map();
function Ut(a) {
  if (Ot.has(a)) return Ot.get(a);
  let g = a.trim();
  g.startsWith("#") && (g = g.slice(1));
  let n, i, c;
  if (g.length === 3)
    n = parseInt(g[0] + g[0], 16), i = parseInt(g[1] + g[1], 16), c = parseInt(g[2] + g[2], 16);
  else if (g.length === 6)
    n = parseInt(g.slice(0, 2), 16), i = parseInt(g.slice(2, 4), 16), c = parseInt(g.slice(4, 6), 16);
  else
    return Ot.set(a, null), null;
  if (isNaN(n) || isNaN(i) || isNaN(c))
    return Ot.set(a, null), null;
  const o = [n, i, c];
  return Ot.set(a, o), o;
}
function pt(a, g = 1) {
  const n = Ut(a);
  return n ? `rgba(${n[0]},${n[1]},${n[2]},${g})` : `rgba(255,255,255,${g})`;
}
function vt(a) {
  const g = Ut(a);
  return g ? `${g[0]},${g[1]},${g[2]}` : "255,255,255";
}
function Xe(a, g, n) {
  return [a[0] + (g[0] - a[0]) * n, a[1] + (g[1] - a[1]) * n, a[2] + (g[2] - a[2]) * n];
}
function Rt(a, g) {
  const n = Math.max(0, Math.min(1, g));
  if (a.length === 0) return [255, 255, 255];
  if (a.length === 1) return Ut(a[0]) ?? [255, 255, 255];
  const i = n * (a.length - 1), c = Math.min(Math.floor(i), a.length - 2), o = i - c, f = Ut(a[c]) ?? [255, 255, 255], y = Ut(a[c + 1]) ?? [255, 255, 255];
  return Xe(f, y, o);
}
function Ge(a, g) {
  const n = G([]), i = G(null), c = G(null), o = G(g);
  o.current = g;
  const f = G(0), y = G(""), h = G(""), t = G(""), p = G(""), e = G(null);
  ft(() => {
    var s;
    (s = e.current) == null || s.call(e);
  }, [g.particleCount, g.particleSize]), ft(() => {
    const s = a.current;
    if (!s) return;
    const v = s, S = v.parentElement;
    if (!S) return;
    const z = v.getContext("2d");
    let D = 0, I = 0;
    function W(C, x) {
      const { particleCount: d, particleSize: m, speed: u, velocityMultiplier: R, twinkle: k } = o.current;
      n.current = Array.from({ length: d }, () => ({
        x: Math.random() * C,
        y: Math.random() * x,
        vx: (Math.random() - 0.5) * u * R,
        vy: (Math.random() - 0.5) * u * R,
        size: Math.random() * m + m * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        twinklePhase: k ? Math.random() * Math.PI * 2 : void 0
      }));
    }
    function B(C, x) {
      const d = window.devicePixelRatio || 1;
      v.width = Math.round(C * d), v.height = Math.round(x * d), v.style.width = `${C}px`, v.style.height = `${x}px`, z.scale(d, d), D = C, I = x, W(C, x);
    }
    e.current = () => {
      D > 0 && I > 0 && W(D, I);
    };
    const $ = new ResizeObserver((C) => {
      const { width: x, height: d } = C[0].contentRect;
      x > 0 && d > 0 && B(x, d);
    });
    $.observe(S);
    const l = S.getBoundingClientRect();
    l.width > 0 && l.height > 0 && B(l.width, l.height);
    function r(C) {
      const x = v.getBoundingClientRect();
      return { x: C.clientX - x.left, y: C.clientY - x.top };
    }
    function b(C) {
      if (!o.current.dragParticles) return;
      const { x, y: d } = r(C), m = n.current, { dragRadius: u } = o.current;
      let R = -1, k = u;
      for (let L = 0; L < m.length; L++) {
        const T = m[L].x - x, A = m[L].y - d, E = Math.sqrt(T * T + A * A);
        E < k && (k = E, R = L);
      }
      R !== -1 && (c.current = { particleIndex: R, offsetX: m[R].x - x, offsetY: m[R].y - d });
    }
    function F(C) {
      const { x, y: d } = r(C);
      if (c.current) {
        const m = n.current[c.current.particleIndex];
        m.x = x + c.current.offsetX, m.y = d + c.current.offsetY, m.vx = 0, m.vy = 0;
      }
      o.current.interactive && (i.current = { x, y: d });
    }
    function M() {
      c.current = null;
    }
    function P() {
      i.current = null, c.current = null;
    }
    v.addEventListener("mousedown", b), v.addEventListener("mousemove", F), v.addEventListener("mouseup", M), v.addEventListener("mouseleave", P);
    function w() {
      const {
        particleColor: C,
        lineColor: x,
        lineDistance: d,
        connectParticles: m,
        backgroundColor: u,
        speed: R,
        repelRadius: k,
        repelStrength: L,
        friction: T,
        maxVelocityMultiplier: A,
        lineWidth: E,
        lineOpacity: Y,
        wrapEdges: q,
        twinkle: X,
        twinkleSpeed: V,
        twinkleAmplitude: j,
        glowParticles: H,
        glowBlur: _,
        lineStyle: O
      } = o.current;
      C !== t.current && (y.current = vt(C), t.current = C), x !== p.current && (h.current = vt(x), p.current = x);
      const N = n.current, K = i.current, U = y.current, Q = h.current;
      z.clearRect(0, 0, D, I), u && u !== "transparent" && (z.fillStyle = u, z.fillRect(0, 0, D, I));
      for (let ot = 0; ot < N.length; ot++) {
        const J = N[ot];
        if (c.current && c.current.particleIndex === ot) continue;
        if (K) {
          const nt = J.x - K.x, rt = J.y - K.y, Z = Math.sqrt(nt * nt + rt * rt);
          if (Z < k && Z > 0) {
            const at = (k - Z) / k * 2;
            J.vx += nt / Z * at * L, J.vy += rt / Z * at * L;
          }
        }
        J.vx *= T, J.vy *= T;
        const et = R * A, tt = Math.sqrt(J.vx * J.vx + J.vy * J.vy);
        tt > et && (J.vx = J.vx / tt * et, J.vy = J.vy / tt * et), J.x += J.vx, J.y += J.vy, q ? (J.x < 0 ? J.x += D : J.x > D && (J.x -= D), J.y < 0 ? J.y += I : J.y > I && (J.y -= I)) : (J.x < 0 && (J.x = 0, J.vx *= -1), J.x > D && (J.x = D, J.vx *= -1), J.y < 0 && (J.y = 0, J.vy *= -1), J.y > I && (J.y = I, J.vy *= -1)), X && (J.twinklePhase === void 0 && (J.twinklePhase = Math.random() * Math.PI * 2), J.twinklePhase += V);
      }
      if (m) {
        O === "dashed" ? z.setLineDash([4, 6]) : z.setLineDash([]);
        for (let ot = 0; ot < N.length; ot++)
          for (let J = ot + 1; J < N.length; J++) {
            const et = N[ot].x - N[J].x, tt = N[ot].y - N[J].y, nt = Math.sqrt(et * et + tt * tt);
            if (nt < d) {
              const rt = (1 - nt / d) * Y;
              z.beginPath(), z.moveTo(N[ot].x, N[ot].y), z.lineTo(N[J].x, N[J].y), z.strokeStyle = `rgba(${Q},${rt})`, z.lineWidth = E, z.stroke();
            }
          }
        z.setLineDash([]);
      }
      for (let ot = 0; ot < N.length; ot++) {
        const J = N[ot], et = X && J.twinklePhase !== void 0 ? 1 - j + j * Math.sin(J.twinklePhase) : J.opacity;
        H && (z.shadowColor = C, z.shadowBlur = _), z.beginPath(), z.arc(J.x, J.y, J.size, 0, Math.PI * 2), z.fillStyle = `rgba(${U},${et})`, z.fill(), H && (z.shadowBlur = 0);
      }
      f.current = requestAnimationFrame(w);
    }
    return f.current = requestAnimationFrame(w), () => {
      $.disconnect(), cancelAnimationFrame(f.current), v.removeEventListener("mousedown", b), v.removeEventListener("mousemove", F), v.removeEventListener("mouseup", M), v.removeEventListener("mouseleave", P);
    };
  }, [a]);
}
const Oe = {
  default: {},
  galaxy: {
    particleColor: "#8B5CF6",
    lineColor: "#8B5CF6",
    backgroundColor: "#030014",
    particleCount: 80,
    lineDistance: 130
  },
  snow: {
    particleColor: "#dbeafe",
    lineColor: "#dbeafe",
    connectParticles: !1,
    particleCount: 160,
    speed: 0.3,
    backgroundColor: "transparent"
  },
  minimal: {
    connectParticles: !1,
    particleColor: "#4ade80",
    backgroundColor: "transparent",
    particleCount: 60
  },
  ocean: {
    particleColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    particleCount: 100,
    lineDistance: 110,
    speed: 0.5
  },
  cosmos: {
    particleColor: "#e0e7ff",
    lineColor: "#6366f1",
    backgroundColor: "#030014",
    particleCount: 80,
    lineDistance: 120,
    speed: 0.3,
    wrapEdges: !0,
    twinkle: !0,
    glowParticles: !0,
    velocityMultiplier: 0.3
  },
  aurora: {
    particleColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    particleCount: 80,
    lineDistance: 110,
    speed: 0.3,
    wrapEdges: !0,
    twinkle: !0,
    glowParticles: !0,
    lineStyle: "dashed",
    velocityMultiplier: 0.3
  },
  gold: {
    particleColor: "#fbbf24",
    lineColor: "#d97706",
    backgroundColor: "#0c0800",
    particleCount: 80,
    speed: 0.3,
    wrapEdges: !0,
    twinkle: !0,
    glowParticles: !0,
    lineOpacity: 0.4,
    velocityMultiplier: 0.3
  }
}, He = ht(
  (a, g) => {
    const {
      preset: n,
      particleCount: i,
      particleColor: c,
      lineColor: o,
      lineDistance: f,
      particleSize: y,
      speed: h,
      connectParticles: t,
      interactive: p,
      backgroundColor: e,
      repelRadius: s,
      repelStrength: v,
      friction: S,
      maxVelocityMultiplier: z,
      lineWidth: D,
      lineOpacity: I,
      wrapEdges: W,
      twinkle: B,
      twinkleSpeed: $,
      twinkleAmplitude: l,
      glowParticles: r,
      glowBlur: b,
      lineStyle: F,
      dragParticles: M,
      dragRadius: P,
      velocityMultiplier: w,
      width: C,
      height: x,
      className: d,
      style: m
    } = a, u = n && Oe[n] || {}, R = G(null);
    return gt(g, () => R.current), Ge(R, {
      particleCount: i ?? u.particleCount ?? 120,
      particleColor: c ?? u.particleColor ?? "#ffffff",
      lineColor: o ?? u.lineColor ?? "#6b7280",
      lineDistance: f ?? u.lineDistance ?? 120,
      particleSize: y ?? 2.5,
      speed: h ?? u.speed ?? 0.8,
      connectParticles: t ?? u.connectParticles ?? !0,
      interactive: p ?? !0,
      backgroundColor: e ?? u.backgroundColor ?? "transparent",
      repelRadius: s ?? 80,
      repelStrength: v ?? 0.3,
      friction: S ?? 0.99,
      maxVelocityMultiplier: z ?? 3,
      lineWidth: D ?? 0.8,
      lineOpacity: I ?? u.lineOpacity ?? 0.6,
      wrapEdges: W ?? u.wrapEdges ?? !1,
      twinkle: B ?? u.twinkle ?? !1,
      twinkleSpeed: $ ?? 0.03,
      twinkleAmplitude: l ?? 0.4,
      glowParticles: r ?? u.glowParticles ?? !1,
      glowBlur: b ?? 15,
      lineStyle: F ?? u.lineStyle ?? "solid",
      dragParticles: M ?? !1,
      dragRadius: P ?? 20,
      velocityMultiplier: w ?? u.velocityMultiplier ?? 2
    }), /* @__PURE__ */ it(
      "div",
      {
        className: d,
        style: {
          width: C ?? "100%",
          height: x ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: M ?? !1 ? "grab" : "default",
          ...m
        },
        children: /* @__PURE__ */ it("canvas", { ref: R, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
He.displayName = "ParticleField";
function je(a, g) {
  const n = G([]), i = G([]), c = G([]), o = G(g);
  o.current = g;
  const f = G(0), y = G(0), h = G(null);
  ft(() => {
    var t;
    (t = h.current) == null || t.call(h);
  }, [g.starCount]), ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t, e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(l, r) {
      const { starCount: b, starSizeMin: F, starSizeMax: M, starOpacityMin: P, starOpacityMax: w, twinkleSpeed: C } = o.current;
      n.current = Array.from({ length: b }, () => ({
        x: Math.random() * l,
        y: Math.random() * r,
        size: Math.random() * (M - F) + F,
        opacity: Math.random() * (w - P) + P,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * C + C * 0.3
      }));
    }
    function D(l, r) {
      const { starCount: b } = o.current, F = Math.max(l, r);
      i.current = Array.from({ length: b }, () => ({
        x: (Math.random() - 0.5) * l * 2,
        y: (Math.random() - 0.5) * r * 2,
        z: Math.random() * F,
        pz: 0
      }));
    }
    function I(l, r) {
      const b = window.devicePixelRatio || 1;
      p.width = Math.round(l * b), p.height = Math.round(r * b), p.style.width = `${l}px`, p.style.height = `${r}px`, s.scale(b, b), v = l, S = r, z(l, r), D(l, r);
    }
    h.current = () => {
      v > 0 && S > 0 && (z(v, S), D(v, S));
    };
    const W = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && I(r, b);
    });
    W.observe(e);
    const B = e.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function $(l) {
      const {
        starColor: r,
        shootingStarColor: b,
        backgroundColor: F,
        speed: M,
        twinkle: P,
        shootingStars: w,
        shootingStarInterval: C,
        perspective: x,
        shootingStarLength: d,
        shootingStarLifetime: m
      } = o.current;
      if (s.fillStyle = F, s.fillRect(0, 0, v, S), x === "3D") {
        const u = v / 2, R = S / 2, k = Math.max(v, S), L = i.current;
        for (let T = 0; T < L.length; T++) {
          const A = L[T];
          A.pz = A.z, A.z -= M * 4, A.z <= 0 && (A.x = (Math.random() - 0.5) * v * 2, A.y = (Math.random() - 0.5) * S * 2, A.z = k, A.pz = A.z);
          const E = A.x / A.z * v + u, Y = A.y / A.z * S + R, q = A.x / A.pz * v + u, X = A.y / A.pz * S + R, V = Math.max((1 - A.z / k) * 3, 0.1), j = 1 - A.z / k;
          s.beginPath(), s.moveTo(q, X), s.lineTo(E, Y), s.strokeStyle = pt(r, j), s.lineWidth = V, s.stroke();
        }
      } else {
        const u = n.current;
        for (let R = 0; R < u.length; R++) {
          const k = u[R];
          k.y += M * (k.size / 2), k.y > S && (k.y = 0, k.x = Math.random() * v);
          let L = k.opacity;
          P && (k.twinklePhase += k.twinkleSpeed, L = k.opacity * (0.5 + 0.5 * Math.sin(k.twinklePhase))), s.beginPath(), s.arc(k.x, k.y, k.size, 0, Math.PI * 2), s.fillStyle = pt(r, L), s.fill();
        }
        if (w) {
          if (l - y.current > C) {
            y.current = l;
            const R = Math.random() * 8 + 4, k = Math.random() * 4 + 2;
            c.current.push({
              x: Math.random() * v * 0.7,
              y: Math.random() * S * 0.3,
              vx: R,
              vy: k,
              length: Math.random() * (d * 0.5) + d * 0.5,
              opacity: 1,
              life: 0,
              maxLife: m
            });
          }
          c.current = c.current.filter((R) => {
            if (R.x += R.vx, R.y += R.vy, R.life++, R.opacity = 1 - R.life / R.maxLife, R.opacity <= 0) return !1;
            const k = R.length / Math.sqrt(R.vx * R.vx + R.vy * R.vy), L = s.createLinearGradient(R.x, R.y, R.x - R.vx * k, R.y - R.vy * k);
            return L.addColorStop(0, pt(b, R.opacity)), L.addColorStop(1, pt(b, 0)), s.beginPath(), s.moveTo(R.x, R.y), s.lineTo(R.x - R.vx * k, R.y - R.vy * k), s.strokeStyle = L, s.lineWidth = 2, s.stroke(), !0;
          });
        }
      }
      f.current = requestAnimationFrame($);
    }
    return f.current = requestAnimationFrame($), () => {
      W.disconnect(), cancelAnimationFrame(f.current);
    };
  }, [a]);
}
const Ne = {
  default: {},
  warp: {
    perspective: "3D",
    speed: 2,
    starCount: 300,
    shootingStars: !1,
    backgroundColor: "#000000"
  },
  peaceful: {
    perspective: "2D",
    speed: 0.2,
    twinkle: !0,
    shootingStars: !0,
    shootingStarInterval: 2e3,
    backgroundColor: "#000818"
  },
  minimal: {
    starColor: "#94a3b8",
    backgroundColor: "#0f172a",
    twinkle: !1,
    shootingStars: !1,
    speed: 0.3
  },
  nebula: {
    starColor: "#c4b5fd",
    backgroundColor: "#0d0118",
    twinkle: !0,
    shootingStars: !0,
    starCount: 250,
    speed: 0.4
  }
}, Ue = ht(
  (a, g) => {
    const {
      preset: n,
      starCount: i,
      starColor: c,
      shootingStarColor: o,
      backgroundColor: f,
      speed: y,
      twinkle: h,
      shootingStars: t,
      shootingStarInterval: p,
      perspective: e,
      starSizeMin: s,
      starSizeMax: v,
      starOpacityMin: S,
      starOpacityMax: z,
      twinkleSpeed: D,
      shootingStarLength: I,
      shootingStarLifetime: W,
      width: B,
      height: $,
      className: l,
      style: r
    } = a, b = n && Ne[n] || {}, F = G(null);
    return gt(g, () => F.current), je(F, {
      starCount: i ?? b.starCount ?? 200,
      starColor: c ?? b.starColor ?? "#ffffff",
      shootingStarColor: o ?? b.shootingStarColor ?? "#ffffff",
      backgroundColor: f ?? b.backgroundColor ?? "#111111",
      speed: y ?? b.speed ?? 0.5,
      twinkle: h ?? b.twinkle ?? !0,
      shootingStars: t ?? b.shootingStars ?? !0,
      shootingStarInterval: p ?? b.shootingStarInterval ?? 3e3,
      perspective: e ?? b.perspective ?? "2D",
      starSizeMin: s ?? 0.3,
      starSizeMax: v ?? 2.8,
      starOpacityMin: S ?? 0.3,
      starOpacityMax: z ?? 1,
      twinkleSpeed: D ?? 0.03,
      shootingStarLength: I ?? 80,
      shootingStarLifetime: W ?? 60
    }), /* @__PURE__ */ it(
      "div",
      {
        className: l,
        style: { width: B ?? "100%", height: $ ?? "100%", display: "block", overflow: "hidden", ...r },
        children: /* @__PURE__ */ it("canvas", { ref: F, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ue.displayName = "Starfield";
function he(a) {
  const g = new Uint32Array(256);
  for (let n = 1; n < 256; n++) {
    const i = n / 255, [c, o, f] = Rt(a, i), y = Math.round(c), h = Math.round(o), t = Math.round(f), p = Math.min(255, n * 8);
    g[n] = p << 24 | t << 16 | h << 8 | y;
  }
  return g[0] = 0, g;
}
function ge(a) {
  const g = new Uint32Array(256);
  for (let n = 1; n < 256; n++) {
    let i = 0, c = 0, o = 0;
    const f = n / 255;
    if (a === "inferno")
      if (f < 0.33)
        i = Math.round(f / 0.33 * 200), c = 0, o = 0;
      else if (f < 0.66) {
        const h = (f - 0.33) / 0.33;
        i = Math.round(200 + h * 55), c = Math.round(h * 165), o = 0;
      } else {
        const h = (f - 0.66) / 0.34;
        i = 255, c = Math.round(165 + h * 90), o = Math.round(h * 255);
      }
    else if (a === "toxic")
      if (f < 0.4)
        i = 0, c = Math.round(f / 0.4 * 180), o = 0;
      else if (f < 0.75) {
        const h = (f - 0.4) / 0.35;
        i = Math.round(h * 180), c = Math.round(180 + h * 75), o = 0;
      } else {
        const h = (f - 0.75) / 0.25;
        i = Math.round(180 + h * 75), c = 255, o = Math.round(h * 100);
      }
    else if (a === "ice")
      if (f < 0.4)
        i = 0, c = 0, o = Math.round(f / 0.4 * 200);
      else if (f < 0.7) {
        const h = (f - 0.4) / 0.3;
        i = 0, c = Math.round(h * 200), o = Math.round(200 + h * 55);
      } else {
        const h = (f - 0.7) / 0.3;
        i = Math.round(h * 255), c = Math.round(200 + h * 55), o = 255;
      }
    else if (a === "plasma")
      if (f < 0.3) {
        const h = f / 0.3;
        i = Math.round(h * 150), c = 0, o = Math.round(h * 200);
      } else if (f < 0.6) {
        const h = (f - 0.3) / 0.3;
        i = Math.round(150 + h * 105), c = 0, o = Math.round(200 + h * 55);
      } else {
        const h = (f - 0.6) / 0.4;
        i = 255, c = Math.round(h * 200), o = 255;
      }
    else {
      const h = Math.round(f < 0.5 ? f * 2 * 180 : 180 + (f - 0.5) * 2 * 75);
      i = c = o = Math.min(255, h);
    }
    const y = Math.min(255, n * 8);
    g[n] = y << 24 | o << 16 | c << 8 | i;
  }
  return g[0] = 0, g;
}
function Ve(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(null), o = G(
    g.customColors && g.customColors.length >= 2 ? he(g.customColors) : ge(g.palette)
  ), f = G(g.palette), y = G(JSON.stringify(g.customColors ?? [])), h = G(null), t = G(null), p = G(null), e = G(null);
  ft(() => {
    const s = a.current;
    if (!s) return;
    const v = s, S = v.parentElement;
    if (!S) return;
    const z = v.getContext("2d");
    let D = 0, I = 0;
    h.current || (h.current = document.createElement("canvas"), t.current = h.current.getContext("2d"));
    function W(r, b) {
      const { resolution: F } = n.current, M = window.devicePixelRatio || 1, P = Math.max(0.1, Math.min(1, F));
      v.width = Math.round(r * M), v.height = Math.round(b * M), v.style.width = `${r}px`, v.style.height = `${b}px`, D = Math.max(1, Math.round(r * P)), I = Math.max(1, Math.round(b * P)), c.current = new Uint8Array(D * I);
      const w = h.current;
      w.width = D, w.height = I, p.current = t.current.createImageData(D, I), e.current = new Uint32Array(p.current.data.buffer);
    }
    const B = new ResizeObserver((r) => {
      const { width: b, height: F } = r[0].contentRect;
      b > 0 && F > 0 && W(b, F);
    });
    B.observe(S);
    const $ = S.getBoundingClientRect();
    $.width > 0 && $.height > 0 && W($.width, $.height);
    function l() {
      const { palette: r, customColors: b, intensity: F, windStrength: M, windDirection: P, spread: w, cooling: C, noiseStrength: x, coolingScale: d } = n.current, m = b && b.length >= 2, u = JSON.stringify(b ?? []);
      m ? u !== y.current && (y.current = u, o.current = he(b)) : (r !== f.current || y.current !== "[]") && (f.current = r, y.current = "[]", o.current = ge(r));
      const R = c.current, k = e.current, L = p.current;
      if (!R || !k || !L || D === 0 || I === 0) {
        i.current = requestAnimationFrame(l);
        return;
      }
      const T = Math.round(F * 255);
      for (let X = 0; X < D; X++)
        R[(I - 1) * D + X] = 255;
      const A = x / 2;
      for (let X = 0; X < D; X++) {
        const V = Math.random() * x - A;
        R[(I - 2) * D + X] = Math.max(80, Math.min(255, T + V));
      }
      const E = Math.round(M * P), Y = Math.max(1, Math.round(C * d));
      for (let X = 0; X < I - 1; X++) {
        const V = (X + 1) * D;
        for (let j = 0; j < D; j++) {
          const H = R[V + j], _ = j > 0 ? R[V + j - 1] : H, O = j < D - 1 ? R[V + j + 1] : H, N = (_ * w + H * 2 + O * w) / (2 + w * 2), K = Y + (Math.random() * Y | 0), U = 1 - X / I, Q = Math.random() < U * U ? N * 0.25 * Math.random() : 0, ot = N - K - Q, J = j + E, et = J >= 0 && J < D ? J : j;
          R[X * D + et] = Math.max(0, Math.min(255, ot));
        }
      }
      const q = o.current;
      for (let X = 0; X < D * I; X++)
        k[X] = q[R[X]];
      z.clearRect(0, 0, v.width, v.height), t.current.putImageData(L, 0, 0), z.drawImage(h.current, 0, 0, v.width, v.height), i.current = requestAnimationFrame(l);
    }
    return i.current = requestAnimationFrame(l), () => {
      B.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const _e = {
  default: { palette: "smoke" },
  inferno: {
    palette: "inferno",
    intensity: 0.95,
    windStrength: 0.2,
    windDirection: 1
  },
  toxic: {
    palette: "toxic",
    intensity: 0.9,
    cooling: 0.2,
    spread: 0.8,
    windStrength: 0.1
  },
  ice: {
    palette: "ice",
    intensity: 0.85,
    windStrength: 0.15,
    windDirection: -1,
    cooling: 0.35
  },
  plasma: {
    palette: "plasma",
    intensity: 0.92,
    spread: 0.75,
    windStrength: 0.05
  }
}, Je = ht(
  (a, g) => {
    const {
      preset: n,
      palette: i,
      customColors: c,
      intensity: o,
      windStrength: f,
      windDirection: y,
      spread: h,
      cooling: t,
      noiseStrength: p,
      coolingScale: e,
      resolution: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && _e[n] || {}, W = G(null);
    return gt(g, () => W.current), Ve(W, {
      palette: i ?? I.palette ?? "smoke",
      customColors: c,
      intensity: o ?? I.intensity ?? 0.95,
      windStrength: f ?? I.windStrength ?? 0.3,
      windDirection: y ?? I.windDirection ?? 1,
      spread: h ?? I.spread ?? 0,
      cooling: t ?? I.cooling ?? 0.3,
      noiseStrength: p ?? 60,
      coolingScale: e ?? 3,
      resolution: s ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: { width: v ?? "100%", height: S ?? "100%", display: "block", overflow: "hidden", ...D },
        children: /* @__PURE__ */ it("canvas", { ref: W, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Je.displayName = "FireEffect";
function Ke(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(null), o = G(null), f = G(null), y = G(null), h = G(null);
  ft(() => {
    var v, S;
    const t = g.audioSource;
    if (!t) {
      c.current && ((v = f.current) == null || v.disconnect(), (S = o.current) == null || S.close(), c.current = null, f.current = null, o.current = null);
      return;
    }
    const p = new AudioContext();
    o.current = p;
    const e = p.createAnalyser();
    e.fftSize = g.fftSize, e.smoothingTimeConstant = g.smoothingTimeConstant, c.current = e;
    const s = p.createMediaStreamSource(t);
    return f.current = s, s.connect(e), y.current = new Uint8Array(new ArrayBuffer(e.frequencyBinCount)), h.current = new Uint8Array(new ArrayBuffer(e.fftSize)), () => {
      s.disconnect(), p.close(), c.current = null, f.current = null, o.current = null;
    };
  }, [g.audioSource, g.fftSize, g.smoothingTimeConstant]), ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t, e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(M, P) {
      const w = window.devicePixelRatio || 1;
      p.width = Math.round(M * w), p.height = Math.round(P * w), p.style.width = `${M}px`, p.style.height = `${P}px`, s.scale(w, w), v = M, S = P;
    }
    const D = new ResizeObserver((M) => {
      const { width: P, height: w } = M[0].contentRect;
      P > 0 && w > 0 && z(P, w);
    });
    D.observe(e);
    const I = e.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    function W() {
      const { glowEffect: M, glowColor: P, glowBlur: w, barColor: C } = n.current;
      M ? (s.shadowColor = P || C, s.shadowBlur = w) : s.shadowBlur = 0;
    }
    function B() {
      s.shadowBlur = 0;
    }
    function $() {
      const { backgroundColor: M } = n.current;
      M && M !== "transparent" ? (s.fillStyle = M, s.fillRect(0, 0, v, S)) : s.clearRect(0, 0, v, S);
    }
    function l(M, P, w, C, x) {
      const d = s.createLinearGradient(M, S, M, S - P);
      return d.addColorStop(0, C), d.addColorStop(1, x), d;
    }
    function r(M, P, w, C, x, d) {
      C < 1 || (s.fillStyle = x, d && C > 4 ? (s.beginPath(), s.roundRect(M, P, w, C, Math.min(w / 2, 4)), s.fill()) : s.fillRect(M, P, w, C));
    }
    function b() {
      const {
        barCount: M,
        barColor: P,
        waveColor: w,
        gapBetweenBars: C,
        rounded: x,
        mode: d,
        gradient: m,
        gradientEndColor: u,
        idleAmplitude: R,
        idleAnimationSpeed: k
      } = n.current;
      $(), W();
      const L = performance.now() / 1e3 * k;
      if (d === "wave") {
        s.beginPath(), s.moveTo(0, S / 2);
        for (let E = 0; E < v; E++) {
          const Y = S / 2 + Math.sin(E / v * Math.PI * 4 + L * 2) * R;
          s.lineTo(E, Y);
        }
        s.strokeStyle = w, s.lineWidth = 2, s.stroke(), B();
        return;
      }
      if (d === "circular") {
        const { circularRadiusRatio: E } = n.current, Y = v / 2, q = S / 2, X = Math.min(v, S) * E, V = Math.max(1, 2 * Math.PI * X / M * 0.6);
        for (let j = 0; j < M; j++) {
          const H = (Math.sin(j / M * Math.PI * 2 + L * 2) * 0.5 + 0.5) * X * 0.15 + 2, _ = j / M * Math.PI * 2 - Math.PI / 2, O = Y + Math.cos(_) * X, N = q + Math.sin(_) * X, K = Y + Math.cos(_) * (X + H), U = q + Math.sin(_) * (X + H);
          s.beginPath(), s.moveTo(O, N), s.lineTo(K, U), s.strokeStyle = m ? `hsl(${j / M * 360},70%,60%)` : P, s.lineWidth = V, s.stroke();
        }
        s.beginPath(), s.arc(Y, q, X, 0, Math.PI * 2), s.strokeStyle = P, s.lineWidth = 1, s.stroke(), B();
        return;
      }
      if (d === "mirror") {
        const E = C * (M - 1), Y = (v - E) / M;
        for (let q = 0; q < M; q++) {
          const X = (Math.sin(q / M * Math.PI * 2 + L * 3) * 0.5 + 0.5) * S * 0.15 + 2, V = q * (Y + C), j = m ? l(V, X, Y, P, u) : P;
          r(V, S / 2 - X / 2, Y, X, j, x);
        }
        B();
        return;
      }
      const T = C * (M - 1), A = (v - T) / M;
      for (let E = 0; E < M; E++) {
        const Y = (Math.sin(E / M * Math.PI * 2 + L * 3) * 0.5 + 0.5) * S * 0.3 + 4, q = E * (A + C), X = S - Y, V = m ? l(q, Y, A, P, u) : P;
        r(q, X, A, Y, V, x);
      }
      B();
    }
    function F() {
      const {
        barCount: M,
        barColor: P,
        waveColor: w,
        mode: C,
        sensitivity: x,
        gapBetweenBars: d,
        rounded: m,
        gradient: u,
        gradientEndColor: R
      } = n.current;
      $();
      const k = c.current;
      if (!k) {
        b(), i.current = requestAnimationFrame(F);
        return;
      }
      const L = y.current, T = h.current;
      if (k.getByteFrequencyData(L), k.getByteTimeDomainData(T), W(), C === "bars") {
        const A = d * (M - 1), E = (v - A) / M, Y = Math.max(1, Math.floor(L.length / M));
        for (let q = 0; q < M; q++) {
          const V = L[q * Y] / 255 * S * x, j = q * (E + d), H = u ? l(j, V, E, P, R) : P;
          r(j, S - V, E, V, H, m);
        }
      } else if (C === "mirror") {
        const A = d * (M - 1), E = (v - A) / M, Y = Math.max(1, Math.floor(L.length / M));
        for (let q = 0; q < M; q++) {
          const V = L[q * Y] / 255 * S * x, j = q * (E + d), H = u ? l(j, V, E, P, R) : P;
          r(j, S / 2 - V / 2, E, V, H, m);
        }
      } else if (C === "wave") {
        s.beginPath(), Math.max(1, Math.floor(T.length / v));
        for (let A = 0; A < v; A++) {
          const E = Math.min(Math.floor(A / v * T.length), T.length - 1), Y = A, q = (T[E] / 128 - 1) * (S / 2) * x + S / 2;
          A === 0 ? s.moveTo(Y, q) : s.lineTo(Y, q);
        }
        if (u) {
          const A = s.createLinearGradient(0, 0, v, 0);
          A.addColorStop(0, w), A.addColorStop(0.5, R), A.addColorStop(1, w), s.strokeStyle = A;
        } else
          s.strokeStyle = w;
        s.lineWidth = 2, s.stroke();
      } else if (C === "circular") {
        const { circularRadiusRatio: A } = n.current, E = v / 2, Y = S / 2, q = Math.min(v, S) * A, X = Math.max(1, Math.floor(L.length / M)), V = Math.max(1, 2 * Math.PI * q / M * 0.6);
        for (let j = 0; j < M; j++) {
          const _ = L[j * X] / 255 * q * x, O = j / M * Math.PI * 2 - Math.PI / 2, N = E + Math.cos(O) * q, K = Y + Math.sin(O) * q, U = E + Math.cos(O) * (q + _), Q = Y + Math.sin(O) * (q + _);
          s.beginPath(), s.moveTo(N, K), s.lineTo(U, Q), s.strokeStyle = u ? `hsl(${j / M * 360},80%,60%)` : P, s.lineWidth = V, s.stroke();
        }
        s.beginPath(), s.arc(E, Y, q, 0, Math.PI * 2), s.strokeStyle = P, s.lineWidth = 1.5, s.stroke();
      }
      B(), i.current = requestAnimationFrame(F);
    }
    return i.current = requestAnimationFrame(F), () => {
      D.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const Qe = {
  default: {},
  neon: {
    barColor: "#7C3AED",
    waveColor: "#7C3AED",
    gradientEndColor: "#e0b0ff",
    backgroundColor: "#050010",
    glowEffect: !0,
    glowBlur: 20,
    gradient: !0,
    rounded: !0
  },
  minimal: {
    gradient: !1,
    rounded: !1,
    glowEffect: !1,
    barColor: "#4ade80",
    waveColor: "#4ade80",
    backgroundColor: "transparent",
    gradientEndColor: "#4ade80"
  },
  fire: {
    barColor: "#ff6b00",
    waveColor: "#ff6b00",
    gradientEndColor: "#ffff00",
    backgroundColor: "#0a0000",
    glowEffect: !0,
    glowBlur: 15,
    mode: "bars"
  },
  ocean: {
    barColor: "#0891B2",
    waveColor: "#0891B2",
    gradientEndColor: "#67e8f9",
    backgroundColor: "#020f1a",
    glowEffect: !0,
    glowBlur: 14,
    mode: "wave"
  }
}, Ze = ht(
  (a, g) => {
    const {
      preset: n,
      audioSource: i = null,
      barCount: c,
      barColor: o,
      waveColor: f,
      mode: y,
      sensitivity: h,
      gapBetweenBars: t,
      rounded: p,
      gradient: e,
      gradientEndColor: s,
      backgroundColor: v,
      glowEffect: S,
      glowColor: z,
      glowBlur: D,
      fftSize: I,
      smoothingTimeConstant: W,
      circularRadiusRatio: B,
      idleAmplitude: $,
      idleAnimationSpeed: l,
      width: r,
      height: b,
      className: F,
      style: M
    } = a, P = n && Qe[n] || {}, w = o ?? P.barColor ?? "#ffffff", C = G(null);
    return gt(g, () => C.current), Ke(C, {
      audioSource: i,
      barCount: c ?? 64,
      barColor: w,
      waveColor: f ?? P.waveColor ?? w,
      mode: y ?? P.mode ?? "bars",
      sensitivity: h ?? 1,
      gapBetweenBars: t ?? 2,
      rounded: p ?? P.rounded ?? !0,
      gradient: e ?? P.gradient ?? !0,
      gradientEndColor: s ?? P.gradientEndColor ?? "#ffffff",
      backgroundColor: v ?? P.backgroundColor ?? "#111111",
      glowEffect: S ?? P.glowEffect ?? !0,
      glowColor: z ?? w,
      glowBlur: D ?? P.glowBlur ?? 12,
      fftSize: I ?? 2048,
      smoothingTimeConstant: W ?? 0.8,
      circularRadiusRatio: B ?? 0.25,
      idleAmplitude: $ ?? 5,
      idleAnimationSpeed: l ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: r ?? "100%",
          height: b ?? "100%",
          display: "block",
          overflow: "hidden",
          ...M
        },
        children: /* @__PURE__ */ it("canvas", { ref: C, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ze.displayName = "AudioVisualizer";
function to(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(!1), f = G(!1), y = G(0), h = G(0);
  ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t, e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(l, r) {
      const b = window.devicePixelRatio || 1;
      p.width = Math.round(l * b), p.height = Math.round(r * b), p.style.width = `${l}px`, p.style.height = `${r}px`, s.scale(b, b), v = l, S = r;
    }
    const D = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && z(r, b);
    });
    D.observe(e);
    const I = e.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    function W(l) {
      const { spread: r, colors: b, shapes: F, duration: M, spawnX: P, spawnY: w, spawnSpread: C, speedMin: x, speedMax: d, sizeMin: m, sizeMax: u, angularVelocity: R } = n.current, k = v * P, L = S * w, T = Math.max(1, M / 16.67);
      for (let A = 0; A < l; A++) {
        const E = (Math.random() * 2 - 1) * r * Math.PI, Y = Math.random() * (d - x) + x;
        i.current.push({
          x: k + (Math.random() - 0.5) * C,
          y: L,
          vx: Math.sin(E) * Y,
          vy: -Math.cos(E) * Y,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * R,
          color: b[Math.floor(Math.random() * b.length)],
          shape: F[Math.floor(Math.random() * F.length)],
          w: Math.random() * (u - m) + m,
          h: Math.random() * (u - m) * 0.75 + m * 0.5,
          opacity: 1,
          life: 0,
          maxLife: T
        });
      }
    }
    function B(l) {
      switch (s.save(), s.translate(l.x, l.y), s.rotate(l.angle), s.globalAlpha = l.opacity, s.fillStyle = l.color, l.shape) {
        case "square":
          s.fillRect(-l.w / 2, -l.h / 2, l.w, l.h);
          break;
        case "circle":
          s.beginPath(), s.arc(0, 0, l.w / 2, 0, Math.PI * 2), s.fill();
          break;
        case "triangle":
          s.beginPath(), s.moveTo(0, -l.h / 2), s.lineTo(l.w / 2, l.h / 2), s.lineTo(-l.w / 2, l.h / 2), s.closePath(), s.fill();
          break;
        case "strip":
          s.fillRect(-l.w, -l.h / 4, l.w * 2, l.h / 2);
          break;
      }
      s.restore();
    }
    function $(l) {
      const r = y.current ? Math.min(l - y.current, 50) : 16.67;
      y.current = l;
      const { trigger: b, particleCount: F, gravity: M, continuous: P, wind: w, emissionRate: C, onComplete: x } = n.current;
      if (b && !o.current && (W(F), f.current = !1), o.current = b, P && b) {
        h.current += C * r / 1e3;
        const m = Math.floor(h.current);
        m > 0 && (W(m), h.current -= m);
      }
      s.clearRect(0, 0, v, S);
      const d = r / 16.67;
      i.current = i.current.filter((m) => (m.vy += M * 0.3 * d, m.vx += w * 0.05 * d, m.x += m.vx * d, m.y += m.vy * d, m.angle += m.angularV * d, m.life += d, m.opacity = Math.max(0, 1 - m.life / m.maxLife), m.opacity <= 0 || m.y > S + 50 ? !1 : (B(m), !0))), s.globalAlpha = 1, !f.current && b && !P && i.current.length === 0 && o.current && (f.current = !0, x == null || x()), c.current = requestAnimationFrame($);
    }
    return c.current = requestAnimationFrame($), () => {
      D.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [a]);
}
const eo = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"]
}, oo = {
  default: {},
  celebration: {
    palette: "colorful",
    shapes: ["square", "circle", "triangle", "strip"],
    speedMax: 20
  },
  pastel: {
    colors: ["#fbb6ce", "#fed7aa", "#fef08a", "#bbf7d0", "#bae6fd", "#ddd6fe", "#fbcfe8"],
    shapes: ["circle", "square"],
    gravity: 0.3,
    wind: 0.2
  },
  gold: {
    colors: ["#ffd700", "#ffa500", "#ffec47", "#fff3b0", "#e6ac00"],
    shapes: ["square", "circle", "strip"],
    speedMax: 18,
    gravity: 0.4
  }
}, no = ["square", "circle", "triangle", "strip"], ro = ht(
  (a, g) => {
    const {
      preset: n,
      palette: i,
      trigger: c = !1,
      particleCount: o,
      spread: f,
      gravity: y,
      colors: h,
      shapes: t,
      duration: p,
      continuous: e,
      wind: s,
      spawnX: v,
      spawnY: S,
      spawnSpread: z,
      speedMin: D,
      speedMax: I,
      sizeMin: W,
      sizeMax: B,
      angularVelocity: $,
      emissionRate: l,
      onComplete: r,
      width: b,
      height: F,
      className: M,
      style: P
    } = a, w = n && oo[n] || {}, C = i ?? w.palette ?? "monochrome", x = h ?? w.colors ?? eo[C], d = G(null);
    return gt(g, () => d.current), to(d, {
      trigger: c,
      particleCount: o ?? 150,
      spread: f ?? 0.8,
      gravity: y ?? w.gravity ?? 0.5,
      colors: x,
      shapes: t ?? w.shapes ?? no,
      duration: p ?? 4e3,
      continuous: e ?? !1,
      wind: s ?? w.wind ?? 0.5,
      spawnX: v ?? 0.5,
      spawnY: S ?? 0.4,
      spawnSpread: z ?? 60,
      speedMin: D ?? 4,
      speedMax: I ?? w.speedMax ?? 16,
      sizeMin: W ?? 6,
      sizeMax: B ?? 14,
      angularVelocity: $ ?? 0.3,
      emissionRate: l ?? 10,
      onComplete: r
    }), /* @__PURE__ */ it(
      "div",
      {
        className: M,
        style: {
          width: b ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...P
        },
        children: /* @__PURE__ */ it("canvas", { ref: d, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ro.displayName = "Confetti";
function pe(a) {
  return a * a * a * (a * (a * 6 - 15) + 10);
}
function re(a, g, n) {
  return a + n * (g - a);
}
function Vt(a, g, n) {
  const i = a & 3, c = i < 2 ? g : n, o = i < 2 ? n : g;
  return (i & 1 ? -c : c) + (i & 2 ? -o : o);
}
const Yt = new Uint8Array(256);
for (let a = 0; a < 256; a++) Yt[a] = a;
for (let a = 255; a > 0; a--) {
  const g = Math.floor(Math.random() * (a + 1));
  [Yt[a], Yt[g]] = [Yt[g], Yt[a]];
}
const It = new Uint8Array(512);
for (let a = 0; a < 512; a++) It[a] = Yt[a & 255];
function ao(a, g) {
  const n = Math.floor(a) & 255, i = Math.floor(g) & 255, c = a - Math.floor(a), o = g - Math.floor(g), f = pe(c), y = pe(o), h = It[It[n] + i], t = It[It[n] + i + 1], p = It[It[n + 1] + i], e = It[It[n + 1] + i + 1];
  return re(
    re(Vt(h, c, o), Vt(p, c - 1, o), f),
    re(Vt(t, c, o - 1), Vt(e, c - 1, o - 1), f),
    y
  );
}
function io(a, g, n, i) {
  let c = 0, o = 1, f = 1, y = 0;
  for (let h = 0; h < n; h++)
    c += ao(a * f, g * f) * o, y += o, o *= i, f *= 2;
  return c / y;
}
function so(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(0), o = G(null), f = G(null), y = G(null), h = G(0), t = G(0);
  ft(() => {
    const p = a.current;
    if (!p) return;
    const e = p, s = e.parentElement;
    if (!s) return;
    const v = e.getContext("2d");
    let S = 0, z = 0;
    function D($, l) {
      const { resolution: r } = n.current, b = window.devicePixelRatio || 1, F = Math.max(0.05, Math.min(1, r));
      e.width = Math.round($ * b), e.height = Math.round(l * b), e.style.width = `${$}px`, e.style.height = `${l}px`, S = e.width, z = e.height;
      const M = Math.max(1, Math.round(S * F)), P = Math.max(1, Math.round(z * F));
      if (M !== h.current || P !== t.current) {
        h.current = M, t.current = P, o.current = new ImageData(M, P);
        const w = document.createElement("canvas");
        w.width = M, w.height = P;
        const C = w.getContext("2d");
        f.current = w, y.current = C;
      }
    }
    const I = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && D(l, r);
    });
    I.observe(s);
    const W = s.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B($) {
      const { colors: l, speed: r, scale: b, octaves: F, animated: M, blendMode: P, timeOffsetY: w, persistence: C } = n.current;
      if (l.length < 2) {
        i.current = requestAnimationFrame(B);
        return;
      }
      M && (c.current = $ * 1e-3 * r);
      const x = c.current, d = o.current, m = f.current, u = y.current;
      if (!d || !m || !u) {
        i.current = requestAnimationFrame(B);
        return;
      }
      const R = h.current, k = t.current, L = d.data, T = b * 3 / R, A = b * 3 / k;
      for (let E = 0; E < k; E++) {
        const Y = E * A;
        for (let q = 0; q < R; q++) {
          const X = io(q * T + x, Y + x * w, F, C), V = Math.max(0, Math.min(1, (X + 1) / 2)), [j, H, _] = Rt(l, V), O = (E * R + q) * 4;
          L[O] = j, L[O + 1] = H, L[O + 2] = _, L[O + 3] = 255;
        }
      }
      u.putImageData(d, 0, 0), v.globalCompositeOperation = P || "source-over", v.imageSmoothingEnabled = !0, v.imageSmoothingQuality = "high", v.drawImage(m, 0, 0, S, z), M && (i.current = requestAnimationFrame(B));
    }
    return i.current = requestAnimationFrame(B), () => {
      I.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const lo = {
  default: {},
  aurora: {
    colors: ["#0d1117", "#0d4f3c", "#00ff87", "#00cfff", "#7C3AED"],
    speed: 0.2,
    scale: 0.8,
    octaves: 3
  },
  sunset: {
    colors: ["#0a0010", "#7C3AED", "#dc2626", "#f97316", "#fbbf24"],
    speed: 0.15,
    scale: 1.2,
    octaves: 2
  },
  ocean: {
    colors: ["#020f1a", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"],
    speed: 0.25,
    scale: 0.9,
    octaves: 4
  },
  forest: {
    colors: ["#0a1a0a", "#166534", "#15803d", "#4ade80", "#d1fae5"],
    speed: 0.2,
    scale: 1.1,
    octaves: 3
  },
  neon: {
    colors: ["#050010", "#7C3AED", "#0891B2", "#00ff87", "#7C3AED"],
    speed: 0.4,
    scale: 0.7,
    octaves: 3
  }
}, co = ht(
  (a, g) => {
    const {
      preset: n,
      colors: i,
      speed: c,
      scale: o,
      octaves: f,
      animated: y,
      blendMode: h,
      timeOffsetY: t,
      persistence: p,
      resolution: e,
      width: s,
      height: v,
      className: S,
      style: z
    } = a, D = n && lo[n] || {}, I = G(null);
    return gt(g, () => I.current), so(I, {
      colors: i ?? D.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: c ?? D.speed ?? 0.25,
      scale: o ?? D.scale ?? 1,
      octaves: f ?? D.octaves ?? 3,
      animated: y ?? !0,
      blendMode: h ?? "source-over",
      timeOffsetY: t ?? 0.5,
      persistence: p ?? 0.5,
      resolution: e ?? 0.25
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: { width: s ?? "100%", height: v ?? "100%", display: "block", overflow: "hidden", ...z },
        children: /* @__PURE__ */ it("canvas", { ref: I, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
co.displayName = "NoiseGradient";
function uo(a, g, n) {
  const i = G(n);
  i.current = n;
  const c = G(0), o = G(n.trigger), f = G(0), y = G("idle"), h = G([]), t = G(!1);
  ft(() => {
    const p = a.current;
    if (!p) return;
    const e = p, s = e.parentElement;
    if (!s) return;
    const v = e.getContext("2d");
    let S = 0, z = 0;
    function D(l, r) {
      const { pixelSize: b, dissolvePattern: F } = i.current, M = Math.ceil(l / b), P = Math.ceil(r / b), w = M / 2, C = P / 2, x = [];
      for (let d = 0; d < P; d++)
        for (let m = 0; m < M; m++) {
          let u;
          F === "center" ? u = Math.sqrt((m - w) ** 2 + (d - C) ** 2) / Math.sqrt(w ** 2 + C ** 2) : F === "edges" ? u = 1 - Math.sqrt((m - w) ** 2 + (d - C) ** 2) / Math.sqrt(w ** 2 + C ** 2) : F === "horizontal" ? u = m / M : u = Math.random(), x.push({ x: m * b, y: d * b, delay: u });
        }
      x.sort((d, m) => d.delay - m.delay), h.current = x;
    }
    function I(l, r) {
      const b = window.devicePixelRatio || 1;
      e.width = Math.round(l * b), e.height = Math.round(r * b), e.style.width = `${l}px`, e.style.height = `${r}px`, v.scale(b, b), S = l, z = r, D(l, r);
    }
    const W = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && I(r, b);
    });
    W.observe(s);
    const B = s.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function $() {
      const { trigger: l, speed: r, color: b, direction: F, pixelSize: M, onComplete: P, progressMultiplier: w } = i.current;
      l !== o.current && (o.current = l, l && (y.current = F === "in" ? "appearing" : "dissolving", f.current = 0, t.current = !1)), v.clearRect(0, 0, S, z);
      const C = h.current, x = y.current;
      if (x === "idle") {
        F === "out" && !l && (v.fillStyle = b, v.fillRect(0, 0, S, z)), c.current = requestAnimationFrame($);
        return;
      }
      f.current = Math.min(f.current + r * w, 1);
      const d = f.current, m = d;
      if (v.fillStyle = b, x === "dissolving") {
        v.fillRect(0, 0, S, z);
        for (let u = 0; u < C.length; u++) {
          const R = C[u];
          u / C.length < m && v.clearRect(R.x, R.y, M, M);
        }
      } else if (x === "appearing")
        for (let u = 0; u < C.length; u++) {
          const R = C[u];
          u / C.length < m && v.fillRect(R.x, R.y, M, M);
        }
      d >= 1 && (F === "both" && x === "dissolving" ? (y.current = "appearing", f.current = 0) : (y.current = "idle", t.current || (t.current = !0, P == null || P()))), c.current = requestAnimationFrame($);
    }
    return c.current = requestAnimationFrame($), () => {
      W.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [a]);
}
const fo = ht(
  ({
    children: a,
    pixelSize: g = 8,
    speed: n = 0.5,
    direction: i = "out",
    trigger: c = !1,
    color: o = "#ffffff",
    onComplete: f,
    progressMultiplier: y = 0.01,
    dissolvePattern: h = "random",
    width: t,
    height: p,
    className: e,
    style: s
  }, v) => {
    const S = G(null), z = G(null);
    return gt(v, () => S.current), uo(S, z, {
      pixelSize: g,
      speed: n,
      direction: i,
      trigger: c,
      color: o,
      onComplete: f,
      progressMultiplier: y,
      dissolvePattern: h
    }), /* @__PURE__ */ Te(
      "div",
      {
        className: e,
        style: { position: "relative", width: t ?? "100%", height: p ?? "100%", overflow: "hidden", ...s },
        children: [
          a && /* @__PURE__ */ it("div", { ref: z, style: { position: "absolute", inset: 0 }, children: a }),
          /* @__PURE__ */ it(
            "canvas",
            {
              ref: S,
              "aria-hidden": "true",
              role: "presentation",
              style: { position: "absolute", inset: 0, display: "block", pointerEvents: "none" }
            }
          )
        ]
      }
    );
  }
);
fo.displayName = "PixelDissolve";
const Ft = new Uint8Array(512), Xt = new Uint8Array(256);
for (let a = 0; a < 256; a++) Xt[a] = a;
for (let a = 255; a > 0; a--) {
  const g = Math.floor(Math.random() * (a + 1));
  [Xt[a], Xt[g]] = [Xt[g], Xt[a]];
}
for (let a = 0; a < 512; a++) Ft[a] = Xt[a & 255];
function me(a) {
  return a * a * a * (a * (a * 6 - 15) + 10);
}
function ae(a, g, n) {
  return a + n * (g - a);
}
function _t(a, g, n) {
  const i = a & 3, c = i < 2 ? g : n, o = i < 2 ? n : g;
  return (i & 1 ? -c : c) + (i & 2 ? -o : o);
}
function ye(a, g) {
  const n = Math.floor(a) & 255, i = Math.floor(g) & 255, c = a - Math.floor(a), o = g - Math.floor(g), f = me(c), y = me(o), h = Ft[Ft[n] + i], t = Ft[Ft[n] + i + 1], p = Ft[Ft[n + 1] + i], e = Ft[Ft[n + 1] + i + 1];
  return ae(
    ae(_t(h, c, o), _t(p, c - 1, o), f),
    ae(_t(t, c, o - 1), _t(e, c - 1, o - 1), f),
    y
  );
}
function ho(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(0), f = G(null), y = G(null);
  ft(() => {
    var h;
    (h = f.current) == null || h.call(f);
  }, [g.particleCount]), ft(() => {
    const h = a.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const p = h.getContext("2d");
    let e = 0, s = 0;
    function v() {
      const { colors: r } = n.current;
      return {
        x: Math.random() * e,
        y: Math.random() * s,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: r[Math.floor(Math.random() * r.length)]
      };
    }
    function S() {
      const { particleCount: r } = n.current;
      i.current = Array.from({ length: r }, v);
    }
    function z(r, b) {
      const F = a.current, M = window.devicePixelRatio || 1;
      F.width = Math.round(r * M), F.height = Math.round(b * M), F.style.width = `${r}px`, F.style.height = `${b}px`, p.scale(M, M), e = r, s = b, S();
    }
    f.current = () => {
      e > 0 && s > 0 && S();
    };
    function D(r) {
      const b = h.getBoundingClientRect();
      return { x: r.clientX - b.left, y: r.clientY - b.top };
    }
    function I(r) {
      n.current.interactive && (y.current = D(r));
    }
    function W() {
      y.current = null;
    }
    h.addEventListener("mousemove", I), h.addEventListener("mouseleave", W);
    const B = new ResizeObserver((r) => {
      const { width: b, height: F } = r[0].contentRect;
      b > 0 && F > 0 && z(b, F);
    });
    B.observe(t);
    const $ = t.getBoundingClientRect();
    $.width > 0 && $.height > 0 && z($.width, $.height);
    function l() {
      const { speed: r, noiseScale: b, fadeStrength: F, lineWidth: M, backgroundColor: P, timeSpeed: w, curl: C, attractRadius: x, attractStrength: d } = n.current;
      o.current += w * 1e-3;
      const m = o.current;
      P && P !== "transparent" ? (p.fillStyle = P, p.globalAlpha = F, p.fillRect(0, 0, e, s), p.globalAlpha = 1) : (p.fillStyle = `rgba(0,0,0,${F})`, p.fillRect(0, 0, e, s));
      const u = i.current, R = y.current;
      for (let k = 0; k < u.length; k++) {
        const L = u[k], T = L.x * b, A = L.y * b, E = ye(T + m, A + m * 0.7) * Math.PI * 4;
        let Y = Math.cos(E), q = Math.sin(E);
        if (C) {
          const H = ye(T + 100 + m, A + m * 0.7);
          Y += -Math.sin(H * Math.PI * 2) * 0.5, q += Math.cos(H * Math.PI * 2) * 0.5;
        }
        const X = L.x, V = L.y;
        if (L.vx = L.vx * 0.9 + Y * r * 0.1, L.vy = L.vy * 0.9 + q * r * 0.1, R) {
          const H = R.x - L.x, _ = R.y - L.y, O = Math.sqrt(H * H + _ * _);
          if (O < x && O > 0) {
            const N = (x - O) / x * d * 0.1;
            L.vx += H / O * N, L.vy += _ / O * N;
          }
        }
        L.x += L.vx, L.y += L.vy, L.age++;
        const j = Math.max(0, 1 - L.age / L.maxAge) * 0.7;
        p.beginPath(), p.moveTo(X, V), p.lineTo(L.x, L.y), p.strokeStyle = L.color, p.globalAlpha = j, p.lineWidth = M, p.stroke(), p.globalAlpha = 1, (L.age > L.maxAge || L.x < 0 || L.x > e || L.y < 0 || L.y > s) && (i.current[k] = v());
      }
      c.current = requestAnimationFrame(l);
    }
    return c.current = requestAnimationFrame(l), () => {
      B.disconnect(), cancelAnimationFrame(c.current), h.removeEventListener("mousemove", I), h.removeEventListener("mouseleave", W);
    };
  }, [a]);
}
const go = {
  default: {
    colors: ["#ffffff", "#6b7280", "#9ca3af"],
    backgroundColor: "#111111"
  },
  neon: {
    colors: ["#7C3AED", "#e0b0ff", "#0891B2", "#67e8f9"],
    backgroundColor: "#000000",
    speed: 1.5,
    curl: !0
  },
  ocean: {
    colors: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9", "#e0f2fe"],
    backgroundColor: "#020f1a",
    noiseScale: 3e-3,
    speed: 0.8
  },
  lava: {
    colors: ["#7f1d1d", "#dc2626", "#f97316", "#fbbf24"],
    backgroundColor: "#0c0000",
    noiseScale: 4e-3,
    speed: 0.6,
    curl: !1
  },
  forest: {
    colors: ["#14532d", "#15803d", "#4ade80", "#d9f99d"],
    backgroundColor: "#0a1a0a",
    speed: 0.7,
    curl: !0
  },
  monochrome: {
    colors: ["#e2e8f0", "#94a3b8", "#475569"],
    backgroundColor: "#0f172a",
    speed: 0.8
  }
}, po = ht(
  (a, g) => {
    const {
      preset: n,
      particleCount: i,
      colors: c,
      speed: o,
      noiseScale: f,
      trailLength: y,
      fadeStrength: h,
      lineWidth: t,
      backgroundColor: p,
      animated: e,
      timeSpeed: s,
      curl: v,
      interactive: S,
      attractRadius: z,
      attractStrength: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && go[n] || {}, r = G(null);
    return gt(g, () => r.current), ho(r, {
      particleCount: i ?? l.particleCount ?? 800,
      colors: c ?? l.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: o ?? l.speed ?? 1,
      noiseScale: f ?? l.noiseScale ?? 4e-3,
      trailLength: y ?? 0.04,
      fadeStrength: h ?? 0.04,
      lineWidth: t ?? 1,
      backgroundColor: p ?? l.backgroundColor ?? "#111111",
      animated: e ?? !0,
      timeSpeed: s ?? 1,
      curl: v ?? l.curl ?? !1,
      interactive: S ?? !1,
      attractRadius: z ?? 100,
      attractStrength: D ?? 3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: { width: I ?? "100%", height: W ?? "100%", display: "block", overflow: "hidden", ...$ },
        children: /* @__PURE__ */ it("canvas", { ref: r, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
po.displayName = "FlowField";
function mo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G({ w: 0, h: 0 }), f = (y, h) => {
    const { color: t, secondaryColor: p, ringCount: e, ringSpacing: s, speed: v, maxRadius: S, lineWidth: z } = n.current;
    for (let D = 0; D < e; D++) {
      const I = D % 2 === 1;
      i.current.push({
        x: y,
        y: h,
        radius: D * s,
        maxRadius: S + D * s * 0.5,
        opacity: 1,
        color: I ? p : t,
        lineWidth: z * (1 - D * 0.15),
        speed: v * (1 + D * 0.05)
      });
    }
  };
  return ft(() => {
    if (!g.autoFire) return;
    const y = setInterval(() => {
      const { w: h, h: t } = o.current;
      h === 0 || t === 0 || f(h * (0.3 + Math.random() * 0.4), t * (0.3 + Math.random() * 0.4));
    }, g.autoInterval);
    return () => clearInterval(y);
  }, [g.autoFire, g.autoInterval]), ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    function p(z, D) {
      const I = a.current, W = window.devicePixelRatio || 1;
      I.width = Math.round(z * W), I.height = Math.round(D * W), I.style.width = `${z}px`, I.style.height = `${D}px`, t.scale(W, W), o.current = { w: z, h: D };
    }
    const e = new ResizeObserver((z) => {
      const { width: D, height: I } = z[0].contentRect;
      D > 0 && I > 0 && p(D, I);
    });
    e.observe(h);
    const s = h.getBoundingClientRect();
    s.width > 0 && s.height > 0 && p(s.width, s.height);
    function v(z) {
      const D = a.current.getBoundingClientRect();
      f(z.clientX - D.left, z.clientY - D.top);
    }
    h.addEventListener("click", v);
    function S() {
      const { backgroundColor: z, glowEffect: D, glowBlur: I, fadeSpeed: W } = n.current, { w: B, h: $ } = o.current;
      t.clearRect(0, 0, B, $), z && z !== "transparent" && (t.fillStyle = z, t.fillRect(0, 0, B, $));
      const l = [];
      for (const r of i.current)
        r.radius += r.speed, r.opacity -= W, !(r.opacity <= 0 || r.radius > r.maxRadius) && (l.push(r), t.beginPath(), t.arc(r.x, r.y, r.radius, 0, Math.PI * 2), t.strokeStyle = r.color, t.globalAlpha = r.opacity, t.lineWidth = r.lineWidth * r.opacity, D ? (t.shadowColor = r.color, t.shadowBlur = I) : t.shadowBlur = 0, t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0);
      i.current = l, c.current = requestAnimationFrame(S);
    }
    return c.current = requestAnimationFrame(S), () => {
      e.disconnect(), cancelAnimationFrame(c.current), h.removeEventListener("click", v);
    };
  }, [a]), { fire: f };
}
const yo = {
  default: {
    color: "#ffffff",
    secondaryColor: "#6b7280",
    ringCount: 3,
    speed: 4,
    glowEffect: !0,
    glowBlur: 15,
    backgroundColor: "transparent"
  },
  neon: {
    color: "#00ffff",
    secondaryColor: "#ff00ff",
    ringCount: 4,
    speed: 5,
    glowEffect: !0,
    glowBlur: 25,
    lineWidth: 2.5,
    backgroundColor: "#050010"
  },
  explosion: {
    color: "#f97316",
    secondaryColor: "#fbbf24",
    ringCount: 5,
    speed: 6,
    maxRadius: 300,
    lineWidth: 3,
    glowEffect: !0,
    glowBlur: 20,
    backgroundColor: "#0c0000"
  },
  ripple: {
    color: "#06b6d4",
    secondaryColor: "#0891B2",
    ringCount: 6,
    ringSpacing: 15,
    speed: 2,
    fadeSpeed: 0.015,
    lineWidth: 1,
    glowEffect: !1,
    backgroundColor: "#020f1a"
  },
  minimal: {
    color: "#e2e8f0",
    secondaryColor: "#94a3b8",
    ringCount: 2,
    speed: 3,
    glowEffect: !1,
    lineWidth: 1,
    backgroundColor: "transparent"
  }
}, wo = ht(
  (a, g) => {
    const {
      preset: n,
      color: i,
      secondaryColor: c,
      ringCount: o,
      ringSpacing: f,
      speed: y,
      maxRadius: h,
      lineWidth: t,
      fadeSpeed: p,
      autoFire: e,
      autoInterval: s,
      glowEffect: v,
      glowBlur: S,
      backgroundColor: z,
      width: D,
      height: I,
      className: W,
      style: B
    } = a, $ = n && yo[n] || {}, l = G(null);
    return gt(g, () => l.current), mo(l, {
      color: i ?? $.color ?? "#ffffff",
      secondaryColor: c ?? $.secondaryColor ?? "#6b7280",
      ringCount: o ?? $.ringCount ?? 3,
      ringSpacing: f ?? $.ringSpacing ?? 20,
      speed: y ?? $.speed ?? 4,
      maxRadius: h ?? $.maxRadius ?? 200,
      lineWidth: t ?? $.lineWidth ?? 2,
      fadeSpeed: p ?? $.fadeSpeed ?? 0.02,
      autoFire: e ?? !0,
      autoInterval: s ?? 2e3,
      glowEffect: v ?? $.glowEffect ?? !0,
      glowBlur: S ?? $.glowBlur ?? 15,
      backgroundColor: z ?? $.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: { width: D ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...B },
        children: /* @__PURE__ */ it("canvas", { ref: l, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
wo.displayName = "Shockwave";
const vo = 400;
function Co(a, g) {
  const n = a.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (n) return `rgba(${n[1]},${n[2]},${n[3]},${g})`;
  if (a.startsWith("#")) {
    const i = a.slice(1), c = i.length === 3 ? i.split("").map((h) => h + h).join("") : i, o = parseInt(c.slice(0, 2), 16), f = parseInt(c.slice(2, 4), 16), y = parseInt(c.slice(4, 6), 16);
    return `rgba(${o},${f},${y},${g})`;
  }
  return `rgba(0,0,0,${g})`;
}
function Mo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G(null), h = G(/* @__PURE__ */ new Map()), t = (p) => {
    const { colors: e, shellSpeed: s } = n.current, v = a.current;
    if (!v) return;
    const S = v.clientWidth || v.width, z = v.clientHeight || v.height, D = p ?? S * 0.2 + Math.random() * S * 0.6;
    c.current.push({
      x: D,
      y: z,
      vx: (Math.random() - 0.5) * 2,
      vy: -(s + Math.random() * 3),
      targetY: z * 0.15 + Math.random() * z * 0.35,
      color: e[Math.floor(Math.random() * e.length)],
      exploded: !1
    });
  };
  return ft(() => {
    const p = a.current;
    if (!p) return;
    const e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(M, P) {
      const { starCount: w } = n.current;
      o.current = Array.from({ length: w }, () => ({
        x: Math.random() * M,
        y: Math.random() * P,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function D(M, P) {
      const w = a.current, C = window.devicePixelRatio || 1;
      w.width = Math.round(M * C), w.height = Math.round(P * C), w.style.width = `${M}px`, w.style.height = `${P}px`, s.scale(C, C), v = M, S = P, z(M, P);
    }
    const I = new ResizeObserver((M) => {
      const { width: P, height: w } = M[0].contentRect;
      P > 0 && w > 0 && D(P, w);
    });
    I.observe(e);
    const W = e.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B(M) {
      const P = a.current.getBoundingClientRect();
      t(M.clientX - P.left);
    }
    e.addEventListener("click", B);
    function $() {
      const { autoLaunch: M, autoInterval: P } = n.current;
      M && (y.current = setTimeout(() => {
        t(), $();
      }, P * (0.7 + Math.random() * 0.6)));
    }
    $();
    function l(M) {
      const { colors: P, particleCount: w, spread: C, particleSize: x } = n.current, d = vo - i.current.length;
      if (d <= 0) return;
      const m = Math.min(w, d);
      for (let u = 0; u < m; u++) {
        const R = Math.PI * 2 * u / m + (Math.random() - 0.5) * 0.5, k = C * (0.4 + Math.random() * 0.6), L = Math.random() < 0.15 ? P[Math.floor(Math.random() * P.length)] : M.color;
        i.current.push({
          x: M.x,
          y: M.y,
          vx: Math.cos(R) * k,
          vy: Math.sin(R) * k,
          alpha: 1,
          color: L,
          size: x * (0.5 + Math.random() * 0.8)
        });
      }
    }
    let r = g.starCount;
    function b() {
      const { starCount: M, starColor: P, glowingStars: w, starGlowBlur: C } = n.current;
      M !== r && (r = M, z(v, S));
      const x = o.current;
      if (x.length !== 0) {
        s.fillStyle = P;
        for (const d of x)
          w && d.isGlowing || (s.globalAlpha = d.opacity, s.beginPath(), s.arc(d.x, d.y, d.r, 0, Math.PI * 2), s.fill());
        if (w) {
          s.shadowColor = P, s.shadowBlur = C;
          for (const d of x)
            d.isGlowing && (s.globalAlpha = d.opacity * 0.12, s.beginPath(), s.arc(d.x, d.y, d.r * 5, 0, Math.PI * 2), s.fill(), s.globalAlpha = d.opacity * 0.35, s.beginPath(), s.arc(d.x, d.y, d.r * 2.5, 0, Math.PI * 2), s.fill(), s.globalAlpha = d.opacity, s.beginPath(), s.arc(d.x, d.y, d.r * 1.5, 0, Math.PI * 2), s.fill());
          s.shadowBlur = 0, s.shadowColor = "rgba(0,0,0,0)";
        }
        s.globalAlpha = 1;
      }
    }
    function F() {
      const { gravity: M, friction: P, fadeSpeed: w, glowEffect: C, glowBlur: x, backgroundColor: d, trailLength: m } = n.current;
      if (!d || d === "transparent")
        s.clearRect(0, 0, v, S);
      else {
        const T = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, m)));
        s.fillStyle = Co(d, T), s.fillRect(0, 0, v, S);
      }
      b();
      let R = 0;
      for (let T = 0; T < c.current.length; T++) {
        const A = c.current[T];
        if (A.x += A.vx, A.y += A.vy, A.vy += M * 0.3, A.y <= A.targetY && !A.exploded) {
          A.exploded = !0, l(A);
          continue;
        }
        A.exploded || (c.current[R++] = A, s.beginPath(), s.arc(A.x, A.y, 2, 0, Math.PI * 2), s.fillStyle = A.color, s.globalAlpha = 0.9, C && (s.shadowColor = A.color, s.shadowBlur = 6), s.fill(), s.shadowBlur = 0);
      }
      c.current.length = R;
      const k = h.current;
      k.forEach((T) => T.length = 0);
      let L = 0;
      for (let T = 0; T < i.current.length; T++) {
        const A = i.current[T];
        if (A.vx *= P, A.vy *= P, A.vy += M, A.x += A.vx, A.y += A.vy, A.alpha -= w, A.alpha <= 0) continue;
        i.current[L++] = A;
        let E = k.get(A.color);
        E || (E = [], k.set(A.color, E)), E.push(A);
      }
      i.current.length = L, C && (s.shadowBlur = x);
      for (const [T, A] of k)
        if (A.length !== 0) {
          s.fillStyle = T, C && (s.shadowColor = T);
          for (let E = 0; E < A.length; E++) {
            const Y = A[E];
            s.globalAlpha = Y.alpha, s.beginPath(), s.arc(Y.x, Y.y, Math.max(0.5, Y.size * Y.alpha), 0, Math.PI * 2), s.fill();
          }
        }
      s.globalAlpha = 1, s.shadowBlur = 0, f.current = requestAnimationFrame(F);
    }
    return f.current = requestAnimationFrame(F), () => {
      I.disconnect(), cancelAnimationFrame(f.current), e.removeEventListener("click", B), y.current && clearTimeout(y.current);
    };
  }, [a]), { launch: t };
}
const bo = {
  default: {
    colors: ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
    particleCount: 80,
    gravity: 0.08,
    glowEffect: !0,
    glowBlur: 8,
    backgroundColor: "#111111"
  },
  celebration: {
    colors: ["#f43f5e", "#f59e0b", "#4ade80", "#06b6d4", "#7C3AED", "#ffffff"],
    particleCount: 120,
    gravity: 0.06,
    spread: 6,
    glowEffect: !0,
    glowBlur: 12,
    backgroundColor: "#050010"
  },
  subtle: {
    colors: ["#94a3b8", "#cbd5e1", "#e2e8f0"],
    particleCount: 50,
    gravity: 0.1,
    spread: 3.5,
    glowEffect: !1,
    backgroundColor: "#0f172a"
  },
  neon: {
    colors: ["#00ffff", "#ff00ff", "#00ff41", "#ff6600"],
    particleCount: 100,
    gravity: 0.05,
    spread: 7,
    glowEffect: !0,
    glowBlur: 20,
    backgroundColor: "#000000"
  },
  golden: {
    colors: ["#fbbf24", "#f59e0b", "#d97706", "#ffffff", "#fef3c7"],
    particleCount: 90,
    gravity: 0.07,
    spread: 5,
    glowEffect: !0,
    glowBlur: 15,
    backgroundColor: "#0c0500"
  }
}, xo = ht(
  (a, g) => {
    const {
      preset: n,
      colors: i,
      particleCount: c,
      gravity: o,
      friction: f,
      fadeSpeed: y,
      particleSize: h,
      trailLength: t,
      spread: p,
      autoLaunch: e,
      autoInterval: s,
      glowEffect: v,
      glowBlur: S,
      backgroundColor: z,
      shellSpeed: D,
      starCount: I,
      starColor: W,
      glowingStars: B,
      starGlowBlur: $,
      width: l,
      height: r,
      className: b,
      style: F
    } = a, M = n && bo[n] || {}, P = G(null);
    return gt(g, () => P.current), Mo(P, {
      colors: i ?? M.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: c ?? M.particleCount ?? 80,
      gravity: o ?? M.gravity ?? 0.08,
      friction: f ?? M.friction ?? 0.97,
      fadeSpeed: y ?? M.fadeSpeed ?? 0.015,
      particleSize: h ?? M.particleSize ?? 2,
      trailLength: t ?? M.trailLength ?? 6,
      spread: p ?? M.spread ?? 5,
      autoLaunch: e ?? !0,
      autoInterval: s ?? 1800,
      glowEffect: v ?? M.glowEffect ?? !0,
      glowBlur: S ?? M.glowBlur ?? 8,
      backgroundColor: z ?? M.backgroundColor ?? "#111111",
      shellSpeed: D ?? M.shellSpeed ?? 12,
      starCount: I ?? 80,
      starColor: W ?? "#ffffff",
      glowingStars: B ?? !1,
      starGlowBlur: $ ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: b,
        style: { width: l ?? "100%", height: r ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: P, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
xo.displayName = "Fireworks";
function Ro(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(0), o = G(0), f = G(!1), y = G(0), h = G(0), t = G(0), p = G(0);
  ft(() => {
    const e = a.current;
    if (!e) return;
    const s = e.parentElement;
    if (!s) return;
    const v = e.getContext("2d");
    let S = 0, z = 0;
    function D($, l) {
      const r = a.current, b = window.devicePixelRatio || 1;
      r.width = Math.round($ * b), r.height = Math.round(l * b), r.style.width = `${$}px`, r.style.height = `${l}px`, v.scale(b, b), S = $, z = l;
    }
    const I = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && D(l, r);
    });
    I.observe(s);
    const W = s.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B() {
      const {
        animated: $,
        intensity: l,
        speed: r,
        rgbShift: b,
        scanlines: F,
        scanlineOpacity: M,
        scanlineSpacing: P,
        blockGlitch: w,
        blockCount: C,
        noiseOpacity: x,
        flickerRate: d,
        color: m,
        rgbShiftColor: u,
        backgroundColor: R
      } = n.current, k = vt(u), [L, T, A] = k.split(",").map(Number), E = `${255 - L},${255 - T},${255 - A}`;
      if (v.clearRect(0, 0, S, z), R && R !== "transparent" && (v.fillStyle = R, v.fillRect(0, 0, S, z)), F) {
        for (let H = 0; H < z; H += P) {
          const _ = M * (H % (P * 2) === 0 ? 1.2 : 0.7);
          v.fillStyle = "rgba(0,0,0,1)", v.globalAlpha = Math.min(1, _), v.fillRect(0, H, S, 1);
        }
        v.globalAlpha = 1;
      }
      if (!$) {
        i.current = requestAnimationFrame(B);
        return;
      }
      const Y = 16;
      c.current += r * 0.016, p.current += r * 0.02, o.current -= Y, o.current <= 0 && (f.current ? (f.current = !1, o.current = (800 + Math.random() * 2e3) / r) : (f.current = Math.random() < l, y.current = 80 + Math.random() * 300, o.current = y.current)), h.current -= Y, h.current <= 0 && (h.current = 100 + Math.random() * 300 / r);
      const q = h.current < 40 && Math.random() < l * 0.4, X = f.current || q;
      if (t.current > 0 ? (t.current -= Y, v.globalCompositeOperation = "difference", v.fillStyle = "rgba(255,255,255,1)", v.globalAlpha = Math.min(1, t.current / 30), v.fillRect(0, 0, S, z), v.globalCompositeOperation = "source-over", v.globalAlpha = 1) : X && Math.random() < 5e-3 * l && (t.current = 30 + Math.random() * 60), Math.random() < d * (X ? 4 : 1)) {
        const H = X ? 0.08 : 0.02;
        v.fillStyle = `rgba(255,255,255,${H})`, v.fillRect(0, 0, S, z);
      }
      if (X && Math.random() < 0.03 * l && (v.fillStyle = "rgba(0,0,0,0.4)", v.fillRect(0, 0, S, z)), x > 0) {
        const H = v.createImageData(S, z), _ = X ? 1.8 : 1;
        for (let O = 0; O < H.data.length; O += 4) {
          const N = Math.random() * 255 | 0;
          H.data[O] = N, H.data[O + 1] = N, H.data[O + 2] = N, H.data[O + 3] = Math.random() < x * _ ? 60 : 0;
        }
        v.putImageData(H, 0, 0);
      }
      if (X) {
        const H = f.current ? 1 - o.current / y.current : 0.4;
        if (b > 0) {
          const K = b * l * H * (0.5 + Math.random() * 1.5), U = Math.sin(p.current * 3) * K * 0.3;
          v.globalCompositeOperation = "screen", v.fillStyle = `rgba(${k},0.06)`, v.globalAlpha = 0.5 + H * 0.4, v.fillRect(K + U, 0, S, z), v.fillStyle = `rgba(${E},0.06)`, v.fillRect(-(K + U), 0, S, z);
          const Q = Math.random() * z, ot = 5 + Math.random() * 40, J = K * (1 + Math.random() * 3);
          v.fillStyle = `rgba(${k},0.12)`, v.globalAlpha = 0.7, v.fillRect(J, Q, S, ot), v.fillStyle = `rgba(${E},0.12)`, v.fillRect(-J, Q + 1, S, ot), v.globalCompositeOperation = "source-over", v.globalAlpha = 1;
        }
        if (w) {
          const K = Math.ceil(C * H * (1 + Math.random() * 2));
          for (let U = 0; U < K; U++) {
            const Q = Math.random() * z, ot = 1 + Math.random() * (X ? 30 : 12), J = Math.max(b * 2, 20) * l * H, et = (Math.random() - 0.5) * J * 2;
            try {
              const tt = v.getImageData(0, Q, S, ot);
              v.putImageData(tt, et, Q);
            } catch {
            }
          }
        }
        const _ = Math.floor(Math.random() * 4 * H);
        for (let K = 0; K < _; K++) {
          const U = Math.random() * z, Q = 1 + Math.random() * 3, ot = Math.random() < 0.5 ? "0,255,0" : "255,140,0";
          v.fillStyle = `rgba(${ot},0.15)`, v.globalAlpha = 0.4 + Math.random() * 0.4, v.fillRect(0, U, S, Q);
        }
        if (v.globalAlpha = 1, Math.random() < 0.15 * l * H) {
          const K = Math.random() * S, U = 1 + Math.random() * 4, Q = (Math.random() - 0.5) * 20 * l;
          try {
            const ot = v.getImageData(K, 0, U, z);
            v.putImageData(ot, K, Q);
          } catch {
          }
        }
        const O = Math.floor(Math.random() * z), N = 1 + Math.random() * 3;
        if (v.fillStyle = m, v.globalAlpha = 0.2 * l * H, v.fillRect(0, O, S, N), v.globalAlpha = 1, Math.random() < 0.04 * l) {
          const K = Math.random() * S * 0.7, U = Math.random() * z, Q = 20 + Math.random() * S * 0.3, ot = 2 + Math.random() * 20, J = v.createImageData(Q, ot);
          for (let et = 0; et < J.data.length; et += 4)
            J.data[et] = Math.random() * 255 | 0, J.data[et + 1] = Math.random() * 255 | 0, J.data[et + 2] = Math.random() * 255 | 0, J.data[et + 3] = 180;
          v.putImageData(J, K, U);
        }
      }
      const V = Math.max(S, z) * (X ? 0.65 : 0.75), j = v.createRadialGradient(S / 2, z / 2, z * 0.3, S / 2, z / 2, V);
      j.addColorStop(0, "rgba(0,0,0,0)"), j.addColorStop(1, `rgba(0,0,0,${X ? 0.5 : 0.35})`), v.fillStyle = j, v.fillRect(0, 0, S, z), i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      I.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const So = {
  default: {
    intensity: 0.6,
    speed: 1,
    rgbShift: 8,
    scanlines: !0,
    scanlineOpacity: 0.08,
    blockGlitch: !0,
    blockCount: 4,
    noiseOpacity: 0.02,
    flickerRate: 0.02,
    color: "#ffffff",
    backgroundColor: "transparent"
  },
  crt: {
    intensity: 0.4,
    speed: 0.5,
    rgbShift: 4,
    scanlines: !0,
    scanlineOpacity: 0.15,
    scanlineSpacing: 3,
    blockGlitch: !1,
    noiseOpacity: 0.04,
    flickerRate: 0.03,
    color: "#00ff41",
    backgroundColor: "transparent"
  },
  cyberpunk: {
    intensity: 0.8,
    speed: 1.5,
    rgbShift: 15,
    scanlines: !0,
    scanlineOpacity: 0.06,
    blockGlitch: !0,
    blockCount: 6,
    noiseOpacity: 0.02,
    color: "#00ffff",
    backgroundColor: "#050010"
  },
  subtle: {
    intensity: 0.2,
    speed: 0.4,
    rgbShift: 3,
    scanlines: !0,
    scanlineOpacity: 0.05,
    blockGlitch: !1,
    noiseOpacity: 0.01,
    flickerRate: 5e-3,
    backgroundColor: "transparent"
  },
  corrupt: {
    intensity: 1,
    speed: 2,
    rgbShift: 25,
    scanlines: !1,
    blockGlitch: !0,
    blockCount: 10,
    noiseOpacity: 0.06,
    flickerRate: 0.05,
    color: "#ff0000",
    backgroundColor: "#000000"
  }
}, ko = ht(
  (a, g) => {
    const {
      preset: n,
      intensity: i,
      speed: c,
      rgbShift: o,
      scanlines: f,
      scanlineOpacity: y,
      scanlineSpacing: h,
      blockGlitch: t,
      blockCount: p,
      noiseOpacity: e,
      flickerRate: s,
      color: v,
      rgbShiftColor: S,
      animated: z,
      backgroundColor: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && So[n] || {}, r = G(null);
    return gt(g, () => r.current), Ro(r, {
      intensity: i ?? l.intensity ?? 0.6,
      speed: c ?? l.speed ?? 1,
      rgbShift: o ?? l.rgbShift ?? 8,
      scanlines: f ?? l.scanlines ?? !0,
      scanlineOpacity: y ?? l.scanlineOpacity ?? 0.08,
      scanlineSpacing: h ?? l.scanlineSpacing ?? 2,
      blockGlitch: t ?? l.blockGlitch ?? !0,
      blockCount: p ?? l.blockCount ?? 4,
      noiseOpacity: e ?? l.noiseOpacity ?? 0.02,
      flickerRate: s ?? l.flickerRate ?? 0.02,
      color: v ?? l.color ?? "#ffffff",
      rgbShiftColor: S ?? l.rgbShiftColor ?? "#ff0000",
      animated: z ?? !0,
      backgroundColor: D ?? l.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: { width: I ?? "100%", height: W ?? "100%", display: "block", overflow: "hidden", position: "relative", ...$ },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
ko.displayName = "GlitchOverlay";
function Po(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(0);
  ft(() => {
    const o = a.current;
    if (!o) return;
    const f = o.parentElement;
    if (!f) return;
    const y = o.getContext("2d");
    let h = 0, t = 0;
    function p(z, D) {
      const I = a.current, W = window.devicePixelRatio || 1;
      I.width = Math.round(z * W), I.height = Math.round(D * W), I.style.width = `${z}px`, I.style.height = `${D}px`, y.scale(W, W), h = z, t = D;
    }
    const e = new ResizeObserver((z) => {
      const { width: D, height: I } = z[0].contentRect;
      D > 0 && I > 0 && p(D, I);
    });
    e.observe(f);
    const s = f.getBoundingClientRect();
    s.width > 0 && s.height > 0 && p(s.width, s.height);
    function v(z, D, I, W, B, $, l, r, b, F, M, P, w) {
      const C = 6 + W * 2, x = W / 8 * Math.PI * 2, d = B * (1 + W * 0.15);
      for (let m = 0; m < l; m++) {
        const u = m / l * Math.PI * 2;
        for (let R = 0; R < (r ? 2 : 1); R++) {
          y.save(), y.translate(z, D), y.rotate(u + (R === 1 ? Math.PI / l : 0)), R === 1 && y.scale(1, -1), y.beginPath();
          for (let k = 0; k <= C * 3; k++) {
            const L = k / (C * 3) * Math.PI * 2, T = w * Math.sin(L * 3 + d + x), A = I * (0.5 + 0.5 * Math.abs(Math.sin(L * (C / 2) + d * 0.5))), E = (A + T * I * 0.15) * Math.cos(L), Y = (A + T * I * 0.1) * Math.sin(L);
            k === 0 ? y.moveTo(E, Y) : y.lineTo(E, Y);
          }
          y.closePath(), F && (y.shadowColor = $, y.shadowBlur = M), y.strokeStyle = $, y.lineWidth = b * (1 - W * 0.08), y.globalAlpha = P * (1 - W * 0.1), y.stroke(), y.shadowBlur = 0, y.globalAlpha = 1, y.restore();
        }
      }
    }
    function S() {
      const {
        symmetry: z,
        colors: D,
        lineWidth: I,
        speed: W,
        layers: B,
        radius: $,
        backgroundColor: l,
        animated: r,
        glowEffect: b,
        glowBlur: F,
        strokeOpacity: M,
        mirror: P,
        noiseAmount: w
      } = n.current;
      r && (c.current += W * 5e-3);
      const C = c.current;
      y.clearRect(0, 0, h, t), l && l !== "transparent" && (y.fillStyle = l, y.fillRect(0, 0, h, t));
      const x = h / 2, d = t / 2, m = Math.min(h, t) * 0.45 * $;
      for (let u = 0; u < B; u++) {
        const R = m * (1 - u * (0.85 / B)), k = D[u % D.length];
        v(x, d, R, u, C + u * 0.3, k, z, P, I, b, F, M, w);
      }
      i.current = requestAnimationFrame(S);
    }
    return i.current = requestAnimationFrame(S), () => {
      e.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const Eo = {
  default: {
    symmetry: 8,
    colors: ["#ffffff", "#6b7280"],
    lineWidth: 1.5,
    speed: 1,
    layers: 5,
    glowEffect: !0,
    glowBlur: 10,
    strokeOpacity: 0.8,
    mirror: !0,
    noiseAmount: 0.3,
    backgroundColor: "#111111"
  },
  neon: {
    symmetry: 12,
    colors: ["#00ffff", "#ff00ff", "#7C3AED", "#00ff41"],
    lineWidth: 1,
    speed: 1.5,
    layers: 6,
    glowEffect: !0,
    glowBlur: 20,
    strokeOpacity: 0.9,
    mirror: !0,
    noiseAmount: 0.5,
    backgroundColor: "#000000"
  },
  lotus: {
    symmetry: 6,
    colors: ["#f43f5e", "#fb7185", "#fda4af", "#fbbf24"],
    lineWidth: 2,
    speed: 0.5,
    layers: 4,
    glowEffect: !0,
    glowBlur: 8,
    strokeOpacity: 0.7,
    mirror: !0,
    noiseAmount: 0.2,
    backgroundColor: "#0c0005"
  },
  cosmic: {
    symmetry: 16,
    colors: ["#6366f1", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe"],
    lineWidth: 0.8,
    speed: 0.8,
    layers: 7,
    glowEffect: !0,
    glowBlur: 15,
    strokeOpacity: 0.6,
    mirror: !1,
    noiseAmount: 0.6,
    backgroundColor: "#030014"
  },
  minimal: {
    symmetry: 6,
    colors: ["#e2e8f0", "#94a3b8"],
    lineWidth: 1,
    speed: 0.3,
    layers: 3,
    glowEffect: !1,
    strokeOpacity: 0.5,
    mirror: !0,
    noiseAmount: 0.1,
    backgroundColor: "#0f172a"
  }
}, Ao = ht(
  (a, g) => {
    const {
      preset: n,
      symmetry: i,
      colors: c,
      lineWidth: o,
      speed: f,
      layers: y,
      radius: h,
      backgroundColor: t,
      animated: p,
      glowEffect: e,
      glowBlur: s,
      strokeOpacity: v,
      mirror: S,
      noiseAmount: z,
      width: D,
      height: I,
      className: W,
      style: B
    } = a, $ = n && Eo[n] || {}, l = G(null);
    return gt(g, () => l.current), Po(l, {
      symmetry: i ?? $.symmetry ?? 8,
      colors: c ?? $.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: o ?? $.lineWidth ?? 1.5,
      speed: f ?? $.speed ?? 1,
      layers: y ?? $.layers ?? 5,
      radius: h ?? 1,
      backgroundColor: t ?? $.backgroundColor ?? "#111111",
      animated: p ?? !0,
      glowEffect: e ?? $.glowEffect ?? !0,
      glowBlur: s ?? $.glowBlur ?? 10,
      strokeOpacity: v ?? $.strokeOpacity ?? 0.8,
      mirror: S ?? $.mirror ?? !0,
      noiseAmount: z ?? $.noiseAmount ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: { width: D ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...B },
        children: /* @__PURE__ */ it("canvas", { ref: l, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ao.displayName = "Mandala";
function Bo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(null), o = G(0), f = G(0);
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s() {
      const { count: l, radius: r } = n.current;
      i.current = Array.from({ length: l }, () => {
        const b = p * 0.2 + Math.random() * p * 0.6, F = e * 0.2 + Math.random() * e * 0.6;
        return {
          x: b,
          y: F,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: r * (0.7 + Math.random() * 0.6),
          baseX: b,
          baseY: F
        };
      });
    }
    function v(l, r) {
      const b = a.current, F = window.devicePixelRatio || 1;
      b.width = Math.round(l * F), b.height = Math.round(r * F), b.style.width = `${l}px`, b.style.height = `${r}px`, t.scale(F, F), p = l, e = r, s();
    }
    const S = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && v(r, b);
    });
    S.observe(h);
    const z = h.getBoundingClientRect();
    z.width > 0 && z.height > 0 && v(z.width, z.height);
    function D(l) {
      const r = a.current.getBoundingClientRect();
      c.current = { x: l.clientX - r.left, y: l.clientY - r.top };
    }
    function I() {
      c.current = null;
    }
    h.addEventListener("mousemove", D), h.addEventListener("mouseleave", I);
    function W(l) {
      const r = l.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : null;
    }
    function B(l, r, b, F) {
      const M = i.current;
      if (M.length) {
        t.globalCompositeOperation = "source-over";
        for (let P = 0; P < M.length; P++) {
          const w = M[P], C = l[P % l.length], x = w.radius * r, d = W(C);
          b && (t.shadowColor = C, t.shadowBlur = F), t.globalCompositeOperation = "screen";
          const m = t.createRadialGradient(w.x, w.y, x * 0.5, w.x, w.y, x * 1.4);
          m.addColorStop(0, d ? `rgba(${d.r},${d.g},${d.b},0.18)` : C + "30"), m.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = m, t.beginPath(), t.arc(w.x, w.y, x * 1.4, 0, Math.PI * 2), t.fill();
          const u = t.createRadialGradient(
            w.x - x * 0.25,
            w.y - x * 0.25,
            0,
            // offset center for 3D feel
            w.x,
            w.y,
            x
          );
          u.addColorStop(0, d ? `rgba(${Math.min(255, d.r + 80)},${Math.min(255, d.g + 80)},${Math.min(255, d.b + 80)},0.95)` : C), u.addColorStop(0.35, d ? `rgba(${d.r},${d.g},${d.b},0.85)` : C + "d9"), u.addColorStop(0.7, d ? `rgba(${Math.max(0, d.r - 40)},${Math.max(0, d.g - 40)},${Math.max(0, d.b - 40)},0.6)` : C + "99"), u.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = u, t.beginPath(), t.arc(w.x, w.y, x, 0, Math.PI * 2), t.fill();
          const R = w.x - x * 0.28, k = w.y - x * 0.28, L = x * 0.35, T = t.createRadialGradient(R, k, 0, R, k, L);
          T.addColorStop(0, "rgba(255,255,255,0.45)"), T.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = T, t.beginPath(), t.arc(R, k, L, 0, Math.PI * 2), t.fill(), t.shadowBlur = 0;
        }
        t.globalCompositeOperation = "source-over";
      }
    }
    function $() {
      const {
        speed: l,
        magnetStrength: r,
        magnetRadius: b,
        threshold: F,
        colors: M,
        glowEffect: P,
        glowBlur: w,
        backgroundColor: C,
        animated: x,
        followMouse: d,
        wanderStrength: m
      } = n.current;
      x && (f.current += 0.016);
      const u = f.current;
      t.clearRect(0, 0, p, e), C && C !== "transparent" && (t.fillStyle = C, t.fillRect(0, 0, p, e));
      const R = i.current, k = c.current;
      for (let L = 0; L < R.length; L++) {
        const T = R[L], A = Math.sin(u * l * 0.5 + L * 1.3) * Math.PI * 2;
        if (T.vx += Math.cos(A) * m * 0.05, T.vy += Math.sin(A) * m * 0.05, k && d) {
          const E = k.x - T.x, Y = k.y - T.y, q = Math.sqrt(E * E + Y * Y) || 1;
          if (q < b) {
            const X = (1 - q / b) * r;
            T.vx += E / q * X, T.vy += Y / q * X;
          }
        }
        for (let E = L + 1; E < R.length; E++) {
          const Y = R[E], q = Y.x - T.x, X = Y.y - T.y, V = Math.sqrt(q * q + X * X) || 1, j = (T.radius + Y.radius) * 0.8;
          if (V < j * 2) {
            const H = 2e-3 * (1 - V / (j * 2));
            T.vx += q / V * H, T.vy += X / V * H, Y.vx -= q / V * H, Y.vy -= X / V * H;
          }
        }
        T.vx *= 0.92, T.vy *= 0.92, T.vx = Math.max(-4, Math.min(4, T.vx)), T.vy = Math.max(-4, Math.min(4, T.vy)), T.x += T.vx, T.y += T.vy, T.x < T.radius && (T.x = T.radius, T.vx *= -0.5), T.x > p - T.radius && (T.x = p - T.radius, T.vx *= -0.5), T.y < T.radius && (T.y = T.radius, T.vy *= -0.5), T.y > e - T.radius && (T.y = e - T.radius, T.vy *= -0.5);
      }
      B(M, F, P, w), o.current = requestAnimationFrame($);
    }
    return o.current = requestAnimationFrame($), () => {
      S.disconnect(), cancelAnimationFrame(o.current), h.removeEventListener("mousemove", D), h.removeEventListener("mouseleave", I);
    };
  }, [a]);
}
const Io = {
  default: {
    count: 5,
    colors: ["#ffffff", "#6b7280"],
    radius: 80,
    speed: 1,
    magnetStrength: 0.08,
    threshold: 1.8,
    glowEffect: !0,
    glowBlur: 20,
    backgroundColor: "#111111",
    wanderStrength: 0.4
  },
  neon: {
    count: 4,
    colors: ["#00ffff", "#ff00ff", "#7C3AED"],
    radius: 90,
    glowEffect: !0,
    glowBlur: 35,
    backgroundColor: "#000000",
    wanderStrength: 0.5
  },
  plasma: {
    count: 6,
    colors: ["#f43f5e", "#f59e0b", "#7C3AED", "#0891B2"],
    radius: 70,
    threshold: 2,
    glowEffect: !0,
    glowBlur: 25,
    backgroundColor: "#050010",
    wanderStrength: 0.6
  },
  ocean: {
    count: 4,
    colors: ["#0891B2", "#06b6d4", "#0e7490"],
    radius: 100,
    speed: 0.6,
    glowEffect: !0,
    glowBlur: 15,
    backgroundColor: "#020f1a",
    wanderStrength: 0.3
  },
  lava: {
    count: 5,
    colors: ["#dc2626", "#f97316", "#fbbf24"],
    radius: 80,
    speed: 0.5,
    glowEffect: !0,
    glowBlur: 20,
    backgroundColor: "#0c0000",
    wanderStrength: 0.2
  },
  minimal: {
    count: 3,
    colors: ["#e2e8f0", "#94a3b8"],
    radius: 70,
    glowEffect: !1,
    backgroundColor: "#0f172a",
    wanderStrength: 0.3
  }
}, Fo = ht(
  (a, g) => {
    const {
      preset: n,
      count: i,
      colors: c,
      radius: o,
      speed: f,
      magnetStrength: y,
      magnetRadius: h,
      threshold: t,
      glowEffect: p,
      glowBlur: e,
      backgroundColor: s,
      animated: v,
      followMouse: S,
      wanderStrength: z,
      width: D,
      height: I,
      className: W,
      style: B
    } = a, $ = n && Io[n] || {}, l = G(null);
    return gt(g, () => l.current), Bo(l, {
      count: i ?? $.count ?? 5,
      colors: c ?? $.colors ?? ["#ffffff", "#6b7280"],
      radius: o ?? $.radius ?? 80,
      speed: f ?? $.speed ?? 1,
      magnetStrength: y ?? $.magnetStrength ?? 0.08,
      magnetRadius: h ?? $.magnetRadius ?? 150,
      threshold: t ?? $.threshold ?? 1.8,
      glowEffect: p ?? $.glowEffect ?? !0,
      glowBlur: e ?? $.glowBlur ?? 20,
      backgroundColor: s ?? $.backgroundColor ?? "#111111",
      animated: v ?? $.animated ?? !0,
      followMouse: S ?? $.followMouse ?? !0,
      wanderStrength: z ?? $.wanderStrength ?? 0.4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: { width: D ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...B },
        children: /* @__PURE__ */ it("canvas", { ref: l, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Fo.displayName = "MagneticBlob";
function $o(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G(0), f = G(null), y = G(!1), h = G(0), t = G(null);
  ft(() => {
    var p;
    (p = t.current) == null || p.call(t);
  }, [g.cols, g.rows]), ft(() => {
    const p = a.current;
    if (!p) return;
    const e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(F, M) {
      const { cols: P, rows: w, spacing: C } = n.current, x = (F - (P - 1) * C) / 2, d = M * 0.08, m = [], u = [];
      for (let R = 0; R < w; R++)
        for (let k = 0; k < P; k++) {
          const L = x + k * C, T = d + R * C;
          m.push({
            x: L,
            y: T,
            px: L,
            py: T,
            pinned: R === 0 && (k % Math.ceil(P / 5) === 0 || k === P - 1)
          });
          const A = R * P + k;
          k > 0 && u.push({ a: A - 1, b: A, length: C }), R > 0 && u.push({ a: A - P, b: A, length: C });
        }
      i.current = m, c.current = u;
    }
    function D(F, M) {
      const P = a.current, w = window.devicePixelRatio || 1;
      P.width = Math.round(F * w), P.height = Math.round(M * w), P.style.width = `${F}px`, P.style.height = `${M}px`, s.scale(w, w), v = F, S = M, z(v, S);
    }
    t.current = () => {
      v > 0 && S > 0 && z(v, S);
    };
    const I = new ResizeObserver((F) => {
      const { width: M, height: P } = F[0].contentRect;
      M > 0 && P > 0 && D(M, P);
    });
    I.observe(e);
    const W = e.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B(F) {
      const M = a.current.getBoundingClientRect();
      f.current = { x: F.clientX - M.left, y: F.clientY - M.top };
    }
    function $() {
      y.current = !0;
    }
    function l() {
      y.current = !1;
    }
    function r() {
      f.current = null, y.current = !1;
    }
    e.addEventListener("mousemove", B), e.addEventListener("mousedown", $), e.addEventListener("mouseup", l), e.addEventListener("mouseleave", r);
    function b() {
      const {
        gravity: F,
        friction: M,
        stiffness: P,
        iterations: w,
        lineColor: C,
        pinColor: x,
        lineWidth: d,
        backgroundColor: m,
        wind: u,
        windSpeed: R,
        tearable: k,
        tearDistance: L,
        interactive: T,
        mouseRadius: A,
        mouseForce: E,
        showPins: Y
      } = n.current;
      h.current += 0.016;
      const q = h.current;
      s.clearRect(0, 0, v, S), m && m !== "transparent" && (s.fillStyle = m, s.fillRect(0, 0, v, S));
      const X = i.current, V = f.current, j = u * Math.sin(q * R) * 0.1;
      for (const H of X) {
        if (H.pinned) continue;
        const _ = (H.x - H.px) * M, O = (H.y - H.py) * M;
        if (H.px = H.x, H.py = H.y, H.x += _ + j, H.y += O + F, V && T) {
          const N = H.x - V.x, K = H.y - V.y, U = Math.sqrt(N * N + K * K) || 1;
          if (U < A) {
            const Q = (1 - U / A) * E;
            if (y.current)
              if (k)
                for (let ot = c.current.length - 1; ot >= 0; ot--) {
                  const J = c.current[ot], et = X[J.a], tt = X[J.b];
                  (Math.sqrt((et.x - V.x) ** 2 + (et.y - V.y) ** 2) < A * 0.5 || Math.sqrt((tt.x - V.x) ** 2 + (tt.y - V.y) ** 2) < A * 0.5) && c.current.splice(ot, 1);
                }
              else
                H.x += N / U * Q * 2, H.y += K / U * Q * 2;
            else
              H.x += N / U * Q, H.y += K / U * Q;
          }
        }
        H.y > S && (H.y = S, H.py = H.y + O * 0.3), H.x < 0 && (H.x = 0, H.px = H.x - _ * 0.3), H.x > v && (H.x = v, H.px = H.x - _ * 0.3);
      }
      for (let H = 0; H < w; H++)
        for (let _ = c.current.length - 1; _ >= 0; _--) {
          const O = c.current[_], N = X[O.a], K = X[O.b], U = K.x - N.x, Q = K.y - N.y, ot = Math.sqrt(U * U + Q * Q) || 1e-3;
          if (k && ot > L * O.length) {
            c.current.splice(_, 1);
            continue;
          }
          const J = (ot - O.length) / ot * P * 0.5, et = U * J, tt = Q * J;
          N.pinned || (N.x += et, N.y += tt), K.pinned || (K.x -= et, K.y -= tt);
        }
      s.strokeStyle = C, s.lineWidth = d, s.beginPath();
      for (const H of c.current) {
        const _ = X[H.a], O = X[H.b];
        s.moveTo(_.x, _.y), s.lineTo(O.x, O.y);
      }
      if (s.stroke(), Y) {
        s.fillStyle = x;
        for (const H of X)
          H.pinned && (s.beginPath(), s.arc(H.x, H.y, 4, 0, Math.PI * 2), s.fill());
      }
      o.current = requestAnimationFrame(b);
    }
    return o.current = requestAnimationFrame(b), () => {
      I.disconnect(), cancelAnimationFrame(o.current), e.removeEventListener("mousemove", B), e.removeEventListener("mousedown", $), e.removeEventListener("mouseup", l), e.removeEventListener("mouseleave", r);
    };
  }, [a]);
}
const To = {
  default: {
    cols: 25,
    rows: 20,
    spacing: 18,
    gravity: 0.4,
    friction: 0.99,
    stiffness: 1,
    iterations: 3,
    lineColor: "#6b7280",
    pinColor: "#ffffff",
    lineWidth: 1,
    backgroundColor: "#111111",
    wind: 0.3,
    windSpeed: 0.5,
    tearable: !1,
    tearDistance: 3
  },
  silk: {
    cols: 30,
    rows: 22,
    spacing: 15,
    gravity: 0.2,
    friction: 0.995,
    stiffness: 0.8,
    iterations: 5,
    lineColor: "#e0b0ff",
    pinColor: "#ffffff",
    lineWidth: 0.8,
    backgroundColor: "#050010",
    wind: 0.5,
    windSpeed: 0.3,
    tearable: !1
  },
  net: {
    cols: 20,
    rows: 15,
    spacing: 22,
    gravity: 0.5,
    friction: 0.98,
    stiffness: 1,
    iterations: 5,
    lineColor: "#0891B2",
    pinColor: "#67e8f9",
    lineWidth: 1.5,
    backgroundColor: "#020f1a",
    wind: 0.2,
    tearable: !0,
    tearDistance: 2.5
  },
  heavy: {
    cols: 20,
    rows: 18,
    spacing: 20,
    gravity: 0.8,
    friction: 0.97,
    stiffness: 1,
    iterations: 8,
    lineColor: "#94a3b8",
    pinColor: "#e2e8f0",
    lineWidth: 1.5,
    backgroundColor: "#0f172a",
    wind: 0.1,
    tearable: !1
  },
  spider: {
    cols: 15,
    rows: 12,
    spacing: 28,
    gravity: 0.3,
    friction: 0.99,
    stiffness: 0.9,
    iterations: 4,
    lineColor: "#e2e8f0",
    pinColor: "#f8fafc",
    lineWidth: 0.6,
    backgroundColor: "#000000",
    wind: 0.15,
    tearable: !0,
    tearDistance: 4
  }
}, Lo = ht(
  (a, g) => {
    const {
      preset: n,
      cols: i,
      rows: c,
      spacing: o,
      gravity: f,
      friction: y,
      stiffness: h,
      iterations: t,
      lineColor: p,
      pinColor: e,
      lineWidth: s,
      backgroundColor: v,
      wind: S,
      windSpeed: z,
      tearable: D,
      tearDistance: I,
      interactive: W,
      mouseRadius: B,
      mouseForce: $,
      showPins: l,
      width: r,
      height: b,
      className: F,
      style: M
    } = a, P = n && To[n] || {}, w = G(null);
    return gt(g, () => w.current), $o(w, {
      cols: i ?? P.cols ?? 25,
      rows: c ?? P.rows ?? 20,
      spacing: o ?? P.spacing ?? 18,
      gravity: f ?? P.gravity ?? 0.4,
      friction: y ?? P.friction ?? 0.99,
      stiffness: h ?? P.stiffness ?? 1,
      iterations: t ?? P.iterations ?? 3,
      lineColor: p ?? P.lineColor ?? "#6b7280",
      pinColor: e ?? P.pinColor ?? "#ffffff",
      lineWidth: s ?? P.lineWidth ?? 1,
      backgroundColor: v ?? P.backgroundColor ?? "#111111",
      wind: S ?? P.wind ?? 0.3,
      windSpeed: z ?? P.windSpeed ?? 0.5,
      tearable: D ?? P.tearable ?? !1,
      tearDistance: I ?? P.tearDistance ?? 3,
      interactive: W ?? !0,
      mouseRadius: B ?? 30,
      mouseForce: $ ?? 5,
      showPins: l ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: { width: r ?? "100%", height: b ?? "100%", display: "block", overflow: "hidden", ...M },
        children: /* @__PURE__ */ it("canvas", { ref: w, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Lo.displayName = "ClothSimulation";
function dt(a, g, n) {
  return Math.min(a, n - 1) + Math.min(g, n - 1) * n;
}
function ie(a, g, n, i, c, o) {
  const f = o * c * a * a, y = 1 + 4 * f;
  for (let h = 0; h < 4; h++) {
    for (let t = 1; t < a - 1; t++)
      for (let p = 1; p < a - 1; p++)
        n[dt(p, t, a)] = (i[dt(p, t, a)] + f * (n[dt(p - 1, t, a)] + n[dt(p + 1, t, a)] + n[dt(p, t - 1, a)] + n[dt(p, t + 1, a)])) / y;
    zt(a, g, n);
  }
}
function se(a, g, n, i, c, o, f) {
  const y = f * a;
  for (let h = 1; h < a - 1; h++)
    for (let t = 1; t < a - 1; t++) {
      let p = t - y * c[dt(t, h, a)], e = h - y * o[dt(t, h, a)];
      p = Math.max(0.5, Math.min(a - 1.5, p)), e = Math.max(0.5, Math.min(a - 1.5, e));
      const s = Math.floor(p), v = s + 1, S = Math.floor(e), z = S + 1, D = p - s, I = 1 - D, W = e - S, B = 1 - W;
      n[dt(t, h, a)] = I * (B * i[dt(s, S, a)] + W * i[dt(s, z, a)]) + D * (B * i[dt(v, S, a)] + W * i[dt(v, z, a)]);
    }
  zt(a, g, n);
}
function we(a, g, n, i, c) {
  const o = 1 / a;
  for (let f = 1; f < a - 1; f++)
    for (let y = 1; y < a - 1; y++)
      c[dt(y, f, a)] = -0.5 * o * (g[dt(y + 1, f, a)] - g[dt(y - 1, f, a)] + n[dt(y, f + 1, a)] - n[dt(y, f - 1, a)]), i[dt(y, f, a)] = 0;
  zt(a, 0, c), zt(a, 0, i);
  for (let f = 0; f < 4; f++) {
    for (let y = 1; y < a - 1; y++)
      for (let h = 1; h < a - 1; h++)
        i[dt(h, y, a)] = (c[dt(h, y, a)] + i[dt(h - 1, y, a)] + i[dt(h + 1, y, a)] + i[dt(h, y - 1, a)] + i[dt(h, y + 1, a)]) / 4;
    zt(a, 0, i);
  }
  for (let f = 1; f < a - 1; f++)
    for (let y = 1; y < a - 1; y++)
      g[dt(y, f, a)] -= 0.5 * (i[dt(y + 1, f, a)] - i[dt(y - 1, f, a)]) / o, n[dt(y, f, a)] -= 0.5 * (i[dt(y, f + 1, a)] - i[dt(y, f - 1, a)]) / o;
  zt(a, 1, g), zt(a, 2, n);
}
function zt(a, g, n) {
  for (let i = 1; i < a - 1; i++)
    n[dt(0, i, a)] = g === 1 ? -n[dt(1, i, a)] : n[dt(1, i, a)], n[dt(a - 1, i, a)] = g === 1 ? -n[dt(a - 2, i, a)] : n[dt(a - 2, i, a)], n[dt(i, 0, a)] = g === 2 ? -n[dt(i, 1, a)] : n[dt(i, 1, a)], n[dt(i, a - 1, a)] = g === 2 ? -n[dt(i, a - 2, a)] : n[dt(i, a - 2, a)];
  n[dt(0, 0, a)] = 0.5 * (n[dt(1, 0, a)] + n[dt(0, 1, a)]), n[dt(a - 1, 0, a)] = 0.5 * (n[dt(a - 2, 0, a)] + n[dt(a - 1, 1, a)]), n[dt(0, a - 1, a)] = 0.5 * (n[dt(1, a - 1, a)] + n[dt(0, a - 2, a)]), n[dt(a - 1, a - 1, a)] = 0.5 * (n[dt(a - 2, a - 1, a)] + n[dt(a - 1, a - 2, a)]);
}
function zo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(null), o = G(null), f = G(0);
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    const s = Math.max(32, Math.min(128, g.resolution)), v = s * s;
    let S = new Float32Array(v), z = new Float32Array(v), D = new Float32Array(v), I = new Float32Array(v), W = new Float32Array(v), B = new Float32Array(v), $ = new Float32Array(v), l = new Float32Array(v), r = new Float32Array(v), b = new Float32Array(v), F = new Float32Array(v), M = new Float32Array(v), P = null;
    const w = document.createElement("canvas");
    w.width = s, w.height = s;
    const C = w.getContext("2d");
    function x(A, E) {
      const Y = a.current, q = window.devicePixelRatio || 1;
      Y.width = Math.round(A * q), Y.height = Math.round(E * q), Y.style.width = `${A}px`, Y.style.height = `${E}px`, t.scale(q, q), t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", p = A, e = E, P = C.createImageData(s, s);
    }
    const d = new ResizeObserver((A) => {
      const { width: E, height: Y } = A[0].contentRect;
      E > 0 && Y > 0 && x(E, Y);
    });
    d.observe(h);
    const m = h.getBoundingClientRect();
    m.width > 0 && m.height > 0 && x(m.width, m.height);
    function u(A, E, Y, q, X, V, j, H, _) {
      const O = Math.max(1, Math.floor(_));
      for (let N = -O; N <= O; N++)
        for (let K = -O; K <= O; K++) {
          const U = A + K, Q = E + N;
          if (U < 1 || U >= s - 1 || Q < 1 || Q >= s - 1) continue;
          const ot = Math.sqrt(K * K + N * N);
          if (ot > O) continue;
          const J = 1 - ot / O, et = dt(U, Q, s);
          W[et] += X * J, B[et] += V * J, $[et] += j * J, S[et] += Y * H * J, z[et] += q * H * J;
        }
    }
    function R(A) {
      const E = a.current.getBoundingClientRect(), Y = A.clientX - E.left, q = A.clientY - E.top, X = c.current;
      c.current = {
        x: Y,
        y: q,
        px: X ? X.x : Y,
        py: X ? X.y : q
      };
    }
    function k() {
      c.current = null;
    }
    h.addEventListener("mousemove", R), h.addEventListener("mouseleave", k);
    function L() {
      const { autoInk: A, autoInkInterval: E } = n.current;
      A && (o.current = setTimeout(() => {
        const { inkColors: Y } = n.current, q = Y[f.current % Y.length];
        f.current++;
        const X = vt(q).split(",").map(Number), V = Math.floor(s * 0.2 + Math.random() * s * 0.6), j = Math.floor(s * 0.2 + Math.random() * s * 0.6), H = Math.random() * Math.PI * 2;
        u(V, j, Math.cos(H) * 2, Math.sin(H) * 2, X[0] / 255, X[1] / 255, X[2] / 255, 3, 3), L();
      }, E * (0.6 + Math.random() * 0.8)));
    }
    L();
    function T() {
      const { viscosity: A, diffusion: E, dissipation: Y, inkColors: q, backgroundColor: X, mouseForce: V, inkRadius: j } = n.current, H = 0.016, _ = c.current;
      if (_) {
        const N = Math.floor(_.x / p * s), K = Math.floor(_.y / e * s), U = (_.x - _.px) * 0.5, Q = (_.y - _.py) * 0.5, ot = q[f.current % q.length], J = vt(ot).split(",").map(Number);
        u(N, K, U, Q, J[0] / 255, J[1] / 255, J[2] / 255, V, j), Math.abs(U) + Math.abs(Q) > 0.5 && f.current++, _.px = _.x, _.py = _.y;
      }
      D.set(S), I.set(z), ie(s, 1, S, D, A, H), ie(s, 2, z, I, A, H), we(s, S, z, F, M), D.set(S), I.set(z), se(s, 1, S, D, D, I, H), se(s, 2, z, I, D, I, H), we(s, S, z, F, M);
      for (const [N, K] of [[W, l], [B, r], [$, b]]) {
        K.set(N), ie(s, 0, N, K, E, H), K.set(N), se(s, 0, N, K, S, z, H);
        for (let U = 0; U < v; U++)
          N[U] = Math.max(0, N[U] * Y), K[U] = 0;
      }
      for (let N = 0; N < v; N++)
        D[N] = 0, I[N] = 0;
      if (!P) {
        i.current = requestAnimationFrame(T);
        return;
      }
      const O = P.data;
      for (let N = 0; N < s; N++)
        for (let K = 0; K < s; K++) {
          const U = dt(K, N, s), Q = (N * s + K) * 4;
          O[Q] = Math.min(255, W[U] * 255), O[Q + 1] = Math.min(255, B[U] * 255), O[Q + 2] = Math.min(255, $[U] * 255), O[Q + 3] = Math.min(255, (W[U] + B[U] + $[U]) * 200);
        }
      t.clearRect(0, 0, p, e), X && X !== "transparent" && (t.fillStyle = X, t.fillRect(0, 0, p, e)), C.putImageData(P, 0, 0), t.drawImage(w, 0, 0, p, e), i.current = requestAnimationFrame(T);
    }
    return i.current = requestAnimationFrame(T), () => {
      d.disconnect(), cancelAnimationFrame(i.current), h.removeEventListener("mousemove", R), h.removeEventListener("mouseleave", k), o.current && clearTimeout(o.current);
    };
  }, [a, g.resolution]);
}
const Do = {
  default: {
    resolution: 80,
    viscosity: 1e-4,
    diffusion: 1e-4,
    dissipation: 0.995,
    inkColors: ["#ffffff", "#6b7280", "#9ca3af"],
    glowEffect: !0,
    glowBlur: 0,
    backgroundColor: "#111111",
    autoInk: !0,
    autoInkInterval: 1500,
    mouseForce: 5,
    inkRadius: 4
  },
  ink: {
    resolution: 80,
    viscosity: 5e-5,
    diffusion: 5e-5,
    dissipation: 0.998,
    inkColors: ["#1e1b4b", "#312e81", "#4338ca", "#6366f1"],
    backgroundColor: "#f8fafc",
    autoInk: !0,
    autoInkInterval: 2e3,
    mouseForce: 4,
    inkRadius: 3
  },
  neon: {
    resolution: 64,
    viscosity: 1e-5,
    diffusion: 1e-5,
    dissipation: 0.993,
    inkColors: ["#00ffff", "#ff00ff", "#00ff41", "#ff6600"],
    glowEffect: !0,
    backgroundColor: "#000000",
    autoInk: !0,
    mouseForce: 8,
    inkRadius: 5
  },
  lava: {
    resolution: 64,
    viscosity: 1e-3,
    diffusion: 5e-4,
    dissipation: 0.99,
    inkColors: ["#7f1d1d", "#dc2626", "#f97316", "#fbbf24"],
    backgroundColor: "#0c0000",
    autoInk: !0,
    mouseForce: 6,
    inkRadius: 4
  },
  ocean: {
    resolution: 80,
    viscosity: 2e-4,
    diffusion: 1e-4,
    dissipation: 0.997,
    inkColors: ["#0c4a6e", "#0891B2", "#06b6d4", "#67e8f9"],
    backgroundColor: "#020f1a",
    autoInk: !0,
    mouseForce: 4,
    inkRadius: 5
  },
  smoke: {
    resolution: 72,
    viscosity: 5e-5,
    diffusion: 2e-4,
    dissipation: 0.994,
    inkColors: ["#475569", "#94a3b8", "#cbd5e1", "#e2e8f0"],
    backgroundColor: "#0f172a",
    autoInk: !0,
    autoInkInterval: 800,
    mouseForce: 3,
    inkRadius: 6
  }
}, qo = ht(
  (a, g) => {
    const {
      preset: n,
      resolution: i,
      viscosity: c,
      diffusion: o,
      dissipation: f,
      inkColors: y,
      glowEffect: h,
      glowBlur: t,
      backgroundColor: p,
      autoInk: e,
      autoInkInterval: s,
      mouseForce: v,
      inkRadius: S,
      width: z,
      height: D,
      className: I,
      style: W
    } = a, B = n && Do[n] || {}, $ = G(null);
    return gt(g, () => $.current), zo($, {
      resolution: i ?? B.resolution ?? 128,
      viscosity: c ?? B.viscosity ?? 1e-4,
      diffusion: o ?? B.diffusion ?? 1e-4,
      dissipation: f ?? B.dissipation ?? 0.995,
      inkColors: y ?? B.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: h ?? B.glowEffect ?? !0,
      glowBlur: t ?? B.glowBlur ?? 0,
      backgroundColor: p ?? B.backgroundColor ?? "#111111",
      autoInk: e ?? B.autoInk ?? !0,
      autoInkInterval: s ?? B.autoInkInterval ?? 1500,
      mouseForce: v ?? B.mouseForce ?? 5,
      inkRadius: S ?? B.inkRadius ?? 4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: { width: z ?? "100%", height: D ?? "100%", display: "block", overflow: "hidden", ...W },
        children: /* @__PURE__ */ it("canvas", { ref: $, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
qo.displayName = "FluidSimulation";
const Wo = [
  [0.35, 0.25, 0.5],
  // background — slow, dim, thin
  [0.65, 0.55, 0.75],
  // midground
  [1, 1, 1]
  // foreground — fast, bright, full
];
function Yo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G(0), h = G(null);
  ft(() => {
    var t;
    (t = h.current) == null || t.call(h);
  }, [g.dropCount]), ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t.parentElement;
    if (!p) return;
    const e = t.getContext("2d");
    let s = 0, v = 0;
    function S(b = !1) {
      const { speed: F, dropLength: M, dropOpacity: P, dropWidth: w } = n.current, C = Math.floor(Math.random() * 3), [x, d, m] = Wo[C];
      return {
        x: Math.random() * (s + 100) - 50,
        y: b ? Math.random() * v : -M * 2 - Math.random() * v * 0.5,
        speed: F * x * (0.7 + Math.random() * 0.6),
        length: M * m * (0.6 + Math.random() * 0.8),
        opacity: P * d * (0.5 + Math.random() * 0.5),
        width: w * m * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer: C
      };
    }
    function z() {
      i.current = Array.from({ length: n.current.dropCount }, () => S(!0)), c.current = [];
    }
    function D(b, F) {
      const { starCount: M } = n.current;
      o.current = Array.from({ length: M }, () => ({
        x: Math.random() * b,
        y: Math.random() * F,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function I(b, F) {
      const M = window.devicePixelRatio || 1;
      t.width = Math.round(b * M), t.height = Math.round(F * M), t.style.width = `${b}px`, t.style.height = `${F}px`, e.scale(M, M), s = b, v = F, z(), D(b, F);
    }
    h.current = () => {
      s > 0 && v > 0 && z();
    };
    const W = new ResizeObserver((b) => {
      const { width: F, height: M } = b[0].contentRect;
      F > 0 && M > 0 && I(F, M);
    });
    W.observe(p);
    const B = p.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    let $ = g.starCount;
    function l() {
      const { starCount: b, starColor: F, glowingStars: M, starGlowBlur: P } = n.current;
      b !== $ && ($ = b, D(s, v));
      const w = o.current;
      if (w.length !== 0) {
        e.fillStyle = F;
        for (const C of w)
          M && C.isGlowing || (e.globalAlpha = C.opacity, e.beginPath(), e.arc(C.x, C.y, C.r, 0, Math.PI * 2), e.fill());
        if (M) {
          e.shadowColor = F, e.shadowBlur = P;
          for (const C of w)
            C.isGlowing && (e.globalAlpha = C.opacity * 0.12, e.beginPath(), e.arc(C.x, C.y, C.r * 5, 0, Math.PI * 2), e.fill(), e.globalAlpha = C.opacity * 0.35, e.beginPath(), e.arc(C.x, C.y, C.r * 2.5, 0, Math.PI * 2), e.fill(), e.globalAlpha = C.opacity, e.beginPath(), e.arc(C.x, C.y, C.r * 1.5, 0, Math.PI * 2), e.fill());
          e.shadowBlur = 0, e.shadowColor = "rgba(0,0,0,0)";
        }
        e.globalAlpha = 1;
      }
    }
    function r() {
      const { wind: b, windSpeed: F, dropColor: M, splashColor: P, showSplashes: w, backgroundColor: C } = n.current;
      y.current += 0.016;
      const x = y.current, d = b * (Math.sin(x * F) * 0.7 + Math.sin(x * F * 0.37) * 0.3);
      !C || C === "transparent" ? e.clearRect(0, 0, s, v) : (e.fillStyle = C, e.fillRect(0, 0, s, v)), l();
      const m = vt(M), u = vt(P), R = i.current;
      for (let L = 0; L < 3; L++)
        for (let T = 0; T < R.length; T++) {
          const A = R[T];
          if (A.layer !== L) continue;
          const E = d + A.windJitter;
          A.x += E, A.y += A.speed;
          const Y = Math.sqrt(E * E + A.speed * A.speed) || 1, q = A.x - E / Y * A.length, X = A.y - A.speed / Y * A.length, V = e.createLinearGradient(q, X, A.x, A.y);
          V.addColorStop(0, `rgba(${m},0)`), V.addColorStop(1, `rgba(${m},${A.opacity})`), e.beginPath(), e.moveTo(q, X), e.lineTo(A.x, A.y), e.strokeStyle = V, e.lineWidth = A.width, e.lineCap = "round", e.stroke(), A.y > v + A.length && (w && c.current.push({
            x: A.x,
            y: v,
            r: 0,
            maxR: 8 + Math.random() * 12,
            life: 0,
            maxLife: 25 + Math.floor(Math.random() * 25)
          }), R[T] = S()), A.x > s + 60 && (A.x -= s + 120), A.x < -60 && (A.x += s + 120);
        }
      const k = c.current;
      for (let L = k.length - 1; L >= 0; L--) {
        const T = k[L];
        T.life++, T.r = T.life / T.maxLife * T.maxR;
        const A = (1 - T.life / T.maxLife) * 0.75;
        if (A <= 0 || T.life >= T.maxLife) {
          k.splice(L, 1);
          continue;
        }
        e.save(), e.translate(T.x, T.y), e.scale(1.6, 0.35), e.beginPath(), e.arc(0, 0, T.r, 0, Math.PI * 2), e.strokeStyle = `rgba(${u},${A})`, e.lineWidth = 1.2, e.stroke(), e.restore();
      }
      f.current = requestAnimationFrame(r);
    }
    return f.current = requestAnimationFrame(r), () => {
      W.disconnect(), cancelAnimationFrame(f.current);
    };
  }, [a]);
}
const Xo = {
  default: {
    dropColor: "#000000",
    splashColor: "#000000",
    backgroundColor: "#ffffff"
  },
  storm: {
    dropCount: 500,
    speed: 25,
    wind: 1.5,
    windSpeed: 1,
    dropOpacity: 0.8,
    dropLength: 30,
    dropColor: "#94a3b8",
    splashColor: "#cbd5e1",
    backgroundColor: "#0a0a14"
  },
  drizzle: {
    dropCount: 80,
    speed: 8,
    wind: 0.1,
    dropOpacity: 0.3,
    dropLength: 12,
    dropColor: "#7C3AED",
    splashColor: "#0891B2",
    backgroundColor: "#050010"
  },
  neon: {
    dropColor: "#00ffff",
    splashColor: "#ff00ff",
    backgroundColor: "#000000",
    dropOpacity: 0.7,
    dropWidth: 1.5
  },
  golden: {
    dropColor: "#f59e0b",
    splashColor: "#fbbf24",
    backgroundColor: "#0a0500",
    dropOpacity: 0.65,
    dropLength: 18
  }
}, Go = ht((a, g) => {
  const {
    preset: n,
    dropCount: i,
    speed: c,
    wind: o,
    windSpeed: f,
    dropLength: y,
    dropWidth: h,
    dropOpacity: t,
    dropColor: p,
    splashColor: e,
    showSplashes: s,
    backgroundColor: v,
    starCount: S,
    starColor: z,
    glowingStars: D,
    starGlowBlur: I,
    width: W,
    height: B,
    className: $,
    style: l
  } = a, r = n && Xo[n] || {}, b = G(null);
  return gt(g, () => b.current), Yo(b, {
    dropCount: i ?? r.dropCount ?? 200,
    speed: c ?? r.speed ?? 15,
    wind: o ?? r.wind ?? 0.3,
    windSpeed: f ?? r.windSpeed ?? 0.5,
    dropLength: y ?? r.dropLength ?? 28,
    dropWidth: h ?? r.dropWidth ?? 1.5,
    dropOpacity: t ?? r.dropOpacity ?? 0.85,
    dropColor: p ?? r.dropColor ?? "#000000",
    splashColor: e ?? r.splashColor ?? "#000000",
    showSplashes: s ?? r.showSplashes ?? !0,
    backgroundColor: v ?? r.backgroundColor ?? "#ffffff",
    starCount: S ?? 60,
    starColor: z ?? "#ffffff",
    glowingStars: D ?? !1,
    starGlowBlur: I ?? 8
  }), /* @__PURE__ */ it(
    "div",
    {
      className: $,
      style: { width: W ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", ...l },
      children: /* @__PURE__ */ it("canvas", { ref: b, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Go.displayName = "Rain";
function ee(a, g, n, i, c, o, f) {
  if (c <= 0) {
    f.push({ x: n, y: i });
    return;
  }
  const y = Math.hypot(n - a, i - g), h = (a + n) / 2 + (Math.random() - 0.5) * o * y * 0.5, t = (g + i) / 2 + (Math.random() - 0.5) * o * y * 0.1;
  ee(a, g, h, t, c - 1, o, f), ee(h, t, n, i, c - 1, o, f);
}
function Oo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(null), f = G(0);
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s($, l) {
      const r = window.devicePixelRatio || 1;
      y.width = Math.round($ * r), y.height = Math.round(l * r), y.style.width = `${$}px`, y.style.height = `${l}px`, t.scale(r, r), p = $, e = l;
    }
    const v = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && s(l, r);
    });
    v.observe(h);
    const S = h.getBoundingClientRect();
    S.width > 0 && S.height > 0 && s(S.width, S.height);
    function z($) {
      const { glowBlur: l, color: r, coreColor: b } = n.current, F = $.points;
      if (F.length < 2 || $.alpha <= 0) return;
      const M = $.alpha * $.energy;
      t.lineCap = "round", t.lineJoin = "round", t.shadowBlur = 0, t.globalAlpha = M * 0.3, t.strokeStyle = r, t.lineWidth = 6 * $.energy, t.filter = `blur(${Math.round(l * 0.6)}px)`, t.beginPath(), t.moveTo(F[0].x, F[0].y);
      for (let P = 1; P < F.length; P++) t.lineTo(F[P].x, F[P].y);
      t.stroke(), t.filter = "none", t.globalAlpha = M * 0.6, t.strokeStyle = r, t.lineWidth = 2.5 * $.energy, t.shadowColor = r, t.shadowBlur = l * $.energy, t.beginPath(), t.moveTo(F[0].x, F[0].y);
      for (let P = 1; P < F.length; P++) t.lineTo(F[P].x, F[P].y);
      t.stroke(), t.globalAlpha = M * 0.9, t.strokeStyle = b, t.lineWidth = 0.8 * $.energy, t.shadowBlur = 0, t.beginPath(), t.moveTo(F[0].x, F[0].y);
      for (let P = 1; P < F.length; P++) t.lineTo(F[P].x, F[P].y);
      t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0;
    }
    function D($, l) {
      const { segments: r, roughness: b, branchChance: F, branchDecay: M, flickerCount: P } = n.current, { startX: w, startY: C, endY: x } = n.current, d = $ !== void 0 ? $ : w * p, m = C * e, u = d + (Math.random() - 0.5) * p * 0.2, R = l !== void 0 ? l : x * e, k = [];
      function L(T, A, E, Y, q) {
        const X = [{ x: T, y: A }];
        ee(T, A, E, Y, r, b, X), k.push({ points: X, energy: q, alpha: 1 });
        for (let V = 2; V < X.length - 1; V++) {
          if (Math.random() >= F) continue;
          const j = (Math.random() - 0.5) * Math.PI * 0.65, H = (R - X[V].y) * (0.25 + Math.random() * 0.4), _ = X[V].x + Math.sin(j) * H, O = X[V].y + Math.cos(j) * Math.abs(H), N = [{ x: X[V].x, y: X[V].y }];
          ee(X[V].x, X[V].y, _, O, Math.max(2, r - 2), b * 0.8, N), k.push({ points: N, energy: q * M, alpha: 1 });
        }
      }
      for (let T = 0; T < P; T++)
        L(
          d + (Math.random() - 0.5) * 4,
          m,
          u + (Math.random() - 0.5) * 8,
          R,
          1
        );
      i.current = k, f.current = 0.35;
    }
    function I() {
      const { autoInterval: $ } = n.current;
      o.current = setTimeout(() => {
        D(), I();
      }, $ * (0.5 + Math.random()));
    }
    I(), D();
    function W($) {
      if (!n.current.interactive) return;
      const l = y.getBoundingClientRect();
      D($.clientX - l.left, $.clientY - l.top);
    }
    y.addEventListener("click", W);
    function B() {
      const { backgroundColor: $ } = n.current;
      !$ || $ === "transparent" ? t.clearRect(0, 0, p, e) : (t.fillStyle = $, t.fillRect(0, 0, p, e));
      const l = i.current;
      let r = !1;
      for (const b of l)
        b.alpha *= 0.82, b.alpha > 0.01 && (r = !0, z(b));
      r || (i.current = []), f.current > 5e-3 && (t.globalAlpha = f.current, t.fillStyle = "#ffffff", t.fillRect(0, 0, p, e), t.globalAlpha = 1, f.current *= 0.55), c.current = requestAnimationFrame(B);
    }
    return c.current = requestAnimationFrame(B), () => {
      v.disconnect(), cancelAnimationFrame(c.current), o.current && clearTimeout(o.current), y.removeEventListener("click", W);
    };
  }, [a]);
}
const Ho = {
  default: {
    color: "#6b7280",
    coreColor: "#ffffff",
    glowBlur: 20,
    backgroundColor: "#111111"
  },
  neon: {
    color: "#00ffff",
    coreColor: "#ffffff",
    glowBlur: 40,
    branchChance: 0.5,
    backgroundColor: "#000000",
    flickerCount: 4
  },
  storm: {
    color: "#c0c0ff",
    coreColor: "#ffffff",
    branchChance: 0.4,
    roughness: 0.7,
    autoInterval: 1e3,
    backgroundColor: "#050010",
    glowBlur: 15
  },
  plasma: {
    color: "#ff00ff",
    coreColor: "#ffaaff",
    glowBlur: 30,
    segments: 10,
    backgroundColor: "#0a0010",
    branchChance: 0.35
  },
  subtle: {
    glowBlur: 8,
    branchChance: 0.1,
    color: "#94a3b8",
    coreColor: "#e2e8f0",
    autoInterval: 4e3,
    backgroundColor: "#0f172a",
    flickerCount: 2
  }
}, jo = ht((a, g) => {
  const {
    preset: n,
    segments: i,
    roughness: c,
    branchChance: o,
    branchDecay: f,
    flickerCount: y,
    glowBlur: h,
    color: t,
    coreColor: p,
    backgroundColor: e,
    autoInterval: s,
    interactive: v,
    startX: S,
    startY: z,
    endY: D,
    width: I,
    height: W,
    className: B,
    style: $
  } = a, l = n && Ho[n] || {}, r = G(null);
  return gt(g, () => r.current), Oo(r, {
    segments: i ?? l.segments ?? 8,
    roughness: c ?? l.roughness ?? 0.5,
    branchChance: o ?? l.branchChance ?? 0.1,
    branchDecay: f ?? l.branchDecay ?? 0.6,
    flickerCount: y ?? l.flickerCount ?? 3,
    glowBlur: h ?? l.glowBlur ?? 20,
    color: t ?? l.color ?? "#6b7280",
    coreColor: p ?? l.coreColor ?? "#ffffff",
    backgroundColor: e ?? l.backgroundColor ?? "#111111",
    autoInterval: s ?? l.autoInterval ?? 2e3,
    interactive: v ?? l.interactive ?? !0,
    startX: S ?? l.startX ?? 0.5,
    startY: z ?? l.startY ?? 0,
    endY: D ?? l.endY ?? 1
  }), /* @__PURE__ */ it(
    "div",
    {
      className: B,
      style: { width: I ?? "100%", height: W ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...$ },
      children: /* @__PURE__ */ it("canvas", { ref: r, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
jo.displayName = "Lightning";
function No(a, g, n) {
  const i = G(g);
  i.current = g;
  const c = G(0), o = G(new Uint16Array(0)), f = G(new Uint16Array(0)), y = G(0), h = G(0), t = G(!1), p = G(0);
  ft(() => {
    const e = a.current;
    if (!e) return;
    const s = e.parentElement;
    if (!s) return;
    const v = e.getContext("2d");
    let S = 0, z = 0;
    function D(b = !0) {
      const { cellSize: F, initialDensity: M } = i.current, P = Math.floor(S / F), w = Math.floor(z / F);
      if (y.current = P, h.current = w, o.current = new Uint16Array(P * w), f.current = new Uint16Array(P * w), b)
        for (let C = 0; C < o.current.length; C++)
          o.current[C] = Math.random() < M ? 1 : 0;
    }
    function I(b, F) {
      const M = a.current, P = window.devicePixelRatio || 1;
      M.width = Math.round(b * P), M.height = Math.round(F * P), M.style.width = `${b}px`, M.style.height = `${F}px`, v.scale(P, P), S = b, z = F, D(!0);
    }
    const W = new ResizeObserver((b) => {
      const { width: F, height: M } = b[0].contentRect;
      F > 0 && M > 0 && I(F, M);
    });
    W.observe(s);
    const B = s.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height), n && (n.current = {
      randomize: () => D(!0),
      clear: () => {
        o.current.fill(0);
      },
      pause: () => {
        t.current = !0;
      },
      resume: () => {
        t.current = !1;
      }
    });
    function $() {
      const b = y.current, F = h.current, M = o.current, P = f.current, { wrapEdges: w } = i.current;
      for (let C = 0; C < F; C++)
        for (let x = 0; x < b; x++) {
          let d = 0;
          for (let R = -1; R <= 1; R++)
            for (let k = -1; k <= 1; k++) {
              if (R === 0 && k === 0) continue;
              let L = C + R, T = x + k;
              if (w)
                L = (L + F) % F, T = (T + b) % b;
              else if (L < 0 || L >= F || T < 0 || T >= b) continue;
              M[L * b + T] > 0 && d++;
            }
          const m = C * b + x, u = M[m] > 0;
          u && (d === 2 || d === 3) ? P[m] = Math.min(M[m] + 1, 255) : !u && d === 3 ? P[m] = 1 : P[m] = 0;
        }
      o.current = P.slice();
    }
    function l(b) {
      const { cellSize: F, speed: M, aliveColor: P, oldColor: w, deadColor: C, showAge: x, backgroundColor: d } = i.current;
      if (!t.current) {
        const L = 1e3 / M;
        b - p.current >= L && ($(), p.current = b);
      }
      v.fillStyle = d, v.fillRect(0, 0, S, z);
      const m = y.current, u = h.current, R = o.current, k = 60;
      for (let L = 0; L < u; L++)
        for (let T = 0; T < m; T++) {
          const A = R[L * m + T];
          if (A === 0) continue;
          const E = x ? Math.min(A / k, 1) : 0, [Y, q, X] = Rt([P, w], E);
          v.fillStyle = `rgb(${Y},${q},${X})`, v.fillRect(T * F + 0.5, L * F + 0.5, F - 1, F - 1);
        }
      c.current = requestAnimationFrame(l);
    }
    c.current = requestAnimationFrame(l);
    function r(b) {
      if (!i.current.interactive) return;
      const M = a.current.getBoundingClientRect(), P = b.clientX - M.left, w = b.clientY - M.top, { cellSize: C } = i.current, x = Math.floor(P / C), d = Math.floor(w / C), m = y.current, u = h.current;
      if (x < 0 || x >= m || d < 0 || d >= u) return;
      const R = d * m + x;
      o.current[R] = o.current[R] > 0 ? 0 : 1;
    }
    return e.addEventListener("click", r), () => {
      W.disconnect(), cancelAnimationFrame(c.current), e.removeEventListener("click", r);
    };
  }, [a, n]);
}
const Uo = {
  default: {
    aliveColor: "#ffffff",
    oldColor: "#6b7280",
    deadColor: "#111111",
    backgroundColor: "#111111"
  },
  neon: {
    aliveColor: "#00ff41",
    oldColor: "#00ffff",
    deadColor: "#000000",
    backgroundColor: "#000000",
    cellSize: 6
  },
  matrix: {
    aliveColor: "#00ff41",
    oldColor: "#004d14",
    deadColor: "#000000",
    backgroundColor: "#000000",
    cellSize: 10
  },
  minimal: {
    aliveColor: "#ffffff",
    oldColor: "#94a3b8",
    deadColor: "#0f172a",
    backgroundColor: "#0f172a",
    showAge: !1
  },
  fire: {
    aliveColor: "#ff6b00",
    oldColor: "#ffff00",
    deadColor: "#050010",
    backgroundColor: "#050010",
    cellSize: 5,
    speed: 8
  }
}, Vo = ht((a, g) => {
  const {
    preset: n,
    cellSize: i,
    speed: c,
    initialDensity: o,
    aliveColor: f,
    oldColor: y,
    deadColor: h,
    showAge: t,
    wrapEdges: p,
    interactive: e,
    backgroundColor: s,
    width: v,
    height: S,
    className: z,
    style: D
  } = a, I = n && Uo[n] || {}, W = G(null), B = G(null);
  return gt(g, () => B.current), No(W, {
    cellSize: i ?? I.cellSize ?? 8,
    speed: c ?? I.speed ?? 10,
    initialDensity: o ?? I.initialDensity ?? 0.3,
    aliveColor: f ?? I.aliveColor ?? "#ffffff",
    oldColor: y ?? I.oldColor ?? "#6b7280",
    deadColor: h ?? I.deadColor ?? "#111111",
    showAge: t ?? I.showAge ?? !0,
    wrapEdges: p ?? I.wrapEdges ?? !0,
    interactive: e ?? I.interactive ?? !0,
    backgroundColor: s ?? I.backgroundColor ?? "#111111"
  }, B), /* @__PURE__ */ it(
    "div",
    {
      className: z,
      style: { width: v ?? "100%", height: S ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...D },
      children: /* @__PURE__ */ it("canvas", { ref: W, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Vo.displayName = "GameOfLife";
function _o(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G(0), f = G(1), y = G(null);
  ft(() => {
    var h;
    (h = y.current) == null || h.call(y);
  }, [g.ringCount]), ft(() => {
    const h = a.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const p = h.getContext("2d");
    let e = 0, s = 0;
    function v() {
      const { ringCount: $, starCount: l } = n.current;
      i.current = Array.from({ length: $ }, (r, b) => ({
        z: b / $,
        colorIndex: b % Math.max(1, n.current.colors.length),
        rotation: b / $ * Math.PI * 2
      })), c.current = Array.from({ length: l }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08
      }));
    }
    function S($, l) {
      const r = a.current, b = window.devicePixelRatio || 1;
      r.width = Math.round($ * b), r.height = Math.round(l * b), r.style.width = `${$}px`, r.style.height = `${l}px`, p.scale(b, b), e = $, s = l, v();
    }
    y.current = () => {
      e > 0 && s > 0 && v();
    };
    const z = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && S(l, r);
    });
    z.observe(t);
    const D = t.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I($) {
      if (!n.current.interactive) return;
      const r = a.current.getBoundingClientRect(), b = ($.clientX - r.left) / r.width;
      f.current = 0.2 + b * 2.8;
    }
    h.addEventListener("mousemove", I);
    function W($, l, r) {
      const { fov: b, depth: F, twist: M } = n.current, P = Math.min(e, s) * 0.45, w = b / (b + l * F), C = r + l * M * Math.PI * 2, x = e / 2 + Math.cos($ + C) * P * w, d = s / 2 + Math.sin($ + C) * P * w;
      return { px: x, py: d, scale: w };
    }
    function B() {
      const { speed: $, colors: l, backgroundColor: r, lineWidth: b, opacity: F, starColor: M } = n.current, P = i.current, w = c.current, C = $ * f.current * 8e-3;
      p.fillStyle = r, p.fillRect(0, 0, e, s);
      const x = [...P].sort((d, m) => d.z - m.z);
      for (const d of x) {
        d.z += C, d.z >= 1 && (d.z -= 1, d.colorIndex = (d.colorIndex + 1) % Math.max(1, l.length)), d.rotation += C * 0.1;
        const m = 64, u = (1 - d.z) * F;
        if (u <= 0.01) continue;
        const R = l[d.colorIndex % l.length] ?? "#7C3AED", { scale: k } = W(0, d.z, d.rotation);
        p.beginPath();
        for (let L = 0; L <= m; L++) {
          const T = L / m * Math.PI * 2, { px: A, py: E } = W(T, d.z, d.rotation);
          L === 0 ? p.moveTo(A, E) : p.lineTo(A, E);
        }
        p.closePath(), p.strokeStyle = R, p.globalAlpha = u, p.lineWidth = b * k, p.stroke(), p.globalAlpha = 1;
      }
      for (const d of w) {
        d.ringZ += C, d.ringZ >= 1 && (d.ringZ -= 1);
        const { px: m, py: u, scale: R } = W(d.angle + d.offset * Math.PI * 2, d.ringZ, 0), k = (1 - d.ringZ) * 0.8;
        k <= 0 || (p.beginPath(), p.arc(m, u, Math.max(0.5, 1.5 * R), 0, Math.PI * 2), p.fillStyle = M, p.globalAlpha = k, p.fill(), p.globalAlpha = 1);
      }
      o.current = requestAnimationFrame(B);
    }
    return o.current = requestAnimationFrame(B), () => {
      z.disconnect(), cancelAnimationFrame(o.current), h.removeEventListener("mousemove", I);
    };
  }, [a]);
}
const Jo = {
  default: {
    colors: ["#ffffff", "#6b7280"],
    backgroundColor: "#111111"
  },
  hyperspace: {
    colors: ["#ffffff", "#88aaff", "#aaddff"],
    speed: 3,
    starCount: 200,
    twist: 0,
    lineWidth: 1,
    backgroundColor: "#000005"
  },
  neon: {
    colors: ["#00ffff", "#ff00ff", "#00ff41"],
    twist: 0.5,
    lineWidth: 2,
    backgroundColor: "#000000",
    opacity: 0.9
  },
  vortex: {
    colors: ["#7C3AED", "#a855f7", "#c084fc"],
    twist: 1.2,
    speed: 1.5,
    backgroundColor: "#05000a"
  },
  minimal: {
    colors: ["#334155"],
    backgroundColor: "#0f172a",
    starCount: 50,
    lineWidth: 1,
    opacity: 0.5,
    speed: 0.6
  }
}, Ko = ht((a, g) => {
  const {
    preset: n,
    ringCount: i,
    speed: c,
    colors: o,
    backgroundColor: f,
    twist: y,
    fov: h,
    depth: t,
    lineWidth: p,
    opacity: e,
    starCount: s,
    starColor: v,
    interactive: S,
    width: z,
    height: D,
    className: I,
    style: W
  } = a, B = n && Jo[n] || {}, $ = G(null);
  return gt(g, () => $.current), _o($, {
    ringCount: i ?? B.ringCount ?? 30,
    speed: c ?? B.speed ?? 1,
    colors: o ?? B.colors ?? ["#ffffff", "#6b7280"],
    backgroundColor: f ?? B.backgroundColor ?? "#111111",
    twist: y ?? B.twist ?? 0.3,
    fov: h ?? B.fov ?? 300,
    depth: t ?? B.depth ?? 400,
    lineWidth: p ?? B.lineWidth ?? 1.5,
    opacity: e ?? B.opacity ?? 0.8,
    starCount: s ?? B.starCount ?? 100,
    starColor: v ?? B.starColor ?? "#ffffff",
    interactive: S ?? B.interactive ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: I,
      style: { width: z ?? "100%", height: D ?? "100%", display: "block", overflow: "hidden", ...W },
      children: /* @__PURE__ */ it("canvas", { ref: $, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Ko.displayName = "Wormhole";
function Qo(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(null), f = G(null);
  ft(() => {
    var y;
    (y = f.current) == null || y.call(f);
  }, [g.count]), ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s() {
      const r = n.current.maxSpeed, b = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * p,
        y: Math.random() * e,
        vx: Math.cos(b) * r * 0.5,
        vy: Math.sin(b) * r * 0.5,
        trail: []
      };
    }
    function v() {
      const { count: r } = n.current;
      i.current = Array.from({ length: r }, s);
    }
    function S(r, b) {
      const F = a.current, M = window.devicePixelRatio || 1;
      F.width = Math.round(r * M), F.height = Math.round(b * M), F.style.width = `${r}px`, F.style.height = `${b}px`, t.scale(M, M), p = r, e = b, v();
    }
    f.current = () => {
      p > 0 && e > 0 && v();
    };
    const z = new ResizeObserver((r) => {
      const { width: b, height: F } = r[0].contentRect;
      b > 0 && F > 0 && S(b, F);
    });
    z.observe(h);
    const D = h.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(r) {
      if (!n.current.interactive) return;
      const F = a.current.getBoundingClientRect();
      o.current = { x: r.clientX - F.left, y: r.clientY - F.top };
    }
    function W() {
      o.current = null;
    }
    y.addEventListener("mousemove", I), y.addEventListener("mouseleave", W);
    function B(r, b) {
      const F = /* @__PURE__ */ new Map();
      for (let M = 0; M < r.length; M++) {
        const P = Math.floor(r[M].x / b), w = Math.floor(r[M].y / b), C = `${P},${w}`;
        F.has(C) || F.set(C, []), F.get(C).push(M);
      }
      return F;
    }
    function $(r, b, F, M) {
      const P = Math.floor(b.x / F), w = Math.floor(b.y / F), C = Math.ceil(M / F), x = [];
      for (let d = -C; d <= C; d++)
        for (let m = -C; m <= C; m++) {
          const u = `${P + d},${w + m}`, R = r.get(u);
          R && x.push(...R);
        }
      return x;
    }
    function l() {
      const {
        maxSpeed: r,
        separationRadius: b,
        alignmentRadius: F,
        cohesionRadius: M,
        separationForce: P,
        alignmentForce: w,
        cohesionForce: C,
        color: x,
        trailLength: d,
        trailOpacity: m,
        boidSize: u,
        backgroundColor: R,
        mouseRadius: k,
        mouseForce: L,
        wrapEdges: T
      } = n.current;
      t.fillStyle = R, t.fillRect(0, 0, p, e);
      const A = i.current, E = Math.max(b, F, M), Y = B(A, E), q = o.current, X = vt(x);
      for (let V = 0; V < A.length; V++) {
        const j = A[V];
        j.trail.push({ x: j.x, y: j.y }), j.trail.length > d && j.trail.shift();
        const H = $(Y, j, E, Math.max(b, F, M));
        let _ = 0, O = 0, N = 0, K = 0, U = 0, Q = 0, ot = 0, J = 0, et = 0;
        for (const at of H) {
          if (at === V) continue;
          const st = A[at], lt = j.x - st.x, ct = j.y - st.y, ut = Math.sqrt(lt * lt + ct * ct) || 1e-3;
          ut < b && (_ += lt / ut, O += ct / ut, N++), ut < F && (K += st.vx, U += st.vy, Q++), ut < M && (ot += st.x, J += st.y, et++);
        }
        let tt = 0, nt = 0;
        if (N > 0 && (tt += _ / N * P * r, nt += O / N * P * r), Q > 0 && (tt += (K / Q - j.vx) * w, nt += (U / Q - j.vy) * w), et > 0 && (tt += (ot / et - j.x) / M * C * r, nt += (J / et - j.y) / M * C * r), q) {
          const at = j.x - q.x, st = j.y - q.y, lt = Math.sqrt(at * at + st * st) || 1e-3;
          lt < k && (tt += at / lt * L * r, nt += st / lt * L * r);
        }
        j.vx += tt, j.vy += nt;
        const rt = Math.sqrt(j.vx * j.vx + j.vy * j.vy) || 1e-3;
        if (rt > r && (j.vx = j.vx / rt * r, j.vy = j.vy / rt * r), j.x += j.vx, j.y += j.vy, T ? (j.x < 0 && (j.x += p, j.trail = []), j.x > p && (j.x -= p, j.trail = []), j.y < 0 && (j.y += e, j.trail = []), j.y > e && (j.y -= e, j.trail = [])) : ((j.x < 0 || j.x > p) && (j.vx *= -1), (j.y < 0 || j.y > e) && (j.vy *= -1), j.x = Math.max(0, Math.min(p, j.x)), j.y = Math.max(0, Math.min(e, j.y))), j.trail.length > 1) {
          t.beginPath(), t.moveTo(j.trail[0].x, j.trail[0].y);
          for (let at = 1; at < j.trail.length; at++) {
            const st = j.trail[at - 1], lt = j.trail[at];
            Math.abs(lt.x - st.x) > p * 0.5 || Math.abs(lt.y - st.y) > e * 0.5 ? t.moveTo(lt.x, lt.y) : t.lineTo(lt.x, lt.y);
          }
          t.strokeStyle = `rgba(${X},${m})`, t.lineWidth = 1, t.stroke();
        }
        const Z = Math.atan2(j.vy, j.vx);
        t.save(), t.translate(j.x, j.y), t.rotate(Z), t.beginPath(), t.moveTo(u, 0), t.lineTo(-u * 0.6, u * 0.5), t.lineTo(-u * 0.6, -u * 0.5), t.closePath(), t.fillStyle = `rgba(${X},0.9)`, t.fill(), t.restore();
      }
      c.current = requestAnimationFrame(l);
    }
    return c.current = requestAnimationFrame(l), () => {
      z.disconnect(), cancelAnimationFrame(c.current), y.removeEventListener("mousemove", I), y.removeEventListener("mouseleave", W);
    };
  }, [a]);
}
const Zo = {
  default: {
    color: "#ffffff",
    backgroundColor: "#111111"
  },
  birds: {
    color: "#94a3b8",
    backgroundColor: "#0f172a",
    trailLength: 12,
    boidSize: 7,
    count: 60,
    maxSpeed: 2.5
  },
  fish: {
    color: "#0891B2",
    backgroundColor: "#030d1a",
    alignmentRadius: 40,
    cohesionForce: 0.05,
    trailLength: 6,
    boidSize: 5
  },
  swarm: {
    color: "#f59e0b",
    backgroundColor: "#050010",
    count: 200,
    boidSize: 4,
    trailLength: 4,
    maxSpeed: 4,
    separationRadius: 15,
    alignmentRadius: 35,
    cohesionRadius: 40
  },
  neon: {
    color: "#00ffff",
    backgroundColor: "#000000",
    trailOpacity: 0.6,
    trailLength: 15,
    boidSize: 6
  }
}, tn = ht((a, g) => {
  const {
    preset: n,
    count: i,
    maxSpeed: c,
    separationRadius: o,
    alignmentRadius: f,
    cohesionRadius: y,
    separationForce: h,
    alignmentForce: t,
    cohesionForce: p,
    color: e,
    trailLength: s,
    trailOpacity: v,
    boidSize: S,
    backgroundColor: z,
    interactive: D,
    mouseRadius: I,
    mouseForce: W,
    wrapEdges: B,
    width: $,
    height: l,
    className: r,
    style: b
  } = a, F = n && Zo[n] || {}, M = G(null);
  return gt(g, () => M.current), Qo(M, {
    count: i ?? F.count ?? 80,
    maxSpeed: c ?? F.maxSpeed ?? 3,
    separationRadius: o ?? F.separationRadius ?? 25,
    alignmentRadius: f ?? F.alignmentRadius ?? 50,
    cohesionRadius: y ?? F.cohesionRadius ?? 60,
    separationForce: h ?? F.separationForce ?? 0.05,
    alignmentForce: t ?? F.alignmentForce ?? 0.05,
    cohesionForce: p ?? F.cohesionForce ?? 0.03,
    color: e ?? F.color ?? "#ffffff",
    trailLength: s ?? F.trailLength ?? 8,
    trailOpacity: v ?? F.trailOpacity ?? 0.4,
    boidSize: S ?? F.boidSize ?? 6,
    backgroundColor: z ?? F.backgroundColor ?? "#111111",
    interactive: D ?? F.interactive ?? !0,
    mouseRadius: I ?? F.mouseRadius ?? 80,
    mouseForce: W ?? F.mouseForce ?? 0.2,
    wrapEdges: B ?? F.wrapEdges ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: r,
      style: { width: $ ?? "100%", height: l ?? "100%", display: "block", overflow: "hidden", ...b },
      children: /* @__PURE__ */ it("canvas", { ref: M, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
tn.displayName = "Boids";
function ve(a) {
  const g = a.replace("#", ""), n = g.length === 3 ? g.split("").map((c) => c + c).join("") : g, i = parseInt(n, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function en(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(null);
  ft(() => {
    const o = a.current;
    if (!o) return;
    const f = o.parentElement;
    if (!f) return;
    const y = o.getContext("2d");
    let h = 0, t = 0;
    function p(M, P) {
      const w = M * P, C = new Float32Array(w).fill(1), x = new Float32Array(w).fill(0), d = Math.max(5, Math.floor(M * P / 1e3));
      for (let k = 0; k < d; k++) {
        const L = Math.floor(Math.random() * M), T = Math.floor(Math.random() * P), A = Math.floor(2 + Math.random() * 5);
        for (let E = -A; E <= A; E++)
          for (let Y = -A; Y <= A; Y++)
            if (Y * Y + E * E <= A * A) {
              const q = (L + Y + M) % M, V = (T + E + P) % P * M + q;
              C[V] = 0.5 + (Math.random() - 0.5) * 0.1, x[V] = 0.25 + Math.random() * 0.1;
            }
      }
      const m = new OffscreenCanvas(M, P), u = m.getContext("2d"), R = u.createImageData(M, P);
      for (let k = 0; k < w; k++) R.data[k * 4 + 3] = 255;
      c.current = {
        u: C,
        v: x,
        uNext: new Float32Array(w),
        vNext: new Float32Array(w),
        gw: M,
        gh: P,
        imageData: R,
        offscreen: m,
        offCtx: u
      };
    }
    function e(M, P) {
      const w = window.devicePixelRatio || 1;
      h = M, t = P, o.width = Math.round(h * w), o.height = Math.round(t * w), o.style.width = `${h}px`, o.style.height = `${t}px`, y.setTransform(w, 0, 0, w, 0, 0);
      const { resolution: C } = n.current, x = Math.max(4, Math.round(h * C)), d = Math.max(4, Math.round(t * C));
      p(x, d);
    }
    const s = new ResizeObserver((M) => {
      const { width: P, height: w } = M[0].contentRect;
      P > 0 && w > 0 && e(P, w);
    });
    s.observe(f);
    const v = f.getBoundingClientRect();
    v.width > 0 && v.height > 0 && e(v.width, v.height);
    let S = !1, z = -1, D = -1;
    function I(M, P) {
      const w = c.current;
      if (!w) return;
      const C = o.getBoundingClientRect(), x = M - C.left, d = P - C.top;
      z = Math.floor(x / h * w.gw), D = Math.floor(d / t * w.gh);
    }
    function W(M) {
      n.current.interactive && I(M.clientX, M.clientY);
    }
    function B(M) {
      n.current.interactive && (S = !0, I(M.clientX, M.clientY));
    }
    function $() {
      S = !1, z = -1, D = -1;
    }
    function l() {
      S = !1, z = -1, D = -1;
    }
    f.addEventListener("mousemove", W), f.addEventListener("mousedown", B), f.addEventListener("mouseup", $), f.addEventListener("mouseleave", l);
    function r() {
      const M = c.current;
      if (!M) return;
      const { u: P, v: w, uNext: C, vNext: x, gw: d, gh: m } = M, { feedRate: u, killRate: R, diffusionU: k, diffusionV: L } = n.current;
      if (S && z >= 0 && D >= 0) {
        for (let A = -3; A <= 3; A++)
          for (let E = -3; E <= 3; E++)
            if (E * E + A * A <= 3 * 3) {
              const Y = (z + E + d) % d, X = (D + A + m) % m * d + Y;
              P[X] = 0.5, w[X] = 0.25;
            }
      }
      for (let T = 0; T < m; T++) {
        const A = (T - 1 + m) % m * d, E = (T + 1) % m * d, Y = T * d;
        for (let q = 0; q < d; q++) {
          const X = Y + q, V = (q - 1 + d) % d, j = (q + 1) % d, H = P[Y + V] + P[Y + j] + P[A + q] + P[E + q] - 4 * P[X], _ = w[Y + V] + w[Y + j] + w[A + q] + w[E + q] - 4 * w[X], O = P[X] * w[X] * w[X];
          C[X] = Math.max(0, Math.min(1, P[X] + k * H - O + u * (1 - P[X]))), x[X] = Math.max(0, Math.min(1, w[X] + L * _ + O - (u + R) * w[X]));
        }
      }
      M.u.set(C), M.v.set(x);
    }
    function b() {
      const M = c.current;
      if (!M) return;
      const { u: P, v: w, gw: C, gh: x, imageData: d, offscreen: m, offCtx: u } = M, { colorA: R, colorB: k, backgroundColor: L } = n.current, [T, A, E] = ve(R), [Y, q, X] = ve(k), V = d.data;
      for (let j = 0; j < C * x; j++) {
        const H = Math.max(0, Math.min(1, w[j] * 3.5)), _ = 1 - P[j] * 0.15, O = j * 4;
        V[O] = Math.round((T + (Y - T) * H) * _), V[O + 1] = Math.round((A + (q - A) * H) * _), V[O + 2] = Math.round((E + (X - E) * H) * _);
      }
      u.putImageData(d, 0, 0), L && L !== "transparent" && (y.fillStyle = L, y.fillRect(0, 0, h, t)), y.imageSmoothingEnabled = !0, y.imageSmoothingQuality = "low", y.drawImage(m, 0, 0, h, t);
    }
    function F() {
      const { speed: M } = n.current, P = Math.max(1, Math.round(M));
      for (let w = 0; w < P; w++) r();
      b(), i.current = requestAnimationFrame(F);
    }
    return i.current = requestAnimationFrame(F), () => {
      s.disconnect(), cancelAnimationFrame(i.current), f.removeEventListener("mousemove", W), f.removeEventListener("mousedown", B), f.removeEventListener("mouseup", $), f.removeEventListener("mouseleave", l);
    };
  }, [a, g.resolution]);
}
const on = {
  default: {},
  coral: { feedRate: 0.055, killRate: 0.062 },
  spots: { feedRate: 0.035, killRate: 0.065 },
  maze: { feedRate: 0.029, killRate: 0.057 },
  waves: { feedRate: 0.014, killRate: 0.053, speed: 6 },
  neon: { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" }
}, nn = ht(
  (a, g) => {
    const {
      preset: n,
      feedRate: i,
      killRate: c,
      diffusionU: o,
      diffusionV: f,
      resolution: y,
      speed: h,
      colorA: t,
      colorB: p,
      backgroundColor: e,
      interactive: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && on[n] || {}, W = G(null);
    return gt(g, () => W.current), en(W, {
      feedRate: i ?? I.feedRate ?? 0.055,
      killRate: c ?? I.killRate ?? 0.062,
      diffusionU: o ?? I.diffusionU ?? 0.2,
      diffusionV: f ?? I.diffusionV ?? 0.1,
      resolution: y ?? I.resolution ?? 0.5,
      speed: h ?? I.speed ?? 8,
      colorA: t ?? I.colorA ?? "#111111",
      colorB: p ?? I.colorB ?? "#ffffff",
      backgroundColor: e ?? I.backgroundColor ?? "#111111",
      interactive: s ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...D
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: W,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
nn.displayName = "ReactionDiffusion";
function rn(a) {
  const g = a.replace("#", ""), n = g.length === 3 ? g.split("").map((c) => c + c).join("") : g, i = parseInt(n, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function an(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(0), o = G([]), f = G([]);
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s(l, r) {
      const { starCount: b } = n.current;
      o.current = Array.from({ length: b }, () => ({
        x: Math.random() * l,
        y: Math.random() * r * 0.7,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6
      }));
    }
    function v(l) {
      const { layers: r } = n.current;
      f.current = Array.from({ length: r }, (b, F) => ({
        colorIndex: F % Math.max(1, n.current.colors.length),
        freqOffset: 0.5 + Math.random() * 1.5,
        ampScale: 0.4 + Math.random() * 0.6,
        speedScale: 0.3 + Math.random() * 0.7,
        yCenter: 0.15 + F / Math.max(1, r - 1) * 0.45,
        thickness: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function S(l, r) {
      const b = window.devicePixelRatio || 1;
      p = l, e = r, y.width = Math.round(p * b), y.height = Math.round(e * b), y.style.width = `${p}px`, y.style.height = `${e}px`, t.scale(b, b), s(p, e), v();
    }
    const z = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && S(r, b);
    });
    z.observe(h);
    const D = h.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    let I = g.layers, W = g.starCount, B = 0;
    function $(l) {
      const r = B ? Math.min(l - B, 50) : 16;
      B = l;
      const { colors: b, speed: F, intensity: M, layers: P, waveAmplitude: w, waveFrequency: C, backgroundColor: x, animated: d, starCount: m } = n.current;
      P !== I && (I = P, v()), m !== W && (W = m, s(p, e)), d && (c.current += r * 1e-3 * F);
      const u = c.current;
      t.fillStyle = x, t.fillRect(0, 0, p, e);
      const R = o.current;
      for (const A of R)
        t.beginPath(), t.arc(A.x, A.y, A.r, 0, Math.PI * 2), t.fillStyle = `rgba(255,255,255,${A.opacity * 0.8})`, t.fill();
      const k = t.globalCompositeOperation;
      t.globalCompositeOperation = "screen";
      const L = Math.max(4, Math.ceil(p / 4)), T = p / L;
      for (const A of f.current) {
        const E = b[A.colorIndex % b.length] || "#ffffff", [Y, q, X] = rn(E), V = A.yCenter * e, j = w * e * A.ampScale, H = C * A.freqOffset, _ = A.thickness * e;
        t.beginPath();
        for (let K = 0; K <= L; K++) {
          const U = K * T, Q = U / p * Math.PI * 2 * H + u * A.speedScale + A.phase, ot = V - j * Math.sin(Q) - _ * 0.5;
          K === 0 ? t.moveTo(U, ot) : t.lineTo(U, ot);
        }
        for (let K = L; K >= 0; K--) {
          const U = K * T, Q = U / p * Math.PI * 2 * H + u * A.speedScale + A.phase, ot = V - j * Math.sin(Q) + _ * 0.5;
          t.lineTo(U, ot);
        }
        t.closePath();
        const O = t.createLinearGradient(0, V - j - _, 0, V + j + _);
        O.addColorStop(0, `rgba(${Y},${q},${X},0)`), O.addColorStop(0.3, `rgba(${Y},${q},${X},${M * 0.6})`), O.addColorStop(0.5, `rgba(${Y},${q},${X},${M})`), O.addColorStop(0.7, `rgba(${Y},${q},${X},${M * 0.6})`), O.addColorStop(1, `rgba(${Y},${q},${X},0)`), t.fillStyle = O, t.fill();
        const N = Math.floor(p / 60);
        for (let K = 0; K < N; K++) {
          const U = (K / N + u * 0.02 * A.speedScale) % 1 * p, Q = V - j - _ * 0.5, ot = _ * 2 + j * 2, J = t.createLinearGradient(0, Q, 0, Q + ot);
          J.addColorStop(0, `rgba(${Y},${q},${X},0)`), J.addColorStop(0.5, `rgba(${Y},${q},${X},${M * 0.3})`), J.addColorStop(1, `rgba(${Y},${q},${X},0)`), t.fillStyle = J, t.fillRect(U - 1, Q, 2, ot);
        }
      }
      t.globalCompositeOperation = k, i.current = requestAnimationFrame($);
    }
    return i.current = requestAnimationFrame($), () => {
      z.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const sn = {
  default: {},
  arctic: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  solar: { colors: ["#ff4400", "#ff8800", "#cc00ff"], backgroundColor: "#0a0005" },
  tropical: { colors: ["#00ffcc", "#0088ff", "#00ff44"], backgroundColor: "#030a0a" },
  neon: { colors: ["#ff00ff", "#00ffff", "#ff0088"], backgroundColor: "#000000", intensity: 1 },
  midnight: { colors: ["#4400cc", "#0033ff", "#2200aa"], backgroundColor: "#000005" }
}, ln = ht(
  (a, g) => {
    const {
      preset: n,
      colors: i,
      speed: c,
      intensity: o,
      layers: f,
      backgroundColor: y,
      waveAmplitude: h,
      waveFrequency: t,
      starCount: p,
      animated: e,
      width: s,
      height: v,
      className: S,
      style: z
    } = a, D = n && sn[n] || {}, I = G(null);
    return gt(g, () => I.current), an(I, {
      colors: i ?? D.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: c ?? D.speed ?? 1,
      intensity: o ?? D.intensity ?? 0.8,
      layers: f ?? 5,
      backgroundColor: y ?? D.backgroundColor ?? "#111111",
      waveAmplitude: h ?? 0.15,
      waveFrequency: t ?? 2,
      starCount: p ?? 80,
      animated: e ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: {
          width: s ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          ...z
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: I,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ln.displayName = "AuroraBorealis";
function cn(a, g) {
  for (a = Math.abs(Math.round(a)), g = Math.abs(Math.round(g)); g > 0; ) [a, g] = [g, a % g];
  return a || 1;
}
function un(a, g) {
  const n = cn(a, g);
  return 2 * Math.PI * (g / n);
}
function fn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0, t = [], p = -1, e = -1, s = -1, v = -1, S = !0;
    function z(w, C) {
      const x = y / 2, d = h / 2, m = x + (w.R - w.r) * Math.cos(C) + w.d * Math.cos((w.R - w.r) / w.r * C), u = d + (w.R - w.r) * Math.sin(C) - w.d * Math.sin((w.R - w.r) / w.r * C);
      return [m, u];
    }
    function D(w, C, x) {
      const { outerRadius: d, innerRadius: m, penDistance: u } = n.current, k = Math.min(y, h) / 2 * d, T = C > 1 ? (w / (C - 1) - 0.5) * 0.12 : 0;
      let A, E;
      x ? (A = k * Math.max(0.05, m + T + (Math.random() - 0.5) * 0.08), E = A * Math.max(0.05, u * (0.85 + Math.random() * 0.3))) : (A = k * Math.max(0.05, m + T), E = A * Math.max(0.05, u)), A = Math.max(1, A), E = Math.max(0.1, E);
      const Y = un(k, A), q = { t: 0, prevX: 0, prevY: 0, R: k, r: A, d: E, fullPeriod: Y }, [X, V] = z(q, 0);
      return q.prevX = X, q.prevY = V, q;
    }
    function I(w) {
      const { outerRadius: C, innerRadius: x, penDistance: d, layerCount: m } = n.current;
      t = [];
      for (let u = 0; u < m; u++)
        t.push(D(u, m, w));
      p = C, e = x, s = d, v = m;
    }
    function W() {
      const { backgroundColor: w } = n.current;
      f.globalCompositeOperation = "source-over", f.globalAlpha = 1, f.fillStyle = w, f.fillRect(0, 0, y, h);
    }
    function B(w, C) {
      const x = window.devicePixelRatio || 1;
      y = w, h = C, c.width = Math.round(y * x), c.height = Math.round(h * x), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(x, 0, 0, x, 0, 0), W(), S = !0, I(!1);
    }
    const $ = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && B(C, x);
    });
    $.observe(o);
    const l = o.getBoundingClientRect();
    l.width > 0 && l.height > 0 && B(l.width, l.height);
    let r = 0;
    function b(w, C, x, d, m, u, R, k) {
      f.strokeStyle = m, f.lineWidth = u, f.lineCap = "round", R ? (f.shadowColor = m, f.shadowBlur = k) : f.shadowBlur = 0, f.beginPath(), f.moveTo(w, C), f.lineTo(x, d), f.stroke();
    }
    function F(w, C, x, d, m) {
      const u = Math.cos(m), R = Math.sin(m), k = x - w, L = d - C;
      return [w + k * u - L * R, C + k * R + L * u];
    }
    function M(w, C) {
      const { colors: x } = n.current, d = x.length > 0 ? x : ["#ffffff"];
      return d[C % d.length];
    }
    function P(w) {
      const C = r ? Math.min(w - r, 50) : 16;
      r = w;
      const {
        outerRadius: x,
        innerRadius: d,
        penDistance: m,
        layerCount: u,
        speed: R,
        backgroundColor: k,
        lineWidth: L,
        trailFade: T,
        animated: A,
        autoReset: E,
        symmetry: Y,
        glowEffect: q,
        glowBlur: X
      } = n.current;
      if (!S && (x !== p || d !== e || m !== s || u !== v) && (I(!1), W()), S = !1, !A) {
        i.current = requestAnimationFrame(P);
        return;
      }
      T > 0 && (f.globalCompositeOperation = "source-over", f.globalAlpha = Math.min(1, T * (C / 16)), f.fillStyle = k, f.fillRect(0, 0, y, h), f.globalAlpha = 1), f.globalCompositeOperation = "source-over";
      const V = R * Math.PI / 180 * (C / 16), j = Math.max(1, Math.ceil(V / 0.02)), H = V / j, _ = y / 2, O = h / 2, N = 2 * Math.PI / Y;
      let K = !1;
      for (let U = 0; U < t.length; U++) {
        const Q = t[U], ot = M(Q, U);
        for (let J = 0; J < j; J++) {
          Q.t += H;
          const [et, tt] = z(Q, Q.t);
          for (let nt = 0; nt < Y; nt++) {
            const rt = nt * N, [Z, at] = F(_, O, Q.prevX, Q.prevY, rt), [st, lt] = F(_, O, et, tt, rt);
            b(Z, at, st, lt, ot, L, q, X);
          }
          Q.prevX = et, Q.prevY = tt;
        }
        Q.t >= Q.fullPeriod && E && (K = !0);
      }
      q || (f.shadowBlur = 0), f.globalCompositeOperation = "source-over", K && (I(!0), W()), i.current = requestAnimationFrame(P);
    }
    return i.current = requestAnimationFrame(P), () => {
      $.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const dn = {
  default: {},
  neon: {
    colors: ["#00ffff", "#ff00ff"],
    backgroundColor: "#000000",
    lineWidth: 1.5,
    glowEffect: !0,
    glowBlur: 15,
    trailFade: 5e-3
  },
  prismatic: {
    colors: ["#ff2244", "#22aaff", "#44ff88"],
    layerCount: 3,
    symmetry: 2,
    lineWidth: 1,
    trailFade: 4e-3,
    backgroundColor: "#050005"
  },
  mandala: {
    colors: ["#ff00ff", "#00ffff"],
    symmetry: 6,
    layerCount: 2,
    glowEffect: !0,
    glowBlur: 12,
    trailFade: 2e-3,
    backgroundColor: "#000000"
  },
  cosmic: {
    colors: ["#ff4488", "#44ffff", "#ffff44", "#44ff88"],
    layerCount: 4,
    glowEffect: !0,
    glowBlur: 10,
    trailFade: 2e-3,
    backgroundColor: "#020008",
    lineWidth: 1
  },
  minimal: {
    colors: ["#ffffff"],
    speed: 0.5,
    lineWidth: 0.5,
    trailFade: 1e-3
  }
}, hn = ht(
  (a, g) => {
    const {
      preset: n,
      outerRadius: i,
      innerRadius: c,
      penDistance: o,
      speed: f,
      colors: y,
      backgroundColor: h,
      lineWidth: t,
      trailFade: p,
      animated: e,
      autoReset: s,
      layerCount: v,
      symmetry: S,
      glowEffect: z,
      glowBlur: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && dn[n] || {}, r = G(null);
    return gt(g, () => r.current), fn(r, {
      outerRadius: i ?? 0.85,
      innerRadius: c ?? l.innerRadius ?? 0.4,
      penDistance: o ?? l.penDistance ?? 0.9,
      speed: f ?? l.speed ?? 2,
      colors: y ?? l.colors ?? ["#ffffff"],
      backgroundColor: h ?? l.backgroundColor ?? "#111111",
      lineWidth: t ?? l.lineWidth ?? 1,
      trailFade: p ?? l.trailFade ?? 3e-3,
      animated: e ?? !0,
      autoReset: s ?? !0,
      layerCount: v ?? l.layerCount ?? 2,
      symmetry: S ?? l.symmetry ?? 1,
      glowEffect: z ?? l.glowEffect ?? !1,
      glowBlur: D ?? l.glowBlur ?? 10
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
hn.displayName = "Spirograph";
const xt = 0, Lt = 1, Bt = 2, Wt = 3, le = 4;
function Ht(a) {
  const g = a.replace("#", ""), n = g.length === 3 ? g.split("").map((c) => c + c).join("") : g, i = parseInt(n, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function gn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(null), o = G(null), f = G(0), y = G(0);
  ft(() => {
    const h = a.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const p = h.getContext("2d");
    let e = 0, s = 0, v = null, S = null, z = null;
    function D(d, m) {
      f.current = d, y.current = m, c.current = new Uint8Array(d * m), o.current = new Float32Array(d * m), v = new OffscreenCanvas(d, m), S = v.getContext("2d"), z = S.createImageData(d, m);
    }
    function I(d, m) {
      const u = window.devicePixelRatio || 1;
      e = d, s = m, h.width = Math.round(e * u), h.height = Math.round(s * u), h.style.width = `${e}px`, h.style.height = `${s}px`, p.scale(u, u);
      const { cellSize: R } = n.current, k = Math.max(4, Math.floor(e / R)), L = Math.max(4, Math.floor(s / R));
      D(k, L);
    }
    const W = new ResizeObserver((d) => {
      const { width: m, height: u } = d[0].contentRect;
      m > 0 && u > 0 && I(m, u);
    });
    W.observe(t);
    const B = t.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    let $ = !1;
    function l(d, m) {
      const u = h.getBoundingClientRect(), R = d - u.left, k = m - u.top, L = f.current, T = y.current;
      return [
        Math.floor(R / e * L),
        Math.floor(k / s * T)
      ];
    }
    function r(d, m) {
      const u = c.current, R = o.current;
      if (!u || !R) return;
      const k = f.current, L = y.current, { brushSize: T, material: A } = n.current;
      for (let E = -T; E <= T; E++)
        for (let Y = -T; Y <= T; Y++) {
          if (Y * Y + E * E > T * T) continue;
          const q = d + Y, X = m + E;
          if (q < 0 || q >= k || X < 0 || X >= L) continue;
          const V = X * k + q;
          A === "erase" ? (u[V] = xt, R[V] = 0) : A === "sand" ? u[V] = Lt : A === "water" ? u[V] = Bt : A === "fire" ? (u[V] = Wt, R[V] = 1) : A === "wall" && (u[V] = le);
        }
    }
    function b(d) {
      n.current.interactive && ($ = !0, r(...l(d.clientX, d.clientY)));
    }
    function F(d) {
      !n.current.interactive || !$ || r(...l(d.clientX, d.clientY));
    }
    function M() {
      $ = !1;
    }
    function P() {
      $ = !1;
    }
    h.addEventListener("mousedown", b), h.addEventListener("mousemove", F), h.addEventListener("mouseup", M), h.addEventListener("mouseleave", P);
    function w() {
      const d = c.current, m = o.current;
      if (!d || !m) return;
      const u = f.current, R = y.current;
      for (let k = R - 1; k >= 0; k--) {
        const L = Math.random() < 0.5;
        for (let T = 0; T < u; T++) {
          const A = L ? T : u - 1 - T, E = k * u + A, Y = d[E];
          if (Y === xt || Y === le) continue;
          const q = k + 1 < R, X = k - 1 >= 0, V = A - 1 >= 0, j = A + 1 < u;
          if (Y === Lt)
            if (q && d[(k + 1) * u + A] === xt)
              d[(k + 1) * u + A] = Lt, d[E] = xt;
            else if (q && d[(k + 1) * u + A] === Bt)
              d[(k + 1) * u + A] = Lt, d[E] = Bt;
            else {
              const H = Math.random() < 0.5, _ = H ? -1 : 1, O = H ? 1 : -1, N = H ? V : j, K = H ? j : V;
              q && N && d[(k + 1) * u + (A + _)] === xt ? (d[(k + 1) * u + (A + _)] = Lt, d[E] = xt) : q && K && d[(k + 1) * u + (A + O)] === xt && (d[(k + 1) * u + (A + O)] = Lt, d[E] = xt);
            }
          else if (Y === Bt)
            if (q && d[(k + 1) * u + A] === xt)
              d[(k + 1) * u + A] = Bt, d[E] = xt;
            else {
              const H = Math.random() < 0.5, _ = H ? -1 : 1, O = H ? 1 : -1, N = H ? V : j, K = H ? j : V;
              N && d[k * u + (A + _)] === xt ? (d[k * u + (A + _)] = Bt, d[E] = xt) : K && d[k * u + (A + O)] === xt && (d[k * u + (A + O)] = Bt, d[E] = xt);
            }
          else if (Y === Wt) {
            if (m[E] -= 5e-3 + Math.random() * 0.01, m[E] <= 0) {
              d[E] = xt, m[E] = 0;
              continue;
            }
            X && d[(k - 1) * u + A] === xt && Math.random() < 0.4 && (d[(k - 1) * u + A] = Wt, m[(k - 1) * u + A] = m[E] * (0.7 + Math.random() * 0.3)), X && d[(k - 1) * u + A] === Lt && Math.random() < 0.02 && (d[(k - 1) * u + A] = Wt, m[(k - 1) * u + A] = 1);
            const H = Math.random() < 0.5 ? -1 : 1;
            X && (H === -1 ? V : j) && d[(k - 1) * u + (A + H)] === xt && Math.random() < 0.15 && (d[(k - 1) * u + (A + H)] = Wt, m[(k - 1) * u + (A + H)] = m[E] * 0.6), q && d[(k + 1) * u + A] === Bt && (d[E] = xt, d[(k + 1) * u + A] = xt, m[E] = 0);
          }
        }
      }
    }
    function C() {
      const d = c.current, m = o.current;
      if (!d || !m || !z || !v || !S) return;
      const u = f.current, R = y.current, { sandColor: k, waterColor: L, fireColor: T, wallColor: A, backgroundColor: E } = n.current, [Y, q, X] = Ht(E), [V, j, H] = Ht(k), [_, O, N] = Ht(L), [K, U, Q] = Ht(T), [ot, J, et] = Ht(A), tt = z.data;
      for (let nt = 0; nt < u * R; nt++) {
        const rt = nt * 4, Z = d[nt];
        if (tt[rt + 3] = 255, Z === xt)
          tt[rt] = Y, tt[rt + 1] = q, tt[rt + 2] = X;
        else if (Z === Lt) {
          const at = (Math.random() * 20 | 0) - 10;
          tt[rt] = Math.max(0, Math.min(255, V + at)), tt[rt + 1] = Math.max(0, Math.min(255, j + at)), tt[rt + 2] = Math.max(0, Math.min(255, H + at));
        } else if (Z === Bt) {
          const at = 0.6 + Math.random() * 0.3;
          tt[rt] = Math.round(Y * (1 - at) + _ * at), tt[rt + 1] = Math.round(q * (1 - at) + O * at), tt[rt + 2] = Math.round(X * (1 - at) + N * at);
        } else if (Z === Wt) {
          const at = Math.max(0, Math.min(1, m[nt]));
          tt[rt] = Math.min(255, Math.round(K * at + 60 * at)), tt[rt + 1] = Math.round(U * at * 0.4), tt[rt + 2] = Math.round(Q * at * 0.1);
        } else Z === le && (tt[rt] = ot, tt[rt + 1] = J, tt[rt + 2] = et);
      }
      S.putImageData(z, 0, 0), p.imageSmoothingEnabled = !1, p.drawImage(v, 0, 0, e, s);
    }
    function x() {
      w(), C(), i.current = requestAnimationFrame(x);
    }
    return i.current = requestAnimationFrame(x), () => {
      W.disconnect(), cancelAnimationFrame(i.current), h.removeEventListener("mousedown", b), h.removeEventListener("mousemove", F), h.removeEventListener("mouseup", M), h.removeEventListener("mouseleave", P);
    };
  }, [a, g.cellSize]);
}
const pn = {
  default: {},
  desert: { sandColor: "#c8a85a", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  ocean: { waterColor: "#0088cc", backgroundColor: "#001a2e", wallColor: "#0a3a5a", material: "water" },
  inferno: { fireColor: "#ff4400", backgroundColor: "#0a0000", wallColor: "#2a0000", material: "fire" },
  neon: { sandColor: "#00ffff", waterColor: "#ff00ff", fireColor: "#ffff00", wallColor: "#00ff88", backgroundColor: "#050505" }
}, mn = ht(
  (a, g) => {
    const {
      preset: n,
      cellSize: i,
      brushSize: c,
      material: o,
      sandColor: f,
      waterColor: y,
      fireColor: h,
      wallColor: t,
      backgroundColor: p,
      interactive: e,
      gravity: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && pn[n] || {}, W = G(null);
    return gt(g, () => W.current), gn(W, {
      cellSize: i ?? 4,
      brushSize: c ?? 3,
      material: o ?? I.material ?? "sand",
      sandColor: f ?? I.sandColor ?? "#ffffff",
      waterColor: y ?? I.waterColor ?? "#6b7280",
      fireColor: h ?? I.fireColor ?? "#ffffff",
      wallColor: t ?? I.wallColor ?? "#4b5563",
      backgroundColor: p ?? I.backgroundColor ?? "#111111",
      interactive: e ?? !0,
      gravity: s ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...D
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: W,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
mn.displayName = "SandSimulation";
function Ce(a) {
  const g = a.replace("#", ""), n = g.length === 3 ? g.split("").map((c) => c + c).join("") : g, i = parseInt(n, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function yn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0), c = G(0), o = G([]);
  ft(() => {
    const f = a.current;
    if (!f) return;
    const y = f.parentElement;
    if (!y) return;
    const h = f.getContext("2d");
    let t = 0, p = 0, e = null, s = null, v = null, S = 0, z = 0;
    function D() {
      o.current = [
        { x: t * 0.35, y: p * 0.5 },
        { x: t * 0.65, y: p * 0.5 }
      ];
    }
    function I(F, M) {
      const P = window.devicePixelRatio || 1;
      t = F, p = M, f.width = Math.round(t * P), f.height = Math.round(p * P), f.style.width = `${t}px`, f.style.height = `${p}px`, h.scale(P, P);
      const { resolution: w } = n.current;
      S = Math.max(4, Math.round(t * w)), z = Math.max(4, Math.round(p * w)), e = new OffscreenCanvas(S, z), s = e.getContext("2d"), v = s.createImageData(S, z), D();
    }
    const W = new ResizeObserver((F) => {
      const { width: M, height: P } = F[0].contentRect;
      M > 0 && P > 0 && I(M, P);
    });
    W.observe(y);
    const B = y.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    const $ = 16;
    function l(F) {
      const M = f.getBoundingClientRect(), P = F.clientX - M.left, w = F.clientY - M.top, C = o.current, { maxSources: x } = n.current;
      for (let d = 0; d < C.length; d++) {
        const m = C[d].x - P, u = C[d].y - w;
        if (m * m + u * u < $ * $) {
          C.splice(d, 1);
          return;
        }
      }
      C.length < x && C.push({ x: P, y: w });
    }
    f.addEventListener("click", l);
    let r = 0;
    function b(F) {
      const M = r ? Math.min(F - r, 50) : 16;
      r = F;
      const { wavelength: P, speed: w, colorHigh: C, colorLow: x, showSources: d, animated: m, decay: u } = n.current, R = o.current;
      m && (c.current += M * 1e-3 * w);
      const k = c.current, [L, T, A] = Ce(x), [E, Y, q] = Ce(C), X = v.data, V = 2 * Math.PI / P, j = V * (w * 60), H = Math.max(1, R.length), _ = t / S, O = p / z;
      for (let N = 0; N < z; N++)
        for (let K = 0; K < S; K++) {
          const U = (K + 0.5) * _, Q = (N + 0.5) * O;
          let ot = 0;
          for (const nt of R) {
            const rt = U - nt.x, Z = Q - nt.y, at = Math.sqrt(rt * rt + Z * Z), st = Math.exp(-u * at);
            ot += st * Math.cos(V * at - j * k);
          }
          const J = (ot / H + 1) * 0.5, et = Math.max(0, Math.min(1, J)), tt = (N * S + K) * 4;
          X[tt] = Math.round(L + (E - L) * et), X[tt + 1] = Math.round(T + (Y - T) * et), X[tt + 2] = Math.round(A + (q - A) * et), X[tt + 3] = 255;
        }
      if (s.putImageData(v, 0, 0), h.imageSmoothingEnabled = !0, h.imageSmoothingQuality = "low", h.drawImage(e, 0, 0, t, p), d)
        for (const N of R)
          h.beginPath(), h.arc(N.x, N.y, 8, 0, Math.PI * 2), h.strokeStyle = C, h.lineWidth = 2, h.stroke(), h.beginPath(), h.moveTo(N.x - 5, N.y), h.lineTo(N.x + 5, N.y), h.moveTo(N.x, N.y - 5), h.lineTo(N.x, N.y + 5), h.stroke();
      i.current = requestAnimationFrame(b);
    }
    return i.current = requestAnimationFrame(b), () => {
      W.disconnect(), cancelAnimationFrame(i.current), f.removeEventListener("click", l);
    };
  }, [a, g.resolution]);
}
const wn = {
  default: {},
  ripple: { colorHigh: "#88ccff", colorLow: "#001133", wavelength: 100 },
  plasma: { colorHigh: "#ff4400", colorLow: "#000033", wavelength: 60, decay: 1e-3 },
  neon: { colorHigh: "#00ffff", colorLow: "#000000", wavelength: 70 },
  cosmic: { colorHigh: "#cc88ff", colorLow: "#050005", decay: 2e-3 }
}, vn = ht(
  (a, g) => {
    const {
      preset: n,
      maxSources: i,
      wavelength: c,
      speed: o,
      colorHigh: f,
      colorLow: y,
      backgroundColor: h,
      showSources: t,
      resolution: p,
      animated: e,
      decay: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && wn[n] || {}, W = G(null);
    return gt(g, () => W.current), yn(W, {
      maxSources: i ?? 6,
      wavelength: c ?? I.wavelength ?? 80,
      speed: o ?? 1,
      colorHigh: f ?? I.colorHigh ?? "#ffffff",
      colorLow: y ?? I.colorLow ?? "#111111",
      backgroundColor: h ?? I.backgroundColor ?? "#111111",
      showSources: t ?? !1,
      resolution: p ?? 0.4,
      animated: e ?? !0,
      decay: s ?? I.decay ?? 3e-3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...D
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: W,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
vn.displayName = "WaveInterference";
const Cn = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
], Me = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];
function Mn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0, t = 0, p = 0, e = null, s = [], v = 0;
    function S(d, m) {
      return m * t + d;
    }
    function z(d, m) {
      return d < 0 || d >= t || m < 0 || m >= p ? !1 : e[S(d, m)] === 1;
    }
    function D(d, m) {
      for (const [u, R] of Cn)
        if (z(d + u, m + R)) return !0;
      return !1;
    }
    function I(d, m) {
      d < 0 || d >= t || m < 0 || m >= p || (e[S(d, m)] = 1);
    }
    function W(d, m) {
      const { particleSize: u } = n.current;
      return [Math.floor(d / u), Math.floor(m / u)];
    }
    function B(d, m) {
      const { particleSize: u } = n.current;
      return [d * u + u * 0.5, m * u + u * 0.5];
    }
    function $() {
      const { seedMode: d } = n.current;
      if (d === "bottom")
        return { x: Math.floor(Math.random() * t), y: 0 };
      const m = Math.random() * Math.PI * 2, u = Math.min(v, Math.floor(Math.min(t, p) * 0.48)), R = t / 2, k = p / 2;
      return {
        x: Math.max(0, Math.min(t - 1, Math.round(R + Math.cos(m) * u))),
        y: Math.max(0, Math.min(p - 1, Math.round(k + Math.sin(m) * u)))
      };
    }
    function l(d, m, u) {
      const [R, k] = B(d, m), { particleColor: L, walkerColor: T, particleSize: A, glowEffect: E, glowBlur: Y } = n.current;
      E && u ? (f.shadowColor = L, f.shadowBlur = Y) : f.shadowBlur = 0;
      const q = A * 0.5;
      f.fillStyle = u ? L : T, f.beginPath(), f.arc(R, k, q, 0, Math.PI * 2), f.fill(), f.shadowBlur = 0;
    }
    function r(d, m) {
      const [u, R] = B(d, m), { particleSize: k, backgroundColor: L } = n.current, T = k * 0.5 + 1;
      f.fillStyle = L, f.beginPath(), f.arc(u, R, T, 0, Math.PI * 2), f.fill();
    }
    function b() {
      const { seedMode: d } = n.current;
      if (e)
        if (d === "bottom")
          for (let m = 0; m < t; m++)
            I(m, p - 1), l(m, p - 1, !0);
        else if (d === "ring") {
          const m = Math.floor(t / 2), u = Math.floor(p / 2), R = Math.max(2, Math.floor(Math.min(t, p) * 0.04));
          for (let k = 0; k < Math.PI * 2; k += 0.15) {
            const L = Math.round(m + Math.cos(k) * R), T = Math.round(u + Math.sin(k) * R);
            L >= 0 && L < t && T >= 0 && T < p && (I(L, T), l(L, T, !0));
          }
        } else {
          const m = Math.floor(t / 2), u = Math.floor(p / 2);
          I(m, u), l(m, u, !0);
        }
    }
    function F(d, m) {
      const { particleSize: u, walkerCount: R } = n.current;
      t = Math.max(4, Math.floor(d / u)), p = Math.max(4, Math.floor(m / u)), e = new Uint8Array(t * p), v = Math.floor(Math.min(t, p) * 0.05), f.fillStyle = n.current.backgroundColor, f.fillRect(0, 0, y, h), b(), s = [];
      for (let k = 0; k < R; k++)
        s.push($());
    }
    function M(d, m) {
      const u = window.devicePixelRatio || 1;
      y = d, h = m, c.width = Math.round(y * u), c.height = Math.round(h * u), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(u, 0, 0, u, 0, 0), F(y, h);
    }
    const P = new ResizeObserver((d) => {
      const { width: m, height: u } = d[0].contentRect;
      m > 0 && u > 0 && M(m, u);
    });
    P.observe(o);
    const w = o.getBoundingClientRect();
    w.width > 0 && w.height > 0 && M(w.width, w.height);
    function C(d) {
      if (!n.current.interactive || !e) return;
      const m = c.getBoundingClientRect(), u = d.clientX - m.left, R = d.clientY - m.top, [k, L] = W(u, R);
      k >= 0 && k < t && L >= 0 && L < p && (I(k, L), l(k, L, !0));
    }
    c.addEventListener("click", C);
    function x() {
      if (!e) {
        i.current = requestAnimationFrame(x);
        return;
      }
      const { stepsPerFrame: d, walkerCount: m, showWalkers: u, seedMode: R } = n.current;
      for (let k = 0; k < d; k++)
        for (let L = 0; L < s.length; L++) {
          const T = s[L], A = T.x, E = T.y;
          u && r(A, E);
          const Y = Me[Math.floor(Math.random() * Me.length)];
          let q = T.x + Y[0], X = T.y + Y[1];
          if (q = Math.max(0, Math.min(t - 1, q)), X = R === "bottom" ? Math.max(0, Math.min(p - 2, X)) : Math.max(0, Math.min(p - 1, X)), T.x = q, T.y = X, D(q, X) && !z(q, X)) {
            if (I(q, X), l(q, X, !0), R !== "bottom") {
              const V = t / 2, j = p / 2, H = Math.sqrt((q - V) ** 2 + (X - j) ** 2);
              v = Math.min(
                Math.floor(Math.min(t, p) * 0.48),
                Math.max(v, Math.ceil(H) + 3)
              );
            }
            s.length <= m && (s[L] = $());
          } else
            u && l(q, X, !1);
        }
      i.current = requestAnimationFrame(x);
    }
    return i.current = requestAnimationFrame(x), () => {
      P.disconnect(), cancelAnimationFrame(i.current), c.removeEventListener("click", C);
    };
  }, [a, g.particleSize, g.seedMode]);
}
const bn = {
  default: {},
  coral: {
    particleColor: "#ff7043",
    walkerColor: "#ff7043",
    backgroundColor: "#0a0500",
    glowEffect: !0,
    glowBlur: 6
  },
  snowflake: {
    particleColor: "#a8d8ff",
    walkerColor: "#a8d8ff",
    backgroundColor: "#020510",
    seedMode: "center",
    glowEffect: !0,
    glowBlur: 8
  },
  lightning: {
    particleColor: "#fffde7",
    walkerColor: "#fff59d",
    backgroundColor: "#050510",
    seedMode: "bottom",
    glowEffect: !0,
    glowBlur: 10
  },
  neon: {
    particleColor: "#00ffcc",
    walkerColor: "#ff00ff",
    backgroundColor: "#000000",
    glowEffect: !0,
    glowBlur: 12
  },
  frost: {
    particleColor: "#e0f7fa",
    walkerColor: "#80deea",
    backgroundColor: "#011820",
    seedMode: "ring",
    glowEffect: !0,
    glowBlur: 6
  }
}, xn = ht(
  (a, g) => {
    const {
      preset: n,
      particleColor: i,
      walkerColor: c,
      backgroundColor: o,
      particleSize: f,
      walkerCount: y,
      stepsPerFrame: h,
      seedMode: t,
      showWalkers: p,
      glowEffect: e,
      glowBlur: s,
      interactive: v,
      width: S,
      height: z,
      className: D,
      style: I
    } = a, W = n && bn[n] || {}, B = G(null);
    return gt(g, () => B.current), Mn(B, {
      particleColor: i ?? W.particleColor ?? "#ffffff",
      walkerColor: c ?? W.walkerColor ?? "#6b7280",
      backgroundColor: o ?? W.backgroundColor ?? "#111111",
      particleSize: f ?? W.particleSize ?? 3,
      walkerCount: y ?? 60,
      stepsPerFrame: h ?? 20,
      seedMode: t ?? W.seedMode ?? "center",
      showWalkers: p ?? !1,
      glowEffect: e ?? W.glowEffect ?? !0,
      glowBlur: s ?? W.glowBlur ?? 8,
      interactive: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: D,
        style: {
          width: S ?? "100%",
          height: z ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: B,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
xn.displayName = "DiffusionAggregation";
function Rn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0, t = 0, p = -1, e = -1, s = -1, v = !0;
    function S() {
      f.globalAlpha = 1, f.shadowBlur = 0, f.fillStyle = n.current.backgroundColor, f.fillRect(0, 0, y, h);
    }
    function z($, l) {
      const r = window.devicePixelRatio || 1;
      y = $, h = l, c.width = Math.round(y * r), c.height = Math.round(h * r), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(r, 0, 0, r, 0, 0), S(), v = !0;
    }
    const D = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && z(l, r);
    });
    D.observe(o);
    const I = o.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    let W = 0;
    function B($) {
      const l = W ? Math.min($ - W, 50) : 16;
      W = $;
      const {
        freqX: r,
        freqY: b,
        phaseShift: F,
        phaseSpeed: M,
        amplitude: P,
        color: w,
        backgroundColor: C,
        lineWidth: x,
        trailFade: d,
        glowEffect: m,
        glowBlur: u,
        colorMode: R,
        curvePoints: k,
        animated: L,
        speed: T
      } = n.current;
      if (v ? (t = F * Math.PI / 180, p = r, e = b, s = P, v = !1) : (r !== p || b !== e || P !== s) && (S(), t = F * Math.PI / 180, p = r, e = b, s = P), !L) {
        i.current = requestAnimationFrame(B);
        return;
      }
      d > 0 && (f.globalAlpha = Math.min(1, d * (l / 16)), f.fillStyle = C, f.fillRect(0, 0, y, h), f.globalAlpha = 1);
      const A = y / 2, E = h / 2, Y = A * P, q = E * P, X = R === "cycle" ? `hsl(${t * 360 / Math.PI % 360}, 100%, 65%)` : w;
      f.strokeStyle = X, f.lineWidth = x, f.lineCap = "round", f.lineJoin = "round", m ? (f.shadowColor = X, f.shadowBlur = u) : f.shadowBlur = 0, f.beginPath();
      for (let V = 0; V <= k; V++) {
        const j = V / k * 2 * Math.PI, H = A + Y * Math.sin(r * j + t), _ = E + q * Math.sin(b * j);
        V === 0 ? f.moveTo(H, _) : f.lineTo(H, _);
      }
      f.stroke(), f.shadowBlur = 0, t += M * T * Math.PI / 180 * (l / 16), i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      D.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const Sn = {
  default: {},
  butterfly: { freqX: 3, freqY: 2 },
  star: { freqX: 5, freqY: 4 },
  web: { freqX: 7, freqY: 6, colorMode: "cycle" },
  neon: { glowEffect: !0, colorMode: "cycle", backgroundColor: "#000000", lineWidth: 2 },
  crystal: { freqX: 5, freqY: 3, glowEffect: !0, lineWidth: 2, colorMode: "cycle", backgroundColor: "#000510" }
}, kn = ht(
  (a, g) => {
    const {
      preset: n,
      freqX: i,
      freqY: c,
      phaseShift: o,
      phaseSpeed: f,
      amplitude: y,
      color: h,
      backgroundColor: t,
      lineWidth: p,
      trailFade: e,
      glowEffect: s,
      glowBlur: v,
      colorMode: S,
      curvePoints: z,
      animated: D,
      speed: I,
      width: W,
      height: B,
      className: $,
      style: l
    } = a, r = n && Sn[n] || {}, b = G(null);
    return gt(g, () => b.current), Rn(b, {
      freqX: i ?? r.freqX ?? 3,
      freqY: c ?? r.freqY ?? 2,
      phaseShift: o ?? 0,
      phaseSpeed: f ?? r.phaseSpeed ?? 0.5,
      amplitude: y ?? 0.9,
      color: h ?? r.color ?? "#ffffff",
      backgroundColor: t ?? r.backgroundColor ?? "#111111",
      lineWidth: p ?? r.lineWidth ?? 1.5,
      trailFade: e ?? r.trailFade ?? 0.04,
      glowEffect: s ?? r.glowEffect ?? !1,
      glowBlur: v ?? r.glowBlur ?? 12,
      colorMode: S ?? r.colorMode ?? "solid",
      curvePoints: z ?? 600,
      animated: D ?? !0,
      speed: I ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: W ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          ...l
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: b,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
kn.displayName = "Lissajous";
const ce = 25e4;
function Pn(a, g, n) {
  let i = a;
  for (let c = 0; c < n; c++) {
    let o = "";
    for (const f of i) {
      const y = g[f];
      if (y ? o += y : o += f, o.length >= ce) {
        o = o.slice(0, ce);
        break;
      }
    }
    if (i = o, i.length >= ce) break;
  }
  return i;
}
function En(a, g, n, i) {
  let c = 0, o = 0, f = -Math.PI / 2;
  const y = [], h = [];
  for (const l of a)
    switch (l) {
      case "F":
      case "G": {
        const r = c + Math.cos(f), b = o + Math.sin(f);
        h.push(c, o, r, b), c = r, o = b;
        break;
      }
      case "f": {
        c += Math.cos(f), o += Math.sin(f);
        break;
      }
      case "+":
        f += g;
        break;
      case "-":
        f -= g;
        break;
      case "[":
        y.push({ x: c, y: o, a: f });
        break;
      case "]": {
        const r = y.pop();
        r && (c = r.x, o = r.y, f = r.a);
        break;
      }
    }
  if (h.length === 0) return new Float32Array(0);
  let t = 1 / 0, p = -1 / 0, e = 1 / 0, s = -1 / 0;
  for (let l = 0; l < h.length; l += 4)
    t = Math.min(t, h[l], h[l + 2]), p = Math.max(p, h[l], h[l + 2]), e = Math.min(e, h[l + 1], h[l + 3]), s = Math.max(s, h[l + 1], h[l + 3]);
  const v = p - t || 1, S = s - e || 1, z = Math.min(n * 0.88 / v, i * 0.88 / S), D = e < 0 && s >= -0.1, I = n / 2;
  let W, B;
  D ? (W = I - (t + p) / 2 * z, B = i * 0.93 - s * z) : (W = I - (t + p) / 2 * z, B = i / 2 - (e + s) / 2 * z);
  const $ = new Float32Array(h.length);
  for (let l = 0; l < h.length; l += 4)
    $[l] = h[l] * z + W, $[l + 1] = h[l + 1] * z + B, $[l + 2] = h[l + 2] * z + W, $[l + 3] = h[l + 3] * z + B;
  return $;
}
function An(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0;
    const t = {
      segments: new Float32Array(0),
      totalSegments: 0,
      drawnSegments: 0,
      paramHash: "",
      waitTimer: -1
    };
    function p() {
      const { axiom: W, rules: B, iterations: $, angle: l } = n.current;
      return `${W}|${JSON.stringify(B)}|${$}|${l}`;
    }
    function e() {
      const { axiom: W, rules: B, iterations: $, angle: l } = n.current, r = Pn(W, B, $), b = l * Math.PI / 180;
      t.segments = En(r, b, y, h), t.totalSegments = t.segments.length / 4, t.drawnSegments = 0, t.waitTimer = -1, t.paramHash = p();
    }
    function s() {
      f.globalAlpha = 1, f.shadowBlur = 0, f.fillStyle = n.current.backgroundColor, f.fillRect(0, 0, y, h);
    }
    function v(W, B) {
      const $ = window.devicePixelRatio || 1;
      y = W, h = B, c.width = Math.round(y * $), c.height = Math.round(h * $), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform($, 0, 0, $, 0, 0), s(), e();
    }
    const S = new ResizeObserver((W) => {
      const { width: B, height: $ } = W[0].contentRect;
      B > 0 && $ > 0 && v(B, $);
    });
    S.observe(o);
    const z = o.getBoundingClientRect();
    z.width > 0 && z.height > 0 && v(z.width, z.height);
    let D = 0;
    function I(W) {
      const B = D ? Math.min(W - D, 50) : 16;
      D = W;
      const {
        color: $,
        backgroundColor: l,
        lineWidth: r,
        speed: b,
        autoReset: F,
        trailFade: M,
        glowEffect: P,
        glowBlur: w
      } = n.current;
      p() !== t.paramHash && (s(), e());
      const { segments: x, totalSegments: d } = t;
      if (t.waitTimer > 0) {
        t.waitTimer -= B, M > 0 && (f.globalAlpha = Math.min(1, M * (B / 16)), f.shadowBlur = 0, f.fillStyle = l, f.fillRect(0, 0, y, h), f.globalAlpha = 1), t.waitTimer <= 0 && (t.waitTimer = -1, M === 0 && s(), t.drawnSegments = 0), i.current = requestAnimationFrame(I);
        return;
      }
      const m = Math.max(1, Math.round(b * (B / 16))), u = Math.min(t.drawnSegments + m, d);
      f.strokeStyle = $, f.lineWidth = r, f.lineCap = "round", P ? (f.shadowColor = $, f.shadowBlur = w) : f.shadowBlur = 0;
      for (let R = t.drawnSegments; R < u; R++) {
        const k = x[R * 4], L = x[R * 4 + 1], T = x[R * 4 + 2], A = x[R * 4 + 3];
        f.beginPath(), f.moveTo(k, L), f.lineTo(T, A), f.stroke();
      }
      f.shadowBlur = 0, t.drawnSegments = u, t.drawnSegments >= d && F && (t.waitTimer = 1200), i.current = requestAnimationFrame(I);
    }
    return i.current = requestAnimationFrame(I), () => {
      S.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const be = {
  default: {
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    iterations: 4,
    angle: 25
  },
  fern: {
    axiom: "X",
    rules: { X: "F+[[X]-X]-F[-FX]+X", F: "FF" },
    iterations: 5,
    angle: 22
  },
  dragon: {
    axiom: "FX",
    rules: { X: "X+YF+", Y: "-FX-Y" },
    iterations: 12,
    angle: 90
  },
  sierpinski: {
    axiom: "F-G-G",
    rules: { F: "F-G+F+G-F", G: "GG" },
    iterations: 5,
    angle: 120
  },
  bush: {
    axiom: "Y",
    rules: { X: "X[-FFF][+FFF]FX", Y: "YFX[+Y][-Y]" },
    iterations: 5,
    angle: 25
  },
  snowflake: {
    axiom: "F++F++F",
    rules: { F: "F-F++F-F" },
    iterations: 4,
    angle: 60
  }
}, Bn = ht(
  (a, g) => {
    const {
      preset: n,
      axiom: i,
      rules: c,
      iterations: o,
      angle: f,
      lineWidth: y,
      color: h,
      backgroundColor: t,
      speed: p,
      autoReset: e,
      trailFade: s,
      glowEffect: v,
      glowBlur: S,
      width: z,
      height: D,
      className: I,
      style: W
    } = a, B = be[n ?? "default"] ?? be.default, $ = G(null);
    return gt(g, () => $.current), An($, {
      axiom: i ?? B.axiom,
      rules: c ?? B.rules,
      iterations: o ?? B.iterations,
      angle: f ?? B.angle,
      lineWidth: y ?? 1,
      color: h ?? "#ffffff",
      backgroundColor: t ?? "#111111",
      speed: p ?? 5,
      autoReset: e ?? !0,
      trailFade: s ?? 0,
      glowEffect: v ?? !1,
      glowBlur: S ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: z ?? "100%",
          height: D ?? "100%",
          display: "block",
          overflow: "hidden",
          ...W
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: $,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Bn.displayName = "LSystem";
const At = new Uint8Array(512);
(function() {
  const g = new Uint8Array(256);
  for (let i = 0; i < 256; i++) g[i] = i;
  let n = 12345;
  for (let i = 255; i > 0; i--) {
    n = n * 1664525 + 1013904223 >>> 0;
    const c = n % (i + 1);
    [g[i], g[c]] = [g[c], g[i]];
  }
  for (let i = 0; i < 256; i++) At[i] = At[i + 256] = g[i];
})();
function xe(a) {
  return a * a * (3 - 2 * a);
}
function In(a, g) {
  const n = Math.floor(a) & 255, i = Math.floor(g) & 255, c = a - Math.floor(a), o = g - Math.floor(g), f = xe(c), y = xe(o), h = At[At[n] + i & 255] / 255, t = At[At[n + 1] + i & 255] / 255, p = At[At[n] + i + 1 & 255] / 255, e = At[At[n + 1] + i + 1 & 255] / 255, s = h + (t - h) * f, v = p + (e - p) * f;
  return s + (v - s) * y;
}
function Fn(a, g, n = 3) {
  let i = 0, c = 0.5, o = 1;
  for (let f = 0; f < n; f++)
    i += In(a * o, g * o) * c, c *= 0.5, o *= 2;
  return i;
}
const Jt = Math.PI * 2;
function $n(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0;
    const t = {
      gridW: 0,
      gridH: 0,
      imageData: null,
      offscreen: null,
      offCtx: null,
      time: 0,
      rotAngle: 0,
      zoomPhase: 0
    };
    function p(I, W) {
      const { resolution: B } = n.current, $ = Math.max(1, Math.round(I * B)), l = Math.max(1, Math.round(W * B));
      t.gridW = $, t.gridH = l;
      const r = new OffscreenCanvas($, l), b = r.getContext("2d");
      t.offscreen = r, t.offCtx = b, t.imageData = b.createImageData($, l);
    }
    function e(I, W) {
      const B = window.devicePixelRatio || 1;
      y = I, h = W, c.width = Math.round(y * B), c.height = Math.round(h * B), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(B, 0, 0, B, 0, 0), p(y, h);
    }
    const s = new ResizeObserver((I) => {
      const { width: W, height: B } = I[0].contentRect;
      W > 0 && B > 0 && e(W, B);
    });
    s.observe(o);
    const v = o.getBoundingClientRect();
    v.width > 0 && v.height > 0 && e(v.width, v.height);
    let S = 0, z = -1;
    function D(I) {
      const W = S ? Math.min(I - S, 50) : 16;
      S = I;
      const {
        segments: B,
        speed: $,
        colorA: l,
        colorB: r,
        backgroundColor: b,
        noiseScale: F,
        zoomSpeed: M,
        rotation: P,
        resolution: w,
        animated: C
      } = n.current;
      if (w !== z && (p(y, h), z = w), !C) {
        i.current = requestAnimationFrame(D);
        return;
      }
      const { gridW: x, gridH: d, imageData: m, offscreen: u, offCtx: R } = t;
      if (!m || !u || !R) {
        i.current = requestAnimationFrame(D);
        return;
      }
      const k = m.data, L = x / 2, T = d / 2, A = Math.min(L, T), E = Math.max(2, Math.round(B)), Y = Jt / E, q = Y / 2, X = t.rotAngle, V = t.zoomPhase, j = t.time, [H, _, O] = Rt([b], 0);
      for (let K = 0; K < d; K++)
        for (let U = 0; U < x; U++) {
          const Q = U - L, ot = K - T, J = Math.sqrt(Q * Q + ot * ot);
          if (J > A) {
            const bt = (K * x + U) * 4;
            k[bt] = H, k[bt + 1] = _, k[bt + 2] = O, k[bt + 3] = 255;
            continue;
          }
          let et = Math.atan2(ot, Q) - X;
          et = (et % Jt + Jt) % Jt;
          let tt = et % Y;
          tt > q && (tt = Y - tt);
          const rt = J / A * F + V, Z = tt * 8 + j * $, st = (Fn(rt, Z) * 2 - 1 + 1) / 2, [lt, ct, ut] = Rt([r, l], st), mt = (K * x + U) * 4;
          k[mt] = lt, k[mt + 1] = ct, k[mt + 2] = ut, k[mt + 3] = 255;
        }
      R.putImageData(m, 0, 0), f.drawImage(u, 0, 0, y, h);
      const N = W / 16;
      t.time += 0.02 * $ * N, t.rotAngle += P * Math.PI / 180 * N, t.zoomPhase += M * 0.015 * N, i.current = requestAnimationFrame(D);
    }
    return i.current = requestAnimationFrame(D), () => {
      s.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [a]);
}
const Tn = {
  default: {},
  neon: { colorA: "#00ffff", colorB: "#ff00ff", backgroundColor: "#000000", segments: 8, speed: 1.5 },
  crystal: { colorA: "#88ccff", colorB: "#002244", backgroundColor: "#000510", segments: 12, noiseScale: 4 },
  void: { colorA: "#cc00ff", colorB: "#000000", backgroundColor: "#000000", segments: 6, rotation: 0.4 },
  fire: { colorA: "#ff8800", colorB: "#ff0000", backgroundColor: "#0a0000", segments: 6, speed: 2 },
  ice: { colorA: "#ffffff", colorB: "#002255", backgroundColor: "#000510", segments: 10, noiseScale: 2, zoomSpeed: 0.5 }
}, Ln = ht(
  (a, g) => {
    const {
      preset: n,
      segments: i,
      speed: c,
      colorA: o,
      colorB: f,
      backgroundColor: y,
      noiseScale: h,
      zoomSpeed: t,
      rotation: p,
      resolution: e,
      animated: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && Tn[n] || {}, W = G(null);
    return gt(g, () => W.current), $n(W, {
      segments: i ?? I.segments ?? 8,
      speed: c ?? I.speed ?? 1,
      colorA: o ?? I.colorA ?? "#e0e0ff",
      colorB: f ?? I.colorB ?? "#1a0a2e",
      backgroundColor: y ?? I.backgroundColor ?? "#111111",
      noiseScale: h ?? I.noiseScale ?? 2.5,
      zoomSpeed: t ?? I.zoomSpeed ?? 0.3,
      rotation: p ?? I.rotation ?? 0.2,
      resolution: e ?? 0.5,
      animated: s ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          ...D
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: W,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Ln.displayName = "Kaleidoscope";
function zn(a, g, n) {
  return a.map((i, c) => {
    if (g === "cycle") {
      const f = i.hue / 60 % 6, y = f - Math.floor(f), h = 0, t = Math.round(255 * (1 - y) * 0.75), p = Math.round(255 * y * 0.75), e = 192, s = Math.floor(f);
      return (() => {
        switch (s) {
          case 0:
            return [e, p, h];
          case 1:
            return [t, e, h];
          case 2:
            return [h, e, p];
          case 3:
            return [h, t, e];
          case 4:
            return [p, h, e];
          default:
            return [e, h, t];
        }
      })();
    }
    if (g === "gradient") {
      const o = c / Math.max(1, a.length - 1);
      return Rt([n, "#6b7280"], o);
    }
    return Rt([n], 0);
  });
}
function Dn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0;
    const t = {
      seeds: [],
      gridW: 0,
      gridH: 0,
      cellIds: new Int16Array(0),
      imageData: null,
      offscreen: null,
      offCtx: null,
      dragIdx: -1,
      isDragging: !1,
      mouseGX: 0,
      mouseGY: 0
    };
    function p(w, C, x) {
      const d = [];
      for (let m = 0; m < x; m++)
        d.push({
          gx: Math.random() * w,
          gy: Math.random() * C,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: m / x * 360
        });
      return d;
    }
    function e(w, C) {
      const { resolution: x, cellCount: d } = n.current, m = Math.max(1, Math.round(w * x)), u = Math.max(1, Math.round(C * x));
      t.gridW = m, t.gridH = u, t.cellIds = new Int16Array(m * u);
      const R = new OffscreenCanvas(m, u), k = R.getContext("2d");
      if (t.offscreen = R, t.offCtx = k, t.imageData = k.createImageData(m, u), t.seeds.length === 0)
        t.seeds = p(m, u, d);
      else {
        const L = t.gridW || m, T = t.gridH || u;
        for (const A of t.seeds)
          A.gx = A.gx / L * m, A.gy = A.gy / T * u;
      }
    }
    function s(w, C) {
      const x = window.devicePixelRatio || 1;
      y = w, h = C, c.width = Math.round(y * x), c.height = Math.round(h * x), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(x, 0, 0, x, 0, 0), e(y, h);
    }
    let v = !1, S = 0, z = 0;
    function D(w, C) {
      const { resolution: x } = n.current;
      return [w * x, C * x];
    }
    function I(w, C) {
      let x = -1, d = 1 / 0;
      for (let m = 0; m < t.seeds.length; m++) {
        const u = t.seeds[m], R = w - u.gx, k = C - u.gy, L = R * R + k * k;
        L < d && (d = L, x = m);
      }
      return x;
    }
    function W(w) {
      if (!n.current.interactive) return;
      const C = c.getBoundingClientRect(), x = w.clientX - C.left, d = w.clientY - C.top, [m, u] = D(x, d);
      S = m, z = u, v = !0;
      const R = I(m, u);
      if (R >= 0) {
        const k = t.seeds[R], L = m - k.gx, T = u - k.gy, A = (t.gridW * 0.15) ** 2;
        L * L + T * T < A && (t.dragIdx = R, t.isDragging = !0);
      }
      t.mouseGX = m, t.mouseGY = u;
    }
    function B(w) {
      if (!n.current.interactive) return;
      const C = c.getBoundingClientRect(), x = w.clientX - C.left, d = w.clientY - C.top, [m, u] = D(x, d);
      t.mouseGX = m, t.mouseGY = u, v && t.isDragging && t.dragIdx >= 0 && (t.seeds[t.dragIdx].gx = Math.max(0, Math.min(t.gridW - 1, m)), t.seeds[t.dragIdx].gy = Math.max(0, Math.min(t.gridH - 1, u)));
    }
    function $(w) {
      if (!n.current.interactive) return;
      const C = c.getBoundingClientRect(), x = w.clientX - C.left, d = w.clientY - C.top, [m, u] = D(x, d), R = Math.abs(m - S) + Math.abs(u - z);
      if (!t.isDragging && R < 2) {
        const { cellCount: k } = n.current;
        if (t.seeds.length < k * 2) {
          const L = t.seeds.length / (k || 1) * 360;
          t.seeds.push({
            gx: Math.max(0, Math.min(t.gridW - 1, m)),
            gy: Math.max(0, Math.min(t.gridH - 1, u)),
            vx: 0,
            vy: 0,
            hue: L
          });
        }
      }
      v = !1, t.isDragging = !1, t.dragIdx = -1;
    }
    c.addEventListener("mousedown", W), c.addEventListener("mousemove", B), c.addEventListener("mouseup", $);
    const l = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && s(C, x);
    });
    l.observe(o);
    const r = o.getBoundingClientRect();
    r.width > 0 && r.height > 0 && s(r.width, r.height);
    let b = 0, F = -1, M = -1;
    function P(w) {
      const C = b ? Math.min(w - b, 50) : 16;
      b = w;
      const {
        cellCount: x,
        speed: d,
        colorMode: m,
        cellColor: u,
        backgroundColor: R,
        showEdges: k,
        edgeColor: L,
        resolution: T,
        relaxation: A,
        animated: E
      } = n.current;
      if (T !== F)
        t.seeds = [], e(y, h), F = T, M = x;
      else if (x !== M) {
        if (x > t.seeds.length) {
          const { gridW: tt, gridH: nt } = t;
          for (; t.seeds.length < x; ) {
            const rt = t.seeds.length;
            t.seeds.push({
              gx: Math.random() * tt,
              gy: Math.random() * nt,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              hue: rt / x * 360
            });
          }
        } else
          t.seeds.length = x;
        M = x;
      }
      const { seeds: Y, gridW: q, gridH: X, imageData: V, offscreen: j, offCtx: H, cellIds: _ } = t;
      if (!V || !j || !H || Y.length === 0) {
        i.current = requestAnimationFrame(P);
        return;
      }
      if (E) {
        const tt = C / 16;
        for (const nt of Y)
          t.isDragging && Y.indexOf(nt) === t.dragIdx || (nt.vx += (Math.random() - 0.5) * 0.05 * d, nt.vy += (Math.random() - 0.5) * 0.05 * d, nt.vx = Math.max(-0.5 * d, Math.min(0.5 * d, nt.vx)), nt.vy = Math.max(-0.5 * d, Math.min(0.5 * d, nt.vy)), nt.gx += nt.vx * tt, nt.gy += nt.vy * tt, nt.gx < 0 && (nt.gx = 0, nt.vx = Math.abs(nt.vx)), nt.gx >= q && (nt.gx = q - 1, nt.vx = -Math.abs(nt.vx)), nt.gy < 0 && (nt.gy = 0, nt.vy = Math.abs(nt.vy)), nt.gy >= X && (nt.gy = X - 1, nt.vy = -Math.abs(nt.vy)));
      }
      const O = zn(Y, m, u), [N, K, U] = Rt([R], 0), [Q, ot, J] = Rt([L], 0), et = V.data;
      for (let tt = 0; tt < X; tt++)
        for (let nt = 0; nt < q; nt++) {
          let rt = 1 / 0, Z = 0;
          for (let ut = 0; ut < Y.length; ut++) {
            const mt = nt - Y[ut].gx, bt = tt - Y[ut].gy, Ct = mt * mt + bt * bt;
            Ct < rt && (rt = Ct, Z = ut);
          }
          _[tt * q + nt] = Z;
          const [at, st, lt] = O[Z], ct = (tt * q + nt) * 4;
          et[ct] = at, et[ct + 1] = st, et[ct + 2] = lt, et[ct + 3] = 255;
        }
      if (E && A > 0) {
        const tt = new Float32Array(Y.length), nt = new Float32Array(Y.length), rt = new Uint32Array(Y.length);
        for (let Z = 0; Z < X; Z++)
          for (let at = 0; at < q; at++) {
            const st = _[Z * q + at];
            tt[st] += at, nt[st] += Z, rt[st]++;
          }
        for (let Z = 0; Z < Y.length; Z++)
          t.isDragging && Z === t.dragIdx || rt[Z] > 0 && (Y[Z].gx += (tt[Z] / rt[Z] - Y[Z].gx) * A, Y[Z].gy += (nt[Z] / rt[Z] - Y[Z].gy) * A);
      }
      if (k)
        for (let tt = 0; tt < X; tt++)
          for (let nt = 0; nt < q; nt++) {
            const rt = _[tt * q + nt];
            if (nt > 0 && _[tt * q + nt - 1] !== rt || tt > 0 && _[(tt - 1) * q + nt] !== rt) {
              const at = (tt * q + nt) * 4;
              et[at] = Q, et[at + 1] = ot, et[at + 2] = J, et[at + 3] = 255;
            }
          }
      if (H.putImageData(V, 0, 0), f.drawImage(j, 0, 0, y, h), n.current.interactive) {
        f.save();
        for (let tt = 0; tt < Y.length; tt++) {
          const nt = Y[tt].gx / q * y, rt = Y[tt].gy / X * h;
          f.beginPath(), f.arc(nt, rt, 3, 0, Math.PI * 2), f.fillStyle = "rgba(255,255,255,0.5)", f.fill();
        }
        f.restore();
      }
      i.current = requestAnimationFrame(P);
    }
    return i.current = requestAnimationFrame(P), () => {
      l.disconnect(), cancelAnimationFrame(i.current), c.removeEventListener("mousedown", W), c.removeEventListener("mousemove", B), c.removeEventListener("mouseup", $);
    };
  }, [a]);
}
const qn = {
  default: {},
  "stained-glass": { colorMode: "cycle", edgeColor: "#111111", cellCount: 25 },
  neon: { colorMode: "cycle", backgroundColor: "#000000", edgeColor: "#000000", showEdges: !1 },
  frost: { colorMode: "gradient", cellColor: "#88ccff", backgroundColor: "#001833", edgeColor: "#ffffff" },
  ember: { colorMode: "cycle", backgroundColor: "#0a0200", edgeColor: "#0a0200", showEdges: !1 },
  void: { cellColor: "#ffffff", backgroundColor: "#000000", showEdges: !1 }
}, Wn = ht(
  (a, g) => {
    const {
      preset: n,
      cellCount: i,
      speed: c,
      colorMode: o,
      cellColor: f,
      backgroundColor: y,
      showEdges: h,
      edgeColor: t,
      resolution: p,
      relaxation: e,
      interactive: s,
      animated: v,
      width: S,
      height: z,
      className: D,
      style: I
    } = a, W = n && qn[n] || {}, B = G(null);
    return gt(g, () => B.current), Dn(B, {
      cellCount: i ?? W.cellCount ?? 20,
      speed: c ?? 1,
      colorMode: o ?? W.colorMode ?? "solid",
      cellColor: f ?? W.cellColor ?? "#ffffff",
      backgroundColor: y ?? W.backgroundColor ?? "#111111",
      showEdges: h ?? W.showEdges ?? !0,
      edgeColor: t ?? W.edgeColor ?? "#333333",
      resolution: p ?? 1,
      relaxation: e ?? 0.05,
      interactive: s ?? !0,
      animated: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: D,
        style: {
          width: S ?? "100%",
          height: z ?? "100%",
          display: "block",
          overflow: "hidden",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: B,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Wn.displayName = "VoronoiCells";
const Kt = Math.PI * 2;
function Yn(a, g) {
  const n = G(g);
  n.current = g;
  const i = G(0);
  ft(() => {
    const c = a.current;
    if (!c) return;
    const o = c.parentElement;
    if (!o) return;
    const f = c.getContext("2d");
    let y = 0, h = 0;
    const t = {
      agents: new Float32Array(0),
      trail: new Float32Array(0),
      nextTrail: new Float32Array(0),
      gridW: 0,
      gridH: 0,
      imageData: null,
      offscreen: null,
      offCtx: null,
      mouseGX: 0,
      mouseGY: 0,
      mouseActive: !1
    };
    function p($, l, r, b, F) {
      const M = Math.round(b), P = Math.round(F);
      return M < 0 || M >= l || P < 0 || P >= r ? 0 : $[P * l + M];
    }
    function e($, l) {
      const { resolution: r, agentCount: b } = n.current, F = Math.max(1, Math.round($ * r)), M = Math.max(1, Math.round(l * r));
      t.gridW = F, t.gridH = M, t.trail = new Float32Array(F * M), t.nextTrail = new Float32Array(F * M);
      const P = b;
      t.agents = new Float32Array(P * 3);
      const w = F / 2, C = M / 2, x = Math.min(F, M) * 0.25;
      for (let u = 0; u < P; u++) {
        const R = Math.random() * Kt, k = Math.random() * x;
        t.agents[u * 3] = w + Math.cos(R) * k, t.agents[u * 3 + 1] = C + Math.sin(R) * k, t.agents[u * 3 + 2] = Math.random() * Kt;
      }
      const d = new OffscreenCanvas(F, M), m = d.getContext("2d");
      t.offscreen = d, t.offCtx = m, t.imageData = m.createImageData(F, M);
    }
    function s($, l) {
      const r = window.devicePixelRatio || 1;
      y = $, h = l, c.width = Math.round(y * r), c.height = Math.round(h * r), c.style.width = `${y}px`, c.style.height = `${h}px`, f.setTransform(r, 0, 0, r, 0, 0), e(y, h);
    }
    function v($) {
      if (!n.current.interactive) return;
      const l = c.getBoundingClientRect(), r = $.clientX - l.left, b = $.clientY - l.top, { resolution: F } = n.current;
      t.mouseGX = r * F, t.mouseGY = b * F, t.mouseActive = !0;
    }
    function S() {
      t.mouseActive = !1;
    }
    c.addEventListener("mousemove", v), c.addEventListener("mouseleave", S);
    const z = new ResizeObserver(($) => {
      const { width: l, height: r } = $[0].contentRect;
      l > 0 && r > 0 && s(l, r);
    });
    z.observe(o);
    const D = o.getBoundingClientRect();
    D.width > 0 && D.height > 0 && s(D.width, D.height);
    let I = -1, W = -1;
    function B($) {
      const {
        agentCount: l,
        sensorAngle: r,
        sensorDistance: b,
        stepSize: F,
        rotateSpeed: M,
        trailDecay: P,
        diffuseStrength: w,
        trailColor: C,
        backgroundColor: x,
        resolution: d,
        interactive: m,
        mouseRadius: u,
        mouseStrength: R,
        animated: k
      } = n.current;
      if (d !== I)
        e(y, h), I = d, W = l;
      else if (l !== W) {
        const J = l, et = t.agents, tt = new Float32Array(J * 3), nt = t.gridW, rt = t.gridH;
        if (J > et.length / 3) {
          tt.set(et);
          for (let Z = et.length / 3; Z < J; Z++) {
            const at = Math.random() * Kt, st = Math.random() * Math.min(nt, rt) * 0.25;
            tt[Z * 3] = nt / 2 + Math.cos(at) * st, tt[Z * 3 + 1] = rt / 2 + Math.sin(at) * st, tt[Z * 3 + 2] = Math.random() * Kt;
          }
        } else
          tt.set(et.subarray(0, J * 3));
        t.agents = tt, W = l;
      }
      if (!k) {
        i.current = requestAnimationFrame(B);
        return;
      }
      const { agents: L, trail: T, nextTrail: A, gridW: E, gridH: Y, imageData: q, offscreen: X, offCtx: V } = t;
      if (!q || !X || !V) {
        i.current = requestAnimationFrame(B);
        return;
      }
      const j = r * Math.PI / 180, H = M * Math.PI / 180, _ = l;
      for (let J = 0; J < _; J++) {
        const et = L[J * 3], tt = L[J * 3 + 1], nt = Math.round(et), rt = Math.round(tt);
        nt >= 0 && nt < E && rt >= 0 && rt < Y && (T[rt * E + nt] += 1);
      }
      if (m && t.mouseActive) {
        const J = u * d, et = J * J, tt = t.mouseGX, nt = t.mouseGY, rt = Math.max(0, Math.floor(tt - J)), Z = Math.min(E - 1, Math.ceil(tt + J)), at = Math.max(0, Math.floor(nt - J)), st = Math.min(Y - 1, Math.ceil(nt + J));
        for (let lt = at; lt <= st; lt++)
          for (let ct = rt; ct <= Z; ct++) {
            const ut = ct - tt, mt = lt - nt;
            ut * ut + mt * mt <= et && (T[lt * E + ct] += R);
          }
      }
      const O = w, N = 1 - O;
      for (let J = 0; J < Y; J++)
        for (let et = 0; et < E; et++) {
          let tt = 0, nt = 0;
          for (let rt = -1; rt <= 1; rt++)
            for (let Z = -1; Z <= 1; Z++) {
              const at = et + Z, st = J + rt;
              at >= 0 && at < E && st >= 0 && st < Y && (tt += T[st * E + at], nt++);
            }
          A[J * E + et] = (T[J * E + et] * N + tt / nt * O) * P;
        }
      const K = t.trail;
      t.trail = t.nextTrail, t.nextTrail = K;
      const U = t.trail;
      for (let J = 0; J < _; J++) {
        const et = L[J * 3], tt = L[J * 3 + 1], nt = L[J * 3 + 2], rt = p(
          U,
          E,
          Y,
          et + Math.cos(nt - j) * b,
          tt + Math.sin(nt - j) * b
        ), Z = p(
          U,
          E,
          Y,
          et + Math.cos(nt) * b,
          tt + Math.sin(nt) * b
        ), at = p(
          U,
          E,
          Y,
          et + Math.cos(nt + j) * b,
          tt + Math.sin(nt + j) * b
        );
        let st = nt;
        Z > rt && Z > at || (rt > at ? st -= H : at > rt ? st += H : st += (Math.random() - 0.5) * H), st += (Math.random() - 0.5) * 0.1;
        let lt = et + Math.cos(st) * F, ct = tt + Math.sin(st) * F;
        lt < 0 && (lt += E), lt >= E && (lt -= E), ct < 0 && (ct += Y), ct >= Y && (ct -= Y), L[J * 3] = lt, L[J * 3 + 1] = ct, L[J * 3 + 2] = st;
      }
      const Q = q.data, ot = 5;
      for (let J = 0; J < Y; J++)
        for (let et = 0; et < E; et++) {
          const tt = Math.min(U[J * E + et] / ot, 1), [nt, rt, Z] = Rt([x, C], tt), at = (J * E + et) * 4;
          Q[at] = nt, Q[at + 1] = rt, Q[at + 2] = Z, Q[at + 3] = 255;
        }
      V.putImageData(q, 0, 0), f.drawImage(X, 0, 0, y, h), i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      z.disconnect(), cancelAnimationFrame(i.current), c.removeEventListener("mousemove", v), c.removeEventListener("mouseleave", S);
    };
  }, [a]);
}
const Xn = {
  default: {},
  neon: { trailColor: "#00ffff", backgroundColor: "#000000" },
  coral: { trailColor: "#ff8844", backgroundColor: "#0a0200" },
  vein: { trailColor: "#ff2244", backgroundColor: "#080000", agentCount: 3e3 },
  frost: { trailColor: "#88ddff", backgroundColor: "#000a10" },
  gold: { trailColor: "#ffcc44", backgroundColor: "#0a0800" }
}, Gn = ht(
  (a, g) => {
    const {
      preset: n,
      agentCount: i,
      sensorAngle: c,
      sensorDistance: o,
      stepSize: f,
      rotateSpeed: y,
      trailDecay: h,
      diffuseStrength: t,
      trailColor: p,
      backgroundColor: e,
      resolution: s,
      interactive: v,
      mouseRadius: S,
      mouseStrength: z,
      animated: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && Xn[n] || {}, r = G(null);
    return gt(g, () => r.current), Yn(r, {
      agentCount: i ?? l.agentCount ?? 1800,
      sensorAngle: c ?? 45,
      sensorDistance: o ?? 9,
      stepSize: f ?? 1.5,
      rotateSpeed: y ?? 45,
      trailDecay: h ?? l.trailDecay ?? 0.92,
      diffuseStrength: t ?? 0.2,
      trailColor: p ?? l.trailColor ?? "#ffffff",
      backgroundColor: e ?? l.backgroundColor ?? "#111111",
      resolution: s ?? 0.35,
      interactive: v ?? !0,
      mouseRadius: S ?? 20,
      mouseStrength: z ?? 3,
      animated: D ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Gn.displayName = "SlimeMold";
function On(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = 0, p = new Float32Array(0), e = new Float32Array(0), s = null;
    const v = document.createElement("canvas"), S = v.getContext("2d");
    let z = 0, D = 0, I = -1;
    function W() {
      const { resolution: d } = n.current;
      d === I && h > 0 || (I = d, h = Math.max(1, Math.round(f * d)), t = Math.max(1, Math.round(y * d)), p = new Float32Array(h * t), e = new Float32Array(h * t), v.width = h, v.height = t, s = S.createImageData(h, t));
    }
    function B(d, m) {
      const u = window.devicePixelRatio || 1;
      f = d, y = m, i.width = Math.round(d * u), i.height = Math.round(m * u), i.style.width = `${d}px`, i.style.height = `${m}px`, o.scale(u, u), I = -1, W();
    }
    const $ = new ResizeObserver((d) => {
      const { width: m, height: u } = d[0].contentRect;
      m > 0 && u > 0 && B(m, u);
    });
    $.observe(c);
    const l = c.getBoundingClientRect();
    l.width > 0 && l.height > 0 && B(l.width, l.height);
    function r(d, m) {
      if (h === 0 || t === 0) return;
      const { inkRadius: u, inkStrength: R, resolution: k } = n.current, L = Math.round(d * k), T = Math.round(m * k), A = Math.max(1, Math.round(u * k)), E = A * A;
      for (let Y = -A; Y <= A; Y++)
        for (let q = -A; q <= A; q++) {
          const X = q * q + Y * Y;
          if (X > E) continue;
          const V = L + q, j = T + Y;
          if (V < 0 || V >= h || j < 0 || j >= t) continue;
          const H = Math.exp(-X / (E * 0.5)), _ = j * h + V;
          p[_] = Math.min(1, p[_] + R * H);
        }
    }
    let b = !1;
    function F(d) {
      if (!n.current.interactive) return;
      b = !0;
      const m = i.getBoundingClientRect();
      r(d.clientX - m.left, d.clientY - m.top);
    }
    function M(d) {
      if (!n.current.interactive || !b) return;
      const m = i.getBoundingClientRect();
      r(d.clientX - m.left, d.clientY - m.top);
    }
    function P() {
      b = !1;
    }
    function w(d) {
      if (!n.current.interactive) return;
      d.preventDefault();
      const m = i.getBoundingClientRect();
      r(d.touches[0].clientX - m.left, d.touches[0].clientY - m.top);
    }
    function C(d) {
      if (!n.current.interactive) return;
      d.preventDefault();
      const m = i.getBoundingClientRect();
      r(d.touches[0].clientX - m.left, d.touches[0].clientY - m.top);
    }
    c.addEventListener("mousedown", F), c.addEventListener("mousemove", M), window.addEventListener("mouseup", P), c.addEventListener("touchstart", w, { passive: !1 }), c.addEventListener("touchmove", C, { passive: !1 });
    function x(d) {
      const { diffusionRate: m, viscosity: u, evaporationRate: R, inkColor: k, paperColor: L, glowEffect: T, glowBlur: A, autoInk: E, autoInkInterval: Y, animated: q } = n.current;
      if (W(), E && f > 0 && d - D > Y && (D = d, r(Math.random() * f, Math.random() * y)), q && s && h > 0) {
        const X = m * (1 - u * 0.4);
        for (let tt = 0; tt < t; tt++)
          for (let nt = 0; nt < h; nt++) {
            const rt = tt * h + nt;
            let Z = 0, at = 0;
            for (let st = -1; st <= 1; st++)
              for (let lt = -1; lt <= 1; lt++) {
                const ct = nt + lt, ut = tt + st;
                if (ct < 0 || ct >= h || ut < 0 || ut >= t) continue;
                const mt = lt === 0 && st === 0 ? 4 : lt !== 0 && st !== 0 ? 0.7 : 1;
                Z += p[ut * h + ct] * mt, at += mt;
              }
            e[rt] = p[rt] + (Z / at - p[rt]) * X, e[rt] *= 1 - R, e[rt] < 0 ? e[rt] = 0 : e[rt] > 1 && (e[rt] = 1);
          }
        const V = p;
        p = e, e = V;
        const [j, H, _] = Rt([L], 0), [O, N, K] = Rt([k], 0), U = O - j, Q = N - H, ot = K - _, J = s.data, et = h * t;
        for (let tt = 0; tt < et; tt++) {
          const nt = p[tt], rt = tt * 4;
          J[rt] = j + U * nt | 0, J[rt + 1] = H + Q * nt | 0, J[rt + 2] = _ + ot * nt | 0, J[rt + 3] = 255;
        }
        S.putImageData(s, 0, 0), o.save(), T && (o.shadowBlur = A, o.shadowColor = k), o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "medium", o.drawImage(v, 0, 0, f, y), o.restore();
      }
      z = requestAnimationFrame(x);
    }
    return z = requestAnimationFrame(x), () => {
      $.disconnect(), cancelAnimationFrame(z), c.removeEventListener("mousedown", F), c.removeEventListener("mousemove", M), window.removeEventListener("mouseup", P), c.removeEventListener("touchstart", w), c.removeEventListener("touchmove", C);
    };
  }, [a]);
}
const Hn = {
  default: {},
  midnight: {
    inkColor: "#3b82f6",
    paperColor: "#020817",
    diffusionRate: 0.4,
    glowEffect: !0,
    glowBlur: 12
  },
  sepia: {
    inkColor: "#92400e",
    paperColor: "#fef3c7",
    diffusionRate: 0.2,
    viscosity: 0.9
  },
  toxic: {
    inkColor: "#84cc16",
    paperColor: "#0a0f00",
    diffusionRate: 0.5,
    glowEffect: !0,
    glowBlur: 12
  },
  neon: {
    inkColor: "#f0abfc",
    paperColor: "#0a000f",
    diffusionRate: 0.35,
    glowEffect: !0,
    glowBlur: 15
  },
  frost: {
    inkColor: "#bae6fd",
    paperColor: "#0c1428",
    diffusionRate: 0.25,
    viscosity: 0.85,
    evaporationRate: 1e-3
  }
}, jn = ht(
  (a, g) => {
    const {
      preset: n,
      inkColor: i,
      paperColor: c,
      diffusionRate: o,
      viscosity: f,
      evaporationRate: y,
      inkRadius: h,
      inkStrength: t,
      interactive: p,
      autoInk: e,
      autoInkInterval: s,
      resolution: v,
      glowEffect: S,
      glowBlur: z,
      animated: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && Hn[n] || {}, r = G(null);
    return gt(g, () => r.current), On(r, {
      inkColor: i ?? l.inkColor ?? "#ffffff",
      paperColor: c ?? l.paperColor ?? "#111111",
      diffusionRate: o ?? l.diffusionRate ?? 0.3,
      viscosity: f ?? l.viscosity ?? 0.8,
      evaporationRate: y ?? l.evaporationRate ?? 2e-3,
      inkRadius: h ?? 8,
      inkStrength: t ?? 1,
      interactive: p ?? !0,
      autoInk: e ?? !0,
      autoInkInterval: s ?? 2e3,
      resolution: v ?? 0.5,
      glowEffect: S ?? l.glowEffect ?? !1,
      glowBlur: z ?? l.glowBlur ?? 8,
      animated: D ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: p ?? !0 ? "crosshair" : "default",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
jn.displayName = "InkBleed";
const $e = 24;
function Nn(a) {
  return Array.from({ length: $e }, () => 1 + (Math.random() * 2 - 1) * a);
}
function Re(a, g, n, i, c) {
  const o = $e;
  a.beginPath();
  for (let f = 0; f <= o; f++) {
    const y = f % o, h = y / o * Math.PI * 2, t = i * c[y], p = g + Math.cos(h) * t, e = n + Math.sin(h) * t;
    f === 0 ? a.moveTo(p, e) : a.lineTo(p, e);
  }
  a.closePath();
}
function Un(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = 0;
    const p = [];
    function e(B, $) {
      const l = window.devicePixelRatio || 1;
      f = B, y = $, i.width = Math.round(B * l), i.height = Math.round($ * l), i.style.width = `${B}px`, i.style.height = `${$}px`, o.scale(l, l);
    }
    const s = new ResizeObserver((B) => {
      const { width: $, height: l } = B[0].contentRect;
      $ > 0 && l > 0 && e($, l);
    });
    s.observe(c);
    const v = c.getBoundingClientRect();
    v.width > 0 && v.height > 0 && e(v.width, v.height);
    function S(B, $) {
      const { colors: l, bloomRadius: r, noiseAmount: b, maxBlooms: F } = n.current;
      p.length >= F && p.splice(0, 1), p.push({
        x: B,
        y: $,
        colorIdx: Math.floor(Math.random() * l.length),
        radius: 0,
        maxRadius: r * (0.7 + Math.random() * 0.6),
        opacity: n.current.opacity,
        noiseRadii: Nn(b),
        born: !1
      });
    }
    function z(B) {
      if (!n.current.interactive) return;
      const $ = i.getBoundingClientRect();
      S(B.clientX - $.left, B.clientY - $.top);
    }
    function D(B) {
      if (!n.current.interactive) return;
      B.preventDefault();
      const $ = i.getBoundingClientRect();
      S(B.touches[0].clientX - $.left, B.touches[0].clientY - $.top);
    }
    c.addEventListener("mousedown", z), c.addEventListener("touchstart", D, { passive: !1 });
    function I(B) {
      const { colors: $, backgroundColor: l, bloomSpeed: r, opacity: b, wetEdge: F, layerCount: M, fadeSpeed: P, autoBloom: w, autoBloomInterval: C, animated: x } = n.current;
      if (w && f > 0 && B - t > C && (t = B, S(Math.random() * f, Math.random() * y)), !x) {
        h = requestAnimationFrame(I);
        return;
      }
      o.fillStyle = l, o.fillRect(0, 0, f, y), o.save();
      for (let d = p.length - 1; d >= 0; d--) {
        const m = p[d], u = $[m.colorIdx] ?? $[0];
        if (m.radius < m.maxRadius ? m.radius = Math.min(m.maxRadius, m.radius + r * 0.8) : m.opacity = Math.max(0, m.opacity - P), m.opacity <= 0) {
          p.splice(d, 1);
          continue;
        }
        for (let R = 0; R < M; R++) {
          const k = (R + 1) / M, L = m.radius * k, T = R === M - 1, A = m.opacity * (T ? 0.3 + F * 0.7 : 0.08);
          o.fillStyle = pt(u, A), Re(o, m.x, m.y, L, m.noiseRadii), o.fill();
        }
        F > 0.05 && (o.strokeStyle = pt(u, m.opacity * F * 0.4), o.lineWidth = 2 + F * 3, Re(o, m.x, m.y, m.radius * 1.02, m.noiseRadii), o.stroke());
      }
      o.restore(), h = requestAnimationFrame(I);
    }
    const W = setTimeout(() => {
      f > 0 && y > 0 && (S(f * 0.3, y * 0.4), S(f * 0.7, y * 0.6));
    }, 100);
    return h = requestAnimationFrame(I), () => {
      s.disconnect(), cancelAnimationFrame(h), clearTimeout(W), c.removeEventListener("mousedown", z), c.removeEventListener("touchstart", D);
    };
  }, [a]);
}
const Vn = {
  default: {},
  sunset: {
    colors: ["#f97316", "#ec4899", "#8b5cf6", "#fbbf24"],
    backgroundColor: "#0a0005",
    bloomRadius: 100,
    opacity: 0.18,
    wetEdge: 0.5
  },
  ocean: {
    colors: ["#0ea5e9", "#06b6d4", "#6366f1", "#38bdf8"],
    backgroundColor: "#020b18",
    bloomRadius: 90,
    opacity: 0.15,
    wetEdge: 0.35
  },
  spring: {
    colors: ["#86efac", "#d9f99d", "#fde68a", "#fbcfe8", "#c4b5fd"],
    backgroundColor: "#0a0f05",
    bloomRadius: 80,
    opacity: 0.2,
    layerCount: 8
  },
  monochrome: {
    colors: ["#ffffff", "#d1d5db", "#9ca3af"],
    backgroundColor: "#111111",
    bloomRadius: 100,
    opacity: 0.12,
    wetEdge: 0.6
  },
  neon: {
    colors: ["#f0abfc", "#67e8f9", "#a5f3fc", "#c084fc"],
    backgroundColor: "#050010",
    bloomRadius: 110,
    opacity: 0.2,
    wetEdge: 0.7,
    noiseAmount: 0.6
  }
}, _n = ht(
  (a, g) => {
    const {
      preset: n,
      colors: i,
      backgroundColor: c,
      bloomRadius: o,
      bloomSpeed: f,
      opacity: y,
      wetEdge: h,
      layerCount: t,
      noiseAmount: p,
      fadeSpeed: e,
      interactive: s,
      autoBloom: v,
      autoBloomInterval: S,
      resolution: z,
      animated: D,
      maxBlooms: I,
      width: W,
      height: B,
      className: $,
      style: l
    } = a, r = n && Vn[n] || {}, b = G(null);
    return gt(g, () => b.current), Un(b, {
      colors: i ?? r.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      backgroundColor: c ?? r.backgroundColor ?? "#111111",
      bloomRadius: o ?? r.bloomRadius ?? 80,
      bloomSpeed: f ?? 0.5,
      opacity: y ?? r.opacity ?? 0.15,
      wetEdge: h ?? r.wetEdge ?? 0.4,
      layerCount: t ?? r.layerCount ?? 6,
      noiseAmount: p ?? r.noiseAmount ?? 0.5,
      fadeSpeed: e ?? 1e-3,
      interactive: s ?? !0,
      autoBloom: v ?? !0,
      autoBloomInterval: S ?? 1500,
      resolution: z ?? 0.5,
      animated: D ?? !0,
      maxBlooms: I ?? 12
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: W ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: s ?? !0 ? "crosshair" : "default",
          ...l
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: b,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
_n.displayName = "WatercolorBloom";
function Se(a) {
  const g = a.replace("#", ""), n = parseInt(g.slice(0, 2), 16) || 0, i = parseInt(g.slice(2, 4), 16) || 0, c = parseInt(g.slice(4, 6), 16) || 0;
  return [n, i, c];
}
function Jn(a, g, n) {
  const i = Math.round(a[0] + (g[0] - a[0]) * n), c = Math.round(a[1] + (g[1] - a[1]) * n), o = Math.round(a[2] + (g[2] - a[2]) * n);
  return `rgb(${i},${c},${o})`;
}
function Kn(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = 0, p = 0, e = 0, s = 0, v = !1;
    function S() {
      t = 0, p = 0, v = !1;
    }
    function z(l, r) {
      const b = window.devicePixelRatio || 1;
      f = l, y = r, i.width = Math.round(l * b), i.height = Math.round(r * b), i.style.width = `${l}px`, i.style.height = `${r}px`, o.scale(b, b), o.fillStyle = n.current.backgroundColor, o.fillRect(0, 0, l, r), S();
    }
    const D = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && z(r, b);
    });
    D.observe(c);
    const I = c.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    function W(l, r) {
      const { color: b, color2: F, colorMode: M } = n.current;
      if (M === "cycle")
        return `hsl(${l * 360 % 360},80%,65%)`;
      if (M === "gradient") {
        const P = Se(b), w = Se(F);
        return Jn(P, w, (Math.sin(r * Math.PI * 2) + 1) * 0.5);
      }
      return b;
    }
    let B = 0;
    function $(l) {
      const r = B ? l - B : 16;
      B = l;
      const { backgroundColor: b, lineWidth: F, trailFade: M, speed: P, damping: w, freq1: C, freq2: x, freq3: d, amplitude: m, glowEffect: u, glowBlur: R, animated: k, autoReset: L } = n.current;
      if (!k) {
        h = requestAnimationFrame($);
        return;
      }
      o.fillStyle = pt(b, M), o.fillRect(0, 0, f, y);
      const T = Math.max(1, Math.round(P * r * 0.5)), A = f / 2, E = y / 2, Y = Math.min(A, E) * m;
      for (let q = 0; q < T; q++) {
        const X = Math.pow(w, p), V = Math.sin(d * t) * Math.PI, j = A + Y * Math.sin(C * t + V) * X, H = E + Y * Math.sin(x * t) * X;
        if (!v)
          e = j, s = H, v = !0;
        else {
          const _ = t * 0.01 % 1, O = t * 5e-3 % 1;
          o.strokeStyle = W(_, O), o.lineWidth = F, o.lineCap = "round", u ? (o.shadowBlur = R, o.shadowColor = n.current.color) : o.shadowBlur = 0, o.beginPath(), o.moveTo(e, s), o.lineTo(j, H), o.stroke();
        }
        if (e = j, s = H, t += 0.02, p++, L && p > 100 && X < 0.01) {
          o.fillStyle = b, o.fillRect(0, 0, f, y), S();
          break;
        }
      }
      h = requestAnimationFrame($);
    }
    return h = requestAnimationFrame($), () => {
      D.disconnect(), cancelAnimationFrame(h);
    };
  }, [a]);
}
const Qn = {
  default: {},
  neon: {
    color: "#00ffcc",
    color2: "#ff00aa",
    backgroundColor: "#000000",
    colorMode: "cycle",
    glowEffect: !0,
    glowBlur: 12,
    trailFade: 0.015
  },
  crystal: {
    color: "#88ccff",
    color2: "#ffffff",
    backgroundColor: "#000510",
    colorMode: "gradient",
    glowEffect: !0,
    glowBlur: 8,
    freq1: 3,
    freq2: 5
  },
  sand: {
    color: "#d4a76a",
    color2: "#7c5c2e",
    backgroundColor: "#1a1005",
    colorMode: "gradient",
    trailFade: 5e-3,
    damping: 0.9998
  },
  minimal: {
    color: "#6b7280",
    backgroundColor: "#111111",
    lineWidth: 0.8,
    trailFade: 0.03,
    colorMode: "solid",
    glowEffect: !1
  },
  cosmic: {
    color: "#c084fc",
    color2: "#38bdf8",
    backgroundColor: "#020010",
    colorMode: "cycle",
    glowEffect: !0,
    glowBlur: 15,
    freq1: 5,
    freq2: 7,
    freq3: 0.02
  }
}, Zn = ht(
  (a, g) => {
    const {
      preset: n,
      color: i,
      color2: c,
      backgroundColor: o,
      lineWidth: f,
      trailFade: y,
      speed: h,
      damping: t,
      freq1: p,
      freq2: e,
      freq3: s,
      amplitude: v,
      colorMode: S,
      glowEffect: z,
      glowBlur: D,
      animated: I,
      autoReset: W,
      width: B,
      height: $,
      className: l,
      style: r
    } = a, b = n && Qn[n] || {}, F = G(null);
    return gt(g, () => F.current), Kn(F, {
      color: i ?? b.color ?? "#ffffff",
      color2: c ?? b.color2 ?? "#6b7280",
      backgroundColor: o ?? b.backgroundColor ?? "#111111",
      lineWidth: f ?? b.lineWidth ?? 1,
      trailFade: y ?? b.trailFade ?? 0.01,
      speed: h ?? 1,
      damping: t ?? b.damping ?? 0.9995,
      freq1: p ?? b.freq1 ?? 2,
      freq2: e ?? b.freq2 ?? 3,
      freq3: s ?? b.freq3 ?? 0.01,
      amplitude: v ?? 0.9,
      colorMode: S ?? b.colorMode ?? "solid",
      glowEffect: z ?? b.glowEffect ?? !1,
      glowBlur: D ?? b.glowBlur ?? 10,
      animated: I ?? !0,
      autoReset: W ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: l,
        style: {
          width: B ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          ...r
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: F,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Zn.displayName = "PendulaWave";
const Nt = 0, Dt = 1, oe = 2;
function tr(a, g) {
  return {
    grid: new Uint8Array(a * g),
    age: new Uint32Array(a * g),
    frontier: /* @__PURE__ */ new Set(),
    frontierArr: [],
    frontierDirty: !1,
    maxAge: 1,
    gridW: a,
    gridH: g
  };
}
function er(a, g) {
  const { grid: n, frontier: i, gridW: c, gridH: o } = a, f = g % c, y = g / c | 0;
  f > 0 && n[g - 1] === Nt && (n[g - 1] = Dt, i.add(g - 1), a.frontierDirty = !0), f < c - 1 && n[g + 1] === Nt && (n[g + 1] = Dt, i.add(g + 1), a.frontierDirty = !0), y > 0 && n[g - c] === Nt && (n[g - c] = Dt, i.add(g - c), a.frontierDirty = !0), y < o - 1 && n[g + c] === Nt && (n[g + c] = Dt, i.add(g + c), a.frontierDirty = !0);
}
function te(a, g, n, i, c) {
  const o = a.gridW / 2, f = a.gridH / 2, y = Math.PI * 2 / i, h = g - o, t = n - f;
  for (let p = 0; p < i; p++) {
    const e = p * y, s = Math.round(o + h * Math.cos(e) - t * Math.sin(e)), v = Math.round(f + h * Math.sin(e) + t * Math.cos(e));
    if (s < 0 || s >= a.gridW || v < 0 || v >= a.gridH) continue;
    const S = v * a.gridW + s;
    a.grid[S] !== oe && (a.grid[S] = oe, a.age[S] = c, c > a.maxAge && (a.maxAge = c), a.frontier.delete(S), a.frontierDirty = !0, er(a, S));
  }
}
function or(a, g) {
  te(a, a.gridW / 2 | 0, a.gridH / 2 | 0, g, 0);
}
function nr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = 0, p = null;
    const e = document.createElement("canvas"), s = e.getContext("2d");
    let v = null;
    function S(l, r) {
      const { cellSize: b, symmetry: F } = n.current, M = 300, P = Math.max(1, Math.min(M, Math.floor(l / b))), w = Math.max(1, Math.min(M, Math.floor(r / b)));
      p = tr(P, w), e.width = P, e.height = w, v = s.createImageData(P, w), t = 0, or(p, F);
    }
    function z(l, r) {
      const b = window.devicePixelRatio || 1;
      f = l, y = r, i.width = Math.round(l * b), i.height = Math.round(r * b), i.style.width = `${l}px`, i.style.height = `${r}px`, o.scale(b, b), S(l, r);
    }
    const D = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && z(r, b);
    });
    D.observe(c);
    const I = c.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    function W(l) {
      if (!n.current.interactive || !p) return;
      const r = i.getBoundingClientRect(), { cellSize: b, symmetry: F } = n.current, M = Math.floor((l.clientX - r.left) / b), P = Math.floor((l.clientY - r.top) / b);
      te(p, M, P, F, ++t);
    }
    function B(l) {
      if (!n.current.interactive || !p) return;
      l.preventDefault();
      const r = i.getBoundingClientRect(), { cellSize: b, symmetry: F } = n.current, M = Math.floor((l.touches[0].clientX - r.left) / b), P = Math.floor((l.touches[0].clientY - r.top) / b);
      te(p, M, P, F, ++t);
    }
    c.addEventListener("mousedown", W), c.addEventListener("touchstart", B, { passive: !1 });
    function $() {
      if (!p || !v) {
        h = requestAnimationFrame($);
        return;
      }
      const { crystalColor: l, activeColor: r, backgroundColor: b, growthSpeed: F, symmetry: M, branchProbability: P, noiseAmount: w, colorMode: C, glowEffect: x, glowBlur: d, animated: m, autoReset: u } = n.current, { grid: R, age: k, frontier: L, gridW: T, gridH: A } = p;
      if (m && L.size > 0) {
        p.frontierDirty && (p.frontierArr = Array.from(L), p.frontierDirty = !1);
        const Q = p.frontierArr, ot = Math.min(Math.round(F), 50, Q.length);
        for (let J = 0; J < ot && Q.length !== 0; J++) {
          const et = Math.random() * Q.length | 0, tt = Q[et];
          if (R[tt] !== Dt) {
            L.delete(tt), Q.splice(et, 1), J--;
            continue;
          }
          let nt = tt % T, rt = tt / T | 0;
          if (w > 0 && Math.random() < w) {
            const Z = Math.max(0, Math.min(T - 1, nt + Math.round((Math.random() * 2 - 1) * 2))), at = Math.max(0, Math.min(A - 1, rt + Math.round((Math.random() * 2 - 1) * 2)));
            R[at * T + Z] !== oe && (nt = Z, rt = at);
          }
          if (t++, te(p, nt, rt, M, t), Q.splice(et, 1), Math.random() < P) {
            const Z = [[-2, 0], [2, 0], [0, -2], [0, 2]], [at, st] = Z[Math.random() * 4 | 0], lt = Math.max(0, Math.min(T - 1, nt + at)), ut = Math.max(0, Math.min(A - 1, rt + st)) * T + lt;
            R[ut] === Nt && (R[ut] = Dt, L.add(ut), Q.push(ut));
          }
        }
        if (u && L.size === 0) {
          S(f, y), h = requestAnimationFrame($);
          return;
        }
      }
      const [E, Y, q] = Rt([b], 0), [X, V, j] = Rt([l], 0), [H, _, O] = Rt([r], 0), N = v.data, K = T * A, U = p.maxAge || 1;
      for (let Q = 0; Q < K; Q++) {
        const ot = R[Q];
        let J, et, tt;
        if (ot === oe)
          if (C === "age") {
            const rt = k[Q] / U;
            [J, et, tt] = Rt([l, r, b], rt);
          } else if (C === "cycle") {
            const rt = k[Q] / U;
            J = 128 + 127 * Math.cos(rt * Math.PI * 2) | 0, et = 128 + 127 * Math.cos(rt * Math.PI * 2 + 2.094) | 0, tt = 128 + 127 * Math.cos(rt * Math.PI * 2 + 4.189) | 0;
          } else
            J = X, et = V, tt = j;
        else ot === Dt ? (J = H, et = _, tt = O) : (J = E, et = Y, tt = q);
        const nt = Q * 4;
        N[nt] = J, N[nt + 1] = et, N[nt + 2] = tt, N[nt + 3] = 255;
      }
      s.putImageData(v, 0, 0), o.save(), x ? (o.shadowBlur = d, o.shadowColor = l) : o.shadowBlur = 0, o.imageSmoothingEnabled = !1, o.drawImage(e, 0, 0, f, y), o.restore(), h = requestAnimationFrame($);
    }
    return h = requestAnimationFrame($), () => {
      D.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousedown", W), c.removeEventListener("touchstart", B);
    };
  }, [a]);
}
const rr = {
  default: {},
  snowflake: {
    crystalColor: "#e0f2fe",
    activeColor: "#7dd3fc",
    backgroundColor: "#0c1a2e",
    symmetry: 6,
    branchProbability: 0.4,
    noiseAmount: 0.15,
    glowEffect: !0,
    glowBlur: 10
  },
  gem: {
    crystalColor: "#c084fc",
    activeColor: "#e879f9",
    backgroundColor: "#09000f",
    symmetry: 8,
    branchProbability: 0.2,
    noiseAmount: 0.1,
    colorMode: "age",
    glowEffect: !0,
    glowBlur: 15
  },
  neon: {
    crystalColor: "#00ffcc",
    activeColor: "#ff00aa",
    backgroundColor: "#000000",
    symmetry: 4,
    branchProbability: 0.35,
    noiseAmount: 0.3,
    colorMode: "cycle",
    glowEffect: !0,
    glowBlur: 18
  },
  frost: {
    crystalColor: "#bae6fd",
    activeColor: "#ffffff",
    backgroundColor: "#0a1628",
    symmetry: 6,
    branchProbability: 0.5,
    noiseAmount: 0.25,
    cellSize: 2,
    glowEffect: !0,
    glowBlur: 8
  },
  gold: {
    crystalColor: "#fbbf24",
    activeColor: "#f59e0b",
    backgroundColor: "#0a0500",
    symmetry: 12,
    branchProbability: 0.15,
    noiseAmount: 0.05,
    colorMode: "age",
    glowEffect: !0,
    glowBlur: 12
  }
}, ar = ht(
  (a, g) => {
    const {
      preset: n,
      crystalColor: i,
      activeColor: c,
      backgroundColor: o,
      growthSpeed: f,
      symmetry: y,
      branchProbability: h,
      noiseAmount: t,
      cellSize: p,
      glowEffect: e,
      glowBlur: s,
      interactive: v,
      autoReset: S,
      colorMode: z,
      animated: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && rr[n] || {}, r = G(null);
    return gt(g, () => r.current), nr(r, {
      crystalColor: i ?? l.crystalColor ?? "#ffffff",
      activeColor: c ?? l.activeColor ?? "#6b7280",
      backgroundColor: o ?? l.backgroundColor ?? "#111111",
      growthSpeed: f ?? 3,
      symmetry: y ?? l.symmetry ?? 6,
      branchProbability: h ?? l.branchProbability ?? 0.3,
      noiseAmount: t ?? l.noiseAmount ?? 0.2,
      cellSize: p ?? l.cellSize ?? 3,
      glowEffect: e ?? l.glowEffect ?? !0,
      glowBlur: s ?? l.glowBlur ?? 12,
      interactive: v ?? !0,
      autoReset: S ?? !0,
      colorMode: z ?? l.colorMode ?? "solid",
      animated: D ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: v ?? !0 ? "crosshair" : "default",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ar.displayName = "CrystalGrowth";
const ke = 300;
function ir(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = 0, p = -1, e = [], s = [];
    const v = /* @__PURE__ */ new Set();
    function S(w, C) {
      return w * 1e4 + C;
    }
    function z(w, C) {
      const { nodeCount: x, wanderSpeed: d } = n.current;
      e = Array.from({ length: x }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        vx: (Math.random() - 0.5) * d,
        vy: (Math.random() - 0.5) * d,
        flash: 0
      })), s = [], v.clear();
    }
    function D(w, C) {
      const x = window.devicePixelRatio || 1;
      f = w, y = C, i.width = Math.round(w * x), i.height = Math.round(C * x), i.style.width = `${w}px`, i.style.height = `${C}px`, o.scale(x, x), z(w, C);
    }
    const I = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && D(C, x);
    });
    I.observe(c);
    const W = c.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B(w, C) {
      const { connectionRadius: x, pulseDecay: d } = n.current;
      if (C < 0.05 || s.length >= ke) return;
      e[w].flash = Math.max(e[w].flash, C);
      const m = x * x, u = C * d;
      if (!(u < 0.05))
        for (let R = 0; R < e.length; R++) {
          if (R === w) continue;
          if (s.length >= ke) break;
          const k = e[R].x - e[w].x, L = e[R].y - e[w].y;
          if (k * k + L * L > m) continue;
          const T = S(w, R);
          v.has(T) || (v.add(T), s.push({ fromIdx: w, toIdx: R, progress: 0, strength: u }));
        }
    }
    function $(w, C) {
      let x = -1, d = 1 / 0;
      for (let m = 0; m < e.length; m++) {
        const u = e[m].x - w, R = e[m].y - C, k = u * u + R * R;
        k < d && (d = k, x = m);
      }
      return x;
    }
    function l(w) {
      if (!n.current.interactive) return;
      const C = i.getBoundingClientRect();
      p = $(w.clientX - C.left, w.clientY - C.top);
    }
    function r() {
      p = -1;
    }
    function b(w) {
      if (!n.current.interactive) return;
      const C = i.getBoundingClientRect(), x = $(w.clientX - C.left, w.clientY - C.top);
      x >= 0 && B(x, 1);
    }
    function F(w) {
      if (!n.current.interactive) return;
      w.preventDefault();
      const C = i.getBoundingClientRect(), x = $(w.touches[0].clientX - C.left, w.touches[0].clientY - C.top);
      x >= 0 && B(x, 1);
    }
    c.addEventListener("mousemove", l), c.addEventListener("mouseleave", r), c.addEventListener("mousedown", b), c.addEventListener("touchstart", F, { passive: !1 });
    let M = 0;
    function P(w) {
      const C = M ? Math.min(w - M, 50) : 16;
      M = w;
      const { nodeColor: x, edgeColor: d, signalColor: m, backgroundColor: u, connectionRadius: R, nodeRadius: k, lineWidth: L, speed: T, pulseInterval: A, glowEffect: E, glowBlur: Y, animated: q, wander: X, wanderSpeed: V } = n.current;
      if (e.length > 0 && w - t > A && (t = w, B(Math.random() * e.length | 0, 1)), o.fillStyle = u, o.fillRect(0, 0, f, y), !q) {
        h = requestAnimationFrame(P);
        return;
      }
      if (X) {
        const _ = V * 2;
        for (const O of e)
          O.vx += (Math.random() - 0.5) * 0.05 * V, O.vy += (Math.random() - 0.5) * 0.05 * V, O.vx > _ ? O.vx = _ : O.vx < -_ && (O.vx = -_), O.vy > _ ? O.vy = _ : O.vy < -_ && (O.vy = -_), O.x += O.vx * C * 0.016, O.y += O.vy * C * 0.016, O.x < 0 ? (O.x = 0, O.vx = Math.abs(O.vx)) : O.x > f && (O.x = f, O.vx = -Math.abs(O.vx)), O.y < 0 ? (O.y = 0, O.vy = Math.abs(O.vy)) : O.y > y && (O.y = y, O.vy = -Math.abs(O.vy));
      }
      o.save(), o.lineWidth = L;
      const j = R * R;
      for (let _ = 0; _ < e.length; _++)
        for (let O = _ + 1; O < e.length; O++) {
          const N = e[O].x - e[_].x, K = e[O].y - e[_].y, U = N * N + K * K;
          if (U > j) continue;
          const Q = (1 - Math.sqrt(U) / R) * 0.4;
          o.strokeStyle = pt(d, Q), o.beginPath(), o.moveTo(e[_].x, e[_].y), o.lineTo(e[O].x, e[O].y), o.stroke();
        }
      o.restore(), o.save(), E && (o.shadowBlur = Y, o.shadowColor = m);
      const H = T * C * 8e-4;
      for (let _ = s.length - 1; _ >= 0; _--) {
        const O = s[_];
        if (O.progress += H, O.progress >= 1) {
          v.delete(S(O.fromIdx, O.toIdx)), s.splice(_, 1), B(O.toIdx, O.strength);
          continue;
        }
        const N = e[O.fromIdx], K = e[O.toIdx], U = N.x + (K.x - N.x) * O.progress, Q = N.y + (K.y - N.y) * O.progress;
        o.fillStyle = pt(m, O.strength * 0.9), o.beginPath(), o.arc(U, Q, k * 0.6, 0, Math.PI * 2), o.fill();
      }
      o.shadowBlur = 0, o.restore(), o.save();
      for (let _ = 0; _ < e.length; _++) {
        const O = e[_], N = _ === p, K = O.flash;
        O.flash = Math.max(0, K - 0.03);
        const U = 0.4 + K * 0.6, Q = k * (N ? 1.5 : 1) * (1 + K * 0.4);
        E && (N || K > 0.1) ? (o.shadowBlur = Y * (0.5 + K * 0.5), o.shadowColor = x) : o.shadowBlur = 0, o.fillStyle = pt(x, U), o.beginPath(), o.arc(O.x, O.y, Q, 0, Math.PI * 2), o.fill();
      }
      o.shadowBlur = 0, o.restore(), h = requestAnimationFrame(P);
    }
    return h = requestAnimationFrame(P), () => {
      I.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousemove", l), c.removeEventListener("mouseleave", r), c.removeEventListener("mousedown", b), c.removeEventListener("touchstart", F);
    };
  }, [a]);
}
const sr = {
  default: {},
  neon: {
    nodeColor: "#00ffcc",
    edgeColor: "#00ffcc",
    signalColor: "#ffffff",
    backgroundColor: "#000000",
    glowEffect: !0,
    glowBlur: 20,
    pulseInterval: 1500,
    pulseDecay: 0.9
  },
  brain: {
    nodeColor: "#f472b6",
    edgeColor: "#ec4899",
    signalColor: "#fbbf24",
    backgroundColor: "#0f0005",
    connectionRadius: 130,
    glowEffect: !0,
    glowBlur: 18,
    pulseDecay: 0.88,
    wanderSpeed: 0.4
  },
  minimal: {
    nodeColor: "#6b7280",
    edgeColor: "#374151",
    signalColor: "#9ca3af",
    backgroundColor: "#111111",
    glowEffect: !1,
    pulseInterval: 3e3,
    nodeRadius: 3
  },
  plasma: {
    nodeColor: "#c084fc",
    edgeColor: "#7c3aed",
    signalColor: "#f0abfc",
    backgroundColor: "#050010",
    connectionRadius: 170,
    glowEffect: !0,
    glowBlur: 25,
    pulseDecay: 0.92,
    wanderSpeed: 0.2
  },
  circuit: {
    nodeColor: "#22c55e",
    edgeColor: "#166534",
    signalColor: "#86efac",
    backgroundColor: "#020a02",
    connectionRadius: 100,
    nodeRadius: 3,
    glowEffect: !0,
    glowBlur: 12,
    pulseInterval: 1e3,
    pulseDecay: 0.8,
    wanderSpeed: 0.1
  }
}, lr = ht(
  (a, g) => {
    const {
      preset: n,
      nodeCount: i,
      nodeColor: c,
      edgeColor: o,
      signalColor: f,
      backgroundColor: y,
      connectionRadius: h,
      nodeRadius: t,
      lineWidth: p,
      speed: e,
      pulseInterval: s,
      pulseDecay: v,
      glowEffect: S,
      glowBlur: z,
      interactive: D,
      animated: I,
      wander: W,
      wanderSpeed: B,
      width: $,
      height: l,
      className: r,
      style: b
    } = a, F = n && sr[n] || {}, M = G(null);
    return gt(g, () => M.current), ir(M, {
      nodeCount: i ?? 40,
      nodeColor: c ?? F.nodeColor ?? "#ffffff",
      edgeColor: o ?? F.edgeColor ?? "#6b7280",
      signalColor: f ?? F.signalColor ?? "#ffffff",
      backgroundColor: y ?? F.backgroundColor ?? "#111111",
      connectionRadius: h ?? F.connectionRadius ?? 150,
      nodeRadius: t ?? F.nodeRadius ?? 4,
      lineWidth: p ?? 1,
      speed: e ?? 1,
      pulseInterval: s ?? F.pulseInterval ?? 2e3,
      pulseDecay: v ?? F.pulseDecay ?? 0.85,
      glowEffect: S ?? F.glowEffect ?? !0,
      glowBlur: z ?? F.glowBlur ?? 15,
      interactive: D ?? !0,
      animated: I ?? !0,
      wander: W ?? !0,
      wanderSpeed: B ?? F.wanderSpeed ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: r,
        style: {
          width: $ ?? "100%",
          height: l ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: D ?? !0 ? "pointer" : "default",
          ...b
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: M,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
lr.displayName = "NeuralWeb";
function cr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = -9999, p = -9999, e = [];
    const s = { text: "", fontSize: -1, cssW: -1, cssH: -1 };
    function v(r, b, F, M) {
      const P = document.createElement("canvas");
      P.width = F, P.height = M;
      const w = P.getContext("2d");
      w.clearRect(0, 0, F, M), w.fillStyle = "#ffffff";
      const C = Math.min(b, M * 0.85, F * 0.9);
      w.font = `bold ${C}px ${n.current.fontFamily}`, w.textAlign = "center", w.textBaseline = "middle", w.fillText(r, F / 2, M / 2);
      const { particleGap: x } = n.current, d = w.getImageData(0, 0, F, M).data, m = [];
      for (let u = 0; u < M; u += x)
        for (let R = 0; R < F; R += x)
          d[(u * F + R) * 4 + 3] > 128 && m.push({ x: R, y: u, targetX: R, targetY: u, vx: 0, vy: 0 });
      return m;
    }
    function S(r, b) {
      const F = window.devicePixelRatio || 1;
      f = r, y = b, i.width = Math.round(r * F), i.height = Math.round(b * F), i.style.width = `${r}px`, i.style.height = `${b}px`, o.scale(F, F), s.cssW = -1;
    }
    const z = new ResizeObserver((r) => {
      const { width: b, height: F } = r[0].contentRect;
      b > 0 && F > 0 && S(b, F);
    });
    z.observe(c);
    const D = c.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(r) {
      if (!n.current.interactive) return;
      const b = i.getBoundingClientRect();
      t = r.clientX - b.left, p = r.clientY - b.top;
    }
    function W() {
      t = -9999, p = -9999;
    }
    function B(r) {
      if (!n.current.interactive) return;
      r.preventDefault();
      const b = i.getBoundingClientRect();
      t = r.touches[0].clientX - b.left, p = r.touches[0].clientY - b.top;
    }
    function $() {
      t = -9999, p = -9999;
    }
    c.addEventListener("mousemove", I), c.addEventListener("mouseleave", W), c.addEventListener("touchmove", B, { passive: !1 }), c.addEventListener("touchend", $);
    function l() {
      const { text: r, fontSize: b, color: F, backgroundColor: M, particleSize: P, repelRadius: w, repelForce: C, snapSpeed: x, friction: d, glowEffect: m, glowBlur: u, animated: R } = n.current;
      if (f > 0 && y > 0 && (r !== s.text || b !== s.fontSize || f !== s.cssW || y !== s.cssH) && (s.text = r, s.fontSize = b, s.cssW = f, s.cssH = y, e = v(r, b, f, y)), o.fillStyle = M, o.fillRect(0, 0, f, y), !R || e.length === 0) {
        h = requestAnimationFrame(l);
        return;
      }
      const k = w * w;
      o.save(), m && (o.shadowBlur = u, o.shadowColor = F), o.fillStyle = pt(F, 1);
      for (const L of e) {
        L.vx += (L.targetX - L.x) * x, L.vy += (L.targetY - L.y) * x;
        const T = L.x - t, A = L.y - p, E = T * T + A * A;
        if (E < k && E > 0) {
          const Y = Math.sqrt(E), q = (w - Y) / w * C;
          L.vx += T / Y * q, L.vy += A / Y * q;
        }
        L.vx *= d, L.vy *= d, L.x += L.vx, L.y += L.vy, o.beginPath(), o.arc(L.x, L.y, P, 0, Math.PI * 2), o.fill();
      }
      o.restore(), h = requestAnimationFrame(l);
    }
    return h = requestAnimationFrame(l), () => {
      z.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousemove", I), c.removeEventListener("mouseleave", W), c.removeEventListener("touchmove", B), c.removeEventListener("touchend", $);
    };
  }, [a]);
}
const ur = {
  default: {},
  neon: {
    color: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: !0,
    glowBlur: 10,
    repelForce: 7
  },
  fire: {
    color: "#f97316",
    backgroundColor: "#0a0200",
    glowEffect: !0,
    glowBlur: 12,
    repelForce: 8,
    particleSize: 2
  },
  frost: {
    color: "#93c5fd",
    backgroundColor: "#030712",
    glowEffect: !0,
    glowBlur: 8,
    repelRadius: 100,
    snapSpeed: 0.08
  },
  gold: {
    color: "#fbbf24",
    backgroundColor: "#0a0800",
    glowEffect: !0,
    glowBlur: 14,
    particleSize: 2
  },
  minimal: {
    color: "#6b7280",
    backgroundColor: "#111111",
    glowEffect: !1,
    particleSize: 1.5,
    repelForce: 3
  }
}, fr = ht(
  (a, g) => {
    const {
      preset: n,
      text: i,
      fontSize: c,
      fontFamily: o,
      color: f,
      backgroundColor: y,
      particleSize: h,
      particleGap: t,
      repelRadius: p,
      repelForce: e,
      snapSpeed: s,
      friction: v,
      glowEffect: S,
      glowBlur: z,
      animated: D,
      interactive: I,
      width: W,
      height: B,
      className: $,
      style: l
    } = a, r = n && ur[n] || {}, b = G(null);
    return gt(g, () => b.current), cr(b, {
      text: i ?? "hello",
      fontSize: c ?? 120,
      fontFamily: o ?? "sans-serif",
      color: f ?? r.color ?? "#ffffff",
      backgroundColor: y ?? r.backgroundColor ?? "#111111",
      particleSize: h ?? r.particleSize ?? 2,
      particleGap: t ?? 4,
      repelRadius: p ?? r.repelRadius ?? 80,
      repelForce: e ?? r.repelForce ?? 5,
      snapSpeed: s ?? r.snapSpeed ?? 0.12,
      friction: v ?? 0.85,
      glowEffect: S ?? r.glowEffect ?? !1,
      glowBlur: z ?? r.glowBlur ?? 6,
      animated: D ?? !0,
      interactive: I ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: W ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: I ?? !0 ? "crosshair" : "default",
          ...l
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: b,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
fr.displayName = "ParticleText";
function dr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = [], p = -1, e = 0, s = 0;
    const v = document.createElement("canvas"), S = v.getContext("2d");
    let z = null, D = 0, I = 0, W = -1;
    function B(u, R) {
      const { blobCount: k, minRadius: L, maxRadius: T, speed: A } = n.current;
      t = Array.from({ length: k }, () => {
        const E = L + Math.random() * (T - L);
        return {
          x: E + Math.random() * (u - E * 2),
          y: E + Math.random() * (R - E * 2),
          vx: (Math.random() - 0.5) * A * 2,
          vy: (Math.random() - 0.5) * A * 2,
          radius: E
        };
      });
    }
    function $(u, R) {
      const { resolution: k } = n.current;
      k === W && D > 0 || (W = k, D = Math.max(1, Math.round(u * k)), I = Math.max(1, Math.round(R * k)), v.width = D, v.height = I, z = S.createImageData(D, I));
    }
    function l(u, R) {
      const k = window.devicePixelRatio || 1;
      f = u, y = R, i.width = Math.round(u * k), i.height = Math.round(R * k), i.style.width = `${u}px`, i.style.height = `${R}px`, o.scale(k, k), W = -1, $(u, R), B(u, R);
    }
    const r = new ResizeObserver((u) => {
      const { width: R, height: k } = u[0].contentRect;
      R > 0 && k > 0 && l(R, k);
    });
    r.observe(c);
    const b = c.getBoundingClientRect();
    b.width > 0 && b.height > 0 && l(b.width, b.height);
    function F(u, R) {
      for (let k = 0; k < t.length; k++) {
        const L = t[k].x - u, T = t[k].y - R;
        if (L * L + T * T < t[k].radius * t[k].radius) return k;
      }
      return -1;
    }
    function M(u) {
      if (!n.current.interactive) return;
      const R = i.getBoundingClientRect(), k = u.clientX - R.left, L = u.clientY - R.top, T = F(k, L);
      if (T >= 0)
        p = T, e = k - t[T].x, s = L - t[T].y;
      else {
        const { minRadius: A, maxRadius: E } = n.current, Y = A + Math.random() * (E - A);
        t.push({ x: k, y: L, vx: 0, vy: 0, radius: Y });
      }
    }
    function P(u) {
      if (!n.current.interactive || p < 0) return;
      const R = i.getBoundingClientRect();
      t[p].x = u.clientX - R.left - e, t[p].y = u.clientY - R.top - s, t[p].vx = 0, t[p].vy = 0;
    }
    function w() {
      p = -1;
    }
    function C(u) {
      if (!n.current.interactive) return;
      u.preventDefault();
      const R = i.getBoundingClientRect(), k = u.touches[0].clientX - R.left, L = u.touches[0].clientY - R.top, T = F(k, L);
      T >= 0 && (p = T, e = k - t[T].x, s = L - t[T].y);
    }
    function x(u) {
      if (!n.current.interactive || p < 0) return;
      u.preventDefault();
      const R = i.getBoundingClientRect();
      t[p].x = u.touches[0].clientX - R.left - e, t[p].y = u.touches[0].clientY - R.top - s, t[p].vx = 0, t[p].vy = 0;
    }
    function d() {
      p = -1;
    }
    c.addEventListener("mousedown", M), c.addEventListener("mousemove", P), window.addEventListener("mouseup", w), c.addEventListener("touchstart", C, { passive: !1 }), c.addEventListener("touchmove", x, { passive: !1 }), c.addEventListener("touchend", d);
    function m() {
      const { blobCount: u, color: R, backgroundColor: k, threshold: L, speed: T, glowEffect: A, glowBlur: E, animated: Y, resolution: q } = n.current;
      if (q !== W && (W = -1, $(f, y)), u !== t.length && p < 0 && f > 0) {
        for (; t.length < u; ) {
          const { minRadius: J, maxRadius: et } = n.current, tt = J + Math.random() * (et - J);
          t.push({
            x: tt + Math.random() * Math.max(1, f - tt * 2),
            y: tt + Math.random() * Math.max(1, y - tt * 2),
            vx: (Math.random() - 0.5) * T * 2,
            vy: (Math.random() - 0.5) * T * 2,
            radius: tt
          });
        }
        for (; t.length > u; ) t.pop();
      }
      if (o.fillStyle = k, o.fillRect(0, 0, f, y), !Y || !z || D === 0) {
        h = requestAnimationFrame(m);
        return;
      }
      const X = f / D, V = y / I;
      for (let J = 0; J < t.length; J++) {
        if (J === p) continue;
        const et = t[J];
        et.vx += (Math.random() - 0.5) * 0.1 * T, et.vy += (Math.random() - 0.5) * 0.1 * T;
        const tt = T * 2;
        et.vx > tt ? et.vx = tt : et.vx < -tt && (et.vx = -tt), et.vy > tt ? et.vy = tt : et.vy < -tt && (et.vy = -tt), et.x += et.vx, et.y += et.vy, et.x < et.radius ? (et.x = et.radius, et.vx = Math.abs(et.vx)) : et.x > f - et.radius && (et.x = f - et.radius, et.vx = -Math.abs(et.vx)), et.y < et.radius ? (et.y = et.radius, et.vy = Math.abs(et.vy)) : et.y > y - et.radius && (et.y = y - et.radius, et.vy = -Math.abs(et.vy));
      }
      const [j, H, _] = Rt([k], 0), [O, N, K] = Rt([R], 0), U = z.data, Q = L * 0.8, ot = L * 0.2;
      for (let J = 0; J < I; J++) {
        const et = J * V;
        for (let tt = 0; tt < D; tt++) {
          const nt = tt * X;
          let rt = 0;
          for (const st of t) {
            const lt = nt - st.x, ct = et - st.y, ut = lt * lt + ct * ct;
            if (ut < 1) {
              rt = 99;
              break;
            }
            rt += st.radius * st.radius / ut;
          }
          const Z = Math.min(1, Math.max(0, (rt - Q) / ot)), at = (J * D + tt) * 4;
          U[at] = j + (O - j) * Z | 0, U[at + 1] = H + (N - H) * Z | 0, U[at + 2] = _ + (K - _) * Z | 0, U[at + 3] = 255;
        }
      }
      S.putImageData(z, 0, 0), o.save(), A && (o.shadowBlur = E, o.shadowColor = R), o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "medium", o.drawImage(v, 0, 0, f, y), o.restore(), h = requestAnimationFrame(m);
    }
    return h = requestAnimationFrame(m), () => {
      r.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousedown", M), c.removeEventListener("mousemove", P), window.removeEventListener("mouseup", w), c.removeEventListener("touchstart", C), c.removeEventListener("touchmove", x), c.removeEventListener("touchend", d);
    };
  }, [a]);
}
const hr = {
  default: {},
  plasma: {
    color: "#c084fc",
    backgroundColor: "#050010",
    glowEffect: !0,
    glowBlur: 30,
    speed: 1.5
  },
  lava: {
    color: "#f97316",
    backgroundColor: "#1a0000",
    glowEffect: !0,
    glowBlur: 20,
    speed: 0.5,
    minRadius: 50,
    maxRadius: 100
  },
  ocean: {
    color: "#38bdf8",
    backgroundColor: "#020c17",
    glowEffect: !0,
    glowBlur: 15,
    speed: 0.8,
    threshold: 0.8
  },
  neon: {
    color: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: !0,
    glowBlur: 25,
    speed: 2,
    threshold: 1.1
  },
  ghost: {
    color: "#e2e8f0",
    backgroundColor: "#111111",
    glowEffect: !1,
    speed: 0.3,
    threshold: 0.9,
    minRadius: 60,
    maxRadius: 110
  }
}, gr = ht(
  (a, g) => {
    const {
      preset: n,
      blobCount: i,
      color: c,
      backgroundColor: o,
      threshold: f,
      speed: y,
      minRadius: h,
      maxRadius: t,
      glowEffect: p,
      glowBlur: e,
      resolution: s,
      animated: v,
      interactive: S,
      width: z,
      height: D,
      className: I,
      style: W
    } = a, B = n && hr[n] || {}, $ = G(null);
    return gt(g, () => $.current), dr($, {
      blobCount: i ?? 5,
      color: c ?? B.color ?? "#ffffff",
      backgroundColor: o ?? B.backgroundColor ?? "#111111",
      threshold: f ?? B.threshold ?? 1,
      speed: y ?? B.speed ?? 1,
      minRadius: h ?? B.minRadius ?? 40,
      maxRadius: t ?? B.maxRadius ?? 80,
      glowEffect: p ?? B.glowEffect ?? !0,
      glowBlur: e ?? B.glowBlur ?? 20,
      resolution: s ?? 0.4,
      animated: v ?? !0,
      interactive: S ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: z ?? "100%",
          height: D ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: S ?? !0 ? "grab" : "default",
          ...W
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: $,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
gr.displayName = "Metaballs";
function pr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = [], p = [], e = new Float32Array(0), s = new Float32Array(0), v = 0, S = 0, z = 0, D = 0;
    const I = document.createElement("canvas"), W = I.getContext("2d");
    let B = null, $ = -1;
    const l = 18, r = 12;
    function b(u, R) {
      const { resolution: k } = n.current;
      k === $ && v > 0 || ($ = k, v = Math.max(1, Math.round(u * k)), S = Math.max(1, Math.round(R * k)), e = new Float32Array(v * S), s = new Float32Array(v * S), I.width = v, I.height = S, B = W.createImageData(v, S));
    }
    function F(u, R) {
      const { antCount: k } = n.current;
      z = u / 2, D = R / 2, t = Array.from({ length: k }, () => ({
        x: z,
        y: D,
        angle: Math.random() * Math.PI * 2,
        hasFood: !1
      }));
    }
    function M(u, R) {
      const k = window.devicePixelRatio || 1;
      f = u, y = R, i.width = Math.round(u * k), i.height = Math.round(R * k), i.style.width = `${u}px`, i.style.height = `${R}px`, o.scale(k, k), $ = -1, b(u, R), F(u, R), p = [];
    }
    const P = new ResizeObserver((u) => {
      const { width: R, height: k } = u[0].contentRect;
      R > 0 && k > 0 && M(R, k);
    });
    P.observe(c);
    const w = c.getBoundingClientRect();
    w.width > 0 && w.height > 0 && M(w.width, w.height);
    function C(u) {
      if (!n.current.interactive) return;
      const R = i.getBoundingClientRect(), k = u.clientX - R.left, L = u.clientY - R.top;
      p.length < n.current.maxFood && p.push({ x: k, y: L, amount: 200 });
    }
    function x(u) {
      if (!n.current.interactive) return;
      u.preventDefault();
      const R = i.getBoundingClientRect(), k = u.touches[0].clientX - R.left, L = u.touches[0].clientY - R.top;
      p.length < n.current.maxFood && p.push({ x: k, y: L, amount: 200 });
    }
    c.addEventListener("mousedown", C), c.addEventListener("touchstart", x, { passive: !1 });
    function d(u, R, k) {
      const L = Math.max(0, Math.min(v - 1, R | 0)), T = Math.max(0, Math.min(S - 1, k | 0));
      return u[T * v + L];
    }
    function m() {
      const {
        evaporationRate: u,
        diffusionRate: R,
        pheromoneStrength: k,
        antSpeed: L,
        sensorAngle: T,
        sensorDistance: A,
        turnSpeed: E,
        antColor: Y,
        pheromoneColor: q,
        backgroundColor: X,
        foodColor: V,
        nestColor: j,
        resolution: H,
        animated: _
      } = n.current;
      if (H !== $ && ($ = -1, b(f, y)), o.fillStyle = X, o.fillRect(0, 0, f, y), !_ || v === 0 || !B) {
        h = requestAnimationFrame(m);
        return;
      }
      const O = f / v, N = y / S;
      for (let Z = 0; Z < e.length; Z++)
        e[Z] *= 1 - u, s[Z] *= 1 - u, e[Z] < 1e-3 && (e[Z] = 0), s[Z] < 1e-3 && (s[Z] = 0);
      if (R > 0) {
        const Z = R * 0.25;
        for (let at = 1; at < S - 1; at++)
          for (let st = 1; st < v - 1; st++) {
            const lt = at * v + st, ct = e, ut = s, mt = ct[lt - 1] + ct[lt + 1] + ct[lt - v] + ct[lt + v], bt = ut[lt - 1] + ut[lt + 1] + ut[lt - v] + ut[lt + v];
            ct[lt] += (mt * 0.25 - ct[lt]) * Z, ut[lt] += (bt * 0.25 - ut[lt]) * Z;
          }
      }
      for (const Z of t) {
        const at = Z.hasFood ? s : e, st = Z.angle, lt = Z.angle - T, ct = Z.angle + T, ut = (wt) => {
          const kt = Z.x + Math.cos(wt) * A, Tt = Z.y + Math.sin(wt) * A;
          return d(at, kt / O, Tt / N);
        }, mt = ut(lt), bt = ut(st), Ct = ut(ct);
        bt >= mt && bt >= Ct || (mt > Ct ? Z.angle -= E * Math.random() : Ct > mt ? Z.angle += E * Math.random() : Z.angle += (Math.random() - 0.5) * E), Z.angle += (Math.random() - 0.5) * 0.2, Z.x += Math.cos(Z.angle) * L, Z.y += Math.sin(Z.angle) * L, Z.x < 0 ? (Z.x = 0, Z.angle = Math.PI - Z.angle) : Z.x >= f && (Z.x = f - 1, Z.angle = Math.PI - Z.angle), Z.y < 0 ? (Z.y = 0, Z.angle = -Z.angle) : Z.y >= y && (Z.y = y - 1, Z.angle = -Z.angle);
        const Et = Math.max(0, Math.min(v - 1, Z.x / O | 0)), Mt = Math.max(0, Math.min(S - 1, Z.y / N | 0)) * v + Et;
        Z.hasFood ? e[Mt] = Math.min(255, e[Mt] + k) : s[Mt] = Math.min(255, s[Mt] + k);
        const Pt = Z.x - z, St = Z.y - D;
        if (Z.hasFood && Pt * Pt + St * St < l * l && (Z.hasFood = !1, Z.angle += Math.PI), !Z.hasFood)
          for (let wt = p.length - 1; wt >= 0; wt--) {
            const kt = p[wt], Tt = Z.x - kt.x, qt = Z.y - kt.y;
            if (Tt * Tt + qt * qt < r * r && kt.amount > 0) {
              Z.hasFood = !0, Z.angle += Math.PI, kt.amount--, kt.amount <= 0 && p.splice(wt, 1);
              break;
            }
          }
      }
      const [K, U, Q] = Rt([X], 0), [ot, J, et] = Rt([q], 0), tt = B.data, nt = v * S, rt = Math.max(1, k * 8);
      for (let Z = 0; Z < nt; Z++) {
        const at = e[Z] / rt, st = s[Z] / rt, lt = Math.min(1, at + st), ct = Z * 4;
        tt[ct] = K + (ot - K) * lt | 0, tt[ct + 1] = U + (J - U) * lt | 0, tt[ct + 2] = Q + (et - Q) * lt | 0, tt[ct + 3] = 255;
      }
      W.putImageData(B, 0, 0), o.imageSmoothingEnabled = !0, o.imageSmoothingQuality = "medium", o.drawImage(I, 0, 0, f, y), o.save(), o.beginPath(), o.arc(z, D, l, 0, Math.PI * 2), o.fillStyle = j, o.fill(), o.restore(), o.save();
      for (const Z of p)
        o.beginPath(), o.arc(Z.x, Z.y, r, 0, Math.PI * 2), o.fillStyle = V, o.fill();
      o.restore(), o.save(), o.fillStyle = Y;
      for (const Z of t)
        o.beginPath(), o.arc(Z.x, Z.y, 1.5, 0, Math.PI * 2), o.fill();
      o.restore(), h = requestAnimationFrame(m);
    }
    return h = requestAnimationFrame(m), () => {
      P.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousedown", C), c.removeEventListener("touchstart", x);
    };
  }, [a]);
}
const mr = {
  default: {},
  neon: {
    antColor: "#ffffff",
    pheromoneColor: "#00ffcc",
    foodColor: "#f0abfc",
    nestColor: "#fbbf24",
    backgroundColor: "#000000",
    pheromoneStrength: 8
  },
  desert: {
    antColor: "#451a03",
    pheromoneColor: "#d97706",
    foodColor: "#84cc16",
    nestColor: "#b45309",
    backgroundColor: "#fef3c7",
    antSpeed: 2,
    evaporationRate: 5e-3
  },
  jungle: {
    antColor: "#1a0a00",
    pheromoneColor: "#4ade80",
    foodColor: "#fbbf24",
    nestColor: "#7c3aed",
    backgroundColor: "#052e16",
    antCount: 200,
    antSpeed: 1
  },
  minimal: {
    antColor: "#9ca3af",
    pheromoneColor: "#374151",
    foodColor: "#6b7280",
    nestColor: "#6b7280",
    backgroundColor: "#111111",
    antCount: 80,
    pheromoneStrength: 3
  },
  swarm: {
    antColor: "#ffffff",
    pheromoneColor: "#6b7280",
    foodColor: "#4ade80",
    nestColor: "#f59e0b",
    backgroundColor: "#111111",
    antCount: 400,
    antSpeed: 2,
    pheromoneStrength: 10,
    evaporationRate: 2e-3
  }
}, yr = ht(
  (a, g) => {
    const {
      preset: n,
      antCount: i,
      evaporationRate: c,
      diffusionRate: o,
      pheromoneStrength: f,
      antSpeed: y,
      sensorAngle: h,
      sensorDistance: t,
      turnSpeed: p,
      antColor: e,
      pheromoneColor: s,
      foodColor: v,
      nestColor: S,
      backgroundColor: z,
      resolution: D,
      animated: I,
      interactive: W,
      maxFood: B,
      width: $,
      height: l,
      className: r,
      style: b
    } = a, F = n && mr[n] || {}, M = G(null);
    return gt(g, () => M.current), pr(M, {
      antCount: i ?? F.antCount ?? 150,
      evaporationRate: c ?? F.evaporationRate ?? 3e-3,
      diffusionRate: o ?? 0.1,
      pheromoneStrength: f ?? F.pheromoneStrength ?? 5,
      antSpeed: y ?? F.antSpeed ?? 1.5,
      sensorAngle: h ?? 0.4,
      sensorDistance: t ?? 6,
      turnSpeed: p ?? 0.3,
      antColor: e ?? F.antColor ?? "#ffffff",
      pheromoneColor: s ?? F.pheromoneColor ?? "#6b7280",
      foodColor: v ?? F.foodColor ?? "#4ade80",
      nestColor: S ?? F.nestColor ?? "#f59e0b",
      backgroundColor: z ?? F.backgroundColor ?? "#111111",
      resolution: D ?? 0.5,
      animated: I ?? !0,
      interactive: W ?? !0,
      maxFood: B ?? 5
    }), /* @__PURE__ */ it(
      "div",
      {
        className: r,
        style: {
          width: $ ?? "100%",
          height: l ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: W ?? !0 ? "crosshair" : "default",
          ...b
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: M,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
yr.displayName = "AntColony";
function wr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = !0, p = [], e = -1, s = 0, v = 0;
    function S(C, x) {
      p = [
        { x: C * 0.35, y: x * 0.5, charge: 1 },
        { x: C * 0.65, y: x * 0.5, charge: -1 }
      ];
    }
    function z(C, x) {
      const d = window.devicePixelRatio || 1;
      f = C, y = x, i.width = Math.round(C * d), i.height = Math.round(x * d), i.style.width = `${C}px`, i.style.height = `${x}px`, o.scale(d, d), S(C, x), t = !0;
    }
    const D = new ResizeObserver((C) => {
      const { width: x, height: d } = C[0].contentRect;
      x > 0 && d > 0 && z(x, d);
    });
    D.observe(c);
    const I = c.getBoundingClientRect();
    I.width > 0 && I.height > 0 && z(I.width, I.height);
    function W(C, x) {
      let d = 0, m = 0;
      for (const u of p) {
        const R = C - u.x, k = x - u.y, L = R * R + k * k;
        if (L < 1) continue;
        const T = Math.sqrt(L), A = u.charge / L;
        d += R / T * A, m += k / T * A;
      }
      return [d, m];
    }
    function B() {
      const { fieldLineCount: C, stepSize: x, maxSteps: d, lineColor: m, lineWidth: u, lineOpacity: R, poleRadius: k, glowEffect: L, glowBlur: T, positiveColor: A, negativeColor: E, backgroundColor: Y } = n.current;
      o.fillStyle = Y, o.fillRect(0, 0, f, y);
      const q = k * k;
      o.save(), o.lineWidth = u;
      for (const X of p) {
        const V = X.charge;
        for (let j = 0; j < C; j++) {
          const H = j / C * Math.PI * 2;
          let _ = X.x + Math.cos(H) * (k + 2), O = X.y + Math.sin(H) * (k + 2);
          o.beginPath(), o.moveTo(_, O);
          let N = 0;
          for (let K = 0; K < d; K++) {
            const [U, Q] = W(_, O), ot = Math.sqrt(U * U + Q * Q);
            if (ot < 1e-10) break;
            const J = _ + U / ot * x * V, et = O + Q / ot * x * V;
            if (J < 0 || J > f || et < 0 || et > y) break;
            let tt = !1;
            for (const nt of p) {
              const rt = J - nt.x, Z = et - nt.y;
              if (rt * rt + Z * Z < q) {
                tt = !0;
                break;
              }
            }
            if (tt) break;
            o.lineTo(J, et), _ = J, O = et, N++;
          }
          N !== 0 && (L && (o.shadowBlur = T * 0.5, o.shadowColor = m), o.strokeStyle = pt(m, R), o.stroke());
        }
      }
      o.shadowBlur = 0, o.restore(), o.save();
      for (const X of p) {
        const V = X.charge === 1 ? A : E;
        L && (o.shadowBlur = T, o.shadowColor = V), o.fillStyle = V, o.beginPath(), o.arc(X.x, X.y, k, 0, Math.PI * 2), o.fill(), o.shadowBlur = 0, o.fillStyle = "#ffffff", o.font = `bold ${k}px sans-serif`, o.textAlign = "center", o.textBaseline = "middle", o.fillText(X.charge === 1 ? "N" : "S", X.x, X.y);
      }
      o.restore();
    }
    function $(C) {
      if (!n.current.interactive) return;
      const x = i.getBoundingClientRect(), d = C.clientX - x.left, m = C.clientY - x.top, { poleRadius: u, maxPoles: R } = n.current, k = u * 2;
      let L = -1;
      for (let T = 0; T < p.length; T++) {
        const A = p[T].x - d, E = p[T].y - m;
        if (A * A + E * E < k * k) {
          L = T;
          break;
        }
      }
      if (L >= 0)
        e = L, s = d - p[L].x, v = m - p[L].y;
      else if (p.length < R) {
        const T = p.length % 2 === 0 ? 1 : -1;
        p.push({ x: d, y: m, charge: T }), t = !0;
      }
    }
    function l(C) {
      if (!n.current.interactive || e < 0) return;
      const x = i.getBoundingClientRect();
      p[e].x = C.clientX - x.left - s, p[e].y = C.clientY - x.top - v, t = !0;
    }
    function r() {
      e = -1;
    }
    function b(C) {
      if (!n.current.interactive || (C.preventDefault(), p.length <= 2)) return;
      const x = i.getBoundingClientRect(), d = C.clientX - x.left, m = C.clientY - x.top, { poleRadius: u } = n.current, R = u * 2;
      for (let k = 0; k < p.length; k++) {
        const L = p[k].x - d, T = p[k].y - m;
        if (L * L + T * T < R * R) {
          p.splice(k, 1), t = !0;
          break;
        }
      }
    }
    function F(C) {
      if (!n.current.interactive) return;
      C.preventDefault();
      const x = i.getBoundingClientRect(), d = C.touches[0].clientX - x.left, m = C.touches[0].clientY - x.top, { poleRadius: u } = n.current, R = u * 2;
      for (let k = 0; k < p.length; k++) {
        const L = p[k].x - d, T = p[k].y - m;
        if (L * L + T * T < R * R) {
          e = k, s = d - p[k].x, v = m - p[k].y;
          return;
        }
      }
    }
    function M(C) {
      if (!n.current.interactive || e < 0) return;
      C.preventDefault();
      const x = i.getBoundingClientRect();
      p[e].x = C.touches[0].clientX - x.left - s, p[e].y = C.touches[0].clientY - x.top - v, t = !0;
    }
    function P() {
      e = -1;
    }
    c.addEventListener("mousedown", $), c.addEventListener("mousemove", l), window.addEventListener("mouseup", r), c.addEventListener("contextmenu", b), c.addEventListener("touchstart", F, { passive: !1 }), c.addEventListener("touchmove", M, { passive: !1 }), c.addEventListener("touchend", P);
    function w() {
      const { animated: C } = n.current;
      (C || t) && (B(), t = !1), h = requestAnimationFrame(w);
    }
    return h = requestAnimationFrame(w), () => {
      D.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousedown", $), c.removeEventListener("mousemove", l), window.removeEventListener("mouseup", r), c.removeEventListener("contextmenu", b), c.removeEventListener("touchstart", F), c.removeEventListener("touchmove", M), c.removeEventListener("touchend", P);
    };
  }, [a]);
}
const vr = {
  default: {},
  neon: {
    positiveColor: "#f43f5e",
    negativeColor: "#3b82f6",
    lineColor: "#00ffcc",
    backgroundColor: "#000000",
    glowEffect: !0,
    glowBlur: 25,
    lineOpacity: 0.8
  },
  warm: {
    positiveColor: "#f97316",
    negativeColor: "#fbbf24",
    lineColor: "#fed7aa",
    backgroundColor: "#0c0500",
    glowEffect: !0,
    glowBlur: 18
  },
  mono: {
    positiveColor: "#ffffff",
    negativeColor: "#6b7280",
    lineColor: "#9ca3af",
    backgroundColor: "#111111",
    glowEffect: !1,
    lineOpacity: 0.5
  },
  electric: {
    positiveColor: "#38bdf8",
    negativeColor: "#a78bfa",
    lineColor: "#e0f2fe",
    backgroundColor: "#020c14",
    glowEffect: !0,
    glowBlur: 30,
    fieldLineCount: 24
  },
  minimal: {
    positiveColor: "#ef4444",
    negativeColor: "#3b82f6",
    lineColor: "#4b5563",
    backgroundColor: "#111111",
    glowEffect: !1,
    lineOpacity: 0.4,
    fieldLineCount: 10
  }
}, Cr = ht(
  (a, g) => {
    const {
      preset: n,
      fieldLineCount: i,
      stepSize: c,
      maxSteps: o,
      positiveColor: f,
      negativeColor: y,
      lineColor: h,
      backgroundColor: t,
      lineWidth: p,
      lineOpacity: e,
      poleRadius: s,
      glowEffect: v,
      glowBlur: S,
      animated: z,
      interactive: D,
      maxPoles: I,
      width: W,
      height: B,
      className: $,
      style: l
    } = a, r = n && vr[n] || {}, b = G(null);
    return gt(g, () => b.current), wr(b, {
      fieldLineCount: i ?? r.fieldLineCount ?? 16,
      stepSize: c ?? 4,
      maxSteps: o ?? 400,
      positiveColor: f ?? r.positiveColor ?? "#ef4444",
      negativeColor: y ?? r.negativeColor ?? "#3b82f6",
      lineColor: h ?? r.lineColor ?? "#6b7280",
      backgroundColor: t ?? r.backgroundColor ?? "#111111",
      lineWidth: p ?? 1,
      lineOpacity: e ?? r.lineOpacity ?? 0.6,
      poleRadius: s ?? 12,
      glowEffect: v ?? r.glowEffect ?? !0,
      glowBlur: S ?? r.glowBlur ?? 20,
      animated: z ?? !1,
      interactive: D ?? !0,
      maxPoles: I ?? 6
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: W ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: D ?? !0 ? "pointer" : "default",
          ...l
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: b,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Cr.displayName = "MagneticField";
function Pe(a) {
  return a * a * a * (a * (a * 6 - 15) + 10);
}
function ue(a, g, n) {
  return a + n * (g - a);
}
function Qt(a, g, n) {
  const i = a & 3, c = i < 2 ? g : n, o = i < 2 ? n : g;
  return (i & 1 ? -c : c) + (i & 2 ? -o : o);
}
const Gt = new Uint8Array(256);
for (let a = 0; a < 256; a++) Gt[a] = a;
for (let a = 255; a > 0; a--) {
  const g = Math.floor(Math.random() * (a + 1));
  [Gt[a], Gt[g]] = [Gt[g], Gt[a]];
}
const $t = new Uint8Array(512);
for (let a = 0; a < 512; a++) $t[a] = Gt[a & 255];
function Mr(a, g) {
  const n = Math.floor(a) & 255, i = Math.floor(g) & 255, c = a - Math.floor(a), o = g - Math.floor(g), f = Pe(c), y = Pe(o), h = $t[$t[n] + i], t = $t[$t[n] + i + 1], p = $t[$t[n + 1] + i], e = $t[$t[n + 1] + i + 1];
  return ue(
    ue(Qt(h, c, o), Qt(p, c - 1, o), f),
    ue(Qt(t, c, o - 1), Qt(e, c - 1, o - 1), f),
    y
  );
}
function br(a, g, n, i) {
  let c = 0, o = 1, f = 1, y = 0;
  for (let h = 0; h < n; h++)
    c += Mr(a * f, g * f) * o, y += o, o *= i, f *= 2;
  return c / y;
}
function xr(a) {
  const g = a.replace("#", "");
  return [
    parseInt(g.slice(0, 2), 16) || 0,
    parseInt(g.slice(2, 4), 16) || 0,
    parseInt(g.slice(4, 6), 16) || 0
  ];
}
function Rr(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement;
    if (!c) return;
    const o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = g.rotateY, p = g.rotateX, e = null, s = "", v = 255, S = 255, z = 255, D = "", I = !1, W = 0, B = 0;
    function $(m, u) {
      const R = window.devicePixelRatio || 1;
      f = m, y = u, i.width = Math.round(m * R), i.height = Math.round(u * R), i.style.width = `${m}px`, i.style.height = `${u}px`, o.scale(R, R);
    }
    const l = new ResizeObserver((m) => {
      const { width: u, height: R } = m[0].contentRect;
      u > 0 && R > 0 && $(u, R);
    });
    l.observe(c);
    const r = c.getBoundingClientRect();
    r.width > 0 && r.height > 0 && $(r.width, r.height);
    function b(m) {
      n.current.interactive && (I = !0, W = m.clientX, B = m.clientY);
    }
    function F(m) {
      !n.current.interactive || !I || (t += (m.clientX - W) * 5e-3, p += (m.clientY - B) * 5e-3, p = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, p)), W = m.clientX, B = m.clientY);
    }
    function M() {
      I = !1;
    }
    function P(m) {
      n.current.interactive && (I = !0, W = m.touches[0].clientX, B = m.touches[0].clientY);
    }
    function w(m) {
      !n.current.interactive || !I || (m.preventDefault(), t += (m.touches[0].clientX - W) * 5e-3, p += (m.touches[0].clientY - B) * 5e-3, p = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, p)), W = m.touches[0].clientX, B = m.touches[0].clientY);
    }
    function C() {
      I = !1;
    }
    c.addEventListener("mousedown", b), c.addEventListener("mousemove", F), window.addEventListener("mouseup", M), c.addEventListener("touchstart", P, { passive: !1 }), c.addEventListener("touchmove", w, { passive: !1 }), c.addEventListener("touchend", C);
    function x(m, u, R, k, L, T) {
      const A = Math.cos(t), E = Math.sin(t), Y = Math.cos(p), q = Math.sin(p), X = m * A - R * E, V = m * E + R * A, j = u * Y - V * q, H = u * q + V * Y, _ = k + H + 600;
      return [L + X * k / _, T + j * k / _, H];
    }
    function d() {
      const {
        gridCols: m,
        gridRows: u,
        noiseScale: R,
        heightScale: k,
        wireColor: L,
        backgroundColor: T,
        fov: A,
        autoRotate: E,
        autoRotateSpeed: Y,
        glowEffect: q,
        glowBlur: X,
        animated: V,
        lineWidth: j,
        colorByHeight: H
      } = n.current;
      if (E && !I && (t += Y), o.fillStyle = T, o.fillRect(0, 0, f, y), !V || f === 0) {
        h = requestAnimationFrame(d);
        return;
      }
      const _ = `${m},${u},${R}`;
      if (_ !== s) {
        const Z = m + 1;
        e = new Float32Array(Z * (u + 1));
        for (let at = 0; at <= u; at++)
          for (let st = 0; st <= m; st++)
            e[at * Z + st] = br(st * R, at * R, 4, 0.5);
        s = _;
      }
      const O = e, N = m + 1;
      L !== D && ([v, S, z] = xr(L), D = L);
      const K = f / 2, U = y / 2, Q = f * 0.9, ot = y * 0.9, J = Q / m, et = ot / u;
      o.save(), q && (o.shadowBlur = X, o.shadowColor = L), o.lineWidth = j;
      const tt = new Float32Array(N * (u + 1)), nt = new Float32Array(N * (u + 1)), rt = new Float32Array(N * (u + 1));
      for (let Z = 0; Z <= u; Z++)
        for (let at = 0; at <= m; at++) {
          const st = O[Z * N + at], lt = -Q / 2 + at * J, ct = -ot / 2 + Z * et, [ut, mt, bt] = x(lt, ct, st * k, A, K, U), Ct = Z * N + at;
          tt[Ct] = ut, nt[Ct] = mt, rt[Ct] = bt;
        }
      for (let Z = 0; Z <= u; Z++) {
        let at = 0;
        const st = Z * N;
        for (let ut = 0; ut <= m; ut++) at += O[st + ut];
        at /= N;
        const lt = H ? Math.max(0, Math.min(1, (at + 1) * 0.5)) : 1, ct = H ? 0.2 + lt * 0.8 : 0.6;
        o.strokeStyle = `rgba(${v},${S},${z},${ct.toFixed(2)})`, o.beginPath(), o.moveTo(tt[st], nt[st]);
        for (let ut = 1; ut <= m; ut++)
          o.lineTo(tt[st + ut], nt[st + ut]);
        o.stroke();
      }
      for (let Z = 0; Z <= m; Z++) {
        let at = 0;
        for (let ct = 0; ct <= u; ct++) at += O[ct * N + Z];
        at /= u + 1;
        const st = H ? Math.max(0, Math.min(1, (at + 1) * 0.5)) : 1, lt = H ? 0.2 + st * 0.8 : 0.6;
        o.strokeStyle = `rgba(${v},${S},${z},${lt.toFixed(2)})`, o.beginPath(), o.moveTo(tt[Z], nt[Z]);
        for (let ct = 1; ct <= u; ct++)
          o.lineTo(tt[ct * N + Z], nt[ct * N + Z]);
        o.stroke();
      }
      o.restore(), h = requestAnimationFrame(d);
    }
    return h = requestAnimationFrame(d), () => {
      l.disconnect(), cancelAnimationFrame(h), c.removeEventListener("mousedown", b), c.removeEventListener("mousemove", F), window.removeEventListener("mouseup", M), c.removeEventListener("touchstart", P), c.removeEventListener("touchmove", w), c.removeEventListener("touchend", C);
    };
  }, [a]);
}
const Sr = {
  default: {},
  volcanic: {
    wireColor: "#ef4444",
    backgroundColor: "#0a0000",
    heightScale: 160,
    glowEffect: !0,
    glowBlur: 10,
    colorByHeight: !0
  },
  arctic: {
    wireColor: "#bae6fd",
    backgroundColor: "#020c17",
    heightScale: 80,
    noiseScale: 0.08,
    glowEffect: !0,
    glowBlur: 8,
    colorByHeight: !0
  },
  neon: {
    wireColor: "#00ffcc",
    backgroundColor: "#000000",
    heightScale: 140,
    glowEffect: !0,
    glowBlur: 12,
    colorByHeight: !1,
    lineWidth: 0.75
  },
  golden: {
    wireColor: "#fbbf24",
    backgroundColor: "#0a0800",
    heightScale: 100,
    glowEffect: !0,
    glowBlur: 8,
    colorByHeight: !0
  },
  minimal: {
    wireColor: "#4b5563",
    backgroundColor: "#111111",
    heightScale: 60,
    glowEffect: !1,
    colorByHeight: !1,
    lineWidth: 0.5
  }
}, kr = ht(
  (a, g) => {
    const {
      preset: n,
      gridCols: i,
      gridRows: c,
      noiseScale: o,
      heightScale: f,
      wireColor: y,
      backgroundColor: h,
      fov: t,
      rotateX: p,
      rotateY: e,
      autoRotate: s,
      autoRotateSpeed: v,
      glowEffect: S,
      glowBlur: z,
      interactive: D,
      animated: I,
      lineWidth: W,
      colorByHeight: B,
      width: $,
      height: l,
      className: r,
      style: b
    } = a, F = n && Sr[n] || {}, M = G(null);
    return gt(g, () => M.current), Rr(M, {
      gridCols: i ?? 40,
      gridRows: c ?? 30,
      noiseScale: o ?? F.noiseScale ?? 0.12,
      heightScale: f ?? F.heightScale ?? 120,
      wireColor: y ?? F.wireColor ?? "#ffffff",
      backgroundColor: h ?? F.backgroundColor ?? "#111111",
      fov: t ?? 500,
      rotateX: p ?? 0.4,
      rotateY: e ?? 0,
      autoRotate: s ?? !0,
      autoRotateSpeed: v ?? 3e-3,
      glowEffect: S ?? F.glowEffect ?? !1,
      glowBlur: z ?? F.glowBlur ?? 8,
      interactive: D ?? !0,
      animated: I ?? !0,
      lineWidth: W ?? F.lineWidth ?? 0.5,
      colorByHeight: B ?? F.colorByHeight ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: r,
        style: {
          width: $ ?? "100%",
          height: l ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: D ?? !0 ? "grab" : "default",
          ...b
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: M,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
kr.displayName = "TerrainMesh";
function Pr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G({ x: -999, y: -999 }), h = G(0);
  ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t.parentElement;
    if (!p) return;
    const e = t.getContext("2d");
    let s = 0, v = 0;
    function S() {
      const { segmentCount: w } = n.current, C = s / 2, x = v / 2;
      i.current = Array.from({ length: w }, (d, m) => ({
        x: C - m * 12,
        y: x
      })), y.current = { x: C, y: x };
    }
    function z(w, C) {
      const { starCount: x } = n.current;
      o.current = Array.from({ length: x }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function D(w, C) {
      const x = window.devicePixelRatio || 1;
      t.width = Math.round(w * x), t.height = Math.round(C * x), t.style.width = `${w}px`, t.style.height = `${C}px`, e.scale(x, x), s = w, v = C, S(), z(w, C);
    }
    const I = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && D(C, x);
    });
    I.observe(p);
    const W = p.getBoundingClientRect();
    W.width > 0 && W.height > 0 && D(W.width, W.height);
    function B(w) {
      if (!n.current.interactive) return;
      const C = t.getBoundingClientRect();
      y.current = { x: w.clientX - C.left, y: w.clientY - C.top };
    }
    t.addEventListener("mousemove", B);
    function $(w, C, x, d) {
      const { segmentSize: m } = n.current, u = Math.sqrt(x * x + d * d) || 1, R = x / u, k = d / u, L = 3 + Math.floor(Math.random() * 2);
      for (let T = 0; T < L; T++) {
        const E = 40 + Math.random() * 20;
        c.current.push({
          x: w + R * m * 0.9,
          y: C + k * m * 0.9,
          vx: R * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8,
          vy: k * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8 - 0.3,
          life: E,
          maxLife: E,
          size: 3 + Math.random() * 5
        });
      }
      c.current.length > 200 && c.current.splice(0, 30);
    }
    function l(w, C, x, d, m, u, R) {
      e.save(), e.translate(w, C), e.rotate(x);
      for (const k of [-1, 1]) {
        const L = k * Math.PI / 2, A = [
          { a: L + m * k - 0.35, len: d * 0.7 },
          { a: L + m * k, len: d },
          { a: L + m * k + 0.3, len: d * 0.75 }
        ].map((E) => ({
          x: Math.cos(E.a) * E.len,
          y: Math.sin(E.a) * E.len
        }));
        for (const E of A)
          e.beginPath(), e.moveTo(0, 0), e.lineTo(E.x, E.y), e.strokeStyle = `rgba(${u},${R * 0.85})`, e.lineWidth = 1.5, e.lineCap = "round", e.stroke(), e.beginPath(), e.arc(E.x * 0.55, E.y * 0.55, 2.5, 0, Math.PI * 2), e.fillStyle = `rgba(${u},${R * 0.9})`, e.fill(), e.beginPath(), e.arc(E.x, E.y, 1.8, 0, Math.PI * 2), e.fill();
        for (let E = 0; E < A.length - 1; E++) {
          const Y = A[E], q = A[E + 1], X = (Y.x + q.x) * 0.42, V = (Y.y + q.y) * 0.42 + k * 10;
          e.beginPath(), e.moveTo(Y.x, Y.y), e.quadraticCurveTo(X, V, q.x, q.y), e.strokeStyle = `rgba(${u},${R * 0.15})`, e.lineWidth = 1, e.stroke();
        }
        e.beginPath(), e.moveTo(0, 0), e.quadraticCurveTo(A[0].x * 0.3, A[0].y * 0.3, A[0].x, A[0].y), e.strokeStyle = `rgba(${u},${R * 0.1})`, e.lineWidth = 1, e.stroke();
      }
      e.restore();
    }
    let r = g.starCount;
    function b() {
      const { starCount: w, starColor: C, glowingStars: x, starGlowBlur: d } = n.current;
      w !== r && (r = w, z(s, v));
      const m = o.current;
      if (m.length !== 0) {
        e.fillStyle = C;
        for (const u of m)
          x && u.isGlowing || (e.globalAlpha = u.opacity, e.beginPath(), e.arc(u.x, u.y, u.r, 0, Math.PI * 2), e.fill());
        if (x) {
          e.shadowColor = C, e.shadowBlur = d;
          for (const u of m)
            u.isGlowing && (e.globalAlpha = u.opacity * 0.12, e.beginPath(), e.arc(u.x, u.y, u.r * 5, 0, Math.PI * 2), e.fill(), e.globalAlpha = u.opacity * 0.35, e.beginPath(), e.arc(u.x, u.y, u.r * 2.5, 0, Math.PI * 2), e.fill(), e.globalAlpha = u.opacity, e.beginPath(), e.arc(u.x, u.y, u.r * 1.5, 0, Math.PI * 2), e.fill());
          e.shadowBlur = 0, e.shadowColor = "rgba(0,0,0,0)";
        }
        e.globalAlpha = 1;
      }
    }
    function F(w) {
      const {
        segmentCount: C,
        segmentSize: x,
        bodyColor: d,
        fireColor: m,
        backgroundColor: u,
        followSpeed: R,
        wingSpan: k,
        showFire: L,
        interactive: T
      } = n.current;
      h.current += w * 1e-3;
      const A = h.current;
      e.fillStyle = u, e.fillRect(0, 0, s, v), b();
      const E = i.current;
      T || (y.current = {
        x: s * 0.5 + Math.sin(A * 0.5) * s * 0.35,
        y: v * 0.5 + Math.cos(A * 0.7) * v * 0.3
      });
      const Y = y.current;
      for (; E.length < C; ) {
        const O = E[E.length - 1] || { x: s / 2, y: v / 2 };
        E.push({ x: O.x, y: O.y });
      }
      E.length > C && (E.length = C);
      const q = E[0], X = Math.min(R, 1);
      q.x += (Y.x - q.x) * X, q.y += (Y.y - q.y) * X;
      for (let O = 1; O < E.length; O++) {
        const N = E[O - 1], K = E[O], U = N.x - K.x, Q = N.y - K.y, ot = Math.sqrt(U * U + Q * Q) || 1e-3, J = x * 1.2;
        ot > J && (K.x = N.x - U / ot * J, K.y = N.y - Q / ot * J);
        const et = -Q / ot, tt = U / ot, nt = Math.sin(A * 4 - O * 0.4) * (x * 0.25) * (O / E.length);
        K.x += et * nt, K.y += tt * nt;
      }
      const V = E.length >= 2 ? Math.atan2(E[0].y - E[1].y, E[0].x - E[1].x) : 0, j = vt(d), H = vt(m);
      if (L && E.length >= 2) {
        const O = E[0], N = E[1], K = O.x - N.x, U = O.y - N.y;
        Math.random() < 0.8 && $(O.x, O.y, K, U);
      }
      if (L)
        for (let O = c.current.length - 1; O >= 0; O--) {
          const N = c.current[O];
          if (N.x += N.vx, N.y += N.vy, N.life -= 1, N.life <= 0) {
            c.current.splice(O, 1);
            continue;
          }
          const K = N.life / N.maxLife, U = K * 0.75, Q = N.size * K, ot = H;
          e.beginPath(), e.arc(N.x, N.y, Math.max(0.5, Q), 0, Math.PI * 2), e.fillStyle = `rgba(${ot},${U})`, e.fill();
        }
      const _ = Math.sin(A * 6) * 0.3;
      if (E.length >= 4) {
        const O = E[2], N = E[3], K = Math.atan2(O.y - N.y, O.x - N.x);
        l(O.x, O.y, K, k, _, j, 0.85);
      }
      for (let O = E.length - 1; O >= 1; O--) {
        const N = E[O], K = E[O - 1], U = O / (E.length - 1), Q = x * (1 - U * 0.75), ot = Math.max(2, Q * 0.55), J = K.x - N.x, et = K.y - N.y, tt = Math.sqrt(J * J + et * et) || 1, nt = J / tt, rt = et / tt, Z = Q * 0.28, at = -rt * Z, st = nt * Z, lt = 0.4 + (1 - U) * 0.15;
        if (e.beginPath(), e.moveTo(N.x + at, N.y + st), e.lineTo(K.x + at, K.y + st), e.strokeStyle = `rgba(${j},${lt})`, e.lineWidth = 1, e.lineCap = "butt", e.stroke(), e.beginPath(), e.moveTo(N.x - at, N.y - st), e.lineTo(K.x - at, K.y - st), e.stroke(), e.beginPath(), e.arc(N.x, N.y, ot, 0, Math.PI * 2), e.strokeStyle = `rgba(${j},${0.7 + (1 - U) * 0.25})`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.arc(N.x, N.y, ot * 0.38, 0, Math.PI * 2), e.fillStyle = `rgba(${j},${0.8 + (1 - U) * 0.2})`, e.fill(), O % 3 === 0 && O > 2 && O < E.length - 3) {
          const ct = Math.atan2(N.y - K.y, N.x - K.x), ut = -Math.sin(ct), mt = Math.cos(ct), bt = x * (1.1 + (1 - U) * 0.9);
          for (const Ct of [-1, 1]) {
            const Et = bt * 0.9, yt = N.x + ut * Ct * Et, Mt = N.y + mt * Ct * Et, Pt = N.x + ut * Ct * Et * 0.55 + Math.cos(ct) * Et * -0.22, St = N.y + mt * Ct * Et * 0.55 + Math.sin(ct) * Et * -0.22;
            e.beginPath(), e.moveTo(N.x, N.y), e.quadraticCurveTo(Pt, St, yt, Mt), e.strokeStyle = `rgba(${j},0.62)`, e.lineWidth = 1.2, e.lineCap = "round", e.stroke();
            const wt = bt * 0.55, kt = N.x + ut * Ct * wt, Tt = N.y + mt * Ct * wt, qt = N.x + ut * Ct * wt * 0.5 + Math.cos(ct) * wt * 0.18, ne = N.y + mt * Ct * wt * 0.5 + Math.sin(ct) * wt * 0.18;
            e.beginPath(), e.moveTo(N.x, N.y), e.quadraticCurveTo(qt, ne, kt, Tt), e.strokeStyle = `rgba(${j},0.38)`, e.lineWidth = 0.8, e.stroke();
          }
        }
      }
      if (E.length > 0) {
        const O = E[0], N = Math.cos(V), K = Math.sin(V), U = -Math.sin(V), Q = Math.cos(V), ot = x * 1.05, J = x * 0.82;
        e.save(), e.translate(O.x, O.y), e.rotate(V);
        const et = e.createRadialGradient(-ot * 0.1, 0, ot * 0.05, 0, 0, ot);
        et.addColorStop(0, `rgba(${j},0.07)`), et.addColorStop(1, `rgba(${j},0)`), e.beginPath(), e.ellipse(0, 0, ot, J, 0, 0, Math.PI * 2), e.fillStyle = et, e.fill(), e.beginPath(), e.ellipse(0, 0, ot, J, 0, 0, Math.PI * 2), e.strokeStyle = `rgba(${j},0.88)`, e.lineWidth = 1.8, e.stroke(), e.restore();
        const tt = x * 0.58;
        for (const yt of [-1, 1]) {
          const Mt = O.x + U * tt * yt, Pt = O.y + Q * tt * yt, St = Mt + U * yt * x * 0.28 + Math.cos(V - Math.PI) * x * 0.88, wt = Pt + Q * yt * x * 0.28 + Math.sin(V - Math.PI) * x * 0.88, kt = St + U * yt * x * 0.14 + Math.cos(V - Math.PI) * x * 0.48, Tt = wt + Q * yt * x * 0.14 + Math.sin(V - Math.PI) * x * 0.48;
          e.beginPath(), e.moveTo(Mt, Pt), e.lineTo(St, wt), e.strokeStyle = `rgba(${j},0.9)`, e.lineWidth = 2.5, e.lineCap = "round", e.stroke(), e.beginPath(), e.moveTo(St, wt), e.lineTo(kt, Tt), e.lineWidth = 1.2, e.stroke();
          const qt = St + U * yt * x * 0.2, ne = wt + Q * yt * x * 0.2;
          e.beginPath(), e.moveTo(St, wt), e.lineTo(qt, ne), e.lineWidth = 0.9, e.stroke();
        }
        const nt = x * 0.4, rt = x * 0.22, Z = x * 0.26;
        for (const yt of [-1, 1]) {
          const Mt = O.x + U * nt * yt + N * rt, Pt = O.y + Q * nt * yt + K * rt;
          e.beginPath(), e.arc(Mt, Pt, Z, 0, Math.PI * 2), e.fillStyle = "rgba(0,0,0,0.72)", e.fill(), e.beginPath(), e.arc(Mt, Pt, Z, 0, Math.PI * 2), e.strokeStyle = `rgba(${j},0.82)`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.arc(
            Mt + N * Z * 0.28 - U * Z * 0.28 * yt,
            Pt + K * Z * 0.28 - Q * Z * 0.28 * yt,
            Z * 0.16,
            0,
            Math.PI * 2
          ), e.fillStyle = `rgba(${j},0.32)`, e.fill();
        }
        const at = x * 0.55, st = Math.sin(A * 3) * 0.1 + 0.08, lt = -x * 0.14, ct = x * 0.14 + st * x * 0.55, ut = x * 0.82, mt = x * 0.2;
        e.save(), e.translate(O.x + N * at, O.y + K * at), e.rotate(V), e.beginPath(), e.ellipse(0, lt, ut, mt, 0, 0, Math.PI), e.strokeStyle = `rgba(${j},0.85)`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.ellipse(0, ct, ut * 0.88, mt * 0.88, 0, Math.PI, Math.PI * 2), e.stroke();
        const bt = 5;
        for (let yt = 0; yt < bt; yt++) {
          const Mt = -ut * 0.78 + ut * 1.56 * (yt + 0.5) / bt, Pt = Math.max(0, 1 - (Mt / ut) ** 2), St = lt + mt * Math.sqrt(Pt), wt = x * (0.12 + Math.sin(yt * 1.5) * 0.04), kt = ut / bt * 0.38;
          e.beginPath(), e.moveTo(Mt - kt, St), e.lineTo(Mt, St + wt), e.lineTo(Mt + kt, St), e.strokeStyle = `rgba(${j},0.75)`, e.lineWidth = 1, e.stroke();
        }
        const Ct = 4, Et = ut * 0.88;
        for (let yt = 0; yt < Ct; yt++) {
          const Mt = -Et * 0.78 + Et * 1.56 * (yt + 0.5) / Ct, Pt = Math.max(0, 1 - (Mt / Et) ** 2), St = ct - mt * 0.88 * Math.sqrt(Pt), wt = x * (0.1 + Math.sin(yt * 1.9) * 0.04), kt = Et / Ct * 0.36;
          e.beginPath(), e.moveTo(Mt - kt, St), e.lineTo(Mt, St - wt), e.lineTo(Mt + kt, St), e.strokeStyle = `rgba(${j},0.7)`, e.lineWidth = 1, e.stroke();
        }
        e.restore();
      }
    }
    let M = 0;
    function P(w) {
      const C = M ? w - M : 16;
      M = w, F(C), f.current = requestAnimationFrame(P);
    }
    return f.current = requestAnimationFrame(P), () => {
      I.disconnect(), cancelAnimationFrame(f.current), t.removeEventListener("mousemove", B);
    };
  }, [a]);
}
const Er = {
  default: {},
  emerald: {
    bodyColor: "#00ff88",
    eyeColor: "#00ff00",
    fireColor: "#00ffaa",
    backgroundColor: "#0a1a0f"
  },
  inferno: {
    bodyColor: "#ff6600",
    eyeColor: "#ff0000",
    fireColor: "#ffaa00",
    backgroundColor: "#1a0500"
  },
  void: {
    bodyColor: "#9900ff",
    eyeColor: "#cc00ff",
    fireColor: "#6600cc",
    backgroundColor: "#050010"
  },
  ice: {
    bodyColor: "#88ddff",
    eyeColor: "#ffffff",
    fireColor: "#aaeeff",
    backgroundColor: "#050a14"
  }
}, Ar = ht(
  (a, g) => {
    const {
      preset: n,
      segmentCount: i,
      segmentSize: c,
      bodyColor: o,
      eyeColor: f,
      fireColor: y,
      backgroundColor: h,
      followSpeed: t,
      wingSpan: p,
      showFire: e,
      interactive: s,
      starCount: v,
      starColor: S,
      glowingStars: z,
      starGlowBlur: D,
      width: I,
      height: W,
      className: B,
      style: $
    } = a, l = n && Er[n] || {}, r = G(null);
    return gt(g, () => r.current), Pr(r, {
      segmentCount: i ?? 20,
      segmentSize: c ?? l.segmentSize ?? 18,
      bodyColor: o ?? l.bodyColor ?? "#ffffff",
      eyeColor: f ?? l.eyeColor ?? "#111111",
      fireColor: y ?? l.fireColor ?? "#ffffff",
      backgroundColor: h ?? l.backgroundColor ?? "transparent",
      followSpeed: t ?? 0.15,
      wingSpan: p ?? l.wingSpan ?? 60,
      showFire: e ?? !1,
      interactive: s ?? !0,
      starCount: v ?? 60,
      starColor: S ?? "#ffffff",
      glowingStars: z ?? !1,
      starGlowBlur: D ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "none",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: r,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Ar.displayName = "DragonCursor";
function Br(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(0), f = G({ strength: 0, dir: 1 });
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s(l = !1) {
      const { petalSize: r } = n.current;
      return {
        x: Math.random() * p,
        y: l ? -r - Math.random() * 80 : Math.random() * e,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.06,
        size: r * (0.7 + Math.random() * 0.6),
        alpha: 0.6 + Math.random() * 0.4,
        settled: !1,
        settleY: 0,
        phase: Math.random() * Math.PI * 2,
        scaleY: 1
      };
    }
    function v() {
      const { petalCount: l } = n.current;
      i.current = Array.from({ length: l }, () => s(!1));
    }
    function S(l, r) {
      const b = window.devicePixelRatio || 1;
      y.width = Math.round(l * b), y.height = Math.round(r * b), y.style.width = `${l}px`, y.style.height = `${r}px`, t.scale(b, b), p = l, e = r, v();
    }
    const z = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && S(r, b);
    });
    z.observe(h);
    const D = h.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(l, r) {
      t.save(), t.translate(l.x, l.y), t.rotate(l.angle), t.scale(1, l.scaleY), t.globalAlpha = l.alpha;
      const b = l.size;
      t.beginPath(), t.moveTo(0, -b), t.quadraticCurveTo(b * 0.8, -b * 0.3, 0, b * 0.6), t.quadraticCurveTo(-b * 0.8, -b * 0.3, 0, -b), t.fillStyle = r, t.fill(), t.globalAlpha = 1, t.restore();
    }
    function W(l) {
      const {
        petalCount: r,
        petalColor: b,
        backgroundColor: F,
        gravity: M,
        windStrength: P,
        windGusts: w,
        showAccumulation: C,
        maxAccumulation: x
      } = n.current;
      o.current += l * 1e-3;
      const d = o.current;
      t.fillStyle = F, t.fillRect(0, 0, p, e);
      const m = f.current;
      w && (Math.random() < 3e-3 && (m.strength = 2 + Math.random() * 3, m.dir = Math.random() < 0.5 ? 1 : -1), m.strength *= 0.985);
      const u = P + m.strength * m.dir;
      for (; i.current.length < r; ) i.current.push(s(!0));
      i.current.length > r && (i.current.length = r);
      const k = `rgb(${vt(b)})`, L = i.current.filter((E) => E.settled), T = C ? Math.min(x, L.length * 0.6) : 0, A = e - T;
      if (C && L.length > 0)
        for (const E of L)
          I(E, k);
      for (const E of i.current) {
        if (E.settled) continue;
        const Y = Math.sin(d * 1.5 + E.phase) * u * 0.5;
        if (E.vx += Y * 0.01, E.vy += M * 0.016, E.x += E.vx + u * 0.02, E.y += E.vy, E.angle += E.angularVel + Math.sin(d * 2 + E.phase) * 2e-3, E.scaleY = 0.6 + Math.abs(Math.sin(E.angle * 1.5)) * 0.4, E.x < -E.size && (E.x = p + E.size), E.x > p + E.size && (E.x = -E.size), E.y >= A - E.size * 0.5)
          if (C) {
            if (E.settled = !0, E.x = Math.max(E.size, Math.min(p - E.size, E.x)), E.y = A - E.size * 0.3, E.settleY = E.y, E.angle = (Math.random() - 0.5) * 0.6, E.alpha *= 0.8, L.length > r * 0.6) {
              const q = i.current.find((X) => X.settled);
              q && Object.assign(q, s(!0));
            }
          } else
            Object.assign(E, s(!0));
        I(E, k);
      }
    }
    let B = 0;
    function $(l) {
      const r = B ? l - B : 16;
      B = l, W(r), c.current = requestAnimationFrame($);
    }
    return c.current = requestAnimationFrame($), () => {
      z.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [a]);
}
const Ir = {
  default: {},
  sakura: {
    petalColor: "#ffb7c5",
    backgroundColor: "#1a0a10",
    windStrength: 1
  },
  autumn: {
    petalColor: "#e06030",
    backgroundColor: "#0d0805",
    windStrength: 1.4,
    gravity: 0.09
  },
  snow: {
    petalColor: "#ddeeff",
    backgroundColor: "#050a14",
    windStrength: 0.5,
    gravity: 0.03,
    petalSize: 5
  },
  neon: {
    petalColor: "#ff00aa",
    backgroundColor: "#050005",
    windStrength: 0.9
  }
}, Fr = ht(
  (a, g) => {
    const {
      preset: n,
      petalCount: i,
      petalColor: c,
      petalSize: o,
      backgroundColor: f,
      gravity: y,
      windStrength: h,
      windGusts: t,
      showAccumulation: p,
      maxAccumulation: e,
      width: s,
      height: v,
      className: S,
      style: z
    } = a, D = n && Ir[n] || {}, I = G(null);
    return gt(g, () => I.current), Br(I, {
      petalCount: i ?? 80,
      petalColor: c ?? D.petalColor ?? "#ffffff",
      petalSize: o ?? D.petalSize ?? 8,
      backgroundColor: f ?? D.backgroundColor ?? "#111111",
      gravity: y ?? D.gravity ?? 0.06,
      windStrength: h ?? D.windStrength ?? 0.8,
      windGusts: t ?? !0,
      showAccumulation: p ?? !0,
      maxAccumulation: e ?? 40
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: {
          width: s ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          ...z
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: I,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Fr.displayName = "SakuraBlossom";
function $r(a, g, n) {
  return (Math.sin(a * 1.3 + n) * Math.cos(g * 1.1 - n * 0.7) + Math.sin(a * 2.7 - n * 1.3) * Math.cos(g * 2.1 + n * 0.9) * 0.5 + 1.5) / 3;
}
function Tr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G(0), h = G(null), t = G(null);
  ft(() => {
    const p = a.current;
    if (!p) return;
    const e = p.parentElement;
    if (!e) return;
    const s = p.getContext("2d");
    let v = 0, S = 0;
    function z(w, C) {
      const x = Math.random() * Math.PI * 2, d = (0.5 + Math.random() * 0.8) * n.current.speed, m = 40 + Math.random() * 30, u = Math.random() * v, R = Math.random() * S, k = Math.random() < 0.4;
      return {
        x: u,
        y: R,
        vx: Math.cos(x) * d,
        vy: Math.sin(x) * d,
        angle: x,
        speed: d,
        length: m,
        segments: Array.from({ length: 8 }, (L, T) => ({
          x: u - Math.cos(x) * T * (m / 8),
          y: R - Math.sin(x) * T * (m / 8)
        })),
        tailPhase: Math.random() * Math.PI * 2,
        color: k ? C : w,
        accentColor: k ? w : C,
        wanderAngle: x
      };
    }
    function D() {
      o.current = Array.from({ length: 5 }, () => ({
        x: v * 0.1 + Math.random() * v * 0.8,
        y: S * 0.1 + Math.random() * S * 0.8,
        radius: 18 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        gapAngle: 0.3 + Math.random() * 0.4
      }));
    }
    function I() {
      const { fishCount: w, fishColor: C, scaleColor: x } = n.current;
      i.current = Array.from({ length: w }, () => z(C, x)), D();
    }
    function W(w, C) {
      const x = window.devicePixelRatio || 1;
      p.width = Math.round(w * x), p.height = Math.round(C * x), p.style.width = `${w}px`, p.style.height = `${C}px`, s.scale(x, x), v = w, S = C, I();
    }
    const B = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && W(C, x);
    });
    B.observe(e);
    const $ = e.getBoundingClientRect();
    $.width > 0 && $.height > 0 && W($.width, $.height);
    function l(w) {
      if (!n.current.interactive) return;
      const C = p.getBoundingClientRect(), x = w.clientX - C.left, d = w.clientY - C.top, m = h.current;
      if (m) {
        const u = x - m.x, R = d - m.y;
        u * u + R * R > 400 && c.current.push({ x, y: d, radius: 0, maxRadius: 60, alpha: 0.6 });
      }
      h.current = { x, y: d }, t.current = { x, y: d };
    }
    function r() {
      h.current = null;
    }
    p.addEventListener("mousemove", l), p.addEventListener("mouseleave", r);
    function b(w, C) {
      const x = w.segments;
      if (x.length < 2) return;
      const d = vt(w.color), m = vt(w.accentColor);
      s.save();
      const u = x.map((H, _) => {
        const O = _ / (x.length - 1);
        return w.length * 0.18 * Math.sin(Math.PI * (1 - O));
      });
      s.beginPath();
      for (let H = 0; H < x.length; H++) {
        const _ = x[H], O = x[Math.min(H + 1, x.length - 1)], N = O.x - _.x, K = O.y - _.y, U = Math.sqrt(N * N + K * K) || 1e-3, Q = -K / U * u[H], ot = N / U * u[H];
        H === 0 ? s.moveTo(_.x + Q, _.y + ot) : s.lineTo(_.x + Q, _.y + ot);
      }
      for (let H = x.length - 1; H >= 0; H--) {
        const _ = x[H], O = x[Math.min(H + 1, x.length - 1)], N = O.x - _.x, K = O.y - _.y, U = Math.sqrt(N * N + K * K) || 1e-3, Q = -K / U * u[H], ot = N / U * u[H];
        s.lineTo(_.x - Q, _.y - ot);
      }
      s.closePath(), s.fillStyle = `rgba(${d},0.85)`, s.fill();
      for (let H = 1; H < x.length - 2; H += 2) {
        const _ = x[H], O = u[H] * 0.7;
        O > 1 && (s.beginPath(), s.arc(_.x, _.y, O, 0, Math.PI * 2), s.fillStyle = `rgba(${m},0.5)`, s.fill());
      }
      const R = x[x.length - 1], k = x[x.length - 2], L = Math.atan2(R.y - k.y, R.x - k.x), T = Math.sin(w.tailPhase + C * 5) * 0.6, A = w.length * 0.35;
      s.beginPath(), s.moveTo(R.x, R.y), s.lineTo(
        R.x + Math.cos(L + Math.PI / 2 + T) * A,
        R.y + Math.sin(L + Math.PI / 2 + T) * A
      ), s.lineTo(
        R.x + Math.cos(L - Math.PI / 2 - T) * A,
        R.y + Math.sin(L - Math.PI / 2 - T) * A
      ), s.closePath(), s.fillStyle = `rgba(${d},0.6)`, s.fill();
      const E = x[0], Y = x[1], q = Math.atan2(E.y - Y.y, E.x - Y.x), X = u[0] * 0.4, V = E.x + Math.cos(q + Math.PI / 3) * X, j = E.y + Math.sin(q + Math.PI / 3) * X;
      s.beginPath(), s.arc(V, j, Math.max(1.5, X * 0.5), 0, Math.PI * 2), s.fillStyle = "#111111", s.fill(), s.restore();
    }
    function F(w) {
      const {
        fishCount: C,
        fishColor: x,
        scaleColor: d,
        waterColor: m,
        rippleColor: u,
        lilyColor: R,
        speed: k,
        showLilies: L,
        caustics: T
      } = n.current;
      y.current += w * 1e-3;
      const A = y.current;
      if (s.fillStyle = m, s.fillRect(0, 0, v, S), T) {
        const X = Math.ceil(v / 40), V = Math.ceil(S / 40);
        vt(m);
        for (let j = 0; j < V; j++)
          for (let H = 0; H < X; H++) {
            const _ = $r(H * 0.4, j * 0.4, A * 0.8);
            if (_ > 0.6) {
              const O = (_ - 0.6) * 0.25;
              s.fillStyle = `rgba(255,255,255,${O})`, s.fillRect(H * 40, j * 40, 40, 40);
            }
          }
      }
      for (; i.current.length < C; ) i.current.push(z(x, d));
      i.current.length > C && (i.current.length = C);
      const E = h.current;
      for (const q of i.current) {
        q.wanderAngle += (Math.random() - 0.5) * 0.05;
        const X = Math.cos(q.wanderAngle) * q.speed, V = Math.sin(q.wanderAngle) * q.speed;
        q.vx += (X - q.vx) * 0.02, q.vy += (V - q.vy) * 0.02;
        for (const K of i.current) {
          if (K === q) continue;
          const U = q.x - K.x, Q = q.y - K.y, ot = Math.sqrt(U * U + Q * Q) || 1e-3;
          ot < q.length * 1.5 && (q.vx += U / ot * 0.05, q.vy += Q / ot * 0.05);
        }
        if (E) {
          const K = q.x - E.x, U = q.y - E.y, Q = Math.sqrt(K * K + U * U) || 1e-3;
          Q < 80 && (q.vx += K / Q * 0.3, q.vy += U / Q * 0.3, q.wanderAngle = Math.atan2(q.vy, q.vx));
        }
        const j = 60;
        q.x < j && (q.vx += 0.1), q.x > v - j && (q.vx -= 0.1), q.y < j && (q.vy += 0.1), q.y > S - j && (q.vy -= 0.1);
        const H = Math.sqrt(q.vx * q.vx + q.vy * q.vy) || 1e-3, _ = q.speed * 1.8;
        H > _ && (q.vx = q.vx / H * _, q.vy = q.vy / H * _), q.angle = Math.atan2(q.vy, q.vx), q.x += q.vx, q.y += q.vy, q.tailPhase += 0.05;
        const O = q.segments;
        O[0].x += (q.x - O[0].x) * 0.4, O[0].y += (q.y - O[0].y) * 0.4;
        const N = q.length / O.length;
        for (let K = 1; K < O.length; K++) {
          const U = O[K - 1], Q = O[K], ot = U.x - Q.x, J = U.y - Q.y, et = Math.sqrt(ot * ot + J * J) || 1e-3;
          et > N && (Q.x = U.x - ot / et * N, Q.y = U.y - J / et * N);
        }
        b(q, A);
      }
      if (L) {
        const q = vt(R);
        for (const X of o.current)
          s.save(), s.translate(X.x, X.y), s.rotate(X.rotation + A * 0.05), s.beginPath(), s.arc(0, 0, X.radius, X.gapAngle, Math.PI * 2 - X.gapAngle), s.lineTo(0, 0), s.closePath(), s.fillStyle = `rgba(${q},0.55)`, s.fill(), s.strokeStyle = `rgba(${q},0.3)`, s.lineWidth = 1, s.stroke(), s.beginPath(), s.arc(0, 0, X.radius * 0.15, 0, Math.PI * 2), s.fillStyle = `rgba(${q},0.8)`, s.fill(), s.restore();
      }
      const Y = vt(u);
      for (let q = c.current.length - 1; q >= 0; q--) {
        const X = c.current[q];
        if (X.radius += 1.2, X.alpha -= 0.012, X.alpha <= 0) {
          c.current.splice(q, 1);
          continue;
        }
        s.beginPath(), s.arc(X.x, X.y, X.radius, 0, Math.PI * 2), s.strokeStyle = `rgba(${Y},${X.alpha})`, s.lineWidth = 1, s.stroke(), X.radius > 10 && (s.beginPath(), s.arc(X.x, X.y, X.radius * 0.6, 0, Math.PI * 2), s.strokeStyle = `rgba(${Y},${X.alpha * 0.5})`, s.stroke());
      }
    }
    let M = 0;
    function P(w) {
      const C = M ? w - M : 16;
      M = w, F(C), f.current = requestAnimationFrame(P);
    }
    return f.current = requestAnimationFrame(P), () => {
      B.disconnect(), cancelAnimationFrame(f.current), p.removeEventListener("mousemove", l), p.removeEventListener("mouseleave", r);
    };
  }, [a]);
}
const Lr = {
  default: {},
  koi: {
    fishColor: "#ff6030",
    scaleColor: "#ffffff",
    waterColor: "#0a1520",
    rippleColor: "#60a8d0",
    lilyColor: "#50aa50",
    speed: 1
  },
  night: {
    fishColor: "#c0c0ff",
    scaleColor: "#8080ff",
    waterColor: "#040812",
    rippleColor: "#4050a0",
    lilyColor: "#304030"
  },
  lotus: {
    fishColor: "#ffb0c0",
    scaleColor: "#ffffff",
    waterColor: "#0a1218",
    rippleColor: "#90c0d0",
    lilyColor: "#ff80a0",
    speed: 0.7
  },
  neon: {
    fishColor: "#00ffcc",
    scaleColor: "#ff00aa",
    waterColor: "#050010",
    rippleColor: "#00aaff",
    lilyColor: "#00ff44",
    speed: 1.2
  }
}, zr = ht(
  (a, g) => {
    const {
      preset: n,
      fishCount: i,
      fishColor: c,
      scaleColor: o,
      waterColor: f,
      rippleColor: y,
      lilyColor: h,
      speed: t,
      interactive: p,
      showLilies: e,
      caustics: s,
      width: v,
      height: S,
      className: z,
      style: D
    } = a, I = n && Lr[n] || {}, W = G(null);
    return gt(g, () => W.current), Tr(W, {
      fishCount: i ?? 6,
      fishColor: c ?? I.fishColor ?? "#ffffff",
      scaleColor: o ?? I.scaleColor ?? "#6b7280",
      waterColor: f ?? I.waterColor ?? "#111111",
      rippleColor: y ?? I.rippleColor ?? "#6b7280",
      lilyColor: h ?? I.lilyColor ?? "#ffffff",
      speed: t ?? I.speed ?? 1,
      interactive: p ?? !0,
      showLilies: e ?? !0,
      caustics: s ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: z,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...D
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: W,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
zr.displayName = "KoiPond";
function Dr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G(0), h = G({ x: 0, y: 0, tx: 0, ty: 0 });
  ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t.parentElement;
    if (!p) return;
    const e = t.getContext("2d");
    let s = 0, v = 0;
    function S(w, C) {
      const x = w + Math.random() * C, d = Math.sqrt(200 / x) * 0.02 * (Math.random() < 0.5 ? 1 : -1);
      return {
        angle: Math.random() * Math.PI * 2,
        radius: x,
        speed: d,
        alpha: 0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        trail: []
      };
    }
    function z() {
      const { particleCount: w, eventHorizonRadius: C, diskWidth: x } = n.current;
      i.current = Array.from(
        { length: w },
        () => S(C, x)
      ), c.current = Array.from({ length: 40 }, (d, m) => ({
        y: -20 - m * 8,
        side: m % 2 === 0 ? 1 : -1,
        alpha: 0.3 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 20
      }));
    }
    function D(w, C) {
      const { starCount: x } = n.current;
      o.current = Array.from({ length: x }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function I(w, C) {
      const x = window.devicePixelRatio || 1;
      t.width = Math.round(w * x), t.height = Math.round(C * x), t.style.width = `${w}px`, t.style.height = `${C}px`, e.scale(x, x), s = w, v = C, h.current = { x: s / 2, y: v / 2, tx: s / 2, ty: v / 2 }, z(), D(w, C);
    }
    const W = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && I(C, x);
    });
    W.observe(p);
    const B = p.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function $(w) {
      if (!n.current.interactive) return;
      const C = t.getBoundingClientRect();
      h.current.tx = w.clientX - C.left, h.current.ty = w.clientY - C.top;
    }
    t.addEventListener("mousemove", $);
    function l(w, C, x) {
      const u = x * x * 2;
      e.fillStyle = "rgba(255,255,255,0.12)";
      for (let R = 0; R < s; R += 30)
        for (let k = 0; k < v; k += 30) {
          const L = R - w, T = k - C, A = L * L + T * T, E = Math.sqrt(A) || 1e-3;
          if (E < x * 1.2) continue;
          const Y = u / A, q = R + L / E * Y, X = k + T / E * Y;
          e.beginPath(), e.arc(q, X, 1, 0, Math.PI * 2), e.fill();
        }
    }
    let r = g.starCount;
    function b() {
      const { starCount: w, starColor: C, glowingStars: x, starGlowBlur: d } = n.current;
      w !== r && (r = w, D(s, v));
      const m = o.current;
      if (m.length !== 0) {
        e.fillStyle = C;
        for (const u of m)
          x && u.isGlowing || (e.globalAlpha = u.opacity, e.beginPath(), e.arc(u.x, u.y, u.r, 0, Math.PI * 2), e.fill());
        if (x) {
          e.shadowColor = C, e.shadowBlur = d;
          for (const u of m)
            u.isGlowing && (e.globalAlpha = u.opacity * 0.12, e.beginPath(), e.arc(u.x, u.y, u.r * 5, 0, Math.PI * 2), e.fill(), e.globalAlpha = u.opacity * 0.35, e.beginPath(), e.arc(u.x, u.y, u.r * 2.5, 0, Math.PI * 2), e.fill(), e.globalAlpha = u.opacity, e.beginPath(), e.arc(u.x, u.y, u.r * 1.5, 0, Math.PI * 2), e.fill());
          e.shadowBlur = 0, e.shadowColor = "rgba(0,0,0,0)";
        }
        e.globalAlpha = 1;
      }
    }
    function F(w) {
      const {
        diskColor: C,
        backgroundColor: x,
        particleCount: d,
        gravity: m,
        eventHorizonRadius: u,
        diskWidth: R,
        jetColor: k,
        showJets: L,
        lensing: T,
        speed: A
      } = n.current;
      y.current += w * 1e-3, y.current;
      const E = h.current;
      E.x += (E.tx - E.x) * 0.06, E.y += (E.ty - E.y) * 0.06;
      const Y = E.x, q = E.y;
      e.fillStyle = x, e.fillRect(0, 0, s, v), b(), T && l(Y, q, u);
      const X = e.createRadialGradient(Y, q, 0, Y, q, u * 2.5);
      X.addColorStop(0, "rgba(0,0,0,1)"), X.addColorStop(0.4, "rgba(0,0,0,0.9)"), X.addColorStop(1, "rgba(0,0,0,0)"), e.beginPath(), e.arc(Y, q, u * 2.5, 0, Math.PI * 2), e.fillStyle = X, e.fill();
      const V = vt(C);
      for (; i.current.length < d; ) i.current.push(S(u, R));
      i.current.length > d && (i.current.length = d);
      for (const H of i.current) {
        H.angle += H.speed * A, H.radius -= 0.015 * A;
        const _ = Y + Math.cos(H.angle) * H.radius, O = q + Math.sin(H.angle) * H.radius * 0.35;
        H.trail.push({ x: _, y: O }), H.trail.length > 5 && H.trail.shift(), H.radius < u && (H.radius = u + Math.random() * R, H.angle = Math.random() * Math.PI * 2, H.trail = [], H.alpha = 0.3 + Math.random() * 0.6);
        const N = Math.min(1, (u + R - H.radius) / R + 0.3), K = H.alpha * N;
        if (H.trail.length > 1) {
          e.beginPath(), e.moveTo(H.trail[0].x, H.trail[0].y);
          for (let U = 1; U < H.trail.length; U++) e.lineTo(H.trail[U].x, H.trail[U].y);
          e.strokeStyle = `rgba(${V},${K * 0.4})`, e.lineWidth = H.size * 0.8, e.lineCap = "round", e.stroke();
        }
        e.beginPath(), e.arc(_, O, H.size, 0, Math.PI * 2), e.fillStyle = `rgba(${V},${K})`, e.fill();
      }
      const j = e.createRadialGradient(Y, q, 0, Y, q, u * 1.5);
      if (j.addColorStop(0, "rgba(0,0,0,1)"), j.addColorStop(0.6, "rgba(0,0,0,0.95)"), j.addColorStop(1, "rgba(0,0,0,0)"), e.beginPath(), e.arc(Y, q, u * 1.5, 0, Math.PI * 2), e.fillStyle = j, e.fill(), L) {
        const H = vt(k);
        for (const _ of c.current)
          _.y -= 1.5 * A, _.x += _.vx * 0.3, _.alpha -= 6e-3 * A, _.alpha <= 0 && (_.y = -(Math.random() * 20), _.x = (Math.random() - 0.5) * 15, _.alpha = 0.2 + Math.random() * 0.4, _.vx = (Math.random() - 0.5) * 1.5), e.beginPath(), e.arc(Y + _.x, q + _.y, 1.5, 0, Math.PI * 2), e.fillStyle = `rgba(${H},${_.alpha})`, e.fill(), e.beginPath(), e.arc(Y + _.x, q - _.y, 1.5, 0, Math.PI * 2), e.fillStyle = `rgba(${H},${_.alpha})`, e.fill();
      }
    }
    let M = 0;
    function P(w) {
      const C = M ? w - M : 16;
      M = w, F(C), f.current = requestAnimationFrame(P);
    }
    return f.current = requestAnimationFrame(P), () => {
      W.disconnect(), cancelAnimationFrame(f.current), t.removeEventListener("mousemove", $);
    };
  }, [a]);
}
const qr = {
  default: {},
  cosmic: {
    diskColor: "#aaccff",
    backgroundColor: "#020510",
    jetColor: "#88aaff",
    diskWidth: 140
  },
  inferno: {
    diskColor: "#ff6600",
    backgroundColor: "#0d0200",
    jetColor: "#ff3300",
    diskWidth: 100
  },
  neon: {
    diskColor: "#00ffcc",
    backgroundColor: "#000510",
    jetColor: "#ff00aa",
    diskWidth: 120
  },
  void: {
    diskColor: "#6b7280",
    backgroundColor: "#050505",
    jetColor: "#4b5563",
    particleCount: 200,
    diskWidth: 80
  }
}, Wr = ht(
  (a, g) => {
    const {
      preset: n,
      diskColor: i,
      backgroundColor: c,
      particleCount: o,
      gravity: f,
      eventHorizonRadius: y,
      diskWidth: h,
      jetColor: t,
      showJets: p,
      lensing: e,
      speed: s,
      interactive: v,
      starCount: S,
      starColor: z,
      glowingStars: D,
      starGlowBlur: I,
      width: W,
      height: B,
      className: $,
      style: l
    } = a, r = n && qr[n] || {}, b = G(null);
    return gt(g, () => b.current), Dr(b, {
      diskColor: i ?? r.diskColor ?? "#ffffff",
      backgroundColor: c ?? r.backgroundColor ?? "#111111",
      particleCount: o ?? r.particleCount ?? 300,
      gravity: f ?? r.gravity ?? 200,
      eventHorizonRadius: y ?? r.eventHorizonRadius ?? 30,
      diskWidth: h ?? r.diskWidth ?? 120,
      jetColor: t ?? r.jetColor ?? "#6b7280",
      showJets: p ?? !0,
      lensing: e ?? !0,
      speed: s ?? 1,
      interactive: v ?? !0,
      starCount: S ?? 100,
      starColor: z ?? "#ffffff",
      glowingStars: D ?? !1,
      starGlowBlur: I ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: W ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          ...l
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: b,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Wr.displayName = "BlackHole";
function Yr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(0), f = G({ starCount: -1, armCount: -1, armTightness: -1 }), y = G({ tiltX: g.tiltX, tiltY: 0, targetTX: g.tiltX, targetTY: 0 }), h = G(null);
  ft(() => {
    const t = a.current;
    if (!t) return;
    const p = t.parentElement;
    if (!p) return;
    const e = t.getContext("2d");
    let s = 0, v = 0, S = 0;
    function z(M) {
      return Math.sin(M * 127.1) * 0.5 + Math.sin(M * 311.7) * 0.3 + Math.sin(M * 74.3) * 0.2;
    }
    function D() {
      const { starCount: M, armCount: P, armTightness: w } = n.current;
      i.current = [];
      const C = Math.floor(M * 0.15), x = Math.floor(M * 0.2), d = M - C - x;
      for (let m = 0; m < d; m++) {
        const u = m % P, R = 0.05 + Math.random() * 0.95, L = u / P * Math.PI * 2 + R * w * Math.PI * 4, T = (z(R * u + m) * 0.15 + (Math.random() - 0.5) * 0.1) * (1 - R * 0.5);
        i.current.push({
          r: R,
          baseAngle: L + T,
          armIndex: u,
          isHalo: !1,
          size: Math.max(0.3, (1 - R * 0.7) * 2.5 + Math.random() * 0.8),
          brightness: 0.4 + (1 - R) * 0.6 + Math.random() * 0.2,
          twinkle: Math.random() * Math.PI * 2
        });
      }
      for (let m = 0; m < x; m++) {
        const u = Math.random() * Math.random() * 0.18;
        i.current.push({
          r: u,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: 0,
          isHalo: !1,
          size: 0.5 + Math.random() * 1.5,
          brightness: 0.7 + Math.random() * 0.3,
          twinkle: Math.random() * Math.PI * 2
        });
      }
      for (let m = 0; m < C; m++)
        i.current.push({
          r: 0.6 + Math.random() * 0.5,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: -1,
          isHalo: !0,
          size: 0.3 + Math.random() * 0.6,
          brightness: 0.1 + Math.random() * 0.25,
          twinkle: Math.random() * Math.PI * 2
        });
    }
    function I(M, P) {
      const w = window.devicePixelRatio || 1;
      t.width = Math.round(M * w), t.height = Math.round(P * w), t.style.width = `${M}px`, t.style.height = `${P}px`, e.scale(w, w), s = M, v = P, D();
    }
    const W = new ResizeObserver((M) => {
      const { width: P, height: w } = M[0].contentRect;
      P > 0 && w > 0 && I(P, w);
    });
    W.observe(p);
    const B = p.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function $(M) {
      if (!n.current.interactive) return;
      const P = t.getBoundingClientRect();
      h.current = { x: M.clientX - P.left, y: M.clientY - P.top };
    }
    function l() {
      h.current = null;
    }
    t.addEventListener("mousemove", $), t.addEventListener("mouseleave", l);
    function r(M) {
      const {
        starCount: P,
        armCount: w,
        armTightness: C,
        coreColor: x,
        diskColor: d,
        backgroundColor: m,
        rotationSpeed: u,
        coreGlow: R,
        glowBlur: k
      } = n.current, L = f.current;
      (L.starCount !== P || L.armCount !== w || L.armTightness !== C) && (D(), f.current = { starCount: P, armCount: w, armTightness: C }), o.current += M * 1e-3, S += u * M * 1e-3 * 300;
      const T = y.current, A = h.current;
      A && n.current.interactive ? (T.targetTX = 0.1 + A.y / v * 0.7, T.targetTY = (A.x / s - 0.5) * 1.2) : (T.targetTX = n.current.tiltX, T.targetTY = 0), T.tiltX += (T.targetTX - T.tiltX) * 0.04, T.tiltY += (T.targetTY - T.tiltY) * 0.04, e.fillStyle = m, e.fillRect(0, 0, s, v);
      const E = s / 2, Y = v / 2, q = Math.min(s, v) * 0.45, X = Math.cos(T.tiltX), V = Math.sin(T.tiltY), j = Math.cos(T.tiltY), H = vt(x), _ = vt(d), O = i.current, N = [];
      for (const K of O) {
        K.twinkle += 0.02;
        const U = K.baseAngle + S * (1 - K.r * 0.3), Q = K.r * q, ot = Math.cos(U) * Q, J = Math.sin(U) * Q, et = K.isHalo ? (Math.random() - 0.5) * Q * 0.3 : 0, tt = ot * j - J * V, nt = ot * V + J * j, rt = E + tt, Z = Y + et * 1 + nt * X, at = nt;
        N.push({ sx: rt, sy: Z, sz: at, star: K });
      }
      if (N.sort((K, U) => K.sz - U.sz), R) {
        const K = q * 0.12, U = e.createRadialGradient(E, Y, 0, E, Y, K * 3);
        U.addColorStop(0, `rgba(${H},0.35)`), U.addColorStop(0.3, `rgba(${H},0.12)`), U.addColorStop(1, `rgba(${H},0)`), e.beginPath(), e.arc(E, Y, K * 3, 0, Math.PI * 2), e.fillStyle = U, e.fill(), e.shadowBlur = k, e.shadowColor = `rgb(${H})`, e.beginPath(), e.arc(E, Y, K * 0.4, 0, Math.PI * 2), e.fillStyle = `rgb(${H})`, e.fill(), e.shadowBlur = 0;
      }
      for (const { sx: K, sy: U, sz: Q, star: ot } of N) {
        const J = 0.8 + 0.2 * Math.sin(ot.twinkle), et = ot.brightness * J, tt = Q < 0 ? 0.5 + 0.5 * (1 + Q / q) : 1, nt = et * tt, rt = ot.isHalo || ot.r > 0.4 ? _ : H, Z = ot.size * (0.7 + 0.3 * tt);
        e.beginPath(), e.arc(K, U, Math.max(0.2, Z), 0, Math.PI * 2), e.fillStyle = `rgba(${rt},${Math.min(1, nt)})`, e.fill();
      }
    }
    let b = 0;
    function F(M) {
      const P = b ? M - b : 16;
      b = M, r(P), c.current = requestAnimationFrame(F);
    }
    return c.current = requestAnimationFrame(F), () => {
      W.disconnect(), cancelAnimationFrame(c.current), t.removeEventListener("mousemove", $), t.removeEventListener("mouseleave", l);
    };
  }, [a]);
}
const Xr = {
  default: {},
  andromeda: {
    coreColor: "#ffd8a8",
    diskColor: "#a8c4ff",
    backgroundColor: "#020408",
    armTightness: 0.6
  },
  neon: {
    coreColor: "#ff00ff",
    diskColor: "#00ffff",
    backgroundColor: "#000008",
    rotationSpeed: 6e-4
  },
  void: {
    coreColor: "#8866ff",
    diskColor: "#4433aa",
    backgroundColor: "#020005",
    armCount: 3,
    armTightness: 0.4
  },
  golden: {
    coreColor: "#ffe066",
    diskColor: "#ffaa33",
    backgroundColor: "#060400",
    rotationSpeed: 2e-4
  }
}, Gr = ht(
  (a, g) => {
    const {
      preset: n,
      starCount: i,
      armCount: c,
      armTightness: o,
      coreColor: f,
      diskColor: y,
      backgroundColor: h,
      rotationSpeed: t,
      tiltX: p,
      interactive: e,
      coreGlow: s,
      glowBlur: v,
      width: S,
      height: z,
      className: D,
      style: I
    } = a, W = n && Xr[n] || {}, B = G(null);
    return gt(g, () => B.current), Yr(B, {
      starCount: i ?? 3e3,
      armCount: c ?? W.armCount ?? 2,
      armTightness: o ?? W.armTightness ?? 0.5,
      coreColor: f ?? W.coreColor ?? "#ffffff",
      diskColor: y ?? W.diskColor ?? "#6b7280",
      backgroundColor: h ?? W.backgroundColor ?? "#111111",
      rotationSpeed: t ?? W.rotationSpeed ?? 3e-4,
      tiltX: p ?? 0.3,
      interactive: e ?? !0,
      coreGlow: s ?? !0,
      glowBlur: v ?? 30
    }), /* @__PURE__ */ it(
      "div",
      {
        className: D,
        style: {
          width: S ?? "100%",
          height: z ?? "100%",
          display: "block",
          overflow: "hidden",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: B,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Gr.displayName = "GalaxySpiral";
function fe(a, g, n, i, c, o) {
  if (o === 0) return [{ x: a, y: g }, { x: n, y: i }];
  const f = (a + n) / 2 + (Math.random() - 0.5) * c, y = (g + i) / 2 + (Math.random() - 0.5) * c * 0.3, h = c / 2;
  return [
    ...fe(a, g, f, y, h, o - 1),
    ...fe(f, y, n, i, h, o - 1).slice(1)
  ];
}
function Or(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G([]), y = G(0), h = G(0), t = G(0), p = G(0), e = G(0);
  ft(() => {
    const s = a.current;
    if (!s) return;
    const v = s.parentElement;
    if (!v) return;
    const S = s.getContext("2d");
    let z = 0, D = 0;
    function I() {
      const { particleCount: w } = n.current;
      i.current = Array.from({ length: w }, () => ({
        angle: Math.random() * Math.PI * 2,
        normY: Math.random(),
        speed: 0.7 + Math.random() * 0.6,
        alpha: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 3
      })), f.current = Array.from({ length: 80 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 80,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.2 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 3
      }));
    }
    function W(w, C) {
      const x = window.devicePixelRatio || 1;
      s.width = Math.round(w * x), s.height = Math.round(C * x), s.style.width = `${w}px`, s.style.height = `${C}px`, S.scale(x, x), z = w, D = C, t.current = z / 2, p.current = z / 2, I();
    }
    const B = new ResizeObserver((w) => {
      const { width: C, height: x } = w[0].contentRect;
      C > 0 && x > 0 && W(C, x);
    });
    B.observe(v);
    const $ = v.getBoundingClientRect();
    $.width > 0 && $.height > 0 && W($.width, $.height);
    function l(w) {
      if (!n.current.interactive) return;
      const C = s.getBoundingClientRect();
      p.current = w.clientX - C.left;
    }
    s.addEventListener("mousemove", l);
    function r(w, C, x) {
      const d = C + Math.random() * (x - C) * 0.3, m = d + (x - C) * (0.3 + Math.random() * 0.4), u = fe(w, d, w + (Math.random() - 0.5) * 20, m, 30, 4);
      o.current.push({ points: u, alpha: 0.9, life: 8 + Math.random() * 8 }), o.current.length > 5 && o.current.shift();
    }
    function b(w, C) {
      return C * Math.pow(1 - w, 1.4) * 0.9 + C * 0.02;
    }
    function F(w) {
      const {
        funnelColor: C,
        debrisColor: x,
        lightningColor: d,
        backgroundColor: m,
        rotationSpeed: u,
        funnelHeight: R,
        showLightning: k,
        showGroundDust: L,
        speed: T
      } = n.current;
      h.current += w * 1e-3;
      const A = h.current;
      t.current += (p.current - t.current) * 0.05;
      const E = t.current, Y = Math.sin(A * 0.8) * 15;
      S.fillStyle = m, S.fillRect(0, 0, z, D);
      const q = D * (1 - R), X = D - 20, V = Math.min(z * 0.35, 180), j = vt(C), H = vt(x), _ = vt(d), O = (q + X) * 0.5, N = S.createLinearGradient(E - V, q, E + V, X);
      N.addColorStop(0, "rgba(0,0,0,0)"), N.addColorStop(0.5, "rgba(0,0,0,0.35)"), N.addColorStop(1, "rgba(0,0,0,0)"), S.beginPath(), S.moveTo(E + Y, X), S.quadraticCurveTo(E + V * 0.5 + Y, O, E + V + Y * 0.3, q), S.lineTo(E - V + Y * 0.3, q), S.quadraticCurveTo(E - V * 0.5 + Y, O, E + Y, X), S.closePath(), S.fillStyle = N, S.fill();
      const K = i.current;
      for (const U of K)
        U.angle += u / (b(U.normY, V) * 0.01 + 0.5) * T * w * 1e-3, U.normY += 4e-4 * T, U.normY > 1 && (U.normY = 0, U.angle = Math.random() * Math.PI * 2);
      for (const U of K) {
        const Q = Math.sin(U.angle);
        if (Q > 0) continue;
        const ot = b(U.normY, V), J = q + U.normY * (X - q), et = E + Y * U.normY + Math.cos(U.angle) * ot, tt = U.alpha * (0.3 + 0.3 * -Q);
        S.beginPath(), S.arc(et, J, U.size * (0.5 + 0.5 * (1 - U.normY)), 0, Math.PI * 2), S.fillStyle = `rgba(${j},${tt})`, S.fill();
      }
      if (k) {
        e.current += w, e.current > 800 + Math.random() * 1200 && (e.current = 0, r(E + Y * 0.5, q, X));
        for (let U = o.current.length - 1; U >= 0; U--) {
          const Q = o.current[U];
          if (Q.life -= 1, Q.alpha *= 0.85, Q.life <= 0) {
            o.current.splice(U, 1);
            continue;
          }
          S.beginPath(), S.moveTo(Q.points[0].x, Q.points[0].y);
          for (let ot = 1; ot < Q.points.length; ot++)
            S.lineTo(Q.points[ot].x, Q.points[ot].y);
          S.strokeStyle = `rgba(${_},${Q.alpha})`, S.lineWidth = 1.5, S.shadowBlur = 12, S.shadowColor = `rgb(${_})`, S.stroke(), S.shadowBlur = 0;
        }
      }
      for (const U of K) {
        const Q = Math.sin(U.angle);
        if (Q <= 0) continue;
        const ot = b(U.normY, V), J = q + U.normY * (X - q), et = E + Y * U.normY + Math.cos(U.angle) * ot, tt = U.alpha * (0.5 + 0.5 * Q);
        S.beginPath(), S.arc(et, J, U.size * (0.5 + 0.5 * (1 - U.normY)), 0, Math.PI * 2), S.fillStyle = `rgba(${j},${tt})`, S.fill();
      }
      if (L)
        for (const U of f.current) {
          U.angle += U.speed * T;
          const Q = E + Y * 0.3 + Math.cos(U.angle) * U.radius, ot = X + Math.sin(U.angle * 0.5) * 6;
          S.beginPath(), S.arc(Q, ot, U.size, 0, Math.PI * 2), S.fillStyle = `rgba(${H},${U.alpha})`, S.fill();
        }
      if (Math.random() < 0.05 * T) {
        const U = b(Math.random() * 0.3, V), Q = Math.random() * Math.PI * 2, ot = X - Math.random() * (X - q) * 0.3;
        c.current.push({
          x: E + Math.cos(Q) * U,
          y: ot,
          vx: (Math.random() - 0.5) * 4 * T,
          vy: -(1 + Math.random() * 2) * T,
          size: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.4,
          life: 40 + Math.random() * 40
        });
      }
      for (let U = c.current.length - 1; U >= 0; U--) {
        const Q = c.current[U];
        if (Q.x += Q.vx, Q.y += Q.vy, Q.vy += 0.05, Q.alpha -= 8e-3, Q.life -= 1, Q.alpha <= 0 || Q.life <= 0) {
          c.current.splice(U, 1);
          continue;
        }
        S.beginPath(), S.arc(Q.x, Q.y, Q.size, 0, Math.PI * 2), S.fillStyle = `rgba(${H},${Q.alpha})`, S.fill();
      }
    }
    let M = 0;
    function P(w) {
      const C = M ? w - M : 16;
      M = w, F(C), y.current = requestAnimationFrame(P);
    }
    return y.current = requestAnimationFrame(P), () => {
      B.disconnect(), cancelAnimationFrame(y.current), s.removeEventListener("mousemove", l);
    };
  }, [a]);
}
const Hr = {
  default: {},
  storm: {
    funnelColor: "#c8d8e8",
    debrisColor: "#8898a8",
    lightningColor: "#ffffff",
    backgroundColor: "#0a1018",
    funnelHeight: 0.85
  },
  fire: {
    funnelColor: "#ff6600",
    debrisColor: "#cc3300",
    lightningColor: "#ffaa00",
    backgroundColor: "#0d0200",
    rotationSpeed: 4
  },
  neon: {
    funnelColor: "#00ffcc",
    debrisColor: "#ff00aa",
    lightningColor: "#ffffff",
    backgroundColor: "#000810",
    rotationSpeed: 5
  },
  void: {
    funnelColor: "#8866ff",
    debrisColor: "#4433aa",
    lightningColor: "#cc88ff",
    backgroundColor: "#020008",
    rotationSpeed: 2
  }
}, jr = ht(
  (a, g) => {
    const {
      preset: n,
      particleCount: i,
      funnelColor: c,
      debrisColor: o,
      lightningColor: f,
      backgroundColor: y,
      rotationSpeed: h,
      funnelHeight: t,
      vortexStrength: p,
      showLightning: e,
      showGroundDust: s,
      interactive: v,
      speed: S,
      width: z,
      height: D,
      className: I,
      style: W
    } = a, B = n && Hr[n] || {}, $ = G(null);
    return gt(g, () => $.current), Or($, {
      particleCount: i ?? 600,
      funnelColor: c ?? B.funnelColor ?? "#ffffff",
      debrisColor: o ?? B.debrisColor ?? "#6b7280",
      lightningColor: f ?? B.lightningColor ?? "#ffffff",
      backgroundColor: y ?? B.backgroundColor ?? "#111111",
      rotationSpeed: h ?? B.rotationSpeed ?? 3,
      funnelHeight: t ?? B.funnelHeight ?? 0.8,
      vortexStrength: p ?? 1,
      showLightning: e ?? !0,
      showGroundDust: s ?? !0,
      interactive: v ?? !0,
      speed: S ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: z ?? "100%",
          height: D ?? "100%",
          display: "block",
          overflow: "hidden",
          ...W
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: $,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
jr.displayName = "TornadoVortex";
function Nr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G(0), o = G(0), f = G(null);
  ft(() => {
    const y = a.current;
    if (!y) return;
    const h = y.parentElement;
    if (!h) return;
    const t = y.getContext("2d");
    let p = 0, e = 0;
    function s(M, P) {
      const { minRadius: w, maxRadius: C } = n.current, x = w + Math.random() * (C - w);
      return {
        x: M ?? x + Math.random() * (p - x * 2),
        y: P ?? x + Math.random() * (e - x * 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(0.2 + Math.random() * 0.6),
        r: x,
        hue: Math.random() * 360,
        shimmerOffset: Math.random() * Math.PI * 2,
        popping: !1,
        popProgress: 0,
        popParticles: []
      };
    }
    function v() {
      const { bubbleCount: M } = n.current;
      i.current = Array.from({ length: M }, () => s());
    }
    function S(M, P) {
      const w = window.devicePixelRatio || 1;
      y.width = Math.round(M * w), y.height = Math.round(P * w), y.style.width = `${M}px`, y.style.height = `${P}px`, t.scale(w, w), p = M, e = P, v();
    }
    const z = new ResizeObserver((M) => {
      const { width: P, height: w } = M[0].contentRect;
      P > 0 && w > 0 && S(P, w);
    });
    z.observe(h);
    const D = h.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(M) {
      if (!n.current.interactive) return;
      const P = y.getBoundingClientRect();
      f.current = { x: M.clientX - P.left, y: M.clientY - P.top };
    }
    function W() {
      f.current = null;
    }
    function B(M) {
      if (!n.current.popEffect) return;
      const P = y.getBoundingClientRect(), w = M.clientX - P.left, C = M.clientY - P.top;
      for (const x of i.current) {
        if (x.popping) continue;
        const d = w - x.x, m = C - x.y;
        if (d * d + m * m < x.r * x.r) {
          $(x);
          break;
        }
      }
    }
    y.addEventListener("mousemove", I), y.addEventListener("mouseleave", W), y.addEventListener("click", B);
    function $(M) {
      M.popping = !0, M.popProgress = 0;
      const P = 8 + Math.floor(M.r / 8);
      for (let w = 0; w < P; w++) {
        const C = w / P * Math.PI * 2, x = 1 + Math.random() * 3;
        M.popParticles.push({
          x: M.x + Math.cos(C) * M.r,
          y: M.y + Math.sin(C) * M.r,
          vx: Math.cos(C) * x,
          vy: Math.sin(C) * x,
          alpha: 0.8
        });
      }
    }
    function l(M, P, w, C) {
      const x = Math.sin(P * 2 + M.shimmerOffset), d = vt(w), m = (M.hue + x * 30) % 360, u = (M.hue + 120 + x * 20) % 360, R = (M.hue + 240) % 360, k = t.createRadialGradient(
        M.x - M.r * 0.25,
        M.y - M.r * 0.25,
        M.r * 0.05,
        M.x,
        M.y,
        M.r
      );
      k.addColorStop(0, `hsla(${m},70%,90%,0.15)`), k.addColorStop(0.4, `hsla(${u},80%,60%,0.08)`), k.addColorStop(0.7, `hsla(${R},90%,50%,0.12)`), k.addColorStop(1, `hsla(${m},60%,30%,0.25)`), C && (t.shadowBlur = M.r * 0.4, t.shadowColor = `hsla(${m},100%,70%,0.3)`), t.beginPath(), t.arc(M.x, M.y, M.r, 0, Math.PI * 2), t.fillStyle = k, t.fill(), t.beginPath(), t.arc(M.x, M.y, M.r, 0, Math.PI * 2), t.strokeStyle = `hsla(${u},80%,75%,0.4)`, t.lineWidth = 1.5, t.stroke(), C && (t.shadowBlur = 0);
      const L = M.x - M.r * 0.32, T = M.y - M.r * 0.32, A = t.createRadialGradient(L, T, 0, L, T, M.r * 0.4);
      A.addColorStop(0, `rgba(${d},0.7)`), A.addColorStop(1, `rgba(${d},0)`), t.beginPath(), t.ellipse(L, T, M.r * 0.22, M.r * 0.14, -0.5, 0, Math.PI * 2), t.fillStyle = A, t.fill(), t.beginPath(), t.ellipse(M.x + M.r * 0.25, M.y + M.r * 0.28, M.r * 0.06, M.r * 0.04, 0.8, 0, Math.PI * 2), t.fillStyle = `rgba(${d},0.3)`, t.fill();
    }
    function r(M) {
      const {
        bubbleCount: P,
        backgroundColor: w,
        shimmerColor: C,
        gravity: x,
        friction: d,
        interactive: m,
        mergeOnCollide: u,
        glowEffect: R,
        popEffect: k
      } = n.current;
      o.current += M * 1e-3;
      const L = o.current;
      t.fillStyle = w, t.fillRect(0, 0, p, e);
      const T = i.current, A = f.current;
      for (; T.filter((E) => !E.popping).length < P; )
        T.push(s(
          Math.random() < 0.5 ? -20 : p + 20,
          e * 0.7 + Math.random() * e * 0.3
        ));
      for (let E = 0; E < T.length; E++) {
        const Y = T[E];
        if (Y.popping) {
          Y.popProgress += 0.08;
          for (const q of Y.popParticles)
            q.x += q.vx, q.y += q.vy, q.alpha -= 0.05;
          Y.popParticles = Y.popParticles.filter((q) => q.alpha > 0);
          continue;
        }
        if (Y.vy += x, Y.vx *= d, Y.vy *= d, Y.x += Y.vx, Y.y += Y.vy, Y.hue = (Y.hue + 0.3) % 360, m && A) {
          const q = Y.x - A.x, X = Y.y - A.y, V = Math.sqrt(q * q + X * X) || 1e-3;
          if (V < Y.r + 60) {
            const j = (Y.r + 60 - V) * 0.015;
            Y.vx += q / V * j, Y.vy += X / V * j;
          }
        }
        Y.x - Y.r < 0 && (Y.x = Y.r, Y.vx = Math.abs(Y.vx) * 0.6), Y.x + Y.r > p && (Y.x = p - Y.r, Y.vx = -Math.abs(Y.vx) * 0.6), Y.y - Y.r < 0 && (Y.y = Y.r, Y.vy = Math.abs(Y.vy) * 0.6), Y.y + Y.r > e && (Y.y = e - Y.r, Y.vy = -Math.abs(Y.vy) * 0.8);
        for (let q = E + 1; q < T.length; q++) {
          const X = T[q];
          if (X.popping) continue;
          const V = X.x - Y.x, j = X.y - Y.y, H = Math.sqrt(V * V + j * j) || 1e-3, _ = Y.r + X.r;
          if (H < _)
            if (u && H < _ * 0.6) {
              const O = Math.min(
                n.current.maxRadius,
                Math.sqrt(Y.r * Y.r + X.r * X.r)
              );
              Y.r = O, Y.x = (Y.x + X.x) / 2, Y.y = (Y.y + X.y) / 2, Y.vx = (Y.vx + X.vx) * 0.5, Y.vy = (Y.vy + X.vy) * 0.5, X.popping = !0, X.popProgress = 1;
            } else {
              const O = V / H, N = j / H, K = _ - H;
              Y.x -= O * K * 0.5, Y.y -= N * K * 0.5, X.x += O * K * 0.5, X.y += N * K * 0.5;
              const U = Y.vx - X.vx, Q = Y.vy - X.vy, ot = U * O + Q * N;
              ot > 0 && (Y.vx -= ot * O * 0.7, Y.vy -= ot * N * 0.7, X.vx += ot * O * 0.7, X.vy += ot * N * 0.7);
            }
        }
      }
      for (const E of T)
        if (!(E.popping && E.popProgress >= 1))
          if (!E.popping)
            l(E, L, C, R);
          else {
            const Y = E.r * (1 + E.popProgress * 1.5);
            t.beginPath(), t.arc(E.x, E.y, Y, 0, Math.PI * 2), t.strokeStyle = `hsla(${E.hue},80%,70%,${0.6 * (1 - E.popProgress)})`, t.lineWidth = 2, t.stroke();
            for (const q of E.popParticles)
              t.beginPath(), t.arc(q.x, q.y, 2, 0, Math.PI * 2), t.fillStyle = `hsla(${E.hue},80%,75%,${q.alpha})`, t.fill();
          }
      i.current = T.filter((E) => !E.popping || E.popProgress < 1.5);
    }
    let b = 0;
    function F(M) {
      const P = b ? M - b : 16;
      b = M, r(P), c.current = requestAnimationFrame(F);
    }
    return c.current = requestAnimationFrame(F), () => {
      z.disconnect(), cancelAnimationFrame(c.current), y.removeEventListener("mousemove", I), y.removeEventListener("mouseleave", W), y.removeEventListener("click", B);
    };
  }, [a]);
}
const Ur = {
  default: {},
  soap: {
    backgroundColor: "#050a12",
    shimmerColor: "#ffffff",
    gravity: 0.01,
    minRadius: 25,
    maxRadius: 90
  },
  neon: {
    backgroundColor: "#000008",
    shimmerColor: "#00ffff",
    gravity: 0.015,
    bubbleCount: 12
  },
  deep: {
    backgroundColor: "#010510",
    shimmerColor: "#88aaff",
    gravity: 8e-3,
    minRadius: 15,
    maxRadius: 60,
    bubbleCount: 20
  },
  minimal: {
    backgroundColor: "#111111",
    shimmerColor: "#ffffff",
    gravity: 0.025,
    bubbleCount: 8,
    minRadius: 30,
    maxRadius: 100
  }
}, Vr = ht(
  (a, g) => {
    const {
      preset: n,
      bubbleCount: i,
      minRadius: c,
      maxRadius: o,
      backgroundColor: f,
      shimmerColor: y,
      popEffect: h,
      gravity: t,
      friction: p,
      interactive: e,
      mergeOnCollide: s,
      glowEffect: v,
      width: S,
      height: z,
      className: D,
      style: I
    } = a, W = n && Ur[n] || {}, B = G(null);
    return gt(g, () => B.current), Nr(B, {
      bubbleCount: i ?? W.bubbleCount ?? 15,
      minRadius: c ?? W.minRadius ?? 20,
      maxRadius: o ?? W.maxRadius ?? 50,
      backgroundColor: f ?? W.backgroundColor ?? "#111111",
      shimmerColor: y ?? W.shimmerColor ?? "#ffffff",
      popEffect: h ?? !0,
      gravity: t ?? W.gravity ?? 0.02,
      friction: p ?? 0.995,
      interactive: e ?? !0,
      mergeOnCollide: s ?? !0,
      glowEffect: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: D,
        style: {
          width: S ?? "100%",
          height: z ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "pointer",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: B,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Vr.displayName = "BubbleUniverse";
function jt(a) {
  const g = a.replace("#", ""), n = parseInt(g, 16);
  return [n >> 16 & 255, n >> 8 & 255, n & 255];
}
function Zt([a, g, n], [i, c, o], f) {
  return `rgb(${Math.round(a + (i - a) * f)},${Math.round(g + (c - g) * f)},${Math.round(n + (o - n) * f)})`;
}
function _r(a, g, n, i, c, o, f) {
  const y = 1 - f;
  return [
    y * y * a + 2 * y * f * n + f * f * c,
    y * y * g + 2 * y * f * i + f * f * o
  ];
}
function Jr(a, g) {
  const n = Math.floor(a), i = Math.floor(g), c = a - n, o = g - i, f = (v) => {
    let S = Math.sin(v * 127.1 + 311.7) * 43758.5453;
    return S - Math.floor(S);
  }, y = f(n + i * 57), h = f(n + 1 + i * 57), t = f(n + (i + 1) * 57), p = f(n + 1 + (i + 1) * 57), e = c * c * (3 - 2 * c), s = o * o * (3 - 2 * o);
  return y + (h - y) * e + (t - y) * s + (y - h - t + p) * e * s;
}
function Kr(a, g) {
  const n = G(g);
  n.current = g;
  const i = G([]), c = G([]), o = G([]), f = G(0), y = G(0), h = G(0), t = G(null), p = G(null);
  ft(() => {
    const e = a.current;
    if (!e) return;
    const s = e.parentElement;
    if (!s) return;
    const v = e.getContext("2d");
    let S = 0, z = 0;
    function D() {
      return Math.min(S, z) * 0.5 * n.current.sunRadius;
    }
    function I() {
      return S / 2;
    }
    function W() {
      return z / 2;
    }
    function B() {
      const { convectionCells: u } = n.current, R = D();
      c.current = Array.from({ length: u }, () => {
        const k = Math.random() * Math.PI * 2, L = Math.random() * R * 0.85;
        return {
          x: I() + Math.cos(k) * L,
          y: W() + Math.sin(k) * L,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          temp: Math.random(),
          phase: Math.random() * Math.PI * 2
        };
      });
    }
    function $() {
      o.current = Array.from({ length: 7 }, (u, R) => ({
        baseRadius: 1.1 + R * 0.15,
        phase: R / 7 * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        alpha: 0.25 - R * 0.025,
        width: 15 + R * 5
      }));
    }
    function l(u, R = !1) {
      const { flareColor: k } = n.current, L = D(), T = u + (Math.random() - 0.5) * 1.2, A = R ? L * (3 + Math.random() * 2) : L * (1.2 + Math.random() * 2), E = I() + Math.cos(T) * (L + A), Y = W() + Math.sin(T) * (L + A), q = R || Math.random() < 0.15, X = q ? u + (Math.random() - 0.5) * 0.8 : u + (Math.random() - 0.5) * 2.5, V = q ? L * (2.5 + Math.random() * 2.5) : L * (0.8 + Math.random() * 0.4), j = I() + Math.cos(X) * V, H = W() + Math.sin(X) * V, _ = 60 + Math.floor(L * 0.8), O = Array.from({ length: _ }, (N, K) => ({
        t: K / _ * 0.2,
        speed: 3e-3 + Math.random() * 5e-3,
        alpha: 0.7 + Math.random() * 0.3,
        size: 2.5 + Math.random() * 6,
        hue: 0
      }));
      i.current.push({
        angle: u,
        cpX: E,
        cpY: Y,
        endX: j,
        endY: H,
        particles: O,
        age: 0,
        duration: q ? 280 : 240 + Math.random() * 80,
        escaped: q,
        color: k
      });
    }
    function r(u, R) {
      const k = window.devicePixelRatio || 1;
      e.width = Math.round(u * k), e.height = Math.round(R * k), e.style.width = `${u}px`, e.style.height = `${R}px`, v.scale(k, k), S = u, z = R, B(), $();
    }
    const b = new ResizeObserver((u) => {
      const { width: R, height: k } = u[0].contentRect;
      R > 0 && k > 0 && r(R, k);
    });
    b.observe(s);
    const F = s.getBoundingClientRect();
    F.width > 0 && F.height > 0 && r(F.width, F.height);
    function M(u) {
      if (!n.current.interactive) return;
      const R = e.getBoundingClientRect(), k = u.clientX - R.left, L = u.clientY - R.top, T = Math.atan2(L - W(), k - I());
      t.current = T;
    }
    function P(u) {
      const R = e.getBoundingClientRect();
      p.current = { x: u.clientX - R.left, y: u.clientY - R.top };
    }
    e.addEventListener("click", M), e.addEventListener("mousemove", P);
    function w(u) {
      const { sunColor: R, glowEffect: k, glowBlur: L, coronaColor: T } = n.current, A = D(), E = I(), Y = W(), q = jt(R), X = jt(n.current.backgroundColor), V = jt(T);
      for (const O of o.current) {
        const N = A * (O.baseRadius + Math.sin(u * O.speed + O.phase) * 0.05), K = v.createRadialGradient(E, Y, N * 0.85, E, Y, N + O.width);
        K.addColorStop(0, `rgba(${V[0]},${V[1]},${V[2]},${O.alpha})`), K.addColorStop(1, `rgba(${V[0]},${V[1]},${V[2]},0)`), v.beginPath(), v.arc(E, Y, N + O.width, 0, Math.PI * 2), v.fillStyle = K, v.fill();
      }
      k && (v.shadowBlur = L, v.shadowColor = `rgba(${q[0]},${q[1]},${q[2]},0.6)`);
      const j = v.createRadialGradient(E - A * 0.2, Y - A * 0.2, A * 0.05, E, Y, A);
      j.addColorStop(0, `rgba(${q[0]},${q[1]},${q[2]},1)`), j.addColorStop(0.5, Zt(q, X, 0.1)), j.addColorStop(0.85, Zt(q, X, 0.35)), j.addColorStop(1, Zt(q, X, 0.6)), v.beginPath(), v.arc(E, Y, A, 0, Math.PI * 2), v.fillStyle = j, v.fill(), k && (v.shadowBlur = 0);
      const H = c.current, { speed: _ } = n.current;
      for (const O of H) {
        O.x += O.vx * _, O.y += O.vy * _, O.phase += 0.02 * _;
        const N = O.x - E, K = O.y - Y, U = Math.sqrt(N * N + K * K);
        U > A * 0.88 && (O.vx -= N / U * 0.05, O.vy -= K / U * 0.05);
        const Q = Jr(O.x * 0.02 + u * 0.1, O.y * 0.02), ot = (O.temp * 0.7 + Q * 0.3 + Math.sin(O.phase) * 0.15 + 0.5) % 1, J = 0.06 + ot * 0.08, et = A * 0.08 + ot * A * 0.06;
        v.beginPath(), v.arc(O.x, O.y, et, 0, Math.PI * 2);
        const tt = Math.round(q[0] * (0.6 + ot * 0.4)), nt = Math.round(q[1] * (0.6 + ot * 0.4)), rt = Math.round(q[2] * (0.6 + ot * 0.4));
        v.fillStyle = `rgba(${tt},${nt},${rt},${J})`, v.fill();
      }
    }
    function C() {
      const { flareColor: u, speed: R } = n.current, k = jt(u), L = jt(n.current.backgroundColor), T = D(), A = I(), E = W();
      for (let Y = i.current.length - 1; Y >= 0; Y--) {
        const q = i.current[Y];
        q.age += R;
        const X = q.age / q.duration, V = A + Math.cos(q.angle) * T, j = E + Math.sin(q.angle) * T;
        for (const H of q.particles) {
          H.t = Math.min(1, H.t + H.speed * R);
          const [_, O] = _r(V, j, q.cpX, q.cpY, q.endX, q.endY, H.t), N = Math.min(H.t * 4, (1 - X) * 3, 1), K = H.alpha * N;
          if (K <= 0) continue;
          const U = 1 - H.t * 0.5, Q = Zt(k, L, 1 - U);
          v.beginPath(), v.arc(_, O, H.size * (0.7 + 0.3 * (1 - H.t)), 0, Math.PI * 2), v.fillStyle = Q.replace("rgb", "rgba").replace(")", `,${K})`), v.fill();
        }
        q.age >= q.duration && i.current.splice(Y, 1);
      }
    }
    function x(u) {
      const { backgroundColor: R, autoFlare: k, autoFlareInterval: L, flareCount: T, speed: A } = n.current;
      y.current += u * 1e-3 * A;
      const E = y.current;
      v.fillStyle = R, v.fillRect(0, 0, S, z), w(E), C();
      const Y = performance.now();
      if (k && i.current.length < T && Y - h.current > L / A) {
        const q = Math.random() * Math.PI * 2, X = Math.random() < 0.1;
        l(q, X), h.current = Y;
      }
      t.current !== null && (l(t.current), t.current = null);
    }
    let d = 0;
    function m(u) {
      const R = d ? u - d : 16;
      d = u, x(R), f.current = requestAnimationFrame(m);
    }
    return f.current = requestAnimationFrame(m), () => {
      b.disconnect(), cancelAnimationFrame(f.current), e.removeEventListener("click", M), e.removeEventListener("mousemove", P);
    };
  }, [a]);
}
const Qr = {
  default: {},
  inferno: {
    sunColor: "#ff6600",
    coronaColor: "#ff3300",
    flareColor: "#ffaa00",
    backgroundColor: "#0a0200",
    glowBlur: 60
  },
  plasma: {
    sunColor: "#cc44ff",
    coronaColor: "#8800cc",
    flareColor: "#ff88ff",
    backgroundColor: "#050008",
    glowBlur: 50
  },
  neon: {
    sunColor: "#00ffcc",
    coronaColor: "#00aaff",
    flareColor: "#ffffff",
    backgroundColor: "#000810",
    glowBlur: 45
  },
  "white-dwarf": {
    sunColor: "#eef4ff",
    coronaColor: "#aac4ff",
    flareColor: "#ffffff",
    backgroundColor: "#000008",
    sunRadius: 0.15,
    glowBlur: 80
  }
}, Zr = ht(
  (a, g) => {
    const {
      preset: n,
      sunColor: i,
      coronaColor: c,
      flareColor: o,
      backgroundColor: f,
      sunRadius: y,
      convectionCells: h,
      flareCount: t,
      autoFlare: p,
      autoFlareInterval: e,
      interactive: s,
      glowEffect: v,
      glowBlur: S,
      speed: z,
      width: D,
      height: I,
      className: W,
      style: B
    } = a, $ = n && Qr[n] || {}, l = G(null);
    return gt(g, () => l.current), Kr(l, {
      sunColor: i ?? $.sunColor ?? "#ffffff",
      coronaColor: c ?? $.coronaColor ?? "#6b7280",
      flareColor: o ?? $.flareColor ?? "#ffffff",
      backgroundColor: f ?? $.backgroundColor ?? "#111111",
      sunRadius: y ?? $.sunRadius ?? 0.35,
      convectionCells: h ?? 20,
      flareCount: t ?? 3,
      autoFlare: p ?? !0,
      autoFlareInterval: e ?? 3e3,
      interactive: s ?? !0,
      glowEffect: v ?? !0,
      glowBlur: S ?? $.glowBlur ?? 40,
      speed: z ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: D ?? "100%",
          height: I ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...B
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: l,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Zr.displayName = "SolarFlare";
const Ee = 0.06, Ae = 0.78;
function ta(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement, o = i.getContext("2d");
    let f = 0, y = 0, h = 0;
    const t = [], p = [], e = { x: 0, y: 0, targetX: 0, targetY: 0, legPhase: 0 }, s = { x: -9999, y: -9999 };
    function v() {
      const { spokeCount: l, ringCount: r } = n.current, b = f / 2, F = y / 2, M = Math.min(f, y) * 0.44;
      t.length = 0;
      for (let P = 0; P < l; P++) {
        const w = P / l * Math.PI * 2 - Math.PI / 2;
        t[P] = [];
        for (let C = 0; C < r; C++) {
          const x = (C + 1) / r * M, d = b + Math.cos(w) * x, m = F + Math.sin(w) * x;
          t[P][C] = {
            baseX: d,
            baseY: m,
            x: d,
            y: m,
            vx: 0,
            vy: 0,
            phase: (P * 7.3 + C * 13.1) % (Math.PI * 2)
          };
        }
      }
      p.length = 0;
      for (let P = 0; P < 32; P++) {
        const w = Math.floor(Math.random() * l), C = Math.floor(Math.random() * r);
        p.push({
          spokeIdx: w,
          ringIdxA: C - 1,
          ringIdxB: C,
          t: 0.15 + Math.random() * 0.7,
          size: 2 + Math.random() * 2.5,
          glowPhase: Math.random() * Math.PI * 2
        });
      }
      e.x = b, e.y = F, e.targetX = b, e.targetY = F;
    }
    function S(l, r) {
      const b = window.devicePixelRatio || 1;
      i.width = Math.round(l * b), i.height = Math.round(r * b), i.style.width = `${l}px`, i.style.height = `${r}px`, o.scale(b, b), f = l, y = r, v();
    }
    const z = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && S(r, b);
    });
    z.observe(c);
    const D = c.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(l) {
      const r = i.getBoundingClientRect();
      s.x = l.clientX - r.left, s.y = l.clientY - r.top;
    }
    function W() {
      s.x = -9999, s.y = -9999;
    }
    i.addEventListener("mousemove", I), i.addEventListener("mouseleave", W);
    let B = 0;
    function $() {
      h += 0.016;
      const l = n.current, { spokeCount: r, ringCount: b } = l, F = f / 2, M = y / 2, P = Math.min(f, y) * 0.44;
      o.fillStyle = l.backgroundColor, o.fillRect(0, 0, f, y);
      const w = o.createRadialGradient(F, M, 0, F, M, P * 1.1);
      w.addColorStop(0, pt(l.webColor, 0.04)), w.addColorStop(1, pt(l.webColor, 0)), o.fillStyle = w, o.fillRect(0, 0, f, y), (t.length !== r || t[0] && t[0].length !== b) && v();
      for (let d = 0; d < r; d++)
        for (let m = 0; m < b; m++) {
          const u = t[d][m], R = Math.sin(h * l.swaySpeed * 0.8 + u.phase) * 1.2;
          let k = u.baseX - u.x + R, L = u.baseY - u.y + R * 0.6;
          if (l.interactive && s.x > -100) {
            const T = s.x - u.x, A = s.y - u.y, E = Math.sqrt(T * T + A * A);
            if (E < l.disturbRadius && E > 0) {
              const Y = (1 - E / l.disturbRadius) * 4;
              k += T / E * Y, L += A / E * Y;
            }
          }
          u.vx = (u.vx + k * Ee) * Ae, u.vy = (u.vy + L * Ee) * Ae, u.x += u.vx, u.y += u.vy;
        }
      for (let d = 0; d < b; d++) {
        const m = 0.03 * (1 - d / b);
        if (!(m < 5e-3)) {
          o.beginPath(), o.moveTo(t[0][d].x, t[0][d].y);
          for (let u = 1; u < r; u++) o.lineTo(t[u][d].x, t[u][d].y);
          o.closePath(), o.fillStyle = pt(l.webColor, m), o.fill();
        }
      }
      o.lineCap = "round";
      for (let d = 0; d < r; d++)
        for (let m = 0; m < b; m++) {
          const u = 0.75 - m / b * 0.45, R = m === 0 ? F : t[d][m - 1].x, k = m === 0 ? M : t[d][m - 1].y;
          o.beginPath(), o.moveTo(R, k), o.lineTo(t[d][m].x, t[d][m].y), o.strokeStyle = pt(l.webColor, u), o.lineWidth = 0.8, o.stroke();
        }
      for (let d = 0; d < b; d++) {
        const m = 0.7 - d / b * 0.4;
        o.beginPath(), o.moveTo(t[0][d].x, t[0][d].y);
        for (let u = 1; u < r; u++) o.lineTo(t[u][d].x, t[u][d].y);
        o.closePath(), o.strokeStyle = pt(l.webColor, m), o.lineWidth = d < 2 ? 1.1 : 0.7, o.stroke();
      }
      const C = Math.sin(h * 1.5) * 0.15 + 0.55, x = o.createRadialGradient(F, M, 0, F, M, P * 0.08);
      if (x.addColorStop(0, pt(l.glowColor, C)), x.addColorStop(1, pt(l.glowColor, 0)), o.beginPath(), o.arc(F, M, P * 0.08, 0, Math.PI * 2), o.fillStyle = x, o.fill(), l.dewDrops)
        for (const d of p) {
          const m = d.spokeIdx;
          if (m >= r || d.ringIdxB >= b) continue;
          const u = d.ringIdxA < 0 ? F : t[m][d.ringIdxA].x, R = d.ringIdxA < 0 ? M : t[m][d.ringIdxA].y, k = t[m][d.ringIdxB].x, L = t[m][d.ringIdxB].y, T = u + (k - u) * d.t, A = R + (L - R) * d.t, E = Math.sin(h * 1.8 + d.glowPhase) * 0.35 + 0.65, Y = d.size * 5 * E, q = o.createRadialGradient(T, A, 0, T, A, Y);
          q.addColorStop(0, pt(l.glowColor, 0.25 * E)), q.addColorStop(1, pt(l.glowColor, 0)), o.beginPath(), o.arc(T, A, Y, 0, Math.PI * 2), o.fillStyle = q, o.fill();
          const X = d.size * 2.8 * E, V = o.createRadialGradient(T, A, 0, T, A, X);
          V.addColorStop(0, pt(l.glowColor, 0.6 * E)), V.addColorStop(1, pt(l.glowColor, 0)), o.beginPath(), o.arc(T, A, X, 0, Math.PI * 2), o.fillStyle = V, o.fill(), o.beginPath(), o.arc(T, A, d.size * 0.8, 0, Math.PI * 2), o.fillStyle = pt(l.glowColor, 0.95), o.fill();
        }
      if (l.showSpider) {
        s.x > -100 && (e.targetX += (s.x - e.targetX) * 0.08, e.targetY += (s.y - e.targetY) * 0.08), e.x += (e.targetX - e.x) * 0.04, e.y += (e.targetY - e.y) * 0.04, e.legPhase += 0.1;
        const d = e.x, m = e.y;
        o.fillStyle = l.spiderColor, o.strokeStyle = l.spiderColor, o.lineWidth = 1.2;
        for (let u = 0; u < 4; u++) {
          const R = u / 4 * Math.PI * 0.85 + 0.05, k = Math.sin(e.legPhase + u * 1.6) * 0.18;
          for (const L of [-1, 1]) {
            const T = R * L + k * L, A = { x: d + Math.cos(T) * 10, y: m + Math.sin(T) * 7 + 1 }, E = { x: d + Math.cos(T + 0.3 * L) * 18, y: m + Math.sin(T + 0.3 * L) * 14 + 3 };
            o.beginPath(), o.moveTo(d, m), o.lineTo(A.x, A.y), o.lineTo(E.x, E.y), o.stroke();
          }
        }
        o.beginPath(), o.ellipse(d, m + 5, 5, 7, 0, 0, Math.PI * 2), o.fill(), o.beginPath(), o.ellipse(d, m - 4, 3.5, 4, 0, 0, Math.PI * 2), o.fill(), o.fillStyle = pt(l.glowColor, 0.8), o.beginPath(), o.arc(d - 1.5, m - 6, 1, 0, Math.PI * 2), o.fill(), o.beginPath(), o.arc(d + 1.5, m - 6, 1, 0, Math.PI * 2), o.fill();
      }
      B = requestAnimationFrame($);
    }
    return B = requestAnimationFrame($), () => {
      cancelAnimationFrame(B), z.disconnect(), i.removeEventListener("mousemove", I), i.removeEventListener("mouseleave", W);
    };
  }, [a]);
}
const ea = {
  default: { webColor: "#d8d8d8", backgroundColor: "#0a0a0a", spiderColor: "#c0c0c0", glowColor: "#e0e0e0" },
  night: { webColor: "#c0c8e0", backgroundColor: "#04081a", spiderColor: "#404060", glowColor: "#8899cc" },
  forest: { webColor: "#90b890", backgroundColor: "#050f05", spiderColor: "#2a4a2a", glowColor: "#66aa66" },
  neon: { webColor: "#00ffcc", backgroundColor: "#000000", spiderColor: "#003322", glowColor: "#00ffff" },
  frost: { webColor: "#e0f0ff", backgroundColor: "#040810", spiderColor: "#203040", glowColor: "#aaddff" }
}, oa = ht(
  (a, g) => {
    const {
      preset: n,
      spokeCount: i,
      ringCount: c,
      webColor: o,
      backgroundColor: f,
      spiderColor: y,
      dewDrops: h,
      glowColor: t,
      swaySpeed: p,
      disturbRadius: e,
      interactive: s,
      showSpider: v,
      width: S,
      height: z,
      className: D,
      style: I
    } = a, W = n && ea[n] || {}, B = G(null);
    return gt(g, () => B.current), ta(B, {
      spokeCount: i ?? 12,
      ringCount: c ?? 10,
      webColor: o ?? W.webColor ?? "#d8d8d8",
      backgroundColor: f ?? W.backgroundColor ?? "#0a0a0a",
      spiderColor: y ?? W.spiderColor ?? "#c0c0c0",
      dewDrops: h ?? !0,
      glowColor: t ?? W.glowColor ?? "#e0e0e0",
      swaySpeed: p ?? 1,
      disturbRadius: e ?? 80,
      interactive: s ?? !0,
      showSpider: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: D,
        style: { width: S ?? "100%", height: z ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...I },
        children: /* @__PURE__ */ it("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
oa.displayName = "SpiderWeb";
function Be(a, g, n, i, c, o) {
  a.save(), a.scale(i * n, 1), a.beginPath(), a.moveTo(0, 0), a.bezierCurveTo(g * 0.9, -g * 0.6, g * 1.3, g * 0.2, 0, g * 0.45), a.fillStyle = c, a.fill(), a.beginPath(), a.moveTo(0, g * 0.2), a.bezierCurveTo(g * 0.6, g * 0.5, g * 0.7, g * 1.1, 0, g * 0.85), a.fill(), a.fillStyle = o, a.beginPath(), a.arc(g * 0.5, -g * 0.1, g * 0.1, 0, Math.PI * 2), a.fill(), a.beginPath(), a.arc(g * 0.8, g * 0.3, g * 0.08, 0, Math.PI * 2), a.fill(), a.restore();
}
function na(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement, o = i.getContext("2d");
    let f = 0, y = 0;
    const h = [], t = { x: -9999, y: -9999, prevX: -9999, prevY: -9999 };
    function p() {
      return {
        x: Math.random() * f,
        y: Math.random() * y,
        vx: (Math.random() - 0.5) * n.current.speed,
        vy: (Math.random() - 0.5) * n.current.speed,
        angle: Math.random() * Math.PI * 2,
        flapPhase: Math.random() * Math.PI * 2,
        hueShift: (Math.random() - 0.5) * 40,
        size: 10 + Math.random() * 10,
        wanderAngle: Math.random() * Math.PI * 2,
        fleeing: !1
      };
    }
    function e() {
      h.length = 0;
      for (let B = 0; B < n.current.butterflyCount; B++) h.push(p());
    }
    function s(B, $) {
      const l = window.devicePixelRatio || 1;
      i.width = Math.round(B * l), i.height = Math.round($ * l), i.style.width = `${B}px`, i.style.height = `${$}px`, o.scale(l, l), f = B, y = $, e();
    }
    const v = new ResizeObserver((B) => {
      const { width: $, height: l } = B[0].contentRect;
      $ > 0 && l > 0 && s($, l);
    });
    v.observe(c);
    const S = c.getBoundingClientRect();
    S.width > 0 && S.height > 0 && s(S.width, S.height);
    function z(B) {
      const $ = i.getBoundingClientRect();
      t.prevX = t.x, t.prevY = t.y, t.x = B.clientX - $.left, t.y = B.clientY - $.top;
    }
    function D() {
      t.x = -9999, t.y = -9999;
    }
    i.addEventListener("mousemove", z), i.addEventListener("mouseleave", D);
    let I = 0;
    function W() {
      const B = n.current;
      B.showTrails ? o.fillStyle = pt(B.backgroundColor, 0.18) : o.fillStyle = B.backgroundColor, o.fillRect(0, 0, f, y);
      const l = (t.x > -100 ? Math.hypot(t.x - t.prevX, t.y - t.prevY) : 0) > 12;
      for (; h.length < B.butterflyCount; ) h.push(p());
      h.length = B.butterflyCount;
      for (const r of h) {
        r.wanderAngle += (Math.random() - 0.5) * 0.3;
        const b = Math.cos(r.wanderAngle) * 0.15 * B.speed, F = Math.sin(r.wanderAngle) * 0.15 * B.speed;
        if (B.interactive && t.x > -100) {
          const d = t.x - r.x, m = t.y - r.y, u = Math.hypot(d, m);
          if (u < B.attractRadius && u > 0)
            if (l)
              r.vx += -d / u * 1.5, r.vy += -m / u * 1.5, r.fleeing = !0;
            else {
              const R = (1 - u / B.attractRadius) * 0.08 * B.speed;
              r.vx += d / u * R, r.vy += m / u * R, r.fleeing = !1;
            }
          else
            r.fleeing = !1;
        }
        r.vx = (r.vx + b) * 0.94, r.vy = (r.vy + F) * 0.94;
        const M = Math.hypot(r.vx, r.vy), P = B.speed * (r.fleeing ? 3 : 1.2);
        M > P && (r.vx = r.vx / M * P, r.vy = r.vy / M * P), r.x += r.vx, r.y += r.vy, r.x < -r.size * 2 && (r.x = f + r.size), r.x > f + r.size * 2 && (r.x = -r.size), r.y < -r.size * 2 && (r.y = y + r.size), r.y > y + r.size * 2 && (r.y = -r.size), M > 0.05 && (r.angle = Math.atan2(r.vy, r.vx) + Math.PI / 2), r.flapPhase += B.flapSpeed * 0.15 * (r.fleeing ? 2 : 1), o.save(), o.translate(r.x, r.y), o.rotate(r.angle);
        const w = Math.cos(r.flapPhase), C = pt(B.wingColor, 0.85), x = pt(B.patternColor, 0.7);
        Be(o, r.size, w, 1, C, x), Be(o, r.size, w, -1, C, x), o.fillStyle = pt(B.patternColor, 0.9), o.beginPath(), o.ellipse(0, r.size * 0.4, 1.5, r.size * 0.5, 0, 0, Math.PI * 2), o.fill(), o.strokeStyle = pt(B.patternColor, 0.6), o.lineWidth = 0.8, o.beginPath(), o.moveTo(0, 0), o.lineTo(-3, -r.size * 0.4), o.stroke(), o.beginPath(), o.moveTo(0, 0), o.lineTo(3, -r.size * 0.4), o.stroke(), o.restore();
      }
      I = requestAnimationFrame(W);
    }
    return I = requestAnimationFrame(W), () => {
      cancelAnimationFrame(I), v.disconnect(), i.removeEventListener("mousemove", z), i.removeEventListener("mouseleave", D);
    };
  }, [a]);
}
const ra = {
  default: { wingColor: "#c8c8c8", patternColor: "#444444", backgroundColor: "#0a0a0a" },
  monarch: { wingColor: "#e06010", patternColor: "#111111", backgroundColor: "#0a0800" },
  morpho: { wingColor: "#1060ff", patternColor: "#0030aa", backgroundColor: "#000508" },
  meadow: { wingColor: "#f0c030", patternColor: "#804000", backgroundColor: "#0a1405" },
  night: { wingColor: "#c0d0e0", patternColor: "#304050", backgroundColor: "#020408" }
}, aa = ht(
  (a, g) => {
    const {
      preset: n,
      butterflyCount: i,
      wingColor: c,
      patternColor: o,
      backgroundColor: f,
      flapSpeed: y,
      speed: h,
      attractRadius: t,
      interactive: p,
      showTrails: e,
      width: s,
      height: v,
      className: S,
      style: z
    } = a, D = n && ra[n] || {}, I = G(null);
    return gt(g, () => I.current), na(I, {
      butterflyCount: i ?? 12,
      wingColor: c ?? D.wingColor ?? "#c8c8c8",
      patternColor: o ?? D.patternColor ?? "#444444",
      backgroundColor: f ?? D.backgroundColor ?? "#111111",
      flapSpeed: y ?? 1,
      speed: h ?? 1,
      attractRadius: t ?? 120,
      interactive: p ?? !0,
      showTrails: e ?? !1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: { width: s ?? "100%", height: v ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...z },
        children: /* @__PURE__ */ it("canvas", { ref: I, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
aa.displayName = "ButterflySwarm";
function Ie(a, g, n) {
  const i = n ?? 20 + Math.random() * 30, c = 6 + Math.floor(Math.random() * 5);
  return {
    x: Math.random() * a,
    y: g + i + Math.random() * g,
    vy: -(0.2 + Math.random() * 0.4),
    phase: Math.random() * Math.PI * 2,
    size: i,
    tentacles: Array.from({ length: c }, () => ({
      offX: (Math.random() - 0.5) * i * 1.2,
      len: i * (0.8 + Math.random() * 1.2),
      wobble: Math.random() * Math.PI * 2
    }))
  };
}
function Fe(a, g) {
  const n = 0.1 + Math.random() * 0.4;
  return {
    x: Math.random() * a,
    y: Math.random() * g,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -(0.05 + Math.random() * 0.15),
    brightness: n,
    baseAlpha: n,
    glowTimer: 0
  };
}
function ia(a, g) {
  const n = G(g);
  n.current = g, ft(() => {
    const i = a.current;
    if (!i) return;
    const c = i.parentElement, o = i.getContext("2d");
    let f = 0, y = 0, h = 0, t = [], p = [];
    const e = [], s = { x: -1, y: -1, px: -1, py: -1 };
    function v() {
      const l = n.current;
      t = Array.from({ length: l.jellyfishCount }, () => {
        const r = Ie(f, y);
        return r.y = Math.random() * y, r;
      }), p = Array.from({ length: l.planktonCount }, () => Fe(f, y));
    }
    function S(l, r) {
      const b = window.devicePixelRatio || 1;
      i.width = Math.round(l * b), i.height = Math.round(r * b), i.style.width = `${l}px`, i.style.height = `${r}px`, o.scale(b, b), f = l, y = r, v();
    }
    const z = new ResizeObserver((l) => {
      const { width: r, height: b } = l[0].contentRect;
      r > 0 && b > 0 && S(r, b);
    });
    z.observe(c);
    const D = c.getBoundingClientRect();
    D.width > 0 && D.height > 0 && S(D.width, D.height);
    function I(l) {
      const r = i.getBoundingClientRect();
      if (s.px = s.x, s.py = s.y, s.x = l.clientX - r.left, s.y = l.clientY - r.top, n.current.interactive && s.px >= 0) {
        const F = s.x - s.px, M = s.y - s.py, P = Math.sqrt(F * F + M * M);
        P > 3 && e.push({ x: s.x, y: s.y, radius: 0, maxRadius: 80 + P * 3, alpha: 0.7 });
      }
    }
    function W() {
      s.x = -1, s.y = -1;
    }
    i.addEventListener("mousemove", I), i.addEventListener("mouseleave", W);
    let B = 0;
    function $() {
      h += 0.016;
      const l = n.current;
      for (o.fillStyle = l.waterColor, o.fillRect(0, 0, f, y); t.length < l.jellyfishCount; ) t.push(Ie(f, y));
      for (t.length = l.jellyfishCount; p.length < l.planktonCount; ) p.push(Fe(f, y));
      p.length = l.planktonCount;
      for (let r = e.length - 1; r >= 0; r--) {
        const b = e[r];
        if (b.radius += 2.5, b.alpha -= 0.012, b.alpha <= 0 || b.radius > b.maxRadius) {
          e.splice(r, 1);
          continue;
        }
        o.beginPath(), o.arc(b.x, b.y, b.radius, 0, Math.PI * 2), o.strokeStyle = pt(l.glowColor, b.alpha * 0.5), o.lineWidth = 2, o.stroke();
      }
      for (const r of p) {
        r.x += r.vx, r.y += r.vy, r.y < -5 && (r.y = y + 5, r.x = Math.random() * f), r.x < 0 && (r.x = f), r.x > f && (r.x = 0), r.glowTimer = Math.max(0, r.glowTimer - 0.02);
        for (const b of e) {
          const F = r.x - b.x, M = r.y - b.y, P = Math.sqrt(F * F + M * M);
          Math.abs(P - b.radius) < 15 && (r.glowTimer = Math.min(1, r.glowTimer + 0.4));
        }
        r.brightness = r.baseAlpha + r.glowTimer * 0.6 + Math.sin(h * 2 + r.x) * 0.05, o.beginPath(), o.arc(r.x, r.y, 1.5, 0, Math.PI * 2), o.fillStyle = pt(l.glowColor, Math.min(1, r.brightness)), o.fill(), r.glowTimer > 0.3 && (o.beginPath(), o.arc(r.x, r.y, 4, 0, Math.PI * 2), o.fillStyle = pt(l.glowColor, r.glowTimer * 0.25), o.fill());
      }
      for (const r of t) {
        r.phase += 0.04 * l.speed;
        const b = Math.sin(r.phase);
        r.y += r.vy * l.speed, r.x += Math.sin(r.phase * 0.3) * 0.3, r.y < -r.size * 3 && (r.y = y + r.size, r.x = Math.random() * f);
        const F = 1 + b * 0.15, M = 1 - b * 0.1, P = 0.55 + b * 0.1, w = o.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.size * 1.5);
        w.addColorStop(0, pt(l.jellyfishColor, P * 0.4)), w.addColorStop(1, pt(l.jellyfishColor, 0)), o.beginPath(), o.arc(r.x, r.y, r.size * 1.5, 0, Math.PI * 2), o.fillStyle = w, o.fill(), o.save(), o.translate(r.x, r.y), o.scale(F, M), o.beginPath(), o.ellipse(0, 0, r.size, r.size * 0.6, 0, Math.PI, 0), o.fillStyle = pt(l.jellyfishColor, P), o.fill(), o.strokeStyle = pt(l.jellyfishColor, P * 0.6), o.lineWidth = 1.5, o.stroke(), o.restore();
        for (const C of r.tentacles) {
          C.wobble += 0.04;
          const x = r.x + C.offX * F + Math.sin(C.wobble) * 4;
          o.beginPath(), o.moveTo(x, r.y + r.size * 0.5), o.bezierCurveTo(
            x + Math.sin(C.wobble * 0.7) * 6,
            r.y + r.size * 0.5 + C.len * 0.33,
            x + Math.sin(C.wobble * 0.5 + 1) * 6,
            r.y + r.size * 0.5 + C.len * 0.67,
            x + Math.sin(C.wobble * 0.3 + 2) * 4,
            r.y + r.size * 0.5 + C.len
          ), o.strokeStyle = pt(l.jellyfishColor, P * 0.4), o.lineWidth = 1, o.stroke();
        }
      }
      B = requestAnimationFrame($);
    }
    return B = requestAnimationFrame($), () => {
      cancelAnimationFrame(B), z.disconnect(), i.removeEventListener("mousemove", I), i.removeEventListener("mouseleave", W);
    };
  }, [a]);
}
const sa = {
  default: {},
  abyssal: { jellyfishColor: "#8855cc", glowColor: "#aa55ff", waterColor: "#020008" },
  coral: { jellyfishColor: "#ff8855", glowColor: "#ffaa44", waterColor: "#040a0c" },
  aurora: { jellyfishColor: "#44ffaa", glowColor: "#00ff88", waterColor: "#020c08" },
  crimson: { jellyfishColor: "#ff3344", glowColor: "#ff2244", waterColor: "#080002" }
}, la = ht(
  (a, g) => {
    const {
      preset: n,
      jellyfishCount: i,
      planktonCount: c,
      jellyfishColor: o,
      glowColor: f,
      waterColor: y,
      interactive: h,
      speed: t,
      width: p,
      height: e,
      className: s,
      style: v
    } = a, S = n && sa[n] || {}, z = G(null);
    return gt(g, () => z.current), ia(z, {
      jellyfishCount: i ?? 5,
      planktonCount: c ?? 200,
      jellyfishColor: o ?? S.jellyfishColor ?? "#99bbcc",
      glowColor: f ?? S.glowColor ?? "#aaccdd",
      waterColor: y ?? S.waterColor ?? "#060c10",
      interactive: h ?? !0,
      speed: t ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: s,
        style: { width: p ?? "100%", height: e ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...v },
        children: /* @__PURE__ */ it("canvas", { ref: z, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
la.displayName = "DeepSeaBioluminescence";
export {
  yr as AntColony,
  Ze as AudioVisualizer,
  ln as AuroraBorealis,
  Wr as BlackHole,
  tn as Boids,
  Vr as BubbleUniverse,
  aa as ButterflySwarm,
  Lo as ClothSimulation,
  ro as Confetti,
  ar as CrystalGrowth,
  la as DeepSeaBioluminescence,
  xn as DiffusionAggregation,
  Ar as DragonCursor,
  Je as FireEffect,
  xo as Fireworks,
  po as FlowField,
  qo as FluidSimulation,
  Gr as GalaxySpiral,
  Vo as GameOfLife,
  ko as GlitchOverlay,
  jn as InkBleed,
  Ln as Kaleidoscope,
  zr as KoiPond,
  Bn as LSystem,
  jo as Lightning,
  kn as Lissajous,
  Fo as MagneticBlob,
  Cr as MagneticField,
  Ao as Mandala,
  Ye as MatrixRain,
  gr as Metaballs,
  lr as NeuralWeb,
  co as NoiseGradient,
  He as ParticleField,
  fr as ParticleText,
  Zn as PendulaWave,
  fo as PixelDissolve,
  Go as Rain,
  nn as ReactionDiffusion,
  Fr as SakuraBlossom,
  mn as SandSimulation,
  wo as Shockwave,
  Gn as SlimeMold,
  Zr as SolarFlare,
  oa as SpiderWeb,
  hn as Spirograph,
  Ue as Starfield,
  kr as TerrainMesh,
  jr as TornadoVortex,
  Wn as VoronoiCells,
  _n as WatercolorBloom,
  vn as WaveInterference,
  Ko as Wormhole
};
