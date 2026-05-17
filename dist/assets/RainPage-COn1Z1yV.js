import{j as e,p as t,q as r,R as n,s as a,t as o}from"./index-B9SmDpOO.js";const s=[{name:"dropCount",type:"number",default:"200",description:"Number of rain drops."},{name:"speed",type:"number",default:"15",description:"Drop fall speed in px/frame."},{name:"wind",type:"number",default:"0.3",description:"Horizontal wind drift strength."},{name:"windSpeed",type:"number",default:"0.5",description:"Wind oscillation frequency."},{name:"dropLength",type:"number",default:"20",description:"Drop streak length in px."},{name:"dropWidth",type:"number",default:"1",description:"Drop stroke width in px."},{name:"dropOpacity",type:"number",default:"0.6",description:"Drop opacity 0–1."},{name:"dropColor",type:"string",default:'"#ffffff"',description:"Drop streak color."},{name:"splashColor",type:"string",default:'"#6b7280"',description:"Splash particle color."},{name:"showSplashes",type:"boolean",default:"true",description:"Show splash particles when drops hit bottom."},{name:"backgroundColor",type:"string",default:'"#111111"',description:'Canvas background color. Use "transparent" to overlay on another element.'},{name:"preset",type:"string",default:"—",description:'"default" | "storm" | "drizzle" | "neon" | "golden"'}];function p(){return e.jsxs(t,{eyebrow:"Component",title:"Rain",lead:"Animated rainfall with wind drift, variable drop length, and splash particles. Perfect for atmospheric hero sections and mood-setting backgrounds.",children:[e.jsx(r,{playgroundId:"Rain",children:e.jsx(n,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(a,{code:`import { Rain } from 'own-the-canvas';

<Rain
  dropCount={200}
  speed={15}
  wind={0.3}
  showSplashes
  preset="neon"
  width="100%"
  height="100%"
/>

// Heavy storm
<Rain preset="storm" />

// Light drizzle
<Rain preset="drizzle" />`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(o,{props:s})]})]})}export{p as RainPage};
