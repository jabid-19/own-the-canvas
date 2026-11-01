/**
 * Seeded value noise + fractal sums. Deterministic, dependency-free, [0, 1].
 * Smooth (C1) via smoothstep interpolation; good enough for ridgelines,
 * clouds, and fog where Perlin's gradient quality isn't visible.
 */

function hash1(i: number, seed: number): number {
  const x = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function hash2(ix: number, iy: number, seed: number): number {
  const x = Math.sin(ix * 127.1 + iy * 311.7 + seed * 74.7) * 43758.5453;
  return x - Math.floor(x);
}

const fade = (t: number) => t * t * (3 - 2 * t);

export function noise1(x: number, seed = 0): number {
  const i = Math.floor(x);
  const f = fade(x - i);
  const a = hash1(i, seed);
  return a + (hash1(i + 1, seed) - a) * f;
}

export function noise2(x: number, y: number, seed = 0): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = fade(x - ix), fy = fade(y - iy);
  const a = hash2(ix, iy, seed), b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed), d = hash2(ix + 1, iy + 1, seed);
  const top = a + (b - a) * fx;
  const bot = c + (d - c) * fx;
  return top + (bot - top) * fy;
}

/** Fractal (fBm) 1D noise, normalized to [0, 1]. */
export function fbm1(x: number, octaves = 5, seed = 0, gain = 0.5): number {
  let sum = 0, amp = 1, norm = 0, freq = 1;
  for (let o = 0; o < octaves; o++) {
    sum += noise1(x * freq, seed + o * 17) * amp;
    norm += amp;
    amp *= gain;
    freq *= 2;
  }
  return sum / norm;
}

/** Fractal (fBm) 2D noise, normalized to [0, 1]. */
export function fbm2(x: number, y: number, octaves = 4, seed = 0, gain = 0.5): number {
  let sum = 0, amp = 1, norm = 0, freq = 1;
  for (let o = 0; o < octaves; o++) {
    sum += noise2(x * freq, y * freq, seed + o * 17) * amp;
    norm += amp;
    amp *= gain;
    freq *= 2;
  }
  return sum / norm;
}
