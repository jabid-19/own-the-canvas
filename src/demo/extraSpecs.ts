// Generated from docs component pages (PROPS tables). Drives the generic playground panel.
export type PlaygroundProp =
  | { name: string; label: string; kind: "color"; def: string }
  | { name: string; label: string; kind: "bool"; def: boolean }
  | { name: string; label: string; kind: "num"; def: number; min: number; max: number; step: number }
  | { name: string; label: string; kind: "sel"; def: string; options: string[] };
export interface PlaygroundSpec { desc: string; accent: string; presets: string[]; props: PlaygroundProp[] }
export const EXTRA_IDS = ["Candle","Cat","CloudSea","Dandelion","Eye","Ferrofluid","Fireflies","GrassField","Hummingbird","IncenseSmoke","InkMountains","IvyGrowth","Jellyfish","KelpForest","Komorebi","MoonlitSea","Moths","Octopus","OrigamiCranes","Owl","PaperLanterns","SeasonsTree","Snail","SnowDrift","SunbeamDust","Sunflowers","TidePool","WindowRain"] as const;
export type ExtraId = (typeof EXTRA_IDS)[number];
export const EXTRA_SPECS: Record<string, PlaygroundSpec> = {
 "Candle": {
  "desc": "A single pillar candle in a dark room",
  "accent": "#ff9a3c",
  "presets": [
   "default",
   "ivory",
   "rose",
   "obsidian",
   "spirit",
   "monochrome"
  ],
  "props": [
   {
    "name": "flameColor",
    "label": "Flame Color",
    "kind": "color",
    "def": "#ff9a3c"
   },
   {
    "name": "coreColor",
    "label": "Core Color",
    "kind": "color",
    "def": "#fff3d1"
   },
   {
    "name": "waxColor",
    "label": "Wax Color",
    "kind": "color",
    "def": "#efe2cc"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0b0705"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "candleHeight",
    "label": "Candle Height",
    "kind": "num",
    "def": 0.6,
    "min": 0.1,
    "max": 1.2,
    "step": 0.05
   },
   {
    "name": "flicker",
    "label": "Flicker",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "glowIntensity",
    "label": "Glow Intensity",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Cat": {
  "desc": "A cat asleep, curled nose to tail",
  "accent": "#d9822b",
  "presets": [
   "default",
   "tuxedo",
   "siamese",
   "grey",
   "midnight",
   "monochrome"
  ],
  "props": [
   {
    "name": "furColor",
    "label": "Fur Color",
    "kind": "color",
    "def": "#d9822b"
   },
   {
    "name": "stripeColor",
    "label": "Stripe Color",
    "kind": "color",
    "def": "#8f4a16"
   },
   {
    "name": "bellyColor",
    "label": "Belly Color",
    "kind": "color",
    "def": "#f4dcc0"
   },
   {
    "name": "eyeColor",
    "label": "Eye Color",
    "kind": "color",
    "def": "#9cc23a"
   },
   {
    "name": "cushionColor",
    "label": "Cushion Color",
    "kind": "color",
    "def": "#7a2f3d"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#140f16"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "CloudSea": {
  "desc": "Above the clouds at sunset: a deck of cloud stretches to the horizon in perspective, rims lit by a low sun, drifting slowly beneath you",
  "accent": "#1e1b4b",
  "presets": [
   "default",
   "sunset",
   "dawn",
   "golden",
   "stormy"
  ],
  "props": [
   {
    "name": "skyColor",
    "label": "Sky Color",
    "kind": "color",
    "def": "#1e1b4b"
   },
   {
    "name": "sunColor",
    "label": "Sun Color",
    "kind": "color",
    "def": "#fb923c"
   },
   {
    "name": "cloudColor",
    "label": "Cloud Color",
    "kind": "color",
    "def": "#fde2cf"
   },
   {
    "name": "shadowColor",
    "label": "Shadow Color",
    "kind": "color",
    "def": "#8a6f8e"
   },
   {
    "name": "horizon",
    "label": "Horizon",
    "kind": "num",
    "def": 0.36,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "coverage",
    "label": "Coverage",
    "kind": "num",
    "def": 0.55,
    "min": 0,
    "max": 1.7,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Dandelion": {
  "desc": "Dandelion clocks you can blow apart with the cursor",
  "accent": "#dbeafe",
  "presets": [
   "default",
   "meadow",
   "sunset",
   "moonlit",
   "ink",
   "monochrome"
  ],
  "props": [
   {
    "name": "headCount",
    "label": "Head Count",
    "kind": "num",
    "def": 3,
    "min": 1,
    "max": 9,
    "step": 0.1
   },
   {
    "name": "seedsPerHead",
    "label": "Seeds Per Head",
    "kind": "num",
    "def": 110,
    "min": 1,
    "max": 330,
    "step": 1
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#dbeafe"
   },
   {
    "name": "stemColor",
    "label": "Stem Color",
    "kind": "color",
    "def": "#3b4a63"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#05080f"
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 0.9,
    "min": 0,
    "max": 2.7,
    "step": 0.05
   },
   {
    "name": "blowStrength",
    "label": "Blow Strength",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "autoBlow",
    "label": "Auto Blow",
    "kind": "bool",
    "def": true
   },
   {
    "name": "regrow",
    "label": "Regrow",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Eye": {
  "desc": "A single living eye, painted like a chiaroscuro portrait",
  "accent": "#4a7c59",
  "presets": [
   "default",
   "ocean",
   "amber",
   "violet",
   "serpent",
   "monochrome"
  ],
  "props": [
   {
    "name": "irisColor",
    "label": "Iris Color",
    "kind": "color",
    "def": "#4a7c59"
   },
   {
    "name": "irisInnerColor",
    "label": "Iris Inner Color",
    "kind": "color",
    "def": "#c8963e"
   },
   {
    "name": "scleraColor",
    "label": "Sclera Color",
    "kind": "color",
    "def": "#f1ebe4"
   },
   {
    "name": "skinColor",
    "label": "Skin Color",
    "kind": "color",
    "def": "#c99a7e"
   },
   {
    "name": "lashColor",
    "label": "Lash Color",
    "kind": "color",
    "def": "#1a1210"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0c0807"
   },
   {
    "name": "pupilShape",
    "label": "Pupil Shape",
    "kind": "sel",
    "def": "round",
    "options": [
     "round",
     "slit"
    ]
   },
   {
    "name": "pupilSize",
    "label": "Pupil Size",
    "kind": "num",
    "def": 0.38,
    "min": 0.08,
    "max": 0.85,
    "step": 0.01
   },
   {
    "name": "eyeSize",
    "label": "Eye Size",
    "kind": "num",
    "def": 1,
    "min": 0.2,
    "max": 1.5,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "blinkInterval",
    "label": "Blink Interval",
    "kind": "num",
    "def": 4000,
    "min": 1,
    "max": 12000,
    "step": 1
   },
   {
    "name": "showLashes",
    "label": "Show Lashes",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Ferrofluid": {
  "desc": "A pool of glossy black ferrofluid on a polished table",
  "accent": "#050505",
  "presets": [
   "default",
   "studio",
   "noir",
   "gold",
   "oil-slick"
  ],
  "props": [
   {
    "name": "fluidColor",
    "label": "Fluid Color",
    "kind": "color",
    "def": "#050505"
   },
   {
    "name": "highlightColor",
    "label": "Highlight Color",
    "kind": "color",
    "def": "#ffffff"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#ececec"
   },
   {
    "name": "spikes",
    "label": "Spikes",
    "kind": "num",
    "def": 9,
    "min": 1,
    "max": 27,
    "step": 0.1
   },
   {
    "name": "spikeHeight",
    "label": "Spike Height",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "poolWidth",
    "label": "Pool Width",
    "kind": "num",
    "def": 0.5,
    "min": 0.03,
    "max": 1,
    "step": 0.01
   },
   {
    "name": "strength",
    "label": "Strength",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "reflection",
    "label": "Reflection",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Fireflies": {
  "desc": "Glowing fireflies that drift at dusk and slowly fall into synchronized flashing, using the same pulse-coupled oscillator model that explains real firefly swarms",
  "accent": "#d9f99d",
  "presets": [
   "default",
   "summer",
   "riverbank",
   "blue-ghost",
   "ember",
   "monochrome"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 60,
    "min": 1,
    "max": 180,
    "step": 1
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#d9f99d"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#06100a"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 2.2,
    "min": 0.2,
    "max": 6.6,
    "step": 0.1
   },
   {
    "name": "glow",
    "label": "Glow",
    "kind": "num",
    "def": 18,
    "min": 1,
    "max": 54,
    "step": 1
   },
   {
    "name": "period",
    "label": "Period",
    "kind": "num",
    "def": 1.6,
    "min": 0,
    "max": 4.8,
    "step": 0.05
   },
   {
    "name": "sync",
    "label": "Sync",
    "kind": "num",
    "def": 0.08,
    "min": 0,
    "max": 0.24,
    "step": 0.01
   },
   {
    "name": "syncRadius",
    "label": "Sync Radius",
    "kind": "num",
    "def": 160,
    "min": 1,
    "max": 480,
    "step": 1
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "GrassField": {
  "desc": "Thousands of grass blades on damped springs, swaying in a breeze while gust bands roll across the field",
  "accent": "#14301a",
  "presets": [
   "default",
   "meadow",
   "dusk",
   "wheat",
   "frost",
   "monochrome"
  ],
  "props": [
   {
    "name": "density",
    "label": "Density",
    "kind": "num",
    "def": 45,
    "min": 1,
    "max": 140,
    "step": 1
   },
   {
    "name": "bladeHeight",
    "label": "Blade Height",
    "kind": "num",
    "def": 0.38,
    "min": 0,
    "max": 1.1,
    "step": 0.05
   },
   {
    "name": "baseColor",
    "label": "Base Color",
    "kind": "color",
    "def": "#14301a"
   },
   {
    "name": "tipColor",
    "label": "Tip Color",
    "kind": "color",
    "def": "#8fd16a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0a1420"
   },
   {
    "name": "flowerColor",
    "label": "Flower Color",
    "kind": "color",
    "def": "#fef3c7"
   },
   {
    "name": "flowers",
    "label": "Flowers",
    "kind": "num",
    "def": 0,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "gusts",
    "label": "Gusts",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "rows",
    "label": "Rows",
    "kind": "num",
    "def": 3,
    "min": 1,
    "max": 9,
    "step": 0.1
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Hummingbird": {
  "desc": "Hummingbirds in a dusk garden",
  "accent": "#2f9e6a",
  "presets": [
   "default",
   "ruby",
   "violet",
   "sunset",
   "frost",
   "monochrome"
  ],
  "props": [
   {
    "name": "bodyColor",
    "label": "Body Color",
    "kind": "color",
    "def": "#2f9e6a"
   },
   {
    "name": "throatColor",
    "label": "Throat Color",
    "kind": "color",
    "def": "#ff2d6f"
   },
   {
    "name": "bellyColor",
    "label": "Belly Color",
    "kind": "color",
    "def": "#e9e4d4"
   },
   {
    "name": "flowerColor",
    "label": "Flower Color",
    "kind": "color",
    "def": "#e8433a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0c1712"
   },
   {
    "name": "birdCount",
    "label": "Bird Count",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 8,
    "step": 0.1
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   },
   {
    "name": "showFlowers",
    "label": "Show Flowers",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "IncenseSmoke": {
  "desc": "Smoke rising from incense: a single smooth thread near the ember that breaks into curls and wisps as it climbs, the laminar-to-turbulent transition of a real plume",
  "accent": "#e7e5e4",
  "presets": [
   "default",
   "temple",
   "sandalwood",
   "moonlight",
   "noir"
  ],
  "props": [
   {
    "name": "sticks",
    "label": "Sticks",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#e7e5e4"
   },
   {
    "name": "emberColor",
    "label": "Ember Color",
    "kind": "color",
    "def": "#ff6a2b"
   },
   {
    "name": "stickColor",
    "label": "Stick Color",
    "kind": "color",
    "def": "#5b4636"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0c0a09"
   },
   {
    "name": "turbulence",
    "label": "Turbulence",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "rise",
    "label": "Rise",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "thickness",
    "label": "Thickness",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "InkMountains": {
  "desc": "An ink-wash landscape: layered ridgelines fade from wet black ink up close to pale mist in the distance, with fog drifting through the valleys, pines on the near slopes, and birds crossing",
  "accent": "#efe8d8",
  "presets": [
   "default",
   "sumi",
   "night",
   "jade",
   "dusk"
  ],
  "props": [
   {
    "name": "paperColor",
    "label": "Paper Color",
    "kind": "color",
    "def": "#efe8d8"
   },
   {
    "name": "inkColor",
    "label": "Ink Color",
    "kind": "color",
    "def": "#141414"
   },
   {
    "name": "sunColor",
    "label": "Sun Color",
    "kind": "color",
    "def": "#b91c1c"
   },
   {
    "name": "layers",
    "label": "Layers",
    "kind": "num",
    "def": 5,
    "min": 1,
    "max": 15,
    "step": 0.1
   },
   {
    "name": "mist",
    "label": "Mist",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "drift",
    "label": "Drift",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "birds",
    "label": "Birds",
    "kind": "num",
    "def": 5,
    "min": 1,
    "max": 15,
    "step": 0.1
   },
   {
    "name": "pines",
    "label": "Pines",
    "kind": "bool",
    "def": true
   },
   {
    "name": "parallax",
    "label": "Parallax",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "IvyGrowth": {
  "desc": "Ivy that grows across your page in real time: vines branch, thicken, curl tendrils, and unfold leaves",
  "accent": "#3f5a2a",
  "presets": [
   "default",
   "english-ivy",
   "autumn",
   "jungle",
   "gilded",
   "monochrome"
  ],
  "props": [
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#3f5a2a"
   },
   {
    "name": "leafColor",
    "label": "Leaf Color",
    "kind": "color",
    "def": "#5f9e3a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0c120b"
   },
   {
    "name": "vines",
    "label": "Vines",
    "kind": "num",
    "def": 4,
    "min": 1,
    "max": 12,
    "step": 0.1
   },
   {
    "name": "growthSpeed",
    "label": "Growth Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "density",
    "label": "Density",
    "kind": "num",
    "def": 1,
    "min": 0.3,
    "max": 2,
    "step": 0.05
   },
   {
    "name": "leafSize",
    "label": "Leaf Size",
    "kind": "num",
    "def": 9,
    "min": 1,
    "max": 27,
    "step": 0.1
   },
   {
    "name": "leafDensity",
    "label": "Leaf Density",
    "kind": "num",
    "def": 0.35,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "hug",
    "label": "Hug",
    "kind": "num",
    "def": 20,
    "min": 1,
    "max": 60,
    "step": 1
   },
   {
    "name": "loop",
    "label": "Loop",
    "kind": "bool",
    "def": false
   }
  ]
 },
 "Jellyfish": {
  "desc": "Moon jellies in open water",
  "accent": "#c9a7e8",
  "presets": [
   "default",
   "sea-nettle",
   "crystal",
   "lions-mane",
   "ghost",
   "monochrome"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 4,
    "min": 1,
    "max": 12,
    "step": 0.1
   },
   {
    "name": "bellColor",
    "label": "Bell Color",
    "kind": "color",
    "def": "#c9a7e8"
   },
   {
    "name": "glowColor",
    "label": "Glow Color",
    "kind": "color",
    "def": "#8fd8ff"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#04122a"
   },
   {
    "name": "tentacleLength",
    "label": "Tentacle Length",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "pulseRate",
    "label": "Pulse Rate",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "KelpForest": {
  "desc": "An underwater kelp forest: buoyant stalks sway in the current, two schools of fish wander between them, bubbles rise, and light filters down from the surface",
  "accent": "#8a7a2c",
  "presets": [
   "default",
   "pacific",
   "tropical",
   "midnight",
   "golden",
   "monochrome"
  ],
  "props": [
   {
    "name": "kelpCount",
    "label": "Kelp Count",
    "kind": "num",
    "def": 9,
    "min": 1,
    "max": 27,
    "step": 0.1
   },
   {
    "name": "fishCount",
    "label": "Fish Count",
    "kind": "num",
    "def": 16,
    "min": 1,
    "max": 48,
    "step": 0.1
   },
   {
    "name": "kelpColor",
    "label": "Kelp Color",
    "kind": "color",
    "def": "#8a7a2c"
   },
   {
    "name": "fishColor",
    "label": "Fish Color",
    "kind": "color",
    "def": "#e2e8f0"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#052637"
   },
   {
    "name": "current",
    "label": "Current",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "bubbles",
    "label": "Bubbles",
    "kind": "bool",
    "def": true
   },
   {
    "name": "lightRays",
    "label": "Light Rays",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Komorebi": {
  "desc": "木漏れ日: sunlight filtering through leaves onto a wall",
  "accent": "#ffd9a0",
  "presets": [
   "default",
   "morning",
   "forest",
   "golden-hour",
   "moonlight",
   "monochrome"
  ],
  "props": [
   {
    "name": "lightColor",
    "label": "Light Color",
    "kind": "color",
    "def": "#ffd9a0"
   },
   {
    "name": "shadowColor",
    "label": "Shadow Color",
    "kind": "color",
    "def": "#3a4a3a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#c9b49a"
   },
   {
    "name": "density",
    "label": "Density",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "sunHeight",
    "label": "Sun Height",
    "kind": "num",
    "def": 0.7,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "MoonlitSea": {
  "desc": "The open sea at night: swells roll toward you in perspective, and the moon lays a path of glitter across the water where wave facets tilt its reflection into your eye",
  "accent": "#0b2236",
  "presets": [
   "default",
   "midnight",
   "harvest",
   "arctic",
   "rose"
  ],
  "props": [
   {
    "name": "seaColor",
    "label": "Sea Color",
    "kind": "color",
    "def": "#0b2236"
   },
   {
    "name": "skyColor",
    "label": "Sky Color",
    "kind": "color",
    "def": "#030712"
   },
   {
    "name": "moonColor",
    "label": "Moon Color",
    "kind": "color",
    "def": "#f8fafc"
   },
   {
    "name": "horizon",
    "label": "Horizon",
    "kind": "num",
    "def": 0.42,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "moonX",
    "label": "Moon X",
    "kind": "num",
    "def": 0.62,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "waveHeight",
    "label": "Wave Height",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "stars",
    "label": "Stars",
    "kind": "num",
    "def": 120,
    "min": 1,
    "max": 360,
    "step": 1
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Moths": {
  "desc": "Moths spiraling around a lamp, steering by transverse orientation: each one holds the light at a fixed angle, which bends its path into a spiral",
  "accent": "#c8b28f",
  "presets": [
   "default",
   "porch-lamp",
   "moonlight",
   "candle",
   "neon",
   "monochrome"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 26,
    "min": 1,
    "max": 78,
    "step": 1
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#c8b28f"
   },
   {
    "name": "lightColor",
    "label": "Light Color",
    "kind": "color",
    "def": "#ffd27a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0b0805"
   },
   {
    "name": "angle",
    "label": "Angle",
    "kind": "num",
    "def": 80,
    "min": 1,
    "max": 240,
    "step": 1
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 8,
    "min": 1,
    "max": 24,
    "step": 0.1
   },
   {
    "name": "glowRadius",
    "label": "Glow Radius",
    "kind": "num",
    "def": 120,
    "min": 1,
    "max": 360,
    "step": 1
   },
   {
    "name": "lightX",
    "label": "Light X",
    "kind": "num",
    "def": 0.5,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "lightY",
    "label": "Light Y",
    "kind": "num",
    "def": 0.42,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "showLight",
    "label": "Show Light",
    "kind": "bool",
    "def": true
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Octopus": {
  "desc": "An octopus drifting in deep water",
  "accent": "#c4553a",
  "presets": [
   "default",
   "blue-ringed",
   "ghost",
   "abyss",
   "sand",
   "monochrome"
  ],
  "props": [
   {
    "name": "skinColor",
    "label": "Skin Color",
    "kind": "color",
    "def": "#c4553a"
   },
   {
    "name": "spotColor",
    "label": "Spot Color",
    "kind": "color",
    "def": "#7a2a1c"
   },
   {
    "name": "suckerColor",
    "label": "Sucker Color",
    "kind": "color",
    "def": "#f2c4a8"
   },
   {
    "name": "eyeColor",
    "label": "Eye Color",
    "kind": "color",
    "def": "#e8c25a"
   },
   {
    "name": "inkColor",
    "label": "Ink Color",
    "kind": "color",
    "def": "#140b12"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#04131c"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "tentacleLength",
    "label": "Tentacle Length",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "OrigamiCranes": {
  "desc": "A flock of folded-paper cranes, rendered as real 3D facets with flat paper shading, so every crease catches the light as they bank and flap",
  "accent": "#0f0f14",
  "presets": [
   "default",
   "senbazuru",
   "washi",
   "white-paper",
   "gold"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 14,
    "min": 1,
    "max": 42,
    "step": 0.1
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0f0f14"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1.6,
    "min": 0.2,
    "max": 4.8,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Owl": {
  "desc": "An owl on its perch",
  "accent": "#6b4a33",
  "presets": [
   "default",
   "tawny",
   "snowy",
   "barn",
   "spirit",
   "monochrome"
  ],
  "props": [
   {
    "name": "featherColor",
    "label": "Feather Color",
    "kind": "color",
    "def": "#6b4a33"
   },
   {
    "name": "bellyColor",
    "label": "Belly Color",
    "kind": "color",
    "def": "#d9bf9a"
   },
   {
    "name": "faceColor",
    "label": "Face Color",
    "kind": "color",
    "def": "#c48a52"
   },
   {
    "name": "eyeColor",
    "label": "Eye Color",
    "kind": "color",
    "def": "#f2a516"
   },
   {
    "name": "beakColor",
    "label": "Beak Color",
    "kind": "color",
    "def": "#3a3330"
   },
   {
    "name": "branchColor",
    "label": "Branch Color",
    "kind": "color",
    "def": "#3b2a1e"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#070a12"
   },
   {
    "name": "earTufts",
    "label": "Ear Tufts",
    "kind": "bool",
    "def": true
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "blinkInterval",
    "label": "Blink Interval",
    "kind": "num",
    "def": 5000,
    "min": 1,
    "max": 15000,
    "step": 1
   }
  ]
 },
 "PaperLanterns": {
  "desc": "Glowing sky lanterns rising into the night with depth, sway, and a warm flicker",
  "accent": "#ff8a3d",
  "presets": [
   "default",
   "festival",
   "lotus",
   "moon",
   "jade",
   "monochrome"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 22,
    "min": 1,
    "max": 66,
    "step": 1
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#ff8a3d"
   },
   {
    "name": "glowColor",
    "label": "Glow Color",
    "kind": "color",
    "def": "#ffd27a"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0b0612"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 34,
    "min": 1,
    "max": 100,
    "step": 1
   },
   {
    "name": "riseSpeed",
    "label": "Rise Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 0.3,
    "min": 0,
    "max": 0.9,
    "step": 0.01
   },
   {
    "name": "autoRelease",
    "label": "Auto Release",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "SeasonsTree": {
  "desc": "A tree that lives through the year: spring blossoms, full summer canopy, autumn leaves that let go and flutter down, bare winter branches capped with snow",
  "accent": "#4a362a",
  "presets": [
   "default",
   "japanese",
   "maple",
   "moonlight",
   "ink"
  ],
  "props": [
   {
    "name": "cycleSeconds",
    "label": "Cycle Seconds",
    "kind": "num",
    "def": 48,
    "min": 1,
    "max": 140,
    "step": 1
   },
   {
    "name": "trunkColor",
    "label": "Trunk Color",
    "kind": "color",
    "def": "#4a362a"
   },
   {
    "name": "leafColor",
    "label": "Leaf Color",
    "kind": "color",
    "def": "#5b8c3e"
   },
   {
    "name": "blossomColor",
    "label": "Blossom Color",
    "kind": "color",
    "def": "#ffb7c5"
   },
   {
    "name": "autumnColor",
    "label": "Autumn Color",
    "kind": "color",
    "def": "#d9622b"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0e0c0a"
   },
   {
    "name": "treeX",
    "label": "Tree X",
    "kind": "num",
    "def": 0.5,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "treeSize",
    "label": "Tree Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 0.6,
    "min": 0,
    "max": 1.8,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Snail": {
  "desc": "A garden snail gliding on rippling pedal waves, leaving a glistening slime trail that slowly dries",
  "accent": "#b5773f",
  "presets": [
   "default",
   "amber",
   "forest",
   "candy",
   "nocturne",
   "monochrome"
  ],
  "props": [
   {
    "name": "shellColor",
    "label": "Shell Color",
    "kind": "color",
    "def": "#b5773f"
   },
   {
    "name": "bodyColor",
    "label": "Body Color",
    "kind": "color",
    "def": "#a8988a"
   },
   {
    "name": "trailColor",
    "label": "Trail Color",
    "kind": "color",
    "def": "#cfe6ff"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0f1a12"
   },
   {
    "name": "size",
    "label": "Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "trail",
    "label": "Trail",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "SnowDrift": {
  "desc": "Snowfall that actually piles up: on the ground and on top of your page's headline and buttons",
  "accent": "#f8fafc",
  "presets": [
   "default",
   "winter-night",
   "blizzard",
   "nordic",
   "dusk"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 220,
    "min": 1,
    "max": 660,
    "step": 1
   },
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#f8fafc"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#0b1220"
   },
   {
    "name": "flakeSize",
    "label": "Flake Size",
    "kind": "num",
    "def": 2.2,
    "min": 0.2,
    "max": 6.6,
    "step": 0.1
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 0.4,
    "min": 0,
    "max": 1.2,
    "step": 0.05
   },
   {
    "name": "fallSpeed",
    "label": "Fall Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "maxDepth",
    "label": "Max Depth",
    "kind": "num",
    "def": 26,
    "min": 1,
    "max": 78,
    "step": 1
   },
   {
    "name": "floorDepth",
    "label": "Floor Depth",
    "kind": "num",
    "def": 60,
    "min": 1,
    "max": 180,
    "step": 1
   },
   {
    "name": "slope",
    "label": "Slope",
    "kind": "num",
    "def": 0.7,
    "min": 0,
    "max": 2.1,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "SunbeamDust": {
  "desc": "Shafts of light through a window with dust drifting in the air",
  "accent": "#ffcf87",
  "presets": [
   "default",
   "golden-hour",
   "chapel",
   "morning",
   "dusk",
   "monochrome"
  ],
  "props": [
   {
    "name": "color",
    "label": "Color",
    "kind": "color",
    "def": "#ffcf87"
   },
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#140d07"
   },
   {
    "name": "beams",
    "label": "Beams",
    "kind": "num",
    "def": 4,
    "min": 1,
    "max": 12,
    "step": 0.1
   },
   {
    "name": "angle",
    "label": "Angle",
    "kind": "num",
    "def": 24,
    "min": 1,
    "max": 72,
    "step": 1
   },
   {
    "name": "intensity",
    "label": "Intensity",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "dustCount",
    "label": "Dust Count",
    "kind": "num",
    "def": 320,
    "min": 1,
    "max": 960,
    "step": 1
   },
   {
    "name": "dustSize",
    "label": "Dust Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "speed",
    "label": "Speed",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "windowX",
    "label": "Window X",
    "kind": "num",
    "def": 0.35,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "windowWidth",
    "label": "Window Width",
    "kind": "num",
    "def": 0.42,
    "min": 0.04,
    "max": 1.3,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "Sunflowers": {
  "desc": "A row of sunflowers at golden hour",
  "accent": "#f6b51e",
  "presets": [
   "default",
   "dawn",
   "dusk",
   "velvet",
   "moonlight",
   "monochrome"
  ],
  "props": [
   {
    "name": "count",
    "label": "Count",
    "kind": "num",
    "def": 5,
    "min": 1,
    "max": 15,
    "step": 0.1
   },
   {
    "name": "petalColor",
    "label": "Petal Color",
    "kind": "color",
    "def": "#f6b51e"
   },
   {
    "name": "centerColor",
    "label": "Center Color",
    "kind": "color",
    "def": "#4a2a12"
   },
   {
    "name": "stemColor",
    "label": "Stem Color",
    "kind": "color",
    "def": "#4f7a2a"
   },
   {
    "name": "wind",
    "label": "Wind",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "followCursor",
    "label": "Follow Cursor",
    "kind": "bool",
    "def": true
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "TidePool": {
  "desc": "A rock pool seen from above",
  "accent": "#2a8a8f",
  "presets": [
   "default",
   "tropical",
   "kelp-coast",
   "sunset",
   "night",
   "monochrome"
  ],
  "props": [
   {
    "name": "waterColor",
    "label": "Water Color",
    "kind": "color",
    "def": "#2a8a8f"
   },
   {
    "name": "rockColor",
    "label": "Rock Color",
    "kind": "color",
    "def": "#6e6457"
   },
   {
    "name": "anemoneColor",
    "label": "Anemone Color",
    "kind": "color",
    "def": "#5fbf7a"
   },
   {
    "name": "starfishColor",
    "label": "Starfish Color",
    "kind": "color",
    "def": "#e0702e"
   },
   {
    "name": "fishCount",
    "label": "Fish Count",
    "kind": "num",
    "def": 7,
    "min": 1,
    "max": 21,
    "step": 0.1
   },
   {
    "name": "anemoneCount",
    "label": "Anemone Count",
    "kind": "num",
    "def": 5,
    "min": 1,
    "max": 15,
    "step": 0.1
   },
   {
    "name": "causticIntensity",
    "label": "Caustic Intensity",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 2,
    "step": 0.05
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 },
 "WindowRain": {
  "desc": "Rain on a window at night: drops bead, merge, and run down the glass, clearing trails through the condensation",
  "accent": "#07090f",
  "presets": [
   "default",
   "city-night",
   "neon",
   "cafe",
   "storm"
  ],
  "props": [
   {
    "name": "backgroundColor",
    "label": "Background Color",
    "kind": "color",
    "def": "#07090f"
   },
   {
    "name": "fogColor",
    "label": "Fog Color",
    "kind": "color",
    "def": "#94a3b8"
   },
   {
    "name": "rain",
    "label": "Rain",
    "kind": "num",
    "def": 1,
    "min": 0,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "dropSize",
    "label": "Drop Size",
    "kind": "num",
    "def": 1,
    "min": 0.1,
    "max": 3,
    "step": 0.05
   },
   {
    "name": "fog",
    "label": "Fog",
    "kind": "num",
    "def": 0.25,
    "min": 0,
    "max": 1,
    "step": 0.05
   },
   {
    "name": "lights",
    "label": "Lights",
    "kind": "num",
    "def": 34,
    "min": 1,
    "max": 100,
    "step": 1
   },
   {
    "name": "interactive",
    "label": "Interactive",
    "kind": "bool",
    "def": true
   }
  ]
 }
};
