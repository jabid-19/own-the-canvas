import{j as e,p as i,q as t,F as n,s as a,t as o}from"./index-B9SmDpOO.js";const s=[{name:"resolution",type:"number",default:"80",description:"Grid resolution 32–128. Lower = faster, coarser."},{name:"viscosity",type:"number",default:"0.0001",description:"Fluid viscosity — resistance to flow."},{name:"diffusion",type:"number",default:"0.0001",description:"Ink diffusion rate."},{name:"dissipation",type:"number",default:"0.995",description:"Density fade per frame 0–1."},{name:"inkColors",type:"string[]",default:"multi",description:"Ink colors painted by mouse and auto-ink."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"autoInk",type:"boolean",default:"true",description:"Auto-inject ink bursts without mouse."},{name:"autoInkInterval",type:"number",default:"1500",description:"Interval between auto-ink bursts in ms."},{name:"mouseForce",type:"number",default:"5",description:"Mouse velocity → force multiplier."},{name:"inkRadius",type:"number",default:"4",description:"Ink splat radius in grid cells."},{name:"preset",type:"string",default:"—",description:'"default" | "ink" | "neon" | "lava" | "ocean" | "smoke"'}];function l(){return e.jsxs(i,{eyebrow:"Component",title:"FluidSimulation",lead:"Grid-based Navier-Stokes fluid simulation with per-channel RGB ink. Move the cursor to paint — velocity carries ink through the fluid field, diffusing and advecting each frame.",children:[e.jsx(t,{playgroundId:"FluidSimulation",children:e.jsx(n,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(a,{code:`import { FluidSimulation } from 'own-the-canvas';

// Move cursor to paint fluid
<FluidSimulation
  resolution={80}
  dissipation={0.995}
  autoInk
  preset="ocean"
  width="100%"
  height="100%"
/>

// High-detail smoke effect
<FluidSimulation preset="smoke" resolution={72} />`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(o,{props:s})]})]})}export{l as FluidSimulationPage};
