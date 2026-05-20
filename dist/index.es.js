import { jsx as at, jsxs as Se } from "react/jsx-runtime";
import { useRef as X, useEffect as dt, forwardRef as ht, useImperativeHandle as gt } from "react";
const ke = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ", ce = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", Ee = "01";
function Ae(n) {
  return n === "katakana" ? ke : n === "latin" ? ce : n === "binary" ? Ee : n || ce;
}
function Be(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0);
  dt(() => {
    const r = n.current;
    if (!r) return;
    const s = r.parentElement;
    if (!s) return;
    const m = r.getContext("2d");
    let e = 0, t = 0;
    function u(B, P) {
      const E = window.devicePixelRatio || 1;
      e = B, t = P, r.width = Math.round(e * E), r.height = Math.round(t * E), r.style.width = `${e}px`, r.style.height = `${t}px`, m.scale(E, E);
      const { fontSize: C } = o.current, c = Math.floor(e / C);
      a.current = Array.from(
        { length: c },
        () => Math.floor(Math.random() * -(t / C))
      );
    }
    const g = new ResizeObserver((B) => {
      const { width: P, height: E } = B[0].contentRect;
      P > 0 && E > 0 && u(P, E);
    });
    g.observe(s);
    const f = s.getBoundingClientRect();
    f.width > 0 && f.height > 0 && u(f.width, f.height);
    let y = 0, S = 0;
    function I() {
      const { color: B, backgroundColor: P, fontSize: E, charset: C, resetThreshold: c } = o.current, l = C;
      m.fillStyle = P, m.fillRect(0, 0, e, t), m.fillStyle = B, m.font = `${E}px monospace`;
      const v = a.current;
      for (let R = 0; R < v.length; R++) {
        const x = l[Math.floor(Math.random() * l.length)];
        m.fillText(x, R * E, v[R] * E), v[R]++, v[R] * E > t && Math.random() > c && (v[R] = 0);
      }
    }
    function $(B) {
      const P = y ? B - y : 0;
      y = B, S += P;
      const { speed: E } = o.current;
      S >= E && (S = S % E, I()), i.current = requestAnimationFrame($);
    }
    return i.current = requestAnimationFrame($), () => {
      g.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [n]);
}
const Fe = {
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
}, Pe = ht(
  (n, h) => {
    const {
      preset: o,
      color: a,
      backgroundColor: i,
      fontSize: r,
      speed: s,
      charset: m,
      resetThreshold: e,
      width: t,
      height: u,
      className: g,
      style: f
    } = n, y = o && Fe[o] || {}, S = X(null);
    gt(h, () => S.current);
    const I = Ae(m ?? y.charset ?? "latin");
    Be(S, {
      color: a ?? y.color ?? "#ffffff",
      backgroundColor: i ?? y.backgroundColor ?? "rgba(17,17,17,0.1)",
      fontSize: r ?? y.fontSize ?? 14,
      speed: s ?? y.speed ?? 33,
      charset: I,
      resetThreshold: e ?? y.resetThreshold ?? 0.95
    });
    const $ = {
      width: t ?? "100%",
      height: u ?? "100%",
      display: "block",
      overflow: "hidden",
      ...f
    };
    return /* @__PURE__ */ at("div", { style: $, className: g, children: /* @__PURE__ */ at(
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
Pe.displayName = "MatrixRain";
const Tt = /* @__PURE__ */ new Map();
function Wt(n) {
  if (Tt.has(n)) return Tt.get(n);
  let h = n.trim();
  h.startsWith("#") && (h = h.slice(1));
  let o, a, i;
  if (h.length === 3)
    o = parseInt(h[0] + h[0], 16), a = parseInt(h[1] + h[1], 16), i = parseInt(h[2] + h[2], 16);
  else if (h.length === 6)
    o = parseInt(h.slice(0, 2), 16), a = parseInt(h.slice(2, 4), 16), i = parseInt(h.slice(4, 6), 16);
  else
    return Tt.set(n, null), null;
  if (isNaN(o) || isNaN(a) || isNaN(i))
    return Tt.set(n, null), null;
  const r = [o, a, i];
  return Tt.set(n, r), r;
}
function Et(n, h = 1) {
  const o = Wt(n);
  return o ? `rgba(${o[0]},${o[1]},${o[2]},${h})` : `rgba(255,255,255,${h})`;
}
function St(n) {
  const h = Wt(n);
  return h ? `${h[0]},${h[1]},${h[2]}` : "255,255,255";
}
function Ie(n, h, o) {
  return [n[0] + (h[0] - n[0]) * o, n[1] + (h[1] - n[1]) * o, n[2] + (h[2] - n[2]) * o];
}
function yt(n, h) {
  const o = Math.max(0, Math.min(1, h));
  if (n.length === 0) return [255, 255, 255];
  if (n.length === 1) return Wt(n[0]) ?? [255, 255, 255];
  const a = o * (n.length - 1), i = Math.min(Math.floor(a), n.length - 2), r = a - i, s = Wt(n[i]) ?? [255, 255, 255], m = Wt(n[i + 1]) ?? [255, 255, 255];
  return Ie(s, m, r);
}
function $e(n, h) {
  const o = X([]), a = X(null), i = X(h);
  i.current = h;
  const r = X(0), s = X(""), m = X(""), e = X(""), t = X(""), u = X(null);
  dt(() => {
    var g;
    (g = u.current) == null || g.call(u);
  }, [h.particleCount, h.particleSize]), dt(() => {
    const g = n.current;
    if (!g) return;
    const f = g, y = f.parentElement;
    if (!y) return;
    const S = f.getContext("2d");
    let I = 0, $ = 0;
    function B(R, x) {
      const { particleCount: F, particleSize: M, speed: k } = i.current;
      o.current = Array.from({ length: F }, () => ({
        x: Math.random() * R,
        y: Math.random() * x,
        vx: (Math.random() - 0.5) * k * 2,
        vy: (Math.random() - 0.5) * k * 2,
        size: Math.random() * M + M * 0.4,
        opacity: Math.random() * 0.5 + 0.5
      }));
    }
    function P(R, x) {
      const F = window.devicePixelRatio || 1;
      f.width = Math.round(R * F), f.height = Math.round(x * F), f.style.width = `${R}px`, f.style.height = `${x}px`, S.scale(F, F), I = R, $ = x, B(R, x);
    }
    u.current = () => {
      I > 0 && $ > 0 && B(I, $);
    };
    const E = new ResizeObserver((R) => {
      const { width: x, height: F } = R[0].contentRect;
      x > 0 && F > 0 && P(x, F);
    });
    E.observe(y);
    const C = y.getBoundingClientRect();
    C.width > 0 && C.height > 0 && P(C.width, C.height);
    function c(R) {
      if (!i.current.interactive) return;
      const x = f.getBoundingClientRect();
      a.current = { x: R.clientX - x.left, y: R.clientY - x.top };
    }
    function l() {
      a.current = null;
    }
    f.addEventListener("mousemove", c), f.addEventListener("mouseleave", l);
    function v() {
      const {
        particleColor: R,
        lineColor: x,
        lineDistance: F,
        connectParticles: M,
        backgroundColor: k,
        speed: L,
        repelRadius: w,
        repelStrength: p,
        friction: d,
        maxVelocityMultiplier: b,
        lineWidth: A,
        lineOpacity: T
      } = i.current;
      R !== e.current && (s.current = St(R), e.current = R), x !== t.current && (m.current = St(x), t.current = x);
      const D = o.current, z = a.current, O = s.current, W = m.current;
      S.clearRect(0, 0, I, $), k && k !== "transparent" && (S.fillStyle = k, S.fillRect(0, 0, I, $));
      for (let Y = 0; Y < D.length; Y++) {
        const q = D[Y];
        if (z) {
          const U = q.x - z.x, j = q.y - z.y, N = Math.sqrt(U * U + j * j);
          if (N < w && N > 0) {
            const K = (w - N) / w * 2;
            q.vx += U / N * K * p, q.vy += j / N * K * p;
          }
        }
        q.vx *= d, q.vy *= d;
        const H = L * b, G = Math.sqrt(q.vx * q.vx + q.vy * q.vy);
        if (G > H && (q.vx = q.vx / G * H, q.vy = q.vy / G * H), q.x += q.vx, q.y += q.vy, q.x < 0 && (q.x = 0, q.vx *= -1), q.x > I && (q.x = I, q.vx *= -1), q.y < 0 && (q.y = 0, q.vy *= -1), q.y > $ && (q.y = $, q.vy *= -1), S.beginPath(), S.arc(q.x, q.y, q.size, 0, Math.PI * 2), S.fillStyle = `rgba(${O},${q.opacity})`, S.fill(), M)
          for (let U = Y + 1; U < D.length; U++) {
            const j = D[U], N = q.x - j.x, K = q.y - j.y, Z = Math.sqrt(N * N + K * K);
            if (Z < F) {
              const nt = (1 - Z / F) * T;
              S.beginPath(), S.moveTo(q.x, q.y), S.lineTo(j.x, j.y), S.strokeStyle = `rgba(${W},${nt})`, S.lineWidth = A, S.stroke();
            }
          }
      }
      r.current = requestAnimationFrame(v);
    }
    return r.current = requestAnimationFrame(v), () => {
      E.disconnect(), cancelAnimationFrame(r.current), f.removeEventListener("mousemove", c), f.removeEventListener("mouseleave", l);
    };
  }, [n]);
}
const Le = {
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
}, De = ht(
  (n, h) => {
    const {
      preset: o,
      particleCount: a,
      particleColor: i,
      lineColor: r,
      lineDistance: s,
      particleSize: m,
      speed: e,
      connectParticles: t,
      interactive: u,
      backgroundColor: g,
      repelRadius: f,
      repelStrength: y,
      friction: S,
      maxVelocityMultiplier: I,
      lineWidth: $,
      lineOpacity: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && Le[o] || {}, v = i ?? l.particleColor ?? "#ffffff", R = X(null);
    return gt(h, () => R.current), $e(R, {
      particleCount: a ?? l.particleCount ?? 120,
      particleColor: v,
      lineColor: r ?? l.lineColor ?? "#6b7280",
      lineDistance: s ?? l.lineDistance ?? 120,
      particleSize: m ?? 2.5,
      speed: e ?? l.speed ?? 0.8,
      connectParticles: t ?? l.connectParticles ?? !0,
      interactive: u ?? !0,
      backgroundColor: g ?? l.backgroundColor ?? "transparent",
      repelRadius: f ?? 80,
      repelStrength: y ?? 0.3,
      friction: S ?? 0.99,
      maxVelocityMultiplier: I ?? 3,
      lineWidth: $ ?? 0.8,
      lineOpacity: B ?? 0.6
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: { width: P ?? "100%", height: E ?? "100%", display: "block", overflow: "hidden", ...c },
        children: /* @__PURE__ */ at("canvas", { ref: R, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
De.displayName = "ParticleField";
function Te(n, h) {
  const o = X([]), a = X([]), i = X([]), r = X(h);
  r.current = h;
  const s = X(0), m = X(0), e = X(null);
  dt(() => {
    var t;
    (t = e.current) == null || t.call(e);
  }, [h.starCount]), dt(() => {
    const t = n.current;
    if (!t) return;
    const u = t, g = u.parentElement;
    if (!g) return;
    const f = u.getContext("2d");
    let y = 0, S = 0;
    function I(c, l) {
      const { starCount: v, starSizeMin: R, starSizeMax: x, starOpacityMin: F, starOpacityMax: M, twinkleSpeed: k } = r.current;
      o.current = Array.from({ length: v }, () => ({
        x: Math.random() * c,
        y: Math.random() * l,
        size: Math.random() * (x - R) + R,
        opacity: Math.random() * (M - F) + F,
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * k + k * 0.3
      }));
    }
    function $(c, l) {
      const { starCount: v } = r.current, R = Math.max(c, l);
      a.current = Array.from({ length: v }, () => ({
        x: (Math.random() - 0.5) * c * 2,
        y: (Math.random() - 0.5) * l * 2,
        z: Math.random() * R,
        pz: 0
      }));
    }
    function B(c, l) {
      const v = window.devicePixelRatio || 1;
      u.width = Math.round(c * v), u.height = Math.round(l * v), u.style.width = `${c}px`, u.style.height = `${l}px`, f.scale(v, v), y = c, S = l, I(c, l), $(c, l);
    }
    e.current = () => {
      y > 0 && S > 0 && (I(y, S), $(y, S));
    };
    const P = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && B(l, v);
    });
    P.observe(g);
    const E = g.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    function C(c) {
      const {
        starColor: l,
        backgroundColor: v,
        speed: R,
        twinkle: x,
        shootingStars: F,
        shootingStarInterval: M,
        perspective: k,
        shootingStarLength: L,
        shootingStarLifetime: w
      } = r.current;
      if (f.fillStyle = v, f.fillRect(0, 0, y, S), k === "3D") {
        const p = y / 2, d = S / 2, b = Math.max(y, S), A = a.current;
        for (let T = 0; T < A.length; T++) {
          const D = A[T];
          D.pz = D.z, D.z -= R * 4, D.z <= 0 && (D.x = (Math.random() - 0.5) * y * 2, D.y = (Math.random() - 0.5) * S * 2, D.z = b, D.pz = D.z);
          const z = D.x / D.z * y + p, O = D.y / D.z * S + d, W = D.x / D.pz * y + p, Y = D.y / D.pz * S + d, q = Math.max((1 - D.z / b) * 3, 0.1), H = 1 - D.z / b;
          f.beginPath(), f.moveTo(W, Y), f.lineTo(z, O), f.strokeStyle = `rgba(255,255,255,${H})`, f.lineWidth = q, f.stroke();
        }
      } else {
        const p = o.current;
        for (let d = 0; d < p.length; d++) {
          const b = p[d];
          b.y += R * (b.size / 2), b.y > S && (b.y = 0, b.x = Math.random() * y);
          let A = b.opacity;
          x && (b.twinklePhase += b.twinkleSpeed, A = b.opacity * (0.5 + 0.5 * Math.sin(b.twinklePhase))), f.beginPath(), f.arc(b.x, b.y, b.size, 0, Math.PI * 2), f.fillStyle = l.startsWith("#") ? `rgba(255,255,255,${A})` : `rgba(255,255,255,${A})`, f.fill();
        }
        if (F) {
          if (c - m.current > M) {
            m.current = c;
            const d = Math.random() * 8 + 4, b = Math.random() * 4 + 2;
            i.current.push({
              x: Math.random() * y * 0.7,
              y: Math.random() * S * 0.3,
              vx: d,
              vy: b,
              length: Math.random() * (L * 0.5) + L * 0.5,
              opacity: 1,
              life: 0,
              maxLife: w
            });
          }
          i.current = i.current.filter((d) => {
            if (d.x += d.vx, d.y += d.vy, d.life++, d.opacity = 1 - d.life / d.maxLife, d.opacity <= 0) return !1;
            const b = d.length / Math.sqrt(d.vx * d.vx + d.vy * d.vy), A = f.createLinearGradient(d.x, d.y, d.x - d.vx * b, d.y - d.vy * b);
            return A.addColorStop(0, `rgba(255,255,255,${d.opacity})`), A.addColorStop(1, "rgba(255,255,255,0)"), f.beginPath(), f.moveTo(d.x, d.y), f.lineTo(d.x - d.vx * b, d.y - d.vy * b), f.strokeStyle = A, f.lineWidth = 2, f.stroke(), !0;
          });
        }
      }
      s.current = requestAnimationFrame(C);
    }
    return s.current = requestAnimationFrame(C), () => {
      P.disconnect(), cancelAnimationFrame(s.current);
    };
  }, [n]);
}
const ze = {
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
}, qe = ht(
  (n, h) => {
    const {
      preset: o,
      starCount: a,
      starColor: i,
      backgroundColor: r,
      speed: s,
      twinkle: m,
      shootingStars: e,
      shootingStarInterval: t,
      perspective: u,
      starSizeMin: g,
      starSizeMax: f,
      starOpacityMin: y,
      starOpacityMax: S,
      twinkleSpeed: I,
      shootingStarLength: $,
      shootingStarLifetime: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && ze[o] || {}, v = X(null);
    return gt(h, () => v.current), Te(v, {
      starCount: a ?? l.starCount ?? 200,
      starColor: i ?? l.starColor ?? "#ffffff",
      backgroundColor: r ?? l.backgroundColor ?? "#111111",
      speed: s ?? l.speed ?? 0.5,
      twinkle: m ?? l.twinkle ?? !0,
      shootingStars: e ?? l.shootingStars ?? !0,
      shootingStarInterval: t ?? l.shootingStarInterval ?? 3e3,
      perspective: u ?? l.perspective ?? "2D",
      starSizeMin: g ?? 0.3,
      starSizeMax: f ?? 2.8,
      starOpacityMin: y ?? 0.3,
      starOpacityMax: S ?? 1,
      twinkleSpeed: I ?? 0.03,
      shootingStarLength: $ ?? 80,
      shootingStarLifetime: B ?? 60
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: { width: P ?? "100%", height: E ?? "100%", display: "block", overflow: "hidden", ...c },
        children: /* @__PURE__ */ at("canvas", { ref: v, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
qe.displayName = "Starfield";
function se(n) {
  const h = new Uint32Array(256);
  for (let o = 1; o < 256; o++) {
    let a = 0, i = 0, r = 0;
    const s = o / 255;
    if (n === "inferno")
      if (s < 0.33)
        a = Math.round(s / 0.33 * 200), i = 0, r = 0;
      else if (s < 0.66) {
        const e = (s - 0.33) / 0.33;
        a = Math.round(200 + e * 55), i = Math.round(e * 165), r = 0;
      } else {
        const e = (s - 0.66) / 0.34;
        a = 255, i = Math.round(165 + e * 90), r = Math.round(e * 255);
      }
    else if (n === "toxic")
      if (s < 0.4)
        a = 0, i = Math.round(s / 0.4 * 180), r = 0;
      else if (s < 0.75) {
        const e = (s - 0.4) / 0.35;
        a = Math.round(e * 180), i = Math.round(180 + e * 75), r = 0;
      } else {
        const e = (s - 0.75) / 0.25;
        a = Math.round(180 + e * 75), i = 255, r = Math.round(e * 100);
      }
    else if (n === "ice")
      if (s < 0.4)
        a = 0, i = 0, r = Math.round(s / 0.4 * 200);
      else if (s < 0.7) {
        const e = (s - 0.4) / 0.3;
        a = 0, i = Math.round(e * 200), r = Math.round(200 + e * 55);
      } else {
        const e = (s - 0.7) / 0.3;
        a = Math.round(e * 255), i = Math.round(200 + e * 55), r = 255;
      }
    else if (n === "plasma")
      if (s < 0.3) {
        const e = s / 0.3;
        a = Math.round(e * 150), i = 0, r = Math.round(e * 200);
      } else if (s < 0.6) {
        const e = (s - 0.3) / 0.3;
        a = Math.round(150 + e * 105), i = 0, r = Math.round(200 + e * 55);
      } else {
        const e = (s - 0.6) / 0.4;
        a = 255, i = Math.round(e * 200), r = 255;
      }
    else {
      const e = Math.round(s < 0.5 ? s * 2 * 180 : 180 + (s - 0.5) * 2 * 75);
      a = i = r = Math.min(255, e);
    }
    const m = Math.min(255, o * 8);
    h[o] = m << 24 | r << 16 | i << 8 | a;
  }
  return h[0] = 0, h;
}
function We(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null), r = X(se(h.palette)), s = X(h.palette), m = X(null), e = X(null), t = X(null), u = X(null);
  dt(() => {
    const g = n.current;
    if (!g) return;
    const f = g, y = f.parentElement;
    if (!y) return;
    const S = f.getContext("2d");
    let I = 0, $ = 0;
    m.current || (m.current = document.createElement("canvas"), e.current = m.current.getContext("2d"));
    function B(c, l) {
      const { resolution: v } = o.current, R = window.devicePixelRatio || 1, x = Math.max(0.1, Math.min(1, v));
      f.width = Math.round(c * R), f.height = Math.round(l * R), f.style.width = `${c}px`, f.style.height = `${l}px`, I = Math.max(1, Math.round(c * x)), $ = Math.max(1, Math.round(l * x)), i.current = new Uint8Array(I * $);
      const F = m.current;
      F.width = I, F.height = $, t.current = e.current.createImageData(I, $), u.current = new Uint32Array(t.current.data.buffer);
    }
    const P = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && B(l, v);
    });
    P.observe(y);
    const E = y.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    function C() {
      const { palette: c, intensity: l, windStrength: v, windDirection: R, spread: x, cooling: F, noiseStrength: M, coolingScale: k } = o.current;
      c !== s.current && (s.current = c, r.current = se(c));
      const L = i.current, w = u.current, p = t.current;
      if (!L || !w || !p || I === 0 || $ === 0) {
        a.current = requestAnimationFrame(C);
        return;
      }
      const d = Math.round(l * 255);
      for (let z = 0; z < I; z++)
        L[($ - 1) * I + z] = 255;
      const b = M / 2;
      for (let z = 0; z < I; z++) {
        const O = Math.random() * M - b;
        L[($ - 2) * I + z] = Math.max(80, Math.min(255, d + O));
      }
      const A = Math.round(v * R), T = Math.max(1, Math.round(F * k));
      for (let z = 0; z < $ - 1; z++) {
        const O = (z + 1) * I;
        for (let W = 0; W < I; W++) {
          const Y = L[O + W], q = W > 0 ? L[O + W - 1] : Y, H = W < I - 1 ? L[O + W + 1] : Y, G = (q * x + Y * 2 + H * x) / (2 + x * 2), U = T + (Math.random() * T | 0), j = 1 - z / $, N = Math.random() < j * j ? G * 0.25 * Math.random() : 0, K = G - U - N, Z = W + A, nt = Z >= 0 && Z < I ? Z : W;
          L[z * I + nt] = Math.max(0, Math.min(255, K));
        }
      }
      const D = r.current;
      for (let z = 0; z < I * $; z++)
        w[z] = D[L[z]];
      S.clearRect(0, 0, f.width, f.height), e.current.putImageData(p, 0, 0), S.drawImage(m.current, 0, 0, f.width, f.height), a.current = requestAnimationFrame(C);
    }
    return a.current = requestAnimationFrame(C), () => {
      P.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const Oe = {
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
}, Xe = ht(
  (n, h) => {
    const {
      preset: o,
      palette: a,
      intensity: i,
      windStrength: r,
      windDirection: s,
      spread: m,
      cooling: e,
      noiseStrength: t,
      coolingScale: u,
      resolution: g,
      width: f,
      height: y,
      className: S,
      style: I
    } = n, $ = o && Oe[o] || {}, B = X(null);
    return gt(h, () => B.current), We(B, {
      palette: a ?? $.palette ?? "smoke",
      intensity: i ?? $.intensity ?? 0.95,
      windStrength: r ?? $.windStrength ?? 0.3,
      windDirection: s ?? $.windDirection ?? 1,
      spread: m ?? $.spread ?? 0,
      cooling: e ?? $.cooling ?? 0.3,
      noiseStrength: t ?? 60,
      coolingScale: u ?? 3,
      resolution: g ?? 1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: S,
        style: { width: f ?? "100%", height: y ?? "100%", display: "block", overflow: "hidden", ...I },
        children: /* @__PURE__ */ at("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Xe.displayName = "FireEffect";
function Ye(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null), r = X(null), s = X(null), m = X(null), e = X(null);
  dt(() => {
    var y, S;
    const t = h.audioSource;
    if (!t) {
      i.current && ((y = s.current) == null || y.disconnect(), (S = r.current) == null || S.close(), i.current = null, s.current = null, r.current = null);
      return;
    }
    const u = new AudioContext();
    r.current = u;
    const g = u.createAnalyser();
    g.fftSize = h.fftSize, g.smoothingTimeConstant = h.smoothingTimeConstant, i.current = g;
    const f = u.createMediaStreamSource(t);
    return s.current = f, f.connect(g), m.current = new Uint8Array(new ArrayBuffer(g.frequencyBinCount)), e.current = new Uint8Array(new ArrayBuffer(g.fftSize)), () => {
      f.disconnect(), u.close(), i.current = null, s.current = null, r.current = null;
    };
  }, [h.audioSource, h.fftSize, h.smoothingTimeConstant]), dt(() => {
    const t = n.current;
    if (!t) return;
    const u = t, g = u.parentElement;
    if (!g) return;
    const f = u.getContext("2d");
    let y = 0, S = 0;
    function I(x, F) {
      const M = window.devicePixelRatio || 1;
      u.width = Math.round(x * M), u.height = Math.round(F * M), u.style.width = `${x}px`, u.style.height = `${F}px`, f.scale(M, M), y = x, S = F;
    }
    const $ = new ResizeObserver((x) => {
      const { width: F, height: M } = x[0].contentRect;
      F > 0 && M > 0 && I(F, M);
    });
    $.observe(g);
    const B = g.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P() {
      const { glowEffect: x, glowColor: F, glowBlur: M, barColor: k } = o.current;
      x ? (f.shadowColor = F || k, f.shadowBlur = M) : f.shadowBlur = 0;
    }
    function E() {
      f.shadowBlur = 0;
    }
    function C() {
      const { backgroundColor: x } = o.current;
      x && x !== "transparent" ? (f.fillStyle = x, f.fillRect(0, 0, y, S)) : f.clearRect(0, 0, y, S);
    }
    function c(x, F, M, k, L) {
      const w = f.createLinearGradient(x, S, x, S - F);
      return w.addColorStop(0, k), w.addColorStop(1, L), w;
    }
    function l(x, F, M, k, L, w) {
      k < 1 || (f.fillStyle = L, w && k > 4 ? (f.beginPath(), f.roundRect(x, F, M, k, Math.min(M / 2, 4)), f.fill()) : f.fillRect(x, F, M, k));
    }
    function v() {
      const {
        barCount: x,
        barColor: F,
        waveColor: M,
        gapBetweenBars: k,
        rounded: L,
        mode: w,
        gradient: p,
        gradientEndColor: d,
        idleAmplitude: b,
        idleAnimationSpeed: A
      } = o.current;
      C(), P();
      const T = performance.now() / 1e3 * A;
      if (w === "wave") {
        f.beginPath(), f.moveTo(0, S / 2);
        for (let O = 0; O < y; O++) {
          const W = S / 2 + Math.sin(O / y * Math.PI * 4 + T * 2) * b;
          f.lineTo(O, W);
        }
        f.strokeStyle = M, f.lineWidth = 2, f.stroke(), E();
        return;
      }
      if (w === "circular") {
        const { circularRadiusRatio: O } = o.current, W = y / 2, Y = S / 2, q = Math.min(y, S) * O, H = Math.max(1, 2 * Math.PI * q / x * 0.6);
        for (let G = 0; G < x; G++) {
          const U = (Math.sin(G / x * Math.PI * 2 + T * 2) * 0.5 + 0.5) * q * 0.15 + 2, j = G / x * Math.PI * 2 - Math.PI / 2, N = W + Math.cos(j) * q, K = Y + Math.sin(j) * q, Z = W + Math.cos(j) * (q + U), nt = Y + Math.sin(j) * (q + U);
          f.beginPath(), f.moveTo(N, K), f.lineTo(Z, nt), f.strokeStyle = p ? `hsl(${G / x * 360},70%,60%)` : F, f.lineWidth = H, f.stroke();
        }
        f.beginPath(), f.arc(W, Y, q, 0, Math.PI * 2), f.strokeStyle = F, f.lineWidth = 1, f.stroke(), E();
        return;
      }
      if (w === "mirror") {
        const O = k * (x - 1), W = (y - O) / x;
        for (let Y = 0; Y < x; Y++) {
          const q = (Math.sin(Y / x * Math.PI * 2 + T * 3) * 0.5 + 0.5) * S * 0.15 + 2, H = Y * (W + k), G = p ? c(H, q, W, F, d) : F;
          l(H, S / 2 - q / 2, W, q, G, L);
        }
        E();
        return;
      }
      const D = k * (x - 1), z = (y - D) / x;
      for (let O = 0; O < x; O++) {
        const W = (Math.sin(O / x * Math.PI * 2 + T * 3) * 0.5 + 0.5) * S * 0.3 + 4, Y = O * (z + k), q = S - W, H = p ? c(Y, W, z, F, d) : F;
        l(Y, q, z, W, H, L);
      }
      E();
    }
    function R() {
      const {
        barCount: x,
        barColor: F,
        waveColor: M,
        mode: k,
        sensitivity: L,
        gapBetweenBars: w,
        rounded: p,
        gradient: d,
        gradientEndColor: b
      } = o.current;
      C();
      const A = i.current;
      if (!A) {
        v(), a.current = requestAnimationFrame(R);
        return;
      }
      const T = m.current, D = e.current;
      if (A.getByteFrequencyData(T), A.getByteTimeDomainData(D), P(), k === "bars") {
        const z = w * (x - 1), O = (y - z) / x, W = Math.max(1, Math.floor(T.length / x));
        for (let Y = 0; Y < x; Y++) {
          const H = T[Y * W] / 255 * S * L, G = Y * (O + w), U = d ? c(G, H, O, F, b) : F;
          l(G, S - H, O, H, U, p);
        }
      } else if (k === "mirror") {
        const z = w * (x - 1), O = (y - z) / x, W = Math.max(1, Math.floor(T.length / x));
        for (let Y = 0; Y < x; Y++) {
          const H = T[Y * W] / 255 * S * L, G = Y * (O + w), U = d ? c(G, H, O, F, b) : F;
          l(G, S / 2 - H / 2, O, H, U, p);
        }
      } else if (k === "wave") {
        f.beginPath(), Math.max(1, Math.floor(D.length / y));
        for (let z = 0; z < y; z++) {
          const O = Math.min(Math.floor(z / y * D.length), D.length - 1), W = z, Y = (D[O] / 128 - 1) * (S / 2) * L + S / 2;
          z === 0 ? f.moveTo(W, Y) : f.lineTo(W, Y);
        }
        if (d) {
          const z = f.createLinearGradient(0, 0, y, 0);
          z.addColorStop(0, M), z.addColorStop(0.5, b), z.addColorStop(1, M), f.strokeStyle = z;
        } else
          f.strokeStyle = M;
        f.lineWidth = 2, f.stroke();
      } else if (k === "circular") {
        const { circularRadiusRatio: z } = o.current, O = y / 2, W = S / 2, Y = Math.min(y, S) * z, q = Math.max(1, Math.floor(T.length / x)), H = Math.max(1, 2 * Math.PI * Y / x * 0.6);
        for (let G = 0; G < x; G++) {
          const j = T[G * q] / 255 * Y * L, N = G / x * Math.PI * 2 - Math.PI / 2, K = O + Math.cos(N) * Y, Z = W + Math.sin(N) * Y, nt = O + Math.cos(N) * (Y + j), rt = W + Math.sin(N) * (Y + j);
          f.beginPath(), f.moveTo(K, Z), f.lineTo(nt, rt), f.strokeStyle = d ? `hsl(${G / x * 360},80%,60%)` : F, f.lineWidth = H, f.stroke();
        }
        f.beginPath(), f.arc(O, W, Y, 0, Math.PI * 2), f.strokeStyle = F, f.lineWidth = 1.5, f.stroke();
      }
      E(), a.current = requestAnimationFrame(R);
    }
    return a.current = requestAnimationFrame(R), () => {
      $.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const Ge = {
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
}, He = ht(
  (n, h) => {
    const {
      preset: o,
      audioSource: a = null,
      barCount: i,
      barColor: r,
      waveColor: s,
      mode: m,
      sensitivity: e,
      gapBetweenBars: t,
      rounded: u,
      gradient: g,
      gradientEndColor: f,
      backgroundColor: y,
      glowEffect: S,
      glowColor: I,
      glowBlur: $,
      fftSize: B,
      smoothingTimeConstant: P,
      circularRadiusRatio: E,
      idleAmplitude: C,
      idleAnimationSpeed: c,
      width: l,
      height: v,
      className: R,
      style: x
    } = n, F = o && Ge[o] || {}, M = r ?? F.barColor ?? "#ffffff", k = X(null);
    return gt(h, () => k.current), Ye(k, {
      audioSource: a,
      barCount: i ?? 64,
      barColor: M,
      waveColor: s ?? F.waveColor ?? M,
      mode: m ?? F.mode ?? "bars",
      sensitivity: e ?? 1,
      gapBetweenBars: t ?? 2,
      rounded: u ?? F.rounded ?? !0,
      gradient: g ?? F.gradient ?? !0,
      gradientEndColor: f ?? F.gradientEndColor ?? "#ffffff",
      backgroundColor: y ?? F.backgroundColor ?? "#111111",
      glowEffect: S ?? F.glowEffect ?? !0,
      glowColor: I ?? M,
      glowBlur: $ ?? F.glowBlur ?? 12,
      fftSize: B ?? 2048,
      smoothingTimeConstant: P ?? 0.8,
      circularRadiusRatio: E ?? 0.25,
      idleAmplitude: C ?? 5,
      idleAnimationSpeed: c ?? 1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: R,
        style: {
          width: l ?? "100%",
          height: v ?? "100%",
          display: "block",
          overflow: "hidden",
          ...x
        },
        children: /* @__PURE__ */ at("canvas", { ref: k, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
He.displayName = "AudioVisualizer";
function Ne(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X(!1), s = X(!1), m = X(0), e = X(0);
  dt(() => {
    const t = n.current;
    if (!t) return;
    const u = t, g = u.parentElement;
    if (!g) return;
    const f = u.getContext("2d");
    let y = 0, S = 0;
    function I(c, l) {
      const v = window.devicePixelRatio || 1;
      u.width = Math.round(c * v), u.height = Math.round(l * v), u.style.width = `${c}px`, u.style.height = `${l}px`, f.scale(v, v), y = c, S = l;
    }
    const $ = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && I(l, v);
    });
    $.observe(g);
    const B = g.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P(c) {
      const { spread: l, colors: v, shapes: R, duration: x, spawnX: F, spawnY: M, spawnSpread: k, speedMin: L, speedMax: w, sizeMin: p, sizeMax: d, angularVelocity: b } = o.current, A = y * F, T = S * M, D = Math.max(1, x / 16.67);
      for (let z = 0; z < c; z++) {
        const O = (Math.random() * 2 - 1) * l * Math.PI, W = Math.random() * (w - L) + L;
        a.current.push({
          x: A + (Math.random() - 0.5) * k,
          y: T,
          vx: Math.sin(O) * W,
          vy: -Math.cos(O) * W,
          angle: Math.random() * Math.PI * 2,
          angularV: (Math.random() - 0.5) * b,
          color: v[Math.floor(Math.random() * v.length)],
          shape: R[Math.floor(Math.random() * R.length)],
          w: Math.random() * (d - p) + p,
          h: Math.random() * (d - p) * 0.75 + p * 0.5,
          opacity: 1,
          life: 0,
          maxLife: D
        });
      }
    }
    function E(c) {
      switch (f.save(), f.translate(c.x, c.y), f.rotate(c.angle), f.globalAlpha = c.opacity, f.fillStyle = c.color, c.shape) {
        case "square":
          f.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
          break;
        case "circle":
          f.beginPath(), f.arc(0, 0, c.w / 2, 0, Math.PI * 2), f.fill();
          break;
        case "triangle":
          f.beginPath(), f.moveTo(0, -c.h / 2), f.lineTo(c.w / 2, c.h / 2), f.lineTo(-c.w / 2, c.h / 2), f.closePath(), f.fill();
          break;
        case "strip":
          f.fillRect(-c.w, -c.h / 4, c.w * 2, c.h / 2);
          break;
      }
      f.restore();
    }
    function C(c) {
      const l = m.current ? Math.min(c - m.current, 50) : 16.67;
      m.current = c;
      const { trigger: v, particleCount: R, gravity: x, continuous: F, wind: M, emissionRate: k, onComplete: L } = o.current;
      if (v && !r.current && (P(R), s.current = !1), r.current = v, F && v) {
        e.current += k * l / 1e3;
        const p = Math.floor(e.current);
        p > 0 && (P(p), e.current -= p);
      }
      f.clearRect(0, 0, y, S);
      const w = l / 16.67;
      a.current = a.current.filter((p) => (p.vy += x * 0.3 * w, p.vx += M * 0.05 * w, p.x += p.vx * w, p.y += p.vy * w, p.angle += p.angularV * w, p.life += w, p.opacity = Math.max(0, 1 - p.life / p.maxLife), p.opacity <= 0 || p.y > S + 50 ? !1 : (E(p), !0))), f.globalAlpha = 1, !s.current && v && !F && a.current.length === 0 && r.current && (s.current = !0, L == null || L()), i.current = requestAnimationFrame(C);
    }
    return i.current = requestAnimationFrame(C), () => {
      $.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [n]);
}
const Ue = {
  monochrome: ["#ffffff", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#4b5563"],
  colorful: ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff6fc8", "#ff9a3c", "#c77dff"]
}, je = {
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
}, Ve = ["square", "circle", "triangle", "strip"], _e = ht(
  (n, h) => {
    const {
      preset: o,
      palette: a,
      trigger: i = !1,
      particleCount: r,
      spread: s,
      gravity: m,
      colors: e,
      shapes: t,
      duration: u,
      continuous: g,
      wind: f,
      spawnX: y,
      spawnY: S,
      spawnSpread: I,
      speedMin: $,
      speedMax: B,
      sizeMin: P,
      sizeMax: E,
      angularVelocity: C,
      emissionRate: c,
      onComplete: l,
      width: v,
      height: R,
      className: x,
      style: F
    } = n, M = o && je[o] || {}, k = a ?? M.palette ?? "monochrome", L = e ?? M.colors ?? Ue[k], w = X(null);
    return gt(h, () => w.current), Ne(w, {
      trigger: i,
      particleCount: r ?? 150,
      spread: s ?? 0.8,
      gravity: m ?? M.gravity ?? 0.5,
      colors: L,
      shapes: t ?? M.shapes ?? Ve,
      duration: u ?? 4e3,
      continuous: g ?? !1,
      wind: f ?? M.wind ?? 0.5,
      spawnX: y ?? 0.5,
      spawnY: S ?? 0.4,
      spawnSpread: I ?? 60,
      speedMin: $ ?? 4,
      speedMax: B ?? M.speedMax ?? 16,
      sizeMin: P ?? 6,
      sizeMax: E ?? 14,
      angularVelocity: C ?? 0.3,
      emissionRate: c ?? 10,
      onComplete: l
    }), /* @__PURE__ */ at(
      "div",
      {
        className: x,
        style: {
          width: v ?? "100%",
          height: R ?? "100%",
          display: "block",
          overflow: "hidden",
          pointerEvents: "none",
          ...F
        },
        children: /* @__PURE__ */ at("canvas", { ref: w, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
_e.displayName = "Confetti";
function le(n) {
  return n * n * n * (n * (n * 6 - 15) + 10);
}
function Kt(n, h, o) {
  return n + o * (h - n);
}
function Yt(n, h, o) {
  const a = n & 3, i = a < 2 ? h : o, r = a < 2 ? o : h;
  return (a & 1 ? -i : i) + (a & 2 ? -r : r);
}
const $t = new Uint8Array(256);
for (let n = 0; n < 256; n++) $t[n] = n;
for (let n = 255; n > 0; n--) {
  const h = Math.floor(Math.random() * (n + 1));
  [$t[n], $t[h]] = [$t[h], $t[n]];
}
const Mt = new Uint8Array(512);
for (let n = 0; n < 512; n++) Mt[n] = $t[n & 255];
function Ke(n, h) {
  const o = Math.floor(n) & 255, a = Math.floor(h) & 255, i = n - Math.floor(n), r = h - Math.floor(h), s = le(i), m = le(r), e = Mt[Mt[o] + a], t = Mt[Mt[o] + a + 1], u = Mt[Mt[o + 1] + a], g = Mt[Mt[o + 1] + a + 1];
  return Kt(
    Kt(Yt(e, i, r), Yt(u, i - 1, r), s),
    Kt(Yt(t, i, r - 1), Yt(g, i - 1, r - 1), s),
    m
  );
}
function Qe(n, h, o, a) {
  let i = 0, r = 1, s = 1, m = 0;
  for (let e = 0; e < o; e++)
    i += Ke(n * s, h * s) * r, m += r, r *= a, s *= 2;
  return i / m;
}
function Je(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0), r = X(null), s = X(null), m = X(null), e = X(0), t = X(0);
  dt(() => {
    const u = n.current;
    if (!u) return;
    const g = u, f = g.parentElement;
    if (!f) return;
    const y = g.getContext("2d");
    let S = 0, I = 0;
    function $(C, c) {
      const { resolution: l } = o.current, v = window.devicePixelRatio || 1, R = Math.max(0.05, Math.min(1, l));
      g.width = Math.round(C * v), g.height = Math.round(c * v), g.style.width = `${C}px`, g.style.height = `${c}px`, S = g.width, I = g.height;
      const x = Math.max(1, Math.round(S * R)), F = Math.max(1, Math.round(I * R));
      if (x !== e.current || F !== t.current) {
        e.current = x, t.current = F, r.current = new ImageData(x, F);
        const M = document.createElement("canvas");
        M.width = x, M.height = F;
        const k = M.getContext("2d");
        s.current = M, m.current = k;
      }
    }
    const B = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && $(c, l);
    });
    B.observe(f);
    const P = f.getBoundingClientRect();
    P.width > 0 && P.height > 0 && $(P.width, P.height);
    function E(C) {
      const { colors: c, speed: l, scale: v, octaves: R, animated: x, blendMode: F, timeOffsetY: M, persistence: k } = o.current;
      if (c.length < 2) {
        a.current = requestAnimationFrame(E);
        return;
      }
      x && (i.current = C * 1e-3 * l);
      const L = i.current, w = r.current, p = s.current, d = m.current;
      if (!w || !p || !d) {
        a.current = requestAnimationFrame(E);
        return;
      }
      const b = e.current, A = t.current, T = w.data, D = v * 3 / b, z = v * 3 / A;
      for (let O = 0; O < A; O++) {
        const W = O * z;
        for (let Y = 0; Y < b; Y++) {
          const q = Qe(Y * D + L, W + L * M, R, k), H = Math.max(0, Math.min(1, (q + 1) / 2)), [G, U, j] = yt(c, H), N = (O * b + Y) * 4;
          T[N] = G, T[N + 1] = U, T[N + 2] = j, T[N + 3] = 255;
        }
      }
      d.putImageData(w, 0, 0), y.globalCompositeOperation = F || "source-over", y.imageSmoothingEnabled = !0, y.imageSmoothingQuality = "high", y.drawImage(p, 0, 0, S, I), x && (a.current = requestAnimationFrame(E));
    }
    return a.current = requestAnimationFrame(E), () => {
      B.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const Ze = {
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
}, to = ht(
  (n, h) => {
    const {
      preset: o,
      colors: a,
      speed: i,
      scale: r,
      octaves: s,
      animated: m,
      blendMode: e,
      timeOffsetY: t,
      persistence: u,
      resolution: g,
      width: f,
      height: y,
      className: S,
      style: I
    } = n, $ = o && Ze[o] || {}, B = X(null);
    return gt(h, () => B.current), Je(B, {
      colors: a ?? $.colors ?? ["#0a0a0a", "#2d2d2d", "#6b7280", "#d1d5db", "#f5f5f5"],
      speed: i ?? $.speed ?? 0.25,
      scale: r ?? $.scale ?? 1,
      octaves: s ?? $.octaves ?? 3,
      animated: m ?? !0,
      blendMode: e ?? "source-over",
      timeOffsetY: t ?? 0.5,
      persistence: u ?? 0.5,
      resolution: g ?? 0.25
    }), /* @__PURE__ */ at(
      "div",
      {
        className: S,
        style: { width: f ?? "100%", height: y ?? "100%", display: "block", overflow: "hidden", ...I },
        children: /* @__PURE__ */ at("canvas", { ref: B, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
to.displayName = "NoiseGradient";
function eo(n, h, o) {
  const a = X(o);
  a.current = o;
  const i = X(0), r = X(o.trigger), s = X(0), m = X("idle"), e = X([]), t = X(!1);
  dt(() => {
    const u = n.current;
    if (!u) return;
    const g = u, f = g.parentElement;
    if (!f) return;
    const y = g.getContext("2d");
    let S = 0, I = 0;
    function $(c, l) {
      const { pixelSize: v, dissolvePattern: R } = a.current, x = Math.ceil(c / v), F = Math.ceil(l / v), M = x / 2, k = F / 2, L = [];
      for (let w = 0; w < F; w++)
        for (let p = 0; p < x; p++) {
          let d;
          R === "center" ? d = Math.sqrt((p - M) ** 2 + (w - k) ** 2) / Math.sqrt(M ** 2 + k ** 2) : R === "edges" ? d = 1 - Math.sqrt((p - M) ** 2 + (w - k) ** 2) / Math.sqrt(M ** 2 + k ** 2) : R === "horizontal" ? d = p / x : d = Math.random(), L.push({ x: p * v, y: w * v, delay: d });
        }
      L.sort((w, p) => w.delay - p.delay), e.current = L;
    }
    function B(c, l) {
      const v = window.devicePixelRatio || 1;
      g.width = Math.round(c * v), g.height = Math.round(l * v), g.style.width = `${c}px`, g.style.height = `${l}px`, y.scale(v, v), S = c, I = l, $(c, l);
    }
    const P = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && B(l, v);
    });
    P.observe(f);
    const E = f.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    function C() {
      const { trigger: c, speed: l, color: v, direction: R, pixelSize: x, onComplete: F, progressMultiplier: M } = a.current;
      c !== r.current && (r.current = c, c && (m.current = R === "in" ? "appearing" : "dissolving", s.current = 0, t.current = !1)), y.clearRect(0, 0, S, I);
      const k = e.current, L = m.current;
      if (L === "idle") {
        R === "out" && !c && (y.fillStyle = v, y.fillRect(0, 0, S, I)), i.current = requestAnimationFrame(C);
        return;
      }
      s.current = Math.min(s.current + l * M, 1);
      const w = s.current, p = w;
      if (y.fillStyle = v, L === "dissolving") {
        y.fillRect(0, 0, S, I);
        for (let d = 0; d < k.length; d++) {
          const b = k[d];
          d / k.length < p && y.clearRect(b.x, b.y, x, x);
        }
      } else if (L === "appearing")
        for (let d = 0; d < k.length; d++) {
          const b = k[d];
          d / k.length < p && y.fillRect(b.x, b.y, x, x);
        }
      w >= 1 && (R === "both" && L === "dissolving" ? (m.current = "appearing", s.current = 0) : (m.current = "idle", t.current || (t.current = !0, F == null || F()))), i.current = requestAnimationFrame(C);
    }
    return i.current = requestAnimationFrame(C), () => {
      P.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [n]);
}
const oo = ht(
  ({
    children: n,
    pixelSize: h = 8,
    speed: o = 0.5,
    direction: a = "out",
    trigger: i = !1,
    color: r = "#ffffff",
    onComplete: s,
    progressMultiplier: m = 0.01,
    dissolvePattern: e = "random",
    width: t,
    height: u,
    className: g,
    style: f
  }, y) => {
    const S = X(null), I = X(null);
    return gt(y, () => S.current), eo(S, I, {
      pixelSize: h,
      speed: o,
      direction: a,
      trigger: i,
      color: r,
      onComplete: s,
      progressMultiplier: m,
      dissolvePattern: e
    }), /* @__PURE__ */ Se(
      "div",
      {
        className: g,
        style: { position: "relative", width: t ?? "100%", height: u ?? "100%", overflow: "hidden", ...f },
        children: [
          n && /* @__PURE__ */ at("div", { ref: I, style: { position: "absolute", inset: 0 }, children: n }),
          /* @__PURE__ */ at(
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
oo.displayName = "PixelDissolve";
function no(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X(null), s = X(""), m = X(""), e = X(""), t = X("");
  dt(() => {
    const u = n.current;
    if (!u) return;
    const g = u, f = g.parentElement;
    if (!f) return;
    const y = g.getContext("2d");
    let S = 0, I = 0;
    function $(x, F) {
      const { starCount: M, speed: k, velocityMultiplier: L } = o.current;
      a.current = Array.from({ length: M }, () => ({
        x: Math.random() * x,
        y: Math.random() * F,
        vx: (Math.random() - 0.5) * k * L,
        vy: (Math.random() - 0.5) * k * L,
        size: Math.random() * 2.5 + 1,
        twinkle: Math.random() * 0.4 + 0.6,
        twinklePhase: Math.random() * Math.PI * 2
      }));
    }
    function B(x, F) {
      const M = window.devicePixelRatio || 1;
      g.width = Math.round(x * M), g.height = Math.round(F * M), g.style.width = `${x}px`, g.style.height = `${F}px`, y.scale(M, M), S = x, I = F, $(x, F);
    }
    const P = new ResizeObserver((x) => {
      const { width: F, height: M } = x[0].contentRect;
      F > 0 && M > 0 && B(F, M);
    });
    P.observe(f);
    const E = f.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    function C(x) {
      const F = g.getBoundingClientRect();
      return { x: x.clientX - F.left, y: x.clientY - F.top };
    }
    function c(x) {
      if (!o.current.interactive) return;
      const { x: F, y: M } = C(x), k = a.current, { dragRadius: L } = o.current;
      let w = -1, p = L;
      for (let d = 0; d < k.length; d++) {
        const b = k[d].x - F, A = k[d].y - M, T = Math.sqrt(b * b + A * A);
        T < p && (p = T, w = d);
      }
      w !== -1 && (r.current = { starIndex: w, offsetX: k[w].x - F, offsetY: k[w].y - M });
    }
    function l(x) {
      if (!r.current) return;
      const { x: F, y: M } = C(x), k = a.current[r.current.starIndex];
      k.x = F + r.current.offsetX, k.y = M + r.current.offsetY, k.vx = 0, k.vy = 0;
    }
    function v() {
      r.current = null;
    }
    g.addEventListener("mousedown", c), g.addEventListener("mousemove", l), g.addEventListener("mouseup", v), g.addEventListener("mouseleave", v);
    function R() {
      const {
        starColor: x,
        lineColor: F,
        backgroundColor: M,
        lineStyle: k,
        glowStars: L,
        connectionDistance: w,
        twinkleSpeed: p,
        lineAlpha: d,
        lineWidth: b,
        glowMultiplier: A,
        twinkleAmplitude: T
      } = o.current;
      F !== e.current && (s.current = St(F), e.current = F), x !== t.current && (m.current = St(x), t.current = x);
      const D = s.current, z = m.current;
      y.clearRect(0, 0, S, I), M && M !== "transparent" && (y.fillStyle = M, y.fillRect(0, 0, S, I));
      const O = a.current;
      for (const W of O)
        r.current && a.current[r.current.starIndex] === W || (W.x += W.vx, W.y += W.vy, W.twinklePhase += p, W.x < 0 ? W.x += S : W.x > S && (W.x -= S), W.y < 0 ? W.y += I : W.y > I && (W.y -= I));
      k === "dashed" ? y.setLineDash([4, 6]) : y.setLineDash([]);
      for (let W = 0; W < O.length; W++)
        for (let Y = W + 1; Y < O.length; Y++) {
          const q = O[W].x - O[Y].x, H = O[W].y - O[Y].y, G = Math.sqrt(q * q + H * H);
          if (G < w) {
            const U = (1 - G / w) * d;
            y.beginPath(), y.moveTo(O[W].x, O[W].y), y.lineTo(O[Y].x, O[Y].y), y.strokeStyle = `rgba(${D},${U})`, y.lineWidth = b, y.stroke();
          }
        }
      y.setLineDash([]);
      for (const W of O) {
        const Y = 1 - T + T * Math.sin(W.twinklePhase);
        L && (y.shadowColor = x, y.shadowBlur = W.size * A), y.beginPath(), y.arc(W.x, W.y, W.size, 0, Math.PI * 2), y.fillStyle = `rgba(${z},${Y})`, y.fill();
      }
      y.shadowBlur = 0, i.current = requestAnimationFrame(R);
    }
    return i.current = requestAnimationFrame(R), () => {
      P.disconnect(), cancelAnimationFrame(i.current), g.removeEventListener("mousedown", c), g.removeEventListener("mousemove", l), g.removeEventListener("mouseup", v), g.removeEventListener("mouseleave", v);
    };
  }, [n]);
}
const ro = {
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
}, ao = ht(
  (n, h) => {
    const {
      preset: o,
      starCount: a,
      starColor: i,
      lineColor: r,
      backgroundColor: s,
      speed: m,
      interactive: e,
      lineStyle: t,
      glowStars: u,
      connectionDistance: g,
      velocityMultiplier: f,
      dragRadius: y,
      twinkleSpeed: S,
      lineAlpha: I,
      lineWidth: $,
      glowMultiplier: B,
      twinkleAmplitude: P,
      width: E,
      height: C,
      className: c,
      style: l
    } = n, v = o && ro[o] || {}, R = X(null);
    return gt(h, () => R.current), no(R, {
      starCount: a ?? v.starCount ?? 80,
      starColor: i ?? v.starColor ?? "#ffffff",
      lineColor: r ?? v.lineColor ?? "rgba(255,255,255,0.25)",
      backgroundColor: s ?? v.backgroundColor ?? "#111111",
      speed: m ?? 0.3,
      interactive: e ?? !0,
      lineStyle: t ?? v.lineStyle ?? "solid",
      glowStars: u ?? v.glowStars ?? !0,
      connectionDistance: g ?? v.connectionDistance ?? 100,
      velocityMultiplier: f ?? 0.3,
      dragRadius: y ?? 20,
      twinkleSpeed: S ?? 0.03,
      lineAlpha: I ?? v.lineAlpha ?? 0.5,
      lineWidth: $ ?? 0.8,
      glowMultiplier: B ?? 4,
      twinkleAmplitude: P ?? 0.4
    }), /* @__PURE__ */ at(
      "div",
      {
        className: c,
        style: {
          width: E ?? "100%",
          height: C ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: e ?? !0 ? "grab" : "default",
          ...l
        },
        children: /* @__PURE__ */ at(
          "canvas",
          {
            ref: R,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block" }
          }
        )
      }
    );
  }
);
ao.displayName = "ConstellationMap";
const xt = new Uint8Array(512), Lt = new Uint8Array(256);
for (let n = 0; n < 256; n++) Lt[n] = n;
for (let n = 255; n > 0; n--) {
  const h = Math.floor(Math.random() * (n + 1));
  [Lt[n], Lt[h]] = [Lt[h], Lt[n]];
}
for (let n = 0; n < 512; n++) xt[n] = Lt[n & 255];
function ue(n) {
  return n * n * n * (n * (n * 6 - 15) + 10);
}
function Qt(n, h, o) {
  return n + o * (h - n);
}
function Gt(n, h, o) {
  const a = n & 3, i = a < 2 ? h : o, r = a < 2 ? o : h;
  return (a & 1 ? -i : i) + (a & 2 ? -r : r);
}
function de(n, h) {
  const o = Math.floor(n) & 255, a = Math.floor(h) & 255, i = n - Math.floor(n), r = h - Math.floor(h), s = ue(i), m = ue(r), e = xt[xt[o] + a], t = xt[xt[o] + a + 1], u = xt[xt[o + 1] + a], g = xt[xt[o + 1] + a + 1];
  return Qt(
    Qt(Gt(e, i, r), Gt(u, i - 1, r), s),
    Qt(Gt(t, i, r - 1), Gt(g, i - 1, r - 1), s),
    m
  );
}
function io(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X(0), s = X(null);
  dt(() => {
    var m;
    (m = s.current) == null || m.call(s);
  }, [h.particleCount]), dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    function f() {
      const { colors: P } = o.current;
      return {
        x: Math.random() * u,
        y: Math.random() * g,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: Math.random() * 120 + 60,
        color: P[Math.floor(Math.random() * P.length)]
      };
    }
    function y() {
      const { particleCount: P } = o.current;
      a.current = Array.from({ length: P }, f);
    }
    function S(P, E) {
      const C = n.current, c = window.devicePixelRatio || 1;
      C.width = Math.round(P * c), C.height = Math.round(E * c), C.style.width = `${P}px`, C.style.height = `${E}px`, t.scale(c, c), u = P, g = E, y();
    }
    s.current = () => {
      u > 0 && g > 0 && y();
    };
    const I = new ResizeObserver((P) => {
      const { width: E, height: C } = P[0].contentRect;
      E > 0 && C > 0 && S(E, C);
    });
    I.observe(e);
    const $ = e.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    function B() {
      const { speed: P, noiseScale: E, fadeStrength: C, lineWidth: c, backgroundColor: l, timeSpeed: v, curl: R } = o.current;
      r.current += v * 1e-3;
      const x = r.current;
      l && l !== "transparent" ? (t.fillStyle = l, t.globalAlpha = C, t.fillRect(0, 0, u, g), t.globalAlpha = 1) : (t.fillStyle = `rgba(0,0,0,${C})`, t.fillRect(0, 0, u, g));
      const F = a.current;
      for (let M = 0; M < F.length; M++) {
        const k = F[M], L = k.x * E, w = k.y * E, p = de(L + x, w + x * 0.7) * Math.PI * 4;
        let d = Math.cos(p), b = Math.sin(p);
        if (R) {
          const z = de(L + 100 + x, w + x * 0.7);
          d += -Math.sin(z * Math.PI * 2) * 0.5, b += Math.cos(z * Math.PI * 2) * 0.5;
        }
        const A = k.x, T = k.y;
        k.vx = k.vx * 0.9 + d * P * 0.1, k.vy = k.vy * 0.9 + b * P * 0.1, k.x += k.vx, k.y += k.vy, k.age++;
        const D = Math.max(0, 1 - k.age / k.maxAge) * 0.7;
        t.beginPath(), t.moveTo(A, T), t.lineTo(k.x, k.y), t.strokeStyle = k.color, t.globalAlpha = D, t.lineWidth = c, t.stroke(), t.globalAlpha = 1, (k.age > k.maxAge || k.x < 0 || k.x > u || k.y < 0 || k.y > g) && (a.current[M] = f());
      }
      i.current = requestAnimationFrame(B);
    }
    return i.current = requestAnimationFrame(B), () => {
      I.disconnect(), cancelAnimationFrame(i.current);
    };
  }, [n]);
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
}, so = ht(
  (n, h) => {
    const {
      preset: o,
      particleCount: a,
      colors: i,
      speed: r,
      noiseScale: s,
      trailLength: m,
      fadeStrength: e,
      lineWidth: t,
      backgroundColor: u,
      animated: g,
      timeSpeed: f,
      curl: y,
      width: S,
      height: I,
      className: $,
      style: B
    } = n, P = o && co[o] || {}, E = X(null);
    return gt(h, () => E.current), io(E, {
      particleCount: a ?? P.particleCount ?? 800,
      colors: i ?? P.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: r ?? P.speed ?? 1,
      noiseScale: s ?? P.noiseScale ?? 4e-3,
      trailLength: m ?? 0.04,
      fadeStrength: e ?? 0.04,
      lineWidth: t ?? 1,
      backgroundColor: u ?? P.backgroundColor ?? "#111111",
      animated: g ?? !0,
      timeSpeed: f ?? 1,
      curl: y ?? P.curl ?? !1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: $,
        style: { width: S ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...B },
        children: /* @__PURE__ */ at("canvas", { ref: E, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
so.displayName = "FlowField";
function Jt(n, h) {
  const o = n.replace("#", "");
  return o.length === 3 ? `rgba(${parseInt(o[0] + o[0], 16)},${parseInt(o[1] + o[1], 16)},${parseInt(o[2] + o[2], 16)},${h})` : o.length === 6 ? `rgba(${parseInt(o.slice(0, 2), 16)},${parseInt(o.slice(2, 4), 16)},${parseInt(o.slice(4, 6), 16)},${h})` : n;
}
function lo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null), r = X({ x: -1, y: -1 });
  dt(() => {
    const s = n.current;
    if (!s) return;
    const m = s.parentElement;
    if (!m) return;
    const e = s.getContext("2d");
    let t = 0, u = 0;
    function g(B, P) {
      const E = n.current, C = window.devicePixelRatio || 1;
      E.width = Math.round(B * C), E.height = Math.round(P * C), E.style.width = `${B}px`, E.style.height = `${P}px`, e.scale(C, C), t = B, u = P;
    }
    const f = new ResizeObserver((B) => {
      const { width: P, height: E } = B[0].contentRect;
      P > 0 && E > 0 && g(P, E);
    });
    f.observe(m);
    const y = m.getBoundingClientRect();
    y.width > 0 && y.height > 0 && g(y.width, y.height);
    function S(B) {
      if (!o.current.interactive) return;
      const P = n.current.getBoundingClientRect();
      i.current = { x: B.clientX - P.left, y: B.clientY - P.top };
    }
    function I() {
      i.current = null;
    }
    m.addEventListener("mousemove", S), m.addEventListener("mouseleave", I);
    function $() {
      const {
        radius: B,
        color: P,
        overlayColor: E,
        overlayOpacity: C,
        edgeSoftness: c,
        followSpeed: l,
        glowColor: v,
        glowSize: R,
        showGlow: x,
        shape: F,
        ellipseRatio: M,
        defaultX: k,
        defaultY: L
      } = o.current, w = i.current ? i.current.x : t * k, p = i.current ? i.current.y : u * L;
      r.current.x < 0 ? r.current = { x: w, y: p } : (r.current.x += (w - r.current.x) * l, r.current.y += (p - r.current.y) * l);
      const d = r.current.x, b = r.current.y, A = B, T = F === "ellipse" ? B * M : B;
      if (e.clearRect(0, 0, t, u), e.fillStyle = E, e.globalAlpha = C, e.fillRect(0, 0, t, u), e.globalAlpha = 1, x) {
        e.save(), e.translate(d, b), e.scale(1, T / A);
        const W = e.createRadialGradient(0, 0, A * 0.8, 0, 0, A + R);
        W.addColorStop(0, Jt(v, 0.25)), W.addColorStop(1, Jt(v, 0)), e.fillStyle = W, e.beginPath(), e.arc(0, 0, A + R, 0, Math.PI * 2), e.fill(), e.restore();
      }
      e.globalCompositeOperation = "destination-out", e.save(), e.translate(d, b), e.scale(1, T / A);
      const D = A * (1 - c * 0.5), z = A + A * c, O = e.createRadialGradient(0, 0, D, 0, 0, z);
      if (O.addColorStop(0, "rgba(0,0,0,1)"), O.addColorStop(1, "rgba(0,0,0,0)"), e.fillStyle = O, e.beginPath(), e.arc(0, 0, z, 0, Math.PI * 2), e.fill(), e.restore(), e.globalCompositeOperation = "source-over", P && P !== "#ffffff") {
        e.save(), e.globalAlpha = 0.15;
        const W = e.createRadialGradient(d, b, 0, d, b, A);
        W.addColorStop(0, P), W.addColorStop(1, Jt(P, 0)), e.fillStyle = W, e.beginPath(), e.ellipse(d, b, A, T, 0, 0, Math.PI * 2), e.fill(), e.restore();
      }
      a.current = requestAnimationFrame($);
    }
    return a.current = requestAnimationFrame($), () => {
      f.disconnect(), cancelAnimationFrame(a.current), m.removeEventListener("mousemove", S), m.removeEventListener("mouseleave", I);
    };
  }, [n]);
}
const uo = {
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
}, fo = ht(
  (n, h) => {
    const {
      preset: o,
      radius: a,
      color: i,
      overlayColor: r,
      overlayOpacity: s,
      edgeSoftness: m,
      followSpeed: e,
      glowColor: t,
      glowSize: u,
      showGlow: g,
      shape: f,
      ellipseRatio: y,
      interactive: S,
      defaultX: I,
      defaultY: $,
      width: B,
      height: P,
      className: E,
      style: C
    } = n, c = o && uo[o] || {}, l = X(null);
    return gt(h, () => l.current), lo(l, {
      radius: a ?? c.radius ?? 120,
      color: i ?? c.color ?? "#ffffff",
      overlayColor: r ?? c.overlayColor ?? "#000000",
      overlayOpacity: s ?? c.overlayOpacity ?? 0.75,
      edgeSoftness: m ?? c.edgeSoftness ?? 0.4,
      followSpeed: e ?? c.followSpeed ?? 0.1,
      glowColor: t ?? c.glowColor ?? "#6b7280",
      glowSize: u ?? c.glowSize ?? 30,
      showGlow: g ?? c.showGlow ?? !0,
      shape: f ?? c.shape ?? "circle",
      ellipseRatio: y ?? c.ellipseRatio ?? 0.6,
      interactive: S ?? !0,
      defaultX: I ?? 0.5,
      defaultY: $ ?? 0.5
    }), /* @__PURE__ */ at(
      "div",
      {
        className: E,
        style: { width: B ?? "100%", height: P ?? "100%", display: "block", overflow: "hidden", position: "relative", ...C },
        children: /* @__PURE__ */ at(
          "canvas",
          {
            ref: l,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
fo.displayName = "Spotlight";
function ho(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X({ w: 0, h: 0 }), s = (m, e) => {
    const { color: t, secondaryColor: u, ringCount: g, ringSpacing: f, speed: y, maxRadius: S, lineWidth: I } = o.current;
    for (let $ = 0; $ < g; $++) {
      const B = $ % 2 === 1;
      a.current.push({
        x: m,
        y: e,
        radius: $ * f,
        maxRadius: S + $ * f * 0.5,
        opacity: 1,
        color: B ? u : t,
        lineWidth: I * (1 - $ * 0.15),
        speed: y * (1 + $ * 0.05)
      });
    }
  };
  return dt(() => {
    if (!h.autoFire) return;
    const m = setInterval(() => {
      const { w: e, h: t } = r.current;
      e === 0 || t === 0 || s(e * (0.3 + Math.random() * 0.4), t * (0.3 + Math.random() * 0.4));
    }, h.autoInterval);
    return () => clearInterval(m);
  }, [h.autoFire, h.autoInterval]), dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    function u(I, $) {
      const B = n.current, P = window.devicePixelRatio || 1;
      B.width = Math.round(I * P), B.height = Math.round($ * P), B.style.width = `${I}px`, B.style.height = `${$}px`, t.scale(P, P), r.current = { w: I, h: $ };
    }
    const g = new ResizeObserver((I) => {
      const { width: $, height: B } = I[0].contentRect;
      $ > 0 && B > 0 && u($, B);
    });
    g.observe(e);
    const f = e.getBoundingClientRect();
    f.width > 0 && f.height > 0 && u(f.width, f.height);
    function y(I) {
      const $ = n.current.getBoundingClientRect();
      s(I.clientX - $.left, I.clientY - $.top);
    }
    e.addEventListener("click", y);
    function S() {
      const { backgroundColor: I, glowEffect: $, glowBlur: B, fadeSpeed: P } = o.current, { w: E, h: C } = r.current;
      t.clearRect(0, 0, E, C), I && I !== "transparent" && (t.fillStyle = I, t.fillRect(0, 0, E, C));
      const c = [];
      for (const l of a.current)
        l.radius += l.speed, l.opacity -= P, !(l.opacity <= 0 || l.radius > l.maxRadius) && (c.push(l), t.beginPath(), t.arc(l.x, l.y, l.radius, 0, Math.PI * 2), t.strokeStyle = l.color, t.globalAlpha = l.opacity, t.lineWidth = l.lineWidth * l.opacity, $ ? (t.shadowColor = l.color, t.shadowBlur = B) : t.shadowBlur = 0, t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0);
      a.current = c, i.current = requestAnimationFrame(S);
    }
    return i.current = requestAnimationFrame(S), () => {
      g.disconnect(), cancelAnimationFrame(i.current), e.removeEventListener("click", y);
    };
  }, [n]), { fire: s };
}
const go = {
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
  (n, h) => {
    const {
      preset: o,
      color: a,
      secondaryColor: i,
      ringCount: r,
      ringSpacing: s,
      speed: m,
      maxRadius: e,
      lineWidth: t,
      fadeSpeed: u,
      autoFire: g,
      autoInterval: f,
      glowEffect: y,
      glowBlur: S,
      backgroundColor: I,
      width: $,
      height: B,
      className: P,
      style: E
    } = n, C = o && go[o] || {}, c = X(null);
    return gt(h, () => c.current), ho(c, {
      color: a ?? C.color ?? "#ffffff",
      secondaryColor: i ?? C.secondaryColor ?? "#6b7280",
      ringCount: r ?? C.ringCount ?? 3,
      ringSpacing: s ?? C.ringSpacing ?? 20,
      speed: m ?? C.speed ?? 4,
      maxRadius: e ?? C.maxRadius ?? 200,
      lineWidth: t ?? C.lineWidth ?? 2,
      fadeSpeed: u ?? C.fadeSpeed ?? 0.02,
      autoFire: g ?? !0,
      autoInterval: f ?? 2e3,
      glowEffect: y ?? C.glowEffect ?? !0,
      glowBlur: S ?? C.glowBlur ?? 15,
      backgroundColor: I ?? C.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ at(
      "div",
      {
        className: P,
        style: { width: $ ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", ...E },
        children: /* @__PURE__ */ at("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
mo.displayName = "Shockwave";
const po = 400;
function yo(n, h) {
  const o = n.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
  if (o) return `rgba(${o[1]},${o[2]},${o[3]},${h})`;
  if (n.startsWith("#")) {
    const a = n.slice(1), i = a.length === 3 ? a.split("").map((e) => e + e).join("") : a, r = parseInt(i.slice(0, 2), 16), s = parseInt(i.slice(2, 4), 16), m = parseInt(i.slice(4, 6), 16);
    return `rgba(${r},${s},${m},${h})`;
  }
  return `rgba(0,0,0,${h})`;
}
function wo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X([]), r = X(0), s = X(null), m = X(/* @__PURE__ */ new Map()), e = (t) => {
    const { colors: u, shellSpeed: g } = o.current, f = n.current;
    if (!f) return;
    const y = f.clientWidth || f.width, S = f.clientHeight || f.height, I = t ?? y * 0.2 + Math.random() * y * 0.6;
    i.current.push({
      x: I,
      y: S,
      vx: (Math.random() - 0.5) * 2,
      vy: -(g + Math.random() * 3),
      targetY: S * 0.15 + Math.random() * S * 0.35,
      color: u[Math.floor(Math.random() * u.length)],
      exploded: !1
    });
  };
  return dt(() => {
    const t = n.current;
    if (!t) return;
    const u = t.parentElement;
    if (!u) return;
    const g = t.getContext("2d");
    let f = 0, y = 0;
    function S(c, l) {
      const v = n.current, R = window.devicePixelRatio || 1;
      v.width = Math.round(c * R), v.height = Math.round(l * R), v.style.width = `${c}px`, v.style.height = `${l}px`, g.scale(R, R), f = c, y = l;
    }
    const I = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && S(l, v);
    });
    I.observe(u);
    const $ = u.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    function B(c) {
      const l = n.current.getBoundingClientRect();
      e(c.clientX - l.left);
    }
    u.addEventListener("click", B);
    function P() {
      const { autoLaunch: c, autoInterval: l } = o.current;
      c && (s.current = setTimeout(() => {
        e(), P();
      }, l * (0.7 + Math.random() * 0.6)));
    }
    P();
    function E(c) {
      const { colors: l, particleCount: v, spread: R, particleSize: x } = o.current, F = po - a.current.length;
      if (F <= 0) return;
      const M = Math.min(v, F);
      for (let k = 0; k < M; k++) {
        const L = Math.PI * 2 * k / M + (Math.random() - 0.5) * 0.5, w = R * (0.4 + Math.random() * 0.6), p = Math.random() < 0.15 ? l[Math.floor(Math.random() * l.length)] : c.color;
        a.current.push({
          x: c.x,
          y: c.y,
          vx: Math.cos(L) * w,
          vy: Math.sin(L) * w,
          alpha: 1,
          color: p,
          size: x * (0.5 + Math.random() * 0.8)
        });
      }
    }
    function C() {
      const { gravity: c, friction: l, fadeSpeed: v, glowEffect: R, glowBlur: x, backgroundColor: F, trailLength: M } = o.current;
      if (!F || F === "transparent")
        g.clearRect(0, 0, f, y);
      else {
        const d = Math.max(0.05, Math.min(0.4, 1 / Math.max(1, M)));
        g.fillStyle = yo(F, d), g.fillRect(0, 0, f, y);
      }
      let L = 0;
      for (let d = 0; d < i.current.length; d++) {
        const b = i.current[d];
        if (b.x += b.vx, b.y += b.vy, b.vy += c * 0.3, b.y <= b.targetY && !b.exploded) {
          b.exploded = !0, E(b);
          continue;
        }
        b.exploded || (i.current[L++] = b, g.beginPath(), g.arc(b.x, b.y, 2, 0, Math.PI * 2), g.fillStyle = b.color, g.globalAlpha = 0.9, R && (g.shadowColor = b.color, g.shadowBlur = 6), g.fill(), g.shadowBlur = 0);
      }
      i.current.length = L;
      const w = m.current;
      w.forEach((d) => d.length = 0);
      let p = 0;
      for (let d = 0; d < a.current.length; d++) {
        const b = a.current[d];
        if (b.vx *= l, b.vy *= l, b.vy += c, b.x += b.vx, b.y += b.vy, b.alpha -= v, b.alpha <= 0) continue;
        a.current[p++] = b;
        let A = w.get(b.color);
        A || (A = [], w.set(b.color, A)), A.push(b);
      }
      a.current.length = p, R && (g.shadowBlur = x);
      for (const [d, b] of w)
        if (b.length !== 0) {
          g.fillStyle = d, R && (g.shadowColor = d);
          for (let A = 0; A < b.length; A++) {
            const T = b[A];
            g.globalAlpha = T.alpha, g.beginPath(), g.arc(T.x, T.y, Math.max(0.5, T.size * T.alpha), 0, Math.PI * 2), g.fill();
          }
        }
      g.globalAlpha = 1, g.shadowBlur = 0, r.current = requestAnimationFrame(C);
    }
    return r.current = requestAnimationFrame(C), () => {
      I.disconnect(), cancelAnimationFrame(r.current), u.removeEventListener("click", B), s.current && clearTimeout(s.current);
    };
  }, [n]), { launch: e };
}
const vo = {
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
}, bo = ht(
  (n, h) => {
    const {
      preset: o,
      colors: a,
      particleCount: i,
      gravity: r,
      friction: s,
      fadeSpeed: m,
      particleSize: e,
      trailLength: t,
      spread: u,
      autoLaunch: g,
      autoInterval: f,
      glowEffect: y,
      glowBlur: S,
      backgroundColor: I,
      shellSpeed: $,
      width: B,
      height: P,
      className: E,
      style: C
    } = n, c = o && vo[o] || {}, l = X(null);
    return gt(h, () => l.current), wo(l, {
      colors: a ?? c.colors ?? ["#ffffff", "#e2e8f0", "#6b7280", "#9ca3af"],
      particleCount: i ?? c.particleCount ?? 80,
      gravity: r ?? c.gravity ?? 0.08,
      friction: s ?? c.friction ?? 0.97,
      fadeSpeed: m ?? c.fadeSpeed ?? 0.015,
      particleSize: e ?? c.particleSize ?? 2,
      trailLength: t ?? c.trailLength ?? 6,
      spread: u ?? c.spread ?? 5,
      autoLaunch: g ?? !0,
      autoInterval: f ?? 1800,
      glowEffect: y ?? c.glowEffect ?? !0,
      glowBlur: S ?? c.glowBlur ?? 8,
      backgroundColor: I ?? c.backgroundColor ?? "#111111",
      shellSpeed: $ ?? c.shellSpeed ?? 12
    }), /* @__PURE__ */ at(
      "div",
      {
        className: E,
        style: { width: B ?? "100%", height: P ?? "100%", display: "block", overflow: "hidden", ...C },
        children: /* @__PURE__ */ at("canvas", { ref: l, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
bo.displayName = "Fireworks";
function Co(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0), r = X(0), s = X(!1), m = X(0), e = X(0), t = X(0), u = X(0);
  dt(() => {
    const g = n.current;
    if (!g) return;
    const f = g.parentElement;
    if (!f) return;
    const y = g.getContext("2d");
    let S = 0, I = 0;
    function $(C, c) {
      const l = n.current, v = window.devicePixelRatio || 1;
      l.width = Math.round(C * v), l.height = Math.round(c * v), l.style.width = `${C}px`, l.style.height = `${c}px`, y.scale(v, v), S = C, I = c;
    }
    const B = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && $(c, l);
    });
    B.observe(f);
    const P = f.getBoundingClientRect();
    P.width > 0 && P.height > 0 && $(P.width, P.height);
    function E() {
      const {
        animated: C,
        intensity: c,
        speed: l,
        rgbShift: v,
        scanlines: R,
        scanlineOpacity: x,
        scanlineSpacing: F,
        blockGlitch: M,
        blockCount: k,
        noiseOpacity: L,
        flickerRate: w,
        color: p,
        backgroundColor: d
      } = o.current;
      if (y.clearRect(0, 0, S, I), d && d !== "transparent" && (y.fillStyle = d, y.fillRect(0, 0, S, I)), R) {
        for (let O = 0; O < I; O += F) {
          const W = x * (O % (F * 2) === 0 ? 1.2 : 0.7);
          y.fillStyle = "rgba(0,0,0,1)", y.globalAlpha = Math.min(1, W), y.fillRect(0, O, S, 1);
        }
        y.globalAlpha = 1;
      }
      if (!C) {
        a.current = requestAnimationFrame(E);
        return;
      }
      const b = 16;
      i.current += l * 0.016, u.current += l * 0.02, r.current -= b, r.current <= 0 && (s.current ? (s.current = !1, r.current = (800 + Math.random() * 2e3) / l) : (s.current = Math.random() < c, m.current = 80 + Math.random() * 300, r.current = m.current)), e.current -= b, e.current <= 0 && (e.current = 100 + Math.random() * 300 / l);
      const A = e.current < 40 && Math.random() < c * 0.4, T = s.current || A;
      if (t.current > 0 ? (t.current -= b, y.globalCompositeOperation = "difference", y.fillStyle = "rgba(255,255,255,1)", y.globalAlpha = Math.min(1, t.current / 30), y.fillRect(0, 0, S, I), y.globalCompositeOperation = "source-over", y.globalAlpha = 1) : T && Math.random() < 5e-3 * c && (t.current = 30 + Math.random() * 60), Math.random() < w * (T ? 4 : 1)) {
        const O = T ? 0.08 : 0.02;
        y.fillStyle = `rgba(255,255,255,${O})`, y.fillRect(0, 0, S, I);
      }
      if (T && Math.random() < 0.03 * c && (y.fillStyle = "rgba(0,0,0,0.4)", y.fillRect(0, 0, S, I)), L > 0) {
        const O = y.createImageData(S, I), W = T ? 1.8 : 1;
        for (let Y = 0; Y < O.data.length; Y += 4) {
          const q = Math.random() * 255 | 0;
          O.data[Y] = q, O.data[Y + 1] = q, O.data[Y + 2] = q, O.data[Y + 3] = Math.random() < L * W ? 60 : 0;
        }
        y.putImageData(O, 0, 0);
      }
      if (T) {
        const O = s.current ? 1 - r.current / m.current : 0.4;
        if (v > 0) {
          const H = v * c * O * (0.5 + Math.random() * 1.5), G = Math.sin(u.current * 3) * H * 0.3;
          y.globalCompositeOperation = "screen", y.fillStyle = "rgba(255,0,0,0.06)", y.globalAlpha = 0.5 + O * 0.4, y.fillRect(H + G, 0, S, I), y.fillStyle = "rgba(0,255,255,0.06)", y.fillRect(-(H + G), 0, S, I);
          const U = Math.random() * I, j = 5 + Math.random() * 40, N = H * (1 + Math.random() * 3);
          y.fillStyle = "rgba(255,0,0,0.12)", y.globalAlpha = 0.7, y.fillRect(N, U, S, j), y.fillStyle = "rgba(0,255,255,0.12)", y.fillRect(-N, U + 1, S, j), y.globalCompositeOperation = "source-over", y.globalAlpha = 1;
        }
        if (M) {
          const H = Math.ceil(k * O * (1 + Math.random() * 2));
          for (let G = 0; G < H; G++) {
            const U = Math.random() * I, j = 1 + Math.random() * (T ? 30 : 12), N = Math.max(v * 2, 20) * c * O, K = (Math.random() - 0.5) * N * 2;
            try {
              const Z = y.getImageData(0, U, S, j);
              y.putImageData(Z, K, U);
            } catch {
            }
          }
        }
        const W = Math.floor(Math.random() * 4 * O);
        for (let H = 0; H < W; H++) {
          const G = Math.random() * I, U = 1 + Math.random() * 3, j = Math.random() < 0.5 ? "0,255,0" : "255,140,0";
          y.fillStyle = `rgba(${j},0.15)`, y.globalAlpha = 0.4 + Math.random() * 0.4, y.fillRect(0, G, S, U);
        }
        if (y.globalAlpha = 1, Math.random() < 0.15 * c * O) {
          const H = Math.random() * S, G = 1 + Math.random() * 4, U = (Math.random() - 0.5) * 20 * c;
          try {
            const j = y.getImageData(H, 0, G, I);
            y.putImageData(j, H, U);
          } catch {
          }
        }
        const Y = Math.floor(Math.random() * I), q = 1 + Math.random() * 3;
        if (y.fillStyle = p, y.globalAlpha = 0.2 * c * O, y.fillRect(0, Y, S, q), y.globalAlpha = 1, Math.random() < 0.04 * c) {
          const H = Math.random() * S * 0.7, G = Math.random() * I, U = 20 + Math.random() * S * 0.3, j = 2 + Math.random() * 20, N = y.createImageData(U, j);
          for (let K = 0; K < N.data.length; K += 4)
            N.data[K] = Math.random() * 255 | 0, N.data[K + 1] = Math.random() * 255 | 0, N.data[K + 2] = Math.random() * 255 | 0, N.data[K + 3] = 180;
          y.putImageData(N, H, G);
        }
      }
      const D = Math.max(S, I) * (T ? 0.65 : 0.75), z = y.createRadialGradient(S / 2, I / 2, I * 0.3, S / 2, I / 2, D);
      z.addColorStop(0, "rgba(0,0,0,0)"), z.addColorStop(1, `rgba(0,0,0,${T ? 0.5 : 0.35})`), y.fillStyle = z, y.fillRect(0, 0, S, I), a.current = requestAnimationFrame(E);
    }
    return a.current = requestAnimationFrame(E), () => {
      B.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const Mo = {
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
}, xo = ht(
  (n, h) => {
    const {
      preset: o,
      intensity: a,
      speed: i,
      rgbShift: r,
      scanlines: s,
      scanlineOpacity: m,
      scanlineSpacing: e,
      blockGlitch: t,
      blockCount: u,
      noiseOpacity: g,
      flickerRate: f,
      color: y,
      animated: S,
      backgroundColor: I,
      width: $,
      height: B,
      className: P,
      style: E
    } = n, C = o && Mo[o] || {}, c = X(null);
    return gt(h, () => c.current), Co(c, {
      intensity: a ?? C.intensity ?? 0.6,
      speed: i ?? C.speed ?? 1,
      rgbShift: r ?? C.rgbShift ?? 8,
      scanlines: s ?? C.scanlines ?? !0,
      scanlineOpacity: m ?? C.scanlineOpacity ?? 0.08,
      scanlineSpacing: e ?? C.scanlineSpacing ?? 2,
      blockGlitch: t ?? C.blockGlitch ?? !0,
      blockCount: u ?? C.blockCount ?? 4,
      noiseOpacity: g ?? C.noiseOpacity ?? 0.02,
      flickerRate: f ?? C.flickerRate ?? 0.02,
      color: y ?? C.color ?? "#ffffff",
      animated: S ?? !0,
      backgroundColor: I ?? C.backgroundColor ?? "transparent"
    }), /* @__PURE__ */ at(
      "div",
      {
        className: P,
        style: { width: $ ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", position: "relative", ...E },
        children: /* @__PURE__ */ at(
          "canvas",
          {
            ref: c,
            "aria-hidden": "true",
            role: "presentation",
            style: { display: "block", position: "absolute", inset: 0, pointerEvents: "none" }
          }
        )
      }
    );
  }
);
xo.displayName = "GlitchOverlay";
function Ro(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0), r = (s) => {
    const m = Array.isArray(s) ? s : [s], { series: e, maxPoints: t } = o.current;
    m.forEach((u, g) => {
      e[g] && (e[g].data.push(u), e[g].data.length > t && e[g].data.shift());
    });
  };
  return dt(() => {
    const s = n.current;
    if (!s) return;
    const m = s.parentElement;
    if (!m) return;
    const e = s.getContext("2d");
    let t = 0, u = 0;
    function g(I, $) {
      const B = n.current, P = window.devicePixelRatio || 1;
      B.width = Math.round(I * P), B.height = Math.round($ * P), B.style.width = `${I}px`, B.style.height = `${$}px`, e.scale(P, P), t = I, u = $;
    }
    const f = new ResizeObserver((I) => {
      const { width: $, height: B } = I[0].contentRect;
      $ > 0 && B > 0 && g($, B);
    });
    f.observe(m);
    const y = m.getBoundingClientRect();
    y.width > 0 && y.height > 0 && g(y.width, y.height);
    function S() {
      const {
        series: I,
        lineWidth: $,
        showGrid: B,
        gridColor: P,
        gridOpacity: E,
        showDots: C,
        dotRadius: c,
        fillOpacity: l,
        backgroundColor: v,
        padding: R,
        yMin: x,
        yMax: F,
        smooth: M,
        glowEffect: k,
        glowBlur: L
      } = o.current;
      i.current += 0.06, e.clearRect(0, 0, t, u), v && v !== "transparent" && (e.fillStyle = v, e.fillRect(0, 0, t, u));
      const w = 36, p = R, d = p + w, b = t - d - p, A = u - p * 2 - 20, T = p;
      let D = x ?? 1 / 0, z = F ?? -1 / 0;
      if (x === void 0 || F === void 0) {
        for (const H of I)
          for (const G of H.data)
            x === void 0 && G < D && (D = G), F === void 0 && G > z && (z = G);
        D === 1 / 0 && (D = 0), z === -1 / 0 && (z = 1), D === z && (D -= 1, z += 1);
        const q = z - D;
        D -= q * 0.1, z += q * 0.1;
      }
      const O = z - D || 1, W = (q, H) => d + q / Math.max(H - 1, 1) * b, Y = (q) => T + A - (q - D) / O * A;
      if (B) {
        e.setLineDash([3, 5]), e.lineWidth = 1;
        for (let H = 0; H <= 5; H++) {
          const G = T + H / 5 * A, U = z - H / 5 * O;
          e.strokeStyle = P, e.globalAlpha = E, e.beginPath(), e.moveTo(d, G), e.lineTo(d + b, G), e.stroke(), e.globalAlpha = 0.6, e.fillStyle = P, e.font = "10px system-ui, sans-serif", e.textAlign = "right", e.textBaseline = "middle";
          const j = Math.abs(U) >= 1e3 ? (U / 1e3).toFixed(1) + "k" : U.toFixed(Math.abs(U) < 10 ? 1 : 0);
          e.fillText(j, d - 4, G);
        }
        e.setLineDash([]), e.globalAlpha = 1, e.strokeStyle = P, e.globalAlpha = E * 1.5, e.lineWidth = 1, e.beginPath(), e.moveTo(d, T), e.lineTo(d, T + A), e.lineTo(d + b, T + A), e.stroke(), e.globalAlpha = 1;
      }
      for (const q of I) {
        if (q.data.length < 2) continue;
        const H = q.data.length;
        if (e.beginPath(), M) {
          e.moveTo(W(0, H), Y(q.data[0]));
          for (let N = 1; N < H - 1; N++) {
            const K = (W(N - 1, H) + W(N, H)) / 2, Z = (Y(q.data[N - 1]) + Y(q.data[N])) / 2;
            e.quadraticCurveTo(W(N - 1, H), Y(q.data[N - 1]), K, Z);
          }
          e.lineTo(W(H - 1, H), Y(q.data[H - 1]));
        } else {
          e.moveTo(W(0, H), Y(q.data[0]));
          for (let N = 1; N < H; N++) e.lineTo(W(N, H), Y(q.data[N]));
        }
        if (k && (e.shadowColor = q.color, e.shadowBlur = L), e.strokeStyle = q.color, e.lineWidth = $, e.lineJoin = "round", e.lineCap = "round", e.stroke(), e.shadowBlur = 0, q.filled !== !1) {
          const N = new Path2D();
          if (M) {
            N.moveTo(W(0, H), Y(q.data[0]));
            for (let Z = 1; Z < H - 1; Z++) {
              const nt = (W(Z - 1, H) + W(Z, H)) / 2, rt = (Y(q.data[Z - 1]) + Y(q.data[Z])) / 2;
              N.quadraticCurveTo(W(Z - 1, H), Y(q.data[Z - 1]), nt, rt);
            }
            N.lineTo(W(H - 1, H), Y(q.data[H - 1]));
          } else {
            N.moveTo(W(0, H), Y(q.data[0]));
            for (let Z = 1; Z < H; Z++) N.lineTo(W(Z, H), Y(q.data[Z]));
          }
          N.lineTo(W(H - 1, H), T + A), N.lineTo(W(0, H), T + A), N.closePath(), e.save(), e.beginPath(), e.rect(d, T, b, A), e.clip();
          const K = e.createLinearGradient(0, T, 0, T + A);
          K.addColorStop(0, q.color + "88"), K.addColorStop(0.5, q.color + "33"), K.addColorStop(1, q.color + "00"), e.fillStyle = K, e.globalAlpha = l, e.fill(N), e.globalAlpha = 1, e.restore();
        }
        if (C && H > 1) {
          for (let N = 0; N < H - 1; N++)
            e.beginPath(), e.arc(W(N, H), Y(q.data[N]), c * 0.6, 0, Math.PI * 2), e.fillStyle = q.color, e.globalAlpha = 0.4, e.fill();
          e.globalAlpha = 1;
        }
        const G = W(H - 1, H), U = Y(q.data[H - 1]), j = Math.sin(i.current) * 0.5 + 0.5;
        k && (e.shadowColor = q.color, e.shadowBlur = L * 0.8), e.beginPath(), e.arc(G, U, c * (1.5 + j * 1.5), 0, Math.PI * 2), e.strokeStyle = q.color, e.lineWidth = 1, e.globalAlpha = 0.6 * (1 - j), e.stroke(), e.shadowBlur = 0, e.globalAlpha = 1, e.beginPath(), e.arc(G, U, c, 0, Math.PI * 2), e.fillStyle = "#ffffff", e.globalAlpha = 0.9, e.fill(), e.beginPath(), e.arc(G, U, c * 0.6, 0, Math.PI * 2), e.fillStyle = q.color, e.globalAlpha = 1, e.fill(), q.label && (e.font = "bold 11px system-ui, sans-serif", e.fillStyle = q.color, e.textAlign = "left", e.textBaseline = "bottom", e.globalAlpha = 0.85, e.fillText(q.label, G + c + 3, U - 2), e.globalAlpha = 1);
      }
      a.current = requestAnimationFrame(S);
    }
    return a.current = requestAnimationFrame(S), () => {
      f.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]), { push: r };
}
const So = {
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
}, ko = ht(
  (n, h) => {
    const {
      preset: o,
      series: a,
      maxPoints: i,
      animated: r,
      lineWidth: s,
      showGrid: m,
      gridColor: e,
      gridOpacity: t,
      showDots: u,
      dotRadius: g,
      fillOpacity: f,
      backgroundColor: y,
      padding: S,
      yMin: I,
      yMax: $,
      smooth: B,
      glowEffect: P,
      glowBlur: E,
      scrollSpeed: C,
      width: c,
      height: l,
      className: v,
      style: R
    } = n, x = o && So[o] || {}, F = [
      { data: Array.from({ length: 30 }, (k, L) => Math.sin(L * 0.3) * 50 + 50), color: "#ffffff", filled: !0 },
      { data: Array.from({ length: 30 }, (k, L) => Math.cos(L * 0.4) * 30 + 50), color: "#6b7280", filled: !0 }
    ], M = X(null);
    return gt(h, () => M.current), Ro(M, {
      series: a ?? F,
      maxPoints: i ?? 100,
      animated: r ?? !0,
      lineWidth: s ?? x.lineWidth ?? 2,
      showGrid: m ?? x.showGrid ?? !0,
      gridColor: e ?? x.gridColor ?? "#ffffff",
      gridOpacity: t ?? x.gridOpacity ?? 0.08,
      showDots: u ?? x.showDots ?? !1,
      dotRadius: g ?? 3,
      fillOpacity: f ?? x.fillOpacity ?? 1,
      backgroundColor: y ?? x.backgroundColor ?? "#111111",
      padding: S ?? 20,
      yMin: I,
      yMax: $,
      smooth: B ?? x.smooth ?? !0,
      glowEffect: P ?? x.glowEffect ?? !0,
      glowBlur: E ?? x.glowBlur ?? 8,
      scrollSpeed: C ?? 1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: v,
        style: { width: c ?? "100%", height: l ?? "100%", display: "block", overflow: "hidden", ...R },
        children: /* @__PURE__ */ at("canvas", { ref: M, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
ko.displayName = "LiveChart";
function Eo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0);
  dt(() => {
    const r = n.current;
    if (!r) return;
    const s = r.parentElement;
    if (!s) return;
    const m = r.getContext("2d");
    let e = 0, t = 0;
    function u(I, $) {
      const B = n.current, P = window.devicePixelRatio || 1;
      B.width = Math.round(I * P), B.height = Math.round($ * P), B.style.width = `${I}px`, B.style.height = `${$}px`, m.scale(P, P), e = I, t = $;
    }
    const g = new ResizeObserver((I) => {
      const { width: $, height: B } = I[0].contentRect;
      $ > 0 && B > 0 && u($, B);
    });
    g.observe(s);
    const f = s.getBoundingClientRect();
    f.width > 0 && f.height > 0 && u(f.width, f.height);
    function y(I, $, B, P, E, C, c, l, v, R, x, F, M) {
      const k = 6 + P * 2, L = P / 8 * Math.PI * 2, w = E * (1 + P * 0.15);
      for (let p = 0; p < c; p++) {
        const d = p / c * Math.PI * 2;
        for (let b = 0; b < (l ? 2 : 1); b++) {
          m.save(), m.translate(I, $), m.rotate(d + (b === 1 ? Math.PI / c : 0)), b === 1 && m.scale(1, -1), m.beginPath();
          for (let A = 0; A <= k * 3; A++) {
            const T = A / (k * 3) * Math.PI * 2, D = M * Math.sin(T * 3 + w + L), z = B * (0.5 + 0.5 * Math.abs(Math.sin(T * (k / 2) + w * 0.5))), O = (z + D * B * 0.15) * Math.cos(T), W = (z + D * B * 0.1) * Math.sin(T);
            A === 0 ? m.moveTo(O, W) : m.lineTo(O, W);
          }
          m.closePath(), R && (m.shadowColor = C, m.shadowBlur = x), m.strokeStyle = C, m.lineWidth = v * (1 - P * 0.08), m.globalAlpha = F * (1 - P * 0.1), m.stroke(), m.shadowBlur = 0, m.globalAlpha = 1, m.restore();
        }
      }
    }
    function S() {
      const {
        symmetry: I,
        colors: $,
        lineWidth: B,
        speed: P,
        layers: E,
        radius: C,
        backgroundColor: c,
        animated: l,
        glowEffect: v,
        glowBlur: R,
        strokeOpacity: x,
        mirror: F,
        noiseAmount: M
      } = o.current;
      l && (i.current += P * 5e-3);
      const k = i.current;
      m.clearRect(0, 0, e, t), c && c !== "transparent" && (m.fillStyle = c, m.fillRect(0, 0, e, t));
      const L = e / 2, w = t / 2, p = Math.min(e, t) * 0.45 * C;
      for (let d = 0; d < E; d++) {
        const b = p * (1 - d * (0.85 / E)), A = $[d % $.length];
        y(L, w, b, d, k + d * 0.3, A, I, F, B, v, R, x, M);
      }
      a.current = requestAnimationFrame(S);
    }
    return a.current = requestAnimationFrame(S), () => {
      g.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      symmetry: a,
      colors: i,
      lineWidth: r,
      speed: s,
      layers: m,
      radius: e,
      backgroundColor: t,
      animated: u,
      glowEffect: g,
      glowBlur: f,
      strokeOpacity: y,
      mirror: S,
      noiseAmount: I,
      width: $,
      height: B,
      className: P,
      style: E
    } = n, C = o && Ao[o] || {}, c = X(null);
    return gt(h, () => c.current), Eo(c, {
      symmetry: a ?? C.symmetry ?? 8,
      colors: i ?? C.colors ?? ["#ffffff", "#6b7280"],
      lineWidth: r ?? C.lineWidth ?? 1.5,
      speed: s ?? C.speed ?? 1,
      layers: m ?? C.layers ?? 5,
      radius: e ?? 1,
      backgroundColor: t ?? C.backgroundColor ?? "#111111",
      animated: u ?? !0,
      glowEffect: g ?? C.glowEffect ?? !0,
      glowBlur: f ?? C.glowBlur ?? 10,
      strokeOpacity: y ?? C.strokeOpacity ?? 0.8,
      mirror: S ?? C.mirror ?? !0,
      noiseAmount: I ?? C.noiseAmount ?? 0.3
    }), /* @__PURE__ */ at(
      "div",
      {
        className: P,
        style: { width: $ ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", ...E },
        children: /* @__PURE__ */ at("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Bo.displayName = "Mandala";
function Fo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(null), r = X(0), s = X(0);
  dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    function f() {
      const { count: c, radius: l } = o.current;
      a.current = Array.from({ length: c }, () => {
        const v = u * 0.2 + Math.random() * u * 0.6, R = g * 0.2 + Math.random() * g * 0.6;
        return {
          x: v,
          y: R,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: l * (0.7 + Math.random() * 0.6),
          baseX: v,
          baseY: R
        };
      });
    }
    function y(c, l) {
      const v = n.current, R = window.devicePixelRatio || 1;
      v.width = Math.round(c * R), v.height = Math.round(l * R), v.style.width = `${c}px`, v.style.height = `${l}px`, t.scale(R, R), u = c, g = l, f();
    }
    const S = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && y(l, v);
    });
    S.observe(e);
    const I = e.getBoundingClientRect();
    I.width > 0 && I.height > 0 && y(I.width, I.height);
    function $(c) {
      const l = n.current.getBoundingClientRect();
      i.current = { x: c.clientX - l.left, y: c.clientY - l.top };
    }
    function B() {
      i.current = null;
    }
    e.addEventListener("mousemove", $), e.addEventListener("mouseleave", B);
    function P(c) {
      const l = c.replace("#", "").match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
      return l ? { r: parseInt(l[1], 16), g: parseInt(l[2], 16), b: parseInt(l[3], 16) } : null;
    }
    function E(c, l, v, R) {
      const x = a.current;
      if (x.length) {
        t.globalCompositeOperation = "source-over";
        for (let F = 0; F < x.length; F++) {
          const M = x[F], k = c[F % c.length], L = M.radius * l, w = P(k);
          v && (t.shadowColor = k, t.shadowBlur = R), t.globalCompositeOperation = "screen";
          const p = t.createRadialGradient(M.x, M.y, L * 0.5, M.x, M.y, L * 1.4);
          p.addColorStop(0, w ? `rgba(${w.r},${w.g},${w.b},0.18)` : k + "30"), p.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = p, t.beginPath(), t.arc(M.x, M.y, L * 1.4, 0, Math.PI * 2), t.fill();
          const d = t.createRadialGradient(
            M.x - L * 0.25,
            M.y - L * 0.25,
            0,
            // offset center for 3D feel
            M.x,
            M.y,
            L
          );
          d.addColorStop(0, w ? `rgba(${Math.min(255, w.r + 80)},${Math.min(255, w.g + 80)},${Math.min(255, w.b + 80)},0.95)` : k), d.addColorStop(0.35, w ? `rgba(${w.r},${w.g},${w.b},0.85)` : k + "d9"), d.addColorStop(0.7, w ? `rgba(${Math.max(0, w.r - 40)},${Math.max(0, w.g - 40)},${Math.max(0, w.b - 40)},0.6)` : k + "99"), d.addColorStop(1, "rgba(0,0,0,0)"), t.fillStyle = d, t.beginPath(), t.arc(M.x, M.y, L, 0, Math.PI * 2), t.fill();
          const b = M.x - L * 0.28, A = M.y - L * 0.28, T = L * 0.35, D = t.createRadialGradient(b, A, 0, b, A, T);
          D.addColorStop(0, "rgba(255,255,255,0.45)"), D.addColorStop(1, "rgba(255,255,255,0)"), t.fillStyle = D, t.beginPath(), t.arc(b, A, T, 0, Math.PI * 2), t.fill(), t.shadowBlur = 0;
        }
        t.globalCompositeOperation = "source-over";
      }
    }
    function C() {
      const {
        speed: c,
        magnetStrength: l,
        magnetRadius: v,
        threshold: R,
        colors: x,
        glowEffect: F,
        glowBlur: M,
        backgroundColor: k,
        animated: L,
        followMouse: w,
        wanderStrength: p
      } = o.current;
      L && (s.current += 0.016);
      const d = s.current;
      t.clearRect(0, 0, u, g), k && k !== "transparent" && (t.fillStyle = k, t.fillRect(0, 0, u, g));
      const b = a.current, A = i.current;
      for (let T = 0; T < b.length; T++) {
        const D = b[T], z = Math.sin(d * c * 0.5 + T * 1.3) * Math.PI * 2;
        if (D.vx += Math.cos(z) * p * 0.05, D.vy += Math.sin(z) * p * 0.05, A && w) {
          const O = A.x - D.x, W = A.y - D.y, Y = Math.sqrt(O * O + W * W) || 1;
          if (Y < v) {
            const q = (1 - Y / v) * l;
            D.vx += O / Y * q, D.vy += W / Y * q;
          }
        }
        for (let O = T + 1; O < b.length; O++) {
          const W = b[O], Y = W.x - D.x, q = W.y - D.y, H = Math.sqrt(Y * Y + q * q) || 1, G = (D.radius + W.radius) * 0.8;
          if (H < G * 2) {
            const U = 2e-3 * (1 - H / (G * 2));
            D.vx += Y / H * U, D.vy += q / H * U, W.vx -= Y / H * U, W.vy -= q / H * U;
          }
        }
        D.vx *= 0.92, D.vy *= 0.92, D.vx = Math.max(-4, Math.min(4, D.vx)), D.vy = Math.max(-4, Math.min(4, D.vy)), D.x += D.vx, D.y += D.vy, D.x < D.radius && (D.x = D.radius, D.vx *= -0.5), D.x > u - D.radius && (D.x = u - D.radius, D.vx *= -0.5), D.y < D.radius && (D.y = D.radius, D.vy *= -0.5), D.y > g - D.radius && (D.y = g - D.radius, D.vy *= -0.5);
      }
      E(x, R, F, M), r.current = requestAnimationFrame(C);
    }
    return r.current = requestAnimationFrame(C), () => {
      S.disconnect(), cancelAnimationFrame(r.current), e.removeEventListener("mousemove", $), e.removeEventListener("mouseleave", B);
    };
  }, [n]);
}
const Po = {
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
}, Io = ht(
  (n, h) => {
    const {
      preset: o,
      count: a,
      colors: i,
      radius: r,
      speed: s,
      magnetStrength: m,
      magnetRadius: e,
      threshold: t,
      glowEffect: u,
      glowBlur: g,
      backgroundColor: f,
      animated: y,
      followMouse: S,
      wanderStrength: I,
      width: $,
      height: B,
      className: P,
      style: E
    } = n, C = o && Po[o] || {}, c = X(null);
    return gt(h, () => c.current), Fo(c, {
      count: a ?? C.count ?? 5,
      colors: i ?? C.colors ?? ["#ffffff", "#6b7280"],
      radius: r ?? C.radius ?? 80,
      speed: s ?? C.speed ?? 1,
      magnetStrength: m ?? C.magnetStrength ?? 0.08,
      magnetRadius: e ?? C.magnetRadius ?? 150,
      threshold: t ?? C.threshold ?? 1.8,
      glowEffect: u ?? C.glowEffect ?? !0,
      glowBlur: g ?? C.glowBlur ?? 20,
      backgroundColor: f ?? C.backgroundColor ?? "#111111",
      animated: y ?? C.animated ?? !0,
      followMouse: S ?? C.followMouse ?? !0,
      wanderStrength: I ?? C.wanderStrength ?? 0.4
    }), /* @__PURE__ */ at(
      "div",
      {
        className: P,
        style: { width: $ ?? "100%", height: B ?? "100%", display: "block", overflow: "hidden", ...E },
        children: /* @__PURE__ */ at("canvas", { ref: c, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Io.displayName = "MagneticBlob";
function $o(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X([]), r = X(0), s = X(null), m = X(!1), e = X(0), t = X(null);
  dt(() => {
    var u;
    (u = t.current) == null || u.call(t);
  }, [h.cols, h.rows]), dt(() => {
    const u = n.current;
    if (!u) return;
    const g = u.parentElement;
    if (!g) return;
    const f = u.getContext("2d");
    let y = 0, S = 0;
    function I(R, x) {
      const { cols: F, rows: M, spacing: k } = o.current, L = (R - (F - 1) * k) / 2, w = x * 0.08, p = [], d = [];
      for (let b = 0; b < M; b++)
        for (let A = 0; A < F; A++) {
          const T = L + A * k, D = w + b * k;
          p.push({
            x: T,
            y: D,
            px: T,
            py: D,
            pinned: b === 0 && (A % Math.ceil(F / 5) === 0 || A === F - 1)
          });
          const z = b * F + A;
          A > 0 && d.push({ a: z - 1, b: z, length: k }), b > 0 && d.push({ a: z - F, b: z, length: k });
        }
      a.current = p, i.current = d;
    }
    function $(R, x) {
      const F = n.current, M = window.devicePixelRatio || 1;
      F.width = Math.round(R * M), F.height = Math.round(x * M), F.style.width = `${R}px`, F.style.height = `${x}px`, f.scale(M, M), y = R, S = x, I(y, S);
    }
    t.current = () => {
      y > 0 && S > 0 && I(y, S);
    };
    const B = new ResizeObserver((R) => {
      const { width: x, height: F } = R[0].contentRect;
      x > 0 && F > 0 && $(x, F);
    });
    B.observe(g);
    const P = g.getBoundingClientRect();
    P.width > 0 && P.height > 0 && $(P.width, P.height);
    function E(R) {
      const x = n.current.getBoundingClientRect();
      s.current = { x: R.clientX - x.left, y: R.clientY - x.top };
    }
    function C() {
      m.current = !0;
    }
    function c() {
      m.current = !1;
    }
    function l() {
      s.current = null, m.current = !1;
    }
    g.addEventListener("mousemove", E), g.addEventListener("mousedown", C), g.addEventListener("mouseup", c), g.addEventListener("mouseleave", l);
    function v() {
      const {
        gravity: R,
        friction: x,
        stiffness: F,
        iterations: M,
        lineColor: k,
        pinColor: L,
        lineWidth: w,
        backgroundColor: p,
        wind: d,
        windSpeed: b,
        tearable: A,
        tearDistance: T,
        interactive: D,
        mouseRadius: z,
        mouseForce: O,
        showPins: W
      } = o.current;
      e.current += 0.016;
      const Y = e.current;
      f.clearRect(0, 0, y, S), p && p !== "transparent" && (f.fillStyle = p, f.fillRect(0, 0, y, S));
      const q = a.current, H = s.current, G = d * Math.sin(Y * b) * 0.1;
      for (const U of q) {
        if (U.pinned) continue;
        const j = (U.x - U.px) * x, N = (U.y - U.py) * x;
        if (U.px = U.x, U.py = U.y, U.x += j + G, U.y += N + R, H && D) {
          const K = U.x - H.x, Z = U.y - H.y, nt = Math.sqrt(K * K + Z * Z) || 1;
          if (nt < z) {
            const rt = (1 - nt / z) * O;
            if (m.current)
              if (A)
                for (let st = i.current.length - 1; st >= 0; st--) {
                  const tt = i.current[st], Q = q[tt.a], _ = q[tt.b];
                  (Math.sqrt((Q.x - H.x) ** 2 + (Q.y - H.y) ** 2) < z * 0.5 || Math.sqrt((_.x - H.x) ** 2 + (_.y - H.y) ** 2) < z * 0.5) && i.current.splice(st, 1);
                }
              else
                U.x += K / nt * rt * 2, U.y += Z / nt * rt * 2;
            else
              U.x += K / nt * rt, U.y += Z / nt * rt;
          }
        }
        U.y > S && (U.y = S, U.py = U.y + N * 0.3), U.x < 0 && (U.x = 0, U.px = U.x - j * 0.3), U.x > y && (U.x = y, U.px = U.x - j * 0.3);
      }
      for (let U = 0; U < M; U++)
        for (let j = i.current.length - 1; j >= 0; j--) {
          const N = i.current[j], K = q[N.a], Z = q[N.b], nt = Z.x - K.x, rt = Z.y - K.y, st = Math.sqrt(nt * nt + rt * rt) || 1e-3;
          if (A && st > T * N.length) {
            i.current.splice(j, 1);
            continue;
          }
          const tt = (st - N.length) / st * F * 0.5, Q = nt * tt, _ = rt * tt;
          K.pinned || (K.x += Q, K.y += _), Z.pinned || (Z.x -= Q, Z.y -= _);
        }
      f.strokeStyle = k, f.lineWidth = w, f.beginPath();
      for (const U of i.current) {
        const j = q[U.a], N = q[U.b];
        f.moveTo(j.x, j.y), f.lineTo(N.x, N.y);
      }
      if (f.stroke(), W) {
        f.fillStyle = L;
        for (const U of q)
          U.pinned && (f.beginPath(), f.arc(U.x, U.y, 4, 0, Math.PI * 2), f.fill());
      }
      r.current = requestAnimationFrame(v);
    }
    return r.current = requestAnimationFrame(v), () => {
      B.disconnect(), cancelAnimationFrame(r.current), g.removeEventListener("mousemove", E), g.removeEventListener("mousedown", C), g.removeEventListener("mouseup", c), g.removeEventListener("mouseleave", l);
    };
  }, [n]);
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
}, Do = ht(
  (n, h) => {
    const {
      preset: o,
      cols: a,
      rows: i,
      spacing: r,
      gravity: s,
      friction: m,
      stiffness: e,
      iterations: t,
      lineColor: u,
      pinColor: g,
      lineWidth: f,
      backgroundColor: y,
      wind: S,
      windSpeed: I,
      tearable: $,
      tearDistance: B,
      interactive: P,
      mouseRadius: E,
      mouseForce: C,
      showPins: c,
      width: l,
      height: v,
      className: R,
      style: x
    } = n, F = o && Lo[o] || {}, M = X(null);
    return gt(h, () => M.current), $o(M, {
      cols: a ?? F.cols ?? 25,
      rows: i ?? F.rows ?? 20,
      spacing: r ?? F.spacing ?? 18,
      gravity: s ?? F.gravity ?? 0.4,
      friction: m ?? F.friction ?? 0.99,
      stiffness: e ?? F.stiffness ?? 1,
      iterations: t ?? F.iterations ?? 3,
      lineColor: u ?? F.lineColor ?? "#6b7280",
      pinColor: g ?? F.pinColor ?? "#ffffff",
      lineWidth: f ?? F.lineWidth ?? 1,
      backgroundColor: y ?? F.backgroundColor ?? "#111111",
      wind: S ?? F.wind ?? 0.3,
      windSpeed: I ?? F.windSpeed ?? 0.5,
      tearable: $ ?? F.tearable ?? !1,
      tearDistance: B ?? F.tearDistance ?? 3,
      interactive: P ?? !0,
      mouseRadius: E ?? 30,
      mouseForce: C ?? 5,
      showPins: c ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: R,
        style: { width: l ?? "100%", height: v ?? "100%", display: "block", overflow: "hidden", ...x },
        children: /* @__PURE__ */ at("canvas", { ref: M, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
      }
    );
  }
);
Do.displayName = "ClothSimulation";
function ut(n, h, o) {
  return Math.min(n, o - 1) + Math.min(h, o - 1) * o;
}
function Zt(n, h, o, a, i, r) {
  const s = r * i * n * n, m = 1 + 4 * s;
  for (let e = 0; e < 4; e++) {
    for (let t = 1; t < n - 1; t++)
      for (let u = 1; u < n - 1; u++)
        o[ut(u, t, n)] = (a[ut(u, t, n)] + s * (o[ut(u - 1, t, n)] + o[ut(u + 1, t, n)] + o[ut(u, t - 1, n)] + o[ut(u, t + 1, n)])) / m;
    Ft(n, h, o);
  }
}
function te(n, h, o, a, i, r, s) {
  const m = s * n;
  for (let e = 1; e < n - 1; e++)
    for (let t = 1; t < n - 1; t++) {
      let u = t - m * i[ut(t, e, n)], g = e - m * r[ut(t, e, n)];
      u = Math.max(0.5, Math.min(n - 1.5, u)), g = Math.max(0.5, Math.min(n - 1.5, g));
      const f = Math.floor(u), y = f + 1, S = Math.floor(g), I = S + 1, $ = u - f, B = 1 - $, P = g - S, E = 1 - P;
      o[ut(t, e, n)] = B * (E * a[ut(f, S, n)] + P * a[ut(f, I, n)]) + $ * (E * a[ut(y, S, n)] + P * a[ut(y, I, n)]);
    }
  Ft(n, h, o);
}
function fe(n, h, o, a, i) {
  const r = 1 / n;
  for (let s = 1; s < n - 1; s++)
    for (let m = 1; m < n - 1; m++)
      i[ut(m, s, n)] = -0.5 * r * (h[ut(m + 1, s, n)] - h[ut(m - 1, s, n)] + o[ut(m, s + 1, n)] - o[ut(m, s - 1, n)]), a[ut(m, s, n)] = 0;
  Ft(n, 0, i), Ft(n, 0, a);
  for (let s = 0; s < 4; s++) {
    for (let m = 1; m < n - 1; m++)
      for (let e = 1; e < n - 1; e++)
        a[ut(e, m, n)] = (i[ut(e, m, n)] + a[ut(e - 1, m, n)] + a[ut(e + 1, m, n)] + a[ut(e, m - 1, n)] + a[ut(e, m + 1, n)]) / 4;
    Ft(n, 0, a);
  }
  for (let s = 1; s < n - 1; s++)
    for (let m = 1; m < n - 1; m++)
      h[ut(m, s, n)] -= 0.5 * (a[ut(m + 1, s, n)] - a[ut(m - 1, s, n)]) / r, o[ut(m, s, n)] -= 0.5 * (a[ut(m, s + 1, n)] - a[ut(m, s - 1, n)]) / r;
  Ft(n, 1, h), Ft(n, 2, o);
}
function Ft(n, h, o) {
  for (let a = 1; a < n - 1; a++)
    o[ut(0, a, n)] = h === 1 ? -o[ut(1, a, n)] : o[ut(1, a, n)], o[ut(n - 1, a, n)] = h === 1 ? -o[ut(n - 2, a, n)] : o[ut(n - 2, a, n)], o[ut(a, 0, n)] = h === 2 ? -o[ut(a, 1, n)] : o[ut(a, 1, n)], o[ut(a, n - 1, n)] = h === 2 ? -o[ut(a, n - 2, n)] : o[ut(a, n - 2, n)];
  o[ut(0, 0, n)] = 0.5 * (o[ut(1, 0, n)] + o[ut(0, 1, n)]), o[ut(n - 1, 0, n)] = 0.5 * (o[ut(n - 2, 0, n)] + o[ut(n - 1, 1, n)]), o[ut(0, n - 1, n)] = 0.5 * (o[ut(1, n - 1, n)] + o[ut(0, n - 2, n)]), o[ut(n - 1, n - 1, n)] = 0.5 * (o[ut(n - 2, n - 1, n)] + o[ut(n - 1, n - 2, n)]);
}
function To(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null), r = X(null), s = X(0);
  dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    const f = Math.max(32, Math.min(128, h.resolution)), y = f * f;
    let S = new Float32Array(y), I = new Float32Array(y), $ = new Float32Array(y), B = new Float32Array(y), P = new Float32Array(y), E = new Float32Array(y), C = new Float32Array(y), c = new Float32Array(y), l = new Float32Array(y), v = new Float32Array(y), R = new Float32Array(y), x = new Float32Array(y), F = null;
    const M = document.createElement("canvas");
    M.width = f, M.height = f;
    const k = M.getContext("2d");
    function L(z, O) {
      const W = n.current, Y = window.devicePixelRatio || 1;
      W.width = Math.round(z * Y), W.height = Math.round(O * Y), W.style.width = `${z}px`, W.style.height = `${O}px`, t.scale(Y, Y), t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", u = z, g = O, F = k.createImageData(f, f);
    }
    const w = new ResizeObserver((z) => {
      const { width: O, height: W } = z[0].contentRect;
      O > 0 && W > 0 && L(O, W);
    });
    w.observe(e);
    const p = e.getBoundingClientRect();
    p.width > 0 && p.height > 0 && L(p.width, p.height);
    function d(z, O, W, Y, q, H, G, U, j) {
      const N = Math.max(1, Math.floor(j));
      for (let K = -N; K <= N; K++)
        for (let Z = -N; Z <= N; Z++) {
          const nt = z + Z, rt = O + K;
          if (nt < 1 || nt >= f - 1 || rt < 1 || rt >= f - 1) continue;
          const st = Math.sqrt(Z * Z + K * K);
          if (st > N) continue;
          const tt = 1 - st / N, Q = ut(nt, rt, f);
          P[Q] += q * tt, E[Q] += H * tt, C[Q] += G * tt, S[Q] += W * U * tt, I[Q] += Y * U * tt;
        }
    }
    function b(z) {
      const O = n.current.getBoundingClientRect(), W = z.clientX - O.left, Y = z.clientY - O.top, q = i.current;
      i.current = {
        x: W,
        y: Y,
        px: q ? q.x : W,
        py: q ? q.y : Y
      };
    }
    function A() {
      i.current = null;
    }
    e.addEventListener("mousemove", b), e.addEventListener("mouseleave", A);
    function T() {
      const { autoInk: z, autoInkInterval: O } = o.current;
      z && (r.current = setTimeout(() => {
        const { inkColors: W } = o.current, Y = W[s.current % W.length];
        s.current++;
        const q = St(Y).split(",").map(Number), H = Math.floor(f * 0.2 + Math.random() * f * 0.6), G = Math.floor(f * 0.2 + Math.random() * f * 0.6), U = Math.random() * Math.PI * 2;
        d(H, G, Math.cos(U) * 2, Math.sin(U) * 2, q[0] / 255, q[1] / 255, q[2] / 255, 3, 3), T();
      }, O * (0.6 + Math.random() * 0.8)));
    }
    T();
    function D() {
      const { viscosity: z, diffusion: O, dissipation: W, inkColors: Y, backgroundColor: q, mouseForce: H, inkRadius: G } = o.current, U = 0.016, j = i.current;
      if (j) {
        const K = Math.floor(j.x / u * f), Z = Math.floor(j.y / g * f), nt = (j.x - j.px) * 0.5, rt = (j.y - j.py) * 0.5, st = Y[s.current % Y.length], tt = St(st).split(",").map(Number);
        d(K, Z, nt, rt, tt[0] / 255, tt[1] / 255, tt[2] / 255, H, G), Math.abs(nt) + Math.abs(rt) > 0.5 && s.current++, j.px = j.x, j.py = j.y;
      }
      $.set(S), B.set(I), Zt(f, 1, S, $, z, U), Zt(f, 2, I, B, z, U), fe(f, S, I, R, x), $.set(S), B.set(I), te(f, 1, S, $, $, B, U), te(f, 2, I, B, $, B, U), fe(f, S, I, R, x);
      for (const [K, Z] of [[P, c], [E, l], [C, v]]) {
        Z.set(K), Zt(f, 0, K, Z, O, U), Z.set(K), te(f, 0, K, Z, S, I, U);
        for (let nt = 0; nt < y; nt++)
          K[nt] = Math.max(0, K[nt] * W), Z[nt] = 0;
      }
      for (let K = 0; K < y; K++)
        $[K] = 0, B[K] = 0;
      if (!F) {
        a.current = requestAnimationFrame(D);
        return;
      }
      const N = F.data;
      for (let K = 0; K < f; K++)
        for (let Z = 0; Z < f; Z++) {
          const nt = ut(Z, K, f), rt = (K * f + Z) * 4;
          N[rt] = Math.min(255, P[nt] * 255), N[rt + 1] = Math.min(255, E[nt] * 255), N[rt + 2] = Math.min(255, C[nt] * 255), N[rt + 3] = Math.min(255, (P[nt] + E[nt] + C[nt]) * 200);
        }
      t.clearRect(0, 0, u, g), q && q !== "transparent" && (t.fillStyle = q, t.fillRect(0, 0, u, g)), k.putImageData(F, 0, 0), t.drawImage(M, 0, 0, u, g), a.current = requestAnimationFrame(D);
    }
    return a.current = requestAnimationFrame(D), () => {
      w.disconnect(), cancelAnimationFrame(a.current), e.removeEventListener("mousemove", b), e.removeEventListener("mouseleave", A), r.current && clearTimeout(r.current);
    };
  }, [n, h.resolution]);
}
const zo = {
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
  (n, h) => {
    const {
      preset: o,
      resolution: a,
      viscosity: i,
      diffusion: r,
      dissipation: s,
      inkColors: m,
      glowEffect: e,
      glowBlur: t,
      backgroundColor: u,
      autoInk: g,
      autoInkInterval: f,
      mouseForce: y,
      inkRadius: S,
      width: I,
      height: $,
      className: B,
      style: P
    } = n, E = o && zo[o] || {}, C = X(null);
    return gt(h, () => C.current), To(C, {
      resolution: a ?? E.resolution ?? 128,
      viscosity: i ?? E.viscosity ?? 1e-4,
      diffusion: r ?? E.diffusion ?? 1e-4,
      dissipation: s ?? E.dissipation ?? 0.995,
      inkColors: m ?? E.inkColors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      glowEffect: e ?? E.glowEffect ?? !0,
      glowBlur: t ?? E.glowBlur ?? 0,
      backgroundColor: u ?? E.backgroundColor ?? "#111111",
      autoInk: g ?? E.autoInk ?? !0,
      autoInkInterval: f ?? E.autoInkInterval ?? 1500,
      mouseForce: y ?? E.mouseForce ?? 5,
      inkRadius: S ?? E.inkRadius ?? 4
    }), /* @__PURE__ */ at(
      "div",
      {
        className: B,
        style: { width: I ?? "100%", height: $ ?? "100%", display: "block", overflow: "hidden", ...P },
        children: /* @__PURE__ */ at("canvas", { ref: C, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
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
function Oo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X([]), r = X(0), s = X(0), m = X(null);
  dt(() => {
    var e;
    (e = m.current) == null || e.call(m);
  }, [h.dropCount]), dt(() => {
    const e = n.current;
    if (!e) return;
    const t = e.parentElement;
    if (!t) return;
    const u = e.getContext("2d");
    let g = 0, f = 0;
    function y(E = !1) {
      const { speed: C, dropLength: c, dropOpacity: l, dropWidth: v } = o.current, R = Math.floor(Math.random() * 3), [x, F, M] = Wo[R];
      return {
        x: Math.random() * (g + 100) - 50,
        y: E ? Math.random() * f : -c * 2 - Math.random() * f * 0.5,
        speed: C * x * (0.7 + Math.random() * 0.6),
        length: c * M * (0.6 + Math.random() * 0.8),
        opacity: l * F * (0.5 + Math.random() * 0.5),
        width: v * M * (0.5 + Math.random() * 0.8),
        windJitter: (Math.random() - 0.5) * 0.6,
        layer: R
      };
    }
    function S() {
      a.current = Array.from({ length: o.current.dropCount }, () => y(!0)), i.current = [];
    }
    function I(E, C) {
      const c = window.devicePixelRatio || 1;
      e.width = Math.round(E * c), e.height = Math.round(C * c), e.style.width = `${E}px`, e.style.height = `${C}px`, u.scale(c, c), g = E, f = C, S();
    }
    m.current = () => {
      g > 0 && f > 0 && S();
    };
    const $ = new ResizeObserver((E) => {
      const { width: C, height: c } = E[0].contentRect;
      C > 0 && c > 0 && I(C, c);
    });
    $.observe(t);
    const B = t.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P() {
      const { wind: E, windSpeed: C, dropColor: c, splashColor: l, showSplashes: v, backgroundColor: R } = o.current;
      s.current += 0.016;
      const x = s.current, F = E * (Math.sin(x * C) * 0.7 + Math.sin(x * C * 0.37) * 0.3);
      !R || R === "transparent" ? u.clearRect(0, 0, g, f) : (u.fillStyle = R, u.fillRect(0, 0, g, f));
      const M = St(c), k = St(l), L = a.current;
      for (let p = 0; p < 3; p++)
        for (let d = 0; d < L.length; d++) {
          const b = L[d];
          if (b.layer !== p) continue;
          const A = F + b.windJitter;
          b.x += A, b.y += b.speed;
          const T = Math.sqrt(A * A + b.speed * b.speed) || 1, D = b.x - A / T * b.length, z = b.y - b.speed / T * b.length, O = u.createLinearGradient(D, z, b.x, b.y);
          O.addColorStop(0, `rgba(${M},0)`), O.addColorStop(1, `rgba(${M},${b.opacity})`), u.beginPath(), u.moveTo(D, z), u.lineTo(b.x, b.y), u.strokeStyle = O, u.lineWidth = b.width, u.lineCap = "round", u.stroke(), b.y > f + b.length && (v && i.current.push({
            x: b.x,
            y: f,
            r: 0,
            maxR: 8 + Math.random() * 12,
            life: 0,
            maxLife: 25 + Math.floor(Math.random() * 25)
          }), L[d] = y()), b.x > g + 60 && (b.x -= g + 120), b.x < -60 && (b.x += g + 120);
        }
      const w = i.current;
      for (let p = w.length - 1; p >= 0; p--) {
        const d = w[p];
        d.life++, d.r = d.life / d.maxLife * d.maxR;
        const b = (1 - d.life / d.maxLife) * 0.75;
        if (b <= 0 || d.life >= d.maxLife) {
          w.splice(p, 1);
          continue;
        }
        u.save(), u.translate(d.x, d.y), u.scale(1.6, 0.35), u.beginPath(), u.arc(0, 0, d.r, 0, Math.PI * 2), u.strokeStyle = `rgba(${k},${b})`, u.lineWidth = 1.2, u.stroke(), u.restore();
      }
      r.current = requestAnimationFrame(P);
    }
    return r.current = requestAnimationFrame(P), () => {
      $.disconnect(), cancelAnimationFrame(r.current);
    };
  }, [n]);
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
}, Yo = ht((n, h) => {
  const {
    preset: o,
    dropCount: a,
    speed: i,
    wind: r,
    windSpeed: s,
    dropLength: m,
    dropWidth: e,
    dropOpacity: t,
    dropColor: u,
    splashColor: g,
    showSplashes: f,
    backgroundColor: y,
    width: S,
    height: I,
    className: $,
    style: B
  } = n, P = o && Xo[o] || {}, E = X(null);
  return gt(h, () => E.current), Oo(E, {
    dropCount: a ?? P.dropCount ?? 200,
    speed: i ?? P.speed ?? 15,
    wind: r ?? P.wind ?? 0.3,
    windSpeed: s ?? P.windSpeed ?? 0.5,
    dropLength: m ?? P.dropLength ?? 28,
    dropWidth: e ?? P.dropWidth ?? 1.5,
    dropOpacity: t ?? P.dropOpacity ?? 0.85,
    dropColor: u ?? P.dropColor ?? "#000000",
    splashColor: g ?? P.splashColor ?? "#000000",
    showSplashes: f ?? P.showSplashes ?? !0,
    backgroundColor: y ?? P.backgroundColor ?? "#ffffff"
  }), /* @__PURE__ */ at(
    "div",
    {
      className: $,
      style: { width: S ?? "100%", height: I ?? "100%", display: "block", overflow: "hidden", ...B },
      children: /* @__PURE__ */ at("canvas", { ref: E, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Yo.displayName = "Rain";
function Vt(n, h, o, a, i, r, s) {
  if (i <= 0) {
    s.push({ x: o, y: a });
    return;
  }
  const m = Math.hypot(o - n, a - h), e = (n + o) / 2 + (Math.random() - 0.5) * r * m * 0.5, t = (h + a) / 2 + (Math.random() - 0.5) * r * m * 0.1;
  Vt(n, h, e, t, i - 1, r, s), Vt(e, t, o, a, i - 1, r, s);
}
function Go(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X(null), s = X(0);
  dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    function f(C, c) {
      const l = window.devicePixelRatio || 1;
      m.width = Math.round(C * l), m.height = Math.round(c * l), m.style.width = `${C}px`, m.style.height = `${c}px`, t.scale(l, l), u = C, g = c;
    }
    const y = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && f(c, l);
    });
    y.observe(e);
    const S = e.getBoundingClientRect();
    S.width > 0 && S.height > 0 && f(S.width, S.height);
    function I(C) {
      const { glowBlur: c, color: l, coreColor: v } = o.current, R = C.points;
      if (R.length < 2 || C.alpha <= 0) return;
      const x = C.alpha * C.energy;
      t.lineCap = "round", t.lineJoin = "round", t.shadowBlur = 0, t.globalAlpha = x * 0.3, t.strokeStyle = l, t.lineWidth = 6 * C.energy, t.filter = `blur(${Math.round(c * 0.6)}px)`, t.beginPath(), t.moveTo(R[0].x, R[0].y);
      for (let F = 1; F < R.length; F++) t.lineTo(R[F].x, R[F].y);
      t.stroke(), t.filter = "none", t.globalAlpha = x * 0.6, t.strokeStyle = l, t.lineWidth = 2.5 * C.energy, t.shadowColor = l, t.shadowBlur = c * C.energy, t.beginPath(), t.moveTo(R[0].x, R[0].y);
      for (let F = 1; F < R.length; F++) t.lineTo(R[F].x, R[F].y);
      t.stroke(), t.globalAlpha = x * 0.9, t.strokeStyle = v, t.lineWidth = 0.8 * C.energy, t.shadowBlur = 0, t.beginPath(), t.moveTo(R[0].x, R[0].y);
      for (let F = 1; F < R.length; F++) t.lineTo(R[F].x, R[F].y);
      t.stroke(), t.globalAlpha = 1, t.shadowBlur = 0;
    }
    function $(C, c) {
      const { segments: l, roughness: v, branchChance: R, branchDecay: x, flickerCount: F } = o.current, { startX: M, startY: k, endY: L } = o.current, w = C !== void 0 ? C : M * u, p = k * g, d = w + (Math.random() - 0.5) * u * 0.2, b = c !== void 0 ? c : L * g, A = [];
      function T(D, z, O, W, Y) {
        const q = [{ x: D, y: z }];
        Vt(D, z, O, W, l, v, q), A.push({ points: q, energy: Y, alpha: 1 });
        for (let H = 2; H < q.length - 1; H++) {
          if (Math.random() >= R) continue;
          const G = (Math.random() - 0.5) * Math.PI * 0.65, U = (b - q[H].y) * (0.25 + Math.random() * 0.4), j = q[H].x + Math.sin(G) * U, N = q[H].y + Math.cos(G) * Math.abs(U), K = [{ x: q[H].x, y: q[H].y }];
          Vt(q[H].x, q[H].y, j, N, Math.max(2, l - 2), v * 0.8, K), A.push({ points: K, energy: Y * x, alpha: 1 });
        }
      }
      for (let D = 0; D < F; D++)
        T(
          w + (Math.random() - 0.5) * 4,
          p,
          d + (Math.random() - 0.5) * 8,
          b,
          1
        );
      a.current = A, s.current = 0.35;
    }
    function B() {
      const { autoInterval: C } = o.current;
      r.current = setTimeout(() => {
        $(), B();
      }, C * (0.5 + Math.random()));
    }
    B(), $();
    function P(C) {
      if (!o.current.interactive) return;
      const c = m.getBoundingClientRect();
      $(C.clientX - c.left, C.clientY - c.top);
    }
    m.addEventListener("click", P);
    function E() {
      const { backgroundColor: C } = o.current;
      !C || C === "transparent" ? t.clearRect(0, 0, u, g) : (t.fillStyle = C, t.fillRect(0, 0, u, g));
      const c = a.current;
      let l = !1;
      for (const v of c)
        v.alpha *= 0.82, v.alpha > 0.01 && (l = !0, I(v));
      l || (a.current = []), s.current > 5e-3 && (t.globalAlpha = s.current, t.fillStyle = "#ffffff", t.fillRect(0, 0, u, g), t.globalAlpha = 1, s.current *= 0.55), i.current = requestAnimationFrame(E);
    }
    return i.current = requestAnimationFrame(E), () => {
      y.disconnect(), cancelAnimationFrame(i.current), r.current && clearTimeout(r.current), m.removeEventListener("click", P);
    };
  }, [n]);
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
}, No = ht((n, h) => {
  const {
    preset: o,
    segments: a,
    roughness: i,
    branchChance: r,
    branchDecay: s,
    flickerCount: m,
    glowBlur: e,
    color: t,
    coreColor: u,
    backgroundColor: g,
    autoInterval: f,
    interactive: y,
    startX: S,
    startY: I,
    endY: $,
    width: B,
    height: P,
    className: E,
    style: C
  } = n, c = o && Ho[o] || {}, l = X(null);
  return gt(h, () => l.current), Go(l, {
    segments: a ?? c.segments ?? 8,
    roughness: i ?? c.roughness ?? 0.5,
    branchChance: r ?? c.branchChance ?? 0.1,
    branchDecay: s ?? c.branchDecay ?? 0.6,
    flickerCount: m ?? c.flickerCount ?? 3,
    glowBlur: e ?? c.glowBlur ?? 20,
    color: t ?? c.color ?? "#6b7280",
    coreColor: u ?? c.coreColor ?? "#ffffff",
    backgroundColor: g ?? c.backgroundColor ?? "#111111",
    autoInterval: f ?? c.autoInterval ?? 2e3,
    interactive: y ?? c.interactive ?? !0,
    startX: S ?? c.startX ?? 0.5,
    startY: I ?? c.startY ?? 0,
    endY: $ ?? c.endY ?? 1
  }), /* @__PURE__ */ at(
    "div",
    {
      className: E,
      style: { width: B ?? "100%", height: P ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...C },
      children: /* @__PURE__ */ at("canvas", { ref: l, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
No.displayName = "Lightning";
function Uo(n, h, o) {
  const a = X(h);
  a.current = h;
  const i = X(0), r = X(new Uint16Array(0)), s = X(new Uint16Array(0)), m = X(0), e = X(0), t = X(!1), u = X(0);
  dt(() => {
    const g = n.current;
    if (!g) return;
    const f = g.parentElement;
    if (!f) return;
    const y = g.getContext("2d");
    let S = 0, I = 0;
    function $(v = !0) {
      const { cellSize: R, initialDensity: x } = a.current, F = Math.floor(S / R), M = Math.floor(I / R);
      if (m.current = F, e.current = M, r.current = new Uint16Array(F * M), s.current = new Uint16Array(F * M), v)
        for (let k = 0; k < r.current.length; k++)
          r.current[k] = Math.random() < x ? 1 : 0;
    }
    function B(v, R) {
      const x = n.current, F = window.devicePixelRatio || 1;
      x.width = Math.round(v * F), x.height = Math.round(R * F), x.style.width = `${v}px`, x.style.height = `${R}px`, y.scale(F, F), S = v, I = R, $(!0);
    }
    const P = new ResizeObserver((v) => {
      const { width: R, height: x } = v[0].contentRect;
      R > 0 && x > 0 && B(R, x);
    });
    P.observe(f);
    const E = f.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height), o && (o.current = {
      randomize: () => $(!0),
      clear: () => {
        r.current.fill(0);
      },
      pause: () => {
        t.current = !0;
      },
      resume: () => {
        t.current = !1;
      }
    });
    function C() {
      const v = m.current, R = e.current, x = r.current, F = s.current, { wrapEdges: M } = a.current;
      for (let k = 0; k < R; k++)
        for (let L = 0; L < v; L++) {
          let w = 0;
          for (let b = -1; b <= 1; b++)
            for (let A = -1; A <= 1; A++) {
              if (b === 0 && A === 0) continue;
              let T = k + b, D = L + A;
              if (M)
                T = (T + R) % R, D = (D + v) % v;
              else if (T < 0 || T >= R || D < 0 || D >= v) continue;
              x[T * v + D] > 0 && w++;
            }
          const p = k * v + L, d = x[p] > 0;
          d && (w === 2 || w === 3) ? F[p] = Math.min(x[p] + 1, 255) : !d && w === 3 ? F[p] = 1 : F[p] = 0;
        }
      r.current = F.slice();
    }
    function c(v) {
      const { cellSize: R, speed: x, aliveColor: F, oldColor: M, deadColor: k, showAge: L, backgroundColor: w } = a.current;
      if (!t.current) {
        const T = 1e3 / x;
        v - u.current >= T && (C(), u.current = v);
      }
      y.fillStyle = w, y.fillRect(0, 0, S, I);
      const p = m.current, d = e.current, b = r.current, A = 60;
      for (let T = 0; T < d; T++)
        for (let D = 0; D < p; D++) {
          const z = b[T * p + D];
          if (z === 0) continue;
          const O = L ? Math.min(z / A, 1) : 0, [W, Y, q] = yt([F, M], O);
          y.fillStyle = `rgb(${W},${Y},${q})`, y.fillRect(D * R + 0.5, T * R + 0.5, R - 1, R - 1);
        }
      i.current = requestAnimationFrame(c);
    }
    i.current = requestAnimationFrame(c);
    function l(v) {
      if (!a.current.interactive) return;
      const x = n.current.getBoundingClientRect(), F = v.clientX - x.left, M = v.clientY - x.top, { cellSize: k } = a.current, L = Math.floor(F / k), w = Math.floor(M / k), p = m.current, d = e.current;
      if (L < 0 || L >= p || w < 0 || w >= d) return;
      const b = w * p + L;
      r.current[b] = r.current[b] > 0 ? 0 : 1;
    }
    return g.addEventListener("click", l), () => {
      P.disconnect(), cancelAnimationFrame(i.current), g.removeEventListener("click", l);
    };
  }, [n, o]);
}
const jo = {
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
}, Vo = ht((n, h) => {
  const {
    preset: o,
    cellSize: a,
    speed: i,
    initialDensity: r,
    aliveColor: s,
    oldColor: m,
    deadColor: e,
    showAge: t,
    wrapEdges: u,
    interactive: g,
    backgroundColor: f,
    width: y,
    height: S,
    className: I,
    style: $
  } = n, B = o && jo[o] || {}, P = X(null), E = X(null);
  return gt(h, () => E.current), Uo(P, {
    cellSize: a ?? B.cellSize ?? 8,
    speed: i ?? B.speed ?? 10,
    initialDensity: r ?? B.initialDensity ?? 0.3,
    aliveColor: s ?? B.aliveColor ?? "#ffffff",
    oldColor: m ?? B.oldColor ?? "#6b7280",
    deadColor: e ?? B.deadColor ?? "#111111",
    showAge: t ?? B.showAge ?? !0,
    wrapEdges: u ?? B.wrapEdges ?? !0,
    interactive: g ?? B.interactive ?? !0,
    backgroundColor: f ?? B.backgroundColor ?? "#111111"
  }, E), /* @__PURE__ */ at(
    "div",
    {
      className: I,
      style: { width: y ?? "100%", height: S ?? "100%", display: "block", overflow: "hidden", cursor: "crosshair", ...$ },
      children: /* @__PURE__ */ at("canvas", { ref: P, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Vo.displayName = "GameOfLife";
function _o(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X([]), r = X(0), s = X(1), m = X(null);
  dt(() => {
    var e;
    (e = m.current) == null || e.call(m);
  }, [h.ringCount]), dt(() => {
    const e = n.current;
    if (!e) return;
    const t = e.parentElement;
    if (!t) return;
    const u = e.getContext("2d");
    let g = 0, f = 0;
    function y() {
      const { ringCount: C, starCount: c } = o.current;
      a.current = Array.from({ length: C }, (l, v) => ({
        z: v / C,
        colorIndex: v % Math.max(1, o.current.colors.length),
        rotation: v / C * Math.PI * 2
      })), i.current = Array.from({ length: c }, () => ({
        angle: Math.random() * Math.PI * 2,
        ringZ: Math.random(),
        offset: (Math.random() - 0.5) * 0.08
      }));
    }
    function S(C, c) {
      const l = n.current, v = window.devicePixelRatio || 1;
      l.width = Math.round(C * v), l.height = Math.round(c * v), l.style.width = `${C}px`, l.style.height = `${c}px`, u.scale(v, v), g = C, f = c, y();
    }
    m.current = () => {
      g > 0 && f > 0 && y();
    };
    const I = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && S(c, l);
    });
    I.observe(t);
    const $ = t.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    function B(C) {
      if (!o.current.interactive) return;
      const l = n.current.getBoundingClientRect(), v = (C.clientX - l.left) / l.width;
      s.current = 0.2 + v * 2.8;
    }
    e.addEventListener("mousemove", B);
    function P(C, c, l) {
      const { fov: v, depth: R, twist: x } = o.current, F = Math.min(g, f) * 0.45, M = v / (v + c * R), k = l + c * x * Math.PI * 2, L = g / 2 + Math.cos(C + k) * F * M, w = f / 2 + Math.sin(C + k) * F * M;
      return { px: L, py: w, scale: M };
    }
    function E() {
      const { speed: C, colors: c, backgroundColor: l, lineWidth: v, opacity: R, starColor: x } = o.current, F = a.current, M = i.current, k = C * s.current * 8e-3;
      u.fillStyle = l, u.fillRect(0, 0, g, f);
      const L = [...F].sort((w, p) => w.z - p.z);
      for (const w of L) {
        w.z += k, w.z >= 1 && (w.z -= 1, w.colorIndex = (w.colorIndex + 1) % Math.max(1, c.length)), w.rotation += k * 0.1;
        const p = 64, d = (1 - w.z) * R;
        if (d <= 0.01) continue;
        const b = c[w.colorIndex % c.length] ?? "#7C3AED", { scale: A } = P(0, w.z, w.rotation);
        u.beginPath();
        for (let T = 0; T <= p; T++) {
          const D = T / p * Math.PI * 2, { px: z, py: O } = P(D, w.z, w.rotation);
          T === 0 ? u.moveTo(z, O) : u.lineTo(z, O);
        }
        u.closePath(), u.strokeStyle = b, u.globalAlpha = d, u.lineWidth = v * A, u.stroke(), u.globalAlpha = 1;
      }
      for (const w of M) {
        w.ringZ += k, w.ringZ >= 1 && (w.ringZ -= 1);
        const { px: p, py: d, scale: b } = P(w.angle + w.offset * Math.PI * 2, w.ringZ, 0), A = (1 - w.ringZ) * 0.8;
        A <= 0 || (u.beginPath(), u.arc(p, d, Math.max(0.5, 1.5 * b), 0, Math.PI * 2), u.fillStyle = x, u.globalAlpha = A, u.fill(), u.globalAlpha = 1);
      }
      r.current = requestAnimationFrame(E);
    }
    return r.current = requestAnimationFrame(E), () => {
      I.disconnect(), cancelAnimationFrame(r.current), e.removeEventListener("mousemove", B);
    };
  }, [n]);
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
}, Qo = ht((n, h) => {
  const {
    preset: o,
    ringCount: a,
    speed: i,
    colors: r,
    backgroundColor: s,
    twist: m,
    fov: e,
    depth: t,
    lineWidth: u,
    opacity: g,
    starCount: f,
    starColor: y,
    interactive: S,
    width: I,
    height: $,
    className: B,
    style: P
  } = n, E = o && Ko[o] || {}, C = X(null);
  return gt(h, () => C.current), _o(C, {
    ringCount: a ?? E.ringCount ?? 30,
    speed: i ?? E.speed ?? 1,
    colors: r ?? E.colors ?? ["#ffffff", "#6b7280"],
    backgroundColor: s ?? E.backgroundColor ?? "#111111",
    twist: m ?? E.twist ?? 0.3,
    fov: e ?? E.fov ?? 300,
    depth: t ?? E.depth ?? 400,
    lineWidth: u ?? E.lineWidth ?? 1.5,
    opacity: g ?? E.opacity ?? 0.8,
    starCount: f ?? E.starCount ?? 100,
    starColor: y ?? E.starColor ?? "#ffffff",
    interactive: S ?? E.interactive ?? !0
  }), /* @__PURE__ */ at(
    "div",
    {
      className: B,
      style: { width: I ?? "100%", height: $ ?? "100%", display: "block", overflow: "hidden", ...P },
      children: /* @__PURE__ */ at("canvas", { ref: C, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
Qo.displayName = "Wormhole";
function Jo(n, h) {
  const o = X(h);
  o.current = h;
  const a = X([]), i = X(0), r = X(null), s = X(null);
  dt(() => {
    var m;
    (m = s.current) == null || m.call(s);
  }, [h.count]), dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    function f() {
      const l = o.current.maxSpeed, v = Math.random() * Math.PI * 2;
      return {
        x: Math.random() * u,
        y: Math.random() * g,
        vx: Math.cos(v) * l * 0.5,
        vy: Math.sin(v) * l * 0.5,
        trail: []
      };
    }
    function y() {
      const { count: l } = o.current;
      a.current = Array.from({ length: l }, f);
    }
    function S(l, v) {
      const R = n.current, x = window.devicePixelRatio || 1;
      R.width = Math.round(l * x), R.height = Math.round(v * x), R.style.width = `${l}px`, R.style.height = `${v}px`, t.scale(x, x), u = l, g = v, y();
    }
    s.current = () => {
      u > 0 && g > 0 && y();
    };
    const I = new ResizeObserver((l) => {
      const { width: v, height: R } = l[0].contentRect;
      v > 0 && R > 0 && S(v, R);
    });
    I.observe(e);
    const $ = e.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    function B(l) {
      if (!o.current.interactive) return;
      const R = n.current.getBoundingClientRect();
      r.current = { x: l.clientX - R.left, y: l.clientY - R.top };
    }
    function P() {
      r.current = null;
    }
    m.addEventListener("mousemove", B), m.addEventListener("mouseleave", P);
    function E(l, v) {
      const R = /* @__PURE__ */ new Map();
      for (let x = 0; x < l.length; x++) {
        const F = Math.floor(l[x].x / v), M = Math.floor(l[x].y / v), k = `${F},${M}`;
        R.has(k) || R.set(k, []), R.get(k).push(x);
      }
      return R;
    }
    function C(l, v, R, x) {
      const F = Math.floor(v.x / R), M = Math.floor(v.y / R), k = Math.ceil(x / R), L = [];
      for (let w = -k; w <= k; w++)
        for (let p = -k; p <= k; p++) {
          const d = `${F + w},${M + p}`, b = l.get(d);
          b && L.push(...b);
        }
      return L;
    }
    function c() {
      const {
        maxSpeed: l,
        separationRadius: v,
        alignmentRadius: R,
        cohesionRadius: x,
        separationForce: F,
        alignmentForce: M,
        cohesionForce: k,
        color: L,
        trailLength: w,
        trailOpacity: p,
        boidSize: d,
        backgroundColor: b,
        mouseRadius: A,
        mouseForce: T,
        wrapEdges: D
      } = o.current;
      t.fillStyle = b, t.fillRect(0, 0, u, g);
      const z = a.current, O = Math.max(v, R, x), W = E(z, O), Y = r.current, q = St(L);
      for (let H = 0; H < z.length; H++) {
        const G = z[H];
        G.trail.push({ x: G.x, y: G.y }), G.trail.length > w && G.trail.shift();
        const U = C(W, G, O, Math.max(v, R, x));
        let j = 0, N = 0, K = 0, Z = 0, nt = 0, rt = 0, st = 0, tt = 0, Q = 0;
        for (const et of U) {
          if (et === H) continue;
          const it = z[et], ct = G.x - it.x, lt = G.y - it.y, ft = Math.sqrt(ct * ct + lt * lt) || 1e-3;
          ft < v && (j += ct / ft, N += lt / ft, K++), ft < R && (Z += it.vx, nt += it.vy, rt++), ft < x && (st += it.x, tt += it.y, Q++);
        }
        let _ = 0, J = 0;
        if (K > 0 && (_ += j / K * F * l, J += N / K * F * l), rt > 0 && (_ += (Z / rt - G.vx) * M, J += (nt / rt - G.vy) * M), Q > 0 && (_ += (st / Q - G.x) / x * k * l, J += (tt / Q - G.y) / x * k * l), Y) {
          const et = G.x - Y.x, it = G.y - Y.y, ct = Math.sqrt(et * et + it * it) || 1e-3;
          ct < A && (_ += et / ct * T * l, J += it / ct * T * l);
        }
        G.vx += _, G.vy += J;
        const ot = Math.sqrt(G.vx * G.vx + G.vy * G.vy) || 1e-3;
        if (ot > l && (G.vx = G.vx / ot * l, G.vy = G.vy / ot * l), G.x += G.vx, G.y += G.vy, D ? (G.x < 0 && (G.x += u, G.trail = []), G.x > u && (G.x -= u, G.trail = []), G.y < 0 && (G.y += g, G.trail = []), G.y > g && (G.y -= g, G.trail = [])) : ((G.x < 0 || G.x > u) && (G.vx *= -1), (G.y < 0 || G.y > g) && (G.vy *= -1), G.x = Math.max(0, Math.min(u, G.x)), G.y = Math.max(0, Math.min(g, G.y))), G.trail.length > 1) {
          t.beginPath(), t.moveTo(G.trail[0].x, G.trail[0].y);
          for (let et = 1; et < G.trail.length; et++) {
            const it = G.trail[et - 1], ct = G.trail[et];
            Math.abs(ct.x - it.x) > u * 0.5 || Math.abs(ct.y - it.y) > g * 0.5 ? t.moveTo(ct.x, ct.y) : t.lineTo(ct.x, ct.y);
          }
          t.strokeStyle = `rgba(${q},${p})`, t.lineWidth = 1, t.stroke();
        }
        const V = Math.atan2(G.vy, G.vx);
        t.save(), t.translate(G.x, G.y), t.rotate(V), t.beginPath(), t.moveTo(d, 0), t.lineTo(-d * 0.6, d * 0.5), t.lineTo(-d * 0.6, -d * 0.5), t.closePath(), t.fillStyle = `rgba(${q},0.9)`, t.fill(), t.restore();
      }
      i.current = requestAnimationFrame(c);
    }
    return i.current = requestAnimationFrame(c), () => {
      I.disconnect(), cancelAnimationFrame(i.current), m.removeEventListener("mousemove", B), m.removeEventListener("mouseleave", P);
    };
  }, [n]);
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
}, tn = ht((n, h) => {
  const {
    preset: o,
    count: a,
    maxSpeed: i,
    separationRadius: r,
    alignmentRadius: s,
    cohesionRadius: m,
    separationForce: e,
    alignmentForce: t,
    cohesionForce: u,
    color: g,
    trailLength: f,
    trailOpacity: y,
    boidSize: S,
    backgroundColor: I,
    interactive: $,
    mouseRadius: B,
    mouseForce: P,
    wrapEdges: E,
    width: C,
    height: c,
    className: l,
    style: v
  } = n, R = o && Zo[o] || {}, x = X(null);
  return gt(h, () => x.current), Jo(x, {
    count: a ?? R.count ?? 80,
    maxSpeed: i ?? R.maxSpeed ?? 3,
    separationRadius: r ?? R.separationRadius ?? 25,
    alignmentRadius: s ?? R.alignmentRadius ?? 50,
    cohesionRadius: m ?? R.cohesionRadius ?? 60,
    separationForce: e ?? R.separationForce ?? 0.05,
    alignmentForce: t ?? R.alignmentForce ?? 0.05,
    cohesionForce: u ?? R.cohesionForce ?? 0.03,
    color: g ?? R.color ?? "#ffffff",
    trailLength: f ?? R.trailLength ?? 8,
    trailOpacity: y ?? R.trailOpacity ?? 0.4,
    boidSize: S ?? R.boidSize ?? 6,
    backgroundColor: I ?? R.backgroundColor ?? "#111111",
    interactive: $ ?? R.interactive ?? !0,
    mouseRadius: B ?? R.mouseRadius ?? 80,
    mouseForce: P ?? R.mouseForce ?? 0.2,
    wrapEdges: E ?? R.wrapEdges ?? !0
  }), /* @__PURE__ */ at(
    "div",
    {
      className: l,
      style: { width: C ?? "100%", height: c ?? "100%", display: "block", overflow: "hidden", ...v },
      children: /* @__PURE__ */ at("canvas", { ref: x, "aria-hidden": "true", role: "presentation", style: { display: "block" } })
    }
  );
});
tn.displayName = "Boids";
function he(n) {
  const h = n.replace("#", ""), o = h.length === 3 ? h.split("").map((i) => i + i).join("") : h, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function en(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null);
  dt(() => {
    const r = n.current;
    if (!r) return;
    const s = r.parentElement;
    if (!s) return;
    const m = r.getContext("2d");
    let e = 0, t = 0;
    function u(x, F) {
      const M = x * F, k = new Float32Array(M).fill(1), L = new Float32Array(M).fill(0), w = Math.max(5, Math.floor(x * F / 1e3));
      for (let A = 0; A < w; A++) {
        const T = Math.floor(Math.random() * x), D = Math.floor(Math.random() * F), z = Math.floor(2 + Math.random() * 5);
        for (let O = -z; O <= z; O++)
          for (let W = -z; W <= z; W++)
            if (W * W + O * O <= z * z) {
              const Y = (T + W + x) % x, H = (D + O + F) % F * x + Y;
              k[H] = 0.5 + (Math.random() - 0.5) * 0.1, L[H] = 0.25 + Math.random() * 0.1;
            }
      }
      const p = new OffscreenCanvas(x, F), d = p.getContext("2d"), b = d.createImageData(x, F);
      for (let A = 0; A < M; A++) b.data[A * 4 + 3] = 255;
      i.current = {
        u: k,
        v: L,
        uNext: new Float32Array(M),
        vNext: new Float32Array(M),
        gw: x,
        gh: F,
        imageData: b,
        offscreen: p,
        offCtx: d
      };
    }
    function g(x, F) {
      const M = window.devicePixelRatio || 1;
      e = x, t = F, r.width = Math.round(e * M), r.height = Math.round(t * M), r.style.width = `${e}px`, r.style.height = `${t}px`, m.setTransform(M, 0, 0, M, 0, 0);
      const { resolution: k } = o.current, L = Math.max(4, Math.round(e * k)), w = Math.max(4, Math.round(t * k));
      u(L, w);
    }
    const f = new ResizeObserver((x) => {
      const { width: F, height: M } = x[0].contentRect;
      F > 0 && M > 0 && g(F, M);
    });
    f.observe(s);
    const y = s.getBoundingClientRect();
    y.width > 0 && y.height > 0 && g(y.width, y.height);
    let S = !1, I = -1, $ = -1;
    function B(x, F) {
      const M = i.current;
      if (!M) return;
      const k = r.getBoundingClientRect(), L = x - k.left, w = F - k.top;
      I = Math.floor(L / e * M.gw), $ = Math.floor(w / t * M.gh);
    }
    function P(x) {
      o.current.interactive && B(x.clientX, x.clientY);
    }
    function E(x) {
      o.current.interactive && (S = !0, B(x.clientX, x.clientY));
    }
    function C() {
      S = !1, I = -1, $ = -1;
    }
    function c() {
      S = !1, I = -1, $ = -1;
    }
    s.addEventListener("mousemove", P), s.addEventListener("mousedown", E), s.addEventListener("mouseup", C), s.addEventListener("mouseleave", c);
    function l() {
      const x = i.current;
      if (!x) return;
      const { u: F, v: M, uNext: k, vNext: L, gw: w, gh: p } = x, { feedRate: d, killRate: b, diffusionU: A, diffusionV: T } = o.current;
      if (S && I >= 0 && $ >= 0) {
        for (let z = -3; z <= 3; z++)
          for (let O = -3; O <= 3; O++)
            if (O * O + z * z <= 3 * 3) {
              const W = (I + O + w) % w, q = ($ + z + p) % p * w + W;
              F[q] = 0.5, M[q] = 0.25;
            }
      }
      for (let D = 0; D < p; D++) {
        const z = (D - 1 + p) % p * w, O = (D + 1) % p * w, W = D * w;
        for (let Y = 0; Y < w; Y++) {
          const q = W + Y, H = (Y - 1 + w) % w, G = (Y + 1) % w, U = F[W + H] + F[W + G] + F[z + Y] + F[O + Y] - 4 * F[q], j = M[W + H] + M[W + G] + M[z + Y] + M[O + Y] - 4 * M[q], N = F[q] * M[q] * M[q];
          k[q] = Math.max(0, Math.min(1, F[q] + A * U - N + d * (1 - F[q]))), L[q] = Math.max(0, Math.min(1, M[q] + T * j + N - (d + b) * M[q]));
        }
      }
      x.u.set(k), x.v.set(L);
    }
    function v() {
      const x = i.current;
      if (!x) return;
      const { u: F, v: M, gw: k, gh: L, imageData: w, offscreen: p, offCtx: d } = x, { colorA: b, colorB: A, backgroundColor: T } = o.current, [D, z, O] = he(b), [W, Y, q] = he(A), H = w.data;
      for (let G = 0; G < k * L; G++) {
        const U = Math.max(0, Math.min(1, M[G] * 3.5)), j = 1 - F[G] * 0.15, N = G * 4;
        H[N] = Math.round((D + (W - D) * U) * j), H[N + 1] = Math.round((z + (Y - z) * U) * j), H[N + 2] = Math.round((O + (q - O) * U) * j);
      }
      d.putImageData(w, 0, 0), T && T !== "transparent" && (m.fillStyle = T, m.fillRect(0, 0, e, t)), m.imageSmoothingEnabled = !0, m.imageSmoothingQuality = "low", m.drawImage(p, 0, 0, e, t);
    }
    function R() {
      const { speed: x } = o.current, F = Math.max(1, Math.round(x));
      for (let M = 0; M < F; M++) l();
      v(), a.current = requestAnimationFrame(R);
    }
    return a.current = requestAnimationFrame(R), () => {
      f.disconnect(), cancelAnimationFrame(a.current), s.removeEventListener("mousemove", P), s.removeEventListener("mousedown", E), s.removeEventListener("mouseup", C), s.removeEventListener("mouseleave", c);
    };
  }, [n, h.resolution]);
}
const on = {
  default: {},
  coral: { feedRate: 0.055, killRate: 0.062 },
  spots: { feedRate: 0.035, killRate: 0.065 },
  maze: { feedRate: 0.029, killRate: 0.057 },
  waves: { feedRate: 0.014, killRate: 0.053, speed: 6 },
  neon: { feedRate: 0.055, killRate: 0.062, colorA: "#0a0a0a", colorB: "#00ffff", backgroundColor: "#0a0a0a" }
}, nn = ht(
  (n, h) => {
    const {
      preset: o,
      feedRate: a,
      killRate: i,
      diffusionU: r,
      diffusionV: s,
      resolution: m,
      speed: e,
      colorA: t,
      colorB: u,
      backgroundColor: g,
      interactive: f,
      width: y,
      height: S,
      className: I,
      style: $
    } = n, B = o && on[o] || {}, P = X(null);
    return gt(h, () => P.current), en(P, {
      feedRate: a ?? B.feedRate ?? 0.055,
      killRate: i ?? B.killRate ?? 0.062,
      diffusionU: r ?? B.diffusionU ?? 0.2,
      diffusionV: s ?? B.diffusionV ?? 0.1,
      resolution: m ?? B.resolution ?? 0.5,
      speed: e ?? B.speed ?? 8,
      colorA: t ?? B.colorA ?? "#111111",
      colorB: u ?? B.colorB ?? "#ffffff",
      backgroundColor: g ?? B.backgroundColor ?? "#111111",
      interactive: f ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: I,
        style: {
          width: y ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...$
        },
        children: /* @__PURE__ */ at(
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
nn.displayName = "ReactionDiffusion";
function rn(n) {
  const h = n.replace("#", ""), o = h.length === 3 ? h.split("").map((i) => i + i).join("") : h, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function an(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0), r = X([]), s = X([]);
  dt(() => {
    const m = n.current;
    if (!m) return;
    const e = m.parentElement;
    if (!e) return;
    const t = m.getContext("2d");
    let u = 0, g = 0;
    function f(c, l) {
      const { starCount: v } = o.current;
      r.current = Array.from({ length: v }, () => ({
        x: Math.random() * c,
        y: Math.random() * l * 0.7,
        r: 0.3 + Math.random() * 1.2,
        opacity: 0.4 + Math.random() * 0.6
      }));
    }
    function y(c) {
      const { layers: l } = o.current;
      s.current = Array.from({ length: l }, (v, R) => ({
        colorIndex: R % Math.max(1, o.current.colors.length),
        freqOffset: 0.5 + Math.random() * 1.5,
        ampScale: 0.4 + Math.random() * 0.6,
        speedScale: 0.3 + Math.random() * 0.7,
        yCenter: 0.15 + R / Math.max(1, l - 1) * 0.45,
        thickness: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2
      }));
    }
    function S(c, l) {
      const v = window.devicePixelRatio || 1;
      u = c, g = l, m.width = Math.round(u * v), m.height = Math.round(g * v), m.style.width = `${u}px`, m.style.height = `${g}px`, t.scale(v, v), f(u, g), y();
    }
    const I = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && S(l, v);
    });
    I.observe(e);
    const $ = e.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    let B = h.layers, P = h.starCount, E = 0;
    function C(c) {
      const l = E ? Math.min(c - E, 50) : 16;
      E = c;
      const { colors: v, speed: R, intensity: x, layers: F, waveAmplitude: M, waveFrequency: k, backgroundColor: L, animated: w, starCount: p } = o.current;
      F !== B && (B = F, y()), p !== P && (P = p, f(u, g)), w && (i.current += l * 1e-3 * R);
      const d = i.current;
      t.fillStyle = L, t.fillRect(0, 0, u, g);
      const b = r.current;
      for (const z of b)
        t.beginPath(), t.arc(z.x, z.y, z.r, 0, Math.PI * 2), t.fillStyle = `rgba(255,255,255,${z.opacity * 0.8})`, t.fill();
      const A = t.globalCompositeOperation;
      t.globalCompositeOperation = "screen";
      const T = Math.max(4, Math.ceil(u / 4)), D = u / T;
      for (const z of s.current) {
        const O = v[z.colorIndex % v.length] || "#ffffff", [W, Y, q] = rn(O), H = z.yCenter * g, G = M * g * z.ampScale, U = k * z.freqOffset, j = z.thickness * g;
        t.beginPath();
        for (let Z = 0; Z <= T; Z++) {
          const nt = Z * D, rt = nt / u * Math.PI * 2 * U + d * z.speedScale + z.phase, st = H - G * Math.sin(rt) - j * 0.5;
          Z === 0 ? t.moveTo(nt, st) : t.lineTo(nt, st);
        }
        for (let Z = T; Z >= 0; Z--) {
          const nt = Z * D, rt = nt / u * Math.PI * 2 * U + d * z.speedScale + z.phase, st = H - G * Math.sin(rt) + j * 0.5;
          t.lineTo(nt, st);
        }
        t.closePath();
        const N = t.createLinearGradient(0, H - G - j, 0, H + G + j);
        N.addColorStop(0, `rgba(${W},${Y},${q},0)`), N.addColorStop(0.3, `rgba(${W},${Y},${q},${x * 0.6})`), N.addColorStop(0.5, `rgba(${W},${Y},${q},${x})`), N.addColorStop(0.7, `rgba(${W},${Y},${q},${x * 0.6})`), N.addColorStop(1, `rgba(${W},${Y},${q},0)`), t.fillStyle = N, t.fill();
        const K = Math.floor(u / 60);
        for (let Z = 0; Z < K; Z++) {
          const nt = (Z / K + d * 0.02 * z.speedScale) % 1 * u, rt = H - G - j * 0.5, st = j * 2 + G * 2, tt = t.createLinearGradient(0, rt, 0, rt + st);
          tt.addColorStop(0, `rgba(${W},${Y},${q},0)`), tt.addColorStop(0.5, `rgba(${W},${Y},${q},${x * 0.3})`), tt.addColorStop(1, `rgba(${W},${Y},${q},0)`), t.fillStyle = tt, t.fillRect(nt - 1, rt, 2, st);
        }
      }
      t.globalCompositeOperation = A, a.current = requestAnimationFrame(C);
    }
    return a.current = requestAnimationFrame(C), () => {
      I.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const cn = {
  default: {},
  arctic: { colors: ["#00ff88", "#00ccff", "#88ff00"], backgroundColor: "#050a0f" },
  solar: { colors: ["#ff4400", "#ff8800", "#cc00ff"], backgroundColor: "#0a0005" },
  tropical: { colors: ["#00ffcc", "#0088ff", "#00ff44"], backgroundColor: "#030a0a" },
  neon: { colors: ["#ff00ff", "#00ffff", "#ff0088"], backgroundColor: "#000000", intensity: 1 },
  midnight: { colors: ["#4400cc", "#0033ff", "#2200aa"], backgroundColor: "#000005" }
}, sn = ht(
  (n, h) => {
    const {
      preset: o,
      colors: a,
      speed: i,
      intensity: r,
      layers: s,
      backgroundColor: m,
      waveAmplitude: e,
      waveFrequency: t,
      starCount: u,
      animated: g,
      width: f,
      height: y,
      className: S,
      style: I
    } = n, $ = o && cn[o] || {}, B = X(null);
    return gt(h, () => B.current), an(B, {
      colors: a ?? $.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      speed: i ?? $.speed ?? 1,
      intensity: r ?? $.intensity ?? 0.8,
      layers: s ?? 5,
      backgroundColor: m ?? $.backgroundColor ?? "#111111",
      waveAmplitude: e ?? 0.15,
      waveFrequency: t ?? 2,
      starCount: u ?? 80,
      animated: g ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: S,
        style: {
          width: f ?? "100%",
          height: y ?? "100%",
          display: "block",
          overflow: "hidden",
          ...I
        },
        children: /* @__PURE__ */ at(
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
sn.displayName = "AuroraBorealis";
function ln(n, h) {
  for (n = Math.abs(Math.round(n)), h = Math.abs(Math.round(h)); h > 0; ) [n, h] = [h, n % h];
  return n || 1;
}
function un(n, h) {
  const o = ln(n, h);
  return 2 * Math.PI * (h / o);
}
function ge(n) {
  const h = n.replace("#", ""), o = h.length === 3 ? h.split("").map((i) => i + i).join("") : h, a = parseInt(o, 16);
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function dn(n, h, o) {
  const [a, i, r] = ge(n), [s, m, e] = ge(h), t = Math.round(a + (s - a) * o), u = Math.round(i + (m - i) * o), g = Math.round(r + (e - r) * o);
  return `rgb(${t},${u},${g})`;
}
function fn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0, t = [], u = -1, g = -1, f = -1, y = -1, S = !0;
    function I(M, k) {
      const L = m / 2, w = e / 2, p = L + (M.R - M.r) * Math.cos(k) + M.d * Math.cos((M.R - M.r) / M.r * k), d = w + (M.R - M.r) * Math.sin(k) - M.d * Math.sin((M.R - M.r) / M.r * k);
      return [p, d];
    }
    function $(M, k, L) {
      const { outerRadius: w, innerRadius: p, penDistance: d } = o.current, A = Math.min(m, e) / 2 * w, D = k > 1 ? (M / (k - 1) - 0.5) * 0.12 : 0;
      let z, O;
      L ? (z = A * Math.max(0.05, p + D + (Math.random() - 0.5) * 0.08), O = z * Math.max(0.05, d * (0.85 + Math.random() * 0.3))) : (z = A * Math.max(0.05, p + D), O = z * Math.max(0.05, d)), z = Math.max(1, z), O = Math.max(0.1, O);
      const W = un(A, z), Y = M / Math.max(1, k) * 360, q = { t: 0, prevX: 0, prevY: 0, R: A, r: z, d: O, fullPeriod: W, hueOffset: Y }, [H, G] = I(q, 0);
      return q.prevX = H, q.prevY = G, q;
    }
    function B(M) {
      const { outerRadius: k, innerRadius: L, penDistance: w, layerCount: p } = o.current;
      t = [];
      for (let d = 0; d < p; d++)
        t.push($(d, p, M));
      u = k, g = L, f = w, y = p;
    }
    function P() {
      const { backgroundColor: M } = o.current;
      s.globalCompositeOperation = "source-over", s.globalAlpha = 1, s.fillStyle = M, s.fillRect(0, 0, m, e);
    }
    function E(M, k) {
      const L = window.devicePixelRatio || 1;
      m = M, e = k, i.width = Math.round(m * L), i.height = Math.round(e * L), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(L, 0, 0, L, 0, 0), P(), S = !0, B(!1);
    }
    const C = new ResizeObserver((M) => {
      const { width: k, height: L } = M[0].contentRect;
      k > 0 && L > 0 && E(k, L);
    });
    C.observe(r);
    const c = r.getBoundingClientRect();
    c.width > 0 && c.height > 0 && E(c.width, c.height);
    let l = 0;
    function v(M, k, L, w, p, d, b, A) {
      s.strokeStyle = p, s.lineWidth = d, s.lineCap = "round", b ? (s.shadowColor = p, s.shadowBlur = A) : s.shadowBlur = 0, s.beginPath(), s.moveTo(M, k), s.lineTo(L, w), s.stroke();
    }
    function R(M, k, L, w, p) {
      const d = Math.cos(p), b = Math.sin(p), A = L - M, T = w - k;
      return [M + A * d - T * b, k + A * b + T * d];
    }
    function x(M, k) {
      const { colorMode: L, color: w, color2: p } = o.current;
      if (L === "cycle")
        return `hsl(${(M.hueOffset + M.t / M.fullPeriod * 360) % 360}, 100%, 65%)`;
      if (L === "gradient") {
        const d = Math.min(1, M.t / M.fullPeriod);
        return dn(w, p, d);
      }
      return o.current.layerCount > 1 && L === "solid" ? `hsl(${k / o.current.layerCount * 360}, 80%, 70%)` : w;
    }
    function F(M) {
      const k = l ? Math.min(M - l, 50) : 16;
      l = M;
      const {
        outerRadius: L,
        innerRadius: w,
        penDistance: p,
        layerCount: d,
        speed: b,
        backgroundColor: A,
        lineWidth: T,
        trailFade: D,
        animated: z,
        autoReset: O,
        symmetry: W,
        glowEffect: Y,
        glowBlur: q,
        colorMode: H
      } = o.current;
      if (!S && (L !== u || w !== g || p !== f || d !== y) && (B(!1), P()), S = !1, !z) {
        a.current = requestAnimationFrame(F);
        return;
      }
      D > 0 && (s.globalCompositeOperation = "source-over", s.globalAlpha = Math.min(1, D * (k / 16)), s.fillStyle = A, s.fillRect(0, 0, m, e), s.globalAlpha = 1), s.globalCompositeOperation = H === "cycle" ? "screen" : "source-over";
      const G = b * Math.PI / 180 * (k / 16), U = Math.max(1, Math.ceil(G / 0.02)), j = G / U, N = m / 2, K = e / 2, Z = 2 * Math.PI / W;
      let nt = !1;
      for (let rt = 0; rt < t.length; rt++) {
        const st = t[rt], tt = x(st, rt);
        for (let Q = 0; Q < U; Q++) {
          st.t += j;
          const [_, J] = I(st, st.t);
          for (let ot = 0; ot < W; ot++) {
            const V = ot * Z, [et, it] = R(N, K, st.prevX, st.prevY, V), [ct, lt] = R(N, K, _, J, V);
            v(et, it, ct, lt, tt, T, Y, q);
          }
          st.prevX = _, st.prevY = J;
        }
        st.t >= st.fullPeriod && O && (nt = !0);
      }
      Y || (s.shadowBlur = 0), s.globalCompositeOperation = "source-over", nt && (B(!0), P()), a.current = requestAnimationFrame(F);
    }
    return a.current = requestAnimationFrame(F), () => {
      C.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const hn = {
  default: {},
  neon: {
    colorMode: "cycle",
    backgroundColor: "#000000",
    lineWidth: 1.5,
    glowEffect: !0,
    glowBlur: 15,
    trailFade: 5e-3
  },
  prismatic: {
    colorMode: "cycle",
    layerCount: 3,
    symmetry: 2,
    lineWidth: 1,
    trailFade: 4e-3,
    backgroundColor: "#050005"
  },
  mandala: {
    colorMode: "gradient",
    color: "#ff00ff",
    color2: "#00ffff",
    symmetry: 6,
    layerCount: 2,
    glowEffect: !0,
    glowBlur: 12,
    trailFade: 2e-3,
    backgroundColor: "#000000"
  },
  cosmic: {
    layerCount: 4,
    colorMode: "cycle",
    glowEffect: !0,
    glowBlur: 10,
    trailFade: 2e-3,
    backgroundColor: "#020008",
    lineWidth: 1
  },
  minimal: {
    speed: 0.5,
    lineWidth: 0.5,
    trailFade: 1e-3
  }
}, gn = ht(
  (n, h) => {
    const {
      preset: o,
      outerRadius: a,
      innerRadius: i,
      penDistance: r,
      speed: s,
      color: m,
      color2: e,
      backgroundColor: t,
      lineWidth: u,
      trailFade: g,
      animated: f,
      autoReset: y,
      layerCount: S,
      colorMode: I,
      symmetry: $,
      glowEffect: B,
      glowBlur: P,
      width: E,
      height: C,
      className: c,
      style: l
    } = n, v = o && hn[o] || {}, R = X(null);
    return gt(h, () => R.current), fn(R, {
      outerRadius: a ?? 0.85,
      innerRadius: i ?? v.innerRadius ?? 0.4,
      penDistance: r ?? v.penDistance ?? 0.9,
      speed: s ?? v.speed ?? 2,
      color: m ?? v.color ?? "#ffffff",
      color2: e ?? v.color2 ?? "#6b7280",
      backgroundColor: t ?? v.backgroundColor ?? "#111111",
      lineWidth: u ?? v.lineWidth ?? 1,
      trailFade: g ?? v.trailFade ?? 3e-3,
      animated: f ?? !0,
      autoReset: y ?? !0,
      layerCount: S ?? v.layerCount ?? 2,
      colorMode: I ?? v.colorMode ?? "solid",
      symmetry: $ ?? v.symmetry ?? 1,
      glowEffect: B ?? v.glowEffect ?? !1,
      glowBlur: P ?? v.glowBlur ?? 10
    }), /* @__PURE__ */ at(
      "div",
      {
        className: c,
        style: {
          width: E ?? "100%",
          height: C ?? "100%",
          display: "block",
          overflow: "hidden",
          ...l
        },
        children: /* @__PURE__ */ at(
          "canvas",
          {
            ref: R,
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
const pt = 0, kt = 1, Ct = 2, It = 3, ee = 4;
function zt(n) {
  const h = n.replace("#", ""), o = h.length === 3 ? h.split("").map((i) => i + i).join("") : h, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function mn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(null), r = X(null), s = X(0), m = X(0);
  dt(() => {
    const e = n.current;
    if (!e) return;
    const t = e.parentElement;
    if (!t) return;
    const u = e.getContext("2d");
    let g = 0, f = 0, y = null, S = null, I = null;
    function $(w, p) {
      s.current = w, m.current = p, i.current = new Uint8Array(w * p), r.current = new Float32Array(w * p), y = new OffscreenCanvas(w, p), S = y.getContext("2d"), I = S.createImageData(w, p);
    }
    function B(w, p) {
      const d = window.devicePixelRatio || 1;
      g = w, f = p, e.width = Math.round(g * d), e.height = Math.round(f * d), e.style.width = `${g}px`, e.style.height = `${f}px`, u.scale(d, d);
      const { cellSize: b } = o.current, A = Math.max(4, Math.floor(g / b)), T = Math.max(4, Math.floor(f / b));
      $(A, T);
    }
    const P = new ResizeObserver((w) => {
      const { width: p, height: d } = w[0].contentRect;
      p > 0 && d > 0 && B(p, d);
    });
    P.observe(t);
    const E = t.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    let C = !1;
    function c(w, p) {
      const d = e.getBoundingClientRect(), b = w - d.left, A = p - d.top, T = s.current, D = m.current;
      return [
        Math.floor(b / g * T),
        Math.floor(A / f * D)
      ];
    }
    function l(w, p) {
      const d = i.current, b = r.current;
      if (!d || !b) return;
      const A = s.current, T = m.current, { brushSize: D, material: z } = o.current;
      for (let O = -D; O <= D; O++)
        for (let W = -D; W <= D; W++) {
          if (W * W + O * O > D * D) continue;
          const Y = w + W, q = p + O;
          if (Y < 0 || Y >= A || q < 0 || q >= T) continue;
          const H = q * A + Y;
          z === "erase" ? (d[H] = pt, b[H] = 0) : z === "sand" ? d[H] = kt : z === "water" ? d[H] = Ct : z === "fire" ? (d[H] = It, b[H] = 1) : z === "wall" && (d[H] = ee);
        }
    }
    function v(w) {
      o.current.interactive && (C = !0, l(...c(w.clientX, w.clientY)));
    }
    function R(w) {
      !o.current.interactive || !C || l(...c(w.clientX, w.clientY));
    }
    function x() {
      C = !1;
    }
    function F() {
      C = !1;
    }
    e.addEventListener("mousedown", v), e.addEventListener("mousemove", R), e.addEventListener("mouseup", x), e.addEventListener("mouseleave", F);
    function M() {
      const w = i.current, p = r.current;
      if (!w || !p) return;
      const d = s.current, b = m.current;
      for (let A = b - 1; A >= 0; A--) {
        const T = Math.random() < 0.5;
        for (let D = 0; D < d; D++) {
          const z = T ? D : d - 1 - D, O = A * d + z, W = w[O];
          if (W === pt || W === ee) continue;
          const Y = A + 1 < b, q = A - 1 >= 0, H = z - 1 >= 0, G = z + 1 < d;
          if (W === kt)
            if (Y && w[(A + 1) * d + z] === pt)
              w[(A + 1) * d + z] = kt, w[O] = pt;
            else if (Y && w[(A + 1) * d + z] === Ct)
              w[(A + 1) * d + z] = kt, w[O] = Ct;
            else {
              const U = Math.random() < 0.5, j = U ? -1 : 1, N = U ? 1 : -1, K = U ? H : G, Z = U ? G : H;
              Y && K && w[(A + 1) * d + (z + j)] === pt ? (w[(A + 1) * d + (z + j)] = kt, w[O] = pt) : Y && Z && w[(A + 1) * d + (z + N)] === pt && (w[(A + 1) * d + (z + N)] = kt, w[O] = pt);
            }
          else if (W === Ct)
            if (Y && w[(A + 1) * d + z] === pt)
              w[(A + 1) * d + z] = Ct, w[O] = pt;
            else {
              const U = Math.random() < 0.5, j = U ? -1 : 1, N = U ? 1 : -1, K = U ? H : G, Z = U ? G : H;
              K && w[A * d + (z + j)] === pt ? (w[A * d + (z + j)] = Ct, w[O] = pt) : Z && w[A * d + (z + N)] === pt && (w[A * d + (z + N)] = Ct, w[O] = pt);
            }
          else if (W === It) {
            if (p[O] -= 5e-3 + Math.random() * 0.01, p[O] <= 0) {
              w[O] = pt, p[O] = 0;
              continue;
            }
            q && w[(A - 1) * d + z] === pt && Math.random() < 0.4 && (w[(A - 1) * d + z] = It, p[(A - 1) * d + z] = p[O] * (0.7 + Math.random() * 0.3)), q && w[(A - 1) * d + z] === kt && Math.random() < 0.02 && (w[(A - 1) * d + z] = It, p[(A - 1) * d + z] = 1);
            const U = Math.random() < 0.5 ? -1 : 1;
            q && (U === -1 ? H : G) && w[(A - 1) * d + (z + U)] === pt && Math.random() < 0.15 && (w[(A - 1) * d + (z + U)] = It, p[(A - 1) * d + (z + U)] = p[O] * 0.6), Y && w[(A + 1) * d + z] === Ct && (w[O] = pt, w[(A + 1) * d + z] = pt, p[O] = 0);
          }
        }
      }
    }
    function k() {
      const w = i.current, p = r.current;
      if (!w || !p || !I || !y || !S) return;
      const d = s.current, b = m.current, { sandColor: A, waterColor: T, fireColor: D, wallColor: z, backgroundColor: O } = o.current, [W, Y, q] = zt(O), [H, G, U] = zt(A), [j, N, K] = zt(T), [Z, nt, rt] = zt(D), [st, tt, Q] = zt(z), _ = I.data;
      for (let J = 0; J < d * b; J++) {
        const ot = J * 4, V = w[J];
        if (_[ot + 3] = 255, V === pt)
          _[ot] = W, _[ot + 1] = Y, _[ot + 2] = q;
        else if (V === kt) {
          const et = (Math.random() * 20 | 0) - 10;
          _[ot] = Math.max(0, Math.min(255, H + et)), _[ot + 1] = Math.max(0, Math.min(255, G + et)), _[ot + 2] = Math.max(0, Math.min(255, U + et));
        } else if (V === Ct) {
          const et = 0.6 + Math.random() * 0.3;
          _[ot] = Math.round(W * (1 - et) + j * et), _[ot + 1] = Math.round(Y * (1 - et) + N * et), _[ot + 2] = Math.round(q * (1 - et) + K * et);
        } else if (V === It) {
          const et = Math.max(0, Math.min(1, p[J]));
          _[ot] = Math.min(255, Math.round(Z * et + 60 * et)), _[ot + 1] = Math.round(nt * et * 0.4), _[ot + 2] = Math.round(rt * et * 0.1);
        } else V === ee && (_[ot] = st, _[ot + 1] = tt, _[ot + 2] = Q);
      }
      S.putImageData(I, 0, 0), u.imageSmoothingEnabled = !1, u.drawImage(y, 0, 0, g, f);
    }
    function L() {
      M(), k(), a.current = requestAnimationFrame(L);
    }
    return a.current = requestAnimationFrame(L), () => {
      P.disconnect(), cancelAnimationFrame(a.current), e.removeEventListener("mousedown", v), e.removeEventListener("mousemove", R), e.removeEventListener("mouseup", x), e.removeEventListener("mouseleave", F);
    };
  }, [n, h.cellSize]);
}
const pn = {
  default: {},
  desert: { sandColor: "#c8a85a", backgroundColor: "#1a1200", wallColor: "#6b4c1a" },
  ocean: { waterColor: "#0088cc", backgroundColor: "#001a2e", wallColor: "#0a3a5a", material: "water" },
  inferno: { fireColor: "#ff4400", backgroundColor: "#0a0000", wallColor: "#2a0000", material: "fire" },
  neon: { sandColor: "#00ffff", waterColor: "#ff00ff", fireColor: "#ffff00", wallColor: "#00ff88", backgroundColor: "#050505" }
}, yn = ht(
  (n, h) => {
    const {
      preset: o,
      cellSize: a,
      brushSize: i,
      material: r,
      sandColor: s,
      waterColor: m,
      fireColor: e,
      wallColor: t,
      backgroundColor: u,
      interactive: g,
      gravity: f,
      width: y,
      height: S,
      className: I,
      style: $
    } = n, B = o && pn[o] || {}, P = X(null);
    return gt(h, () => P.current), mn(P, {
      cellSize: a ?? 4,
      brushSize: i ?? 3,
      material: r ?? B.material ?? "sand",
      sandColor: s ?? B.sandColor ?? "#ffffff",
      waterColor: m ?? B.waterColor ?? "#6b7280",
      fireColor: e ?? B.fireColor ?? "#ffffff",
      wallColor: t ?? B.wallColor ?? "#4b5563",
      backgroundColor: u ?? B.backgroundColor ?? "#111111",
      interactive: g ?? !0,
      gravity: f ?? 1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: I,
        style: {
          width: y ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...$
        },
        children: /* @__PURE__ */ at(
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
yn.displayName = "SandSimulation";
function me(n) {
  const h = n.replace("#", ""), o = h.length === 3 ? h.split("").map((i) => i + i).join("") : h, a = parseInt(o, 16) || 0;
  return [a >> 16 & 255, a >> 8 & 255, a & 255];
}
function wn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0), i = X(0), r = X([]);
  dt(() => {
    const s = n.current;
    if (!s) return;
    const m = s.parentElement;
    if (!m) return;
    const e = s.getContext("2d");
    let t = 0, u = 0, g = null, f = null, y = null, S = 0, I = 0;
    function $() {
      r.current = [
        { x: t * 0.35, y: u * 0.5 },
        { x: t * 0.65, y: u * 0.5 }
      ];
    }
    function B(R, x) {
      const F = window.devicePixelRatio || 1;
      t = R, u = x, s.width = Math.round(t * F), s.height = Math.round(u * F), s.style.width = `${t}px`, s.style.height = `${u}px`, e.scale(F, F);
      const { resolution: M } = o.current;
      S = Math.max(4, Math.round(t * M)), I = Math.max(4, Math.round(u * M)), g = new OffscreenCanvas(S, I), f = g.getContext("2d"), y = f.createImageData(S, I), $();
    }
    const P = new ResizeObserver((R) => {
      const { width: x, height: F } = R[0].contentRect;
      x > 0 && F > 0 && B(x, F);
    });
    P.observe(m);
    const E = m.getBoundingClientRect();
    E.width > 0 && E.height > 0 && B(E.width, E.height);
    const C = 16;
    function c(R) {
      const x = s.getBoundingClientRect(), F = R.clientX - x.left, M = R.clientY - x.top, k = r.current, { maxSources: L } = o.current;
      for (let w = 0; w < k.length; w++) {
        const p = k[w].x - F, d = k[w].y - M;
        if (p * p + d * d < C * C) {
          k.splice(w, 1);
          return;
        }
      }
      k.length < L && k.push({ x: F, y: M });
    }
    s.addEventListener("click", c);
    let l = 0;
    function v(R) {
      const x = l ? Math.min(R - l, 50) : 16;
      l = R;
      const { wavelength: F, speed: M, colorHigh: k, colorLow: L, showSources: w, animated: p, decay: d } = o.current, b = r.current;
      p && (i.current += x * 1e-3 * M);
      const A = i.current, [T, D, z] = me(L), [O, W, Y] = me(k), q = y.data, H = 2 * Math.PI / F, G = H * (M * 60), U = Math.max(1, b.length), j = t / S, N = u / I;
      for (let K = 0; K < I; K++)
        for (let Z = 0; Z < S; Z++) {
          const nt = (Z + 0.5) * j, rt = (K + 0.5) * N;
          let st = 0;
          for (const J of b) {
            const ot = nt - J.x, V = rt - J.y, et = Math.sqrt(ot * ot + V * V), it = Math.exp(-d * et);
            st += it * Math.cos(H * et - G * A);
          }
          const tt = (st / U + 1) * 0.5, Q = Math.max(0, Math.min(1, tt)), _ = (K * S + Z) * 4;
          q[_] = Math.round(T + (O - T) * Q), q[_ + 1] = Math.round(D + (W - D) * Q), q[_ + 2] = Math.round(z + (Y - z) * Q), q[_ + 3] = 255;
        }
      if (f.putImageData(y, 0, 0), e.imageSmoothingEnabled = !0, e.imageSmoothingQuality = "low", e.drawImage(g, 0, 0, t, u), w)
        for (const K of b)
          e.beginPath(), e.arc(K.x, K.y, 8, 0, Math.PI * 2), e.strokeStyle = k, e.lineWidth = 2, e.stroke(), e.beginPath(), e.moveTo(K.x - 5, K.y), e.lineTo(K.x + 5, K.y), e.moveTo(K.x, K.y - 5), e.lineTo(K.x, K.y + 5), e.stroke();
      a.current = requestAnimationFrame(v);
    }
    return a.current = requestAnimationFrame(v), () => {
      P.disconnect(), cancelAnimationFrame(a.current), s.removeEventListener("click", c);
    };
  }, [n, h.resolution]);
}
const vn = {
  default: {},
  ripple: { colorHigh: "#88ccff", colorLow: "#001133", wavelength: 100 },
  plasma: { colorHigh: "#ff4400", colorLow: "#000033", wavelength: 60, decay: 1e-3 },
  neon: { colorHigh: "#00ffff", colorLow: "#000000", wavelength: 70 },
  cosmic: { colorHigh: "#cc88ff", colorLow: "#050005", decay: 2e-3 }
}, bn = ht(
  (n, h) => {
    const {
      preset: o,
      maxSources: a,
      wavelength: i,
      speed: r,
      colorHigh: s,
      colorLow: m,
      backgroundColor: e,
      showSources: t,
      resolution: u,
      animated: g,
      decay: f,
      width: y,
      height: S,
      className: I,
      style: $
    } = n, B = o && vn[o] || {}, P = X(null);
    return gt(h, () => P.current), wn(P, {
      maxSources: a ?? 6,
      wavelength: i ?? B.wavelength ?? 80,
      speed: r ?? 1,
      colorHigh: s ?? B.colorHigh ?? "#ffffff",
      colorLow: m ?? B.colorLow ?? "#111111",
      backgroundColor: e ?? B.backgroundColor ?? "#111111",
      showSources: t ?? !1,
      resolution: u ?? 0.4,
      animated: g ?? !0,
      decay: f ?? B.decay ?? 3e-3
    }), /* @__PURE__ */ at(
      "div",
      {
        className: I,
        style: {
          width: y ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...$
        },
        children: /* @__PURE__ */ at(
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
bn.displayName = "WaveInterference";
const Cn = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
], pe = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1]
];
function Mn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0, t = 0, u = 0, g = null, f = [], y = 0;
    function S(w, p) {
      return p * t + w;
    }
    function I(w, p) {
      return w < 0 || w >= t || p < 0 || p >= u ? !1 : g[S(w, p)] === 1;
    }
    function $(w, p) {
      for (const [d, b] of Cn)
        if (I(w + d, p + b)) return !0;
      return !1;
    }
    function B(w, p) {
      w < 0 || w >= t || p < 0 || p >= u || (g[S(w, p)] = 1);
    }
    function P(w, p) {
      const { particleSize: d } = o.current;
      return [Math.floor(w / d), Math.floor(p / d)];
    }
    function E(w, p) {
      const { particleSize: d } = o.current;
      return [w * d + d * 0.5, p * d + d * 0.5];
    }
    function C() {
      const { seedMode: w } = o.current;
      if (w === "bottom")
        return { x: Math.floor(Math.random() * t), y: 0 };
      const p = Math.random() * Math.PI * 2, d = Math.min(y, Math.floor(Math.min(t, u) * 0.48)), b = t / 2, A = u / 2;
      return {
        x: Math.max(0, Math.min(t - 1, Math.round(b + Math.cos(p) * d))),
        y: Math.max(0, Math.min(u - 1, Math.round(A + Math.sin(p) * d)))
      };
    }
    function c(w, p, d) {
      const [b, A] = E(w, p), { particleColor: T, walkerColor: D, particleSize: z, glowEffect: O, glowBlur: W } = o.current;
      O && d ? (s.shadowColor = T, s.shadowBlur = W) : s.shadowBlur = 0;
      const Y = z * 0.5;
      s.fillStyle = d ? T : D, s.beginPath(), s.arc(b, A, Y, 0, Math.PI * 2), s.fill(), s.shadowBlur = 0;
    }
    function l(w, p) {
      const [d, b] = E(w, p), { particleSize: A, backgroundColor: T } = o.current, D = A * 0.5 + 1;
      s.fillStyle = T, s.beginPath(), s.arc(d, b, D, 0, Math.PI * 2), s.fill();
    }
    function v() {
      const { seedMode: w } = o.current;
      if (g)
        if (w === "bottom")
          for (let p = 0; p < t; p++)
            B(p, u - 1), c(p, u - 1, !0);
        else if (w === "ring") {
          const p = Math.floor(t / 2), d = Math.floor(u / 2), b = Math.max(2, Math.floor(Math.min(t, u) * 0.04));
          for (let A = 0; A < Math.PI * 2; A += 0.15) {
            const T = Math.round(p + Math.cos(A) * b), D = Math.round(d + Math.sin(A) * b);
            T >= 0 && T < t && D >= 0 && D < u && (B(T, D), c(T, D, !0));
          }
        } else {
          const p = Math.floor(t / 2), d = Math.floor(u / 2);
          B(p, d), c(p, d, !0);
        }
    }
    function R(w, p) {
      const { particleSize: d, walkerCount: b } = o.current;
      t = Math.max(4, Math.floor(w / d)), u = Math.max(4, Math.floor(p / d)), g = new Uint8Array(t * u), y = Math.floor(Math.min(t, u) * 0.05), s.fillStyle = o.current.backgroundColor, s.fillRect(0, 0, m, e), v(), f = [];
      for (let A = 0; A < b; A++)
        f.push(C());
    }
    function x(w, p) {
      const d = window.devicePixelRatio || 1;
      m = w, e = p, i.width = Math.round(m * d), i.height = Math.round(e * d), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(d, 0, 0, d, 0, 0), R(m, e);
    }
    const F = new ResizeObserver((w) => {
      const { width: p, height: d } = w[0].contentRect;
      p > 0 && d > 0 && x(p, d);
    });
    F.observe(r);
    const M = r.getBoundingClientRect();
    M.width > 0 && M.height > 0 && x(M.width, M.height);
    function k(w) {
      if (!o.current.interactive || !g) return;
      const p = i.getBoundingClientRect(), d = w.clientX - p.left, b = w.clientY - p.top, [A, T] = P(d, b);
      A >= 0 && A < t && T >= 0 && T < u && (B(A, T), c(A, T, !0));
    }
    i.addEventListener("click", k);
    function L() {
      if (!g) {
        a.current = requestAnimationFrame(L);
        return;
      }
      const { stepsPerFrame: w, walkerCount: p, showWalkers: d, seedMode: b } = o.current;
      for (let A = 0; A < w; A++)
        for (let T = 0; T < f.length; T++) {
          const D = f[T], z = D.x, O = D.y;
          d && l(z, O);
          const W = pe[Math.floor(Math.random() * pe.length)];
          let Y = D.x + W[0], q = D.y + W[1];
          if (Y = Math.max(0, Math.min(t - 1, Y)), q = b === "bottom" ? Math.max(0, Math.min(u - 2, q)) : Math.max(0, Math.min(u - 1, q)), D.x = Y, D.y = q, $(Y, q) && !I(Y, q)) {
            if (B(Y, q), c(Y, q, !0), b !== "bottom") {
              const H = t / 2, G = u / 2, U = Math.sqrt((Y - H) ** 2 + (q - G) ** 2);
              y = Math.min(
                Math.floor(Math.min(t, u) * 0.48),
                Math.max(y, Math.ceil(U) + 3)
              );
            }
            f.length <= p && (f[T] = C());
          } else
            d && c(Y, q, !1);
        }
      a.current = requestAnimationFrame(L);
    }
    return a.current = requestAnimationFrame(L), () => {
      F.disconnect(), cancelAnimationFrame(a.current), i.removeEventListener("click", k);
    };
  }, [n, h.particleSize, h.seedMode]);
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
  (n, h) => {
    const {
      preset: o,
      particleColor: a,
      walkerColor: i,
      backgroundColor: r,
      particleSize: s,
      walkerCount: m,
      stepsPerFrame: e,
      seedMode: t,
      showWalkers: u,
      glowEffect: g,
      glowBlur: f,
      interactive: y,
      width: S,
      height: I,
      className: $,
      style: B
    } = n, P = o && xn[o] || {}, E = X(null);
    return gt(h, () => E.current), Mn(E, {
      particleColor: a ?? P.particleColor ?? "#ffffff",
      walkerColor: i ?? P.walkerColor ?? "#6b7280",
      backgroundColor: r ?? P.backgroundColor ?? "#111111",
      particleSize: s ?? P.particleSize ?? 3,
      walkerCount: m ?? 60,
      stepsPerFrame: e ?? 20,
      seedMode: t ?? P.seedMode ?? "center",
      showWalkers: u ?? !1,
      glowEffect: g ?? P.glowEffect ?? !0,
      glowBlur: f ?? P.glowBlur ?? 8,
      interactive: y ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: $,
        style: {
          width: S ?? "100%",
          height: I ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: "crosshair",
          ...B
        },
        children: /* @__PURE__ */ at(
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
Rn.displayName = "DiffusionAggregation";
function Sn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0, t = 0, u = -1, g = -1, f = -1, y = !0;
    function S() {
      s.globalAlpha = 1, s.shadowBlur = 0, s.fillStyle = o.current.backgroundColor, s.fillRect(0, 0, m, e);
    }
    function I(C, c) {
      const l = window.devicePixelRatio || 1;
      m = C, e = c, i.width = Math.round(m * l), i.height = Math.round(e * l), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(l, 0, 0, l, 0, 0), S(), y = !0;
    }
    const $ = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && I(c, l);
    });
    $.observe(r);
    const B = r.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    let P = 0;
    function E(C) {
      const c = P ? Math.min(C - P, 50) : 16;
      P = C;
      const {
        freqX: l,
        freqY: v,
        phaseShift: R,
        phaseSpeed: x,
        amplitude: F,
        color: M,
        backgroundColor: k,
        lineWidth: L,
        trailFade: w,
        glowEffect: p,
        glowBlur: d,
        colorMode: b,
        curvePoints: A,
        animated: T,
        speed: D
      } = o.current;
      if (y ? (t = R * Math.PI / 180, u = l, g = v, f = F, y = !1) : (l !== u || v !== g || F !== f) && (S(), t = R * Math.PI / 180, u = l, g = v, f = F), !T) {
        a.current = requestAnimationFrame(E);
        return;
      }
      w > 0 && (s.globalAlpha = Math.min(1, w * (c / 16)), s.fillStyle = k, s.fillRect(0, 0, m, e), s.globalAlpha = 1);
      const z = m / 2, O = e / 2, W = z * F, Y = O * F, q = b === "cycle" ? `hsl(${t * 360 / Math.PI % 360}, 100%, 65%)` : M;
      s.strokeStyle = q, s.lineWidth = L, s.lineCap = "round", s.lineJoin = "round", p ? (s.shadowColor = q, s.shadowBlur = d) : s.shadowBlur = 0, s.beginPath();
      for (let H = 0; H <= A; H++) {
        const G = H / A * 2 * Math.PI, U = z + W * Math.sin(l * G + t), j = O + Y * Math.sin(v * G);
        H === 0 ? s.moveTo(U, j) : s.lineTo(U, j);
      }
      s.stroke(), s.shadowBlur = 0, t += x * D * Math.PI / 180 * (c / 16), a.current = requestAnimationFrame(E);
    }
    return a.current = requestAnimationFrame(E), () => {
      $.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const kn = {
  default: {},
  butterfly: { freqX: 3, freqY: 2 },
  star: { freqX: 5, freqY: 4 },
  web: { freqX: 7, freqY: 6, colorMode: "cycle" },
  neon: { glowEffect: !0, colorMode: "cycle", backgroundColor: "#000000", lineWidth: 2 },
  crystal: { freqX: 5, freqY: 3, glowEffect: !0, lineWidth: 2, colorMode: "cycle", backgroundColor: "#000510" }
}, En = ht(
  (n, h) => {
    const {
      preset: o,
      freqX: a,
      freqY: i,
      phaseShift: r,
      phaseSpeed: s,
      amplitude: m,
      color: e,
      backgroundColor: t,
      lineWidth: u,
      trailFade: g,
      glowEffect: f,
      glowBlur: y,
      colorMode: S,
      curvePoints: I,
      animated: $,
      speed: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && kn[o] || {}, v = X(null);
    return gt(h, () => v.current), Sn(v, {
      freqX: a ?? l.freqX ?? 3,
      freqY: i ?? l.freqY ?? 2,
      phaseShift: r ?? 0,
      phaseSpeed: s ?? l.phaseSpeed ?? 0.5,
      amplitude: m ?? 0.9,
      color: e ?? l.color ?? "#ffffff",
      backgroundColor: t ?? l.backgroundColor ?? "#111111",
      lineWidth: u ?? l.lineWidth ?? 1.5,
      trailFade: g ?? l.trailFade ?? 0.04,
      glowEffect: f ?? l.glowEffect ?? !1,
      glowBlur: y ?? l.glowBlur ?? 12,
      colorMode: S ?? l.colorMode ?? "solid",
      curvePoints: I ?? 600,
      animated: $ ?? !0,
      speed: B ?? 1
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: {
          width: P ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          ...c
        },
        children: /* @__PURE__ */ at(
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
En.displayName = "Lissajous";
const oe = 25e4;
function An(n, h, o) {
  let a = n;
  for (let i = 0; i < o; i++) {
    let r = "";
    for (const s of a) {
      const m = h[s];
      if (m ? r += m : r += s, r.length >= oe) {
        r = r.slice(0, oe);
        break;
      }
    }
    if (a = r, a.length >= oe) break;
  }
  return a;
}
function Bn(n, h, o, a) {
  let i = 0, r = 0, s = -Math.PI / 2;
  const m = [], e = [];
  for (const c of n)
    switch (c) {
      case "F":
      case "G": {
        const l = i + Math.cos(s), v = r + Math.sin(s);
        e.push(i, r, l, v), i = l, r = v;
        break;
      }
      case "f": {
        i += Math.cos(s), r += Math.sin(s);
        break;
      }
      case "+":
        s += h;
        break;
      case "-":
        s -= h;
        break;
      case "[":
        m.push({ x: i, y: r, a: s });
        break;
      case "]": {
        const l = m.pop();
        l && (i = l.x, r = l.y, s = l.a);
        break;
      }
    }
  if (e.length === 0) return new Float32Array(0);
  let t = 1 / 0, u = -1 / 0, g = 1 / 0, f = -1 / 0;
  for (let c = 0; c < e.length; c += 4)
    t = Math.min(t, e[c], e[c + 2]), u = Math.max(u, e[c], e[c + 2]), g = Math.min(g, e[c + 1], e[c + 3]), f = Math.max(f, e[c + 1], e[c + 3]);
  const y = u - t || 1, S = f - g || 1, I = Math.min(o * 0.88 / y, a * 0.88 / S), $ = g < 0 && f >= -0.1, B = o / 2;
  let P, E;
  $ ? (P = B - (t + u) / 2 * I, E = a * 0.93 - f * I) : (P = B - (t + u) / 2 * I, E = a / 2 - (g + f) / 2 * I);
  const C = new Float32Array(e.length);
  for (let c = 0; c < e.length; c += 4)
    C[c] = e[c] * I + P, C[c + 1] = e[c + 1] * I + E, C[c + 2] = e[c + 2] * I + P, C[c + 3] = e[c + 3] * I + E;
  return C;
}
function Fn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0;
    const t = {
      segments: new Float32Array(0),
      totalSegments: 0,
      drawnSegments: 0,
      paramHash: "",
      waitTimer: -1
    };
    function u() {
      const { axiom: P, rules: E, iterations: C, angle: c } = o.current;
      return `${P}|${JSON.stringify(E)}|${C}|${c}`;
    }
    function g() {
      const { axiom: P, rules: E, iterations: C, angle: c } = o.current, l = An(P, E, C), v = c * Math.PI / 180;
      t.segments = Bn(l, v, m, e), t.totalSegments = t.segments.length / 4, t.drawnSegments = 0, t.waitTimer = -1, t.paramHash = u();
    }
    function f() {
      s.globalAlpha = 1, s.shadowBlur = 0, s.fillStyle = o.current.backgroundColor, s.fillRect(0, 0, m, e);
    }
    function y(P, E) {
      const C = window.devicePixelRatio || 1;
      m = P, e = E, i.width = Math.round(m * C), i.height = Math.round(e * C), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(C, 0, 0, C, 0, 0), f(), g();
    }
    const S = new ResizeObserver((P) => {
      const { width: E, height: C } = P[0].contentRect;
      E > 0 && C > 0 && y(E, C);
    });
    S.observe(r);
    const I = r.getBoundingClientRect();
    I.width > 0 && I.height > 0 && y(I.width, I.height);
    let $ = 0;
    function B(P) {
      const E = $ ? Math.min(P - $, 50) : 16;
      $ = P;
      const {
        color: C,
        backgroundColor: c,
        lineWidth: l,
        speed: v,
        autoReset: R,
        trailFade: x,
        glowEffect: F,
        glowBlur: M
      } = o.current;
      u() !== t.paramHash && (f(), g());
      const { segments: L, totalSegments: w } = t;
      if (t.waitTimer > 0) {
        t.waitTimer -= E, x > 0 && (s.globalAlpha = Math.min(1, x * (E / 16)), s.shadowBlur = 0, s.fillStyle = c, s.fillRect(0, 0, m, e), s.globalAlpha = 1), t.waitTimer <= 0 && (t.waitTimer = -1, x === 0 && f(), t.drawnSegments = 0), a.current = requestAnimationFrame(B);
        return;
      }
      const p = Math.max(1, Math.round(v * (E / 16))), d = Math.min(t.drawnSegments + p, w);
      s.strokeStyle = C, s.lineWidth = l, s.lineCap = "round", F ? (s.shadowColor = C, s.shadowBlur = M) : s.shadowBlur = 0;
      for (let b = t.drawnSegments; b < d; b++) {
        const A = L[b * 4], T = L[b * 4 + 1], D = L[b * 4 + 2], z = L[b * 4 + 3];
        s.beginPath(), s.moveTo(A, T), s.lineTo(D, z), s.stroke();
      }
      s.shadowBlur = 0, t.drawnSegments = d, t.drawnSegments >= w && R && (t.waitTimer = 1200), a.current = requestAnimationFrame(B);
    }
    return a.current = requestAnimationFrame(B), () => {
      S.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const ye = {
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
}, Pn = ht(
  (n, h) => {
    const {
      preset: o,
      axiom: a,
      rules: i,
      iterations: r,
      angle: s,
      lineWidth: m,
      color: e,
      backgroundColor: t,
      speed: u,
      autoReset: g,
      trailFade: f,
      glowEffect: y,
      glowBlur: S,
      width: I,
      height: $,
      className: B,
      style: P
    } = n, E = ye[o ?? "default"] ?? ye.default, C = X(null);
    return gt(h, () => C.current), Fn(C, {
      axiom: a ?? E.axiom,
      rules: i ?? E.rules,
      iterations: r ?? E.iterations,
      angle: s ?? E.angle,
      lineWidth: m ?? 1,
      color: e ?? "#ffffff",
      backgroundColor: t ?? "#111111",
      speed: u ?? 5,
      autoReset: g ?? !0,
      trailFade: f ?? 0,
      glowEffect: y ?? !1,
      glowBlur: S ?? 8
    }), /* @__PURE__ */ at(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          ...P
        },
        children: /* @__PURE__ */ at(
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
Pn.displayName = "LSystem";
const bt = new Uint8Array(512);
(function() {
  const h = new Uint8Array(256);
  for (let a = 0; a < 256; a++) h[a] = a;
  let o = 12345;
  for (let a = 255; a > 0; a--) {
    o = o * 1664525 + 1013904223 >>> 0;
    const i = o % (a + 1);
    [h[a], h[i]] = [h[i], h[a]];
  }
  for (let a = 0; a < 256; a++) bt[a] = bt[a + 256] = h[a];
})();
function we(n) {
  return n * n * (3 - 2 * n);
}
function In(n, h) {
  const o = Math.floor(n) & 255, a = Math.floor(h) & 255, i = n - Math.floor(n), r = h - Math.floor(h), s = we(i), m = we(r), e = bt[bt[o] + a & 255] / 255, t = bt[bt[o + 1] + a & 255] / 255, u = bt[bt[o] + a + 1 & 255] / 255, g = bt[bt[o + 1] + a + 1 & 255] / 255, f = e + (t - e) * s, y = u + (g - u) * s;
  return f + (y - f) * m;
}
function $n(n, h, o = 3) {
  let a = 0, i = 0.5, r = 1;
  for (let s = 0; s < o; s++)
    a += In(n * r, h * r) * i, i *= 0.5, r *= 2;
  return a;
}
const Ht = Math.PI * 2;
function Ln(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0;
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
    function u(B, P) {
      const { resolution: E } = o.current, C = Math.max(1, Math.round(B * E)), c = Math.max(1, Math.round(P * E));
      t.gridW = C, t.gridH = c;
      const l = new OffscreenCanvas(C, c), v = l.getContext("2d");
      t.offscreen = l, t.offCtx = v, t.imageData = v.createImageData(C, c);
    }
    function g(B, P) {
      const E = window.devicePixelRatio || 1;
      m = B, e = P, i.width = Math.round(m * E), i.height = Math.round(e * E), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(E, 0, 0, E, 0, 0), u(m, e);
    }
    const f = new ResizeObserver((B) => {
      const { width: P, height: E } = B[0].contentRect;
      P > 0 && E > 0 && g(P, E);
    });
    f.observe(r);
    const y = r.getBoundingClientRect();
    y.width > 0 && y.height > 0 && g(y.width, y.height);
    let S = 0, I = -1;
    function $(B) {
      const P = S ? Math.min(B - S, 50) : 16;
      S = B;
      const {
        segments: E,
        speed: C,
        colorA: c,
        colorB: l,
        backgroundColor: v,
        noiseScale: R,
        zoomSpeed: x,
        rotation: F,
        resolution: M,
        animated: k
      } = o.current;
      if (M !== I && (u(m, e), I = M), !k) {
        a.current = requestAnimationFrame($);
        return;
      }
      const { gridW: L, gridH: w, imageData: p, offscreen: d, offCtx: b } = t;
      if (!p || !d || !b) {
        a.current = requestAnimationFrame($);
        return;
      }
      const A = p.data, T = L / 2, D = w / 2, z = Math.min(T, D), O = Math.max(2, Math.round(E)), W = Ht / O, Y = W / 2, q = t.rotAngle, H = t.zoomPhase, G = t.time, [U, j, N] = yt([v], 0);
      for (let Z = 0; Z < w; Z++)
        for (let nt = 0; nt < L; nt++) {
          const rt = nt - T, st = Z - D, tt = Math.sqrt(rt * rt + st * st);
          if (tt > z) {
            const wt = (Z * L + nt) * 4;
            A[wt] = U, A[wt + 1] = j, A[wt + 2] = N, A[wt + 3] = 255;
            continue;
          }
          let Q = Math.atan2(st, rt) - q;
          Q = (Q % Ht + Ht) % Ht;
          let _ = Q % W;
          _ > Y && (_ = W - _);
          const ot = tt / z * R + H, V = _ * 8 + G * C, it = ($n(ot, V) * 2 - 1 + 1) / 2, [ct, lt, ft] = yt([l, c], it), mt = (Z * L + nt) * 4;
          A[mt] = ct, A[mt + 1] = lt, A[mt + 2] = ft, A[mt + 3] = 255;
        }
      b.putImageData(p, 0, 0), s.drawImage(d, 0, 0, m, e);
      const K = P / 16;
      t.time += 0.02 * C * K, t.rotAngle += F * Math.PI / 180 * K, t.zoomPhase += x * 0.015 * K, a.current = requestAnimationFrame($);
    }
    return a.current = requestAnimationFrame($), () => {
      f.disconnect(), cancelAnimationFrame(a.current);
    };
  }, [n]);
}
const Dn = {
  default: {},
  neon: { colorA: "#00ffff", colorB: "#ff00ff", backgroundColor: "#000000", segments: 8, speed: 1.5 },
  crystal: { colorA: "#88ccff", colorB: "#002244", backgroundColor: "#000510", segments: 12, noiseScale: 4 },
  void: { colorA: "#cc00ff", colorB: "#000000", backgroundColor: "#000000", segments: 6, rotation: 0.4 },
  fire: { colorA: "#ff8800", colorB: "#ff0000", backgroundColor: "#0a0000", segments: 6, speed: 2 },
  ice: { colorA: "#ffffff", colorB: "#002255", backgroundColor: "#000510", segments: 10, noiseScale: 2, zoomSpeed: 0.5 }
}, Tn = ht(
  (n, h) => {
    const {
      preset: o,
      segments: a,
      speed: i,
      colorA: r,
      colorB: s,
      backgroundColor: m,
      noiseScale: e,
      zoomSpeed: t,
      rotation: u,
      resolution: g,
      animated: f,
      width: y,
      height: S,
      className: I,
      style: $
    } = n, B = o && Dn[o] || {}, P = X(null);
    return gt(h, () => P.current), Ln(P, {
      segments: a ?? B.segments ?? 8,
      speed: i ?? B.speed ?? 1,
      colorA: r ?? B.colorA ?? "#e0e0ff",
      colorB: s ?? B.colorB ?? "#1a0a2e",
      backgroundColor: m ?? B.backgroundColor ?? "#111111",
      noiseScale: e ?? B.noiseScale ?? 2.5,
      zoomSpeed: t ?? B.zoomSpeed ?? 0.3,
      rotation: u ?? B.rotation ?? 0.2,
      resolution: g ?? 0.5,
      animated: f ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: I,
        style: {
          width: y ?? "100%",
          height: S ?? "100%",
          display: "block",
          overflow: "hidden",
          ...$
        },
        children: /* @__PURE__ */ at(
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
Tn.displayName = "Kaleidoscope";
function zn(n, h, o) {
  return n.map((a, i) => {
    if (h === "cycle") {
      const s = a.hue / 60 % 6, m = s - Math.floor(s), e = 0, t = Math.round(255 * (1 - m) * 0.75), u = Math.round(255 * m * 0.75), g = 192, f = Math.floor(s);
      return (() => {
        switch (f) {
          case 0:
            return [g, u, e];
          case 1:
            return [t, g, e];
          case 2:
            return [e, g, u];
          case 3:
            return [e, t, g];
          case 4:
            return [u, e, g];
          default:
            return [g, e, t];
        }
      })();
    }
    if (h === "gradient") {
      const r = i / Math.max(1, n.length - 1);
      return yt([o, "#6b7280"], r);
    }
    return yt([o], 0);
  });
}
function qn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0;
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
    function u(M, k, L) {
      const w = [];
      for (let p = 0; p < L; p++)
        w.push({
          gx: Math.random() * M,
          gy: Math.random() * k,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          hue: p / L * 360
        });
      return w;
    }
    function g(M, k) {
      const { resolution: L, cellCount: w } = o.current, p = Math.max(1, Math.round(M * L)), d = Math.max(1, Math.round(k * L));
      t.gridW = p, t.gridH = d, t.cellIds = new Int16Array(p * d);
      const b = new OffscreenCanvas(p, d), A = b.getContext("2d");
      if (t.offscreen = b, t.offCtx = A, t.imageData = A.createImageData(p, d), t.seeds.length === 0)
        t.seeds = u(p, d, w);
      else {
        const T = t.gridW || p, D = t.gridH || d;
        for (const z of t.seeds)
          z.gx = z.gx / T * p, z.gy = z.gy / D * d;
      }
    }
    function f(M, k) {
      const L = window.devicePixelRatio || 1;
      m = M, e = k, i.width = Math.round(m * L), i.height = Math.round(e * L), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(L, 0, 0, L, 0, 0), g(m, e);
    }
    let y = !1, S = 0, I = 0;
    function $(M, k) {
      const { resolution: L } = o.current;
      return [M * L, k * L];
    }
    function B(M, k) {
      let L = -1, w = 1 / 0;
      for (let p = 0; p < t.seeds.length; p++) {
        const d = t.seeds[p], b = M - d.gx, A = k - d.gy, T = b * b + A * A;
        T < w && (w = T, L = p);
      }
      return L;
    }
    function P(M) {
      if (!o.current.interactive) return;
      const k = i.getBoundingClientRect(), L = M.clientX - k.left, w = M.clientY - k.top, [p, d] = $(L, w);
      S = p, I = d, y = !0;
      const b = B(p, d);
      if (b >= 0) {
        const A = t.seeds[b], T = p - A.gx, D = d - A.gy, z = (t.gridW * 0.15) ** 2;
        T * T + D * D < z && (t.dragIdx = b, t.isDragging = !0);
      }
      t.mouseGX = p, t.mouseGY = d;
    }
    function E(M) {
      if (!o.current.interactive) return;
      const k = i.getBoundingClientRect(), L = M.clientX - k.left, w = M.clientY - k.top, [p, d] = $(L, w);
      t.mouseGX = p, t.mouseGY = d, y && t.isDragging && t.dragIdx >= 0 && (t.seeds[t.dragIdx].gx = Math.max(0, Math.min(t.gridW - 1, p)), t.seeds[t.dragIdx].gy = Math.max(0, Math.min(t.gridH - 1, d)));
    }
    function C(M) {
      if (!o.current.interactive) return;
      const k = i.getBoundingClientRect(), L = M.clientX - k.left, w = M.clientY - k.top, [p, d] = $(L, w), b = Math.abs(p - S) + Math.abs(d - I);
      if (!t.isDragging && b < 2) {
        const { cellCount: A } = o.current;
        if (t.seeds.length < A * 2) {
          const T = t.seeds.length / (A || 1) * 360;
          t.seeds.push({
            gx: Math.max(0, Math.min(t.gridW - 1, p)),
            gy: Math.max(0, Math.min(t.gridH - 1, d)),
            vx: 0,
            vy: 0,
            hue: T
          });
        }
      }
      y = !1, t.isDragging = !1, t.dragIdx = -1;
    }
    i.addEventListener("mousedown", P), i.addEventListener("mousemove", E), i.addEventListener("mouseup", C);
    const c = new ResizeObserver((M) => {
      const { width: k, height: L } = M[0].contentRect;
      k > 0 && L > 0 && f(k, L);
    });
    c.observe(r);
    const l = r.getBoundingClientRect();
    l.width > 0 && l.height > 0 && f(l.width, l.height);
    let v = 0, R = -1, x = -1;
    function F(M) {
      const k = v ? Math.min(M - v, 50) : 16;
      v = M;
      const {
        cellCount: L,
        speed: w,
        colorMode: p,
        cellColor: d,
        backgroundColor: b,
        showEdges: A,
        edgeColor: T,
        resolution: D,
        relaxation: z,
        animated: O
      } = o.current;
      if (D !== R)
        t.seeds = [], g(m, e), R = D, x = L;
      else if (L !== x) {
        if (L > t.seeds.length) {
          const { gridW: _, gridH: J } = t;
          for (; t.seeds.length < L; ) {
            const ot = t.seeds.length;
            t.seeds.push({
              gx: Math.random() * _,
              gy: Math.random() * J,
              vx: (Math.random() - 0.5) * 0.3,
              vy: (Math.random() - 0.5) * 0.3,
              hue: ot / L * 360
            });
          }
        } else
          t.seeds.length = L;
        x = L;
      }
      const { seeds: W, gridW: Y, gridH: q, imageData: H, offscreen: G, offCtx: U, cellIds: j } = t;
      if (!H || !G || !U || W.length === 0) {
        a.current = requestAnimationFrame(F);
        return;
      }
      if (O) {
        const _ = k / 16;
        for (const J of W)
          t.isDragging && W.indexOf(J) === t.dragIdx || (J.vx += (Math.random() - 0.5) * 0.05 * w, J.vy += (Math.random() - 0.5) * 0.05 * w, J.vx = Math.max(-0.5 * w, Math.min(0.5 * w, J.vx)), J.vy = Math.max(-0.5 * w, Math.min(0.5 * w, J.vy)), J.gx += J.vx * _, J.gy += J.vy * _, J.gx < 0 && (J.gx = 0, J.vx = Math.abs(J.vx)), J.gx >= Y && (J.gx = Y - 1, J.vx = -Math.abs(J.vx)), J.gy < 0 && (J.gy = 0, J.vy = Math.abs(J.vy)), J.gy >= q && (J.gy = q - 1, J.vy = -Math.abs(J.vy)));
      }
      const N = zn(W, p, d), [K, Z, nt] = yt([b], 0), [rt, st, tt] = yt([T], 0), Q = H.data;
      for (let _ = 0; _ < q; _++)
        for (let J = 0; J < Y; J++) {
          let ot = 1 / 0, V = 0;
          for (let ft = 0; ft < W.length; ft++) {
            const mt = J - W[ft].gx, wt = _ - W[ft].gy, vt = mt * mt + wt * wt;
            vt < ot && (ot = vt, V = ft);
          }
          j[_ * Y + J] = V;
          const [et, it, ct] = N[V], lt = (_ * Y + J) * 4;
          Q[lt] = et, Q[lt + 1] = it, Q[lt + 2] = ct, Q[lt + 3] = 255;
        }
      if (O && z > 0) {
        const _ = new Float32Array(W.length), J = new Float32Array(W.length), ot = new Uint32Array(W.length);
        for (let V = 0; V < q; V++)
          for (let et = 0; et < Y; et++) {
            const it = j[V * Y + et];
            _[it] += et, J[it] += V, ot[it]++;
          }
        for (let V = 0; V < W.length; V++)
          t.isDragging && V === t.dragIdx || ot[V] > 0 && (W[V].gx += (_[V] / ot[V] - W[V].gx) * z, W[V].gy += (J[V] / ot[V] - W[V].gy) * z);
      }
      if (A)
        for (let _ = 0; _ < q; _++)
          for (let J = 0; J < Y; J++) {
            const ot = j[_ * Y + J];
            if (J > 0 && j[_ * Y + J - 1] !== ot || _ > 0 && j[(_ - 1) * Y + J] !== ot) {
              const et = (_ * Y + J) * 4;
              Q[et] = rt, Q[et + 1] = st, Q[et + 2] = tt, Q[et + 3] = 255;
            }
          }
      if (U.putImageData(H, 0, 0), s.drawImage(G, 0, 0, m, e), o.current.interactive) {
        s.save();
        for (let _ = 0; _ < W.length; _++) {
          const J = W[_].gx / Y * m, ot = W[_].gy / q * e;
          s.beginPath(), s.arc(J, ot, 3, 0, Math.PI * 2), s.fillStyle = "rgba(255,255,255,0.5)", s.fill();
        }
        s.restore();
      }
      a.current = requestAnimationFrame(F);
    }
    return a.current = requestAnimationFrame(F), () => {
      c.disconnect(), cancelAnimationFrame(a.current), i.removeEventListener("mousedown", P), i.removeEventListener("mousemove", E), i.removeEventListener("mouseup", C);
    };
  }, [n]);
}
const Wn = {
  default: {},
  "stained-glass": { colorMode: "cycle", edgeColor: "#111111", cellCount: 25 },
  neon: { colorMode: "cycle", backgroundColor: "#000000", edgeColor: "#000000", showEdges: !1 },
  frost: { colorMode: "gradient", cellColor: "#88ccff", backgroundColor: "#001833", edgeColor: "#ffffff" },
  ember: { colorMode: "cycle", backgroundColor: "#0a0200", edgeColor: "#0a0200", showEdges: !1 },
  void: { cellColor: "#ffffff", backgroundColor: "#000000", showEdges: !1 }
}, On = ht(
  (n, h) => {
    const {
      preset: o,
      cellCount: a,
      speed: i,
      colorMode: r,
      cellColor: s,
      backgroundColor: m,
      showEdges: e,
      edgeColor: t,
      resolution: u,
      relaxation: g,
      interactive: f,
      animated: y,
      width: S,
      height: I,
      className: $,
      style: B
    } = n, P = o && Wn[o] || {}, E = X(null);
    return gt(h, () => E.current), qn(E, {
      cellCount: a ?? P.cellCount ?? 20,
      speed: i ?? 1,
      colorMode: r ?? P.colorMode ?? "solid",
      cellColor: s ?? P.cellColor ?? "#ffffff",
      backgroundColor: m ?? P.backgroundColor ?? "#111111",
      showEdges: e ?? P.showEdges ?? !0,
      edgeColor: t ?? P.edgeColor ?? "#333333",
      resolution: u ?? 1,
      relaxation: g ?? 0.05,
      interactive: f ?? !0,
      animated: y ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: $,
        style: {
          width: S ?? "100%",
          height: I ?? "100%",
          display: "block",
          overflow: "hidden",
          ...B
        },
        children: /* @__PURE__ */ at(
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
On.displayName = "VoronoiCells";
const Nt = Math.PI * 2;
function Xn(n, h) {
  const o = X(h);
  o.current = h;
  const a = X(0);
  dt(() => {
    const i = n.current;
    if (!i) return;
    const r = i.parentElement;
    if (!r) return;
    const s = i.getContext("2d");
    let m = 0, e = 0;
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
    function u(C, c, l, v, R) {
      const x = Math.round(v), F = Math.round(R);
      return x < 0 || x >= c || F < 0 || F >= l ? 0 : C[F * c + x];
    }
    function g(C, c) {
      const { resolution: l, agentCount: v } = o.current, R = Math.max(1, Math.round(C * l)), x = Math.max(1, Math.round(c * l));
      t.gridW = R, t.gridH = x, t.trail = new Float32Array(R * x), t.nextTrail = new Float32Array(R * x);
      const F = v;
      t.agents = new Float32Array(F * 3);
      const M = R / 2, k = x / 2, L = Math.min(R, x) * 0.25;
      for (let d = 0; d < F; d++) {
        const b = Math.random() * Nt, A = Math.random() * L;
        t.agents[d * 3] = M + Math.cos(b) * A, t.agents[d * 3 + 1] = k + Math.sin(b) * A, t.agents[d * 3 + 2] = Math.random() * Nt;
      }
      const w = new OffscreenCanvas(R, x), p = w.getContext("2d");
      t.offscreen = w, t.offCtx = p, t.imageData = p.createImageData(R, x);
    }
    function f(C, c) {
      const l = window.devicePixelRatio || 1;
      m = C, e = c, i.width = Math.round(m * l), i.height = Math.round(e * l), i.style.width = `${m}px`, i.style.height = `${e}px`, s.setTransform(l, 0, 0, l, 0, 0), g(m, e);
    }
    function y(C) {
      if (!o.current.interactive) return;
      const c = i.getBoundingClientRect(), l = C.clientX - c.left, v = C.clientY - c.top, { resolution: R } = o.current;
      t.mouseGX = l * R, t.mouseGY = v * R, t.mouseActive = !0;
    }
    function S() {
      t.mouseActive = !1;
    }
    i.addEventListener("mousemove", y), i.addEventListener("mouseleave", S);
    const I = new ResizeObserver((C) => {
      const { width: c, height: l } = C[0].contentRect;
      c > 0 && l > 0 && f(c, l);
    });
    I.observe(r);
    const $ = r.getBoundingClientRect();
    $.width > 0 && $.height > 0 && f($.width, $.height);
    let B = -1, P = -1;
    function E(C) {
      const {
        agentCount: c,
        sensorAngle: l,
        sensorDistance: v,
        stepSize: R,
        rotateSpeed: x,
        trailDecay: F,
        diffuseStrength: M,
        trailColor: k,
        backgroundColor: L,
        resolution: w,
        interactive: p,
        mouseRadius: d,
        mouseStrength: b,
        animated: A
      } = o.current;
      if (w !== B)
        g(m, e), B = w, P = c;
      else if (c !== P) {
        const tt = c, Q = t.agents, _ = new Float32Array(tt * 3), J = t.gridW, ot = t.gridH;
        if (tt > Q.length / 3) {
          _.set(Q);
          for (let V = Q.length / 3; V < tt; V++) {
            const et = Math.random() * Nt, it = Math.random() * Math.min(J, ot) * 0.25;
            _[V * 3] = J / 2 + Math.cos(et) * it, _[V * 3 + 1] = ot / 2 + Math.sin(et) * it, _[V * 3 + 2] = Math.random() * Nt;
          }
        } else
          _.set(Q.subarray(0, tt * 3));
        t.agents = _, P = c;
      }
      if (!A) {
        a.current = requestAnimationFrame(E);
        return;
      }
      const { agents: T, trail: D, nextTrail: z, gridW: O, gridH: W, imageData: Y, offscreen: q, offCtx: H } = t;
      if (!Y || !q || !H) {
        a.current = requestAnimationFrame(E);
        return;
      }
      const G = l * Math.PI / 180, U = x * Math.PI / 180, j = c;
      for (let tt = 0; tt < j; tt++) {
        const Q = T[tt * 3], _ = T[tt * 3 + 1], J = Math.round(Q), ot = Math.round(_);
        J >= 0 && J < O && ot >= 0 && ot < W && (D[ot * O + J] += 1);
      }
      if (p && t.mouseActive) {
        const tt = d * w, Q = tt * tt, _ = t.mouseGX, J = t.mouseGY, ot = Math.max(0, Math.floor(_ - tt)), V = Math.min(O - 1, Math.ceil(_ + tt)), et = Math.max(0, Math.floor(J - tt)), it = Math.min(W - 1, Math.ceil(J + tt));
        for (let ct = et; ct <= it; ct++)
          for (let lt = ot; lt <= V; lt++) {
            const ft = lt - _, mt = ct - J;
            ft * ft + mt * mt <= Q && (D[ct * O + lt] += b);
          }
      }
      const N = M, K = 1 - N;
      for (let tt = 0; tt < W; tt++)
        for (let Q = 0; Q < O; Q++) {
          let _ = 0, J = 0;
          for (let ot = -1; ot <= 1; ot++)
            for (let V = -1; V <= 1; V++) {
              const et = Q + V, it = tt + ot;
              et >= 0 && et < O && it >= 0 && it < W && (_ += D[it * O + et], J++);
            }
          z[tt * O + Q] = (D[tt * O + Q] * K + _ / J * N) * F;
        }
      const Z = t.trail;
      t.trail = t.nextTrail, t.nextTrail = Z;
      const nt = t.trail;
      for (let tt = 0; tt < j; tt++) {
        const Q = T[tt * 3], _ = T[tt * 3 + 1], J = T[tt * 3 + 2], ot = u(
          nt,
          O,
          W,
          Q + Math.cos(J - G) * v,
          _ + Math.sin(J - G) * v
        ), V = u(
          nt,
          O,
          W,
          Q + Math.cos(J) * v,
          _ + Math.sin(J) * v
        ), et = u(
          nt,
          O,
          W,
          Q + Math.cos(J + G) * v,
          _ + Math.sin(J + G) * v
        );
        let it = J;
        V > ot && V > et || (ot > et ? it -= U : et > ot ? it += U : it += (Math.random() - 0.5) * U), it += (Math.random() - 0.5) * 0.1;
        let ct = Q + Math.cos(it) * R, lt = _ + Math.sin(it) * R;
        ct < 0 && (ct += O), ct >= O && (ct -= O), lt < 0 && (lt += W), lt >= W && (lt -= W), T[tt * 3] = ct, T[tt * 3 + 1] = lt, T[tt * 3 + 2] = it;
      }
      const rt = Y.data, st = 5;
      for (let tt = 0; tt < W; tt++)
        for (let Q = 0; Q < O; Q++) {
          const _ = Math.min(nt[tt * O + Q] / st, 1), [J, ot, V] = yt([L, k], _), et = (tt * O + Q) * 4;
          rt[et] = J, rt[et + 1] = ot, rt[et + 2] = V, rt[et + 3] = 255;
        }
      H.putImageData(Y, 0, 0), s.drawImage(q, 0, 0, m, e), a.current = requestAnimationFrame(E);
    }
    return a.current = requestAnimationFrame(E), () => {
      I.disconnect(), cancelAnimationFrame(a.current), i.removeEventListener("mousemove", y), i.removeEventListener("mouseleave", S);
    };
  }, [n]);
}
const Yn = {
  default: {},
  neon: { trailColor: "#00ffff", backgroundColor: "#000000" },
  coral: { trailColor: "#ff8844", backgroundColor: "#0a0200" },
  vein: { trailColor: "#ff2244", backgroundColor: "#080000", agentCount: 3e3 },
  frost: { trailColor: "#88ddff", backgroundColor: "#000a10" },
  gold: { trailColor: "#ffcc44", backgroundColor: "#0a0800" }
}, Gn = ht(
  (n, h) => {
    const {
      preset: o,
      agentCount: a,
      sensorAngle: i,
      sensorDistance: r,
      stepSize: s,
      rotateSpeed: m,
      trailDecay: e,
      diffuseStrength: t,
      trailColor: u,
      backgroundColor: g,
      resolution: f,
      interactive: y,
      mouseRadius: S,
      mouseStrength: I,
      animated: $,
      width: B,
      height: P,
      className: E,
      style: C
    } = n, c = o && Yn[o] || {}, l = X(null);
    return gt(h, () => l.current), Xn(l, {
      agentCount: a ?? c.agentCount ?? 1800,
      sensorAngle: i ?? 45,
      sensorDistance: r ?? 9,
      stepSize: s ?? 1.5,
      rotateSpeed: m ?? 45,
      trailDecay: e ?? c.trailDecay ?? 0.92,
      diffuseStrength: t ?? 0.2,
      trailColor: u ?? c.trailColor ?? "#ffffff",
      backgroundColor: g ?? c.backgroundColor ?? "#111111",
      resolution: f ?? 0.35,
      interactive: y ?? !0,
      mouseRadius: S ?? 20,
      mouseStrength: I ?? 3,
      animated: $ ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: E,
        style: {
          width: B ?? "100%",
          height: P ?? "100%",
          display: "block",
          overflow: "hidden",
          ...C
        },
        children: /* @__PURE__ */ at(
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
Gn.displayName = "SlimeMold";
function Hn(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = 0, u = new Float32Array(0), g = new Float32Array(0), f = null;
    const y = document.createElement("canvas"), S = y.getContext("2d");
    let I = 0, $ = 0, B = -1;
    function P() {
      const { resolution: w } = o.current;
      w === B && e > 0 || (B = w, e = Math.max(1, Math.round(s * w)), t = Math.max(1, Math.round(m * w)), u = new Float32Array(e * t), g = new Float32Array(e * t), y.width = e, y.height = t, f = S.createImageData(e, t));
    }
    function E(w, p) {
      const d = window.devicePixelRatio || 1;
      s = w, m = p, a.width = Math.round(w * d), a.height = Math.round(p * d), a.style.width = `${w}px`, a.style.height = `${p}px`, r.scale(d, d), B = -1, P();
    }
    const C = new ResizeObserver((w) => {
      const { width: p, height: d } = w[0].contentRect;
      p > 0 && d > 0 && E(p, d);
    });
    C.observe(i);
    const c = i.getBoundingClientRect();
    c.width > 0 && c.height > 0 && E(c.width, c.height);
    function l(w, p) {
      if (e === 0 || t === 0) return;
      const { inkRadius: d, inkStrength: b, resolution: A } = o.current, T = Math.round(w * A), D = Math.round(p * A), z = Math.max(1, Math.round(d * A)), O = z * z;
      for (let W = -z; W <= z; W++)
        for (let Y = -z; Y <= z; Y++) {
          const q = Y * Y + W * W;
          if (q > O) continue;
          const H = T + Y, G = D + W;
          if (H < 0 || H >= e || G < 0 || G >= t) continue;
          const U = Math.exp(-q / (O * 0.5)), j = G * e + H;
          u[j] = Math.min(1, u[j] + b * U);
        }
    }
    let v = !1;
    function R(w) {
      if (!o.current.interactive) return;
      v = !0;
      const p = a.getBoundingClientRect();
      l(w.clientX - p.left, w.clientY - p.top);
    }
    function x(w) {
      if (!o.current.interactive || !v) return;
      const p = a.getBoundingClientRect();
      l(w.clientX - p.left, w.clientY - p.top);
    }
    function F() {
      v = !1;
    }
    function M(w) {
      if (!o.current.interactive) return;
      w.preventDefault();
      const p = a.getBoundingClientRect();
      l(w.touches[0].clientX - p.left, w.touches[0].clientY - p.top);
    }
    function k(w) {
      if (!o.current.interactive) return;
      w.preventDefault();
      const p = a.getBoundingClientRect();
      l(w.touches[0].clientX - p.left, w.touches[0].clientY - p.top);
    }
    i.addEventListener("mousedown", R), i.addEventListener("mousemove", x), window.addEventListener("mouseup", F), i.addEventListener("touchstart", M, { passive: !1 }), i.addEventListener("touchmove", k, { passive: !1 });
    function L(w) {
      const { diffusionRate: p, viscosity: d, evaporationRate: b, inkColor: A, paperColor: T, glowEffect: D, glowBlur: z, autoInk: O, autoInkInterval: W, animated: Y } = o.current;
      if (P(), O && s > 0 && w - $ > W && ($ = w, l(Math.random() * s, Math.random() * m)), Y && f && e > 0) {
        const q = p * (1 - d * 0.4);
        for (let _ = 0; _ < t; _++)
          for (let J = 0; J < e; J++) {
            const ot = _ * e + J;
            let V = 0, et = 0;
            for (let it = -1; it <= 1; it++)
              for (let ct = -1; ct <= 1; ct++) {
                const lt = J + ct, ft = _ + it;
                if (lt < 0 || lt >= e || ft < 0 || ft >= t) continue;
                const mt = ct === 0 && it === 0 ? 4 : ct !== 0 && it !== 0 ? 0.7 : 1;
                V += u[ft * e + lt] * mt, et += mt;
              }
            g[ot] = u[ot] + (V / et - u[ot]) * q, g[ot] *= 1 - b, g[ot] < 0 ? g[ot] = 0 : g[ot] > 1 && (g[ot] = 1);
          }
        const H = u;
        u = g, g = H;
        const [G, U, j] = yt([T], 0), [N, K, Z] = yt([A], 0), nt = N - G, rt = K - U, st = Z - j, tt = f.data, Q = e * t;
        for (let _ = 0; _ < Q; _++) {
          const J = u[_], ot = _ * 4;
          tt[ot] = G + nt * J | 0, tt[ot + 1] = U + rt * J | 0, tt[ot + 2] = j + st * J | 0, tt[ot + 3] = 255;
        }
        S.putImageData(f, 0, 0), r.save(), D && (r.shadowBlur = z, r.shadowColor = A), r.imageSmoothingEnabled = !0, r.imageSmoothingQuality = "medium", r.drawImage(y, 0, 0, s, m), r.restore();
      }
      I = requestAnimationFrame(L);
    }
    return I = requestAnimationFrame(L), () => {
      C.disconnect(), cancelAnimationFrame(I), i.removeEventListener("mousedown", R), i.removeEventListener("mousemove", x), window.removeEventListener("mouseup", F), i.removeEventListener("touchstart", M), i.removeEventListener("touchmove", k);
    };
  }, [n]);
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
}, Un = ht(
  (n, h) => {
    const {
      preset: o,
      inkColor: a,
      paperColor: i,
      diffusionRate: r,
      viscosity: s,
      evaporationRate: m,
      inkRadius: e,
      inkStrength: t,
      interactive: u,
      autoInk: g,
      autoInkInterval: f,
      resolution: y,
      glowEffect: S,
      glowBlur: I,
      animated: $,
      width: B,
      height: P,
      className: E,
      style: C
    } = n, c = o && Nn[o] || {}, l = X(null);
    return gt(h, () => l.current), Hn(l, {
      inkColor: a ?? c.inkColor ?? "#ffffff",
      paperColor: i ?? c.paperColor ?? "#111111",
      diffusionRate: r ?? c.diffusionRate ?? 0.3,
      viscosity: s ?? c.viscosity ?? 0.8,
      evaporationRate: m ?? c.evaporationRate ?? 2e-3,
      inkRadius: e ?? 8,
      inkStrength: t ?? 1,
      interactive: u ?? !0,
      autoInk: g ?? !0,
      autoInkInterval: f ?? 2e3,
      resolution: y ?? 0.5,
      glowEffect: S ?? c.glowEffect ?? !1,
      glowBlur: I ?? c.glowBlur ?? 8,
      animated: $ ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: E,
        style: {
          width: B ?? "100%",
          height: P ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: u ?? !0 ? "crosshair" : "default",
          ...C
        },
        children: /* @__PURE__ */ at(
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
Un.displayName = "InkBleed";
const xe = 24;
function jn(n) {
  return Array.from({ length: xe }, () => 1 + (Math.random() * 2 - 1) * n);
}
function ve(n, h, o, a, i) {
  const r = xe;
  n.beginPath();
  for (let s = 0; s <= r; s++) {
    const m = s % r, e = m / r * Math.PI * 2, t = a * i[m], u = h + Math.cos(e) * t, g = o + Math.sin(e) * t;
    s === 0 ? n.moveTo(u, g) : n.lineTo(u, g);
  }
  n.closePath();
}
function Vn(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = 0;
    const u = [];
    function g(E, C) {
      const c = window.devicePixelRatio || 1;
      s = E, m = C, a.width = Math.round(E * c), a.height = Math.round(C * c), a.style.width = `${E}px`, a.style.height = `${C}px`, r.scale(c, c);
    }
    const f = new ResizeObserver((E) => {
      const { width: C, height: c } = E[0].contentRect;
      C > 0 && c > 0 && g(C, c);
    });
    f.observe(i);
    const y = i.getBoundingClientRect();
    y.width > 0 && y.height > 0 && g(y.width, y.height);
    function S(E, C) {
      const { colors: c, bloomRadius: l, noiseAmount: v, maxBlooms: R } = o.current;
      u.length >= R && u.splice(0, 1), u.push({
        x: E,
        y: C,
        colorIdx: Math.floor(Math.random() * c.length),
        radius: 0,
        maxRadius: l * (0.7 + Math.random() * 0.6),
        opacity: o.current.opacity,
        noiseRadii: jn(v),
        born: !1
      });
    }
    function I(E) {
      if (!o.current.interactive) return;
      const C = a.getBoundingClientRect();
      S(E.clientX - C.left, E.clientY - C.top);
    }
    function $(E) {
      if (!o.current.interactive) return;
      E.preventDefault();
      const C = a.getBoundingClientRect();
      S(E.touches[0].clientX - C.left, E.touches[0].clientY - C.top);
    }
    i.addEventListener("mousedown", I), i.addEventListener("touchstart", $, { passive: !1 });
    function B(E) {
      const { colors: C, backgroundColor: c, bloomSpeed: l, opacity: v, wetEdge: R, layerCount: x, fadeSpeed: F, autoBloom: M, autoBloomInterval: k, animated: L } = o.current;
      if (M && s > 0 && E - t > k && (t = E, S(Math.random() * s, Math.random() * m)), !L) {
        e = requestAnimationFrame(B);
        return;
      }
      r.fillStyle = c, r.fillRect(0, 0, s, m), r.save();
      for (let w = u.length - 1; w >= 0; w--) {
        const p = u[w], d = C[p.colorIdx] ?? C[0];
        if (p.radius < p.maxRadius ? p.radius = Math.min(p.maxRadius, p.radius + l * 0.8) : p.opacity = Math.max(0, p.opacity - F), p.opacity <= 0) {
          u.splice(w, 1);
          continue;
        }
        for (let b = 0; b < x; b++) {
          const A = (b + 1) / x, T = p.radius * A, D = b === x - 1, z = p.opacity * (D ? 0.3 + R * 0.7 : 0.08);
          r.fillStyle = Et(d, z), ve(r, p.x, p.y, T, p.noiseRadii), r.fill();
        }
        R > 0.05 && (r.strokeStyle = Et(d, p.opacity * R * 0.4), r.lineWidth = 2 + R * 3, ve(r, p.x, p.y, p.radius * 1.02, p.noiseRadii), r.stroke());
      }
      r.restore(), e = requestAnimationFrame(B);
    }
    const P = setTimeout(() => {
      s > 0 && m > 0 && (S(s * 0.3, m * 0.4), S(s * 0.7, m * 0.6));
    }, 100);
    return e = requestAnimationFrame(B), () => {
      f.disconnect(), cancelAnimationFrame(e), clearTimeout(P), i.removeEventListener("mousedown", I), i.removeEventListener("touchstart", $);
    };
  }, [n]);
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
}, Kn = ht(
  (n, h) => {
    const {
      preset: o,
      colors: a,
      backgroundColor: i,
      bloomRadius: r,
      bloomSpeed: s,
      opacity: m,
      wetEdge: e,
      layerCount: t,
      noiseAmount: u,
      fadeSpeed: g,
      interactive: f,
      autoBloom: y,
      autoBloomInterval: S,
      resolution: I,
      animated: $,
      maxBlooms: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && _n[o] || {}, v = X(null);
    return gt(h, () => v.current), Vn(v, {
      colors: a ?? l.colors ?? ["#ffffff", "#6b7280", "#9ca3af"],
      backgroundColor: i ?? l.backgroundColor ?? "#111111",
      bloomRadius: r ?? l.bloomRadius ?? 80,
      bloomSpeed: s ?? 0.5,
      opacity: m ?? l.opacity ?? 0.15,
      wetEdge: e ?? l.wetEdge ?? 0.4,
      layerCount: t ?? l.layerCount ?? 6,
      noiseAmount: u ?? l.noiseAmount ?? 0.5,
      fadeSpeed: g ?? 1e-3,
      interactive: f ?? !0,
      autoBloom: y ?? !0,
      autoBloomInterval: S ?? 1500,
      resolution: I ?? 0.5,
      animated: $ ?? !0,
      maxBlooms: B ?? 12
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: {
          width: P ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: f ?? !0 ? "crosshair" : "default",
          ...c
        },
        children: /* @__PURE__ */ at(
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
Kn.displayName = "WatercolorBloom";
function be(n) {
  const h = n.replace("#", ""), o = parseInt(h.slice(0, 2), 16) || 0, a = parseInt(h.slice(2, 4), 16) || 0, i = parseInt(h.slice(4, 6), 16) || 0;
  return [o, a, i];
}
function Qn(n, h, o) {
  const a = Math.round(n[0] + (h[0] - n[0]) * o), i = Math.round(n[1] + (h[1] - n[1]) * o), r = Math.round(n[2] + (h[2] - n[2]) * o);
  return `rgb(${a},${i},${r})`;
}
function Jn(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = 0, u = 0, g = 0, f = 0, y = !1;
    function S() {
      t = 0, u = 0, y = !1;
    }
    function I(c, l) {
      const v = window.devicePixelRatio || 1;
      s = c, m = l, a.width = Math.round(c * v), a.height = Math.round(l * v), a.style.width = `${c}px`, a.style.height = `${l}px`, r.scale(v, v), r.fillStyle = o.current.backgroundColor, r.fillRect(0, 0, c, l), S();
    }
    const $ = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && I(l, v);
    });
    $.observe(i);
    const B = i.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P(c, l) {
      const { color: v, color2: R, colorMode: x } = o.current;
      if (x === "cycle")
        return `hsl(${c * 360 % 360},80%,65%)`;
      if (x === "gradient") {
        const F = be(v), M = be(R);
        return Qn(F, M, (Math.sin(l * Math.PI * 2) + 1) * 0.5);
      }
      return v;
    }
    let E = 0;
    function C(c) {
      const l = E ? c - E : 16;
      E = c;
      const { backgroundColor: v, lineWidth: R, trailFade: x, speed: F, damping: M, freq1: k, freq2: L, freq3: w, amplitude: p, glowEffect: d, glowBlur: b, animated: A, autoReset: T } = o.current;
      if (!A) {
        e = requestAnimationFrame(C);
        return;
      }
      r.fillStyle = Et(v, x), r.fillRect(0, 0, s, m);
      const D = Math.max(1, Math.round(F * l * 0.5)), z = s / 2, O = m / 2, W = Math.min(z, O) * p;
      for (let Y = 0; Y < D; Y++) {
        const q = Math.pow(M, u), H = Math.sin(w * t) * Math.PI, G = z + W * Math.sin(k * t + H) * q, U = O + W * Math.sin(L * t) * q;
        if (!y)
          g = G, f = U, y = !0;
        else {
          const j = t * 0.01 % 1, N = t * 5e-3 % 1;
          r.strokeStyle = P(j, N), r.lineWidth = R, r.lineCap = "round", d ? (r.shadowBlur = b, r.shadowColor = o.current.color) : r.shadowBlur = 0, r.beginPath(), r.moveTo(g, f), r.lineTo(G, U), r.stroke();
        }
        if (g = G, f = U, t += 0.02, u++, T && u > 100 && q < 0.01) {
          r.fillStyle = v, r.fillRect(0, 0, s, m), S();
          break;
        }
      }
      e = requestAnimationFrame(C);
    }
    return e = requestAnimationFrame(C), () => {
      $.disconnect(), cancelAnimationFrame(e);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      color: a,
      color2: i,
      backgroundColor: r,
      lineWidth: s,
      trailFade: m,
      speed: e,
      damping: t,
      freq1: u,
      freq2: g,
      freq3: f,
      amplitude: y,
      colorMode: S,
      glowEffect: I,
      glowBlur: $,
      animated: B,
      autoReset: P,
      width: E,
      height: C,
      className: c,
      style: l
    } = n, v = o && Zn[o] || {}, R = X(null);
    return gt(h, () => R.current), Jn(R, {
      color: a ?? v.color ?? "#ffffff",
      color2: i ?? v.color2 ?? "#6b7280",
      backgroundColor: r ?? v.backgroundColor ?? "#111111",
      lineWidth: s ?? v.lineWidth ?? 1,
      trailFade: m ?? v.trailFade ?? 0.01,
      speed: e ?? 1,
      damping: t ?? v.damping ?? 0.9995,
      freq1: u ?? v.freq1 ?? 2,
      freq2: g ?? v.freq2 ?? 3,
      freq3: f ?? v.freq3 ?? 0.01,
      amplitude: y ?? 0.9,
      colorMode: S ?? v.colorMode ?? "solid",
      glowEffect: I ?? v.glowEffect ?? !1,
      glowBlur: $ ?? v.glowBlur ?? 10,
      animated: B ?? !0,
      autoReset: P ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: c,
        style: {
          width: E ?? "100%",
          height: C ?? "100%",
          display: "block",
          overflow: "hidden",
          ...l
        },
        children: /* @__PURE__ */ at(
          "canvas",
          {
            ref: R,
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
const qt = 0, Pt = 1, _t = 2;
function er(n, h) {
  return {
    grid: new Uint8Array(n * h),
    age: new Uint32Array(n * h),
    frontier: /* @__PURE__ */ new Set(),
    frontierArr: [],
    frontierDirty: !1,
    maxAge: 1,
    gridW: n,
    gridH: h
  };
}
function or(n, h) {
  const { grid: o, frontier: a, gridW: i, gridH: r } = n, s = h % i, m = h / i | 0;
  s > 0 && o[h - 1] === qt && (o[h - 1] = Pt, a.add(h - 1), n.frontierDirty = !0), s < i - 1 && o[h + 1] === qt && (o[h + 1] = Pt, a.add(h + 1), n.frontierDirty = !0), m > 0 && o[h - i] === qt && (o[h - i] = Pt, a.add(h - i), n.frontierDirty = !0), m < r - 1 && o[h + i] === qt && (o[h + i] = Pt, a.add(h + i), n.frontierDirty = !0);
}
function jt(n, h, o, a, i) {
  const r = n.gridW / 2, s = n.gridH / 2, m = Math.PI * 2 / a, e = h - r, t = o - s;
  for (let u = 0; u < a; u++) {
    const g = u * m, f = Math.round(r + e * Math.cos(g) - t * Math.sin(g)), y = Math.round(s + e * Math.sin(g) + t * Math.cos(g));
    if (f < 0 || f >= n.gridW || y < 0 || y >= n.gridH) continue;
    const S = y * n.gridW + f;
    n.grid[S] !== _t && (n.grid[S] = _t, n.age[S] = i, i > n.maxAge && (n.maxAge = i), n.frontier.delete(S), n.frontierDirty = !0, or(n, S));
  }
}
function nr(n, h) {
  jt(n, n.gridW / 2 | 0, n.gridH / 2 | 0, h, 0);
}
function rr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = 0, u = null;
    const g = document.createElement("canvas"), f = g.getContext("2d");
    let y = null;
    function S(c, l) {
      const { cellSize: v, symmetry: R } = o.current, x = 300, F = Math.max(1, Math.min(x, Math.floor(c / v))), M = Math.max(1, Math.min(x, Math.floor(l / v)));
      u = er(F, M), g.width = F, g.height = M, y = f.createImageData(F, M), t = 0, nr(u, R);
    }
    function I(c, l) {
      const v = window.devicePixelRatio || 1;
      s = c, m = l, a.width = Math.round(c * v), a.height = Math.round(l * v), a.style.width = `${c}px`, a.style.height = `${l}px`, r.scale(v, v), S(c, l);
    }
    const $ = new ResizeObserver((c) => {
      const { width: l, height: v } = c[0].contentRect;
      l > 0 && v > 0 && I(l, v);
    });
    $.observe(i);
    const B = i.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P(c) {
      if (!o.current.interactive || !u) return;
      const l = a.getBoundingClientRect(), { cellSize: v, symmetry: R } = o.current, x = Math.floor((c.clientX - l.left) / v), F = Math.floor((c.clientY - l.top) / v);
      jt(u, x, F, R, ++t);
    }
    function E(c) {
      if (!o.current.interactive || !u) return;
      c.preventDefault();
      const l = a.getBoundingClientRect(), { cellSize: v, symmetry: R } = o.current, x = Math.floor((c.touches[0].clientX - l.left) / v), F = Math.floor((c.touches[0].clientY - l.top) / v);
      jt(u, x, F, R, ++t);
    }
    i.addEventListener("mousedown", P), i.addEventListener("touchstart", E, { passive: !1 });
    function C() {
      if (!u || !y) {
        e = requestAnimationFrame(C);
        return;
      }
      const { crystalColor: c, activeColor: l, backgroundColor: v, growthSpeed: R, symmetry: x, branchProbability: F, noiseAmount: M, colorMode: k, glowEffect: L, glowBlur: w, animated: p, autoReset: d } = o.current, { grid: b, age: A, frontier: T, gridW: D, gridH: z } = u;
      if (p && T.size > 0) {
        u.frontierDirty && (u.frontierArr = Array.from(T), u.frontierDirty = !1);
        const rt = u.frontierArr, st = Math.min(Math.round(R), 50, rt.length);
        for (let tt = 0; tt < st && rt.length !== 0; tt++) {
          const Q = Math.random() * rt.length | 0, _ = rt[Q];
          if (b[_] !== Pt) {
            T.delete(_), rt.splice(Q, 1), tt--;
            continue;
          }
          let J = _ % D, ot = _ / D | 0;
          if (M > 0 && Math.random() < M) {
            const V = Math.max(0, Math.min(D - 1, J + Math.round((Math.random() * 2 - 1) * 2))), et = Math.max(0, Math.min(z - 1, ot + Math.round((Math.random() * 2 - 1) * 2)));
            b[et * D + V] !== _t && (J = V, ot = et);
          }
          if (t++, jt(u, J, ot, x, t), rt.splice(Q, 1), Math.random() < F) {
            const V = [[-2, 0], [2, 0], [0, -2], [0, 2]], [et, it] = V[Math.random() * 4 | 0], ct = Math.max(0, Math.min(D - 1, J + et)), ft = Math.max(0, Math.min(z - 1, ot + it)) * D + ct;
            b[ft] === qt && (b[ft] = Pt, T.add(ft), rt.push(ft));
          }
        }
        if (d && T.size === 0) {
          S(s, m), e = requestAnimationFrame(C);
          return;
        }
      }
      const [O, W, Y] = yt([v], 0), [q, H, G] = yt([c], 0), [U, j, N] = yt([l], 0), K = y.data, Z = D * z, nt = u.maxAge || 1;
      for (let rt = 0; rt < Z; rt++) {
        const st = b[rt];
        let tt, Q, _;
        if (st === _t)
          if (k === "age") {
            const ot = A[rt] / nt;
            [tt, Q, _] = yt([c, l, v], ot);
          } else if (k === "cycle") {
            const ot = A[rt] / nt;
            tt = 128 + 127 * Math.cos(ot * Math.PI * 2) | 0, Q = 128 + 127 * Math.cos(ot * Math.PI * 2 + 2.094) | 0, _ = 128 + 127 * Math.cos(ot * Math.PI * 2 + 4.189) | 0;
          } else
            tt = q, Q = H, _ = G;
        else st === Pt ? (tt = U, Q = j, _ = N) : (tt = O, Q = W, _ = Y);
        const J = rt * 4;
        K[J] = tt, K[J + 1] = Q, K[J + 2] = _, K[J + 3] = 255;
      }
      f.putImageData(y, 0, 0), r.save(), L ? (r.shadowBlur = w, r.shadowColor = c) : r.shadowBlur = 0, r.imageSmoothingEnabled = !1, r.drawImage(g, 0, 0, s, m), r.restore(), e = requestAnimationFrame(C);
    }
    return e = requestAnimationFrame(C), () => {
      $.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousedown", P), i.removeEventListener("touchstart", E);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      crystalColor: a,
      activeColor: i,
      backgroundColor: r,
      growthSpeed: s,
      symmetry: m,
      branchProbability: e,
      noiseAmount: t,
      cellSize: u,
      glowEffect: g,
      glowBlur: f,
      interactive: y,
      autoReset: S,
      colorMode: I,
      animated: $,
      width: B,
      height: P,
      className: E,
      style: C
    } = n, c = o && ar[o] || {}, l = X(null);
    return gt(h, () => l.current), rr(l, {
      crystalColor: a ?? c.crystalColor ?? "#ffffff",
      activeColor: i ?? c.activeColor ?? "#6b7280",
      backgroundColor: r ?? c.backgroundColor ?? "#111111",
      growthSpeed: s ?? 3,
      symmetry: m ?? c.symmetry ?? 6,
      branchProbability: e ?? c.branchProbability ?? 0.3,
      noiseAmount: t ?? c.noiseAmount ?? 0.2,
      cellSize: u ?? c.cellSize ?? 3,
      glowEffect: g ?? c.glowEffect ?? !0,
      glowBlur: f ?? c.glowBlur ?? 12,
      interactive: y ?? !0,
      autoReset: S ?? !0,
      colorMode: I ?? c.colorMode ?? "solid",
      animated: $ ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: E,
        style: {
          width: B ?? "100%",
          height: P ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: y ?? !0 ? "crosshair" : "default",
          ...C
        },
        children: /* @__PURE__ */ at(
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
ir.displayName = "CrystalGrowth";
const Ce = 300;
function cr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = 0, u = -1, g = [], f = [];
    const y = /* @__PURE__ */ new Set();
    function S(M, k) {
      return M * 1e4 + k;
    }
    function I(M, k) {
      const { nodeCount: L, wanderSpeed: w } = o.current;
      g = Array.from({ length: L }, () => ({
        x: Math.random() * M,
        y: Math.random() * k,
        vx: (Math.random() - 0.5) * w,
        vy: (Math.random() - 0.5) * w,
        flash: 0
      })), f = [], y.clear();
    }
    function $(M, k) {
      const L = window.devicePixelRatio || 1;
      s = M, m = k, a.width = Math.round(M * L), a.height = Math.round(k * L), a.style.width = `${M}px`, a.style.height = `${k}px`, r.scale(L, L), I(M, k);
    }
    const B = new ResizeObserver((M) => {
      const { width: k, height: L } = M[0].contentRect;
      k > 0 && L > 0 && $(k, L);
    });
    B.observe(i);
    const P = i.getBoundingClientRect();
    P.width > 0 && P.height > 0 && $(P.width, P.height);
    function E(M, k) {
      const { connectionRadius: L, pulseDecay: w } = o.current;
      if (k < 0.05 || f.length >= Ce) return;
      g[M].flash = Math.max(g[M].flash, k);
      const p = L * L, d = k * w;
      if (!(d < 0.05))
        for (let b = 0; b < g.length; b++) {
          if (b === M) continue;
          if (f.length >= Ce) break;
          const A = g[b].x - g[M].x, T = g[b].y - g[M].y;
          if (A * A + T * T > p) continue;
          const D = S(M, b);
          y.has(D) || (y.add(D), f.push({ fromIdx: M, toIdx: b, progress: 0, strength: d }));
        }
    }
    function C(M, k) {
      let L = -1, w = 1 / 0;
      for (let p = 0; p < g.length; p++) {
        const d = g[p].x - M, b = g[p].y - k, A = d * d + b * b;
        A < w && (w = A, L = p);
      }
      return L;
    }
    function c(M) {
      if (!o.current.interactive) return;
      const k = a.getBoundingClientRect();
      u = C(M.clientX - k.left, M.clientY - k.top);
    }
    function l() {
      u = -1;
    }
    function v(M) {
      if (!o.current.interactive) return;
      const k = a.getBoundingClientRect(), L = C(M.clientX - k.left, M.clientY - k.top);
      L >= 0 && E(L, 1);
    }
    function R(M) {
      if (!o.current.interactive) return;
      M.preventDefault();
      const k = a.getBoundingClientRect(), L = C(M.touches[0].clientX - k.left, M.touches[0].clientY - k.top);
      L >= 0 && E(L, 1);
    }
    i.addEventListener("mousemove", c), i.addEventListener("mouseleave", l), i.addEventListener("mousedown", v), i.addEventListener("touchstart", R, { passive: !1 });
    let x = 0;
    function F(M) {
      const k = x ? Math.min(M - x, 50) : 16;
      x = M;
      const { nodeColor: L, edgeColor: w, signalColor: p, backgroundColor: d, connectionRadius: b, nodeRadius: A, lineWidth: T, speed: D, pulseInterval: z, glowEffect: O, glowBlur: W, animated: Y, wander: q, wanderSpeed: H } = o.current;
      if (g.length > 0 && M - t > z && (t = M, E(Math.random() * g.length | 0, 1)), r.fillStyle = d, r.fillRect(0, 0, s, m), !Y) {
        e = requestAnimationFrame(F);
        return;
      }
      if (q) {
        const j = H * 2;
        for (const N of g)
          N.vx += (Math.random() - 0.5) * 0.05 * H, N.vy += (Math.random() - 0.5) * 0.05 * H, N.vx > j ? N.vx = j : N.vx < -j && (N.vx = -j), N.vy > j ? N.vy = j : N.vy < -j && (N.vy = -j), N.x += N.vx * k * 0.016, N.y += N.vy * k * 0.016, N.x < 0 ? (N.x = 0, N.vx = Math.abs(N.vx)) : N.x > s && (N.x = s, N.vx = -Math.abs(N.vx)), N.y < 0 ? (N.y = 0, N.vy = Math.abs(N.vy)) : N.y > m && (N.y = m, N.vy = -Math.abs(N.vy));
      }
      r.save(), r.lineWidth = T;
      const G = b * b;
      for (let j = 0; j < g.length; j++)
        for (let N = j + 1; N < g.length; N++) {
          const K = g[N].x - g[j].x, Z = g[N].y - g[j].y, nt = K * K + Z * Z;
          if (nt > G) continue;
          const rt = (1 - Math.sqrt(nt) / b) * 0.4;
          r.strokeStyle = Et(w, rt), r.beginPath(), r.moveTo(g[j].x, g[j].y), r.lineTo(g[N].x, g[N].y), r.stroke();
        }
      r.restore(), r.save(), O && (r.shadowBlur = W, r.shadowColor = p);
      const U = D * k * 8e-4;
      for (let j = f.length - 1; j >= 0; j--) {
        const N = f[j];
        if (N.progress += U, N.progress >= 1) {
          y.delete(S(N.fromIdx, N.toIdx)), f.splice(j, 1), E(N.toIdx, N.strength);
          continue;
        }
        const K = g[N.fromIdx], Z = g[N.toIdx], nt = K.x + (Z.x - K.x) * N.progress, rt = K.y + (Z.y - K.y) * N.progress;
        r.fillStyle = Et(p, N.strength * 0.9), r.beginPath(), r.arc(nt, rt, A * 0.6, 0, Math.PI * 2), r.fill();
      }
      r.shadowBlur = 0, r.restore(), r.save();
      for (let j = 0; j < g.length; j++) {
        const N = g[j], K = j === u, Z = N.flash;
        N.flash = Math.max(0, Z - 0.03);
        const nt = 0.4 + Z * 0.6, rt = A * (K ? 1.5 : 1) * (1 + Z * 0.4);
        O && (K || Z > 0.1) ? (r.shadowBlur = W * (0.5 + Z * 0.5), r.shadowColor = L) : r.shadowBlur = 0, r.fillStyle = Et(L, nt), r.beginPath(), r.arc(N.x, N.y, rt, 0, Math.PI * 2), r.fill();
      }
      r.shadowBlur = 0, r.restore(), e = requestAnimationFrame(F);
    }
    return e = requestAnimationFrame(F), () => {
      B.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousemove", c), i.removeEventListener("mouseleave", l), i.removeEventListener("mousedown", v), i.removeEventListener("touchstart", R);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      nodeCount: a,
      nodeColor: i,
      edgeColor: r,
      signalColor: s,
      backgroundColor: m,
      connectionRadius: e,
      nodeRadius: t,
      lineWidth: u,
      speed: g,
      pulseInterval: f,
      pulseDecay: y,
      glowEffect: S,
      glowBlur: I,
      interactive: $,
      animated: B,
      wander: P,
      wanderSpeed: E,
      width: C,
      height: c,
      className: l,
      style: v
    } = n, R = o && sr[o] || {}, x = X(null);
    return gt(h, () => x.current), cr(x, {
      nodeCount: a ?? 40,
      nodeColor: i ?? R.nodeColor ?? "#ffffff",
      edgeColor: r ?? R.edgeColor ?? "#6b7280",
      signalColor: s ?? R.signalColor ?? "#ffffff",
      backgroundColor: m ?? R.backgroundColor ?? "#111111",
      connectionRadius: e ?? R.connectionRadius ?? 150,
      nodeRadius: t ?? R.nodeRadius ?? 4,
      lineWidth: u ?? 1,
      speed: g ?? 1,
      pulseInterval: f ?? R.pulseInterval ?? 2e3,
      pulseDecay: y ?? R.pulseDecay ?? 0.85,
      glowEffect: S ?? R.glowEffect ?? !0,
      glowBlur: I ?? R.glowBlur ?? 15,
      interactive: $ ?? !0,
      animated: B ?? !0,
      wander: P ?? !0,
      wanderSpeed: E ?? R.wanderSpeed ?? 0.3
    }), /* @__PURE__ */ at(
      "div",
      {
        className: l,
        style: {
          width: C ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: $ ?? !0 ? "pointer" : "default",
          ...v
        },
        children: /* @__PURE__ */ at(
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
lr.displayName = "NeuralWeb";
function ur(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = -9999, u = -9999, g = [];
    const f = { text: "", fontSize: -1, cssW: -1, cssH: -1 };
    function y(l, v, R, x) {
      const F = document.createElement("canvas");
      F.width = R, F.height = x;
      const M = F.getContext("2d");
      M.clearRect(0, 0, R, x), M.fillStyle = "#ffffff";
      const k = Math.min(v, x * 0.85, R * 0.9);
      M.font = `bold ${k}px ${o.current.fontFamily}`, M.textAlign = "center", M.textBaseline = "middle", M.fillText(l, R / 2, x / 2);
      const { particleGap: L } = o.current, w = M.getImageData(0, 0, R, x).data, p = [];
      for (let d = 0; d < x; d += L)
        for (let b = 0; b < R; b += L)
          w[(d * R + b) * 4 + 3] > 128 && p.push({ x: b, y: d, targetX: b, targetY: d, vx: 0, vy: 0 });
      return p;
    }
    function S(l, v) {
      const R = window.devicePixelRatio || 1;
      s = l, m = v, a.width = Math.round(l * R), a.height = Math.round(v * R), a.style.width = `${l}px`, a.style.height = `${v}px`, r.scale(R, R), f.cssW = -1;
    }
    const I = new ResizeObserver((l) => {
      const { width: v, height: R } = l[0].contentRect;
      v > 0 && R > 0 && S(v, R);
    });
    I.observe(i);
    const $ = i.getBoundingClientRect();
    $.width > 0 && $.height > 0 && S($.width, $.height);
    function B(l) {
      if (!o.current.interactive) return;
      const v = a.getBoundingClientRect();
      t = l.clientX - v.left, u = l.clientY - v.top;
    }
    function P() {
      t = -9999, u = -9999;
    }
    function E(l) {
      if (!o.current.interactive) return;
      l.preventDefault();
      const v = a.getBoundingClientRect();
      t = l.touches[0].clientX - v.left, u = l.touches[0].clientY - v.top;
    }
    function C() {
      t = -9999, u = -9999;
    }
    i.addEventListener("mousemove", B), i.addEventListener("mouseleave", P), i.addEventListener("touchmove", E, { passive: !1 }), i.addEventListener("touchend", C);
    function c() {
      const { text: l, fontSize: v, color: R, backgroundColor: x, particleSize: F, repelRadius: M, repelForce: k, snapSpeed: L, friction: w, glowEffect: p, glowBlur: d, animated: b } = o.current;
      if (s > 0 && m > 0 && (l !== f.text || v !== f.fontSize || s !== f.cssW || m !== f.cssH) && (f.text = l, f.fontSize = v, f.cssW = s, f.cssH = m, g = y(l, v, s, m)), r.fillStyle = x, r.fillRect(0, 0, s, m), !b || g.length === 0) {
        e = requestAnimationFrame(c);
        return;
      }
      const A = M * M;
      r.save(), p && (r.shadowBlur = d, r.shadowColor = R), r.fillStyle = Et(R, 1);
      for (const T of g) {
        T.vx += (T.targetX - T.x) * L, T.vy += (T.targetY - T.y) * L;
        const D = T.x - t, z = T.y - u, O = D * D + z * z;
        if (O < A && O > 0) {
          const W = Math.sqrt(O), Y = (M - W) / M * k;
          T.vx += D / W * Y, T.vy += z / W * Y;
        }
        T.vx *= w, T.vy *= w, T.x += T.vx, T.y += T.vy, r.beginPath(), r.arc(T.x, T.y, F, 0, Math.PI * 2), r.fill();
      }
      r.restore(), e = requestAnimationFrame(c);
    }
    return e = requestAnimationFrame(c), () => {
      I.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousemove", B), i.removeEventListener("mouseleave", P), i.removeEventListener("touchmove", E), i.removeEventListener("touchend", C);
    };
  }, [n]);
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
}, fr = ht(
  (n, h) => {
    const {
      preset: o,
      text: a,
      fontSize: i,
      fontFamily: r,
      color: s,
      backgroundColor: m,
      particleSize: e,
      particleGap: t,
      repelRadius: u,
      repelForce: g,
      snapSpeed: f,
      friction: y,
      glowEffect: S,
      glowBlur: I,
      animated: $,
      interactive: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && dr[o] || {}, v = X(null);
    return gt(h, () => v.current), ur(v, {
      text: a ?? "hello",
      fontSize: i ?? 120,
      fontFamily: r ?? "sans-serif",
      color: s ?? l.color ?? "#ffffff",
      backgroundColor: m ?? l.backgroundColor ?? "#111111",
      particleSize: e ?? l.particleSize ?? 2,
      particleGap: t ?? 4,
      repelRadius: u ?? l.repelRadius ?? 80,
      repelForce: g ?? l.repelForce ?? 5,
      snapSpeed: f ?? l.snapSpeed ?? 0.12,
      friction: y ?? 0.85,
      glowEffect: S ?? l.glowEffect ?? !1,
      glowBlur: I ?? l.glowBlur ?? 6,
      animated: $ ?? !0,
      interactive: B ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: {
          width: P ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: B ?? !0 ? "crosshair" : "default",
          ...c
        },
        children: /* @__PURE__ */ at(
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
fr.displayName = "ParticleText";
function hr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = [], u = -1, g = 0, f = 0;
    const y = document.createElement("canvas"), S = y.getContext("2d");
    let I = null, $ = 0, B = 0, P = -1;
    function E(d, b) {
      const { blobCount: A, minRadius: T, maxRadius: D, speed: z } = o.current;
      t = Array.from({ length: A }, () => {
        const O = T + Math.random() * (D - T);
        return {
          x: O + Math.random() * (d - O * 2),
          y: O + Math.random() * (b - O * 2),
          vx: (Math.random() - 0.5) * z * 2,
          vy: (Math.random() - 0.5) * z * 2,
          radius: O
        };
      });
    }
    function C(d, b) {
      const { resolution: A } = o.current;
      A === P && $ > 0 || (P = A, $ = Math.max(1, Math.round(d * A)), B = Math.max(1, Math.round(b * A)), y.width = $, y.height = B, I = S.createImageData($, B));
    }
    function c(d, b) {
      const A = window.devicePixelRatio || 1;
      s = d, m = b, a.width = Math.round(d * A), a.height = Math.round(b * A), a.style.width = `${d}px`, a.style.height = `${b}px`, r.scale(A, A), P = -1, C(d, b), E(d, b);
    }
    const l = new ResizeObserver((d) => {
      const { width: b, height: A } = d[0].contentRect;
      b > 0 && A > 0 && c(b, A);
    });
    l.observe(i);
    const v = i.getBoundingClientRect();
    v.width > 0 && v.height > 0 && c(v.width, v.height);
    function R(d, b) {
      for (let A = 0; A < t.length; A++) {
        const T = t[A].x - d, D = t[A].y - b;
        if (T * T + D * D < t[A].radius * t[A].radius) return A;
      }
      return -1;
    }
    function x(d) {
      if (!o.current.interactive) return;
      const b = a.getBoundingClientRect(), A = d.clientX - b.left, T = d.clientY - b.top, D = R(A, T);
      if (D >= 0)
        u = D, g = A - t[D].x, f = T - t[D].y;
      else {
        const { minRadius: z, maxRadius: O } = o.current, W = z + Math.random() * (O - z);
        t.push({ x: A, y: T, vx: 0, vy: 0, radius: W });
      }
    }
    function F(d) {
      if (!o.current.interactive || u < 0) return;
      const b = a.getBoundingClientRect();
      t[u].x = d.clientX - b.left - g, t[u].y = d.clientY - b.top - f, t[u].vx = 0, t[u].vy = 0;
    }
    function M() {
      u = -1;
    }
    function k(d) {
      if (!o.current.interactive) return;
      d.preventDefault();
      const b = a.getBoundingClientRect(), A = d.touches[0].clientX - b.left, T = d.touches[0].clientY - b.top, D = R(A, T);
      D >= 0 && (u = D, g = A - t[D].x, f = T - t[D].y);
    }
    function L(d) {
      if (!o.current.interactive || u < 0) return;
      d.preventDefault();
      const b = a.getBoundingClientRect();
      t[u].x = d.touches[0].clientX - b.left - g, t[u].y = d.touches[0].clientY - b.top - f, t[u].vx = 0, t[u].vy = 0;
    }
    function w() {
      u = -1;
    }
    i.addEventListener("mousedown", x), i.addEventListener("mousemove", F), window.addEventListener("mouseup", M), i.addEventListener("touchstart", k, { passive: !1 }), i.addEventListener("touchmove", L, { passive: !1 }), i.addEventListener("touchend", w);
    function p() {
      const { blobCount: d, color: b, backgroundColor: A, threshold: T, speed: D, glowEffect: z, glowBlur: O, animated: W, resolution: Y } = o.current;
      if (Y !== P && (P = -1, C(s, m)), d !== t.length && u < 0 && s > 0) {
        for (; t.length < d; ) {
          const { minRadius: tt, maxRadius: Q } = o.current, _ = tt + Math.random() * (Q - tt);
          t.push({
            x: _ + Math.random() * Math.max(1, s - _ * 2),
            y: _ + Math.random() * Math.max(1, m - _ * 2),
            vx: (Math.random() - 0.5) * D * 2,
            vy: (Math.random() - 0.5) * D * 2,
            radius: _
          });
        }
        for (; t.length > d; ) t.pop();
      }
      if (r.fillStyle = A, r.fillRect(0, 0, s, m), !W || !I || $ === 0) {
        e = requestAnimationFrame(p);
        return;
      }
      const q = s / $, H = m / B;
      for (let tt = 0; tt < t.length; tt++) {
        if (tt === u) continue;
        const Q = t[tt];
        Q.vx += (Math.random() - 0.5) * 0.1 * D, Q.vy += (Math.random() - 0.5) * 0.1 * D;
        const _ = D * 2;
        Q.vx > _ ? Q.vx = _ : Q.vx < -_ && (Q.vx = -_), Q.vy > _ ? Q.vy = _ : Q.vy < -_ && (Q.vy = -_), Q.x += Q.vx, Q.y += Q.vy, Q.x < Q.radius ? (Q.x = Q.radius, Q.vx = Math.abs(Q.vx)) : Q.x > s - Q.radius && (Q.x = s - Q.radius, Q.vx = -Math.abs(Q.vx)), Q.y < Q.radius ? (Q.y = Q.radius, Q.vy = Math.abs(Q.vy)) : Q.y > m - Q.radius && (Q.y = m - Q.radius, Q.vy = -Math.abs(Q.vy));
      }
      const [G, U, j] = yt([A], 0), [N, K, Z] = yt([b], 0), nt = I.data, rt = T * 0.8, st = T * 0.2;
      for (let tt = 0; tt < B; tt++) {
        const Q = tt * H;
        for (let _ = 0; _ < $; _++) {
          const J = _ * q;
          let ot = 0;
          for (const it of t) {
            const ct = J - it.x, lt = Q - it.y, ft = ct * ct + lt * lt;
            if (ft < 1) {
              ot = 99;
              break;
            }
            ot += it.radius * it.radius / ft;
          }
          const V = Math.min(1, Math.max(0, (ot - rt) / st)), et = (tt * $ + _) * 4;
          nt[et] = G + (N - G) * V | 0, nt[et + 1] = U + (K - U) * V | 0, nt[et + 2] = j + (Z - j) * V | 0, nt[et + 3] = 255;
        }
      }
      S.putImageData(I, 0, 0), r.save(), z && (r.shadowBlur = O, r.shadowColor = b), r.imageSmoothingEnabled = !0, r.imageSmoothingQuality = "medium", r.drawImage(y, 0, 0, s, m), r.restore(), e = requestAnimationFrame(p);
    }
    return e = requestAnimationFrame(p), () => {
      l.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousedown", x), i.removeEventListener("mousemove", F), window.removeEventListener("mouseup", M), i.removeEventListener("touchstart", k), i.removeEventListener("touchmove", L), i.removeEventListener("touchend", w);
    };
  }, [n]);
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
}, mr = ht(
  (n, h) => {
    const {
      preset: o,
      blobCount: a,
      color: i,
      backgroundColor: r,
      threshold: s,
      speed: m,
      minRadius: e,
      maxRadius: t,
      glowEffect: u,
      glowBlur: g,
      resolution: f,
      animated: y,
      interactive: S,
      width: I,
      height: $,
      className: B,
      style: P
    } = n, E = o && gr[o] || {}, C = X(null);
    return gt(h, () => C.current), hr(C, {
      blobCount: a ?? 5,
      color: i ?? E.color ?? "#ffffff",
      backgroundColor: r ?? E.backgroundColor ?? "#111111",
      threshold: s ?? E.threshold ?? 1,
      speed: m ?? E.speed ?? 1,
      minRadius: e ?? E.minRadius ?? 40,
      maxRadius: t ?? E.maxRadius ?? 80,
      glowEffect: u ?? E.glowEffect ?? !0,
      glowBlur: g ?? E.glowBlur ?? 20,
      resolution: f ?? 0.4,
      animated: y ?? !0,
      interactive: S ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: B,
        style: {
          width: I ?? "100%",
          height: $ ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: S ?? !0 ? "grab" : "default",
          ...P
        },
        children: /* @__PURE__ */ at(
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
mr.displayName = "Metaballs";
function pr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = [], u = [], g = new Float32Array(0), f = new Float32Array(0), y = 0, S = 0, I = 0, $ = 0;
    const B = document.createElement("canvas"), P = B.getContext("2d");
    let E = null, C = -1;
    const c = 18, l = 12;
    function v(d, b) {
      const { resolution: A } = o.current;
      A === C && y > 0 || (C = A, y = Math.max(1, Math.round(d * A)), S = Math.max(1, Math.round(b * A)), g = new Float32Array(y * S), f = new Float32Array(y * S), B.width = y, B.height = S, E = P.createImageData(y, S));
    }
    function R(d, b) {
      const { antCount: A } = o.current;
      I = d / 2, $ = b / 2, t = Array.from({ length: A }, () => ({
        x: I,
        y: $,
        angle: Math.random() * Math.PI * 2,
        hasFood: !1
      }));
    }
    function x(d, b) {
      const A = window.devicePixelRatio || 1;
      s = d, m = b, a.width = Math.round(d * A), a.height = Math.round(b * A), a.style.width = `${d}px`, a.style.height = `${b}px`, r.scale(A, A), C = -1, v(d, b), R(d, b), u = [];
    }
    const F = new ResizeObserver((d) => {
      const { width: b, height: A } = d[0].contentRect;
      b > 0 && A > 0 && x(b, A);
    });
    F.observe(i);
    const M = i.getBoundingClientRect();
    M.width > 0 && M.height > 0 && x(M.width, M.height);
    function k(d) {
      if (!o.current.interactive) return;
      const b = a.getBoundingClientRect(), A = d.clientX - b.left, T = d.clientY - b.top;
      u.length < o.current.maxFood && u.push({ x: A, y: T, amount: 200 });
    }
    function L(d) {
      if (!o.current.interactive) return;
      d.preventDefault();
      const b = a.getBoundingClientRect(), A = d.touches[0].clientX - b.left, T = d.touches[0].clientY - b.top;
      u.length < o.current.maxFood && u.push({ x: A, y: T, amount: 200 });
    }
    i.addEventListener("mousedown", k), i.addEventListener("touchstart", L, { passive: !1 });
    function w(d, b, A) {
      const T = Math.max(0, Math.min(y - 1, b | 0)), D = Math.max(0, Math.min(S - 1, A | 0));
      return d[D * y + T];
    }
    function p() {
      const {
        evaporationRate: d,
        diffusionRate: b,
        pheromoneStrength: A,
        antSpeed: T,
        sensorAngle: D,
        sensorDistance: z,
        turnSpeed: O,
        antColor: W,
        pheromoneColor: Y,
        backgroundColor: q,
        foodColor: H,
        nestColor: G,
        resolution: U,
        animated: j
      } = o.current;
      if (U !== C && (C = -1, v(s, m)), r.fillStyle = q, r.fillRect(0, 0, s, m), !j || y === 0 || !E) {
        e = requestAnimationFrame(p);
        return;
      }
      const N = s / y, K = m / S;
      for (let V = 0; V < g.length; V++)
        g[V] *= 1 - d, f[V] *= 1 - d, g[V] < 1e-3 && (g[V] = 0), f[V] < 1e-3 && (f[V] = 0);
      if (b > 0) {
        const V = b * 0.25;
        for (let et = 1; et < S - 1; et++)
          for (let it = 1; it < y - 1; it++) {
            const ct = et * y + it, lt = g, ft = f, mt = lt[ct - 1] + lt[ct + 1] + lt[ct - y] + lt[ct + y], wt = ft[ct - 1] + ft[ct + 1] + ft[ct - y] + ft[ct + y];
            lt[ct] += (mt * 0.25 - lt[ct]) * V, ft[ct] += (wt * 0.25 - ft[ct]) * V;
          }
      }
      for (const V of t) {
        const et = V.hasFood ? f : g, it = V.angle, ct = V.angle - D, lt = V.angle + D, ft = (At) => {
          const Bt = V.x + Math.cos(At) * z, Xt = V.y + Math.sin(At) * z;
          return w(et, Bt / N, Xt / K);
        }, mt = ft(ct), wt = ft(it), vt = ft(lt);
        wt >= mt && wt >= vt || (mt > vt ? V.angle -= O * Math.random() : vt > mt ? V.angle += O * Math.random() : V.angle += (Math.random() - 0.5) * O), V.angle += (Math.random() - 0.5) * 0.2, V.x += Math.cos(V.angle) * T, V.y += Math.sin(V.angle) * T, V.x < 0 ? (V.x = 0, V.angle = Math.PI - V.angle) : V.x >= s && (V.x = s - 1, V.angle = Math.PI - V.angle), V.y < 0 ? (V.y = 0, V.angle = -V.angle) : V.y >= m && (V.y = m - 1, V.angle = -V.angle);
        const Re = Math.max(0, Math.min(y - 1, V.x / N | 0)), Ot = Math.max(0, Math.min(S - 1, V.y / K | 0)) * y + Re;
        V.hasFood ? g[Ot] = Math.min(255, g[Ot] + A) : f[Ot] = Math.min(255, f[Ot] + A);
        const re = V.x - I, ae = V.y - $;
        if (V.hasFood && re * re + ae * ae < c * c && (V.hasFood = !1, V.angle += Math.PI), !V.hasFood)
          for (let At = u.length - 1; At >= 0; At--) {
            const Bt = u[At], Xt = V.x - Bt.x, ie = V.y - Bt.y;
            if (Xt * Xt + ie * ie < l * l && Bt.amount > 0) {
              V.hasFood = !0, V.angle += Math.PI, Bt.amount--, Bt.amount <= 0 && u.splice(At, 1);
              break;
            }
          }
      }
      const [Z, nt, rt] = yt([q], 0), [st, tt, Q] = yt([Y], 0), _ = E.data, J = y * S, ot = Math.max(1, A * 8);
      for (let V = 0; V < J; V++) {
        const et = g[V] / ot, it = f[V] / ot, ct = Math.min(1, et + it), lt = V * 4;
        _[lt] = Z + (st - Z) * ct | 0, _[lt + 1] = nt + (tt - nt) * ct | 0, _[lt + 2] = rt + (Q - rt) * ct | 0, _[lt + 3] = 255;
      }
      P.putImageData(E, 0, 0), r.imageSmoothingEnabled = !0, r.imageSmoothingQuality = "medium", r.drawImage(B, 0, 0, s, m), r.save(), r.beginPath(), r.arc(I, $, c, 0, Math.PI * 2), r.fillStyle = G, r.fill(), r.restore(), r.save();
      for (const V of u)
        r.beginPath(), r.arc(V.x, V.y, l, 0, Math.PI * 2), r.fillStyle = H, r.fill();
      r.restore(), r.save(), r.fillStyle = W;
      for (const V of t)
        r.beginPath(), r.arc(V.x, V.y, 1.5, 0, Math.PI * 2), r.fill();
      r.restore(), e = requestAnimationFrame(p);
    }
    return e = requestAnimationFrame(p), () => {
      F.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousedown", k), i.removeEventListener("touchstart", L);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      antCount: a,
      evaporationRate: i,
      diffusionRate: r,
      pheromoneStrength: s,
      antSpeed: m,
      sensorAngle: e,
      sensorDistance: t,
      turnSpeed: u,
      antColor: g,
      pheromoneColor: f,
      foodColor: y,
      nestColor: S,
      backgroundColor: I,
      resolution: $,
      animated: B,
      interactive: P,
      maxFood: E,
      width: C,
      height: c,
      className: l,
      style: v
    } = n, R = o && yr[o] || {}, x = X(null);
    return gt(h, () => x.current), pr(x, {
      antCount: a ?? R.antCount ?? 150,
      evaporationRate: i ?? R.evaporationRate ?? 3e-3,
      diffusionRate: r ?? 0.1,
      pheromoneStrength: s ?? R.pheromoneStrength ?? 5,
      antSpeed: m ?? R.antSpeed ?? 1.5,
      sensorAngle: e ?? 0.4,
      sensorDistance: t ?? 6,
      turnSpeed: u ?? 0.3,
      antColor: g ?? R.antColor ?? "#ffffff",
      pheromoneColor: f ?? R.pheromoneColor ?? "#6b7280",
      foodColor: y ?? R.foodColor ?? "#4ade80",
      nestColor: S ?? R.nestColor ?? "#f59e0b",
      backgroundColor: I ?? R.backgroundColor ?? "#111111",
      resolution: $ ?? 0.5,
      animated: B ?? !0,
      interactive: P ?? !0,
      maxFood: E ?? 5
    }), /* @__PURE__ */ at(
      "div",
      {
        className: l,
        style: {
          width: C ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: P ?? !0 ? "crosshair" : "default",
          ...v
        },
        children: /* @__PURE__ */ at(
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
wr.displayName = "AntColony";
function vr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = !0, u = [], g = -1, f = 0, y = 0;
    function S(k, L) {
      u = [
        { x: k * 0.35, y: L * 0.5, charge: 1 },
        { x: k * 0.65, y: L * 0.5, charge: -1 }
      ];
    }
    function I(k, L) {
      const w = window.devicePixelRatio || 1;
      s = k, m = L, a.width = Math.round(k * w), a.height = Math.round(L * w), a.style.width = `${k}px`, a.style.height = `${L}px`, r.scale(w, w), S(k, L), t = !0;
    }
    const $ = new ResizeObserver((k) => {
      const { width: L, height: w } = k[0].contentRect;
      L > 0 && w > 0 && I(L, w);
    });
    $.observe(i);
    const B = i.getBoundingClientRect();
    B.width > 0 && B.height > 0 && I(B.width, B.height);
    function P(k, L) {
      let w = 0, p = 0;
      for (const d of u) {
        const b = k - d.x, A = L - d.y, T = b * b + A * A;
        if (T < 1) continue;
        const D = Math.sqrt(T), z = d.charge / T;
        w += b / D * z, p += A / D * z;
      }
      return [w, p];
    }
    function E() {
      const { fieldLineCount: k, stepSize: L, maxSteps: w, lineColor: p, lineWidth: d, lineOpacity: b, poleRadius: A, glowEffect: T, glowBlur: D, positiveColor: z, negativeColor: O, backgroundColor: W } = o.current;
      r.fillStyle = W, r.fillRect(0, 0, s, m);
      const Y = A * A;
      r.save(), r.lineWidth = d;
      for (const q of u) {
        const H = q.charge;
        for (let G = 0; G < k; G++) {
          const U = G / k * Math.PI * 2;
          let j = q.x + Math.cos(U) * (A + 2), N = q.y + Math.sin(U) * (A + 2);
          r.beginPath(), r.moveTo(j, N);
          let K = 0;
          for (let Z = 0; Z < w; Z++) {
            const [nt, rt] = P(j, N), st = Math.sqrt(nt * nt + rt * rt);
            if (st < 1e-10) break;
            const tt = j + nt / st * L * H, Q = N + rt / st * L * H;
            if (tt < 0 || tt > s || Q < 0 || Q > m) break;
            let _ = !1;
            for (const J of u) {
              const ot = tt - J.x, V = Q - J.y;
              if (ot * ot + V * V < Y) {
                _ = !0;
                break;
              }
            }
            if (_) break;
            r.lineTo(tt, Q), j = tt, N = Q, K++;
          }
          K !== 0 && (T && (r.shadowBlur = D * 0.5, r.shadowColor = p), r.strokeStyle = Et(p, b), r.stroke());
        }
      }
      r.shadowBlur = 0, r.restore(), r.save();
      for (const q of u) {
        const H = q.charge === 1 ? z : O;
        T && (r.shadowBlur = D, r.shadowColor = H), r.fillStyle = H, r.beginPath(), r.arc(q.x, q.y, A, 0, Math.PI * 2), r.fill(), r.shadowBlur = 0, r.fillStyle = "#ffffff", r.font = `bold ${A}px sans-serif`, r.textAlign = "center", r.textBaseline = "middle", r.fillText(q.charge === 1 ? "N" : "S", q.x, q.y);
      }
      r.restore();
    }
    function C(k) {
      if (!o.current.interactive) return;
      const L = a.getBoundingClientRect(), w = k.clientX - L.left, p = k.clientY - L.top, { poleRadius: d, maxPoles: b } = o.current, A = d * 2;
      let T = -1;
      for (let D = 0; D < u.length; D++) {
        const z = u[D].x - w, O = u[D].y - p;
        if (z * z + O * O < A * A) {
          T = D;
          break;
        }
      }
      if (T >= 0)
        g = T, f = w - u[T].x, y = p - u[T].y;
      else if (u.length < b) {
        const D = u.length % 2 === 0 ? 1 : -1;
        u.push({ x: w, y: p, charge: D }), t = !0;
      }
    }
    function c(k) {
      if (!o.current.interactive || g < 0) return;
      const L = a.getBoundingClientRect();
      u[g].x = k.clientX - L.left - f, u[g].y = k.clientY - L.top - y, t = !0;
    }
    function l() {
      g = -1;
    }
    function v(k) {
      if (!o.current.interactive || (k.preventDefault(), u.length <= 2)) return;
      const L = a.getBoundingClientRect(), w = k.clientX - L.left, p = k.clientY - L.top, { poleRadius: d } = o.current, b = d * 2;
      for (let A = 0; A < u.length; A++) {
        const T = u[A].x - w, D = u[A].y - p;
        if (T * T + D * D < b * b) {
          u.splice(A, 1), t = !0;
          break;
        }
      }
    }
    function R(k) {
      if (!o.current.interactive) return;
      k.preventDefault();
      const L = a.getBoundingClientRect(), w = k.touches[0].clientX - L.left, p = k.touches[0].clientY - L.top, { poleRadius: d } = o.current, b = d * 2;
      for (let A = 0; A < u.length; A++) {
        const T = u[A].x - w, D = u[A].y - p;
        if (T * T + D * D < b * b) {
          g = A, f = w - u[A].x, y = p - u[A].y;
          return;
        }
      }
    }
    function x(k) {
      if (!o.current.interactive || g < 0) return;
      k.preventDefault();
      const L = a.getBoundingClientRect();
      u[g].x = k.touches[0].clientX - L.left - f, u[g].y = k.touches[0].clientY - L.top - y, t = !0;
    }
    function F() {
      g = -1;
    }
    i.addEventListener("mousedown", C), i.addEventListener("mousemove", c), window.addEventListener("mouseup", l), i.addEventListener("contextmenu", v), i.addEventListener("touchstart", R, { passive: !1 }), i.addEventListener("touchmove", x, { passive: !1 }), i.addEventListener("touchend", F);
    function M() {
      const { animated: k } = o.current;
      (k || t) && (E(), t = !1), e = requestAnimationFrame(M);
    }
    return e = requestAnimationFrame(M), () => {
      $.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousedown", C), i.removeEventListener("mousemove", c), window.removeEventListener("mouseup", l), i.removeEventListener("contextmenu", v), i.removeEventListener("touchstart", R), i.removeEventListener("touchmove", x), i.removeEventListener("touchend", F);
    };
  }, [n]);
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
}, Cr = ht(
  (n, h) => {
    const {
      preset: o,
      fieldLineCount: a,
      stepSize: i,
      maxSteps: r,
      positiveColor: s,
      negativeColor: m,
      lineColor: e,
      backgroundColor: t,
      lineWidth: u,
      lineOpacity: g,
      poleRadius: f,
      glowEffect: y,
      glowBlur: S,
      animated: I,
      interactive: $,
      maxPoles: B,
      width: P,
      height: E,
      className: C,
      style: c
    } = n, l = o && br[o] || {}, v = X(null);
    return gt(h, () => v.current), vr(v, {
      fieldLineCount: a ?? l.fieldLineCount ?? 16,
      stepSize: i ?? 4,
      maxSteps: r ?? 400,
      positiveColor: s ?? l.positiveColor ?? "#ef4444",
      negativeColor: m ?? l.negativeColor ?? "#3b82f6",
      lineColor: e ?? l.lineColor ?? "#6b7280",
      backgroundColor: t ?? l.backgroundColor ?? "#111111",
      lineWidth: u ?? 1,
      lineOpacity: g ?? l.lineOpacity ?? 0.6,
      poleRadius: f ?? 12,
      glowEffect: y ?? l.glowEffect ?? !0,
      glowBlur: S ?? l.glowBlur ?? 20,
      animated: I ?? !1,
      interactive: $ ?? !0,
      maxPoles: B ?? 6
    }), /* @__PURE__ */ at(
      "div",
      {
        className: C,
        style: {
          width: P ?? "100%",
          height: E ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: $ ?? !0 ? "pointer" : "default",
          ...c
        },
        children: /* @__PURE__ */ at(
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
Cr.displayName = "MagneticField";
function Me(n) {
  return n * n * n * (n * (n * 6 - 15) + 10);
}
function ne(n, h, o) {
  return n + o * (h - n);
}
function Ut(n, h, o) {
  const a = n & 3, i = a < 2 ? h : o, r = a < 2 ? o : h;
  return (a & 1 ? -i : i) + (a & 2 ? -r : r);
}
const Dt = new Uint8Array(256);
for (let n = 0; n < 256; n++) Dt[n] = n;
for (let n = 255; n > 0; n--) {
  const h = Math.floor(Math.random() * (n + 1));
  [Dt[n], Dt[h]] = [Dt[h], Dt[n]];
}
const Rt = new Uint8Array(512);
for (let n = 0; n < 512; n++) Rt[n] = Dt[n & 255];
function Mr(n, h) {
  const o = Math.floor(n) & 255, a = Math.floor(h) & 255, i = n - Math.floor(n), r = h - Math.floor(h), s = Me(i), m = Me(r), e = Rt[Rt[o] + a], t = Rt[Rt[o] + a + 1], u = Rt[Rt[o + 1] + a], g = Rt[Rt[o + 1] + a + 1];
  return ne(
    ne(Ut(e, i, r), Ut(u, i - 1, r), s),
    ne(Ut(t, i, r - 1), Ut(g, i - 1, r - 1), s),
    m
  );
}
function xr(n, h, o, a) {
  let i = 0, r = 1, s = 1, m = 0;
  for (let e = 0; e < o; e++)
    i += Mr(n * s, h * s) * r, m += r, r *= a, s *= 2;
  return i / m;
}
function Rr(n) {
  const h = n.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16) || 0,
    parseInt(h.slice(2, 4), 16) || 0,
    parseInt(h.slice(4, 6), 16) || 0
  ];
}
function Sr(n, h) {
  const o = X(h);
  o.current = h, dt(() => {
    const a = n.current;
    if (!a) return;
    const i = a.parentElement;
    if (!i) return;
    const r = a.getContext("2d");
    let s = 0, m = 0, e = 0, t = h.rotateY, u = h.rotateX, g = null, f = "", y = 255, S = 255, I = 255, $ = "", B = !1, P = 0, E = 0;
    function C(p, d) {
      const b = window.devicePixelRatio || 1;
      s = p, m = d, a.width = Math.round(p * b), a.height = Math.round(d * b), a.style.width = `${p}px`, a.style.height = `${d}px`, r.scale(b, b);
    }
    const c = new ResizeObserver((p) => {
      const { width: d, height: b } = p[0].contentRect;
      d > 0 && b > 0 && C(d, b);
    });
    c.observe(i);
    const l = i.getBoundingClientRect();
    l.width > 0 && l.height > 0 && C(l.width, l.height);
    function v(p) {
      o.current.interactive && (B = !0, P = p.clientX, E = p.clientY);
    }
    function R(p) {
      !o.current.interactive || !B || (t += (p.clientX - P) * 5e-3, u += (p.clientY - E) * 5e-3, u = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, u)), P = p.clientX, E = p.clientY);
    }
    function x() {
      B = !1;
    }
    function F(p) {
      o.current.interactive && (B = !0, P = p.touches[0].clientX, E = p.touches[0].clientY);
    }
    function M(p) {
      !o.current.interactive || !B || (p.preventDefault(), t += (p.touches[0].clientX - P) * 5e-3, u += (p.touches[0].clientY - E) * 5e-3, u = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, u)), P = p.touches[0].clientX, E = p.touches[0].clientY);
    }
    function k() {
      B = !1;
    }
    i.addEventListener("mousedown", v), i.addEventListener("mousemove", R), window.addEventListener("mouseup", x), i.addEventListener("touchstart", F, { passive: !1 }), i.addEventListener("touchmove", M, { passive: !1 }), i.addEventListener("touchend", k);
    function L(p, d, b, A, T, D) {
      const z = Math.cos(t), O = Math.sin(t), W = Math.cos(u), Y = Math.sin(u), q = p * z - b * O, H = p * O + b * z, G = d * W - H * Y, U = d * Y + H * W, j = A + U + 600;
      return [T + q * A / j, D + G * A / j, U];
    }
    function w() {
      const {
        gridCols: p,
        gridRows: d,
        noiseScale: b,
        heightScale: A,
        wireColor: T,
        backgroundColor: D,
        fov: z,
        autoRotate: O,
        autoRotateSpeed: W,
        glowEffect: Y,
        glowBlur: q,
        animated: H,
        lineWidth: G,
        colorByHeight: U
      } = o.current;
      if (O && !B && (t += W), r.fillStyle = D, r.fillRect(0, 0, s, m), !H || s === 0) {
        e = requestAnimationFrame(w);
        return;
      }
      const j = `${p},${d},${b}`;
      if (j !== f) {
        const V = p + 1;
        g = new Float32Array(V * (d + 1));
        for (let et = 0; et <= d; et++)
          for (let it = 0; it <= p; it++)
            g[et * V + it] = xr(it * b, et * b, 4, 0.5);
        f = j;
      }
      const N = g, K = p + 1;
      T !== $ && ([y, S, I] = Rr(T), $ = T);
      const Z = s / 2, nt = m / 2, rt = s * 0.9, st = m * 0.9, tt = rt / p, Q = st / d;
      r.save(), Y && (r.shadowBlur = q, r.shadowColor = T), r.lineWidth = G;
      const _ = new Float32Array(K * (d + 1)), J = new Float32Array(K * (d + 1)), ot = new Float32Array(K * (d + 1));
      for (let V = 0; V <= d; V++)
        for (let et = 0; et <= p; et++) {
          const it = N[V * K + et], ct = -rt / 2 + et * tt, lt = -st / 2 + V * Q, [ft, mt, wt] = L(ct, lt, it * A, z, Z, nt), vt = V * K + et;
          _[vt] = ft, J[vt] = mt, ot[vt] = wt;
        }
      for (let V = 0; V <= d; V++) {
        let et = 0;
        const it = V * K;
        for (let ft = 0; ft <= p; ft++) et += N[it + ft];
        et /= K;
        const ct = U ? Math.max(0, Math.min(1, (et + 1) * 0.5)) : 1, lt = U ? 0.2 + ct * 0.8 : 0.6;
        r.strokeStyle = `rgba(${y},${S},${I},${lt.toFixed(2)})`, r.beginPath(), r.moveTo(_[it], J[it]);
        for (let ft = 1; ft <= p; ft++)
          r.lineTo(_[it + ft], J[it + ft]);
        r.stroke();
      }
      for (let V = 0; V <= p; V++) {
        let et = 0;
        for (let lt = 0; lt <= d; lt++) et += N[lt * K + V];
        et /= d + 1;
        const it = U ? Math.max(0, Math.min(1, (et + 1) * 0.5)) : 1, ct = U ? 0.2 + it * 0.8 : 0.6;
        r.strokeStyle = `rgba(${y},${S},${I},${ct.toFixed(2)})`, r.beginPath(), r.moveTo(_[V], J[V]);
        for (let lt = 1; lt <= d; lt++)
          r.lineTo(_[lt * K + V], J[lt * K + V]);
        r.stroke();
      }
      r.restore(), e = requestAnimationFrame(w);
    }
    return e = requestAnimationFrame(w), () => {
      c.disconnect(), cancelAnimationFrame(e), i.removeEventListener("mousedown", v), i.removeEventListener("mousemove", R), window.removeEventListener("mouseup", x), i.removeEventListener("touchstart", F), i.removeEventListener("touchmove", M), i.removeEventListener("touchend", k);
    };
  }, [n]);
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
  (n, h) => {
    const {
      preset: o,
      gridCols: a,
      gridRows: i,
      noiseScale: r,
      heightScale: s,
      wireColor: m,
      backgroundColor: e,
      fov: t,
      rotateX: u,
      rotateY: g,
      autoRotate: f,
      autoRotateSpeed: y,
      glowEffect: S,
      glowBlur: I,
      interactive: $,
      animated: B,
      lineWidth: P,
      colorByHeight: E,
      width: C,
      height: c,
      className: l,
      style: v
    } = n, R = o && kr[o] || {}, x = X(null);
    return gt(h, () => x.current), Sr(x, {
      gridCols: a ?? 40,
      gridRows: i ?? 30,
      noiseScale: r ?? R.noiseScale ?? 0.12,
      heightScale: s ?? R.heightScale ?? 120,
      wireColor: m ?? R.wireColor ?? "#ffffff",
      backgroundColor: e ?? R.backgroundColor ?? "#111111",
      fov: t ?? 500,
      rotateX: u ?? 0.4,
      rotateY: g ?? 0,
      autoRotate: f ?? !0,
      autoRotateSpeed: y ?? 3e-3,
      glowEffect: S ?? R.glowEffect ?? !1,
      glowBlur: I ?? R.glowBlur ?? 8,
      interactive: $ ?? !0,
      animated: B ?? !0,
      lineWidth: P ?? R.lineWidth ?? 0.5,
      colorByHeight: E ?? R.colorByHeight ?? !0
    }), /* @__PURE__ */ at(
      "div",
      {
        className: l,
        style: {
          width: C ?? "100%",
          height: c ?? "100%",
          display: "block",
          overflow: "hidden",
          cursor: $ ?? !0 ? "grab" : "default",
          ...v
        },
        children: /* @__PURE__ */ at(
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
Er.displayName = "TerrainMesh";
export {
  wr as AntColony,
  He as AudioVisualizer,
  sn as AuroraBorealis,
  tn as Boids,
  Do as ClothSimulation,
  _e as Confetti,
  ao as ConstellationMap,
  ir as CrystalGrowth,
  Rn as DiffusionAggregation,
  Xe as FireEffect,
  bo as Fireworks,
  so as FlowField,
  qo as FluidSimulation,
  Vo as GameOfLife,
  xo as GlitchOverlay,
  Un as InkBleed,
  Tn as Kaleidoscope,
  Pn as LSystem,
  No as Lightning,
  En as Lissajous,
  ko as LiveChart,
  Io as MagneticBlob,
  Cr as MagneticField,
  Bo as Mandala,
  Pe as MatrixRain,
  mr as Metaballs,
  lr as NeuralWeb,
  to as NoiseGradient,
  De as ParticleField,
  fr as ParticleText,
  tr as PendulaWave,
  oo as PixelDissolve,
  Yo as Rain,
  nn as ReactionDiffusion,
  yn as SandSimulation,
  mo as Shockwave,
  Gn as SlimeMold,
  gn as Spirograph,
  fo as Spotlight,
  qe as Starfield,
  Er as TerrainMesh,
  On as VoronoiCells,
  Kn as WatercolorBloom,
  bn as WaveInterference,
  Qo as Wormhole
};
