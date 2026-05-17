import{j as e,p as a,q as n,S as t,s as r,t as o}from"./index-B9SmDpOO.js";const i=[{name:"color",type:"string",default:'"#ffffff"',description:"Primary ring color."},{name:"secondaryColor",type:"string",default:'"#6b7280"',description:"Alternating ring color."},{name:"ringCount",type:"number",default:"3",description:"Number of rings per shockwave."},{name:"ringSpacing",type:"number",default:"20",description:"Pixel gap between rings at spawn."},{name:"speed",type:"number",default:"4",description:"Expansion speed in px/frame."},{name:"maxRadius",type:"number",default:"200",description:"Max radius before ring fades."},{name:"lineWidth",type:"number",default:"2",description:"Stroke line width."},{name:"fadeSpeed",type:"number",default:"0.02",description:"Opacity decrease per frame."},{name:"autoFire",type:"boolean",default:"false",description:"Auto-fire shockwaves without clicks."},{name:"autoInterval",type:"number",default:"2000",description:"Interval between auto-fires in ms."},{name:"glowEffect",type:"boolean",default:"true",description:"Glow effect on rings."},{name:"glowBlur",type:"number",default:"15",description:"Shadow blur for glow."},{name:"backgroundColor",type:"string",default:'"transparent"',description:"Canvas background color."},{name:"preset",type:"string",default:"—",description:'"default" | "neon" | "explosion" | "ripple" | "minimal"'}];function l(){return e.jsxs(a,{eyebrow:"Component",title:"Shockwave",lead:"Click-triggered expanding ring blast with glow. Each click spawns a set of concentric rings that expand and fade — great for click feedback and game effects.",children:[e.jsx(n,{playgroundId:"Shockwave",children:e.jsx(t,{autoFire:!0,autoInterval:1500,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(r,{code:`import { Shockwave } from 'own-the-canvas';

// Click anywhere on the canvas to fire
<Shockwave
  color="#ffffff"
  ringCount={3}
  speed={4}
  glowEffect
  width="100%"
  height="100%"
/>

// Auto-fire mode
<Shockwave autoFire autoInterval={2000} preset="explosion" />`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(o,{props:i})]})]})}export{l as ShockwavePage};
