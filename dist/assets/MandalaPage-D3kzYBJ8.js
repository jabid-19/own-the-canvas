import{j as e,p as a,q as t,a as r,s as o,t as n}from"./index-B9SmDpOO.js";const i=[{name:"symmetry",type:"number",default:"8",description:"Number of rotational symmetry arms."},{name:"colors",type:"string[]",default:"multi",description:"Stroke colors cycled per layer."},{name:"lineWidth",type:"number",default:"1.5",description:"Stroke line width."},{name:"speed",type:"number",default:"1",description:"Rotation animation speed."},{name:"layers",type:"number",default:"5",description:"Number of concentric petal layers."},{name:"radius",type:"number",default:"1",description:"Outer radius as fraction of canvas min dimension."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"animated",type:"boolean",default:"true",description:"Enable rotation animation."},{name:"glowEffect",type:"boolean",default:"true",description:"Glow effect on strokes."},{name:"glowBlur",type:"number",default:"10",description:"Shadow blur for glow."},{name:"strokeOpacity",type:"number",default:"0.8",description:"Layer stroke opacity 0–1."},{name:"mirror",type:"boolean",default:"true",description:"Mirror each arm for bilateral symmetry."},{name:"noiseAmount",type:"number",default:"0.3",description:"Organic noise distortion 0–1."},{name:"preset",type:"string",default:"—",description:'"default" | "neon" | "lotus" | "cosmic" | "minimal"'}];function l(){return e.jsxs(a,{eyebrow:"Component",title:"Mandala",lead:"Animated N-fold rotational symmetry with layered organic petal shapes. Controllable symmetry arms, bilateral mirroring, and noise distortion for natural-looking geometry.",children:[e.jsx(t,{playgroundId:"Mandala",children:e.jsx(r,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(o,{code:`import { Mandala } from 'own-the-canvas';

<Mandala
  symmetry={8}
  layers={5}
  speed={1}
  mirror
  glowEffect
  preset="cosmic"
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(n,{props:i})]})]})}export{l as MandalaPage};
