import { jsx as it, jsxs as Ae } from "react/jsx-runtime";
import { useRef as X, useEffect as ft, forwardRef as ht, useImperativeHandle as gt } from "react";
const Be = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ", de = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", Fe = "01";
function Ie(r) {
  return r === "katakana" ? Be : r === "latin" ? de : r === "binary" ? Fe : r || de;
}
function $e(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0);
  ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const d = i.getContext("2d");
    let n = 0, t = 0;
    function e(k, B) {
      const F = window.devicePixelRatio || 1;
      n = k, t = B, i.width = Math.round(n * F), i.height = Math.round(t * F), i.style.width = `${n}px`, i.style.height = `${t}px`, d.scale(F, F);
      const { fontSize: A } = o.current, c = Math.floor(n / A);
      a.current = Array.from(
        { length: c },
        () => Math.floor(Math.random() * -(t / A))
      );
    }
    const h = new ResizeObserver((k) => {
      const { width: B, height: F } = k[0].contentRect;
      B > 0 && F > 0 && e(B, F);
    });
    h.observe(l);
    const u = l.getBoundingClientRect();
    u.width > 0 && u.height > 0 && e(u.width, u.height);
    let v = 0, S = 0;
    function L() {
      const { color: k, backgroundColor: B, fontSize: F, charset: A, resetThreshold: c } = o.current, g = A;
      d.fillStyle = B, d.fillRect(0, 0, n, t), d.fillStyle = k, d.font = `${F}px monospace`;
      const C = a.current;
      for (let P = 0; P < C.length; P++) {
        const m = g[Math.floor(Math.random() * g.length)];
        d.fillText(m, P * F, C[P] * F), C[P]++, C[P] * F > t && Math.random() > c && (C[P] = 0);
      }
    }
    function T(k) {
      const B = v ? k - v : 0;
      v = k, S += B;
      const { speed: F } = o.current;
      S >= F && (S = S % F, L()), s.current = requestAnimationFrame(T);
    }
    return s.current = requestAnimationFrame(T), () => {
      h.disconnect(), cancelAnimationFrame(s.current);
    };
  }, [r]);
}
const Te = {
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
}, Le = ht(
  (r, y) => {
    const {
      preset: o,
      color: a,
      backgroundColor: s,
      fontSize: i,
      speed: l,
      charset: d,
      resetThreshold: n,
      width: t,
      height: e,
      className: h,
      style: u
    } = r, v = o && Te[o] || {}, S = X(null);
    gt(y, () => S.current);
    const L = Ie(d ?? v.charset ?? "latin");
    $e(S, {
      color: a ?? v.color ?? "#ffffff",
      backgroundColor: s ?? v.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: i ?? v.fontSize ?? 14,
      speed: l ?? v.speed ?? 33,
      charset: L,
      resetThreshold: n ?? v.resetThreshold ?? 0.95
    });
    const T = {
      width: t ?? "100%",
      height: e ?? "100%",
      display: "block",
      overflow: "hidden",
      ...u
    };
    return /* @__PURE__ */ it("div", { style: T, className: h, children: /* @__PURE__ */ it(
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
Le.displayName = "MatrixRain";
const Ot = /* @__PURE__ */ new Map();
function Nt(r) {
  if (Ot.has(r)) return Ot.get(r);
  let y = r.trim();
  y.startsWith("#") && (y = y.slice(1));
  let o, a, s;
  if (y.length === 3)
    o = parseInt(y[0] + y[0], 16), a = parseInt(y[1] + y[1], 16), s = parseInt(y[2] + y[2], 16);
  else if (y.length === 6)
    o = parseInt(y.slice(0, 2), 16), a = parseInt(y.slice(2, 4), 16), s = parseInt(y.slice(4, 6), 16);
  else
    return Ot.set(r, null), null;
  if (isNaN(o) || isNaN(a) || isNaN(s))
    return Ot.set(r, null), null;
  const i = [o, a, s];
  return Ot.set(r, i), i;
}
function Rt(r, y = 1) {
  const o = Nt(r);
  return o ? `rgba(${o[0]},${o[1]},${o[2]},${y})` : `rgba(255,255,255,${y})`;
}
function yt(r) {
  const y = Nt(r);
  return y ? `${y[0]},${y[1]},${y[2]}` : "255,255,255";
}
function ze(r, y, o) {
  return [r[0] + (y[0] - r[0]) * o, r[1] + (y[1] - r[1]) * o, r[2] + (y[2] - r[2]) * o];
}
function bt(r, y) {
  const o = Math.max(0, Math.min(1, y));
  if (r.length === 0) return [255, 255, 255];
  if (r.length === 1) return Nt(r[0]) ?? [255, 255, 255];
  const a = o * (r.length - 1), s = Math.min(Math.floor(a), r.length - 2), i = a - s, l = Nt(r[s]) ?? [255, 255, 255], d = Nt(r[s + 1]) ?? [255, 255, 255];
  return ze(l, d, i);
}
function De(r, y) {
  const o = X([]), a = X(null), s = X(null), i = X(y);
  i.current = y;
  const l = X(0), d = X(""), n = X(""), t = X(""), e = X(""), h = X(null);
  ft(() => {
    var u;
    (u = h.current) == null || u.call(h);
  }, [y.particleCount, y.particleSize]), ft(() => {
    const u = r.current;
    if (!u) return;
    const v = u, S = v.parentElement;
    if (!S) return;
    const L = v.getContext("2d");
    let T = 0, k = 0;
    function B(R, E) {
      const { particleCount: b, particleSize: w, speed: f, velocityMultiplier: p, twinkle: M } = i.current;
      o.current = Array.from({ length: b }, () => ({
        x: Math.random() * R,
        y: Math.random() * E,
        vx: (Math.random() - 0.5) * f * p,
        vy: (Math.random() - 0.5) * f * p,
        size: Math.random() * w + w * 0.4,
        opacity: Math.random() * 0.5 + 0.5,
        twinklePhase: M ? Math.random() * Math.PI * 2 : void 0
      }));
    }
    function F(R, E) {
      const b = window.devicePixelRatio || 1;
      v.width = Math.round(R * b), v.height = Math.round(E * b), v.style.width = `${R}px`, v.style.height = `${E}px`, L.scale(b, b), T = R, k = E, B(R, E);
    }
    h.current = () => {
      T > 0 && k > 0 && B(T, k);
    };
    const A = new ResizeObserver((R) => {
      const { width: E, height: b } = R[0].contentRect;
      E > 0 && b > 0 && F(E, b);
    });
    A.observe(S);
    const c = S.getBoundingClientRect();
    c.width > 0 && c.height > 0 && F(c.width, c.height);
    function g(R) {
      const E = v.getBoundingClientRect();
      return { x: R.clientX - E.left, y: R.clientY - E.top };
    }
    function C(R) {
      if (!i.current.dragParticles) return;
      const { x: E, y: b } = g(R), w = o.current, { dragRadius: f } = i.current;
      let p = -1, M = f;
      for (let q = 0; q < w.length; q++) {
        const D = w[q].x - E, O = w[q].y - b, W = Math.sqrt(D * D + O * O);
        W < M && (M = W, p = q);
      }
      p !== -1 && (s.current = { particleIndex: p, offsetX: w[p].x - E, offsetY: w[p].y - b });
    }
    function P(R) {
      const { x: E, y: b } = g(R);
      if (s.current) {
        const w = o.current[s.current.particleIndex];
        w.x = E + s.current.offsetX, w.y = b + s.current.offsetY, w.vx = 0, w.vy = 0;
      }
      i.current.interactive && (a.current = { x: E, y: b });
    }
    function m() {
      s.current = null;
    }
    function I() {
      a.current = null, s.current = null;
    }
    v.addEventListener("mousedown", C), v.addEventListener("mousemove", P), v.addEventListener("mouseup", m), v.addEventListener("mouseleave", I);
    function x() {
      const {
        particleColor: R,
        lineColor: E,
        lineDistance: b,
        connectParticles: w,
        backgroundColor: f,
        speed: p,
        repelRadius: M,
        repelStrength: q,
        friction: D,
        maxVelocityMultiplier: O,
        lineWidth: W,
        lineOpacity: z,
        wrapEdges: $,
        twinkle: Y,
        twinkleSpeed: H,
        twinkleAmplitude: G,
        glowParticles: N,
        glowBlur: U,
        lineStyle: j
      } = i.current;
      R !== t.current && (d.current = yt(R), t.current = R), E !== e.current && (n.current = yt(E), e.current = E);
      const _ = o.current, J = a.current, V = d.current, Q = n.current;
      L.clearRect(0, 0, T, k), f && f !== "transparent" && (L.fillStyle = f, L.fillRect(0, 0, T, k));
      for (let nt = 0; nt < _.length; nt++) {
        const K = _[nt];
        if (s.current && s.current.particleIndex === nt) continue;
        if (J) {
          const ot = K.x - J.x, at = K.y - J.y, Z = Math.sqrt(ot * ot + at * at);
          if (Z < M && Z > 0) {
            const rt = (M - Z) / M * 2;
            K.vx += ot / Z * rt * q, K.vy += at / Z * rt * q;
          }
        }
        K.vx *= D, K.vy *= D;
        const et = p * O, tt = Math.sqrt(K.vx * K.vx + K.vy * K.vy);
        tt > et && (K.vx = K.vx / tt * et, K.vy = K.vy / tt * et), K.x += K.vx, K.y += K.vy, $ ? (K.x < 0 ? K.x += T : K.x > T && (K.x -= T), K.y < 0 ? K.y += k : K.y > k && (K.y -= k)) : (K.x < 0 && (K.x = 0, K.vx *= -1), K.x > T && (K.x = T, K.vx *= -1), K.y < 0 && (K.y = 0, K.vy *= -1), K.y > k && (K.y = k, K.vy *= -1)), Y && (K.twinklePhase === void 0 && (K.twinklePhase = Math.random() * Math.PI * 2), K.twinklePhase += H);
      }
      if (w) {
        j === "dashed" ? L.setLineDash([4, 6]) : L.setLineDash([]);
        for (let nt = 0; nt < _.length; nt++)
          for (let K = nt + 1; K < _.length; K++) {
            const et = _[nt].x - _[K].x, tt = _[nt].y - _[K].y, ot = Math.sqrt(et * et + tt * tt);
            if (ot < b) {
              const at = (1 - ot / b) * z;
              L.beginPath(), L.moveTo(_[nt].x, _[nt].y), L.lineTo(_[K].x, _[K].y), L.strokeStyle = `rgba(${Q},${at})`, L.lineWidth = W, L.stroke();
            }
          }
        L.setLineDash([]);
      }
      for (let nt = 0; nt < _.length; nt++) {
        const K = _[nt], et = Y && K.twinklePhase !== void 0 ? 1 - G + G * Math.sin(K.twinklePhase) : K.opacity;
        N && (L.shadowColor = R, L.shadowBlur = U), L.beginPath(), L.arc(K.x, K.y, K.size, 0, Math.PI * 2), L.fillStyle = `rgba(${V},${et})`, L.fill(), N && (L.shadowBlur = 0);
      }
      l.current = requestAnimationFrame(x);
    }
    return l.current = requestAnimationFrame(x), () => {
      A.disconnect(), cancelAnimationFrame(l.current), v.removeEventListener("mousedown", C), v.removeEventListener("mousemove", P), v.removeEventListener("mouseup", m), v.removeEventListener("mouseleave", I);
    };
  }, [r]);
}
const qe = {
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
}, We = ht(
  (r, y) => {
    const {
      preset: o,
      particleCount: a,
      particleColor: s,
      lineColor: i,
      lineDistance: l,
      particleSize: d,
      speed: n,
      connectParticles: t,
      interactive: e,
      backgroundColor: h,
      repelRadius: u,
      repelStrength: v,
      friction: S,
      maxVelocityMultiplier: L,
      lineWidth: T,
      lineOpacity: k,
      wrapEdges: B,
      twinkle: F,
      twinkleSpeed: A,
      twinkleAmplitude: c,
      glowParticles: g,
      glowBlur: C,
      lineStyle: P,
      dragParticles: m,
      dragRadius: I,
      velocityMultiplier: x,
      width: R,
      height: E,
      className: b,
      style: w
    } = r, f = o && qe[o] || {}, p = X(null);
    return gt(y, () => p.current), De(p, {
      particleCount: a ?? f.particleCount ?? 120,
      particleColor: s ?? f.particleColor ?? "#ffffff",
      lineColor: i ?? f.lineColor ?? "#6b7280",
      lineDistance: l ?? f.lineDistance ?? 120,
      particleSize: d ?? 2.5,
      speed: n ?? f.speed ?? 0.8,
      connectParticles: t ?? f.connectParticles ?? !0,
      interactive: e ?? !0,
      backgroundColor: h ?? f.backgroundColor ?? "transparent",
      repelRadius: u ?? 80,
      repelStrength: v ?? 0.3,
      friction: S ?? 0.99,
      maxVelocityMultiplier: L ?? 3,
      lineWidth: T ?? 0.8,
      lineOpacity: k ?? f.lineOpacity ?? 0.6,
      wrapEdges: B ?? f.wrapEdges ?? !1,
      twinkle: F ?? f.twinkle ?? !1,
      twinkleSpeed: A ?? 0.03,
      twinkleAmplitude: c ?? 0.4,
      glowParticles: g ?? f.glowParticles ?? !1,
      glowBlur: C ?? 15,
      lineStyle: P ?? f.lineStyle ?? "solid",
      dragParticles: m ?? !1,
      dragRadius: I ?? 20,
      velocityMultiplier: x ?? f.velocityMultiplier ?? 2
    }), /* @__PURE__ */ it(
      "div",
      {
        className: b,
        style: {
          width: R ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: m ?? !1 ? "grab" : "default",
          ...w
        },
        children: /* @__PURE__ */ it("canvas", { ref: p, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
We.displayName = "ParticleField";
function Ye(r, y) {
  const o = X([]), a = X([]), s = X([]), i = X(y);
  i.current = y;
  const l = X(0), d = X(0), n = X(null);
  ft(() => {
    var t;
    (t = n.current) == null || t.call(n);
  }, [y.starCount]), ft(() => {
    const t = r.current;
    if (!t) return;
    const e = t, h = e.parentElement;
    if (!h) return;
    const u = e.getContext("2d");
    let v = 0, S = 0;
    function L(c, g) {
      const { starCount: C, starSizeMin: P, starSizeMax: m, starOpacityMin: I, starOpacityMax: x, twinkleSpeed: R } = i.current;
      o.current = Array.from({ length: C }, () => ({
        x: Math.random() * c,
        y: Math.random() * g,
        size: Math.random() * (m - P) + P,
        opacity: Math.random() * (x - I) + I,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * R + R * 0.3
      }));
    }
    function T(c, g) {
      const { starCount: C } = i.current, P = Math.max(c, g);
      a.current = Array.from({ length: C }, () => ({
        x: (Math.random() - 0.5) * c * 2,
        y: (Math.random() - 0.5) * g * 2,
        z: Math.random() * P,
        pz: 0
      }));
    }
    function k(c, g) {
      const C = window.devicePixelRatio || 1;
      e.width = Math.round(c * C), e.height = Math.round(g * C), e.style.width = `${c}px`, e.style.height = `${g}px`, u.scale(C, C), v = c, S = g, L(c, g), T(c, g);
    }
    n.current = () => {
      v > 0 && S > 0 && (L(v, S), T(v, S));
    };
    const B = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && k(g, C);
    });
    B.observe(h);
    const F = h.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height);
    function A(c) {
      const {
        starColor: g,
        shootingStarColor: C,
        backgroundColor: P,
        speed: m,
        twinkle: I,
        shootingStars: x,
        shootingStarInterval: R,
        perspective: E,
        shootingStarLength: b,
        shootingStarLifetime: w
      } = i.current;
      if (u.fillStyle = P, u.fillRect(0, 0, v, S), E === "3D") {
        const f = v / 2, p = S / 2, M = Math.max(v, S), q = a.current;
        for (let D = 0; D < q.length; D++) {
          const O = q[D];
          O.pz = O.z, O.z -= m * 4, O.z <= 0 && (O.x = (Math.random() - 0.5) * v * 2, O.y = (Math.random() - 0.5) * S * 2, O.z = M, O.pz = O.z);
          const W = O.x / O.z * v + f, z = O.y / O.z * S + p, $ = O.x / O.pz * v + f, Y = O.y / O.pz * S + p, H = Math.max((1 - O.z / M) * 3, 0.1), G = 1 - O.z / M;
          u.beginPath(), u.moveTo($, Y), u.lineTo(W, z), u.strokeStyle = Rt(g, G), u.lineWidth = H, u.stroke();
        }
      } else {
        const f = o.current;
        for (let p = 0; p < f.length; p++) {
          const M = f[p];
          M.y += m * (M.size / 2), M.y > S && (M.y = 0, M.x = Math.random() * v);
          let q = M.opacity;
          I && (M.twinklePhase += M.twinkleSpeed, q = M.opacity * (0.5 + 0.5 * Math.sin(M.twinklePhase))), u.beginPath(), u.arc(M.x, M.y, M.size, 0, Math.PI * 2), u.fillStyle = Rt(g, q), u.fill();
        }
        if (x) {
          if (c - d.current > R) {
            d.current = c;
            const p = Math.random() * 8 + 4, M = Math.random() * 4 + 2;
            s.current.push({
              x: Math.random() * v * 0.7,
              y: Math.random() * S * 0.3,
              vx: p,
              vy: M,
              length: Math.random() * (b * 0.5) + b * 0.5,
              opacity: 1,
              life: 0,
              maxLife: w
            });
          }
          s.current = s.current.filter((p) => {
            if (p.x += p.vx, p.y += p.vy, p.life++, p.opacity = 1 - p.life / p.maxLife, p.opacity <= 0) return !1;
            const M = p.length / Math.sqrt(p.vx * p.vx + p.vy * p.vy), q = u.createLinearGradient(p.x, p.y, p.x - p.vx * M, p.y - p.vy * M);
            return q.addColorStop(0, Rt(C, p.opacity)), q.addColorStop(1, Rt(C, 0)), u.beginPath(), u.moveTo(p.x, p.y), u.lineTo(p.x - p.vx * M, p.y - p.vy * M), u.strokeStyle = q, u.lineWidth = 2, u.stroke(), !0;
          });
        }
      }
      l.current = requestAnimationFrame(A);
    }
    return l.current = requestAnimationFrame(A), () => {
      B.disconnect(), cancelAnimationFrame(l.current);
    };
  }, [r]);
}
const Oe = {
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
      starCount: a,
      starColor: s,
      shootingStarColor: i,
      backgroundColor: l,
      speed: d,
      twinkle: n,
      shootingStars: t,
      shootingStarInterval: e,
      perspective: h,
      starSizeMin: u,
      starSizeMax: v,
      starOpacityMin: S,
      starOpacityMax: L,
      twinkleSpeed: T,
      shootingStarLength: k,
      shootingStarLifetime: B,
      width: F,
      height: A,
      className: c,
      style: g
    } = r, C = o && Oe[o] || {}, P = X(null);
    return gt(y, () => P.current), Ye(P, {
      starCount: a ?? C.starCount ?? 200,
      starColor: s ?? C.starColor ?? "#ffffff",
      shootingStarColor: i ?? C.shootingStarColor ?? "#ffffff",
      backgroundColor: l ?? C.backgroundColor ?? "#111111",
      speed: d ?? C.speed ?? 0.5,
      twinkle: n ?? C.twinkle ?? !0,
      shootingStars: t ?? C.shootingStars ?? !0,
      shootingStarInterval: e ?? C.shootingStarInterval ?? 3e3,
      perspective: h ?? C.perspective ?? "2D",
      starSizeMin: u ?? 0.3,
      starSizeMax: v ?? 2.8,
      starOpacityMin: S ?? 0.3,
      starOpacityMax: L ?? 1,
      twinkleSpeed: T ?? 0.03,
      shootingStarLength: k ?? 80,
      shootingStarLifetime: B ?? 60
    }), /* @__PURE__ */ it(
      "div",
      {
        className: c,
        style: { width: F ?? "100%", height: A ?? "100%", display: "block", overflow: "hidden", ...g },
        children: /* @__PURE__ */ it("canvas", { ref: P, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Xe.displayName = "Starfield";
function he(r) {
  const y = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    const a = o / 255, [s, i, l] = bt(r, a), d = Math.round(s), n = Math.round(i), t = Math.round(l), e = Math.min(255, o * 8);
    y[o] = e << 24 | t << 16 | n << 8 | d;
  }
  return y[0] = 0, y;
}
function ge(r) {
  const y = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    let a = 0, s = 0, i = 0;
    const l = o / 255;
    if (r === "inferno")
      if (l < 0.33)
        a = Math.round(l / 0.33 * 200), s = 0, i = 0;
      else if (l < 0.66) {
        const n = (l - 0.33) / 0.33;
        a = Math.round(200 + n * 55), s = Math.round(n * 165), i = 0;
      } else {
        const n = (l - 0.66) / 0.34;
        a = 255, s = Math.round(165 + n * 90), i = Math.round(n * 255);
      }
    else if (r === "toxic")
      if (l < 0.4)
        a = 0, s = Math.round(l / 0.4 * 180), i = 0;
      else if (l < 0.75) {
        const n = (l - 0.4) / 0.35;
        a = Math.round(n * 180), s = Math.round(180 + n * 75), i = 0;
      } else {
        const n = (l - 0.75) / 0.25;
        a = Math.round(180 + n * 75), s = 255, i = Math.round(n * 100);
      }
    else if (r === "ice")
      if (l < 0.4)
        a = 0, s = 0, i = Math.round(l / 0.4 * 200);
      else if (l < 0.7) {
        const n = (l - 0.4) / 0.3;
        a = 0, s = Math.round(n * 200), i = Math.round(200 + n * 55);
      } else {
        const n = (l - 0.7) / 0.3;
        a = Math.round(n * 255), s = Math.round(200 + n * 55), i = 255;
      }
    else if (r === "plasma")
      if (l < 0.3) {
        const n = l / 0.3;
        a = Math.round(n * 150), s = 0, i = Math.round(n * 200);
      } else if (l < 0.6) {
        const n = (l - 0.3) / 0.3;
        a = Math.round(150 + n * 105), s = 0, i = Math.round(200 + n * 55);
      } else {
        const n = (l - 0.6) / 0.4;
        a = 255, s = Math.round(n * 200), i = 255;
      }
    else {
      const n = Math.round(l < 0.5 ? l * 2 * 180 : 180 + (l - 0.5) * 2 * 75);
      a = s = i = Math.min(255, n);
    }
    const d = Math.min(255, o * 8);
    y[o] = d << 24 | i << 16 | s << 8 | a;
  }
  return y[0] = 0, y;
}
function Ge(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null), i = X(
    y.customColors && y.customColors.length >= 2 ? he(y.customColors) : ge(y.palette)
  ), l = X(y.palette), d = X(JSON.stringify(y.customColors ?? [])), n = X(null), t = X(null), e = X(null), h = X(null);
  ft(() => {
    const u = r.current;
    if (!u) return;
    const v = u, S = v.parentElement;
    if (!S) return;
    const L = v.getContext("2d");
    let T = 0, k = 0;
    n.current || (n.current = document.createElement("canvas"), t.current = n.current.getContext("2d"));
    function B(g, C) {
      const { resolution: P } = o.current, m = window.devicePixelRatio || 1, I = Math.max(0.1, Math.min(1, P));
      v.width = Math.round(g * m), v.height = Math.round(C * m), v.style.width = `${g}px`, v.style.height = `${C}px`, T = Math.max(1, Math.round(g * I)), k = Math.max(1, Math.round(C * I)), s.current = new Uint8Array(T * k);
      const x = n.current;
      x.width = T, x.height = k, e.current = t.current.createImageData(T, k), h.current = new Uint32Array(e.current.data.buffer);
    }
    const F = new ResizeObserver((g) => {
      const { width: C, height: P } = g[0].contentRect;
      C > 0 && P > 0 && B(C, P);
    });
    F.observe(S);
    const A = S.getBoundingClientRect();
    A.width > 0 && A.height > 0 && B(A.width, A.height);
    function c() {
      const { palette: g, customColors: C, intensity: P, windStrength: m, windDirection: I, spread: x, cooling: R, noiseStrength: E, coolingScale: b } = o.current, w = C && C.length >= 2, f = JSON.stringify(C ?? []);
      w ? f !== d.current && (d.current = f, i.current = he(C)) : (g !== l.current || d.current !== "[]") && (l.current = g, d.current = "[]", i.current = ge(g));
      const p = s.current, M = h.current, q = e.current;
      if (!p || !M || !q || T === 0 || k === 0) {
        a.current = requestAnimationFrame(c);
        return;
      }
      const D = Math.round(P * 255);
      for (let Y = 0; Y < T; Y++)
        p[(k - 1) * T + Y] = 255;
      const O = E / 2;
      for (let Y = 0; Y < T; Y++) {
        const H = Math.random() * E - O;
        p[(k - 2) * T + Y] = Math.max(80, Math.min(255, D + H));
      }
      const W = Math.round(m * I), z = Math.max(1, Math.round(R * b));
      for (let Y = 0; Y < k - 1; Y++) {
        const H = (Y + 1) * T;
        for (let G = 0; G < T; G++) {
          const N = p[H + G], U = G > 0 ? p[H + G - 1] : N, j = G < T - 1 ? p[H + G + 1] : N, _ = (U * x + N * 2 + j * x) / (2 + x * 2), J = z + (Math.random() * z | 0), V = 1 - Y / k, Q = Math.random() < V * V ? _ * 0.25 * Math.random() : 0, nt = _ - J - Q, K = G + W, et = K >= 0 && K < T ? K : G;
          p[Y * T + et] = Math.max(0, Math.min(255, nt));
        }
      }
      const $ = i.current;
      for (let Y = 0; Y < T * k; Y++)
        M[Y] = $[p[Y]];
      L.clearRect(0, 0, v.width, v.height), t.current.putImageData(q, 0, 0), L.drawImage(n.current, 0, 0, v.width, v.height), a.current = requestAnimationFrame(c);
    }
    return a.current = requestAnimationFrame(c), () => {
      F.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const He = {
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
}, Ne = ht(
  (r, y) => {
    const {
      preset: o,
      palette: a,
      customColors: s,
      intensity: i,
      windStrength: l,
      windDirection: d,
      spread: n,
      cooling: t,
      noiseStrength: e,
      coolingScale: h,
      resolution: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && He[o] || {}, B = X(null);
    return gt(y, () => B.current), Ge(B, {
      palette: a ?? k.palette ?? "smoke",
      customColors: s,
      intensity: i ?? k.intensity ?? 0.95,
      windStrength: l ?? k.windStrength ?? 0.3,
      windDirection: d ?? k.windDirection ?? 1,
      spread: n ?? k.spread ?? 0,
      cooling: t ?? k.cooling ?? 0.3,
      noiseStrength: e ?? 60,
      coolingScale: h ?? 3,
      resolution: u ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: { width: v ?? "100%", height: S ?? "100%", display: "block", overflow: "hidden", ...T },
        children: /* @__PURE__ */ it("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ne.displayName = "FireEffect";
function je(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null), i = X(null), l = X(null), d = X(null), n = X(null);
  ft(() => {
    var v, S;
    const t = y.audioSource;
    if (!t) {
      s.current && ((v = l.current) == null || v.disconnect(), (S = i.current) == null || S.close(), s.current = null, l.current = null, i.current = null);
      return;
    }
    const e = new AudioContext();
    i.current = e;
    const h = e.createAnalyser();
    h.fftSize = y.fftSize, h.smoothingTimeConstant = y.smoothingTimeConstant, s.current = h;
    const u = e.createMediaStreamSource(t);
    return l.current = u, u.connect(h), d.current = new Uint8Array(new ArrayBuffer(h.frequencyBinCount)), n.current = new Uint8Array(new ArrayBuffer(h.fftSize)), () => {
      u.disconnect(), e.close(), s.current = null, l.current = null, i.current = null;
    };
  }, [y.audioSource, y.fftSize, y.smoothingTimeConstant]), ft(() => {
    const t = r.current;
    if (!t) return;
    const e = t, h = e.parentElement;
    if (!h) return;
    const u = e.getContext("2d");
    let v = 0, S = 0;
    function L(m, I) {
      const x = window.devicePixelRatio || 1;
      e.width = Math.round(m * x), e.height = Math.round(I * x), e.style.width = `${m}px`, e.style.height = `${I}px`, u.scale(x, x), v = m, S = I;
    }
    const T = new ResizeObserver((m) => {
      const { width: I, height: x } = m[0].contentRect;
      I > 0 && x > 0 && L(I, x);
    });
    T.observe(h);
    const k = h.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B() {
      const { glowEffect: m, glowColor: I, glowBlur: x, barColor: R } = o.current;
      m ? (u.shadowColor = I || R, u.shadowBlur = x) : u.shadowBlur = 0;
    }
    function F() {
      u.shadowBlur = 0;
    }
    function A() {
      const { backgroundColor: m } = o.current;
      m && m !== "transparent" ? (u.fillStyle = m, u.fillRect(0, 0, v, S)) : u.clearRect(0, 0, v, S);
    }
    function c(m, I, x, R, E) {
      const b = u.createLinearGradient(m, S, m, S - I);
      return b.addColorStop(0, R), b.addColorStop(1, E), b;
    }
    function g(m, I, x, R, E, b) {
      R < 1 || (u.fillStyle = E, b && R > 4 ? (u.beginPath(), u.roundRect(m, I, x, R, Math.min(x / 2, 4)), u.fill()) : u.fillRect(m, I, x, R));
    }
    function C() {
      const {
        barCount: m,
        barColor: I,
        waveColor: x,
        gapBetweenBars: R,
        rounded: E,
        mode: b,
        gradient: w,
        gradientEndColor: f,
        idleAmplitude: p,
        idleAnimationSpeed: M
      } = o.current;
      A(), B();
      const q = performance.now() / 1e3 * M;
      if (b === "wave") {
        u.beginPath(), u.moveTo(0, S / 2);
        for (let W = 0; W < v; W++) {
          const z = S / 2 + Math.sin(W / v * Math.PI * 4 + q * 2) * p;
          u.lineTo(W, z);
        }
        u.strokeStyle = x, u.lineWidth = 2, u.stroke(), F();
        return;
      }
      if (b === "circular") {
        const { circularRadiusRatio: W } = o.current, z = v / 2, $ = S / 2, Y = Math.min(v, S) * W, H = Math.max(1, 2 * Math.PI * Y / m * 0.6);
        for (let G = 0; G < m; G++) {
          const N = (Math.sin(G / m * Math.PI * 2 + q * 2) * 0.5 + 0.5) * Y * 0.15 + 2, U = G / m * Math.PI * 2 - Math.PI / 2, j = z + Math.cos(U) * Y, _ = $ + Math.sin(U) * Y, J = z + Math.cos(U) * (Y + N), V = $ + Math.sin(U) * (Y + N);
          u.beginPath(), u.moveTo(j, _), u.lineTo(J, V), u.strokeStyle = w ? `hsl(${G / m * 360},70%,60%)` : I, u.lineWidth = H, u.stroke();
        }
        u.beginPath(), u.arc(z, $, Y, 0, Math.PI * 2), u.strokeStyle = I, u.lineWidth = 1, u.stroke(), F();
        return;
      }
      if (b === "mirror") {
        const W = R * (m - 1), z = (v - W) / m;
        for (let $ = 0; $ < m; $++) {
          const Y = (Math.sin($ / m * Math.PI * 2 + q * 3) * 0.5 + 0.5) * S * 0.15 + 2, H = $ * (z + R), G = w ? c(H, Y, z, I, f) : I;
          g(H, S / 2 - Y / 2, z, Y, G, E);
        }
        F();
        return;
      }
      const D = R * (m - 1), O = (v - D) / m;
      for (let W = 0; W < m; W++) {
        const z = (Math.sin(W / m * Math.PI * 2 + q * 3) * 0.5 + 0.5) * S * 0.3 + 4, $ = W * (O + R), Y = S - z, H = w ? c($, z, O, I, f) : I;
        g($, Y, O, z, H, E);
      }
      F();
    }
    function P() {
      const {
        barCount: m,
        barColor: I,
        waveColor: x,
        mode: R,
        sensitivity: E,
        gapBetweenBars: b,
        rounded: w,
        gradient: f,
        gradientEndColor: p
      } = o.current;
      A();
      const M = s.current;
      if (!M) {
        C(), a.current = requestAnimationFrame(P);
        return;
      }
      const q = d.current, D = n.current;
      if (M.getByteFrequencyData(q), M.getByteTimeDomainData(D), B(), R === "bars") {
        const O = b * (m - 1), W = (v - O) / m, z = Math.max(1, Math.floor(q.length / m));
        for (let $ = 0; $ < m; $++) {
          const H = q[$ * z] / 255 * S * E, G = $ * (W + b), N = f ? c(G, H, W, I, p) : I;
          g(G, S - H, W, H, N, w);
        }
      } else if (R === "mirror") {
        const O = b * (m - 1), W = (v - O) / m, z = Math.max(1, Math.floor(q.length / m));
        for (let $ = 0; $ < m; $++) {
          const H = q[$ * z] / 255 * S * E, G = $ * (W + b), N = f ? c(G, H, W, I, p) : I;
          g(G, S / 2 - H / 2, W, H, N, w);
        }
      } else if (R === "wave") {
        u.beginPath(), Math.max(1, Math.floor(D.length / v));
        for (let O = 0; O < v; O++) {
          const W = Math.min(Math.floor(O / v * D.length), D.length - 1), z = O, $ = (D[W] / 128 - 1) * (S / 2) * E + S / 2;
          O === 0 ? u.moveTo(z, $) : u.lineTo(z, $);
        }
        if (f) {
          const O = u.createLinearGradient(0, 0, v, 0);
          O.addColorStop(0, x), O.addColorStop(0.5, p), O.addColorStop(1, x), u.strokeStyle = O;
        } else
          u.strokeStyle = x;
        u.lineWidth = 2, u.stroke();
      } else if (R === "circular") {
        const { circularRadiusRatio: O } = o.current, W = v / 2, z = S / 2, $ = Math.min(v, S) * O, Y = Math.max(1, Math.floor(q.length / m)), H = Math.max(1, 2 * Math.PI * $ / m * 0.6);
        for (let G = 0; G < m; G++) {
          const U = q[G * Y] / 255 * $ * E, j = G / m * Math.PI * 2 - Math.PI / 2, _ = W + Math.cos(j) * $, J = z + Math.sin(j) * $, V = W + Math.cos(j) * ($ + U), Q = z + Math.sin(j) * ($ + U);
          u.beginPath(), u.moveTo(_, J), u.lineTo(V, Q), u.strokeStyle = f ? `hsl(${G / m * 360},80%,60%)` : I, u.lineWidth = H, u.stroke();
        }
        u.beginPath(), u.arc(W, z, $, 0, Math.PI * 2), u.strokeStyle = I, u.lineWidth = 1.5, u.stroke();
      }
      F(), a.current = requestAnimationFrame(P);
    }
    return a.current = requestAnimationFrame(P), () => {
      T.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const Ue = {
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
}, Ve = ht(
  (r, y) => {
    const {
      preset: o,
      audioSource: a = null,
      barCount: s,
      barColor: i,
      waveColor: l,
      mode: d,
      sensitivity: n,
      gapBetweenBars: t,
      rounded: e,
      gradient: h,
      gradientEndColor: u,
      backgroundColor: v,
      glowEffect: S,
      glowColor: L,
      glowBlur: T,
      fftSize: k,
      smoothingTimeConstant: B,
      circularRadiusRatio: F,
      idleAmplitude: A,
      idleAnimationSpeed: c,
      width: g,
      height: C,
      className: P,
      style: m
    } = r, I = o && Ue[o] || {}, x = i ?? I.barColor ?? "#ffffff", R = X(null);
    return gt(y, () => R.current), je(R, {
      audioSource: a,
      barCount: s ?? 64,
      barColor: x,
      waveColor: l ?? I.waveColor ?? x,
      mode: d ?? I.mode ?? "bars",
      sensitivity: n ?? 1,
      gapBetweenBars: t ?? 2,
      rounded: e ?? I.rounded ?? !0,
      gradient: h ?? I.gradient ?? !0,
      gradientEndColor: u ?? I.gradientEndColor ?? "#ffffff",
      backgroundColor: v ?? I.backgroundColor ?? "#111111",
      glowEffect: S ?? I.glowEffect ?? !0,
      glowColor: L ?? x,
      glowBlur: T ?? I.glowBlur ?? 12,
      fftSize: k ?? 2048,
      smoothingTimeConstant: B ?? 0.8,
      circularRadiusRatio: F ?? 0.25,
      idleAmplitude: A ?? 5,
      idleAnimationSpeed: c ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: P,
        style: {
          width: g ?? "100%",
          height: C ?? "100%",
          display: "block",
          overflow: "hidden",
          ...m
        },
        children: /* @__PURE__ */ it("canvas", { ref: R, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ve.displayName = "AudioVisualizer";
function _e(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(!1), l = X(!1), d = X(0), n = X(0);
  ft(() => {
    const t = r.current;
    if (!t) return;
    const e = t, h = e.parentElement;
    if (!h) return;
    const u = e.getContext("2d");
    let v = 0, S = 0;
    function L(c, g) {
      const C = window.devicePixelRatio || 1;
      e.width = Math.round(c * C), e.height = Math.round(g * C), e.style.width = `${c}px`, e.style.height = `${g}px`, u.scale(C, C), v = c, S = g;
    }
    const T = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && L(g, C);
    });
    T.observe(h);
    const k = h.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B(c) {
      const { spread: g, colors: C, shapes: P, duration: m, spawnX: I, spawnY: x, spawnSpread: R, speedMin: E, speedMax: b, sizeMin: w, sizeMax: f, angularVelocity: p } = o.current, M = v * I, q = S * x, D = Math.max(1, m / 16.67);
      for (let O = 0; O < c; O++) {
        const W = (Math.random() * 2 - 1) * g * Math.PI, z = Math.random() * (b - E) + E;
        a.current.push({
          x: M + (Math.random() - 0.5) * R,
          y: q,
          vx: Math.sin(W) * z,
          vy: -Math.cos(W) * z,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * p,
          color: C[Math.floor(Math.random() * C.length)],
          shape: P[Math.floor(Math.random() * P.length)],
          w: Math.random() * (f - w) + w,
          h: Math.random() * (f - w) * 0.75 + w * 0.5,
          opacity: 1,
          life: 0,
          maxLife: D
        });
      }
    }
    function F(c) {
      switch (u.save(), u.translate(c.x, c.y), u.rotate(c.angle), u.globalAlpha = c.opacity, u.fillStyle = c.color, c.shape) {
        case "square":
          u.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          break;
        case "circle":
          u.beginPath(), u.arc(0, 0, c.w / 2, 0, Math.PI * 2), u.fill();
          break;
        case "triangle":
          u.beginPath(), u.moveTo(0, -c.h / 2), u.lineTo(c.w / 2, c.h / 2), u.lineTo(-c.w / 2, c.h / 2), u.closePath(), u.fill();
          break;
        case "strip":
          u.fillRect(-c.w, -c.h / 4, c.w * 2, c.h / 2);
          break;
      }
      u.restore();
    }
    function A(c) {
      const g = d.current ? Math.min(c - d.current, 50) : 16.67;
      d.current = c;
      const { trigger: C, particleCount: P, gravity: m, continuous: I, wind: x, emissionRate: R, onComplete: E } = o.current;
      if (C && !i.current && (B(P), l.current = !1), i.current = C, I && C) {
        n.current += R * g / 1e3;
        const w = Math.floor(n.current);
        w > 0 && (B(w), n.current -= w);
      }
      u.clearRect(0, 0, v, S);
      const b = g / 16.67;
      a.current = a.current.filter((w) => (w.vy += m * 0.3 * b, w.vx += x * 0.05 * b, w.x += w.vx * b, w.y += w.vy * b, w.angle += w.angularV * b, w.life += b, w.opacity = Math.max(0, 1 - w.life / w.maxLife), w.opacity <= 0 || w.y > S + 50 ? !1 : (F(w), !0))), u.globalAlpha = 1, !l.current && C && !I && a.current.length === 0 && i.current && (l.current = !0, E == null || E()), s.current = requestAnimationFrame(A);
    }
    return s.current = requestAnimationFrame(A), () => {
      T.disconnect(), cancelAnimationFrame(s.current);
    };
  }, [r]);
}
const Je = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"]
}, Ke = {
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
}, Qe = ["square", "circle", "triangle", "strip"], Ze = ht(
  (r, y) => {
    const {
      preset: o,
      palette: a,
      trigger: s = !1,
      particleCount: i,
      spread: l,
      gravity: d,
      colors: n,
      shapes: t,
      duration: e,
      continuous: h,
      wind: u,
      spawnX: v,
      spawnY: S,
      spawnSpread: L,
      speedMin: T,
      speedMax: k,
      sizeMin: B,
      sizeMax: F,
      angularVelocity: A,
      emissionRate: c,
      onComplete: g,
      width: C,
      height: P,
      className: m,
      style: I
    } = r, x = o && Ke[o] || {}, R = a ?? x.palette ?? "monochrome", E = n ?? x.colors ?? Je[R], b = X(null);
    return gt(y, () => b.current), _e(b, {
      trigger: s,
      particleCount: i ?? 150,
      spread: l ?? 0.8,
      gravity: d ?? x.gravity ?? 0.5,
      colors: E,
      shapes: t ?? x.shapes ?? Qe,
      duration: e ?? 4e3,
      continuous: h ?? !1,
      wind: u ?? x.wind ?? 0.5,
      spawnX: v ?? 0.5,
      spawnY: S ?? 0.4,
      spawnSpread: L ?? 60,
      speedMin: T ?? 4,
      speedMax: k ?? x.speedMax ?? 16,
      sizeMin: B ?? 6,
      sizeMax: F ?? 14,
      angularVelocity: A ?? 0.3,
      emissionRate: c ?? 10,
      onComplete: g
    }), /* @__PURE__ */ it(
      "div",
      {
        className: m,
        style: {
          width: C ?? "100%",
          height: P ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...I
        },
        children: /* @__PURE__ */ it("canvas", { ref: b, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ze.displayName = "Confetti";
function pe(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function oe(r, y, o) {
  return r + o * (y - r);
}
function Ut(r, y, o) {
  const a = r & 3, s = a < 2 ? y : o, i = a < 2 ? o : y;
  return (a & 1 ? -s : s) + (a & 2 ? -i : i);
}
const qt = new Uint8Array(256);
for (let r = 0; r < 256; r++) qt[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [qt[r], qt[y]] = [qt[y], qt[r]];
}
const Pt = new Uint8Array(512);
for (let r = 0; r < 512; r++) Pt[r] = qt[r & 255];
function to(r, y) {
  const o = Math.floor(r) & 255, a = Math.floor(y) & 255, s = r - Math.floor(r), i = y - Math.floor(y), l = pe(s), d = pe(i), n = Pt[Pt[o] + a], t = Pt[Pt[o] + a + 1], e = Pt[Pt[o + 1] + a], h = Pt[Pt[o + 1] + a + 1];
  return oe(
    oe(Ut(n, s, i), Ut(e, s - 1, i), l),
    oe(Ut(t, s, i - 1), Ut(h, s - 1, i - 1), l),
    d
  );
}
function eo(r, y, o, a) {
  let s = 0, i = 1, l = 1, d = 0;
  for (let n = 0; n < o; n++)
    s += to(r * l, y * l) * i, d += i, i *= a, l *= 2;
  return s / d;
}
function oo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0), i = X(null), l = X(null), d = X(null), n = X(0), t = X(0);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e, u = h.parentElement;
    if (!u) return;
    const v = h.getContext("2d");
    let S = 0, L = 0;
    function T(A, c) {
      const { resolution: g } = o.current, C = window.devicePixelRatio || 1, P = Math.max(0.05, Math.min(1, g));
      h.width = Math.round(A * C), h.height = Math.round(c * C), h.style.width = `${A}px`, h.style.height = `${c}px`, S = h.width, L = h.height;
      const m = Math.max(1, Math.round(S * P)), I = Math.max(1, Math.round(L * P));
      if (m !== n.current || I !== t.current) {
        n.current = m, t.current = I, i.current = new ImageData(m, I);
        const x = document.createElement("canvas");
        x.width = m, x.height = I;
        const R = x.getContext("2d");
        l.current = x, d.current = R;
      }
    }
    const k = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && T(c, g);
    });
    k.observe(u);
    const B = u.getBoundingClientRect();
    B.width > 0 && B.height > 0 && T(B.width, B.height);
    function F(A) {
      const { colors: c, speed: g, scale: C, octaves: P, animated: m, blendMode: I, timeOffsetY: x, persistence: R } = o.current;
      if (c.length < 2) {
        a.current = requestAnimationFrame(F);
        return;
      }
      m && (s.current = A * 1e-3 * g);
      const E = s.current, b = i.current, w = l.current, f = d.current;
      if (!b || !w || !f) {
        a.current = requestAnimationFrame(F);
        return;
      }
      const p = n.current, M = t.current, q = b.data, D = C * 3 / p, O = C * 3 / M;
      for (let W = 0; W < M; W++) {
        const z = W * O;
        for (let $ = 0; $ < p; $++) {
          const Y = eo($ * D + E, z + E * x, P, R), H = Math.max(0, Math.min(1, (Y + 1) / 2)), [G, N, U] = bt(c, H), j = (W * p + $) * 4;
          q[j] = G, q[j + 1] = N, q[j + 2] = U, q[j + 3] = 255;
        }
      }
      f.putImageData(b, 0, 0), v.globalCompositeOperation = I || "source-over", v.imageSmoothingEnabled = !0, v.imageSmoothingQuality = "high", v.drawImage(w, 0, 0, S, L), m && (a.current = requestAnimationFrame(F));
    }
    return a.current = requestAnimationFrame(F), () => {
      k.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const no = {
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
}, ro = ht(
  (r, y) => {
    const {
      preset: o,
      colors: a,
      speed: s,
      scale: i,
      octaves: l,
      animated: d,
      blendMode: n,
      timeOffsetY: t,
      persistence: e,
      resolution: h,
      width: u,
      height: v,
      className: S,
      style: L
    } = r, T = o && no[o] || {}, k = X(null);
    return gt(y, () => k.current), oo(k, {
      colors: a ?? T.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: s ?? T.speed ?? 0.25,
      scale: i ?? T.scale ?? 1,
      octaves: l ?? T.octaves ?? 3,
      animated: d ?? !0,
      blendMode: n ?? "source-over",
      timeOffsetY: t ?? 0.5,
      persistence: e ?? 0.5,
      resolution: h ?? 0.25
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: { width: u ?? "100%", height: v ?? "100%", display: "block", overflow: "hidden", ...L },
        children: /* @__PURE__ */ it("canvas", { ref: k, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ro.displayName = "NoiseGradient";
function ao(r, y, o) {
  const a = X(o);
  a.current = o;
  const s = X(0), i = X(o.trigger), l = X(0), d = X("idle"), n = X([]), t = X(!1);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e, u = h.parentElement;
    if (!u) return;
    const v = h.getContext("2d");
    let S = 0, L = 0;
    function T(c, g) {
      const { pixelSize: C, dissolvePattern: P } = a.current, m = Math.ceil(c / C), I = Math.ceil(g / C), x = m / 2, R = I / 2, E = [];
      for (let b = 0; b < I; b++)
        for (let w = 0; w < m; w++) {
          let f;
          P === "center" ? f = Math.sqrt((w - x) ** 2 + (b - R) ** 2) / Math.sqrt(x ** 2 + R ** 2) : P === "edges" ? f = 1 - Math.sqrt((w - x) ** 2 + (b - R) ** 2) / Math.sqrt(x ** 2 + R ** 2) : P === "horizontal" ? f = w / m : f = Math.random(), E.push({ x: w * C, y: b * C, delay: f });
        }
      E.sort((b, w) => b.delay - w.delay), n.current = E;
    }
    function k(c, g) {
      const C = window.devicePixelRatio || 1;
      h.width = Math.round(c * C), h.height = Math.round(g * C), h.style.width = `${c}px`, h.style.height = `${g}px`, v.scale(C, C), S = c, L = g, T(c, g);
    }
    const B = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && k(g, C);
    });
    B.observe(u);
    const F = u.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height);
    function A() {
      const { trigger: c, speed: g, color: C, direction: P, pixelSize: m, onComplete: I, progressMultiplier: x } = a.current;
      c !== i.current && (i.current = c, c && (d.current = P === "in" ? "appearing" : "dissolving", l.current = 0, t.current = !1)), v.clearRect(0, 0, S, L);
      const R = n.current, E = d.current;
      if (E === "idle") {
        P === "out" && !c && (v.fillStyle = C, v.fillRect(0, 0, S, L)), s.current = requestAnimationFrame(A);
        return;
      }
      l.current = Math.min(l.current + g * x, 1);
      const b = l.current, w = b;
      if (v.fillStyle = C, E === "dissolving") {
        v.fillRect(0, 0, S, L);
        for (let f = 0; f < R.length; f++) {
          const p = R[f];
          f / R.length < w && v.clearRect(p.x, p.y, m, m);
        }
      } else if (E === "appearing")
        for (let f = 0; f < R.length; f++) {
          const p = R[f];
          f / R.length < w && v.fillRect(p.x, p.y, m, m);
        }
      b >= 1 && (P === "both" && E === "dissolving" ? (d.current = "appearing", l.current = 0) : (d.current = "idle", t.current || (t.current = !0, I == null || I()))), s.current = requestAnimationFrame(A);
    }
    return s.current = requestAnimationFrame(A), () => {
      B.disconnect(), cancelAnimationFrame(s.current);
    };
  }, [r]);
}
const io = ht(
  ({
    children: r,
    pixelSize: y = 8,
    speed: o = 0.5,
    direction: a = "out",
    trigger: s = !1,
    color: i = "#ffffff",
    onComplete: l,
    progressMultiplier: d = 0.01,
    dissolvePattern: n = "random",
    width: t,
    height: e,
    className: h,
    style: u
  }, v) => {
    const S = X(null), L = X(null);
    return gt(v, () => S.current), ao(S, L, {
      pixelSize: y,
      speed: o,
      direction: a,
      trigger: s,
      color: i,
      onComplete: l,
      progressMultiplier: d,
      dissolvePattern: n
    }), /* @__PURE__ */ Ae(
      "div",
      {
        className: h,
        style: { position: "relative", width: t ?? "100%", height: e ?? "100%", overflow: "hidden", ...u },
        children: [
          r && /* @__PURE__ */ it("div", { ref: L, style: { position: "absolute", inset: 0 }, children: r }),
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
io.displayName = "PixelDissolve";
const At = new Uint8Array(512), Wt = new Uint8Array(256);
for (let r = 0; r < 256; r++) Wt[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [Wt[r], Wt[y]] = [Wt[y], Wt[r]];
}
for (let r = 0; r < 512; r++) At[r] = Wt[r & 255];
function me(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function ne(r, y, o) {
  return r + o * (y - r);
}
function Vt(r, y, o) {
  const a = r & 3, s = a < 2 ? y : o, i = a < 2 ? o : y;
  return (a & 1 ? -s : s) + (a & 2 ? -i : i);
}
function ye(r, y) {
  const o = Math.floor(r) & 255, a = Math.floor(y) & 255, s = r - Math.floor(r), i = y - Math.floor(y), l = me(s), d = me(i), n = At[At[o] + a], t = At[At[o] + a + 1], e = At[At[o + 1] + a], h = At[At[o + 1] + a + 1];
  return ne(
    ne(Vt(n, s, i), Vt(e, s - 1, i), l),
    ne(Vt(t, s, i - 1), Vt(h, s - 1, i - 1), l),
    d
  );
}
function so(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(0), l = X(null);
  ft(() => {
    var d;
    (d = l.current) == null || d.call(l);
  }, [y.particleCount]), ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u() {
      const { colors: B } = o.current;
      return {
        x: Math.random() * e,
        y: Math.random() * h,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: B[Math.floor(Math.random() * B.length)]
      };
    }
    function v() {
      const { particleCount: B } = o.current;
      a.current = Array.from({ length: B }, u);
    }
    function S(B, F) {
      const A = r.current, c = window.devicePixelRatio || 1;
      A.width = Math.round(B * c), A.height = Math.round(F * c), A.style.width = `${B}px`, A.style.height = `${F}px`, t.scale(c, c), e = B, h = F, v();
    }
    l.current = () => {
      e > 0 && h > 0 && v();
    };
    const L = new ResizeObserver((B) => {
      const { width: F, height: A } = B[0].contentRect;
      F > 0 && A > 0 && S(F, A);
    });
    L.observe(n);
    const T = n.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k() {
      const { speed: B, noiseScale: F, fadeStrength: A, lineWidth: c, backgroundColor: g, timeSpeed: C, curl: P } = o.current;
      i.current += C * 1e-3;
      const m = i.current;
      g && g !== "transparent" ? (t.fillStyle = g, t.globalAlpha = A, t.fillRect(0, 0, e, h), t.globalAlpha = 1) : (t.fillStyle = `rgba(0,0,0,${A})`, t.fillRect(0, 0, e, h));
      const I = a.current;
      for (let x = 0; x < I.length; x++) {
        const R = I[x], E = R.x * F, b = R.y * F, w = ye(E + m, b + m * 0.7) * Math.PI * 4;
        let f = Math.cos(w), p = Math.sin(w);
        if (P) {
          const O = ye(E + 100 + m, b + m * 0.7);
          f += -Math.sin(O * Math.PI * 2) * 0.5, p += Math.cos(O * Math.PI * 2) * 0.5;
        }
        const M = R.x, q = R.y;
        R.vx = R.vx * 0.9 + f * B * 0.1, R.vy = R.vy * 0.9 + p * B * 0.1, R.x += R.vx, R.y += R.vy, R.age++;
        const D = Math.max(0, 1 - R.age / R.maxAge) * 0.7;
        t.beginPath(), t.moveTo(M, q), t.lineTo(R.x, R.y), t.strokeStyle = R.color, t.globalAlpha = D, t.lineWidth = c, t.stroke(), t.globalAlpha = 1, (R.age > R.maxAge || R.x < 0 || R.x > e || R.y < 0 || R.y > h) && (a.current[x] = u());
      }
      s.current = requestAnimationFrame(k);
    }
    return s.current = requestAnimationFrame(k), () => {
      L.disconnect(), cancelAnimationFrame(s.current);
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
}, lo = ht(
  (r, y) => {
    const {
      preset: o,
      particleCount: a,
      colors: s,
      speed: i,
      noiseScale: l,
      trailLength: d,
      fadeStrength: n,
      lineWidth: t,
      backgroundColor: e,
      animated: h,
      timeSpeed: u,
      curl: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && co[o] || {}, F = X(null);
    return gt(y, () => F.current), so(F, {
      particleCount: a ?? B.particleCount ?? 800,
      colors: s ?? B.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: i ?? B.speed ?? 1,
      noiseScale: l ?? B.noiseScale ?? 4e-3,
      trailLength: d ?? 0.04,
      fadeStrength: n ?? 0.04,
      lineWidth: t ?? 1,
      backgroundColor: e ?? B.backgroundColor ?? "#111111",
      animated: h ?? !0,
      timeSpeed: u ?? 1,
      curl: v ?? B.curl ?? !1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: { width: S ?? "100%", height: L ?? "100%", display: "block", overflow: "hidden", ...k },
        children: /* @__PURE__ */ it("canvas", { ref: F, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
lo.displayName = "FlowField";
function re(r, y) {
  const o = r.replace("#", "");
  return o.length === 3 ? `rgba(${parseInt(o[0] + o[0], 16)},${parseInt(o[1] + o[1], 16)},${parseInt(o[2] + o[2], 16)},${y})` : o.length === 6 ? `rgba(${parseInt(o.slice(0, 2), 16)},${parseInt(o.slice(2, 4), 16)},${parseInt(o.slice(4, 6), 16)},${y})` : r;
}
function uo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null), i = X({ x: -1, y: -1 });
  ft(() => {
    const l = r.current;
    if (!l) return;
    const d = l.parentElement;
    if (!d) return;
    const n = l.getContext("2d");
    let t = 0, e = 0;
    function h(k, B) {
      const F = r.current, A = window.devicePixelRatio || 1;
      F.width = Math.round(k * A), F.height = Math.round(B * A), F.style.width = `${k}px`, F.style.height = `${B}px`, n.scale(A, A), t = k, e = B;
    }
    const u = new ResizeObserver((k) => {
      const { width: B, height: F } = k[0].contentRect;
      B > 0 && F > 0 && h(B, F);
    });
    u.observe(d);
    const v = d.getBoundingClientRect();
    v.width > 0 && v.height > 0 && h(v.width, v.height);
    function S(k) {
      if (!o.current.interactive) return;
      const B = r.current.getBoundingClientRect();
      s.current = { x: k.clientX - B.left, y: k.clientY - B.top };
    }
    function L() {
      s.current = null;
    }
    d.addEventListener("mousemove", S), d.addEventListener("mouseleave", L);
    function T() {
      const {
        radius: k,
        color: B,
        overlayColor: F,
        overlayOpacity: A,
        edgeSoftness: c,
        followSpeed: g,
        glowColor: C,
        glowSize: P,
        showGlow: m,
        shape: I,
        ellipseRatio: x,
        defaultX: R,
        defaultY: E
      } = o.current, b = s.current ? s.current.x : t * R, w = s.current ? s.current.y : e * E;
      i.current.x < 0 ? i.current = { x: b, y: w } : (i.current.x += (b - i.current.x) * g, i.current.y += (w - i.current.y) * g);
      const f = i.current.x, p = i.current.y, M = k, q = I === "ellipse" ? k * x : k;
      if (n.clearRect(0, 0, t, e), n.fillStyle = F, n.globalAlpha = A, n.fillRect(0, 0, t, e), n.globalAlpha = 1, m) {
        n.save(), n.translate(f, p), n.scale(1, q / M);
        const z = n.createRadialGradient(0, 0, M * 0.8, 0, 0, M + P);
        z.addColorStop(0, re(C, 0.25)), z.addColorStop(1, re(C, 0)), n.fillStyle = z, n.beginPath(), n.arc(0, 0, M + P, 0, Math.PI * 2), n.fill(), n.restore();
      }
      n.globalCompositeOperation = "destination-out", n.save(), n.translate(f, p), n.scale(1, q / M);
      const D = M * (1 - c * 0.5), O = M + M * c, W = n.createRadialGradient(0, 0, D, 0, 0, O);
      if (W.addColorStop(0, "rgba(0,0,0,1)"), W.addColorStop(1, "rgba(0,0,0,0)"), n.fillStyle = W, n.beginPath(), n.arc(0, 0, O, 0, Math.PI * 2), n.fill(), n.restore(), n.globalCompositeOperation = "source-over", B && B !== "#ffffff") {
        n.save(), n.globalAlpha = 0.15;
        const z = n.createRadialGradient(f, p, 0, f, p, M);
        z.addColorStop(0, B), z.addColorStop(1, re(B, 0)), n.fillStyle = z, n.beginPath(), n.ellipse(f, p, M, q, 0, 0, Math.PI * 2), n.fill(), n.restore();
      }
      a.current = requestAnimationFrame(T);
    }
    return a.current = requestAnimationFrame(T), () => {
      u.disconnect(), cancelAnimationFrame(a.current), d.removeEventListener("mousemove", S), d.removeEventListener("mouseleave", L);
    };
  }, [r]);
}
const fo = {
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
}, ho = ht(
  (r, y) => {
    const {
      preset: o,
      radius: a,
      color: s,
      overlayColor: i,
      overlayOpacity: l,
      edgeSoftness: d,
      followSpeed: n,
      glowColor: t,
      glowSize: e,
      showGlow: h,
      shape: u,
      ellipseRatio: v,
      interactive: S,
      defaultX: L,
      defaultY: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && fo[o] || {}, g = X(null);
    return gt(y, () => g.current), uo(g, {
      radius: a ?? c.radius ?? 120,
      color: s ?? c.color ?? "#ffffff",
      overlayColor: i ?? c.overlayColor ?? "#000000",
      overlayOpacity: l ?? c.overlayOpacity ?? 0.75,
      edgeSoftness: d ?? c.edgeSoftness ?? 0.4,
      followSpeed: n ?? c.followSpeed ?? 0.1,
      glowColor: t ?? c.glowColor ?? "#6b7280",
      glowSize: e ?? c.glowSize ?? 30,
      showGlow: h ?? c.showGlow ?? !0,
      shape: u ?? c.shape ?? "circle",
      ellipseRatio: v ?? c.ellipseRatio ?? 0.6,
      interactive: S ?? !0,
      defaultX: L ?? 0.5,
      defaultY: T ?? 0.5
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: { width: k ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", position: "relative", ...A },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
ho.displayName = "Spotlight";
function go(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X({ w: 0, h: 0 }), l = (d, n) => {
    const { color: t, secondaryColor: e, ringCount: h, ringSpacing: u, speed: v, maxRadius: S, lineWidth: L } = o.current;
    for (let T = 0; T < h; T++) {
      const k = T % 2 === 1;
      a.current.push({
        x: d,
        y: n,
        radius: T * u,
        maxRadius: S + T * u * 0.5,
        opacity: 1,
        color: k ? e : t,
        lineWidth: L * (1 - T * 0.15),
        speed: v * (1 + T * 0.05)
      });
    }
  };
  return ft(() => {
    if (!y.autoFire) return;
    const d = setInterval(() => {
      const { w: n, h: t } = i.current;
      n === 0 || t === 0 || l(n * (0.3 + Math.random() * 0.4), t * (0.3 + Math.random() * 0.4));
    }, y.autoInterval);
    return () => clearInterval(d);
  }, [y.autoFire, y.autoInterval]), ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    function e(L, T) {
      const k = r.current, B = window.devicePixelRatio || 1;
      k.width = Math.round(L * B), k.height = Math.round(T * B), k.style.width = `${L}px`, k.style.height = `${T}px`, t.scale(B, B), i.current = { w: L, h: T };
    }
    const h = new ResizeObserver((L) => {
      const { width: T, height: k } = L[0].contentRect;
      T > 0 && k > 0 && e(T, k);
    });
    h.observe(n);
    const u = n.getBoundingClientRect();
    u.width > 0 && u.height > 0 && e(u.width, u.height);
    function v(L) {
      const T = r.current.getBoundingClientRect();
      l(L.clientX - T.left, L.clientY - T.top);
    }
    n.addEventListener("click", v);
    function S() {
      const { backgroundColor: L, glowEffect: T, glowBlur: k, fadeSpeed: B } = o.current, { w: F, h: A } = i.current;
      t.clearRect(0, 0, F, A), L && L !== "transparent" && (t.fillStyle = L, t.fillRect(0, 0, F, A));
      const c = [];
      for (const g of a.current)
        g.radius += g.speed, g.opacity -= B, !(g.opacity <= 0 || g.radius > g.maxRadius) && (c.push(g), t.beginPath(), t.arc(g.x, g.y, g.radius, 0, Math.PI * 2), t.strokeStyle = g.color, t.globalAlpha = g.opacity, t.lineWidth = g.lineWidth * g.opacity, T ? (t.shadowColor = g.color, t.shadowBlur = k) : t.shadowBlur = 0, t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0);
      a.current = c, s.current = requestAnimationFrame(S);
    }
    return s.current = requestAnimationFrame(S), () => {
      h.disconnect(), cancelAnimationFrame(s.current), n.removeEventListener("click", v);
    };
  }, [r]), { fire: l };
}
const po = {
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
}, mo = ht(
  (r, y) => {
    const {
      preset: o,
      color: a,
      secondaryColor: s,
      ringCount: i,
      ringSpacing: l,
      speed: d,
      maxRadius: n,
      lineWidth: t,
      fadeSpeed: e,
      autoFire: h,
      autoInterval: u,
      glowEffect: v,
      glowBlur: S,
      backgroundColor: L,
      width: T,
      height: k,
      className: B,
      style: F
    } = r, A = o && po[o] || {}, c = X(null);
    return gt(y, () => c.current), go(c, {
      color: a ?? A.color ?? "#ffffff",
      secondaryColor: s ?? A.secondaryColor ?? "#6b7280",
      ringCount: i ?? A.ringCount ?? 3,
      ringSpacing: l ?? A.ringSpacing ?? 20,
      speed: d ?? A.speed ?? 4,
      maxRadius: n ?? A.maxRadius ?? 200,
      lineWidth: t ?? A.lineWidth ?? 2,
      fadeSpeed: e ?? A.fadeSpeed ?? 0.02,
      autoFire: h ?? !0,
      autoInterval: u ?? 2e3,
      glowEffect: v ?? A.glowEffect ?? !0,
      glowBlur: S ?? A.glowBlur ?? 15,
      backgroundColor: L ?? A.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: { width: T ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
mo.displayName = "Shockwave";
const yo = 400;
function wo(r, y) {
  const o = r.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (o) return `rgba(${o[1]},${o[2]},${o[3]},${y})`;
  if (r.startsWith("#")) {
    const a = r.slice(1), s = a.length === 3 ? a.split("").map((n) => n + n).join("") : a, i = parseInt(s.slice(0, 2), 16), l = parseInt(s.slice(2, 4), 16), d = parseInt(s.slice(4, 6), 16);
    return `rgba(${i},${l},${d},${y})`;
  }
  return `rgba(0,0,0,${y})`;
}
function vo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X(null), d = X(/* @__PURE__ */ new Map()), n = (t) => {
    const { colors: e, shellSpeed: h } = o.current, u = r.current;
    if (!u) return;
    const v = u.clientWidth || u.width, S = u.clientHeight || u.height, L = t ?? v * 0.2 + Math.random() * v * 0.6;
    s.current.push({
      x: L,
      y: S,
      vx: (Math.random() - 0.5) * 2,
      vy: -(h + Math.random() * 3),
      targetY: S * 0.15 + Math.random() * S * 0.35,
      color: e[Math.floor(Math.random() * e.length)],
      exploded: !1
    });
  };
  return ft(() => {
    const t = r.current;
    if (!t) return;
    const e = t.parentElement;
    if (!e) return;
    const h = t.getContext("2d");
    let u = 0, v = 0;
    function S(c, g) {
      const C = r.current, P = window.devicePixelRatio || 1;
      C.width = Math.round(c * P), C.height = Math.round(g * P), C.style.width = `${c}px`, C.style.height = `${g}px`, h.scale(P, P), u = c, v = g;
    }
    const L = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && S(g, C);
    });
    L.observe(e);
    const T = e.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(c) {
      const g = r.current.getBoundingClientRect();
      n(c.clientX - g.left);
    }
    e.addEventListener("click", k);
    function B() {
      const { autoLaunch: c, autoInterval: g } = o.current;
      c && (l.current = setTimeout(() => {
        n(), B();
      }, g * (0.7 + Math.random() * 0.6)));
    }
    B();
    function F(c) {
      const { colors: g, particleCount: C, spread: P, particleSize: m } = o.current, I = yo - a.current.length;
      if (I <= 0) return;
      const x = Math.min(C, I);
      for (let R = 0; R < x; R++) {
        const E = Math.PI * 2 * R / x + (Math.random() - 0.5) * 0.5, b = P * (0.4 + Math.random() * 0.6), w = Math.random() < 0.15 ? g[Math.floor(Math.random() * g.length)] : c.color;
        a.current.push({
          x: c.x,
          y: c.y,
          vx: Math.cos(E) * b,
          vy: Math.sin(E) * b,
          alpha: 1,
          color: w,
          size: m * (0.5 + Math.random() * 0.8)
        });
      }
    }
    function A() {
      const { gravity: c, friction: g, fadeSpeed: C, glowEffect: P, glowBlur: m, backgroundColor: I, trailLength: x } = o.current;
      if (!I || I === "transparent")
        h.clearRect(0, 0, u, v);
      else {
        const f = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, x)));
        h.fillStyle = wo(I, f), h.fillRect(0, 0, u, v);
      }
      let E = 0;
      for (let f = 0; f < s.current.length; f++) {
        const p = s.current[f];
        if (p.x += p.vx, p.y += p.vy, p.vy += c * 0.3, p.y <= p.targetY && !p.exploded) {
          p.exploded = !0, F(p);
          continue;
        }
        p.exploded || (s.current[E++] = p, h.beginPath(), h.arc(p.x, p.y, 2, 0, Math.PI * 2), h.fillStyle = p.color, h.globalAlpha = 0.9, P && (h.shadowColor = p.color, h.shadowBlur = 6), h.fill(), h.shadowBlur = 0);
      }
      s.current.length = E;
      const b = d.current;
      b.forEach((f) => f.length = 0);
      let w = 0;
      for (let f = 0; f < a.current.length; f++) {
        const p = a.current[f];
        if (p.vx *= g, p.vy *= g, p.vy += c, p.x += p.vx, p.y += p.vy, p.alpha -= C, p.alpha <= 0) continue;
        a.current[w++] = p;
        let M = b.get(p.color);
        M || (M = [], b.set(p.color, M)), M.push(p);
      }
      a.current.length = w, P && (h.shadowBlur = m);
      for (const [f, p] of b)
        if (p.length !== 0) {
          h.fillStyle = f, P && (h.shadowColor = f);
          for (let M = 0; M < p.length; M++) {
            const q = p[M];
            h.globalAlpha = q.alpha, h.beginPath(), h.arc(q.x, q.y, Math.max(0.5, q.size * q.alpha), 0, Math.PI * 2), h.fill();
          }
        }
      h.globalAlpha = 1, h.shadowBlur = 0, i.current = requestAnimationFrame(A);
    }
    return i.current = requestAnimationFrame(A), () => {
      L.disconnect(), cancelAnimationFrame(i.current), e.removeEventListener("click", k), l.current && clearTimeout(l.current);
    };
  }, [r]), { launch: n };
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
}, Mo = ht(
  (r, y) => {
    const {
      preset: o,
      colors: a,
      particleCount: s,
      gravity: i,
      friction: l,
      fadeSpeed: d,
      particleSize: n,
      trailLength: t,
      spread: e,
      autoLaunch: h,
      autoInterval: u,
      glowEffect: v,
      glowBlur: S,
      backgroundColor: L,
      shellSpeed: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && bo[o] || {}, g = X(null);
    return gt(y, () => g.current), vo(g, {
      colors: a ?? c.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: s ?? c.particleCount ?? 80,
      gravity: i ?? c.gravity ?? 0.08,
      friction: l ?? c.friction ?? 0.97,
      fadeSpeed: d ?? c.fadeSpeed ?? 0.015,
      particleSize: n ?? c.particleSize ?? 2,
      trailLength: t ?? c.trailLength ?? 6,
      spread: e ?? c.spread ?? 5,
      autoLaunch: h ?? !0,
      autoInterval: u ?? 1800,
      glowEffect: v ?? c.glowEffect ?? !0,
      glowBlur: S ?? c.glowBlur ?? 8,
      backgroundColor: L ?? c.backgroundColor ?? "#111111",
      shellSpeed: T ?? c.shellSpeed ?? 12
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: { width: k ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", ...A },
        children: /* @__PURE__ */ it("canvas", { ref: g, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Mo.displayName = "Fireworks";
function Co(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0), i = X(0), l = X(!1), d = X(0), n = X(0), t = X(0), e = X(0);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const u = h.parentElement;
    if (!u) return;
    const v = h.getContext("2d");
    let S = 0, L = 0;
    function T(A, c) {
      const g = r.current, C = window.devicePixelRatio || 1;
      g.width = Math.round(A * C), g.height = Math.round(c * C), g.style.width = `${A}px`, g.style.height = `${c}px`, v.scale(C, C), S = A, L = c;
    }
    const k = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && T(c, g);
    });
    k.observe(u);
    const B = u.getBoundingClientRect();
    B.width > 0 && B.height > 0 && T(B.width, B.height);
    function F() {
      const {
        animated: A,
        intensity: c,
        speed: g,
        rgbShift: C,
        scanlines: P,
        scanlineOpacity: m,
        scanlineSpacing: I,
        blockGlitch: x,
        blockCount: R,
        noiseOpacity: E,
        flickerRate: b,
        color: w,
        rgbShiftColor: f,
        backgroundColor: p
      } = o.current, M = yt(f), [q, D, O] = M.split(",").map(Number), W = `${255 - q},${255 - D},${255 - O}`;
      if (v.clearRect(0, 0, S, L), p && p !== "transparent" && (v.fillStyle = p, v.fillRect(0, 0, S, L)), P) {
        for (let N = 0; N < L; N += I) {
          const U = m * (N % (I * 2) === 0 ? 1.2 : 0.7);
          v.fillStyle = "rgba(0,0,0,1)", v.globalAlpha = Math.min(1, U), v.fillRect(0, N, S, 1);
        }
        v.globalAlpha = 1;
      }
      if (!A) {
        a.current = requestAnimationFrame(F);
        return;
      }
      const z = 16;
      s.current += g * 0.016, e.current += g * 0.02, i.current -= z, i.current <= 0 && (l.current ? (l.current = !1, i.current = (800 + Math.random() * 2e3) / g) : (l.current = Math.random() < c, d.current = 80 + Math.random() * 300, i.current = d.current)), n.current -= z, n.current <= 0 && (n.current = 100 + Math.random() * 300 / g);
      const $ = n.current < 40 && Math.random() < c * 0.4, Y = l.current || $;
      if (t.current > 0 ? (t.current -= z, v.globalCompositeOperation = "difference", v.fillStyle = "rgba(255,255,255,1)", v.globalAlpha = Math.min(1, t.current / 30), v.fillRect(0, 0, S, L), v.globalCompositeOperation = "source-over", v.globalAlpha = 1) : Y && Math.random() < 5e-3 * c && (t.current = 30 + Math.random() * 60), Math.random() < b * (Y ? 4 : 1)) {
        const N = Y ? 0.08 : 0.02;
        v.fillStyle = `rgba(255,255,255,${N})`, v.fillRect(0, 0, S, L);
      }
      if (Y && Math.random() < 0.03 * c && (v.fillStyle = "rgba(0,0,0,0.4)", v.fillRect(0, 0, S, L)), E > 0) {
        const N = v.createImageData(S, L), U = Y ? 1.8 : 1;
        for (let j = 0; j < N.data.length; j += 4) {
          const _ = Math.random() * 255 | 0;
          N.data[j] = _, N.data[j + 1] = _, N.data[j + 2] = _, N.data[j + 3] = Math.random() < E * U ? 60 : 0;
        }
        v.putImageData(N, 0, 0);
      }
      if (Y) {
        const N = l.current ? 1 - i.current / d.current : 0.4;
        if (C > 0) {
          const J = C * c * N * (0.5 + Math.random() * 1.5), V = Math.sin(e.current * 3) * J * 0.3;
          v.globalCompositeOperation = "screen", v.fillStyle = `rgba(${M},0.06)`, v.globalAlpha = 0.5 + N * 0.4, v.fillRect(J + V, 0, S, L), v.fillStyle = `rgba(${W},0.06)`, v.fillRect(-(J + V), 0, S, L);
          const Q = Math.random() * L, nt = 5 + Math.random() * 40, K = J * (1 + Math.random() * 3);
          v.fillStyle = `rgba(${M},0.12)`, v.globalAlpha = 0.7, v.fillRect(K, Q, S, nt), v.fillStyle = `rgba(${W},0.12)`, v.fillRect(-K, Q + 1, S, nt), v.globalCompositeOperation = "source-over", v.globalAlpha = 1;
        }
        if (x) {
          const J = Math.ceil(R * N * (1 + Math.random() * 2));
          for (let V = 0; V < J; V++) {
            const Q = Math.random() * L, nt = 1 + Math.random() * (Y ? 30 : 12), K = Math.max(C * 2, 20) * c * N, et = (Math.random() - 0.5) * K * 2;
            try {
              const tt = v.getImageData(0, Q, S, nt);
              v.putImageData(tt, et, Q);
            } catch {
            }
          }
        }
        const U = Math.floor(Math.random() * 4 * N);
        for (let J = 0; J < U; J++) {
          const V = Math.random() * L, Q = 1 + Math.random() * 3, nt = Math.random() < 0.5 ? "0,255,0" : "255,140,0";
          v.fillStyle = `rgba(${nt},0.15)`, v.globalAlpha = 0.4 + Math.random() * 0.4, v.fillRect(0, V, S, Q);
        }
        if (v.globalAlpha = 1, Math.random() < 0.15 * c * N) {
          const J = Math.random() * S, V = 1 + Math.random() * 4, Q = (Math.random() - 0.5) * 20 * c;
          try {
            const nt = v.getImageData(J, 0, V, L);
            v.putImageData(nt, J, Q);
          } catch {
          }
        }
        const j = Math.floor(Math.random() * L), _ = 1 + Math.random() * 3;
        if (v.fillStyle = w, v.globalAlpha = 0.2 * c * N, v.fillRect(0, j, S, _), v.globalAlpha = 1, Math.random() < 0.04 * c) {
          const J = Math.random() * S * 0.7, V = Math.random() * L, Q = 20 + Math.random() * S * 0.3, nt = 2 + Math.random() * 20, K = v.createImageData(Q, nt);
          for (let et = 0; et < K.data.length; et += 4)
            K.data[et] = Math.random() * 255 | 0, K.data[et + 1] = Math.random() * 255 | 0, K.data[et + 2] = Math.random() * 255 | 0, K.data[et + 3] = 180;
          v.putImageData(K, J, V);
        }
      }
      const H = Math.max(S, L) * (Y ? 0.65 : 0.75), G = v.createRadialGradient(S / 2, L / 2, L * 0.3, S / 2, L / 2, H);
      G.addColorStop(0, "rgba(0,0,0,0)"), G.addColorStop(1, `rgba(0,0,0,${Y ? 0.5 : 0.35})`), v.fillStyle = G, v.fillRect(0, 0, S, L), a.current = requestAnimationFrame(F);
    }
    return a.current = requestAnimationFrame(F), () => {
      k.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const xo = {
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
}, Ro = ht(
  (r, y) => {
    const {
      preset: o,
      intensity: a,
      speed: s,
      rgbShift: i,
      scanlines: l,
      scanlineOpacity: d,
      scanlineSpacing: n,
      blockGlitch: t,
      blockCount: e,
      noiseOpacity: h,
      flickerRate: u,
      color: v,
      rgbShiftColor: S,
      animated: L,
      backgroundColor: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && xo[o] || {}, g = X(null);
    return gt(y, () => g.current), Co(g, {
      intensity: a ?? c.intensity ?? 0.6,
      speed: s ?? c.speed ?? 1,
      rgbShift: i ?? c.rgbShift ?? 8,
      scanlines: l ?? c.scanlines ?? !0,
      scanlineOpacity: d ?? c.scanlineOpacity ?? 0.08,
      scanlineSpacing: n ?? c.scanlineSpacing ?? 2,
      blockGlitch: t ?? c.blockGlitch ?? !0,
      blockCount: e ?? c.blockCount ?? 4,
      noiseOpacity: h ?? c.noiseOpacity ?? 0.02,
      flickerRate: u ?? c.flickerRate ?? 0.02,
      color: v ?? c.color ?? "#ffffff",
      rgbShiftColor: S ?? c.rgbShiftColor ?? "#ff0000",
      animated: L ?? !0,
      backgroundColor: T ?? c.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: { width: k ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", position: "relative", ...A },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
Ro.displayName = "GlitchOverlay";
function So(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0), i = (l) => {
    const d = Array.isArray(l) ? l : [l], { series: n, maxPoints: t } = o.current;
    d.forEach((e, h) => {
      n[h] && (n[h].data.push(e), n[h].data.length > t && n[h].data.shift());
    });
  };
  return ft(() => {
    const l = r.current;
    if (!l) return;
    const d = l.parentElement;
    if (!d) return;
    const n = l.getContext("2d");
    let t = 0, e = 0;
    function h(L, T) {
      const k = r.current, B = window.devicePixelRatio || 1;
      k.width = Math.round(L * B), k.height = Math.round(T * B), k.style.width = `${L}px`, k.style.height = `${T}px`, n.scale(B, B), t = L, e = T;
    }
    const u = new ResizeObserver((L) => {
      const { width: T, height: k } = L[0].contentRect;
      T > 0 && k > 0 && h(T, k);
    });
    u.observe(d);
    const v = d.getBoundingClientRect();
    v.width > 0 && v.height > 0 && h(v.width, v.height);
    function S() {
      const {
        series: L,
        lineWidth: T,
        showGrid: k,
        gridColor: B,
        gridOpacity: F,
        showDots: A,
        dotRadius: c,
        fillOpacity: g,
        backgroundColor: C,
        padding: P,
        yMin: m,
        yMax: I,
        smooth: x,
        glowEffect: R,
        glowBlur: E
      } = o.current;
      s.current += 0.06, n.clearRect(0, 0, t, e), C && C !== "transparent" && (n.fillStyle = C, n.fillRect(0, 0, t, e));
      const b = 36, w = P, f = w + b, p = t - f - w, M = e - w * 2 - 20, q = w;
      let D = m ?? 1 / 0, O = I ?? -1 / 0;
      if (m === void 0 || I === void 0) {
        for (const H of L)
          for (const G of H.data)
            m === void 0 && G < D && (D = G), I === void 0 && G > O && (O = G);
        D === 1 / 0 && (D = 0), O === -1 / 0 && (O = 1), D === O && (D -= 1, O += 1);
        const Y = O - D;
        D -= Y * 0.1, O += Y * 0.1;
      }
      const W = O - D || 1, z = (Y, H) => f + Y / Math.max(H - 1, 1) * p, $ = (Y) => q + M - (Y - D) / W * M;
      if (k) {
        n.setLineDash([3, 5]), n.lineWidth = 1;
        for (let H = 0; H <= 5; H++) {
          const G = q + H / 5 * M, N = O - H / 5 * W;
          n.strokeStyle = B, n.globalAlpha = F, n.beginPath(), n.moveTo(f, G), n.lineTo(f + p, G), n.stroke(), n.globalAlpha = 0.6, n.fillStyle = B, n.font = "10px system-ui, sans-serif", n.textAlign = "right", n.textBaseline = "middle";
          const U = Math.abs(N) >= 1e3 ? (N / 1e3).toFixed(1) + "k" : N.toFixed(Math.abs(N) < 10 ? 1 : 0);
          n.fillText(U, f - 4, G);
        }
        n.setLineDash([]), n.globalAlpha = 1, n.strokeStyle = B, n.globalAlpha = F * 1.5, n.lineWidth = 1, n.beginPath(), n.moveTo(f, q), n.lineTo(f, q + M), n.lineTo(f + p, q + M), n.stroke(), n.globalAlpha = 1;
      }
      for (const Y of L) {
        if (Y.data.length < 2) continue;
        const H = Y.data.length;
        if (n.beginPath(), x) {
          n.moveTo(z(0, H), $(Y.data[0]));
          for (let j = 1; j < H - 1; j++) {
            const _ = (z(j - 1, H) + z(j, H)) / 2, J = ($(Y.data[j - 1]) + $(Y.data[j])) / 2;
            n.quadraticCurveTo(z(j - 1, H), $(Y.data[j - 1]), _, J);
          }
          n.lineTo(z(H - 1, H), $(Y.data[H - 1]));
        } else {
          n.moveTo(z(0, H), $(Y.data[0]));
          for (let j = 1; j < H; j++) n.lineTo(z(j, H), $(Y.data[j]));
        }
        if (R && (n.shadowColor = Y.color, n.shadowBlur = E), n.strokeStyle = Y.color, n.lineWidth = T, n.lineJoin = "round", n.lineCap = "round", n.stroke(), n.shadowBlur = 0, Y.filled !== !1) {
          const j = new Path2D();
          if (x) {
            j.moveTo(z(0, H), $(Y.data[0]));
            for (let J = 1; J < H - 1; J++) {
              const V = (z(J - 1, H) + z(J, H)) / 2, Q = ($(Y.data[J - 1]) + $(Y.data[J])) / 2;
              j.quadraticCurveTo(z(J - 1, H), $(Y.data[J - 1]), V, Q);
            }
            j.lineTo(z(H - 1, H), $(Y.data[H - 1]));
          } else {
            j.moveTo(z(0, H), $(Y.data[0]));
            for (let J = 1; J < H; J++) j.lineTo(z(J, H), $(Y.data[J]));
          }
          j.lineTo(z(H - 1, H), q + M), j.lineTo(z(0, H), q + M), j.closePath(), n.save(), n.beginPath(), n.rect(f, q, p, M), n.clip();
          const _ = n.createLinearGradient(0, q, 0, q + M);
          _.addColorStop(0, Y.color + "88"), _.addColorStop(0.5, Y.color + "33"), _.addColorStop(1, Y.color + "00"), n.fillStyle = _, n.globalAlpha = g, n.fill(j), n.globalAlpha = 1, n.restore();
        }
        if (A && H > 1) {
          for (let j = 0; j < H - 1; j++)
            n.beginPath(), n.arc(z(j, H), $(Y.data[j]), c * 0.6, 0, Math.PI * 2), n.fillStyle = Y.color, n.globalAlpha = 0.4, n.fill();
          n.globalAlpha = 1;
        }
        const G = z(H - 1, H), N = $(Y.data[H - 1]), U = Math.sin(s.current) * 0.5 + 0.5;
        R && (n.shadowColor = Y.color, n.shadowBlur = E * 0.8), n.beginPath(), n.arc(G, N, c * (1.5 + U * 1.5), 0, Math.PI * 2), n.strokeStyle = Y.color, n.lineWidth = 1, n.globalAlpha = 0.6 * (1 - U), n.stroke(), n.shadowBlur = 0, n.globalAlpha = 1, n.beginPath(), n.arc(G, N, c, 0, Math.PI * 2), n.fillStyle = "#ffffff", n.globalAlpha = 0.9, n.fill(), n.beginPath(), n.arc(G, N, c * 0.6, 0, Math.PI * 2), n.fillStyle = Y.color, n.globalAlpha = 1, n.fill(), Y.label && (n.font = "bold 11px system-ui, sans-serif", n.fillStyle = Y.color, n.textAlign = "left", n.textBaseline = "bottom", n.globalAlpha = 0.85, n.fillText(Y.label, G + c + 3, N - 2), n.globalAlpha = 1);
      }
      a.current = requestAnimationFrame(S);
    }
    return a.current = requestAnimationFrame(S), () => {
      u.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]), { push: i };
}
const ko = {
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
}, Eo = ht(
  (r, y) => {
    const {
      preset: o,
      series: a,
      maxPoints: s,
      animated: i,
      lineWidth: l,
      showGrid: d,
      gridColor: n,
      gridOpacity: t,
      showDots: e,
      dotRadius: h,
      fillOpacity: u,
      backgroundColor: v,
      padding: S,
      yMin: L,
      yMax: T,
      smooth: k,
      glowEffect: B,
      glowBlur: F,
      scrollSpeed: A,
      width: c,
      height: g,
      className: C,
      style: P
    } = r, m = o && ko[o] || {}, I = [
      { data: Array.from({ length: 30 }, (R, E) => Math.sin(E * 0.3) * 50 + 50), color: "#ffffff", filled: !0 },
      { data: Array.from({ length: 30 }, (R, E) => Math.cos(E * 0.4) * 30 + 50), color: "#6b7280", filled: !0 }
    ], x = X(null);
    return gt(y, () => x.current), So(x, {
      series: a ?? I,
      maxPoints: s ?? 100,
      animated: i ?? !0,
      lineWidth: l ?? m.lineWidth ?? 2,
      showGrid: d ?? m.showGrid ?? !0,
      gridColor: n ?? m.gridColor ?? "#ffffff",
      gridOpacity: t ?? m.gridOpacity ?? 0.08,
      showDots: e ?? m.showDots ?? !1,
      dotRadius: h ?? 3,
      fillOpacity: u ?? m.fillOpacity ?? 1,
      backgroundColor: v ?? m.backgroundColor ?? "#111111",
      padding: S ?? 20,
      yMin: L,
      yMax: T,
      smooth: k ?? m.smooth ?? !0,
      glowEffect: B ?? m.glowEffect ?? !0,
      glowBlur: F ?? m.glowBlur ?? 8,
      scrollSpeed: A ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: C,
        style: { width: c ?? "100%", height: g ?? "100%", display: "block", overflow: "hidden", ...P },
        children: /* @__PURE__ */ it("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Eo.displayName = "LiveChart";
function Po(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0);
  ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const d = i.getContext("2d");
    let n = 0, t = 0;
    function e(L, T) {
      const k = r.current, B = window.devicePixelRatio || 1;
      k.width = Math.round(L * B), k.height = Math.round(T * B), k.style.width = `${L}px`, k.style.height = `${T}px`, d.scale(B, B), n = L, t = T;
    }
    const h = new ResizeObserver((L) => {
      const { width: T, height: k } = L[0].contentRect;
      T > 0 && k > 0 && e(T, k);
    });
    h.observe(l);
    const u = l.getBoundingClientRect();
    u.width > 0 && u.height > 0 && e(u.width, u.height);
    function v(L, T, k, B, F, A, c, g, C, P, m, I, x) {
      const R = 6 + B * 2, E = B / 8 * Math.PI * 2, b = F * (1 + B * 0.15);
      for (let w = 0; w < c; w++) {
        const f = w / c * Math.PI * 2;
        for (let p = 0; p < (g ? 2 : 1); p++) {
          d.save(), d.translate(L, T), d.rotate(f + (p === 1 ? Math.PI / c : 0)), p === 1 && d.scale(1, -1), d.beginPath();
          for (let M = 0; M <= R * 3; M++) {
            const q = M / (R * 3) * Math.PI * 2, D = x * Math.sin(q * 3 + b + E), O = k * (0.5 + 0.5 * Math.abs(Math.sin(q * (R / 2) + b * 0.5))), W = (O + D * k * 0.15) * Math.cos(q), z = (O + D * k * 0.1) * Math.sin(q);
            M === 0 ? d.moveTo(W, z) : d.lineTo(W, z);
          }
          d.closePath(), P && (d.shadowColor = A, d.shadowBlur = m), d.strokeStyle = A, d.lineWidth = C * (1 - B * 0.08), d.globalAlpha = I * (1 - B * 0.1), d.stroke(), d.shadowBlur = 0, d.globalAlpha = 1, d.restore();
        }
      }
    }
    function S() {
      const {
        symmetry: L,
        colors: T,
        lineWidth: k,
        speed: B,
        layers: F,
        radius: A,
        backgroundColor: c,
        animated: g,
        glowEffect: C,
        glowBlur: P,
        strokeOpacity: m,
        mirror: I,
        noiseAmount: x
      } = o.current;
      g && (s.current += B * 5e-3);
      const R = s.current;
      d.clearRect(0, 0, n, t), c && c !== "transparent" && (d.fillStyle = c, d.fillRect(0, 0, n, t));
      const E = n / 2, b = t / 2, w = Math.min(n, t) * 0.45 * A;
      for (let f = 0; f < F; f++) {
        const p = w * (1 - f * (0.85 / F)), M = T[f % T.length];
        v(E, b, p, f, R + f * 0.3, M, L, I, k, C, P, m, x);
      }
      a.current = requestAnimationFrame(S);
    }
    return a.current = requestAnimationFrame(S), () => {
      h.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const Ao = {
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
}, Bo = ht(
  (r, y) => {
    const {
      preset: o,
      symmetry: a,
      colors: s,
      lineWidth: i,
      speed: l,
      layers: d,
      radius: n,
      backgroundColor: t,
      animated: e,
      glowEffect: h,
      glowBlur: u,
      strokeOpacity: v,
      mirror: S,
      noiseAmount: L,
      width: T,
      height: k,
      className: B,
      style: F
    } = r, A = o && Ao[o] || {}, c = X(null);
    return gt(y, () => c.current), Po(c, {
      symmetry: a ?? A.symmetry ?? 8,
      colors: s ?? A.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: i ?? A.lineWidth ?? 1.5,
      speed: l ?? A.speed ?? 1,
      layers: d ?? A.layers ?? 5,
      radius: n ?? 1,
      backgroundColor: t ?? A.backgroundColor ?? "#111111",
      animated: e ?? !0,
      glowEffect: h ?? A.glowEffect ?? !0,
      glowBlur: u ?? A.glowBlur ?? 10,
      strokeOpacity: v ?? A.strokeOpacity ?? 0.8,
      mirror: S ?? A.mirror ?? !0,
      noiseAmount: L ?? A.noiseAmount ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: { width: T ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Bo.displayName = "Mandala";
function Fo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(null), i = X(0), l = X(0);
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u() {
      const { count: c, radius: g } = o.current;
      a.current = Array.from({ length: c }, () => {
        const C = e * 0.2 + Math.random() * e * 0.6, P = h * 0.2 + Math.random() * h * 0.6;
        return {
          x: C,
          y: P,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: g * (0.7 + Math.random() * 0.6),
          baseX: C,
          baseY: P
        };
      });
    }
    function v(c, g) {
      const C = r.current, P = window.devicePixelRatio || 1;
      C.width = Math.round(c * P), C.height = Math.round(g * P), C.style.width = `${c}px`, C.style.height = `${g}px`, t.scale(P, P), e = c, h = g, u();
    }
    const S = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && v(g, C);
    });
    S.observe(n);
    const L = n.getBoundingClientRect();
    L.width > 0 && L.height > 0 && v(L.width, L.height);
    function T(c) {
      const g = r.current.getBoundingClientRect();
      s.current = { x: c.clientX - g.left, y: c.clientY - g.top };
    }
    function k() {
      s.current = null;
    }
    n.addEventListener("mousemove", T), n.addEventListener("mouseleave", k);
    function B(c) {
      const g = c.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return g ? { r: parseInt(g[1], 16), g: parseInt(g[2], 16), b: parseInt(g[3], 16) } : null;
    }
    function F(c, g, C, P) {
      const m = a.current;
      if (m.length) {
        t.globalCompositeOperation = "source-over";
        for (let I = 0; I < m.length; I++) {
          const x = m[I], R = c[I % c.length], E = x.radius * g, b = B(R);
          C && (t.shadowColor = R, t.shadowBlur = P), t.globalCompositeOperation = "screen";
          const w = t.createRadialGradient(x.x, x.y, E * 0.5, x.x, x.y, E * 1.4);
          w.addColorStop(0, b ? `rgba(${b.r},${b.g},${b.b},0.18)` : R + "30"), w.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = w, t.beginPath(), t.arc(x.x, x.y, E * 1.4, 0, Math.PI * 2), t.fill();
          const f = t.createRadialGradient(
            x.x - E * 0.25,
            x.y - E * 0.25,
            0,
            // offset center for 3D feel
            x.x,
            x.y,
            E
          );
          f.addColorStop(0, b ? `rgba(${Math.min(255, b.r + 80)},${Math.min(255, b.g + 80)},${Math.min(255, b.b + 80)},0.95)` : R), f.addColorStop(0.35, b ? `rgba(${b.r},${b.g},${b.b},0.85)` : R + "d9"), f.addColorStop(0.7, b ? `rgba(${Math.max(0, b.r - 40)},${Math.max(0, b.g - 40)},${Math.max(0, b.b - 40)},0.6)` : R + "99"), f.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = f, t.beginPath(), t.arc(x.x, x.y, E, 0, Math.PI * 2), t.fill();
          const p = x.x - E * 0.28, M = x.y - E * 0.28, q = E * 0.35, D = t.createRadialGradient(p, M, 0, p, M, q);
          D.addColorStop(0, "rgba(255,255,255,0.45)"), D.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = D, t.beginPath(), t.arc(p, M, q, 0, Math.PI * 2), t.fill(), t.shadowBlur = 0;
        }
        t.globalCompositeOperation = "source-over";
      }
    }
    function A() {
      const {
        speed: c,
        magnetStrength: g,
        magnetRadius: C,
        threshold: P,
        colors: m,
        glowEffect: I,
        glowBlur: x,
        backgroundColor: R,
        animated: E,
        followMouse: b,
        wanderStrength: w
      } = o.current;
      E && (l.current += 0.016);
      const f = l.current;
      t.clearRect(0, 0, e, h), R && R !== "transparent" && (t.fillStyle = R, t.fillRect(0, 0, e, h));
      const p = a.current, M = s.current;
      for (let q = 0; q < p.length; q++) {
        const D = p[q], O = Math.sin(f * c * 0.5 + q * 1.3) * Math.PI * 2;
        if (D.vx += Math.cos(O) * w * 0.05, D.vy += Math.sin(O) * w * 0.05, M && b) {
          const W = M.x - D.x, z = M.y - D.y, $ = Math.sqrt(W * W + z * z) || 1;
          if ($ < C) {
            const Y = (1 - $ / C) * g;
            D.vx += W / $ * Y, D.vy += z / $ * Y;
          }
        }
        for (let W = q + 1; W < p.length; W++) {
          const z = p[W], $ = z.x - D.x, Y = z.y - D.y, H = Math.sqrt($ * $ + Y * Y) || 1, G = (D.radius + z.radius) * 0.8;
          if (H < G * 2) {
            const N = 2e-3 * (1 - H / (G * 2));
            D.vx += $ / H * N, D.vy += Y / H * N, z.vx -= $ / H * N, z.vy -= Y / H * N;
          }
        }
        D.vx *= 0.92, D.vy *= 0.92, D.vx = Math.max(-4, Math.min(4, D.vx)), D.vy = Math.max(-4, Math.min(4, D.vy)), D.x += D.vx, D.y += D.vy, D.x < D.radius && (D.x = D.radius, D.vx *= -0.5), D.x > e - D.radius && (D.x = e - D.radius, D.vx *= -0.5), D.y < D.radius && (D.y = D.radius, D.vy *= -0.5), D.y > h - D.radius && (D.y = h - D.radius, D.vy *= -0.5);
      }
      F(m, P, I, x), i.current = requestAnimationFrame(A);
    }
    return i.current = requestAnimationFrame(A), () => {
      S.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousemove", T), n.removeEventListener("mouseleave", k);
    };
  }, [r]);
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
}, $o = ht(
  (r, y) => {
    const {
      preset: o,
      count: a,
      colors: s,
      radius: i,
      speed: l,
      magnetStrength: d,
      magnetRadius: n,
      threshold: t,
      glowEffect: e,
      glowBlur: h,
      backgroundColor: u,
      animated: v,
      followMouse: S,
      wanderStrength: L,
      width: T,
      height: k,
      className: B,
      style: F
    } = r, A = o && Io[o] || {}, c = X(null);
    return gt(y, () => c.current), Fo(c, {
      count: a ?? A.count ?? 5,
      colors: s ?? A.colors ?? ["#ffffff", "#6b7280"],
      radius: i ?? A.radius ?? 80,
      speed: l ?? A.speed ?? 1,
      magnetStrength: d ?? A.magnetStrength ?? 0.08,
      magnetRadius: n ?? A.magnetRadius ?? 150,
      threshold: t ?? A.threshold ?? 1.8,
      glowEffect: e ?? A.glowEffect ?? !0,
      glowBlur: h ?? A.glowBlur ?? 20,
      backgroundColor: u ?? A.backgroundColor ?? "#111111",
      animated: v ?? A.animated ?? !0,
      followMouse: S ?? A.followMouse ?? !0,
      wanderStrength: L ?? A.wanderStrength ?? 0.4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: { width: T ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", ...F },
        children: /* @__PURE__ */ it("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
$o.displayName = "MagneticBlob";
function To(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X(null), d = X(!1), n = X(0), t = X(null);
  ft(() => {
    var e;
    (e = t.current) == null || e.call(t);
  }, [y.cols, y.rows]), ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const u = e.getContext("2d");
    let v = 0, S = 0;
    function L(P, m) {
      const { cols: I, rows: x, spacing: R } = o.current, E = (P - (I - 1) * R) / 2, b = m * 0.08, w = [], f = [];
      for (let p = 0; p < x; p++)
        for (let M = 0; M < I; M++) {
          const q = E + M * R, D = b + p * R;
          w.push({
            x: q,
            y: D,
            px: q,
            py: D,
            pinned: p === 0 && (M % Math.ceil(I / 5) === 0 || M === I - 1)
          });
          const O = p * I + M;
          M > 0 && f.push({ a: O - 1, b: O, length: R }), p > 0 && f.push({ a: O - I, b: O, length: R });
        }
      a.current = w, s.current = f;
    }
    function T(P, m) {
      const I = r.current, x = window.devicePixelRatio || 1;
      I.width = Math.round(P * x), I.height = Math.round(m * x), I.style.width = `${P}px`, I.style.height = `${m}px`, u.scale(x, x), v = P, S = m, L(v, S);
    }
    t.current = () => {
      v > 0 && S > 0 && L(v, S);
    };
    const k = new ResizeObserver((P) => {
      const { width: m, height: I } = P[0].contentRect;
      m > 0 && I > 0 && T(m, I);
    });
    k.observe(h);
    const B = h.getBoundingClientRect();
    B.width > 0 && B.height > 0 && T(B.width, B.height);
    function F(P) {
      const m = r.current.getBoundingClientRect();
      l.current = { x: P.clientX - m.left, y: P.clientY - m.top };
    }
    function A() {
      d.current = !0;
    }
    function c() {
      d.current = !1;
    }
    function g() {
      l.current = null, d.current = !1;
    }
    h.addEventListener("mousemove", F), h.addEventListener("mousedown", A), h.addEventListener("mouseup", c), h.addEventListener("mouseleave", g);
    function C() {
      const {
        gravity: P,
        friction: m,
        stiffness: I,
        iterations: x,
        lineColor: R,
        pinColor: E,
        lineWidth: b,
        backgroundColor: w,
        wind: f,
        windSpeed: p,
        tearable: M,
        tearDistance: q,
        interactive: D,
        mouseRadius: O,
        mouseForce: W,
        showPins: z
      } = o.current;
      n.current += 0.016;
      const $ = n.current;
      u.clearRect(0, 0, v, S), w && w !== "transparent" && (u.fillStyle = w, u.fillRect(0, 0, v, S));
      const Y = a.current, H = l.current, G = f * Math.sin($ * p) * 0.1;
      for (const N of Y) {
        if (N.pinned) continue;
        const U = (N.x - N.px) * m, j = (N.y - N.py) * m;
        if (N.px = N.x, N.py = N.y, N.x += U + G, N.y += j + P, H && D) {
          const _ = N.x - H.x, J = N.y - H.y, V = Math.sqrt(_ * _ + J * J) || 1;
          if (V < O) {
            const Q = (1 - V / O) * W;
            if (d.current)
              if (M)
                for (let nt = s.current.length - 1; nt >= 0; nt--) {
                  const K = s.current[nt], et = Y[K.a], tt = Y[K.b];
                  (Math.sqrt((et.x - H.x) ** 2 + (et.y - H.y) ** 2) < O * 0.5 || Math.sqrt((tt.x - H.x) ** 2 + (tt.y - H.y) ** 2) < O * 0.5) && s.current.splice(nt, 1);
                }
              else
                N.x += _ / V * Q * 2, N.y += J / V * Q * 2;
            else
              N.x += _ / V * Q, N.y += J / V * Q;
          }
        }
        N.y > S && (N.y = S, N.py = N.y + j * 0.3), N.x < 0 && (N.x = 0, N.px = N.x - U * 0.3), N.x > v && (N.x = v, N.px = N.x - U * 0.3);
      }
      for (let N = 0; N < x; N++)
        for (let U = s.current.length - 1; U >= 0; U--) {
          const j = s.current[U], _ = Y[j.a], J = Y[j.b], V = J.x - _.x, Q = J.y - _.y, nt = Math.sqrt(V * V + Q * Q) || 1e-3;
          if (M && nt > q * j.length) {
            s.current.splice(U, 1);
            continue;
          }
          const K = (nt - j.length) / nt * I * 0.5, et = V * K, tt = Q * K;
          _.pinned || (_.x += et, _.y += tt), J.pinned || (J.x -= et, J.y -= tt);
        }
      u.strokeStyle = R, u.lineWidth = b, u.beginPath();
      for (const N of s.current) {
        const U = Y[N.a], j = Y[N.b];
        u.moveTo(U.x, U.y), u.lineTo(j.x, j.y);
      }
      if (u.stroke(), z) {
        u.fillStyle = E;
        for (const N of Y)
          N.pinned && (u.beginPath(), u.arc(N.x, N.y, 4, 0, Math.PI * 2), u.fill());
      }
      i.current = requestAnimationFrame(C);
    }
    return i.current = requestAnimationFrame(C), () => {
      k.disconnect(), cancelAnimationFrame(i.current), h.removeEventListener("mousemove", F), h.removeEventListener("mousedown", A), h.removeEventListener("mouseup", c), h.removeEventListener("mouseleave", g);
    };
  }, [r]);
}
const Lo = {
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
}, zo = ht(
  (r, y) => {
    const {
      preset: o,
      cols: a,
      rows: s,
      spacing: i,
      gravity: l,
      friction: d,
      stiffness: n,
      iterations: t,
      lineColor: e,
      pinColor: h,
      lineWidth: u,
      backgroundColor: v,
      wind: S,
      windSpeed: L,
      tearable: T,
      tearDistance: k,
      interactive: B,
      mouseRadius: F,
      mouseForce: A,
      showPins: c,
      width: g,
      height: C,
      className: P,
      style: m
    } = r, I = o && Lo[o] || {}, x = X(null);
    return gt(y, () => x.current), To(x, {
      cols: a ?? I.cols ?? 25,
      rows: s ?? I.rows ?? 20,
      spacing: i ?? I.spacing ?? 18,
      gravity: l ?? I.gravity ?? 0.4,
      friction: d ?? I.friction ?? 0.99,
      stiffness: n ?? I.stiffness ?? 1,
      iterations: t ?? I.iterations ?? 3,
      lineColor: e ?? I.lineColor ?? "#6b7280",
      pinColor: h ?? I.pinColor ?? "#ffffff",
      lineWidth: u ?? I.lineWidth ?? 1,
      backgroundColor: v ?? I.backgroundColor ?? "#111111",
      wind: S ?? I.wind ?? 0.3,
      windSpeed: L ?? I.windSpeed ?? 0.5,
      tearable: T ?? I.tearable ?? !1,
      tearDistance: k ?? I.tearDistance ?? 3,
      interactive: B ?? !0,
      mouseRadius: F ?? 30,
      mouseForce: A ?? 5,
      showPins: c ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: P,
        style: { width: g ?? "100%", height: C ?? "100%", display: "block", overflow: "hidden", ...m },
        children: /* @__PURE__ */ it("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
zo.displayName = "ClothSimulation";
function dt(r, y, o) {
  return Math.min(r, o - 1) + Math.min(y, o - 1) * o;
}
function ae(r, y, o, a, s, i) {
  const l = i * s * r * r, d = 1 + 4 * l;
  for (let n = 0; n < 4; n++) {
    for (let t = 1; t < r - 1; t++)
      for (let e = 1; e < r - 1; e++)
        o[dt(e, t, r)] = (a[dt(e, t, r)] + l * (o[dt(e - 1, t, r)] + o[dt(e + 1, t, r)] + o[dt(e, t - 1, r)] + o[dt(e, t + 1, r)])) / d;
    $t(r, y, o);
  }
}
function ie(r, y, o, a, s, i, l) {
  const d = l * r;
  for (let n = 1; n < r - 1; n++)
    for (let t = 1; t < r - 1; t++) {
      let e = t - d * s[dt(t, n, r)], h = n - d * i[dt(t, n, r)];
      e = Math.max(0.5, Math.min(r - 1.5, e)), h = Math.max(0.5, Math.min(r - 1.5, h));
      const u = Math.floor(e), v = u + 1, S = Math.floor(h), L = S + 1, T = e - u, k = 1 - T, B = h - S, F = 1 - B;
      o[dt(t, n, r)] = k * (F * a[dt(u, S, r)] + B * a[dt(u, L, r)]) + T * (F * a[dt(v, S, r)] + B * a[dt(v, L, r)]);
    }
  $t(r, y, o);
}
function we(r, y, o, a, s) {
  const i = 1 / r;
  for (let l = 1; l < r - 1; l++)
    for (let d = 1; d < r - 1; d++)
      s[dt(d, l, r)] = -0.5 * i * (y[dt(d + 1, l, r)] - y[dt(d - 1, l, r)] + o[dt(d, l + 1, r)] - o[dt(d, l - 1, r)]), a[dt(d, l, r)] = 0;
  $t(r, 0, s), $t(r, 0, a);
  for (let l = 0; l < 4; l++) {
    for (let d = 1; d < r - 1; d++)
      for (let n = 1; n < r - 1; n++)
        a[dt(n, d, r)] = (s[dt(n, d, r)] + a[dt(n - 1, d, r)] + a[dt(n + 1, d, r)] + a[dt(n, d - 1, r)] + a[dt(n, d + 1, r)]) / 4;
    $t(r, 0, a);
  }
  for (let l = 1; l < r - 1; l++)
    for (let d = 1; d < r - 1; d++)
      y[dt(d, l, r)] -= 0.5 * (a[dt(d + 1, l, r)] - a[dt(d - 1, l, r)]) / i, o[dt(d, l, r)] -= 0.5 * (a[dt(d, l + 1, r)] - a[dt(d, l - 1, r)]) / i;
  $t(r, 1, y), $t(r, 2, o);
}
function $t(r, y, o) {
  for (let a = 1; a < r - 1; a++)
    o[dt(0, a, r)] = y === 1 ? -o[dt(1, a, r)] : o[dt(1, a, r)], o[dt(r - 1, a, r)] = y === 1 ? -o[dt(r - 2, a, r)] : o[dt(r - 2, a, r)], o[dt(a, 0, r)] = y === 2 ? -o[dt(a, 1, r)] : o[dt(a, 1, r)], o[dt(a, r - 1, r)] = y === 2 ? -o[dt(a, r - 2, r)] : o[dt(a, r - 2, r)];
  o[dt(0, 0, r)] = 0.5 * (o[dt(1, 0, r)] + o[dt(0, 1, r)]), o[dt(r - 1, 0, r)] = 0.5 * (o[dt(r - 2, 0, r)] + o[dt(r - 1, 1, r)]), o[dt(0, r - 1, r)] = 0.5 * (o[dt(1, r - 1, r)] + o[dt(0, r - 2, r)]), o[dt(r - 1, r - 1, r)] = 0.5 * (o[dt(r - 2, r - 1, r)] + o[dt(r - 1, r - 2, r)]);
}
function Do(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null), i = X(null), l = X(0);
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    const u = Math.max(32, Math.min(128, y.resolution)), v = u * u;
    let S = new Float32Array(v), L = new Float32Array(v), T = new Float32Array(v), k = new Float32Array(v), B = new Float32Array(v), F = new Float32Array(v), A = new Float32Array(v), c = new Float32Array(v), g = new Float32Array(v), C = new Float32Array(v), P = new Float32Array(v), m = new Float32Array(v), I = null;
    const x = document.createElement("canvas");
    x.width = u, x.height = u;
    const R = x.getContext("2d");
    function E(O, W) {
      const z = r.current, $ = window.devicePixelRatio || 1;
      z.width = Math.round(O * $), z.height = Math.round(W * $), z.style.width = `${O}px`, z.style.height = `${W}px`, t.scale($, $), t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", e = O, h = W, I = R.createImageData(u, u);
    }
    const b = new ResizeObserver((O) => {
      const { width: W, height: z } = O[0].contentRect;
      W > 0 && z > 0 && E(W, z);
    });
    b.observe(n);
    const w = n.getBoundingClientRect();
    w.width > 0 && w.height > 0 && E(w.width, w.height);
    function f(O, W, z, $, Y, H, G, N, U) {
      const j = Math.max(1, Math.floor(U));
      for (let _ = -j; _ <= j; _++)
        for (let J = -j; J <= j; J++) {
          const V = O + J, Q = W + _;
          if (V < 1 || V >= u - 1 || Q < 1 || Q >= u - 1) continue;
          const nt = Math.sqrt(J * J + _ * _);
          if (nt > j) continue;
          const K = 1 - nt / j, et = dt(V, Q, u);
          B[et] += Y * K, F[et] += H * K, A[et] += G * K, S[et] += z * N * K, L[et] += $ * N * K;
        }
    }
    function p(O) {
      const W = r.current.getBoundingClientRect(), z = O.clientX - W.left, $ = O.clientY - W.top, Y = s.current;
      s.current = {
        x: z,
        y: $,
        px: Y ? Y.x : z,
        py: Y ? Y.y : $
      };
    }
    function M() {
      s.current = null;
    }
    n.addEventListener("mousemove", p), n.addEventListener("mouseleave", M);
    function q() {
      const { autoInk: O, autoInkInterval: W } = o.current;
      O && (i.current = setTimeout(() => {
        const { inkColors: z } = o.current, $ = z[l.current % z.length];
        l.current++;
        const Y = yt($).split(",").map(Number), H = Math.floor(u * 0.2 + Math.random() * u * 0.6), G = Math.floor(u * 0.2 + Math.random() * u * 0.6), N = Math.random() * Math.PI * 2;
        f(H, G, Math.cos(N) * 2, Math.sin(N) * 2, Y[0] / 255, Y[1] / 255, Y[2] / 255, 3, 3), q();
      }, W * (0.6 + Math.random() * 0.8)));
    }
    q();
    function D() {
      const { viscosity: O, diffusion: W, dissipation: z, inkColors: $, backgroundColor: Y, mouseForce: H, inkRadius: G } = o.current, N = 0.016, U = s.current;
      if (U) {
        const _ = Math.floor(U.x / e * u), J = Math.floor(U.y / h * u), V = (U.x - U.px) * 0.5, Q = (U.y - U.py) * 0.5, nt = $[l.current % $.length], K = yt(nt).split(",").map(Number);
        f(_, J, V, Q, K[0] / 255, K[1] / 255, K[2] / 255, H, G), Math.abs(V) + Math.abs(Q) > 0.5 && l.current++, U.px = U.x, U.py = U.y;
      }
      T.set(S), k.set(L), ae(u, 1, S, T, O, N), ae(u, 2, L, k, O, N), we(u, S, L, P, m), T.set(S), k.set(L), ie(u, 1, S, T, T, k, N), ie(u, 2, L, k, T, k, N), we(u, S, L, P, m);
      for (const [_, J] of [[B, c], [F, g], [A, C]]) {
        J.set(_), ae(u, 0, _, J, W, N), J.set(_), ie(u, 0, _, J, S, L, N);
        for (let V = 0; V < v; V++)
          _[V] = Math.max(0, _[V] * z), J[V] = 0;
      }
      for (let _ = 0; _ < v; _++)
        T[_] = 0, k[_] = 0;
      if (!I) {
        a.current = requestAnimationFrame(D);
        return;
      }
      const j = I.data;
      for (let _ = 0; _ < u; _++)
        for (let J = 0; J < u; J++) {
          const V = dt(J, _, u), Q = (_ * u + J) * 4;
          j[Q] = Math.min(255, B[V] * 255), j[Q + 1] = Math.min(255, F[V] * 255), j[Q + 2] = Math.min(255, A[V] * 255), j[Q + 3] = Math.min(255, (B[V] + F[V] + A[V]) * 200);
        }
      t.clearRect(0, 0, e, h), Y && Y !== "transparent" && (t.fillStyle = Y, t.fillRect(0, 0, e, h)), R.putImageData(I, 0, 0), t.drawImage(x, 0, 0, e, h), a.current = requestAnimationFrame(D);
    }
    return a.current = requestAnimationFrame(D), () => {
      b.disconnect(), cancelAnimationFrame(a.current), n.removeEventListener("mousemove", p), n.removeEventListener("mouseleave", M), i.current && clearTimeout(i.current);
    };
  }, [r, y.resolution]);
}
const qo = {
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
}, Wo = ht(
  (r, y) => {
    const {
      preset: o,
      resolution: a,
      viscosity: s,
      diffusion: i,
      dissipation: l,
      inkColors: d,
      glowEffect: n,
      glowBlur: t,
      backgroundColor: e,
      autoInk: h,
      autoInkInterval: u,
      mouseForce: v,
      inkRadius: S,
      width: L,
      height: T,
      className: k,
      style: B
    } = r, F = o && qo[o] || {}, A = X(null);
    return gt(y, () => A.current), Do(A, {
      resolution: a ?? F.resolution ?? 128,
      viscosity: s ?? F.viscosity ?? 1e-4,
      diffusion: i ?? F.diffusion ?? 1e-4,
      dissipation: l ?? F.dissipation ?? 0.995,
      inkColors: d ?? F.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: n ?? F.glowEffect ?? !0,
      glowBlur: t ?? F.glowBlur ?? 0,
      backgroundColor: e ?? F.backgroundColor ?? "#111111",
      autoInk: h ?? F.autoInk ?? !0,
      autoInkInterval: u ?? F.autoInkInterval ?? 1500,
      mouseForce: v ?? F.mouseForce ?? 5,
      inkRadius: S ?? F.inkRadius ?? 4
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: { width: L ?? "100%", height: T ?? "100%", display: "block", overflow: "hidden", ...B },
        children: /* @__PURE__ */ it("canvas", { ref: A, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Wo.displayName = "FluidSimulation";
const Yo = [
  [0.35, 0.25, 0.5],
  // background — slow, dim, thin
  [0.65, 0.55, 0.75],
  // midground
  [1, 1, 1]
  // foreground — fast, bright, full
];
function Oo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X(0), d = X(null);
  ft(() => {
    var n;
    (n = d.current) == null || n.call(d);
  }, [y.dropCount]), ft(() => {
    const n = r.current;
    if (!n) return;
    const t = n.parentElement;
    if (!t) return;
    const e = n.getContext("2d");
    let h = 0, u = 0;
    function v(F = !1) {
      const { speed: A, dropLength: c, dropOpacity: g, dropWidth: C } = o.current, P = Math.floor(Math.random() * 3), [m, I, x] = Yo[P];
      return {
        x: Math.random() * (h + 100) - 50,
        y: F ? Math.random() * u : -c * 2 - Math.random() * u * 0.5,
        speed: A * m * (0.7 + Math.random() * 0.6),
        length: c * x * (0.6 + Math.random() * 0.8),
        opacity: g * I * (0.5 + Math.random() * 0.5),
        width: C * x * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer: P
      };
    }
    function S() {
      a.current = Array.from({ length: o.current.dropCount }, () => v(!0)), s.current = [];
    }
    function L(F, A) {
      const c = window.devicePixelRatio || 1;
      n.width = Math.round(F * c), n.height = Math.round(A * c), n.style.width = `${F}px`, n.style.height = `${A}px`, e.scale(c, c), h = F, u = A, S();
    }
    d.current = () => {
      h > 0 && u > 0 && S();
    };
    const T = new ResizeObserver((F) => {
      const { width: A, height: c } = F[0].contentRect;
      A > 0 && c > 0 && L(A, c);
    });
    T.observe(t);
    const k = t.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B() {
      const { wind: F, windSpeed: A, dropColor: c, splashColor: g, showSplashes: C, backgroundColor: P } = o.current;
      l.current += 0.016;
      const m = l.current, I = F * (Math.sin(m * A) * 0.7 + Math.sin(m * A * 0.37) * 0.3);
      !P || P === "transparent" ? e.clearRect(0, 0, h, u) : (e.fillStyle = P, e.fillRect(0, 0, h, u));
      const x = yt(c), R = yt(g), E = a.current;
      for (let w = 0; w < 3; w++)
        for (let f = 0; f < E.length; f++) {
          const p = E[f];
          if (p.layer !== w) continue;
          const M = I + p.windJitter;
          p.x += M, p.y += p.speed;
          const q = Math.sqrt(M * M + p.speed * p.speed) || 1, D = p.x - M / q * p.length, O = p.y - p.speed / q * p.length, W = e.createLinearGradient(D, O, p.x, p.y);
          W.addColorStop(0, `rgba(${x},0)`), W.addColorStop(1, `rgba(${x},${p.opacity})`), e.beginPath(), e.moveTo(D, O), e.lineTo(p.x, p.y), e.strokeStyle = W, e.lineWidth = p.width, e.lineCap = "round", e.stroke(), p.y > u + p.length && (C && s.current.push({
            x: p.x,
            y: u,
            r: 0,
            maxR: 8 + Math.random() * 12,
            life: 0,
            maxLife: 25 + Math.floor(Math.random() * 25)
          }), E[f] = v()), p.x > h + 60 && (p.x -= h + 120), p.x < -60 && (p.x += h + 120);
        }
      const b = s.current;
      for (let w = b.length - 1; w >= 0; w--) {
        const f = b[w];
        f.life++, f.r = f.life / f.maxLife * f.maxR;
        const p = (1 - f.life / f.maxLife) * 0.75;
        if (p <= 0 || f.life >= f.maxLife) {
          b.splice(w, 1);
          continue;
        }
        e.save(), e.translate(f.x, f.y), e.scale(1.6, 0.35), e.beginPath(), e.arc(0, 0, f.r, 0, Math.PI * 2), e.strokeStyle = `rgba(${R},${p})`, e.lineWidth = 1.2, e.stroke(), e.restore();
      }
      i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      T.disconnect(), cancelAnimationFrame(i.current);
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
}, Go = ht((r, y) => {
  const {
    preset: o,
    dropCount: a,
    speed: s,
    wind: i,
    windSpeed: l,
    dropLength: d,
    dropWidth: n,
    dropOpacity: t,
    dropColor: e,
    splashColor: h,
    showSplashes: u,
    backgroundColor: v,
    width: S,
    height: L,
    className: T,
    style: k
  } = r, B = o && Xo[o] || {}, F = X(null);
  return gt(y, () => F.current), Oo(F, {
    dropCount: a ?? B.dropCount ?? 200,
    speed: s ?? B.speed ?? 15,
    wind: i ?? B.wind ?? 0.3,
    windSpeed: l ?? B.windSpeed ?? 0.5,
    dropLength: d ?? B.dropLength ?? 28,
    dropWidth: n ?? B.dropWidth ?? 1.5,
    dropOpacity: t ?? B.dropOpacity ?? 0.85,
    dropColor: e ?? B.dropColor ?? "#000000",
    splashColor: h ?? B.splashColor ?? "#000000",
    showSplashes: u ?? B.showSplashes ?? !0,
    backgroundColor: v ?? B.backgroundColor ?? "#ffffff"
  }), /* @__PURE__ */ it(
    "div",
    {
      className: T,
      style: { width: S ?? "100%", height: L ?? "100%", display: "block", overflow: "hidden", ...k },
      children: /* @__PURE__ */ it("canvas", { ref: F, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Go.displayName = "Rain";
function te(r, y, o, a, s, i, l) {
  if (s <= 0) {
    l.push({ x: o, y: a });
    return;
  }
  const d = Math.hypot(o - r, a - y), n = (r + o) / 2 + (Math.random() - 0.5) * i * d * 0.5, t = (y + a) / 2 + (Math.random() - 0.5) * i * d * 0.1;
  te(r, y, n, t, s - 1, i, l), te(n, t, o, a, s - 1, i, l);
}
function Ho(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(null), l = X(0);
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u(A, c) {
      const g = window.devicePixelRatio || 1;
      d.width = Math.round(A * g), d.height = Math.round(c * g), d.style.width = `${A}px`, d.style.height = `${c}px`, t.scale(g, g), e = A, h = c;
    }
    const v = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && u(c, g);
    });
    v.observe(n);
    const S = n.getBoundingClientRect();
    S.width > 0 && S.height > 0 && u(S.width, S.height);
    function L(A) {
      const { glowBlur: c, color: g, coreColor: C } = o.current, P = A.points;
      if (P.length < 2 || A.alpha <= 0) return;
      const m = A.alpha * A.energy;
      t.lineCap = "round", t.lineJoin = "round", t.shadowBlur = 0, t.globalAlpha = m * 0.3, t.strokeStyle = g, t.lineWidth = 6 * A.energy, t.filter = `blur(${Math.round(c * 0.6)}px)`, t.beginPath(), t.moveTo(P[0].x, P[0].y);
      for (let I = 1; I < P.length; I++) t.lineTo(P[I].x, P[I].y);
      t.stroke(), t.filter = "none", t.globalAlpha = m * 0.6, t.strokeStyle = g, t.lineWidth = 2.5 * A.energy, t.shadowColor = g, t.shadowBlur = c * A.energy, t.beginPath(), t.moveTo(P[0].x, P[0].y);
      for (let I = 1; I < P.length; I++) t.lineTo(P[I].x, P[I].y);
      t.stroke(), t.globalAlpha = m * 0.9, t.strokeStyle = C, t.lineWidth = 0.8 * A.energy, t.shadowBlur = 0, t.beginPath(), t.moveTo(P[0].x, P[0].y);
      for (let I = 1; I < P.length; I++) t.lineTo(P[I].x, P[I].y);
      t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0;
    }
    function T(A, c) {
      const { segments: g, roughness: C, branchChance: P, branchDecay: m, flickerCount: I } = o.current, { startX: x, startY: R, endY: E } = o.current, b = A !== void 0 ? A : x * e, w = R * h, f = b + (Math.random() - 0.5) * e * 0.2, p = c !== void 0 ? c : E * h, M = [];
      function q(D, O, W, z, $) {
        const Y = [{ x: D, y: O }];
        te(D, O, W, z, g, C, Y), M.push({ points: Y, energy: $, alpha: 1 });
        for (let H = 2; H < Y.length - 1; H++) {
          if (Math.random() >= P) continue;
          const G = (Math.random() - 0.5) * Math.PI * 0.65, N = (p - Y[H].y) * (0.25 + Math.random() * 0.4), U = Y[H].x + Math.sin(G) * N, j = Y[H].y + Math.cos(G) * Math.abs(N), _ = [{ x: Y[H].x, y: Y[H].y }];
          te(Y[H].x, Y[H].y, U, j, Math.max(2, g - 2), C * 0.8, _), M.push({ points: _, energy: $ * m, alpha: 1 });
        }
      }
      for (let D = 0; D < I; D++)
        q(
          b + (Math.random() - 0.5) * 4,
          w,
          f + (Math.random() - 0.5) * 8,
          p,
          1
        );
      a.current = M, l.current = 0.35;
    }
    function k() {
      const { autoInterval: A } = o.current;
      i.current = setTimeout(() => {
        T(), k();
      }, A * (0.5 + Math.random()));
    }
    k(), T();
    function B(A) {
      if (!o.current.interactive) return;
      const c = d.getBoundingClientRect();
      T(A.clientX - c.left, A.clientY - c.top);
    }
    d.addEventListener("click", B);
    function F() {
      const { backgroundColor: A } = o.current;
      !A || A === "transparent" ? t.clearRect(0, 0, e, h) : (t.fillStyle = A, t.fillRect(0, 0, e, h));
      const c = a.current;
      let g = !1;
      for (const C of c)
        C.alpha *= 0.82, C.alpha > 0.01 && (g = !0, L(C));
      g || (a.current = []), l.current > 5e-3 && (t.globalAlpha = l.current, t.fillStyle = "#ffffff", t.fillRect(0, 0, e, h), t.globalAlpha = 1, l.current *= 0.55), s.current = requestAnimationFrame(F);
    }
    return s.current = requestAnimationFrame(F), () => {
      v.disconnect(), cancelAnimationFrame(s.current), i.current && clearTimeout(i.current), d.removeEventListener("click", B);
    };
  }, [r]);
}
const No = {
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
}, jo = ht((r, y) => {
  const {
    preset: o,
    segments: a,
    roughness: s,
    branchChance: i,
    branchDecay: l,
    flickerCount: d,
    glowBlur: n,
    color: t,
    coreColor: e,
    backgroundColor: h,
    autoInterval: u,
    interactive: v,
    startX: S,
    startY: L,
    endY: T,
    width: k,
    height: B,
    className: F,
    style: A
  } = r, c = o && No[o] || {}, g = X(null);
  return gt(y, () => g.current), Ho(g, {
    segments: a ?? c.segments ?? 8,
    roughness: s ?? c.roughness ?? 0.5,
    branchChance: i ?? c.branchChance ?? 0.1,
    branchDecay: l ?? c.branchDecay ?? 0.6,
    flickerCount: d ?? c.flickerCount ?? 3,
    glowBlur: n ?? c.glowBlur ?? 20,
    color: t ?? c.color ?? "#6b7280",
    coreColor: e ?? c.coreColor ?? "#ffffff",
    backgroundColor: h ?? c.backgroundColor ?? "#111111",
    autoInterval: u ?? c.autoInterval ?? 2e3,
    interactive: v ?? c.interactive ?? !0,
    startX: S ?? c.startX ?? 0.5,
    startY: L ?? c.startY ?? 0,
    endY: T ?? c.endY ?? 1
  }), /* @__PURE__ */ it(
    "div",
    {
      className: F,
      style: { width: k ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...A },
      children: /* @__PURE__ */ it("canvas", { ref: g, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
jo.displayName = "Lightning";
function Uo(r, y, o) {
  const a = X(y);
  a.current = y;
  const s = X(0), i = X(new Uint16Array(0)), l = X(new Uint16Array(0)), d = X(0), n = X(0), t = X(!1), e = X(0);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const u = h.parentElement;
    if (!u) return;
    const v = h.getContext("2d");
    let S = 0, L = 0;
    function T(C = !0) {
      const { cellSize: P, initialDensity: m } = a.current, I = Math.floor(S / P), x = Math.floor(L / P);
      if (d.current = I, n.current = x, i.current = new Uint16Array(I * x), l.current = new Uint16Array(I * x), C)
        for (let R = 0; R < i.current.length; R++)
          i.current[R] = Math.random() < m ? 1 : 0;
    }
    function k(C, P) {
      const m = r.current, I = window.devicePixelRatio || 1;
      m.width = Math.round(C * I), m.height = Math.round(P * I), m.style.width = `${C}px`, m.style.height = `${P}px`, v.scale(I, I), S = C, L = P, T(!0);
    }
    const B = new ResizeObserver((C) => {
      const { width: P, height: m } = C[0].contentRect;
      P > 0 && m > 0 && k(P, m);
    });
    B.observe(u);
    const F = u.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height), o && (o.current = {
      randomize: () => T(!0),
      clear: () => {
        i.current.fill(0);
      },
      pause: () => {
        t.current = !0;
      },
      resume: () => {
        t.current = !1;
      }
    });
    function A() {
      const C = d.current, P = n.current, m = i.current, I = l.current, { wrapEdges: x } = a.current;
      for (let R = 0; R < P; R++)
        for (let E = 0; E < C; E++) {
          let b = 0;
          for (let p = -1; p <= 1; p++)
            for (let M = -1; M <= 1; M++) {
              if (p === 0 && M === 0) continue;
              let q = R + p, D = E + M;
              if (x)
                q = (q + P) % P, D = (D + C) % C;
              else if (q < 0 || q >= P || D < 0 || D >= C) continue;
              m[q * C + D] > 0 && b++;
            }
          const w = R * C + E, f = m[w] > 0;
          f && (b === 2 || b === 3) ? I[w] = Math.min(m[w] + 1, 255) : !f && b === 3 ? I[w] = 1 : I[w] = 0;
        }
      i.current = I.slice();
    }
    function c(C) {
      const { cellSize: P, speed: m, aliveColor: I, oldColor: x, deadColor: R, showAge: E, backgroundColor: b } = a.current;
      if (!t.current) {
        const q = 1e3 / m;
        C - e.current >= q && (A(), e.current = C);
      }
      v.fillStyle = b, v.fillRect(0, 0, S, L);
      const w = d.current, f = n.current, p = i.current, M = 60;
      for (let q = 0; q < f; q++)
        for (let D = 0; D < w; D++) {
          const O = p[q * w + D];
          if (O === 0) continue;
          const W = E ? Math.min(O / M, 1) : 0, [z, $, Y] = bt([I, x], W);
          v.fillStyle = `rgb(${z},${$},${Y})`, v.fillRect(D * P + 0.5, q * P + 0.5, P - 1, P - 1);
        }
      s.current = requestAnimationFrame(c);
    }
    s.current = requestAnimationFrame(c);
    function g(C) {
      if (!a.current.interactive) return;
      const m = r.current.getBoundingClientRect(), I = C.clientX - m.left, x = C.clientY - m.top, { cellSize: R } = a.current, E = Math.floor(I / R), b = Math.floor(x / R), w = d.current, f = n.current;
      if (E < 0 || E >= w || b < 0 || b >= f) return;
      const p = b * w + E;
      i.current[p] = i.current[p] > 0 ? 0 : 1;
    }
    return h.addEventListener("click", g), () => {
      B.disconnect(), cancelAnimationFrame(s.current), h.removeEventListener("click", g);
    };
  }, [r, o]);
}
const Vo = {
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
}, _o = ht((r, y) => {
  const {
    preset: o,
    cellSize: a,
    speed: s,
    initialDensity: i,
    aliveColor: l,
    oldColor: d,
    deadColor: n,
    showAge: t,
    wrapEdges: e,
    interactive: h,
    backgroundColor: u,
    width: v,
    height: S,
    className: L,
    style: T
  } = r, k = o && Vo[o] || {}, B = X(null), F = X(null);
  return gt(y, () => F.current), Uo(B, {
    cellSize: a ?? k.cellSize ?? 8,
    speed: s ?? k.speed ?? 10,
    initialDensity: i ?? k.initialDensity ?? 0.3,
    aliveColor: l ?? k.aliveColor ?? "#ffffff",
    oldColor: d ?? k.oldColor ?? "#6b7280",
    deadColor: n ?? k.deadColor ?? "#111111",
    showAge: t ?? k.showAge ?? !0,
    wrapEdges: e ?? k.wrapEdges ?? !0,
    interactive: h ?? k.interactive ?? !0,
    backgroundColor: u ?? k.backgroundColor ?? "#111111"
  }, F), /* @__PURE__ */ it(
    "div",
    {
      className: L,
      style: { width: v ?? "100%", height: S ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...T },
      children: /* @__PURE__ */ it("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
_o.displayName = "GameOfLife";
function Jo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X(1), d = X(null);
  ft(() => {
    var n;
    (n = d.current) == null || n.call(d);
  }, [y.ringCount]), ft(() => {
    const n = r.current;
    if (!n) return;
    const t = n.parentElement;
    if (!t) return;
    const e = n.getContext("2d");
    let h = 0, u = 0;
    function v() {
      const { ringCount: A, starCount: c } = o.current;
      a.current = Array.from({ length: A }, (g, C) => ({
        z: C / A,
        colorIndex: C % Math.max(1, o.current.colors.length),
        rotation: C / A * Math.PI * 2
      })), s.current = Array.from({ length: c }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08
      }));
    }
    function S(A, c) {
      const g = r.current, C = window.devicePixelRatio || 1;
      g.width = Math.round(A * C), g.height = Math.round(c * C), g.style.width = `${A}px`, g.style.height = `${c}px`, e.scale(C, C), h = A, u = c, v();
    }
    d.current = () => {
      h > 0 && u > 0 && v();
    };
    const L = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && S(c, g);
    });
    L.observe(t);
    const T = t.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(A) {
      if (!o.current.interactive) return;
      const g = r.current.getBoundingClientRect(), C = (A.clientX - g.left) / g.width;
      l.current = 0.2 + C * 2.8;
    }
    n.addEventListener("mousemove", k);
    function B(A, c, g) {
      const { fov: C, depth: P, twist: m } = o.current, I = Math.min(h, u) * 0.45, x = C / (C + c * P), R = g + c * m * Math.PI * 2, E = h / 2 + Math.cos(A + R) * I * x, b = u / 2 + Math.sin(A + R) * I * x;
      return { px: E, py: b, scale: x };
    }
    function F() {
      const { speed: A, colors: c, backgroundColor: g, lineWidth: C, opacity: P, starColor: m } = o.current, I = a.current, x = s.current, R = A * l.current * 8e-3;
      e.fillStyle = g, e.fillRect(0, 0, h, u);
      const E = [...I].sort((b, w) => b.z - w.z);
      for (const b of E) {
        b.z += R, b.z >= 1 && (b.z -= 1, b.colorIndex = (b.colorIndex + 1) % Math.max(1, c.length)), b.rotation += R * 0.1;
        const w = 64, f = (1 - b.z) * P;
        if (f <= 0.01) continue;
        const p = c[b.colorIndex % c.length] ?? "#7C3AED", { scale: M } = B(0, b.z, b.rotation);
        e.beginPath();
        for (let q = 0; q <= w; q++) {
          const D = q / w * Math.PI * 2, { px: O, py: W } = B(D, b.z, b.rotation);
          q === 0 ? e.moveTo(O, W) : e.lineTo(O, W);
        }
        e.closePath(), e.strokeStyle = p, e.globalAlpha = f, e.lineWidth = C * M, e.stroke(), e.globalAlpha = 1;
      }
      for (const b of x) {
        b.ringZ += R, b.ringZ >= 1 && (b.ringZ -= 1);
        const { px: w, py: f, scale: p } = B(b.angle + b.offset * Math.PI * 2, b.ringZ, 0), M = (1 - b.ringZ) * 0.8;
        M <= 0 || (e.beginPath(), e.arc(w, f, Math.max(0.5, 1.5 * p), 0, Math.PI * 2), e.fillStyle = m, e.globalAlpha = M, e.fill(), e.globalAlpha = 1);
      }
      i.current = requestAnimationFrame(F);
    }
    return i.current = requestAnimationFrame(F), () => {
      L.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousemove", k);
    };
  }, [r]);
}
const Ko = {
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
}, Qo = ht((r, y) => {
  const {
    preset: o,
    ringCount: a,
    speed: s,
    colors: i,
    backgroundColor: l,
    twist: d,
    fov: n,
    depth: t,
    lineWidth: e,
    opacity: h,
    starCount: u,
    starColor: v,
    interactive: S,
    width: L,
    height: T,
    className: k,
    style: B
  } = r, F = o && Ko[o] || {}, A = X(null);
  return gt(y, () => A.current), Jo(A, {
    ringCount: a ?? F.ringCount ?? 30,
    speed: s ?? F.speed ?? 1,
    colors: i ?? F.colors ?? ["#ffffff", "#6b7280"],
    backgroundColor: l ?? F.backgroundColor ?? "#111111",
    twist: d ?? F.twist ?? 0.3,
    fov: n ?? F.fov ?? 300,
    depth: t ?? F.depth ?? 400,
    lineWidth: e ?? F.lineWidth ?? 1.5,
    opacity: h ?? F.opacity ?? 0.8,
    starCount: u ?? F.starCount ?? 100,
    starColor: v ?? F.starColor ?? "#ffffff",
    interactive: S ?? F.interactive ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: k,
      style: { width: L ?? "100%", height: T ?? "100%", display: "block", overflow: "hidden", ...B },
      children: /* @__PURE__ */ it("canvas", { ref: A, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Qo.displayName = "Wormhole";
function Zo(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(null), l = X(null);
  ft(() => {
    var d;
    (d = l.current) == null || d.call(l);
  }, [y.count]), ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u() {
      const g = o.current.maxSpeed, C = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * e,
        y: Math.random() * h,
        vx: Math.cos(C) * g * 0.5,
        vy: Math.sin(C) * g * 0.5,
        trail: []
      };
    }
    function v() {
      const { count: g } = o.current;
      a.current = Array.from({ length: g }, u);
    }
    function S(g, C) {
      const P = r.current, m = window.devicePixelRatio || 1;
      P.width = Math.round(g * m), P.height = Math.round(C * m), P.style.width = `${g}px`, P.style.height = `${C}px`, t.scale(m, m), e = g, h = C, v();
    }
    l.current = () => {
      e > 0 && h > 0 && v();
    };
    const L = new ResizeObserver((g) => {
      const { width: C, height: P } = g[0].contentRect;
      C > 0 && P > 0 && S(C, P);
    });
    L.observe(n);
    const T = n.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(g) {
      if (!o.current.interactive) return;
      const P = r.current.getBoundingClientRect();
      i.current = { x: g.clientX - P.left, y: g.clientY - P.top };
    }
    function B() {
      i.current = null;
    }
    d.addEventListener("mousemove", k), d.addEventListener("mouseleave", B);
    function F(g, C) {
      const P = /* @__PURE__ */ new Map();
      for (let m = 0; m < g.length; m++) {
        const I = Math.floor(g[m].x / C), x = Math.floor(g[m].y / C), R = `${I},${x}`;
        P.has(R) || P.set(R, []), P.get(R).push(m);
      }
      return P;
    }
    function A(g, C, P, m) {
      const I = Math.floor(C.x / P), x = Math.floor(C.y / P), R = Math.ceil(m / P), E = [];
      for (let b = -R; b <= R; b++)
        for (let w = -R; w <= R; w++) {
          const f = `${I + b},${x + w}`, p = g.get(f);
          p && E.push(...p);
        }
      return E;
    }
    function c() {
      const {
        maxSpeed: g,
        separationRadius: C,
        alignmentRadius: P,
        cohesionRadius: m,
        separationForce: I,
        alignmentForce: x,
        cohesionForce: R,
        color: E,
        trailLength: b,
        trailOpacity: w,
        boidSize: f,
        backgroundColor: p,
        mouseRadius: M,
        mouseForce: q,
        wrapEdges: D
      } = o.current;
      t.fillStyle = p, t.fillRect(0, 0, e, h);
      const O = a.current, W = Math.max(C, P, m), z = F(O, W), $ = i.current, Y = yt(E);
      for (let H = 0; H < O.length; H++) {
        const G = O[H];
        G.trail.push({ x: G.x, y: G.y }), G.trail.length > b && G.trail.shift();
        const N = A(z, G, W, Math.max(C, P, m));
        let U = 0, j = 0, _ = 0, J = 0, V = 0, Q = 0, nt = 0, K = 0, et = 0;
        for (const rt of N) {
          if (rt === H) continue;
          const st = O[rt], ct = G.x - st.x, lt = G.y - st.y, ut = Math.sqrt(ct * ct + lt * lt) || 1e-3;
          ut < C && (U += ct / ut, j += lt / ut, _++), ut < P && (J += st.vx, V += st.vy, Q++), ut < m && (nt += st.x, K += st.y, et++);
        }
        let tt = 0, ot = 0;
        if (_ > 0 && (tt += U / _ * I * g, ot += j / _ * I * g), Q > 0 && (tt += (J / Q - G.vx) * x, ot += (V / Q - G.vy) * x), et > 0 && (tt += (nt / et - G.x) / m * R * g, ot += (K / et - G.y) / m * R * g), $) {
          const rt = G.x - $.x, st = G.y - $.y, ct = Math.sqrt(rt * rt + st * st) || 1e-3;
          ct < M && (tt += rt / ct * q * g, ot += st / ct * q * g);
        }
        G.vx += tt, G.vy += ot;
        const at = Math.sqrt(G.vx * G.vx + G.vy * G.vy) || 1e-3;
        if (at > g && (G.vx = G.vx / at * g, G.vy = G.vy / at * g), G.x += G.vx, G.y += G.vy, D ? (G.x < 0 && (G.x += e, G.trail = []), G.x > e && (G.x -= e, G.trail = []), G.y < 0 && (G.y += h, G.trail = []), G.y > h && (G.y -= h, G.trail = [])) : ((G.x < 0 || G.x > e) && (G.vx *= -1), (G.y < 0 || G.y > h) && (G.vy *= -1), G.x = Math.max(0, Math.min(e, G.x)), G.y = Math.max(0, Math.min(h, G.y))), G.trail.length > 1) {
          t.beginPath(), t.moveTo(G.trail[0].x, G.trail[0].y);
          for (let rt = 1; rt < G.trail.length; rt++) {
            const st = G.trail[rt - 1], ct = G.trail[rt];
            Math.abs(ct.x - st.x) > e * 0.5 || Math.abs(ct.y - st.y) > h * 0.5 ? t.moveTo(ct.x, ct.y) : t.lineTo(ct.x, ct.y);
          }
          t.strokeStyle = `rgba(${Y},${w})`, t.lineWidth = 1, t.stroke();
        }
        const Z = Math.atan2(G.vy, G.vx);
        t.save(), t.translate(G.x, G.y), t.rotate(Z), t.beginPath(), t.moveTo(f, 0), t.lineTo(-f * 0.6, f * 0.5), t.lineTo(-f * 0.6, -f * 0.5), t.closePath(), t.fillStyle = `rgba(${Y},0.9)`, t.fill(), t.restore();
      }
      s.current = requestAnimationFrame(c);
    }
    return s.current = requestAnimationFrame(c), () => {
      L.disconnect(), cancelAnimationFrame(s.current), d.removeEventListener("mousemove", k), d.removeEventListener("mouseleave", B);
    };
  }, [r]);
}
const tn = {
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
}, en = ht((r, y) => {
  const {
    preset: o,
    count: a,
    maxSpeed: s,
    separationRadius: i,
    alignmentRadius: l,
    cohesionRadius: d,
    separationForce: n,
    alignmentForce: t,
    cohesionForce: e,
    color: h,
    trailLength: u,
    trailOpacity: v,
    boidSize: S,
    backgroundColor: L,
    interactive: T,
    mouseRadius: k,
    mouseForce: B,
    wrapEdges: F,
    width: A,
    height: c,
    className: g,
    style: C
  } = r, P = o && tn[o] || {}, m = X(null);
  return gt(y, () => m.current), Zo(m, {
    count: a ?? P.count ?? 80,
    maxSpeed: s ?? P.maxSpeed ?? 3,
    separationRadius: i ?? P.separationRadius ?? 25,
    alignmentRadius: l ?? P.alignmentRadius ?? 50,
    cohesionRadius: d ?? P.cohesionRadius ?? 60,
    separationForce: n ?? P.separationForce ?? 0.05,
    alignmentForce: t ?? P.alignmentForce ?? 0.05,
    cohesionForce: e ?? P.cohesionForce ?? 0.03,
    color: h ?? P.color ?? "#ffffff",
    trailLength: u ?? P.trailLength ?? 8,
    trailOpacity: v ?? P.trailOpacity ?? 0.4,
    boidSize: S ?? P.boidSize ?? 6,
    backgroundColor: L ?? P.backgroundColor ?? "#111111",
    interactive: T ?? P.interactive ?? !0,
    mouseRadius: k ?? P.mouseRadius ?? 80,
    mouseForce: B ?? P.mouseForce ?? 0.2,
    wrapEdges: F ?? P.wrapEdges ?? !0
  }), /* @__PURE__ */ it(
    "div",
    {
      className: g,
      style: { width: A ?? "100%", height: c ?? "100%", display: "block", overflow: "hidden", ...C },
      children: /* @__PURE__ */ it("canvas", { ref: m, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
en.displayName = "Boids";
function ve(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((s) => s + s).join("") : y, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function on(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null);
  ft(() => {
    const i = r.current;
    if (!i) return;
    const l = i.parentElement;
    if (!l) return;
    const d = i.getContext("2d");
    let n = 0, t = 0;
    function e(m, I) {
      const x = m * I, R = new Float32Array(x).fill(1), E = new Float32Array(x).fill(0), b = Math.max(5, Math.floor(m * I / 1e3));
      for (let M = 0; M < b; M++) {
        const q = Math.floor(Math.random() * m), D = Math.floor(Math.random() * I), O = Math.floor(2 + Math.random() * 5);
        for (let W = -O; W <= O; W++)
          for (let z = -O; z <= O; z++)
            if (z * z + W * W <= O * O) {
              const $ = (q + z + m) % m, H = (D + W + I) % I * m + $;
              R[H] = 0.5 + (Math.random() - 0.5) * 0.1, E[H] = 0.25 + Math.random() * 0.1;
            }
      }
      const w = new OffscreenCanvas(m, I), f = w.getContext("2d"), p = f.createImageData(m, I);
      for (let M = 0; M < x; M++) p.data[M * 4 + 3] = 255;
      s.current = {
        u: R,
        v: E,
        uNext: new Float32Array(x),
        vNext: new Float32Array(x),
        gw: m,
        gh: I,
        imageData: p,
        offscreen: w,
        offCtx: f
      };
    }
    function h(m, I) {
      const x = window.devicePixelRatio || 1;
      n = m, t = I, i.width = Math.round(n * x), i.height = Math.round(t * x), i.style.width = `${n}px`, i.style.height = `${t}px`, d.setTransform(x, 0, 0, x, 0, 0);
      const { resolution: R } = o.current, E = Math.max(4, Math.round(n * R)), b = Math.max(4, Math.round(t * R));
      e(E, b);
    }
    const u = new ResizeObserver((m) => {
      const { width: I, height: x } = m[0].contentRect;
      I > 0 && x > 0 && h(I, x);
    });
    u.observe(l);
    const v = l.getBoundingClientRect();
    v.width > 0 && v.height > 0 && h(v.width, v.height);
    let S = !1, L = -1, T = -1;
    function k(m, I) {
      const x = s.current;
      if (!x) return;
      const R = i.getBoundingClientRect(), E = m - R.left, b = I - R.top;
      L = Math.floor(E / n * x.gw), T = Math.floor(b / t * x.gh);
    }
    function B(m) {
      o.current.interactive && k(m.clientX, m.clientY);
    }
    function F(m) {
      o.current.interactive && (S = !0, k(m.clientX, m.clientY));
    }
    function A() {
      S = !1, L = -1, T = -1;
    }
    function c() {
      S = !1, L = -1, T = -1;
    }
    l.addEventListener("mousemove", B), l.addEventListener("mousedown", F), l.addEventListener("mouseup", A), l.addEventListener("mouseleave", c);
    function g() {
      const m = s.current;
      if (!m) return;
      const { u: I, v: x, uNext: R, vNext: E, gw: b, gh: w } = m, { feedRate: f, killRate: p, diffusionU: M, diffusionV: q } = o.current;
      if (S && L >= 0 && T >= 0) {
        for (let O = -3; O <= 3; O++)
          for (let W = -3; W <= 3; W++)
            if (W * W + O * O <= 3 * 3) {
              const z = (L + W + b) % b, Y = (T + O + w) % w * b + z;
              I[Y] = 0.5, x[Y] = 0.25;
            }
      }
      for (let D = 0; D < w; D++) {
        const O = (D - 1 + w) % w * b, W = (D + 1) % w * b, z = D * b;
        for (let $ = 0; $ < b; $++) {
          const Y = z + $, H = ($ - 1 + b) % b, G = ($ + 1) % b, N = I[z + H] + I[z + G] + I[O + $] + I[W + $] - 4 * I[Y], U = x[z + H] + x[z + G] + x[O + $] + x[W + $] - 4 * x[Y], j = I[Y] * x[Y] * x[Y];
          R[Y] = Math.max(0, Math.min(1, I[Y] + M * N - j + f * (1 - I[Y]))), E[Y] = Math.max(0, Math.min(1, x[Y] + q * U + j - (f + p) * x[Y]));
        }
      }
      m.u.set(R), m.v.set(E);
    }
    function C() {
      const m = s.current;
      if (!m) return;
      const { u: I, v: x, gw: R, gh: E, imageData: b, offscreen: w, offCtx: f } = m, { colorA: p, colorB: M, backgroundColor: q } = o.current, [D, O, W] = ve(p), [z, $, Y] = ve(M), H = b.data;
      for (let G = 0; G < R * E; G++) {
        const N = Math.max(0, Math.min(1, x[G] * 3.5)), U = 1 - I[G] * 0.15, j = G * 4;
        H[j] = Math.round((D + (z - D) * N) * U), H[j + 1] = Math.round((O + ($ - O) * N) * U), H[j + 2] = Math.round((W + (Y - W) * N) * U);
      }
      f.putImageData(b, 0, 0), q && q !== "transparent" && (d.fillStyle = q, d.fillRect(0, 0, n, t)), d.imageSmoothingEnabled = !0, d.imageSmoothingQuality = "low", d.drawImage(w, 0, 0, n, t);
    }
    function P() {
      const { speed: m } = o.current, I = Math.max(1, Math.round(m));
      for (let x = 0; x < I; x++) g();
      C(), a.current = requestAnimationFrame(P);
    }
    return a.current = requestAnimationFrame(P), () => {
      u.disconnect(), cancelAnimationFrame(a.current), l.removeEventListener("mousemove", B), l.removeEventListener("mousedown", F), l.removeEventListener("mouseup", A), l.removeEventListener("mouseleave", c);
    };
  }, [r, y.resolution]);
}
const nn = {
  default: {},
  coral: { feedRate: 0.055, killRate: 0.062 },
  spots: { feedRate: 0.035, killRate: 0.065 },
  maze: { feedRate: 0.029, killRate: 0.057 },
  waves: { feedRate: 0.014, killRate: 0.053, speed: 6 },
  neon: { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" }
}, rn = ht(
  (r, y) => {
    const {
      preset: o,
      feedRate: a,
      killRate: s,
      diffusionU: i,
      diffusionV: l,
      resolution: d,
      speed: n,
      colorA: t,
      colorB: e,
      backgroundColor: h,
      interactive: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && nn[o] || {}, B = X(null);
    return gt(y, () => B.current), on(B, {
      feedRate: a ?? k.feedRate ?? 0.055,
      killRate: s ?? k.killRate ?? 0.062,
      diffusionU: i ?? k.diffusionU ?? 0.2,
      diffusionV: l ?? k.diffusionV ?? 0.1,
      resolution: d ?? k.resolution ?? 0.5,
      speed: n ?? k.speed ?? 8,
      colorA: t ?? k.colorA ?? "#111111",
      colorB: e ?? k.colorB ?? "#ffffff",
      backgroundColor: h ?? k.backgroundColor ?? "#111111",
      interactive: u ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...T
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
rn.displayName = "ReactionDiffusion";
function an(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((s) => s + s).join("") : y, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function sn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0), i = X([]), l = X([]);
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u(c, g) {
      const { starCount: C } = o.current;
      i.current = Array.from({ length: C }, () => ({
        x: Math.random() * c,
        y: Math.random() * g * 0.7,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6
      }));
    }
    function v(c) {
      const { layers: g } = o.current;
      l.current = Array.from({ length: g }, (C, P) => ({
        colorIndex: P % Math.max(1, o.current.colors.length),
        freqOffset: 0.5 + Math.random() * 1.5,
        ampScale: 0.4 + Math.random() * 0.6,
        speedScale: 0.3 + Math.random() * 0.7,
        yCenter: 0.15 + P / Math.max(1, g - 1) * 0.45,
        thickness: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function S(c, g) {
      const C = window.devicePixelRatio || 1;
      e = c, h = g, d.width = Math.round(e * C), d.height = Math.round(h * C), d.style.width = `${e}px`, d.style.height = `${h}px`, t.scale(C, C), u(e, h), v();
    }
    const L = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && S(g, C);
    });
    L.observe(n);
    const T = n.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    let k = y.layers, B = y.starCount, F = 0;
    function A(c) {
      const g = F ? Math.min(c - F, 50) : 16;
      F = c;
      const { colors: C, speed: P, intensity: m, layers: I, waveAmplitude: x, waveFrequency: R, backgroundColor: E, animated: b, starCount: w } = o.current;
      I !== k && (k = I, v()), w !== B && (B = w, u(e, h)), b && (s.current += g * 1e-3 * P);
      const f = s.current;
      t.fillStyle = E, t.fillRect(0, 0, e, h);
      const p = i.current;
      for (const O of p)
        t.beginPath(), t.arc(O.x, O.y, O.r, 0, Math.PI * 2), t.fillStyle = `rgba(255,255,255,${O.opacity * 0.8})`, t.fill();
      const M = t.globalCompositeOperation;
      t.globalCompositeOperation = "screen";
      const q = Math.max(4, Math.ceil(e / 4)), D = e / q;
      for (const O of l.current) {
        const W = C[O.colorIndex % C.length] || "#ffffff", [z, $, Y] = an(W), H = O.yCenter * h, G = x * h * O.ampScale, N = R * O.freqOffset, U = O.thickness * h;
        t.beginPath();
        for (let J = 0; J <= q; J++) {
          const V = J * D, Q = V / e * Math.PI * 2 * N + f * O.speedScale + O.phase, nt = H - G * Math.sin(Q) - U * 0.5;
          J === 0 ? t.moveTo(V, nt) : t.lineTo(V, nt);
        }
        for (let J = q; J >= 0; J--) {
          const V = J * D, Q = V / e * Math.PI * 2 * N + f * O.speedScale + O.phase, nt = H - G * Math.sin(Q) + U * 0.5;
          t.lineTo(V, nt);
        }
        t.closePath();
        const j = t.createLinearGradient(0, H - G - U, 0, H + G + U);
        j.addColorStop(0, `rgba(${z},${$},${Y},0)`), j.addColorStop(0.3, `rgba(${z},${$},${Y},${m * 0.6})`), j.addColorStop(0.5, `rgba(${z},${$},${Y},${m})`), j.addColorStop(0.7, `rgba(${z},${$},${Y},${m * 0.6})`), j.addColorStop(1, `rgba(${z},${$},${Y},0)`), t.fillStyle = j, t.fill();
        const _ = Math.floor(e / 60);
        for (let J = 0; J < _; J++) {
          const V = (J / _ + f * 0.02 * O.speedScale) % 1 * e, Q = H - G - U * 0.5, nt = U * 2 + G * 2, K = t.createLinearGradient(0, Q, 0, Q + nt);
          K.addColorStop(0, `rgba(${z},${$},${Y},0)`), K.addColorStop(0.5, `rgba(${z},${$},${Y},${m * 0.3})`), K.addColorStop(1, `rgba(${z},${$},${Y},0)`), t.fillStyle = K, t.fillRect(V - 1, Q, 2, nt);
        }
      }
      t.globalCompositeOperation = M, a.current = requestAnimationFrame(A);
    }
    return a.current = requestAnimationFrame(A), () => {
      L.disconnect(), cancelAnimationFrame(a.current);
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
}, ln = ht(
  (r, y) => {
    const {
      preset: o,
      colors: a,
      speed: s,
      intensity: i,
      layers: l,
      backgroundColor: d,
      waveAmplitude: n,
      waveFrequency: t,
      starCount: e,
      animated: h,
      width: u,
      height: v,
      className: S,
      style: L
    } = r, T = o && cn[o] || {}, k = X(null);
    return gt(y, () => k.current), sn(k, {
      colors: a ?? T.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: s ?? T.speed ?? 1,
      intensity: i ?? T.intensity ?? 0.8,
      layers: l ?? 5,
      backgroundColor: d ?? T.backgroundColor ?? "#111111",
      waveAmplitude: n ?? 0.15,
      waveFrequency: t ?? 2,
      starCount: e ?? 80,
      animated: h ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: {
          width: u ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          ...L
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: k,
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
function un(r, y) {
  for (r = Math.abs(Math.round(r)), y = Math.abs(Math.round(y)); y > 0; ) [r, y] = [y, r % y];
  return r || 1;
}
function fn(r, y) {
  const o = un(r, y);
  return 2 * Math.PI * (y / o);
}
function dn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0, t = [], e = -1, h = -1, u = -1, v = -1, S = !0;
    function L(x, R) {
      const E = d / 2, b = n / 2, w = E + (x.R - x.r) * Math.cos(R) + x.d * Math.cos((x.R - x.r) / x.r * R), f = b + (x.R - x.r) * Math.sin(R) - x.d * Math.sin((x.R - x.r) / x.r * R);
      return [w, f];
    }
    function T(x, R, E) {
      const { outerRadius: b, innerRadius: w, penDistance: f } = o.current, M = Math.min(d, n) / 2 * b, D = R > 1 ? (x / (R - 1) - 0.5) * 0.12 : 0;
      let O, W;
      E ? (O = M * Math.max(0.05, w + D + (Math.random() - 0.5) * 0.08), W = O * Math.max(0.05, f * (0.85 + Math.random() * 0.3))) : (O = M * Math.max(0.05, w + D), W = O * Math.max(0.05, f)), O = Math.max(1, O), W = Math.max(0.1, W);
      const z = fn(M, O), $ = { t: 0, prevX: 0, prevY: 0, R: M, r: O, d: W, fullPeriod: z }, [Y, H] = L($, 0);
      return $.prevX = Y, $.prevY = H, $;
    }
    function k(x) {
      const { outerRadius: R, innerRadius: E, penDistance: b, layerCount: w } = o.current;
      t = [];
      for (let f = 0; f < w; f++)
        t.push(T(f, w, x));
      e = R, h = E, u = b, v = w;
    }
    function B() {
      const { backgroundColor: x } = o.current;
      l.globalCompositeOperation = "source-over", l.globalAlpha = 1, l.fillStyle = x, l.fillRect(0, 0, d, n);
    }
    function F(x, R) {
      const E = window.devicePixelRatio || 1;
      d = x, n = R, s.width = Math.round(d * E), s.height = Math.round(n * E), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(E, 0, 0, E, 0, 0), B(), S = !0, k(!1);
    }
    const A = new ResizeObserver((x) => {
      const { width: R, height: E } = x[0].contentRect;
      R > 0 && E > 0 && F(R, E);
    });
    A.observe(i);
    const c = i.getBoundingClientRect();
    c.width > 0 && c.height > 0 && F(c.width, c.height);
    let g = 0;
    function C(x, R, E, b, w, f, p, M) {
      l.strokeStyle = w, l.lineWidth = f, l.lineCap = "round", p ? (l.shadowColor = w, l.shadowBlur = M) : l.shadowBlur = 0, l.beginPath(), l.moveTo(x, R), l.lineTo(E, b), l.stroke();
    }
    function P(x, R, E, b, w) {
      const f = Math.cos(w), p = Math.sin(w), M = E - x, q = b - R;
      return [x + M * f - q * p, R + M * p + q * f];
    }
    function m(x, R) {
      const { colors: E } = o.current, b = E.length > 0 ? E : ["#ffffff"];
      return b[R % b.length];
    }
    function I(x) {
      const R = g ? Math.min(x - g, 50) : 16;
      g = x;
      const {
        outerRadius: E,
        innerRadius: b,
        penDistance: w,
        layerCount: f,
        speed: p,
        backgroundColor: M,
        lineWidth: q,
        trailFade: D,
        animated: O,
        autoReset: W,
        symmetry: z,
        glowEffect: $,
        glowBlur: Y
      } = o.current;
      if (!S && (E !== e || b !== h || w !== u || f !== v) && (k(!1), B()), S = !1, !O) {
        a.current = requestAnimationFrame(I);
        return;
      }
      D > 0 && (l.globalCompositeOperation = "source-over", l.globalAlpha = Math.min(1, D * (R / 16)), l.fillStyle = M, l.fillRect(0, 0, d, n), l.globalAlpha = 1), l.globalCompositeOperation = "source-over";
      const H = p * Math.PI / 180 * (R / 16), G = Math.max(1, Math.ceil(H / 0.02)), N = H / G, U = d / 2, j = n / 2, _ = 2 * Math.PI / z;
      let J = !1;
      for (let V = 0; V < t.length; V++) {
        const Q = t[V], nt = m(Q, V);
        for (let K = 0; K < G; K++) {
          Q.t += N;
          const [et, tt] = L(Q, Q.t);
          for (let ot = 0; ot < z; ot++) {
            const at = ot * _, [Z, rt] = P(U, j, Q.prevX, Q.prevY, at), [st, ct] = P(U, j, et, tt, at);
            C(Z, rt, st, ct, nt, q, $, Y);
          }
          Q.prevX = et, Q.prevY = tt;
        }
        Q.t >= Q.fullPeriod && W && (J = !0);
      }
      $ || (l.shadowBlur = 0), l.globalCompositeOperation = "source-over", J && (k(!0), B()), a.current = requestAnimationFrame(I);
    }
    return a.current = requestAnimationFrame(I), () => {
      A.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const hn = {
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
}, gn = ht(
  (r, y) => {
    const {
      preset: o,
      outerRadius: a,
      innerRadius: s,
      penDistance: i,
      speed: l,
      colors: d,
      backgroundColor: n,
      lineWidth: t,
      trailFade: e,
      animated: h,
      autoReset: u,
      layerCount: v,
      symmetry: S,
      glowEffect: L,
      glowBlur: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && hn[o] || {}, g = X(null);
    return gt(y, () => g.current), dn(g, {
      outerRadius: a ?? 0.85,
      innerRadius: s ?? c.innerRadius ?? 0.4,
      penDistance: i ?? c.penDistance ?? 0.9,
      speed: l ?? c.speed ?? 2,
      colors: d ?? c.colors ?? ["#ffffff"],
      backgroundColor: n ?? c.backgroundColor ?? "#111111",
      lineWidth: t ?? c.lineWidth ?? 1,
      trailFade: e ?? c.trailFade ?? 3e-3,
      animated: h ?? !0,
      autoReset: u ?? !0,
      layerCount: v ?? c.layerCount ?? 2,
      symmetry: S ?? c.symmetry ?? 1,
      glowEffect: L ?? c.glowEffect ?? !1,
      glowBlur: T ?? c.glowBlur ?? 10
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: k ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          ...A
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
gn.displayName = "Spirograph";
const vt = 0, Ft = 1, Et = 2, Dt = 3, se = 4;
function Xt(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((s) => s + s).join("") : y, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function pn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(null), i = X(null), l = X(0), d = X(0);
  ft(() => {
    const n = r.current;
    if (!n) return;
    const t = n.parentElement;
    if (!t) return;
    const e = n.getContext("2d");
    let h = 0, u = 0, v = null, S = null, L = null;
    function T(b, w) {
      l.current = b, d.current = w, s.current = new Uint8Array(b * w), i.current = new Float32Array(b * w), v = new OffscreenCanvas(b, w), S = v.getContext("2d"), L = S.createImageData(b, w);
    }
    function k(b, w) {
      const f = window.devicePixelRatio || 1;
      h = b, u = w, n.width = Math.round(h * f), n.height = Math.round(u * f), n.style.width = `${h}px`, n.style.height = `${u}px`, e.scale(f, f);
      const { cellSize: p } = o.current, M = Math.max(4, Math.floor(h / p)), q = Math.max(4, Math.floor(u / p));
      T(M, q);
    }
    const B = new ResizeObserver((b) => {
      const { width: w, height: f } = b[0].contentRect;
      w > 0 && f > 0 && k(w, f);
    });
    B.observe(t);
    const F = t.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height);
    let A = !1;
    function c(b, w) {
      const f = n.getBoundingClientRect(), p = b - f.left, M = w - f.top, q = l.current, D = d.current;
      return [
        Math.floor(p / h * q),
        Math.floor(M / u * D)
      ];
    }
    function g(b, w) {
      const f = s.current, p = i.current;
      if (!f || !p) return;
      const M = l.current, q = d.current, { brushSize: D, material: O } = o.current;
      for (let W = -D; W <= D; W++)
        for (let z = -D; z <= D; z++) {
          if (z * z + W * W > D * D) continue;
          const $ = b + z, Y = w + W;
          if ($ < 0 || $ >= M || Y < 0 || Y >= q) continue;
          const H = Y * M + $;
          O === "erase" ? (f[H] = vt, p[H] = 0) : O === "sand" ? f[H] = Ft : O === "water" ? f[H] = Et : O === "fire" ? (f[H] = Dt, p[H] = 1) : O === "wall" && (f[H] = se);
        }
    }
    function C(b) {
      o.current.interactive && (A = !0, g(...c(b.clientX, b.clientY)));
    }
    function P(b) {
      !o.current.interactive || !A || g(...c(b.clientX, b.clientY));
    }
    function m() {
      A = !1;
    }
    function I() {
      A = !1;
    }
    n.addEventListener("mousedown", C), n.addEventListener("mousemove", P), n.addEventListener("mouseup", m), n.addEventListener("mouseleave", I);
    function x() {
      const b = s.current, w = i.current;
      if (!b || !w) return;
      const f = l.current, p = d.current;
      for (let M = p - 1; M >= 0; M--) {
        const q = Math.random() < 0.5;
        for (let D = 0; D < f; D++) {
          const O = q ? D : f - 1 - D, W = M * f + O, z = b[W];
          if (z === vt || z === se) continue;
          const $ = M + 1 < p, Y = M - 1 >= 0, H = O - 1 >= 0, G = O + 1 < f;
          if (z === Ft)
            if ($ && b[(M + 1) * f + O] === vt)
              b[(M + 1) * f + O] = Ft, b[W] = vt;
            else if ($ && b[(M + 1) * f + O] === Et)
              b[(M + 1) * f + O] = Ft, b[W] = Et;
            else {
              const N = Math.random() < 0.5, U = N ? -1 : 1, j = N ? 1 : -1, _ = N ? H : G, J = N ? G : H;
              $ && _ && b[(M + 1) * f + (O + U)] === vt ? (b[(M + 1) * f + (O + U)] = Ft, b[W] = vt) : $ && J && b[(M + 1) * f + (O + j)] === vt && (b[(M + 1) * f + (O + j)] = Ft, b[W] = vt);
            }
          else if (z === Et)
            if ($ && b[(M + 1) * f + O] === vt)
              b[(M + 1) * f + O] = Et, b[W] = vt;
            else {
              const N = Math.random() < 0.5, U = N ? -1 : 1, j = N ? 1 : -1, _ = N ? H : G, J = N ? G : H;
              _ && b[M * f + (O + U)] === vt ? (b[M * f + (O + U)] = Et, b[W] = vt) : J && b[M * f + (O + j)] === vt && (b[M * f + (O + j)] = Et, b[W] = vt);
            }
          else if (z === Dt) {
            if (w[W] -= 5e-3 + Math.random() * 0.01, w[W] <= 0) {
              b[W] = vt, w[W] = 0;
              continue;
            }
            Y && b[(M - 1) * f + O] === vt && Math.random() < 0.4 && (b[(M - 1) * f + O] = Dt, w[(M - 1) * f + O] = w[W] * (0.7 + Math.random() * 0.3)), Y && b[(M - 1) * f + O] === Ft && Math.random() < 0.02 && (b[(M - 1) * f + O] = Dt, w[(M - 1) * f + O] = 1);
            const N = Math.random() < 0.5 ? -1 : 1;
            Y && (N === -1 ? H : G) && b[(M - 1) * f + (O + N)] === vt && Math.random() < 0.15 && (b[(M - 1) * f + (O + N)] = Dt, w[(M - 1) * f + (O + N)] = w[W] * 0.6), $ && b[(M + 1) * f + O] === Et && (b[W] = vt, b[(M + 1) * f + O] = vt, w[W] = 0);
          }
        }
      }
    }
    function R() {
      const b = s.current, w = i.current;
      if (!b || !w || !L || !v || !S) return;
      const f = l.current, p = d.current, { sandColor: M, waterColor: q, fireColor: D, wallColor: O, backgroundColor: W } = o.current, [z, $, Y] = Xt(W), [H, G, N] = Xt(M), [U, j, _] = Xt(q), [J, V, Q] = Xt(D), [nt, K, et] = Xt(O), tt = L.data;
      for (let ot = 0; ot < f * p; ot++) {
        const at = ot * 4, Z = b[ot];
        if (tt[at + 3] = 255, Z === vt)
          tt[at] = z, tt[at + 1] = $, tt[at + 2] = Y;
        else if (Z === Ft) {
          const rt = (Math.random() * 20 | 0) - 10;
          tt[at] = Math.max(0, Math.min(255, H + rt)), tt[at + 1] = Math.max(0, Math.min(255, G + rt)), tt[at + 2] = Math.max(0, Math.min(255, N + rt));
        } else if (Z === Et) {
          const rt = 0.6 + Math.random() * 0.3;
          tt[at] = Math.round(z * (1 - rt) + U * rt), tt[at + 1] = Math.round($ * (1 - rt) + j * rt), tt[at + 2] = Math.round(Y * (1 - rt) + _ * rt);
        } else if (Z === Dt) {
          const rt = Math.max(0, Math.min(1, w[ot]));
          tt[at] = Math.min(255, Math.round(J * rt + 60 * rt)), tt[at + 1] = Math.round(V * rt * 0.4), tt[at + 2] = Math.round(Q * rt * 0.1);
        } else Z === se && (tt[at] = nt, tt[at + 1] = K, tt[at + 2] = et);
      }
      S.putImageData(L, 0, 0), e.imageSmoothingEnabled = !1, e.drawImage(v, 0, 0, h, u);
    }
    function E() {
      x(), R(), a.current = requestAnimationFrame(E);
    }
    return a.current = requestAnimationFrame(E), () => {
      B.disconnect(), cancelAnimationFrame(a.current), n.removeEventListener("mousedown", C), n.removeEventListener("mousemove", P), n.removeEventListener("mouseup", m), n.removeEventListener("mouseleave", I);
    };
  }, [r, y.cellSize]);
}
const mn = {
  default: {},
  desert: { sandColor: "#c8a85a", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  ocean: { waterColor: "#0088cc", backgroundColor: "#001a2e", wallColor: "#0a3a5a", material: "water" },
  inferno: { fireColor: "#ff4400", backgroundColor: "#0a0000", wallColor: "#2a0000", material: "fire" },
  neon: { sandColor: "#00ffff", waterColor: "#ff00ff", fireColor: "#ffff00", wallColor: "#00ff88", backgroundColor: "#050505" }
}, yn = ht(
  (r, y) => {
    const {
      preset: o,
      cellSize: a,
      brushSize: s,
      material: i,
      sandColor: l,
      waterColor: d,
      fireColor: n,
      wallColor: t,
      backgroundColor: e,
      interactive: h,
      gravity: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && mn[o] || {}, B = X(null);
    return gt(y, () => B.current), pn(B, {
      cellSize: a ?? 4,
      brushSize: s ?? 3,
      material: i ?? k.material ?? "sand",
      sandColor: l ?? k.sandColor ?? "#ffffff",
      waterColor: d ?? k.waterColor ?? "#6b7280",
      fireColor: n ?? k.fireColor ?? "#ffffff",
      wallColor: t ?? k.wallColor ?? "#4b5563",
      backgroundColor: e ?? k.backgroundColor ?? "#111111",
      interactive: h ?? !0,
      gravity: u ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...T
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
yn.displayName = "SandSimulation";
function be(r) {
  const y = r.replace("#", ""), o = y.length === 3 ? y.split("").map((s) => s + s).join("") : y, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function wn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0), s = X(0), i = X([]);
  ft(() => {
    const l = r.current;
    if (!l) return;
    const d = l.parentElement;
    if (!d) return;
    const n = l.getContext("2d");
    let t = 0, e = 0, h = null, u = null, v = null, S = 0, L = 0;
    function T() {
      i.current = [
        { x: t * 0.35, y: e * 0.5 },
        { x: t * 0.65, y: e * 0.5 }
      ];
    }
    function k(P, m) {
      const I = window.devicePixelRatio || 1;
      t = P, e = m, l.width = Math.round(t * I), l.height = Math.round(e * I), l.style.width = `${t}px`, l.style.height = `${e}px`, n.scale(I, I);
      const { resolution: x } = o.current;
      S = Math.max(4, Math.round(t * x)), L = Math.max(4, Math.round(e * x)), h = new OffscreenCanvas(S, L), u = h.getContext("2d"), v = u.createImageData(S, L), T();
    }
    const B = new ResizeObserver((P) => {
      const { width: m, height: I } = P[0].contentRect;
      m > 0 && I > 0 && k(m, I);
    });
    B.observe(d);
    const F = d.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height);
    const A = 16;
    function c(P) {
      const m = l.getBoundingClientRect(), I = P.clientX - m.left, x = P.clientY - m.top, R = i.current, { maxSources: E } = o.current;
      for (let b = 0; b < R.length; b++) {
        const w = R[b].x - I, f = R[b].y - x;
        if (w * w + f * f < A * A) {
          R.splice(b, 1);
          return;
        }
      }
      R.length < E && R.push({ x: I, y: x });
    }
    l.addEventListener("click", c);
    let g = 0;
    function C(P) {
      const m = g ? Math.min(P - g, 50) : 16;
      g = P;
      const { wavelength: I, speed: x, colorHigh: R, colorLow: E, showSources: b, animated: w, decay: f } = o.current, p = i.current;
      w && (s.current += m * 1e-3 * x);
      const M = s.current, [q, D, O] = be(E), [W, z, $] = be(R), Y = v.data, H = 2 * Math.PI / I, G = H * (x * 60), N = Math.max(1, p.length), U = t / S, j = e / L;
      for (let _ = 0; _ < L; _++)
        for (let J = 0; J < S; J++) {
          const V = (J + 0.5) * U, Q = (_ + 0.5) * j;
          let nt = 0;
          for (const ot of p) {
            const at = V - ot.x, Z = Q - ot.y, rt = Math.sqrt(at * at + Z * Z), st = Math.exp(-f * rt);
            nt += st * Math.cos(H * rt - G * M);
          }
          const K = (nt / N + 1) * 0.5, et = Math.max(0, Math.min(1, K)), tt = (_ * S + J) * 4;
          Y[tt] = Math.round(q + (W - q) * et), Y[tt + 1] = Math.round(D + (z - D) * et), Y[tt + 2] = Math.round(O + ($ - O) * et), Y[tt + 3] = 255;
        }
      if (u.putImageData(v, 0, 0), n.imageSmoothingEnabled = !0, n.imageSmoothingQuality = "low", n.drawImage(h, 0, 0, t, e), b)
        for (const _ of p)
          n.beginPath(), n.arc(_.x, _.y, 8, 0, Math.PI * 2), n.strokeStyle = R, n.lineWidth = 2, n.stroke(), n.beginPath(), n.moveTo(_.x - 5, _.y), n.lineTo(_.x + 5, _.y), n.moveTo(_.x, _.y - 5), n.lineTo(_.x, _.y + 5), n.stroke();
      a.current = requestAnimationFrame(C);
    }
    return a.current = requestAnimationFrame(C), () => {
      B.disconnect(), cancelAnimationFrame(a.current), l.removeEventListener("click", c);
    };
  }, [r, y.resolution]);
}
const vn = {
  default: {},
  ripple: { colorHigh: "#88ccff", colorLow: "#001133", wavelength: 100 },
  plasma: { colorHigh: "#ff4400", colorLow: "#000033", wavelength: 60, decay: 1e-3 },
  neon: { colorHigh: "#00ffff", colorLow: "#000000", wavelength: 70 },
  cosmic: { colorHigh: "#cc88ff", colorLow: "#050005", decay: 2e-3 }
}, bn = ht(
  (r, y) => {
    const {
      preset: o,
      maxSources: a,
      wavelength: s,
      speed: i,
      colorHigh: l,
      colorLow: d,
      backgroundColor: n,
      showSources: t,
      resolution: e,
      animated: h,
      decay: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && vn[o] || {}, B = X(null);
    return gt(y, () => B.current), wn(B, {
      maxSources: a ?? 6,
      wavelength: s ?? k.wavelength ?? 80,
      speed: i ?? 1,
      colorHigh: l ?? k.colorHigh ?? "#ffffff",
      colorLow: d ?? k.colorLow ?? "#111111",
      backgroundColor: n ?? k.backgroundColor ?? "#111111",
      showSources: t ?? !1,
      resolution: e ?? 0.4,
      animated: h ?? !0,
      decay: u ?? k.decay ?? 3e-3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...T
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
bn.displayName = "WaveInterference";
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
function Cn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0, t = 0, e = 0, h = null, u = [], v = 0;
    function S(b, w) {
      return w * t + b;
    }
    function L(b, w) {
      return b < 0 || b >= t || w < 0 || w >= e ? !1 : h[S(b, w)] === 1;
    }
    function T(b, w) {
      for (const [f, p] of Mn)
        if (L(b + f, w + p)) return !0;
      return !1;
    }
    function k(b, w) {
      b < 0 || b >= t || w < 0 || w >= e || (h[S(b, w)] = 1);
    }
    function B(b, w) {
      const { particleSize: f } = o.current;
      return [Math.floor(b / f), Math.floor(w / f)];
    }
    function F(b, w) {
      const { particleSize: f } = o.current;
      return [b * f + f * 0.5, w * f + f * 0.5];
    }
    function A() {
      const { seedMode: b } = o.current;
      if (b === "bottom")
        return { x: Math.floor(Math.random() * t), y: 0 };
      const w = Math.random() * Math.PI * 2, f = Math.min(v, Math.floor(Math.min(t, e) * 0.48)), p = t / 2, M = e / 2;
      return {
        x: Math.max(0, Math.min(t - 1, Math.round(p + Math.cos(w) * f))),
        y: Math.max(0, Math.min(e - 1, Math.round(M + Math.sin(w) * f)))
      };
    }
    function c(b, w, f) {
      const [p, M] = F(b, w), { particleColor: q, walkerColor: D, particleSize: O, glowEffect: W, glowBlur: z } = o.current;
      W && f ? (l.shadowColor = q, l.shadowBlur = z) : l.shadowBlur = 0;
      const $ = O * 0.5;
      l.fillStyle = f ? q : D, l.beginPath(), l.arc(p, M, $, 0, Math.PI * 2), l.fill(), l.shadowBlur = 0;
    }
    function g(b, w) {
      const [f, p] = F(b, w), { particleSize: M, backgroundColor: q } = o.current, D = M * 0.5 + 1;
      l.fillStyle = q, l.beginPath(), l.arc(f, p, D, 0, Math.PI * 2), l.fill();
    }
    function C() {
      const { seedMode: b } = o.current;
      if (h)
        if (b === "bottom")
          for (let w = 0; w < t; w++)
            k(w, e - 1), c(w, e - 1, !0);
        else if (b === "ring") {
          const w = Math.floor(t / 2), f = Math.floor(e / 2), p = Math.max(2, Math.floor(Math.min(t, e) * 0.04));
          for (let M = 0; M < Math.PI * 2; M += 0.15) {
            const q = Math.round(w + Math.cos(M) * p), D = Math.round(f + Math.sin(M) * p);
            q >= 0 && q < t && D >= 0 && D < e && (k(q, D), c(q, D, !0));
          }
        } else {
          const w = Math.floor(t / 2), f = Math.floor(e / 2);
          k(w, f), c(w, f, !0);
        }
    }
    function P(b, w) {
      const { particleSize: f, walkerCount: p } = o.current;
      t = Math.max(4, Math.floor(b / f)), e = Math.max(4, Math.floor(w / f)), h = new Uint8Array(t * e), v = Math.floor(Math.min(t, e) * 0.05), l.fillStyle = o.current.backgroundColor, l.fillRect(0, 0, d, n), C(), u = [];
      for (let M = 0; M < p; M++)
        u.push(A());
    }
    function m(b, w) {
      const f = window.devicePixelRatio || 1;
      d = b, n = w, s.width = Math.round(d * f), s.height = Math.round(n * f), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(f, 0, 0, f, 0, 0), P(d, n);
    }
    const I = new ResizeObserver((b) => {
      const { width: w, height: f } = b[0].contentRect;
      w > 0 && f > 0 && m(w, f);
    });
    I.observe(i);
    const x = i.getBoundingClientRect();
    x.width > 0 && x.height > 0 && m(x.width, x.height);
    function R(b) {
      if (!o.current.interactive || !h) return;
      const w = s.getBoundingClientRect(), f = b.clientX - w.left, p = b.clientY - w.top, [M, q] = B(f, p);
      M >= 0 && M < t && q >= 0 && q < e && (k(M, q), c(M, q, !0));
    }
    s.addEventListener("click", R);
    function E() {
      if (!h) {
        a.current = requestAnimationFrame(E);
        return;
      }
      const { stepsPerFrame: b, walkerCount: w, showWalkers: f, seedMode: p } = o.current;
      for (let M = 0; M < b; M++)
        for (let q = 0; q < u.length; q++) {
          const D = u[q], O = D.x, W = D.y;
          f && g(O, W);
          const z = Me[Math.floor(Math.random() * Me.length)];
          let $ = D.x + z[0], Y = D.y + z[1];
          if ($ = Math.max(0, Math.min(t - 1, $)), Y = p === "bottom" ? Math.max(0, Math.min(e - 2, Y)) : Math.max(0, Math.min(e - 1, Y)), D.x = $, D.y = Y, T($, Y) && !L($, Y)) {
            if (k($, Y), c($, Y, !0), p !== "bottom") {
              const H = t / 2, G = e / 2, N = Math.sqrt(($ - H) ** 2 + (Y - G) ** 2);
              v = Math.min(
                Math.floor(Math.min(t, e) * 0.48),
                Math.max(v, Math.ceil(N) + 3)
              );
            }
            u.length <= w && (u[q] = A());
          } else
            f && c($, Y, !1);
        }
      a.current = requestAnimationFrame(E);
    }
    return a.current = requestAnimationFrame(E), () => {
      I.disconnect(), cancelAnimationFrame(a.current), s.removeEventListener("click", R);
    };
  }, [r, y.particleSize, y.seedMode]);
}
const xn = {
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
}, Rn = ht(
  (r, y) => {
    const {
      preset: o,
      particleColor: a,
      walkerColor: s,
      backgroundColor: i,
      particleSize: l,
      walkerCount: d,
      stepsPerFrame: n,
      seedMode: t,
      showWalkers: e,
      glowEffect: h,
      glowBlur: u,
      interactive: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && xn[o] || {}, F = X(null);
    return gt(y, () => F.current), Cn(F, {
      particleColor: a ?? B.particleColor ?? "#ffffff",
      walkerColor: s ?? B.walkerColor ?? "#6b7280",
      backgroundColor: i ?? B.backgroundColor ?? "#111111",
      particleSize: l ?? B.particleSize ?? 3,
      walkerCount: d ?? 60,
      stepsPerFrame: n ?? 20,
      seedMode: t ?? B.seedMode ?? "center",
      showWalkers: e ?? !1,
      glowEffect: h ?? B.glowEffect ?? !0,
      glowBlur: u ?? B.glowBlur ?? 8,
      interactive: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: {
          width: S ?? "100%",
          height: L ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...k
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
Rn.displayName = "DiffusionAggregation";
function Sn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0, t = 0, e = -1, h = -1, u = -1, v = !0;
    function S() {
      l.globalAlpha = 1, l.shadowBlur = 0, l.fillStyle = o.current.backgroundColor, l.fillRect(0, 0, d, n);
    }
    function L(A, c) {
      const g = window.devicePixelRatio || 1;
      d = A, n = c, s.width = Math.round(d * g), s.height = Math.round(n * g), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(g, 0, 0, g, 0, 0), S(), v = !0;
    }
    const T = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && L(c, g);
    });
    T.observe(i);
    const k = i.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    let B = 0;
    function F(A) {
      const c = B ? Math.min(A - B, 50) : 16;
      B = A;
      const {
        freqX: g,
        freqY: C,
        phaseShift: P,
        phaseSpeed: m,
        amplitude: I,
        color: x,
        backgroundColor: R,
        lineWidth: E,
        trailFade: b,
        glowEffect: w,
        glowBlur: f,
        colorMode: p,
        curvePoints: M,
        animated: q,
        speed: D
      } = o.current;
      if (v ? (t = P * Math.PI / 180, e = g, h = C, u = I, v = !1) : (g !== e || C !== h || I !== u) && (S(), t = P * Math.PI / 180, e = g, h = C, u = I), !q) {
        a.current = requestAnimationFrame(F);
        return;
      }
      b > 0 && (l.globalAlpha = Math.min(1, b * (c / 16)), l.fillStyle = R, l.fillRect(0, 0, d, n), l.globalAlpha = 1);
      const O = d / 2, W = n / 2, z = O * I, $ = W * I, Y = p === "cycle" ? `hsl(${t * 360 / Math.PI % 360}, 100%, 65%)` : x;
      l.strokeStyle = Y, l.lineWidth = E, l.lineCap = "round", l.lineJoin = "round", w ? (l.shadowColor = Y, l.shadowBlur = f) : l.shadowBlur = 0, l.beginPath();
      for (let H = 0; H <= M; H++) {
        const G = H / M * 2 * Math.PI, N = O + z * Math.sin(g * G + t), U = W + $ * Math.sin(C * G);
        H === 0 ? l.moveTo(N, U) : l.lineTo(N, U);
      }
      l.stroke(), l.shadowBlur = 0, t += m * D * Math.PI / 180 * (c / 16), a.current = requestAnimationFrame(F);
    }
    return a.current = requestAnimationFrame(F), () => {
      T.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const kn = {
  default: {},
  butterfly: { freqX: 3, freqY: 2 },
  star: { freqX: 5, freqY: 4 },
  web: { freqX: 7, freqY: 6, colorMode: "cycle" },
  neon: { glowEffect: !0, colorMode: "cycle", backgroundColor: "#000000", lineWidth: 2 },
  crystal: { freqX: 5, freqY: 3, glowEffect: !0, lineWidth: 2, colorMode: "cycle", backgroundColor: "#000510" }
}, En = ht(
  (r, y) => {
    const {
      preset: o,
      freqX: a,
      freqY: s,
      phaseShift: i,
      phaseSpeed: l,
      amplitude: d,
      color: n,
      backgroundColor: t,
      lineWidth: e,
      trailFade: h,
      glowEffect: u,
      glowBlur: v,
      colorMode: S,
      curvePoints: L,
      animated: T,
      speed: k,
      width: B,
      height: F,
      className: A,
      style: c
    } = r, g = o && kn[o] || {}, C = X(null);
    return gt(y, () => C.current), Sn(C, {
      freqX: a ?? g.freqX ?? 3,
      freqY: s ?? g.freqY ?? 2,
      phaseShift: i ?? 0,
      phaseSpeed: l ?? g.phaseSpeed ?? 0.5,
      amplitude: d ?? 0.9,
      color: n ?? g.color ?? "#ffffff",
      backgroundColor: t ?? g.backgroundColor ?? "#111111",
      lineWidth: e ?? g.lineWidth ?? 1.5,
      trailFade: h ?? g.trailFade ?? 0.04,
      glowEffect: u ?? g.glowEffect ?? !1,
      glowBlur: v ?? g.glowBlur ?? 12,
      colorMode: S ?? g.colorMode ?? "solid",
      curvePoints: L ?? 600,
      animated: T ?? !0,
      speed: k ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: A,
        style: {
          width: B ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          ...c
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: C,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
En.displayName = "Lissajous";
const ce = 25e4;
function Pn(r, y, o) {
  let a = r;
  for (let s = 0; s < o; s++) {
    let i = "";
    for (const l of a) {
      const d = y[l];
      if (d ? i += d : i += l, i.length >= ce) {
        i = i.slice(0, ce);
        break;
      }
    }
    if (a = i, a.length >= ce) break;
  }
  return a;
}
function An(r, y, o, a) {
  let s = 0, i = 0, l = -Math.PI / 2;
  const d = [], n = [];
  for (const c of r)
    switch (c) {
      case "F":
      case "G": {
        const g = s + Math.cos(l), C = i + Math.sin(l);
        n.push(s, i, g, C), s = g, i = C;
        break;
      }
      case "f": {
        s += Math.cos(l), i += Math.sin(l);
        break;
      }
      case "+":
        l += y;
        break;
      case "-":
        l -= y;
        break;
      case "[":
        d.push({ x: s, y: i, a: l });
        break;
      case "]": {
        const g = d.pop();
        g && (s = g.x, i = g.y, l = g.a);
        break;
      }
    }
  if (n.length === 0) return new Float32Array(0);
  let t = 1 / 0, e = -1 / 0, h = 1 / 0, u = -1 / 0;
  for (let c = 0; c < n.length; c += 4)
    t = Math.min(t, n[c], n[c + 2]), e = Math.max(e, n[c], n[c + 2]), h = Math.min(h, n[c + 1], n[c + 3]), u = Math.max(u, n[c + 1], n[c + 3]);
  const v = e - t || 1, S = u - h || 1, L = Math.min(o * 0.88 / v, a * 0.88 / S), T = h < 0 && u >= -0.1, k = o / 2;
  let B, F;
  T ? (B = k - (t + e) / 2 * L, F = a * 0.93 - u * L) : (B = k - (t + e) / 2 * L, F = a / 2 - (h + u) / 2 * L);
  const A = new Float32Array(n.length);
  for (let c = 0; c < n.length; c += 4)
    A[c] = n[c] * L + B, A[c + 1] = n[c + 1] * L + F, A[c + 2] = n[c + 2] * L + B, A[c + 3] = n[c + 3] * L + F;
  return A;
}
function Bn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0;
    const t = {
      segments: new Float32Array(0),
      totalSegments: 0,
      drawnSegments: 0,
      paramHash: "",
      waitTimer: -1
    };
    function e() {
      const { axiom: B, rules: F, iterations: A, angle: c } = o.current;
      return `${B}|${JSON.stringify(F)}|${A}|${c}`;
    }
    function h() {
      const { axiom: B, rules: F, iterations: A, angle: c } = o.current, g = Pn(B, F, A), C = c * Math.PI / 180;
      t.segments = An(g, C, d, n), t.totalSegments = t.segments.length / 4, t.drawnSegments = 0, t.waitTimer = -1, t.paramHash = e();
    }
    function u() {
      l.globalAlpha = 1, l.shadowBlur = 0, l.fillStyle = o.current.backgroundColor, l.fillRect(0, 0, d, n);
    }
    function v(B, F) {
      const A = window.devicePixelRatio || 1;
      d = B, n = F, s.width = Math.round(d * A), s.height = Math.round(n * A), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(A, 0, 0, A, 0, 0), u(), h();
    }
    const S = new ResizeObserver((B) => {
      const { width: F, height: A } = B[0].contentRect;
      F > 0 && A > 0 && v(F, A);
    });
    S.observe(i);
    const L = i.getBoundingClientRect();
    L.width > 0 && L.height > 0 && v(L.width, L.height);
    let T = 0;
    function k(B) {
      const F = T ? Math.min(B - T, 50) : 16;
      T = B;
      const {
        color: A,
        backgroundColor: c,
        lineWidth: g,
        speed: C,
        autoReset: P,
        trailFade: m,
        glowEffect: I,
        glowBlur: x
      } = o.current;
      e() !== t.paramHash && (u(), h());
      const { segments: E, totalSegments: b } = t;
      if (t.waitTimer > 0) {
        t.waitTimer -= F, m > 0 && (l.globalAlpha = Math.min(1, m * (F / 16)), l.shadowBlur = 0, l.fillStyle = c, l.fillRect(0, 0, d, n), l.globalAlpha = 1), t.waitTimer <= 0 && (t.waitTimer = -1, m === 0 && u(), t.drawnSegments = 0), a.current = requestAnimationFrame(k);
        return;
      }
      const w = Math.max(1, Math.round(C * (F / 16))), f = Math.min(t.drawnSegments + w, b);
      l.strokeStyle = A, l.lineWidth = g, l.lineCap = "round", I ? (l.shadowColor = A, l.shadowBlur = x) : l.shadowBlur = 0;
      for (let p = t.drawnSegments; p < f; p++) {
        const M = E[p * 4], q = E[p * 4 + 1], D = E[p * 4 + 2], O = E[p * 4 + 3];
        l.beginPath(), l.moveTo(M, q), l.lineTo(D, O), l.stroke();
      }
      l.shadowBlur = 0, t.drawnSegments = f, t.drawnSegments >= b && P && (t.waitTimer = 1200), a.current = requestAnimationFrame(k);
    }
    return a.current = requestAnimationFrame(k), () => {
      S.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const Ce = {
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
      axiom: a,
      rules: s,
      iterations: i,
      angle: l,
      lineWidth: d,
      color: n,
      backgroundColor: t,
      speed: e,
      autoReset: h,
      trailFade: u,
      glowEffect: v,
      glowBlur: S,
      width: L,
      height: T,
      className: k,
      style: B
    } = r, F = Ce[o ?? "default"] ?? Ce.default, A = X(null);
    return gt(y, () => A.current), Bn(A, {
      axiom: a ?? F.axiom,
      rules: s ?? F.rules,
      iterations: i ?? F.iterations,
      angle: l ?? F.angle,
      lineWidth: d ?? 1,
      color: n ?? "#ffffff",
      backgroundColor: t ?? "#111111",
      speed: e ?? 5,
      autoReset: h ?? !0,
      trailFade: u ?? 0,
      glowEffect: v ?? !1,
      glowBlur: S ?? 8
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: {
          width: L ?? "100%",
          height: T ?? "100%",
          display: "block",
          overflow: "hidden",
          ...B
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: A,
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
const kt = new Uint8Array(512);
(function() {
  const y = new Uint8Array(256);
  for (let a = 0; a < 256; a++) y[a] = a;
  let o = 12345;
  for (let a = 255; a > 0; a--) {
    o = o * 1664525 + 1013904223 >>> 0;
    const s = o % (a + 1);
    [y[a], y[s]] = [y[s], y[a]];
  }
  for (let a = 0; a < 256; a++) kt[a] = kt[a + 256] = y[a];
})();
function xe(r) {
  return r * r * (3 - 2 * r);
}
function In(r, y) {
  const o = Math.floor(r) & 255, a = Math.floor(y) & 255, s = r - Math.floor(r), i = y - Math.floor(y), l = xe(s), d = xe(i), n = kt[kt[o] + a & 255] / 255, t = kt[kt[o + 1] + a & 255] / 255, e = kt[kt[o] + a + 1 & 255] / 255, h = kt[kt[o + 1] + a + 1 & 255] / 255, u = n + (t - n) * l, v = e + (h - e) * l;
  return u + (v - u) * d;
}
function $n(r, y, o = 3) {
  let a = 0, s = 0.5, i = 1;
  for (let l = 0; l < o; l++)
    a += In(r * i, y * i) * s, s *= 0.5, i *= 2;
  return a;
}
const _t = Math.PI * 2;
function Tn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0;
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
    function e(k, B) {
      const { resolution: F } = o.current, A = Math.max(1, Math.round(k * F)), c = Math.max(1, Math.round(B * F));
      t.gridW = A, t.gridH = c;
      const g = new OffscreenCanvas(A, c), C = g.getContext("2d");
      t.offscreen = g, t.offCtx = C, t.imageData = C.createImageData(A, c);
    }
    function h(k, B) {
      const F = window.devicePixelRatio || 1;
      d = k, n = B, s.width = Math.round(d * F), s.height = Math.round(n * F), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(F, 0, 0, F, 0, 0), e(d, n);
    }
    const u = new ResizeObserver((k) => {
      const { width: B, height: F } = k[0].contentRect;
      B > 0 && F > 0 && h(B, F);
    });
    u.observe(i);
    const v = i.getBoundingClientRect();
    v.width > 0 && v.height > 0 && h(v.width, v.height);
    let S = 0, L = -1;
    function T(k) {
      const B = S ? Math.min(k - S, 50) : 16;
      S = k;
      const {
        segments: F,
        speed: A,
        colorA: c,
        colorB: g,
        backgroundColor: C,
        noiseScale: P,
        zoomSpeed: m,
        rotation: I,
        resolution: x,
        animated: R
      } = o.current;
      if (x !== L && (e(d, n), L = x), !R) {
        a.current = requestAnimationFrame(T);
        return;
      }
      const { gridW: E, gridH: b, imageData: w, offscreen: f, offCtx: p } = t;
      if (!w || !f || !p) {
        a.current = requestAnimationFrame(T);
        return;
      }
      const M = w.data, q = E / 2, D = b / 2, O = Math.min(q, D), W = Math.max(2, Math.round(F)), z = _t / W, $ = z / 2, Y = t.rotAngle, H = t.zoomPhase, G = t.time, [N, U, j] = bt([C], 0);
      for (let J = 0; J < b; J++)
        for (let V = 0; V < E; V++) {
          const Q = V - q, nt = J - D, K = Math.sqrt(Q * Q + nt * nt);
          if (K > O) {
            const mt = (J * E + V) * 4;
            M[mt] = N, M[mt + 1] = U, M[mt + 2] = j, M[mt + 3] = 255;
            continue;
          }
          let et = Math.atan2(nt, Q) - Y;
          et = (et % _t + _t) % _t;
          let tt = et % z;
          tt > $ && (tt = z - tt);
          const at = K / O * P + H, Z = tt * 8 + G * A, st = ($n(at, Z) * 2 - 1 + 1) / 2, [ct, lt, ut] = bt([g, c], st), pt = (J * E + V) * 4;
          M[pt] = ct, M[pt + 1] = lt, M[pt + 2] = ut, M[pt + 3] = 255;
        }
      p.putImageData(w, 0, 0), l.drawImage(f, 0, 0, d, n);
      const _ = B / 16;
      t.time += 0.02 * A * _, t.rotAngle += I * Math.PI / 180 * _, t.zoomPhase += m * 0.015 * _, a.current = requestAnimationFrame(T);
    }
    return a.current = requestAnimationFrame(T), () => {
      u.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [r]);
}
const Ln = {
  default: {},
  neon: { colorA: "#00ffff", colorB: "#ff00ff", backgroundColor: "#000000", segments: 8, speed: 1.5 },
  crystal: { colorA: "#88ccff", colorB: "#002244", backgroundColor: "#000510", segments: 12, noiseScale: 4 },
  void: { colorA: "#cc00ff", colorB: "#000000", backgroundColor: "#000000", segments: 6, rotation: 0.4 },
  fire: { colorA: "#ff8800", colorB: "#ff0000", backgroundColor: "#0a0000", segments: 6, speed: 2 },
  ice: { colorA: "#ffffff", colorB: "#002255", backgroundColor: "#000510", segments: 10, noiseScale: 2, zoomSpeed: 0.5 }
}, zn = ht(
  (r, y) => {
    const {
      preset: o,
      segments: a,
      speed: s,
      colorA: i,
      colorB: l,
      backgroundColor: d,
      noiseScale: n,
      zoomSpeed: t,
      rotation: e,
      resolution: h,
      animated: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && Ln[o] || {}, B = X(null);
    return gt(y, () => B.current), Tn(B, {
      segments: a ?? k.segments ?? 8,
      speed: s ?? k.speed ?? 1,
      colorA: i ?? k.colorA ?? "#e0e0ff",
      colorB: l ?? k.colorB ?? "#1a0a2e",
      backgroundColor: d ?? k.backgroundColor ?? "#111111",
      noiseScale: n ?? k.noiseScale ?? 2.5,
      zoomSpeed: t ?? k.zoomSpeed ?? 0.3,
      rotation: e ?? k.rotation ?? 0.2,
      resolution: h ?? 0.5,
      animated: u ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          ...T
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
zn.displayName = "Kaleidoscope";
function Dn(r, y, o) {
  return r.map((a, s) => {
    if (y === "cycle") {
      const l = a.hue / 60 % 6, d = l - Math.floor(l), n = 0, t = Math.round(255 * (1 - d) * 0.75), e = Math.round(255 * d * 0.75), h = 192, u = Math.floor(l);
      return (() => {
        switch (u) {
          case 0:
            return [h, e, n];
          case 1:
            return [t, h, n];
          case 2:
            return [n, h, e];
          case 3:
            return [n, t, h];
          case 4:
            return [e, n, h];
          default:
            return [h, n, t];
        }
      })();
    }
    if (y === "gradient") {
      const i = s / Math.max(1, r.length - 1);
      return bt([o, "#6b7280"], i);
    }
    return bt([o], 0);
  });
}
function qn(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0;
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
    function e(x, R, E) {
      const b = [];
      for (let w = 0; w < E; w++)
        b.push({
          gx: Math.random() * x,
          gy: Math.random() * R,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: w / E * 360
        });
      return b;
    }
    function h(x, R) {
      const { resolution: E, cellCount: b } = o.current, w = Math.max(1, Math.round(x * E)), f = Math.max(1, Math.round(R * E));
      t.gridW = w, t.gridH = f, t.cellIds = new Int16Array(w * f);
      const p = new OffscreenCanvas(w, f), M = p.getContext("2d");
      if (t.offscreen = p, t.offCtx = M, t.imageData = M.createImageData(w, f), t.seeds.length === 0)
        t.seeds = e(w, f, b);
      else {
        const q = t.gridW || w, D = t.gridH || f;
        for (const O of t.seeds)
          O.gx = O.gx / q * w, O.gy = O.gy / D * f;
      }
    }
    function u(x, R) {
      const E = window.devicePixelRatio || 1;
      d = x, n = R, s.width = Math.round(d * E), s.height = Math.round(n * E), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(E, 0, 0, E, 0, 0), h(d, n);
    }
    let v = !1, S = 0, L = 0;
    function T(x, R) {
      const { resolution: E } = o.current;
      return [x * E, R * E];
    }
    function k(x, R) {
      let E = -1, b = 1 / 0;
      for (let w = 0; w < t.seeds.length; w++) {
        const f = t.seeds[w], p = x - f.gx, M = R - f.gy, q = p * p + M * M;
        q < b && (b = q, E = w);
      }
      return E;
    }
    function B(x) {
      if (!o.current.interactive) return;
      const R = s.getBoundingClientRect(), E = x.clientX - R.left, b = x.clientY - R.top, [w, f] = T(E, b);
      S = w, L = f, v = !0;
      const p = k(w, f);
      if (p >= 0) {
        const M = t.seeds[p], q = w - M.gx, D = f - M.gy, O = (t.gridW * 0.15) ** 2;
        q * q + D * D < O && (t.dragIdx = p, t.isDragging = !0);
      }
      t.mouseGX = w, t.mouseGY = f;
    }
    function F(x) {
      if (!o.current.interactive) return;
      const R = s.getBoundingClientRect(), E = x.clientX - R.left, b = x.clientY - R.top, [w, f] = T(E, b);
      t.mouseGX = w, t.mouseGY = f, v && t.isDragging && t.dragIdx >= 0 && (t.seeds[t.dragIdx].gx = Math.max(0, Math.min(t.gridW - 1, w)), t.seeds[t.dragIdx].gy = Math.max(0, Math.min(t.gridH - 1, f)));
    }
    function A(x) {
      if (!o.current.interactive) return;
      const R = s.getBoundingClientRect(), E = x.clientX - R.left, b = x.clientY - R.top, [w, f] = T(E, b), p = Math.abs(w - S) + Math.abs(f - L);
      if (!t.isDragging && p < 2) {
        const { cellCount: M } = o.current;
        if (t.seeds.length < M * 2) {
          const q = t.seeds.length / (M || 1) * 360;
          t.seeds.push({
            gx: Math.max(0, Math.min(t.gridW - 1, w)),
            gy: Math.max(0, Math.min(t.gridH - 1, f)),
            vx: 0,
            vy: 0,
            hue: q
          });
        }
      }
      v = !1, t.isDragging = !1, t.dragIdx = -1;
    }
    s.addEventListener("mousedown", B), s.addEventListener("mousemove", F), s.addEventListener("mouseup", A);
    const c = new ResizeObserver((x) => {
      const { width: R, height: E } = x[0].contentRect;
      R > 0 && E > 0 && u(R, E);
    });
    c.observe(i);
    const g = i.getBoundingClientRect();
    g.width > 0 && g.height > 0 && u(g.width, g.height);
    let C = 0, P = -1, m = -1;
    function I(x) {
      const R = C ? Math.min(x - C, 50) : 16;
      C = x;
      const {
        cellCount: E,
        speed: b,
        colorMode: w,
        cellColor: f,
        backgroundColor: p,
        showEdges: M,
        edgeColor: q,
        resolution: D,
        relaxation: O,
        animated: W
      } = o.current;
      if (D !== P)
        t.seeds = [], h(d, n), P = D, m = E;
      else if (E !== m) {
        if (E > t.seeds.length) {
          const { gridW: tt, gridH: ot } = t;
          for (; t.seeds.length < E; ) {
            const at = t.seeds.length;
            t.seeds.push({
              gx: Math.random() * tt,
              gy: Math.random() * ot,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              hue: at / E * 360
            });
          }
        } else
          t.seeds.length = E;
        m = E;
      }
      const { seeds: z, gridW: $, gridH: Y, imageData: H, offscreen: G, offCtx: N, cellIds: U } = t;
      if (!H || !G || !N || z.length === 0) {
        a.current = requestAnimationFrame(I);
        return;
      }
      if (W) {
        const tt = R / 16;
        for (const ot of z)
          t.isDragging && z.indexOf(ot) === t.dragIdx || (ot.vx += (Math.random() - 0.5) * 0.05 * b, ot.vy += (Math.random() - 0.5) * 0.05 * b, ot.vx = Math.max(-0.5 * b, Math.min(0.5 * b, ot.vx)), ot.vy = Math.max(-0.5 * b, Math.min(0.5 * b, ot.vy)), ot.gx += ot.vx * tt, ot.gy += ot.vy * tt, ot.gx < 0 && (ot.gx = 0, ot.vx = Math.abs(ot.vx)), ot.gx >= $ && (ot.gx = $ - 1, ot.vx = -Math.abs(ot.vx)), ot.gy < 0 && (ot.gy = 0, ot.vy = Math.abs(ot.vy)), ot.gy >= Y && (ot.gy = Y - 1, ot.vy = -Math.abs(ot.vy)));
      }
      const j = Dn(z, w, f), [_, J, V] = bt([p], 0), [Q, nt, K] = bt([q], 0), et = H.data;
      for (let tt = 0; tt < Y; tt++)
        for (let ot = 0; ot < $; ot++) {
          let at = 1 / 0, Z = 0;
          for (let ut = 0; ut < z.length; ut++) {
            const pt = ot - z[ut].gx, mt = tt - z[ut].gy, wt = pt * pt + mt * mt;
            wt < at && (at = wt, Z = ut);
          }
          U[tt * $ + ot] = Z;
          const [rt, st, ct] = j[Z], lt = (tt * $ + ot) * 4;
          et[lt] = rt, et[lt + 1] = st, et[lt + 2] = ct, et[lt + 3] = 255;
        }
      if (W && O > 0) {
        const tt = new Float32Array(z.length), ot = new Float32Array(z.length), at = new Uint32Array(z.length);
        for (let Z = 0; Z < Y; Z++)
          for (let rt = 0; rt < $; rt++) {
            const st = U[Z * $ + rt];
            tt[st] += rt, ot[st] += Z, at[st]++;
          }
        for (let Z = 0; Z < z.length; Z++)
          t.isDragging && Z === t.dragIdx || at[Z] > 0 && (z[Z].gx += (tt[Z] / at[Z] - z[Z].gx) * O, z[Z].gy += (ot[Z] / at[Z] - z[Z].gy) * O);
      }
      if (M)
        for (let tt = 0; tt < Y; tt++)
          for (let ot = 0; ot < $; ot++) {
            const at = U[tt * $ + ot];
            if (ot > 0 && U[tt * $ + ot - 1] !== at || tt > 0 && U[(tt - 1) * $ + ot] !== at) {
              const rt = (tt * $ + ot) * 4;
              et[rt] = Q, et[rt + 1] = nt, et[rt + 2] = K, et[rt + 3] = 255;
            }
          }
      if (N.putImageData(H, 0, 0), l.drawImage(G, 0, 0, d, n), o.current.interactive) {
        l.save();
        for (let tt = 0; tt < z.length; tt++) {
          const ot = z[tt].gx / $ * d, at = z[tt].gy / Y * n;
          l.beginPath(), l.arc(ot, at, 3, 0, Math.PI * 2), l.fillStyle = "rgba(255,255,255,0.5)", l.fill();
        }
        l.restore();
      }
      a.current = requestAnimationFrame(I);
    }
    return a.current = requestAnimationFrame(I), () => {
      c.disconnect(), cancelAnimationFrame(a.current), s.removeEventListener("mousedown", B), s.removeEventListener("mousemove", F), s.removeEventListener("mouseup", A);
    };
  }, [r]);
}
const Wn = {
  default: {},
  "stained-glass": { colorMode: "cycle", edgeColor: "#111111", cellCount: 25 },
  neon: { colorMode: "cycle", backgroundColor: "#000000", edgeColor: "#000000", showEdges: !1 },
  frost: { colorMode: "gradient", cellColor: "#88ccff", backgroundColor: "#001833", edgeColor: "#ffffff" },
  ember: { colorMode: "cycle", backgroundColor: "#0a0200", edgeColor: "#0a0200", showEdges: !1 },
  void: { cellColor: "#ffffff", backgroundColor: "#000000", showEdges: !1 }
}, Yn = ht(
  (r, y) => {
    const {
      preset: o,
      cellCount: a,
      speed: s,
      colorMode: i,
      cellColor: l,
      backgroundColor: d,
      showEdges: n,
      edgeColor: t,
      resolution: e,
      relaxation: h,
      interactive: u,
      animated: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && Wn[o] || {}, F = X(null);
    return gt(y, () => F.current), qn(F, {
      cellCount: a ?? B.cellCount ?? 20,
      speed: s ?? 1,
      colorMode: i ?? B.colorMode ?? "solid",
      cellColor: l ?? B.cellColor ?? "#ffffff",
      backgroundColor: d ?? B.backgroundColor ?? "#111111",
      showEdges: n ?? B.showEdges ?? !0,
      edgeColor: t ?? B.edgeColor ?? "#333333",
      resolution: e ?? 1,
      relaxation: h ?? 0.05,
      interactive: u ?? !0,
      animated: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: {
          width: S ?? "100%",
          height: L ?? "100%",
          display: "block",
          overflow: "hidden",
          ...k
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
Yn.displayName = "VoronoiCells";
const Jt = Math.PI * 2;
function On(r, y) {
  const o = X(y);
  o.current = y;
  const a = X(0);
  ft(() => {
    const s = r.current;
    if (!s) return;
    const i = s.parentElement;
    if (!i) return;
    const l = s.getContext("2d");
    let d = 0, n = 0;
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
    function e(A, c, g, C, P) {
      const m = Math.round(C), I = Math.round(P);
      return m < 0 || m >= c || I < 0 || I >= g ? 0 : A[I * c + m];
    }
    function h(A, c) {
      const { resolution: g, agentCount: C } = o.current, P = Math.max(1, Math.round(A * g)), m = Math.max(1, Math.round(c * g));
      t.gridW = P, t.gridH = m, t.trail = new Float32Array(P * m), t.nextTrail = new Float32Array(P * m);
      const I = C;
      t.agents = new Float32Array(I * 3);
      const x = P / 2, R = m / 2, E = Math.min(P, m) * 0.25;
      for (let f = 0; f < I; f++) {
        const p = Math.random() * Jt, M = Math.random() * E;
        t.agents[f * 3] = x + Math.cos(p) * M, t.agents[f * 3 + 1] = R + Math.sin(p) * M, t.agents[f * 3 + 2] = Math.random() * Jt;
      }
      const b = new OffscreenCanvas(P, m), w = b.getContext("2d");
      t.offscreen = b, t.offCtx = w, t.imageData = w.createImageData(P, m);
    }
    function u(A, c) {
      const g = window.devicePixelRatio || 1;
      d = A, n = c, s.width = Math.round(d * g), s.height = Math.round(n * g), s.style.width = `${d}px`, s.style.height = `${n}px`, l.setTransform(g, 0, 0, g, 0, 0), h(d, n);
    }
    function v(A) {
      if (!o.current.interactive) return;
      const c = s.getBoundingClientRect(), g = A.clientX - c.left, C = A.clientY - c.top, { resolution: P } = o.current;
      t.mouseGX = g * P, t.mouseGY = C * P, t.mouseActive = !0;
    }
    function S() {
      t.mouseActive = !1;
    }
    s.addEventListener("mousemove", v), s.addEventListener("mouseleave", S);
    const L = new ResizeObserver((A) => {
      const { width: c, height: g } = A[0].contentRect;
      c > 0 && g > 0 && u(c, g);
    });
    L.observe(i);
    const T = i.getBoundingClientRect();
    T.width > 0 && T.height > 0 && u(T.width, T.height);
    let k = -1, B = -1;
    function F(A) {
      const {
        agentCount: c,
        sensorAngle: g,
        sensorDistance: C,
        stepSize: P,
        rotateSpeed: m,
        trailDecay: I,
        diffuseStrength: x,
        trailColor: R,
        backgroundColor: E,
        resolution: b,
        interactive: w,
        mouseRadius: f,
        mouseStrength: p,
        animated: M
      } = o.current;
      if (b !== k)
        h(d, n), k = b, B = c;
      else if (c !== B) {
        const K = c, et = t.agents, tt = new Float32Array(K * 3), ot = t.gridW, at = t.gridH;
        if (K > et.length / 3) {
          tt.set(et);
          for (let Z = et.length / 3; Z < K; Z++) {
            const rt = Math.random() * Jt, st = Math.random() * Math.min(ot, at) * 0.25;
            tt[Z * 3] = ot / 2 + Math.cos(rt) * st, tt[Z * 3 + 1] = at / 2 + Math.sin(rt) * st, tt[Z * 3 + 2] = Math.random() * Jt;
          }
        } else
          tt.set(et.subarray(0, K * 3));
        t.agents = tt, B = c;
      }
      if (!M) {
        a.current = requestAnimationFrame(F);
        return;
      }
      const { agents: q, trail: D, nextTrail: O, gridW: W, gridH: z, imageData: $, offscreen: Y, offCtx: H } = t;
      if (!$ || !Y || !H) {
        a.current = requestAnimationFrame(F);
        return;
      }
      const G = g * Math.PI / 180, N = m * Math.PI / 180, U = c;
      for (let K = 0; K < U; K++) {
        const et = q[K * 3], tt = q[K * 3 + 1], ot = Math.round(et), at = Math.round(tt);
        ot >= 0 && ot < W && at >= 0 && at < z && (D[at * W + ot] += 1);
      }
      if (w && t.mouseActive) {
        const K = f * b, et = K * K, tt = t.mouseGX, ot = t.mouseGY, at = Math.max(0, Math.floor(tt - K)), Z = Math.min(W - 1, Math.ceil(tt + K)), rt = Math.max(0, Math.floor(ot - K)), st = Math.min(z - 1, Math.ceil(ot + K));
        for (let ct = rt; ct <= st; ct++)
          for (let lt = at; lt <= Z; lt++) {
            const ut = lt - tt, pt = ct - ot;
            ut * ut + pt * pt <= et && (D[ct * W + lt] += p);
          }
      }
      const j = x, _ = 1 - j;
      for (let K = 0; K < z; K++)
        for (let et = 0; et < W; et++) {
          let tt = 0, ot = 0;
          for (let at = -1; at <= 1; at++)
            for (let Z = -1; Z <= 1; Z++) {
              const rt = et + Z, st = K + at;
              rt >= 0 && rt < W && st >= 0 && st < z && (tt += D[st * W + rt], ot++);
            }
          O[K * W + et] = (D[K * W + et] * _ + tt / ot * j) * I;
        }
      const J = t.trail;
      t.trail = t.nextTrail, t.nextTrail = J;
      const V = t.trail;
      for (let K = 0; K < U; K++) {
        const et = q[K * 3], tt = q[K * 3 + 1], ot = q[K * 3 + 2], at = e(
          V,
          W,
          z,
          et + Math.cos(ot - G) * C,
          tt + Math.sin(ot - G) * C
        ), Z = e(
          V,
          W,
          z,
          et + Math.cos(ot) * C,
          tt + Math.sin(ot) * C
        ), rt = e(
          V,
          W,
          z,
          et + Math.cos(ot + G) * C,
          tt + Math.sin(ot + G) * C
        );
        let st = ot;
        Z > at && Z > rt || (at > rt ? st -= N : rt > at ? st += N : st += (Math.random() - 0.5) * N), st += (Math.random() - 0.5) * 0.1;
        let ct = et + Math.cos(st) * P, lt = tt + Math.sin(st) * P;
        ct < 0 && (ct += W), ct >= W && (ct -= W), lt < 0 && (lt += z), lt >= z && (lt -= z), q[K * 3] = ct, q[K * 3 + 1] = lt, q[K * 3 + 2] = st;
      }
      const Q = $.data, nt = 5;
      for (let K = 0; K < z; K++)
        for (let et = 0; et < W; et++) {
          const tt = Math.min(V[K * W + et] / nt, 1), [ot, at, Z] = bt([E, R], tt), rt = (K * W + et) * 4;
          Q[rt] = ot, Q[rt + 1] = at, Q[rt + 2] = Z, Q[rt + 3] = 255;
        }
      H.putImageData($, 0, 0), l.drawImage(Y, 0, 0, d, n), a.current = requestAnimationFrame(F);
    }
    return a.current = requestAnimationFrame(F), () => {
      L.disconnect(), cancelAnimationFrame(a.current), s.removeEventListener("mousemove", v), s.removeEventListener("mouseleave", S);
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
}, Gn = ht(
  (r, y) => {
    const {
      preset: o,
      agentCount: a,
      sensorAngle: s,
      sensorDistance: i,
      stepSize: l,
      rotateSpeed: d,
      trailDecay: n,
      diffuseStrength: t,
      trailColor: e,
      backgroundColor: h,
      resolution: u,
      interactive: v,
      mouseRadius: S,
      mouseStrength: L,
      animated: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && Xn[o] || {}, g = X(null);
    return gt(y, () => g.current), On(g, {
      agentCount: a ?? c.agentCount ?? 1800,
      sensorAngle: s ?? 45,
      sensorDistance: i ?? 9,
      stepSize: l ?? 1.5,
      rotateSpeed: d ?? 45,
      trailDecay: n ?? c.trailDecay ?? 0.92,
      diffuseStrength: t ?? 0.2,
      trailColor: e ?? c.trailColor ?? "#ffffff",
      backgroundColor: h ?? c.backgroundColor ?? "#111111",
      resolution: u ?? 0.35,
      interactive: v ?? !0,
      mouseRadius: S ?? 20,
      mouseStrength: L ?? 3,
      animated: T ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: k ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          ...A
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
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
function Hn(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = 0, e = new Float32Array(0), h = new Float32Array(0), u = null;
    const v = document.createElement("canvas"), S = v.getContext("2d");
    let L = 0, T = 0, k = -1;
    function B() {
      const { resolution: b } = o.current;
      b === k && n > 0 || (k = b, n = Math.max(1, Math.round(l * b)), t = Math.max(1, Math.round(d * b)), e = new Float32Array(n * t), h = new Float32Array(n * t), v.width = n, v.height = t, u = S.createImageData(n, t));
    }
    function F(b, w) {
      const f = window.devicePixelRatio || 1;
      l = b, d = w, a.width = Math.round(b * f), a.height = Math.round(w * f), a.style.width = `${b}px`, a.style.height = `${w}px`, i.scale(f, f), k = -1, B();
    }
    const A = new ResizeObserver((b) => {
      const { width: w, height: f } = b[0].contentRect;
      w > 0 && f > 0 && F(w, f);
    });
    A.observe(s);
    const c = s.getBoundingClientRect();
    c.width > 0 && c.height > 0 && F(c.width, c.height);
    function g(b, w) {
      if (n === 0 || t === 0) return;
      const { inkRadius: f, inkStrength: p, resolution: M } = o.current, q = Math.round(b * M), D = Math.round(w * M), O = Math.max(1, Math.round(f * M)), W = O * O;
      for (let z = -O; z <= O; z++)
        for (let $ = -O; $ <= O; $++) {
          const Y = $ * $ + z * z;
          if (Y > W) continue;
          const H = q + $, G = D + z;
          if (H < 0 || H >= n || G < 0 || G >= t) continue;
          const N = Math.exp(-Y / (W * 0.5)), U = G * n + H;
          e[U] = Math.min(1, e[U] + p * N);
        }
    }
    let C = !1;
    function P(b) {
      if (!o.current.interactive) return;
      C = !0;
      const w = a.getBoundingClientRect();
      g(b.clientX - w.left, b.clientY - w.top);
    }
    function m(b) {
      if (!o.current.interactive || !C) return;
      const w = a.getBoundingClientRect();
      g(b.clientX - w.left, b.clientY - w.top);
    }
    function I() {
      C = !1;
    }
    function x(b) {
      if (!o.current.interactive) return;
      b.preventDefault();
      const w = a.getBoundingClientRect();
      g(b.touches[0].clientX - w.left, b.touches[0].clientY - w.top);
    }
    function R(b) {
      if (!o.current.interactive) return;
      b.preventDefault();
      const w = a.getBoundingClientRect();
      g(b.touches[0].clientX - w.left, b.touches[0].clientY - w.top);
    }
    s.addEventListener("mousedown", P), s.addEventListener("mousemove", m), window.addEventListener("mouseup", I), s.addEventListener("touchstart", x, { passive: !1 }), s.addEventListener("touchmove", R, { passive: !1 });
    function E(b) {
      const { diffusionRate: w, viscosity: f, evaporationRate: p, inkColor: M, paperColor: q, glowEffect: D, glowBlur: O, autoInk: W, autoInkInterval: z, animated: $ } = o.current;
      if (B(), W && l > 0 && b - T > z && (T = b, g(Math.random() * l, Math.random() * d)), $ && u && n > 0) {
        const Y = w * (1 - f * 0.4);
        for (let tt = 0; tt < t; tt++)
          for (let ot = 0; ot < n; ot++) {
            const at = tt * n + ot;
            let Z = 0, rt = 0;
            for (let st = -1; st <= 1; st++)
              for (let ct = -1; ct <= 1; ct++) {
                const lt = ot + ct, ut = tt + st;
                if (lt < 0 || lt >= n || ut < 0 || ut >= t) continue;
                const pt = ct === 0 && st === 0 ? 4 : ct !== 0 && st !== 0 ? 0.7 : 1;
                Z += e[ut * n + lt] * pt, rt += pt;
              }
            h[at] = e[at] + (Z / rt - e[at]) * Y, h[at] *= 1 - p, h[at] < 0 ? h[at] = 0 : h[at] > 1 && (h[at] = 1);
          }
        const H = e;
        e = h, h = H;
        const [G, N, U] = bt([q], 0), [j, _, J] = bt([M], 0), V = j - G, Q = _ - N, nt = J - U, K = u.data, et = n * t;
        for (let tt = 0; tt < et; tt++) {
          const ot = e[tt], at = tt * 4;
          K[at] = G + V * ot | 0, K[at + 1] = N + Q * ot | 0, K[at + 2] = U + nt * ot | 0, K[at + 3] = 255;
        }
        S.putImageData(u, 0, 0), i.save(), D && (i.shadowBlur = O, i.shadowColor = M), i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "medium", i.drawImage(v, 0, 0, l, d), i.restore();
      }
      L = requestAnimationFrame(E);
    }
    return L = requestAnimationFrame(E), () => {
      A.disconnect(), cancelAnimationFrame(L), s.removeEventListener("mousedown", P), s.removeEventListener("mousemove", m), window.removeEventListener("mouseup", I), s.removeEventListener("touchstart", x), s.removeEventListener("touchmove", R);
    };
  }, [r]);
}
const Nn = {
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
  (r, y) => {
    const {
      preset: o,
      inkColor: a,
      paperColor: s,
      diffusionRate: i,
      viscosity: l,
      evaporationRate: d,
      inkRadius: n,
      inkStrength: t,
      interactive: e,
      autoInk: h,
      autoInkInterval: u,
      resolution: v,
      glowEffect: S,
      glowBlur: L,
      animated: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && Nn[o] || {}, g = X(null);
    return gt(y, () => g.current), Hn(g, {
      inkColor: a ?? c.inkColor ?? "#ffffff",
      paperColor: s ?? c.paperColor ?? "#111111",
      diffusionRate: i ?? c.diffusionRate ?? 0.3,
      viscosity: l ?? c.viscosity ?? 0.8,
      evaporationRate: d ?? c.evaporationRate ?? 2e-3,
      inkRadius: n ?? 8,
      inkStrength: t ?? 1,
      interactive: e ?? !0,
      autoInk: h ?? !0,
      autoInkInterval: u ?? 2e3,
      resolution: v ?? 0.5,
      glowEffect: S ?? c.glowEffect ?? !1,
      glowBlur: L ?? c.glowBlur ?? 8,
      animated: T ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: k ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: e ?? !0 ? "crosshair" : "default",
          ...A
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
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
const Pe = 24;
function Un(r) {
  return Array.from({ length: Pe }, () => 1 + (Math.random() * 2 - 1) * r);
}
function Re(r, y, o, a, s) {
  const i = Pe;
  r.beginPath();
  for (let l = 0; l <= i; l++) {
    const d = l % i, n = d / i * Math.PI * 2, t = a * s[d], e = y + Math.cos(n) * t, h = o + Math.sin(n) * t;
    l === 0 ? r.moveTo(e, h) : r.lineTo(e, h);
  }
  r.closePath();
}
function Vn(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = 0;
    const e = [];
    function h(F, A) {
      const c = window.devicePixelRatio || 1;
      l = F, d = A, a.width = Math.round(F * c), a.height = Math.round(A * c), a.style.width = `${F}px`, a.style.height = `${A}px`, i.scale(c, c);
    }
    const u = new ResizeObserver((F) => {
      const { width: A, height: c } = F[0].contentRect;
      A > 0 && c > 0 && h(A, c);
    });
    u.observe(s);
    const v = s.getBoundingClientRect();
    v.width > 0 && v.height > 0 && h(v.width, v.height);
    function S(F, A) {
      const { colors: c, bloomRadius: g, noiseAmount: C, maxBlooms: P } = o.current;
      e.length >= P && e.splice(0, 1), e.push({
        x: F,
        y: A,
        colorIdx: Math.floor(Math.random() * c.length),
        radius: 0,
        maxRadius: g * (0.7 + Math.random() * 0.6),
        opacity: o.current.opacity,
        noiseRadii: Un(C),
        born: !1
      });
    }
    function L(F) {
      if (!o.current.interactive) return;
      const A = a.getBoundingClientRect();
      S(F.clientX - A.left, F.clientY - A.top);
    }
    function T(F) {
      if (!o.current.interactive) return;
      F.preventDefault();
      const A = a.getBoundingClientRect();
      S(F.touches[0].clientX - A.left, F.touches[0].clientY - A.top);
    }
    s.addEventListener("mousedown", L), s.addEventListener("touchstart", T, { passive: !1 });
    function k(F) {
      const { colors: A, backgroundColor: c, bloomSpeed: g, opacity: C, wetEdge: P, layerCount: m, fadeSpeed: I, autoBloom: x, autoBloomInterval: R, animated: E } = o.current;
      if (x && l > 0 && F - t > R && (t = F, S(Math.random() * l, Math.random() * d)), !E) {
        n = requestAnimationFrame(k);
        return;
      }
      i.fillStyle = c, i.fillRect(0, 0, l, d), i.save();
      for (let b = e.length - 1; b >= 0; b--) {
        const w = e[b], f = A[w.colorIdx] ?? A[0];
        if (w.radius < w.maxRadius ? w.radius = Math.min(w.maxRadius, w.radius + g * 0.8) : w.opacity = Math.max(0, w.opacity - I), w.opacity <= 0) {
          e.splice(b, 1);
          continue;
        }
        for (let p = 0; p < m; p++) {
          const M = (p + 1) / m, q = w.radius * M, D = p === m - 1, O = w.opacity * (D ? 0.3 + P * 0.7 : 0.08);
          i.fillStyle = Rt(f, O), Re(i, w.x, w.y, q, w.noiseRadii), i.fill();
        }
        P > 0.05 && (i.strokeStyle = Rt(f, w.opacity * P * 0.4), i.lineWidth = 2 + P * 3, Re(i, w.x, w.y, w.radius * 1.02, w.noiseRadii), i.stroke());
      }
      i.restore(), n = requestAnimationFrame(k);
    }
    const B = setTimeout(() => {
      l > 0 && d > 0 && (S(l * 0.3, d * 0.4), S(l * 0.7, d * 0.6));
    }, 100);
    return n = requestAnimationFrame(k), () => {
      u.disconnect(), cancelAnimationFrame(n), clearTimeout(B), s.removeEventListener("mousedown", L), s.removeEventListener("touchstart", T);
    };
  }, [r]);
}
const _n = {
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
}, Jn = ht(
  (r, y) => {
    const {
      preset: o,
      colors: a,
      backgroundColor: s,
      bloomRadius: i,
      bloomSpeed: l,
      opacity: d,
      wetEdge: n,
      layerCount: t,
      noiseAmount: e,
      fadeSpeed: h,
      interactive: u,
      autoBloom: v,
      autoBloomInterval: S,
      resolution: L,
      animated: T,
      maxBlooms: k,
      width: B,
      height: F,
      className: A,
      style: c
    } = r, g = o && _n[o] || {}, C = X(null);
    return gt(y, () => C.current), Vn(C, {
      colors: a ?? g.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      backgroundColor: s ?? g.backgroundColor ?? "#111111",
      bloomRadius: i ?? g.bloomRadius ?? 80,
      bloomSpeed: l ?? 0.5,
      opacity: d ?? g.opacity ?? 0.15,
      wetEdge: n ?? g.wetEdge ?? 0.4,
      layerCount: t ?? g.layerCount ?? 6,
      noiseAmount: e ?? g.noiseAmount ?? 0.5,
      fadeSpeed: h ?? 1e-3,
      interactive: u ?? !0,
      autoBloom: v ?? !0,
      autoBloomInterval: S ?? 1500,
      resolution: L ?? 0.5,
      animated: T ?? !0,
      maxBlooms: k ?? 12
    }), /* @__PURE__ */ it(
      "div",
      {
        className: A,
        style: {
          width: B ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: u ?? !0 ? "crosshair" : "default",
          ...c
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: C,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Jn.displayName = "WatercolorBloom";
function Se(r) {
  const y = r.replace("#", ""), o = parseInt(y.slice(0, 2), 16) || 0, a = parseInt(y.slice(2, 4), 16) || 0, s = parseInt(y.slice(4, 6), 16) || 0;
  return [o, a, s];
}
function Kn(r, y, o) {
  const a = Math.round(r[0] + (y[0] - r[0]) * o), s = Math.round(r[1] + (y[1] - r[1]) * o), i = Math.round(r[2] + (y[2] - r[2]) * o);
  return `rgb(${a},${s},${i})`;
}
function Qn(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = 0, e = 0, h = 0, u = 0, v = !1;
    function S() {
      t = 0, e = 0, v = !1;
    }
    function L(c, g) {
      const C = window.devicePixelRatio || 1;
      l = c, d = g, a.width = Math.round(c * C), a.height = Math.round(g * C), a.style.width = `${c}px`, a.style.height = `${g}px`, i.scale(C, C), i.fillStyle = o.current.backgroundColor, i.fillRect(0, 0, c, g), S();
    }
    const T = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && L(g, C);
    });
    T.observe(s);
    const k = s.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B(c, g) {
      const { color: C, color2: P, colorMode: m } = o.current;
      if (m === "cycle")
        return `hsl(${c * 360 % 360},80%,65%)`;
      if (m === "gradient") {
        const I = Se(C), x = Se(P);
        return Kn(I, x, (Math.sin(g * Math.PI * 2) + 1) * 0.5);
      }
      return C;
    }
    let F = 0;
    function A(c) {
      const g = F ? c - F : 16;
      F = c;
      const { backgroundColor: C, lineWidth: P, trailFade: m, speed: I, damping: x, freq1: R, freq2: E, freq3: b, amplitude: w, glowEffect: f, glowBlur: p, animated: M, autoReset: q } = o.current;
      if (!M) {
        n = requestAnimationFrame(A);
        return;
      }
      i.fillStyle = Rt(C, m), i.fillRect(0, 0, l, d);
      const D = Math.max(1, Math.round(I * g * 0.5)), O = l / 2, W = d / 2, z = Math.min(O, W) * w;
      for (let $ = 0; $ < D; $++) {
        const Y = Math.pow(x, e), H = Math.sin(b * t) * Math.PI, G = O + z * Math.sin(R * t + H) * Y, N = W + z * Math.sin(E * t) * Y;
        if (!v)
          h = G, u = N, v = !0;
        else {
          const U = t * 0.01 % 1, j = t * 5e-3 % 1;
          i.strokeStyle = B(U, j), i.lineWidth = P, i.lineCap = "round", f ? (i.shadowBlur = p, i.shadowColor = o.current.color) : i.shadowBlur = 0, i.beginPath(), i.moveTo(h, u), i.lineTo(G, N), i.stroke();
        }
        if (h = G, u = N, t += 0.02, e++, q && e > 100 && Y < 0.01) {
          i.fillStyle = C, i.fillRect(0, 0, l, d), S();
          break;
        }
      }
      n = requestAnimationFrame(A);
    }
    return n = requestAnimationFrame(A), () => {
      T.disconnect(), cancelAnimationFrame(n);
    };
  }, [r]);
}
const Zn = {
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
}, tr = ht(
  (r, y) => {
    const {
      preset: o,
      color: a,
      color2: s,
      backgroundColor: i,
      lineWidth: l,
      trailFade: d,
      speed: n,
      damping: t,
      freq1: e,
      freq2: h,
      freq3: u,
      amplitude: v,
      colorMode: S,
      glowEffect: L,
      glowBlur: T,
      animated: k,
      autoReset: B,
      width: F,
      height: A,
      className: c,
      style: g
    } = r, C = o && Zn[o] || {}, P = X(null);
    return gt(y, () => P.current), Qn(P, {
      color: a ?? C.color ?? "#ffffff",
      color2: s ?? C.color2 ?? "#6b7280",
      backgroundColor: i ?? C.backgroundColor ?? "#111111",
      lineWidth: l ?? C.lineWidth ?? 1,
      trailFade: d ?? C.trailFade ?? 0.01,
      speed: n ?? 1,
      damping: t ?? C.damping ?? 0.9995,
      freq1: e ?? C.freq1 ?? 2,
      freq2: h ?? C.freq2 ?? 3,
      freq3: u ?? C.freq3 ?? 0.01,
      amplitude: v ?? 0.9,
      colorMode: S ?? C.colorMode ?? "solid",
      glowEffect: L ?? C.glowEffect ?? !1,
      glowBlur: T ?? C.glowBlur ?? 10,
      animated: k ?? !0,
      autoReset: B ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: c,
        style: {
          width: F ?? "100%",
          height: A ?? "100%",
          display: "block",
          overflow: "hidden",
          ...g
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: P,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
tr.displayName = "PendulaWave";
const Ht = 0, Tt = 1, ee = 2;
function er(r, y) {
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
function or(r, y) {
  const { grid: o, frontier: a, gridW: s, gridH: i } = r, l = y % s, d = y / s | 0;
  l > 0 && o[y - 1] === Ht && (o[y - 1] = Tt, a.add(y - 1), r.frontierDirty = !0), l < s - 1 && o[y + 1] === Ht && (o[y + 1] = Tt, a.add(y + 1), r.frontierDirty = !0), d > 0 && o[y - s] === Ht && (o[y - s] = Tt, a.add(y - s), r.frontierDirty = !0), d < i - 1 && o[y + s] === Ht && (o[y + s] = Tt, a.add(y + s), r.frontierDirty = !0);
}
function Zt(r, y, o, a, s) {
  const i = r.gridW / 2, l = r.gridH / 2, d = Math.PI * 2 / a, n = y - i, t = o - l;
  for (let e = 0; e < a; e++) {
    const h = e * d, u = Math.round(i + n * Math.cos(h) - t * Math.sin(h)), v = Math.round(l + n * Math.sin(h) + t * Math.cos(h));
    if (u < 0 || u >= r.gridW || v < 0 || v >= r.gridH) continue;
    const S = v * r.gridW + u;
    r.grid[S] !== ee && (r.grid[S] = ee, r.age[S] = s, s > r.maxAge && (r.maxAge = s), r.frontier.delete(S), r.frontierDirty = !0, or(r, S));
  }
}
function nr(r, y) {
  Zt(r, r.gridW / 2 | 0, r.gridH / 2 | 0, y, 0);
}
function rr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = 0, e = null;
    const h = document.createElement("canvas"), u = h.getContext("2d");
    let v = null;
    function S(c, g) {
      const { cellSize: C, symmetry: P } = o.current, m = 300, I = Math.max(1, Math.min(m, Math.floor(c / C))), x = Math.max(1, Math.min(m, Math.floor(g / C)));
      e = er(I, x), h.width = I, h.height = x, v = u.createImageData(I, x), t = 0, nr(e, P);
    }
    function L(c, g) {
      const C = window.devicePixelRatio || 1;
      l = c, d = g, a.width = Math.round(c * C), a.height = Math.round(g * C), a.style.width = `${c}px`, a.style.height = `${g}px`, i.scale(C, C), S(c, g);
    }
    const T = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && L(g, C);
    });
    T.observe(s);
    const k = s.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B(c) {
      if (!o.current.interactive || !e) return;
      const g = a.getBoundingClientRect(), { cellSize: C, symmetry: P } = o.current, m = Math.floor((c.clientX - g.left) / C), I = Math.floor((c.clientY - g.top) / C);
      Zt(e, m, I, P, ++t);
    }
    function F(c) {
      if (!o.current.interactive || !e) return;
      c.preventDefault();
      const g = a.getBoundingClientRect(), { cellSize: C, symmetry: P } = o.current, m = Math.floor((c.touches[0].clientX - g.left) / C), I = Math.floor((c.touches[0].clientY - g.top) / C);
      Zt(e, m, I, P, ++t);
    }
    s.addEventListener("mousedown", B), s.addEventListener("touchstart", F, { passive: !1 });
    function A() {
      if (!e || !v) {
        n = requestAnimationFrame(A);
        return;
      }
      const { crystalColor: c, activeColor: g, backgroundColor: C, growthSpeed: P, symmetry: m, branchProbability: I, noiseAmount: x, colorMode: R, glowEffect: E, glowBlur: b, animated: w, autoReset: f } = o.current, { grid: p, age: M, frontier: q, gridW: D, gridH: O } = e;
      if (w && q.size > 0) {
        e.frontierDirty && (e.frontierArr = Array.from(q), e.frontierDirty = !1);
        const Q = e.frontierArr, nt = Math.min(Math.round(P), 50, Q.length);
        for (let K = 0; K < nt && Q.length !== 0; K++) {
          const et = Math.random() * Q.length | 0, tt = Q[et];
          if (p[tt] !== Tt) {
            q.delete(tt), Q.splice(et, 1), K--;
            continue;
          }
          let ot = tt % D, at = tt / D | 0;
          if (x > 0 && Math.random() < x) {
            const Z = Math.max(0, Math.min(D - 1, ot + Math.round((Math.random() * 2 - 1) * 2))), rt = Math.max(0, Math.min(O - 1, at + Math.round((Math.random() * 2 - 1) * 2)));
            p[rt * D + Z] !== ee && (ot = Z, at = rt);
          }
          if (t++, Zt(e, ot, at, m, t), Q.splice(et, 1), Math.random() < I) {
            const Z = [[-2, 0], [2, 0], [0, -2], [0, 2]], [rt, st] = Z[Math.random() * 4 | 0], ct = Math.max(0, Math.min(D - 1, ot + rt)), ut = Math.max(0, Math.min(O - 1, at + st)) * D + ct;
            p[ut] === Ht && (p[ut] = Tt, q.add(ut), Q.push(ut));
          }
        }
        if (f && q.size === 0) {
          S(l, d), n = requestAnimationFrame(A);
          return;
        }
      }
      const [W, z, $] = bt([C], 0), [Y, H, G] = bt([c], 0), [N, U, j] = bt([g], 0), _ = v.data, J = D * O, V = e.maxAge || 1;
      for (let Q = 0; Q < J; Q++) {
        const nt = p[Q];
        let K, et, tt;
        if (nt === ee)
          if (R === "age") {
            const at = M[Q] / V;
            [K, et, tt] = bt([c, g, C], at);
          } else if (R === "cycle") {
            const at = M[Q] / V;
            K = 128 + 127 * Math.cos(at * Math.PI * 2) | 0, et = 128 + 127 * Math.cos(at * Math.PI * 2 + 2.094) | 0, tt = 128 + 127 * Math.cos(at * Math.PI * 2 + 4.189) | 0;
          } else
            K = Y, et = H, tt = G;
        else nt === Tt ? (K = N, et = U, tt = j) : (K = W, et = z, tt = $);
        const ot = Q * 4;
        _[ot] = K, _[ot + 1] = et, _[ot + 2] = tt, _[ot + 3] = 255;
      }
      u.putImageData(v, 0, 0), i.save(), E ? (i.shadowBlur = b, i.shadowColor = c) : i.shadowBlur = 0, i.imageSmoothingEnabled = !1, i.drawImage(h, 0, 0, l, d), i.restore(), n = requestAnimationFrame(A);
    }
    return n = requestAnimationFrame(A), () => {
      T.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousedown", B), s.removeEventListener("touchstart", F);
    };
  }, [r]);
}
const ar = {
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
}, ir = ht(
  (r, y) => {
    const {
      preset: o,
      crystalColor: a,
      activeColor: s,
      backgroundColor: i,
      growthSpeed: l,
      symmetry: d,
      branchProbability: n,
      noiseAmount: t,
      cellSize: e,
      glowEffect: h,
      glowBlur: u,
      interactive: v,
      autoReset: S,
      colorMode: L,
      animated: T,
      width: k,
      height: B,
      className: F,
      style: A
    } = r, c = o && ar[o] || {}, g = X(null);
    return gt(y, () => g.current), rr(g, {
      crystalColor: a ?? c.crystalColor ?? "#ffffff",
      activeColor: s ?? c.activeColor ?? "#6b7280",
      backgroundColor: i ?? c.backgroundColor ?? "#111111",
      growthSpeed: l ?? 3,
      symmetry: d ?? c.symmetry ?? 6,
      branchProbability: n ?? c.branchProbability ?? 0.3,
      noiseAmount: t ?? c.noiseAmount ?? 0.2,
      cellSize: e ?? c.cellSize ?? 3,
      glowEffect: h ?? c.glowEffect ?? !0,
      glowBlur: u ?? c.glowBlur ?? 12,
      interactive: v ?? !0,
      autoReset: S ?? !0,
      colorMode: L ?? c.colorMode ?? "solid",
      animated: T ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: F,
        style: {
          width: k ?? "100%",
          height: B ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: v ?? !0 ? "crosshair" : "default",
          ...A
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: g,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ir.displayName = "CrystalGrowth";
const ke = 300;
function sr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = 0, e = -1, h = [], u = [];
    const v = /* @__PURE__ */ new Set();
    function S(x, R) {
      return x * 1e4 + R;
    }
    function L(x, R) {
      const { nodeCount: E, wanderSpeed: b } = o.current;
      h = Array.from({ length: E }, () => ({
        x: Math.random() * x,
        y: Math.random() * R,
        vx: (Math.random() - 0.5) * b,
        vy: (Math.random() - 0.5) * b,
        flash: 0
      })), u = [], v.clear();
    }
    function T(x, R) {
      const E = window.devicePixelRatio || 1;
      l = x, d = R, a.width = Math.round(x * E), a.height = Math.round(R * E), a.style.width = `${x}px`, a.style.height = `${R}px`, i.scale(E, E), L(x, R);
    }
    const k = new ResizeObserver((x) => {
      const { width: R, height: E } = x[0].contentRect;
      R > 0 && E > 0 && T(R, E);
    });
    k.observe(s);
    const B = s.getBoundingClientRect();
    B.width > 0 && B.height > 0 && T(B.width, B.height);
    function F(x, R) {
      const { connectionRadius: E, pulseDecay: b } = o.current;
      if (R < 0.05 || u.length >= ke) return;
      h[x].flash = Math.max(h[x].flash, R);
      const w = E * E, f = R * b;
      if (!(f < 0.05))
        for (let p = 0; p < h.length; p++) {
          if (p === x) continue;
          if (u.length >= ke) break;
          const M = h[p].x - h[x].x, q = h[p].y - h[x].y;
          if (M * M + q * q > w) continue;
          const D = S(x, p);
          v.has(D) || (v.add(D), u.push({ fromIdx: x, toIdx: p, progress: 0, strength: f }));
        }
    }
    function A(x, R) {
      let E = -1, b = 1 / 0;
      for (let w = 0; w < h.length; w++) {
        const f = h[w].x - x, p = h[w].y - R, M = f * f + p * p;
        M < b && (b = M, E = w);
      }
      return E;
    }
    function c(x) {
      if (!o.current.interactive) return;
      const R = a.getBoundingClientRect();
      e = A(x.clientX - R.left, x.clientY - R.top);
    }
    function g() {
      e = -1;
    }
    function C(x) {
      if (!o.current.interactive) return;
      const R = a.getBoundingClientRect(), E = A(x.clientX - R.left, x.clientY - R.top);
      E >= 0 && F(E, 1);
    }
    function P(x) {
      if (!o.current.interactive) return;
      x.preventDefault();
      const R = a.getBoundingClientRect(), E = A(x.touches[0].clientX - R.left, x.touches[0].clientY - R.top);
      E >= 0 && F(E, 1);
    }
    s.addEventListener("mousemove", c), s.addEventListener("mouseleave", g), s.addEventListener("mousedown", C), s.addEventListener("touchstart", P, { passive: !1 });
    let m = 0;
    function I(x) {
      const R = m ? Math.min(x - m, 50) : 16;
      m = x;
      const { nodeColor: E, edgeColor: b, signalColor: w, backgroundColor: f, connectionRadius: p, nodeRadius: M, lineWidth: q, speed: D, pulseInterval: O, glowEffect: W, glowBlur: z, animated: $, wander: Y, wanderSpeed: H } = o.current;
      if (h.length > 0 && x - t > O && (t = x, F(Math.random() * h.length | 0, 1)), i.fillStyle = f, i.fillRect(0, 0, l, d), !$) {
        n = requestAnimationFrame(I);
        return;
      }
      if (Y) {
        const U = H * 2;
        for (const j of h)
          j.vx += (Math.random() - 0.5) * 0.05 * H, j.vy += (Math.random() - 0.5) * 0.05 * H, j.vx > U ? j.vx = U : j.vx < -U && (j.vx = -U), j.vy > U ? j.vy = U : j.vy < -U && (j.vy = -U), j.x += j.vx * R * 0.016, j.y += j.vy * R * 0.016, j.x < 0 ? (j.x = 0, j.vx = Math.abs(j.vx)) : j.x > l && (j.x = l, j.vx = -Math.abs(j.vx)), j.y < 0 ? (j.y = 0, j.vy = Math.abs(j.vy)) : j.y > d && (j.y = d, j.vy = -Math.abs(j.vy));
      }
      i.save(), i.lineWidth = q;
      const G = p * p;
      for (let U = 0; U < h.length; U++)
        for (let j = U + 1; j < h.length; j++) {
          const _ = h[j].x - h[U].x, J = h[j].y - h[U].y, V = _ * _ + J * J;
          if (V > G) continue;
          const Q = (1 - Math.sqrt(V) / p) * 0.4;
          i.strokeStyle = Rt(b, Q), i.beginPath(), i.moveTo(h[U].x, h[U].y), i.lineTo(h[j].x, h[j].y), i.stroke();
        }
      i.restore(), i.save(), W && (i.shadowBlur = z, i.shadowColor = w);
      const N = D * R * 8e-4;
      for (let U = u.length - 1; U >= 0; U--) {
        const j = u[U];
        if (j.progress += N, j.progress >= 1) {
          v.delete(S(j.fromIdx, j.toIdx)), u.splice(U, 1), F(j.toIdx, j.strength);
          continue;
        }
        const _ = h[j.fromIdx], J = h[j.toIdx], V = _.x + (J.x - _.x) * j.progress, Q = _.y + (J.y - _.y) * j.progress;
        i.fillStyle = Rt(w, j.strength * 0.9), i.beginPath(), i.arc(V, Q, M * 0.6, 0, Math.PI * 2), i.fill();
      }
      i.shadowBlur = 0, i.restore(), i.save();
      for (let U = 0; U < h.length; U++) {
        const j = h[U], _ = U === e, J = j.flash;
        j.flash = Math.max(0, J - 0.03);
        const V = 0.4 + J * 0.6, Q = M * (_ ? 1.5 : 1) * (1 + J * 0.4);
        W && (_ || J > 0.1) ? (i.shadowBlur = z * (0.5 + J * 0.5), i.shadowColor = E) : i.shadowBlur = 0, i.fillStyle = Rt(E, V), i.beginPath(), i.arc(j.x, j.y, Q, 0, Math.PI * 2), i.fill();
      }
      i.shadowBlur = 0, i.restore(), n = requestAnimationFrame(I);
    }
    return n = requestAnimationFrame(I), () => {
      k.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousemove", c), s.removeEventListener("mouseleave", g), s.removeEventListener("mousedown", C), s.removeEventListener("touchstart", P);
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
}, lr = ht(
  (r, y) => {
    const {
      preset: o,
      nodeCount: a,
      nodeColor: s,
      edgeColor: i,
      signalColor: l,
      backgroundColor: d,
      connectionRadius: n,
      nodeRadius: t,
      lineWidth: e,
      speed: h,
      pulseInterval: u,
      pulseDecay: v,
      glowEffect: S,
      glowBlur: L,
      interactive: T,
      animated: k,
      wander: B,
      wanderSpeed: F,
      width: A,
      height: c,
      className: g,
      style: C
    } = r, P = o && cr[o] || {}, m = X(null);
    return gt(y, () => m.current), sr(m, {
      nodeCount: a ?? 40,
      nodeColor: s ?? P.nodeColor ?? "#ffffff",
      edgeColor: i ?? P.edgeColor ?? "#6b7280",
      signalColor: l ?? P.signalColor ?? "#ffffff",
      backgroundColor: d ?? P.backgroundColor ?? "#111111",
      connectionRadius: n ?? P.connectionRadius ?? 150,
      nodeRadius: t ?? P.nodeRadius ?? 4,
      lineWidth: e ?? 1,
      speed: h ?? 1,
      pulseInterval: u ?? P.pulseInterval ?? 2e3,
      pulseDecay: v ?? P.pulseDecay ?? 0.85,
      glowEffect: S ?? P.glowEffect ?? !0,
      glowBlur: L ?? P.glowBlur ?? 15,
      interactive: T ?? !0,
      animated: k ?? !0,
      wander: B ?? !0,
      wanderSpeed: F ?? P.wanderSpeed ?? 0.3
    }), /* @__PURE__ */ it(
      "div",
      {
        className: g,
        style: {
          width: A ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: T ?? !0 ? "pointer" : "default",
          ...C
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: m,
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
function ur(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = -9999, e = -9999, h = [];
    const u = { text: "", fontSize: -1, cssW: -1, cssH: -1 };
    function v(g, C, P, m) {
      const I = document.createElement("canvas");
      I.width = P, I.height = m;
      const x = I.getContext("2d");
      x.clearRect(0, 0, P, m), x.fillStyle = "#ffffff";
      const R = Math.min(C, m * 0.85, P * 0.9);
      x.font = `bold ${R}px ${o.current.fontFamily}`, x.textAlign = "center", x.textBaseline = "middle", x.fillText(g, P / 2, m / 2);
      const { particleGap: E } = o.current, b = x.getImageData(0, 0, P, m).data, w = [];
      for (let f = 0; f < m; f += E)
        for (let p = 0; p < P; p += E)
          b[(f * P + p) * 4 + 3] > 128 && w.push({ x: p, y: f, targetX: p, targetY: f, vx: 0, vy: 0 });
      return w;
    }
    function S(g, C) {
      const P = window.devicePixelRatio || 1;
      l = g, d = C, a.width = Math.round(g * P), a.height = Math.round(C * P), a.style.width = `${g}px`, a.style.height = `${C}px`, i.scale(P, P), u.cssW = -1;
    }
    const L = new ResizeObserver((g) => {
      const { width: C, height: P } = g[0].contentRect;
      C > 0 && P > 0 && S(C, P);
    });
    L.observe(s);
    const T = s.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(g) {
      if (!o.current.interactive) return;
      const C = a.getBoundingClientRect();
      t = g.clientX - C.left, e = g.clientY - C.top;
    }
    function B() {
      t = -9999, e = -9999;
    }
    function F(g) {
      if (!o.current.interactive) return;
      g.preventDefault();
      const C = a.getBoundingClientRect();
      t = g.touches[0].clientX - C.left, e = g.touches[0].clientY - C.top;
    }
    function A() {
      t = -9999, e = -9999;
    }
    s.addEventListener("mousemove", k), s.addEventListener("mouseleave", B), s.addEventListener("touchmove", F, { passive: !1 }), s.addEventListener("touchend", A);
    function c() {
      const { text: g, fontSize: C, color: P, backgroundColor: m, particleSize: I, repelRadius: x, repelForce: R, snapSpeed: E, friction: b, glowEffect: w, glowBlur: f, animated: p } = o.current;
      if (l > 0 && d > 0 && (g !== u.text || C !== u.fontSize || l !== u.cssW || d !== u.cssH) && (u.text = g, u.fontSize = C, u.cssW = l, u.cssH = d, h = v(g, C, l, d)), i.fillStyle = m, i.fillRect(0, 0, l, d), !p || h.length === 0) {
        n = requestAnimationFrame(c);
        return;
      }
      const M = x * x;
      i.save(), w && (i.shadowBlur = f, i.shadowColor = P), i.fillStyle = Rt(P, 1);
      for (const q of h) {
        q.vx += (q.targetX - q.x) * E, q.vy += (q.targetY - q.y) * E;
        const D = q.x - t, O = q.y - e, W = D * D + O * O;
        if (W < M && W > 0) {
          const z = Math.sqrt(W), $ = (x - z) / x * R;
          q.vx += D / z * $, q.vy += O / z * $;
        }
        q.vx *= b, q.vy *= b, q.x += q.vx, q.y += q.vy, i.beginPath(), i.arc(q.x, q.y, I, 0, Math.PI * 2), i.fill();
      }
      i.restore(), n = requestAnimationFrame(c);
    }
    return n = requestAnimationFrame(c), () => {
      L.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousemove", k), s.removeEventListener("mouseleave", B), s.removeEventListener("touchmove", F), s.removeEventListener("touchend", A);
    };
  }, [r]);
}
const fr = {
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
}, dr = ht(
  (r, y) => {
    const {
      preset: o,
      text: a,
      fontSize: s,
      fontFamily: i,
      color: l,
      backgroundColor: d,
      particleSize: n,
      particleGap: t,
      repelRadius: e,
      repelForce: h,
      snapSpeed: u,
      friction: v,
      glowEffect: S,
      glowBlur: L,
      animated: T,
      interactive: k,
      width: B,
      height: F,
      className: A,
      style: c
    } = r, g = o && fr[o] || {}, C = X(null);
    return gt(y, () => C.current), ur(C, {
      text: a ?? "hello",
      fontSize: s ?? 120,
      fontFamily: i ?? "sans-serif",
      color: l ?? g.color ?? "#ffffff",
      backgroundColor: d ?? g.backgroundColor ?? "#111111",
      particleSize: n ?? g.particleSize ?? 2,
      particleGap: t ?? 4,
      repelRadius: e ?? g.repelRadius ?? 80,
      repelForce: h ?? g.repelForce ?? 5,
      snapSpeed: u ?? g.snapSpeed ?? 0.12,
      friction: v ?? 0.85,
      glowEffect: S ?? g.glowEffect ?? !1,
      glowBlur: L ?? g.glowBlur ?? 6,
      animated: T ?? !0,
      interactive: k ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: A,
        style: {
          width: B ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: k ?? !0 ? "crosshair" : "default",
          ...c
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: C,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
dr.displayName = "ParticleText";
function hr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = [], e = -1, h = 0, u = 0;
    const v = document.createElement("canvas"), S = v.getContext("2d");
    let L = null, T = 0, k = 0, B = -1;
    function F(f, p) {
      const { blobCount: M, minRadius: q, maxRadius: D, speed: O } = o.current;
      t = Array.from({ length: M }, () => {
        const W = q + Math.random() * (D - q);
        return {
          x: W + Math.random() * (f - W * 2),
          y: W + Math.random() * (p - W * 2),
          vx: (Math.random() - 0.5) * O * 2,
          vy: (Math.random() - 0.5) * O * 2,
          radius: W
        };
      });
    }
    function A(f, p) {
      const { resolution: M } = o.current;
      M === B && T > 0 || (B = M, T = Math.max(1, Math.round(f * M)), k = Math.max(1, Math.round(p * M)), v.width = T, v.height = k, L = S.createImageData(T, k));
    }
    function c(f, p) {
      const M = window.devicePixelRatio || 1;
      l = f, d = p, a.width = Math.round(f * M), a.height = Math.round(p * M), a.style.width = `${f}px`, a.style.height = `${p}px`, i.scale(M, M), B = -1, A(f, p), F(f, p);
    }
    const g = new ResizeObserver((f) => {
      const { width: p, height: M } = f[0].contentRect;
      p > 0 && M > 0 && c(p, M);
    });
    g.observe(s);
    const C = s.getBoundingClientRect();
    C.width > 0 && C.height > 0 && c(C.width, C.height);
    function P(f, p) {
      for (let M = 0; M < t.length; M++) {
        const q = t[M].x - f, D = t[M].y - p;
        if (q * q + D * D < t[M].radius * t[M].radius) return M;
      }
      return -1;
    }
    function m(f) {
      if (!o.current.interactive) return;
      const p = a.getBoundingClientRect(), M = f.clientX - p.left, q = f.clientY - p.top, D = P(M, q);
      if (D >= 0)
        e = D, h = M - t[D].x, u = q - t[D].y;
      else {
        const { minRadius: O, maxRadius: W } = o.current, z = O + Math.random() * (W - O);
        t.push({ x: M, y: q, vx: 0, vy: 0, radius: z });
      }
    }
    function I(f) {
      if (!o.current.interactive || e < 0) return;
      const p = a.getBoundingClientRect();
      t[e].x = f.clientX - p.left - h, t[e].y = f.clientY - p.top - u, t[e].vx = 0, t[e].vy = 0;
    }
    function x() {
      e = -1;
    }
    function R(f) {
      if (!o.current.interactive) return;
      f.preventDefault();
      const p = a.getBoundingClientRect(), M = f.touches[0].clientX - p.left, q = f.touches[0].clientY - p.top, D = P(M, q);
      D >= 0 && (e = D, h = M - t[D].x, u = q - t[D].y);
    }
    function E(f) {
      if (!o.current.interactive || e < 0) return;
      f.preventDefault();
      const p = a.getBoundingClientRect();
      t[e].x = f.touches[0].clientX - p.left - h, t[e].y = f.touches[0].clientY - p.top - u, t[e].vx = 0, t[e].vy = 0;
    }
    function b() {
      e = -1;
    }
    s.addEventListener("mousedown", m), s.addEventListener("mousemove", I), window.addEventListener("mouseup", x), s.addEventListener("touchstart", R, { passive: !1 }), s.addEventListener("touchmove", E, { passive: !1 }), s.addEventListener("touchend", b);
    function w() {
      const { blobCount: f, color: p, backgroundColor: M, threshold: q, speed: D, glowEffect: O, glowBlur: W, animated: z, resolution: $ } = o.current;
      if ($ !== B && (B = -1, A(l, d)), f !== t.length && e < 0 && l > 0) {
        for (; t.length < f; ) {
          const { minRadius: K, maxRadius: et } = o.current, tt = K + Math.random() * (et - K);
          t.push({
            x: tt + Math.random() * Math.max(1, l - tt * 2),
            y: tt + Math.random() * Math.max(1, d - tt * 2),
            vx: (Math.random() - 0.5) * D * 2,
            vy: (Math.random() - 0.5) * D * 2,
            radius: tt
          });
        }
        for (; t.length > f; ) t.pop();
      }
      if (i.fillStyle = M, i.fillRect(0, 0, l, d), !z || !L || T === 0) {
        n = requestAnimationFrame(w);
        return;
      }
      const Y = l / T, H = d / k;
      for (let K = 0; K < t.length; K++) {
        if (K === e) continue;
        const et = t[K];
        et.vx += (Math.random() - 0.5) * 0.1 * D, et.vy += (Math.random() - 0.5) * 0.1 * D;
        const tt = D * 2;
        et.vx > tt ? et.vx = tt : et.vx < -tt && (et.vx = -tt), et.vy > tt ? et.vy = tt : et.vy < -tt && (et.vy = -tt), et.x += et.vx, et.y += et.vy, et.x < et.radius ? (et.x = et.radius, et.vx = Math.abs(et.vx)) : et.x > l - et.radius && (et.x = l - et.radius, et.vx = -Math.abs(et.vx)), et.y < et.radius ? (et.y = et.radius, et.vy = Math.abs(et.vy)) : et.y > d - et.radius && (et.y = d - et.radius, et.vy = -Math.abs(et.vy));
      }
      const [G, N, U] = bt([M], 0), [j, _, J] = bt([p], 0), V = L.data, Q = q * 0.8, nt = q * 0.2;
      for (let K = 0; K < k; K++) {
        const et = K * H;
        for (let tt = 0; tt < T; tt++) {
          const ot = tt * Y;
          let at = 0;
          for (const st of t) {
            const ct = ot - st.x, lt = et - st.y, ut = ct * ct + lt * lt;
            if (ut < 1) {
              at = 99;
              break;
            }
            at += st.radius * st.radius / ut;
          }
          const Z = Math.min(1, Math.max(0, (at - Q) / nt)), rt = (K * T + tt) * 4;
          V[rt] = G + (j - G) * Z | 0, V[rt + 1] = N + (_ - N) * Z | 0, V[rt + 2] = U + (J - U) * Z | 0, V[rt + 3] = 255;
        }
      }
      S.putImageData(L, 0, 0), i.save(), O && (i.shadowBlur = W, i.shadowColor = p), i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "medium", i.drawImage(v, 0, 0, l, d), i.restore(), n = requestAnimationFrame(w);
    }
    return n = requestAnimationFrame(w), () => {
      g.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousedown", m), s.removeEventListener("mousemove", I), window.removeEventListener("mouseup", x), s.removeEventListener("touchstart", R), s.removeEventListener("touchmove", E), s.removeEventListener("touchend", b);
    };
  }, [r]);
}
const gr = {
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
}, pr = ht(
  (r, y) => {
    const {
      preset: o,
      blobCount: a,
      color: s,
      backgroundColor: i,
      threshold: l,
      speed: d,
      minRadius: n,
      maxRadius: t,
      glowEffect: e,
      glowBlur: h,
      resolution: u,
      animated: v,
      interactive: S,
      width: L,
      height: T,
      className: k,
      style: B
    } = r, F = o && gr[o] || {}, A = X(null);
    return gt(y, () => A.current), hr(A, {
      blobCount: a ?? 5,
      color: s ?? F.color ?? "#ffffff",
      backgroundColor: i ?? F.backgroundColor ?? "#111111",
      threshold: l ?? F.threshold ?? 1,
      speed: d ?? F.speed ?? 1,
      minRadius: n ?? F.minRadius ?? 40,
      maxRadius: t ?? F.maxRadius ?? 80,
      glowEffect: e ?? F.glowEffect ?? !0,
      glowBlur: h ?? F.glowBlur ?? 20,
      resolution: u ?? 0.4,
      animated: v ?? !0,
      interactive: S ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: {
          width: L ?? "100%",
          height: T ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: S ?? !0 ? "grab" : "default",
          ...B
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: A,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
pr.displayName = "Metaballs";
function mr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = [], e = [], h = new Float32Array(0), u = new Float32Array(0), v = 0, S = 0, L = 0, T = 0;
    const k = document.createElement("canvas"), B = k.getContext("2d");
    let F = null, A = -1;
    const c = 18, g = 12;
    function C(f, p) {
      const { resolution: M } = o.current;
      M === A && v > 0 || (A = M, v = Math.max(1, Math.round(f * M)), S = Math.max(1, Math.round(p * M)), h = new Float32Array(v * S), u = new Float32Array(v * S), k.width = v, k.height = S, F = B.createImageData(v, S));
    }
    function P(f, p) {
      const { antCount: M } = o.current;
      L = f / 2, T = p / 2, t = Array.from({ length: M }, () => ({
        x: L,
        y: T,
        angle: Math.random() * Math.PI * 2,
        hasFood: !1
      }));
    }
    function m(f, p) {
      const M = window.devicePixelRatio || 1;
      l = f, d = p, a.width = Math.round(f * M), a.height = Math.round(p * M), a.style.width = `${f}px`, a.style.height = `${p}px`, i.scale(M, M), A = -1, C(f, p), P(f, p), e = [];
    }
    const I = new ResizeObserver((f) => {
      const { width: p, height: M } = f[0].contentRect;
      p > 0 && M > 0 && m(p, M);
    });
    I.observe(s);
    const x = s.getBoundingClientRect();
    x.width > 0 && x.height > 0 && m(x.width, x.height);
    function R(f) {
      if (!o.current.interactive) return;
      const p = a.getBoundingClientRect(), M = f.clientX - p.left, q = f.clientY - p.top;
      e.length < o.current.maxFood && e.push({ x: M, y: q, amount: 200 });
    }
    function E(f) {
      if (!o.current.interactive) return;
      f.preventDefault();
      const p = a.getBoundingClientRect(), M = f.touches[0].clientX - p.left, q = f.touches[0].clientY - p.top;
      e.length < o.current.maxFood && e.push({ x: M, y: q, amount: 200 });
    }
    s.addEventListener("mousedown", R), s.addEventListener("touchstart", E, { passive: !1 });
    function b(f, p, M) {
      const q = Math.max(0, Math.min(v - 1, p | 0)), D = Math.max(0, Math.min(S - 1, M | 0));
      return f[D * v + q];
    }
    function w() {
      const {
        evaporationRate: f,
        diffusionRate: p,
        pheromoneStrength: M,
        antSpeed: q,
        sensorAngle: D,
        sensorDistance: O,
        turnSpeed: W,
        antColor: z,
        pheromoneColor: $,
        backgroundColor: Y,
        foodColor: H,
        nestColor: G,
        resolution: N,
        animated: U
      } = o.current;
      if (N !== A && (A = -1, C(l, d)), i.fillStyle = Y, i.fillRect(0, 0, l, d), !U || v === 0 || !F) {
        n = requestAnimationFrame(w);
        return;
      }
      const j = l / v, _ = d / S;
      for (let Z = 0; Z < h.length; Z++)
        h[Z] *= 1 - f, u[Z] *= 1 - f, h[Z] < 1e-3 && (h[Z] = 0), u[Z] < 1e-3 && (u[Z] = 0);
      if (p > 0) {
        const Z = p * 0.25;
        for (let rt = 1; rt < S - 1; rt++)
          for (let st = 1; st < v - 1; st++) {
            const ct = rt * v + st, lt = h, ut = u, pt = lt[ct - 1] + lt[ct + 1] + lt[ct - v] + lt[ct + v], mt = ut[ct - 1] + ut[ct + 1] + ut[ct - v] + ut[ct + v];
            lt[ct] += (pt * 0.25 - lt[ct]) * Z, ut[ct] += (mt * 0.25 - ut[ct]) * Z;
          }
      }
      for (const Z of t) {
        const rt = Z.hasFood ? u : h, st = Z.angle, ct = Z.angle - D, lt = Z.angle + D, ut = (St) => {
          const It = Z.x + Math.cos(St) * O, jt = Z.y + Math.sin(St) * O;
          return b(rt, It / j, jt / _);
        }, pt = ut(ct), mt = ut(st), wt = ut(lt);
        mt >= pt && mt >= wt || (pt > wt ? Z.angle -= W * Math.random() : wt > pt ? Z.angle += W * Math.random() : Z.angle += (Math.random() - 0.5) * W), Z.angle += (Math.random() - 0.5) * 0.2, Z.x += Math.cos(Z.angle) * q, Z.y += Math.sin(Z.angle) * q, Z.x < 0 ? (Z.x = 0, Z.angle = Math.PI - Z.angle) : Z.x >= l && (Z.x = l - 1, Z.angle = Math.PI - Z.angle), Z.y < 0 ? (Z.y = 0, Z.angle = -Z.angle) : Z.y >= d && (Z.y = d - 1, Z.angle = -Z.angle);
        const Mt = Math.max(0, Math.min(v - 1, Z.x / j | 0)), xt = Math.max(0, Math.min(S - 1, Z.y / _ | 0)) * v + Mt;
        Z.hasFood ? h[xt] = Math.min(255, h[xt] + M) : u[xt] = Math.min(255, u[xt] + M);
        const Lt = Z.x - L, zt = Z.y - T;
        if (Z.hasFood && Lt * Lt + zt * zt < c * c && (Z.hasFood = !1, Z.angle += Math.PI), !Z.hasFood)
          for (let St = e.length - 1; St >= 0; St--) {
            const It = e[St], jt = Z.x - It.x, fe = Z.y - It.y;
            if (jt * jt + fe * fe < g * g && It.amount > 0) {
              Z.hasFood = !0, Z.angle += Math.PI, It.amount--, It.amount <= 0 && e.splice(St, 1);
              break;
            }
          }
      }
      const [J, V, Q] = bt([Y], 0), [nt, K, et] = bt([$], 0), tt = F.data, ot = v * S, at = Math.max(1, M * 8);
      for (let Z = 0; Z < ot; Z++) {
        const rt = h[Z] / at, st = u[Z] / at, ct = Math.min(1, rt + st), lt = Z * 4;
        tt[lt] = J + (nt - J) * ct | 0, tt[lt + 1] = V + (K - V) * ct | 0, tt[lt + 2] = Q + (et - Q) * ct | 0, tt[lt + 3] = 255;
      }
      B.putImageData(F, 0, 0), i.imageSmoothingEnabled = !0, i.imageSmoothingQuality = "medium", i.drawImage(k, 0, 0, l, d), i.save(), i.beginPath(), i.arc(L, T, c, 0, Math.PI * 2), i.fillStyle = G, i.fill(), i.restore(), i.save();
      for (const Z of e)
        i.beginPath(), i.arc(Z.x, Z.y, g, 0, Math.PI * 2), i.fillStyle = H, i.fill();
      i.restore(), i.save(), i.fillStyle = z;
      for (const Z of t)
        i.beginPath(), i.arc(Z.x, Z.y, 1.5, 0, Math.PI * 2), i.fill();
      i.restore(), n = requestAnimationFrame(w);
    }
    return n = requestAnimationFrame(w), () => {
      I.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousedown", R), s.removeEventListener("touchstart", E);
    };
  }, [r]);
}
const yr = {
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
}, wr = ht(
  (r, y) => {
    const {
      preset: o,
      antCount: a,
      evaporationRate: s,
      diffusionRate: i,
      pheromoneStrength: l,
      antSpeed: d,
      sensorAngle: n,
      sensorDistance: t,
      turnSpeed: e,
      antColor: h,
      pheromoneColor: u,
      foodColor: v,
      nestColor: S,
      backgroundColor: L,
      resolution: T,
      animated: k,
      interactive: B,
      maxFood: F,
      width: A,
      height: c,
      className: g,
      style: C
    } = r, P = o && yr[o] || {}, m = X(null);
    return gt(y, () => m.current), mr(m, {
      antCount: a ?? P.antCount ?? 150,
      evaporationRate: s ?? P.evaporationRate ?? 3e-3,
      diffusionRate: i ?? 0.1,
      pheromoneStrength: l ?? P.pheromoneStrength ?? 5,
      antSpeed: d ?? P.antSpeed ?? 1.5,
      sensorAngle: n ?? 0.4,
      sensorDistance: t ?? 6,
      turnSpeed: e ?? 0.3,
      antColor: h ?? P.antColor ?? "#ffffff",
      pheromoneColor: u ?? P.pheromoneColor ?? "#6b7280",
      foodColor: v ?? P.foodColor ?? "#4ade80",
      nestColor: S ?? P.nestColor ?? "#f59e0b",
      backgroundColor: L ?? P.backgroundColor ?? "#111111",
      resolution: T ?? 0.5,
      animated: k ?? !0,
      interactive: B ?? !0,
      maxFood: F ?? 5
    }), /* @__PURE__ */ it(
      "div",
      {
        className: g,
        style: {
          width: A ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: B ?? !0 ? "crosshair" : "default",
          ...C
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: m,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
wr.displayName = "AntColony";
function vr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = !0, e = [], h = -1, u = 0, v = 0;
    function S(R, E) {
      e = [
        { x: R * 0.35, y: E * 0.5, charge: 1 },
        { x: R * 0.65, y: E * 0.5, charge: -1 }
      ];
    }
    function L(R, E) {
      const b = window.devicePixelRatio || 1;
      l = R, d = E, a.width = Math.round(R * b), a.height = Math.round(E * b), a.style.width = `${R}px`, a.style.height = `${E}px`, i.scale(b, b), S(R, E), t = !0;
    }
    const T = new ResizeObserver((R) => {
      const { width: E, height: b } = R[0].contentRect;
      E > 0 && b > 0 && L(E, b);
    });
    T.observe(s);
    const k = s.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B(R, E) {
      let b = 0, w = 0;
      for (const f of e) {
        const p = R - f.x, M = E - f.y, q = p * p + M * M;
        if (q < 1) continue;
        const D = Math.sqrt(q), O = f.charge / q;
        b += p / D * O, w += M / D * O;
      }
      return [b, w];
    }
    function F() {
      const { fieldLineCount: R, stepSize: E, maxSteps: b, lineColor: w, lineWidth: f, lineOpacity: p, poleRadius: M, glowEffect: q, glowBlur: D, positiveColor: O, negativeColor: W, backgroundColor: z } = o.current;
      i.fillStyle = z, i.fillRect(0, 0, l, d);
      const $ = M * M;
      i.save(), i.lineWidth = f;
      for (const Y of e) {
        const H = Y.charge;
        for (let G = 0; G < R; G++) {
          const N = G / R * Math.PI * 2;
          let U = Y.x + Math.cos(N) * (M + 2), j = Y.y + Math.sin(N) * (M + 2);
          i.beginPath(), i.moveTo(U, j);
          let _ = 0;
          for (let J = 0; J < b; J++) {
            const [V, Q] = B(U, j), nt = Math.sqrt(V * V + Q * Q);
            if (nt < 1e-10) break;
            const K = U + V / nt * E * H, et = j + Q / nt * E * H;
            if (K < 0 || K > l || et < 0 || et > d) break;
            let tt = !1;
            for (const ot of e) {
              const at = K - ot.x, Z = et - ot.y;
              if (at * at + Z * Z < $) {
                tt = !0;
                break;
              }
            }
            if (tt) break;
            i.lineTo(K, et), U = K, j = et, _++;
          }
          _ !== 0 && (q && (i.shadowBlur = D * 0.5, i.shadowColor = w), i.strokeStyle = Rt(w, p), i.stroke());
        }
      }
      i.shadowBlur = 0, i.restore(), i.save();
      for (const Y of e) {
        const H = Y.charge === 1 ? O : W;
        q && (i.shadowBlur = D, i.shadowColor = H), i.fillStyle = H, i.beginPath(), i.arc(Y.x, Y.y, M, 0, Math.PI * 2), i.fill(), i.shadowBlur = 0, i.fillStyle = "#ffffff", i.font = `bold ${M}px sans-serif`, i.textAlign = "center", i.textBaseline = "middle", i.fillText(Y.charge === 1 ? "N" : "S", Y.x, Y.y);
      }
      i.restore();
    }
    function A(R) {
      if (!o.current.interactive) return;
      const E = a.getBoundingClientRect(), b = R.clientX - E.left, w = R.clientY - E.top, { poleRadius: f, maxPoles: p } = o.current, M = f * 2;
      let q = -1;
      for (let D = 0; D < e.length; D++) {
        const O = e[D].x - b, W = e[D].y - w;
        if (O * O + W * W < M * M) {
          q = D;
          break;
        }
      }
      if (q >= 0)
        h = q, u = b - e[q].x, v = w - e[q].y;
      else if (e.length < p) {
        const D = e.length % 2 === 0 ? 1 : -1;
        e.push({ x: b, y: w, charge: D }), t = !0;
      }
    }
    function c(R) {
      if (!o.current.interactive || h < 0) return;
      const E = a.getBoundingClientRect();
      e[h].x = R.clientX - E.left - u, e[h].y = R.clientY - E.top - v, t = !0;
    }
    function g() {
      h = -1;
    }
    function C(R) {
      if (!o.current.interactive || (R.preventDefault(), e.length <= 2)) return;
      const E = a.getBoundingClientRect(), b = R.clientX - E.left, w = R.clientY - E.top, { poleRadius: f } = o.current, p = f * 2;
      for (let M = 0; M < e.length; M++) {
        const q = e[M].x - b, D = e[M].y - w;
        if (q * q + D * D < p * p) {
          e.splice(M, 1), t = !0;
          break;
        }
      }
    }
    function P(R) {
      if (!o.current.interactive) return;
      R.preventDefault();
      const E = a.getBoundingClientRect(), b = R.touches[0].clientX - E.left, w = R.touches[0].clientY - E.top, { poleRadius: f } = o.current, p = f * 2;
      for (let M = 0; M < e.length; M++) {
        const q = e[M].x - b, D = e[M].y - w;
        if (q * q + D * D < p * p) {
          h = M, u = b - e[M].x, v = w - e[M].y;
          return;
        }
      }
    }
    function m(R) {
      if (!o.current.interactive || h < 0) return;
      R.preventDefault();
      const E = a.getBoundingClientRect();
      e[h].x = R.touches[0].clientX - E.left - u, e[h].y = R.touches[0].clientY - E.top - v, t = !0;
    }
    function I() {
      h = -1;
    }
    s.addEventListener("mousedown", A), s.addEventListener("mousemove", c), window.addEventListener("mouseup", g), s.addEventListener("contextmenu", C), s.addEventListener("touchstart", P, { passive: !1 }), s.addEventListener("touchmove", m, { passive: !1 }), s.addEventListener("touchend", I);
    function x() {
      const { animated: R } = o.current;
      (R || t) && (F(), t = !1), n = requestAnimationFrame(x);
    }
    return n = requestAnimationFrame(x), () => {
      T.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousedown", A), s.removeEventListener("mousemove", c), window.removeEventListener("mouseup", g), s.removeEventListener("contextmenu", C), s.removeEventListener("touchstart", P), s.removeEventListener("touchmove", m), s.removeEventListener("touchend", I);
    };
  }, [r]);
}
const br = {
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
      fieldLineCount: a,
      stepSize: s,
      maxSteps: i,
      positiveColor: l,
      negativeColor: d,
      lineColor: n,
      backgroundColor: t,
      lineWidth: e,
      lineOpacity: h,
      poleRadius: u,
      glowEffect: v,
      glowBlur: S,
      animated: L,
      interactive: T,
      maxPoles: k,
      width: B,
      height: F,
      className: A,
      style: c
    } = r, g = o && br[o] || {}, C = X(null);
    return gt(y, () => C.current), vr(C, {
      fieldLineCount: a ?? g.fieldLineCount ?? 16,
      stepSize: s ?? 4,
      maxSteps: i ?? 400,
      positiveColor: l ?? g.positiveColor ?? "#ef4444",
      negativeColor: d ?? g.negativeColor ?? "#3b82f6",
      lineColor: n ?? g.lineColor ?? "#6b7280",
      backgroundColor: t ?? g.backgroundColor ?? "#111111",
      lineWidth: e ?? 1,
      lineOpacity: h ?? g.lineOpacity ?? 0.6,
      poleRadius: u ?? 12,
      glowEffect: v ?? g.glowEffect ?? !0,
      glowBlur: S ?? g.glowBlur ?? 20,
      animated: L ?? !1,
      interactive: T ?? !0,
      maxPoles: k ?? 6
    }), /* @__PURE__ */ it(
      "div",
      {
        className: A,
        style: {
          width: B ?? "100%",
          height: F ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: T ?? !0 ? "pointer" : "default",
          ...c
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: C,
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
function Ee(r) {
  return r * r * r * (r * (r * 6 - 15) + 10);
}
function le(r, y, o) {
  return r + o * (y - r);
}
function Kt(r, y, o) {
  const a = r & 3, s = a < 2 ? y : o, i = a < 2 ? o : y;
  return (a & 1 ? -s : s) + (a & 2 ? -i : i);
}
const Yt = new Uint8Array(256);
for (let r = 0; r < 256; r++) Yt[r] = r;
for (let r = 255; r > 0; r--) {
  const y = Math.floor(Math.random() * (r + 1));
  [Yt[r], Yt[y]] = [Yt[y], Yt[r]];
}
const Bt = new Uint8Array(512);
for (let r = 0; r < 512; r++) Bt[r] = Yt[r & 255];
function Cr(r, y) {
  const o = Math.floor(r) & 255, a = Math.floor(y) & 255, s = r - Math.floor(r), i = y - Math.floor(y), l = Ee(s), d = Ee(i), n = Bt[Bt[o] + a], t = Bt[Bt[o] + a + 1], e = Bt[Bt[o + 1] + a], h = Bt[Bt[o + 1] + a + 1];
  return le(
    le(Kt(n, s, i), Kt(e, s - 1, i), l),
    le(Kt(t, s, i - 1), Kt(h, s - 1, i - 1), l),
    d
  );
}
function xr(r, y, o, a) {
  let s = 0, i = 1, l = 1, d = 0;
  for (let n = 0; n < o; n++)
    s += Cr(r * l, y * l) * i, d += i, i *= a, l *= 2;
  return s / d;
}
function Rr(r) {
  const y = r.replace("#", "");
  return [
    parseInt(y.slice(0, 2), 16) || 0,
    parseInt(y.slice(2, 4), 16) || 0,
    parseInt(y.slice(4, 6), 16) || 0
  ];
}
function Sr(r, y) {
  const o = X(y);
  o.current = y, ft(() => {
    const a = r.current;
    if (!a) return;
    const s = a.parentElement;
    if (!s) return;
    const i = a.getContext("2d");
    let l = 0, d = 0, n = 0, t = y.rotateY, e = y.rotateX, h = null, u = "", v = 255, S = 255, L = 255, T = "", k = !1, B = 0, F = 0;
    function A(w, f) {
      const p = window.devicePixelRatio || 1;
      l = w, d = f, a.width = Math.round(w * p), a.height = Math.round(f * p), a.style.width = `${w}px`, a.style.height = `${f}px`, i.scale(p, p);
    }
    const c = new ResizeObserver((w) => {
      const { width: f, height: p } = w[0].contentRect;
      f > 0 && p > 0 && A(f, p);
    });
    c.observe(s);
    const g = s.getBoundingClientRect();
    g.width > 0 && g.height > 0 && A(g.width, g.height);
    function C(w) {
      o.current.interactive && (k = !0, B = w.clientX, F = w.clientY);
    }
    function P(w) {
      !o.current.interactive || !k || (t += (w.clientX - B) * 5e-3, e += (w.clientY - F) * 5e-3, e = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, e)), B = w.clientX, F = w.clientY);
    }
    function m() {
      k = !1;
    }
    function I(w) {
      o.current.interactive && (k = !0, B = w.touches[0].clientX, F = w.touches[0].clientY);
    }
    function x(w) {
      !o.current.interactive || !k || (w.preventDefault(), t += (w.touches[0].clientX - B) * 5e-3, e += (w.touches[0].clientY - F) * 5e-3, e = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, e)), B = w.touches[0].clientX, F = w.touches[0].clientY);
    }
    function R() {
      k = !1;
    }
    s.addEventListener("mousedown", C), s.addEventListener("mousemove", P), window.addEventListener("mouseup", m), s.addEventListener("touchstart", I, { passive: !1 }), s.addEventListener("touchmove", x, { passive: !1 }), s.addEventListener("touchend", R);
    function E(w, f, p, M, q, D) {
      const O = Math.cos(t), W = Math.sin(t), z = Math.cos(e), $ = Math.sin(e), Y = w * O - p * W, H = w * W + p * O, G = f * z - H * $, N = f * $ + H * z, U = M + N + 600;
      return [q + Y * M / U, D + G * M / U, N];
    }
    function b() {
      const {
        gridCols: w,
        gridRows: f,
        noiseScale: p,
        heightScale: M,
        wireColor: q,
        backgroundColor: D,
        fov: O,
        autoRotate: W,
        autoRotateSpeed: z,
        glowEffect: $,
        glowBlur: Y,
        animated: H,
        lineWidth: G,
        colorByHeight: N
      } = o.current;
      if (W && !k && (t += z), i.fillStyle = D, i.fillRect(0, 0, l, d), !H || l === 0) {
        n = requestAnimationFrame(b);
        return;
      }
      const U = `${w},${f},${p}`;
      if (U !== u) {
        const Z = w + 1;
        h = new Float32Array(Z * (f + 1));
        for (let rt = 0; rt <= f; rt++)
          for (let st = 0; st <= w; st++)
            h[rt * Z + st] = xr(st * p, rt * p, 4, 0.5);
        u = U;
      }
      const j = h, _ = w + 1;
      q !== T && ([v, S, L] = Rr(q), T = q);
      const J = l / 2, V = d / 2, Q = l * 0.9, nt = d * 0.9, K = Q / w, et = nt / f;
      i.save(), $ && (i.shadowBlur = Y, i.shadowColor = q), i.lineWidth = G;
      const tt = new Float32Array(_ * (f + 1)), ot = new Float32Array(_ * (f + 1)), at = new Float32Array(_ * (f + 1));
      for (let Z = 0; Z <= f; Z++)
        for (let rt = 0; rt <= w; rt++) {
          const st = j[Z * _ + rt], ct = -Q / 2 + rt * K, lt = -nt / 2 + Z * et, [ut, pt, mt] = E(ct, lt, st * M, O, J, V), wt = Z * _ + rt;
          tt[wt] = ut, ot[wt] = pt, at[wt] = mt;
        }
      for (let Z = 0; Z <= f; Z++) {
        let rt = 0;
        const st = Z * _;
        for (let ut = 0; ut <= w; ut++) rt += j[st + ut];
        rt /= _;
        const ct = N ? Math.max(0, Math.min(1, (rt + 1) * 0.5)) : 1, lt = N ? 0.2 + ct * 0.8 : 0.6;
        i.strokeStyle = `rgba(${v},${S},${L},${lt.toFixed(2)})`, i.beginPath(), i.moveTo(tt[st], ot[st]);
        for (let ut = 1; ut <= w; ut++)
          i.lineTo(tt[st + ut], ot[st + ut]);
        i.stroke();
      }
      for (let Z = 0; Z <= w; Z++) {
        let rt = 0;
        for (let lt = 0; lt <= f; lt++) rt += j[lt * _ + Z];
        rt /= f + 1;
        const st = N ? Math.max(0, Math.min(1, (rt + 1) * 0.5)) : 1, ct = N ? 0.2 + st * 0.8 : 0.6;
        i.strokeStyle = `rgba(${v},${S},${L},${ct.toFixed(2)})`, i.beginPath(), i.moveTo(tt[Z], ot[Z]);
        for (let lt = 1; lt <= f; lt++)
          i.lineTo(tt[lt * _ + Z], ot[lt * _ + Z]);
        i.stroke();
      }
      i.restore(), n = requestAnimationFrame(b);
    }
    return n = requestAnimationFrame(b), () => {
      c.disconnect(), cancelAnimationFrame(n), s.removeEventListener("mousedown", C), s.removeEventListener("mousemove", P), window.removeEventListener("mouseup", m), s.removeEventListener("touchstart", I), s.removeEventListener("touchmove", x), s.removeEventListener("touchend", R);
    };
  }, [r]);
}
const kr = {
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
}, Er = ht(
  (r, y) => {
    const {
      preset: o,
      gridCols: a,
      gridRows: s,
      noiseScale: i,
      heightScale: l,
      wireColor: d,
      backgroundColor: n,
      fov: t,
      rotateX: e,
      rotateY: h,
      autoRotate: u,
      autoRotateSpeed: v,
      glowEffect: S,
      glowBlur: L,
      interactive: T,
      animated: k,
      lineWidth: B,
      colorByHeight: F,
      width: A,
      height: c,
      className: g,
      style: C
    } = r, P = o && kr[o] || {}, m = X(null);
    return gt(y, () => m.current), Sr(m, {
      gridCols: a ?? 40,
      gridRows: s ?? 30,
      noiseScale: i ?? P.noiseScale ?? 0.12,
      heightScale: l ?? P.heightScale ?? 120,
      wireColor: d ?? P.wireColor ?? "#ffffff",
      backgroundColor: n ?? P.backgroundColor ?? "#111111",
      fov: t ?? 500,
      rotateX: e ?? 0.4,
      rotateY: h ?? 0,
      autoRotate: u ?? !0,
      autoRotateSpeed: v ?? 3e-3,
      glowEffect: S ?? P.glowEffect ?? !1,
      glowBlur: L ?? P.glowBlur ?? 8,
      interactive: T ?? !0,
      animated: k ?? !0,
      lineWidth: B ?? P.lineWidth ?? 0.5,
      colorByHeight: F ?? P.colorByHeight ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: g,
        style: {
          width: A ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: T ?? !0 ? "grab" : "default",
          ...C
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: m,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
Er.displayName = "TerrainMesh";
function Pr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X({ x: -999, y: -999 }), d = X(0);
  ft(() => {
    const n = r.current;
    if (!n) return;
    const t = n.parentElement;
    if (!t) return;
    const e = n.getContext("2d");
    let h = 0, u = 0;
    function v() {
      const { segmentCount: C } = o.current, P = h / 2, m = u / 2;
      a.current = Array.from({ length: C }, (I, x) => ({
        x: P - x * 12,
        y: m
      })), l.current = { x: P, y: m };
    }
    function S(C, P) {
      const m = window.devicePixelRatio || 1;
      n.width = Math.round(C * m), n.height = Math.round(P * m), n.style.width = `${C}px`, n.style.height = `${P}px`, e.scale(m, m), h = C, u = P, v();
    }
    const L = new ResizeObserver((C) => {
      const { width: P, height: m } = C[0].contentRect;
      P > 0 && m > 0 && S(P, m);
    });
    L.observe(t);
    const T = t.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(C) {
      if (!o.current.interactive) return;
      const P = n.getBoundingClientRect();
      l.current = { x: C.clientX - P.left, y: C.clientY - P.top };
    }
    n.addEventListener("mousemove", k);
    function B(C, P, m, I) {
      const { segmentSize: x } = o.current, R = Math.sqrt(m * m + I * I) || 1, E = m / R, b = I / R, w = 3 + Math.floor(Math.random() * 2);
      for (let f = 0; f < w; f++) {
        const M = 40 + Math.random() * 20;
        s.current.push({
          x: C + E * x * 0.9,
          y: P + b * x * 0.9,
          vx: E * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8,
          vy: b * (2.5 + Math.random() * 3) + (Math.random() - 0.5) * 1.8 - 0.3,
          life: M,
          maxLife: M,
          size: 3 + Math.random() * 5
        });
      }
      s.current.length > 200 && s.current.splice(0, 30);
    }
    function F(C, P, m, I, x, R, E) {
      e.save(), e.translate(C, P), e.rotate(m);
      for (const b of [-1, 1]) {
        const w = b * Math.PI / 2, p = [
          { a: w + x * b - 0.35, len: I * 0.7 },
          { a: w + x * b, len: I },
          { a: w + x * b + 0.3, len: I * 0.75 }
        ].map((M) => ({
          x: Math.cos(M.a) * M.len,
          y: Math.sin(M.a) * M.len
        }));
        for (const M of p)
          e.beginPath(), e.moveTo(0, 0), e.lineTo(M.x, M.y), e.strokeStyle = `rgba(${R},${E * 0.85})`, e.lineWidth = 1.5, e.lineCap = "round", e.stroke(), e.beginPath(), e.arc(M.x * 0.55, M.y * 0.55, 2.5, 0, Math.PI * 2), e.fillStyle = `rgba(${R},${E * 0.9})`, e.fill(), e.beginPath(), e.arc(M.x, M.y, 1.8, 0, Math.PI * 2), e.fill();
        for (let M = 0; M < p.length - 1; M++) {
          const q = p[M], D = p[M + 1], O = (q.x + D.x) * 0.42, W = (q.y + D.y) * 0.42 + b * 10;
          e.beginPath(), e.moveTo(q.x, q.y), e.quadraticCurveTo(O, W, D.x, D.y), e.strokeStyle = `rgba(${R},${E * 0.15})`, e.lineWidth = 1, e.stroke();
        }
        e.beginPath(), e.moveTo(0, 0), e.quadraticCurveTo(p[0].x * 0.3, p[0].y * 0.3, p[0].x, p[0].y), e.strokeStyle = `rgba(${R},${E * 0.1})`, e.lineWidth = 1, e.stroke();
      }
      e.restore();
    }
    function A(C) {
      const {
        segmentCount: P,
        segmentSize: m,
        bodyColor: I,
        fireColor: x,
        backgroundColor: R,
        followSpeed: E,
        wingSpan: b,
        showFire: w,
        interactive: f
      } = o.current;
      d.current += C * 1e-3;
      const p = d.current;
      e.fillStyle = R, e.fillRect(0, 0, h, u);
      const M = a.current;
      f || (l.current = {
        x: h * 0.5 + Math.sin(p * 0.5) * h * 0.35,
        y: u * 0.5 + Math.cos(p * 0.7) * u * 0.3
      });
      const q = l.current;
      for (; M.length < P; ) {
        const H = M[M.length - 1] || { x: h / 2, y: u / 2 };
        M.push({ x: H.x, y: H.y });
      }
      M.length > P && (M.length = P);
      const D = M[0], O = Math.min(E, 1);
      D.x += (q.x - D.x) * O, D.y += (q.y - D.y) * O;
      for (let H = 1; H < M.length; H++) {
        const G = M[H - 1], N = M[H], U = G.x - N.x, j = G.y - N.y, _ = Math.sqrt(U * U + j * j) || 1e-3, J = m * 1.2;
        _ > J && (N.x = G.x - U / _ * J, N.y = G.y - j / _ * J);
        const V = -j / _, Q = U / _, nt = Math.sin(p * 4 - H * 0.4) * (m * 0.25) * (H / M.length);
        N.x += V * nt, N.y += Q * nt;
      }
      const W = M.length >= 2 ? Math.atan2(M[0].y - M[1].y, M[0].x - M[1].x) : 0, z = yt(I), $ = yt(x);
      if (w && M.length >= 2) {
        const H = M[0], G = M[1], N = H.x - G.x, U = H.y - G.y;
        Math.random() < 0.8 && B(H.x, H.y, N, U);
      }
      if (w)
        for (let H = s.current.length - 1; H >= 0; H--) {
          const G = s.current[H];
          if (G.x += G.vx, G.y += G.vy, G.life -= 1, G.life <= 0) {
            s.current.splice(H, 1);
            continue;
          }
          const N = G.life / G.maxLife, U = N * 0.75, j = G.size * N, _ = $;
          e.beginPath(), e.arc(G.x, G.y, Math.max(0.5, j), 0, Math.PI * 2), e.fillStyle = `rgba(${_},${U})`, e.fill();
        }
      const Y = Math.sin(p * 6) * 0.3;
      if (M.length >= 4) {
        const H = M[2], G = M[3], N = Math.atan2(H.y - G.y, H.x - G.x);
        F(H.x, H.y, N, b, Y, z, 0.85);
      }
      for (let H = M.length - 1; H >= 1; H--) {
        const G = M[H], N = M[H - 1], U = H / (M.length - 1), j = m * (1 - U * 0.75), _ = Math.max(2, j * 0.55), J = N.x - G.x, V = N.y - G.y, Q = Math.sqrt(J * J + V * V) || 1, nt = J / Q, K = V / Q, et = j * 0.28, tt = -K * et, ot = nt * et, at = 0.4 + (1 - U) * 0.15;
        if (e.beginPath(), e.moveTo(G.x + tt, G.y + ot), e.lineTo(N.x + tt, N.y + ot), e.strokeStyle = `rgba(${z},${at})`, e.lineWidth = 1, e.lineCap = "butt", e.stroke(), e.beginPath(), e.moveTo(G.x - tt, G.y - ot), e.lineTo(N.x - tt, N.y - ot), e.stroke(), e.beginPath(), e.arc(G.x, G.y, _, 0, Math.PI * 2), e.strokeStyle = `rgba(${z},${0.7 + (1 - U) * 0.25})`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.arc(G.x, G.y, _ * 0.38, 0, Math.PI * 2), e.fillStyle = `rgba(${z},${0.8 + (1 - U) * 0.2})`, e.fill(), H % 3 === 0 && H > 2 && H < M.length - 3) {
          const Z = Math.atan2(G.y - N.y, G.x - N.x), rt = -Math.sin(Z), st = Math.cos(Z), ct = m * (1.1 + (1 - U) * 0.9);
          for (const lt of [-1, 1]) {
            const ut = ct * 0.9, pt = G.x + rt * lt * ut, mt = G.y + st * lt * ut, wt = G.x + rt * lt * ut * 0.55 + Math.cos(Z) * ut * -0.22, Mt = G.y + st * lt * ut * 0.55 + Math.sin(Z) * ut * -0.22;
            e.beginPath(), e.moveTo(G.x, G.y), e.quadraticCurveTo(wt, Mt, pt, mt), e.strokeStyle = `rgba(${z},0.62)`, e.lineWidth = 1.2, e.lineCap = "round", e.stroke();
            const Ct = ct * 0.55, xt = G.x + rt * lt * Ct, Lt = G.y + st * lt * Ct, zt = G.x + rt * lt * Ct * 0.5 + Math.cos(Z) * Ct * 0.18, St = G.y + st * lt * Ct * 0.5 + Math.sin(Z) * Ct * 0.18;
            e.beginPath(), e.moveTo(G.x, G.y), e.quadraticCurveTo(zt, St, xt, Lt), e.strokeStyle = `rgba(${z},0.38)`, e.lineWidth = 0.8, e.stroke();
          }
        }
      }
      if (M.length > 0) {
        const H = M[0], G = Math.cos(W), N = Math.sin(W), U = -Math.sin(W), j = Math.cos(W), _ = m * 1.05, J = m * 0.82;
        e.save(), e.translate(H.x, H.y), e.rotate(W);
        const V = e.createRadialGradient(-_ * 0.1, 0, _ * 0.05, 0, 0, _);
        V.addColorStop(0, `rgba(${z},0.07)`), V.addColorStop(1, `rgba(${z},0)`), e.beginPath(), e.ellipse(0, 0, _, J, 0, 0, Math.PI * 2), e.fillStyle = V, e.fill(), e.beginPath(), e.ellipse(0, 0, _, J, 0, 0, Math.PI * 2), e.strokeStyle = `rgba(${z},0.88)`, e.lineWidth = 1.8, e.stroke(), e.restore();
        const Q = m * 0.58;
        for (const pt of [-1, 1]) {
          const mt = H.x + U * Q * pt, wt = H.y + j * Q * pt, Mt = mt + U * pt * m * 0.28 + Math.cos(W - Math.PI) * m * 0.88, Ct = wt + j * pt * m * 0.28 + Math.sin(W - Math.PI) * m * 0.88, xt = Mt + U * pt * m * 0.14 + Math.cos(W - Math.PI) * m * 0.48, Lt = Ct + j * pt * m * 0.14 + Math.sin(W - Math.PI) * m * 0.48;
          e.beginPath(), e.moveTo(mt, wt), e.lineTo(Mt, Ct), e.strokeStyle = `rgba(${z},0.9)`, e.lineWidth = 2.5, e.lineCap = "round", e.stroke(), e.beginPath(), e.moveTo(Mt, Ct), e.lineTo(xt, Lt), e.lineWidth = 1.2, e.stroke();
          const zt = Mt + U * pt * m * 0.2, St = Ct + j * pt * m * 0.2;
          e.beginPath(), e.moveTo(Mt, Ct), e.lineTo(zt, St), e.lineWidth = 0.9, e.stroke();
        }
        const nt = m * 0.4, K = m * 0.22, et = m * 0.26;
        for (const pt of [-1, 1]) {
          const mt = H.x + U * nt * pt + G * K, wt = H.y + j * nt * pt + N * K;
          e.beginPath(), e.arc(mt, wt, et, 0, Math.PI * 2), e.fillStyle = "rgba(0,0,0,0.72)", e.fill(), e.beginPath(), e.arc(mt, wt, et, 0, Math.PI * 2), e.strokeStyle = `rgba(${z},0.82)`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.arc(
            mt + G * et * 0.28 - U * et * 0.28 * pt,
            wt + N * et * 0.28 - j * et * 0.28 * pt,
            et * 0.16,
            0,
            Math.PI * 2
          ), e.fillStyle = `rgba(${z},0.32)`, e.fill();
        }
        const tt = m * 0.55, ot = Math.sin(p * 3) * 0.1 + 0.08, at = -m * 0.14, Z = m * 0.14 + ot * m * 0.55, rt = m * 0.82, st = m * 0.2;
        e.save(), e.translate(H.x + G * tt, H.y + N * tt), e.rotate(W), e.beginPath(), e.ellipse(0, at, rt, st, 0, 0, Math.PI), e.strokeStyle = `rgba(${z},0.85)`, e.lineWidth = 1.5, e.stroke(), e.beginPath(), e.ellipse(0, Z, rt * 0.88, st * 0.88, 0, Math.PI, Math.PI * 2), e.stroke();
        const ct = 5;
        for (let pt = 0; pt < ct; pt++) {
          const mt = -rt * 0.78 + rt * 1.56 * (pt + 0.5) / ct, wt = Math.max(0, 1 - (mt / rt) ** 2), Mt = at + st * Math.sqrt(wt), Ct = m * (0.12 + Math.sin(pt * 1.5) * 0.04), xt = rt / ct * 0.38;
          e.beginPath(), e.moveTo(mt - xt, Mt), e.lineTo(mt, Mt + Ct), e.lineTo(mt + xt, Mt), e.strokeStyle = `rgba(${z},0.75)`, e.lineWidth = 1, e.stroke();
        }
        const lt = 4, ut = rt * 0.88;
        for (let pt = 0; pt < lt; pt++) {
          const mt = -ut * 0.78 + ut * 1.56 * (pt + 0.5) / lt, wt = Math.max(0, 1 - (mt / ut) ** 2), Mt = Z - st * 0.88 * Math.sqrt(wt), Ct = m * (0.1 + Math.sin(pt * 1.9) * 0.04), xt = ut / lt * 0.36;
          e.beginPath(), e.moveTo(mt - xt, Mt), e.lineTo(mt, Mt - Ct), e.lineTo(mt + xt, Mt), e.strokeStyle = `rgba(${z},0.7)`, e.lineWidth = 1, e.stroke();
        }
        e.restore();
      }
    }
    let c = 0;
    function g(C) {
      const P = c ? C - c : 16;
      c = C, A(P), i.current = requestAnimationFrame(g);
    }
    return i.current = requestAnimationFrame(g), () => {
      L.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousemove", k);
    };
  }, [r]);
}
const Ar = {
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
}, Br = ht(
  (r, y) => {
    const {
      preset: o,
      segmentCount: a,
      segmentSize: s,
      bodyColor: i,
      eyeColor: l,
      fireColor: d,
      backgroundColor: n,
      followSpeed: t,
      wingSpan: e,
      showFire: h,
      interactive: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && Ar[o] || {}, B = X(null);
    return gt(y, () => B.current), Pr(B, {
      segmentCount: a ?? 20,
      segmentSize: s ?? k.segmentSize ?? 18,
      bodyColor: i ?? k.bodyColor ?? "#ffffff",
      eyeColor: l ?? k.eyeColor ?? "#111111",
      fireColor: d ?? k.fireColor ?? "#ffffff",
      backgroundColor: n ?? k.backgroundColor ?? "transparent",
      followSpeed: t ?? 0.15,
      wingSpan: e ?? k.wingSpan ?? 60,
      showFire: h ?? !1,
      interactive: u ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "none",
          ...T
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
Br.displayName = "DragonCursor";
function Fr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(0), l = X({ strength: 0, dir: 1 });
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u(c = !1) {
      const { petalSize: g } = o.current;
      return {
        x: Math.random() * e,
        y: c ? -g - Math.random() * 80 : Math.random() * h,
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.2 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
        angularVel: (Math.random() - 0.5) * 0.06,
        size: g * (0.7 + Math.random() * 0.6),
        alpha: 0.6 + Math.random() * 0.4,
        settled: !1,
        settleY: 0,
        phase: Math.random() * Math.PI * 2,
        scaleY: 1
      };
    }
    function v() {
      const { petalCount: c } = o.current;
      a.current = Array.from({ length: c }, () => u(!1));
    }
    function S(c, g) {
      const C = window.devicePixelRatio || 1;
      d.width = Math.round(c * C), d.height = Math.round(g * C), d.style.width = `${c}px`, d.style.height = `${g}px`, t.scale(C, C), e = c, h = g, v();
    }
    const L = new ResizeObserver((c) => {
      const { width: g, height: C } = c[0].contentRect;
      g > 0 && C > 0 && S(g, C);
    });
    L.observe(n);
    const T = n.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(c, g) {
      t.save(), t.translate(c.x, c.y), t.rotate(c.angle), t.scale(1, c.scaleY), t.globalAlpha = c.alpha;
      const C = c.size;
      t.beginPath(), t.moveTo(0, -C), t.quadraticCurveTo(C * 0.8, -C * 0.3, 0, C * 0.6), t.quadraticCurveTo(-C * 0.8, -C * 0.3, 0, -C), t.fillStyle = g, t.fill(), t.globalAlpha = 1, t.restore();
    }
    function B(c) {
      const {
        petalCount: g,
        petalColor: C,
        backgroundColor: P,
        gravity: m,
        windStrength: I,
        windGusts: x,
        showAccumulation: R,
        maxAccumulation: E
      } = o.current;
      i.current += c * 1e-3;
      const b = i.current;
      t.fillStyle = P, t.fillRect(0, 0, e, h);
      const w = l.current;
      x && (Math.random() < 3e-3 && (w.strength = 2 + Math.random() * 3, w.dir = Math.random() < 0.5 ? 1 : -1), w.strength *= 0.985);
      const f = I + w.strength * w.dir;
      for (; a.current.length < g; ) a.current.push(u(!0));
      a.current.length > g && (a.current.length = g);
      const M = `rgb(${yt(C)})`, q = a.current.filter((W) => W.settled), D = R ? Math.min(E, q.length * 0.6) : 0, O = h - D;
      if (R && q.length > 0)
        for (const W of q)
          k(W, M);
      for (const W of a.current) {
        if (W.settled) continue;
        const z = Math.sin(b * 1.5 + W.phase) * f * 0.5;
        if (W.vx += z * 0.01, W.vy += m * 0.016, W.x += W.vx + f * 0.02, W.y += W.vy, W.angle += W.angularVel + Math.sin(b * 2 + W.phase) * 2e-3, W.scaleY = 0.6 + Math.abs(Math.sin(W.angle * 1.5)) * 0.4, W.x < -W.size && (W.x = e + W.size), W.x > e + W.size && (W.x = -W.size), W.y >= O - W.size * 0.5)
          if (R) {
            if (W.settled = !0, W.x = Math.max(W.size, Math.min(e - W.size, W.x)), W.y = O - W.size * 0.3, W.settleY = W.y, W.angle = (Math.random() - 0.5) * 0.6, W.alpha *= 0.8, q.length > g * 0.6) {
              const $ = a.current.find((Y) => Y.settled);
              $ && Object.assign($, u(!0));
            }
          } else
            Object.assign(W, u(!0));
        k(W, M);
      }
    }
    let F = 0;
    function A(c) {
      const g = F ? c - F : 16;
      F = c, B(g), s.current = requestAnimationFrame(A);
    }
    return s.current = requestAnimationFrame(A), () => {
      L.disconnect(), cancelAnimationFrame(s.current);
    };
  }, [r]);
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
}, $r = ht(
  (r, y) => {
    const {
      preset: o,
      petalCount: a,
      petalColor: s,
      petalSize: i,
      backgroundColor: l,
      gravity: d,
      windStrength: n,
      windGusts: t,
      showAccumulation: e,
      maxAccumulation: h,
      width: u,
      height: v,
      className: S,
      style: L
    } = r, T = o && Ir[o] || {}, k = X(null);
    return gt(y, () => k.current), Fr(k, {
      petalCount: a ?? 80,
      petalColor: s ?? T.petalColor ?? "#ffffff",
      petalSize: i ?? T.petalSize ?? 8,
      backgroundColor: l ?? T.backgroundColor ?? "#111111",
      gravity: d ?? T.gravity ?? 0.06,
      windStrength: n ?? T.windStrength ?? 0.8,
      windGusts: t ?? !0,
      showAccumulation: e ?? !0,
      maxAccumulation: h ?? 40
    }), /* @__PURE__ */ it(
      "div",
      {
        className: S,
        style: {
          width: u ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          ...L
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: k,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
$r.displayName = "SakuraBlossom";
function Tr(r, y, o) {
  return (Math.sin(r * 1.3 + o) * Math.cos(y * 1.1 - o * 0.7) + Math.sin(r * 2.7 - o * 1.3) * Math.cos(y * 2.1 + o * 0.9) * 0.5 + 1.5) / 3;
}
function Lr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X([]), l = X(0), d = X(0), n = X(null), t = X(null);
  ft(() => {
    const e = r.current;
    if (!e) return;
    const h = e.parentElement;
    if (!h) return;
    const u = e.getContext("2d");
    let v = 0, S = 0;
    function L(x, R) {
      const E = Math.random() * Math.PI * 2, b = (0.5 + Math.random() * 0.8) * o.current.speed, w = 40 + Math.random() * 30, f = Math.random() * v, p = Math.random() * S, M = Math.random() < 0.4;
      return {
        x: f,
        y: p,
        vx: Math.cos(E) * b,
        vy: Math.sin(E) * b,
        angle: E,
        speed: b,
        length: w,
        segments: Array.from({ length: 8 }, (q, D) => ({
          x: f - Math.cos(E) * D * (w / 8),
          y: p - Math.sin(E) * D * (w / 8)
        })),
        tailPhase: Math.random() * Math.PI * 2,
        color: M ? R : x,
        accentColor: M ? x : R,
        wanderAngle: E
      };
    }
    function T() {
      i.current = Array.from({ length: 5 }, () => ({
        x: v * 0.1 + Math.random() * v * 0.8,
        y: S * 0.1 + Math.random() * S * 0.8,
        radius: 18 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        gapAngle: 0.3 + Math.random() * 0.4
      }));
    }
    function k() {
      const { fishCount: x, fishColor: R, scaleColor: E } = o.current;
      a.current = Array.from({ length: x }, () => L(R, E)), T();
    }
    function B(x, R) {
      const E = window.devicePixelRatio || 1;
      e.width = Math.round(x * E), e.height = Math.round(R * E), e.style.width = `${x}px`, e.style.height = `${R}px`, u.scale(E, E), v = x, S = R, k();
    }
    const F = new ResizeObserver((x) => {
      const { width: R, height: E } = x[0].contentRect;
      R > 0 && E > 0 && B(R, E);
    });
    F.observe(h);
    const A = h.getBoundingClientRect();
    A.width > 0 && A.height > 0 && B(A.width, A.height);
    function c(x) {
      if (!o.current.interactive) return;
      const R = e.getBoundingClientRect(), E = x.clientX - R.left, b = x.clientY - R.top, w = n.current;
      if (w) {
        const f = E - w.x, p = b - w.y;
        f * f + p * p > 400 && s.current.push({ x: E, y: b, radius: 0, maxRadius: 60, alpha: 0.6 });
      }
      n.current = { x: E, y: b }, t.current = { x: E, y: b };
    }
    function g() {
      n.current = null;
    }
    e.addEventListener("mousemove", c), e.addEventListener("mouseleave", g);
    function C(x, R) {
      const E = x.segments;
      if (E.length < 2) return;
      const b = yt(x.color), w = yt(x.accentColor);
      u.save();
      const f = E.map((N, U) => {
        const j = U / (E.length - 1);
        return x.length * 0.18 * Math.sin(Math.PI * (1 - j));
      });
      u.beginPath();
      for (let N = 0; N < E.length; N++) {
        const U = E[N], j = E[Math.min(N + 1, E.length - 1)], _ = j.x - U.x, J = j.y - U.y, V = Math.sqrt(_ * _ + J * J) || 1e-3, Q = -J / V * f[N], nt = _ / V * f[N];
        N === 0 ? u.moveTo(U.x + Q, U.y + nt) : u.lineTo(U.x + Q, U.y + nt);
      }
      for (let N = E.length - 1; N >= 0; N--) {
        const U = E[N], j = E[Math.min(N + 1, E.length - 1)], _ = j.x - U.x, J = j.y - U.y, V = Math.sqrt(_ * _ + J * J) || 1e-3, Q = -J / V * f[N], nt = _ / V * f[N];
        u.lineTo(U.x - Q, U.y - nt);
      }
      u.closePath(), u.fillStyle = `rgba(${b},0.85)`, u.fill();
      for (let N = 1; N < E.length - 2; N += 2) {
        const U = E[N], j = f[N] * 0.7;
        j > 1 && (u.beginPath(), u.arc(U.x, U.y, j, 0, Math.PI * 2), u.fillStyle = `rgba(${w},0.5)`, u.fill());
      }
      const p = E[E.length - 1], M = E[E.length - 2], q = Math.atan2(p.y - M.y, p.x - M.x), D = Math.sin(x.tailPhase + R * 5) * 0.6, O = x.length * 0.35;
      u.beginPath(), u.moveTo(p.x, p.y), u.lineTo(
        p.x + Math.cos(q + Math.PI / 2 + D) * O,
        p.y + Math.sin(q + Math.PI / 2 + D) * O
      ), u.lineTo(
        p.x + Math.cos(q - Math.PI / 2 - D) * O,
        p.y + Math.sin(q - Math.PI / 2 - D) * O
      ), u.closePath(), u.fillStyle = `rgba(${b},0.6)`, u.fill();
      const W = E[0], z = E[1], $ = Math.atan2(W.y - z.y, W.x - z.x), Y = f[0] * 0.4, H = W.x + Math.cos($ + Math.PI / 3) * Y, G = W.y + Math.sin($ + Math.PI / 3) * Y;
      u.beginPath(), u.arc(H, G, Math.max(1.5, Y * 0.5), 0, Math.PI * 2), u.fillStyle = "#111111", u.fill(), u.restore();
    }
    function P(x) {
      const {
        fishCount: R,
        fishColor: E,
        scaleColor: b,
        waterColor: w,
        rippleColor: f,
        lilyColor: p,
        speed: M,
        showLilies: q,
        caustics: D
      } = o.current;
      d.current += x * 1e-3;
      const O = d.current;
      if (u.fillStyle = w, u.fillRect(0, 0, v, S), D) {
        const Y = Math.ceil(v / 40), H = Math.ceil(S / 40);
        yt(w);
        for (let G = 0; G < H; G++)
          for (let N = 0; N < Y; N++) {
            const U = Tr(N * 0.4, G * 0.4, O * 0.8);
            if (U > 0.6) {
              const j = (U - 0.6) * 0.25;
              u.fillStyle = `rgba(255,255,255,${j})`, u.fillRect(N * 40, G * 40, 40, 40);
            }
          }
      }
      for (; a.current.length < R; ) a.current.push(L(E, b));
      a.current.length > R && (a.current.length = R);
      const W = n.current;
      for (const $ of a.current) {
        $.wanderAngle += (Math.random() - 0.5) * 0.05;
        const Y = Math.cos($.wanderAngle) * $.speed, H = Math.sin($.wanderAngle) * $.speed;
        $.vx += (Y - $.vx) * 0.02, $.vy += (H - $.vy) * 0.02;
        for (const J of a.current) {
          if (J === $) continue;
          const V = $.x - J.x, Q = $.y - J.y, nt = Math.sqrt(V * V + Q * Q) || 1e-3;
          nt < $.length * 1.5 && ($.vx += V / nt * 0.05, $.vy += Q / nt * 0.05);
        }
        if (W) {
          const J = $.x - W.x, V = $.y - W.y, Q = Math.sqrt(J * J + V * V) || 1e-3;
          Q < 80 && ($.vx += J / Q * 0.3, $.vy += V / Q * 0.3, $.wanderAngle = Math.atan2($.vy, $.vx));
        }
        const G = 60;
        $.x < G && ($.vx += 0.1), $.x > v - G && ($.vx -= 0.1), $.y < G && ($.vy += 0.1), $.y > S - G && ($.vy -= 0.1);
        const N = Math.sqrt($.vx * $.vx + $.vy * $.vy) || 1e-3, U = $.speed * 1.8;
        N > U && ($.vx = $.vx / N * U, $.vy = $.vy / N * U), $.angle = Math.atan2($.vy, $.vx), $.x += $.vx, $.y += $.vy, $.tailPhase += 0.05;
        const j = $.segments;
        j[0].x += ($.x - j[0].x) * 0.4, j[0].y += ($.y - j[0].y) * 0.4;
        const _ = $.length / j.length;
        for (let J = 1; J < j.length; J++) {
          const V = j[J - 1], Q = j[J], nt = V.x - Q.x, K = V.y - Q.y, et = Math.sqrt(nt * nt + K * K) || 1e-3;
          et > _ && (Q.x = V.x - nt / et * _, Q.y = V.y - K / et * _);
        }
        C($, O);
      }
      if (q) {
        const $ = yt(p);
        for (const Y of i.current)
          u.save(), u.translate(Y.x, Y.y), u.rotate(Y.rotation + O * 0.05), u.beginPath(), u.arc(0, 0, Y.radius, Y.gapAngle, Math.PI * 2 - Y.gapAngle), u.lineTo(0, 0), u.closePath(), u.fillStyle = `rgba(${$},0.55)`, u.fill(), u.strokeStyle = `rgba(${$},0.3)`, u.lineWidth = 1, u.stroke(), u.beginPath(), u.arc(0, 0, Y.radius * 0.15, 0, Math.PI * 2), u.fillStyle = `rgba(${$},0.8)`, u.fill(), u.restore();
      }
      const z = yt(f);
      for (let $ = s.current.length - 1; $ >= 0; $--) {
        const Y = s.current[$];
        if (Y.radius += 1.2, Y.alpha -= 0.012, Y.alpha <= 0) {
          s.current.splice($, 1);
          continue;
        }
        u.beginPath(), u.arc(Y.x, Y.y, Y.radius, 0, Math.PI * 2), u.strokeStyle = `rgba(${z},${Y.alpha})`, u.lineWidth = 1, u.stroke(), Y.radius > 10 && (u.beginPath(), u.arc(Y.x, Y.y, Y.radius * 0.6, 0, Math.PI * 2), u.strokeStyle = `rgba(${z},${Y.alpha * 0.5})`, u.stroke());
      }
    }
    let m = 0;
    function I(x) {
      const R = m ? x - m : 16;
      m = x, P(R), l.current = requestAnimationFrame(I);
    }
    return l.current = requestAnimationFrame(I), () => {
      F.disconnect(), cancelAnimationFrame(l.current), e.removeEventListener("mousemove", c), e.removeEventListener("mouseleave", g);
    };
  }, [r]);
}
const zr = {
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
}, Dr = ht(
  (r, y) => {
    const {
      preset: o,
      fishCount: a,
      fishColor: s,
      scaleColor: i,
      waterColor: l,
      rippleColor: d,
      lilyColor: n,
      speed: t,
      interactive: e,
      showLilies: h,
      caustics: u,
      width: v,
      height: S,
      className: L,
      style: T
    } = r, k = o && zr[o] || {}, B = X(null);
    return gt(y, () => B.current), Lr(B, {
      fishCount: a ?? 6,
      fishColor: s ?? k.fishColor ?? "#ffffff",
      scaleColor: i ?? k.scaleColor ?? "#6b7280",
      waterColor: l ?? k.waterColor ?? "#111111",
      rippleColor: d ?? k.rippleColor ?? "#6b7280",
      lilyColor: n ?? k.lilyColor ?? "#ffffff",
      speed: t ?? k.speed ?? 1,
      interactive: e ?? !0,
      showLilies: h ?? !0,
      caustics: u ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: L,
        style: {
          width: v ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...T
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
Dr.displayName = "KoiPond";
function qr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X(0), l = X(0), d = X({ x: 0, y: 0, tx: 0, ty: 0 });
  ft(() => {
    const n = r.current;
    if (!n) return;
    const t = n.parentElement;
    if (!t) return;
    const e = n.getContext("2d");
    let h = 0, u = 0;
    function v(C, P) {
      const m = C + Math.random() * P, I = Math.sqrt(200 / m) * 0.02 * (Math.random() < 0.5 ? 1 : -1);
      return {
        angle: Math.random() * Math.PI * 2,
        radius: m,
        speed: I,
        alpha: 0.3 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
        trail: []
      };
    }
    function S() {
      const { particleCount: C, eventHorizonRadius: P, diskWidth: m } = o.current;
      a.current = Array.from(
        { length: C },
        () => v(P, m)
      ), s.current = Array.from({ length: 40 }, (I, x) => ({
        y: -20 - x * 8,
        side: x % 2 === 0 ? 1 : -1,
        alpha: 0.3 + Math.random() * 0.4,
        vx: (Math.random() - 0.5) * 1.5,
        x: (Math.random() - 0.5) * 20
      }));
    }
    function L(C, P) {
      const m = window.devicePixelRatio || 1;
      n.width = Math.round(C * m), n.height = Math.round(P * m), n.style.width = `${C}px`, n.style.height = `${P}px`, e.scale(m, m), h = C, u = P, d.current = { x: h / 2, y: u / 2, tx: h / 2, ty: u / 2 }, S();
    }
    const T = new ResizeObserver((C) => {
      const { width: P, height: m } = C[0].contentRect;
      P > 0 && m > 0 && L(P, m);
    });
    T.observe(t);
    const k = t.getBoundingClientRect();
    k.width > 0 && k.height > 0 && L(k.width, k.height);
    function B(C) {
      if (!o.current.interactive) return;
      const P = n.getBoundingClientRect();
      d.current.tx = C.clientX - P.left, d.current.ty = C.clientY - P.top;
    }
    n.addEventListener("mousemove", B);
    function F(C, P, m) {
      const R = m * m * 2;
      e.fillStyle = "rgba(255,255,255,0.12)";
      for (let E = 0; E < h; E += 30)
        for (let b = 0; b < u; b += 30) {
          const w = E - C, f = b - P, p = w * w + f * f, M = Math.sqrt(p) || 1e-3;
          if (M < m * 1.2) continue;
          const q = R / p, D = E + w / M * q, O = b + f / M * q;
          e.beginPath(), e.arc(D, O, 1, 0, Math.PI * 2), e.fill();
        }
    }
    function A(C) {
      const {
        diskColor: P,
        backgroundColor: m,
        particleCount: I,
        gravity: x,
        eventHorizonRadius: R,
        diskWidth: E,
        jetColor: b,
        showJets: w,
        lensing: f,
        speed: p
      } = o.current;
      l.current += C * 1e-3, l.current;
      const M = d.current;
      M.x += (M.tx - M.x) * 0.06, M.y += (M.ty - M.y) * 0.06;
      const q = M.x, D = M.y;
      e.fillStyle = m, e.fillRect(0, 0, h, u), f && F(q, D, R);
      const O = e.createRadialGradient(q, D, 0, q, D, R * 2.5);
      O.addColorStop(0, "rgba(0,0,0,1)"), O.addColorStop(0.4, "rgba(0,0,0,0.9)"), O.addColorStop(1, "rgba(0,0,0,0)"), e.beginPath(), e.arc(q, D, R * 2.5, 0, Math.PI * 2), e.fillStyle = O, e.fill();
      const W = yt(P);
      for (; a.current.length < I; ) a.current.push(v(R, E));
      a.current.length > I && (a.current.length = I);
      for (const $ of a.current) {
        $.angle += $.speed * p, $.radius -= 0.015 * p;
        const Y = q + Math.cos($.angle) * $.radius, H = D + Math.sin($.angle) * $.radius * 0.35;
        $.trail.push({ x: Y, y: H }), $.trail.length > 5 && $.trail.shift(), $.radius < R && ($.radius = R + Math.random() * E, $.angle = Math.random() * Math.PI * 2, $.trail = [], $.alpha = 0.3 + Math.random() * 0.6);
        const G = Math.min(1, (R + E - $.radius) / E + 0.3), N = $.alpha * G;
        if ($.trail.length > 1) {
          e.beginPath(), e.moveTo($.trail[0].x, $.trail[0].y);
          for (let U = 1; U < $.trail.length; U++) e.lineTo($.trail[U].x, $.trail[U].y);
          e.strokeStyle = `rgba(${W},${N * 0.4})`, e.lineWidth = $.size * 0.8, e.lineCap = "round", e.stroke();
        }
        e.beginPath(), e.arc(Y, H, $.size, 0, Math.PI * 2), e.fillStyle = `rgba(${W},${N})`, e.fill();
      }
      const z = e.createRadialGradient(q, D, 0, q, D, R * 1.5);
      if (z.addColorStop(0, "rgba(0,0,0,1)"), z.addColorStop(0.6, "rgba(0,0,0,0.95)"), z.addColorStop(1, "rgba(0,0,0,0)"), e.beginPath(), e.arc(q, D, R * 1.5, 0, Math.PI * 2), e.fillStyle = z, e.fill(), w) {
        const $ = yt(b);
        for (const Y of s.current)
          Y.y -= 1.5 * p, Y.x += Y.vx * 0.3, Y.alpha -= 6e-3 * p, Y.alpha <= 0 && (Y.y = -(Math.random() * 20), Y.x = (Math.random() - 0.5) * 15, Y.alpha = 0.2 + Math.random() * 0.4, Y.vx = (Math.random() - 0.5) * 1.5), e.beginPath(), e.arc(q + Y.x, D + Y.y, 1.5, 0, Math.PI * 2), e.fillStyle = `rgba(${$},${Y.alpha})`, e.fill(), e.beginPath(), e.arc(q + Y.x, D - Y.y, 1.5, 0, Math.PI * 2), e.fillStyle = `rgba(${$},${Y.alpha})`, e.fill();
      }
    }
    let c = 0;
    function g(C) {
      const P = c ? C - c : 16;
      c = C, A(P), i.current = requestAnimationFrame(g);
    }
    return i.current = requestAnimationFrame(g), () => {
      T.disconnect(), cancelAnimationFrame(i.current), n.removeEventListener("mousemove", B);
    };
  }, [r]);
}
const Wr = {
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
}, Yr = ht(
  (r, y) => {
    const {
      preset: o,
      diskColor: a,
      backgroundColor: s,
      particleCount: i,
      gravity: l,
      eventHorizonRadius: d,
      diskWidth: n,
      jetColor: t,
      showJets: e,
      lensing: h,
      speed: u,
      interactive: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && Wr[o] || {}, F = X(null);
    return gt(y, () => F.current), qr(F, {
      diskColor: a ?? B.diskColor ?? "#ffffff",
      backgroundColor: s ?? B.backgroundColor ?? "#111111",
      particleCount: i ?? B.particleCount ?? 300,
      gravity: l ?? B.gravity ?? 200,
      eventHorizonRadius: d ?? B.eventHorizonRadius ?? 30,
      diskWidth: n ?? B.diskWidth ?? 120,
      jetColor: t ?? B.jetColor ?? "#6b7280",
      showJets: e ?? !0,
      lensing: h ?? !0,
      speed: u ?? 1,
      interactive: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: {
          width: S ?? "100%",
          height: L ?? "100%",
          display: "block",
          overflow: "hidden",
          ...k
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
Yr.displayName = "BlackHole";
function Or(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(0), l = X({ starCount: -1, armCount: -1, armTightness: -1 }), d = X({ tiltX: y.tiltX, tiltY: 0, targetTX: y.tiltX, targetTY: 0 }), n = X(null);
  ft(() => {
    const t = r.current;
    if (!t) return;
    const e = t.parentElement;
    if (!e) return;
    const h = t.getContext("2d");
    let u = 0, v = 0, S = 0;
    function L(m) {
      return Math.sin(m * 127.1) * 0.5 + Math.sin(m * 311.7) * 0.3 + Math.sin(m * 74.3) * 0.2;
    }
    function T() {
      const { starCount: m, armCount: I, armTightness: x } = o.current;
      a.current = [];
      const R = Math.floor(m * 0.15), E = Math.floor(m * 0.2), b = m - R - E;
      for (let w = 0; w < b; w++) {
        const f = w % I, p = 0.05 + Math.random() * 0.95, q = f / I * Math.PI * 2 + p * x * Math.PI * 4, D = (L(p * f + w) * 0.15 + (Math.random() - 0.5) * 0.1) * (1 - p * 0.5);
        a.current.push({
          r: p,
          baseAngle: q + D,
          armIndex: f,
          isHalo: !1,
          size: Math.max(0.3, (1 - p * 0.7) * 2.5 + Math.random() * 0.8),
          brightness: 0.4 + (1 - p) * 0.6 + Math.random() * 0.2,
          twinkle: Math.random() * Math.PI * 2
        });
      }
      for (let w = 0; w < E; w++) {
        const f = Math.random() * Math.random() * 0.18;
        a.current.push({
          r: f,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: 0,
          isHalo: !1,
          size: 0.5 + Math.random() * 1.5,
          brightness: 0.7 + Math.random() * 0.3,
          twinkle: Math.random() * Math.PI * 2
        });
      }
      for (let w = 0; w < R; w++)
        a.current.push({
          r: 0.6 + Math.random() * 0.5,
          baseAngle: Math.random() * Math.PI * 2,
          armIndex: -1,
          isHalo: !0,
          size: 0.3 + Math.random() * 0.6,
          brightness: 0.1 + Math.random() * 0.25,
          twinkle: Math.random() * Math.PI * 2
        });
    }
    function k(m, I) {
      const x = window.devicePixelRatio || 1;
      t.width = Math.round(m * x), t.height = Math.round(I * x), t.style.width = `${m}px`, t.style.height = `${I}px`, h.scale(x, x), u = m, v = I, T();
    }
    const B = new ResizeObserver((m) => {
      const { width: I, height: x } = m[0].contentRect;
      I > 0 && x > 0 && k(I, x);
    });
    B.observe(e);
    const F = e.getBoundingClientRect();
    F.width > 0 && F.height > 0 && k(F.width, F.height);
    function A(m) {
      if (!o.current.interactive) return;
      const I = t.getBoundingClientRect();
      n.current = { x: m.clientX - I.left, y: m.clientY - I.top };
    }
    function c() {
      n.current = null;
    }
    t.addEventListener("mousemove", A), t.addEventListener("mouseleave", c);
    function g(m) {
      const {
        starCount: I,
        armCount: x,
        armTightness: R,
        coreColor: E,
        diskColor: b,
        backgroundColor: w,
        rotationSpeed: f,
        coreGlow: p,
        glowBlur: M
      } = o.current, q = l.current;
      (q.starCount !== I || q.armCount !== x || q.armTightness !== R) && (T(), l.current = { starCount: I, armCount: x, armTightness: R }), i.current += m * 1e-3, S += f * m * 1e-3 * 300;
      const D = d.current, O = n.current;
      O ? (D.targetTX = 0.1 + O.y / v * 0.7, D.targetTY = (O.x / u - 0.5) * 1.2) : (D.targetTX = o.current.tiltX, D.targetTY = 0), D.tiltX += (D.targetTX - D.tiltX) * 0.04, D.tiltY += (D.targetTY - D.tiltY) * 0.04, h.fillStyle = w, h.fillRect(0, 0, u, v);
      const W = u / 2, z = v / 2, $ = Math.min(u, v) * 0.45, Y = Math.cos(D.tiltX), H = Math.sin(D.tiltY), G = Math.cos(D.tiltY), N = yt(E), U = yt(b), j = a.current, _ = [];
      for (const J of j) {
        J.twinkle += 0.02;
        const V = J.baseAngle + S * (1 - J.r * 0.3), Q = J.r * $, nt = Math.cos(V) * Q, K = Math.sin(V) * Q, et = J.isHalo ? (Math.random() - 0.5) * Q * 0.3 : 0, tt = nt * G - K * H, ot = nt * H + K * G, at = W + tt, Z = z + et * 1 + ot * Y, rt = ot;
        _.push({ sx: at, sy: Z, sz: rt, star: J });
      }
      if (_.sort((J, V) => J.sz - V.sz), p) {
        const J = $ * 0.12, V = h.createRadialGradient(W, z, 0, W, z, J * 3);
        V.addColorStop(0, `rgba(${N},0.35)`), V.addColorStop(0.3, `rgba(${N},0.12)`), V.addColorStop(1, `rgba(${N},0)`), h.beginPath(), h.arc(W, z, J * 3, 0, Math.PI * 2), h.fillStyle = V, h.fill(), h.shadowBlur = M, h.shadowColor = `rgb(${N})`, h.beginPath(), h.arc(W, z, J * 0.4, 0, Math.PI * 2), h.fillStyle = `rgb(${N})`, h.fill(), h.shadowBlur = 0;
      }
      for (const { sx: J, sy: V, sz: Q, star: nt } of _) {
        const K = 0.8 + 0.2 * Math.sin(nt.twinkle), et = nt.brightness * K, tt = Q < 0 ? 0.5 + 0.5 * (1 + Q / $) : 1, ot = et * tt, at = nt.isHalo || nt.r > 0.4 ? U : N, Z = nt.size * (0.7 + 0.3 * tt);
        h.beginPath(), h.arc(J, V, Math.max(0.2, Z), 0, Math.PI * 2), h.fillStyle = `rgba(${at},${Math.min(1, ot)})`, h.fill();
      }
    }
    let C = 0;
    function P(m) {
      const I = C ? m - C : 16;
      C = m, g(I), s.current = requestAnimationFrame(P);
    }
    return s.current = requestAnimationFrame(P), () => {
      B.disconnect(), cancelAnimationFrame(s.current), t.removeEventListener("mousemove", A), t.removeEventListener("mouseleave", c);
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
}, Gr = ht(
  (r, y) => {
    const {
      preset: o,
      starCount: a,
      armCount: s,
      armTightness: i,
      coreColor: l,
      diskColor: d,
      backgroundColor: n,
      rotationSpeed: t,
      tiltX: e,
      interactive: h,
      coreGlow: u,
      glowBlur: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && Xr[o] || {}, F = X(null);
    return gt(y, () => F.current), Or(F, {
      starCount: a ?? 3e3,
      armCount: s ?? B.armCount ?? 2,
      armTightness: i ?? B.armTightness ?? 0.5,
      coreColor: l ?? B.coreColor ?? "#ffffff",
      diskColor: d ?? B.diskColor ?? "#6b7280",
      backgroundColor: n ?? B.backgroundColor ?? "#111111",
      rotationSpeed: t ?? B.rotationSpeed ?? 3e-4,
      tiltX: e ?? 0.3,
      interactive: h ?? !0,
      coreGlow: u ?? !0,
      glowBlur: v ?? 30
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: {
          width: S ?? "100%",
          height: L ?? "100%",
          display: "block",
          overflow: "hidden",
          ...k
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
Gr.displayName = "GalaxySpiral";
function ue(r, y, o, a, s, i) {
  if (i === 0) return [{ x: r, y }, { x: o, y: a }];
  const l = (r + o) / 2 + (Math.random() - 0.5) * s, d = (y + a) / 2 + (Math.random() - 0.5) * s * 0.3, n = s / 2;
  return [
    ...ue(r, y, l, d, n, i - 1),
    ...ue(l, d, o, a, n, i - 1).slice(1)
  ];
}
function Hr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X([]), l = X([]), d = X(0), n = X(0), t = X(0), e = X(0), h = X(0);
  ft(() => {
    const u = r.current;
    if (!u) return;
    const v = u.parentElement;
    if (!v) return;
    const S = u.getContext("2d");
    let L = 0, T = 0;
    function k() {
      const { particleCount: x } = o.current;
      a.current = Array.from({ length: x }, () => ({
        angle: Math.random() * Math.PI * 2,
        normY: Math.random(),
        speed: 0.7 + Math.random() * 0.6,
        alpha: 0.3 + Math.random() * 0.5,
        size: 1.5 + Math.random() * 3
      })), l.current = Array.from({ length: 80 }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 10 + Math.random() * 80,
        speed: 0.02 + Math.random() * 0.04,
        alpha: 0.2 + Math.random() * 0.4,
        size: 1.5 + Math.random() * 3
      }));
    }
    function B(x, R) {
      const E = window.devicePixelRatio || 1;
      u.width = Math.round(x * E), u.height = Math.round(R * E), u.style.width = `${x}px`, u.style.height = `${R}px`, S.scale(E, E), L = x, T = R, t.current = L / 2, e.current = L / 2, k();
    }
    const F = new ResizeObserver((x) => {
      const { width: R, height: E } = x[0].contentRect;
      R > 0 && E > 0 && B(R, E);
    });
    F.observe(v);
    const A = v.getBoundingClientRect();
    A.width > 0 && A.height > 0 && B(A.width, A.height);
    function c(x) {
      if (!o.current.interactive) return;
      const R = u.getBoundingClientRect();
      e.current = x.clientX - R.left;
    }
    u.addEventListener("mousemove", c);
    function g(x, R, E) {
      const b = R + Math.random() * (E - R) * 0.3, w = b + (E - R) * (0.3 + Math.random() * 0.4), f = ue(x, b, x + (Math.random() - 0.5) * 20, w, 30, 4);
      i.current.push({ points: f, alpha: 0.9, life: 8 + Math.random() * 8 }), i.current.length > 5 && i.current.shift();
    }
    function C(x, R) {
      return R * Math.pow(1 - x, 1.4) * 0.9 + R * 0.02;
    }
    function P(x) {
      const {
        funnelColor: R,
        debrisColor: E,
        lightningColor: b,
        backgroundColor: w,
        rotationSpeed: f,
        funnelHeight: p,
        showLightning: M,
        showGroundDust: q,
        speed: D
      } = o.current;
      n.current += x * 1e-3;
      const O = n.current;
      t.current += (e.current - t.current) * 0.05;
      const W = t.current, z = Math.sin(O * 0.8) * 15;
      S.fillStyle = w, S.fillRect(0, 0, L, T);
      const $ = T * (1 - p), Y = T - 20, H = Math.min(L * 0.35, 180), G = yt(R), N = yt(E), U = yt(b), j = ($ + Y) * 0.5, _ = S.createLinearGradient(W - H, $, W + H, Y);
      _.addColorStop(0, "rgba(0,0,0,0)"), _.addColorStop(0.5, "rgba(0,0,0,0.35)"), _.addColorStop(1, "rgba(0,0,0,0)"), S.beginPath(), S.moveTo(W + z, Y), S.quadraticCurveTo(W + H * 0.5 + z, j, W + H + z * 0.3, $), S.lineTo(W - H + z * 0.3, $), S.quadraticCurveTo(W - H * 0.5 + z, j, W + z, Y), S.closePath(), S.fillStyle = _, S.fill();
      const J = a.current;
      for (const V of J)
        V.angle += f / (C(V.normY, H) * 0.01 + 0.5) * D * x * 1e-3, V.normY += 4e-4 * D, V.normY > 1 && (V.normY = 0, V.angle = Math.random() * Math.PI * 2);
      for (const V of J) {
        const Q = Math.sin(V.angle);
        if (Q > 0) continue;
        const nt = C(V.normY, H), K = $ + V.normY * (Y - $), et = W + z * V.normY + Math.cos(V.angle) * nt, tt = V.alpha * (0.3 + 0.3 * -Q);
        S.beginPath(), S.arc(et, K, V.size * (0.5 + 0.5 * (1 - V.normY)), 0, Math.PI * 2), S.fillStyle = `rgba(${G},${tt})`, S.fill();
      }
      if (M) {
        h.current += x, h.current > 800 + Math.random() * 1200 && (h.current = 0, g(W + z * 0.5, $, Y));
        for (let V = i.current.length - 1; V >= 0; V--) {
          const Q = i.current[V];
          if (Q.life -= 1, Q.alpha *= 0.85, Q.life <= 0) {
            i.current.splice(V, 1);
            continue;
          }
          S.beginPath(), S.moveTo(Q.points[0].x, Q.points[0].y);
          for (let nt = 1; nt < Q.points.length; nt++)
            S.lineTo(Q.points[nt].x, Q.points[nt].y);
          S.strokeStyle = `rgba(${U},${Q.alpha})`, S.lineWidth = 1.5, S.shadowBlur = 12, S.shadowColor = `rgb(${U})`, S.stroke(), S.shadowBlur = 0;
        }
      }
      for (const V of J) {
        const Q = Math.sin(V.angle);
        if (Q <= 0) continue;
        const nt = C(V.normY, H), K = $ + V.normY * (Y - $), et = W + z * V.normY + Math.cos(V.angle) * nt, tt = V.alpha * (0.5 + 0.5 * Q);
        S.beginPath(), S.arc(et, K, V.size * (0.5 + 0.5 * (1 - V.normY)), 0, Math.PI * 2), S.fillStyle = `rgba(${G},${tt})`, S.fill();
      }
      if (q)
        for (const V of l.current) {
          V.angle += V.speed * D;
          const Q = W + z * 0.3 + Math.cos(V.angle) * V.radius, nt = Y + Math.sin(V.angle * 0.5) * 6;
          S.beginPath(), S.arc(Q, nt, V.size, 0, Math.PI * 2), S.fillStyle = `rgba(${N},${V.alpha})`, S.fill();
        }
      if (Math.random() < 0.05 * D) {
        const V = C(Math.random() * 0.3, H), Q = Math.random() * Math.PI * 2, nt = Y - Math.random() * (Y - $) * 0.3;
        s.current.push({
          x: W + Math.cos(Q) * V,
          y: nt,
          vx: (Math.random() - 0.5) * 4 * D,
          vy: -(1 + Math.random() * 2) * D,
          size: 1 + Math.random() * 3,
          alpha: 0.5 + Math.random() * 0.4,
          life: 40 + Math.random() * 40
        });
      }
      for (let V = s.current.length - 1; V >= 0; V--) {
        const Q = s.current[V];
        if (Q.x += Q.vx, Q.y += Q.vy, Q.vy += 0.05, Q.alpha -= 8e-3, Q.life -= 1, Q.alpha <= 0 || Q.life <= 0) {
          s.current.splice(V, 1);
          continue;
        }
        S.beginPath(), S.arc(Q.x, Q.y, Q.size, 0, Math.PI * 2), S.fillStyle = `rgba(${N},${Q.alpha})`, S.fill();
      }
    }
    let m = 0;
    function I(x) {
      const R = m ? x - m : 16;
      m = x, P(R), d.current = requestAnimationFrame(I);
    }
    return d.current = requestAnimationFrame(I), () => {
      F.disconnect(), cancelAnimationFrame(d.current), u.removeEventListener("mousemove", c);
    };
  }, [r]);
}
const Nr = {
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
  (r, y) => {
    const {
      preset: o,
      particleCount: a,
      funnelColor: s,
      debrisColor: i,
      lightningColor: l,
      backgroundColor: d,
      rotationSpeed: n,
      funnelHeight: t,
      vortexStrength: e,
      showLightning: h,
      showGroundDust: u,
      interactive: v,
      speed: S,
      width: L,
      height: T,
      className: k,
      style: B
    } = r, F = o && Nr[o] || {}, A = X(null);
    return gt(y, () => A.current), Hr(A, {
      particleCount: a ?? 600,
      funnelColor: s ?? F.funnelColor ?? "#ffffff",
      debrisColor: i ?? F.debrisColor ?? "#6b7280",
      lightningColor: l ?? F.lightningColor ?? "#ffffff",
      backgroundColor: d ?? F.backgroundColor ?? "#111111",
      rotationSpeed: n ?? F.rotationSpeed ?? 3,
      funnelHeight: t ?? F.funnelHeight ?? 0.8,
      vortexStrength: e ?? 1,
      showLightning: h ?? !0,
      showGroundDust: u ?? !0,
      interactive: v ?? !0,
      speed: S ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: k,
        style: {
          width: L ?? "100%",
          height: T ?? "100%",
          display: "block",
          overflow: "hidden",
          ...B
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: A,
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
function Ur(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X(0), i = X(0), l = X(null);
  ft(() => {
    const d = r.current;
    if (!d) return;
    const n = d.parentElement;
    if (!n) return;
    const t = d.getContext("2d");
    let e = 0, h = 0;
    function u(m, I) {
      const { minRadius: x, maxRadius: R } = o.current, E = x + Math.random() * (R - x);
      return {
        x: m ?? E + Math.random() * (e - E * 2),
        y: I ?? E + Math.random() * (h - E * 2),
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(0.2 + Math.random() * 0.6),
        r: E,
        hue: Math.random() * 360,
        shimmerOffset: Math.random() * Math.PI * 2,
        popping: !1,
        popProgress: 0,
        popParticles: []
      };
    }
    function v() {
      const { bubbleCount: m } = o.current;
      a.current = Array.from({ length: m }, () => u());
    }
    function S(m, I) {
      const x = window.devicePixelRatio || 1;
      d.width = Math.round(m * x), d.height = Math.round(I * x), d.style.width = `${m}px`, d.style.height = `${I}px`, t.scale(x, x), e = m, h = I, v();
    }
    const L = new ResizeObserver((m) => {
      const { width: I, height: x } = m[0].contentRect;
      I > 0 && x > 0 && S(I, x);
    });
    L.observe(n);
    const T = n.getBoundingClientRect();
    T.width > 0 && T.height > 0 && S(T.width, T.height);
    function k(m) {
      if (!o.current.interactive) return;
      const I = d.getBoundingClientRect();
      l.current = { x: m.clientX - I.left, y: m.clientY - I.top };
    }
    function B() {
      l.current = null;
    }
    function F(m) {
      if (!o.current.popEffect) return;
      const I = d.getBoundingClientRect(), x = m.clientX - I.left, R = m.clientY - I.top;
      for (const E of a.current) {
        if (E.popping) continue;
        const b = x - E.x, w = R - E.y;
        if (b * b + w * w < E.r * E.r) {
          A(E);
          break;
        }
      }
    }
    d.addEventListener("mousemove", k), d.addEventListener("mouseleave", B), d.addEventListener("click", F);
    function A(m) {
      m.popping = !0, m.popProgress = 0;
      const I = 8 + Math.floor(m.r / 8);
      for (let x = 0; x < I; x++) {
        const R = x / I * Math.PI * 2, E = 1 + Math.random() * 3;
        m.popParticles.push({
          x: m.x + Math.cos(R) * m.r,
          y: m.y + Math.sin(R) * m.r,
          vx: Math.cos(R) * E,
          vy: Math.sin(R) * E,
          alpha: 0.8
        });
      }
    }
    function c(m, I, x, R) {
      const E = Math.sin(I * 2 + m.shimmerOffset), b = yt(x), w = (m.hue + E * 30) % 360, f = (m.hue + 120 + E * 20) % 360, p = (m.hue + 240) % 360, M = t.createRadialGradient(
        m.x - m.r * 0.25,
        m.y - m.r * 0.25,
        m.r * 0.05,
        m.x,
        m.y,
        m.r
      );
      M.addColorStop(0, `hsla(${w},70%,90%,0.15)`), M.addColorStop(0.4, `hsla(${f},80%,60%,0.08)`), M.addColorStop(0.7, `hsla(${p},90%,50%,0.12)`), M.addColorStop(1, `hsla(${w},60%,30%,0.25)`), R && (t.shadowBlur = m.r * 0.4, t.shadowColor = `hsla(${w},100%,70%,0.3)`), t.beginPath(), t.arc(m.x, m.y, m.r, 0, Math.PI * 2), t.fillStyle = M, t.fill(), t.beginPath(), t.arc(m.x, m.y, m.r, 0, Math.PI * 2), t.strokeStyle = `hsla(${f},80%,75%,0.4)`, t.lineWidth = 1.5, t.stroke(), R && (t.shadowBlur = 0);
      const q = m.x - m.r * 0.32, D = m.y - m.r * 0.32, O = t.createRadialGradient(q, D, 0, q, D, m.r * 0.4);
      O.addColorStop(0, `rgba(${b},0.7)`), O.addColorStop(1, `rgba(${b},0)`), t.beginPath(), t.ellipse(q, D, m.r * 0.22, m.r * 0.14, -0.5, 0, Math.PI * 2), t.fillStyle = O, t.fill(), t.beginPath(), t.ellipse(m.x + m.r * 0.25, m.y + m.r * 0.28, m.r * 0.06, m.r * 0.04, 0.8, 0, Math.PI * 2), t.fillStyle = `rgba(${b},0.3)`, t.fill();
    }
    function g(m) {
      const {
        bubbleCount: I,
        backgroundColor: x,
        shimmerColor: R,
        gravity: E,
        friction: b,
        interactive: w,
        mergeOnCollide: f,
        glowEffect: p,
        popEffect: M
      } = o.current;
      i.current += m * 1e-3;
      const q = i.current;
      t.fillStyle = x, t.fillRect(0, 0, e, h);
      const D = a.current, O = l.current;
      for (; D.filter((W) => !W.popping).length < I; )
        D.push(u(
          Math.random() < 0.5 ? -20 : e + 20,
          h * 0.7 + Math.random() * h * 0.3
        ));
      for (let W = 0; W < D.length; W++) {
        const z = D[W];
        if (z.popping) {
          z.popProgress += 0.08;
          for (const $ of z.popParticles)
            $.x += $.vx, $.y += $.vy, $.alpha -= 0.05;
          z.popParticles = z.popParticles.filter(($) => $.alpha > 0);
          continue;
        }
        if (z.vy += E, z.vx *= b, z.vy *= b, z.x += z.vx, z.y += z.vy, z.hue = (z.hue + 0.3) % 360, w && O) {
          const $ = z.x - O.x, Y = z.y - O.y, H = Math.sqrt($ * $ + Y * Y) || 1e-3;
          if (H < z.r + 60) {
            const G = (z.r + 60 - H) * 0.015;
            z.vx += $ / H * G, z.vy += Y / H * G;
          }
        }
        z.x - z.r < 0 && (z.x = z.r, z.vx = Math.abs(z.vx) * 0.6), z.x + z.r > e && (z.x = e - z.r, z.vx = -Math.abs(z.vx) * 0.6), z.y - z.r < 0 && (z.y = z.r, z.vy = Math.abs(z.vy) * 0.6), z.y + z.r > h && (z.y = h - z.r, z.vy = -Math.abs(z.vy) * 0.8);
        for (let $ = W + 1; $ < D.length; $++) {
          const Y = D[$];
          if (Y.popping) continue;
          const H = Y.x - z.x, G = Y.y - z.y, N = Math.sqrt(H * H + G * G) || 1e-3, U = z.r + Y.r;
          if (N < U)
            if (f && N < U * 0.6) {
              const j = Math.min(
                o.current.maxRadius,
                Math.sqrt(z.r * z.r + Y.r * Y.r)
              );
              z.r = j, z.x = (z.x + Y.x) / 2, z.y = (z.y + Y.y) / 2, z.vx = (z.vx + Y.vx) * 0.5, z.vy = (z.vy + Y.vy) * 0.5, Y.popping = !0, Y.popProgress = 1;
            } else {
              const j = H / N, _ = G / N, J = U - N;
              z.x -= j * J * 0.5, z.y -= _ * J * 0.5, Y.x += j * J * 0.5, Y.y += _ * J * 0.5;
              const V = z.vx - Y.vx, Q = z.vy - Y.vy, nt = V * j + Q * _;
              nt > 0 && (z.vx -= nt * j * 0.7, z.vy -= nt * _ * 0.7, Y.vx += nt * j * 0.7, Y.vy += nt * _ * 0.7);
            }
        }
      }
      for (const W of D)
        if (!(W.popping && W.popProgress >= 1))
          if (!W.popping)
            c(W, q, R, p);
          else {
            const z = W.r * (1 + W.popProgress * 1.5);
            t.beginPath(), t.arc(W.x, W.y, z, 0, Math.PI * 2), t.strokeStyle = `hsla(${W.hue},80%,70%,${0.6 * (1 - W.popProgress)})`, t.lineWidth = 2, t.stroke();
            for (const $ of W.popParticles)
              t.beginPath(), t.arc($.x, $.y, 2, 0, Math.PI * 2), t.fillStyle = `hsla(${W.hue},80%,75%,${$.alpha})`, t.fill();
          }
      a.current = D.filter((W) => !W.popping || W.popProgress < 1.5);
    }
    let C = 0;
    function P(m) {
      const I = C ? m - C : 16;
      C = m, g(I), s.current = requestAnimationFrame(P);
    }
    return s.current = requestAnimationFrame(P), () => {
      L.disconnect(), cancelAnimationFrame(s.current), d.removeEventListener("mousemove", k), d.removeEventListener("mouseleave", B), d.removeEventListener("click", F);
    };
  }, [r]);
}
const Vr = {
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
}, _r = ht(
  (r, y) => {
    const {
      preset: o,
      bubbleCount: a,
      minRadius: s,
      maxRadius: i,
      backgroundColor: l,
      shimmerColor: d,
      popEffect: n,
      gravity: t,
      friction: e,
      interactive: h,
      mergeOnCollide: u,
      glowEffect: v,
      width: S,
      height: L,
      className: T,
      style: k
    } = r, B = o && Vr[o] || {}, F = X(null);
    return gt(y, () => F.current), Ur(F, {
      bubbleCount: a ?? B.bubbleCount ?? 15,
      minRadius: s ?? B.minRadius ?? 20,
      maxRadius: i ?? B.maxRadius ?? 50,
      backgroundColor: l ?? B.backgroundColor ?? "#111111",
      shimmerColor: d ?? B.shimmerColor ?? "#ffffff",
      popEffect: n ?? !0,
      gravity: t ?? B.gravity ?? 0.02,
      friction: e ?? 0.995,
      interactive: h ?? !0,
      mergeOnCollide: u ?? !0,
      glowEffect: v ?? !0
    }), /* @__PURE__ */ it(
      "div",
      {
        className: T,
        style: {
          width: S ?? "100%",
          height: L ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "pointer",
          ...k
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
_r.displayName = "BubbleUniverse";
function Gt(r) {
  const y = r.replace("#", ""), o = parseInt(y, 16);
  return [o >> 16 & 255, o >> 8 & 255, o & 255];
}
function Qt([r, y, o], [a, s, i], l) {
  return `rgb(${Math.round(r + (a - r) * l)},${Math.round(y + (s - y) * l)},${Math.round(o + (i - o) * l)})`;
}
function Jr(r, y, o, a, s, i, l) {
  const d = 1 - l;
  return [
    d * d * r + 2 * d * l * o + l * l * s,
    d * d * y + 2 * d * l * a + l * l * i
  ];
}
function Kr(r, y) {
  const o = Math.floor(r), a = Math.floor(y), s = r - o, i = y - a, l = (v) => {
    let S = Math.sin(v * 127.1 + 311.7) * 43758.5453;
    return S - Math.floor(S);
  }, d = l(o + a * 57), n = l(o + 1 + a * 57), t = l(o + (a + 1) * 57), e = l(o + 1 + (a + 1) * 57), h = s * s * (3 - 2 * s), u = i * i * (3 - 2 * i);
  return d + (n - d) * h + (t - d) * u + (d - n - t + e) * h * u;
}
function Qr(r, y) {
  const o = X(y);
  o.current = y;
  const a = X([]), s = X([]), i = X([]), l = X(0), d = X(0), n = X(0), t = X(null), e = X(null);
  ft(() => {
    const h = r.current;
    if (!h) return;
    const u = h.parentElement;
    if (!u) return;
    const v = h.getContext("2d");
    let S = 0, L = 0;
    function T() {
      return Math.min(S, L) * 0.5 * o.current.sunRadius;
    }
    function k() {
      return S / 2;
    }
    function B() {
      return L / 2;
    }
    function F() {
      const { convectionCells: f } = o.current, p = T();
      s.current = Array.from({ length: f }, () => {
        const M = Math.random() * Math.PI * 2, q = Math.random() * p * 0.85;
        return {
          x: k() + Math.cos(M) * q,
          y: B() + Math.sin(M) * q,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          temp: Math.random(),
          phase: Math.random() * Math.PI * 2
        };
      });
    }
    function A() {
      i.current = Array.from({ length: 7 }, (f, p) => ({
        baseRadius: 1.1 + p * 0.15,
        phase: p / 7 * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        alpha: 0.25 - p * 0.025,
        width: 15 + p * 5
      }));
    }
    function c(f, p = !1) {
      const { flareColor: M } = o.current, q = T(), D = f + (Math.random() - 0.5) * 1.2, O = p ? q * (3 + Math.random() * 2) : q * (1.2 + Math.random() * 2), W = k() + Math.cos(D) * (q + O), z = B() + Math.sin(D) * (q + O), $ = p || Math.random() < 0.15, Y = $ ? f + (Math.random() - 0.5) * 0.8 : f + (Math.random() - 0.5) * 2.5, H = $ ? q * (2.5 + Math.random() * 2.5) : q * (0.8 + Math.random() * 0.4), G = k() + Math.cos(Y) * H, N = B() + Math.sin(Y) * H, U = 60 + Math.floor(q * 0.8), j = Array.from({ length: U }, (_, J) => ({
        t: J / U * 0.2,
        speed: 3e-3 + Math.random() * 5e-3,
        alpha: 0.7 + Math.random() * 0.3,
        size: 2.5 + Math.random() * 6,
        hue: 0
      }));
      a.current.push({
        angle: f,
        cpX: W,
        cpY: z,
        endX: G,
        endY: N,
        particles: j,
        age: 0,
        duration: $ ? 280 : 240 + Math.random() * 80,
        escaped: $,
        color: M
      });
    }
    function g(f, p) {
      const M = window.devicePixelRatio || 1;
      h.width = Math.round(f * M), h.height = Math.round(p * M), h.style.width = `${f}px`, h.style.height = `${p}px`, v.scale(M, M), S = f, L = p, F(), A();
    }
    const C = new ResizeObserver((f) => {
      const { width: p, height: M } = f[0].contentRect;
      p > 0 && M > 0 && g(p, M);
    });
    C.observe(u);
    const P = u.getBoundingClientRect();
    P.width > 0 && P.height > 0 && g(P.width, P.height);
    function m(f) {
      if (!o.current.interactive) return;
      const p = h.getBoundingClientRect(), M = f.clientX - p.left, q = f.clientY - p.top, D = Math.atan2(q - B(), M - k());
      t.current = D;
    }
    function I(f) {
      const p = h.getBoundingClientRect();
      e.current = { x: f.clientX - p.left, y: f.clientY - p.top };
    }
    h.addEventListener("click", m), h.addEventListener("mousemove", I);
    function x(f) {
      const { sunColor: p, glowEffect: M, glowBlur: q, coronaColor: D } = o.current, O = T(), W = k(), z = B(), $ = Gt(p), Y = Gt(o.current.backgroundColor), H = Gt(D);
      for (const j of i.current) {
        const _ = O * (j.baseRadius + Math.sin(f * j.speed + j.phase) * 0.05), J = v.createRadialGradient(W, z, _ * 0.85, W, z, _ + j.width);
        J.addColorStop(0, `rgba(${H[0]},${H[1]},${H[2]},${j.alpha})`), J.addColorStop(1, `rgba(${H[0]},${H[1]},${H[2]},0)`), v.beginPath(), v.arc(W, z, _ + j.width, 0, Math.PI * 2), v.fillStyle = J, v.fill();
      }
      M && (v.shadowBlur = q, v.shadowColor = `rgba(${$[0]},${$[1]},${$[2]},0.6)`);
      const G = v.createRadialGradient(W - O * 0.2, z - O * 0.2, O * 0.05, W, z, O);
      G.addColorStop(0, `rgba(${$[0]},${$[1]},${$[2]},1)`), G.addColorStop(0.5, Qt($, Y, 0.1)), G.addColorStop(0.85, Qt($, Y, 0.35)), G.addColorStop(1, Qt($, Y, 0.6)), v.beginPath(), v.arc(W, z, O, 0, Math.PI * 2), v.fillStyle = G, v.fill(), M && (v.shadowBlur = 0);
      const N = s.current, { speed: U } = o.current;
      for (const j of N) {
        j.x += j.vx * U, j.y += j.vy * U, j.phase += 0.02 * U;
        const _ = j.x - W, J = j.y - z, V = Math.sqrt(_ * _ + J * J);
        V > O * 0.88 && (j.vx -= _ / V * 0.05, j.vy -= J / V * 0.05);
        const Q = Kr(j.x * 0.02 + f * 0.1, j.y * 0.02), nt = (j.temp * 0.7 + Q * 0.3 + Math.sin(j.phase) * 0.15 + 0.5) % 1, K = 0.06 + nt * 0.08, et = O * 0.08 + nt * O * 0.06;
        v.beginPath(), v.arc(j.x, j.y, et, 0, Math.PI * 2);
        const tt = Math.round($[0] * (0.6 + nt * 0.4)), ot = Math.round($[1] * (0.6 + nt * 0.4)), at = Math.round($[2] * (0.6 + nt * 0.4));
        v.fillStyle = `rgba(${tt},${ot},${at},${K})`, v.fill();
      }
    }
    function R() {
      const { flareColor: f, speed: p } = o.current, M = Gt(f), q = Gt(o.current.backgroundColor), D = T(), O = k(), W = B();
      for (let z = a.current.length - 1; z >= 0; z--) {
        const $ = a.current[z];
        $.age += p;
        const Y = $.age / $.duration, H = O + Math.cos($.angle) * D, G = W + Math.sin($.angle) * D;
        for (const N of $.particles) {
          N.t = Math.min(1, N.t + N.speed * p);
          const [U, j] = Jr(H, G, $.cpX, $.cpY, $.endX, $.endY, N.t), _ = Math.min(N.t * 4, (1 - Y) * 3, 1), J = N.alpha * _;
          if (J <= 0) continue;
          const V = 1 - N.t * 0.5, Q = Qt(M, q, 1 - V);
          v.beginPath(), v.arc(U, j, N.size * (0.7 + 0.3 * (1 - N.t)), 0, Math.PI * 2), v.fillStyle = Q.replace("rgb", "rgba").replace(")", `,${J})`), v.fill();
        }
        $.age >= $.duration && a.current.splice(z, 1);
      }
    }
    function E(f) {
      const { backgroundColor: p, autoFlare: M, autoFlareInterval: q, flareCount: D, speed: O } = o.current;
      d.current += f * 1e-3 * O;
      const W = d.current;
      v.fillStyle = p, v.fillRect(0, 0, S, L), x(W), R();
      const z = performance.now();
      if (M && a.current.length < D && z - n.current > q / O) {
        const $ = Math.random() * Math.PI * 2, Y = Math.random() < 0.1;
        c($, Y), n.current = z;
      }
      t.current !== null && (c(t.current), t.current = null);
    }
    let b = 0;
    function w(f) {
      const p = b ? f - b : 16;
      b = f, E(p), l.current = requestAnimationFrame(w);
    }
    return l.current = requestAnimationFrame(w), () => {
      C.disconnect(), cancelAnimationFrame(l.current), h.removeEventListener("click", m), h.removeEventListener("mousemove", I);
    };
  }, [r]);
}
const Zr = {
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
}, ta = ht(
  (r, y) => {
    const {
      preset: o,
      sunColor: a,
      coronaColor: s,
      flareColor: i,
      backgroundColor: l,
      sunRadius: d,
      convectionCells: n,
      flareCount: t,
      autoFlare: e,
      autoFlareInterval: h,
      interactive: u,
      glowEffect: v,
      glowBlur: S,
      speed: L,
      width: T,
      height: k,
      className: B,
      style: F
    } = r, A = o && Zr[o] || {}, c = X(null);
    return gt(y, () => c.current), Qr(c, {
      sunColor: a ?? A.sunColor ?? "#ffffff",
      coronaColor: s ?? A.coronaColor ?? "#6b7280",
      flareColor: i ?? A.flareColor ?? "#ffffff",
      backgroundColor: l ?? A.backgroundColor ?? "#111111",
      sunRadius: d ?? A.sunRadius ?? 0.35,
      convectionCells: n ?? 20,
      flareCount: t ?? 3,
      autoFlare: e ?? !0,
      autoFlareInterval: h ?? 3e3,
      interactive: u ?? !0,
      glowEffect: v ?? !0,
      glowBlur: S ?? A.glowBlur ?? 40,
      speed: L ?? 1
    }), /* @__PURE__ */ it(
      "div",
      {
        className: B,
        style: {
          width: T ?? "100%",
          height: k ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...F
        },
        children: /* @__PURE__ */ it(
          "canvas",
          {
            ref: c,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ta.displayName = "SolarFlare";
export {
  wr as AntColony,
  Ve as AudioVisualizer,
  ln as AuroraBorealis,
  Yr as BlackHole,
  en as Boids,
  _r as BubbleUniverse,
  zo as ClothSimulation,
  Ze as Confetti,
  ir as CrystalGrowth,
  Rn as DiffusionAggregation,
  Br as DragonCursor,
  Ne as FireEffect,
  Mo as Fireworks,
  lo as FlowField,
  Wo as FluidSimulation,
  Gr as GalaxySpiral,
  _o as GameOfLife,
  Ro as GlitchOverlay,
  jn as InkBleed,
  zn as Kaleidoscope,
  Dr as KoiPond,
  Fn as LSystem,
  jo as Lightning,
  En as Lissajous,
  Eo as LiveChart,
  $o as MagneticBlob,
  Mr as MagneticField,
  Bo as Mandala,
  Le as MatrixRain,
  pr as Metaballs,
  lr as NeuralWeb,
  ro as NoiseGradient,
  We as ParticleField,
  dr as ParticleText,
  tr as PendulaWave,
  io as PixelDissolve,
  Go as Rain,
  rn as ReactionDiffusion,
  $r as SakuraBlossom,
  yn as SandSimulation,
  mo as Shockwave,
  Gn as SlimeMold,
  ta as SolarFlare,
  gn as Spirograph,
  ho as Spotlight,
  Xe as Starfield,
  Er as TerrainMesh,
  jr as TornadoVortex,
  Yn as VoronoiCells,
  Jn as WatercolorBloom,
  bn as WaveInterference,
  Qo as Wormhole
};
