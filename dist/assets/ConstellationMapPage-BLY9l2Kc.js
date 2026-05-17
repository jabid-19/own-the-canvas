import{j as e,p as t,q as n,h as a,s as o,t as s}from"./index-B9SmDpOO.js";const i=[{name:"starCount",type:"number",default:"80",description:"Number of stars in the constellation."},{name:"starColor",type:"string",default:'"#ffffff"',description:"Star fill color."},{name:"lineColor",type:"string",default:'"#6b7280"',description:"Connection line color."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"connectionDistance",type:"number",default:"100",description:"Max distance to draw connection lines."},{name:"speed",type:"number",default:"0.3",description:"Star drift speed."},{name:"interactive",type:"boolean",default:"true",description:"Drag stars to reposition them."},{name:"lineStyle",type:'"solid" | "dashed"',default:'"solid"',description:"Line stroke style."},{name:"glowStars",type:"boolean",default:"false",description:"Enable glow effect on stars."}];function l(){return e.jsxs(t,{eyebrow:"Component",title:"ConstellationMap",lead:"An interactive star map with dynamic constellation lines. Drag stars to reposition them and watch the connection lines update in real time.",children:[e.jsx(n,{playgroundId:"ConstellationMap",children:e.jsx(a,{starCount:80,interactive:!0,glowStars:!0,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(o,{code:`import { ConstellationMap } from 'own-the-canvas';

<ConstellationMap
  starCount={80}
  starColor="#ffffff"
  lineColor="#6b7280"
  connectionDistance={100}
  interactive
  glowStars
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(s,{props:i})]})]})}export{l as ConstellationMapPage};
