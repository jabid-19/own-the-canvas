import{j as e,p as a,q as t,e as r,s,t as l}from"./index-B9SmDpOO.js";const i=[{name:"colors",type:"string[]",default:"multi",description:"Particle burst colors."},{name:"particleCount",type:"number",default:"80",description:"Particles per explosion."},{name:"gravity",type:"number",default:"0.08",description:"Gravity pull per frame."},{name:"friction",type:"number",default:"0.97",description:"Velocity friction 0–1."},{name:"fadeSpeed",type:"number",default:"0.015",description:"Alpha fade per frame."},{name:"particleSize",type:"number",default:"2",description:"Particle base size in px."},{name:"trailLength",type:"number",default:"6",description:"Trail history length in frames."},{name:"spread",type:"number",default:"5",description:"Explosion spread speed."},{name:"autoLaunch",type:"boolean",default:"true",description:"Auto-launch shells periodically."},{name:"autoInterval",type:"number",default:"1800",description:"Average ms between auto-launches."},{name:"glowEffect",type:"boolean",default:"true",description:"Glow on particles."},{name:"glowBlur",type:"number",default:"8",description:"Shadow blur for glow."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"shellSpeed",type:"number",default:"12",description:"Shell upward speed."},{name:"preset",type:"string",default:"—",description:'"default" | "celebration" | "subtle" | "neon" | "golden"'}];function n(){return e.jsxs(a,{eyebrow:"Component",title:"Fireworks",lead:"Physics-based fireworks with launching shells, particle bursts, gravity trails, and glow. Click to launch a shell, or let auto-launch handle it.",children:[e.jsx(t,{playgroundId:"Fireworks",children:e.jsx(r,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(s,{code:`import { Fireworks } from 'own-the-canvas';

// Auto-launch with default colors
<Fireworks width="100%" height="100%" />

// Click to launch, custom colors
<Fireworks
  autoLaunch={false}
  colors={["#ff0000", "#00ff00", "#0000ff"]}
  particleCount={100}
  preset="celebration"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(l,{props:i})]})]})}export{n as FireworksPage};
