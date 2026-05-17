import{j as e,p as t,q as r,W as o,s,t as n}from"./index-B9SmDpOO.js";const a=[{name:"ringCount",type:"number",default:"30",description:"Number of tunnel rings."},{name:"speed",type:"number",default:"1",description:"Forward travel speed."},{name:"colors",type:"string[]",default:'["#ffffff","#6b7280"]',description:"Ring stroke colors — cycles through array."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"twist",type:"number",default:"0.3",description:"Ring rotation twist per unit depth."},{name:"fov",type:"number",default:"300",description:"Perspective field of view."},{name:"depth",type:"number",default:"400",description:"Perspective depth scale."},{name:"lineWidth",type:"number",default:"1.5",description:"Ring stroke width."},{name:"opacity",type:"number",default:"0.8",description:"Ring opacity 0–1."},{name:"starCount",type:"number",default:"100",description:"Tunnel wall star count."},{name:"starColor",type:"string",default:'"#ffffff"',description:"Star dot color."},{name:"interactive",type:"boolean",default:"true",description:"Mouse X controls tunnel speed."},{name:"preset",type:"string",default:"—",description:'"default" | "hyperspace" | "neon" | "vortex" | "minimal"'}];function l(){return e.jsxs(t,{eyebrow:"Component",title:"Wormhole",lead:"3D perspective tunnel rushing toward the camera with twisting rings and star particles. Move the mouse to control speed. A classic hyperspace hero section effect.",children:[e.jsx(r,{playgroundId:"Wormhole",children:e.jsx(o,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(s,{code:`import { Wormhole } from 'own-the-canvas';

<Wormhole
  ringCount={30}
  speed={1}
  twist={0.3}
  interactive
  preset="hyperspace"
  width="100%"
  height="100%"
/>

// Neon vortex
<Wormhole preset="vortex" twist={1.2} speed={1.5} />

// Custom colors
<Wormhole colors={["#ff00ff","#00ffff","#00ff41"]} />`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(n,{props:a})]})]})}export{l as WormholePage};
