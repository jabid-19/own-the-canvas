import{j as e,p as a,q as t,M as n,s as o,t as r}from"./index-B9SmDpOO.js";const s=[{name:"count",type:"number",default:"5",description:"Number of blobs."},{name:"colors",type:"string[]",default:"multi",description:"Blob colors."},{name:"radius",type:"number",default:"80",description:"Base blob radius in px."},{name:"speed",type:"number",default:"1",description:"Wander animation speed."},{name:"magnetStrength",type:"number",default:"0.08",description:"Mouse attraction force."},{name:"magnetRadius",type:"number",default:"150",description:"Mouse influence radius in px."},{name:"threshold",type:"number",default:"1.8",description:"Metaball merge threshold — higher merges earlier."},{name:"glowEffect",type:"boolean",default:"true",description:"Glow on blobs."},{name:"glowBlur",type:"number",default:"20",description:"Shadow blur for glow."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"animated",type:"boolean",default:"true",description:"Enable wander animation."},{name:"followMouse",type:"boolean",default:"true",description:"Blobs are attracted to cursor."},{name:"wanderStrength",type:"number",default:"0.4",description:"Organic wander amplitude 0–1."},{name:"preset",type:"string",default:"—",description:'"default" | "neon" | "plasma" | "ocean" | "lava" | "minimal"'}];function i(){return e.jsxs(a,{eyebrow:"Component",title:"MagneticBlob",lead:"Metaballs that organically wander and merge. Blobs are attracted to the cursor and naturally merge into each other using additive screen-blend radial gradients.",children:[e.jsx(t,{playgroundId:"MagneticBlob",children:e.jsx(n,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(o,{code:`import { MagneticBlob } from 'own-the-canvas';

<MagneticBlob
  count={5}
  radius={80}
  threshold={1.8}
  followMouse
  glowEffect
  preset="plasma"
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(r,{props:s})]})]})}export{i as MagneticBlobPage};
