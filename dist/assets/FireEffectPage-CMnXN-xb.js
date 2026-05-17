import{j as e,p as a,q as i,l as s,s as t,t as r}from"./index-B9SmDpOO.js";const l=[{name:"palette",type:'"smoke" | "inferno" | "toxic" | "ice" | "plasma"',default:'"smoke"',description:"Color palette for the fire simulation."},{name:"intensity",type:"number",default:"0.95",description:"Fire intensity (0–1). Higher = taller flames."},{name:"windStrength",type:"number",default:"0.3",description:"Horizontal wind drift strength."},{name:"spread",type:"number",default:"0.7",description:"Horizontal spread of the flame base."},{name:"cooling",type:"number",default:"0.3",description:"Cooling rate. Higher = shorter flames."}];function o(){return e.jsxs(a,{eyebrow:"Component",title:"FireEffect",lead:"Pixel-level fire simulation using a cellular automaton approach. Choose from four distinct color palettes.",children:[e.jsx(i,{playgroundId:"FireEffect",children:e.jsx(s,{palette:"smoke",intensity:.95,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(t,{code:`import { FireEffect } from 'own-the-canvas';

<FireEffect
  palette="smoke"
  intensity={0.95}
  windStrength={0.3}
  spread={0.7}
  cooling={0.3}
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{className:"page-section","aria-labelledby":"palettes-h",children:[e.jsx("h2",{className:"page-h2",id:"palettes-h",children:"Palettes"}),e.jsx(t,{code:`<FireEffect palette="inferno" />  // classic orange-red fire
<FireEffect palette="toxic" />   // green chemical fire
<FireEffect palette="ice" />     // cool blue frost flame
<FireEffect palette="plasma" />  // purple-magenta energy`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(r,{props:l})]})]})}export{o as FireEffectPage};
