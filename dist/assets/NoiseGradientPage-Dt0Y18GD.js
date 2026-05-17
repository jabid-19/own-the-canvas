import{j as e,p as a,q as o,N as t,s,t as i}from"./index-B9SmDpOO.js";const n=[{name:"colors",type:"string[]",default:"—",description:"Array of 2–6 hex colors to blend between.",required:!0},{name:"speed",type:"number",default:"0.3",description:"Animation speed (0 = static)."},{name:"scale",type:"number",default:"1",description:"Noise zoom level."},{name:"octaves",type:"number",default:"3",description:"Perlin noise octaves (detail level)."},{name:"animated",type:"boolean",default:"true",description:"Enable animation. False renders a static image."}];function l(){return e.jsxs(a,{eyebrow:"Component",title:"NoiseGradient",lead:"Animated Perlin noise-driven color gradient. Pass any set of hex colors and they'll blend fluidly across the canvas.",children:[e.jsx(o,{playgroundId:"NoiseGradient",children:e.jsx(t,{colors:["#111111","#6b7280","#ffffff"],speed:.3,scale:1,octaves:3,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(s,{code:`import { NoiseGradient } from 'own-the-canvas';

<NoiseGradient
  colors={["#111111", "#6b7280", "#ffffff"]}
  speed={0.3}
  scale={1}
  octaves={3}
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{className:"page-section","aria-labelledby":"presets-h",children:[e.jsx("h2",{className:"page-h2",id:"presets-h",children:"Preset palettes"}),e.jsx(s,{code:`// Sunset
colors={["#0f0c29", "#ff6b6b", "#ffd89b"]}

// Ocean
colors={["#0052d4", "#4364f7", "#6fb1fc"]}

// Plasma
colors={["#12002f", "#7b00d4", "#ff00ff", "#ff9900"]}`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(i,{props:n})]})]})}export{l as NoiseGradientPage};
