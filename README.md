# own-the-canvas

> Beautiful, responsive, fully customizable HTML canvas–based React visual components. Zero dependencies. TypeScript. 60fps.

![Demo](https://placehold.co/800x400/0a0a0a/00cfff?text=own-the-canvas+Demo+GIF)

## Install

```bash
npm install own-the-canvas
# or
pnpm add own-the-canvas
```

> **Peer deps:** React 18+

---

## Quick Start

```tsx
import { MatrixRain, ParticleField, Starfield } from 'own-the-canvas';

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MatrixRain color="#00ff41" glowEffect />
    </div>
  );
}
```

All components default to `width: "100%"` and `height: "100%"` so they fill their parent.

---

## Components

### MatrixRain

Classic falling character rain effect.


```tsx
import { MatrixRain } from 'own-the-canvas';

<MatrixRain
  color="#00ff41"
  fontSize={16}
  speed={1}
  charset="katakana"
  glowEffect
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#00ff41"` | Character color |
| `backgroundColor` | `string` | `"rgba(0,0,0,0.05)"` | Canvas background (use rgba for trail) |
| `fontSize` | `number` | `16` | Character font size in px |
| `speed` | `number` | `1` | Fall speed multiplier |
| `charset` | `"katakana" \| "latin" \| "binary" \| string` | `"katakana"` | Character set |
| `density` | `number` | `0.85` | Column density 0–1 |
| `fadeStrength` | `number` | `0.05` | Trail fade 0–1 |
| `glowEffect` | `boolean` | `true` | Neon glow |

---

### ParticleField

Floating particles with optional connections and mouse repulsion.


```tsx
import { ParticleField } from 'own-the-canvas';

<ParticleField
  particleCount={120}
  particleColor="#7eb8f7"
  connectParticles
  interactive
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `particleCount` | `number` | `120` | Number of particles |
| `particleColor` | `string` | `"#7eb8f7"` | Particle fill color |
| `lineColor` | `string` | `"#7eb8f7"` | Connection line color |
| `lineDistance` | `number` | `120` | Max distance for lines |
| `particleSize` | `number` | `2.5` | Max particle radius |
| `speed` | `number` | `0.8` | Movement speed |
| `connectParticles` | `boolean` | `true` | Draw lines between close particles |
| `interactive` | `boolean` | `true` | Repel on mouse move |
| `backgroundColor` | `string` | `"transparent"` | Background color |

---

### Starfield

2D twinkle or 3D warp tunnel starfield.


```tsx
import { Starfield } from 'own-the-canvas';

<Starfield
  starCount={200}
  perspective="3D"
  speed={2}
  shootingStars
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `starCount` | `number` | `200` | Number of stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `backgroundColor` | `string` | `"#000010"` | Background |
| `speed` | `number` | `0.5` | Movement speed |
| `twinkle` | `boolean` | `true` | Twinkle effect |
| `shootingStars` | `boolean` | `true` | Shooting stars |
| `shootingStarInterval` | `number` | `3000` | Ms between shooting stars |
| `perspective` | `"2D" \| "3D"` | `"2D"` | Flat or warp tunnel |

---

### FireEffect

Pixel-level fire simulation with multiple palettes.


```tsx
import { FireEffect } from 'own-the-canvas';

<FireEffect palette="inferno" intensity={0.95} />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `palette` | `"inferno" \| "toxic" \| "ice" \| "plasma"` | `"inferno"` | Color theme |
| `intensity` | `number` | `0.95` | Flame intensity 0–1 |
| `windStrength` | `number` | `0.3` | Horizontal wind 0–1 |
| `windDirection` | `number` | `1` | 1 = right, -1 = left |
| `spread` | `number` | `0.7` | Flame spread 0–1 |
| `cooling` | `number` | `0.3` | Cooling rate 0–1 |

---

### AudioVisualizer

Web Audio API visualizer with 4 modes.


```tsx
import { AudioVisualizer } from 'own-the-canvas';

const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

<AudioVisualizer
  audioSource={stream}
  mode="bars"
  barCount={64}
  gradient
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `audioSource` | `MediaStream \| null` | `null` | Audio stream (shows idle anim when null) |
| `barCount` | `number` | `64` | Number of frequency bars |
| `barColor` | `string` | `"#00cfff"` | Bar fill color |
| `waveColor` | `string` | `"#00cfff"` | Wave stroke color |
| `mode` | `"bars" \| "wave" \| "circular" \| "mirror"` | `"bars"` | Visualization mode |
| `sensitivity` | `number` | `1` | Amplitude multiplier |
| `gapBetweenBars` | `number` | `2` | Gap between bars (px) |
| `rounded` | `boolean` | `true` | Rounded bar caps |
| `gradient` | `boolean` | `true` | Color gradient on bars |

---

### Confetti

Burst or continuous confetti cannon.


```tsx
import { Confetti } from 'own-the-canvas';
const [fire, setFire] = useState(false);

<Confetti trigger={fire} particleCount={150} />
<button onClick={() => { setFire(false); setTimeout(() => setFire(true), 50); }}>
  🎉
</button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `trigger` | `boolean` | `false` | Rising edge fires a burst |
| `particleCount` | `number` | `150` | Pieces per burst |
| `spread` | `number` | `0.8` | Spread angle 0–1 |
| `gravity` | `number` | `0.5` | Gravity strength |
| `colors` | `string[]` | multi-color | Confetti colors |
| `shapes` | `ConfettiShape[]` | all shapes | Shapes to include |
| `duration` | `number` | `4000` | Piece lifetime (ms) |
| `continuous` | `boolean` | `false` | Trickle while trigger is true |
| `wind` | `number` | `0.5` | Horizontal wind |

---

### RippleEffect

Expanding ring ripples on click or auto.


```tsx
import { RippleEffect } from 'own-the-canvas';

<RippleEffect color="#00cfff" maxRadius={150} interactive />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `color` | `string` | `"#00cfff"` | Ring stroke color |
| `maxRadius` | `number` | `150` | Max ring radius |
| `speed` | `number` | `2` | Expansion speed |
| `lineWidth` | `number` | `1.5` | Stroke width |
| `decay` | `number` | `0.8` | Opacity decay rate |
| `multiRipple` | `boolean` | `true` | Allow multiple simultaneous ripples |
| `backgroundColor` | `string` | `"transparent"` | Canvas background |
| `interactive` | `boolean` | `true` | Spawn ripple on click |

---

### NoiseGradient

Animated Perlin noise–driven color gradient.


```tsx
import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={["#0d0221", "#2d1b69", "#11998e", "#38ef7d"]}
  speed={0.3}
  octaves={3}
  animated
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `colors` | `string[]` | deep space | 2–5 hex gradient stops |
| `speed` | `number` | `0.3` | Animation speed |
| `scale` | `number` | `1` | Noise zoom level |
| `octaves` | `number` | `3` | Fractal detail 1–6 |
| `animated` | `boolean` | `true` | Enable animation |
| `blendMode` | `string` | `"source-over"` | Canvas composite mode |

---

### PixelDissolve

Pixelated dissolve transition overlay for any React content.


```tsx
import { PixelDissolve } from 'own-the-canvas';

<PixelDissolve trigger={show} direction="out" pixelSize={8}>
  <YourComponent />
</PixelDissolve>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | — | Content to dissolve over |
| `pixelSize` | `number` | `8` | Block size in px |
| `speed` | `number` | `0.5` | Animation speed 0–2 |
| `direction` | `"in" \| "out" \| "both"` | `"out"` | Dissolve direction |
| `trigger` | `boolean` | `false` | Rising edge triggers animation |
| `color` | `string` | `"#0a0a0a"` | Pixel fill color |
| `onComplete` | `() => void` | — | Called when animation finishes |

---

### ConstellationMap

Draggable star constellation with animated connections.


```tsx
import { ConstellationMap } from 'own-the-canvas';

<ConstellationMap
  starCount={80}
  lineColor="#8888ff"
  interactive
  glowStars
/>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `starCount` | `number` | `80` | Number of stars |
| `starColor` | `string` | `"#ffffff"` | Star color |
| `lineColor` | `string` | `"#8888ff"` | Connection line color |
| `backgroundColor` | `string` | `"#050510"` | Background |
| `speed` | `number` | `0.3` | Star drift speed |
| `interactive` | `boolean` | `true` | Drag stars with mouse |
| `lineStyle` | `"solid" \| "dashed"` | `"solid"` | Line style |
| `glowStars` | `boolean` | `true` | Glow on stars |
| `connectionDistance` | `number` | `100` | Max distance for lines |

---

## Base Props (all components)

Every component accepts these:

| Prop | Type | Default |
|------|------|---------|
| `width` | `number \| string` | `"100%"` |
| `height` | `number \| string` | `"100%"` |
| `className` | `string` | — |
| `style` | `React.CSSProperties` | — |

All components use `forwardRef` — the ref is forwarded to the underlying `<canvas>` element.

---

## Tree-shaking

Import only what you use:

```tsx
import { MatrixRain } from 'own-the-canvas';      // ✓ only MatrixRain bundled
import { ParticleField } from 'own-the-canvas';   // ✓ only ParticleField bundled
```

---

## License

MIT
