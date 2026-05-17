import{j as e,p as t,q as i,n as a,s as n,t as r}from"./index-B9SmDpOO.js";const l=[{name:"particleCount",type:"number",default:"120",description:"Number of particles."},{name:"particleColor",type:"string",default:'"#ffffff"',description:"Particle fill color."},{name:"lineColor",type:"string",default:'"#6b7280"',description:"Connection line color."},{name:"lineDistance",type:"number",default:"120",description:"Max distance between connected particles."},{name:"particleSize",type:"number",default:"2.5",description:"Particle radius in pixels."},{name:"speed",type:"number",default:"0.8",description:"Particle movement speed."},{name:"connectParticles",type:"boolean",default:"true",description:"Draw lines between nearby particles."},{name:"interactive",type:"boolean",default:"true",description:"Enable mouse repulsion effect."},{name:"backgroundColor",type:"string",default:'"transparent"',description:"Canvas background color."}];function s(){return e.jsxs(t,{eyebrow:"Component",title:"ParticleField",lead:"Floating particles with optional connection lines. Move your cursor over the canvas to activate the mouse repulsion interaction.",children:[e.jsx(i,{playgroundId:"ParticleField",children:e.jsx(a,{particleCount:100,connectParticles:!0,interactive:!0,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(n,{code:`import { ParticleField } from 'own-the-canvas';

<ParticleField
  particleCount={120}
  lineDistance={120}
  connectParticles
  interactive
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(r,{props:l})]})]})}export{s as ParticleFieldPage};
