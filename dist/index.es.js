import { jsx as _, jsxs as zt } from "react/jsx-runtime";
import { useRef as B, useEffect as N, forwardRef as et, useImperativeHandle as nt } from "react";
const Ot = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ", At = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", Tt = "01";
function Wt(t) {
  return t === "katakana" ? Ot : t === "latin" ? At : t === "binary" ? Tt : t || At;
}
function qt(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0);
  N(() => {
    const p = t.current;
    if (!p) return;
    const m = p.parentElement;
    if (!m) return;
    const r = p.getContext("2d");
    let i = 0, n = 0;
    function d(x, M) {
      const s = window.devicePixelRatio || 1;
      i = x, n = M, p.width = Math.round(i * s), p.height = Math.round(n * s), p.style.width = `${i}px`, p.style.height = `${n}px`, r.scale(s, s);
      const { fontSize: a } = o.current, e = Math.floor(i / a);
      u.current = Array.from(
        { length: e },
        () => Math.floor(Math.random() * -(n / a))
      );
    }
    const l = new ResizeObserver((x) => {
      const { width: M, height: s } = x[0].contentRect;
      M > 0 && s > 0 && d(M, s);
    });
    l.observe(m);
    const c = m.getBoundingClientRect();
    c.width > 0 && c.height > 0 && d(c.width, c.height);
    let y = 0, k = 0;
    function A() {
      const { color: x, backgroundColor: M, fontSize: s, charset: a, resetThreshold: e } = o.current, h = a;
      r.fillStyle = M, r.fillRect(0, 0, i, n), r.fillStyle = x, r.font = `${s}px monospace`;
      const f = u.current;
      for (let v = 0; v < f.length; v++) {
        const g = h[Math.floor(Math.random() * h.length)];
        r.fillText(g, v * s, f[v] * s), f[v]++, f[v] * s > n && Math.random() > e && (f[v] = 0);
      }
    }
    function P(x) {
      const M = y ? x - y : 0;
      y = x, k += M;
      const { speed: s } = o.current;
      k >= s && (k = k % s, A()), w.current = requestAnimationFrame(P);
    }
    return w.current = requestAnimationFrame(P), () => {
      l.disconnect(), cancelAnimationFrame(w.current);
    };
  }, [t]);
}
const Gt = {
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
}, Yt = et(
  (t, b) => {
    const {
      preset: o,
      color: u,
      backgroundColor: w,
      fontSize: p,
      speed: m,
      charset: r,
      resetThreshold: i,
      width: n,
      height: d,
      className: l,
      style: c
    } = t, y = o && Gt[o] || {}, k = B(null);
    nt(b, () => k.current);
    const A = Wt(r ?? y.charset ?? "latin");
    qt(k, {
      color: u ?? y.color ?? "#ffffff",
      backgroundColor: w ?? y.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: p ?? y.fontSize ?? 14,
      speed: m ?? y.speed ?? 33,
      charset: A,
      resetThreshold: i ?? y.resetThreshold ?? 0.95
    });
    const P = {
      width: n ?? "100%",
      height: d ?? "100%",
      display: "block",
      overflow: "hidden",
      ...c
    };
    return /* @__PURE__ */ _("div", { style: P, className: l, children: /* @__PURE__ */ _(
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
Yt.displayName = "MatrixRain";
const yt = /* @__PURE__ */ new Map();
function wt(t) {
  if (yt.has(t)) return yt.get(t);
  let b = t.trim();
  b.startsWith("#") && (b = b.slice(1));
  let o, u, w;
  if (b.length === 3)
    o = parseInt(b[0] + b[0], 16), u = parseInt(b[1] + b[1], 16), w = parseInt(b[2] + b[2], 16);
  else if (b.length === 6)
    o = parseInt(b.slice(0, 2), 16), u = parseInt(b.slice(2, 4), 16), w = parseInt(b.slice(4, 6), 16);
  else
    return yt.set(t, null), null;
  if (isNaN(o) || isNaN(u) || isNaN(w))
    return yt.set(t, null), null;
  const p = [o, u, w];
  return yt.set(t, p), p;
}
function Xt(t, b = 1) {
  const o = wt(t);
  return o ? `rgba(${o[0]},${o[1]},${o[2]},${b})` : `rgba(255,255,255,${b})`;
}
function dt(t) {
  const b = wt(t);
  return b ? `${b[0]},${b[1]},${b[2]}` : "255,255,255";
}
function jt(t, b, o) {
  return [t[0] + (b[0] - t[0]) * o, t[1] + (b[1] - t[1]) * o, t[2] + (b[2] - t[2]) * o];
}
function $t(t, b) {
  const o = Math.max(0, Math.min(1, b));
  if (t.length === 0) return [255, 255, 255];
  if (t.length === 1) return wt(t[0]) ?? [255, 255, 255];
  const u = o * (t.length - 1), w = Math.min(Math.floor(u), t.length - 2), p = u - w, m = wt(t[w]) ?? [255, 255, 255], r = wt(t[w + 1]) ?? [255, 255, 255];
  return jt(m, r, p);
}
function Ut(t, b) {
  const o = B([]), u = B(null), w = B(b);
  w.current = b;
  const p = B(0), m = B(""), r = B(""), i = B(""), n = B("");
  N(() => {
    const d = t.current;
    if (!d) return;
    const l = d, c = l.parentElement;
    if (!c) return;
    const y = l.getContext("2d");
    let k = 0, A = 0;
    function P(f, v) {
      const { particleCount: g, particleSize: C, speed: S } = w.current;
      o.current = Array.from({ length: g }, () => ({
        x: Math.random() * f,
        y: Math.random() * v,
        vx: (Math.random() - 0.5) * S * 2,
        vy: (Math.random() - 0.5) * S * 2,
        size: Math.random() * C + C * 0.4,
        opacity: Math.random() * 0.5 + 0.5
      }));
    }
    function x(f, v) {
      const g = window.devicePixelRatio || 1;
      l.width = Math.round(f * g), l.height = Math.round(v * g), l.style.width = `${f}px`, l.style.height = `${v}px`, y.scale(g, g), k = f, A = v, P(f, v);
    }
    const M = new ResizeObserver((f) => {
      const { width: v, height: g } = f[0].contentRect;
      v > 0 && g > 0 && x(v, g);
    });
    M.observe(c);
    const s = c.getBoundingClientRect();
    s.width > 0 && s.height > 0 && x(s.width, s.height);
    function a(f) {
      if (!w.current.interactive) return;
      const v = l.getBoundingClientRect();
      u.current = { x: f.clientX - v.left, y: f.clientY - v.top };
    }
    function e() {
      u.current = null;
    }
    l.addEventListener("mousemove", a), l.addEventListener("mouseleave", e);
    function h() {
      const {
        particleColor: f,
        lineColor: v,
        lineDistance: g,
        connectParticles: C,
        backgroundColor: S,
        speed: L,
        repelRadius: $,
        repelStrength: z,
        friction: R,
        maxVelocityMultiplier: E,
        lineWidth: D,
        lineOpacity: Y
      } = w.current;
      f !== i.current && (m.current = dt(f), i.current = f), v !== n.current && (r.current = dt(v), n.current = v);
      const F = o.current, X = u.current, W = m.current, T = r.current;
      y.clearRect(0, 0, k, A), S && S !== "transparent" && (y.fillStyle = S, y.fillRect(0, 0, k, A));
      for (let I = 0; I < F.length; I++) {
        const O = F[I];
        if (X) {
          const G = O.x - X.x, V = O.y - X.y, H = Math.sqrt(G * G + V * V);
          if (H < $ && H > 0) {
            const J = ($ - H) / $ * 2;
            O.vx += G / H * J * z, O.vy += V / H * J * z;
          }
        }
        O.vx *= R, O.vy *= R;
        const j = L * E, q = Math.sqrt(O.vx * O.vx + O.vy * O.vy);
        if (q > j && (O.vx = O.vx / q * j, O.vy = O.vy / q * j), O.x += O.vx, O.y += O.vy, O.x < 0 && (O.x = 0, O.vx *= -1), O.x > k && (O.x = k, O.vx *= -1), O.y < 0 && (O.y = 0, O.vy *= -1), O.y > A && (O.y = A, O.vy *= -1), y.beginPath(), y.arc(O.x, O.y, O.size, 0, Math.PI * 2), y.fillStyle = `rgba(${W},${O.opacity})`, y.fill(), C)
          for (let G = I + 1; G < F.length; G++) {
            const V = F[G], H = O.x - V.x, J = O.y - V.y, Z = Math.sqrt(H * H + J * J);
            if (Z < g) {
              const K = (1 - Z / g) * Y;
              y.beginPath(), y.moveTo(O.x, O.y), y.lineTo(V.x, V.y), y.strokeStyle = `rgba(${T},${K})`, y.lineWidth = D, y.stroke();
            }
          }
      }
      p.current = requestAnimationFrame(h);
    }
    return p.current = requestAnimationFrame(h), () => {
      M.disconnect(), cancelAnimationFrame(p.current), l.removeEventListener("mousemove", a), l.removeEventListener("mouseleave", e);
    };
  }, [t]);
}
const Vt = {
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
  }
}, Ht = et(
  (t, b) => {
    const {
      preset: o,
      particleCount: u,
      particleColor: w,
      lineColor: p,
      lineDistance: m,
      particleSize: r,
      speed: i,
      connectParticles: n,
      interactive: d,
      backgroundColor: l,
      repelRadius: c,
      repelStrength: y,
      friction: k,
      maxVelocityMultiplier: A,
      lineWidth: P,
      lineOpacity: x,
      width: M,
      height: s,
      className: a,
      style: e
    } = t, h = o && Vt[o] || {}, f = w ?? h.particleColor ?? "#ffffff", v = B(null);
    return nt(b, () => v.current), Ut(v, {
      particleCount: u ?? h.particleCount ?? 120,
      particleColor: f,
      lineColor: p ?? h.lineColor ?? "#6b7280",
      lineDistance: m ?? h.lineDistance ?? 120,
      particleSize: r ?? 2.5,
      speed: i ?? h.speed ?? 0.8,
      connectParticles: n ?? h.connectParticles ?? !0,
      interactive: d ?? !0,
      backgroundColor: l ?? h.backgroundColor ?? "transparent",
      repelRadius: c ?? 80,
      repelStrength: y ?? 0.3,
      friction: k ?? 0.99,
      maxVelocityMultiplier: A ?? 3,
      lineWidth: P ?? 0.8,
      lineOpacity: x ?? 0.6
    }), /* @__PURE__ */ _(
      "div",
      {
        className: a,
        style: { width: M ?? "100%", height: s ?? "100%", display: "block", overflow: "hidden", ...e },
        children: /* @__PURE__ */ _("canvas", { ref: v, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ht.displayName = "ParticleField";
function Zt(t, b) {
  const o = B([]), u = B([]), w = B([]), p = B(b);
  p.current = b;
  const m = B(0), r = B(0);
  N(() => {
    const i = t.current;
    if (!i) return;
    const n = i, d = n.parentElement;
    if (!d) return;
    const l = n.getContext("2d");
    let c = 0, y = 0;
    function k(a, e) {
      const { starCount: h, starSizeMin: f, starSizeMax: v, starOpacityMin: g, starOpacityMax: C, twinkleSpeed: S } = p.current;
      o.current = Array.from({ length: h }, () => ({
        x: Math.random() * a,
        y: Math.random() * e,
        size: Math.random() * (v - f) + f,
        opacity: Math.random() * (C - g) + g,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * S + S * 0.3
      }));
    }
    function A(a, e) {
      const { starCount: h } = p.current, f = Math.max(a, e);
      u.current = Array.from({ length: h }, () => ({
        x: (Math.random() - 0.5) * a * 2,
        y: (Math.random() - 0.5) * e * 2,
        z: Math.random() * f,
        pz: 0
      }));
    }
    function P(a, e) {
      const h = window.devicePixelRatio || 1;
      n.width = Math.round(a * h), n.height = Math.round(e * h), n.style.width = `${a}px`, n.style.height = `${e}px`, l.scale(h, h), c = a, y = e, k(a, e), A(a, e);
    }
    const x = new ResizeObserver((a) => {
      const { width: e, height: h } = a[0].contentRect;
      e > 0 && h > 0 && P(e, h);
    });
    x.observe(d);
    const M = d.getBoundingClientRect();
    M.width > 0 && M.height > 0 && P(M.width, M.height);
    function s(a) {
      const {
        starColor: e,
        backgroundColor: h,
        speed: f,
        twinkle: v,
        shootingStars: g,
        shootingStarInterval: C,
        perspective: S,
        shootingStarLength: L,
        shootingStarLifetime: $
      } = p.current;
      if (l.fillStyle = h, l.fillRect(0, 0, c, y), S === "3D") {
        const z = c / 2, R = y / 2, E = Math.max(c, y), D = u.current;
        for (let Y = 0; Y < D.length; Y++) {
          const F = D[Y];
          F.pz = F.z, F.z -= f * 4, F.z <= 0 && (F.x = (Math.random() - 0.5) * c * 2, F.y = (Math.random() - 0.5) * y * 2, F.z = E, F.pz = F.z);
          const X = F.x / F.z * c + z, W = F.y / F.z * y + R, T = F.x / F.pz * c + z, I = F.y / F.pz * y + R, O = Math.max((1 - F.z / E) * 3, 0.1), j = 1 - F.z / E;
          l.beginPath(), l.moveTo(T, I), l.lineTo(X, W), l.strokeStyle = `rgba(255,255,255,${j})`, l.lineWidth = O, l.stroke();
        }
      } else {
        const z = o.current;
        for (let R = 0; R < z.length; R++) {
          const E = z[R];
          E.y += f * (E.size / 2), E.y > y && (E.y = 0, E.x = Math.random() * c);
          let D = E.opacity;
          v && (E.twinklePhase += E.twinkleSpeed, D = E.opacity * (0.5 + 0.5 * Math.sin(E.twinklePhase))), l.beginPath(), l.arc(E.x, E.y, E.size, 0, Math.PI * 2), l.fillStyle = e.startsWith("#") ? `rgba(255,255,255,${D})` : `rgba(255,255,255,${D})`, l.fill();
        }
        if (g) {
          if (a - r.current > C) {
            r.current = a;
            const R = Math.random() * 8 + 4, E = Math.random() * 4 + 2;
            w.current.push({
              x: Math.random() * c * 0.7,
              y: Math.random() * y * 0.3,
              vx: R,
              vy: E,
              length: Math.random() * (L * 0.5) + L * 0.5,
              opacity: 1,
              life: 0,
              maxLife: $
            });
          }
          w.current = w.current.filter((R) => {
            if (R.x += R.vx, R.y += R.vy, R.life++, R.opacity = 1 - R.life / R.maxLife, R.opacity <= 0) return !1;
            const E = R.length / Math.sqrt(R.vx * R.vx + R.vy * R.vy), D = l.createLinearGradient(R.x, R.y, R.x - R.vx * E, R.y - R.vy * E);
            return D.addColorStop(0, `rgba(255,255,255,${R.opacity})`), D.addColorStop(1, "rgba(255,255,255,0)"), l.beginPath(), l.moveTo(R.x, R.y), l.lineTo(R.x - R.vx * E, R.y - R.vy * E), l.strokeStyle = D, l.lineWidth = 2, l.stroke(), !0;
          });
        }
      }
      m.current = requestAnimationFrame(s);
    }
    return m.current = requestAnimationFrame(s), () => {
      x.disconnect(), cancelAnimationFrame(m.current);
    };
  }, [t]);
}
const _t = {
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
}, Jt = et(
  (t, b) => {
    const {
      preset: o,
      starCount: u,
      starColor: w,
      backgroundColor: p,
      speed: m,
      twinkle: r,
      shootingStars: i,
      shootingStarInterval: n,
      perspective: d,
      starSizeMin: l,
      starSizeMax: c,
      starOpacityMin: y,
      starOpacityMax: k,
      twinkleSpeed: A,
      shootingStarLength: P,
      shootingStarLifetime: x,
      width: M,
      height: s,
      className: a,
      style: e
    } = t, h = o && _t[o] || {}, f = B(null);
    return nt(b, () => f.current), Zt(f, {
      starCount: u ?? h.starCount ?? 200,
      starColor: w ?? h.starColor ?? "#ffffff",
      backgroundColor: p ?? h.backgroundColor ?? "#111111",
      speed: m ?? h.speed ?? 0.5,
      twinkle: r ?? h.twinkle ?? !0,
      shootingStars: i ?? h.shootingStars ?? !0,
      shootingStarInterval: n ?? h.shootingStarInterval ?? 3e3,
      perspective: d ?? h.perspective ?? "2D",
      starSizeMin: l ?? 0.3,
      starSizeMax: c ?? 2.8,
      starOpacityMin: y ?? 0.3,
      starOpacityMax: k ?? 1,
      twinkleSpeed: A ?? 0.03,
      shootingStarLength: P ?? 80,
      shootingStarLifetime: x ?? 60
    }), /* @__PURE__ */ _(
      "div",
      {
        className: a,
        style: { width: M ?? "100%", height: s ?? "100%", display: "block", overflow: "hidden", ...e },
        children: /* @__PURE__ */ _("canvas", { ref: f, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Jt.displayName = "Starfield";
function Pt(t) {
  const b = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    let u = 0, w = 0, p = 0;
    const m = o / 255;
    if (t === "inferno")
      if (m < 0.33)
        u = Math.round(m / 0.33 * 200), w = 0, p = 0;
      else if (m < 0.66) {
        const i = (m - 0.33) / 0.33;
        u = Math.round(200 + i * 55), w = Math.round(i * 165), p = 0;
      } else {
        const i = (m - 0.66) / 0.34;
        u = 255, w = Math.round(165 + i * 90), p = Math.round(i * 255);
      }
    else if (t === "toxic")
      if (m < 0.4)
        u = 0, w = Math.round(m / 0.4 * 180), p = 0;
      else if (m < 0.75) {
        const i = (m - 0.4) / 0.35;
        u = Math.round(i * 180), w = Math.round(180 + i * 75), p = 0;
      } else {
        const i = (m - 0.75) / 0.25;
        u = Math.round(180 + i * 75), w = 255, p = Math.round(i * 100);
      }
    else if (t === "ice")
      if (m < 0.4)
        u = 0, w = 0, p = Math.round(m / 0.4 * 200);
      else if (m < 0.7) {
        const i = (m - 0.4) / 0.3;
        u = 0, w = Math.round(i * 200), p = Math.round(200 + i * 55);
      } else {
        const i = (m - 0.7) / 0.3;
        u = Math.round(i * 255), w = Math.round(200 + i * 55), p = 255;
      }
    else if (t === "plasma")
      if (m < 0.3) {
        const i = m / 0.3;
        u = Math.round(i * 150), w = 0, p = Math.round(i * 200);
      } else if (m < 0.6) {
        const i = (m - 0.3) / 0.3;
        u = Math.round(150 + i * 105), w = 0, p = Math.round(200 + i * 55);
      } else {
        const i = (m - 0.6) / 0.4;
        u = 255, w = Math.round(i * 200), p = 255;
      }
    else {
      const i = Math.round(m < 0.5 ? m * 2 * 180 : 180 + (m - 0.5) * 2 * 75);
      u = w = p = Math.min(255, i);
    }
    const r = Math.min(255, o * 8);
    b[o] = r << 24 | p << 16 | w << 8 | u;
  }
  return b[0] = 0, b;
}
function Kt(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(null), p = B(Pt(b.palette)), m = B(b.palette), r = B(null), i = B(null), n = B(null), d = B(null);
  N(() => {
    const l = t.current;
    if (!l) return;
    const c = l, y = c.parentElement;
    if (!y) return;
    const k = c.getContext("2d");
    let A = 0, P = 0;
    r.current || (r.current = document.createElement("canvas"), i.current = r.current.getContext("2d"));
    function x(e, h) {
      const { resolution: f } = o.current, v = window.devicePixelRatio || 1, g = Math.max(0.1, Math.min(1, f));
      c.width = Math.round(e * v), c.height = Math.round(h * v), c.style.width = `${e}px`, c.style.height = `${h}px`, A = Math.max(1, Math.round(e * g)), P = Math.max(1, Math.round(h * g)), w.current = new Uint8Array(A * P);
      const C = r.current;
      C.width = A, C.height = P, n.current = i.current.createImageData(A, P), d.current = new Uint32Array(n.current.data.buffer);
    }
    const M = new ResizeObserver((e) => {
      const { width: h, height: f } = e[0].contentRect;
      h > 0 && f > 0 && x(h, f);
    });
    M.observe(y);
    const s = y.getBoundingClientRect();
    s.width > 0 && s.height > 0 && x(s.width, s.height);
    function a() {
      const { palette: e, intensity: h, windStrength: f, windDirection: v, spread: g, cooling: C, noiseStrength: S, coolingScale: L } = o.current;
      e !== m.current && (m.current = e, p.current = Pt(e));
      const $ = w.current, z = d.current, R = n.current;
      if (!$ || !z || !R || A === 0 || P === 0) {
        u.current = requestAnimationFrame(a);
        return;
      }
      const E = Math.round(h * 255);
      for (let W = 0; W < A; W++)
        $[(P - 1) * A + W] = 255;
      const D = S / 2;
      for (let W = 0; W < A; W++) {
        const T = Math.random() * S - D;
        $[(P - 2) * A + W] = Math.max(80, Math.min(255, E + T));
      }
      const Y = Math.round(f * v), F = Math.max(1, Math.round(C * L));
      for (let W = 0; W < P - 1; W++) {
        const T = (W + 1) * A;
        for (let I = 0; I < A; I++) {
          const O = $[T + I], j = I > 0 ? $[T + I - 1] : O, q = I < A - 1 ? $[T + I + 1] : O, G = (j * g + O * 2 + q * g) / (2 + g * 2), V = F + (Math.random() * F | 0), H = 1 - W / P, J = Math.random() < H * H ? G * 0.25 * Math.random() : 0, Z = G - V - J, K = I + Y, Q = K >= 0 && K < A ? K : I;
          $[W * A + Q] = Math.max(0, Math.min(255, Z));
        }
      }
      const X = p.current;
      for (let W = 0; W < A * P; W++)
        z[W] = X[$[W]];
      k.clearRect(0, 0, c.width, c.height), i.current.putImageData(R, 0, 0), k.drawImage(r.current, 0, 0, c.width, c.height), u.current = requestAnimationFrame(a);
    }
    return u.current = requestAnimationFrame(a), () => {
      M.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]);
}
const Qt = {
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
}, Nt = et(
  (t, b) => {
    const {
      preset: o,
      palette: u,
      intensity: w,
      windStrength: p,
      windDirection: m,
      spread: r,
      cooling: i,
      noiseStrength: n,
      coolingScale: d,
      resolution: l,
      width: c,
      height: y,
      className: k,
      style: A
    } = t, P = o && Qt[o] || {}, x = B(null);
    return nt(b, () => x.current), Kt(x, {
      palette: u ?? P.palette ?? "smoke",
      intensity: w ?? P.intensity ?? 0.95,
      windStrength: p ?? P.windStrength ?? 0.3,
      windDirection: m ?? P.windDirection ?? 1,
      spread: r ?? P.spread ?? 0.7,
      cooling: i ?? P.cooling ?? 0.3,
      noiseStrength: n ?? 60,
      coolingScale: d ?? 3,
      resolution: l ?? 1
    }), /* @__PURE__ */ _(
      "div",
      {
        className: k,
        style: { width: c ?? "100%", height: y ?? "100%", display: "block", overflow: "hidden", ...A },
        children: /* @__PURE__ */ _("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Nt.displayName = "FireEffect";
function te(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(null), p = B(null), m = B(null), r = B(null), i = B(null);
  N(() => {
    var y, k;
    const n = b.audioSource;
    if (!n) {
      w.current && ((y = m.current) == null || y.disconnect(), (k = p.current) == null || k.close(), w.current = null, m.current = null, p.current = null);
      return;
    }
    const d = new AudioContext();
    p.current = d;
    const l = d.createAnalyser();
    l.fftSize = b.fftSize, l.smoothingTimeConstant = b.smoothingTimeConstant, w.current = l;
    const c = d.createMediaStreamSource(n);
    return m.current = c, c.connect(l), r.current = new Uint8Array(new ArrayBuffer(l.frequencyBinCount)), i.current = new Uint8Array(new ArrayBuffer(l.fftSize)), () => {
      c.disconnect(), d.close(), w.current = null, m.current = null, p.current = null;
    };
  }, [b.audioSource, b.fftSize, b.smoothingTimeConstant]), N(() => {
    const n = t.current;
    if (!n) return;
    const d = n, l = d.parentElement;
    if (!l) return;
    const c = d.getContext("2d");
    let y = 0, k = 0;
    function A(g, C) {
      const S = window.devicePixelRatio || 1;
      d.width = Math.round(g * S), d.height = Math.round(C * S), d.style.width = `${g}px`, d.style.height = `${C}px`, c.scale(S, S), y = g, k = C;
    }
    const P = new ResizeObserver((g) => {
      const { width: C, height: S } = g[0].contentRect;
      C > 0 && S > 0 && A(C, S);
    });
    P.observe(l);
    const x = l.getBoundingClientRect();
    x.width > 0 && x.height > 0 && A(x.width, x.height);
    function M() {
      const { glowEffect: g, glowColor: C, glowBlur: S, barColor: L } = o.current;
      g ? (c.shadowColor = C || L, c.shadowBlur = S) : c.shadowBlur = 0;
    }
    function s() {
      c.shadowBlur = 0;
    }
    function a() {
      const { backgroundColor: g } = o.current;
      g && g !== "transparent" ? (c.fillStyle = g, c.fillRect(0, 0, y, k)) : c.clearRect(0, 0, y, k);
    }
    function e(g, C, S, L, $) {
      const z = c.createLinearGradient(g, k, g, k - C);
      return z.addColorStop(0, L), z.addColorStop(1, $), z;
    }
    function h(g, C, S, L, $, z) {
      L < 1 || (c.fillStyle = $, z && L > 4 ? (c.beginPath(), c.roundRect(g, C, S, L, Math.min(S / 2, 4)), c.fill()) : c.fillRect(g, C, S, L));
    }
    function f() {
      const {
        barCount: g,
        barColor: C,
        waveColor: S,
        gapBetweenBars: L,
        rounded: $,
        mode: z,
        gradient: R,
        gradientEndColor: E,
        idleAmplitude: D,
        idleAnimationSpeed: Y
      } = o.current;
      a(), M();
      const F = performance.now() / 1e3 * Y;
      if (z === "wave") {
        c.beginPath(), c.moveTo(0, k / 2);
        for (let T = 0; T < y; T++) {
          const I = k / 2 + Math.sin(T / y * Math.PI * 4 + F * 2) * D;
          c.lineTo(T, I);
        }
        c.strokeStyle = S, c.lineWidth = 2, c.stroke(), s();
        return;
      }
      if (z === "circular") {
        const { circularRadiusRatio: T } = o.current, I = y / 2, O = k / 2, j = Math.min(y, k) * T, q = Math.max(1, 2 * Math.PI * j / g * 0.6);
        for (let G = 0; G < g; G++) {
          const V = (Math.sin(G / g * Math.PI * 2 + F * 2) * 0.5 + 0.5) * j * 0.15 + 2, H = G / g * Math.PI * 2 - Math.PI / 2, J = I + Math.cos(H) * j, Z = O + Math.sin(H) * j, K = I + Math.cos(H) * (j + V), Q = O + Math.sin(H) * (j + V);
          c.beginPath(), c.moveTo(J, Z), c.lineTo(K, Q), c.strokeStyle = R ? `hsl(${G / g * 360},70%,60%)` : C, c.lineWidth = q, c.stroke();
        }
        c.beginPath(), c.arc(I, O, j, 0, Math.PI * 2), c.strokeStyle = C, c.lineWidth = 1, c.stroke(), s();
        return;
      }
      if (z === "mirror") {
        const T = L * (g - 1), I = (y - T) / g;
        for (let O = 0; O < g; O++) {
          const j = (Math.sin(O / g * Math.PI * 2 + F * 3) * 0.5 + 0.5) * k * 0.15 + 2, q = O * (I + L), G = R ? e(q, j, I, C, E) : C;
          h(q, k / 2 - j / 2, I, j, G, $);
        }
        s();
        return;
      }
      const X = L * (g - 1), W = (y - X) / g;
      for (let T = 0; T < g; T++) {
        const I = (Math.sin(T / g * Math.PI * 2 + F * 3) * 0.5 + 0.5) * k * 0.3 + 4, O = T * (W + L), j = k - I, q = R ? e(O, I, W, C, E) : C;
        h(O, j, W, I, q, $);
      }
      s();
    }
    function v() {
      const {
        barCount: g,
        barColor: C,
        waveColor: S,
        mode: L,
        sensitivity: $,
        gapBetweenBars: z,
        rounded: R,
        gradient: E,
        gradientEndColor: D
      } = o.current;
      a();
      const Y = w.current;
      if (!Y) {
        f(), u.current = requestAnimationFrame(v);
        return;
      }
      const F = r.current, X = i.current;
      if (Y.getByteFrequencyData(F), Y.getByteTimeDomainData(X), M(), L === "bars") {
        const W = z * (g - 1), T = (y - W) / g, I = Math.max(1, Math.floor(F.length / g));
        for (let O = 0; O < g; O++) {
          const q = F[O * I] / 255 * k * $, G = O * (T + z), V = E ? e(G, q, T, C, D) : C;
          h(G, k - q, T, q, V, R);
        }
      } else if (L === "mirror") {
        const W = z * (g - 1), T = (y - W) / g, I = Math.max(1, Math.floor(F.length / g));
        for (let O = 0; O < g; O++) {
          const q = F[O * I] / 255 * k * $, G = O * (T + z), V = E ? e(G, q, T, C, D) : C;
          h(G, k / 2 - q / 2, T, q, V, R);
        }
      } else if (L === "wave") {
        c.beginPath(), Math.max(1, Math.floor(X.length / y));
        for (let W = 0; W < y; W++) {
          const T = Math.min(Math.floor(W / y * X.length), X.length - 1), I = W, O = (X[T] / 128 - 1) * (k / 2) * $ + k / 2;
          W === 0 ? c.moveTo(I, O) : c.lineTo(I, O);
        }
        if (E) {
          const W = c.createLinearGradient(0, 0, y, 0);
          W.addColorStop(0, S), W.addColorStop(0.5, D), W.addColorStop(1, S), c.strokeStyle = W;
        } else
          c.strokeStyle = S;
        c.lineWidth = 2, c.stroke();
      } else if (L === "circular") {
        const { circularRadiusRatio: W } = o.current, T = y / 2, I = k / 2, O = Math.min(y, k) * W, j = Math.max(1, Math.floor(F.length / g)), q = Math.max(1, 2 * Math.PI * O / g * 0.6);
        for (let G = 0; G < g; G++) {
          const H = F[G * j] / 255 * O * $, J = G / g * Math.PI * 2 - Math.PI / 2, Z = T + Math.cos(J) * O, K = I + Math.sin(J) * O, Q = T + Math.cos(J) * (O + H), tt = I + Math.sin(J) * (O + H);
          c.beginPath(), c.moveTo(Z, K), c.lineTo(Q, tt), c.strokeStyle = E ? `hsl(${G / g * 360},80%,60%)` : C, c.lineWidth = q, c.stroke();
        }
        c.beginPath(), c.arc(T, I, O, 0, Math.PI * 2), c.strokeStyle = C, c.lineWidth = 1.5, c.stroke();
      }
      s(), u.current = requestAnimationFrame(v);
    }
    return u.current = requestAnimationFrame(v), () => {
      P.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]);
}
const ee = {
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
}, ne = et(
  (t, b) => {
    const {
      preset: o,
      audioSource: u = null,
      barCount: w,
      barColor: p,
      waveColor: m,
      mode: r,
      sensitivity: i,
      gapBetweenBars: n,
      rounded: d,
      gradient: l,
      gradientEndColor: c,
      backgroundColor: y,
      glowEffect: k,
      glowColor: A,
      glowBlur: P,
      fftSize: x,
      smoothingTimeConstant: M,
      circularRadiusRatio: s,
      idleAmplitude: a,
      idleAnimationSpeed: e,
      width: h,
      height: f,
      className: v,
      style: g
    } = t, C = o && ee[o] || {}, S = p ?? C.barColor ?? "#ffffff", L = B(null);
    return nt(b, () => L.current), te(L, {
      audioSource: u,
      barCount: w ?? 64,
      barColor: S,
      waveColor: m ?? C.waveColor ?? S,
      mode: r ?? C.mode ?? "bars",
      sensitivity: i ?? 1,
      gapBetweenBars: n ?? 2,
      rounded: d ?? C.rounded ?? !0,
      gradient: l ?? C.gradient ?? !0,
      gradientEndColor: c ?? C.gradientEndColor ?? "#ffffff",
      backgroundColor: y ?? C.backgroundColor ?? "#111111",
      glowEffect: k ?? C.glowEffect ?? !0,
      glowColor: A ?? S,
      glowBlur: P ?? C.glowBlur ?? 12,
      fftSize: x ?? 2048,
      smoothingTimeConstant: M ?? 0.8,
      circularRadiusRatio: s ?? 0.25,
      idleAmplitude: a ?? 5,
      idleAnimationSpeed: e ?? 1
    }), /* @__PURE__ */ _(
      "div",
      {
        className: v,
        style: {
          width: h ?? "100%",
          height: f ?? "100%",
          display: "block",
          overflow: "hidden",
          ...g
        },
        children: /* @__PURE__ */ _("canvas", { ref: L, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ne.displayName = "AudioVisualizer";
function oe(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(!1), m = B(!1), r = B(0), i = B(0);
  N(() => {
    const n = t.current;
    if (!n) return;
    const d = n, l = d.parentElement;
    if (!l) return;
    const c = d.getContext("2d");
    let y = 0, k = 0;
    function A(e, h) {
      const f = window.devicePixelRatio || 1;
      d.width = Math.round(e * f), d.height = Math.round(h * f), d.style.width = `${e}px`, d.style.height = `${h}px`, c.scale(f, f), y = e, k = h;
    }
    const P = new ResizeObserver((e) => {
      const { width: h, height: f } = e[0].contentRect;
      h > 0 && f > 0 && A(h, f);
    });
    P.observe(l);
    const x = l.getBoundingClientRect();
    x.width > 0 && x.height > 0 && A(x.width, x.height);
    function M(e) {
      const { spread: h, colors: f, shapes: v, duration: g, spawnX: C, spawnY: S, spawnSpread: L, speedMin: $, speedMax: z, sizeMin: R, sizeMax: E, angularVelocity: D } = o.current, Y = y * C, F = k * S, X = Math.max(1, g / 16.67);
      for (let W = 0; W < e; W++) {
        const T = (Math.random() * 2 - 1) * h * Math.PI, I = Math.random() * (z - $) + $;
        u.current.push({
          x: Y + (Math.random() - 0.5) * L,
          y: F,
          vx: Math.sin(T) * I,
          vy: -Math.cos(T) * I,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * D,
          color: f[Math.floor(Math.random() * f.length)],
          shape: v[Math.floor(Math.random() * v.length)],
          w: Math.random() * (E - R) + R,
          h: Math.random() * (E - R) * 0.75 + R * 0.5,
          opacity: 1,
          life: 0,
          maxLife: X
        });
      }
    }
    function s(e) {
      switch (c.save(), c.translate(e.x, e.y), c.rotate(e.angle), c.globalAlpha = e.opacity, c.fillStyle = e.color, e.shape) {
        case "square":
          c.fillRect(-e.w / 2, -e.h / 2, e.w, e.h);
          break;
        case "circle":
          c.beginPath(), c.arc(0, 0, e.w / 2, 0, Math.PI * 2), c.fill();
          break;
        case "triangle":
          c.beginPath(), c.moveTo(0, -e.h / 2), c.lineTo(e.w / 2, e.h / 2), c.lineTo(-e.w / 2, e.h / 2), c.closePath(), c.fill();
          break;
        case "strip":
          c.fillRect(-e.w, -e.h / 4, e.w * 2, e.h / 2);
          break;
      }
      c.restore();
    }
    function a(e) {
      const h = r.current ? Math.min(e - r.current, 50) : 16.67;
      r.current = e;
      const { trigger: f, particleCount: v, gravity: g, continuous: C, wind: S, emissionRate: L, onComplete: $ } = o.current;
      if (f && !p.current && (M(v), m.current = !1), p.current = f, C && f) {
        i.current += L * h / 1e3;
        const R = Math.floor(i.current);
        R > 0 && (M(R), i.current -= R);
      }
      c.clearRect(0, 0, y, k);
      const z = h / 16.67;
      u.current = u.current.filter((R) => (R.vy += g * 0.3 * z, R.vx += S * 0.05 * z, R.x += R.vx * z, R.y += R.vy * z, R.angle += R.angularV * z, R.life += z, R.opacity = Math.max(0, 1 - R.life / R.maxLife), R.opacity <= 0 || R.y > k + 50 ? !1 : (s(R), !0))), c.globalAlpha = 1, !m.current && f && !C && u.current.length === 0 && p.current && (m.current = !0, $ == null || $()), w.current = requestAnimationFrame(a);
    }
    return w.current = requestAnimationFrame(a), () => {
      P.disconnect(), cancelAnimationFrame(w.current);
    };
  }, [t]);
}
const re = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"]
}, ie = {
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
}, ae = ["square", "circle", "triangle", "strip"], ce = et(
  (t, b) => {
    const {
      preset: o,
      palette: u,
      trigger: w = !1,
      particleCount: p,
      spread: m,
      gravity: r,
      colors: i,
      shapes: n,
      duration: d,
      continuous: l,
      wind: c,
      spawnX: y,
      spawnY: k,
      spawnSpread: A,
      speedMin: P,
      speedMax: x,
      sizeMin: M,
      sizeMax: s,
      angularVelocity: a,
      emissionRate: e,
      onComplete: h,
      width: f,
      height: v,
      className: g,
      style: C
    } = t, S = o && ie[o] || {}, L = u ?? S.palette ?? "monochrome", $ = i ?? S.colors ?? re[L], z = B(null);
    return nt(b, () => z.current), oe(z, {
      trigger: w,
      particleCount: p ?? 150,
      spread: m ?? 0.8,
      gravity: r ?? S.gravity ?? 0.5,
      colors: $,
      shapes: n ?? S.shapes ?? ae,
      duration: d ?? 4e3,
      continuous: l ?? !1,
      wind: c ?? S.wind ?? 0.5,
      spawnX: y ?? 0.5,
      spawnY: k ?? 0.4,
      spawnSpread: A ?? 60,
      speedMin: P ?? 4,
      speedMax: x ?? S.speedMax ?? 16,
      sizeMin: M ?? 6,
      sizeMax: s ?? 14,
      angularVelocity: a ?? 0.3,
      emissionRate: e ?? 10,
      onComplete: h
    }), /* @__PURE__ */ _(
      "div",
      {
        className: g,
        style: {
          width: f ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...C
        },
        children: /* @__PURE__ */ _("canvas", { ref: z, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ce.displayName = "Confetti";
function le(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0);
  N(() => {
    const p = t.current;
    if (!p) return;
    const m = p, r = m.parentElement;
    if (!r) return;
    const i = m.getContext("2d");
    let n = 0, d = 0;
    function l(s, a) {
      const e = window.devicePixelRatio || 1;
      m.width = Math.round(s * e), m.height = Math.round(a * e), m.style.width = `${s}px`, m.style.height = `${a}px`, i.scale(e, e), n = s, d = a;
    }
    const c = new ResizeObserver((s) => {
      const { width: a, height: e } = s[0].contentRect;
      a > 0 && e > 0 && l(a, e);
    });
    c.observe(r);
    const y = r.getBoundingClientRect();
    y.width > 0 && y.height > 0 && l(y.width, y.height);
    function k(s, a) {
      const { multiRipple: e } = o.current;
      e || (u.current = []), u.current.push({ x: s, y: a, radius: 0, opacity: 1 });
    }
    let A = 0;
    function P(s) {
      const { interactive: a, autoInterval: e, autoCenter: h } = o.current;
      !a && s - A > e && (A = s, h ? k(n / 2, d / 2) : k(
        n * 0.2 + Math.random() * n * 0.6,
        d * 0.2 + Math.random() * d * 0.6
      ));
    }
    function x(s) {
      if (!o.current.interactive) return;
      const a = m.getBoundingClientRect();
      k(s.clientX - a.left, s.clientY - a.top);
    }
    m.addEventListener("click", x);
    function M(s) {
      const { color: a, maxRadius: e, speed: h, lineWidth: f, decay: v, backgroundColor: g, radiusGrowthRate: C, opacityDecayRate: S } = o.current;
      i.clearRect(0, 0, n, d), g && g !== "transparent" && (i.fillStyle = g, i.fillRect(0, 0, n, d)), P(s), u.current = u.current.filter((L) => (L.radius += h * C, L.opacity -= v * S, L.opacity <= 0 || L.radius > e ? !1 : (i.beginPath(), i.arc(L.x, L.y, L.radius, 0, Math.PI * 2), i.strokeStyle = Xt(a, L.opacity), i.lineWidth = f, i.stroke(), !0))), w.current = requestAnimationFrame(M);
    }
    return w.current = requestAnimationFrame(M), () => {
      c.disconnect(), cancelAnimationFrame(w.current), m.removeEventListener("click", x);
    };
  }, [t]);
}
const se = {
  default: {},
  neon: {
    color: "#7C3AED",
    backgroundColor: "#050010",
    maxRadius: 200,
    lineWidth: 2
  },
  minimal: {
    color: "#94a3b8",
    backgroundColor: "transparent",
    lineWidth: 1,
    maxRadius: 120
  },
  sunset: {
    color: "#f97316",
    backgroundColor: "#0a0500",
    lineWidth: 2,
    maxRadius: 180
  },
  cosmic: {
    color: "#0891B2",
    backgroundColor: "#020f1a",
    maxRadius: 220,
    lineWidth: 1.5
  }
}, ue = et(
  (t, b) => {
    const {
      preset: o,
      color: u,
      maxRadius: w,
      speed: p,
      lineWidth: m,
      decay: r,
      multiRipple: i,
      backgroundColor: n,
      interactive: d,
      autoInterval: l,
      radiusGrowthRate: c,
      opacityDecayRate: y,
      autoCenter: k,
      width: A,
      height: P,
      className: x,
      style: M
    } = t, s = o && se[o] || {}, a = B(null);
    return nt(b, () => a.current), le(a, {
      color: u ?? s.color ?? "#ffffff",
      maxRadius: w ?? s.maxRadius ?? 150,
      speed: p ?? 2,
      lineWidth: m ?? s.lineWidth ?? 1.5,
      decay: r ?? 0.8,
      multiRipple: i ?? !0,
      backgroundColor: n ?? s.backgroundColor ?? "transparent",
      interactive: d ?? !0,
      autoInterval: l ?? 1500,
      radiusGrowthRate: c ?? 2,
      opacityDecayRate: y ?? 0.02,
      autoCenter: k ?? !0
    }), /* @__PURE__ */ _(
      "div",
      {
        className: x,
        style: {
          width: A ?? "100%",
          height: P ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: d ?? !0 ? "pointer" : "default",
          ...M
        },
        children: /* @__PURE__ */ _("canvas", { ref: a, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ue.displayName = "RippleEffect";
function Bt(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function Rt(t, b, o) {
  return t + o * (b - t);
}
function bt(t, b, o) {
  const u = t & 3, w = u < 2 ? b : o, p = u < 2 ? o : b;
  return (u & 1 ? -w : w) + (u & 2 ? -p : p);
}
const ht = new Uint8Array(256);
for (let t = 0; t < 256; t++) ht[t] = t;
for (let t = 255; t > 0; t--) {
  const b = Math.floor(Math.random() * (t + 1));
  [ht[t], ht[b]] = [ht[b], ht[t]];
}
const st = new Uint8Array(512);
for (let t = 0; t < 512; t++) st[t] = ht[t & 255];
function de(t, b) {
  const o = Math.floor(t) & 255, u = Math.floor(b) & 255, w = t - Math.floor(t), p = b - Math.floor(b), m = Bt(w), r = Bt(p), i = st[st[o] + u], n = st[st[o] + u + 1], d = st[st[o + 1] + u], l = st[st[o + 1] + u + 1];
  return Rt(
    Rt(bt(i, w, p), bt(d, w - 1, p), m),
    Rt(bt(n, w, p - 1), bt(l, w - 1, p - 1), m),
    r
  );
}
function fe(t, b, o, u) {
  let w = 0, p = 1, m = 1, r = 0;
  for (let i = 0; i < o; i++)
    w += de(t * m, b * m) * p, r += p, p *= u, m *= 2;
  return w / r;
}
function he(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(0), p = B(null), m = B(null), r = B(null), i = B(0), n = B(0);
  N(() => {
    const d = t.current;
    if (!d) return;
    const l = d, c = l.parentElement;
    if (!c) return;
    const y = l.getContext("2d");
    let k = 0, A = 0;
    function P(a, e) {
      const { resolution: h } = o.current, f = window.devicePixelRatio || 1, v = Math.max(0.05, Math.min(1, h));
      l.width = Math.round(a * f), l.height = Math.round(e * f), l.style.width = `${a}px`, l.style.height = `${e}px`, k = l.width, A = l.height;
      const g = Math.max(1, Math.round(k * v)), C = Math.max(1, Math.round(A * v));
      if (g !== i.current || C !== n.current) {
        i.current = g, n.current = C, p.current = new ImageData(g, C);
        const S = document.createElement("canvas");
        S.width = g, S.height = C;
        const L = S.getContext("2d");
        m.current = S, r.current = L;
      }
    }
    const x = new ResizeObserver((a) => {
      const { width: e, height: h } = a[0].contentRect;
      e > 0 && h > 0 && P(e, h);
    });
    x.observe(c);
    const M = c.getBoundingClientRect();
    M.width > 0 && M.height > 0 && P(M.width, M.height);
    function s(a) {
      const { colors: e, speed: h, scale: f, octaves: v, animated: g, blendMode: C, timeOffsetY: S, persistence: L } = o.current;
      if (e.length < 2) {
        u.current = requestAnimationFrame(s);
        return;
      }
      g && (w.current = a * 1e-3 * h);
      const $ = w.current, z = p.current, R = m.current, E = r.current;
      if (!z || !R || !E) {
        u.current = requestAnimationFrame(s);
        return;
      }
      const D = i.current, Y = n.current, F = z.data, X = f * 3 / D, W = f * 3 / Y;
      for (let T = 0; T < Y; T++) {
        const I = T * W;
        for (let O = 0; O < D; O++) {
          const j = fe(O * X + $, I + $ * S, v, L), q = Math.max(0, Math.min(1, (j + 1) / 2)), [G, V, H] = $t(e, q), J = (T * D + O) * 4;
          F[J] = G, F[J + 1] = V, F[J + 2] = H, F[J + 3] = 255;
        }
      }
      E.putImageData(z, 0, 0), y.globalCompositeOperation = C || "source-over", y.imageSmoothingEnabled = !0, y.imageSmoothingQuality = "high", y.drawImage(R, 0, 0, k, A), g && (u.current = requestAnimationFrame(s));
    }
    return u.current = requestAnimationFrame(s), () => {
      x.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]);
}
const ge = {
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
}, pe = et(
  (t, b) => {
    const {
      preset: o,
      colors: u,
      speed: w,
      scale: p,
      octaves: m,
      animated: r,
      blendMode: i,
      timeOffsetY: n,
      persistence: d,
      resolution: l,
      width: c,
      height: y,
      className: k,
      style: A
    } = t, P = o && ge[o] || {}, x = B(null);
    return nt(b, () => x.current), he(x, {
      colors: u ?? P.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: w ?? P.speed ?? 0.25,
      scale: p ?? P.scale ?? 1,
      octaves: m ?? P.octaves ?? 3,
      animated: r ?? !0,
      blendMode: i ?? "source-over",
      timeOffsetY: n ?? 0.5,
      persistence: d ?? 0.5,
      resolution: l ?? 0.25
    }), /* @__PURE__ */ _(
      "div",
      {
        className: k,
        style: { width: c ?? "100%", height: y ?? "100%", display: "block", overflow: "hidden", ...A },
        children: /* @__PURE__ */ _("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
pe.displayName = "NoiseGradient";
function me(t, b, o) {
  const u = B(o);
  u.current = o;
  const w = B(0), p = B(o.trigger), m = B(0), r = B("idle"), i = B([]), n = B(!1);
  N(() => {
    const d = t.current;
    if (!d) return;
    const l = d, c = l.parentElement;
    if (!c) return;
    const y = l.getContext("2d");
    let k = 0, A = 0;
    function P(e, h) {
      const { pixelSize: f, dissolvePattern: v } = u.current, g = Math.ceil(e / f), C = Math.ceil(h / f), S = g / 2, L = C / 2, $ = [];
      for (let z = 0; z < C; z++)
        for (let R = 0; R < g; R++) {
          let E;
          v === "center" ? E = Math.sqrt((R - S) ** 2 + (z - L) ** 2) / Math.sqrt(S ** 2 + L ** 2) : v === "edges" ? E = 1 - Math.sqrt((R - S) ** 2 + (z - L) ** 2) / Math.sqrt(S ** 2 + L ** 2) : v === "horizontal" ? E = R / g : E = Math.random(), $.push({ x: R * f, y: z * f, delay: E });
        }
      $.sort((z, R) => z.delay - R.delay), i.current = $;
    }
    function x(e, h) {
      const f = window.devicePixelRatio || 1;
      l.width = Math.round(e * f), l.height = Math.round(h * f), l.style.width = `${e}px`, l.style.height = `${h}px`, y.scale(f, f), k = e, A = h, P(e, h);
    }
    const M = new ResizeObserver((e) => {
      const { width: h, height: f } = e[0].contentRect;
      h > 0 && f > 0 && x(h, f);
    });
    M.observe(c);
    const s = c.getBoundingClientRect();
    s.width > 0 && s.height > 0 && x(s.width, s.height);
    function a() {
      const { trigger: e, speed: h, color: f, direction: v, pixelSize: g, onComplete: C, progressMultiplier: S } = u.current;
      e !== p.current && (p.current = e, e && (r.current = v === "in" ? "appearing" : "dissolving", m.current = 0, n.current = !1)), y.clearRect(0, 0, k, A);
      const L = i.current, $ = r.current;
      if ($ === "idle") {
        v === "out" && !e && (y.fillStyle = f, y.fillRect(0, 0, k, A)), w.current = requestAnimationFrame(a);
        return;
      }
      m.current = Math.min(m.current + h * S, 1);
      const z = m.current, R = z;
      if (y.fillStyle = f, $ === "dissolving") {
        y.fillRect(0, 0, k, A);
        for (let E = 0; E < L.length; E++) {
          const D = L[E];
          E / L.length < R && y.clearRect(D.x, D.y, g, g);
        }
      } else if ($ === "appearing")
        for (let E = 0; E < L.length; E++) {
          const D = L[E];
          E / L.length < R && y.fillRect(D.x, D.y, g, g);
        }
      z >= 1 && (v === "both" && $ === "dissolving" ? (r.current = "appearing", m.current = 0) : (r.current = "idle", n.current || (n.current = !0, C == null || C()))), w.current = requestAnimationFrame(a);
    }
    return w.current = requestAnimationFrame(a), () => {
      M.disconnect(), cancelAnimationFrame(w.current);
    };
  }, [t]);
}
const ye = et(
  ({
    children: t,
    pixelSize: b = 8,
    speed: o = 0.5,
    direction: u = "out",
    trigger: w = !1,
    color: p = "#ffffff",
    onComplete: m,
    progressMultiplier: r = 0.01,
    dissolvePattern: i = "random",
    width: n,
    height: d,
    className: l,
    style: c
  }, y) => {
    const k = B(null), A = B(null);
    return nt(y, () => k.current), me(k, A, {
      pixelSize: b,
      speed: o,
      direction: u,
      trigger: w,
      color: p,
      onComplete: m,
      progressMultiplier: r,
      dissolvePattern: i
    }), /* @__PURE__ */ zt(
      "div",
      {
        className: l,
        style: { position: "relative", width: n ?? "100%", height: d ?? "100%", overflow: "hidden", ...c },
        children: [
          t && /* @__PURE__ */ _("div", { ref: A, style: { position: "absolute", inset: 0 }, children: t }),
          /* @__PURE__ */ _(
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
ye.displayName = "PixelDissolve";
function we(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(null), m = B(""), r = B(""), i = B(""), n = B("");
  N(() => {
    const d = t.current;
    if (!d) return;
    const l = d, c = l.parentElement;
    if (!c) return;
    const y = l.getContext("2d");
    let k = 0, A = 0;
    function P(g, C) {
      const { starCount: S, speed: L, velocityMultiplier: $ } = o.current;
      u.current = Array.from({ length: S }, () => ({
        x: Math.random() * g,
        y: Math.random() * C,
        vx: (Math.random() - 0.5) * L * $,
        vy: (Math.random() - 0.5) * L * $,
        size: Math.random() * 2.5 + 1,
        twinkle: Math.random() * 0.4 + 0.6,
        twinklePhase: Math.random() * Math.PI * 2
      }));
    }
    function x(g, C) {
      const S = window.devicePixelRatio || 1;
      l.width = Math.round(g * S), l.height = Math.round(C * S), l.style.width = `${g}px`, l.style.height = `${C}px`, y.scale(S, S), k = g, A = C, P(g, C);
    }
    const M = new ResizeObserver((g) => {
      const { width: C, height: S } = g[0].contentRect;
      C > 0 && S > 0 && x(C, S);
    });
    M.observe(c);
    const s = c.getBoundingClientRect();
    s.width > 0 && s.height > 0 && x(s.width, s.height);
    function a(g) {
      const C = l.getBoundingClientRect();
      return { x: g.clientX - C.left, y: g.clientY - C.top };
    }
    function e(g) {
      if (!o.current.interactive) return;
      const { x: C, y: S } = a(g), L = u.current, { dragRadius: $ } = o.current;
      let z = -1, R = $;
      for (let E = 0; E < L.length; E++) {
        const D = L[E].x - C, Y = L[E].y - S, F = Math.sqrt(D * D + Y * Y);
        F < R && (R = F, z = E);
      }
      z !== -1 && (p.current = { starIndex: z, offsetX: L[z].x - C, offsetY: L[z].y - S });
    }
    function h(g) {
      if (!p.current) return;
      const { x: C, y: S } = a(g), L = u.current[p.current.starIndex];
      L.x = C + p.current.offsetX, L.y = S + p.current.offsetY, L.vx = 0, L.vy = 0;
    }
    function f() {
      p.current = null;
    }
    l.addEventListener("mousedown", e), l.addEventListener("mousemove", h), l.addEventListener("mouseup", f), l.addEventListener("mouseleave", f);
    function v() {
      const {
        starColor: g,
        lineColor: C,
        backgroundColor: S,
        lineStyle: L,
        glowStars: $,
        connectionDistance: z,
        twinkleSpeed: R,
        lineAlpha: E,
        lineWidth: D,
        glowMultiplier: Y,
        twinkleAmplitude: F
      } = o.current;
      C !== i.current && (m.current = dt(C), i.current = C), g !== n.current && (r.current = dt(g), n.current = g);
      const X = m.current, W = r.current;
      y.clearRect(0, 0, k, A), S && S !== "transparent" && (y.fillStyle = S, y.fillRect(0, 0, k, A));
      const T = u.current;
      for (const I of T)
        p.current && u.current[p.current.starIndex] === I || (I.x += I.vx, I.y += I.vy, I.twinklePhase += R, I.x < 0 ? I.x += k : I.x > k && (I.x -= k), I.y < 0 ? I.y += A : I.y > A && (I.y -= A));
      L === "dashed" ? y.setLineDash([4, 6]) : y.setLineDash([]);
      for (let I = 0; I < T.length; I++)
        for (let O = I + 1; O < T.length; O++) {
          const j = T[I].x - T[O].x, q = T[I].y - T[O].y, G = Math.sqrt(j * j + q * q);
          if (G < z) {
            const V = (1 - G / z) * E;
            y.beginPath(), y.moveTo(T[I].x, T[I].y), y.lineTo(T[O].x, T[O].y), y.strokeStyle = `rgba(${X},${V})`, y.lineWidth = D, y.stroke();
          }
        }
      y.setLineDash([]);
      for (const I of T) {
        const O = 1 - F + F * Math.sin(I.twinklePhase);
        $ && (y.shadowColor = g, y.shadowBlur = I.size * Y), y.beginPath(), y.arc(I.x, I.y, I.size, 0, Math.PI * 2), y.fillStyle = `rgba(${W},${O})`, y.fill();
      }
      y.shadowBlur = 0, w.current = requestAnimationFrame(v);
    }
    return w.current = requestAnimationFrame(v), () => {
      M.disconnect(), cancelAnimationFrame(w.current), l.removeEventListener("mousedown", e), l.removeEventListener("mousemove", h), l.removeEventListener("mouseup", f), l.removeEventListener("mouseleave", f);
    };
  }, [t]);
}
const be = {
  default: {},
  cosmos: {
    starColor: "#e0e7ff",
    lineColor: "#6366f1",
    backgroundColor: "#030014",
    glowStars: !0,
    connectionDistance: 120
  },
  minimal: {
    glowStars: !1,
    lineStyle: "solid",
    lineAlpha: 0.2,
    starColor: "#94a3b8",
    lineColor: "#94a3b8",
    backgroundColor: "#0f172a"
  },
  aurora: {
    starColor: "#67e8f9",
    lineColor: "#0891B2",
    backgroundColor: "#020f1a",
    glowStars: !0,
    connectionDistance: 110,
    lineStyle: "dashed"
  },
  gold: {
    starColor: "#fbbf24",
    lineColor: "#d97706",
    backgroundColor: "#0c0800",
    glowStars: !0,
    lineAlpha: 0.4
  }
}, ve = et(
  (t, b) => {
    const {
      preset: o,
      starCount: u,
      starColor: w,
      lineColor: p,
      backgroundColor: m,
      speed: r,
      interactive: i,
      lineStyle: n,
      glowStars: d,
      connectionDistance: l,
      velocityMultiplier: c,
      dragRadius: y,
      twinkleSpeed: k,
      lineAlpha: A,
      lineWidth: P,
      glowMultiplier: x,
      twinkleAmplitude: M,
      width: s,
      height: a,
      className: e,
      style: h
    } = t, f = o && be[o] || {}, v = B(null);
    return nt(b, () => v.current), we(v, {
      starCount: u ?? f.starCount ?? 80,
      starColor: w ?? f.starColor ?? "#ffffff",
      lineColor: p ?? f.lineColor ?? "#6b7280",
      backgroundColor: m ?? f.backgroundColor ?? "#111111",
      speed: r ?? 0.3,
      interactive: i ?? !0,
      lineStyle: n ?? f.lineStyle ?? "solid",
      glowStars: d ?? f.glowStars ?? !0,
      connectionDistance: l ?? f.connectionDistance ?? 100,
      velocityMultiplier: c ?? 0.3,
      dragRadius: y ?? 20,
      twinkleSpeed: k ?? 0.03,
      lineAlpha: A ?? f.lineAlpha ?? 0.5,
      lineWidth: P ?? 0.8,
      glowMultiplier: x ?? 4,
      twinkleAmplitude: M ?? 0.4
    }), /* @__PURE__ */ _(
      "div",
      {
        className: e,
        style: {
          width: s ?? "100%",
          height: a ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: i ?? !0 ? "grab" : "default",
          ...h
        },
        children: /* @__PURE__ */ _(
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
ve.displayName = "ConstellationMap";
const ut = new Uint8Array(512), gt = new Uint8Array(256);
for (let t = 0; t < 256; t++) gt[t] = t;
for (let t = 255; t > 0; t--) {
  const b = Math.floor(Math.random() * (t + 1));
  [gt[t], gt[b]] = [gt[b], gt[t]];
}
for (let t = 0; t < 512; t++) ut[t] = gt[t & 255];
function Ft(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}
function kt(t, b, o) {
  return t + o * (b - t);
}
function vt(t, b, o) {
  const u = t & 3, w = u < 2 ? b : o, p = u < 2 ? o : b;
  return (u & 1 ? -w : w) + (u & 2 ? -p : p);
}
function Dt(t, b) {
  const o = Math.floor(t) & 255, u = Math.floor(b) & 255, w = t - Math.floor(t), p = b - Math.floor(b), m = Ft(w), r = Ft(p), i = ut[ut[o] + u], n = ut[ut[o] + u + 1], d = ut[ut[o + 1] + u], l = ut[ut[o + 1] + u + 1];
  return kt(
    kt(vt(i, w, p), vt(d, w - 1, p), m),
    kt(vt(n, w, p - 1), vt(l, w - 1, p - 1), m),
    r
  );
}
function Ce(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(0);
  N(() => {
    const m = t.current;
    if (!m) return;
    const r = m.parentElement;
    if (!r) return;
    const i = m.getContext("2d");
    let n = 0, d = 0;
    function l() {
      const { colors: x } = o.current;
      return {
        x: Math.random() * n,
        y: Math.random() * d,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: x[Math.floor(Math.random() * x.length)]
      };
    }
    function c() {
      const { particleCount: x } = o.current;
      u.current = Array.from({ length: x }, l);
    }
    function y(x, M) {
      const s = t.current, a = window.devicePixelRatio || 1;
      s.width = Math.round(x * a), s.height = Math.round(M * a), s.style.width = `${x}px`, s.style.height = `${M}px`, i.scale(a, a), n = x, d = M, c();
    }
    const k = new ResizeObserver((x) => {
      const { width: M, height: s } = x[0].contentRect;
      M > 0 && s > 0 && y(M, s);
    });
    k.observe(r);
    const A = r.getBoundingClientRect();
    A.width > 0 && A.height > 0 && y(A.width, A.height);
    function P() {
      const { speed: x, noiseScale: M, fadeStrength: s, lineWidth: a, backgroundColor: e, timeSpeed: h, curl: f } = o.current;
      p.current += h * 1e-3;
      const v = p.current;
      e && e !== "transparent" ? (i.fillStyle = e, i.globalAlpha = s, i.fillRect(0, 0, n, d), i.globalAlpha = 1) : (i.fillStyle = `rgba(0,0,0,${s})`, i.fillRect(0, 0, n, d));
      const g = u.current;
      for (let C = 0; C < g.length; C++) {
        const S = g[C], L = S.x * M, $ = S.y * M, z = Dt(L + v, $ + v * 0.7) * Math.PI * 4;
        let R = Math.cos(z), E = Math.sin(z);
        if (f) {
          const X = Dt(L + 100 + v, $ + v * 0.7);
          R += -Math.sin(X * Math.PI * 2) * 0.5, E += Math.cos(X * Math.PI * 2) * 0.5;
        }
        const D = S.x, Y = S.y;
        S.vx = S.vx * 0.9 + R * x * 0.1, S.vy = S.vy * 0.9 + E * x * 0.1, S.x += S.vx, S.y += S.vy, S.age++;
        const F = Math.max(0, 1 - S.age / S.maxAge) * 0.7;
        i.beginPath(), i.moveTo(D, Y), i.lineTo(S.x, S.y), i.strokeStyle = S.color, i.globalAlpha = F, i.lineWidth = a, i.stroke(), i.globalAlpha = 1, (S.age > S.maxAge || S.x < 0 || S.x > n || S.y < 0 || S.y > d) && (u.current[C] = l());
      }
      w.current = requestAnimationFrame(P);
    }
    return w.current = requestAnimationFrame(P), () => {
      k.disconnect(), cancelAnimationFrame(w.current);
    };
  }, [t]);
}
const xe = {
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
}, Me = et(
  (t, b) => {
    const {
      preset: o,
      particleCount: u,
      colors: w,
      speed: p,
      noiseScale: m,
      trailLength: r,
      fadeStrength: i,
      lineWidth: n,
      backgroundColor: d,
      animated: l,
      timeSpeed: c,
      curl: y,
      width: k,
      height: A,
      className: P,
      style: x
    } = t, M = o && xe[o] || {}, s = B(null);
    return nt(b, () => s.current), Ce(s, {
      particleCount: u ?? 800,
      colors: w ?? M.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: p ?? M.speed ?? 1,
      noiseScale: m ?? M.noiseScale ?? 4e-3,
      trailLength: r ?? 0.04,
      fadeStrength: i ?? 0.04,
      lineWidth: n ?? 1,
      backgroundColor: d ?? M.backgroundColor ?? "#111111",
      animated: l ?? !0,
      timeSpeed: c ?? 1,
      curl: y ?? M.curl ?? !1
    }), /* @__PURE__ */ _(
      "div",
      {
        className: P,
        style: { width: k ?? "100%", height: A ?? "100%", display: "block", overflow: "hidden", ...x },
        children: /* @__PURE__ */ _("canvas", { ref: s, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Me.displayName = "FlowField";
function Re(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(null), p = B({ x: -1, y: -1 });
  N(() => {
    const m = t.current;
    if (!m) return;
    const r = m.parentElement;
    if (!r) return;
    const i = m.getContext("2d");
    let n = 0, d = 0;
    function l(x, M) {
      const s = t.current, a = window.devicePixelRatio || 1;
      s.width = Math.round(x * a), s.height = Math.round(M * a), s.style.width = `${x}px`, s.style.height = `${M}px`, i.scale(a, a), n = x, d = M;
    }
    const c = new ResizeObserver((x) => {
      const { width: M, height: s } = x[0].contentRect;
      M > 0 && s > 0 && l(M, s);
    });
    c.observe(r);
    const y = r.getBoundingClientRect();
    y.width > 0 && y.height > 0 && l(y.width, y.height);
    function k(x) {
      if (!o.current.interactive) return;
      const M = t.current.getBoundingClientRect();
      w.current = { x: x.clientX - M.left, y: x.clientY - M.top };
    }
    function A() {
      w.current = null;
    }
    r.addEventListener("mousemove", k), r.addEventListener("mouseleave", A);
    function P() {
      const {
        radius: x,
        overlayColor: M,
        overlayOpacity: s,
        edgeSoftness: a,
        followSpeed: e,
        glowColor: h,
        glowSize: f,
        showGlow: v,
        shape: g,
        ellipseRatio: C,
        defaultX: S,
        defaultY: L
      } = o.current, $ = w.current ? w.current.x : n * S, z = w.current ? w.current.y : d * L;
      p.current.x < 0 ? p.current = { x: $, y: z } : (p.current.x += ($ - p.current.x) * e, p.current.y += (z - p.current.y) * e);
      const R = p.current.x, E = p.current.y, D = x, Y = g === "ellipse" ? x * C : x;
      if (i.clearRect(0, 0, n, d), i.fillStyle = M, i.globalAlpha = s, i.fillRect(0, 0, n, d), i.globalAlpha = 1, v) {
        const T = i.createRadialGradient(R, E, D * 0.8, R, E, D + f);
        T.addColorStop(0, `${h}40`), T.addColorStop(1, "transparent"), i.fillStyle = T, i.beginPath(), i.ellipse(R, E, D + f, Y + f, 0, 0, Math.PI * 2), i.fill();
      }
      i.globalCompositeOperation = "destination-out";
      const F = D + D * a, X = Y + Y * a, W = i.createRadialGradient(R, E, D * (1 - a * 0.5), R, E, F);
      W.addColorStop(0, "rgba(0,0,0,1)"), W.addColorStop(1, "rgba(0,0,0,0)"), i.fillStyle = W, i.beginPath(), i.ellipse(R, E, F, X, 0, 0, Math.PI * 2), i.fill(), i.globalCompositeOperation = "source-over", u.current = requestAnimationFrame(P);
    }
    return u.current = requestAnimationFrame(P), () => {
      c.disconnect(), cancelAnimationFrame(u.current), r.removeEventListener("mousemove", k), r.removeEventListener("mouseleave", A);
    };
  }, [t]);
}
const ke = {
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
}, Se = et(
  (t, b) => {
    const {
      preset: o,
      radius: u,
      color: w,
      overlayColor: p,
      overlayOpacity: m,
      edgeSoftness: r,
      followSpeed: i,
      glowColor: n,
      glowSize: d,
      showGlow: l,
      shape: c,
      ellipseRatio: y,
      interactive: k,
      defaultX: A,
      defaultY: P,
      width: x,
      height: M,
      className: s,
      style: a
    } = t, e = o && ke[o] || {}, h = B(null);
    return nt(b, () => h.current), Re(h, {
      radius: u ?? e.radius ?? 120,
      color: w ?? "#ffffff",
      overlayColor: p ?? e.overlayColor ?? "#000000",
      overlayOpacity: m ?? e.overlayOpacity ?? 0.75,
      edgeSoftness: r ?? e.edgeSoftness ?? 0.4,
      followSpeed: i ?? e.followSpeed ?? 0.1,
      glowColor: n ?? e.glowColor ?? "#6b7280",
      glowSize: d ?? e.glowSize ?? 30,
      showGlow: l ?? e.showGlow ?? !0,
      shape: c ?? e.shape ?? "circle",
      ellipseRatio: y ?? e.ellipseRatio ?? 0.6,
      interactive: k ?? !0,
      defaultX: A ?? 0.5,
      defaultY: P ?? 0.5
    }), /* @__PURE__ */ _(
      "div",
      {
        className: s,
        style: { width: x ?? "100%", height: M ?? "100%", display: "block", overflow: "hidden", position: "relative", ...a },
        children: /* @__PURE__ */ _(
          "canvas",
          {
            ref: h,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
Se.displayName = "Spotlight";
function Ee(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(null), m = (r, i) => {
    const { color: n, secondaryColor: d, ringCount: l, ringSpacing: c, speed: y, maxRadius: k, lineWidth: A } = o.current;
    for (let P = 0; P < l; P++) {
      const x = P % 2 === 1;
      u.current.push({
        x: r,
        y: i,
        radius: P * c,
        maxRadius: k + P * c * 0.5,
        opacity: 1,
        color: x ? d : n,
        lineWidth: A * (1 - P * 0.15),
        speed: y * (1 + P * 0.05)
      });
    }
  };
  return N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    function c(M, s) {
      const a = t.current, e = window.devicePixelRatio || 1;
      a.width = Math.round(M * e), a.height = Math.round(s * e), a.style.width = `${M}px`, a.style.height = `${s}px`, n.scale(e, e), d = M, l = s;
    }
    const y = new ResizeObserver((M) => {
      const { width: s, height: a } = M[0].contentRect;
      s > 0 && a > 0 && c(s, a);
    });
    y.observe(i);
    const k = i.getBoundingClientRect();
    k.width > 0 && k.height > 0 && c(k.width, k.height);
    function A(M) {
      const s = t.current.getBoundingClientRect();
      m(M.clientX - s.left, M.clientY - s.top);
    }
    i.addEventListener("click", A);
    function P() {
      const { autoFire: M, autoInterval: s } = o.current;
      M && (p.current = setTimeout(() => {
        m(d * (0.3 + Math.random() * 0.4), l * (0.3 + Math.random() * 0.4)), P();
      }, s));
    }
    P();
    function x() {
      const { backgroundColor: M, glowEffect: s, glowBlur: a, fadeSpeed: e } = o.current;
      n.clearRect(0, 0, d, l), M && M !== "transparent" && (n.fillStyle = M, n.fillRect(0, 0, d, l));
      const h = [];
      for (const f of u.current)
        f.radius += f.speed, f.opacity -= e, !(f.opacity <= 0 || f.radius > f.maxRadius) && (h.push(f), n.beginPath(), n.arc(f.x, f.y, f.radius, 0, Math.PI * 2), n.strokeStyle = f.color, n.globalAlpha = f.opacity, n.lineWidth = f.lineWidth * f.opacity, s ? (n.shadowColor = f.color, n.shadowBlur = a) : n.shadowBlur = 0, n.stroke(), n.globalAlpha = 1, n.shadowBlur = 0);
      u.current = h, w.current = requestAnimationFrame(x);
    }
    return w.current = requestAnimationFrame(x), () => {
      y.disconnect(), cancelAnimationFrame(w.current), i.removeEventListener("click", A), p.current && clearTimeout(p.current);
    };
  }, [t]), { fire: m };
}
const Ae = {
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
}, Pe = et(
  (t, b) => {
    const {
      preset: o,
      color: u,
      secondaryColor: w,
      ringCount: p,
      ringSpacing: m,
      speed: r,
      maxRadius: i,
      lineWidth: n,
      fadeSpeed: d,
      autoFire: l,
      autoInterval: c,
      glowEffect: y,
      glowBlur: k,
      backgroundColor: A,
      width: P,
      height: x,
      className: M,
      style: s
    } = t, a = o && Ae[o] || {}, e = B(null);
    return nt(b, () => e.current), Ee(e, {
      color: u ?? a.color ?? "#ffffff",
      secondaryColor: w ?? a.secondaryColor ?? "#6b7280",
      ringCount: p ?? a.ringCount ?? 3,
      ringSpacing: m ?? a.ringSpacing ?? 20,
      speed: r ?? a.speed ?? 4,
      maxRadius: i ?? a.maxRadius ?? 200,
      lineWidth: n ?? a.lineWidth ?? 2,
      fadeSpeed: d ?? a.fadeSpeed ?? 0.02,
      autoFire: l ?? !1,
      autoInterval: c ?? 2e3,
      glowEffect: y ?? a.glowEffect ?? !0,
      glowBlur: k ?? a.glowBlur ?? 15,
      backgroundColor: A ?? a.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ _(
      "div",
      {
        className: M,
        style: { width: P ?? "100%", height: x ?? "100%", display: "block", overflow: "hidden", ...s },
        children: /* @__PURE__ */ _("canvas", { ref: e, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Pe.displayName = "Shockwave";
const Be = 400;
function Fe(t, b) {
  const o = t.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (o) return `rgba(${o[1]},${o[2]},${o[3]},${b})`;
  if (t.startsWith("#")) {
    const u = t.slice(1), w = u.length === 3 ? u.split("").map((i) => i + i).join("") : u, p = parseInt(w.slice(0, 2), 16), m = parseInt(w.slice(2, 4), 16), r = parseInt(w.slice(4, 6), 16);
    return `rgba(${p},${m},${r},${b})`;
  }
  return `rgba(0,0,0,${b})`;
}
function De(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B([]), p = B(0), m = B(null), r = B(/* @__PURE__ */ new Map()), i = (n) => {
    const { colors: d, shellSpeed: l } = o.current, c = t.current;
    if (!c) return;
    const y = c.clientWidth || c.width, k = c.clientHeight || c.height, A = n ?? y * 0.2 + Math.random() * y * 0.6;
    w.current.push({
      x: A,
      y: k,
      vx: (Math.random() - 0.5) * 2,
      vy: -(l + Math.random() * 3),
      targetY: k * 0.15 + Math.random() * k * 0.35,
      color: d[Math.floor(Math.random() * d.length)],
      exploded: !1
    });
  };
  return N(() => {
    const n = t.current;
    if (!n) return;
    const d = n.parentElement;
    if (!d) return;
    const l = n.getContext("2d");
    let c = 0, y = 0;
    function k(e, h) {
      const f = t.current, v = window.devicePixelRatio || 1;
      f.width = Math.round(e * v), f.height = Math.round(h * v), f.style.width = `${e}px`, f.style.height = `${h}px`, l.scale(v, v), c = e, y = h;
    }
    const A = new ResizeObserver((e) => {
      const { width: h, height: f } = e[0].contentRect;
      h > 0 && f > 0 && k(h, f);
    });
    A.observe(d);
    const P = d.getBoundingClientRect();
    P.width > 0 && P.height > 0 && k(P.width, P.height);
    function x(e) {
      const h = t.current.getBoundingClientRect();
      i(e.clientX - h.left);
    }
    d.addEventListener("click", x);
    function M() {
      const { autoLaunch: e, autoInterval: h } = o.current;
      e && (m.current = setTimeout(() => {
        i(), M();
      }, h * (0.7 + Math.random() * 0.6)));
    }
    M();
    function s(e) {
      const { colors: h, particleCount: f, spread: v, particleSize: g } = o.current, C = Be - u.current.length;
      if (C <= 0) return;
      const S = Math.min(f, C);
      for (let L = 0; L < S; L++) {
        const $ = Math.PI * 2 * L / S + (Math.random() - 0.5) * 0.5, z = v * (0.4 + Math.random() * 0.6), R = Math.random() < 0.15 ? h[Math.floor(Math.random() * h.length)] : e.color;
        u.current.push({
          x: e.x,
          y: e.y,
          vx: Math.cos($) * z,
          vy: Math.sin($) * z,
          alpha: 1,
          color: R,
          size: g * (0.5 + Math.random() * 0.8)
        });
      }
    }
    function a() {
      const { gravity: e, friction: h, fadeSpeed: f, glowEffect: v, glowBlur: g, backgroundColor: C, trailLength: S } = o.current;
      if (!C || C === "transparent")
        l.clearRect(0, 0, c, y);
      else {
        const E = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, S)));
        l.fillStyle = Fe(C, E), l.fillRect(0, 0, c, y);
      }
      let $ = 0;
      for (let E = 0; E < w.current.length; E++) {
        const D = w.current[E];
        if (D.x += D.vx, D.y += D.vy, D.vy += e * 0.3, D.y <= D.targetY && !D.exploded) {
          D.exploded = !0, s(D);
          continue;
        }
        D.exploded || (w.current[$++] = D, l.beginPath(), l.arc(D.x, D.y, 2, 0, Math.PI * 2), l.fillStyle = D.color, l.globalAlpha = 0.9, v && (l.shadowColor = D.color, l.shadowBlur = 6), l.fill(), l.shadowBlur = 0);
      }
      w.current.length = $;
      const z = r.current;
      z.forEach((E) => E.length = 0);
      let R = 0;
      for (let E = 0; E < u.current.length; E++) {
        const D = u.current[E];
        if (D.vx *= h, D.vy *= h, D.vy += e, D.x += D.vx, D.y += D.vy, D.alpha -= f, D.alpha <= 0) continue;
        u.current[R++] = D;
        let Y = z.get(D.color);
        Y || (Y = [], z.set(D.color, Y)), Y.push(D);
      }
      u.current.length = R, v && (l.shadowBlur = g);
      for (const [E, D] of z)
        if (D.length !== 0) {
          l.fillStyle = E, v && (l.shadowColor = E);
          for (let Y = 0; Y < D.length; Y++) {
            const F = D[Y];
            l.globalAlpha = F.alpha, l.beginPath(), l.arc(F.x, F.y, Math.max(0.5, F.size * F.alpha), 0, Math.PI * 2), l.fill();
          }
        }
      l.globalAlpha = 1, l.shadowBlur = 0, p.current = requestAnimationFrame(a);
    }
    return p.current = requestAnimationFrame(a), () => {
      A.disconnect(), cancelAnimationFrame(p.current), d.removeEventListener("click", x), m.current && clearTimeout(m.current);
    };
  }, [t]), { launch: i };
}
const Ie = {
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
}, $e = et(
  (t, b) => {
    const {
      preset: o,
      colors: u,
      particleCount: w,
      gravity: p,
      friction: m,
      fadeSpeed: r,
      particleSize: i,
      trailLength: n,
      spread: d,
      autoLaunch: l,
      autoInterval: c,
      glowEffect: y,
      glowBlur: k,
      backgroundColor: A,
      shellSpeed: P,
      width: x,
      height: M,
      className: s,
      style: a
    } = t, e = o && Ie[o] || {}, h = B(null);
    return nt(b, () => h.current), De(h, {
      colors: u ?? e.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: w ?? e.particleCount ?? 80,
      gravity: p ?? e.gravity ?? 0.08,
      friction: m ?? e.friction ?? 0.97,
      fadeSpeed: r ?? e.fadeSpeed ?? 0.015,
      particleSize: i ?? e.particleSize ?? 2,
      trailLength: n ?? e.trailLength ?? 6,
      spread: d ?? e.spread ?? 5,
      autoLaunch: l ?? !0,
      autoInterval: c ?? 1800,
      glowEffect: y ?? e.glowEffect ?? !0,
      glowBlur: k ?? e.glowBlur ?? 8,
      backgroundColor: A ?? e.backgroundColor ?? "#111111",
      shellSpeed: P ?? e.shellSpeed ?? 12
    }), /* @__PURE__ */ _(
      "div",
      {
        className: s,
        style: { width: x ?? "100%", height: M ?? "100%", display: "block", overflow: "hidden", ...a },
        children: /* @__PURE__ */ _("canvas", { ref: h, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
$e.displayName = "Fireworks";
function Le(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(0), p = B(0), m = B(!1), r = B(0);
  N(() => {
    const i = t.current;
    if (!i) return;
    const n = i.parentElement;
    if (!n) return;
    const d = i.getContext("2d");
    let l = 0, c = 0;
    function y(x, M) {
      const s = t.current, a = window.devicePixelRatio || 1;
      s.width = Math.round(x * a), s.height = Math.round(M * a), s.style.width = `${x}px`, s.style.height = `${M}px`, d.scale(a, a), l = x, c = M;
    }
    const k = new ResizeObserver((x) => {
      const { width: M, height: s } = x[0].contentRect;
      M > 0 && s > 0 && y(M, s);
    });
    k.observe(n);
    const A = n.getBoundingClientRect();
    A.width > 0 && A.height > 0 && y(A.width, A.height);
    function P() {
      const {
        intensity: x,
        speed: M,
        rgbShift: s,
        scanlines: a,
        scanlineOpacity: e,
        scanlineSpacing: h,
        blockGlitch: f,
        blockCount: v,
        noiseOpacity: g,
        flickerRate: C,
        color: S,
        backgroundColor: L
      } = o.current;
      w.current += M * 0.016, p.current -= 16, p.current <= 0 && (m.current = Math.random() < x, r.current = 50 + Math.random() * 150, p.current = r.current + 200 / M + Math.random() * 400 / M), r.current > 0 ? r.current -= 16 : m.current = !1, d.clearRect(0, 0, l, c), L && L !== "transparent" && (d.fillStyle = L, d.fillRect(0, 0, l, c));
      const $ = m.current;
      if (a) {
        d.fillStyle = "rgba(0,0,0,1)";
        for (let R = 0; R < c; R += h)
          d.globalAlpha = e, d.fillRect(0, R, l, 1);
        d.globalAlpha = 1;
      }
      if (Math.random() < C * ($ ? 3 : 1) && (d.fillStyle = "rgba(255,255,255,0.03)", d.fillRect(0, 0, l, c)), g > 0) {
        const R = d.createImageData(l, c);
        for (let E = 0; E < R.data.length; E += 4) {
          const D = Math.random() * 255 | 0;
          R.data[E] = D, R.data[E + 1] = D, R.data[E + 2] = D, R.data[E + 3] = Math.random() < g ? 60 : 0;
        }
        d.putImageData(R, 0, 0);
      }
      if ($) {
        if (s > 0) {
          const D = s * x * (Math.random() * 2 - 1), Y = 10 + Math.random() * 60, F = Math.random() * c;
          d.globalCompositeOperation = "screen", d.fillStyle = "rgba(255,0,0,0.08)", d.globalAlpha = 0.6, d.fillRect(D, F, l, Y), d.fillStyle = "rgba(0,255,255,0.08)", d.fillRect(-D, F + 2, l, Y), d.globalCompositeOperation = "source-over", d.globalAlpha = 1;
        }
        if (f)
          for (let D = 0; D < v; D++) {
            const Y = Math.random() * c, F = 2 + Math.random() * 20, X = (Math.random() - 0.5) * s * 2;
            try {
              const W = d.getImageData(0, Y, l, F);
              d.putImageData(W, X, Y);
            } catch {
            }
          }
        const R = Math.floor(Math.random() * c), E = 1 + Math.random() * 4;
        d.fillStyle = S, d.globalAlpha = 0.15 * x, d.fillRect(0, R, l, E), d.globalAlpha = 1;
      }
      const z = d.createRadialGradient(l / 2, c / 2, c * 0.3, l / 2, c / 2, Math.max(l, c) * 0.75);
      z.addColorStop(0, "rgba(0,0,0,0)"), z.addColorStop(1, "rgba(0,0,0,0.35)"), d.fillStyle = z, d.fillRect(0, 0, l, c), u.current = requestAnimationFrame(P);
    }
    return u.current = requestAnimationFrame(P), () => {
      k.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]);
}
const ze = {
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
}, Oe = et(
  (t, b) => {
    const {
      preset: o,
      intensity: u,
      speed: w,
      rgbShift: p,
      scanlines: m,
      scanlineOpacity: r,
      scanlineSpacing: i,
      blockGlitch: n,
      blockCount: d,
      noiseOpacity: l,
      flickerRate: c,
      color: y,
      animated: k,
      backgroundColor: A,
      width: P,
      height: x,
      className: M,
      style: s
    } = t, a = o && ze[o] || {}, e = B(null);
    return nt(b, () => e.current), Le(e, {
      intensity: u ?? a.intensity ?? 0.6,
      speed: w ?? a.speed ?? 1,
      rgbShift: p ?? a.rgbShift ?? 8,
      scanlines: m ?? a.scanlines ?? !0,
      scanlineOpacity: r ?? a.scanlineOpacity ?? 0.08,
      scanlineSpacing: i ?? a.scanlineSpacing ?? 2,
      blockGlitch: n ?? a.blockGlitch ?? !0,
      blockCount: d ?? a.blockCount ?? 4,
      noiseOpacity: l ?? a.noiseOpacity ?? 0.02,
      flickerRate: c ?? a.flickerRate ?? 0.02,
      color: y ?? a.color ?? "#ffffff",
      animated: k ?? !0,
      backgroundColor: A ?? a.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ _(
      "div",
      {
        className: M,
        style: { width: P ?? "100%", height: x ?? "100%", display: "block", overflow: "hidden", position: "relative", ...s },
        children: /* @__PURE__ */ _(
          "canvas",
          {
            ref: e,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
Oe.displayName = "GlitchOverlay";
function Te(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = (p) => {
    const m = Array.isArray(p) ? p : [p], { series: r, maxPoints: i } = o.current;
    m.forEach((n, d) => {
      r[d] && (r[d].data.push(n), r[d].data.length > i && r[d].data.shift());
    });
  };
  return N(() => {
    const p = t.current;
    if (!p) return;
    const m = p.parentElement;
    if (!m) return;
    const r = p.getContext("2d");
    let i = 0, n = 0;
    function d(k, A) {
      const P = t.current, x = window.devicePixelRatio || 1;
      P.width = Math.round(k * x), P.height = Math.round(A * x), P.style.width = `${k}px`, P.style.height = `${A}px`, r.scale(x, x), i = k, n = A;
    }
    const l = new ResizeObserver((k) => {
      const { width: A, height: P } = k[0].contentRect;
      A > 0 && P > 0 && d(A, P);
    });
    l.observe(m);
    const c = m.getBoundingClientRect();
    c.width > 0 && c.height > 0 && d(c.width, c.height);
    function y() {
      const {
        series: k,
        lineWidth: A,
        showGrid: P,
        gridColor: x,
        gridOpacity: M,
        showDots: s,
        dotRadius: a,
        fillOpacity: e,
        backgroundColor: h,
        padding: f,
        yMin: v,
        yMax: g,
        smooth: C,
        glowEffect: S,
        glowBlur: L
      } = o.current;
      r.clearRect(0, 0, i, n), h && h !== "transparent" && (r.fillStyle = h, r.fillRect(0, 0, i, n));
      const $ = f, z = i - $ * 2, R = n - $ * 2;
      let E = v ?? 1 / 0, D = g ?? -1 / 0;
      if (v === void 0 || g === void 0) {
        for (const T of k)
          for (const I of T.data)
            v === void 0 && I < E && (E = I), g === void 0 && I > D && (D = I);
        E === 1 / 0 && (E = 0), D === -1 / 0 && (D = 1), E === D && (E -= 1, D += 1);
        const W = D - E;
        E -= W * 0.1, D += W * 0.1;
      }
      const Y = D - E || 1, F = (W, T) => $ + W / Math.max(T - 1, 1) * z, X = (W) => $ + R - (W - E) / Y * R;
      if (P) {
        r.strokeStyle = x, r.globalAlpha = M, r.lineWidth = 1, r.setLineDash([4, 6]);
        for (let T = 0; T <= 5; T++) {
          const I = $ + T / 5 * R;
          r.beginPath(), r.moveTo($, I), r.lineTo(i - $, I), r.stroke();
        }
        r.setLineDash([]), r.globalAlpha = 1;
      }
      for (const W of k) {
        if (W.data.length < 2) continue;
        const T = W.data.length;
        if (r.beginPath(), C) {
          r.moveTo(F(0, T), X(W.data[0]));
          for (let I = 1; I < T - 1; I++) {
            const O = (F(I - 1, T) + F(I, T)) / 2, j = (X(W.data[I - 1]) + X(W.data[I])) / 2;
            r.quadraticCurveTo(F(I - 1, T), X(W.data[I - 1]), O, j);
          }
          r.lineTo(F(T - 1, T), X(W.data[T - 1]));
        } else {
          r.moveTo(F(0, T), X(W.data[0]));
          for (let I = 1; I < T; I++) r.lineTo(F(I, T), X(W.data[I]));
        }
        if (S && (r.shadowColor = W.color, r.shadowBlur = L), r.strokeStyle = W.color, r.lineWidth = A, r.lineJoin = "round", r.stroke(), r.shadowBlur = 0, W.filled !== !1) {
          r.lineTo(F(T - 1, T), $ + R), r.lineTo(F(0, T), $ + R), r.closePath();
          const I = r.createLinearGradient(0, $, 0, $ + R);
          I.addColorStop(0, W.color + "55"), I.addColorStop(1, W.color + "00"), r.fillStyle = I, r.globalAlpha = e, r.fill(), r.globalAlpha = 1;
        }
        if (s)
          for (let I = 0; I < T; I++)
            r.beginPath(), r.arc(F(I, T), X(W.data[I]), a, 0, Math.PI * 2), r.fillStyle = W.color, r.globalAlpha = I === T - 1 ? 1 : 0.5, r.fill(), r.globalAlpha = 1;
      }
      u.current = requestAnimationFrame(y);
    }
    return u.current = requestAnimationFrame(y), () => {
      l.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]), { push: w };
}
const We = {
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
}, qe = et(
  (t, b) => {
    const {
      preset: o,
      series: u,
      maxPoints: w,
      animated: p,
      lineWidth: m,
      showGrid: r,
      gridColor: i,
      gridOpacity: n,
      showDots: d,
      dotRadius: l,
      fillOpacity: c,
      backgroundColor: y,
      padding: k,
      yMin: A,
      yMax: P,
      smooth: x,
      glowEffect: M,
      glowBlur: s,
      scrollSpeed: a,
      width: e,
      height: h,
      className: f,
      style: v
    } = t, g = o && We[o] || {}, C = [
      { data: Array.from({ length: 30 }, (L, $) => Math.sin($ * 0.3) * 50 + 50), color: "#ffffff", filled: !0 },
      { data: Array.from({ length: 30 }, (L, $) => Math.cos($ * 0.4) * 30 + 50), color: "#6b7280", filled: !0 }
    ], S = B(null);
    return nt(b, () => S.current), Te(S, {
      series: u ?? C,
      maxPoints: w ?? 100,
      animated: p ?? !0,
      lineWidth: m ?? g.lineWidth ?? 2,
      showGrid: r ?? g.showGrid ?? !0,
      gridColor: i ?? g.gridColor ?? "#ffffff",
      gridOpacity: n ?? g.gridOpacity ?? 0.08,
      showDots: d ?? g.showDots ?? !1,
      dotRadius: l ?? 3,
      fillOpacity: c ?? g.fillOpacity ?? 1,
      backgroundColor: y ?? g.backgroundColor ?? "#111111",
      padding: k ?? 20,
      yMin: A,
      yMax: P,
      smooth: x ?? g.smooth ?? !0,
      glowEffect: M ?? g.glowEffect ?? !0,
      glowBlur: s ?? g.glowBlur ?? 8,
      scrollSpeed: a ?? 1
    }), /* @__PURE__ */ _(
      "div",
      {
        className: f,
        style: { width: e ?? "100%", height: h ?? "100%", display: "block", overflow: "hidden", ...v },
        children: /* @__PURE__ */ _("canvas", { ref: S, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
qe.displayName = "LiveChart";
function Ge(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(0);
  N(() => {
    const p = t.current;
    if (!p) return;
    const m = p.parentElement;
    if (!m) return;
    const r = p.getContext("2d");
    let i = 0, n = 0;
    function d(A, P) {
      const x = t.current, M = window.devicePixelRatio || 1;
      x.width = Math.round(A * M), x.height = Math.round(P * M), x.style.width = `${A}px`, x.style.height = `${P}px`, r.scale(M, M), i = A, n = P;
    }
    const l = new ResizeObserver((A) => {
      const { width: P, height: x } = A[0].contentRect;
      P > 0 && x > 0 && d(P, x);
    });
    l.observe(m);
    const c = m.getBoundingClientRect();
    c.width > 0 && c.height > 0 && d(c.width, c.height);
    function y(A, P, x, M, s, a, e, h, f, v, g, C, S) {
      const L = 6 + M * 2, $ = M / 8 * Math.PI * 2, z = s * (1 + M * 0.15);
      for (let R = 0; R < e; R++) {
        const E = R / e * Math.PI * 2;
        for (let D = 0; D < (h ? 2 : 1); D++) {
          r.save(), r.translate(A, P), r.rotate(E + (D === 1 ? Math.PI / e : 0)), D === 1 && r.scale(1, -1), r.beginPath();
          for (let Y = 0; Y <= L * 3; Y++) {
            const F = Y / (L * 3) * Math.PI * 2, X = S * Math.sin(F * 3 + z + $), W = x * (0.5 + 0.5 * Math.abs(Math.sin(F * (L / 2) + z * 0.5))), T = (W + X * x * 0.15) * Math.cos(F), I = (W + X * x * 0.1) * Math.sin(F);
            Y === 0 ? r.moveTo(T, I) : r.lineTo(T, I);
          }
          r.closePath(), v && (r.shadowColor = a, r.shadowBlur = g), r.strokeStyle = a, r.lineWidth = f * (1 - M * 0.08), r.globalAlpha = C * (1 - M * 0.1), r.stroke(), r.shadowBlur = 0, r.globalAlpha = 1, r.restore();
        }
      }
    }
    function k() {
      const {
        symmetry: A,
        colors: P,
        lineWidth: x,
        speed: M,
        layers: s,
        radius: a,
        backgroundColor: e,
        animated: h,
        glowEffect: f,
        glowBlur: v,
        strokeOpacity: g,
        mirror: C,
        noiseAmount: S
      } = o.current;
      h && (w.current += M * 5e-3);
      const L = w.current;
      r.clearRect(0, 0, i, n), e && e !== "transparent" && (r.fillStyle = e, r.fillRect(0, 0, i, n));
      const $ = i / 2, z = n / 2, R = Math.min(i, n) * 0.45 * a;
      for (let E = 0; E < s; E++) {
        const D = R * (1 - E * (0.85 / s)), Y = P[E % P.length];
        y($, z, D, E, L + E * 0.3, Y, A, C, x, f, v, g, S);
      }
      u.current = requestAnimationFrame(k);
    }
    return u.current = requestAnimationFrame(k), () => {
      l.disconnect(), cancelAnimationFrame(u.current);
    };
  }, [t]);
}
const Ye = {
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
}, Xe = et(
  (t, b) => {
    const {
      preset: o,
      symmetry: u,
      colors: w,
      lineWidth: p,
      speed: m,
      layers: r,
      radius: i,
      backgroundColor: n,
      animated: d,
      glowEffect: l,
      glowBlur: c,
      strokeOpacity: y,
      mirror: k,
      noiseAmount: A,
      width: P,
      height: x,
      className: M,
      style: s
    } = t, a = o && Ye[o] || {}, e = B(null);
    return nt(b, () => e.current), Ge(e, {
      symmetry: u ?? a.symmetry ?? 8,
      colors: w ?? a.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: p ?? a.lineWidth ?? 1.5,
      speed: m ?? a.speed ?? 1,
      layers: r ?? a.layers ?? 5,
      radius: i ?? 1,
      backgroundColor: n ?? a.backgroundColor ?? "#111111",
      animated: d ?? !0,
      glowEffect: l ?? a.glowEffect ?? !0,
      glowBlur: c ?? a.glowBlur ?? 10,
      strokeOpacity: y ?? a.strokeOpacity ?? 0.8,
      mirror: k ?? a.mirror ?? !0,
      noiseAmount: A ?? a.noiseAmount ?? 0.3
    }), /* @__PURE__ */ _(
      "div",
      {
        className: M,
        style: { width: P ?? "100%", height: x ?? "100%", display: "block", overflow: "hidden", ...s },
        children: /* @__PURE__ */ _("canvas", { ref: e, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Xe.displayName = "Mandala";
function je(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(null), p = B(0), m = B(0);
  N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    function c() {
      const { count: a, radius: e } = o.current;
      u.current = Array.from({ length: a }, () => {
        const h = d * 0.2 + Math.random() * d * 0.6, f = l * 0.2 + Math.random() * l * 0.6;
        return {
          x: h,
          y: f,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: e * (0.7 + Math.random() * 0.6),
          baseX: h,
          baseY: f
        };
      });
    }
    function y(a, e) {
      const h = t.current, f = window.devicePixelRatio || 1;
      h.width = Math.round(a * f), h.height = Math.round(e * f), h.style.width = `${a}px`, h.style.height = `${e}px`, n.scale(f, f), d = a, l = e, c();
    }
    const k = new ResizeObserver((a) => {
      const { width: e, height: h } = a[0].contentRect;
      e > 0 && h > 0 && y(e, h);
    });
    k.observe(i);
    const A = i.getBoundingClientRect();
    A.width > 0 && A.height > 0 && y(A.width, A.height);
    function P(a) {
      const e = t.current.getBoundingClientRect();
      w.current = { x: a.clientX - e.left, y: a.clientY - e.top };
    }
    function x() {
      w.current = null;
    }
    i.addEventListener("mousemove", P), i.addEventListener("mouseleave", x);
    function M(a, e, h, f) {
      const v = u.current;
      if (v.length) {
        n.globalCompositeOperation = "source-over";
        for (let g = 0; g < v.length; g++) {
          const C = v[g], S = a[g % a.length], L = C.radius, $ = n.createRadialGradient(C.x, C.y, 0, C.x, C.y, L * e);
          $.addColorStop(0, S), $.addColorStop(0.5, S + "88"), $.addColorStop(1, S + "00"), h && (n.shadowColor = S, n.shadowBlur = f), n.globalCompositeOperation = "screen", n.fillStyle = $, n.beginPath(), n.arc(C.x, C.y, L * e, 0, Math.PI * 2), n.fill(), n.shadowBlur = 0;
        }
        n.globalCompositeOperation = "source-over";
      }
    }
    function s() {
      const {
        speed: a,
        magnetStrength: e,
        magnetRadius: h,
        threshold: f,
        colors: v,
        glowEffect: g,
        glowBlur: C,
        backgroundColor: S,
        animated: L,
        followMouse: $,
        wanderStrength: z
      } = o.current;
      L && (m.current += 0.016);
      const R = m.current;
      n.clearRect(0, 0, d, l), S && S !== "transparent" && (n.fillStyle = S, n.fillRect(0, 0, d, l));
      const E = u.current, D = w.current;
      for (let Y = 0; Y < E.length; Y++) {
        const F = E[Y], X = Math.sin(R * a * 0.5 + Y * 1.3) * Math.PI * 2;
        if (F.vx += Math.cos(X) * z * 0.05, F.vy += Math.sin(X) * z * 0.05, D && $) {
          const W = D.x - F.x, T = D.y - F.y, I = Math.sqrt(W * W + T * T) || 1;
          if (I < h) {
            const O = (1 - I / h) * e;
            F.vx += W / I * O, F.vy += T / I * O;
          }
        }
        for (let W = Y + 1; W < E.length; W++) {
          const T = E[W], I = T.x - F.x, O = T.y - F.y, j = Math.sqrt(I * I + O * O) || 1, q = (F.radius + T.radius) * 0.8;
          if (j < q * 2) {
            const G = 2e-3 * (1 - j / (q * 2));
            F.vx += I / j * G, F.vy += O / j * G, T.vx -= I / j * G, T.vy -= O / j * G;
          }
        }
        F.vx *= 0.92, F.vy *= 0.92, F.vx = Math.max(-4, Math.min(4, F.vx)), F.vy = Math.max(-4, Math.min(4, F.vy)), F.x += F.vx, F.y += F.vy, F.x < F.radius && (F.x = F.radius, F.vx *= -0.5), F.x > d - F.radius && (F.x = d - F.radius, F.vx *= -0.5), F.y < F.radius && (F.y = F.radius, F.vy *= -0.5), F.y > l - F.radius && (F.y = l - F.radius, F.vy *= -0.5);
      }
      M(v, f, g, C), p.current = requestAnimationFrame(s);
    }
    return p.current = requestAnimationFrame(s), () => {
      k.disconnect(), cancelAnimationFrame(p.current), i.removeEventListener("mousemove", P), i.removeEventListener("mouseleave", x);
    };
  }, [t]);
}
const Ue = {
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
}, Ve = et(
  (t, b) => {
    const {
      preset: o,
      count: u,
      colors: w,
      radius: p,
      speed: m,
      magnetStrength: r,
      magnetRadius: i,
      threshold: n,
      glowEffect: d,
      glowBlur: l,
      backgroundColor: c,
      animated: y,
      followMouse: k,
      wanderStrength: A,
      width: P,
      height: x,
      className: M,
      style: s
    } = t, a = o && Ue[o] || {}, e = B(null);
    return nt(b, () => e.current), je(e, {
      count: u ?? a.count ?? 5,
      colors: w ?? a.colors ?? ["#ffffff", "#6b7280"],
      radius: p ?? a.radius ?? 80,
      speed: m ?? a.speed ?? 1,
      magnetStrength: r ?? a.magnetStrength ?? 0.08,
      magnetRadius: i ?? 150,
      threshold: n ?? a.threshold ?? 1.8,
      glowEffect: d ?? a.glowEffect ?? !0,
      glowBlur: l ?? a.glowBlur ?? 20,
      backgroundColor: c ?? a.backgroundColor ?? "#111111",
      animated: y ?? !0,
      followMouse: k ?? !0,
      wanderStrength: A ?? a.wanderStrength ?? 0.4
    }), /* @__PURE__ */ _(
      "div",
      {
        className: M,
        style: { width: P ?? "100%", height: x ?? "100%", display: "block", overflow: "hidden", ...s },
        children: /* @__PURE__ */ _("canvas", { ref: e, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Ve.displayName = "MagneticBlob";
function He(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B([]), p = B(0), m = B(null), r = B(!1), i = B(0);
  N(() => {
    const n = t.current;
    if (!n) return;
    const d = n.parentElement;
    if (!d) return;
    const l = n.getContext("2d");
    let c = 0, y = 0;
    function k(f, v) {
      const { cols: g, rows: C, spacing: S } = o.current, L = (f - (g - 1) * S) / 2, $ = v * 0.08, z = [], R = [];
      for (let E = 0; E < C; E++)
        for (let D = 0; D < g; D++) {
          const Y = L + D * S, F = $ + E * S;
          z.push({
            x: Y,
            y: F,
            px: Y,
            py: F,
            pinned: E === 0 && (D % Math.ceil(g / 5) === 0 || D === g - 1)
          });
          const X = E * g + D;
          D > 0 && R.push({ a: X - 1, b: X, length: S }), E > 0 && R.push({ a: X - g, b: X, length: S });
        }
      u.current = z, w.current = R;
    }
    function A(f, v) {
      const g = t.current, C = window.devicePixelRatio || 1;
      g.width = Math.round(f * C), g.height = Math.round(v * C), g.style.width = `${f}px`, g.style.height = `${v}px`, l.scale(C, C), c = f, y = v, k(c, y);
    }
    const P = new ResizeObserver((f) => {
      const { width: v, height: g } = f[0].contentRect;
      v > 0 && g > 0 && A(v, g);
    });
    P.observe(d);
    const x = d.getBoundingClientRect();
    x.width > 0 && x.height > 0 && A(x.width, x.height);
    function M(f) {
      const v = t.current.getBoundingClientRect();
      m.current = { x: f.clientX - v.left, y: f.clientY - v.top };
    }
    function s() {
      r.current = !0;
    }
    function a() {
      r.current = !1;
    }
    function e() {
      m.current = null, r.current = !1;
    }
    d.addEventListener("mousemove", M), d.addEventListener("mousedown", s), d.addEventListener("mouseup", a), d.addEventListener("mouseleave", e);
    function h() {
      const {
        gravity: f,
        friction: v,
        stiffness: g,
        iterations: C,
        lineColor: S,
        pinColor: L,
        lineWidth: $,
        backgroundColor: z,
        wind: R,
        windSpeed: E,
        tearable: D,
        tearDistance: Y,
        interactive: F,
        mouseRadius: X,
        mouseForce: W,
        showPins: T
      } = o.current;
      i.current += 0.016;
      const I = i.current;
      l.clearRect(0, 0, c, y), z && z !== "transparent" && (l.fillStyle = z, l.fillRect(0, 0, c, y));
      const O = u.current, j = m.current, q = R * Math.sin(I * E) * 0.1;
      for (const G of O) {
        if (G.pinned) continue;
        const V = (G.x - G.px) * v, H = (G.y - G.py) * v;
        if (G.px = G.x, G.py = G.y, G.x += V + q, G.y += H + f, j && F) {
          const J = G.x - j.x, Z = G.y - j.y, K = Math.sqrt(J * J + Z * Z) || 1;
          if (K < X) {
            const Q = (1 - K / X) * W;
            if (r.current)
              if (D)
                for (let tt = w.current.length - 1; tt >= 0; tt--) {
                  const at = w.current[tt], ot = O[at.a], rt = O[at.b];
                  (Math.sqrt((ot.x - j.x) ** 2 + (ot.y - j.y) ** 2) < X * 0.5 || Math.sqrt((rt.x - j.x) ** 2 + (rt.y - j.y) ** 2) < X * 0.5) && w.current.splice(tt, 1);
                }
              else
                G.x += J / K * Q * 2, G.y += Z / K * Q * 2;
            else
              G.x += J / K * Q, G.y += Z / K * Q;
          }
        }
        G.y > y && (G.y = y, G.py = G.y + H * 0.3), G.x < 0 && (G.x = 0, G.px = G.x - V * 0.3), G.x > c && (G.x = c, G.px = G.x - V * 0.3);
      }
      for (let G = 0; G < C; G++)
        for (let V = w.current.length - 1; V >= 0; V--) {
          const H = w.current[V], J = O[H.a], Z = O[H.b], K = Z.x - J.x, Q = Z.y - J.y, tt = Math.sqrt(K * K + Q * Q) || 1e-3;
          if (D && tt > Y * H.length) {
            w.current.splice(V, 1);
            continue;
          }
          const at = (tt - H.length) / tt * g * 0.5, ot = K * at, rt = Q * at;
          J.pinned || (J.x += ot, J.y += rt), Z.pinned || (Z.x -= ot, Z.y -= rt);
        }
      l.strokeStyle = S, l.lineWidth = $, l.beginPath();
      for (const G of w.current) {
        const V = O[G.a], H = O[G.b];
        l.moveTo(V.x, V.y), l.lineTo(H.x, H.y);
      }
      if (l.stroke(), T) {
        l.fillStyle = L;
        for (const G of O)
          G.pinned && (l.beginPath(), l.arc(G.x, G.y, 4, 0, Math.PI * 2), l.fill());
      }
      p.current = requestAnimationFrame(h);
    }
    return p.current = requestAnimationFrame(h), () => {
      P.disconnect(), cancelAnimationFrame(p.current), d.removeEventListener("mousemove", M), d.removeEventListener("mousedown", s), d.removeEventListener("mouseup", a), d.removeEventListener("mouseleave", e);
    };
  }, [t]);
}
const Ze = {
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
}, _e = et(
  (t, b) => {
    const {
      preset: o,
      cols: u,
      rows: w,
      spacing: p,
      gravity: m,
      friction: r,
      stiffness: i,
      iterations: n,
      lineColor: d,
      pinColor: l,
      lineWidth: c,
      backgroundColor: y,
      wind: k,
      windSpeed: A,
      tearable: P,
      tearDistance: x,
      interactive: M,
      mouseRadius: s,
      mouseForce: a,
      showPins: e,
      width: h,
      height: f,
      className: v,
      style: g
    } = t, C = o && Ze[o] || {}, S = B(null);
    return nt(b, () => S.current), He(S, {
      cols: u ?? C.cols ?? 25,
      rows: w ?? C.rows ?? 20,
      spacing: p ?? C.spacing ?? 18,
      gravity: m ?? C.gravity ?? 0.4,
      friction: r ?? C.friction ?? 0.99,
      stiffness: i ?? C.stiffness ?? 1,
      iterations: n ?? C.iterations ?? 3,
      lineColor: d ?? C.lineColor ?? "#6b7280",
      pinColor: l ?? C.pinColor ?? "#ffffff",
      lineWidth: c ?? C.lineWidth ?? 1,
      backgroundColor: y ?? C.backgroundColor ?? "#111111",
      wind: k ?? C.wind ?? 0.3,
      windSpeed: A ?? C.windSpeed ?? 0.5,
      tearable: P ?? C.tearable ?? !1,
      tearDistance: x ?? C.tearDistance ?? 3,
      interactive: M ?? !0,
      mouseRadius: s ?? 30,
      mouseForce: a ?? 5,
      showPins: e ?? !0
    }), /* @__PURE__ */ _(
      "div",
      {
        className: v,
        style: { width: h ?? "100%", height: f ?? "100%", display: "block", overflow: "hidden", ...g },
        children: /* @__PURE__ */ _("canvas", { ref: S, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
_e.displayName = "ClothSimulation";
function U(t, b, o) {
  return Math.min(t, o - 1) + Math.min(b, o - 1) * o;
}
function St(t, b, o, u, w, p) {
  const m = p * w * t * t, r = 1 + 4 * m;
  for (let i = 0; i < 4; i++) {
    for (let n = 1; n < t - 1; n++)
      for (let d = 1; d < t - 1; d++)
        o[U(d, n, t)] = (u[U(d, n, t)] + m * (o[U(d - 1, n, t)] + o[U(d + 1, n, t)] + o[U(d, n - 1, t)] + o[U(d, n + 1, t)])) / r;
    ft(t, b, o);
  }
}
function Et(t, b, o, u, w, p, m) {
  const r = m * t;
  for (let i = 1; i < t - 1; i++)
    for (let n = 1; n < t - 1; n++) {
      let d = n - r * w[U(n, i, t)], l = i - r * p[U(n, i, t)];
      d = Math.max(0.5, Math.min(t - 1.5, d)), l = Math.max(0.5, Math.min(t - 1.5, l));
      const c = Math.floor(d), y = c + 1, k = Math.floor(l), A = k + 1, P = d - c, x = 1 - P, M = l - k, s = 1 - M;
      o[U(n, i, t)] = x * (s * u[U(c, k, t)] + M * u[U(c, A, t)]) + P * (s * u[U(y, k, t)] + M * u[U(y, A, t)]);
    }
  ft(t, b, o);
}
function It(t, b, o, u, w) {
  const p = 1 / t;
  for (let m = 1; m < t - 1; m++)
    for (let r = 1; r < t - 1; r++)
      w[U(r, m, t)] = -0.5 * p * (b[U(r + 1, m, t)] - b[U(r - 1, m, t)] + o[U(r, m + 1, t)] - o[U(r, m - 1, t)]), u[U(r, m, t)] = 0;
  ft(t, 0, w), ft(t, 0, u);
  for (let m = 0; m < 4; m++) {
    for (let r = 1; r < t - 1; r++)
      for (let i = 1; i < t - 1; i++)
        u[U(i, r, t)] = (w[U(i, r, t)] + u[U(i - 1, r, t)] + u[U(i + 1, r, t)] + u[U(i, r - 1, t)] + u[U(i, r + 1, t)]) / 4;
    ft(t, 0, u);
  }
  for (let m = 1; m < t - 1; m++)
    for (let r = 1; r < t - 1; r++)
      b[U(r, m, t)] -= 0.5 * (u[U(r + 1, m, t)] - u[U(r - 1, m, t)]) / p, o[U(r, m, t)] -= 0.5 * (u[U(r, m + 1, t)] - u[U(r, m - 1, t)]) / p;
  ft(t, 1, b), ft(t, 2, o);
}
function ft(t, b, o) {
  for (let u = 1; u < t - 1; u++)
    o[U(0, u, t)] = b === 1 ? -o[U(1, u, t)] : o[U(1, u, t)], o[U(t - 1, u, t)] = b === 1 ? -o[U(t - 2, u, t)] : o[U(t - 2, u, t)], o[U(u, 0, t)] = b === 2 ? -o[U(u, 1, t)] : o[U(u, 1, t)], o[U(u, t - 1, t)] = b === 2 ? -o[U(u, t - 2, t)] : o[U(u, t - 2, t)];
  o[U(0, 0, t)] = 0.5 * (o[U(1, 0, t)] + o[U(0, 1, t)]), o[U(t - 1, 0, t)] = 0.5 * (o[U(t - 2, 0, t)] + o[U(t - 1, 1, t)]), o[U(0, t - 1, t)] = 0.5 * (o[U(1, t - 1, t)] + o[U(0, t - 2, t)]), o[U(t - 1, t - 1, t)] = 0.5 * (o[U(t - 2, t - 1, t)] + o[U(t - 1, t - 2, t)]);
}
function Je(t, b) {
  const o = B(b);
  o.current = b;
  const u = B(0), w = B(null), p = B(null), m = B(0);
  N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    const c = Math.max(32, Math.min(128, b.resolution)), y = c * c;
    let k = new Float32Array(y), A = new Float32Array(y), P = new Float32Array(y), x = new Float32Array(y), M = new Float32Array(y), s = new Float32Array(y), a = new Float32Array(y), e = new Float32Array(y), h = new Float32Array(y), f = new Float32Array(y), v = new Float32Array(y), g = new Float32Array(y), C = null;
    const S = document.createElement("canvas");
    S.width = c, S.height = c;
    const L = S.getContext("2d");
    function $(W, T) {
      const I = t.current, O = window.devicePixelRatio || 1;
      I.width = Math.round(W * O), I.height = Math.round(T * O), I.style.width = `${W}px`, I.style.height = `${T}px`, n.scale(O, O), n.imageSmoothingEnabled = !0, n.imageSmoothingQuality = "high", d = W, l = T, C = L.createImageData(c, c);
    }
    const z = new ResizeObserver((W) => {
      const { width: T, height: I } = W[0].contentRect;
      T > 0 && I > 0 && $(T, I);
    });
    z.observe(i);
    const R = i.getBoundingClientRect();
    R.width > 0 && R.height > 0 && $(R.width, R.height);
    function E(W, T, I, O, j, q, G, V, H) {
      const J = Math.max(1, Math.floor(H));
      for (let Z = -J; Z <= J; Z++)
        for (let K = -J; K <= J; K++) {
          const Q = W + K, tt = T + Z;
          if (Q < 1 || Q >= c - 1 || tt < 1 || tt >= c - 1) continue;
          const at = Math.sqrt(K * K + Z * Z);
          if (at > J) continue;
          const ot = 1 - at / J, rt = U(Q, tt, c);
          M[rt] += j * ot, s[rt] += q * ot, a[rt] += G * ot, k[rt] += I * V * ot, A[rt] += O * V * ot;
        }
    }
    function D(W) {
      const T = t.current.getBoundingClientRect(), I = W.clientX - T.left, O = W.clientY - T.top, j = w.current;
      w.current = {
        x: I,
        y: O,
        px: j ? j.x : I,
        py: j ? j.y : O
      };
    }
    function Y() {
      w.current = null;
    }
    i.addEventListener("mousemove", D), i.addEventListener("mouseleave", Y);
    function F() {
      const { autoInk: W, autoInkInterval: T } = o.current;
      W && (p.current = setTimeout(() => {
        const { inkColors: I } = o.current, O = I[m.current % I.length];
        m.current++;
        const j = dt(O).split(",").map(Number), q = Math.floor(c * 0.2 + Math.random() * c * 0.6), G = Math.floor(c * 0.2 + Math.random() * c * 0.6), V = Math.random() * Math.PI * 2;
        E(q, G, Math.cos(V) * 2, Math.sin(V) * 2, j[0] / 255, j[1] / 255, j[2] / 255, 3, 3), F();
      }, T * (0.6 + Math.random() * 0.8)));
    }
    F();
    function X() {
      const { viscosity: W, diffusion: T, dissipation: I, inkColors: O, backgroundColor: j, mouseForce: q, inkRadius: G } = o.current, V = 0.016, H = w.current;
      if (H) {
        const Z = Math.floor(H.x / d * c), K = Math.floor(H.y / l * c), Q = (H.x - H.px) * 0.5, tt = (H.y - H.py) * 0.5, at = O[m.current % O.length], ot = dt(at).split(",").map(Number);
        E(Z, K, Q, tt, ot[0] / 255, ot[1] / 255, ot[2] / 255, q, G), Math.abs(Q) + Math.abs(tt) > 0.5 && m.current++, H.px = H.x, H.py = H.y;
      }
      P.set(k), x.set(A), St(c, 1, k, P, W, V), St(c, 2, A, x, W, V), It(c, k, A, v, g), P.set(k), x.set(A), Et(c, 1, k, P, P, x, V), Et(c, 2, A, x, P, x, V), It(c, k, A, v, g);
      for (const [Z, K] of [[M, e], [s, h], [a, f]]) {
        K.set(Z), St(c, 0, Z, K, T, V), K.set(Z), Et(c, 0, Z, K, k, A, V);
        for (let Q = 0; Q < y; Q++)
          Z[Q] = Math.max(0, Z[Q] * I), K[Q] = 0;
      }
      for (let Z = 0; Z < y; Z++)
        P[Z] = 0, x[Z] = 0;
      if (!C) {
        u.current = requestAnimationFrame(X);
        return;
      }
      const J = C.data;
      for (let Z = 0; Z < c; Z++)
        for (let K = 0; K < c; K++) {
          const Q = U(K, Z, c), tt = (Z * c + K) * 4;
          J[tt] = Math.min(255, M[Q] * 255), J[tt + 1] = Math.min(255, s[Q] * 255), J[tt + 2] = Math.min(255, a[Q] * 255), J[tt + 3] = Math.min(255, (M[Q] + s[Q] + a[Q]) * 200);
        }
      n.clearRect(0, 0, d, l), j && j !== "transparent" && (n.fillStyle = j, n.fillRect(0, 0, d, l)), L.putImageData(C, 0, 0), n.drawImage(S, 0, 0, d, l), u.current = requestAnimationFrame(X);
    }
    return u.current = requestAnimationFrame(X), () => {
      z.disconnect(), cancelAnimationFrame(u.current), i.removeEventListener("mousemove", D), i.removeEventListener("mouseleave", Y), p.current && clearTimeout(p.current);
    };
  }, [t, b.resolution]);
}
const Ke = {
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
}, Qe = et(
  (t, b) => {
    const {
      preset: o,
      resolution: u,
      viscosity: w,
      diffusion: p,
      dissipation: m,
      inkColors: r,
      glowEffect: i,
      glowBlur: n,
      backgroundColor: d,
      autoInk: l,
      autoInkInterval: c,
      mouseForce: y,
      inkRadius: k,
      width: A,
      height: P,
      className: x,
      style: M
    } = t, s = o && Ke[o] || {}, a = B(null);
    return nt(b, () => a.current), Je(a, {
      resolution: u ?? s.resolution ?? 80,
      viscosity: w ?? s.viscosity ?? 1e-4,
      diffusion: p ?? s.diffusion ?? 1e-4,
      dissipation: m ?? s.dissipation ?? 0.995,
      inkColors: r ?? s.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: i ?? s.glowEffect ?? !0,
      glowBlur: n ?? s.glowBlur ?? 0,
      backgroundColor: d ?? s.backgroundColor ?? "#111111",
      autoInk: l ?? s.autoInk ?? !0,
      autoInkInterval: c ?? s.autoInkInterval ?? 1500,
      mouseForce: y ?? s.mouseForce ?? 5,
      inkRadius: k ?? s.inkRadius ?? 4
    }), /* @__PURE__ */ _(
      "div",
      {
        className: x,
        style: { width: A ?? "100%", height: P ?? "100%", display: "block", overflow: "hidden", ...M },
        children: /* @__PURE__ */ _("canvas", { ref: a, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Qe.displayName = "FluidSimulation";
const Ne = [
  [0.35, 0.25, 0.5],
  // background — slow, dim, thin
  [0.65, 0.55, 0.75],
  // midground
  [1, 1, 1]
  // foreground — fast, bright, full
];
function tn(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B([]), p = B(0), m = B(0);
  N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    function c(M = !1) {
      const { speed: s, dropLength: a, dropOpacity: e, dropWidth: h } = o.current, f = Math.floor(Math.random() * 3), [v, g, C] = Ne[f];
      return {
        x: Math.random() * (d + 100) - 50,
        y: M ? Math.random() * l : -a * 2 - Math.random() * l * 0.5,
        speed: s * v * (0.7 + Math.random() * 0.6),
        length: a * C * (0.6 + Math.random() * 0.8),
        opacity: e * g * (0.5 + Math.random() * 0.5),
        width: h * C * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer: f
      };
    }
    function y() {
      u.current = Array.from({ length: o.current.dropCount }, () => c(!0)), w.current = [];
    }
    function k(M, s) {
      const a = window.devicePixelRatio || 1;
      r.width = Math.round(M * a), r.height = Math.round(s * a), r.style.width = `${M}px`, r.style.height = `${s}px`, n.scale(a, a), d = M, l = s, y();
    }
    const A = new ResizeObserver((M) => {
      const { width: s, height: a } = M[0].contentRect;
      s > 0 && a > 0 && k(s, a);
    });
    A.observe(i);
    const P = i.getBoundingClientRect();
    P.width > 0 && P.height > 0 && k(P.width, P.height);
    function x() {
      const { wind: M, windSpeed: s, dropColor: a, splashColor: e, showSplashes: h, backgroundColor: f } = o.current;
      m.current += 0.016;
      const v = m.current, g = M * (Math.sin(v * s) * 0.7 + Math.sin(v * s * 0.37) * 0.3);
      !f || f === "transparent" ? n.clearRect(0, 0, d, l) : (n.fillStyle = f, n.fillRect(0, 0, d, l));
      const C = dt(a), S = dt(e), L = u.current;
      for (let z = 0; z < 3; z++)
        for (let R = 0; R < L.length; R++) {
          const E = L[R];
          if (E.layer !== z) continue;
          const D = g + E.windJitter;
          E.x += D, E.y += E.speed;
          const Y = Math.atan2(E.speed, D), F = Math.sin(Y), X = Math.cos(Y), W = E.x - F * E.length, T = E.y - X * E.length, I = n.createLinearGradient(W, T, E.x, E.y);
          I.addColorStop(0, `rgba(${C},0)`), I.addColorStop(1, `rgba(${C},${E.opacity})`), n.beginPath(), n.moveTo(W, T), n.lineTo(E.x, E.y), n.strokeStyle = I, n.lineWidth = E.width, n.lineCap = "round", n.stroke(), E.y > l + E.length && (h && w.current.push({
            x: E.x,
            y: l,
            r: 0,
            maxR: 4 + Math.random() * 7,
            life: 0,
            maxLife: 20 + Math.floor(Math.random() * 20)
          }), L[R] = c()), E.x > d + 60 && (E.x -= d + 120), E.x < -60 && (E.x += d + 120);
        }
      const $ = w.current;
      for (let z = $.length - 1; z >= 0; z--) {
        const R = $[z];
        R.life++, R.r = R.life / R.maxLife * R.maxR;
        const E = (1 - R.life / R.maxLife) * 0.45;
        if (E <= 0 || R.life >= R.maxLife) {
          $.splice(z, 1);
          continue;
        }
        n.save(), n.translate(R.x, R.y), n.scale(1.6, 0.35), n.beginPath(), n.arc(0, 0, R.r, 0, Math.PI * 2), n.strokeStyle = `rgba(${S},${E})`, n.lineWidth = 0.8, n.stroke(), n.restore();
      }
      p.current = requestAnimationFrame(x);
    }
    return p.current = requestAnimationFrame(x), () => {
      A.disconnect(), cancelAnimationFrame(p.current);
    };
  }, [t]);
}
const en = {
  default: {
    dropColor: "#ffffff",
    splashColor: "#6b7280",
    backgroundColor: "#111111"
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
}, nn = et((t, b) => {
  const {
    preset: o,
    dropCount: u,
    speed: w,
    wind: p,
    windSpeed: m,
    dropLength: r,
    dropWidth: i,
    dropOpacity: n,
    dropColor: d,
    splashColor: l,
    showSplashes: c,
    backgroundColor: y,
    width: k,
    height: A,
    className: P,
    style: x
  } = t, M = o && en[o] || {}, s = B(null);
  return nt(b, () => s.current), tn(s, {
    dropCount: u ?? M.dropCount ?? 200,
    speed: w ?? M.speed ?? 15,
    wind: p ?? M.wind ?? 0.3,
    windSpeed: m ?? M.windSpeed ?? 0.5,
    dropLength: r ?? M.dropLength ?? 20,
    dropWidth: i ?? M.dropWidth ?? 1,
    dropOpacity: n ?? M.dropOpacity ?? 0.6,
    dropColor: d ?? M.dropColor ?? "#a8c8e8",
    splashColor: l ?? M.splashColor ?? "#7aaec8",
    showSplashes: c ?? M.showSplashes ?? !0,
    backgroundColor: y ?? M.backgroundColor ?? "#111111"
  }), /* @__PURE__ */ _(
    "div",
    {
      className: P,
      style: { width: k ?? "100%", height: A ?? "100%", display: "block", overflow: "hidden", ...x },
      children: /* @__PURE__ */ _("canvas", { ref: s, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
nn.displayName = "Rain";
function Ct(t, b, o, u, w, p, m) {
  if (w <= 0) {
    m.push({ x: o, y: u });
    return;
  }
  const r = Math.hypot(o - t, u - b), i = (t + o) / 2 + (Math.random() - 0.5) * p * r * 0.5, n = (b + u) / 2 + (Math.random() - 0.5) * p * r * 0.1;
  Ct(t, b, i, n, w - 1, p, m), Ct(i, n, o, u, w - 1, p, m);
}
function on(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(null), m = B(0);
  N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    function c(a, e) {
      const h = window.devicePixelRatio || 1;
      r.width = Math.round(a * h), r.height = Math.round(e * h), r.style.width = `${a}px`, r.style.height = `${e}px`, n.scale(h, h), d = a, l = e;
    }
    const y = new ResizeObserver((a) => {
      const { width: e, height: h } = a[0].contentRect;
      e > 0 && h > 0 && c(e, h);
    });
    y.observe(i);
    const k = i.getBoundingClientRect();
    k.width > 0 && k.height > 0 && c(k.width, k.height);
    function A(a) {
      const { glowBlur: e, color: h, coreColor: f } = o.current, v = a.points;
      if (v.length < 2 || a.alpha <= 0) return;
      const g = a.alpha * a.energy;
      n.lineCap = "round", n.lineJoin = "round", n.shadowBlur = 0, n.globalAlpha = g * 0.3, n.strokeStyle = h, n.lineWidth = 6 * a.energy, n.filter = `blur(${Math.round(e * 0.6)}px)`, n.beginPath(), n.moveTo(v[0].x, v[0].y);
      for (let C = 1; C < v.length; C++) n.lineTo(v[C].x, v[C].y);
      n.stroke(), n.filter = "none", n.globalAlpha = g * 0.6, n.strokeStyle = h, n.lineWidth = 2.5 * a.energy, n.shadowColor = h, n.shadowBlur = e * a.energy, n.beginPath(), n.moveTo(v[0].x, v[0].y);
      for (let C = 1; C < v.length; C++) n.lineTo(v[C].x, v[C].y);
      n.stroke(), n.globalAlpha = g * 0.9, n.strokeStyle = f, n.lineWidth = 0.8 * a.energy, n.shadowBlur = 0, n.beginPath(), n.moveTo(v[0].x, v[0].y);
      for (let C = 1; C < v.length; C++) n.lineTo(v[C].x, v[C].y);
      n.stroke(), n.globalAlpha = 1, n.shadowBlur = 0;
    }
    function P(a, e) {
      const { segments: h, roughness: f, branchChance: v, branchDecay: g, flickerCount: C } = o.current, { startX: S, startY: L, endY: $ } = o.current, z = a !== void 0 ? a : S * d, R = L * l, E = z + (Math.random() - 0.5) * d * 0.2, D = e !== void 0 ? e : $ * l, Y = [];
      function F(X, W, T, I, O) {
        const j = [{ x: X, y: W }];
        Ct(X, W, T, I, h, f, j), Y.push({ points: j, energy: O, alpha: 1 });
        for (let q = 2; q < j.length - 1; q++) {
          if (Math.random() >= v) continue;
          const G = (Math.random() - 0.5) * Math.PI * 0.65, V = (D - j[q].y) * (0.25 + Math.random() * 0.4), H = j[q].x + Math.sin(G) * V, J = j[q].y + Math.cos(G) * Math.abs(V), Z = [{ x: j[q].x, y: j[q].y }];
          Ct(j[q].x, j[q].y, H, J, Math.max(2, h - 2), f * 0.8, Z), Y.push({ points: Z, energy: O * g, alpha: 1 });
        }
      }
      for (let X = 0; X < C; X++)
        F(
          z + (Math.random() - 0.5) * 4,
          R,
          E + (Math.random() - 0.5) * 8,
          D,
          1
        );
      u.current = Y, m.current = 0.35;
    }
    function x() {
      const { autoInterval: a } = o.current;
      p.current = setTimeout(() => {
        P(), x();
      }, a * (0.5 + Math.random()));
    }
    x(), P();
    function M(a) {
      if (!o.current.interactive) return;
      const e = r.getBoundingClientRect();
      P(a.clientX - e.left, a.clientY - e.top);
    }
    r.addEventListener("click", M);
    function s() {
      const { backgroundColor: a } = o.current;
      !a || a === "transparent" ? n.clearRect(0, 0, d, l) : (n.fillStyle = a, n.fillRect(0, 0, d, l));
      const e = u.current;
      let h = !1;
      for (const f of e)
        f.alpha *= 0.82, f.alpha > 0.01 && (h = !0, A(f));
      h || (u.current = []), m.current > 5e-3 && (n.globalAlpha = m.current, n.fillStyle = "#ffffff", n.fillRect(0, 0, d, l), n.globalAlpha = 1, m.current *= 0.55), w.current = requestAnimationFrame(s);
    }
    return w.current = requestAnimationFrame(s), () => {
      y.disconnect(), cancelAnimationFrame(w.current), p.current && clearTimeout(p.current), r.removeEventListener("click", M);
    };
  }, [t]);
}
const rn = {
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
}, an = et((t, b) => {
  const {
    preset: o,
    segments: u,
    roughness: w,
    branchChance: p,
    branchDecay: m,
    flickerCount: r,
    glowBlur: i,
    color: n,
    coreColor: d,
    backgroundColor: l,
    autoInterval: c,
    interactive: y,
    startX: k,
    startY: A,
    endY: P,
    width: x,
    height: M,
    className: s,
    style: a
  } = t, e = o && rn[o] || {}, h = B(null);
  return nt(b, () => h.current), on(h, {
    segments: u ?? e.segments ?? 8,
    roughness: w ?? e.roughness ?? 0.5,
    branchChance: p ?? e.branchChance ?? 0.3,
    branchDecay: m ?? e.branchDecay ?? 0.6,
    flickerCount: r ?? e.flickerCount ?? 3,
    glowBlur: i ?? e.glowBlur ?? 20,
    color: n ?? e.color ?? "#6b7280",
    coreColor: d ?? e.coreColor ?? "#ffffff",
    backgroundColor: l ?? e.backgroundColor ?? "#111111",
    autoInterval: c ?? e.autoInterval ?? 2e3,
    interactive: y ?? e.interactive ?? !0,
    startX: k ?? e.startX ?? 0.5,
    startY: A ?? e.startY ?? 0,
    endY: P ?? e.endY ?? 1
  }), /* @__PURE__ */ _(
    "div",
    {
      className: s,
      style: { width: x ?? "100%", height: M ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...a },
      children: /* @__PURE__ */ _("canvas", { ref: h, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
an.displayName = "Lightning";
function cn(t, b, o) {
  const u = B(b);
  u.current = b;
  const w = B(0), p = B(new Uint16Array(0)), m = B(new Uint16Array(0)), r = B(0), i = B(0), n = B(!1), d = B(0);
  N(() => {
    const l = t.current;
    if (!l) return;
    const c = l.parentElement;
    if (!c) return;
    const y = l.getContext("2d");
    let k = 0, A = 0;
    function P(f = !0) {
      const { cellSize: v, initialDensity: g } = u.current, C = Math.floor(k / v), S = Math.floor(A / v);
      if (r.current = C, i.current = S, p.current = new Uint16Array(C * S), m.current = new Uint16Array(C * S), f)
        for (let L = 0; L < p.current.length; L++)
          p.current[L] = Math.random() < g ? 1 : 0;
    }
    function x(f, v) {
      const g = t.current, C = window.devicePixelRatio || 1;
      g.width = Math.round(f * C), g.height = Math.round(v * C), g.style.width = `${f}px`, g.style.height = `${v}px`, y.scale(C, C), k = f, A = v, P(!0);
    }
    const M = new ResizeObserver((f) => {
      const { width: v, height: g } = f[0].contentRect;
      v > 0 && g > 0 && x(v, g);
    });
    M.observe(c);
    const s = c.getBoundingClientRect();
    s.width > 0 && s.height > 0 && x(s.width, s.height), o && (o.current = {
      randomize: () => P(!0),
      clear: () => {
        p.current.fill(0);
      },
      pause: () => {
        n.current = !0;
      },
      resume: () => {
        n.current = !1;
      }
    });
    function a() {
      const f = r.current, v = i.current, g = p.current, C = m.current, { wrapEdges: S } = u.current;
      for (let L = 0; L < v; L++)
        for (let $ = 0; $ < f; $++) {
          let z = 0;
          for (let D = -1; D <= 1; D++)
            for (let Y = -1; Y <= 1; Y++) {
              if (D === 0 && Y === 0) continue;
              let F = L + D, X = $ + Y;
              if (S)
                F = (F + v) % v, X = (X + f) % f;
              else if (F < 0 || F >= v || X < 0 || X >= f) continue;
              g[F * f + X] > 0 && z++;
            }
          const R = L * f + $, E = g[R] > 0;
          E && (z === 2 || z === 3) ? C[R] = Math.min(g[R] + 1, 255) : !E && z === 3 ? C[R] = 1 : C[R] = 0;
        }
      p.current = C.slice();
    }
    function e(f) {
      const { cellSize: v, speed: g, aliveColor: C, oldColor: S, deadColor: L, showAge: $, backgroundColor: z } = u.current;
      if (!n.current) {
        const F = 1e3 / g;
        f - d.current >= F && (a(), d.current = f);
      }
      y.fillStyle = z, y.fillRect(0, 0, k, A);
      const R = r.current, E = i.current, D = p.current, Y = 60;
      for (let F = 0; F < E; F++)
        for (let X = 0; X < R; X++) {
          const W = D[F * R + X];
          if (W === 0) continue;
          const T = $ ? Math.min(W / Y, 1) : 0, [I, O, j] = $t([C, S], T);
          y.fillStyle = `rgb(${I},${O},${j})`, y.fillRect(X * v + 0.5, F * v + 0.5, v - 1, v - 1);
        }
      w.current = requestAnimationFrame(e);
    }
    w.current = requestAnimationFrame(e);
    function h(f) {
      if (!u.current.interactive) return;
      const g = t.current.getBoundingClientRect(), C = f.clientX - g.left, S = f.clientY - g.top, { cellSize: L } = u.current, $ = Math.floor(C / L), z = Math.floor(S / L), R = r.current, E = i.current;
      if ($ < 0 || $ >= R || z < 0 || z >= E) return;
      const D = z * R + $;
      p.current[D] = p.current[D] > 0 ? 0 : 1;
    }
    return l.addEventListener("click", h), () => {
      M.disconnect(), cancelAnimationFrame(w.current), l.removeEventListener("click", h);
    };
  }, [t, o]);
}
const ln = {
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
}, sn = et((t, b) => {
  const {
    preset: o,
    cellSize: u,
    speed: w,
    initialDensity: p,
    aliveColor: m,
    oldColor: r,
    deadColor: i,
    showAge: n,
    wrapEdges: d,
    interactive: l,
    backgroundColor: c,
    width: y,
    height: k,
    className: A,
    style: P
  } = t, x = o && ln[o] || {}, M = B(null), s = B(null);
  return nt(b, () => s.current), cn(M, {
    cellSize: u ?? x.cellSize ?? 8,
    speed: w ?? x.speed ?? 10,
    initialDensity: p ?? x.initialDensity ?? 0.3,
    aliveColor: m ?? x.aliveColor ?? "#ffffff",
    oldColor: r ?? x.oldColor ?? "#6b7280",
    deadColor: i ?? x.deadColor ?? "#111111",
    showAge: n ?? x.showAge ?? !0,
    wrapEdges: d ?? x.wrapEdges ?? !0,
    interactive: l ?? x.interactive ?? !0,
    backgroundColor: c ?? x.backgroundColor ?? "#111111"
  }, s), /* @__PURE__ */ _(
    "div",
    {
      className: A,
      style: { width: y ?? "100%", height: k ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...P },
      children: /* @__PURE__ */ _("canvas", { ref: M, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
sn.displayName = "GameOfLife";
function un(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B([]), p = B(0), m = B(1);
  N(() => {
    const r = t.current;
    if (!r) return;
    const i = r.parentElement;
    if (!i) return;
    const n = r.getContext("2d");
    let d = 0, l = 0;
    function c() {
      const { ringCount: s, starCount: a } = o.current;
      u.current = Array.from({ length: s }, (e, h) => ({
        z: h / s,
        colorIndex: h % Math.max(1, o.current.colors.length),
        rotation: h / s * Math.PI * 2
      })), w.current = Array.from({ length: a }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08
      }));
    }
    function y(s, a) {
      const e = t.current, h = window.devicePixelRatio || 1;
      e.width = Math.round(s * h), e.height = Math.round(a * h), e.style.width = `${s}px`, e.style.height = `${a}px`, n.scale(h, h), d = s, l = a, c();
    }
    const k = new ResizeObserver((s) => {
      const { width: a, height: e } = s[0].contentRect;
      a > 0 && e > 0 && y(a, e);
    });
    k.observe(i);
    const A = i.getBoundingClientRect();
    A.width > 0 && A.height > 0 && y(A.width, A.height);
    function P(s) {
      if (!o.current.interactive) return;
      const e = t.current.getBoundingClientRect(), h = (s.clientX - e.left) / e.width;
      m.current = 0.2 + h * 2.8;
    }
    r.addEventListener("mousemove", P);
    function x(s, a, e) {
      const { fov: h, depth: f, twist: v } = o.current, g = Math.min(d, l) * 0.45, C = h / (h + a * f), S = e + a * v * Math.PI * 2, L = d / 2 + Math.cos(s + S) * g * C, $ = l / 2 + Math.sin(s + S) * g * C;
      return { px: L, py: $, scale: C };
    }
    function M() {
      const { speed: s, colors: a, backgroundColor: e, lineWidth: h, opacity: f, starColor: v } = o.current, g = u.current, C = w.current, S = s * m.current * 8e-3;
      n.fillStyle = e, n.fillRect(0, 0, d, l);
      const L = [...g].sort(($, z) => $.z - z.z);
      for (const $ of L) {
        $.z += S, $.z >= 1 && ($.z -= 1, $.colorIndex = ($.colorIndex + 1) % Math.max(1, a.length)), $.rotation += S * 0.1;
        const z = 64, R = (1 - $.z) * f;
        if (R <= 0.01) continue;
        const E = a[$.colorIndex % a.length] ?? "#7C3AED", { scale: D } = x(0, $.z, $.rotation);
        n.beginPath();
        for (let Y = 0; Y <= z; Y++) {
          const F = Y / z * Math.PI * 2, { px: X, py: W } = x(F, $.z, $.rotation);
          Y === 0 ? n.moveTo(X, W) : n.lineTo(X, W);
        }
        n.closePath(), n.strokeStyle = E, n.globalAlpha = R, n.lineWidth = h * D, n.stroke(), n.globalAlpha = 1;
      }
      for (const $ of C) {
        $.ringZ += S, $.ringZ >= 1 && ($.ringZ -= 1);
        const { px: z, py: R, scale: E } = x($.angle + $.offset * Math.PI * 2, $.ringZ, 0), D = (1 - $.ringZ) * 0.8;
        D <= 0 || (n.beginPath(), n.arc(z, R, Math.max(0.5, 1.5 * E), 0, Math.PI * 2), n.fillStyle = v, n.globalAlpha = D, n.fill(), n.globalAlpha = 1);
      }
      p.current = requestAnimationFrame(M);
    }
    return p.current = requestAnimationFrame(M), () => {
      k.disconnect(), cancelAnimationFrame(p.current), r.removeEventListener("mousemove", P);
    };
  }, [t]);
}
const dn = {
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
}, fn = et((t, b) => {
  const {
    preset: o,
    ringCount: u,
    speed: w,
    colors: p,
    backgroundColor: m,
    twist: r,
    fov: i,
    depth: n,
    lineWidth: d,
    opacity: l,
    starCount: c,
    starColor: y,
    interactive: k,
    width: A,
    height: P,
    className: x,
    style: M
  } = t, s = o && dn[o] || {}, a = B(null);
  return nt(b, () => a.current), un(a, {
    ringCount: u ?? s.ringCount ?? 30,
    speed: w ?? s.speed ?? 1,
    colors: p ?? s.colors ?? ["#ffffff", "#6b7280"],
    backgroundColor: m ?? s.backgroundColor ?? "#111111",
    twist: r ?? s.twist ?? 0.3,
    fov: i ?? s.fov ?? 300,
    depth: n ?? s.depth ?? 400,
    lineWidth: d ?? s.lineWidth ?? 1.5,
    opacity: l ?? s.opacity ?? 0.8,
    starCount: c ?? s.starCount ?? 100,
    starColor: y ?? s.starColor ?? "#ffffff",
    interactive: k ?? s.interactive ?? !0
  }), /* @__PURE__ */ _(
    "div",
    {
      className: x,
      style: { width: A ?? "100%", height: P ?? "100%", display: "block", overflow: "hidden", ...M },
      children: /* @__PURE__ */ _("canvas", { ref: a, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
fn.displayName = "Wormhole";
function hn(t, b) {
  const o = B(b);
  o.current = b;
  const u = B([]), w = B(0), p = B(null);
  N(() => {
    const m = t.current;
    if (!m) return;
    const r = m.parentElement;
    if (!r) return;
    const i = m.getContext("2d");
    let n = 0, d = 0;
    function l() {
      const e = o.current.maxSpeed, h = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * n,
        y: Math.random() * d,
        vx: Math.cos(h) * e * 0.5,
        vy: Math.sin(h) * e * 0.5,
        trail: []
      };
    }
    function c() {
      const { count: e } = o.current;
      u.current = Array.from({ length: e }, l);
    }
    function y(e, h) {
      const f = t.current, v = window.devicePixelRatio || 1;
      f.width = Math.round(e * v), f.height = Math.round(h * v), f.style.width = `${e}px`, f.style.height = `${h}px`, i.scale(v, v), n = e, d = h, c();
    }
    const k = new ResizeObserver((e) => {
      const { width: h, height: f } = e[0].contentRect;
      h > 0 && f > 0 && y(h, f);
    });
    k.observe(r);
    const A = r.getBoundingClientRect();
    A.width > 0 && A.height > 0 && y(A.width, A.height);
    function P(e) {
      if (!o.current.interactive) return;
      const f = t.current.getBoundingClientRect();
      p.current = { x: e.clientX - f.left, y: e.clientY - f.top };
    }
    function x() {
      p.current = null;
    }
    m.addEventListener("mousemove", P), m.addEventListener("mouseleave", x);
    function M(e, h) {
      const f = /* @__PURE__ */ new Map();
      for (let v = 0; v < e.length; v++) {
        const g = Math.floor(e[v].x / h), C = Math.floor(e[v].y / h), S = `${g},${C}`;
        f.has(S) || f.set(S, []), f.get(S).push(v);
      }
      return f;
    }
    function s(e, h, f, v) {
      const g = Math.floor(h.x / f), C = Math.floor(h.y / f), S = Math.ceil(v / f), L = [];
      for (let $ = -S; $ <= S; $++)
        for (let z = -S; z <= S; z++) {
          const R = `${g + $},${C + z}`, E = e.get(R);
          E && L.push(...E);
        }
      return L;
    }
    function a() {
      const {
        maxSpeed: e,
        separationRadius: h,
        alignmentRadius: f,
        cohesionRadius: v,
        separationForce: g,
        alignmentForce: C,
        cohesionForce: S,
        color: L,
        trailLength: $,
        trailOpacity: z,
        boidSize: R,
        backgroundColor: E,
        mouseRadius: D,
        mouseForce: Y,
        wrapEdges: F
      } = o.current;
      i.fillStyle = E, i.fillRect(0, 0, n, d);
      const X = u.current, W = Math.max(h, f, v), T = M(X, W), I = p.current, O = dt(L);
      for (let j = 0; j < X.length; j++) {
        const q = X[j];
        q.trail.push({ x: q.x, y: q.y }), q.trail.length > $ && q.trail.shift();
        const G = s(T, q, W, Math.max(h, f, v));
        let V = 0, H = 0, J = 0, Z = 0, K = 0, Q = 0, tt = 0, at = 0, ot = 0;
        for (const lt of G) {
          if (lt === j) continue;
          const ct = X[lt], it = q.x - ct.x, Mt = q.y - ct.y, mt = Math.sqrt(it * it + Mt * Mt) || 1e-3;
          mt < h && (V += it / mt, H += Mt / mt, J++), mt < f && (Z += ct.vx, K += ct.vy, Q++), mt < v && (tt += ct.x, at += ct.y, ot++);
        }
        let rt = 0, pt = 0;
        if (J > 0 && (rt += V / J * g * e, pt += H / J * g * e), Q > 0 && (rt += (Z / Q - q.vx) * C, pt += (K / Q - q.vy) * C), ot > 0 && (rt += (tt / ot - q.x) / v * S * e, pt += (at / ot - q.y) / v * S * e), I) {
          const lt = q.x - I.x, ct = q.y - I.y, it = Math.sqrt(lt * lt + ct * ct) || 1e-3;
          it < D && (rt += lt / it * Y * e, pt += ct / it * Y * e);
        }
        q.vx += rt, q.vy += pt;
        const xt = Math.sqrt(q.vx * q.vx + q.vy * q.vy) || 1e-3;
        if (xt > e && (q.vx = q.vx / xt * e, q.vy = q.vy / xt * e), q.x += q.vx, q.y += q.vy, F ? (q.x < 0 && (q.x += n, q.trail = []), q.x > n && (q.x -= n, q.trail = []), q.y < 0 && (q.y += d, q.trail = []), q.y > d && (q.y -= d, q.trail = [])) : ((q.x < 0 || q.x > n) && (q.vx *= -1), (q.y < 0 || q.y > d) && (q.vy *= -1), q.x = Math.max(0, Math.min(n, q.x)), q.y = Math.max(0, Math.min(d, q.y))), q.trail.length > 1) {
          i.beginPath(), i.moveTo(q.trail[0].x, q.trail[0].y);
          for (let lt = 1; lt < q.trail.length; lt++) {
            const ct = q.trail[lt - 1], it = q.trail[lt];
            Math.abs(it.x - ct.x) > n * 0.5 || Math.abs(it.y - ct.y) > d * 0.5 ? i.moveTo(it.x, it.y) : i.lineTo(it.x, it.y);
          }
          i.strokeStyle = `rgba(${O},${z})`, i.lineWidth = 1, i.stroke();
        }
        const Lt = Math.atan2(q.vy, q.vx);
        i.save(), i.translate(q.x, q.y), i.rotate(Lt), i.beginPath(), i.moveTo(R, 0), i.lineTo(-R * 0.6, R * 0.5), i.lineTo(-R * 0.6, -R * 0.5), i.closePath(), i.fillStyle = `rgba(${O},0.9)`, i.fill(), i.restore();
      }
      w.current = requestAnimationFrame(a);
    }
    return w.current = requestAnimationFrame(a), () => {
      k.disconnect(), cancelAnimationFrame(w.current), m.removeEventListener("mousemove", P), m.removeEventListener("mouseleave", x);
    };
  }, [t]);
}
const gn = {
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
}, pn = et((t, b) => {
  const {
    preset: o,
    count: u,
    maxSpeed: w,
    separationRadius: p,
    alignmentRadius: m,
    cohesionRadius: r,
    separationForce: i,
    alignmentForce: n,
    cohesionForce: d,
    color: l,
    trailLength: c,
    trailOpacity: y,
    boidSize: k,
    backgroundColor: A,
    interactive: P,
    mouseRadius: x,
    mouseForce: M,
    wrapEdges: s,
    width: a,
    height: e,
    className: h,
    style: f
  } = t, v = o && gn[o] || {}, g = B(null);
  return nt(b, () => g.current), hn(g, {
    count: u ?? v.count ?? 80,
    maxSpeed: w ?? v.maxSpeed ?? 3,
    separationRadius: p ?? v.separationRadius ?? 25,
    alignmentRadius: m ?? v.alignmentRadius ?? 50,
    cohesionRadius: r ?? v.cohesionRadius ?? 60,
    separationForce: i ?? v.separationForce ?? 0.05,
    alignmentForce: n ?? v.alignmentForce ?? 0.05,
    cohesionForce: d ?? v.cohesionForce ?? 0.03,
    color: l ?? v.color ?? "#ffffff",
    trailLength: c ?? v.trailLength ?? 8,
    trailOpacity: y ?? v.trailOpacity ?? 0.4,
    boidSize: k ?? v.boidSize ?? 6,
    backgroundColor: A ?? v.backgroundColor ?? "#111111",
    interactive: P ?? v.interactive ?? !0,
    mouseRadius: x ?? v.mouseRadius ?? 80,
    mouseForce: M ?? v.mouseForce ?? 0.2,
    wrapEdges: s ?? v.wrapEdges ?? !0
  }), /* @__PURE__ */ _(
    "div",
    {
      className: h,
      style: { width: a ?? "100%", height: e ?? "100%", display: "block", overflow: "hidden", ...f },
      children: /* @__PURE__ */ _("canvas", { ref: g, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
pn.displayName = "Boids";
export {
  ne as AudioVisualizer,
  pn as Boids,
  _e as ClothSimulation,
  ce as Confetti,
  ve as ConstellationMap,
  Nt as FireEffect,
  $e as Fireworks,
  Me as FlowField,
  Qe as FluidSimulation,
  sn as GameOfLife,
  Oe as GlitchOverlay,
  an as Lightning,
  qe as LiveChart,
  Ve as MagneticBlob,
  Xe as Mandala,
  Yt as MatrixRain,
  pe as NoiseGradient,
  Ht as ParticleField,
  ye as PixelDissolve,
  nn as Rain,
  ue as RippleEffect,
  Pe as Shockwave,
  Se as Spotlight,
  Jt as Starfield,
  fn as Wormhole
};
