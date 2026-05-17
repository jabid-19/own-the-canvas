import{j as e,p as i,q as r,c as o,s,t as n}from"./index-B9SmDpOO.js";const l=[{data:Array.from({length:40},(t,a)=>50+Math.sin(a*.4)*30),color:"#ffffff",filled:!0},{data:Array.from({length:40},(t,a)=>50+Math.cos(a*.3)*20),color:"#6b7280",filled:!0}],d=[{name:"series",type:"LiveChartSeries[]",default:"demo data",description:"Array of { data, color, label?, filled? } series objects."},{name:"maxPoints",type:"number",default:"100",description:"Max data points kept per series before scrolling."},{name:"lineWidth",type:"number",default:"2",description:"Line stroke width."},{name:"showGrid",type:"boolean",default:"true",description:"Show horizontal grid lines."},{name:"gridColor",type:"string",default:'"#ffffff"',description:"Grid line color."},{name:"gridOpacity",type:"number",default:"0.08",description:"Grid line opacity."},{name:"showDots",type:"boolean",default:"false",description:"Show data point dots."},{name:"dotRadius",type:"number",default:"3",description:"Dot radius when shown."},{name:"fillOpacity",type:"number",default:"1",description:"Fill area opacity multiplier."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"padding",type:"number",default:"20",description:"Inner padding in px."},{name:"yMin",type:"number",default:"auto",description:"Fixed y-axis minimum."},{name:"yMax",type:"number",default:"auto",description:"Fixed y-axis maximum."},{name:"smooth",type:"boolean",default:"true",description:"Smooth curves with quadratic bezier."},{name:"glowEffect",type:"boolean",default:"true",description:"Glow on lines."},{name:"glowBlur",type:"number",default:"8",description:"Shadow blur for glow."},{name:"preset",type:"string",default:"—",description:'"default" | "neon" | "minimal" | "ocean" | "fire"'}];function c(){return e.jsxs(i,{eyebrow:"Component",title:"LiveChart",lead:"Real-time animated line and area chart. Push data points dynamically and the chart scrolls automatically. Supports multiple series, smooth bezier curves, and glow.",children:[e.jsx(r,{playgroundId:"LiveChart",children:e.jsx(o,{series:l,width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(s,{code:`import { LiveChart } from 'own-the-canvas';
import type { LiveChartSeries } from 'own-the-canvas';

const series: LiveChartSeries[] = [
  { data: [10, 45, 30, 80, 55], color: "#ffffff", filled: true },
  { data: [20, 35, 60, 40, 70], color: "#6b7280", filled: true },
];

<LiveChart
  series={series}
  smooth
  showGrid
  glowEffect
  preset="default"
  width="100%"
  height="100%"
/>`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(n,{props:d})]})]})}export{c as LiveChartPage};
