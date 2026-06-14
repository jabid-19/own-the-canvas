import { jsx as it, jsxs as Be } from "react/jsx-runtime";
import { useRef as X, useEffect as ft, forwardRef as ht, useImperativeHandle as gt } from "react";
const Ie = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ", he = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", Fe = "01";
function $e(r) {
  return r === "katakana" ? Ie : r === "latin" ? he : r === "binary" ? Fe : r || he;
}
function Te(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const c = s.parentElement;
    if (!c) return;
    const g = s.getContext("2d");
    let n = 0, e = 0;
    function h(E, q) {
      const $ = window.devicePixelRatio || 1;
      n = E, e = q, s.width = Math.round(n * $), s.height = Math.round(e * $), s.style.width = `${n}px`, s.style.height = `${e}px`, g.scale($, $);
      const { fontSize: I } = o.current, f = Math.floor(n / I);
      i.current = Array.from(
        { length: f },
        () => Math.floor(Math.random() * -(e / I))
      );
    }
    const t = new ResizeObserver((E) => {
      const { width: q, height: $ } = E[0].contentRect;
      q > 0 && $ > 0 && h(q, $);
    });
    t.observe(c);
    const a = c.getBoundingClientRect();
    a.width > 0 && a.height > 0 && h(a.width, a.height);
    let m = 0, k = 0;
    function W() {
      const { color: E, backgroundColor: q, fontSize: $, charset: I, resetThreshold: f } = o.current, d = I;
      g.fillStyle = q, g.fillRect(0, 0, n, e), g.fillStyle = E, g.font = `${$}px monospace`;
      const x = i.current;
      for (let F = 0; F < x.length; F++) {
        const v = d[Math.floor(Math.random() * d.length)];
        g.fillText(v, F * $, x[F] * $), x[F]++, x[F] * $ > e && Math.random() > f && (x[F] = 0);
      }
    }
    function Y(E) {
      const q = m ? E - m : 0;
      m = E, k += q;
      const { speed: $ } = o.current;
      k >= $ && (k = k % $, W()), l.current = requestAnimationFrame(Y);
    }
    return l.current = requestAnimationFrame(Y), () => {
      t.disconnect(), cancelAnimationFrame(l.current);
    };
  }, [r]);
}
const Le = {
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
}, ze = ht(
  (r, y) => {
    const {
      preset: o,
      color: i,
      backgroundColor: l,
      fontSize: s,
      speed: c,
      charset: g,
      resetThreshold: n,
      width: e,
      height: h,
      className: t,
      style: a
    } = r, m = o && Le[o] || {}, k = X(null);
    gt(y, () => k.current);
    const W = $e(g ?? m.charset ?? "latin");
    Te(k, {
      color: i ?? m.color ?? "#ffffff",
      backgroundColor: l ?? m.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: s ?? m.fontSize ?? 14,
      speed: c ?? m.speed ?? 33,
      charset: W,
      resetThreshold: n ?? m.resetThreshold ?? 0.95
    });
    const Y = {
      width: e ?? "100%",
      height: h ?? "100%",
      display: "block",
      overflow: "hidden",
      ...a
    };
    return /* @__PURE__ */ it("div", { style: Y, className: t, children: /* @__PURE__ */ it(
      "canvas",
      {
        ref: k,
        "aria-hidden": "true",
        role: "presentation",
        style: { display: "block" }
      }
    ) });
  }
);
ze.displayName = "MatrixRain";
const Xt = /* @__PURE__ */ new Map();
function Ut(r) {
  if (Xt.has(r)) return Xt.get(r);
  let y = r.trim();
  y.startsWith("#") && (y = y.slice(1));
  let o, i, l;
  if (y.length === 3)
    o = parseInt(y[0] + y[0], 16), i = parseInt(y[1] + y[1], 16), l = parseInt(y[2] + y[2], 16);
  else if (y.length === 6)
    o = parseInt(y.slice(0, 2), 16), i = parseInt(y.slice(2, 4), 16), l = parseInt(y.slice(4, 6), 16);
  else
    return Xt.set(r, null), null;
  if (isNaN(o) || isNaN(i) || isNaN(l))
    return Xt.set(r, null), null;
  const s = [o, i, l];
  return Xt.set(r, s), s;
}
function Pt(r, y = 1) {
  const o = Ut(r);
  return o ? `rgba(${o[0]},${o[1]},${o[2]},${y})` : `rgba(255,255,255,${y})`;
}
function wt(r) {
  const y = Ut(r);
  return y ? `${y[0]},${y[1]},${y[2]}` : "255,255,255";
}
function De(r, y, o) {
  return [r[0] + (y[0] - r[0]) * o, r[1] + (y[1] - r[1]) * o, r[2] + (y[2] - r[2]) * o];
}
function xt(r, y) {
  const o = Math.max(0, Math.min(1, y));
  if (r.length === 0) return [255, 255, 255];
  if (r.length === 1) return Ut(r[0]) ?? [255, 255, 255];
  const i = o * (r.length - 1), l = Math.min(Math.floor(i), r.length - 2), s = i - l, c = Ut(r[l]) ?? [255, 255, 255], g = Ut(r[l + 1]) ?? [255, 255, 255];
  return De(c, g, s);
}
function qe(r, y) {
  const o = X([]), i = X(null), l = X(null), s = X(y);
  s.current = y;
  const c = X(0), g = X(""), n = X(""), e = X(""), h = X(""), t = X(null);
  ft(() => {
    var a;
    (a = t.current) == null || a.call(t);
  }, [y.particleCount, y.particleSize]), ft(() => {
    const a = r.current;
    if (!a) return;
    const m = a, k = m.parentElement;
    if (!k) return;
    const W = m.getContext("2d");
    let Y = 0, E = 0;
    function q(C, M) {
      const { particleCount: p, particleSize: b, speed: u, velocityMultiplier: R, twinkle: S } = s.current;
      o.current = Array.from({ length: p }, () => ({
        x: Math.random() * C,
        y: Math.random() * M,
        vx: (Math.random() - 0.5) * u * R,
        vy: (Math.random() - 0.5) * u * R,
        size: Math.random() * b + b * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        twinklePhase: S ? Math.random() * Math.PI * 2 : void 0
      }));
    }
    function $(C, M) {
      const p = window.devicePixelRatio || 1;
      m.width = Math.round(C * p), m.height = Math.round(M * p), m.style.width = `${C}px`, m.style.height = `${M}px`, W.scale(p, p), Y = C, E = M, q(C, M);
    }
    t.current = () => {
      Y > 0 && E > 0 && q(Y, E);
    };
    const I = new ResizeObserver((C) => {
      const { width: M, height: p } = C[0].contentRect;
      M > 0 && p > 0 && $(M, p);
    });
    I.observe(k);
    const f = k.getBoundingClientRect();
    f.width > 0 && f.height > 0 && $(f.width, f.height);
    function d(C) {
      const M = m.getBoundingClientRect();
      return { x: C.clientX - M.left, y: C.clientY - M.top };
    }
    function x(C) {
      if (!s.current.dragParticles) return;
      const { x: M, y: p } = d(C), b = o.current, { dragRadius: u } = s.current;
      let R = -1, S = u;
      for (let L = 0; L < b.length; L++) {
        const T = b[L].x - M, P = b[L].y - p, A = Math.sqrt(T * T + P * P);
        A < S && (S = A, R = L);
      }
      R !== -1 && (l.current = { particleIndex: R, offsetX: b[R].x - M, offsetY: b[R].y - p });
    }
    function F(C) {
      const { x: M, y: p } = d(C);
      if (l.current) {
        const b = o.current[l.current.particleIndex];
        b.x = M + l.current.offsetX, b.y = p + l.current.offsetY, b.vx = 0, b.vy = 0;
      }
      s.current.interactive && (i.current = { x: M, y: p });
    }
    function v() {
      l.current = null;
    }
    function B() {
      i.current = null, l.current = null;
    }
    m.addEventListener("mousedown", x), m.addEventListener("mousemove", F), m.addEventListener("mouseup", v), m.addEventListener("mouseleave", B);
    function w() {
      const {
        particleColor: C,
        lineColor: M,
        lineDistance: p,
        connectParticles: b,
        backgroundColor: u,
        speed: R,
        repelRadius: S,
        repelStrength: L,
        friction: T,
        maxVelocityMultiplier: P,
        lineWidth: A,
        lineOpacity: D,
        wrapEdges: z,
        twinkle: O,
        twinkleSpeed: j,
        twinkleAmplitude: N,
        glowParticles: H,
        glowBlur: J,
        lineStyle: G
      } = s.current;
      C !== e.current && (g.current = wt(C), e.current = C), M !== h.current && (n.current = wt(M), h.current = M);
      const U = o.current, V = i.current, _ = g.current, Q = n.current;
      W.clearRect(0, 0, Y, E), u && u !== "transparent" && (W.fillStyle = u, W.fillRect(0, 0, Y, E));
      for (let ot = 0; ot < U.length; ot++) {
        const K = U[ot];
        if (l.current && l.current.particleIndex === ot) continue;
        if (V) {
          const nt = K.x - V.x, rt = K.y - V.y, Z = Math.sqrt(nt * nt + rt * rt);
          if (Z < S && Z > 0) {
            const at = (S - Z) / S * 2;
            K.vx += nt / Z * at * L, K.vy += rt / Z * at * L;
          }
        }
        K.vx *= T, K.vy *= T;
        const et = R * P, tt = Math.sqrt(K.vx * K.vx + K.vy * K.vy);
        tt > et && (K.vx = K.vx / tt * et, K.vy = K.vy / tt * et), K.x += K.vx, K.y += K.vy, z ? (K.x < 0 ? K.x += Y : K.x > Y && (K.x -= Y), K.y < 0 ? K.y += E : K.y > E && (K.y -= E)) : (K.x < 0 && (K.x = 0, K.vx *= -1), K.x > Y && (K.x = Y, K.vx *= -1), K.y < 0 && (K.y = 0, K.vy *= -1), K.y > E && (K.y = E, K.vy *= -1)), O && (K.twinklePhase === void 0 && (K.twinklePhase = Math.random() * Math.PI * 2), K.twinklePhase += j);
      }
      if (b) {
        G === "dashed" ? W.setLineDash([4, 6]) : W.setLineDash([]);
        for (let ot = 0; ot < U.length; ot++)
          for (let K = ot + 1; K < U.length; K++) {
            const et = U[ot].x - U[K].x, tt = U[ot].y - U[K].y, nt = Math.sqrt(et * et + tt * tt);
            if (nt < p) {
              const rt = (1 - nt / p) * D;
              W.beginPath(), W.moveTo(U[ot].x, U[ot].y), W.lineTo(U[K].x, U[K].y), W.strokeStyle = `rgba(${Q},${rt})`, W.lineWidth = A, W.stroke();
            }
          }
        W.setLineDash([]);
      }
      for (let ot = 0; ot < U.length; ot++) {
        const K = U[ot], et = O && K.twinklePhase !== void 0 ? 1 - N + N * Math.sin(K.twinklePhase) : K.opacity;
        H && (W.shadowColor = C, W.shadowBlur = J), W.beginPath(), W.arc(K.x, K.y, K.size, 0, Math.PI * 2), W.fillStyle = `rgba(${_},${et})`, W.fill(), H && (W.shadowBlur = 0);
      }
      c.current = requestAnimationFrame(w);
    }
    return c.current = requestAnimationFrame(w), () => {
      I.disconnect(), cancelAnimationFrame(c.current), m.removeEventListener("mousedown", x), m.removeEventListener("mousemove", F), m.removeEventListener("mouseup", v), m.removeEventListener("mouseleave", B);
    };
  }, [r]);
}
const We = {
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
}, Ye = ht(
  (r, y) => {
    const {
      preset: o,
      particleCount: i,
      particleColor: l,
      lineColor: s,
      lineDistance: c,
      particleSize: g,
      speed: n,
      connectParticles: e,
      interactive: h,
      backgroundColor: t,
      repelRadius: a,
      repelStrength: m,
      friction: k,
      maxVelocityMultiplier: W,
      lineWidth: Y,
      lineOpacity: E,
      wrapEdges: q,
      twinkle: $,
      twinkleSpeed: I,
      twinkleAmplitude: f,
      glowParticles: d,
      glowBlur: x,
      lineStyle: F,
      dragParticles: v,
      dragRadius: B,
      velocityMultiplier: w,
      width: C,
      height: M,
      className: p,
      style: b
    } = r, u = o && We[o] || {}, R = X(null);
    return gt(y, () => R.current), qe(R, {
      particleCount: i ?? u.particleCount ?? 120,
      particleColor: l ?? u.particleColor ?? "#ffffff",
      lineColor: s ?? u.lineColor ?? "#6b7280",
      lineDistance: c ?? u.lineDistance ?? 120,
      particleSize: g ?? 2.5,
      speed: n ?? u.speed ?? 0.8,
      connectParticles: e ?? u.connectParticles ?? !0,
      interactive: h ?? !0,
      backgroundColor: t ?? u.backgroundColor ?? "transparent",
      repelRadius: a ?? 80,
      repelStrength: m ?? 0.3,
      friction: k ?? 0.99,
      maxVelocityMultiplier: W ?? 3,
      lineWidth: Y ?? 0.8,
      lineOpacity: E ?? u.lineOpacity ?? 0.6,
      wrapEdges: q ?? u.wrapEdges ?? !1,
      twinkle: $ ?? u.twinkle ?? !1,
      twinkleSpeed: I ?? 0.03,
      twinkleAmplitude: f ?? 0.4,
      glowParticles: d ?? u.glowParticles ?? !1,
      glowBlur: x ?? 15,
      lineStyle: F ?? u.lineStyle ?? "solid",
      dragParticles: v ?? !1,
      dragRadius: B ?? 20,
      velocityMultiplier: w ?? u.velocityMultiplier ?? 2
    }), /* @__PURE__ */ it(
      "div",
      {
        className: p,
        style: {
          width: C ?? "100%",
          height: M ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: v ?? !1 ? "grab" : "default",
          ...b
        },
        children: /* @__PURE__ */ it("canvas", { ref: R, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ye.displayName = "ParticleField";
function Oe(r, y) {
  const o = X([]), i = X([]), l = X([]), s = X(y);
  s.current = y;
  const c = X(0), g = X(0), n = X(null);
  ft(() => {
    var e;
    (e = n.current) == null || e.call(n);
  }, [y.starCount]), ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e, t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(f, d) {
      const { starCount: x, starSizeMin: F, starSizeMax: v, starOpacityMin: B, starOpacityMax: w, twinkleSpeed: C } = s.current;
      o.current = Array.from({ length: x }, () => ({
        x: Math.random() * f,
        y: Math.random() * d,
        size: Math.random() * (v - F) + F,
        opacity: Math.random() * (w - B) + B,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * C + C * 0.3
      }));
    }
    function Y(f, d) {
      const { starCount: x } = s.current, F = Math.max(f, d);
      i.current = Array.from({ length: x }, () => ({
        x: (Math.random() - 0.5) * f * 2,
        y: (Math.random() - 0.5) * d * 2,
        z: Math.random() * F,
        pz: 0
      }));
    }
    function E(f, d) {
      const x = window.devicePixelRatio || 1;
      h.width = Math.round(f * x), h.height = Math.round(d * x), h.style.width = `${f}px`, h.style.height = `${d}px`, a.scale(x, x), m = f, k = d, W(f, d), Y(f, d);
    }
    n.current = () => {
      m > 0 && k > 0 && (W(m, k), Y(m, k));
    };
    const q = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && E(d, x);
    });
    q.observe(t);
    const $ = t.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    function I(f) {
      const {
        starColor: d,
        shootingStarColor: x,
        backgroundColor: F,
        speed: v,
        twinkle: B,
        shootingStars: w,
        shootingStarInterval: C,
        perspective: M,
        shootingStarLength: p,
        shootingStarLifetime: b
      } = s.current;
      if (a.fillStyle = F, a.fillRect(0, 0, m, k), M === "3D") {
        const u = m / 2, R = k / 2, S = Math.max(m, k), L = i.current;
        for (let T = 0; T < L.length; T++) {
          const P = L[T];
          P.pz = P.z, P.z -= v * 4, P.z <= 0 && (P.x = (Math.random() - 0.5) * m * 2, P.y = (Math.random() - 0.5) * k * 2, P.z = S, P.pz = P.z);
          const A = P.x / P.z * m + u, D = P.y / P.z * k + R, z = P.x / P.pz * m + u, O = P.y / P.pz * k + R, j = Math.max((1 - P.z / S) * 3, 0.1), N = 1 - P.z / S;
          a.beginPath(), a.moveTo(z, O), a.lineTo(A, D), a.strokeStyle = Pt(d, N), a.lineWidth = j, a.stroke();
        }
      } else {
        const u = o.current;
        for (let R = 0; R < u.length; R++) {
          const S = u[R];
          S.y += v * (S.size / 2), S.y > k && (S.y = 0, S.x = Math.random() * m);
          let L = S.opacity;
          B && (S.twinklePhase += S.twinkleSpeed, L = S.opacity * (0.5 + 0.5 * Math.sin(S.twinklePhase))), a.beginPath(), a.arc(S.x, S.y, S.size, 0, Math.PI * 2), a.fillStyle = Pt(d, L), a.fill();
        }
        if (w) {
          if (f - g.current > C) {
            g.current = f;
            const R = Math.random() * 8 + 4, S = Math.random() * 4 + 2;
            l.current.push({
              x: Math.random() * m * 0.7,
              y: Math.random() * k * 0.3,
              vx: R,
              vy: S,
              length: Math.random() * (p * 0.5) + p * 0.5,
              opacity: 1,
              life: 0,
              maxLife: b
            });
          }
          l.current = l.current.filter((R) => {
            if (R.x += R.vx, R.y += R.vy, R.life++, R.opacity = 1 - R.life / R.maxLife, R.opacity <= 0) return !1;
            const S = R.length / Math.sqrt(R.vx * R.vx + R.vy * R.vy), L = a.createLinearGradient(R.x, R.y, R.x - R.vx * S, R.y - R.vy * S);
            return L.addColorStop(0, Pt(x, R.opacity)), L.addColorStop(1, Pt(x, 0)), a.beginPath(), a.moveTo(R.x, R.y), a.lineTo(R.x - R.vx * S, R.y - R.vy * S), a.strokeStyle = L, a.lineWidth = 2, a.stroke(), !0;
          });
        }
      }
      c.current = requestAnimationFrame(I);
    }
    return c.current = requestAnimationFrame(I), () => {
      q.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [r]);
}
const Ge = {
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
}, Xe = ht(
  (r, y) => {
    const {
      preset: o,
      starCount: i,
      starColor: l,
      shootingStarColor: s,
      backgroundColor: c,
      speed: g,
      twinkle: n,
      shootingStars: e,
      shootingStarInterval: h,
      perspective: t,
      starSizeMin: a,
      starSizeMax: m,
      starOpacityMin: k,
      starOpacityMax: W,
      twinkleSpeed: Y,
      shootingStarLength: E,
      shootingStarLifetime: q,
      width: $,
      height: I,
      className: f,
      style: d
    } = r, x = o && Ge[o] || {}, F = X(null);
    return gt(y, () => F.current), Oe(F, {
      starCount: i ?? x.starCount ?? 200,
      starColor: l ?? x.starColor ?? "#ffffff",
      shootingStarColor: s ?? x.shootingStarColor ?? "#ffffff",
      backgroundColor: c ?? x.backgroundColor ?? "#111111",
      speed: g ?? x.speed ?? 0.5,
      twinkle: n ?? x.twinkle ?? !0,
      shootingStars: e ?? x.shootingStars ?? !0,
      shootingStarInterval: h ?? x.shootingStarInterval ?? 3e3,
      perspective: t ?? x.perspective ?? "2D",
      starSizeMin: a ?? 0.3,
      starSizeMax: m ?? 2.8,
      starOpacityMin: k ?? 0.3,
      starOpacityMax: W ?? 1,
      twinkleSpeed: Y ?? 0.03,
      shootingStarLength: E ?? 80,
      shootingStarLifetime: q ?? 60
    }), /* @__PURE__ */ it(
      "div",
      {
        className: f,
        style: { width: $ ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...d },
        children: /* @__PURE__ */ it("canvas", { ref: F, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Xe.displayName = "Starfield";
function ge(r) {
  const y = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    const i = o / 255, [l, s, c] = xt(r, i), g = Math.round(l), n = Math.round(s), e = Math.round(c), h = Math.min(255, o * 8);
    y[o] = h << 24 | e << 16 | n << 8 | g;
  }
  return y[0] = 0, y;
}
function pe(r) {
  const y = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    let i = 0, l = 0, s = 0;
    const c = o / 255;
    if (r === "inferno")
      if (c < 0.33)
        i = Math.round(c / 0.33 * 200), l = 0, s = 0;
      else if (c < 0.66) {
        const n = (c - 0.33) / 0.33;
        i = Math.round(200 + n * 55), l = Math.round(n * 165), s = 0;
      } else {
        const n = (c - 0.66) / 0.34;
        i = 255, l = Math.round(165 + n * 90), s = Math.round(n * 255);
      }
    else if (r === "toxic")
      if (c < 0.4)
        i = 0, l = Math.round(c / 0.4 * 180), s = 0;
      else if (c < 0.75) {
        const n = (c - 0.4) / 0.35;
        i = Math.round(n * 180), l = Math.round(180 + n * 75), s = 0;
      } else {
        const n = (c - 0.75) / 0.25;
        i = Math.round(180 + n * 75), l = 255, s = Math.round(n * 100);
      }
    else if (r === "ice")
      if (c < 0.4)
        i = 0, l = 0, s = Math.round(c / 0.4 * 200);
      else if (c < 0.7) {
        const n = (c - 0.4) / 0.3;
        i = 0, l = Math.round(n * 200), s = Math.round(200 + n * 55);
      } else {
        const n = (c - 0.7) / 0.3;
        i = Math.round(n * 255), l = Math.round(200 + n * 55), s = 255;
      }
    else if (r === "plasma")
      if (c < 0.3) {
        const n = c / 0.3;
        i = Math.round(n * 150), l = 0, s = Math.round(n * 200);
      } else if (c < 0.6) {
        const n = (c - 0.3) / 0.3;
        i = Math.round(150 + n * 105), l = 0, s = Math.round(200 + n * 55);
      } else {
        const n = (c - 0.6) / 0.4;
        i = 255, l = Math.round(n * 200), s = 255;
      }
    else {
      const n = Math.round(c < 0.5 ? c * 2 * 180 : 180 + (c - 0.5) * 2 * 75);
      i = l = s = Math.min(255, n);
    }
    const g = Math.min(255, o * 8);
    y[o] = g << 24 | s << 16 | l << 8 | i;
  }
  return y[0] = 0, y;
}
function He(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null), s = X(
    y.customColors && y.customColors.length >= 2 ? ge(y.customColors) : pe(y.palette)
  ), c = X(y.palette), g = X(JSON.stringify(y.customColors ?? [])), n = X(null), e = X(null), h = X(null), t = X(null);
  ft(() => {
    const a = r.current;
    if (!a) return;
    const m = a, k = m.parentElement;
    if (!k) return;
    const W = m.getContext("2d");
    let Y = 0, E = 0;
    n.current || (n.current = document.createElement("canvas"), e.current = n.current.getContext("2d"));
    function q(d, x) {
      const { resolution: F } = o.current, v = window.devicePixelRatio || 1, B = Math.max(0.1, Math.min(1, F));
      m.width = Math.round(d * v), m.height = Math.round(x * v), m.style.width = `${d}px`, m.style.height = `${x}px`, Y = Math.max(1, Math.round(d * B)), E = Math.max(1, Math.round(x * B)), l.current = new Uint8Array(Y * E);
      const w = n.current;
      w.width = Y, w.height = E, h.current = e.current.createImageData(Y, E), t.current = new Uint32Array(h.current.data.buffer);
    }
    const $ = new ResizeObserver((d) => {
      const { width: x, height: F } = d[0].contentRect;
      x > 0 && F > 0 && q(x, F);
    });
    $.observe(k);
    const I = k.getBoundingClientRect();
    I.width > 0 && I.height > 0 && q(I.width, I.height);
    function f() {
      const { palette: d, customColors: x, intensity: F, windStrength: v, windDirection: B, spread: w, cooling: C, noiseStrength: M, coolingScale: p } = o.current, b = x && x.length >= 2, u = JSON.stringify(x ?? []);
      b ? u !== g.current && (g.current = u, s.current = ge(x)) : (d !== c.current || g.current !== "[]") && (c.current = d, g.current = "[]", s.current = pe(d));
      const R = l.current, S = t.current, L = h.current;
      if (!R || !S || !L || Y === 0 || E === 0) {
        i.current = requestAnimationFrame(f);
        return;
      }
      const T = Math.round(F * 255);
      for (let O = 0; O < Y; O++)
        R[(E - 1) * Y + O] = 255;
      const P = M / 2;
      for (let O = 0; O < Y; O++) {
        const j = Math.random() * M - P;
        R[(E - 2) * Y + O] = Math.max(80, Math.min(255, T + j));
      }
      const A = Math.round(v * B), D = Math.max(1, Math.round(C * p));
      for (let O = 0; O < E - 1; O++) {
        const j = (O + 1) * Y;
        for (let N = 0; N < Y; N++) {
          const H = R[j + N], J = N > 0 ? R[j + N - 1] : H, G = N < Y - 1 ? R[j + N + 1] : H, U = (J * w + H * 2 + G * w) / (2 + w * 2), V = D + (Math.random() * D | 0), _ = 1 - O / E, Q = Math.random() < _ * _ ? U * 0.25 * Math.random() : 0, ot = U - V - Q, K = N + A, et = K >= 0 && K < Y ? K : N;
          R[O * Y + et] = Math.max(0, Math.min(255, ot));
        }
      }
      const z = s.current;
      for (let O = 0; O < Y * E; O++)
        S[O] = z[R[O]];
      W.clearRect(0, 0, m.width, m.height), e.current.putImageData(L, 0, 0), W.drawImage(n.current, 0, 0, m.width, m.height), i.current = requestAnimationFrame(f);
    }
    return i.current = requestAnimationFrame(f), () => {
      $.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const Ne = {
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
}, je = ht(
  (r, y) => {
    const {
      preset: o,
      palette: i,
      customColors: l,
      intensity: s,
      windStrength: c,
      windDirection: g,
      spread: n,
      cooling: e,
      noiseStrength: h,
      coolingScale: t,
      resolution: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && Ne[o] || {}, q = X(null);
    return gt(y, () => q.current), He(q, {
      palette: i ?? E.palette ?? "smoke",
      customColors: l,
      intensity: s ?? E.intensity ?? 0.95,
      windStrength: c ?? E.windStrength ?? 0.3,
      windDirection: g ?? E.windDirection ?? 1,
      spread: n ?? E.spread ?? 0,
      cooling: e ?? E.cooling ?? 0.3,
      noiseStrength: h ?? 60,
      coolingScale: t ?? 3,
      resolution: a ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: { width: m ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", ...Y },
        children: /* @__PURE__ */ it("canvas", { ref: q, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
je.displayName = "FireEffect";
function Ue(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null), s = X(null), c = X(null), g = X(null), n = X(null);
  ft(() => {
    var m, k;
    const e = y.audioSource;
    if (!e) {
      l.current && ((m = c.current) == null || m.disconnect(), (k = s.current) == null || k.close(), l.current = null, c.current = null, s.current = null);
      return;
    }
    const h = new AudioContext();
    s.current = h;
    const t = h.createAnalyser();
    t.fftSize = y.fftSize, t.smoothingTimeConstant = y.smoothingTimeConstant, l.current = t;
    const a = h.createMediaStreamSource(e);
    return c.current = a, a.connect(t), g.current = new Uint8Array(new ArrayBuffer(t.frequencyBinCount)), n.current = new Uint8Array(new ArrayBuffer(t.fftSize)), () => {
      a.disconnect(), h.close(), l.current = null, c.current = null, s.current = null;
    };
  }, [y.audioSource, y.fftSize, y.smoothingTimeConstant]), ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e, t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(v, B) {
      const w = window.devicePixelRatio || 1;
      h.width = Math.round(v * w), h.height = Math.round(B * w), h.style.width = `${v}px`, h.style.height = `${B}px`, a.scale(w, w), m = v, k = B;
    }
    const Y = new ResizeObserver((v) => {
      const { width: B, height: w } = v[0].contentRect;
      B > 0 && w > 0 && W(B, w);
    });
    Y.observe(t);
    const E = t.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    function q() {
      const { glowEffect: v, glowColor: B, glowBlur: w, barColor: C } = o.current;
      v ? (a.shadowColor = B || C, a.shadowBlur = w) : a.shadowBlur = 0;
    }
    function $() {
      a.shadowBlur = 0;
    }
    function I() {
      const { backgroundColor: v } = o.current;
      v && v !== "transparent" ? (a.fillStyle = v, a.fillRect(0, 0, m, k)) : a.clearRect(0, 0, m, k);
    }
    function f(v, B, w, C, M) {
      const p = a.createLinearGradient(v, k, v, k - B);
      return p.addColorStop(0, C), p.addColorStop(1, M), p;
    }
    function d(v, B, w, C, M, p) {
      C < 1 || (a.fillStyle = M, p && C > 4 ? (a.beginPath(), a.roundRect(v, B, w, C, Math.min(w / 2, 4)), a.fill()) : a.fillRect(v, B, w, C));
    }
    function x() {
      const {
        barCount: v,
        barColor: B,
        waveColor: w,
        gapBetweenBars: C,
        rounded: M,
        mode: p,
        gradient: b,
        gradientEndColor: u,
        idleAmplitude: R,
        idleAnimationSpeed: S
      } = o.current;
      I(), q();
      const L = performance.now() / 1e3 * S;
      if (p === "wave") {
        a.beginPath(), a.moveTo(0, k / 2);
        for (let A = 0; A < m; A++) {
          const D = k / 2 + Math.sin(A / m * Math.PI * 4 + L * 2) * R;
          a.lineTo(A, D);
        }
        a.strokeStyle = w, a.lineWidth = 2, a.stroke(), $();
        return;
      }
      if (p === "circular") {
        const { circularRadiusRatio: A } = o.current, D = m / 2, z = k / 2, O = Math.min(m, k) * A, j = Math.max(1, 2 * Math.PI * O / v * 0.6);
        for (let N = 0; N < v; N++) {
          const H = (Math.sin(N / v * Math.PI * 2 + L * 2) * 0.5 + 0.5) * O * 0.15 + 2, J = N / v * Math.PI * 2 - Math.PI / 2, G = D + Math.cos(J) * O, U = z + Math.sin(J) * O, V = D + Math.cos(J) * (O + H), _ = z + Math.sin(J) * (O + H);
          a.beginPath(), a.moveTo(G, U), a.lineTo(V, _), a.strokeStyle = b ? `hsl(${N / v * 360},70%,60%)` : B, a.lineWidth = j, a.stroke();
        }
        a.beginPath(), a.arc(D, z, O, 0, Math.PI * 2), a.strokeStyle = B, a.lineWidth = 1, a.stroke(), $();
        return;
      }
      if (p === "mirror") {
        const A = C * (v - 1), D = (m - A) / v;
        for (let z = 0; z < v; z++) {
          const O = (Math.sin(z / v * Math.PI * 2 + L * 3) * 0.5 + 0.5) * k * 0.15 + 2, j = z * (D + C), N = b ? f(j, O, D, B, u) : B;
          d(j, k / 2 - O / 2, D, O, N, M);
        }
        $();
        return;
      }
      const T = C * (v - 1), P = (m - T) / v;
      for (let A = 0; A < v; A++) {
        const D = (Math.sin(A / v * Math.PI * 2 + L * 3) * 0.5 + 0.5) * k * 0.3 + 4, z = A * (P + C), O = k - D, j = b ? f(z, D, P, B, u) : B;
        d(z, O, P, D, j, M);
      }
      $();
    }
    function F() {
      const {
        barCount: v,
        barColor: B,
        waveColor: w,
        mode: C,
        sensitivity: M,
        gapBetweenBars: p,
        rounded: b,
        gradient: u,
        gradientEndColor: R
      } = o.current;
      I();
      const S = l.current;
      if (!S) {
        x(), i.current = requestAnimationFrame(F);
        return;
      }
      const L = g.current, T = n.current;
      if (S.getByteFrequencyData(L), S.getByteTimeDomainData(T), q(), C === "bars") {
        const P = p * (v - 1), A = (m - P) / v, D = Math.max(1, Math.floor(L.length / v));
        for (let z = 0; z < v; z++) {
          const j = L[z * D] / 255 * k * M, N = z * (A + p), H = u ? f(N, j, A, B, R) : B;
          d(N, k - j, A, j, H, b);
        }
      } else if (C === "mirror") {
        const P = p * (v - 1), A = (m - P) / v, D = Math.max(1, Math.floor(L.length / v));
        for (let z = 0; z < v; z++) {
          const j = L[z * D] / 255 * k * M, N = z * (A + p), H = u ? f(N, j, A, B, R) : B;
          d(N, k / 2 - j / 2, A, j, H, b);
        }
      } else if (C === "wave") {
        a.beginPath(), Math.max(1, Math.floor(T.length / m));
        for (let P = 0; P < m; P++) {
          const A = Math.min(Math.floor(P / m * T.length), T.length - 1), D = P, z = (T[A] / 128 - 1) * (k / 2) * M + k / 2;
          P === 0 ? a.moveTo(D, z) : a.lineTo(D, z);
        }
        if (u) {
          const P = a.createLinearGradient(0, 0, m, 0);
          P.addColorStop(0, w), P.addColorStop(0.5, R), P.addColorStop(1, w), a.strokeStyle = P;
        } else
          a.strokeStyle = w;
        a.lineWidth = 2, a.stroke();
      } else if (C === "circular") {
        const { circularRadiusRatio: P } = o.current, A = m / 2, D = k / 2, z = Math.min(m, k) * P, O = Math.max(1, Math.floor(L.length / v)), j = Math.max(1, 2 * Math.PI * z / v * 0.6);
        for (let N = 0; N < v; N++) {
          const J = L[N * O] / 255 * z * M, G = N / v * Math.PI * 2 - Math.PI / 2, U = A + Math.cos(G) * z, V = D + Math.sin(G) * z, _ = A + Math.cos(G) * (z + J), Q = D + Math.sin(G) * (z + J);
          a.beginPath(), a.moveTo(U, V), a.lineTo(_, Q), a.strokeStyle = u ? `hsl(${N / v * 360},80%,60%)` : B, a.lineWidth = j, a.stroke();
        }
        a.beginPath(), a.arc(A, D, z, 0, Math.PI * 2), a.strokeStyle = B, a.lineWidth = 1.5, a.stroke();
      }
      $(), i.current = requestAnimationFrame(F);
    }
    return i.current = requestAnimationFrame(F), () => {
      Y.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const Ve = {
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
}, _e = ht(
  (r, y) => {
    const {
      preset: o,
      audioSource: i = null,
      barCount: l,
      barColor: s,
      waveColor: c,
      mode: g,
      sensitivity: n,
      gapBetweenBars: e,
      rounded: h,
      gradient: t,
      gradientEndColor: a,
      backgroundColor: m,
      glowEffect: k,
      glowColor: W,
      glowBlur: Y,
      fftSize: E,
      smoothingTimeConstant: q,
      circularRadiusRatio: $,
      idleAmplitude: I,
      idleAnimationSpeed: f,
      width: d,
      height: x,
      className: F,
      style: v
    } = r, B = o && Ve[o] || {}, w = s ?? B.barColor ?? "#ffffff", C = X(null);
    return gt(y, () => C.current), Ue(C, {
      audioSource: i,
      barCount: l ?? 64,
      barColor: w,
      waveColor: c ?? B.waveColor ?? w,
      mode: g ?? B.mode ?? "bars",
      sensitivity: n ?? 1,
      gapBetweenBars: e ?? 2,
      rounded: h ?? B.rounded ?? !0,
      gradient: t ?? B.gradient ?? !0,
      gradientEndColor: a ?? B.gradientEndColor ?? "#ffffff",
      backgroundColor: m ?? B.backgroundColor ?? "#111111",
      glowEffect: k ?? B.glowEffect ?? !0,
      glowColor: W ?? w,
      glowBlur: Y ?? B.glowBlur ?? 12,
      fftSize: E ?? 2048,
      smoothingTimeConstant: q ?? 0.8,
      circularRadiusRatio: $ ?? 0.25,
      idleAmplitude: I ?? 5,
      idleAnimationSpeed: f ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: d ?? "100%",
          height: x ?? "100%",
          display: "block",
          overflow: "hidden",
          ...v
        },
        children: /* @__PURE__ */ it("canvas", { ref: C, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
_e.displayName = "AudioVisualizer";
function Je(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(!1), c = X(!1), g = X(0), n = X(0);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e, t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(f, d) {
      const x = window.devicePixelRatio || 1;
      h.width = Math.round(f * x), h.height = Math.round(d * x), h.style.width = `${f}px`, h.style.height = `${d}px`, a.scale(x, x), m = f, k = d;
    }
    const Y = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && W(d, x);
    });
    Y.observe(t);
    const E = t.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    function q(f) {
      const { spread: d, colors: x, shapes: F, duration: v, spawnX: B, spawnY: w, spawnSpread: C, speedMin: M, speedMax: p, sizeMin: b, sizeMax: u, angularVelocity: R } = o.current, S = m * B, L = k * w, T = Math.max(1, v / 16.67);
      for (let P = 0; P < f; P++) {
        const A = (Math.random() * 2 - 1) * d * Math.PI, D = Math.random() * (p - M) + M;
        i.current.push({
          x: S + (Math.random() - 0.5) * C,
          y: L,
          vx: Math.sin(A) * D,
          vy: -Math.cos(A) * D,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * R,
          color: x[Math.floor(Math.random() * x.length)],
          shape: F[Math.floor(Math.random() * F.length)],
          w: Math.random() * (u - b) + b,
          h: Math.random() * (u - b) * 0.75 + b * 0.5,
          opacity: 1,
          life: 0,
          maxLife: T
        });
      }
    }
    function $(f) {
      switch (a.save(), a.translate(f.x, f.y), a.rotate(f.angle), a.globalAlpha = f.opacity, a.fillStyle = f.color, f.shape) {
        case "square":
          a.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
          break;
        case "circle":
          a.beginPath(), a.arc(0, 0, f.w / 2, 0, Math.PI * 2), a.fill();
          break;
        case "triangle":
          a.beginPath(), a.moveTo(0, -f.h / 2), a.lineTo(f.w / 2, f.h / 2), a.lineTo(-f.w / 2, f.h / 2), a.closePath(), a.fill();
          break;
        case "strip":
          a.fillRect(-f.w, -f.h / 4, f.w * 2, f.h / 2);
          break;
      }
      a.restore();
    }
    function I(f) {
      const d = g.current ? Math.min(f - g.current, 50) : 16.67;
      g.current = f;
      const { trigger: x, particleCount: F, gravity: v, continuous: B, wind: w, emissionRate: C, onComplete: M } = o.current;
      if (x && !s.current && (q(F), c.current = !1), s.current = x, B && x) {
        n.current += C * d / 1e3;
        const b = Math.floor(n.current);
        b > 0 && (q(b), n.current -= b);
      }
      a.clearRect(0, 0, m, k);
      const p = d / 16.67;
      i.current = i.current.filter((b) => (b.vy += v * 0.3 * p, b.vx += w * 0.05 * p, b.x += b.vx * p, b.y += b.vy * p, b.angle += b.angularV * p, b.life += p, b.opacity = Math.max(0, 1 - b.life / b.maxLife), b.opacity <= 0 || b.y > k + 50 ? !1 : ($(b), !0))), a.globalAlpha = 1, !c.current && x && !B && i.current.length === 0 && s.current && (c.current = !0, M == null || M()), l.current = requestAnimationFrame(I);
    }
    return l.current = requestAnimationFrame(I), () => {
      Y.disconnect(), cancelAnimationFrame(l.current);
    };
  }, [r]);
}
const Ke = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"]
}, Qe = {
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
}, Ze = ["square", "circle", "triangle", "strip"], to = ht(
  (r, y) => {
    const {
      preset: o,
      palette: i,
      trigger: l = !1,
      particleCount: s,
      spread: c,
      gravity: g,
      colors: n,
      shapes: e,
      duration: h,
      continuous: t,
      wind: a,
      spawnX: m,
      spawnY: k,
      spawnSpread: W,
      speedMin: Y,
      speedMax: E,
      sizeMin: q,
      sizeMax: $,
      angularVelocity: I,
      emissionRate: f,
      onComplete: d,
      width: x,
      height: F,
      className: v,
      style: B
    } = r, w = o && Qe[o] || {}, C = i ?? w.palette ?? "monochrome", M = n ?? w.colors ?? Ke[C], p = X(null);
    return gt(y, () => p.current), Je(p, {
      trigger: l,
      particleCount: s ?? 150,
      spread: c ?? 0.8,
      gravity: g ?? w.gravity ?? 0.5,
      colors: M,
      shapes: e ?? w.shapes ?? Ze,
      duration: h ?? 4e3,
      continuous: t ?? !1,
      wind: a ?? w.wind ?? 0.5,
      spawnX: m ?? 0.5,
      spawnY: k ?? 0.4,
      spawnSpread: W ?? 60,
      speedMin: Y ?? 4,
      speedMax: E ?? w.speedMax ?? 16,
      sizeMin: q ?? 6,
      sizeMax: $ ?? 14,
      angularVelocity: I ?? 0.3,
      emissionRate: f ?? 10,
      onComplete: d
    }), /* @__PURE__ */ it(
      "div",
      {
        className: v,
        style: {
          width: x ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...B
        },
        children: /* @__PURE__ */ it("canvas", { ref: p, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
to.displayName = "Confetti";
function me(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function re(r, y, o) {
  return r + o * (y - r);
}
function Vt(r, y, o) {
  const i = r & 3, l = i < 2 ? y : o, s = i < 2 ? o : y;
  return (i & 1 ? -l : l) + (i & 2 ? -s : s);
}
const Yt = new Uint8Array(256);
for (let r = 0; r < 256; r++) Yt[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [Yt[r], Yt[y]] = [Yt[y], Yt[r]];
}
const It = new Uint8Array(512);
for (let r = 0; r < 512; r++) It[r] = Yt[r & 255];
function eo(r, y) {
  const o = Math.floor(r) & 255, i = Math.floor(y) & 255, l = r - Math.floor(r), s = y - Math.floor(y), c = me(l), g = me(s), n = It[It[o] + i], e = It[It[o] + i + 1], h = It[It[o + 1] + i], t = It[It[o + 1] + i + 1];
  return re(
    re(Vt(n, l, s), Vt(h, l - 1, s), c),
    re(Vt(e, l, s - 1), Vt(t, l - 1, s - 1), c),
    g
  );
}
function oo(r, y, o, i) {
  let l = 0, s = 1, c = 1, g = 0;
  for (let n = 0; n < o; n++)
    l += eo(r * c, y * c) * s, g += s, s *= i, c *= 2;
  return l / g;
}
function no(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0), s = X(null), c = X(null), g = X(null), n = X(0), e = X(0);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const t = h, a = t.parentElement;
    if (!a) return;
    const m = t.getContext("2d");
    let k = 0, W = 0;
    function Y(I, f) {
      const { resolution: d } = o.current, x = window.devicePixelRatio || 1, F = Math.max(0.05, Math.min(1, d));
      t.width = Math.round(I * x), t.height = Math.round(f * x), t.style.width = `${I}px`, t.style.height = `${f}px`, k = t.width, W = t.height;
      const v = Math.max(1, Math.round(k * F)), B = Math.max(1, Math.round(W * F));
      if (v !== n.current || B !== e.current) {
        n.current = v, e.current = B, s.current = new ImageData(v, B);
        const w = document.createElement("canvas");
        w.width = v, w.height = B;
        const C = w.getContext("2d");
        c.current = w, g.current = C;
      }
    }
    const E = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && Y(f, d);
    });
    E.observe(a);
    const q = a.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $(I) {
      const { colors: f, speed: d, scale: x, octaves: F, animated: v, blendMode: B, timeOffsetY: w, persistence: C } = o.current;
      if (f.length < 2) {
        i.current = requestAnimationFrame($);
        return;
      }
      v && (l.current = I * 1e-3 * d);
      const M = l.current, p = s.current, b = c.current, u = g.current;
      if (!p || !b || !u) {
        i.current = requestAnimationFrame($);
        return;
      }
      const R = n.current, S = e.current, L = p.data, T = x * 3 / R, P = x * 3 / S;
      for (let A = 0; A < S; A++) {
        const D = A * P;
        for (let z = 0; z < R; z++) {
          const O = oo(z * T + M, D + M * w, F, C), j = Math.max(0, Math.min(1, (O + 1) / 2)), [N, H, J] = xt(f, j), G = (A * R + z) * 4;
          L[G] = N, L[G + 1] = H, L[G + 2] = J, L[G + 3] = 255;
        }
      }
      u.putImageData(p, 0, 0), m.globalCompositeOperation = B || "source-over", m.imageSmoothingEnabled = !0, m.imageSmoothingQuality = "high", m.drawImage(b, 0, 0, k, W), v && (i.current = requestAnimationFrame($));
    }
    return i.current = requestAnimationFrame($), () => {
      E.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const ro = {
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
}, ao = ht(
  (r, y) => {
    const {
      preset: o,
      colors: i,
      speed: l,
      scale: s,
      octaves: c,
      animated: g,
      blendMode: n,
      timeOffsetY: e,
      persistence: h,
      resolution: t,
      width: a,
      height: m,
      className: k,
      style: W
    } = r, Y = o && ro[o] || {}, E = X(null);
    return gt(y, () => E.current), no(E, {
      colors: i ?? Y.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: l ?? Y.speed ?? 0.25,
      scale: s ?? Y.scale ?? 1,
      octaves: c ?? Y.octaves ?? 3,
      animated: g ?? !0,
      blendMode: n ?? "source-over",
      timeOffsetY: e ?? 0.5,
      persistence: h ?? 0.5,
      resolution: t ?? 0.25
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: { width: a ?? "100%", height: m ?? "100%", display: "block", overflow: "hidden", ...W },
        children: /* @__PURE__ */ it("canvas", { ref: E, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ao.displayName = "NoiseGradient";
function io(r, y, o) {
  const i = X(o);
  i.current = o;
  const l = X(0), s = X(o.trigger), c = X(0), g = X("idle"), n = X([]), e = X(!1);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const t = h, a = t.parentElement;
    if (!a) return;
    const m = t.getContext("2d");
    let k = 0, W = 0;
    function Y(f, d) {
      const { pixelSize: x, dissolvePattern: F } = i.current, v = Math.ceil(f / x), B = Math.ceil(d / x), w = v / 2, C = B / 2, M = [];
      for (let p = 0; p < B; p++)
        for (let b = 0; b < v; b++) {
          let u;
          F === "center" ? u = Math.sqrt((b - w) ** 2 + (p - C) ** 2) / Math.sqrt(w ** 2 + C ** 2) : F === "edges" ? u = 1 - Math.sqrt((b - w) ** 2 + (p - C) ** 2) / Math.sqrt(w ** 2 + C ** 2) : F === "horizontal" ? u = b / v : u = Math.random(), M.push({ x: b * x, y: p * x, delay: u });
        }
      M.sort((p, b) => p.delay - b.delay), n.current = M;
    }
    function E(f, d) {
      const x = window.devicePixelRatio || 1;
      t.width = Math.round(f * x), t.height = Math.round(d * x), t.style.width = `${f}px`, t.style.height = `${d}px`, m.scale(x, x), k = f, W = d, Y(f, d);
    }
    const q = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && E(d, x);
    });
    q.observe(a);
    const $ = a.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    function I() {
      const { trigger: f, speed: d, color: x, direction: F, pixelSize: v, onComplete: B, progressMultiplier: w } = i.current;
      f !== s.current && (s.current = f, f && (g.current = F === "in" ? "appearing" : "dissolving", c.current = 0, e.current = !1)), m.clearRect(0, 0, k, W);
      const C = n.current, M = g.current;
      if (M === "idle") {
        F === "out" && !f && (m.fillStyle = x, m.fillRect(0, 0, k, W)), l.current = requestAnimationFrame(I);
        return;
      }
      c.current = Math.min(c.current + d * w, 1);
      const p = c.current, b = p;
      if (m.fillStyle = x, M === "dissolving") {
        m.fillRect(0, 0, k, W);
        for (let u = 0; u < C.length; u++) {
          const R = C[u];
          u / C.length < b && m.clearRect(R.x, R.y, v, v);
        }
      } else if (M === "appearing")
        for (let u = 0; u < C.length; u++) {
          const R = C[u];
          u / C.length < b && m.fillRect(R.x, R.y, v, v);
        }
      p >= 1 && (F === "both" && M === "dissolving" ? (g.current = "appearing", c.current = 0) : (g.current = "idle", e.current || (e.current = !0, B == null || B()))), l.current = requestAnimationFrame(I);
    }
    return l.current = requestAnimationFrame(I), () => {
      q.disconnect(), cancelAnimationFrame(l.current);
    };
  }, [r]);
}
const so = ht(
  ({
    children: r,
    pixelSize: y = 8,
    speed: o = 0.5,
    direction: i = "out",
    trigger: l = !1,
    color: s = "#ffffff",
    onComplete: c,
    progressMultiplier: g = 0.01,
    dissolvePattern: n = "random",
    width: e,
    height: h,
    className: t,
    style: a
  }, m) => {
    const k = X(null), W = X(null);
    return gt(m, () => k.current), io(k, W, {
      pixelSize: y,
      speed: o,
      direction: i,
      trigger: l,
      color: s,
      onComplete: c,
      progressMultiplier: g,
      dissolvePattern: n
    }), /* @__PURE__ */ Be(
      "div",
      {
        className: t,
        style: { position: "relative", width: e ?? "100%", height: h ?? "100%", overflow: "hidden", ...a },
        children: [
          r && /* @__PURE__ */ it("div", { ref: W, style: { position: "absolute", inset: 0 }, children: r }),
          /* @__PURE__ */ it(
            "canvas",
            {
              ref: k,
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
so.displayName = "PixelDissolve";
const Ft = new Uint8Array(512), Ot = new Uint8Array(256);
for (let r = 0; r < 256; r++) Ot[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [Ot[r], Ot[y]] = [Ot[y], Ot[r]];
}
for (let r = 0; r < 512; r++) Ft[r] = Ot[r & 255];
function ye(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function ae(r, y, o) {
  return r + o * (y - r);
}
function _t(r, y, o) {
  const i = r & 3, l = i < 2 ? y : o, s = i < 2 ? o : y;
  return (i & 1 ? -l : l) + (i & 2 ? -s : s);
}
function we(r, y) {
  const o = Math.floor(r) & 255, i = Math.floor(y) & 255, l = r - Math.floor(r), s = y - Math.floor(y), c = ye(l), g = ye(s), n = Ft[Ft[o] + i], e = Ft[Ft[o] + i + 1], h = Ft[Ft[o + 1] + i], t = Ft[Ft[o + 1] + i + 1];
  return ae(
    ae(_t(n, l, s), _t(h, l - 1, s), c),
    ae(_t(e, l, s - 1), _t(t, l - 1, s - 1), c),
    g
  );
}
function lo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(0), c = X(null), g = X(null);
  ft(() => {
    var n;
    (n = c.current) == null || n.call(c);
  }, [y.particleCount]), ft(() => {
    const n = r.current;
    if (!n) return;
    const e = n.parentElement;
    if (!e) return;
    const h = n.getContext("2d");
    let t = 0, a = 0;
    function m() {
      const { colors: d } = o.current;
      return {
        x: Math.random() * t,
        y: Math.random() * a,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: d[Math.floor(Math.random() * d.length)]
      };
    }
    function k() {
      const { particleCount: d } = o.current;
      i.current = Array.from({ length: d }, m);
    }
    function W(d, x) {
      const F = r.current, v = window.devicePixelRatio || 1;
      F.width = Math.round(d * v), F.height = Math.round(x * v), F.style.width = `${d}px`, F.style.height = `${x}px`, h.scale(v, v), t = d, a = x, k();
    }
    c.current = () => {
      t > 0 && a > 0 && k();
    };
    function Y(d) {
      const x = n.getBoundingClientRect();
      return { x: d.clientX - x.left, y: d.clientY - x.top };
    }
    function E(d) {
      o.current.interactive && (g.current = Y(d));
    }
    function q() {
      g.current = null;
    }
    n.addEventListener("mousemove", E), n.addEventListener("mouseleave", q);
    const $ = new ResizeObserver((d) => {
      const { width: x, height: F } = d[0].contentRect;
      x > 0 && F > 0 && W(x, F);
    });
    $.observe(e);
    const I = e.getBoundingClientRect();
    I.width > 0 && I.height > 0 && W(I.width, I.height);
    function f() {
      const { speed: d, noiseScale: x, fadeStrength: F, lineWidth: v, backgroundColor: B, timeSpeed: w, curl: C, attractRadius: M, attractStrength: p } = o.current;
      s.current += w * 1e-3;
      const b = s.current;
      B && B !== "transparent" ? (h.fillStyle = B, h.globalAlpha = F, h.fillRect(0, 0, t, a), h.globalAlpha = 1) : (h.fillStyle = `rgba(0,0,0,${F})`, h.fillRect(0, 0, t, a));
      const u = i.current, R = g.current;
      for (let S = 0; S < u.length; S++) {
        const L = u[S], T = L.x * x, P = L.y * x, A = we(T + b, P + b * 0.7) * Math.PI * 4;
        let D = Math.cos(A), z = Math.sin(A);
        if (C) {
          const H = we(T + 100 + b, P + b * 0.7);
          D += -Math.sin(H * Math.PI * 2) * 0.5, z += Math.cos(H * Math.PI * 2) * 0.5;
        }
        const O = L.x, j = L.y;
        if (L.vx = L.vx * 0.9 + D * d * 0.1, L.vy = L.vy * 0.9 + z * d * 0.1, R) {
          const H = R.x - L.x, J = R.y - L.y, G = Math.sqrt(H * H + J * J);
          if (G < M && G > 0) {
            const U = (M - G) / M * p * 0.1;
            L.vx += H / G * U, L.vy += J / G * U;
          }
        }
        L.x += L.vx, L.y += L.vy, L.age++;
        const N = Math.max(0, 1 - L.age / L.maxAge) * 0.7;
        h.beginPath(), h.moveTo(O, j), h.lineTo(L.x, L.y), h.strokeStyle = L.color, h.globalAlpha = N, h.lineWidth = v, h.stroke(), h.globalAlpha = 1, (L.age > L.maxAge || L.x < 0 || L.x > t || L.y < 0 || L.y > a) && (i.current[S] = m());
      }
      l.current = requestAnimationFrame(f);
    }
    return l.current = requestAnimationFrame(f), () => {
      $.disconnect(), cancelAnimationFrame(l.current), n.removeEventListener("mousemove", E), n.removeEventListener("mouseleave", q);
    };
  }, [r]);
}
const co = {
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
}, uo = ht(
  (r, y) => {
    const {
      preset: o,
      particleCount: i,
      colors: l,
      speed: s,
      noiseScale: c,
      trailLength: g,
      fadeStrength: n,
      lineWidth: e,
      backgroundColor: h,
      animated: t,
      timeSpeed: a,
      curl: m,
      interactive: k,
      attractRadius: W,
      attractStrength: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && co[o] || {}, d = X(null);
    return gt(y, () => d.current), lo(d, {
      particleCount: i ?? f.particleCount ?? 800,
      colors: l ?? f.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: s ?? f.speed ?? 1,
      noiseScale: c ?? f.noiseScale ?? 4e-3,
      trailLength: g ?? 0.04,
      fadeStrength: n ?? 0.04,
      lineWidth: e ?? 1,
      backgroundColor: h ?? f.backgroundColor ?? "#111111",
      animated: t ?? !0,
      timeSpeed: a ?? 1,
      curl: m ?? f.curl ?? !1,
      interactive: k ?? !1,
      attractRadius: W ?? 100,
      attractStrength: Y ?? 3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: { width: E ?? "100%", height: q ?? "100%", display: "block", overflow: "hidden", ...I },
        children: /* @__PURE__ */ it("canvas", { ref: d, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
uo.displayName = "FlowField";
function ie(r, y) {
  const o = r.replace("#", "");
  return o.length === 3 ? `rgba(${parseInt(o[0] + o[0], 16)},${parseInt(o[1] + o[1], 16)},${parseInt(o[2] + o[2], 16)},${y})` : o.length === 6 ? `rgba(${parseInt(o.slice(0, 2), 16)},${parseInt(o.slice(2, 4), 16)},${parseInt(o.slice(4, 6), 16)},${y})` : r;
}
function fo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null), s = X({ x: -1, y: -1 });
  ft(() => {
    const c = r.current;
    if (!c) return;
    const g = c.parentElement;
    if (!g) return;
    const n = c.getContext("2d");
    let e = 0, h = 0;
    function t(E, q) {
      const $ = r.current, I = window.devicePixelRatio || 1;
      $.width = Math.round(E * I), $.height = Math.round(q * I), $.style.width = `${E}px`, $.style.height = `${q}px`, n.scale(I, I), e = E, h = q;
    }
    const a = new ResizeObserver((E) => {
      const { width: q, height: $ } = E[0].contentRect;
      q > 0 && $ > 0 && t(q, $);
    });
    a.observe(g);
    const m = g.getBoundingClientRect();
    m.width > 0 && m.height > 0 && t(m.width, m.height);
    function k(E) {
      if (!o.current.interactive) return;
      const q = r.current.getBoundingClientRect();
      l.current = { x: E.clientX - q.left, y: E.clientY - q.top };
    }
    function W() {
      l.current = null;
    }
    g.addEventListener("mousemove", k), g.addEventListener("mouseleave", W);
    function Y() {
      const {
        radius: E,
        color: q,
        overlayColor: $,
        overlayOpacity: I,
        edgeSoftness: f,
        followSpeed: d,
        glowColor: x,
        glowSize: F,
        showGlow: v,
        shape: B,
        ellipseRatio: w,
        defaultX: C,
        defaultY: M
      } = o.current, p = l.current ? l.current.x : e * C, b = l.current ? l.current.y : h * M;
      s.current.x < 0 ? s.current = { x: p, y: b } : (s.current.x += (p - s.current.x) * d, s.current.y += (b - s.current.y) * d);
      const u = s.current.x, R = s.current.y, S = E, L = B === "ellipse" ? E * w : E;
      if (n.clearRect(0, 0, e, h), n.fillStyle = $, n.globalAlpha = I, n.fillRect(0, 0, e, h), n.globalAlpha = 1, v) {
        n.save(), n.translate(u, R), n.scale(1, L / S);
        const D = n.createRadialGradient(0, 0, S * 0.8, 0, 0, S + F);
        D.addColorStop(0, ie(x, 0.25)), D.addColorStop(1, ie(x, 0)), n.fillStyle = D, n.beginPath(), n.arc(0, 0, S + F, 0, Math.PI * 2), n.fill(), n.restore();
      }
      n.globalCompositeOperation = "destination-out", n.save(), n.translate(u, R), n.scale(1, L / S);
      const T = S * (1 - f * 0.5), P = S + S * f, A = n.createRadialGradient(0, 0, T, 0, 0, P);
      if (A.addColorStop(0, "rgba(0,0,0,1)"), A.addColorStop(1, "rgba(0,0,0,0)"), n.fillStyle = A, n.beginPath(), n.arc(0, 0, P, 0, Math.PI * 2), n.fill(), n.restore(), n.globalCompositeOperation = "source-over", q && q !== "#ffffff") {
        n.save(), n.globalAlpha = 0.15;
        const D = n.createRadialGradient(u, R, 0, u, R, S);
        D.addColorStop(0, q), D.addColorStop(1, ie(q, 0)), n.fillStyle = D, n.beginPath(), n.ellipse(u, R, S, L, 0, 0, Math.PI * 2), n.fill(), n.restore();
      }
      i.current = requestAnimationFrame(Y);
    }
    return i.current = requestAnimationFrame(Y), () => {
      a.disconnect(), cancelAnimationFrame(i.current), g.removeEventListener("mousemove", k), g.removeEventListener("mouseleave", W);
    };
  }, [r]);
}
const ho = {
  default: {
    radius: 120,
    overlayColor: "#000000",
    overlayOpacity: 0.75,
    edgeSoftness: 0.4,
    followSpeed: 0.1,
    showGlow: !0,
    glowColor: "#6b7280",
    glowSize: 30
  },
  soft: {
    radius: 160,
    overlayOpacity: 0.6,
    edgeSoftness: 0.8,
    followSpeed: 0.06,
    showGlow: !1
  },
  dramatic: {
    radius: 90,
    overlayOpacity: 0.92,
    edgeSoftness: 0.15,
    followSpeed: 0.15,
    showGlow: !0,
    glowColor: "#ffffff",
    glowSize: 20
  },
  neon: {
    radius: 110,
    overlayColor: "#050010",
    overlayOpacity: 0.85,
    edgeSoftness: 0.3,
    followSpeed: 0.12,
    showGlow: !0,
    glowColor: "#0891B2",
    glowSize: 50
  },
  ellipse: {
    radius: 120,
    overlayOpacity: 0.78,
    edgeSoftness: 0.35,
    shape: "ellipse",
    ellipseRatio: 0.55,
    showGlow: !0,
    glowColor: "#7C3AED",
    glowSize: 25
  }
}, go = ht(
  (r, y) => {
    const {
      preset: o,
      radius: i,
      color: l,
      overlayColor: s,
      overlayOpacity: c,
      edgeSoftness: g,
      followSpeed: n,
      glowColor: e,
      glowSize: h,
      showGlow: t,
      shape: a,
      ellipseRatio: m,
      interactive: k,
      defaultX: W,
      defaultY: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && ho[o] || {}, d = X(null);
    return gt(y, () => d.current), fo(d, {
      radius: i ?? f.radius ?? 120,
      color: l ?? f.color ?? "#ffffff",
      overlayColor: s ?? f.overlayColor ?? "#000000",
      overlayOpacity: c ?? f.overlayOpacity ?? 0.75,
      edgeSoftness: g ?? f.edgeSoftness ?? 0.4,
      followSpeed: n ?? f.followSpeed ?? 0.1,
      glowColor: e ?? f.glowColor ?? "#6b7280",
      glowSize: h ?? f.glowSize ?? 30,
      showGlow: t ?? f.showGlow ?? !0,
      shape: a ?? f.shape ?? "circle",
      ellipseRatio: m ?? f.ellipseRatio ?? 0.6,
      interactive: k ?? !0,
      defaultX: W ?? 0.5,
      defaultY: Y ?? 0.5
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: { width: E ?? "100%", height: q ?? "100%", display: "block", overflow: "hidden", position: "relative", ...I },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
go.displayName = "Spotlight";
function po(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X({ w: 0, h: 0 }), c = (g, n) => {
    const { color: e, secondaryColor: h, ringCount: t, ringSpacing: a, speed: m, maxRadius: k, lineWidth: W } = o.current;
    for (let Y = 0; Y < t; Y++) {
      const E = Y % 2 === 1;
      i.current.push({
        x: g,
        y: n,
        radius: Y * a,
        maxRadius: k + Y * a * 0.5,
        opacity: 1,
        color: E ? h : e,
        lineWidth: W * (1 - Y * 0.15),
        speed: m * (1 + Y * 0.05)
      });
    }
  };
  return ft(() => {
    if (!y.autoFire) return;
    const g = setInterval(() => {
      const { w: n, h: e } = s.current;
      n === 0 || e === 0 || c(n * (0.3 + Math.random() * 0.4), e * (0.3 + Math.random() * 0.4));
    }, y.autoInterval);
    return () => clearInterval(g);
  }, [y.autoFire, y.autoInterval]), ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    function h(W, Y) {
      const E = r.current, q = window.devicePixelRatio || 1;
      E.width = Math.round(W * q), E.height = Math.round(Y * q), E.style.width = `${W}px`, E.style.height = `${Y}px`, e.scale(q, q), s.current = { w: W, h: Y };
    }
    const t = new ResizeObserver((W) => {
      const { width: Y, height: E } = W[0].contentRect;
      Y > 0 && E > 0 && h(Y, E);
    });
    t.observe(n);
    const a = n.getBoundingClientRect();
    a.width > 0 && a.height > 0 && h(a.width, a.height);
    function m(W) {
      const Y = r.current.getBoundingClientRect();
      c(W.clientX - Y.left, W.clientY - Y.top);
    }
    n.addEventListener("click", m);
    function k() {
      const { backgroundColor: W, glowEffect: Y, glowBlur: E, fadeSpeed: q } = o.current, { w: $, h: I } = s.current;
      e.clearRect(0, 0, $, I), W && W !== "transparent" && (e.fillStyle = W, e.fillRect(0, 0, $, I));
      const f = [];
      for (const d of i.current)
        d.radius += d.speed, d.opacity -= q, !(d.opacity <= 0 || d.radius > d.maxRadius) && (f.push(d), e.beginPath(), e.arc(d.x, d.y, d.radius, 0, Math.PI * 2), e.strokeStyle = d.color, e.globalAlpha = d.opacity, e.lineWidth = d.lineWidth * d.opacity, Y ? (e.shadowColor = d.color, e.shadowBlur = E) : e.shadowBlur = 0, e.stroke(), e.globalAlpha = 1, e.shadowBlur = 0);
      i.current = f, l.current = requestAnimationFrame(k);
    }
    return l.current = requestAnimationFrame(k), () => {
      t.disconnect(), cancelAnimationFrame(l.current), n.removeEventListener("click", m);
    };
  }, [r]), { fire: c };
}
const mo = {
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
}, yo = ht(
  (r, y) => {
    const {
      preset: o,
      color: i,
      secondaryColor: l,
      ringCount: s,
      ringSpacing: c,
      speed: g,
      maxRadius: n,
      lineWidth: e,
      fadeSpeed: h,
      autoFire: t,
      autoInterval: a,
      glowEffect: m,
      glowBlur: k,
      backgroundColor: W,
      width: Y,
      height: E,
      className: q,
      style: $
    } = r, I = o && mo[o] || {}, f = X(null);
    return gt(y, () => f.current), po(f, {
      color: i ?? I.color ?? "#ffffff",
      secondaryColor: l ?? I.secondaryColor ?? "#6b7280",
      ringCount: s ?? I.ringCount ?? 3,
      ringSpacing: c ?? I.ringSpacing ?? 20,
      speed: g ?? I.speed ?? 4,
      maxRadius: n ?? I.maxRadius ?? 200,
      lineWidth: e ?? I.lineWidth ?? 2,
      fadeSpeed: h ?? I.fadeSpeed ?? 0.02,
      autoFire: t ?? !0,
      autoInterval: a ?? 2e3,
      glowEffect: m ?? I.glowEffect ?? !0,
      glowBlur: k ?? I.glowBlur ?? 15,
      backgroundColor: W ?? I.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: q,
        style: { width: Y ?? "100%", height: E ?? "100%", display: "block", overflow: "hidden", ...$ },
        children: /* @__PURE__ */ it("canvas", { ref: f, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
yo.displayName = "Shockwave";
const wo = 400;
function vo(r, y) {
  const o = r.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (o) return `rgba(${o[1]},${o[2]},${o[3]},${y})`;
  if (r.startsWith("#")) {
    const i = r.slice(1), l = i.length === 3 ? i.split("").map((n) => n + n).join("") : i, s = parseInt(l.slice(0, 2), 16), c = parseInt(l.slice(2, 4), 16), g = parseInt(l.slice(4, 6), 16);
    return `rgba(${s},${c},${g},${y})`;
  }
  return `rgba(0,0,0,${y})`;
}
function bo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X(null), n = X(/* @__PURE__ */ new Map()), e = (h) => {
    const { colors: t, shellSpeed: a } = o.current, m = r.current;
    if (!m) return;
    const k = m.clientWidth || m.width, W = m.clientHeight || m.height, Y = h ?? k * 0.2 + Math.random() * k * 0.6;
    l.current.push({
      x: Y,
      y: W,
      vx: (Math.random() - 0.5) * 2,
      vy: -(a + Math.random() * 3),
      targetY: W * 0.15 + Math.random() * W * 0.35,
      color: t[Math.floor(Math.random() * t.length)],
      exploded: !1
    });
  };
  return ft(() => {
    const h = r.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(v, B) {
      const { starCount: w } = o.current;
      s.current = Array.from({ length: w }, () => ({
        x: Math.random() * v,
        y: Math.random() * B,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function Y(v, B) {
      const w = r.current, C = window.devicePixelRatio || 1;
      w.width = Math.round(v * C), w.height = Math.round(B * C), w.style.width = `${v}px`, w.style.height = `${B}px`, a.scale(C, C), m = v, k = B, W(v, B);
    }
    const E = new ResizeObserver((v) => {
      const { width: B, height: w } = v[0].contentRect;
      B > 0 && w > 0 && Y(B, w);
    });
    E.observe(t);
    const q = t.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $(v) {
      const B = r.current.getBoundingClientRect();
      e(v.clientX - B.left);
    }
    t.addEventListener("click", $);
    function I() {
      const { autoLaunch: v, autoInterval: B } = o.current;
      v && (g.current = setTimeout(() => {
        e(), I();
      }, B * (0.7 + Math.random() * 0.6)));
    }
    I();
    function f(v) {
      const { colors: B, particleCount: w, spread: C, particleSize: M } = o.current, p = wo - i.current.length;
      if (p <= 0) return;
      const b = Math.min(w, p);
      for (let u = 0; u < b; u++) {
        const R = Math.PI * 2 * u / b + (Math.random() - 0.5) * 0.5, S = C * (0.4 + Math.random() * 0.6), L = Math.random() < 0.15 ? B[Math.floor(Math.random() * B.length)] : v.color;
        i.current.push({
          x: v.x,
          y: v.y,
          vx: Math.cos(R) * S,
          vy: Math.sin(R) * S,
          alpha: 1,
          color: L,
          size: M * (0.5 + Math.random() * 0.8)
        });
      }
    }
    let d = y.starCount;
    function x() {
      const { starCount: v, starColor: B, glowingStars: w, starGlowBlur: C } = o.current;
      v !== d && (d = v, W(m, k));
      const M = s.current;
      if (M.length !== 0) {
        a.fillStyle = B;
        for (const p of M)
          w && p.isGlowing || (a.globalAlpha = p.opacity, a.beginPath(), a.arc(p.x, p.y, p.r, 0, Math.PI * 2), a.fill());
        if (w) {
          a.shadowColor = B, a.shadowBlur = C;
          for (const p of M)
            p.isGlowing && (a.globalAlpha = p.opacity * 0.12, a.beginPath(), a.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2), a.fill(), a.globalAlpha = p.opacity * 0.35, a.beginPath(), a.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2), a.fill(), a.globalAlpha = p.opacity, a.beginPath(), a.arc(p.x, p.y, p.r * 1.5, 0, Math.PI * 2), a.fill());
          a.shadowBlur = 0, a.shadowColor = "rgba(0,0,0,0)";
        }
        a.globalAlpha = 1;
      }
    }
    function F() {
      const { gravity: v, friction: B, fadeSpeed: w, glowEffect: C, glowBlur: M, backgroundColor: p, trailLength: b } = o.current;
      if (!p || p === "transparent")
        a.clearRect(0, 0, m, k);
      else {
        const T = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, b)));
        a.fillStyle = vo(p, T), a.fillRect(0, 0, m, k);
      }
      x();
      let R = 0;
      for (let T = 0; T < l.current.length; T++) {
        const P = l.current[T];
        if (P.x += P.vx, P.y += P.vy, P.vy += v * 0.3, P.y <= P.targetY && !P.exploded) {
          P.exploded = !0, f(P);
          continue;
        }
        P.exploded || (l.current[R++] = P, a.beginPath(), a.arc(P.x, P.y, 2, 0, Math.PI * 2), a.fillStyle = P.color, a.globalAlpha = 0.9, C && (a.shadowColor = P.color, a.shadowBlur = 6), a.fill(), a.shadowBlur = 0);
      }
      l.current.length = R;
      const S = n.current;
      S.forEach((T) => T.length = 0);
      let L = 0;
      for (let T = 0; T < i.current.length; T++) {
        const P = i.current[T];
        if (P.vx *= B, P.vy *= B, P.vy += v, P.x += P.vx, P.y += P.vy, P.alpha -= w, P.alpha <= 0) continue;
        i.current[L++] = P;
        let A = S.get(P.color);
        A || (A = [], S.set(P.color, A)), A.push(P);
      }
      i.current.length = L, C && (a.shadowBlur = M);
      for (const [T, P] of S)
        if (P.length !== 0) {
          a.fillStyle = T, C && (a.shadowColor = T);
          for (let A = 0; A < P.length; A++) {
            const D = P[A];
            a.globalAlpha = D.alpha, a.beginPath(), a.arc(D.x, D.y, Math.max(0.5, D.size * D.alpha), 0, Math.PI * 2), a.fill();
          }
        }
      a.globalAlpha = 1, a.shadowBlur = 0, c.current = requestAnimationFrame(F);
    }
    return c.current = requestAnimationFrame(F), () => {
      E.disconnect(), cancelAnimationFrame(c.current), t.removeEventListener("click", $), g.current && clearTimeout(g.current);
    };
  }, [r]), { launch: e };
}
const Co = {
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
}, Mo = ht(
  (r, y) => {
    const {
      preset: o,
      colors: i,
      particleCount: l,
      gravity: s,
      friction: c,
      fadeSpeed: g,
      particleSize: n,
      trailLength: e,
      spread: h,
      autoLaunch: t,
      autoInterval: a,
      glowEffect: m,
      glowBlur: k,
      backgroundColor: W,
      shellSpeed: Y,
      starCount: E,
      starColor: q,
      glowingStars: $,
      starGlowBlur: I,
      width: f,
      height: d,
      className: x,
      style: F
    } = r, v = o && Co[o] || {}, B = X(null);
    return gt(y, () => B.current), bo(B, {
      colors: i ?? v.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: l ?? v.particleCount ?? 80,
      gravity: s ?? v.gravity ?? 0.08,
      friction: c ?? v.friction ?? 0.97,
      fadeSpeed: g ?? v.fadeSpeed ?? 0.015,
      particleSize: n ?? v.particleSize ?? 2,
      trailLength: e ?? v.trailLength ?? 6,
      spread: h ?? v.spread ?? 5,
      autoLaunch: t ?? !0,
      autoInterval: a ?? 1800,
      glowEffect: m ?? v.glowEffect ?? !0,
      glowBlur: k ?? v.glowBlur ?? 8,
      backgroundColor: W ?? v.backgroundColor ?? "#111111",
      shellSpeed: Y ?? v.shellSpeed ?? 12,
      starCount: E ?? 80,
      starColor: q ?? "#ffffff",
      glowingStars: $ ?? !1,
      starGlowBlur: I ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: x,
        style: { width: f ?? "100%", height: d ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Mo.displayName = "Fireworks";
function xo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0), s = X(0), c = X(!1), g = X(0), n = X(0), e = X(0), h = X(0);
  ft(() => {
    const t = r.current;
    if (!t) return;
    const a = t.parentElement;
    if (!a) return;
    const m = t.getContext("2d");
    let k = 0, W = 0;
    function Y(I, f) {
      const d = r.current, x = window.devicePixelRatio || 1;
      d.width = Math.round(I * x), d.height = Math.round(f * x), d.style.width = `${I}px`, d.style.height = `${f}px`, m.scale(x, x), k = I, W = f;
    }
    const E = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && Y(f, d);
    });
    E.observe(a);
    const q = a.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $() {
      const {
        animated: I,
        intensity: f,
        speed: d,
        rgbShift: x,
        scanlines: F,
        scanlineOpacity: v,
        scanlineSpacing: B,
        blockGlitch: w,
        blockCount: C,
        noiseOpacity: M,
        flickerRate: p,
        color: b,
        rgbShiftColor: u,
        backgroundColor: R
      } = o.current, S = wt(u), [L, T, P] = S.split(",").map(Number), A = `${255 - L},${255 - T},${255 - P}`;
      if (m.clearRect(0, 0, k, W), R && R !== "transparent" && (m.fillStyle = R, m.fillRect(0, 0, k, W)), F) {
        for (let H = 0; H < W; H += B) {
          const J = v * (H % (B * 2) === 0 ? 1.2 : 0.7);
          m.fillStyle = "rgba(0,0,0,1)", m.globalAlpha = Math.min(1, J), m.fillRect(0, H, k, 1);
        }
        m.globalAlpha = 1;
      }
      if (!I) {
        i.current = requestAnimationFrame($);
        return;
      }
      const D = 16;
      l.current += d * 0.016, h.current += d * 0.02, s.current -= D, s.current <= 0 && (c.current ? (c.current = !1, s.current = (800 + Math.random() * 2e3) / d) : (c.current = Math.random() < f, g.current = 80 + Math.random() * 300, s.current = g.current)), n.current -= D, n.current <= 0 && (n.current = 100 + Math.random() * 300 / d);
      const z = n.current < 40 && Math.random() < f * 0.4, O = c.current || z;
      if (e.current > 0 ? (e.current -= D, m.globalCompositeOperation = "difference", m.fillStyle = "rgba(255,255,255,1)", m.globalAlpha = Math.min(1, e.current / 30), m.fillRect(0, 0, k, W), m.globalCompositeOperation = "source-over", m.globalAlpha = 1) : O && Math.random() < 5e-3 * f && (e.current = 30 + Math.random() * 60), Math.random() < p * (O ? 4 : 1)) {
        const H = O ? 0.08 : 0.02;
        m.fillStyle = `rgba(255,255,255,${H})`, m.fillRect(0, 0, k, W);
      }
      if (O && Math.random() < 0.03 * f && (m.fillStyle = "rgba(0,0,0,0.4)", m.fillRect(0, 0, k, W)), M > 0) {
        const H = m.createImageData(k, W), J = O ? 1.8 : 1;
        for (let G = 0; G < H.data.length; G += 4) {
          const U = Math.random() * 255 | 0;
          H.data[G] = U, H.data[G + 1] = U, H.data[G + 2] = U, H.data[G + 3] = Math.random() < M * J ? 60 : 0;
        }
        m.putImageData(H, 0, 0);
      }
      if (O) {
        const H = c.current ? 1 - s.current / g.current : 0.4;
        if (x > 0) {
          const V = x * f * H * (0.5 + Math.random() * 1.5), _ = Math.sin(h.current * 3) * V * 0.3;
          m.globalCompositeOperation = "screen", m.fillStyle = `rgba(${S},0.06)`, m.globalAlpha = 0.5 + H * 0.4, m.fillRect(V + _, 0, k, W), m.fillStyle = `rgba(${A},0.06)`, m.fillRect(-(V + _), 0, k, W);
          const Q = Math.random() * W, ot = 5 + Math.random() * 40, K = V * (1 + Math.random() * 3);
          m.fillStyle = `rgba(${S},0.12)`, m.globalAlpha = 0.7, m.fillRect(K, Q, k, ot), m.fillStyle = `rgba(${A},0.12)`, m.fillRect(-K, Q + 1, k, ot), m.globalCompositeOperation = "source-over", m.globalAlpha = 1;
        }
        if (w) {
          const V = Math.ceil(C * H * (1 + Math.random() * 2));
          for (let _ = 0; _ < V; _++) {
            const Q = Math.random() * W, ot = 1 + Math.random() * (O ? 30 : 12), K = Math.max(x * 2, 20) * f * H, et = (Math.random() - 0.5) * K * 2;
            try {
              const tt = m.getImageData(0, Q, k, ot);
              m.putImageData(tt, et, Q);
            } catch {
            }
          }
        }
        const J = Math.floor(Math.random() * 4 * H);
        for (let V = 0; V < J; V++) {
          const _ = Math.random() * W, Q = 1 + Math.random() * 3, ot = Math.random() < 0.5 ? "0,255,0" : "255,140,0";
          m.fillStyle = `rgba(${ot},0.15)`, m.globalAlpha = 0.4 + Math.random() * 0.4, m.fillRect(0, _, k, Q);
        }
        if (m.globalAlpha = 1, Math.random() < 0.15 * f * H) {
          const V = Math.random() * k, _ = 1 + Math.random() * 4, Q = (Math.random() - 0.5) * 20 * f;
          try {
            const ot = m.getImageData(V, 0, _, W);
            m.putImageData(ot, V, Q);
          } catch {
          }
        }
        const G = Math.floor(Math.random() * W), U = 1 + Math.random() * 3;
        if (m.fillStyle = b, m.globalAlpha = 0.2 * f * H, m.fillRect(0, G, k, U), m.globalAlpha = 1, Math.random() < 0.04 * f) {
          const V = Math.random() * k * 0.7, _ = Math.random() * W, Q = 20 + Math.random() * k * 0.3, ot = 2 + Math.random() * 20, K = m.createImageData(Q, ot);
          for (let et = 0; et < K.data.length; et += 4)
            K.data[et] = Math.random() * 255 | 0, K.data[et + 1] = Math.random() * 255 | 0, K.data[et + 2] = Math.random() * 255 | 0, K.data[et + 3] = 180;
          m.putImageData(K, V, _);
        }
      }
      const j = Math.max(k, W) * (O ? 0.65 : 0.75), N = m.createRadialGradient(k / 2, W / 2, W * 0.3, k / 2, W / 2, j);
      N.addColorStop(0, "rgba(0,0,0,0)"), N.addColorStop(1, `rgba(0,0,0,${O ? 0.5 : 0.35})`), m.fillStyle = N, m.fillRect(0, 0, k, W), i.current = requestAnimationFrame($);
    }
    return i.current = requestAnimationFrame($), () => {
      E.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const Ro = {
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
}, So = ht(
  (r, y) => {
    const {
      preset: o,
      intensity: i,
      speed: l,
      rgbShift: s,
      scanlines: c,
      scanlineOpacity: g,
      scanlineSpacing: n,
      blockGlitch: e,
      blockCount: h,
      noiseOpacity: t,
      flickerRate: a,
      color: m,
      rgbShiftColor: k,
      animated: W,
      backgroundColor: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && Ro[o] || {}, d = X(null);
    return gt(y, () => d.current), xo(d, {
      intensity: i ?? f.intensity ?? 0.6,
      speed: l ?? f.speed ?? 1,
      rgbShift: s ?? f.rgbShift ?? 8,
      scanlines: c ?? f.scanlines ?? !0,
      scanlineOpacity: g ?? f.scanlineOpacity ?? 0.08,
      scanlineSpacing: n ?? f.scanlineSpacing ?? 2,
      blockGlitch: e ?? f.blockGlitch ?? !0,
      blockCount: h ?? f.blockCount ?? 4,
      noiseOpacity: t ?? f.noiseOpacity ?? 0.02,
      flickerRate: a ?? f.flickerRate ?? 0.02,
      color: m ?? f.color ?? "#ffffff",
      rgbShiftColor: k ?? f.rgbShiftColor ?? "#ff0000",
      animated: W ?? !0,
      backgroundColor: Y ?? f.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: { width: E ?? "100%", height: q ?? "100%", display: "block", overflow: "hidden", position: "relative", ...I },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
So.displayName = "GlitchOverlay";
function ko(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0), s = (c) => {
    const g = Array.isArray(c) ? c : [c], { series: n, maxPoints: e } = o.current;
    g.forEach((h, t) => {
      n[t] && (n[t].data.push(h), n[t].data.length > e && n[t].data.shift());
    });
  };
  return ft(() => {
    const c = r.current;
    if (!c) return;
    const g = c.parentElement;
    if (!g) return;
    const n = c.getContext("2d");
    let e = 0, h = 0;
    function t(W, Y) {
      const E = r.current, q = window.devicePixelRatio || 1;
      E.width = Math.round(W * q), E.height = Math.round(Y * q), E.style.width = `${W}px`, E.style.height = `${Y}px`, n.scale(q, q), e = W, h = Y;
    }
    const a = new ResizeObserver((W) => {
      const { width: Y, height: E } = W[0].contentRect;
      Y > 0 && E > 0 && t(Y, E);
    });
    a.observe(g);
    const m = g.getBoundingClientRect();
    m.width > 0 && m.height > 0 && t(m.width, m.height);
    function k() {
      const {
        series: W,
        lineWidth: Y,
        showGrid: E,
        gridColor: q,
        gridOpacity: $,
        showDots: I,
        dotRadius: f,
        fillOpacity: d,
        backgroundColor: x,
        padding: F,
        yMin: v,
        yMax: B,
        smooth: w,
        glowEffect: C,
        glowBlur: M
      } = o.current;
      l.current += 0.06, n.clearRect(0, 0, e, h), x && x !== "transparent" && (n.fillStyle = x, n.fillRect(0, 0, e, h));
      const p = 36, b = F, u = b + p, R = e - u - b, S = h - b * 2 - 20, L = b;
      let T = v ?? 1 / 0, P = B ?? -1 / 0;
      if (v === void 0 || B === void 0) {
        for (const j of W)
          for (const N of j.data)
            v === void 0 && N < T && (T = N), B === void 0 && N > P && (P = N);
        T === 1 / 0 && (T = 0), P === -1 / 0 && (P = 1), T === P && (T -= 1, P += 1);
        const O = P - T;
        T -= O * 0.1, P += O * 0.1;
      }
      const A = P - T || 1, D = (O, j) => u + O / Math.max(j - 1, 1) * R, z = (O) => L + S - (O - T) / A * S;
      if (E) {
        n.setLineDash([3, 5]), n.lineWidth = 1;
        for (let j = 0; j <= 5; j++) {
          const N = L + j / 5 * S, H = P - j / 5 * A;
          n.strokeStyle = q, n.globalAlpha = $, n.beginPath(), n.moveTo(u, N), n.lineTo(u + R, N), n.stroke(), n.globalAlpha = 0.6, n.fillStyle = q, n.font = "10px system-ui, sans-serif", n.textAlign = "right", n.textBaseline = "middle";
          const J = Math.abs(H) >= 1e3 ? (H / 1e3).toFixed(1) + "k" : H.toFixed(Math.abs(H) < 10 ? 1 : 0);
          n.fillText(J, u - 4, N);
        }
        n.setLineDash([]), n.globalAlpha = 1, n.strokeStyle = q, n.globalAlpha = $ * 1.5, n.lineWidth = 1, n.beginPath(), n.moveTo(u, L), n.lineTo(u, L + S), n.lineTo(u + R, L + S), n.stroke(), n.globalAlpha = 1;
      }
      for (const O of W) {
        if (O.data.length < 2) continue;
        const j = O.data.length;
        if (n.beginPath(), w) {
          n.moveTo(D(0, j), z(O.data[0]));
          for (let G = 1; G < j - 1; G++) {
            const U = (D(G - 1, j) + D(G, j)) / 2, V = (z(O.data[G - 1]) + z(O.data[G])) / 2;
            n.quadraticCurveTo(D(G - 1, j), z(O.data[G - 1]), U, V);
          }
          n.lineTo(D(j - 1, j), z(O.data[j - 1]));
        } else {
          n.moveTo(D(0, j), z(O.data[0]));
          for (let G = 1; G < j; G++) n.lineTo(D(G, j), z(O.data[G]));
        }
        if (C && (n.shadowColor = O.color, n.shadowBlur = M), n.strokeStyle = O.color, n.lineWidth = Y, n.lineJoin = "round", n.lineCap = "round", n.stroke(), n.shadowBlur = 0, O.filled !== !1) {
          const G = new Path2D();
          if (w) {
            G.moveTo(D(0, j), z(O.data[0]));
            for (let V = 1; V < j - 1; V++) {
              const _ = (D(V - 1, j) + D(V, j)) / 2, Q = (z(O.data[V - 1]) + z(O.data[V])) / 2;
              G.quadraticCurveTo(D(V - 1, j), z(O.data[V - 1]), _, Q);
            }
            G.lineTo(D(j - 1, j), z(O.data[j - 1]));
          } else {
            G.moveTo(D(0, j), z(O.data[0]));
            for (let V = 1; V < j; V++) G.lineTo(D(V, j), z(O.data[V]));
          }
          G.lineTo(D(j - 1, j), L + S), G.lineTo(D(0, j), L + S), G.closePath(), n.save(), n.beginPath(), n.rect(u, L, R, S), n.clip();
          const U = n.createLinearGradient(0, L, 0, L + S);
          U.addColorStop(0, O.color + "88"), U.addColorStop(0.5, O.color + "33"), U.addColorStop(1, O.color + "00"), n.fillStyle = U, n.globalAlpha = d, n.fill(G), n.globalAlpha = 1, n.restore();
        }
        if (I && j > 1) {
          for (let G = 0; G < j - 1; G++)
            n.beginPath(), n.arc(D(G, j), z(O.data[G]), f * 0.6, 0, Math.PI * 2), n.fillStyle = O.color, n.globalAlpha = 0.4, n.fill();
          n.globalAlpha = 1;
        }
        const N = D(j - 1, j), H = z(O.data[j - 1]), J = Math.sin(l.current) * 0.5 + 0.5;
        C && (n.shadowColor = O.color, n.shadowBlur = M * 0.8), n.beginPath(), n.arc(N, H, f * (1.5 + J * 1.5), 0, Math.PI * 2), n.strokeStyle = O.color, n.lineWidth = 1, n.globalAlpha = 0.6 * (1 - J), n.stroke(), n.shadowBlur = 0, n.globalAlpha = 1, n.beginPath(), n.arc(N, H, f, 0, Math.PI * 2), n.fillStyle = "#ffffff", n.globalAlpha = 0.9, n.fill(), n.beginPath(), n.arc(N, H, f * 0.6, 0, Math.PI * 2), n.fillStyle = O.color, n.globalAlpha = 1, n.fill(), O.label && (n.font = "bold 11px system-ui, sans-serif", n.fillStyle = O.color, n.textAlign = "left", n.textBaseline = "bottom", n.globalAlpha = 0.85, n.fillText(O.label, N + f + 3, H - 2), n.globalAlpha = 1);
      }
      i.current = requestAnimationFrame(k);
    }
    return i.current = requestAnimationFrame(k), () => {
      a.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]), { push: s };
}
const Eo = {
  default: {
    lineWidth: 2,
    showGrid: !0,
    gridColor: "#ffffff",
    gridOpacity: 0.08,
    showDots: !1,
    fillOpacity: 1,
    smooth: !0,
    glowEffect: !0,
    glowBlur: 8,
    backgroundColor: "#111111"
  },
  neon: {
    lineWidth: 2.5,
    showGrid: !0,
    gridColor: "#7C3AED",
    gridOpacity: 0.15,
    showDots: !0,
    fillOpacity: 0.8,
    smooth: !0,
    glowEffect: !0,
    glowBlur: 20,
    backgroundColor: "#000000"
  },
  minimal: {
    lineWidth: 1.5,
    showGrid: !1,
    showDots: !1,
    fillOpacity: 0.6,
    smooth: !0,
    glowEffect: !1,
    backgroundColor: "transparent"
  },
  ocean: {
    lineWidth: 2,
    showGrid: !0,
    gridColor: "#0891B2",
    gridOpacity: 0.1,
    fillOpacity: 0.9,
    smooth: !0,
    glowEffect: !0,
    glowBlur: 10,
    backgroundColor: "#020f1a"
  },
  fire: {
    lineWidth: 2.5,
    showGrid: !0,
    gridColor: "#f97316",
    gridOpacity: 0.08,
    fillOpacity: 0.85,
    smooth: !1,
    glowEffect: !0,
    glowBlur: 15,
    backgroundColor: "#0c0000"
  }
}, Po = ht(
  (r, y) => {
    const {
      preset: o,
      series: i,
      maxPoints: l,
      animated: s,
      lineWidth: c,
      showGrid: g,
      gridColor: n,
      gridOpacity: e,
      showDots: h,
      dotRadius: t,
      fillOpacity: a,
      backgroundColor: m,
      padding: k,
      yMin: W,
      yMax: Y,
      smooth: E,
      glowEffect: q,
      glowBlur: $,
      scrollSpeed: I,
      width: f,
      height: d,
      className: x,
      style: F
    } = r, v = o && Eo[o] || {}, B = [
      { data: Array.from({ length: 30 }, (C, M) => Math.sin(M * 0.3) * 50 + 50), color: "#ffffff", filled: !0 },
      { data: Array.from({ length: 30 }, (C, M) => Math.cos(M * 0.4) * 30 + 50), color: "#6b7280", filled: !0 }
    ], w = X(null);
    return gt(y, () => w.current), ko(w, {
      series: i ?? B,
      maxPoints: l ?? 100,
      animated: s ?? !0,
      lineWidth: c ?? v.lineWidth ?? 2,
      showGrid: g ?? v.showGrid ?? !0,
      gridColor: n ?? v.gridColor ?? "#ffffff",
      gridOpacity: e ?? v.gridOpacity ?? 0.08,
      showDots: h ?? v.showDots ?? !1,
      dotRadius: t ?? 3,
      fillOpacity: a ?? v.fillOpacity ?? 1,
      backgroundColor: m ?? v.backgroundColor ?? "#111111",
      padding: k ?? 20,
      yMin: W,
      yMax: Y,
      smooth: E ?? v.smooth ?? !0,
      glowEffect: q ?? v.glowEffect ?? !0,
      glowBlur: $ ?? v.glowBlur ?? 8,
      scrollSpeed: I ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: x,
        style: { width: f ?? "100%", height: d ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: w, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Po.displayName = "LiveChart";
function Ao(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const c = s.parentElement;
    if (!c) return;
    const g = s.getContext("2d");
    let n = 0, e = 0;
    function h(W, Y) {
      const E = r.current, q = window.devicePixelRatio || 1;
      E.width = Math.round(W * q), E.height = Math.round(Y * q), E.style.width = `${W}px`, E.style.height = `${Y}px`, g.scale(q, q), n = W, e = Y;
    }
    const t = new ResizeObserver((W) => {
      const { width: Y, height: E } = W[0].contentRect;
      Y > 0 && E > 0 && h(Y, E);
    });
    t.observe(c);
    const a = c.getBoundingClientRect();
    a.width > 0 && a.height > 0 && h(a.width, a.height);
    function m(W, Y, E, q, $, I, f, d, x, F, v, B, w) {
      const C = 6 + q * 2, M = q / 8 * Math.PI * 2, p = $ * (1 + q * 0.15);
      for (let b = 0; b < f; b++) {
        const u = b / f * Math.PI * 2;
        for (let R = 0; R < (d ? 2 : 1); R++) {
          g.save(), g.translate(W, Y), g.rotate(u + (R === 1 ? Math.PI / f : 0)), R === 1 && g.scale(1, -1), g.beginPath();
          for (let S = 0; S <= C * 3; S++) {
            const L = S / (C * 3) * Math.PI * 2, T = w * Math.sin(L * 3 + p + M), P = E * (0.5 + 0.5 * Math.abs(Math.sin(L * (C / 2) + p * 0.5))), A = (P + T * E * 0.15) * Math.cos(L), D = (P + T * E * 0.1) * Math.sin(L);
            S === 0 ? g.moveTo(A, D) : g.lineTo(A, D);
          }
          g.closePath(), F && (g.shadowColor = I, g.shadowBlur = v), g.strokeStyle = I, g.lineWidth = x * (1 - q * 0.08), g.globalAlpha = B * (1 - q * 0.1), g.stroke(), g.shadowBlur = 0, g.globalAlpha = 1, g.restore();
        }
      }
    }
    function k() {
      const {
        symmetry: W,
        colors: Y,
        lineWidth: E,
        speed: q,
        layers: $,
        radius: I,
        backgroundColor: f,
        animated: d,
        glowEffect: x,
        glowBlur: F,
        strokeOpacity: v,
        mirror: B,
        noiseAmount: w
      } = o.current;
      d && (l.current += q * 5e-3);
      const C = l.current;
      g.clearRect(0, 0, n, e), f && f !== "transparent" && (g.fillStyle = f, g.fillRect(0, 0, n, e));
      const M = n / 2, p = e / 2, b = Math.min(n, e) * 0.45 * I;
      for (let u = 0; u < $; u++) {
        const R = b * (1 - u * (0.85 / $)), S = Y[u % Y.length];
        m(M, p, R, u, C + u * 0.3, S, W, B, E, x, F, v, w);
      }
      i.current = requestAnimationFrame(k);
    }
    return i.current = requestAnimationFrame(k), () => {
      t.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const Bo = {
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
}, Io = ht(
  (r, y) => {
    const {
      preset: o,
      symmetry: i,
      colors: l,
      lineWidth: s,
      speed: c,
      layers: g,
      radius: n,
      backgroundColor: e,
      animated: h,
      glowEffect: t,
      glowBlur: a,
      strokeOpacity: m,
      mirror: k,
      noiseAmount: W,
      width: Y,
      height: E,
      className: q,
      style: $
    } = r, I = o && Bo[o] || {}, f = X(null);
    return gt(y, () => f.current), Ao(f, {
      symmetry: i ?? I.symmetry ?? 8,
      colors: l ?? I.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: s ?? I.lineWidth ?? 1.5,
      speed: c ?? I.speed ?? 1,
      layers: g ?? I.layers ?? 5,
      radius: n ?? 1,
      backgroundColor: e ?? I.backgroundColor ?? "#111111",
      animated: h ?? !0,
      glowEffect: t ?? I.glowEffect ?? !0,
      glowBlur: a ?? I.glowBlur ?? 10,
      strokeOpacity: m ?? I.strokeOpacity ?? 0.8,
      mirror: k ?? I.mirror ?? !0,
      noiseAmount: W ?? I.noiseAmount ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: q,
        style: { width: Y ?? "100%", height: E ?? "100%", display: "block", overflow: "hidden", ...$ },
        children: /* @__PURE__ */ it("canvas", { ref: f, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Io.displayName = "Mandala";
function Fo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(null), s = X(0), c = X(0);
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a() {
      const { count: f, radius: d } = o.current;
      i.current = Array.from({ length: f }, () => {
        const x = h * 0.2 + Math.random() * h * 0.6, F = t * 0.2 + Math.random() * t * 0.6;
        return {
          x,
          y: F,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: d * (0.7 + Math.random() * 0.6),
          baseX: x,
          baseY: F
        };
      });
    }
    function m(f, d) {
      const x = r.current, F = window.devicePixelRatio || 1;
      x.width = Math.round(f * F), x.height = Math.round(d * F), x.style.width = `${f}px`, x.style.height = `${d}px`, e.scale(F, F), h = f, t = d, a();
    }
    const k = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && m(d, x);
    });
    k.observe(n);
    const W = n.getBoundingClientRect();
    W.width > 0 && W.height > 0 && m(W.width, W.height);
    function Y(f) {
      const d = r.current.getBoundingClientRect();
      l.current = { x: f.clientX - d.left, y: f.clientY - d.top };
    }
    function E() {
      l.current = null;
    }
    n.addEventListener("mousemove", Y), n.addEventListener("mouseleave", E);
    function q(f) {
      const d = f.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return d ? { r: parseInt(d[1], 16), g: parseInt(d[2], 16), b: parseInt(d[3], 16) } : null;
    }
    function $(f, d, x, F) {
      const v = i.current;
      if (v.length) {
        e.globalCompositeOperation = "source-over";
        for (let B = 0; B < v.length; B++) {
          const w = v[B], C = f[B % f.length], M = w.radius * d, p = q(C);
          x && (e.shadowColor = C, e.shadowBlur = F), e.globalCompositeOperation = "screen";
          const b = e.createRadialGradient(w.x, w.y, M * 0.5, w.x, w.y, M * 1.4);
          b.addColorStop(0, p ? `rgba(${p.r},${p.g},${p.b},0.18)` : C + "30"), b.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = b, e.beginPath(), e.arc(w.x, w.y, M * 1.4, 0, Math.PI * 2), e.fill();
          const u = e.createRadialGradient(
            w.x - M * 0.25,
            w.y - M * 0.25,
            0,
            // offset center for 3D feel
            w.x,
            w.y,
            M
          );
          u.addColorStop(0, p ? `rgba(${Math.min(255, p.r + 80)},${Math.min(255, p.g + 80)},${Math.min(255, p.b + 80)},0.95)` : C), u.addColorStop(0.35, p ? `rgba(${p.r},${p.g},${p.b},0.85)` : C + "d9"), u.addColorStop(0.7, p ? `rgba(${Math.max(0, p.r - 40)},${Math.max(0, p.g - 40)},${Math.max(0, p.b - 40)},0.6)` : C + "99"), u.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = u, e.beginPath(), e.arc(w.x, w.y, M, 0, Math.PI * 2), e.fill();
          const R = w.x - M * 0.28, S = w.y - M * 0.28, L = M * 0.35, T = e.createRadialGradient(R, S, 0, R, S, L);
          T.addColorStop(0, "rgba(255,255,255,0.45)"), T.addColorStop(1, "rgba(255,255,255,0)"), e.fillStyle = T, e.beginPath(), e.arc(R, S, L, 0, Math.PI * 2), e.fill(), e.shadowBlur = 0;
        }
        e.globalCompositeOperation = "source-over";
      }
    }
    function I() {
      const {
        speed: f,
        magnetStrength: d,
        magnetRadius: x,
        threshold: F,
        colors: v,
        glowEffect: B,
        glowBlur: w,
        backgroundColor: C,
        animated: M,
        followMouse: p,
        wanderStrength: b
      } = o.current;
      M && (c.current += 0.016);
      const u = c.current;
      e.clearRect(0, 0, h, t), C && C !== "transparent" && (e.fillStyle = C, e.fillRect(0, 0, h, t));
      const R = i.current, S = l.current;
      for (let L = 0; L < R.length; L++) {
        const T = R[L], P = Math.sin(u * f * 0.5 + L * 1.3) * Math.PI * 2;
        if (T.vx += Math.cos(P) * b * 0.05, T.vy += Math.sin(P) * b * 0.05, S && p) {
          const A = S.x - T.x, D = S.y - T.y, z = Math.sqrt(A * A + D * D) || 1;
          if (z < x) {
            const O = (1 - z / x) * d;
            T.vx += A / z * O, T.vy += D / z * O;
          }
        }
        for (let A = L + 1; A < R.length; A++) {
          const D = R[A], z = D.x - T.x, O = D.y - T.y, j = Math.sqrt(z * z + O * O) || 1, N = (T.radius + D.radius) * 0.8;
          if (j < N * 2) {
            const H = 2e-3 * (1 - j / (N * 2));
            T.vx += z / j * H, T.vy += O / j * H, D.vx -= z / j * H, D.vy -= O / j * H;
          }
        }
        T.vx *= 0.92, T.vy *= 0.92, T.vx = Math.max(-4, Math.min(4, T.vx)), T.vy = Math.max(-4, Math.min(4, T.vy)), T.x += T.vx, T.y += T.vy, T.x < T.radius && (T.x = T.radius, T.vx *= -0.5), T.x > h - T.radius && (T.x = h - T.radius, T.vx *= -0.5), T.y < T.radius && (T.y = T.radius, T.vy *= -0.5), T.y > t - T.radius && (T.y = t - T.radius, T.vy *= -0.5);
      }
      $(v, F, B, w), s.current = requestAnimationFrame(I);
    }
    return s.current = requestAnimationFrame(I), () => {
      k.disconnect(), cancelAnimationFrame(s.current), n.removeEventListener("mousemove", Y), n.removeEventListener("mouseleave", E);
    };
  }, [r]);
}
const $o = {
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
}, To = ht(
  (r, y) => {
    const {
      preset: o,
      count: i,
      colors: l,
      radius: s,
      speed: c,
      magnetStrength: g,
      magnetRadius: n,
      threshold: e,
      glowEffect: h,
      glowBlur: t,
      backgroundColor: a,
      animated: m,
      followMouse: k,
      wanderStrength: W,
      width: Y,
      height: E,
      className: q,
      style: $
    } = r, I = o && $o[o] || {}, f = X(null);
    return gt(y, () => f.current), Fo(f, {
      count: i ?? I.count ?? 5,
      colors: l ?? I.colors ?? ["#ffffff", "#6b7280"],
      radius: s ?? I.radius ?? 80,
      speed: c ?? I.speed ?? 1,
      magnetStrength: g ?? I.magnetStrength ?? 0.08,
      magnetRadius: n ?? I.magnetRadius ?? 150,
      threshold: e ?? I.threshold ?? 1.8,
      glowEffect: h ?? I.glowEffect ?? !0,
      glowBlur: t ?? I.glowBlur ?? 20,
      backgroundColor: a ?? I.backgroundColor ?? "#111111",
      animated: m ?? I.animated ?? !0,
      followMouse: k ?? I.followMouse ?? !0,
      wanderStrength: W ?? I.wanderStrength ?? 0.4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: q,
        style: { width: Y ?? "100%", height: E ?? "100%", display: "block", overflow: "hidden", ...$ },
        children: /* @__PURE__ */ it("canvas", { ref: f, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
To.displayName = "MagneticBlob";
function Lo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X(0), c = X(null), g = X(!1), n = X(0), e = X(null);
  ft(() => {
    var h;
    (h = e.current) == null || h.call(e);
  }, [y.cols, y.rows]), ft(() => {
    const h = r.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(F, v) {
      const { cols: B, rows: w, spacing: C } = o.current, M = (F - (B - 1) * C) / 2, p = v * 0.08, b = [], u = [];
      for (let R = 0; R < w; R++)
        for (let S = 0; S < B; S++) {
          const L = M + S * C, T = p + R * C;
          b.push({
            x: L,
            y: T,
            px: L,
            py: T,
            pinned: R === 0 && (S % Math.ceil(B / 5) === 0 || S === B - 1)
          });
          const P = R * B + S;
          S > 0 && u.push({ a: P - 1, b: P, length: C }), R > 0 && u.push({ a: P - B, b: P, length: C });
        }
      i.current = b, l.current = u;
    }
    function Y(F, v) {
      const B = r.current, w = window.devicePixelRatio || 1;
      B.width = Math.round(F * w), B.height = Math.round(v * w), B.style.width = `${F}px`, B.style.height = `${v}px`, a.scale(w, w), m = F, k = v, W(m, k);
    }
    e.current = () => {
      m > 0 && k > 0 && W(m, k);
    };
    const E = new ResizeObserver((F) => {
      const { width: v, height: B } = F[0].contentRect;
      v > 0 && B > 0 && Y(v, B);
    });
    E.observe(t);
    const q = t.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $(F) {
      const v = r.current.getBoundingClientRect();
      c.current = { x: F.clientX - v.left, y: F.clientY - v.top };
    }
    function I() {
      g.current = !0;
    }
    function f() {
      g.current = !1;
    }
    function d() {
      c.current = null, g.current = !1;
    }
    t.addEventListener("mousemove", $), t.addEventListener("mousedown", I), t.addEventListener("mouseup", f), t.addEventListener("mouseleave", d);
    function x() {
      const {
        gravity: F,
        friction: v,
        stiffness: B,
        iterations: w,
        lineColor: C,
        pinColor: M,
        lineWidth: p,
        backgroundColor: b,
        wind: u,
        windSpeed: R,
        tearable: S,
        tearDistance: L,
        interactive: T,
        mouseRadius: P,
        mouseForce: A,
        showPins: D
      } = o.current;
      n.current += 0.016;
      const z = n.current;
      a.clearRect(0, 0, m, k), b && b !== "transparent" && (a.fillStyle = b, a.fillRect(0, 0, m, k));
      const O = i.current, j = c.current, N = u * Math.sin(z * R) * 0.1;
      for (const H of O) {
        if (H.pinned) continue;
        const J = (H.x - H.px) * v, G = (H.y - H.py) * v;
        if (H.px = H.x, H.py = H.y, H.x += J + N, H.y += G + F, j && T) {
          const U = H.x - j.x, V = H.y - j.y, _ = Math.sqrt(U * U + V * V) || 1;
          if (_ < P) {
            const Q = (1 - _ / P) * A;
            if (g.current)
              if (S)
                for (let ot = l.current.length - 1; ot >= 0; ot--) {
                  const K = l.current[ot], et = O[K.a], tt = O[K.b];
                  (Math.sqrt((et.x - j.x) ** 2 + (et.y - j.y) ** 2) < P * 0.5 || Math.sqrt((tt.x - j.x) ** 2 + (tt.y - j.y) ** 2) < P * 0.5) && l.current.splice(ot, 1);
                }
              else
                H.x += U / _ * Q * 2, H.y += V / _ * Q * 2;
            else
              H.x += U / _ * Q, H.y += V / _ * Q;
          }
        }
        H.y > k && (H.y = k, H.py = H.y + G * 0.3), H.x < 0 && (H.x = 0, H.px = H.x - J * 0.3), H.x > m && (H.x = m, H.px = H.x - J * 0.3);
      }
      for (let H = 0; H < w; H++)
        for (let J = l.current.length - 1; J >= 0; J--) {
          const G = l.current[J], U = O[G.a], V = O[G.b], _ = V.x - U.x, Q = V.y - U.y, ot = Math.sqrt(_ * _ + Q * Q) || 1e-3;
          if (S && ot > L * G.length) {
            l.current.splice(J, 1);
            continue;
          }
          const K = (ot - G.length) / ot * B * 0.5, et = _ * K, tt = Q * K;
          U.pinned || (U.x += et, U.y += tt), V.pinned || (V.x -= et, V.y -= tt);
        }
      a.strokeStyle = C, a.lineWidth = p, a.beginPath();
      for (const H of l.current) {
        const J = O[H.a], G = O[H.b];
        a.moveTo(J.x, J.y), a.lineTo(G.x, G.y);
      }
      if (a.stroke(), D) {
        a.fillStyle = M;
        for (const H of O)
          H.pinned && (a.beginPath(), a.arc(H.x, H.y, 4, 0, Math.PI * 2), a.fill());
      }
      s.current = requestAnimationFrame(x);
    }
    return s.current = requestAnimationFrame(x), () => {
      E.disconnect(), cancelAnimationFrame(s.current), t.removeEventListener("mousemove", $), t.removeEventListener("mousedown", I), t.removeEventListener("mouseup", f), t.removeEventListener("mouseleave", d);
    };
  }, [r]);
}
const zo = {
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
}, Do = ht(
  (r, y) => {
    const {
      preset: o,
      cols: i,
      rows: l,
      spacing: s,
      gravity: c,
      friction: g,
      stiffness: n,
      iterations: e,
      lineColor: h,
      pinColor: t,
      lineWidth: a,
      backgroundColor: m,
      wind: k,
      windSpeed: W,
      tearable: Y,
      tearDistance: E,
      interactive: q,
      mouseRadius: $,
      mouseForce: I,
      showPins: f,
      width: d,
      height: x,
      className: F,
      style: v
    } = r, B = o && zo[o] || {}, w = X(null);
    return gt(y, () => w.current), Lo(w, {
      cols: i ?? B.cols ?? 25,
      rows: l ?? B.rows ?? 20,
      spacing: s ?? B.spacing ?? 18,
      gravity: c ?? B.gravity ?? 0.4,
      friction: g ?? B.friction ?? 0.99,
      stiffness: n ?? B.stiffness ?? 1,
      iterations: e ?? B.iterations ?? 3,
      lineColor: h ?? B.lineColor ?? "#6b7280",
      pinColor: t ?? B.pinColor ?? "#ffffff",
      lineWidth: a ?? B.lineWidth ?? 1,
      backgroundColor: m ?? B.backgroundColor ?? "#111111",
      wind: k ?? B.wind ?? 0.3,
      windSpeed: W ?? B.windSpeed ?? 0.5,
      tearable: Y ?? B.tearable ?? !1,
      tearDistance: E ?? B.tearDistance ?? 3,
      interactive: q ?? !0,
      mouseRadius: $ ?? 30,
      mouseForce: I ?? 5,
      showPins: f ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: { width: d ?? "100%", height: x ?? "100%", display: "block", overflow: "hidden", ...v },
        children: /* @__PURE__ */ it("canvas", { ref: w, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Do.displayName = "ClothSimulation";
function dt(r, y, o) {
  return Math.min(r, o - 1) + Math.min(y, o - 1) * o;
}
function se(r, y, o, i, l, s) {
  const c = s * l * r * r, g = 1 + 4 * c;
  for (let n = 0; n < 4; n++) {
    for (let e = 1; e < r - 1; e++)
      for (let h = 1; h < r - 1; h++)
        o[dt(h, e, r)] = (i[dt(h, e, r)] + c * (o[dt(h - 1, e, r)] + o[dt(h + 1, e, r)] + o[dt(h, e - 1, r)] + o[dt(h, e + 1, r)])) / g;
    zt(r, y, o);
  }
}
function le(r, y, o, i, l, s, c) {
  const g = c * r;
  for (let n = 1; n < r - 1; n++)
    for (let e = 1; e < r - 1; e++) {
      let h = e - g * l[dt(e, n, r)], t = n - g * s[dt(e, n, r)];
      h = Math.max(0.5, Math.min(r - 1.5, h)), t = Math.max(0.5, Math.min(r - 1.5, t));
      const a = Math.floor(h), m = a + 1, k = Math.floor(t), W = k + 1, Y = h - a, E = 1 - Y, q = t - k, $ = 1 - q;
      o[dt(e, n, r)] = E * ($ * i[dt(a, k, r)] + q * i[dt(a, W, r)]) + Y * ($ * i[dt(m, k, r)] + q * i[dt(m, W, r)]);
    }
  zt(r, y, o);
}
function ve(r, y, o, i, l) {
  const s = 1 / r;
  for (let c = 1; c < r - 1; c++)
    for (let g = 1; g < r - 1; g++)
      l[dt(g, c, r)] = -0.5 * s * (y[dt(g + 1, c, r)] - y[dt(g - 1, c, r)] + o[dt(g, c + 1, r)] - o[dt(g, c - 1, r)]), i[dt(g, c, r)] = 0;
  zt(r, 0, l), zt(r, 0, i);
  for (let c = 0; c < 4; c++) {
    for (let g = 1; g < r - 1; g++)
      for (let n = 1; n < r - 1; n++)
        i[dt(n, g, r)] = (l[dt(n, g, r)] + i[dt(n - 1, g, r)] + i[dt(n + 1, g, r)] + i[dt(n, g - 1, r)] + i[dt(n, g + 1, r)]) / 4;
    zt(r, 0, i);
  }
  for (let c = 1; c < r - 1; c++)
    for (let g = 1; g < r - 1; g++)
      y[dt(g, c, r)] -= 0.5 * (i[dt(g + 1, c, r)] - i[dt(g - 1, c, r)]) / s, o[dt(g, c, r)] -= 0.5 * (i[dt(g, c + 1, r)] - i[dt(g, c - 1, r)]) / s;
  zt(r, 1, y), zt(r, 2, o);
}
function zt(r, y, o) {
  for (let i = 1; i < r - 1; i++)
    o[dt(0, i, r)] = y === 1 ? -o[dt(1, i, r)] : o[dt(1, i, r)], o[dt(r - 1, i, r)] = y === 1 ? -o[dt(r - 2, i, r)] : o[dt(r - 2, i, r)], o[dt(i, 0, r)] = y === 2 ? -o[dt(i, 1, r)] : o[dt(i, 1, r)], o[dt(i, r - 1, r)] = y === 2 ? -o[dt(i, r - 2, r)] : o[dt(i, r - 2, r)];
  o[dt(0, 0, r)] = 0.5 * (o[dt(1, 0, r)] + o[dt(0, 1, r)]), o[dt(r - 1, 0, r)] = 0.5 * (o[dt(r - 2, 0, r)] + o[dt(r - 1, 1, r)]), o[dt(0, r - 1, r)] = 0.5 * (o[dt(1, r - 1, r)] + o[dt(0, r - 2, r)]), o[dt(r - 1, r - 1, r)] = 0.5 * (o[dt(r - 2, r - 1, r)] + o[dt(r - 1, r - 2, r)]);
}
function qo(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null), s = X(null), c = X(0);
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    const a = Math.max(32, Math.min(128, y.resolution)), m = a * a;
    let k = new Float32Array(m), W = new Float32Array(m), Y = new Float32Array(m), E = new Float32Array(m), q = new Float32Array(m), $ = new Float32Array(m), I = new Float32Array(m), f = new Float32Array(m), d = new Float32Array(m), x = new Float32Array(m), F = new Float32Array(m), v = new Float32Array(m), B = null;
    const w = document.createElement("canvas");
    w.width = a, w.height = a;
    const C = w.getContext("2d");
    function M(P, A) {
      const D = r.current, z = window.devicePixelRatio || 1;
      D.width = Math.round(P * z), D.height = Math.round(A * z), D.style.width = `${P}px`, D.style.height = `${A}px`, e.scale(z, z), e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "high", h = P, t = A, B = C.createImageData(a, a);
    }
    const p = new ResizeObserver((P) => {
      const { width: A, height: D } = P[0].contentRect;
      A > 0 && D > 0 && M(A, D);
    });
    p.observe(n);
    const b = n.getBoundingClientRect();
    b.width > 0 && b.height > 0 && M(b.width, b.height);
    function u(P, A, D, z, O, j, N, H, J) {
      const G = Math.max(1, Math.floor(J));
      for (let U = -G; U <= G; U++)
        for (let V = -G; V <= G; V++) {
          const _ = P + V, Q = A + U;
          if (_ < 1 || _ >= a - 1 || Q < 1 || Q >= a - 1) continue;
          const ot = Math.sqrt(V * V + U * U);
          if (ot > G) continue;
          const K = 1 - ot / G, et = dt(_, Q, a);
          q[et] += O * K, $[et] += j * K, I[et] += N * K, k[et] += D * H * K, W[et] += z * H * K;
        }
    }
    function R(P) {
      const A = r.current.getBoundingClientRect(), D = P.clientX - A.left, z = P.clientY - A.top, O = l.current;
      l.current = {
        x: D,
        y: z,
        px: O ? O.x : D,
        py: O ? O.y : z
      };
    }
    function S() {
      l.current = null;
    }
    n.addEventListener("mousemove", R), n.addEventListener("mouseleave", S);
    function L() {
      const { autoInk: P, autoInkInterval: A } = o.current;
      P && (s.current = setTimeout(() => {
        const { inkColors: D } = o.current, z = D[c.current % D.length];
        c.current++;
        const O = wt(z).split(",").map(Number), j = Math.floor(a * 0.2 + Math.random() * a * 0.6), N = Math.floor(a * 0.2 + Math.random() * a * 0.6), H = Math.random() * Math.PI * 2;
        u(j, N, Math.cos(H) * 2, Math.sin(H) * 2, O[0] / 255, O[1] / 255, O[2] / 255, 3, 3), L();
      }, A * (0.6 + Math.random() * 0.8)));
    }
    L();
    function T() {
      const { viscosity: P, diffusion: A, dissipation: D, inkColors: z, backgroundColor: O, mouseForce: j, inkRadius: N } = o.current, H = 0.016, J = l.current;
      if (J) {
        const U = Math.floor(J.x / h * a), V = Math.floor(J.y / t * a), _ = (J.x - J.px) * 0.5, Q = (J.y - J.py) * 0.5, ot = z[c.current % z.length], K = wt(ot).split(",").map(Number);
        u(U, V, _, Q, K[0] / 255, K[1] / 255, K[2] / 255, j, N), Math.abs(_) + Math.abs(Q) > 0.5 && c.current++, J.px = J.x, J.py = J.y;
      }
      Y.set(k), E.set(W), se(a, 1, k, Y, P, H), se(a, 2, W, E, P, H), ve(a, k, W, F, v), Y.set(k), E.set(W), le(a, 1, k, Y, Y, E, H), le(a, 2, W, E, Y, E, H), ve(a, k, W, F, v);
      for (const [U, V] of [[q, f], [$, d], [I, x]]) {
        V.set(U), se(a, 0, U, V, A, H), V.set(U), le(a, 0, U, V, k, W, H);
        for (let _ = 0; _ < m; _++)
          U[_] = Math.max(0, U[_] * D), V[_] = 0;
      }
      for (let U = 0; U < m; U++)
        Y[U] = 0, E[U] = 0;
      if (!B) {
        i.current = requestAnimationFrame(T);
        return;
      }
      const G = B.data;
      for (let U = 0; U < a; U++)
        for (let V = 0; V < a; V++) {
          const _ = dt(V, U, a), Q = (U * a + V) * 4;
          G[Q] = Math.min(255, q[_] * 255), G[Q + 1] = Math.min(255, $[_] * 255), G[Q + 2] = Math.min(255, I[_] * 255), G[Q + 3] = Math.min(255, (q[_] + $[_] + I[_]) * 200);
        }
      e.clearRect(0, 0, h, t), O && O !== "transparent" && (e.fillStyle = O, e.fillRect(0, 0, h, t)), C.putImageData(B, 0, 0), e.drawImage(w, 0, 0, h, t), i.current = requestAnimationFrame(T);
    }
    return i.current = requestAnimationFrame(T), () => {
      p.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousemove", R), n.removeEventListener("mouseleave", S), s.current && clearTimeout(s.current);
    };
  }, [r, y.resolution]);
}
const Wo = {
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
}, Yo = ht(
  (r, y) => {
    const {
      preset: o,
      resolution: i,
      viscosity: l,
      diffusion: s,
      dissipation: c,
      inkColors: g,
      glowEffect: n,
      glowBlur: e,
      backgroundColor: h,
      autoInk: t,
      autoInkInterval: a,
      mouseForce: m,
      inkRadius: k,
      width: W,
      height: Y,
      className: E,
      style: q
    } = r, $ = o && Wo[o] || {}, I = X(null);
    return gt(y, () => I.current), qo(I, {
      resolution: i ?? $.resolution ?? 128,
      viscosity: l ?? $.viscosity ?? 1e-4,
      diffusion: s ?? $.diffusion ?? 1e-4,
      dissipation: c ?? $.dissipation ?? 0.995,
      inkColors: g ?? $.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: n ?? $.glowEffect ?? !0,
      glowBlur: e ?? $.glowBlur ?? 0,
      backgroundColor: h ?? $.backgroundColor ?? "#111111",
      autoInk: t ?? $.autoInk ?? !0,
      autoInkInterval: a ?? $.autoInkInterval ?? 1500,
      mouseForce: m ?? $.mouseForce ?? 5,
      inkRadius: k ?? $.inkRadius ?? 4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: E,
        style: { width: W ?? "100%", height: Y ?? "100%", display: "block", overflow: "hidden", ...q },
        children: /* @__PURE__ */ it("canvas", { ref: I, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Yo.displayName = "FluidSimulation";
const Oo = [
  [0.35, 0.25, 0.5],
  // background — slow, dim, thin
  [0.65, 0.55, 0.75],
  // midground
  [1, 1, 1]
  // foreground — fast, bright, full
];
function Go(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X(0), n = X(null);
  ft(() => {
    var e;
    (e = n.current) == null || e.call(n);
  }, [y.dropCount]), ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const t = e.getContext("2d");
    let a = 0, m = 0;
    function k(x = !1) {
      const { speed: F, dropLength: v, dropOpacity: B, dropWidth: w } = o.current, C = Math.floor(Math.random() * 3), [M, p, b] = Oo[C];
      return {
        x: Math.random() * (a + 100) - 50,
        y: x ? Math.random() * m : -v * 2 - Math.random() * m * 0.5,
        speed: F * M * (0.7 + Math.random() * 0.6),
        length: v * b * (0.6 + Math.random() * 0.8),
        opacity: B * p * (0.5 + Math.random() * 0.5),
        width: w * b * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer: C
      };
    }
    function W() {
      i.current = Array.from({ length: o.current.dropCount }, () => k(!0)), l.current = [];
    }
    function Y(x, F) {
      const { starCount: v } = o.current;
      s.current = Array.from({ length: v }, () => ({
        x: Math.random() * x,
        y: Math.random() * F,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function E(x, F) {
      const v = window.devicePixelRatio || 1;
      e.width = Math.round(x * v), e.height = Math.round(F * v), e.style.width = `${x}px`, e.style.height = `${F}px`, t.scale(v, v), a = x, m = F, W(), Y(x, F);
    }
    n.current = () => {
      a > 0 && m > 0 && W();
    };
    const q = new ResizeObserver((x) => {
      const { width: F, height: v } = x[0].contentRect;
      F > 0 && v > 0 && E(F, v);
    });
    q.observe(h);
    const $ = h.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    let I = y.starCount;
    function f() {
      const { starCount: x, starColor: F, glowingStars: v, starGlowBlur: B } = o.current;
      x !== I && (I = x, Y(a, m));
      const w = s.current;
      if (w.length !== 0) {
        t.fillStyle = F;
        for (const C of w)
          v && C.isGlowing || (t.globalAlpha = C.opacity, t.beginPath(), t.arc(C.x, C.y, C.r, 0, Math.PI * 2), t.fill());
        if (v) {
          t.shadowColor = F, t.shadowBlur = B;
          for (const C of w)
            C.isGlowing && (t.globalAlpha = C.opacity * 0.12, t.beginPath(), t.arc(C.x, C.y, C.r * 5, 0, Math.PI * 2), t.fill(), t.globalAlpha = C.opacity * 0.35, t.beginPath(), t.arc(C.x, C.y, C.r * 2.5, 0, Math.PI * 2), t.fill(), t.globalAlpha = C.opacity, t.beginPath(), t.arc(C.x, C.y, C.r * 1.5, 0, Math.PI * 2), t.fill());
          t.shadowBlur = 0, t.shadowColor = "rgba(0,0,0,0)";
        }
        t.globalAlpha = 1;
      }
    }
    function d() {
      const { wind: x, windSpeed: F, dropColor: v, splashColor: B, showSplashes: w, backgroundColor: C } = o.current;
      g.current += 0.016;
      const M = g.current, p = x * (Math.sin(M * F) * 0.7 + Math.sin(M * F * 0.37) * 0.3);
      !C || C === "transparent" ? t.clearRect(0, 0, a, m) : (t.fillStyle = C, t.fillRect(0, 0, a, m)), f();
      const b = wt(v), u = wt(B), R = i.current;
      for (let L = 0; L < 3; L++)
        for (let T = 0; T < R.length; T++) {
          const P = R[T];
          if (P.layer !== L) continue;
          const A = p + P.windJitter;
          P.x += A, P.y += P.speed;
          const D = Math.sqrt(A * A + P.speed * P.speed) || 1, z = P.x - A / D * P.length, O = P.y - P.speed / D * P.length, j = t.createLinearGradient(z, O, P.x, P.y);
          j.addColorStop(0, `rgba(${b},0)`), j.addColorStop(1, `rgba(${b},${P.opacity})`), t.beginPath(), t.moveTo(z, O), t.lineTo(P.x, P.y), t.strokeStyle = j, t.lineWidth = P.width, t.lineCap = "round", t.stroke(), P.y > m + P.length && (w && l.current.push({
            x: P.x,
            y: m,
            r: 0,
            maxR: 8 + Math.random() * 12,
            life: 0,
            maxLife: 25 + Math.floor(Math.random() * 25)
          }), R[T] = k()), P.x > a + 60 && (P.x -= a + 120), P.x < -60 && (P.x += a + 120);
        }
      const S = l.current;
      for (let L = S.length - 1; L >= 0; L--) {
        const T = S[L];
        T.life++, T.r = T.life / T.maxLife * T.maxR;
        const P = (1 - T.life / T.maxLife) * 0.75;
        if (P <= 0 || T.life >= T.maxLife) {
          S.splice(L, 1);
          continue;
        }
        t.save(), t.translate(T.x, T.y), t.scale(1.6, 0.35), t.beginPath(), t.arc(0, 0, T.r, 0, Math.PI * 2), t.strokeStyle = `rgba(${u},${P})`, t.lineWidth = 1.2, t.stroke(), t.restore();
      }
      c.current = requestAnimationFrame(d);
    }
    return c.current = requestAnimationFrame(d), () => {
      q.disconnect(), cancelAnimationFrame(c.current);
    };
  }, [r]);
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
}, Ho = ht((r, y) => {
  const {
    preset: o,
    dropCount: i,
    speed: l,
    wind: s,
    windSpeed: c,
    dropLength: g,
    dropWidth: n,
    dropOpacity: e,
    dropColor: h,
    splashColor: t,
    showSplashes: a,
    backgroundColor: m,
    starCount: k,
    starColor: W,
    glowingStars: Y,
    starGlowBlur: E,
    width: q,
    height: $,
    className: I,
    style: f
  } = r, d = o && Xo[o] || {}, x = X(null);
  return gt(y, () => x.current), Go(x, {
    dropCount: i ?? d.dropCount ?? 200,
    speed: l ?? d.speed ?? 15,
    wind: s ?? d.wind ?? 0.3,
    windSpeed: c ?? d.windSpeed ?? 0.5,
    dropLength: g ?? d.dropLength ?? 28,
    dropWidth: n ?? d.dropWidth ?? 1.5,
    dropOpacity: e ?? d.dropOpacity ?? 0.85,
    dropColor: h ?? d.dropColor ?? "#000000",
    splashColor: t ?? d.splashColor ?? "#000000",
    showSplashes: a ?? d.showSplashes ?? !0,
    backgroundColor: m ?? d.backgroundColor ?? "#ffffff",
    starCount: k ?? 60,
    starColor: W ?? "#ffffff",
    glowingStars: Y ?? !1,
    starGlowBlur: E ?? 8
  }), /* @__PURE__ */ it(
    "div",
    {
      className: I,
      style: { width: q ?? "100%", height: $ ?? "100%", display: "block", overflow: "hidden", ...f },
      children: /* @__PURE__ */ it("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Ho.displayName = "Rain";
function ee(r, y, o, i, l, s, c) {
  if (l <= 0) {
    c.push({ x: o, y: i });
    return;
  }
  const g = Math.hypot(o - r, i - y), n = (r + o) / 2 + (Math.random() - 0.5) * s * g * 0.5, e = (y + i) / 2 + (Math.random() - 0.5) * s * g * 0.1;
  ee(r, y, n, e, l - 1, s, c), ee(n, e, o, i, l - 1, s, c);
}
function No(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(null), c = X(0);
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a(I, f) {
      const d = window.devicePixelRatio || 1;
      g.width = Math.round(I * d), g.height = Math.round(f * d), g.style.width = `${I}px`, g.style.height = `${f}px`, e.scale(d, d), h = I, t = f;
    }
    const m = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && a(f, d);
    });
    m.observe(n);
    const k = n.getBoundingClientRect();
    k.width > 0 && k.height > 0 && a(k.width, k.height);
    function W(I) {
      const { glowBlur: f, color: d, coreColor: x } = o.current, F = I.points;
      if (F.length < 2 || I.alpha <= 0) return;
      const v = I.alpha * I.energy;
      e.lineCap = "round", e.lineJoin = "round", e.shadowBlur = 0, e.globalAlpha = v * 0.3, e.strokeStyle = d, e.lineWidth = 6 * I.energy, e.filter = `blur(${Math.round(f * 0.6)}px)`, e.beginPath(), e.moveTo(F[0].x, F[0].y);
      for (let B = 1; B < F.length; B++) e.lineTo(F[B].x, F[B].y);
      e.stroke(), e.filter = "none", e.globalAlpha = v * 0.6, e.strokeStyle = d, e.lineWidth = 2.5 * I.energy, e.shadowColor = d, e.shadowBlur = f * I.energy, e.beginPath(), e.moveTo(F[0].x, F[0].y);
      for (let B = 1; B < F.length; B++) e.lineTo(F[B].x, F[B].y);
      e.stroke(), e.globalAlpha = v * 0.9, e.strokeStyle = x, e.lineWidth = 0.8 * I.energy, e.shadowBlur = 0, e.beginPath(), e.moveTo(F[0].x, F[0].y);
      for (let B = 1; B < F.length; B++) e.lineTo(F[B].x, F[B].y);
      e.stroke(), e.globalAlpha = 1, e.shadowBlur = 0;
    }
    function Y(I, f) {
      const { segments: d, roughness: x, branchChance: F, branchDecay: v, flickerCount: B } = o.current, { startX: w, startY: C, endY: M } = o.current, p = I !== void 0 ? I : w * h, b = C * t, u = p + (Math.random() - 0.5) * h * 0.2, R = f !== void 0 ? f : M * t, S = [];
      function L(T, P, A, D, z) {
        const O = [{ x: T, y: P }];
        ee(T, P, A, D, d, x, O), S.push({ points: O, energy: z, alpha: 1 });
        for (let j = 2; j < O.length - 1; j++) {
          if (Math.random() >= F) continue;
          const N = (Math.random() - 0.5) * Math.PI * 0.65, H = (R - O[j].y) * (0.25 + Math.random() * 0.4), J = O[j].x + Math.sin(N) * H, G = O[j].y + Math.cos(N) * Math.abs(H), U = [{ x: O[j].x, y: O[j].y }];
          ee(O[j].x, O[j].y, J, G, Math.max(2, d - 2), x * 0.8, U), S.push({ points: U, energy: z * v, alpha: 1 });
        }
      }
      for (let T = 0; T < B; T++)
        L(
          p + (Math.random() - 0.5) * 4,
          b,
          u + (Math.random() - 0.5) * 8,
          R,
          1
        );
      i.current = S, c.current = 0.35;
    }
    function E() {
      const { autoInterval: I } = o.current;
      s.current = setTimeout(() => {
        Y(), E();
      }, I * (0.5 + Math.random()));
    }
    E(), Y();
    function q(I) {
      if (!o.current.interactive) return;
      const f = g.getBoundingClientRect();
      Y(I.clientX - f.left, I.clientY - f.top);
    }
    g.addEventListener("click", q);
    function $() {
      const { backgroundColor: I } = o.current;
      !I || I === "transparent" ? e.clearRect(0, 0, h, t) : (e.fillStyle = I, e.fillRect(0, 0, h, t));
      const f = i.current;
      let d = !1;
      for (const x of f)
        x.alpha *= 0.82, x.alpha > 0.01 && (d = !0, W(x));
      d || (i.current = []), c.current > 5e-3 && (e.globalAlpha = c.current, e.fillStyle = "#ffffff", e.fillRect(0, 0, h, t), e.globalAlpha = 1, c.current *= 0.55), l.current = requestAnimationFrame($);
    }
    return l.current = requestAnimationFrame($), () => {
      m.disconnect(), cancelAnimationFrame(l.current), s.current && clearTimeout(s.current), g.removeEventListener("click", q);
    };
  }, [r]);
}
const jo = {
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
}, Uo = ht((r, y) => {
  const {
    preset: o,
    segments: i,
    roughness: l,
    branchChance: s,
    branchDecay: c,
    flickerCount: g,
    glowBlur: n,
    color: e,
    coreColor: h,
    backgroundColor: t,
    autoInterval: a,
    interactive: m,
    startX: k,
    startY: W,
    endY: Y,
    width: E,
    height: q,
    className: $,
    style: I
  } = r, f = o && jo[o] || {}, d = X(null);
  return gt(y, () => d.current), No(d, {
    segments: i ?? f.segments ?? 8,
    roughness: l ?? f.roughness ?? 0.5,
    branchChance: s ?? f.branchChance ?? 0.1,
    branchDecay: c ?? f.branchDecay ?? 0.6,
    flickerCount: g ?? f.flickerCount ?? 3,
    glowBlur: n ?? f.glowBlur ?? 20,
    color: e ?? f.color ?? "#6b7280",
    coreColor: h ?? f.coreColor ?? "#ffffff",
    backgroundColor: t ?? f.backgroundColor ?? "#111111",
    autoInterval: a ?? f.autoInterval ?? 2e3,
    interactive: m ?? f.interactive ?? !0,
    startX: k ?? f.startX ?? 0.5,
    startY: W ?? f.startY ?? 0,
    endY: Y ?? f.endY ?? 1
  }), /* @__PURE__ */ it(
    "div",
    {
      className: $,
      style: { width: E ?? "100%", height: q ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...I },
      children: /* @__PURE__ */ it("canvas", { ref: d, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Uo.displayName = "Lightning";
function Vo(r, y, o) {
  const i = X(y);
  i.current = y;
  const l = X(0), s = X(new Uint16Array(0)), c = X(new Uint16Array(0)), g = X(0), n = X(0), e = X(!1), h = X(0);
  ft(() => {
    const t = r.current;
    if (!t) return;
    const a = t.parentElement;
    if (!a) return;
    const m = t.getContext("2d");
    let k = 0, W = 0;
    function Y(x = !0) {
      const { cellSize: F, initialDensity: v } = i.current, B = Math.floor(k / F), w = Math.floor(W / F);
      if (g.current = B, n.current = w, s.current = new Uint16Array(B * w), c.current = new Uint16Array(B * w), x)
        for (let C = 0; C < s.current.length; C++)
          s.current[C] = Math.random() < v ? 1 : 0;
    }
    function E(x, F) {
      const v = r.current, B = window.devicePixelRatio || 1;
      v.width = Math.round(x * B), v.height = Math.round(F * B), v.style.width = `${x}px`, v.style.height = `${F}px`, m.scale(B, B), k = x, W = F, Y(!0);
    }
    const q = new ResizeObserver((x) => {
      const { width: F, height: v } = x[0].contentRect;
      F > 0 && v > 0 && E(F, v);
    });
    q.observe(a);
    const $ = a.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height), o && (o.current = {
      randomize: () => Y(!0),
      clear: () => {
        s.current.fill(0);
      },
      pause: () => {
        e.current = !0;
      },
      resume: () => {
        e.current = !1;
      }
    });
    function I() {
      const x = g.current, F = n.current, v = s.current, B = c.current, { wrapEdges: w } = i.current;
      for (let C = 0; C < F; C++)
        for (let M = 0; M < x; M++) {
          let p = 0;
          for (let R = -1; R <= 1; R++)
            for (let S = -1; S <= 1; S++) {
              if (R === 0 && S === 0) continue;
              let L = C + R, T = M + S;
              if (w)
                L = (L + F) % F, T = (T + x) % x;
              else if (L < 0 || L >= F || T < 0 || T >= x) continue;
              v[L * x + T] > 0 && p++;
            }
          const b = C * x + M, u = v[b] > 0;
          u && (p === 2 || p === 3) ? B[b] = Math.min(v[b] + 1, 255) : !u && p === 3 ? B[b] = 1 : B[b] = 0;
        }
      s.current = B.slice();
    }
    function f(x) {
      const { cellSize: F, speed: v, aliveColor: B, oldColor: w, deadColor: C, showAge: M, backgroundColor: p } = i.current;
      if (!e.current) {
        const L = 1e3 / v;
        x - h.current >= L && (I(), h.current = x);
      }
      m.fillStyle = p, m.fillRect(0, 0, k, W);
      const b = g.current, u = n.current, R = s.current, S = 60;
      for (let L = 0; L < u; L++)
        for (let T = 0; T < b; T++) {
          const P = R[L * b + T];
          if (P === 0) continue;
          const A = M ? Math.min(P / S, 1) : 0, [D, z, O] = xt([B, w], A);
          m.fillStyle = `rgb(${D},${z},${O})`, m.fillRect(T * F + 0.5, L * F + 0.5, F - 1, F - 1);
        }
      l.current = requestAnimationFrame(f);
    }
    l.current = requestAnimationFrame(f);
    function d(x) {
      if (!i.current.interactive) return;
      const v = r.current.getBoundingClientRect(), B = x.clientX - v.left, w = x.clientY - v.top, { cellSize: C } = i.current, M = Math.floor(B / C), p = Math.floor(w / C), b = g.current, u = n.current;
      if (M < 0 || M >= b || p < 0 || p >= u) return;
      const R = p * b + M;
      s.current[R] = s.current[R] > 0 ? 0 : 1;
    }
    return t.addEventListener("click", d), () => {
      q.disconnect(), cancelAnimationFrame(l.current), t.removeEventListener("click", d);
    };
  }, [r, o]);
}
const _o = {
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
}, Jo = ht((r, y) => {
  const {
    preset: o,
    cellSize: i,
    speed: l,
    initialDensity: s,
    aliveColor: c,
    oldColor: g,
    deadColor: n,
    showAge: e,
    wrapEdges: h,
    interactive: t,
    backgroundColor: a,
    width: m,
    height: k,
    className: W,
    style: Y
  } = r, E = o && _o[o] || {}, q = X(null), $ = X(null);
  return gt(y, () => $.current), Vo(q, {
    cellSize: i ?? E.cellSize ?? 8,
    speed: l ?? E.speed ?? 10,
    initialDensity: s ?? E.initialDensity ?? 0.3,
    aliveColor: c ?? E.aliveColor ?? "#ffffff",
    oldColor: g ?? E.oldColor ?? "#6b7280",
    deadColor: n ?? E.deadColor ?? "#111111",
    showAge: e ?? E.showAge ?? !0,
    wrapEdges: h ?? E.wrapEdges ?? !0,
    interactive: t ?? E.interactive ?? !0,
    backgroundColor: a ?? E.backgroundColor ?? "#111111"
  }, $), /* @__PURE__ */ it(
    "div",
    {
      className: W,
      style: { width: m ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...Y },
      children: /* @__PURE__ */ it("canvas", { ref: q, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Jo.displayName = "GameOfLife";
function Ko(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X(0), c = X(1), g = X(null);
  ft(() => {
    var n;
    (n = g.current) == null || n.call(g);
  }, [y.ringCount]), ft(() => {
    const n = r.current;
    if (!n) return;
    const e = n.parentElement;
    if (!e) return;
    const h = n.getContext("2d");
    let t = 0, a = 0;
    function m() {
      const { ringCount: I, starCount: f } = o.current;
      i.current = Array.from({ length: I }, (d, x) => ({
        z: x / I,
        colorIndex: x % Math.max(1, o.current.colors.length),
        rotation: x / I * Math.PI * 2
      })), l.current = Array.from({ length: f }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08
      }));
    }
    function k(I, f) {
      const d = r.current, x = window.devicePixelRatio || 1;
      d.width = Math.round(I * x), d.height = Math.round(f * x), d.style.width = `${I}px`, d.style.height = `${f}px`, h.scale(x, x), t = I, a = f, m();
    }
    g.current = () => {
      t > 0 && a > 0 && m();
    };
    const W = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && k(f, d);
    });
    W.observe(e);
    const Y = e.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    function E(I) {
      if (!o.current.interactive) return;
      const d = r.current.getBoundingClientRect(), x = (I.clientX - d.left) / d.width;
      c.current = 0.2 + x * 2.8;
    }
    n.addEventListener("mousemove", E);
    function q(I, f, d) {
      const { fov: x, depth: F, twist: v } = o.current, B = Math.min(t, a) * 0.45, w = x / (x + f * F), C = d + f * v * Math.PI * 2, M = t / 2 + Math.cos(I + C) * B * w, p = a / 2 + Math.sin(I + C) * B * w;
      return { px: M, py: p, scale: w };
    }
    function $() {
      const { speed: I, colors: f, backgroundColor: d, lineWidth: x, opacity: F, starColor: v } = o.current, B = i.current, w = l.current, C = I * c.current * 8e-3;
      h.fillStyle = d, h.fillRect(0, 0, t, a);
      const M = [...B].sort((p, b) => p.z - b.z);
      for (const p of M) {
        p.z += C, p.z >= 1 && (p.z -= 1, p.colorIndex = (p.colorIndex + 1) % Math.max(1, f.length)), p.rotation += C * 0.1;
        const b = 64, u = (1 - p.z) * F;
        if (u <= 0.01) continue;
        const R = f[p.colorIndex % f.length] ?? "#7C3AED", { scale: S } = q(0, p.z, p.rotation);
        h.beginPath();
        for (let L = 0; L <= b; L++) {
          const T = L / b * Math.PI * 2, { px: P, py: A } = q(T, p.z, p.rotation);
          L === 0 ? h.moveTo(P, A) : h.lineTo(P, A);
        }
        h.closePath(), h.strokeStyle = R, h.globalAlpha = u, h.lineWidth = x * S, h.stroke(), h.globalAlpha = 1;
      }
      for (const p of w) {
        p.ringZ += C, p.ringZ >= 1 && (p.ringZ -= 1);
        const { px: b, py: u, scale: R } = q(p.angle + p.offset * Math.PI * 2, p.ringZ, 0), S = (1 - p.ringZ) * 0.8;
        S <= 0 || (h.beginPath(), h.arc(b, u, Math.max(0.5, 1.5 * R), 0, Math.PI * 2), h.fillStyle = v, h.globalAlpha = S, h.fill(), h.globalAlpha = 1);
      }
      s.current = requestAnimationFrame($);
    }
    return s.current = requestAnimationFrame($), () => {
      W.disconnect(), cancelAnimationFrame(s.current), n.removeEventListener("mousemove", E);
    };
  }, [r]);
}
const Qo = {
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
}, Zo = ht((r, y) => {
  const {
    preset: o,
    ringCount: i,
    speed: l,
    colors: s,
    backgroundColor: c,
    twist: g,
    fov: n,
    depth: e,
    lineWidth: h,
    opacity: t,
    starCount: a,
    starColor: m,
    interactive: k,
    width: W,
    height: Y,
    className: E,
    style: q
  } = r, $ = o && Qo[o] || {}, I = X(null);
  return gt(y, () => I.current), Ko(I, {
    ringCount: i ?? $.ringCount ?? 30,
    speed: l ?? $.speed ?? 1,
    colors: s ?? $.colors ?? ["#ffffff", "#6b7280"],
    backgroundColor: c ?? $.backgroundColor ?? "#111111",
    twist: g ?? $.twist ?? 0.3,
    fov: n ?? $.fov ?? 300,
    depth: e ?? $.depth ?? 400,
    lineWidth: h ?? $.lineWidth ?? 1.5,
    opacity: t ?? $.opacity ?? 0.8,
    starCount: a ?? $.starCount ?? 100,
    starColor: m ?? $.starColor ?? "#ffffff",
    interactive: k ?? $.interactive ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: E,
      style: { width: W ?? "100%", height: Y ?? "100%", display: "block", overflow: "hidden", ...q },
      children: /* @__PURE__ */ it("canvas", { ref: I, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Zo.displayName = "Wormhole";
function tn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(null), c = X(null);
  ft(() => {
    var g;
    (g = c.current) == null || g.call(c);
  }, [y.count]), ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a() {
      const d = o.current.maxSpeed, x = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * h,
        y: Math.random() * t,
        vx: Math.cos(x) * d * 0.5,
        vy: Math.sin(x) * d * 0.5,
        trail: []
      };
    }
    function m() {
      const { count: d } = o.current;
      i.current = Array.from({ length: d }, a);
    }
    function k(d, x) {
      const F = r.current, v = window.devicePixelRatio || 1;
      F.width = Math.round(d * v), F.height = Math.round(x * v), F.style.width = `${d}px`, F.style.height = `${x}px`, e.scale(v, v), h = d, t = x, m();
    }
    c.current = () => {
      h > 0 && t > 0 && m();
    };
    const W = new ResizeObserver((d) => {
      const { width: x, height: F } = d[0].contentRect;
      x > 0 && F > 0 && k(x, F);
    });
    W.observe(n);
    const Y = n.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    function E(d) {
      if (!o.current.interactive) return;
      const F = r.current.getBoundingClientRect();
      s.current = { x: d.clientX - F.left, y: d.clientY - F.top };
    }
    function q() {
      s.current = null;
    }
    g.addEventListener("mousemove", E), g.addEventListener("mouseleave", q);
    function $(d, x) {
      const F = /* @__PURE__ */ new Map();
      for (let v = 0; v < d.length; v++) {
        const B = Math.floor(d[v].x / x), w = Math.floor(d[v].y / x), C = `${B},${w}`;
        F.has(C) || F.set(C, []), F.get(C).push(v);
      }
      return F;
    }
    function I(d, x, F, v) {
      const B = Math.floor(x.x / F), w = Math.floor(x.y / F), C = Math.ceil(v / F), M = [];
      for (let p = -C; p <= C; p++)
        for (let b = -C; b <= C; b++) {
          const u = `${B + p},${w + b}`, R = d.get(u);
          R && M.push(...R);
        }
      return M;
    }
    function f() {
      const {
        maxSpeed: d,
        separationRadius: x,
        alignmentRadius: F,
        cohesionRadius: v,
        separationForce: B,
        alignmentForce: w,
        cohesionForce: C,
        color: M,
        trailLength: p,
        trailOpacity: b,
        boidSize: u,
        backgroundColor: R,
        mouseRadius: S,
        mouseForce: L,
        wrapEdges: T
      } = o.current;
      e.fillStyle = R, e.fillRect(0, 0, h, t);
      const P = i.current, A = Math.max(x, F, v), D = $(P, A), z = s.current, O = wt(M);
      for (let j = 0; j < P.length; j++) {
        const N = P[j];
        N.trail.push({ x: N.x, y: N.y }), N.trail.length > p && N.trail.shift();
        const H = I(D, N, A, Math.max(x, F, v));
        let J = 0, G = 0, U = 0, V = 0, _ = 0, Q = 0, ot = 0, K = 0, et = 0;
        for (const at of H) {
          if (at === j) continue;
          const st = P[at], lt = N.x - st.x, ct = N.y - st.y, ut = Math.sqrt(lt * lt + ct * ct) || 1e-3;
          ut < x && (J += lt / ut, G += ct / ut, U++), ut < F && (V += st.vx, _ += st.vy, Q++), ut < v && (ot += st.x, K += st.y, et++);
        }
        let tt = 0, nt = 0;
        if (U > 0 && (tt += J / U * B * d, nt += G / U * B * d), Q > 0 && (tt += (V / Q - N.vx) * w, nt += (_ / Q - N.vy) * w), et > 0 && (tt += (ot / et - N.x) / v * C * d, nt += (K / et - N.y) / v * C * d), z) {
          const at = N.x - z.x, st = N.y - z.y, lt = Math.sqrt(at * at + st * st) || 1e-3;
          lt < S && (tt += at / lt * L * d, nt += st / lt * L * d);
        }
        N.vx += tt, N.vy += nt;
        const rt = Math.sqrt(N.vx * N.vx + N.vy * N.vy) || 1e-3;
        if (rt > d && (N.vx = N.vx / rt * d, N.vy = N.vy / rt * d), N.x += N.vx, N.y += N.vy, T ? (N.x < 0 && (N.x += h, N.trail = []), N.x > h && (N.x -= h, N.trail = []), N.y < 0 && (N.y += t, N.trail = []), N.y > t && (N.y -= t, N.trail = [])) : ((N.x < 0 || N.x > h) && (N.vx *= -1), (N.y < 0 || N.y > t) && (N.vy *= -1), N.x = Math.max(0, Math.min(h, N.x)), N.y = Math.max(0, Math.min(t, N.y))), N.trail.length > 1) {
          e.beginPath(), e.moveTo(N.trail[0].x, N.trail[0].y);
          for (let at = 1; at < N.trail.length; at++) {
            const st = N.trail[at - 1], lt = N.trail[at];
            Math.abs(lt.x - st.x) > h * 0.5 || Math.abs(lt.y - st.y) > t * 0.5 ? e.moveTo(lt.x, lt.y) : e.lineTo(lt.x, lt.y);
          }
          e.strokeStyle = `rgba(${O},${b})`, e.lineWidth = 1, e.stroke();
        }
        const Z = Math.atan2(N.vy, N.vx);
        e.save(), e.translate(N.x, N.y), e.rotate(Z), e.beginPath(), e.moveTo(u, 0), e.lineTo(-u * 0.6, u * 0.5), e.lineTo(-u * 0.6, -u * 0.5), e.closePath(), e.fillStyle = `rgba(${O},0.9)`, e.fill(), e.restore();
      }
      l.current = requestAnimationFrame(f);
    }
    return l.current = requestAnimationFrame(f), () => {
      W.disconnect(), cancelAnimationFrame(l.current), g.removeEventListener("mousemove", E), g.removeEventListener("mouseleave", q);
    };
  }, [r]);
}
const en = {
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
}, on = ht((r, y) => {
  const {
    preset: o,
    count: i,
    maxSpeed: l,
    separationRadius: s,
    alignmentRadius: c,
    cohesionRadius: g,
    separationForce: n,
    alignmentForce: e,
    cohesionForce: h,
    color: t,
    trailLength: a,
    trailOpacity: m,
    boidSize: k,
    backgroundColor: W,
    interactive: Y,
    mouseRadius: E,
    mouseForce: q,
    wrapEdges: $,
    width: I,
    height: f,
    className: d,
    style: x
  } = r, F = o && en[o] || {}, v = X(null);
  return gt(y, () => v.current), tn(v, {
    count: i ?? F.count ?? 80,
    maxSpeed: l ?? F.maxSpeed ?? 3,
    separationRadius: s ?? F.separationRadius ?? 25,
    alignmentRadius: c ?? F.alignmentRadius ?? 50,
    cohesionRadius: g ?? F.cohesionRadius ?? 60,
    separationForce: n ?? F.separationForce ?? 0.05,
    alignmentForce: e ?? F.alignmentForce ?? 0.05,
    cohesionForce: h ?? F.cohesionForce ?? 0.03,
    color: t ?? F.color ?? "#ffffff",
    trailLength: a ?? F.trailLength ?? 8,
    trailOpacity: m ?? F.trailOpacity ?? 0.4,
    boidSize: k ?? F.boidSize ?? 6,
    backgroundColor: W ?? F.backgroundColor ?? "#111111",
    interactive: Y ?? F.interactive ?? !0,
    mouseRadius: E ?? F.mouseRadius ?? 80,
    mouseForce: q ?? F.mouseForce ?? 0.2,
    wrapEdges: $ ?? F.wrapEdges ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: d,
      style: { width: I ?? "100%", height: f ?? "100%", display: "block", overflow: "hidden", ...x },
      children: /* @__PURE__ */ it("canvas", { ref: v, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
on.displayName = "Boids";
function be(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((l) => l + l).join("") : y, i = parseInt(o, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function nn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const c = s.parentElement;
    if (!c) return;
    const g = s.getContext("2d");
    let n = 0, e = 0;
    function h(v, B) {
      const w = v * B, C = new Float32Array(w).fill(1), M = new Float32Array(w).fill(0), p = Math.max(5, Math.floor(v * B / 1e3));
      for (let S = 0; S < p; S++) {
        const L = Math.floor(Math.random() * v), T = Math.floor(Math.random() * B), P = Math.floor(2 + Math.random() * 5);
        for (let A = -P; A <= P; A++)
          for (let D = -P; D <= P; D++)
            if (D * D + A * A <= P * P) {
              const z = (L + D + v) % v, j = (T + A + B) % B * v + z;
              C[j] = 0.5 + (Math.random() - 0.5) * 0.1, M[j] = 0.25 + Math.random() * 0.1;
            }
      }
      const b = new OffscreenCanvas(v, B), u = b.getContext("2d"), R = u.createImageData(v, B);
      for (let S = 0; S < w; S++) R.data[S * 4 + 3] = 255;
      l.current = {
        u: C,
        v: M,
        uNext: new Float32Array(w),
        vNext: new Float32Array(w),
        gw: v,
        gh: B,
        imageData: R,
        offscreen: b,
        offCtx: u
      };
    }
    function t(v, B) {
      const w = window.devicePixelRatio || 1;
      n = v, e = B, s.width = Math.round(n * w), s.height = Math.round(e * w), s.style.width = `${n}px`, s.style.height = `${e}px`, g.setTransform(w, 0, 0, w, 0, 0);
      const { resolution: C } = o.current, M = Math.max(4, Math.round(n * C)), p = Math.max(4, Math.round(e * C));
      h(M, p);
    }
    const a = new ResizeObserver((v) => {
      const { width: B, height: w } = v[0].contentRect;
      B > 0 && w > 0 && t(B, w);
    });
    a.observe(c);
    const m = c.getBoundingClientRect();
    m.width > 0 && m.height > 0 && t(m.width, m.height);
    let k = !1, W = -1, Y = -1;
    function E(v, B) {
      const w = l.current;
      if (!w) return;
      const C = s.getBoundingClientRect(), M = v - C.left, p = B - C.top;
      W = Math.floor(M / n * w.gw), Y = Math.floor(p / e * w.gh);
    }
    function q(v) {
      o.current.interactive && E(v.clientX, v.clientY);
    }
    function $(v) {
      o.current.interactive && (k = !0, E(v.clientX, v.clientY));
    }
    function I() {
      k = !1, W = -1, Y = -1;
    }
    function f() {
      k = !1, W = -1, Y = -1;
    }
    c.addEventListener("mousemove", q), c.addEventListener("mousedown", $), c.addEventListener("mouseup", I), c.addEventListener("mouseleave", f);
    function d() {
      const v = l.current;
      if (!v) return;
      const { u: B, v: w, uNext: C, vNext: M, gw: p, gh: b } = v, { feedRate: u, killRate: R, diffusionU: S, diffusionV: L } = o.current;
      if (k && W >= 0 && Y >= 0) {
        for (let P = -3; P <= 3; P++)
          for (let A = -3; A <= 3; A++)
            if (A * A + P * P <= 3 * 3) {
              const D = (W + A + p) % p, O = (Y + P + b) % b * p + D;
              B[O] = 0.5, w[O] = 0.25;
            }
      }
      for (let T = 0; T < b; T++) {
        const P = (T - 1 + b) % b * p, A = (T + 1) % b * p, D = T * p;
        for (let z = 0; z < p; z++) {
          const O = D + z, j = (z - 1 + p) % p, N = (z + 1) % p, H = B[D + j] + B[D + N] + B[P + z] + B[A + z] - 4 * B[O], J = w[D + j] + w[D + N] + w[P + z] + w[A + z] - 4 * w[O], G = B[O] * w[O] * w[O];
          C[O] = Math.max(0, Math.min(1, B[O] + S * H - G + u * (1 - B[O]))), M[O] = Math.max(0, Math.min(1, w[O] + L * J + G - (u + R) * w[O]));
        }
      }
      v.u.set(C), v.v.set(M);
    }
    function x() {
      const v = l.current;
      if (!v) return;
      const { u: B, v: w, gw: C, gh: M, imageData: p, offscreen: b, offCtx: u } = v, { colorA: R, colorB: S, backgroundColor: L } = o.current, [T, P, A] = be(R), [D, z, O] = be(S), j = p.data;
      for (let N = 0; N < C * M; N++) {
        const H = Math.max(0, Math.min(1, w[N] * 3.5)), J = 1 - B[N] * 0.15, G = N * 4;
        j[G] = Math.round((T + (D - T) * H) * J), j[G + 1] = Math.round((P + (z - P) * H) * J), j[G + 2] = Math.round((A + (O - A) * H) * J);
      }
      u.putImageData(p, 0, 0), L && L !== "transparent" && (g.fillStyle = L, g.fillRect(0, 0, n, e)), g.imageSmoothingEnabled = !0, g.imageSmoothingQuality = "low", g.drawImage(b, 0, 0, n, e);
    }
    function F() {
      const { speed: v } = o.current, B = Math.max(1, Math.round(v));
      for (let w = 0; w < B; w++) d();
      x(), i.current = requestAnimationFrame(F);
    }
    return i.current = requestAnimationFrame(F), () => {
      a.disconnect(), cancelAnimationFrame(i.current), c.removeEventListener("mousemove", q), c.removeEventListener("mousedown", $), c.removeEventListener("mouseup", I), c.removeEventListener("mouseleave", f);
    };
  }, [r, y.resolution]);
}
const rn = {
  default: {},
  coral: { feedRate: 0.055, killRate: 0.062 },
  spots: { feedRate: 0.035, killRate: 0.065 },
  maze: { feedRate: 0.029, killRate: 0.057 },
  waves: { feedRate: 0.014, killRate: 0.053, speed: 6 },
  neon: { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" }
}, an = ht(
  (r, y) => {
    const {
      preset: o,
      feedRate: i,
      killRate: l,
      diffusionU: s,
      diffusionV: c,
      resolution: g,
      speed: n,
      colorA: e,
      colorB: h,
      backgroundColor: t,
      interactive: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && rn[o] || {}, q = X(null);
    return gt(y, () => q.current), nn(q, {
      feedRate: i ?? E.feedRate ?? 0.055,
      killRate: l ?? E.killRate ?? 0.062,
      diffusionU: s ?? E.diffusionU ?? 0.2,
      diffusionV: c ?? E.diffusionV ?? 0.1,
      resolution: g ?? E.resolution ?? 0.5,
      speed: n ?? E.speed ?? 8,
      colorA: e ?? E.colorA ?? "#111111",
      colorB: h ?? E.colorB ?? "#ffffff",
      backgroundColor: t ?? E.backgroundColor ?? "#111111",
      interactive: a ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: m ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...Y
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: q,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
an.displayName = "ReactionDiffusion";
function sn(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((l) => l + l).join("") : y, i = parseInt(o, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function ln(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0), s = X([]), c = X([]);
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a(f, d) {
      const { starCount: x } = o.current;
      s.current = Array.from({ length: x }, () => ({
        x: Math.random() * f,
        y: Math.random() * d * 0.7,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6
      }));
    }
    function m(f) {
      const { layers: d } = o.current;
      c.current = Array.from({ length: d }, (x, F) => ({
        colorIndex: F % Math.max(1, o.current.colors.length),
        freqOffset: 0.5 + Math.random() * 1.5,
        ampScale: 0.4 + Math.random() * 0.6,
        speedScale: 0.3 + Math.random() * 0.7,
        yCenter: 0.15 + F / Math.max(1, d - 1) * 0.45,
        thickness: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function k(f, d) {
      const x = window.devicePixelRatio || 1;
      h = f, t = d, g.width = Math.round(h * x), g.height = Math.round(t * x), g.style.width = `${h}px`, g.style.height = `${t}px`, e.scale(x, x), a(h, t), m();
    }
    const W = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && k(d, x);
    });
    W.observe(n);
    const Y = n.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    let E = y.layers, q = y.starCount, $ = 0;
    function I(f) {
      const d = $ ? Math.min(f - $, 50) : 16;
      $ = f;
      const { colors: x, speed: F, intensity: v, layers: B, waveAmplitude: w, waveFrequency: C, backgroundColor: M, animated: p, starCount: b } = o.current;
      B !== E && (E = B, m()), b !== q && (q = b, a(h, t)), p && (l.current += d * 1e-3 * F);
      const u = l.current;
      e.fillStyle = M, e.fillRect(0, 0, h, t);
      const R = s.current;
      for (const P of R)
        e.beginPath(), e.arc(P.x, P.y, P.r, 0, Math.PI * 2), e.fillStyle = `rgba(255,255,255,${P.opacity * 0.8})`, e.fill();
      const S = e.globalCompositeOperation;
      e.globalCompositeOperation = "screen";
      const L = Math.max(4, Math.ceil(h / 4)), T = h / L;
      for (const P of c.current) {
        const A = x[P.colorIndex % x.length] || "#ffffff", [D, z, O] = sn(A), j = P.yCenter * t, N = w * t * P.ampScale, H = C * P.freqOffset, J = P.thickness * t;
        e.beginPath();
        for (let V = 0; V <= L; V++) {
          const _ = V * T, Q = _ / h * Math.PI * 2 * H + u * P.speedScale + P.phase, ot = j - N * Math.sin(Q) - J * 0.5;
          V === 0 ? e.moveTo(_, ot) : e.lineTo(_, ot);
        }
        for (let V = L; V >= 0; V--) {
          const _ = V * T, Q = _ / h * Math.PI * 2 * H + u * P.speedScale + P.phase, ot = j - N * Math.sin(Q) + J * 0.5;
          e.lineTo(_, ot);
        }
        e.closePath();
        const G = e.createLinearGradient(0, j - N - J, 0, j + N + J);
        G.addColorStop(0, `rgba(${D},${z},${O},0)`), G.addColorStop(0.3, `rgba(${D},${z},${O},${v * 0.6})`), G.addColorStop(0.5, `rgba(${D},${z},${O},${v})`), G.addColorStop(0.7, `rgba(${D},${z},${O},${v * 0.6})`), G.addColorStop(1, `rgba(${D},${z},${O},0)`), e.fillStyle = G, e.fill();
        const U = Math.floor(h / 60);
        for (let V = 0; V < U; V++) {
          const _ = (V / U + u * 0.02 * P.speedScale) % 1 * h, Q = j - N - J * 0.5, ot = J * 2 + N * 2, K = e.createLinearGradient(0, Q, 0, Q + ot);
          K.addColorStop(0, `rgba(${D},${z},${O},0)`), K.addColorStop(0.5, `rgba(${D},${z},${O},${v * 0.3})`), K.addColorStop(1, `rgba(${D},${z},${O},0)`), e.fillStyle = K, e.fillRect(_ - 1, Q, 2, ot);
        }
      }
      e.globalCompositeOperation = S, i.current = requestAnimationFrame(I);
    }
    return i.current = requestAnimationFrame(I), () => {
      W.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const cn = {
  default: {},
  arctic: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  solar: { colors: ["#ff4400", "#ff8800", "#cc00ff"], backgroundColor: "#0a0005" },
  tropical: { colors: ["#00ffcc", "#0088ff", "#00ff44"], backgroundColor: "#030a0a" },
  neon: { colors: ["#ff00ff", "#00ffff", "#ff0088"], backgroundColor: "#000000", intensity: 1 },
  midnight: { colors: ["#4400cc", "#0033ff", "#2200aa"], backgroundColor: "#000005" }
}, un = ht(
  (r, y) => {
    const {
      preset: o,
      colors: i,
      speed: l,
      intensity: s,
      layers: c,
      backgroundColor: g,
      waveAmplitude: n,
      waveFrequency: e,
      starCount: h,
      animated: t,
      width: a,
      height: m,
      className: k,
      style: W
    } = r, Y = o && cn[o] || {}, E = X(null);
    return gt(y, () => E.current), ln(E, {
      colors: i ?? Y.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: l ?? Y.speed ?? 1,
      intensity: s ?? Y.intensity ?? 0.8,
      layers: c ?? 5,
      backgroundColor: g ?? Y.backgroundColor ?? "#111111",
      waveAmplitude: n ?? 0.15,
      waveFrequency: e ?? 2,
      starCount: h ?? 80,
      animated: t ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: {
          width: a ?? "100%",
          height: m ?? "100%",
          display: "block",
          overflow: "hidden",
          ...W
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: E,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
un.displayName = "AuroraBorealis";
function fn(r, y) {
  for (r = Math.abs(Math.round(r)), y = Math.abs(Math.round(y)); y > 0; ) [r, y] = [y, r % y];
  return r || 1;
}
function dn(r, y) {
  const o = fn(r, y);
  return 2 * Math.PI * (y / o);
}
function hn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0, e = [], h = -1, t = -1, a = -1, m = -1, k = !0;
    function W(w, C) {
      const M = g / 2, p = n / 2, b = M + (w.R - w.r) * Math.cos(C) + w.d * Math.cos((w.R - w.r) / w.r * C), u = p + (w.R - w.r) * Math.sin(C) - w.d * Math.sin((w.R - w.r) / w.r * C);
      return [b, u];
    }
    function Y(w, C, M) {
      const { outerRadius: p, innerRadius: b, penDistance: u } = o.current, S = Math.min(g, n) / 2 * p, T = C > 1 ? (w / (C - 1) - 0.5) * 0.12 : 0;
      let P, A;
      M ? (P = S * Math.max(0.05, b + T + (Math.random() - 0.5) * 0.08), A = P * Math.max(0.05, u * (0.85 + Math.random() * 0.3))) : (P = S * Math.max(0.05, b + T), A = P * Math.max(0.05, u)), P = Math.max(1, P), A = Math.max(0.1, A);
      const D = dn(S, P), z = { t: 0, prevX: 0, prevY: 0, R: S, r: P, d: A, fullPeriod: D }, [O, j] = W(z, 0);
      return z.prevX = O, z.prevY = j, z;
    }
    function E(w) {
      const { outerRadius: C, innerRadius: M, penDistance: p, layerCount: b } = o.current;
      e = [];
      for (let u = 0; u < b; u++)
        e.push(Y(u, b, w));
      h = C, t = M, a = p, m = b;
    }
    function q() {
      const { backgroundColor: w } = o.current;
      c.globalCompositeOperation = "source-over", c.globalAlpha = 1, c.fillStyle = w, c.fillRect(0, 0, g, n);
    }
    function $(w, C) {
      const M = window.devicePixelRatio || 1;
      g = w, n = C, l.width = Math.round(g * M), l.height = Math.round(n * M), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(M, 0, 0, M, 0, 0), q(), k = !0, E(!1);
    }
    const I = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && $(C, M);
    });
    I.observe(s);
    const f = s.getBoundingClientRect();
    f.width > 0 && f.height > 0 && $(f.width, f.height);
    let d = 0;
    function x(w, C, M, p, b, u, R, S) {
      c.strokeStyle = b, c.lineWidth = u, c.lineCap = "round", R ? (c.shadowColor = b, c.shadowBlur = S) : c.shadowBlur = 0, c.beginPath(), c.moveTo(w, C), c.lineTo(M, p), c.stroke();
    }
    function F(w, C, M, p, b) {
      const u = Math.cos(b), R = Math.sin(b), S = M - w, L = p - C;
      return [w + S * u - L * R, C + S * R + L * u];
    }
    function v(w, C) {
      const { colors: M } = o.current, p = M.length > 0 ? M : ["#ffffff"];
      return p[C % p.length];
    }
    function B(w) {
      const C = d ? Math.min(w - d, 50) : 16;
      d = w;
      const {
        outerRadius: M,
        innerRadius: p,
        penDistance: b,
        layerCount: u,
        speed: R,
        backgroundColor: S,
        lineWidth: L,
        trailFade: T,
        animated: P,
        autoReset: A,
        symmetry: D,
        glowEffect: z,
        glowBlur: O
      } = o.current;
      if (!k && (M !== h || p !== t || b !== a || u !== m) && (E(!1), q()), k = !1, !P) {
        i.current = requestAnimationFrame(B);
        return;
      }
      T > 0 && (c.globalCompositeOperation = "source-over", c.globalAlpha = Math.min(1, T * (C / 16)), c.fillStyle = S, c.fillRect(0, 0, g, n), c.globalAlpha = 1), c.globalCompositeOperation = "source-over";
      const j = R * Math.PI / 180 * (C / 16), N = Math.max(1, Math.ceil(j / 0.02)), H = j / N, J = g / 2, G = n / 2, U = 2 * Math.PI / D;
      let V = !1;
      for (let _ = 0; _ < e.length; _++) {
        const Q = e[_], ot = v(Q, _);
        for (let K = 0; K < N; K++) {
          Q.t += H;
          const [et, tt] = W(Q, Q.t);
          for (let nt = 0; nt < D; nt++) {
            const rt = nt * U, [Z, at] = F(J, G, Q.prevX, Q.prevY, rt), [st, lt] = F(J, G, et, tt, rt);
            x(Z, at, st, lt, ot, L, z, O);
          }
          Q.prevX = et, Q.prevY = tt;
        }
        Q.t >= Q.fullPeriod && A && (V = !0);
      }
      z || (c.shadowBlur = 0), c.globalCompositeOperation = "source-over", V && (E(!0), q()), i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      I.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const gn = {
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
}, pn = ht(
  (r, y) => {
    const {
      preset: o,
      outerRadius: i,
      innerRadius: l,
      penDistance: s,
      speed: c,
      colors: g,
      backgroundColor: n,
      lineWidth: e,
      trailFade: h,
      animated: t,
      autoReset: a,
      layerCount: m,
      symmetry: k,
      glowEffect: W,
      glowBlur: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && gn[o] || {}, d = X(null);
    return gt(y, () => d.current), hn(d, {
      outerRadius: i ?? 0.85,
      innerRadius: l ?? f.innerRadius ?? 0.4,
      penDistance: s ?? f.penDistance ?? 0.9,
      speed: c ?? f.speed ?? 2,
      colors: g ?? f.colors ?? ["#ffffff"],
      backgroundColor: n ?? f.backgroundColor ?? "#111111",
      lineWidth: e ?? f.lineWidth ?? 1,
      trailFade: h ?? f.trailFade ?? 3e-3,
      animated: t ?? !0,
      autoReset: a ?? !0,
      layerCount: m ?? f.layerCount ?? 2,
      symmetry: k ?? f.symmetry ?? 1,
      glowEffect: W ?? f.glowEffect ?? !1,
      glowBlur: Y ?? f.glowBlur ?? 10
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: E ?? "100%",
          height: q ?? "100%",
          display: "block",
          overflow: "hidden",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
pn.displayName = "Spirograph";
const Mt = 0, Lt = 1, Bt = 2, Wt = 3, ce = 4;
function Ht(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((l) => l + l).join("") : y, i = parseInt(o, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function mn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(null), s = X(null), c = X(0), g = X(0);
  ft(() => {
    const n = r.current;
    if (!n) return;
    const e = n.parentElement;
    if (!e) return;
    const h = n.getContext("2d");
    let t = 0, a = 0, m = null, k = null, W = null;
    function Y(p, b) {
      c.current = p, g.current = b, l.current = new Uint8Array(p * b), s.current = new Float32Array(p * b), m = new OffscreenCanvas(p, b), k = m.getContext("2d"), W = k.createImageData(p, b);
    }
    function E(p, b) {
      const u = window.devicePixelRatio || 1;
      t = p, a = b, n.width = Math.round(t * u), n.height = Math.round(a * u), n.style.width = `${t}px`, n.style.height = `${a}px`, h.scale(u, u);
      const { cellSize: R } = o.current, S = Math.max(4, Math.floor(t / R)), L = Math.max(4, Math.floor(a / R));
      Y(S, L);
    }
    const q = new ResizeObserver((p) => {
      const { width: b, height: u } = p[0].contentRect;
      b > 0 && u > 0 && E(b, u);
    });
    q.observe(e);
    const $ = e.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    let I = !1;
    function f(p, b) {
      const u = n.getBoundingClientRect(), R = p - u.left, S = b - u.top, L = c.current, T = g.current;
      return [
        Math.floor(R / t * L),
        Math.floor(S / a * T)
      ];
    }
    function d(p, b) {
      const u = l.current, R = s.current;
      if (!u || !R) return;
      const S = c.current, L = g.current, { brushSize: T, material: P } = o.current;
      for (let A = -T; A <= T; A++)
        for (let D = -T; D <= T; D++) {
          if (D * D + A * A > T * T) continue;
          const z = p + D, O = b + A;
          if (z < 0 || z >= S || O < 0 || O >= L) continue;
          const j = O * S + z;
          P === "erase" ? (u[j] = Mt, R[j] = 0) : P === "sand" ? u[j] = Lt : P === "water" ? u[j] = Bt : P === "fire" ? (u[j] = Wt, R[j] = 1) : P === "wall" && (u[j] = ce);
        }
    }
    function x(p) {
      o.current.interactive && (I = !0, d(...f(p.clientX, p.clientY)));
    }
    function F(p) {
      !o.current.interactive || !I || d(...f(p.clientX, p.clientY));
    }
    function v() {
      I = !1;
    }
    function B() {
      I = !1;
    }
    n.addEventListener("mousedown", x), n.addEventListener("mousemove", F), n.addEventListener("mouseup", v), n.addEventListener("mouseleave", B);
    function w() {
      const p = l.current, b = s.current;
      if (!p || !b) return;
      const u = c.current, R = g.current;
      for (let S = R - 1; S >= 0; S--) {
        const L = Math.random() < 0.5;
        for (let T = 0; T < u; T++) {
          const P = L ? T : u - 1 - T, A = S * u + P, D = p[A];
          if (D === Mt || D === ce) continue;
          const z = S + 1 < R, O = S - 1 >= 0, j = P - 1 >= 0, N = P + 1 < u;
          if (D === Lt)
            if (z && p[(S + 1) * u + P] === Mt)
              p[(S + 1) * u + P] = Lt, p[A] = Mt;
            else if (z && p[(S + 1) * u + P] === Bt)
              p[(S + 1) * u + P] = Lt, p[A] = Bt;
            else {
              const H = Math.random() < 0.5, J = H ? -1 : 1, G = H ? 1 : -1, U = H ? j : N, V = H ? N : j;
              z && U && p[(S + 1) * u + (P + J)] === Mt ? (p[(S + 1) * u + (P + J)] = Lt, p[A] = Mt) : z && V && p[(S + 1) * u + (P + G)] === Mt && (p[(S + 1) * u + (P + G)] = Lt, p[A] = Mt);
            }
          else if (D === Bt)
            if (z && p[(S + 1) * u + P] === Mt)
              p[(S + 1) * u + P] = Bt, p[A] = Mt;
            else {
              const H = Math.random() < 0.5, J = H ? -1 : 1, G = H ? 1 : -1, U = H ? j : N, V = H ? N : j;
              U && p[S * u + (P + J)] === Mt ? (p[S * u + (P + J)] = Bt, p[A] = Mt) : V && p[S * u + (P + G)] === Mt && (p[S * u + (P + G)] = Bt, p[A] = Mt);
            }
          else if (D === Wt) {
            if (b[A] -= 5e-3 + Math.random() * 0.01, b[A] <= 0) {
              p[A] = Mt, b[A] = 0;
              continue;
            }
            O && p[(S - 1) * u + P] === Mt && Math.random() < 0.4 && (p[(S - 1) * u + P] = Wt, b[(S - 1) * u + P] = b[A] * (0.7 + Math.random() * 0.3)), O && p[(S - 1) * u + P] === Lt && Math.random() < 0.02 && (p[(S - 1) * u + P] = Wt, b[(S - 1) * u + P] = 1);
            const H = Math.random() < 0.5 ? -1 : 1;
            O && (H === -1 ? j : N) && p[(S - 1) * u + (P + H)] === Mt && Math.random() < 0.15 && (p[(S - 1) * u + (P + H)] = Wt, b[(S - 1) * u + (P + H)] = b[A] * 0.6), z && p[(S + 1) * u + P] === Bt && (p[A] = Mt, p[(S + 1) * u + P] = Mt, b[A] = 0);
          }
        }
      }
    }
    function C() {
      const p = l.current, b = s.current;
      if (!p || !b || !W || !m || !k) return;
      const u = c.current, R = g.current, { sandColor: S, waterColor: L, fireColor: T, wallColor: P, backgroundColor: A } = o.current, [D, z, O] = Ht(A), [j, N, H] = Ht(S), [J, G, U] = Ht(L), [V, _, Q] = Ht(T), [ot, K, et] = Ht(P), tt = W.data;
      for (let nt = 0; nt < u * R; nt++) {
        const rt = nt * 4, Z = p[nt];
        if (tt[rt + 3] = 255, Z === Mt)
          tt[rt] = D, tt[rt + 1] = z, tt[rt + 2] = O;
        else if (Z === Lt) {
          const at = (Math.random() * 20 | 0) - 10;
          tt[rt] = Math.max(0, Math.min(255, j + at)), tt[rt + 1] = Math.max(0, Math.min(255, N + at)), tt[rt + 2] = Math.max(0, Math.min(255, H + at));
        } else if (Z === Bt) {
          const at = 0.6 + Math.random() * 0.3;
          tt[rt] = Math.round(D * (1 - at) + J * at), tt[rt + 1] = Math.round(z * (1 - at) + G * at), tt[rt + 2] = Math.round(O * (1 - at) + U * at);
        } else if (Z === Wt) {
          const at = Math.max(0, Math.min(1, b[nt]));
          tt[rt] = Math.min(255, Math.round(V * at + 60 * at)), tt[rt + 1] = Math.round(_ * at * 0.4), tt[rt + 2] = Math.round(Q * at * 0.1);
        } else Z === ce && (tt[rt] = ot, tt[rt + 1] = K, tt[rt + 2] = et);
      }
      k.putImageData(W, 0, 0), h.imageSmoothingEnabled = !1, h.drawImage(m, 0, 0, t, a);
    }
    function M() {
      w(), C(), i.current = requestAnimationFrame(M);
    }
    return i.current = requestAnimationFrame(M), () => {
      q.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousedown", x), n.removeEventListener("mousemove", F), n.removeEventListener("mouseup", v), n.removeEventListener("mouseleave", B);
    };
  }, [r, y.cellSize]);
}
const yn = {
  default: {},
  desert: { sandColor: "#c8a85a", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  ocean: { waterColor: "#0088cc", backgroundColor: "#001a2e", wallColor: "#0a3a5a", material: "water" },
  inferno: { fireColor: "#ff4400", backgroundColor: "#0a0000", wallColor: "#2a0000", material: "fire" },
  neon: { sandColor: "#00ffff", waterColor: "#ff00ff", fireColor: "#ffff00", wallColor: "#00ff88", backgroundColor: "#050505" }
}, wn = ht(
  (r, y) => {
    const {
      preset: o,
      cellSize: i,
      brushSize: l,
      material: s,
      sandColor: c,
      waterColor: g,
      fireColor: n,
      wallColor: e,
      backgroundColor: h,
      interactive: t,
      gravity: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && yn[o] || {}, q = X(null);
    return gt(y, () => q.current), mn(q, {
      cellSize: i ?? 4,
      brushSize: l ?? 3,
      material: s ?? E.material ?? "sand",
      sandColor: c ?? E.sandColor ?? "#ffffff",
      waterColor: g ?? E.waterColor ?? "#6b7280",
      fireColor: n ?? E.fireColor ?? "#ffffff",
      wallColor: e ?? E.wallColor ?? "#4b5563",
      backgroundColor: h ?? E.backgroundColor ?? "#111111",
      interactive: t ?? !0,
      gravity: a ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: m ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...Y
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: q,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
wn.displayName = "SandSimulation";
function Ce(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((l) => l + l).join("") : y, i = parseInt(o, 16) || 0;
  return [i >> 16 & 255, i >> 8 & 255, i & 255];
}
function vn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0), l = X(0), s = X([]);
  ft(() => {
    const c = r.current;
    if (!c) return;
    const g = c.parentElement;
    if (!g) return;
    const n = c.getContext("2d");
    let e = 0, h = 0, t = null, a = null, m = null, k = 0, W = 0;
    function Y() {
      s.current = [
        { x: e * 0.35, y: h * 0.5 },
        { x: e * 0.65, y: h * 0.5 }
      ];
    }
    function E(F, v) {
      const B = window.devicePixelRatio || 1;
      e = F, h = v, c.width = Math.round(e * B), c.height = Math.round(h * B), c.style.width = `${e}px`, c.style.height = `${h}px`, n.scale(B, B);
      const { resolution: w } = o.current;
      k = Math.max(4, Math.round(e * w)), W = Math.max(4, Math.round(h * w)), t = new OffscreenCanvas(k, W), a = t.getContext("2d"), m = a.createImageData(k, W), Y();
    }
    const q = new ResizeObserver((F) => {
      const { width: v, height: B } = F[0].contentRect;
      v > 0 && B > 0 && E(v, B);
    });
    q.observe(g);
    const $ = g.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    const I = 16;
    function f(F) {
      const v = c.getBoundingClientRect(), B = F.clientX - v.left, w = F.clientY - v.top, C = s.current, { maxSources: M } = o.current;
      for (let p = 0; p < C.length; p++) {
        const b = C[p].x - B, u = C[p].y - w;
        if (b * b + u * u < I * I) {
          C.splice(p, 1);
          return;
        }
      }
      C.length < M && C.push({ x: B, y: w });
    }
    c.addEventListener("click", f);
    let d = 0;
    function x(F) {
      const v = d ? Math.min(F - d, 50) : 16;
      d = F;
      const { wavelength: B, speed: w, colorHigh: C, colorLow: M, showSources: p, animated: b, decay: u } = o.current, R = s.current;
      b && (l.current += v * 1e-3 * w);
      const S = l.current, [L, T, P] = Ce(M), [A, D, z] = Ce(C), O = m.data, j = 2 * Math.PI / B, N = j * (w * 60), H = Math.max(1, R.length), J = e / k, G = h / W;
      for (let U = 0; U < W; U++)
        for (let V = 0; V < k; V++) {
          const _ = (V + 0.5) * J, Q = (U + 0.5) * G;
          let ot = 0;
          for (const nt of R) {
            const rt = _ - nt.x, Z = Q - nt.y, at = Math.sqrt(rt * rt + Z * Z), st = Math.exp(-u * at);
            ot += st * Math.cos(j * at - N * S);
          }
          const K = (ot / H + 1) * 0.5, et = Math.max(0, Math.min(1, K)), tt = (U * k + V) * 4;
          O[tt] = Math.round(L + (A - L) * et), O[tt + 1] = Math.round(T + (D - T) * et), O[tt + 2] = Math.round(P + (z - P) * et), O[tt + 3] = 255;
        }
      if (a.putImageData(m, 0, 0), n.imageSmoothingEnabled = !0, n.imageSmoothingQuality = "low", n.drawImage(t, 0, 0, e, h), p)
        for (const U of R)
          n.beginPath(), n.arc(U.x, U.y, 8, 0, Math.PI * 2), n.strokeStyle = C, n.lineWidth = 2, n.stroke(), n.beginPath(), n.moveTo(U.x - 5, U.y), n.lineTo(U.x + 5, U.y), n.moveTo(U.x, U.y - 5), n.lineTo(U.x, U.y + 5), n.stroke();
      i.current = requestAnimationFrame(x);
    }
    return i.current = requestAnimationFrame(x), () => {
      q.disconnect(), cancelAnimationFrame(i.current), c.removeEventListener("click", f);
    };
  }, [r, y.resolution]);
}
const bn = {
  default: {},
  ripple: { colorHigh: "#88ccff", colorLow: "#001133", wavelength: 100 },
  plasma: { colorHigh: "#ff4400", colorLow: "#000033", wavelength: 60, decay: 1e-3 },
  neon: { colorHigh: "#00ffff", colorLow: "#000000", wavelength: 70 },
  cosmic: { colorHigh: "#cc88ff", colorLow: "#050005", decay: 2e-3 }
}, Cn = ht(
  (r, y) => {
    const {
      preset: o,
      maxSources: i,
      wavelength: l,
      speed: s,
      colorHigh: c,
      colorLow: g,
      backgroundColor: n,
      showSources: e,
      resolution: h,
      animated: t,
      decay: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && bn[o] || {}, q = X(null);
    return gt(y, () => q.current), vn(q, {
      maxSources: i ?? 6,
      wavelength: l ?? E.wavelength ?? 80,
      speed: s ?? 1,
      colorHigh: c ?? E.colorHigh ?? "#ffffff",
      colorLow: g ?? E.colorLow ?? "#111111",
      backgroundColor: n ?? E.backgroundColor ?? "#111111",
      showSources: e ?? !1,
      resolution: h ?? 0.4,
      animated: t ?? !0,
      decay: a ?? E.decay ?? 3e-3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: m ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...Y
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: q,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Cn.displayName = "WaveInterference";
const Mn = [
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
function xn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0, e = 0, h = 0, t = null, a = [], m = 0;
    function k(p, b) {
      return b * e + p;
    }
    function W(p, b) {
      return p < 0 || p >= e || b < 0 || b >= h ? !1 : t[k(p, b)] === 1;
    }
    function Y(p, b) {
      for (const [u, R] of Mn)
        if (W(p + u, b + R)) return !0;
      return !1;
    }
    function E(p, b) {
      p < 0 || p >= e || b < 0 || b >= h || (t[k(p, b)] = 1);
    }
    function q(p, b) {
      const { particleSize: u } = o.current;
      return [Math.floor(p / u), Math.floor(b / u)];
    }
    function $(p, b) {
      const { particleSize: u } = o.current;
      return [p * u + u * 0.5, b * u + u * 0.5];
    }
    function I() {
      const { seedMode: p } = o.current;
      if (p === "bottom")
        return { x: Math.floor(Math.random() * e), y: 0 };
      const b = Math.random() * Math.PI * 2, u = Math.min(m, Math.floor(Math.min(e, h) * 0.48)), R = e / 2, S = h / 2;
      return {
        x: Math.max(0, Math.min(e - 1, Math.round(R + Math.cos(b) * u))),
        y: Math.max(0, Math.min(h - 1, Math.round(S + Math.sin(b) * u)))
      };
    }
    function f(p, b, u) {
      const [R, S] = $(p, b), { particleColor: L, walkerColor: T, particleSize: P, glowEffect: A, glowBlur: D } = o.current;
      A && u ? (c.shadowColor = L, c.shadowBlur = D) : c.shadowBlur = 0;
      const z = P * 0.5;
      c.fillStyle = u ? L : T, c.beginPath(), c.arc(R, S, z, 0, Math.PI * 2), c.fill(), c.shadowBlur = 0;
    }
    function d(p, b) {
      const [u, R] = $(p, b), { particleSize: S, backgroundColor: L } = o.current, T = S * 0.5 + 1;
      c.fillStyle = L, c.beginPath(), c.arc(u, R, T, 0, Math.PI * 2), c.fill();
    }
    function x() {
      const { seedMode: p } = o.current;
      if (t)
        if (p === "bottom")
          for (let b = 0; b < e; b++)
            E(b, h - 1), f(b, h - 1, !0);
        else if (p === "ring") {
          const b = Math.floor(e / 2), u = Math.floor(h / 2), R = Math.max(2, Math.floor(Math.min(e, h) * 0.04));
          for (let S = 0; S < Math.PI * 2; S += 0.15) {
            const L = Math.round(b + Math.cos(S) * R), T = Math.round(u + Math.sin(S) * R);
            L >= 0 && L < e && T >= 0 && T < h && (E(L, T), f(L, T, !0));
          }
        } else {
          const b = Math.floor(e / 2), u = Math.floor(h / 2);
          E(b, u), f(b, u, !0);
        }
    }
    function F(p, b) {
      const { particleSize: u, walkerCount: R } = o.current;
      e = Math.max(4, Math.floor(p / u)), h = Math.max(4, Math.floor(b / u)), t = new Uint8Array(e * h), m = Math.floor(Math.min(e, h) * 0.05), c.fillStyle = o.current.backgroundColor, c.fillRect(0, 0, g, n), x(), a = [];
      for (let S = 0; S < R; S++)
        a.push(I());
    }
    function v(p, b) {
      const u = window.devicePixelRatio || 1;
      g = p, n = b, l.width = Math.round(g * u), l.height = Math.round(n * u), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(u, 0, 0, u, 0, 0), F(g, n);
    }
    const B = new ResizeObserver((p) => {
      const { width: b, height: u } = p[0].contentRect;
      b > 0 && u > 0 && v(b, u);
    });
    B.observe(s);
    const w = s.getBoundingClientRect();
    w.width > 0 && w.height > 0 && v(w.width, w.height);
    function C(p) {
      if (!o.current.interactive || !t) return;
      const b = l.getBoundingClientRect(), u = p.clientX - b.left, R = p.clientY - b.top, [S, L] = q(u, R);
      S >= 0 && S < e && L >= 0 && L < h && (E(S, L), f(S, L, !0));
    }
    l.addEventListener("click", C);
    function M() {
      if (!t) {
        i.current = requestAnimationFrame(M);
        return;
      }
      const { stepsPerFrame: p, walkerCount: b, showWalkers: u, seedMode: R } = o.current;
      for (let S = 0; S < p; S++)
        for (let L = 0; L < a.length; L++) {
          const T = a[L], P = T.x, A = T.y;
          u && d(P, A);
          const D = Me[Math.floor(Math.random() * Me.length)];
          let z = T.x + D[0], O = T.y + D[1];
          if (z = Math.max(0, Math.min(e - 1, z)), O = R === "bottom" ? Math.max(0, Math.min(h - 2, O)) : Math.max(0, Math.min(h - 1, O)), T.x = z, T.y = O, Y(z, O) && !W(z, O)) {
            if (E(z, O), f(z, O, !0), R !== "bottom") {
              const j = e / 2, N = h / 2, H = Math.sqrt((z - j) ** 2 + (O - N) ** 2);
              m = Math.min(
                Math.floor(Math.min(e, h) * 0.48),
                Math.max(m, Math.ceil(H) + 3)
              );
            }
            a.length <= b && (a[L] = I());
          } else
            u && f(z, O, !1);
        }
      i.current = requestAnimationFrame(M);
    }
    return i.current = requestAnimationFrame(M), () => {
      B.disconnect(), cancelAnimationFrame(i.current), l.removeEventListener("click", C);
    };
  }, [r, y.particleSize, y.seedMode]);
}
const Rn = {
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
}, Sn = ht(
  (r, y) => {
    const {
      preset: o,
      particleColor: i,
      walkerColor: l,
      backgroundColor: s,
      particleSize: c,
      walkerCount: g,
      stepsPerFrame: n,
      seedMode: e,
      showWalkers: h,
      glowEffect: t,
      glowBlur: a,
      interactive: m,
      width: k,
      height: W,
      className: Y,
      style: E
    } = r, q = o && Rn[o] || {}, $ = X(null);
    return gt(y, () => $.current), xn($, {
      particleColor: i ?? q.particleColor ?? "#ffffff",
      walkerColor: l ?? q.walkerColor ?? "#6b7280",
      backgroundColor: s ?? q.backgroundColor ?? "#111111",
      particleSize: c ?? q.particleSize ?? 3,
      walkerCount: g ?? 60,
      stepsPerFrame: n ?? 20,
      seedMode: e ?? q.seedMode ?? "center",
      showWalkers: h ?? !1,
      glowEffect: t ?? q.glowEffect ?? !0,
      glowBlur: a ?? q.glowBlur ?? 8,
      interactive: m ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: Y,
        style: {
          width: k ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...E
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
Sn.displayName = "DiffusionAggregation";
function kn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0, e = 0, h = -1, t = -1, a = -1, m = !0;
    function k() {
      c.globalAlpha = 1, c.shadowBlur = 0, c.fillStyle = o.current.backgroundColor, c.fillRect(0, 0, g, n);
    }
    function W(I, f) {
      const d = window.devicePixelRatio || 1;
      g = I, n = f, l.width = Math.round(g * d), l.height = Math.round(n * d), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(d, 0, 0, d, 0, 0), k(), m = !0;
    }
    const Y = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && W(f, d);
    });
    Y.observe(s);
    const E = s.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    let q = 0;
    function $(I) {
      const f = q ? Math.min(I - q, 50) : 16;
      q = I;
      const {
        freqX: d,
        freqY: x,
        phaseShift: F,
        phaseSpeed: v,
        amplitude: B,
        color: w,
        backgroundColor: C,
        lineWidth: M,
        trailFade: p,
        glowEffect: b,
        glowBlur: u,
        colorMode: R,
        curvePoints: S,
        animated: L,
        speed: T
      } = o.current;
      if (m ? (e = F * Math.PI / 180, h = d, t = x, a = B, m = !1) : (d !== h || x !== t || B !== a) && (k(), e = F * Math.PI / 180, h = d, t = x, a = B), !L) {
        i.current = requestAnimationFrame($);
        return;
      }
      p > 0 && (c.globalAlpha = Math.min(1, p * (f / 16)), c.fillStyle = C, c.fillRect(0, 0, g, n), c.globalAlpha = 1);
      const P = g / 2, A = n / 2, D = P * B, z = A * B, O = R === "cycle" ? `hsl(${e * 360 / Math.PI % 360}, 100%, 65%)` : w;
      c.strokeStyle = O, c.lineWidth = M, c.lineCap = "round", c.lineJoin = "round", b ? (c.shadowColor = O, c.shadowBlur = u) : c.shadowBlur = 0, c.beginPath();
      for (let j = 0; j <= S; j++) {
        const N = j / S * 2 * Math.PI, H = P + D * Math.sin(d * N + e), J = A + z * Math.sin(x * N);
        j === 0 ? c.moveTo(H, J) : c.lineTo(H, J);
      }
      c.stroke(), c.shadowBlur = 0, e += v * T * Math.PI / 180 * (f / 16), i.current = requestAnimationFrame($);
    }
    return i.current = requestAnimationFrame($), () => {
      Y.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const En = {
  default: {},
  butterfly: { freqX: 3, freqY: 2 },
  star: { freqX: 5, freqY: 4 },
  web: { freqX: 7, freqY: 6, colorMode: "cycle" },
  neon: { glowEffect: !0, colorMode: "cycle", backgroundColor: "#000000", lineWidth: 2 },
  crystal: { freqX: 5, freqY: 3, glowEffect: !0, lineWidth: 2, colorMode: "cycle", backgroundColor: "#000510" }
}, Pn = ht(
  (r, y) => {
    const {
      preset: o,
      freqX: i,
      freqY: l,
      phaseShift: s,
      phaseSpeed: c,
      amplitude: g,
      color: n,
      backgroundColor: e,
      lineWidth: h,
      trailFade: t,
      glowEffect: a,
      glowBlur: m,
      colorMode: k,
      curvePoints: W,
      animated: Y,
      speed: E,
      width: q,
      height: $,
      className: I,
      style: f
    } = r, d = o && En[o] || {}, x = X(null);
    return gt(y, () => x.current), kn(x, {
      freqX: i ?? d.freqX ?? 3,
      freqY: l ?? d.freqY ?? 2,
      phaseShift: s ?? 0,
      phaseSpeed: c ?? d.phaseSpeed ?? 0.5,
      amplitude: g ?? 0.9,
      color: n ?? d.color ?? "#ffffff",
      backgroundColor: e ?? d.backgroundColor ?? "#111111",
      lineWidth: h ?? d.lineWidth ?? 1.5,
      trailFade: t ?? d.trailFade ?? 0.04,
      glowEffect: a ?? d.glowEffect ?? !1,
      glowBlur: m ?? d.glowBlur ?? 12,
      colorMode: k ?? d.colorMode ?? "solid",
      curvePoints: W ?? 600,
      animated: Y ?? !0,
      speed: E ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: q ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          ...f
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: x,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Pn.displayName = "Lissajous";
const ue = 25e4;
function An(r, y, o) {
  let i = r;
  for (let l = 0; l < o; l++) {
    let s = "";
    for (const c of i) {
      const g = y[c];
      if (g ? s += g : s += c, s.length >= ue) {
        s = s.slice(0, ue);
        break;
      }
    }
    if (i = s, i.length >= ue) break;
  }
  return i;
}
function Bn(r, y, o, i) {
  let l = 0, s = 0, c = -Math.PI / 2;
  const g = [], n = [];
  for (const f of r)
    switch (f) {
      case "F":
      case "G": {
        const d = l + Math.cos(c), x = s + Math.sin(c);
        n.push(l, s, d, x), l = d, s = x;
        break;
      }
      case "f": {
        l += Math.cos(c), s += Math.sin(c);
        break;
      }
      case "+":
        c += y;
        break;
      case "-":
        c -= y;
        break;
      case "[":
        g.push({ x: l, y: s, a: c });
        break;
      case "]": {
        const d = g.pop();
        d && (l = d.x, s = d.y, c = d.a);
        break;
      }
    }
  if (n.length === 0) return new Float32Array(0);
  let e = 1 / 0, h = -1 / 0, t = 1 / 0, a = -1 / 0;
  for (let f = 0; f < n.length; f += 4)
    e = Math.min(e, n[f], n[f + 2]), h = Math.max(h, n[f], n[f + 2]), t = Math.min(t, n[f + 1], n[f + 3]), a = Math.max(a, n[f + 1], n[f + 3]);
  const m = h - e || 1, k = a - t || 1, W = Math.min(o * 0.88 / m, i * 0.88 / k), Y = t < 0 && a >= -0.1, E = o / 2;
  let q, $;
  Y ? (q = E - (e + h) / 2 * W, $ = i * 0.93 - a * W) : (q = E - (e + h) / 2 * W, $ = i / 2 - (t + a) / 2 * W);
  const I = new Float32Array(n.length);
  for (let f = 0; f < n.length; f += 4)
    I[f] = n[f] * W + q, I[f + 1] = n[f + 1] * W + $, I[f + 2] = n[f + 2] * W + q, I[f + 3] = n[f + 3] * W + $;
  return I;
}
function In(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0;
    const e = {
      segments: new Float32Array(0),
      totalSegments: 0,
      drawnSegments: 0,
      paramHash: "",
      waitTimer: -1
    };
    function h() {
      const { axiom: q, rules: $, iterations: I, angle: f } = o.current;
      return `${q}|${JSON.stringify($)}|${I}|${f}`;
    }
    function t() {
      const { axiom: q, rules: $, iterations: I, angle: f } = o.current, d = An(q, $, I), x = f * Math.PI / 180;
      e.segments = Bn(d, x, g, n), e.totalSegments = e.segments.length / 4, e.drawnSegments = 0, e.waitTimer = -1, e.paramHash = h();
    }
    function a() {
      c.globalAlpha = 1, c.shadowBlur = 0, c.fillStyle = o.current.backgroundColor, c.fillRect(0, 0, g, n);
    }
    function m(q, $) {
      const I = window.devicePixelRatio || 1;
      g = q, n = $, l.width = Math.round(g * I), l.height = Math.round(n * I), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(I, 0, 0, I, 0, 0), a(), t();
    }
    const k = new ResizeObserver((q) => {
      const { width: $, height: I } = q[0].contentRect;
      $ > 0 && I > 0 && m($, I);
    });
    k.observe(s);
    const W = s.getBoundingClientRect();
    W.width > 0 && W.height > 0 && m(W.width, W.height);
    let Y = 0;
    function E(q) {
      const $ = Y ? Math.min(q - Y, 50) : 16;
      Y = q;
      const {
        color: I,
        backgroundColor: f,
        lineWidth: d,
        speed: x,
        autoReset: F,
        trailFade: v,
        glowEffect: B,
        glowBlur: w
      } = o.current;
      h() !== e.paramHash && (a(), t());
      const { segments: M, totalSegments: p } = e;
      if (e.waitTimer > 0) {
        e.waitTimer -= $, v > 0 && (c.globalAlpha = Math.min(1, v * ($ / 16)), c.shadowBlur = 0, c.fillStyle = f, c.fillRect(0, 0, g, n), c.globalAlpha = 1), e.waitTimer <= 0 && (e.waitTimer = -1, v === 0 && a(), e.drawnSegments = 0), i.current = requestAnimationFrame(E);
        return;
      }
      const b = Math.max(1, Math.round(x * ($ / 16))), u = Math.min(e.drawnSegments + b, p);
      c.strokeStyle = I, c.lineWidth = d, c.lineCap = "round", B ? (c.shadowColor = I, c.shadowBlur = w) : c.shadowBlur = 0;
      for (let R = e.drawnSegments; R < u; R++) {
        const S = M[R * 4], L = M[R * 4 + 1], T = M[R * 4 + 2], P = M[R * 4 + 3];
        c.beginPath(), c.moveTo(S, L), c.lineTo(T, P), c.stroke();
      }
      c.shadowBlur = 0, e.drawnSegments = u, e.drawnSegments >= p && F && (e.waitTimer = 1200), i.current = requestAnimationFrame(E);
    }
    return i.current = requestAnimationFrame(E), () => {
      k.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const xe = {
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
}, Fn = ht(
  (r, y) => {
    const {
      preset: o,
      axiom: i,
      rules: l,
      iterations: s,
      angle: c,
      lineWidth: g,
      color: n,
      backgroundColor: e,
      speed: h,
      autoReset: t,
      trailFade: a,
      glowEffect: m,
      glowBlur: k,
      width: W,
      height: Y,
      className: E,
      style: q
    } = r, $ = xe[o ?? "default"] ?? xe.default, I = X(null);
    return gt(y, () => I.current), In(I, {
      axiom: i ?? $.axiom,
      rules: l ?? $.rules,
      iterations: s ?? $.iterations,
      angle: c ?? $.angle,
      lineWidth: g ?? 1,
      color: n ?? "#ffffff",
      backgroundColor: e ?? "#111111",
      speed: h ?? 5,
      autoReset: t ?? !0,
      trailFade: a ?? 0,
      glowEffect: m ?? !1,
      glowBlur: k ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: E,
        style: {
          width: W ?? "100%",
          height: Y ?? "100%",
          display: "block",
          overflow: "hidden",
          ...q
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
Fn.displayName = "LSystem";
const At = new Uint8Array(512);
(function() {
  const y = new Uint8Array(256);
  for (let i = 0; i < 256; i++) y[i] = i;
  let o = 12345;
  for (let i = 255; i > 0; i--) {
    o = o * 1664525 + 1013904223 >>> 0;
    const l = o % (i + 1);
    [y[i], y[l]] = [y[l], y[i]];
  }
  for (let i = 0; i < 256; i++) At[i] = At[i + 256] = y[i];
})();
function Re(r) {
  return r * r * (3 - 2 * r);
}
function $n(r, y) {
  const o = Math.floor(r) & 255, i = Math.floor(y) & 255, l = r - Math.floor(r), s = y - Math.floor(y), c = Re(l), g = Re(s), n = At[At[o] + i & 255] / 255, e = At[At[o + 1] + i & 255] / 255, h = At[At[o] + i + 1 & 255] / 255, t = At[At[o + 1] + i + 1 & 255] / 255, a = n + (e - n) * c, m = h + (t - h) * c;
  return a + (m - a) * g;
}
function Tn(r, y, o = 3) {
  let i = 0, l = 0.5, s = 1;
  for (let c = 0; c < o; c++)
    i += $n(r * s, y * s) * l, l *= 0.5, s *= 2;
  return i;
}
const Jt = Math.PI * 2;
function Ln(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0;
    const e = {
      gridW: 0,
      gridH: 0,
      imageData: null,
      offscreen: null,
      offCtx: null,
      time: 0,
      rotAngle: 0,
      zoomPhase: 0
    };
    function h(E, q) {
      const { resolution: $ } = o.current, I = Math.max(1, Math.round(E * $)), f = Math.max(1, Math.round(q * $));
      e.gridW = I, e.gridH = f;
      const d = new OffscreenCanvas(I, f), x = d.getContext("2d");
      e.offscreen = d, e.offCtx = x, e.imageData = x.createImageData(I, f);
    }
    function t(E, q) {
      const $ = window.devicePixelRatio || 1;
      g = E, n = q, l.width = Math.round(g * $), l.height = Math.round(n * $), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform($, 0, 0, $, 0, 0), h(g, n);
    }
    const a = new ResizeObserver((E) => {
      const { width: q, height: $ } = E[0].contentRect;
      q > 0 && $ > 0 && t(q, $);
    });
    a.observe(s);
    const m = s.getBoundingClientRect();
    m.width > 0 && m.height > 0 && t(m.width, m.height);
    let k = 0, W = -1;
    function Y(E) {
      const q = k ? Math.min(E - k, 50) : 16;
      k = E;
      const {
        segments: $,
        speed: I,
        colorA: f,
        colorB: d,
        backgroundColor: x,
        noiseScale: F,
        zoomSpeed: v,
        rotation: B,
        resolution: w,
        animated: C
      } = o.current;
      if (w !== W && (h(g, n), W = w), !C) {
        i.current = requestAnimationFrame(Y);
        return;
      }
      const { gridW: M, gridH: p, imageData: b, offscreen: u, offCtx: R } = e;
      if (!b || !u || !R) {
        i.current = requestAnimationFrame(Y);
        return;
      }
      const S = b.data, L = M / 2, T = p / 2, P = Math.min(L, T), A = Math.max(2, Math.round($)), D = Jt / A, z = D / 2, O = e.rotAngle, j = e.zoomPhase, N = e.time, [H, J, G] = xt([x], 0);
      for (let V = 0; V < p; V++)
        for (let _ = 0; _ < M; _++) {
          const Q = _ - L, ot = V - T, K = Math.sqrt(Q * Q + ot * ot);
          if (K > P) {
            const Ct = (V * M + _) * 4;
            S[Ct] = H, S[Ct + 1] = J, S[Ct + 2] = G, S[Ct + 3] = 255;
            continue;
          }
          let et = Math.atan2(ot, Q) - O;
          et = (et % Jt + Jt) % Jt;
          let tt = et % D;
          tt > z && (tt = D - tt);
          const rt = K / P * F + j, Z = tt * 8 + N * I, st = (Tn(rt, Z) * 2 - 1 + 1) / 2, [lt, ct, ut] = xt([d, f], st), pt = (V * M + _) * 4;
          S[pt] = lt, S[pt + 1] = ct, S[pt + 2] = ut, S[pt + 3] = 255;
        }
      R.putImageData(b, 0, 0), c.drawImage(u, 0, 0, g, n);
      const U = q / 16;
      e.time += 0.02 * I * U, e.rotAngle += B * Math.PI / 180 * U, e.zoomPhase += v * 0.015 * U, i.current = requestAnimationFrame(Y);
    }
    return i.current = requestAnimationFrame(Y), () => {
      a.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [r]);
}
const zn = {
  default: {},
  neon: { colorA: "#00ffff", colorB: "#ff00ff", backgroundColor: "#000000", segments: 8, speed: 1.5 },
  crystal: { colorA: "#88ccff", colorB: "#002244", backgroundColor: "#000510", segments: 12, noiseScale: 4 },
  void: { colorA: "#cc00ff", colorB: "#000000", backgroundColor: "#000000", segments: 6, rotation: 0.4 },
  fire: { colorA: "#ff8800", colorB: "#ff0000", backgroundColor: "#0a0000", segments: 6, speed: 2 },
  ice: { colorA: "#ffffff", colorB: "#002255", backgroundColor: "#000510", segments: 10, noiseScale: 2, zoomSpeed: 0.5 }
}, Dn = ht(
  (r, y) => {
    const {
      preset: o,
      segments: i,
      speed: l,
      colorA: s,
      colorB: c,
      backgroundColor: g,
      noiseScale: n,
      zoomSpeed: e,
      rotation: h,
      resolution: t,
      animated: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && zn[o] || {}, q = X(null);
    return gt(y, () => q.current), Ln(q, {
      segments: i ?? E.segments ?? 8,
      speed: l ?? E.speed ?? 1,
      colorA: s ?? E.colorA ?? "#e0e0ff",
      colorB: c ?? E.colorB ?? "#1a0a2e",
      backgroundColor: g ?? E.backgroundColor ?? "#111111",
      noiseScale: n ?? E.noiseScale ?? 2.5,
      zoomSpeed: e ?? E.zoomSpeed ?? 0.3,
      rotation: h ?? E.rotation ?? 0.2,
      resolution: t ?? 0.5,
      animated: a ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: m ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          ...Y
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: q,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Dn.displayName = "Kaleidoscope";
function qn(r, y, o) {
  return r.map((i, l) => {
    if (y === "cycle") {
      const c = i.hue / 60 % 6, g = c - Math.floor(c), n = 0, e = Math.round(255 * (1 - g) * 0.75), h = Math.round(255 * g * 0.75), t = 192, a = Math.floor(c);
      return (() => {
        switch (a) {
          case 0:
            return [t, h, n];
          case 1:
            return [e, t, n];
          case 2:
            return [n, t, h];
          case 3:
            return [n, e, t];
          case 4:
            return [h, n, t];
          default:
            return [t, n, e];
        }
      })();
    }
    if (y === "gradient") {
      const s = l / Math.max(1, r.length - 1);
      return xt([o, "#6b7280"], s);
    }
    return xt([o], 0);
  });
}
function Wn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0;
    const e = {
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
    function h(w, C, M) {
      const p = [];
      for (let b = 0; b < M; b++)
        p.push({
          gx: Math.random() * w,
          gy: Math.random() * C,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: b / M * 360
        });
      return p;
    }
    function t(w, C) {
      const { resolution: M, cellCount: p } = o.current, b = Math.max(1, Math.round(w * M)), u = Math.max(1, Math.round(C * M));
      e.gridW = b, e.gridH = u, e.cellIds = new Int16Array(b * u);
      const R = new OffscreenCanvas(b, u), S = R.getContext("2d");
      if (e.offscreen = R, e.offCtx = S, e.imageData = S.createImageData(b, u), e.seeds.length === 0)
        e.seeds = h(b, u, p);
      else {
        const L = e.gridW || b, T = e.gridH || u;
        for (const P of e.seeds)
          P.gx = P.gx / L * b, P.gy = P.gy / T * u;
      }
    }
    function a(w, C) {
      const M = window.devicePixelRatio || 1;
      g = w, n = C, l.width = Math.round(g * M), l.height = Math.round(n * M), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(M, 0, 0, M, 0, 0), t(g, n);
    }
    let m = !1, k = 0, W = 0;
    function Y(w, C) {
      const { resolution: M } = o.current;
      return [w * M, C * M];
    }
    function E(w, C) {
      let M = -1, p = 1 / 0;
      for (let b = 0; b < e.seeds.length; b++) {
        const u = e.seeds[b], R = w - u.gx, S = C - u.gy, L = R * R + S * S;
        L < p && (p = L, M = b);
      }
      return M;
    }
    function q(w) {
      if (!o.current.interactive) return;
      const C = l.getBoundingClientRect(), M = w.clientX - C.left, p = w.clientY - C.top, [b, u] = Y(M, p);
      k = b, W = u, m = !0;
      const R = E(b, u);
      if (R >= 0) {
        const S = e.seeds[R], L = b - S.gx, T = u - S.gy, P = (e.gridW * 0.15) ** 2;
        L * L + T * T < P && (e.dragIdx = R, e.isDragging = !0);
      }
      e.mouseGX = b, e.mouseGY = u;
    }
    function $(w) {
      if (!o.current.interactive) return;
      const C = l.getBoundingClientRect(), M = w.clientX - C.left, p = w.clientY - C.top, [b, u] = Y(M, p);
      e.mouseGX = b, e.mouseGY = u, m && e.isDragging && e.dragIdx >= 0 && (e.seeds[e.dragIdx].gx = Math.max(0, Math.min(e.gridW - 1, b)), e.seeds[e.dragIdx].gy = Math.max(0, Math.min(e.gridH - 1, u)));
    }
    function I(w) {
      if (!o.current.interactive) return;
      const C = l.getBoundingClientRect(), M = w.clientX - C.left, p = w.clientY - C.top, [b, u] = Y(M, p), R = Math.abs(b - k) + Math.abs(u - W);
      if (!e.isDragging && R < 2) {
        const { cellCount: S } = o.current;
        if (e.seeds.length < S * 2) {
          const L = e.seeds.length / (S || 1) * 360;
          e.seeds.push({
            gx: Math.max(0, Math.min(e.gridW - 1, b)),
            gy: Math.max(0, Math.min(e.gridH - 1, u)),
            vx: 0,
            vy: 0,
            hue: L
          });
        }
      }
      m = !1, e.isDragging = !1, e.dragIdx = -1;
    }
    l.addEventListener("mousedown", q), l.addEventListener("mousemove", $), l.addEventListener("mouseup", I);
    const f = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && a(C, M);
    });
    f.observe(s);
    const d = s.getBoundingClientRect();
    d.width > 0 && d.height > 0 && a(d.width, d.height);
    let x = 0, F = -1, v = -1;
    function B(w) {
      const C = x ? Math.min(w - x, 50) : 16;
      x = w;
      const {
        cellCount: M,
        speed: p,
        colorMode: b,
        cellColor: u,
        backgroundColor: R,
        showEdges: S,
        edgeColor: L,
        resolution: T,
        relaxation: P,
        animated: A
      } = o.current;
      if (T !== F)
        e.seeds = [], t(g, n), F = T, v = M;
      else if (M !== v) {
        if (M > e.seeds.length) {
          const { gridW: tt, gridH: nt } = e;
          for (; e.seeds.length < M; ) {
            const rt = e.seeds.length;
            e.seeds.push({
              gx: Math.random() * tt,
              gy: Math.random() * nt,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              hue: rt / M * 360
            });
          }
        } else
          e.seeds.length = M;
        v = M;
      }
      const { seeds: D, gridW: z, gridH: O, imageData: j, offscreen: N, offCtx: H, cellIds: J } = e;
      if (!j || !N || !H || D.length === 0) {
        i.current = requestAnimationFrame(B);
        return;
      }
      if (A) {
        const tt = C / 16;
        for (const nt of D)
          e.isDragging && D.indexOf(nt) === e.dragIdx || (nt.vx += (Math.random() - 0.5) * 0.05 * p, nt.vy += (Math.random() - 0.5) * 0.05 * p, nt.vx = Math.max(-0.5 * p, Math.min(0.5 * p, nt.vx)), nt.vy = Math.max(-0.5 * p, Math.min(0.5 * p, nt.vy)), nt.gx += nt.vx * tt, nt.gy += nt.vy * tt, nt.gx < 0 && (nt.gx = 0, nt.vx = Math.abs(nt.vx)), nt.gx >= z && (nt.gx = z - 1, nt.vx = -Math.abs(nt.vx)), nt.gy < 0 && (nt.gy = 0, nt.vy = Math.abs(nt.vy)), nt.gy >= O && (nt.gy = O - 1, nt.vy = -Math.abs(nt.vy)));
      }
      const G = qn(D, b, u), [U, V, _] = xt([R], 0), [Q, ot, K] = xt([L], 0), et = j.data;
      for (let tt = 0; tt < O; tt++)
        for (let nt = 0; nt < z; nt++) {
          let rt = 1 / 0, Z = 0;
          for (let ut = 0; ut < D.length; ut++) {
            const pt = nt - D[ut].gx, Ct = tt - D[ut].gy, vt = pt * pt + Ct * Ct;
            vt < rt && (rt = vt, Z = ut);
          }
          J[tt * z + nt] = Z;
          const [at, st, lt] = G[Z], ct = (tt * z + nt) * 4;
          et[ct] = at, et[ct + 1] = st, et[ct + 2] = lt, et[ct + 3] = 255;
        }
      if (A && P > 0) {
        const tt = new Float32Array(D.length), nt = new Float32Array(D.length), rt = new Uint32Array(D.length);
        for (let Z = 0; Z < O; Z++)
          for (let at = 0; at < z; at++) {
            const st = J[Z * z + at];
            tt[st] += at, nt[st] += Z, rt[st]++;
          }
        for (let Z = 0; Z < D.length; Z++)
          e.isDragging && Z === e.dragIdx || rt[Z] > 0 && (D[Z].gx += (tt[Z] / rt[Z] - D[Z].gx) * P, D[Z].gy += (nt[Z] / rt[Z] - D[Z].gy) * P);
      }
      if (S)
        for (let tt = 0; tt < O; tt++)
          for (let nt = 0; nt < z; nt++) {
            const rt = J[tt * z + nt];
            if (nt > 0 && J[tt * z + nt - 1] !== rt || tt > 0 && J[(tt - 1) * z + nt] !== rt) {
              const at = (tt * z + nt) * 4;
              et[at] = Q, et[at + 1] = ot, et[at + 2] = K, et[at + 3] = 255;
            }
          }
      if (H.putImageData(j, 0, 0), c.drawImage(N, 0, 0, g, n), o.current.interactive) {
        c.save();
        for (let tt = 0; tt < D.length; tt++) {
          const nt = D[tt].gx / z * g, rt = D[tt].gy / O * n;
          c.beginPath(), c.arc(nt, rt, 3, 0, Math.PI * 2), c.fillStyle = "rgba(255,255,255,0.5)", c.fill();
        }
        c.restore();
      }
      i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      f.disconnect(), cancelAnimationFrame(i.current), l.removeEventListener("mousedown", q), l.removeEventListener("mousemove", $), l.removeEventListener("mouseup", I);
    };
  }, [r]);
}
const Yn = {
  default: {},
  "stained-glass": { colorMode: "cycle", edgeColor: "#111111", cellCount: 25 },
  neon: { colorMode: "cycle", backgroundColor: "#000000", edgeColor: "#000000", showEdges: !1 },
  frost: { colorMode: "gradient", cellColor: "#88ccff", backgroundColor: "#001833", edgeColor: "#ffffff" },
  ember: { colorMode: "cycle", backgroundColor: "#0a0200", edgeColor: "#0a0200", showEdges: !1 },
  void: { cellColor: "#ffffff", backgroundColor: "#000000", showEdges: !1 }
}, On = ht(
  (r, y) => {
    const {
      preset: o,
      cellCount: i,
      speed: l,
      colorMode: s,
      cellColor: c,
      backgroundColor: g,
      showEdges: n,
      edgeColor: e,
      resolution: h,
      relaxation: t,
      interactive: a,
      animated: m,
      width: k,
      height: W,
      className: Y,
      style: E
    } = r, q = o && Yn[o] || {}, $ = X(null);
    return gt(y, () => $.current), Wn($, {
      cellCount: i ?? q.cellCount ?? 20,
      speed: l ?? 1,
      colorMode: s ?? q.colorMode ?? "solid",
      cellColor: c ?? q.cellColor ?? "#ffffff",
      backgroundColor: g ?? q.backgroundColor ?? "#111111",
      showEdges: n ?? q.showEdges ?? !0,
      edgeColor: e ?? q.edgeColor ?? "#333333",
      resolution: h ?? 1,
      relaxation: t ?? 0.05,
      interactive: a ?? !0,
      animated: m ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: Y,
        style: {
          width: k ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          ...E
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
On.displayName = "VoronoiCells";
const Kt = Math.PI * 2;
function Gn(r, y) {
  const o = X(y);
  o.current = y;
  const i = X(0);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const s = l.parentElement;
    if (!s) return;
    const c = l.getContext("2d");
    let g = 0, n = 0;
    const e = {
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
    function h(I, f, d, x, F) {
      const v = Math.round(x), B = Math.round(F);
      return v < 0 || v >= f || B < 0 || B >= d ? 0 : I[B * f + v];
    }
    function t(I, f) {
      const { resolution: d, agentCount: x } = o.current, F = Math.max(1, Math.round(I * d)), v = Math.max(1, Math.round(f * d));
      e.gridW = F, e.gridH = v, e.trail = new Float32Array(F * v), e.nextTrail = new Float32Array(F * v);
      const B = x;
      e.agents = new Float32Array(B * 3);
      const w = F / 2, C = v / 2, M = Math.min(F, v) * 0.25;
      for (let u = 0; u < B; u++) {
        const R = Math.random() * Kt, S = Math.random() * M;
        e.agents[u * 3] = w + Math.cos(R) * S, e.agents[u * 3 + 1] = C + Math.sin(R) * S, e.agents[u * 3 + 2] = Math.random() * Kt;
      }
      const p = new OffscreenCanvas(F, v), b = p.getContext("2d");
      e.offscreen = p, e.offCtx = b, e.imageData = b.createImageData(F, v);
    }
    function a(I, f) {
      const d = window.devicePixelRatio || 1;
      g = I, n = f, l.width = Math.round(g * d), l.height = Math.round(n * d), l.style.width = `${g}px`, l.style.height = `${n}px`, c.setTransform(d, 0, 0, d, 0, 0), t(g, n);
    }
    function m(I) {
      if (!o.current.interactive) return;
      const f = l.getBoundingClientRect(), d = I.clientX - f.left, x = I.clientY - f.top, { resolution: F } = o.current;
      e.mouseGX = d * F, e.mouseGY = x * F, e.mouseActive = !0;
    }
    function k() {
      e.mouseActive = !1;
    }
    l.addEventListener("mousemove", m), l.addEventListener("mouseleave", k);
    const W = new ResizeObserver((I) => {
      const { width: f, height: d } = I[0].contentRect;
      f > 0 && d > 0 && a(f, d);
    });
    W.observe(s);
    const Y = s.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && a(Y.width, Y.height);
    let E = -1, q = -1;
    function $(I) {
      const {
        agentCount: f,
        sensorAngle: d,
        sensorDistance: x,
        stepSize: F,
        rotateSpeed: v,
        trailDecay: B,
        diffuseStrength: w,
        trailColor: C,
        backgroundColor: M,
        resolution: p,
        interactive: b,
        mouseRadius: u,
        mouseStrength: R,
        animated: S
      } = o.current;
      if (p !== E)
        t(g, n), E = p, q = f;
      else if (f !== q) {
        const K = f, et = e.agents, tt = new Float32Array(K * 3), nt = e.gridW, rt = e.gridH;
        if (K > et.length / 3) {
          tt.set(et);
          for (let Z = et.length / 3; Z < K; Z++) {
            const at = Math.random() * Kt, st = Math.random() * Math.min(nt, rt) * 0.25;
            tt[Z * 3] = nt / 2 + Math.cos(at) * st, tt[Z * 3 + 1] = rt / 2 + Math.sin(at) * st, tt[Z * 3 + 2] = Math.random() * Kt;
          }
        } else
          tt.set(et.subarray(0, K * 3));
        e.agents = tt, q = f;
      }
      if (!S) {
        i.current = requestAnimationFrame($);
        return;
      }
      const { agents: L, trail: T, nextTrail: P, gridW: A, gridH: D, imageData: z, offscreen: O, offCtx: j } = e;
      if (!z || !O || !j) {
        i.current = requestAnimationFrame($);
        return;
      }
      const N = d * Math.PI / 180, H = v * Math.PI / 180, J = f;
      for (let K = 0; K < J; K++) {
        const et = L[K * 3], tt = L[K * 3 + 1], nt = Math.round(et), rt = Math.round(tt);
        nt >= 0 && nt < A && rt >= 0 && rt < D && (T[rt * A + nt] += 1);
      }
      if (b && e.mouseActive) {
        const K = u * p, et = K * K, tt = e.mouseGX, nt = e.mouseGY, rt = Math.max(0, Math.floor(tt - K)), Z = Math.min(A - 1, Math.ceil(tt + K)), at = Math.max(0, Math.floor(nt - K)), st = Math.min(D - 1, Math.ceil(nt + K));
        for (let lt = at; lt <= st; lt++)
          for (let ct = rt; ct <= Z; ct++) {
            const ut = ct - tt, pt = lt - nt;
            ut * ut + pt * pt <= et && (T[lt * A + ct] += R);
          }
      }
      const G = w, U = 1 - G;
      for (let K = 0; K < D; K++)
        for (let et = 0; et < A; et++) {
          let tt = 0, nt = 0;
          for (let rt = -1; rt <= 1; rt++)
            for (let Z = -1; Z <= 1; Z++) {
              const at = et + Z, st = K + rt;
              at >= 0 && at < A && st >= 0 && st < D && (tt += T[st * A + at], nt++);
            }
          P[K * A + et] = (T[K * A + et] * U + tt / nt * G) * B;
        }
      const V = e.trail;
      e.trail = e.nextTrail, e.nextTrail = V;
      const _ = e.trail;
      for (let K = 0; K < J; K++) {
        const et = L[K * 3], tt = L[K * 3 + 1], nt = L[K * 3 + 2], rt = h(
          _,
          A,
          D,
          et + Math.cos(nt - N) * x,
          tt + Math.sin(nt - N) * x
        ), Z = h(
          _,
          A,
          D,
          et + Math.cos(nt) * x,
          tt + Math.sin(nt) * x
        ), at = h(
          _,
          A,
          D,
          et + Math.cos(nt + N) * x,
          tt + Math.sin(nt + N) * x
        );
        let st = nt;
        Z > rt && Z > at || (rt > at ? st -= H : at > rt ? st += H : st += (Math.random() - 0.5) * H), st += (Math.random() - 0.5) * 0.1;
        let lt = et + Math.cos(st) * F, ct = tt + Math.sin(st) * F;
        lt < 0 && (lt += A), lt >= A && (lt -= A), ct < 0 && (ct += D), ct >= D && (ct -= D), L[K * 3] = lt, L[K * 3 + 1] = ct, L[K * 3 + 2] = st;
      }
      const Q = z.data, ot = 5;
      for (let K = 0; K < D; K++)
        for (let et = 0; et < A; et++) {
          const tt = Math.min(_[K * A + et] / ot, 1), [nt, rt, Z] = xt([M, C], tt), at = (K * A + et) * 4;
          Q[at] = nt, Q[at + 1] = rt, Q[at + 2] = Z, Q[at + 3] = 255;
        }
      j.putImageData(z, 0, 0), c.drawImage(O, 0, 0, g, n), i.current = requestAnimationFrame($);
    }
    return i.current = requestAnimationFrame($), () => {
      W.disconnect(), cancelAnimationFrame(i.current), l.removeEventListener("mousemove", m), l.removeEventListener("mouseleave", k);
    };
  }, [r]);
}
const Xn = {
  default: {},
  neon: { trailColor: "#00ffff", backgroundColor: "#000000" },
  coral: { trailColor: "#ff8844", backgroundColor: "#0a0200" },
  vein: { trailColor: "#ff2244", backgroundColor: "#080000", agentCount: 3e3 },
  frost: { trailColor: "#88ddff", backgroundColor: "#000a10" },
  gold: { trailColor: "#ffcc44", backgroundColor: "#0a0800" }
}, Hn = ht(
  (r, y) => {
    const {
      preset: o,
      agentCount: i,
      sensorAngle: l,
      sensorDistance: s,
      stepSize: c,
      rotateSpeed: g,
      trailDecay: n,
      diffuseStrength: e,
      trailColor: h,
      backgroundColor: t,
      resolution: a,
      interactive: m,
      mouseRadius: k,
      mouseStrength: W,
      animated: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && Xn[o] || {}, d = X(null);
    return gt(y, () => d.current), Gn(d, {
      agentCount: i ?? f.agentCount ?? 1800,
      sensorAngle: l ?? 45,
      sensorDistance: s ?? 9,
      stepSize: c ?? 1.5,
      rotateSpeed: g ?? 45,
      trailDecay: n ?? f.trailDecay ?? 0.92,
      diffuseStrength: e ?? 0.2,
      trailColor: h ?? f.trailColor ?? "#ffffff",
      backgroundColor: t ?? f.backgroundColor ?? "#111111",
      resolution: a ?? 0.35,
      interactive: m ?? !0,
      mouseRadius: k ?? 20,
      mouseStrength: W ?? 3,
      animated: Y ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: E ?? "100%",
          height: q ?? "100%",
          display: "block",
          overflow: "hidden",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Hn.displayName = "SlimeMold";
function Nn(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = 0, h = new Float32Array(0), t = new Float32Array(0), a = null;
    const m = document.createElement("canvas"), k = m.getContext("2d");
    let W = 0, Y = 0, E = -1;
    function q() {
      const { resolution: p } = o.current;
      p === E && n > 0 || (E = p, n = Math.max(1, Math.round(c * p)), e = Math.max(1, Math.round(g * p)), h = new Float32Array(n * e), t = new Float32Array(n * e), m.width = n, m.height = e, a = k.createImageData(n, e));
    }
    function $(p, b) {
      const u = window.devicePixelRatio || 1;
      c = p, g = b, i.width = Math.round(p * u), i.height = Math.round(b * u), i.style.width = `${p}px`, i.style.height = `${b}px`, s.scale(u, u), E = -1, q();
    }
    const I = new ResizeObserver((p) => {
      const { width: b, height: u } = p[0].contentRect;
      b > 0 && u > 0 && $(b, u);
    });
    I.observe(l);
    const f = l.getBoundingClientRect();
    f.width > 0 && f.height > 0 && $(f.width, f.height);
    function d(p, b) {
      if (n === 0 || e === 0) return;
      const { inkRadius: u, inkStrength: R, resolution: S } = o.current, L = Math.round(p * S), T = Math.round(b * S), P = Math.max(1, Math.round(u * S)), A = P * P;
      for (let D = -P; D <= P; D++)
        for (let z = -P; z <= P; z++) {
          const O = z * z + D * D;
          if (O > A) continue;
          const j = L + z, N = T + D;
          if (j < 0 || j >= n || N < 0 || N >= e) continue;
          const H = Math.exp(-O / (A * 0.5)), J = N * n + j;
          h[J] = Math.min(1, h[J] + R * H);
        }
    }
    let x = !1;
    function F(p) {
      if (!o.current.interactive) return;
      x = !0;
      const b = i.getBoundingClientRect();
      d(p.clientX - b.left, p.clientY - b.top);
    }
    function v(p) {
      if (!o.current.interactive || !x) return;
      const b = i.getBoundingClientRect();
      d(p.clientX - b.left, p.clientY - b.top);
    }
    function B() {
      x = !1;
    }
    function w(p) {
      if (!o.current.interactive) return;
      p.preventDefault();
      const b = i.getBoundingClientRect();
      d(p.touches[0].clientX - b.left, p.touches[0].clientY - b.top);
    }
    function C(p) {
      if (!o.current.interactive) return;
      p.preventDefault();
      const b = i.getBoundingClientRect();
      d(p.touches[0].clientX - b.left, p.touches[0].clientY - b.top);
    }
    l.addEventListener("mousedown", F), l.addEventListener("mousemove", v), window.addEventListener("mouseup", B), l.addEventListener("touchstart", w, { passive: !1 }), l.addEventListener("touchmove", C, { passive: !1 });
    function M(p) {
      const { diffusionRate: b, viscosity: u, evaporationRate: R, inkColor: S, paperColor: L, glowEffect: T, glowBlur: P, autoInk: A, autoInkInterval: D, animated: z } = o.current;
      if (q(), A && c > 0 && p - Y > D && (Y = p, d(Math.random() * c, Math.random() * g)), z && a && n > 0) {
        const O = b * (1 - u * 0.4);
        for (let tt = 0; tt < e; tt++)
          for (let nt = 0; nt < n; nt++) {
            const rt = tt * n + nt;
            let Z = 0, at = 0;
            for (let st = -1; st <= 1; st++)
              for (let lt = -1; lt <= 1; lt++) {
                const ct = nt + lt, ut = tt + st;
                if (ct < 0 || ct >= n || ut < 0 || ut >= e) continue;
                const pt = lt === 0 && st === 0 ? 4 : lt !== 0 && st !== 0 ? 0.7 : 1;
                Z += h[ut * n + ct] * pt, at += pt;
              }
            t[rt] = h[rt] + (Z / at - h[rt]) * O, t[rt] *= 1 - R, t[rt] < 0 ? t[rt] = 0 : t[rt] > 1 && (t[rt] = 1);
          }
        const j = h;
        h = t, t = j;
        const [N, H, J] = xt([L], 0), [G, U, V] = xt([S], 0), _ = G - N, Q = U - H, ot = V - J, K = a.data, et = n * e;
        for (let tt = 0; tt < et; tt++) {
          const nt = h[tt], rt = tt * 4;
          K[rt] = N + _ * nt | 0, K[rt + 1] = H + Q * nt | 0, K[rt + 2] = J + ot * nt | 0, K[rt + 3] = 255;
        }
        k.putImageData(a, 0, 0), s.save(), T && (s.shadowBlur = P, s.shadowColor = S), s.imageSmoothingEnabled = !0, s.imageSmoothingQuality = "medium", s.drawImage(m, 0, 0, c, g), s.restore();
      }
      W = requestAnimationFrame(M);
    }
    return W = requestAnimationFrame(M), () => {
      I.disconnect(), cancelAnimationFrame(W), l.removeEventListener("mousedown", F), l.removeEventListener("mousemove", v), window.removeEventListener("mouseup", B), l.removeEventListener("touchstart", w), l.removeEventListener("touchmove", C);
    };
  }, [r]);
}
const jn = {
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
}, Un = ht(
  (r, y) => {
    const {
      preset: o,
      inkColor: i,
      paperColor: l,
      diffusionRate: s,
      viscosity: c,
      evaporationRate: g,
      inkRadius: n,
      inkStrength: e,
      interactive: h,
      autoInk: t,
      autoInkInterval: a,
      resolution: m,
      glowEffect: k,
      glowBlur: W,
      animated: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && jn[o] || {}, d = X(null);
    return gt(y, () => d.current), Nn(d, {
      inkColor: i ?? f.inkColor ?? "#ffffff",
      paperColor: l ?? f.paperColor ?? "#111111",
      diffusionRate: s ?? f.diffusionRate ?? 0.3,
      viscosity: c ?? f.viscosity ?? 0.8,
      evaporationRate: g ?? f.evaporationRate ?? 2e-3,
      inkRadius: n ?? 8,
      inkStrength: e ?? 1,
      interactive: h ?? !0,
      autoInk: t ?? !0,
      autoInkInterval: a ?? 2e3,
      resolution: m ?? 0.5,
      glowEffect: k ?? f.glowEffect ?? !1,
      glowBlur: W ?? f.glowBlur ?? 8,
      animated: Y ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: E ?? "100%",
          height: q ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: h ?? !0 ? "crosshair" : "default",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Un.displayName = "InkBleed";
const Ae = 24;
function Vn(r) {
  return Array.from({ length: Ae }, () => 1 + (Math.random() * 2 - 1) * r);
}
function Se(r, y, o, i, l) {
  const s = Ae;
  r.beginPath();
  for (let c = 0; c <= s; c++) {
    const g = c % s, n = g / s * Math.PI * 2, e = i * l[g], h = y + Math.cos(n) * e, t = o + Math.sin(n) * e;
    c === 0 ? r.moveTo(h, t) : r.lineTo(h, t);
  }
  r.closePath();
}
function _n(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = 0;
    const h = [];
    function t($, I) {
      const f = window.devicePixelRatio || 1;
      c = $, g = I, i.width = Math.round($ * f), i.height = Math.round(I * f), i.style.width = `${$}px`, i.style.height = `${I}px`, s.scale(f, f);
    }
    const a = new ResizeObserver(($) => {
      const { width: I, height: f } = $[0].contentRect;
      I > 0 && f > 0 && t(I, f);
    });
    a.observe(l);
    const m = l.getBoundingClientRect();
    m.width > 0 && m.height > 0 && t(m.width, m.height);
    function k($, I) {
      const { colors: f, bloomRadius: d, noiseAmount: x, maxBlooms: F } = o.current;
      h.length >= F && h.splice(0, 1), h.push({
        x: $,
        y: I,
        colorIdx: Math.floor(Math.random() * f.length),
        radius: 0,
        maxRadius: d * (0.7 + Math.random() * 0.6),
        opacity: o.current.opacity,
        noiseRadii: Vn(x),
        born: !1
      });
    }
    function W($) {
      if (!o.current.interactive) return;
      const I = i.getBoundingClientRect();
      k($.clientX - I.left, $.clientY - I.top);
    }
    function Y($) {
      if (!o.current.interactive) return;
      $.preventDefault();
      const I = i.getBoundingClientRect();
      k($.touches[0].clientX - I.left, $.touches[0].clientY - I.top);
    }
    l.addEventListener("mousedown", W), l.addEventListener("touchstart", Y, { passive: !1 });
    function E($) {
      const { colors: I, backgroundColor: f, bloomSpeed: d, opacity: x, wetEdge: F, layerCount: v, fadeSpeed: B, autoBloom: w, autoBloomInterval: C, animated: M } = o.current;
      if (w && c > 0 && $ - e > C && (e = $, k(Math.random() * c, Math.random() * g)), !M) {
        n = requestAnimationFrame(E);
        return;
      }
      s.fillStyle = f, s.fillRect(0, 0, c, g), s.save();
      for (let p = h.length - 1; p >= 0; p--) {
        const b = h[p], u = I[b.colorIdx] ?? I[0];
        if (b.radius < b.maxRadius ? b.radius = Math.min(b.maxRadius, b.radius + d * 0.8) : b.opacity = Math.max(0, b.opacity - B), b.opacity <= 0) {
          h.splice(p, 1);
          continue;
        }
        for (let R = 0; R < v; R++) {
          const S = (R + 1) / v, L = b.radius * S, T = R === v - 1, P = b.opacity * (T ? 0.3 + F * 0.7 : 0.08);
          s.fillStyle = Pt(u, P), Se(s, b.x, b.y, L, b.noiseRadii), s.fill();
        }
        F > 0.05 && (s.strokeStyle = Pt(u, b.opacity * F * 0.4), s.lineWidth = 2 + F * 3, Se(s, b.x, b.y, b.radius * 1.02, b.noiseRadii), s.stroke());
      }
      s.restore(), n = requestAnimationFrame(E);
    }
    const q = setTimeout(() => {
      c > 0 && g > 0 && (k(c * 0.3, g * 0.4), k(c * 0.7, g * 0.6));
    }, 100);
    return n = requestAnimationFrame(E), () => {
      a.disconnect(), cancelAnimationFrame(n), clearTimeout(q), l.removeEventListener("mousedown", W), l.removeEventListener("touchstart", Y);
    };
  }, [r]);
}
const Jn = {
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
}, Kn = ht(
  (r, y) => {
    const {
      preset: o,
      colors: i,
      backgroundColor: l,
      bloomRadius: s,
      bloomSpeed: c,
      opacity: g,
      wetEdge: n,
      layerCount: e,
      noiseAmount: h,
      fadeSpeed: t,
      interactive: a,
      autoBloom: m,
      autoBloomInterval: k,
      resolution: W,
      animated: Y,
      maxBlooms: E,
      width: q,
      height: $,
      className: I,
      style: f
    } = r, d = o && Jn[o] || {}, x = X(null);
    return gt(y, () => x.current), _n(x, {
      colors: i ?? d.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      backgroundColor: l ?? d.backgroundColor ?? "#111111",
      bloomRadius: s ?? d.bloomRadius ?? 80,
      bloomSpeed: c ?? 0.5,
      opacity: g ?? d.opacity ?? 0.15,
      wetEdge: n ?? d.wetEdge ?? 0.4,
      layerCount: e ?? d.layerCount ?? 6,
      noiseAmount: h ?? d.noiseAmount ?? 0.5,
      fadeSpeed: t ?? 1e-3,
      interactive: a ?? !0,
      autoBloom: m ?? !0,
      autoBloomInterval: k ?? 1500,
      resolution: W ?? 0.5,
      animated: Y ?? !0,
      maxBlooms: E ?? 12
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: q ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: a ?? !0 ? "crosshair" : "default",
          ...f
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: x,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Kn.displayName = "WatercolorBloom";
function ke(r) {
  const y = r.replace("#", ""), o = parseInt(y.slice(0, 2), 16) || 0, i = parseInt(y.slice(2, 4), 16) || 0, l = parseInt(y.slice(4, 6), 16) || 0;
  return [o, i, l];
}
function Qn(r, y, o) {
  const i = Math.round(r[0] + (y[0] - r[0]) * o), l = Math.round(r[1] + (y[1] - r[1]) * o), s = Math.round(r[2] + (y[2] - r[2]) * o);
  return `rgb(${i},${l},${s})`;
}
function Zn(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = 0, h = 0, t = 0, a = 0, m = !1;
    function k() {
      e = 0, h = 0, m = !1;
    }
    function W(f, d) {
      const x = window.devicePixelRatio || 1;
      c = f, g = d, i.width = Math.round(f * x), i.height = Math.round(d * x), i.style.width = `${f}px`, i.style.height = `${d}px`, s.scale(x, x), s.fillStyle = o.current.backgroundColor, s.fillRect(0, 0, f, d), k();
    }
    const Y = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && W(d, x);
    });
    Y.observe(l);
    const E = l.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    function q(f, d) {
      const { color: x, color2: F, colorMode: v } = o.current;
      if (v === "cycle")
        return `hsl(${f * 360 % 360},80%,65%)`;
      if (v === "gradient") {
        const B = ke(x), w = ke(F);
        return Qn(B, w, (Math.sin(d * Math.PI * 2) + 1) * 0.5);
      }
      return x;
    }
    let $ = 0;
    function I(f) {
      const d = $ ? f - $ : 16;
      $ = f;
      const { backgroundColor: x, lineWidth: F, trailFade: v, speed: B, damping: w, freq1: C, freq2: M, freq3: p, amplitude: b, glowEffect: u, glowBlur: R, animated: S, autoReset: L } = o.current;
      if (!S) {
        n = requestAnimationFrame(I);
        return;
      }
      s.fillStyle = Pt(x, v), s.fillRect(0, 0, c, g);
      const T = Math.max(1, Math.round(B * d * 0.5)), P = c / 2, A = g / 2, D = Math.min(P, A) * b;
      for (let z = 0; z < T; z++) {
        const O = Math.pow(w, h), j = Math.sin(p * e) * Math.PI, N = P + D * Math.sin(C * e + j) * O, H = A + D * Math.sin(M * e) * O;
        if (!m)
          t = N, a = H, m = !0;
        else {
          const J = e * 0.01 % 1, G = e * 5e-3 % 1;
          s.strokeStyle = q(J, G), s.lineWidth = F, s.lineCap = "round", u ? (s.shadowBlur = R, s.shadowColor = o.current.color) : s.shadowBlur = 0, s.beginPath(), s.moveTo(t, a), s.lineTo(N, H), s.stroke();
        }
        if (t = N, a = H, e += 0.02, h++, L && h > 100 && O < 0.01) {
          s.fillStyle = x, s.fillRect(0, 0, c, g), k();
          break;
        }
      }
      n = requestAnimationFrame(I);
    }
    return n = requestAnimationFrame(I), () => {
      Y.disconnect(), cancelAnimationFrame(n);
    };
  }, [r]);
}
const tr = {
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
}, er = ht(
  (r, y) => {
    const {
      preset: o,
      color: i,
      color2: l,
      backgroundColor: s,
      lineWidth: c,
      trailFade: g,
      speed: n,
      damping: e,
      freq1: h,
      freq2: t,
      freq3: a,
      amplitude: m,
      colorMode: k,
      glowEffect: W,
      glowBlur: Y,
      animated: E,
      autoReset: q,
      width: $,
      height: I,
      className: f,
      style: d
    } = r, x = o && tr[o] || {}, F = X(null);
    return gt(y, () => F.current), Zn(F, {
      color: i ?? x.color ?? "#ffffff",
      color2: l ?? x.color2 ?? "#6b7280",
      backgroundColor: s ?? x.backgroundColor ?? "#111111",
      lineWidth: c ?? x.lineWidth ?? 1,
      trailFade: g ?? x.trailFade ?? 0.01,
      speed: n ?? 1,
      damping: e ?? x.damping ?? 0.9995,
      freq1: h ?? x.freq1 ?? 2,
      freq2: t ?? x.freq2 ?? 3,
      freq3: a ?? x.freq3 ?? 0.01,
      amplitude: m ?? 0.9,
      colorMode: k ?? x.colorMode ?? "solid",
      glowEffect: W ?? x.glowEffect ?? !1,
      glowBlur: Y ?? x.glowBlur ?? 10,
      animated: E ?? !0,
      autoReset: q ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: f,
        style: {
          width: $ ?? "100%",
          height: I ?? "100%",
          display: "block",
          overflow: "hidden",
          ...d
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
er.displayName = "PendulaWave";
const jt = 0, Dt = 1, oe = 2;
function or(r, y) {
  return {
    grid: new Uint8Array(r * y),
    age: new Uint32Array(r * y),
    frontier: /* @__PURE__ */ new Set(),
    frontierArr: [],
    frontierDirty: !1,
    maxAge: 1,
    gridW: r,
    gridH: y
  };
}
function nr(r, y) {
  const { grid: o, frontier: i, gridW: l, gridH: s } = r, c = y % l, g = y / l | 0;
  c > 0 && o[y - 1] === jt && (o[y - 1] = Dt, i.add(y - 1), r.frontierDirty = !0), c < l - 1 && o[y + 1] === jt && (o[y + 1] = Dt, i.add(y + 1), r.frontierDirty = !0), g > 0 && o[y - l] === jt && (o[y - l] = Dt, i.add(y - l), r.frontierDirty = !0), g < s - 1 && o[y + l] === jt && (o[y + l] = Dt, i.add(y + l), r.frontierDirty = !0);
}
function te(r, y, o, i, l) {
  const s = r.gridW / 2, c = r.gridH / 2, g = Math.PI * 2 / i, n = y - s, e = o - c;
  for (let h = 0; h < i; h++) {
    const t = h * g, a = Math.round(s + n * Math.cos(t) - e * Math.sin(t)), m = Math.round(c + n * Math.sin(t) + e * Math.cos(t));
    if (a < 0 || a >= r.gridW || m < 0 || m >= r.gridH) continue;
    const k = m * r.gridW + a;
    r.grid[k] !== oe && (r.grid[k] = oe, r.age[k] = l, l > r.maxAge && (r.maxAge = l), r.frontier.delete(k), r.frontierDirty = !0, nr(r, k));
  }
}
function rr(r, y) {
  te(r, r.gridW / 2 | 0, r.gridH / 2 | 0, y, 0);
}
function ar(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = 0, h = null;
    const t = document.createElement("canvas"), a = t.getContext("2d");
    let m = null;
    function k(f, d) {
      const { cellSize: x, symmetry: F } = o.current, v = 300, B = Math.max(1, Math.min(v, Math.floor(f / x))), w = Math.max(1, Math.min(v, Math.floor(d / x)));
      h = or(B, w), t.width = B, t.height = w, m = a.createImageData(B, w), e = 0, rr(h, F);
    }
    function W(f, d) {
      const x = window.devicePixelRatio || 1;
      c = f, g = d, i.width = Math.round(f * x), i.height = Math.round(d * x), i.style.width = `${f}px`, i.style.height = `${d}px`, s.scale(x, x), k(f, d);
    }
    const Y = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && W(d, x);
    });
    Y.observe(l);
    const E = l.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    function q(f) {
      if (!o.current.interactive || !h) return;
      const d = i.getBoundingClientRect(), { cellSize: x, symmetry: F } = o.current, v = Math.floor((f.clientX - d.left) / x), B = Math.floor((f.clientY - d.top) / x);
      te(h, v, B, F, ++e);
    }
    function $(f) {
      if (!o.current.interactive || !h) return;
      f.preventDefault();
      const d = i.getBoundingClientRect(), { cellSize: x, symmetry: F } = o.current, v = Math.floor((f.touches[0].clientX - d.left) / x), B = Math.floor((f.touches[0].clientY - d.top) / x);
      te(h, v, B, F, ++e);
    }
    l.addEventListener("mousedown", q), l.addEventListener("touchstart", $, { passive: !1 });
    function I() {
      if (!h || !m) {
        n = requestAnimationFrame(I);
        return;
      }
      const { crystalColor: f, activeColor: d, backgroundColor: x, growthSpeed: F, symmetry: v, branchProbability: B, noiseAmount: w, colorMode: C, glowEffect: M, glowBlur: p, animated: b, autoReset: u } = o.current, { grid: R, age: S, frontier: L, gridW: T, gridH: P } = h;
      if (b && L.size > 0) {
        h.frontierDirty && (h.frontierArr = Array.from(L), h.frontierDirty = !1);
        const Q = h.frontierArr, ot = Math.min(Math.round(F), 50, Q.length);
        for (let K = 0; K < ot && Q.length !== 0; K++) {
          const et = Math.random() * Q.length | 0, tt = Q[et];
          if (R[tt] !== Dt) {
            L.delete(tt), Q.splice(et, 1), K--;
            continue;
          }
          let nt = tt % T, rt = tt / T | 0;
          if (w > 0 && Math.random() < w) {
            const Z = Math.max(0, Math.min(T - 1, nt + Math.round((Math.random() * 2 - 1) * 2))), at = Math.max(0, Math.min(P - 1, rt + Math.round((Math.random() * 2 - 1) * 2)));
            R[at * T + Z] !== oe && (nt = Z, rt = at);
          }
          if (e++, te(h, nt, rt, v, e), Q.splice(et, 1), Math.random() < B) {
            const Z = [[-2, 0], [2, 0], [0, -2], [0, 2]], [at, st] = Z[Math.random() * 4 | 0], lt = Math.max(0, Math.min(T - 1, nt + at)), ut = Math.max(0, Math.min(P - 1, rt + st)) * T + lt;
            R[ut] === jt && (R[ut] = Dt, L.add(ut), Q.push(ut));
          }
        }
        if (u && L.size === 0) {
          k(c, g), n = requestAnimationFrame(I);
          return;
        }
      }
      const [A, D, z] = xt([x], 0), [O, j, N] = xt([f], 0), [H, J, G] = xt([d], 0), U = m.data, V = T * P, _ = h.maxAge || 1;
      for (let Q = 0; Q < V; Q++) {
        const ot = R[Q];
        let K, et, tt;
        if (ot === oe)
          if (C === "age") {
            const rt = S[Q] / _;
            [K, et, tt] = xt([f, d, x], rt);
          } else if (C === "cycle") {
            const rt = S[Q] / _;
            K = 128 + 127 * Math.cos(rt * Math.PI * 2) | 0, et = 128 + 127 * Math.cos(rt * Math.PI * 2 + 2.094) | 0, tt = 128 + 127 * Math.cos(rt * Math.PI * 2 + 4.189) | 0;
          } else
            K = O, et = j, tt = N;
        else ot === Dt ? (K = H, et = J, tt = G) : (K = A, et = D, tt = z);
        const nt = Q * 4;
        U[nt] = K, U[nt + 1] = et, U[nt + 2] = tt, U[nt + 3] = 255;
      }
      a.putImageData(m, 0, 0), s.save(), M ? (s.shadowBlur = p, s.shadowColor = f) : s.shadowBlur = 0, s.imageSmoothingEnabled = !1, s.drawImage(t, 0, 0, c, g), s.restore(), n = requestAnimationFrame(I);
    }
    return n = requestAnimationFrame(I), () => {
      Y.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousedown", q), l.removeEventListener("touchstart", $);
    };
  }, [r]);
}
const ir = {
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
}, sr = ht(
  (r, y) => {
    const {
      preset: o,
      crystalColor: i,
      activeColor: l,
      backgroundColor: s,
      growthSpeed: c,
      symmetry: g,
      branchProbability: n,
      noiseAmount: e,
      cellSize: h,
      glowEffect: t,
      glowBlur: a,
      interactive: m,
      autoReset: k,
      colorMode: W,
      animated: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && ir[o] || {}, d = X(null);
    return gt(y, () => d.current), ar(d, {
      crystalColor: i ?? f.crystalColor ?? "#ffffff",
      activeColor: l ?? f.activeColor ?? "#6b7280",
      backgroundColor: s ?? f.backgroundColor ?? "#111111",
      growthSpeed: c ?? 3,
      symmetry: g ?? f.symmetry ?? 6,
      branchProbability: n ?? f.branchProbability ?? 0.3,
      noiseAmount: e ?? f.noiseAmount ?? 0.2,
      cellSize: h ?? f.cellSize ?? 3,
      glowEffect: t ?? f.glowEffect ?? !0,
      glowBlur: a ?? f.glowBlur ?? 12,
      interactive: m ?? !0,
      autoReset: k ?? !0,
      colorMode: W ?? f.colorMode ?? "solid",
      animated: Y ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: E ?? "100%",
          height: q ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: m ?? !0 ? "crosshair" : "default",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
sr.displayName = "CrystalGrowth";
const Ee = 300;
function lr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = 0, h = -1, t = [], a = [];
    const m = /* @__PURE__ */ new Set();
    function k(w, C) {
      return w * 1e4 + C;
    }
    function W(w, C) {
      const { nodeCount: M, wanderSpeed: p } = o.current;
      t = Array.from({ length: M }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        vx: (Math.random() - 0.5) * p,
        vy: (Math.random() - 0.5) * p,
        flash: 0
      })), a = [], m.clear();
    }
    function Y(w, C) {
      const M = window.devicePixelRatio || 1;
      c = w, g = C, i.width = Math.round(w * M), i.height = Math.round(C * M), i.style.width = `${w}px`, i.style.height = `${C}px`, s.scale(M, M), W(w, C);
    }
    const E = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && Y(C, M);
    });
    E.observe(l);
    const q = l.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $(w, C) {
      const { connectionRadius: M, pulseDecay: p } = o.current;
      if (C < 0.05 || a.length >= Ee) return;
      t[w].flash = Math.max(t[w].flash, C);
      const b = M * M, u = C * p;
      if (!(u < 0.05))
        for (let R = 0; R < t.length; R++) {
          if (R === w) continue;
          if (a.length >= Ee) break;
          const S = t[R].x - t[w].x, L = t[R].y - t[w].y;
          if (S * S + L * L > b) continue;
          const T = k(w, R);
          m.has(T) || (m.add(T), a.push({ fromIdx: w, toIdx: R, progress: 0, strength: u }));
        }
    }
    function I(w, C) {
      let M = -1, p = 1 / 0;
      for (let b = 0; b < t.length; b++) {
        const u = t[b].x - w, R = t[b].y - C, S = u * u + R * R;
        S < p && (p = S, M = b);
      }
      return M;
    }
    function f(w) {
      if (!o.current.interactive) return;
      const C = i.getBoundingClientRect();
      h = I(w.clientX - C.left, w.clientY - C.top);
    }
    function d() {
      h = -1;
    }
    function x(w) {
      if (!o.current.interactive) return;
      const C = i.getBoundingClientRect(), M = I(w.clientX - C.left, w.clientY - C.top);
      M >= 0 && $(M, 1);
    }
    function F(w) {
      if (!o.current.interactive) return;
      w.preventDefault();
      const C = i.getBoundingClientRect(), M = I(w.touches[0].clientX - C.left, w.touches[0].clientY - C.top);
      M >= 0 && $(M, 1);
    }
    l.addEventListener("mousemove", f), l.addEventListener("mouseleave", d), l.addEventListener("mousedown", x), l.addEventListener("touchstart", F, { passive: !1 });
    let v = 0;
    function B(w) {
      const C = v ? Math.min(w - v, 50) : 16;
      v = w;
      const { nodeColor: M, edgeColor: p, signalColor: b, backgroundColor: u, connectionRadius: R, nodeRadius: S, lineWidth: L, speed: T, pulseInterval: P, glowEffect: A, glowBlur: D, animated: z, wander: O, wanderSpeed: j } = o.current;
      if (t.length > 0 && w - e > P && (e = w, $(Math.random() * t.length | 0, 1)), s.fillStyle = u, s.fillRect(0, 0, c, g), !z) {
        n = requestAnimationFrame(B);
        return;
      }
      if (O) {
        const J = j * 2;
        for (const G of t)
          G.vx += (Math.random() - 0.5) * 0.05 * j, G.vy += (Math.random() - 0.5) * 0.05 * j, G.vx > J ? G.vx = J : G.vx < -J && (G.vx = -J), G.vy > J ? G.vy = J : G.vy < -J && (G.vy = -J), G.x += G.vx * C * 0.016, G.y += G.vy * C * 0.016, G.x < 0 ? (G.x = 0, G.vx = Math.abs(G.vx)) : G.x > c && (G.x = c, G.vx = -Math.abs(G.vx)), G.y < 0 ? (G.y = 0, G.vy = Math.abs(G.vy)) : G.y > g && (G.y = g, G.vy = -Math.abs(G.vy));
      }
      s.save(), s.lineWidth = L;
      const N = R * R;
      for (let J = 0; J < t.length; J++)
        for (let G = J + 1; G < t.length; G++) {
          const U = t[G].x - t[J].x, V = t[G].y - t[J].y, _ = U * U + V * V;
          if (_ > N) continue;
          const Q = (1 - Math.sqrt(_) / R) * 0.4;
          s.strokeStyle = Pt(p, Q), s.beginPath(), s.moveTo(t[J].x, t[J].y), s.lineTo(t[G].x, t[G].y), s.stroke();
        }
      s.restore(), s.save(), A && (s.shadowBlur = D, s.shadowColor = b);
      const H = T * C * 8e-4;
      for (let J = a.length - 1; J >= 0; J--) {
        const G = a[J];
        if (G.progress += H, G.progress >= 1) {
          m.delete(k(G.fromIdx, G.toIdx)), a.splice(J, 1), $(G.toIdx, G.strength);
          continue;
        }
        const U = t[G.fromIdx], V = t[G.toIdx], _ = U.x + (V.x - U.x) * G.progress, Q = U.y + (V.y - U.y) * G.progress;
        s.fillStyle = Pt(b, G.strength * 0.9), s.beginPath(), s.arc(_, Q, S * 0.6, 0, Math.PI * 2), s.fill();
      }
      s.shadowBlur = 0, s.restore(), s.save();
      for (let J = 0; J < t.length; J++) {
        const G = t[J], U = J === h, V = G.flash;
        G.flash = Math.max(0, V - 0.03);
        const _ = 0.4 + V * 0.6, Q = S * (U ? 1.5 : 1) * (1 + V * 0.4);
        A && (U || V > 0.1) ? (s.shadowBlur = D * (0.5 + V * 0.5), s.shadowColor = M) : s.shadowBlur = 0, s.fillStyle = Pt(M, _), s.beginPath(), s.arc(G.x, G.y, Q, 0, Math.PI * 2), s.fill();
      }
      s.shadowBlur = 0, s.restore(), n = requestAnimationFrame(B);
    }
    return n = requestAnimationFrame(B), () => {
      E.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousemove", f), l.removeEventListener("mouseleave", d), l.removeEventListener("mousedown", x), l.removeEventListener("touchstart", F);
    };
  }, [r]);
}
const cr = {
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
}, ur = ht(
  (r, y) => {
    const {
      preset: o,
      nodeCount: i,
      nodeColor: l,
      edgeColor: s,
      signalColor: c,
      backgroundColor: g,
      connectionRadius: n,
      nodeRadius: e,
      lineWidth: h,
      speed: t,
      pulseInterval: a,
      pulseDecay: m,
      glowEffect: k,
      glowBlur: W,
      interactive: Y,
      animated: E,
      wander: q,
      wanderSpeed: $,
      width: I,
      height: f,
      className: d,
      style: x
    } = r, F = o && cr[o] || {}, v = X(null);
    return gt(y, () => v.current), lr(v, {
      nodeCount: i ?? 40,
      nodeColor: l ?? F.nodeColor ?? "#ffffff",
      edgeColor: s ?? F.edgeColor ?? "#6b7280",
      signalColor: c ?? F.signalColor ?? "#ffffff",
      backgroundColor: g ?? F.backgroundColor ?? "#111111",
      connectionRadius: n ?? F.connectionRadius ?? 150,
      nodeRadius: e ?? F.nodeRadius ?? 4,
      lineWidth: h ?? 1,
      speed: t ?? 1,
      pulseInterval: a ?? F.pulseInterval ?? 2e3,
      pulseDecay: m ?? F.pulseDecay ?? 0.85,
      glowEffect: k ?? F.glowEffect ?? !0,
      glowBlur: W ?? F.glowBlur ?? 15,
      interactive: Y ?? !0,
      animated: E ?? !0,
      wander: q ?? !0,
      wanderSpeed: $ ?? F.wanderSpeed ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: d,
        style: {
          width: I ?? "100%",
          height: f ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: Y ?? !0 ? "pointer" : "default",
          ...x
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: v,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ur.displayName = "NeuralWeb";
function fr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = -9999, h = -9999, t = [];
    const a = { text: "", fontSize: -1, cssW: -1, cssH: -1 };
    function m(d, x, F, v) {
      const B = document.createElement("canvas");
      B.width = F, B.height = v;
      const w = B.getContext("2d");
      w.clearRect(0, 0, F, v), w.fillStyle = "#ffffff";
      const C = Math.min(x, v * 0.85, F * 0.9);
      w.font = `bold ${C}px ${o.current.fontFamily}`, w.textAlign = "center", w.textBaseline = "middle", w.fillText(d, F / 2, v / 2);
      const { particleGap: M } = o.current, p = w.getImageData(0, 0, F, v).data, b = [];
      for (let u = 0; u < v; u += M)
        for (let R = 0; R < F; R += M)
          p[(u * F + R) * 4 + 3] > 128 && b.push({ x: R, y: u, targetX: R, targetY: u, vx: 0, vy: 0 });
      return b;
    }
    function k(d, x) {
      const F = window.devicePixelRatio || 1;
      c = d, g = x, i.width = Math.round(d * F), i.height = Math.round(x * F), i.style.width = `${d}px`, i.style.height = `${x}px`, s.scale(F, F), a.cssW = -1;
    }
    const W = new ResizeObserver((d) => {
      const { width: x, height: F } = d[0].contentRect;
      x > 0 && F > 0 && k(x, F);
    });
    W.observe(l);
    const Y = l.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    function E(d) {
      if (!o.current.interactive) return;
      const x = i.getBoundingClientRect();
      e = d.clientX - x.left, h = d.clientY - x.top;
    }
    function q() {
      e = -9999, h = -9999;
    }
    function $(d) {
      if (!o.current.interactive) return;
      d.preventDefault();
      const x = i.getBoundingClientRect();
      e = d.touches[0].clientX - x.left, h = d.touches[0].clientY - x.top;
    }
    function I() {
      e = -9999, h = -9999;
    }
    l.addEventListener("mousemove", E), l.addEventListener("mouseleave", q), l.addEventListener("touchmove", $, { passive: !1 }), l.addEventListener("touchend", I);
    function f() {
      const { text: d, fontSize: x, color: F, backgroundColor: v, particleSize: B, repelRadius: w, repelForce: C, snapSpeed: M, friction: p, glowEffect: b, glowBlur: u, animated: R } = o.current;
      if (c > 0 && g > 0 && (d !== a.text || x !== a.fontSize || c !== a.cssW || g !== a.cssH) && (a.text = d, a.fontSize = x, a.cssW = c, a.cssH = g, t = m(d, x, c, g)), s.fillStyle = v, s.fillRect(0, 0, c, g), !R || t.length === 0) {
        n = requestAnimationFrame(f);
        return;
      }
      const S = w * w;
      s.save(), b && (s.shadowBlur = u, s.shadowColor = F), s.fillStyle = Pt(F, 1);
      for (const L of t) {
        L.vx += (L.targetX - L.x) * M, L.vy += (L.targetY - L.y) * M;
        const T = L.x - e, P = L.y - h, A = T * T + P * P;
        if (A < S && A > 0) {
          const D = Math.sqrt(A), z = (w - D) / w * C;
          L.vx += T / D * z, L.vy += P / D * z;
        }
        L.vx *= p, L.vy *= p, L.x += L.vx, L.y += L.vy, s.beginPath(), s.arc(L.x, L.y, B, 0, Math.PI * 2), s.fill();
      }
      s.restore(), n = requestAnimationFrame(f);
    }
    return n = requestAnimationFrame(f), () => {
      W.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousemove", E), l.removeEventListener("mouseleave", q), l.removeEventListener("touchmove", $), l.removeEventListener("touchend", I);
    };
  }, [r]);
}
const dr = {
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
}, hr = ht(
  (r, y) => {
    const {
      preset: o,
      text: i,
      fontSize: l,
      fontFamily: s,
      color: c,
      backgroundColor: g,
      particleSize: n,
      particleGap: e,
      repelRadius: h,
      repelForce: t,
      snapSpeed: a,
      friction: m,
      glowEffect: k,
      glowBlur: W,
      animated: Y,
      interactive: E,
      width: q,
      height: $,
      className: I,
      style: f
    } = r, d = o && dr[o] || {}, x = X(null);
    return gt(y, () => x.current), fr(x, {
      text: i ?? "hello",
      fontSize: l ?? 120,
      fontFamily: s ?? "sans-serif",
      color: c ?? d.color ?? "#ffffff",
      backgroundColor: g ?? d.backgroundColor ?? "#111111",
      particleSize: n ?? d.particleSize ?? 2,
      particleGap: e ?? 4,
      repelRadius: h ?? d.repelRadius ?? 80,
      repelForce: t ?? d.repelForce ?? 5,
      snapSpeed: a ?? d.snapSpeed ?? 0.12,
      friction: m ?? 0.85,
      glowEffect: k ?? d.glowEffect ?? !1,
      glowBlur: W ?? d.glowBlur ?? 6,
      animated: Y ?? !0,
      interactive: E ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: q ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: E ?? !0 ? "crosshair" : "default",
          ...f
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: x,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
hr.displayName = "ParticleText";
function gr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = [], h = -1, t = 0, a = 0;
    const m = document.createElement("canvas"), k = m.getContext("2d");
    let W = null, Y = 0, E = 0, q = -1;
    function $(u, R) {
      const { blobCount: S, minRadius: L, maxRadius: T, speed: P } = o.current;
      e = Array.from({ length: S }, () => {
        const A = L + Math.random() * (T - L);
        return {
          x: A + Math.random() * (u - A * 2),
          y: A + Math.random() * (R - A * 2),
          vx: (Math.random() - 0.5) * P * 2,
          vy: (Math.random() - 0.5) * P * 2,
          radius: A
        };
      });
    }
    function I(u, R) {
      const { resolution: S } = o.current;
      S === q && Y > 0 || (q = S, Y = Math.max(1, Math.round(u * S)), E = Math.max(1, Math.round(R * S)), m.width = Y, m.height = E, W = k.createImageData(Y, E));
    }
    function f(u, R) {
      const S = window.devicePixelRatio || 1;
      c = u, g = R, i.width = Math.round(u * S), i.height = Math.round(R * S), i.style.width = `${u}px`, i.style.height = `${R}px`, s.scale(S, S), q = -1, I(u, R), $(u, R);
    }
    const d = new ResizeObserver((u) => {
      const { width: R, height: S } = u[0].contentRect;
      R > 0 && S > 0 && f(R, S);
    });
    d.observe(l);
    const x = l.getBoundingClientRect();
    x.width > 0 && x.height > 0 && f(x.width, x.height);
    function F(u, R) {
      for (let S = 0; S < e.length; S++) {
        const L = e[S].x - u, T = e[S].y - R;
        if (L * L + T * T < e[S].radius * e[S].radius) return S;
      }
      return -1;
    }
    function v(u) {
      if (!o.current.interactive) return;
      const R = i.getBoundingClientRect(), S = u.clientX - R.left, L = u.clientY - R.top, T = F(S, L);
      if (T >= 0)
        h = T, t = S - e[T].x, a = L - e[T].y;
      else {
        const { minRadius: P, maxRadius: A } = o.current, D = P + Math.random() * (A - P);
        e.push({ x: S, y: L, vx: 0, vy: 0, radius: D });
      }
    }
    function B(u) {
      if (!o.current.interactive || h < 0) return;
      const R = i.getBoundingClientRect();
      e[h].x = u.clientX - R.left - t, e[h].y = u.clientY - R.top - a, e[h].vx = 0, e[h].vy = 0;
    }
    function w() {
      h = -1;
    }
    function C(u) {
      if (!o.current.interactive) return;
      u.preventDefault();
      const R = i.getBoundingClientRect(), S = u.touches[0].clientX - R.left, L = u.touches[0].clientY - R.top, T = F(S, L);
      T >= 0 && (h = T, t = S - e[T].x, a = L - e[T].y);
    }
    function M(u) {
      if (!o.current.interactive || h < 0) return;
      u.preventDefault();
      const R = i.getBoundingClientRect();
      e[h].x = u.touches[0].clientX - R.left - t, e[h].y = u.touches[0].clientY - R.top - a, e[h].vx = 0, e[h].vy = 0;
    }
    function p() {
      h = -1;
    }
    l.addEventListener("mousedown", v), l.addEventListener("mousemove", B), window.addEventListener("mouseup", w), l.addEventListener("touchstart", C, { passive: !1 }), l.addEventListener("touchmove", M, { passive: !1 }), l.addEventListener("touchend", p);
    function b() {
      const { blobCount: u, color: R, backgroundColor: S, threshold: L, speed: T, glowEffect: P, glowBlur: A, animated: D, resolution: z } = o.current;
      if (z !== q && (q = -1, I(c, g)), u !== e.length && h < 0 && c > 0) {
        for (; e.length < u; ) {
          const { minRadius: K, maxRadius: et } = o.current, tt = K + Math.random() * (et - K);
          e.push({
            x: tt + Math.random() * Math.max(1, c - tt * 2),
            y: tt + Math.random() * Math.max(1, g - tt * 2),
            vx: (Math.random() - 0.5) * T * 2,
            vy: (Math.random() - 0.5) * T * 2,
            radius: tt
          });
        }
        for (; e.length > u; ) e.pop();
      }
      if (s.fillStyle = S, s.fillRect(0, 0, c, g), !D || !W || Y === 0) {
        n = requestAnimationFrame(b);
        return;
      }
      const O = c / Y, j = g / E;
      for (let K = 0; K < e.length; K++) {
        if (K === h) continue;
        const et = e[K];
        et.vx += (Math.random() - 0.5) * 0.1 * T, et.vy += (Math.random() - 0.5) * 0.1 * T;
        const tt = T * 2;
        et.vx > tt ? et.vx = tt : et.vx < -tt && (et.vx = -tt), et.vy > tt ? et.vy = tt : et.vy < -tt && (et.vy = -tt), et.x += et.vx, et.y += et.vy, et.x < et.radius ? (et.x = et.radius, et.vx = Math.abs(et.vx)) : et.x > c - et.radius && (et.x = c - et.radius, et.vx = -Math.abs(et.vx)), et.y < et.radius ? (et.y = et.radius, et.vy = Math.abs(et.vy)) : et.y > g - et.radius && (et.y = g - et.radius, et.vy = -Math.abs(et.vy));
      }
      const [N, H, J] = xt([S], 0), [G, U, V] = xt([R], 0), _ = W.data, Q = L * 0.8, ot = L * 0.2;
      for (let K = 0; K < E; K++) {
        const et = K * j;
        for (let tt = 0; tt < Y; tt++) {
          const nt = tt * O;
          let rt = 0;
          for (const st of e) {
            const lt = nt - st.x, ct = et - st.y, ut = lt * lt + ct * ct;
            if (ut < 1) {
              rt = 99;
              break;
            }
            rt += st.radius * st.radius / ut;
          }
          const Z = Math.min(1, Math.max(0, (rt - Q) / ot)), at = (K * Y + tt) * 4;
          _[at] = N + (G - N) * Z | 0, _[at + 1] = H + (U - H) * Z | 0, _[at + 2] = J + (V - J) * Z | 0, _[at + 3] = 255;
        }
      }
      k.putImageData(W, 0, 0), s.save(), P && (s.shadowBlur = A, s.shadowColor = R), s.imageSmoothingEnabled = !0, s.imageSmoothingQuality = "medium", s.drawImage(m, 0, 0, c, g), s.restore(), n = requestAnimationFrame(b);
    }
    return n = requestAnimationFrame(b), () => {
      d.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousedown", v), l.removeEventListener("mousemove", B), window.removeEventListener("mouseup", w), l.removeEventListener("touchstart", C), l.removeEventListener("touchmove", M), l.removeEventListener("touchend", p);
    };
  }, [r]);
}
const pr = {
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
}, mr = ht(
  (r, y) => {
    const {
      preset: o,
      blobCount: i,
      color: l,
      backgroundColor: s,
      threshold: c,
      speed: g,
      minRadius: n,
      maxRadius: e,
      glowEffect: h,
      glowBlur: t,
      resolution: a,
      animated: m,
      interactive: k,
      width: W,
      height: Y,
      className: E,
      style: q
    } = r, $ = o && pr[o] || {}, I = X(null);
    return gt(y, () => I.current), gr(I, {
      blobCount: i ?? 5,
      color: l ?? $.color ?? "#ffffff",
      backgroundColor: s ?? $.backgroundColor ?? "#111111",
      threshold: c ?? $.threshold ?? 1,
      speed: g ?? $.speed ?? 1,
      minRadius: n ?? $.minRadius ?? 40,
      maxRadius: e ?? $.maxRadius ?? 80,
      glowEffect: h ?? $.glowEffect ?? !0,
      glowBlur: t ?? $.glowBlur ?? 20,
      resolution: a ?? 0.4,
      animated: m ?? !0,
      interactive: k ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: E,
        style: {
          width: W ?? "100%",
          height: Y ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: k ?? !0 ? "grab" : "default",
          ...q
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
mr.displayName = "Metaballs";
function yr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = [], h = [], t = new Float32Array(0), a = new Float32Array(0), m = 0, k = 0, W = 0, Y = 0;
    const E = document.createElement("canvas"), q = E.getContext("2d");
    let $ = null, I = -1;
    const f = 18, d = 12;
    function x(u, R) {
      const { resolution: S } = o.current;
      S === I && m > 0 || (I = S, m = Math.max(1, Math.round(u * S)), k = Math.max(1, Math.round(R * S)), t = new Float32Array(m * k), a = new Float32Array(m * k), E.width = m, E.height = k, $ = q.createImageData(m, k));
    }
    function F(u, R) {
      const { antCount: S } = o.current;
      W = u / 2, Y = R / 2, e = Array.from({ length: S }, () => ({
        x: W,
        y: Y,
        angle: Math.random() * Math.PI * 2,
        hasFood: !1
      }));
    }
    function v(u, R) {
      const S = window.devicePixelRatio || 1;
      c = u, g = R, i.width = Math.round(u * S), i.height = Math.round(R * S), i.style.width = `${u}px`, i.style.height = `${R}px`, s.scale(S, S), I = -1, x(u, R), F(u, R), h = [];
    }
    const B = new ResizeObserver((u) => {
      const { width: R, height: S } = u[0].contentRect;
      R > 0 && S > 0 && v(R, S);
    });
    B.observe(l);
    const w = l.getBoundingClientRect();
    w.width > 0 && w.height > 0 && v(w.width, w.height);
    function C(u) {
      if (!o.current.interactive) return;
      const R = i.getBoundingClientRect(), S = u.clientX - R.left, L = u.clientY - R.top;
      h.length < o.current.maxFood && h.push({ x: S, y: L, amount: 200 });
    }
    function M(u) {
      if (!o.current.interactive) return;
      u.preventDefault();
      const R = i.getBoundingClientRect(), S = u.touches[0].clientX - R.left, L = u.touches[0].clientY - R.top;
      h.length < o.current.maxFood && h.push({ x: S, y: L, amount: 200 });
    }
    l.addEventListener("mousedown", C), l.addEventListener("touchstart", M, { passive: !1 });
    function p(u, R, S) {
      const L = Math.max(0, Math.min(m - 1, R | 0)), T = Math.max(0, Math.min(k - 1, S | 0));
      return u[T * m + L];
    }
    function b() {
      const {
        evaporationRate: u,
        diffusionRate: R,
        pheromoneStrength: S,
        antSpeed: L,
        sensorAngle: T,
        sensorDistance: P,
        turnSpeed: A,
        antColor: D,
        pheromoneColor: z,
        backgroundColor: O,
        foodColor: j,
        nestColor: N,
        resolution: H,
        animated: J
      } = o.current;
      if (H !== I && (I = -1, x(c, g)), s.fillStyle = O, s.fillRect(0, 0, c, g), !J || m === 0 || !$) {
        n = requestAnimationFrame(b);
        return;
      }
      const G = c / m, U = g / k;
      for (let Z = 0; Z < t.length; Z++)
        t[Z] *= 1 - u, a[Z] *= 1 - u, t[Z] < 1e-3 && (t[Z] = 0), a[Z] < 1e-3 && (a[Z] = 0);
      if (R > 0) {
        const Z = R * 0.25;
        for (let at = 1; at < k - 1; at++)
          for (let st = 1; st < m - 1; st++) {
            const lt = at * m + st, ct = t, ut = a, pt = ct[lt - 1] + ct[lt + 1] + ct[lt - m] + ct[lt + m], Ct = ut[lt - 1] + ut[lt + 1] + ut[lt - m] + ut[lt + m];
            ct[lt] += (pt * 0.25 - ct[lt]) * Z, ut[lt] += (Ct * 0.25 - ut[lt]) * Z;
          }
      }
      for (const Z of e) {
        const at = Z.hasFood ? a : t, st = Z.angle, lt = Z.angle - T, ct = Z.angle + T, ut = (yt) => {
          const St = Z.x + Math.cos(yt) * P, Tt = Z.y + Math.sin(yt) * P;
          return p(at, St / G, Tt / U);
        }, pt = ut(lt), Ct = ut(st), vt = ut(ct);
        Ct >= pt && Ct >= vt || (pt > vt ? Z.angle -= A * Math.random() : vt > pt ? Z.angle += A * Math.random() : Z.angle += (Math.random() - 0.5) * A), Z.angle += (Math.random() - 0.5) * 0.2, Z.x += Math.cos(Z.angle) * L, Z.y += Math.sin(Z.angle) * L, Z.x < 0 ? (Z.x = 0, Z.angle = Math.PI - Z.angle) : Z.x >= c && (Z.x = c - 1, Z.angle = Math.PI - Z.angle), Z.y < 0 ? (Z.y = 0, Z.angle = -Z.angle) : Z.y >= g && (Z.y = g - 1, Z.angle = -Z.angle);
        const Et = Math.max(0, Math.min(m - 1, Z.x / G | 0)), bt = Math.max(0, Math.min(k - 1, Z.y / U | 0)) * m + Et;
        Z.hasFood ? t[bt] = Math.min(255, t[bt] + S) : a[bt] = Math.min(255, a[bt] + S);
        const kt = Z.x - W, Rt = Z.y - Y;
        if (Z.hasFood && kt * kt + Rt * Rt < f * f && (Z.hasFood = !1, Z.angle += Math.PI), !Z.hasFood)
          for (let yt = h.length - 1; yt >= 0; yt--) {
            const St = h[yt], Tt = Z.x - St.x, qt = Z.y - St.y;
            if (Tt * Tt + qt * qt < d * d && St.amount > 0) {
              Z.hasFood = !0, Z.angle += Math.PI, St.amount--, St.amount <= 0 && h.splice(yt, 1);
              break;
            }
          }
      }
      const [V, _, Q] = xt([O], 0), [ot, K, et] = xt([z], 0), tt = $.data, nt = m * k, rt = Math.max(1, S * 8);
      for (let Z = 0; Z < nt; Z++) {
        const at = t[Z] / rt, st = a[Z] / rt, lt = Math.min(1, at + st), ct = Z * 4;
        tt[ct] = V + (ot - V) * lt | 0, tt[ct + 1] = _ + (K - _) * lt | 0, tt[ct + 2] = Q + (et - Q) * lt | 0, tt[ct + 3] = 255;
      }
      q.putImageData($, 0, 0), s.imageSmoothingEnabled = !0, s.imageSmoothingQuality = "medium", s.drawImage(E, 0, 0, c, g), s.save(), s.beginPath(), s.arc(W, Y, f, 0, Math.PI * 2), s.fillStyle = N, s.fill(), s.restore(), s.save();
      for (const Z of h)
        s.beginPath(), s.arc(Z.x, Z.y, d, 0, Math.PI * 2), s.fillStyle = j, s.fill();
      s.restore(), s.save(), s.fillStyle = D;
      for (const Z of e)
        s.beginPath(), s.arc(Z.x, Z.y, 1.5, 0, Math.PI * 2), s.fill();
      s.restore(), n = requestAnimationFrame(b);
    }
    return n = requestAnimationFrame(b), () => {
      B.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousedown", C), l.removeEventListener("touchstart", M);
    };
  }, [r]);
}
const wr = {
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
}, vr = ht(
  (r, y) => {
    const {
      preset: o,
      antCount: i,
      evaporationRate: l,
      diffusionRate: s,
      pheromoneStrength: c,
      antSpeed: g,
      sensorAngle: n,
      sensorDistance: e,
      turnSpeed: h,
      antColor: t,
      pheromoneColor: a,
      foodColor: m,
      nestColor: k,
      backgroundColor: W,
      resolution: Y,
      animated: E,
      interactive: q,
      maxFood: $,
      width: I,
      height: f,
      className: d,
      style: x
    } = r, F = o && wr[o] || {}, v = X(null);
    return gt(y, () => v.current), yr(v, {
      antCount: i ?? F.antCount ?? 150,
      evaporationRate: l ?? F.evaporationRate ?? 3e-3,
      diffusionRate: s ?? 0.1,
      pheromoneStrength: c ?? F.pheromoneStrength ?? 5,
      antSpeed: g ?? F.antSpeed ?? 1.5,
      sensorAngle: n ?? 0.4,
      sensorDistance: e ?? 6,
      turnSpeed: h ?? 0.3,
      antColor: t ?? F.antColor ?? "#ffffff",
      pheromoneColor: a ?? F.pheromoneColor ?? "#6b7280",
      foodColor: m ?? F.foodColor ?? "#4ade80",
      nestColor: k ?? F.nestColor ?? "#f59e0b",
      backgroundColor: W ?? F.backgroundColor ?? "#111111",
      resolution: Y ?? 0.5,
      animated: E ?? !0,
      interactive: q ?? !0,
      maxFood: $ ?? 5
    }), /* @__PURE__ */ it(
      "div",
      {
        className: d,
        style: {
          width: I ?? "100%",
          height: f ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: q ?? !0 ? "crosshair" : "default",
          ...x
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: v,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
vr.displayName = "AntColony";
function br(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = !0, h = [], t = -1, a = 0, m = 0;
    function k(C, M) {
      h = [
        { x: C * 0.35, y: M * 0.5, charge: 1 },
        { x: C * 0.65, y: M * 0.5, charge: -1 }
      ];
    }
    function W(C, M) {
      const p = window.devicePixelRatio || 1;
      c = C, g = M, i.width = Math.round(C * p), i.height = Math.round(M * p), i.style.width = `${C}px`, i.style.height = `${M}px`, s.scale(p, p), k(C, M), e = !0;
    }
    const Y = new ResizeObserver((C) => {
      const { width: M, height: p } = C[0].contentRect;
      M > 0 && p > 0 && W(M, p);
    });
    Y.observe(l);
    const E = l.getBoundingClientRect();
    E.width > 0 && E.height > 0 && W(E.width, E.height);
    function q(C, M) {
      let p = 0, b = 0;
      for (const u of h) {
        const R = C - u.x, S = M - u.y, L = R * R + S * S;
        if (L < 1) continue;
        const T = Math.sqrt(L), P = u.charge / L;
        p += R / T * P, b += S / T * P;
      }
      return [p, b];
    }
    function $() {
      const { fieldLineCount: C, stepSize: M, maxSteps: p, lineColor: b, lineWidth: u, lineOpacity: R, poleRadius: S, glowEffect: L, glowBlur: T, positiveColor: P, negativeColor: A, backgroundColor: D } = o.current;
      s.fillStyle = D, s.fillRect(0, 0, c, g);
      const z = S * S;
      s.save(), s.lineWidth = u;
      for (const O of h) {
        const j = O.charge;
        for (let N = 0; N < C; N++) {
          const H = N / C * Math.PI * 2;
          let J = O.x + Math.cos(H) * (S + 2), G = O.y + Math.sin(H) * (S + 2);
          s.beginPath(), s.moveTo(J, G);
          let U = 0;
          for (let V = 0; V < p; V++) {
            const [_, Q] = q(J, G), ot = Math.sqrt(_ * _ + Q * Q);
            if (ot < 1e-10) break;
            const K = J + _ / ot * M * j, et = G + Q / ot * M * j;
            if (K < 0 || K > c || et < 0 || et > g) break;
            let tt = !1;
            for (const nt of h) {
              const rt = K - nt.x, Z = et - nt.y;
              if (rt * rt + Z * Z < z) {
                tt = !0;
                break;
              }
            }
            if (tt) break;
            s.lineTo(K, et), J = K, G = et, U++;
          }
          U !== 0 && (L && (s.shadowBlur = T * 0.5, s.shadowColor = b), s.strokeStyle = Pt(b, R), s.stroke());
        }
      }
      s.shadowBlur = 0, s.restore(), s.save();
      for (const O of h) {
        const j = O.charge === 1 ? P : A;
        L && (s.shadowBlur = T, s.shadowColor = j), s.fillStyle = j, s.beginPath(), s.arc(O.x, O.y, S, 0, Math.PI * 2), s.fill(), s.shadowBlur = 0, s.fillStyle = "#ffffff", s.font = `bold ${S}px sans-serif`, s.textAlign = "center", s.textBaseline = "middle", s.fillText(O.charge === 1 ? "N" : "S", O.x, O.y);
      }
      s.restore();
    }
    function I(C) {
      if (!o.current.interactive) return;
      const M = i.getBoundingClientRect(), p = C.clientX - M.left, b = C.clientY - M.top, { poleRadius: u, maxPoles: R } = o.current, S = u * 2;
      let L = -1;
      for (let T = 0; T < h.length; T++) {
        const P = h[T].x - p, A = h[T].y - b;
        if (P * P + A * A < S * S) {
          L = T;
          break;
        }
      }
      if (L >= 0)
        t = L, a = p - h[L].x, m = b - h[L].y;
      else if (h.length < R) {
        const T = h.length % 2 === 0 ? 1 : -1;
        h.push({ x: p, y: b, charge: T }), e = !0;
      }
    }
    function f(C) {
      if (!o.current.interactive || t < 0) return;
      const M = i.getBoundingClientRect();
      h[t].x = C.clientX - M.left - a, h[t].y = C.clientY - M.top - m, e = !0;
    }
    function d() {
      t = -1;
    }
    function x(C) {
      if (!o.current.interactive || (C.preventDefault(), h.length <= 2)) return;
      const M = i.getBoundingClientRect(), p = C.clientX - M.left, b = C.clientY - M.top, { poleRadius: u } = o.current, R = u * 2;
      for (let S = 0; S < h.length; S++) {
        const L = h[S].x - p, T = h[S].y - b;
        if (L * L + T * T < R * R) {
          h.splice(S, 1), e = !0;
          break;
        }
      }
    }
    function F(C) {
      if (!o.current.interactive) return;
      C.preventDefault();
      const M = i.getBoundingClientRect(), p = C.touches[0].clientX - M.left, b = C.touches[0].clientY - M.top, { poleRadius: u } = o.current, R = u * 2;
      for (let S = 0; S < h.length; S++) {
        const L = h[S].x - p, T = h[S].y - b;
        if (L * L + T * T < R * R) {
          t = S, a = p - h[S].x, m = b - h[S].y;
          return;
        }
      }
    }
    function v(C) {
      if (!o.current.interactive || t < 0) return;
      C.preventDefault();
      const M = i.getBoundingClientRect();
      h[t].x = C.touches[0].clientX - M.left - a, h[t].y = C.touches[0].clientY - M.top - m, e = !0;
    }
    function B() {
      t = -1;
    }
    l.addEventListener("mousedown", I), l.addEventListener("mousemove", f), window.addEventListener("mouseup", d), l.addEventListener("contextmenu", x), l.addEventListener("touchstart", F, { passive: !1 }), l.addEventListener("touchmove", v, { passive: !1 }), l.addEventListener("touchend", B);
    function w() {
      const { animated: C } = o.current;
      (C || e) && ($(), e = !1), n = requestAnimationFrame(w);
    }
    return n = requestAnimationFrame(w), () => {
      Y.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousedown", I), l.removeEventListener("mousemove", f), window.removeEventListener("mouseup", d), l.removeEventListener("contextmenu", x), l.removeEventListener("touchstart", F), l.removeEventListener("touchmove", v), l.removeEventListener("touchend", B);
    };
  }, [r]);
}
const Cr = {
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
}, Mr = ht(
  (r, y) => {
    const {
      preset: o,
      fieldLineCount: i,
      stepSize: l,
      maxSteps: s,
      positiveColor: c,
      negativeColor: g,
      lineColor: n,
      backgroundColor: e,
      lineWidth: h,
      lineOpacity: t,
      poleRadius: a,
      glowEffect: m,
      glowBlur: k,
      animated: W,
      interactive: Y,
      maxPoles: E,
      width: q,
      height: $,
      className: I,
      style: f
    } = r, d = o && Cr[o] || {}, x = X(null);
    return gt(y, () => x.current), br(x, {
      fieldLineCount: i ?? d.fieldLineCount ?? 16,
      stepSize: l ?? 4,
      maxSteps: s ?? 400,
      positiveColor: c ?? d.positiveColor ?? "#ef4444",
      negativeColor: g ?? d.negativeColor ?? "#3b82f6",
      lineColor: n ?? d.lineColor ?? "#6b7280",
      backgroundColor: e ?? d.backgroundColor ?? "#111111",
      lineWidth: h ?? 1,
      lineOpacity: t ?? d.lineOpacity ?? 0.6,
      poleRadius: a ?? 12,
      glowEffect: m ?? d.glowEffect ?? !0,
      glowBlur: k ?? d.glowBlur ?? 20,
      animated: W ?? !1,
      interactive: Y ?? !0,
      maxPoles: E ?? 6
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: q ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: Y ?? !0 ? "pointer" : "default",
          ...f
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: x,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Mr.displayName = "MagneticField";
function Pe(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function fe(r, y, o) {
  return r + o * (y - r);
}
function Qt(r, y, o) {
  const i = r & 3, l = i < 2 ? y : o, s = i < 2 ? o : y;
  return (i & 1 ? -l : l) + (i & 2 ? -s : s);
}
const Gt = new Uint8Array(256);
for (let r = 0; r < 256; r++) Gt[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [Gt[r], Gt[y]] = [Gt[y], Gt[r]];
}
const $t = new Uint8Array(512);
for (let r = 0; r < 512; r++) $t[r] = Gt[r & 255];
function xr(r, y) {
  const o = Math.floor(r) & 255, i = Math.floor(y) & 255, l = r - Math.floor(r), s = y - Math.floor(y), c = Pe(l), g = Pe(s), n = $t[$t[o] + i], e = $t[$t[o] + i + 1], h = $t[$t[o + 1] + i], t = $t[$t[o + 1] + i + 1];
  return fe(
    fe(Qt(n, l, s), Qt(h, l - 1, s), c),
    fe(Qt(e, l, s - 1), Qt(t, l - 1, s - 1), c),
    g
  );
}
function Rr(r, y, o, i) {
  let l = 0, s = 1, c = 1, g = 0;
  for (let n = 0; n < o; n++)
    l += xr(r * c, y * c) * s, g += s, s *= i, c *= 2;
  return l / g;
}
function Sr(r) {
  const y = r.replace("#", "");
  return [
    parseInt(y.slice(0, 2), 16) || 0,
    parseInt(y.slice(2, 4), 16) || 0,
    parseInt(y.slice(4, 6), 16) || 0
  ];
}
function kr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const s = i.getContext("2d");
    let c = 0, g = 0, n = 0, e = y.rotateY, h = y.rotateX, t = null, a = "", m = 255, k = 255, W = 255, Y = "", E = !1, q = 0, $ = 0;
    function I(b, u) {
      const R = window.devicePixelRatio || 1;
      c = b, g = u, i.width = Math.round(b * R), i.height = Math.round(u * R), i.style.width = `${b}px`, i.style.height = `${u}px`, s.scale(R, R);
    }
    const f = new ResizeObserver((b) => {
      const { width: u, height: R } = b[0].contentRect;
      u > 0 && R > 0 && I(u, R);
    });
    f.observe(l);
    const d = l.getBoundingClientRect();
    d.width > 0 && d.height > 0 && I(d.width, d.height);
    function x(b) {
      o.current.interactive && (E = !0, q = b.clientX, $ = b.clientY);
    }
    function F(b) {
      !o.current.interactive || !E || (e += (b.clientX - q) * 5e-3, h += (b.clientY - $) * 5e-3, h = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, h)), q = b.clientX, $ = b.clientY);
    }
    function v() {
      E = !1;
    }
    function B(b) {
      o.current.interactive && (E = !0, q = b.touches[0].clientX, $ = b.touches[0].clientY);
    }
    function w(b) {
      !o.current.interactive || !E || (b.preventDefault(), e += (b.touches[0].clientX - q) * 5e-3, h += (b.touches[0].clientY - $) * 5e-3, h = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, h)), q = b.touches[0].clientX, $ = b.touches[0].clientY);
    }
    function C() {
      E = !1;
    }
    l.addEventListener("mousedown", x), l.addEventListener("mousemove", F), window.addEventListener("mouseup", v), l.addEventListener("touchstart", B, { passive: !1 }), l.addEventListener("touchmove", w, { passive: !1 }), l.addEventListener("touchend", C);
    function M(b, u, R, S, L, T) {
      const P = Math.cos(e), A = Math.sin(e), D = Math.cos(h), z = Math.sin(h), O = b * P - R * A, j = b * A + R * P, N = u * D - j * z, H = u * z + j * D, J = S + H + 600;
      return [L + O * S / J, T + N * S / J, H];
    }
    function p() {
      const {
        gridCols: b,
        gridRows: u,
        noiseScale: R,
        heightScale: S,
        wireColor: L,
        backgroundColor: T,
        fov: P,
        autoRotate: A,
        autoRotateSpeed: D,
        glowEffect: z,
        glowBlur: O,
        animated: j,
        lineWidth: N,
        colorByHeight: H
      } = o.current;
      if (A && !E && (e += D), s.fillStyle = T, s.fillRect(0, 0, c, g), !j || c === 0) {
        n = requestAnimationFrame(p);
        return;
      }
      const J = `${b},${u},${R}`;
      if (J !== a) {
        const Z = b + 1;
        t = new Float32Array(Z * (u + 1));
        for (let at = 0; at <= u; at++)
          for (let st = 0; st <= b; st++)
            t[at * Z + st] = Rr(st * R, at * R, 4, 0.5);
        a = J;
      }
      const G = t, U = b + 1;
      L !== Y && ([m, k, W] = Sr(L), Y = L);
      const V = c / 2, _ = g / 2, Q = c * 0.9, ot = g * 0.9, K = Q / b, et = ot / u;
      s.save(), z && (s.shadowBlur = O, s.shadowColor = L), s.lineWidth = N;
      const tt = new Float32Array(U * (u + 1)), nt = new Float32Array(U * (u + 1)), rt = new Float32Array(U * (u + 1));
      for (let Z = 0; Z <= u; Z++)
        for (let at = 0; at <= b; at++) {
          const st = G[Z * U + at], lt = -Q / 2 + at * K, ct = -ot / 2 + Z * et, [ut, pt, Ct] = M(lt, ct, st * S, P, V, _), vt = Z * U + at;
          tt[vt] = ut, nt[vt] = pt, rt[vt] = Ct;
        }
      for (let Z = 0; Z <= u; Z++) {
        let at = 0;
        const st = Z * U;
        for (let ut = 0; ut <= b; ut++) at += G[st + ut];
        at /= U;
        const lt = H ? Math.max(0, Math.min(1, (at + 1) * 0.5)) : 1, ct = H ? 0.2 + lt * 0.8 : 0.6;
        s.strokeStyle = `rgba(${m},${k},${W},${ct.toFixed(2)})`, s.beginPath(), s.moveTo(tt[st], nt[st]);
        for (let ut = 1; ut <= b; ut++)
          s.lineTo(tt[st + ut], nt[st + ut]);
        s.stroke();
      }
      for (let Z = 0; Z <= b; Z++) {
        let at = 0;
        for (let ct = 0; ct <= u; ct++) at += G[ct * U + Z];
        at /= u + 1;
        const st = H ? Math.max(0, Math.min(1, (at + 1) * 0.5)) : 1, lt = H ? 0.2 + st * 0.8 : 0.6;
        s.strokeStyle = `rgba(${m},${k},${W},${lt.toFixed(2)})`, s.beginPath(), s.moveTo(tt[Z], nt[Z]);
        for (let ct = 1; ct <= u; ct++)
          s.lineTo(tt[ct * U + Z], nt[ct * U + Z]);
        s.stroke();
      }
      s.restore(), n = requestAnimationFrame(p);
    }
    return n = requestAnimationFrame(p), () => {
      f.disconnect(), cancelAnimationFrame(n), l.removeEventListener("mousedown", x), l.removeEventListener("mousemove", F), window.removeEventListener("mouseup", v), l.removeEventListener("touchstart", B), l.removeEventListener("touchmove", w), l.removeEventListener("touchend", C);
    };
  }, [r]);
}
const Er = {
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
}, Pr = ht(
  (r, y) => {
    const {
      preset: o,
      gridCols: i,
      gridRows: l,
      noiseScale: s,
      heightScale: c,
      wireColor: g,
      backgroundColor: n,
      fov: e,
      rotateX: h,
      rotateY: t,
      autoRotate: a,
      autoRotateSpeed: m,
      glowEffect: k,
      glowBlur: W,
      interactive: Y,
      animated: E,
      lineWidth: q,
      colorByHeight: $,
      width: I,
      height: f,
      className: d,
      style: x
    } = r, F = o && Er[o] || {}, v = X(null);
    return gt(y, () => v.current), kr(v, {
      gridCols: i ?? 40,
      gridRows: l ?? 30,
      noiseScale: s ?? F.noiseScale ?? 0.12,
      heightScale: c ?? F.heightScale ?? 120,
      wireColor: g ?? F.wireColor ?? "#ffffff",
      backgroundColor: n ?? F.backgroundColor ?? "#111111",
      fov: e ?? 500,
      rotateX: h ?? 0.4,
      rotateY: t ?? 0,
      autoRotate: a ?? !0,
      autoRotateSpeed: m ?? 3e-3,
      glowEffect: k ?? F.glowEffect ?? !1,
      glowBlur: W ?? F.glowBlur ?? 8,
      interactive: Y ?? !0,
      animated: E ?? !0,
      lineWidth: q ?? F.lineWidth ?? 0.5,
      colorByHeight: $ ?? F.colorByHeight ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: d,
        style: {
          width: I ?? "100%",
          height: f ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: Y ?? !0 ? "grab" : "default",
          ...x
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: v,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Pr.displayName = "TerrainMesh";
function Ar(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X({ x: -999, y: -999 }), n = X(0);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const t = e.getContext("2d");
    let a = 0, m = 0;
    function k() {
      const { segmentCount: w } = o.current, C = a / 2, M = m / 2;
      i.current = Array.from({ length: w }, (p, b) => ({
        x: C - b * 12,
        y: M
      })), g.current = { x: C, y: M };
    }
    function W(w, C) {
      const { starCount: M } = o.current;
      s.current = Array.from({ length: M }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function Y(w, C) {
      const M = window.devicePixelRatio || 1;
      e.width = Math.round(w * M), e.height = Math.round(C * M), e.style.width = `${w}px`, e.style.height = `${C}px`, t.scale(M, M), a = w, m = C, k(), W(w, C);
    }
    const E = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && Y(C, M);
    });
    E.observe(h);
    const q = h.getBoundingClientRect();
    q.width > 0 && q.height > 0 && Y(q.width, q.height);
    function $(w) {
      if (!o.current.interactive) return;
      const C = e.getBoundingClientRect();
      g.current = { x: w.clientX - C.left, y: w.clientY - C.top };
    }
    e.addEventListener("mousemove", $);
    function I(w, C, M, p) {
      const { segmentSize: b } = o.current, u = Math.sqrt(M * M + p * p) || 1, R = M / u, S = p / u, L = 3 + Math.floor(Math.random() * 2);
      for (let T = 0; T < L; T++) {
        const A = 40 + Math.random() * 20;
        l.current.push({
          x: w + R * b * 0.9,
          y: C + S * b * 0.9,
          vx: R * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8,
          vy: S * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8 - 0.3,
          life: A,
          maxLife: A,
          size: 3 + Math.random() * 5
        });
      }
      l.current.length > 200 && l.current.splice(0, 30);
    }
    function f(w, C, M, p, b, u, R) {
      t.save(), t.translate(w, C), t.rotate(M);
      for (const S of [-1, 1]) {
        const L = S * Math.PI / 2, P = [
          { a: L + b * S - 0.35, len: p * 0.7 },
          { a: L + b * S, len: p },
          { a: L + b * S + 0.3, len: p * 0.75 }
        ].map((A) => ({
          x: Math.cos(A.a) * A.len,
          y: Math.sin(A.a) * A.len
        }));
        for (const A of P)
          t.beginPath(), t.moveTo(0, 0), t.lineTo(A.x, A.y), t.strokeStyle = `rgba(${u},${R * 0.85})`, t.lineWidth = 1.5, t.lineCap = "round", t.stroke(), t.beginPath(), t.arc(A.x * 0.55, A.y * 0.55, 2.5, 0, Math.PI * 2), t.fillStyle = `rgba(${u},${R * 0.9})`, t.fill(), t.beginPath(), t.arc(A.x, A.y, 1.8, 0, Math.PI * 2), t.fill();
        for (let A = 0; A < P.length - 1; A++) {
          const D = P[A], z = P[A + 1], O = (D.x + z.x) * 0.42, j = (D.y + z.y) * 0.42 + S * 10;
          t.beginPath(), t.moveTo(D.x, D.y), t.quadraticCurveTo(O, j, z.x, z.y), t.strokeStyle = `rgba(${u},${R * 0.15})`, t.lineWidth = 1, t.stroke();
        }
        t.beginPath(), t.moveTo(0, 0), t.quadraticCurveTo(P[0].x * 0.3, P[0].y * 0.3, P[0].x, P[0].y), t.strokeStyle = `rgba(${u},${R * 0.1})`, t.lineWidth = 1, t.stroke();
      }
      t.restore();
    }
    let d = y.starCount;
    function x() {
      const { starCount: w, starColor: C, glowingStars: M, starGlowBlur: p } = o.current;
      w !== d && (d = w, W(a, m));
      const b = s.current;
      if (b.length !== 0) {
        t.fillStyle = C;
        for (const u of b)
          M && u.isGlowing || (t.globalAlpha = u.opacity, t.beginPath(), t.arc(u.x, u.y, u.r, 0, Math.PI * 2), t.fill());
        if (M) {
          t.shadowColor = C, t.shadowBlur = p;
          for (const u of b)
            u.isGlowing && (t.globalAlpha = u.opacity * 0.12, t.beginPath(), t.arc(u.x, u.y, u.r * 5, 0, Math.PI * 2), t.fill(), t.globalAlpha = u.opacity * 0.35, t.beginPath(), t.arc(u.x, u.y, u.r * 2.5, 0, Math.PI * 2), t.fill(), t.globalAlpha = u.opacity, t.beginPath(), t.arc(u.x, u.y, u.r * 1.5, 0, Math.PI * 2), t.fill());
          t.shadowBlur = 0, t.shadowColor = "rgba(0,0,0,0)";
        }
        t.globalAlpha = 1;
      }
    }
    function F(w) {
      const {
        segmentCount: C,
        segmentSize: M,
        bodyColor: p,
        fireColor: b,
        backgroundColor: u,
        followSpeed: R,
        wingSpan: S,
        showFire: L,
        interactive: T
      } = o.current;
      n.current += w * 1e-3;
      const P = n.current;
      t.fillStyle = u, t.fillRect(0, 0, a, m), x();
      const A = i.current;
      T || (g.current = {
        x: a * 0.5 + Math.sin(P * 0.5) * a * 0.35,
        y: m * 0.5 + Math.cos(P * 0.7) * m * 0.3
      });
      const D = g.current;
      for (; A.length < C; ) {
        const G = A[A.length - 1] || { x: a / 2, y: m / 2 };
        A.push({ x: G.x, y: G.y });
      }
      A.length > C && (A.length = C);
      const z = A[0], O = Math.min(R, 1);
      z.x += (D.x - z.x) * O, z.y += (D.y - z.y) * O;
      for (let G = 1; G < A.length; G++) {
        const U = A[G - 1], V = A[G], _ = U.x - V.x, Q = U.y - V.y, ot = Math.sqrt(_ * _ + Q * Q) || 1e-3, K = M * 1.2;
        ot > K && (V.x = U.x - _ / ot * K, V.y = U.y - Q / ot * K);
        const et = -Q / ot, tt = _ / ot, nt = Math.sin(P * 4 - G * 0.4) * (M * 0.25) * (G / A.length);
        V.x += et * nt, V.y += tt * nt;
      }
      const j = A.length >= 2 ? Math.atan2(A[0].y - A[1].y, A[0].x - A[1].x) : 0, N = wt(p), H = wt(b);
      if (L && A.length >= 2) {
        const G = A[0], U = A[1], V = G.x - U.x, _ = G.y - U.y;
        Math.random() < 0.8 && I(G.x, G.y, V, _);
      }
      if (L)
        for (let G = l.current.length - 1; G >= 0; G--) {
          const U = l.current[G];
          if (U.x += U.vx, U.y += U.vy, U.life -= 1, U.life <= 0) {
            l.current.splice(G, 1);
            continue;
          }
          const V = U.life / U.maxLife, _ = V * 0.75, Q = U.size * V, ot = H;
          t.beginPath(), t.arc(U.x, U.y, Math.max(0.5, Q), 0, Math.PI * 2), t.fillStyle = `rgba(${ot},${_})`, t.fill();
        }
      const J = Math.sin(P * 6) * 0.3;
      if (A.length >= 4) {
        const G = A[2], U = A[3], V = Math.atan2(G.y - U.y, G.x - U.x);
        f(G.x, G.y, V, S, J, N, 0.85);
      }
      for (let G = A.length - 1; G >= 1; G--) {
        const U = A[G], V = A[G - 1], _ = G / (A.length - 1), Q = M * (1 - _ * 0.75), ot = Math.max(2, Q * 0.55), K = V.x - U.x, et = V.y - U.y, tt = Math.sqrt(K * K + et * et) || 1, nt = K / tt, rt = et / tt, Z = Q * 0.28, at = -rt * Z, st = nt * Z, lt = 0.4 + (1 - _) * 0.15;
        if (t.beginPath(), t.moveTo(U.x + at, U.y + st), t.lineTo(V.x + at, V.y + st), t.strokeStyle = `rgba(${N},${lt})`, t.lineWidth = 1, t.lineCap = "butt", t.stroke(), t.beginPath(), t.moveTo(U.x - at, U.y - st), t.lineTo(V.x - at, V.y - st), t.stroke(), t.beginPath(), t.arc(U.x, U.y, ot, 0, Math.PI * 2), t.strokeStyle = `rgba(${N},${0.7 + (1 - _) * 0.25})`, t.lineWidth = 1.5, t.stroke(), t.beginPath(), t.arc(U.x, U.y, ot * 0.38, 0, Math.PI * 2), t.fillStyle = `rgba(${N},${0.8 + (1 - _) * 0.2})`, t.fill(), G % 3 === 0 && G > 2 && G < A.length - 3) {
          const ct = Math.atan2(U.y - V.y, U.x - V.x), ut = -Math.sin(ct), pt = Math.cos(ct), Ct = M * (1.1 + (1 - _) * 0.9);
          for (const vt of [-1, 1]) {
            const Et = Ct * 0.9, mt = U.x + ut * vt * Et, bt = U.y + pt * vt * Et, kt = U.x + ut * vt * Et * 0.55 + Math.cos(ct) * Et * -0.22, Rt = U.y + pt * vt * Et * 0.55 + Math.sin(ct) * Et * -0.22;
            t.beginPath(), t.moveTo(U.x, U.y), t.quadraticCurveTo(kt, Rt, mt, bt), t.strokeStyle = `rgba(${N},0.62)`, t.lineWidth = 1.2, t.lineCap = "round", t.stroke();
            const yt = Ct * 0.55, St = U.x + ut * vt * yt, Tt = U.y + pt * vt * yt, qt = U.x + ut * vt * yt * 0.5 + Math.cos(ct) * yt * 0.18, ne = U.y + pt * vt * yt * 0.5 + Math.sin(ct) * yt * 0.18;
            t.beginPath(), t.moveTo(U.x, U.y), t.quadraticCurveTo(qt, ne, St, Tt), t.strokeStyle = `rgba(${N},0.38)`, t.lineWidth = 0.8, t.stroke();
          }
        }
      }
      if (A.length > 0) {
        const G = A[0], U = Math.cos(j), V = Math.sin(j), _ = -Math.sin(j), Q = Math.cos(j), ot = M * 1.05, K = M * 0.82;
        t.save(), t.translate(G.x, G.y), t.rotate(j);
        const et = t.createRadialGradient(-ot * 0.1, 0, ot * 0.05, 0, 0, ot);
        et.addColorStop(0, `rgba(${N},0.07)`), et.addColorStop(1, `rgba(${N},0)`), t.beginPath(), t.ellipse(0, 0, ot, K, 0, 0, Math.PI * 2), t.fillStyle = et, t.fill(), t.beginPath(), t.ellipse(0, 0, ot, K, 0, 0, Math.PI * 2), t.strokeStyle = `rgba(${N},0.88)`, t.lineWidth = 1.8, t.stroke(), t.restore();
        const tt = M * 0.58;
        for (const mt of [-1, 1]) {
          const bt = G.x + _ * tt * mt, kt = G.y + Q * tt * mt, Rt = bt + _ * mt * M * 0.28 + Math.cos(j - Math.PI) * M * 0.88, yt = kt + Q * mt * M * 0.28 + Math.sin(j - Math.PI) * M * 0.88, St = Rt + _ * mt * M * 0.14 + Math.cos(j - Math.PI) * M * 0.48, Tt = yt + Q * mt * M * 0.14 + Math.sin(j - Math.PI) * M * 0.48;
          t.beginPath(), t.moveTo(bt, kt), t.lineTo(Rt, yt), t.strokeStyle = `rgba(${N},0.9)`, t.lineWidth = 2.5, t.lineCap = "round", t.stroke(), t.beginPath(), t.moveTo(Rt, yt), t.lineTo(St, Tt), t.lineWidth = 1.2, t.stroke();
          const qt = Rt + _ * mt * M * 0.2, ne = yt + Q * mt * M * 0.2;
          t.beginPath(), t.moveTo(Rt, yt), t.lineTo(qt, ne), t.lineWidth = 0.9, t.stroke();
        }
        const nt = M * 0.4, rt = M * 0.22, Z = M * 0.26;
        for (const mt of [-1, 1]) {
          const bt = G.x + _ * nt * mt + U * rt, kt = G.y + Q * nt * mt + V * rt;
          t.beginPath(), t.arc(bt, kt, Z, 0, Math.PI * 2), t.fillStyle = "rgba(0,0,0,0.72)", t.fill(), t.beginPath(), t.arc(bt, kt, Z, 0, Math.PI * 2), t.strokeStyle = `rgba(${N},0.82)`, t.lineWidth = 1.5, t.stroke(), t.beginPath(), t.arc(
            bt + U * Z * 0.28 - _ * Z * 0.28 * mt,
            kt + V * Z * 0.28 - Q * Z * 0.28 * mt,
            Z * 0.16,
            0,
            Math.PI * 2
          ), t.fillStyle = `rgba(${N},0.32)`, t.fill();
        }
        const at = M * 0.55, st = Math.sin(P * 3) * 0.1 + 0.08, lt = -M * 0.14, ct = M * 0.14 + st * M * 0.55, ut = M * 0.82, pt = M * 0.2;
        t.save(), t.translate(G.x + U * at, G.y + V * at), t.rotate(j), t.beginPath(), t.ellipse(0, lt, ut, pt, 0, 0, Math.PI), t.strokeStyle = `rgba(${N},0.85)`, t.lineWidth = 1.5, t.stroke(), t.beginPath(), t.ellipse(0, ct, ut * 0.88, pt * 0.88, 0, Math.PI, Math.PI * 2), t.stroke();
        const Ct = 5;
        for (let mt = 0; mt < Ct; mt++) {
          const bt = -ut * 0.78 + ut * 1.56 * (mt + 0.5) / Ct, kt = Math.max(0, 1 - (bt / ut) ** 2), Rt = lt + pt * Math.sqrt(kt), yt = M * (0.12 + Math.sin(mt * 1.5) * 0.04), St = ut / Ct * 0.38;
          t.beginPath(), t.moveTo(bt - St, Rt), t.lineTo(bt, Rt + yt), t.lineTo(bt + St, Rt), t.strokeStyle = `rgba(${N},0.75)`, t.lineWidth = 1, t.stroke();
        }
        const vt = 4, Et = ut * 0.88;
        for (let mt = 0; mt < vt; mt++) {
          const bt = -Et * 0.78 + Et * 1.56 * (mt + 0.5) / vt, kt = Math.max(0, 1 - (bt / Et) ** 2), Rt = ct - pt * 0.88 * Math.sqrt(kt), yt = M * (0.1 + Math.sin(mt * 1.9) * 0.04), St = Et / vt * 0.36;
          t.beginPath(), t.moveTo(bt - St, Rt), t.lineTo(bt, Rt - yt), t.lineTo(bt + St, Rt), t.strokeStyle = `rgba(${N},0.7)`, t.lineWidth = 1, t.stroke();
        }
        t.restore();
      }
    }
    let v = 0;
    function B(w) {
      const C = v ? w - v : 16;
      v = w, F(C), c.current = requestAnimationFrame(B);
    }
    return c.current = requestAnimationFrame(B), () => {
      E.disconnect(), cancelAnimationFrame(c.current), e.removeEventListener("mousemove", $);
    };
  }, [r]);
}
const Br = {
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
}, Ir = ht(
  (r, y) => {
    const {
      preset: o,
      segmentCount: i,
      segmentSize: l,
      bodyColor: s,
      eyeColor: c,
      fireColor: g,
      backgroundColor: n,
      followSpeed: e,
      wingSpan: h,
      showFire: t,
      interactive: a,
      starCount: m,
      starColor: k,
      glowingStars: W,
      starGlowBlur: Y,
      width: E,
      height: q,
      className: $,
      style: I
    } = r, f = o && Br[o] || {}, d = X(null);
    return gt(y, () => d.current), Ar(d, {
      segmentCount: i ?? 20,
      segmentSize: l ?? f.segmentSize ?? 18,
      bodyColor: s ?? f.bodyColor ?? "#ffffff",
      eyeColor: c ?? f.eyeColor ?? "#111111",
      fireColor: g ?? f.fireColor ?? "#ffffff",
      backgroundColor: n ?? f.backgroundColor ?? "transparent",
      followSpeed: e ?? 0.15,
      wingSpan: h ?? f.wingSpan ?? 60,
      showFire: t ?? !1,
      interactive: a ?? !0,
      starCount: m ?? 60,
      starColor: k ?? "#ffffff",
      glowingStars: W ?? !1,
      starGlowBlur: Y ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: $,
        style: {
          width: E ?? "100%",
          height: q ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "none",
          ...I
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: d,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Ir.displayName = "DragonCursor";
function Fr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(0), c = X({ strength: 0, dir: 1 });
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a(f = !1) {
      const { petalSize: d } = o.current;
      return {
        x: Math.random() * h,
        y: f ? -d - Math.random() * 80 : Math.random() * t,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.06,
        size: d * (0.7 + Math.random() * 0.6),
        alpha: 0.6 + Math.random() * 0.4,
        settled: !1,
        settleY: 0,
        phase: Math.random() * Math.PI * 2,
        scaleY: 1
      };
    }
    function m() {
      const { petalCount: f } = o.current;
      i.current = Array.from({ length: f }, () => a(!1));
    }
    function k(f, d) {
      const x = window.devicePixelRatio || 1;
      g.width = Math.round(f * x), g.height = Math.round(d * x), g.style.width = `${f}px`, g.style.height = `${d}px`, e.scale(x, x), h = f, t = d, m();
    }
    const W = new ResizeObserver((f) => {
      const { width: d, height: x } = f[0].contentRect;
      d > 0 && x > 0 && k(d, x);
    });
    W.observe(n);
    const Y = n.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    function E(f, d) {
      e.save(), e.translate(f.x, f.y), e.rotate(f.angle), e.scale(1, f.scaleY), e.globalAlpha = f.alpha;
      const x = f.size;
      e.beginPath(), e.moveTo(0, -x), e.quadraticCurveTo(x * 0.8, -x * 0.3, 0, x * 0.6), e.quadraticCurveTo(-x * 0.8, -x * 0.3, 0, -x), e.fillStyle = d, e.fill(), e.globalAlpha = 1, e.restore();
    }
    function q(f) {
      const {
        petalCount: d,
        petalColor: x,
        backgroundColor: F,
        gravity: v,
        windStrength: B,
        windGusts: w,
        showAccumulation: C,
        maxAccumulation: M
      } = o.current;
      s.current += f * 1e-3;
      const p = s.current;
      e.fillStyle = F, e.fillRect(0, 0, h, t);
      const b = c.current;
      w && (Math.random() < 3e-3 && (b.strength = 2 + Math.random() * 3, b.dir = Math.random() < 0.5 ? 1 : -1), b.strength *= 0.985);
      const u = B + b.strength * b.dir;
      for (; i.current.length < d; ) i.current.push(a(!0));
      i.current.length > d && (i.current.length = d);
      const S = `rgb(${wt(x)})`, L = i.current.filter((A) => A.settled), T = C ? Math.min(M, L.length * 0.6) : 0, P = t - T;
      if (C && L.length > 0)
        for (const A of L)
          E(A, S);
      for (const A of i.current) {
        if (A.settled) continue;
        const D = Math.sin(p * 1.5 + A.phase) * u * 0.5;
        if (A.vx += D * 0.01, A.vy += v * 0.016, A.x += A.vx + u * 0.02, A.y += A.vy, A.angle += A.angularVel + Math.sin(p * 2 + A.phase) * 2e-3, A.scaleY = 0.6 + Math.abs(Math.sin(A.angle * 1.5)) * 0.4, A.x < -A.size && (A.x = h + A.size), A.x > h + A.size && (A.x = -A.size), A.y >= P - A.size * 0.5)
          if (C) {
            if (A.settled = !0, A.x = Math.max(A.size, Math.min(h - A.size, A.x)), A.y = P - A.size * 0.3, A.settleY = A.y, A.angle = (Math.random() - 0.5) * 0.6, A.alpha *= 0.8, L.length > d * 0.6) {
              const z = i.current.find((O) => O.settled);
              z && Object.assign(z, a(!0));
            }
          } else
            Object.assign(A, a(!0));
        E(A, S);
      }
    }
    let $ = 0;
    function I(f) {
      const d = $ ? f - $ : 16;
      $ = f, q(d), l.current = requestAnimationFrame(I);
    }
    return l.current = requestAnimationFrame(I), () => {
      W.disconnect(), cancelAnimationFrame(l.current);
    };
  }, [r]);
}
const $r = {
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
}, Tr = ht(
  (r, y) => {
    const {
      preset: o,
      petalCount: i,
      petalColor: l,
      petalSize: s,
      backgroundColor: c,
      gravity: g,
      windStrength: n,
      windGusts: e,
      showAccumulation: h,
      maxAccumulation: t,
      width: a,
      height: m,
      className: k,
      style: W
    } = r, Y = o && $r[o] || {}, E = X(null);
    return gt(y, () => E.current), Fr(E, {
      petalCount: i ?? 80,
      petalColor: l ?? Y.petalColor ?? "#ffffff",
      petalSize: s ?? Y.petalSize ?? 8,
      backgroundColor: c ?? Y.backgroundColor ?? "#111111",
      gravity: g ?? Y.gravity ?? 0.06,
      windStrength: n ?? Y.windStrength ?? 0.8,
      windGusts: e ?? !0,
      showAccumulation: h ?? !0,
      maxAccumulation: t ?? 40
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: {
          width: a ?? "100%",
          height: m ?? "100%",
          display: "block",
          overflow: "hidden",
          ...W
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: E,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Tr.displayName = "SakuraBlossom";
function Lr(r, y, o) {
  return (Math.sin(r * 1.3 + o) * Math.cos(y * 1.1 - o * 0.7) + Math.sin(r * 2.7 - o * 1.3) * Math.cos(y * 2.1 + o * 0.9) * 0.5 + 1.5) / 3;
}
function zr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X(0), n = X(null), e = X(null);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const t = h.parentElement;
    if (!t) return;
    const a = h.getContext("2d");
    let m = 0, k = 0;
    function W(w, C) {
      const M = Math.random() * Math.PI * 2, p = (0.5 + Math.random() * 0.8) * o.current.speed, b = 40 + Math.random() * 30, u = Math.random() * m, R = Math.random() * k, S = Math.random() < 0.4;
      return {
        x: u,
        y: R,
        vx: Math.cos(M) * p,
        vy: Math.sin(M) * p,
        angle: M,
        speed: p,
        length: b,
        segments: Array.from({ length: 8 }, (L, T) => ({
          x: u - Math.cos(M) * T * (b / 8),
          y: R - Math.sin(M) * T * (b / 8)
        })),
        tailPhase: Math.random() * Math.PI * 2,
        color: S ? C : w,
        accentColor: S ? w : C,
        wanderAngle: M
      };
    }
    function Y() {
      s.current = Array.from({ length: 5 }, () => ({
        x: m * 0.1 + Math.random() * m * 0.8,
        y: k * 0.1 + Math.random() * k * 0.8,
        radius: 18 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        gapAngle: 0.3 + Math.random() * 0.4
      }));
    }
    function E() {
      const { fishCount: w, fishColor: C, scaleColor: M } = o.current;
      i.current = Array.from({ length: w }, () => W(C, M)), Y();
    }
    function q(w, C) {
      const M = window.devicePixelRatio || 1;
      h.width = Math.round(w * M), h.height = Math.round(C * M), h.style.width = `${w}px`, h.style.height = `${C}px`, a.scale(M, M), m = w, k = C, E();
    }
    const $ = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && q(C, M);
    });
    $.observe(t);
    const I = t.getBoundingClientRect();
    I.width > 0 && I.height > 0 && q(I.width, I.height);
    function f(w) {
      if (!o.current.interactive) return;
      const C = h.getBoundingClientRect(), M = w.clientX - C.left, p = w.clientY - C.top, b = n.current;
      if (b) {
        const u = M - b.x, R = p - b.y;
        u * u + R * R > 400 && l.current.push({ x: M, y: p, radius: 0, maxRadius: 60, alpha: 0.6 });
      }
      n.current = { x: M, y: p }, e.current = { x: M, y: p };
    }
    function d() {
      n.current = null;
    }
    h.addEventListener("mousemove", f), h.addEventListener("mouseleave", d);
    function x(w, C) {
      const M = w.segments;
      if (M.length < 2) return;
      const p = wt(w.color), b = wt(w.accentColor);
      a.save();
      const u = M.map((H, J) => {
        const G = J / (M.length - 1);
        return w.length * 0.18 * Math.sin(Math.PI * (1 - G));
      });
      a.beginPath();
      for (let H = 0; H < M.length; H++) {
        const J = M[H], G = M[Math.min(H + 1, M.length - 1)], U = G.x - J.x, V = G.y - J.y, _ = Math.sqrt(U * U + V * V) || 1e-3, Q = -V / _ * u[H], ot = U / _ * u[H];
        H === 0 ? a.moveTo(J.x + Q, J.y + ot) : a.lineTo(J.x + Q, J.y + ot);
      }
      for (let H = M.length - 1; H >= 0; H--) {
        const J = M[H], G = M[Math.min(H + 1, M.length - 1)], U = G.x - J.x, V = G.y - J.y, _ = Math.sqrt(U * U + V * V) || 1e-3, Q = -V / _ * u[H], ot = U / _ * u[H];
        a.lineTo(J.x - Q, J.y - ot);
      }
      a.closePath(), a.fillStyle = `rgba(${p},0.85)`, a.fill();
      for (let H = 1; H < M.length - 2; H += 2) {
        const J = M[H], G = u[H] * 0.7;
        G > 1 && (a.beginPath(), a.arc(J.x, J.y, G, 0, Math.PI * 2), a.fillStyle = `rgba(${b},0.5)`, a.fill());
      }
      const R = M[M.length - 1], S = M[M.length - 2], L = Math.atan2(R.y - S.y, R.x - S.x), T = Math.sin(w.tailPhase + C * 5) * 0.6, P = w.length * 0.35;
      a.beginPath(), a.moveTo(R.x, R.y), a.lineTo(
        R.x + Math.cos(L + Math.PI / 2 + T) * P,
        R.y + Math.sin(L + Math.PI / 2 + T) * P
      ), a.lineTo(
        R.x + Math.cos(L - Math.PI / 2 - T) * P,
        R.y + Math.sin(L - Math.PI / 2 - T) * P
      ), a.closePath(), a.fillStyle = `rgba(${p},0.6)`, a.fill();
      const A = M[0], D = M[1], z = Math.atan2(A.y - D.y, A.x - D.x), O = u[0] * 0.4, j = A.x + Math.cos(z + Math.PI / 3) * O, N = A.y + Math.sin(z + Math.PI / 3) * O;
      a.beginPath(), a.arc(j, N, Math.max(1.5, O * 0.5), 0, Math.PI * 2), a.fillStyle = "#111111", a.fill(), a.restore();
    }
    function F(w) {
      const {
        fishCount: C,
        fishColor: M,
        scaleColor: p,
        waterColor: b,
        rippleColor: u,
        lilyColor: R,
        speed: S,
        showLilies: L,
        caustics: T
      } = o.current;
      g.current += w * 1e-3;
      const P = g.current;
      if (a.fillStyle = b, a.fillRect(0, 0, m, k), T) {
        const O = Math.ceil(m / 40), j = Math.ceil(k / 40);
        wt(b);
        for (let N = 0; N < j; N++)
          for (let H = 0; H < O; H++) {
            const J = Lr(H * 0.4, N * 0.4, P * 0.8);
            if (J > 0.6) {
              const G = (J - 0.6) * 0.25;
              a.fillStyle = `rgba(255,255,255,${G})`, a.fillRect(H * 40, N * 40, 40, 40);
            }
          }
      }
      for (; i.current.length < C; ) i.current.push(W(M, p));
      i.current.length > C && (i.current.length = C);
      const A = n.current;
      for (const z of i.current) {
        z.wanderAngle += (Math.random() - 0.5) * 0.05;
        const O = Math.cos(z.wanderAngle) * z.speed, j = Math.sin(z.wanderAngle) * z.speed;
        z.vx += (O - z.vx) * 0.02, z.vy += (j - z.vy) * 0.02;
        for (const V of i.current) {
          if (V === z) continue;
          const _ = z.x - V.x, Q = z.y - V.y, ot = Math.sqrt(_ * _ + Q * Q) || 1e-3;
          ot < z.length * 1.5 && (z.vx += _ / ot * 0.05, z.vy += Q / ot * 0.05);
        }
        if (A) {
          const V = z.x - A.x, _ = z.y - A.y, Q = Math.sqrt(V * V + _ * _) || 1e-3;
          Q < 80 && (z.vx += V / Q * 0.3, z.vy += _ / Q * 0.3, z.wanderAngle = Math.atan2(z.vy, z.vx));
        }
        const N = 60;
        z.x < N && (z.vx += 0.1), z.x > m - N && (z.vx -= 0.1), z.y < N && (z.vy += 0.1), z.y > k - N && (z.vy -= 0.1);
        const H = Math.sqrt(z.vx * z.vx + z.vy * z.vy) || 1e-3, J = z.speed * 1.8;
        H > J && (z.vx = z.vx / H * J, z.vy = z.vy / H * J), z.angle = Math.atan2(z.vy, z.vx), z.x += z.vx, z.y += z.vy, z.tailPhase += 0.05;
        const G = z.segments;
        G[0].x += (z.x - G[0].x) * 0.4, G[0].y += (z.y - G[0].y) * 0.4;
        const U = z.length / G.length;
        for (let V = 1; V < G.length; V++) {
          const _ = G[V - 1], Q = G[V], ot = _.x - Q.x, K = _.y - Q.y, et = Math.sqrt(ot * ot + K * K) || 1e-3;
          et > U && (Q.x = _.x - ot / et * U, Q.y = _.y - K / et * U);
        }
        x(z, P);
      }
      if (L) {
        const z = wt(R);
        for (const O of s.current)
          a.save(), a.translate(O.x, O.y), a.rotate(O.rotation + P * 0.05), a.beginPath(), a.arc(0, 0, O.radius, O.gapAngle, Math.PI * 2 - O.gapAngle), a.lineTo(0, 0), a.closePath(), a.fillStyle = `rgba(${z},0.55)`, a.fill(), a.strokeStyle = `rgba(${z},0.3)`, a.lineWidth = 1, a.stroke(), a.beginPath(), a.arc(0, 0, O.radius * 0.15, 0, Math.PI * 2), a.fillStyle = `rgba(${z},0.8)`, a.fill(), a.restore();
      }
      const D = wt(u);
      for (let z = l.current.length - 1; z >= 0; z--) {
        const O = l.current[z];
        if (O.radius += 1.2, O.alpha -= 0.012, O.alpha <= 0) {
          l.current.splice(z, 1);
          continue;
        }
        a.beginPath(), a.arc(O.x, O.y, O.radius, 0, Math.PI * 2), a.strokeStyle = `rgba(${D},${O.alpha})`, a.lineWidth = 1, a.stroke(), O.radius > 10 && (a.beginPath(), a.arc(O.x, O.y, O.radius * 0.6, 0, Math.PI * 2), a.strokeStyle = `rgba(${D},${O.alpha * 0.5})`, a.stroke());
      }
    }
    let v = 0;
    function B(w) {
      const C = v ? w - v : 16;
      v = w, F(C), c.current = requestAnimationFrame(B);
    }
    return c.current = requestAnimationFrame(B), () => {
      $.disconnect(), cancelAnimationFrame(c.current), h.removeEventListener("mousemove", f), h.removeEventListener("mouseleave", d);
    };
  }, [r]);
}
const Dr = {
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
}, qr = ht(
  (r, y) => {
    const {
      preset: o,
      fishCount: i,
      fishColor: l,
      scaleColor: s,
      waterColor: c,
      rippleColor: g,
      lilyColor: n,
      speed: e,
      interactive: h,
      showLilies: t,
      caustics: a,
      width: m,
      height: k,
      className: W,
      style: Y
    } = r, E = o && Dr[o] || {}, q = X(null);
    return gt(y, () => q.current), zr(q, {
      fishCount: i ?? 6,
      fishColor: l ?? E.fishColor ?? "#ffffff",
      scaleColor: s ?? E.scaleColor ?? "#6b7280",
      waterColor: c ?? E.waterColor ?? "#111111",
      rippleColor: g ?? E.rippleColor ?? "#6b7280",
      lilyColor: n ?? E.lilyColor ?? "#ffffff",
      speed: e ?? E.speed ?? 1,
      interactive: h ?? !0,
      showLilies: t ?? !0,
      caustics: a ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: W,
        style: {
          width: m ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...Y
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: q,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
qr.displayName = "KoiPond";
function Wr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X(0), n = X({ x: 0, y: 0, tx: 0, ty: 0 });
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const t = e.getContext("2d");
    let a = 0, m = 0;
    function k(w, C) {
      const M = w + Math.random() * C, p = Math.sqrt(200 / M) * 0.02 * (Math.random() < 0.5 ? 1 : -1);
      return {
        angle: Math.random() * Math.PI * 2,
        radius: M,
        speed: p,
        alpha: 0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        trail: []
      };
    }
    function W() {
      const { particleCount: w, eventHorizonRadius: C, diskWidth: M } = o.current;
      i.current = Array.from(
        { length: w },
        () => k(C, M)
      ), l.current = Array.from({ length: 40 }, (p, b) => ({
        y: -20 - b * 8,
        side: b % 2 === 0 ? 1 : -1,
        alpha: 0.3 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 20
      }));
    }
    function Y(w, C) {
      const { starCount: M } = o.current;
      s.current = Array.from({ length: M }, () => ({
        x: Math.random() * w,
        y: Math.random() * C,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6,
        isGlowing: Math.random() < 0.28
      }));
    }
    function E(w, C) {
      const M = window.devicePixelRatio || 1;
      e.width = Math.round(w * M), e.height = Math.round(C * M), e.style.width = `${w}px`, e.style.height = `${C}px`, t.scale(M, M), a = w, m = C, n.current = { x: a / 2, y: m / 2, tx: a / 2, ty: m / 2 }, W(), Y(w, C);
    }
    const q = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && E(C, M);
    });
    q.observe(h);
    const $ = h.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    function I(w) {
      if (!o.current.interactive) return;
      const C = e.getBoundingClientRect();
      n.current.tx = w.clientX - C.left, n.current.ty = w.clientY - C.top;
    }
    e.addEventListener("mousemove", I);
    function f(w, C, M) {
      const u = M * M * 2;
      t.fillStyle = "rgba(255,255,255,0.12)";
      for (let R = 0; R < a; R += 30)
        for (let S = 0; S < m; S += 30) {
          const L = R - w, T = S - C, P = L * L + T * T, A = Math.sqrt(P) || 1e-3;
          if (A < M * 1.2) continue;
          const D = u / P, z = R + L / A * D, O = S + T / A * D;
          t.beginPath(), t.arc(z, O, 1, 0, Math.PI * 2), t.fill();
        }
    }
    let d = y.starCount;
    function x() {
      const { starCount: w, starColor: C, glowingStars: M, starGlowBlur: p } = o.current;
      w !== d && (d = w, Y(a, m));
      const b = s.current;
      if (b.length !== 0) {
        t.fillStyle = C;
        for (const u of b)
          M && u.isGlowing || (t.globalAlpha = u.opacity, t.beginPath(), t.arc(u.x, u.y, u.r, 0, Math.PI * 2), t.fill());
        if (M) {
          t.shadowColor = C, t.shadowBlur = p;
          for (const u of b)
            u.isGlowing && (t.globalAlpha = u.opacity * 0.12, t.beginPath(), t.arc(u.x, u.y, u.r * 5, 0, Math.PI * 2), t.fill(), t.globalAlpha = u.opacity * 0.35, t.beginPath(), t.arc(u.x, u.y, u.r * 2.5, 0, Math.PI * 2), t.fill(), t.globalAlpha = u.opacity, t.beginPath(), t.arc(u.x, u.y, u.r * 1.5, 0, Math.PI * 2), t.fill());
          t.shadowBlur = 0, t.shadowColor = "rgba(0,0,0,0)";
        }
        t.globalAlpha = 1;
      }
    }
    function F(w) {
      const {
        diskColor: C,
        backgroundColor: M,
        particleCount: p,
        gravity: b,
        eventHorizonRadius: u,
        diskWidth: R,
        jetColor: S,
        showJets: L,
        lensing: T,
        speed: P
      } = o.current;
      g.current += w * 1e-3, g.current;
      const A = n.current;
      A.x += (A.tx - A.x) * 0.06, A.y += (A.ty - A.y) * 0.06;
      const D = A.x, z = A.y;
      t.fillStyle = M, t.fillRect(0, 0, a, m), x(), T && f(D, z, u);
      const O = t.createRadialGradient(D, z, 0, D, z, u * 2.5);
      O.addColorStop(0, "rgba(0,0,0,1)"), O.addColorStop(0.4, "rgba(0,0,0,0.9)"), O.addColorStop(1, "rgba(0,0,0,0)"), t.beginPath(), t.arc(D, z, u * 2.5, 0, Math.PI * 2), t.fillStyle = O, t.fill();
      const j = wt(C);
      for (; i.current.length < p; ) i.current.push(k(u, R));
      i.current.length > p && (i.current.length = p);
      for (const H of i.current) {
        H.angle += H.speed * P, H.radius -= 0.015 * P;
        const J = D + Math.cos(H.angle) * H.radius, G = z + Math.sin(H.angle) * H.radius * 0.35;
        H.trail.push({ x: J, y: G }), H.trail.length > 5 && H.trail.shift(), H.radius < u && (H.radius = u + Math.random() * R, H.angle = Math.random() * Math.PI * 2, H.trail = [], H.alpha = 0.3 + Math.random() * 0.6);
        const U = Math.min(1, (u + R - H.radius) / R + 0.3), V = H.alpha * U;
        if (H.trail.length > 1) {
          t.beginPath(), t.moveTo(H.trail[0].x, H.trail[0].y);
          for (let _ = 1; _ < H.trail.length; _++) t.lineTo(H.trail[_].x, H.trail[_].y);
          t.strokeStyle = `rgba(${j},${V * 0.4})`, t.lineWidth = H.size * 0.8, t.lineCap = "round", t.stroke();
        }
        t.beginPath(), t.arc(J, G, H.size, 0, Math.PI * 2), t.fillStyle = `rgba(${j},${V})`, t.fill();
      }
      const N = t.createRadialGradient(D, z, 0, D, z, u * 1.5);
      if (N.addColorStop(0, "rgba(0,0,0,1)"), N.addColorStop(0.6, "rgba(0,0,0,0.95)"), N.addColorStop(1, "rgba(0,0,0,0)"), t.beginPath(), t.arc(D, z, u * 1.5, 0, Math.PI * 2), t.fillStyle = N, t.fill(), L) {
        const H = wt(S);
        for (const J of l.current)
          J.y -= 1.5 * P, J.x += J.vx * 0.3, J.alpha -= 6e-3 * P, J.alpha <= 0 && (J.y = -(Math.random() * 20), J.x = (Math.random() - 0.5) * 15, J.alpha = 0.2 + Math.random() * 0.4, J.vx = (Math.random() - 0.5) * 1.5), t.beginPath(), t.arc(D + J.x, z + J.y, 1.5, 0, Math.PI * 2), t.fillStyle = `rgba(${H},${J.alpha})`, t.fill(), t.beginPath(), t.arc(D + J.x, z - J.y, 1.5, 0, Math.PI * 2), t.fillStyle = `rgba(${H},${J.alpha})`, t.fill();
      }
    }
    let v = 0;
    function B(w) {
      const C = v ? w - v : 16;
      v = w, F(C), c.current = requestAnimationFrame(B);
    }
    return c.current = requestAnimationFrame(B), () => {
      q.disconnect(), cancelAnimationFrame(c.current), e.removeEventListener("mousemove", I);
    };
  }, [r]);
}
const Yr = {
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
}, Or = ht(
  (r, y) => {
    const {
      preset: o,
      diskColor: i,
      backgroundColor: l,
      particleCount: s,
      gravity: c,
      eventHorizonRadius: g,
      diskWidth: n,
      jetColor: e,
      showJets: h,
      lensing: t,
      speed: a,
      interactive: m,
      starCount: k,
      starColor: W,
      glowingStars: Y,
      starGlowBlur: E,
      width: q,
      height: $,
      className: I,
      style: f
    } = r, d = o && Yr[o] || {}, x = X(null);
    return gt(y, () => x.current), Wr(x, {
      diskColor: i ?? d.diskColor ?? "#ffffff",
      backgroundColor: l ?? d.backgroundColor ?? "#111111",
      particleCount: s ?? d.particleCount ?? 300,
      gravity: c ?? d.gravity ?? 200,
      eventHorizonRadius: g ?? d.eventHorizonRadius ?? 30,
      diskWidth: n ?? d.diskWidth ?? 120,
      jetColor: e ?? d.jetColor ?? "#6b7280",
      showJets: h ?? !0,
      lensing: t ?? !0,
      speed: a ?? 1,
      interactive: m ?? !0,
      starCount: k ?? 100,
      starColor: W ?? "#ffffff",
      glowingStars: Y ?? !1,
      starGlowBlur: E ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: I,
        style: {
          width: q ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          ...f
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: x,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Or.displayName = "BlackHole";
function Gr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(0), c = X({ starCount: -1, armCount: -1, armTightness: -1 }), g = X({ tiltX: y.tiltX, tiltY: 0, targetTX: y.tiltX, targetTY: 0 }), n = X(null);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const t = e.getContext("2d");
    let a = 0, m = 0, k = 0;
    function W(v) {
      return Math.sin(v * 127.1) * 0.5 + Math.sin(v * 311.7) * 0.3 + Math.sin(v * 74.3) * 0.2;
    }
    function Y() {
      const { starCount: v, armCount: B, armTightness: w } = o.current;
      i.current = [];
      const C = Math.floor(v * 0.15), M = Math.floor(v * 0.2), p = v - C - M;
      for (let b = 0; b < p; b++) {
        const u = b % B, R = 0.05 + Math.random() * 0.95, L = u / B * Math.PI * 2 + R * w * Math.PI * 4, T = (W(R * u + b) * 0.15 + (Math.random() - 0.5) * 0.1) * (1 - R * 0.5);
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
      for (let b = 0; b < M; b++) {
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
      for (let b = 0; b < C; b++)
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
    function E(v, B) {
      const w = window.devicePixelRatio || 1;
      e.width = Math.round(v * w), e.height = Math.round(B * w), e.style.width = `${v}px`, e.style.height = `${B}px`, t.scale(w, w), a = v, m = B, Y();
    }
    const q = new ResizeObserver((v) => {
      const { width: B, height: w } = v[0].contentRect;
      B > 0 && w > 0 && E(B, w);
    });
    q.observe(h);
    const $ = h.getBoundingClientRect();
    $.width > 0 && $.height > 0 && E($.width, $.height);
    function I(v) {
      if (!o.current.interactive) return;
      const B = e.getBoundingClientRect();
      n.current = { x: v.clientX - B.left, y: v.clientY - B.top };
    }
    function f() {
      n.current = null;
    }
    e.addEventListener("mousemove", I), e.addEventListener("mouseleave", f);
    function d(v) {
      const {
        starCount: B,
        armCount: w,
        armTightness: C,
        coreColor: M,
        diskColor: p,
        backgroundColor: b,
        rotationSpeed: u,
        coreGlow: R,
        glowBlur: S
      } = o.current, L = c.current;
      (L.starCount !== B || L.armCount !== w || L.armTightness !== C) && (Y(), c.current = { starCount: B, armCount: w, armTightness: C }), s.current += v * 1e-3, k += u * v * 1e-3 * 300;
      const T = g.current, P = n.current;
      P && o.current.interactive ? (T.targetTX = 0.1 + P.y / m * 0.7, T.targetTY = (P.x / a - 0.5) * 1.2) : (T.targetTX = o.current.tiltX, T.targetTY = 0), T.tiltX += (T.targetTX - T.tiltX) * 0.04, T.tiltY += (T.targetTY - T.tiltY) * 0.04, t.fillStyle = b, t.fillRect(0, 0, a, m);
      const A = a / 2, D = m / 2, z = Math.min(a, m) * 0.45, O = Math.cos(T.tiltX), j = Math.sin(T.tiltY), N = Math.cos(T.tiltY), H = wt(M), J = wt(p), G = i.current, U = [];
      for (const V of G) {
        V.twinkle += 0.02;
        const _ = V.baseAngle + k * (1 - V.r * 0.3), Q = V.r * z, ot = Math.cos(_) * Q, K = Math.sin(_) * Q, et = V.isHalo ? (Math.random() - 0.5) * Q * 0.3 : 0, tt = ot * N - K * j, nt = ot * j + K * N, rt = A + tt, Z = D + et * 1 + nt * O, at = nt;
        U.push({ sx: rt, sy: Z, sz: at, star: V });
      }
      if (U.sort((V, _) => V.sz - _.sz), R) {
        const V = z * 0.12, _ = t.createRadialGradient(A, D, 0, A, D, V * 3);
        _.addColorStop(0, `rgba(${H},0.35)`), _.addColorStop(0.3, `rgba(${H},0.12)`), _.addColorStop(1, `rgba(${H},0)`), t.beginPath(), t.arc(A, D, V * 3, 0, Math.PI * 2), t.fillStyle = _, t.fill(), t.shadowBlur = S, t.shadowColor = `rgb(${H})`, t.beginPath(), t.arc(A, D, V * 0.4, 0, Math.PI * 2), t.fillStyle = `rgb(${H})`, t.fill(), t.shadowBlur = 0;
      }
      for (const { sx: V, sy: _, sz: Q, star: ot } of U) {
        const K = 0.8 + 0.2 * Math.sin(ot.twinkle), et = ot.brightness * K, tt = Q < 0 ? 0.5 + 0.5 * (1 + Q / z) : 1, nt = et * tt, rt = ot.isHalo || ot.r > 0.4 ? J : H, Z = ot.size * (0.7 + 0.3 * tt);
        t.beginPath(), t.arc(V, _, Math.max(0.2, Z), 0, Math.PI * 2), t.fillStyle = `rgba(${rt},${Math.min(1, nt)})`, t.fill();
      }
    }
    let x = 0;
    function F(v) {
      const B = x ? v - x : 16;
      x = v, d(B), l.current = requestAnimationFrame(F);
    }
    return l.current = requestAnimationFrame(F), () => {
      q.disconnect(), cancelAnimationFrame(l.current), e.removeEventListener("mousemove", I), e.removeEventListener("mouseleave", f);
    };
  }, [r]);
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
}, Hr = ht(
  (r, y) => {
    const {
      preset: o,
      starCount: i,
      armCount: l,
      armTightness: s,
      coreColor: c,
      diskColor: g,
      backgroundColor: n,
      rotationSpeed: e,
      tiltX: h,
      interactive: t,
      coreGlow: a,
      glowBlur: m,
      width: k,
      height: W,
      className: Y,
      style: E
    } = r, q = o && Xr[o] || {}, $ = X(null);
    return gt(y, () => $.current), Gr($, {
      starCount: i ?? 3e3,
      armCount: l ?? q.armCount ?? 2,
      armTightness: s ?? q.armTightness ?? 0.5,
      coreColor: c ?? q.coreColor ?? "#ffffff",
      diskColor: g ?? q.diskColor ?? "#6b7280",
      backgroundColor: n ?? q.backgroundColor ?? "#111111",
      rotationSpeed: e ?? q.rotationSpeed ?? 3e-4,
      tiltX: h ?? 0.3,
      interactive: t ?? !0,
      coreGlow: a ?? !0,
      glowBlur: m ?? 30
    }), /* @__PURE__ */ it(
      "div",
      {
        className: Y,
        style: {
          width: k ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          ...E
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
Hr.displayName = "GalaxySpiral";
function de(r, y, o, i, l, s) {
  if (s === 0) return [{ x: r, y }, { x: o, y: i }];
  const c = (r + o) / 2 + (Math.random() - 0.5) * l, g = (y + i) / 2 + (Math.random() - 0.5) * l * 0.3, n = l / 2;
  return [
    ...de(r, y, c, g, n, s - 1),
    ...de(c, g, o, i, n, s - 1).slice(1)
  ];
}
function Nr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X([]), g = X(0), n = X(0), e = X(0), h = X(0), t = X(0);
  ft(() => {
    const a = r.current;
    if (!a) return;
    const m = a.parentElement;
    if (!m) return;
    const k = a.getContext("2d");
    let W = 0, Y = 0;
    function E() {
      const { particleCount: w } = o.current;
      i.current = Array.from({ length: w }, () => ({
        angle: Math.random() * Math.PI * 2,
        normY: Math.random(),
        speed: 0.7 + Math.random() * 0.6,
        alpha: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 3
      })), c.current = Array.from({ length: 80 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 80,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.2 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 3
      }));
    }
    function q(w, C) {
      const M = window.devicePixelRatio || 1;
      a.width = Math.round(w * M), a.height = Math.round(C * M), a.style.width = `${w}px`, a.style.height = `${C}px`, k.scale(M, M), W = w, Y = C, e.current = W / 2, h.current = W / 2, E();
    }
    const $ = new ResizeObserver((w) => {
      const { width: C, height: M } = w[0].contentRect;
      C > 0 && M > 0 && q(C, M);
    });
    $.observe(m);
    const I = m.getBoundingClientRect();
    I.width > 0 && I.height > 0 && q(I.width, I.height);
    function f(w) {
      if (!o.current.interactive) return;
      const C = a.getBoundingClientRect();
      h.current = w.clientX - C.left;
    }
    a.addEventListener("mousemove", f);
    function d(w, C, M) {
      const p = C + Math.random() * (M - C) * 0.3, b = p + (M - C) * (0.3 + Math.random() * 0.4), u = de(w, p, w + (Math.random() - 0.5) * 20, b, 30, 4);
      s.current.push({ points: u, alpha: 0.9, life: 8 + Math.random() * 8 }), s.current.length > 5 && s.current.shift();
    }
    function x(w, C) {
      return C * Math.pow(1 - w, 1.4) * 0.9 + C * 0.02;
    }
    function F(w) {
      const {
        funnelColor: C,
        debrisColor: M,
        lightningColor: p,
        backgroundColor: b,
        rotationSpeed: u,
        funnelHeight: R,
        showLightning: S,
        showGroundDust: L,
        speed: T
      } = o.current;
      n.current += w * 1e-3;
      const P = n.current;
      e.current += (h.current - e.current) * 0.05;
      const A = e.current, D = Math.sin(P * 0.8) * 15;
      k.fillStyle = b, k.fillRect(0, 0, W, Y);
      const z = Y * (1 - R), O = Y - 20, j = Math.min(W * 0.35, 180), N = wt(C), H = wt(M), J = wt(p), G = (z + O) * 0.5, U = k.createLinearGradient(A - j, z, A + j, O);
      U.addColorStop(0, "rgba(0,0,0,0)"), U.addColorStop(0.5, "rgba(0,0,0,0.35)"), U.addColorStop(1, "rgba(0,0,0,0)"), k.beginPath(), k.moveTo(A + D, O), k.quadraticCurveTo(A + j * 0.5 + D, G, A + j + D * 0.3, z), k.lineTo(A - j + D * 0.3, z), k.quadraticCurveTo(A - j * 0.5 + D, G, A + D, O), k.closePath(), k.fillStyle = U, k.fill();
      const V = i.current;
      for (const _ of V)
        _.angle += u / (x(_.normY, j) * 0.01 + 0.5) * T * w * 1e-3, _.normY += 4e-4 * T, _.normY > 1 && (_.normY = 0, _.angle = Math.random() * Math.PI * 2);
      for (const _ of V) {
        const Q = Math.sin(_.angle);
        if (Q > 0) continue;
        const ot = x(_.normY, j), K = z + _.normY * (O - z), et = A + D * _.normY + Math.cos(_.angle) * ot, tt = _.alpha * (0.3 + 0.3 * -Q);
        k.beginPath(), k.arc(et, K, _.size * (0.5 + 0.5 * (1 - _.normY)), 0, Math.PI * 2), k.fillStyle = `rgba(${N},${tt})`, k.fill();
      }
      if (S) {
        t.current += w, t.current > 800 + Math.random() * 1200 && (t.current = 0, d(A + D * 0.5, z, O));
        for (let _ = s.current.length - 1; _ >= 0; _--) {
          const Q = s.current[_];
          if (Q.life -= 1, Q.alpha *= 0.85, Q.life <= 0) {
            s.current.splice(_, 1);
            continue;
          }
          k.beginPath(), k.moveTo(Q.points[0].x, Q.points[0].y);
          for (let ot = 1; ot < Q.points.length; ot++)
            k.lineTo(Q.points[ot].x, Q.points[ot].y);
          k.strokeStyle = `rgba(${J},${Q.alpha})`, k.lineWidth = 1.5, k.shadowBlur = 12, k.shadowColor = `rgb(${J})`, k.stroke(), k.shadowBlur = 0;
        }
      }
      for (const _ of V) {
        const Q = Math.sin(_.angle);
        if (Q <= 0) continue;
        const ot = x(_.normY, j), K = z + _.normY * (O - z), et = A + D * _.normY + Math.cos(_.angle) * ot, tt = _.alpha * (0.5 + 0.5 * Q);
        k.beginPath(), k.arc(et, K, _.size * (0.5 + 0.5 * (1 - _.normY)), 0, Math.PI * 2), k.fillStyle = `rgba(${N},${tt})`, k.fill();
      }
      if (L)
        for (const _ of c.current) {
          _.angle += _.speed * T;
          const Q = A + D * 0.3 + Math.cos(_.angle) * _.radius, ot = O + Math.sin(_.angle * 0.5) * 6;
          k.beginPath(), k.arc(Q, ot, _.size, 0, Math.PI * 2), k.fillStyle = `rgba(${H},${_.alpha})`, k.fill();
        }
      if (Math.random() < 0.05 * T) {
        const _ = x(Math.random() * 0.3, j), Q = Math.random() * Math.PI * 2, ot = O - Math.random() * (O - z) * 0.3;
        l.current.push({
          x: A + Math.cos(Q) * _,
          y: ot,
          vx: (Math.random() - 0.5) * 4 * T,
          vy: -(1 + Math.random() * 2) * T,
          size: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.4,
          life: 40 + Math.random() * 40
        });
      }
      for (let _ = l.current.length - 1; _ >= 0; _--) {
        const Q = l.current[_];
        if (Q.x += Q.vx, Q.y += Q.vy, Q.vy += 0.05, Q.alpha -= 8e-3, Q.life -= 1, Q.alpha <= 0 || Q.life <= 0) {
          l.current.splice(_, 1);
          continue;
        }
        k.beginPath(), k.arc(Q.x, Q.y, Q.size, 0, Math.PI * 2), k.fillStyle = `rgba(${H},${Q.alpha})`, k.fill();
      }
    }
    let v = 0;
    function B(w) {
      const C = v ? w - v : 16;
      v = w, F(C), g.current = requestAnimationFrame(B);
    }
    return g.current = requestAnimationFrame(B), () => {
      $.disconnect(), cancelAnimationFrame(g.current), a.removeEventListener("mousemove", f);
    };
  }, [r]);
}
const jr = {
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
}, Ur = ht(
  (r, y) => {
    const {
      preset: o,
      particleCount: i,
      funnelColor: l,
      debrisColor: s,
      lightningColor: c,
      backgroundColor: g,
      rotationSpeed: n,
      funnelHeight: e,
      vortexStrength: h,
      showLightning: t,
      showGroundDust: a,
      interactive: m,
      speed: k,
      width: W,
      height: Y,
      className: E,
      style: q
    } = r, $ = o && jr[o] || {}, I = X(null);
    return gt(y, () => I.current), Nr(I, {
      particleCount: i ?? 600,
      funnelColor: l ?? $.funnelColor ?? "#ffffff",
      debrisColor: s ?? $.debrisColor ?? "#6b7280",
      lightningColor: c ?? $.lightningColor ?? "#ffffff",
      backgroundColor: g ?? $.backgroundColor ?? "#111111",
      rotationSpeed: n ?? $.rotationSpeed ?? 3,
      funnelHeight: e ?? $.funnelHeight ?? 0.8,
      vortexStrength: h ?? 1,
      showLightning: t ?? !0,
      showGroundDust: a ?? !0,
      interactive: m ?? !0,
      speed: k ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: E,
        style: {
          width: W ?? "100%",
          height: Y ?? "100%",
          display: "block",
          overflow: "hidden",
          ...q
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
Ur.displayName = "TornadoVortex";
function Vr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X(0), s = X(0), c = X(null);
  ft(() => {
    const g = r.current;
    if (!g) return;
    const n = g.parentElement;
    if (!n) return;
    const e = g.getContext("2d");
    let h = 0, t = 0;
    function a(v, B) {
      const { minRadius: w, maxRadius: C } = o.current, M = w + Math.random() * (C - w);
      return {
        x: v ?? M + Math.random() * (h - M * 2),
        y: B ?? M + Math.random() * (t - M * 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(0.2 + Math.random() * 0.6),
        r: M,
        hue: Math.random() * 360,
        shimmerOffset: Math.random() * Math.PI * 2,
        popping: !1,
        popProgress: 0,
        popParticles: []
      };
    }
    function m() {
      const { bubbleCount: v } = o.current;
      i.current = Array.from({ length: v }, () => a());
    }
    function k(v, B) {
      const w = window.devicePixelRatio || 1;
      g.width = Math.round(v * w), g.height = Math.round(B * w), g.style.width = `${v}px`, g.style.height = `${B}px`, e.scale(w, w), h = v, t = B, m();
    }
    const W = new ResizeObserver((v) => {
      const { width: B, height: w } = v[0].contentRect;
      B > 0 && w > 0 && k(B, w);
    });
    W.observe(n);
    const Y = n.getBoundingClientRect();
    Y.width > 0 && Y.height > 0 && k(Y.width, Y.height);
    function E(v) {
      if (!o.current.interactive) return;
      const B = g.getBoundingClientRect();
      c.current = { x: v.clientX - B.left, y: v.clientY - B.top };
    }
    function q() {
      c.current = null;
    }
    function $(v) {
      if (!o.current.popEffect) return;
      const B = g.getBoundingClientRect(), w = v.clientX - B.left, C = v.clientY - B.top;
      for (const M of i.current) {
        if (M.popping) continue;
        const p = w - M.x, b = C - M.y;
        if (p * p + b * b < M.r * M.r) {
          I(M);
          break;
        }
      }
    }
    g.addEventListener("mousemove", E), g.addEventListener("mouseleave", q), g.addEventListener("click", $);
    function I(v) {
      v.popping = !0, v.popProgress = 0;
      const B = 8 + Math.floor(v.r / 8);
      for (let w = 0; w < B; w++) {
        const C = w / B * Math.PI * 2, M = 1 + Math.random() * 3;
        v.popParticles.push({
          x: v.x + Math.cos(C) * v.r,
          y: v.y + Math.sin(C) * v.r,
          vx: Math.cos(C) * M,
          vy: Math.sin(C) * M,
          alpha: 0.8
        });
      }
    }
    function f(v, B, w, C) {
      const M = Math.sin(B * 2 + v.shimmerOffset), p = wt(w), b = (v.hue + M * 30) % 360, u = (v.hue + 120 + M * 20) % 360, R = (v.hue + 240) % 360, S = e.createRadialGradient(
        v.x - v.r * 0.25,
        v.y - v.r * 0.25,
        v.r * 0.05,
        v.x,
        v.y,
        v.r
      );
      S.addColorStop(0, `hsla(${b},70%,90%,0.15)`), S.addColorStop(0.4, `hsla(${u},80%,60%,0.08)`), S.addColorStop(0.7, `hsla(${R},90%,50%,0.12)`), S.addColorStop(1, `hsla(${b},60%,30%,0.25)`), C && (e.shadowBlur = v.r * 0.4, e.shadowColor = `hsla(${b},100%,70%,0.3)`), e.beginPath(), e.arc(v.x, v.y, v.r, 0, Math.PI * 2), e.fillStyle = S, e.fill(), e.beginPath(), e.arc(v.x, v.y, v.r, 0, Math.PI * 2), e.strokeStyle = `hsla(${u},80%,75%,0.4)`, e.lineWidth = 1.5, e.stroke(), C && (e.shadowBlur = 0);
      const L = v.x - v.r * 0.32, T = v.y - v.r * 0.32, P = e.createRadialGradient(L, T, 0, L, T, v.r * 0.4);
      P.addColorStop(0, `rgba(${p},0.7)`), P.addColorStop(1, `rgba(${p},0)`), e.beginPath(), e.ellipse(L, T, v.r * 0.22, v.r * 0.14, -0.5, 0, Math.PI * 2), e.fillStyle = P, e.fill(), e.beginPath(), e.ellipse(v.x + v.r * 0.25, v.y + v.r * 0.28, v.r * 0.06, v.r * 0.04, 0.8, 0, Math.PI * 2), e.fillStyle = `rgba(${p},0.3)`, e.fill();
    }
    function d(v) {
      const {
        bubbleCount: B,
        backgroundColor: w,
        shimmerColor: C,
        gravity: M,
        friction: p,
        interactive: b,
        mergeOnCollide: u,
        glowEffect: R,
        popEffect: S
      } = o.current;
      s.current += v * 1e-3;
      const L = s.current;
      e.fillStyle = w, e.fillRect(0, 0, h, t);
      const T = i.current, P = c.current;
      for (; T.filter((A) => !A.popping).length < B; )
        T.push(a(
          Math.random() < 0.5 ? -20 : h + 20,
          t * 0.7 + Math.random() * t * 0.3
        ));
      for (let A = 0; A < T.length; A++) {
        const D = T[A];
        if (D.popping) {
          D.popProgress += 0.08;
          for (const z of D.popParticles)
            z.x += z.vx, z.y += z.vy, z.alpha -= 0.05;
          D.popParticles = D.popParticles.filter((z) => z.alpha > 0);
          continue;
        }
        if (D.vy += M, D.vx *= p, D.vy *= p, D.x += D.vx, D.y += D.vy, D.hue = (D.hue + 0.3) % 360, b && P) {
          const z = D.x - P.x, O = D.y - P.y, j = Math.sqrt(z * z + O * O) || 1e-3;
          if (j < D.r + 60) {
            const N = (D.r + 60 - j) * 0.015;
            D.vx += z / j * N, D.vy += O / j * N;
          }
        }
        D.x - D.r < 0 && (D.x = D.r, D.vx = Math.abs(D.vx) * 0.6), D.x + D.r > h && (D.x = h - D.r, D.vx = -Math.abs(D.vx) * 0.6), D.y - D.r < 0 && (D.y = D.r, D.vy = Math.abs(D.vy) * 0.6), D.y + D.r > t && (D.y = t - D.r, D.vy = -Math.abs(D.vy) * 0.8);
        for (let z = A + 1; z < T.length; z++) {
          const O = T[z];
          if (O.popping) continue;
          const j = O.x - D.x, N = O.y - D.y, H = Math.sqrt(j * j + N * N) || 1e-3, J = D.r + O.r;
          if (H < J)
            if (u && H < J * 0.6) {
              const G = Math.min(
                o.current.maxRadius,
                Math.sqrt(D.r * D.r + O.r * O.r)
              );
              D.r = G, D.x = (D.x + O.x) / 2, D.y = (D.y + O.y) / 2, D.vx = (D.vx + O.vx) * 0.5, D.vy = (D.vy + O.vy) * 0.5, O.popping = !0, O.popProgress = 1;
            } else {
              const G = j / H, U = N / H, V = J - H;
              D.x -= G * V * 0.5, D.y -= U * V * 0.5, O.x += G * V * 0.5, O.y += U * V * 0.5;
              const _ = D.vx - O.vx, Q = D.vy - O.vy, ot = _ * G + Q * U;
              ot > 0 && (D.vx -= ot * G * 0.7, D.vy -= ot * U * 0.7, O.vx += ot * G * 0.7, O.vy += ot * U * 0.7);
            }
        }
      }
      for (const A of T)
        if (!(A.popping && A.popProgress >= 1))
          if (!A.popping)
            f(A, L, C, R);
          else {
            const D = A.r * (1 + A.popProgress * 1.5);
            e.beginPath(), e.arc(A.x, A.y, D, 0, Math.PI * 2), e.strokeStyle = `hsla(${A.hue},80%,70%,${0.6 * (1 - A.popProgress)})`, e.lineWidth = 2, e.stroke();
            for (const z of A.popParticles)
              e.beginPath(), e.arc(z.x, z.y, 2, 0, Math.PI * 2), e.fillStyle = `hsla(${A.hue},80%,75%,${z.alpha})`, e.fill();
          }
      i.current = T.filter((A) => !A.popping || A.popProgress < 1.5);
    }
    let x = 0;
    function F(v) {
      const B = x ? v - x : 16;
      x = v, d(B), l.current = requestAnimationFrame(F);
    }
    return l.current = requestAnimationFrame(F), () => {
      W.disconnect(), cancelAnimationFrame(l.current), g.removeEventListener("mousemove", E), g.removeEventListener("mouseleave", q), g.removeEventListener("click", $);
    };
  }, [r]);
}
const _r = {
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
}, Jr = ht(
  (r, y) => {
    const {
      preset: o,
      bubbleCount: i,
      minRadius: l,
      maxRadius: s,
      backgroundColor: c,
      shimmerColor: g,
      popEffect: n,
      gravity: e,
      friction: h,
      interactive: t,
      mergeOnCollide: a,
      glowEffect: m,
      width: k,
      height: W,
      className: Y,
      style: E
    } = r, q = o && _r[o] || {}, $ = X(null);
    return gt(y, () => $.current), Vr($, {
      bubbleCount: i ?? q.bubbleCount ?? 15,
      minRadius: l ?? q.minRadius ?? 20,
      maxRadius: s ?? q.maxRadius ?? 50,
      backgroundColor: c ?? q.backgroundColor ?? "#111111",
      shimmerColor: g ?? q.shimmerColor ?? "#ffffff",
      popEffect: n ?? !0,
      gravity: e ?? q.gravity ?? 0.02,
      friction: h ?? 0.995,
      interactive: t ?? !0,
      mergeOnCollide: a ?? !0,
      glowEffect: m ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: Y,
        style: {
          width: k ?? "100%",
          height: W ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "pointer",
          ...E
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
Jr.displayName = "BubbleUniverse";
function Nt(r) {
  const y = r.replace("#", ""), o = parseInt(y, 16);
  return [o >> 16 & 255, o >> 8 & 255, o & 255];
}
function Zt([r, y, o], [i, l, s], c) {
  return `rgb(${Math.round(r + (i - r) * c)},${Math.round(y + (l - y) * c)},${Math.round(o + (s - o) * c)})`;
}
function Kr(r, y, o, i, l, s, c) {
  const g = 1 - c;
  return [
    g * g * r + 2 * g * c * o + c * c * l,
    g * g * y + 2 * g * c * i + c * c * s
  ];
}
function Qr(r, y) {
  const o = Math.floor(r), i = Math.floor(y), l = r - o, s = y - i, c = (m) => {
    let k = Math.sin(m * 127.1 + 311.7) * 43758.5453;
    return k - Math.floor(k);
  }, g = c(o + i * 57), n = c(o + 1 + i * 57), e = c(o + (i + 1) * 57), h = c(o + 1 + (i + 1) * 57), t = l * l * (3 - 2 * l), a = s * s * (3 - 2 * s);
  return g + (n - g) * t + (e - g) * a + (g - n - e + h) * t * a;
}
function Zr(r, y) {
  const o = X(y);
  o.current = y;
  const i = X([]), l = X([]), s = X([]), c = X(0), g = X(0), n = X(0), e = X(null), h = X(null);
  ft(() => {
    const t = r.current;
    if (!t) return;
    const a = t.parentElement;
    if (!a) return;
    const m = t.getContext("2d");
    let k = 0, W = 0;
    function Y() {
      return Math.min(k, W) * 0.5 * o.current.sunRadius;
    }
    function E() {
      return k / 2;
    }
    function q() {
      return W / 2;
    }
    function $() {
      const { convectionCells: u } = o.current, R = Y();
      l.current = Array.from({ length: u }, () => {
        const S = Math.random() * Math.PI * 2, L = Math.random() * R * 0.85;
        return {
          x: E() + Math.cos(S) * L,
          y: q() + Math.sin(S) * L,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          temp: Math.random(),
          phase: Math.random() * Math.PI * 2
        };
      });
    }
    function I() {
      s.current = Array.from({ length: 7 }, (u, R) => ({
        baseRadius: 1.1 + R * 0.15,
        phase: R / 7 * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        alpha: 0.25 - R * 0.025,
        width: 15 + R * 5
      }));
    }
    function f(u, R = !1) {
      const { flareColor: S } = o.current, L = Y(), T = u + (Math.random() - 0.5) * 1.2, P = R ? L * (3 + Math.random() * 2) : L * (1.2 + Math.random() * 2), A = E() + Math.cos(T) * (L + P), D = q() + Math.sin(T) * (L + P), z = R || Math.random() < 0.15, O = z ? u + (Math.random() - 0.5) * 0.8 : u + (Math.random() - 0.5) * 2.5, j = z ? L * (2.5 + Math.random() * 2.5) : L * (0.8 + Math.random() * 0.4), N = E() + Math.cos(O) * j, H = q() + Math.sin(O) * j, J = 60 + Math.floor(L * 0.8), G = Array.from({ length: J }, (U, V) => ({
        t: V / J * 0.2,
        speed: 3e-3 + Math.random() * 5e-3,
        alpha: 0.7 + Math.random() * 0.3,
        size: 2.5 + Math.random() * 6,
        hue: 0
      }));
      i.current.push({
        angle: u,
        cpX: A,
        cpY: D,
        endX: N,
        endY: H,
        particles: G,
        age: 0,
        duration: z ? 280 : 240 + Math.random() * 80,
        escaped: z,
        color: S
      });
    }
    function d(u, R) {
      const S = window.devicePixelRatio || 1;
      t.width = Math.round(u * S), t.height = Math.round(R * S), t.style.width = `${u}px`, t.style.height = `${R}px`, m.scale(S, S), k = u, W = R, $(), I();
    }
    const x = new ResizeObserver((u) => {
      const { width: R, height: S } = u[0].contentRect;
      R > 0 && S > 0 && d(R, S);
    });
    x.observe(a);
    const F = a.getBoundingClientRect();
    F.width > 0 && F.height > 0 && d(F.width, F.height);
    function v(u) {
      if (!o.current.interactive) return;
      const R = t.getBoundingClientRect(), S = u.clientX - R.left, L = u.clientY - R.top, T = Math.atan2(L - q(), S - E());
      e.current = T;
    }
    function B(u) {
      const R = t.getBoundingClientRect();
      h.current = { x: u.clientX - R.left, y: u.clientY - R.top };
    }
    t.addEventListener("click", v), t.addEventListener("mousemove", B);
    function w(u) {
      const { sunColor: R, glowEffect: S, glowBlur: L, coronaColor: T } = o.current, P = Y(), A = E(), D = q(), z = Nt(R), O = Nt(o.current.backgroundColor), j = Nt(T);
      for (const G of s.current) {
        const U = P * (G.baseRadius + Math.sin(u * G.speed + G.phase) * 0.05), V = m.createRadialGradient(A, D, U * 0.85, A, D, U + G.width);
        V.addColorStop(0, `rgba(${j[0]},${j[1]},${j[2]},${G.alpha})`), V.addColorStop(1, `rgba(${j[0]},${j[1]},${j[2]},0)`), m.beginPath(), m.arc(A, D, U + G.width, 0, Math.PI * 2), m.fillStyle = V, m.fill();
      }
      S && (m.shadowBlur = L, m.shadowColor = `rgba(${z[0]},${z[1]},${z[2]},0.6)`);
      const N = m.createRadialGradient(A - P * 0.2, D - P * 0.2, P * 0.05, A, D, P);
      N.addColorStop(0, `rgba(${z[0]},${z[1]},${z[2]},1)`), N.addColorStop(0.5, Zt(z, O, 0.1)), N.addColorStop(0.85, Zt(z, O, 0.35)), N.addColorStop(1, Zt(z, O, 0.6)), m.beginPath(), m.arc(A, D, P, 0, Math.PI * 2), m.fillStyle = N, m.fill(), S && (m.shadowBlur = 0);
      const H = l.current, { speed: J } = o.current;
      for (const G of H) {
        G.x += G.vx * J, G.y += G.vy * J, G.phase += 0.02 * J;
        const U = G.x - A, V = G.y - D, _ = Math.sqrt(U * U + V * V);
        _ > P * 0.88 && (G.vx -= U / _ * 0.05, G.vy -= V / _ * 0.05);
        const Q = Qr(G.x * 0.02 + u * 0.1, G.y * 0.02), ot = (G.temp * 0.7 + Q * 0.3 + Math.sin(G.phase) * 0.15 + 0.5) % 1, K = 0.06 + ot * 0.08, et = P * 0.08 + ot * P * 0.06;
        m.beginPath(), m.arc(G.x, G.y, et, 0, Math.PI * 2);
        const tt = Math.round(z[0] * (0.6 + ot * 0.4)), nt = Math.round(z[1] * (0.6 + ot * 0.4)), rt = Math.round(z[2] * (0.6 + ot * 0.4));
        m.fillStyle = `rgba(${tt},${nt},${rt},${K})`, m.fill();
      }
    }
    function C() {
      const { flareColor: u, speed: R } = o.current, S = Nt(u), L = Nt(o.current.backgroundColor), T = Y(), P = E(), A = q();
      for (let D = i.current.length - 1; D >= 0; D--) {
        const z = i.current[D];
        z.age += R;
        const O = z.age / z.duration, j = P + Math.cos(z.angle) * T, N = A + Math.sin(z.angle) * T;
        for (const H of z.particles) {
          H.t = Math.min(1, H.t + H.speed * R);
          const [J, G] = Kr(j, N, z.cpX, z.cpY, z.endX, z.endY, H.t), U = Math.min(H.t * 4, (1 - O) * 3, 1), V = H.alpha * U;
          if (V <= 0) continue;
          const _ = 1 - H.t * 0.5, Q = Zt(S, L, 1 - _);
          m.beginPath(), m.arc(J, G, H.size * (0.7 + 0.3 * (1 - H.t)), 0, Math.PI * 2), m.fillStyle = Q.replace("rgb", "rgba").replace(")", `,${V})`), m.fill();
        }
        z.age >= z.duration && i.current.splice(D, 1);
      }
    }
    function M(u) {
      const { backgroundColor: R, autoFlare: S, autoFlareInterval: L, flareCount: T, speed: P } = o.current;
      g.current += u * 1e-3 * P;
      const A = g.current;
      m.fillStyle = R, m.fillRect(0, 0, k, W), w(A), C();
      const D = performance.now();
      if (S && i.current.length < T && D - n.current > L / P) {
        const z = Math.random() * Math.PI * 2, O = Math.random() < 0.1;
        f(z, O), n.current = D;
      }
      e.current !== null && (f(e.current), e.current = null);
    }
    let p = 0;
    function b(u) {
      const R = p ? u - p : 16;
      p = u, M(R), c.current = requestAnimationFrame(b);
    }
    return c.current = requestAnimationFrame(b), () => {
      x.disconnect(), cancelAnimationFrame(c.current), t.removeEventListener("click", v), t.removeEventListener("mousemove", B);
    };
  }, [r]);
}
const ta = {
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
}, ea = ht(
  (r, y) => {
    const {
      preset: o,
      sunColor: i,
      coronaColor: l,
      flareColor: s,
      backgroundColor: c,
      sunRadius: g,
      convectionCells: n,
      flareCount: e,
      autoFlare: h,
      autoFlareInterval: t,
      interactive: a,
      glowEffect: m,
      glowBlur: k,
      speed: W,
      width: Y,
      height: E,
      className: q,
      style: $
    } = r, I = o && ta[o] || {}, f = X(null);
    return gt(y, () => f.current), Zr(f, {
      sunColor: i ?? I.sunColor ?? "#ffffff",
      coronaColor: l ?? I.coronaColor ?? "#6b7280",
      flareColor: s ?? I.flareColor ?? "#ffffff",
      backgroundColor: c ?? I.backgroundColor ?? "#111111",
      sunRadius: g ?? I.sunRadius ?? 0.35,
      convectionCells: n ?? 20,
      flareCount: e ?? 3,
      autoFlare: h ?? !0,
      autoFlareInterval: t ?? 3e3,
      interactive: a ?? !0,
      glowEffect: m ?? !0,
      glowBlur: k ?? I.glowBlur ?? 40,
      speed: W ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: q,
        style: {
          width: Y ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...$
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: f,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ea.displayName = "SolarFlare";
export {
  vr as AntColony,
  _e as AudioVisualizer,
  un as AuroraBorealis,
  Or as BlackHole,
  on as Boids,
  Jr as BubbleUniverse,
  Do as ClothSimulation,
  to as Confetti,
  sr as CrystalGrowth,
  Sn as DiffusionAggregation,
  Ir as DragonCursor,
  je as FireEffect,
  Mo as Fireworks,
  uo as FlowField,
  Yo as FluidSimulation,
  Hr as GalaxySpiral,
  Jo as GameOfLife,
  So as GlitchOverlay,
  Un as InkBleed,
  Dn as Kaleidoscope,
  qr as KoiPond,
  Fn as LSystem,
  Uo as Lightning,
  Pn as Lissajous,
  Po as LiveChart,
  To as MagneticBlob,
  Mr as MagneticField,
  Io as Mandala,
  ze as MatrixRain,
  mr as Metaballs,
  ur as NeuralWeb,
  ao as NoiseGradient,
  Ye as ParticleField,
  hr as ParticleText,
  er as PendulaWave,
  so as PixelDissolve,
  Ho as Rain,
  an as ReactionDiffusion,
  Tr as SakuraBlossom,
  wn as SandSimulation,
  yo as Shockwave,
  Hn as SlimeMold,
  ea as SolarFlare,
  pn as Spirograph,
  go as Spotlight,
  Xe as Starfield,
  Pr as TerrainMesh,
  Ur as TornadoVortex,
  On as VoronoiCells,
  Kn as WatercolorBloom,
  Cn as WaveInterference,
  Zo as Wormhole
};
