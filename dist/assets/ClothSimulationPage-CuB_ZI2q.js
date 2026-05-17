import{j as e,p as t,q as i,C as n,s as a,t as o}from"./index-B9SmDpOO.js";const r=[{name:"cols",type:"number",default:"25",description:"Grid columns."},{name:"rows",type:"number",default:"20",description:"Grid rows."},{name:"spacing",type:"number",default:"18",description:"Point spacing in px."},{name:"gravity",type:"number",default:"0.4",description:"Gravity per frame."},{name:"friction",type:"number",default:"0.99",description:"Velocity friction 0–1."},{name:"stiffness",type:"number",default:"1",description:"Constraint stiffness 0–1."},{name:"iterations",type:"number",default:"3",description:"Constraint relaxation iterations per frame."},{name:"lineColor",type:"string",default:'"#6b7280"',description:"Cloth mesh stroke color."},{name:"pinColor",type:"string",default:'"#ffffff"',description:"Pin point color."},{name:"lineWidth",type:"number",default:"1",description:"Mesh stroke width."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"wind",type:"number",default:"0.3",description:"Wind oscillation amplitude."},{name:"windSpeed",type:"number",default:"0.5",description:"Wind oscillation frequency."},{name:"tearable",type:"boolean",default:"false",description:"Enable cloth tearing on mouse click."},{name:"tearDistance",type:"number",default:"3",description:"Tear multiplier — ratio above rest length."},{name:"interactive",type:"boolean",default:"true",description:"Enable mouse interaction."},{name:"mouseRadius",type:"number",default:"30",description:"Mouse influence radius in px."},{name:"mouseForce",type:"number",default:"5",description:"Mouse push force."},{name:"showPins",type:"boolean",default:"true",description:"Show pin points at top edge."},{name:"preset",type:"string",default:"—",description:'"default" | "silk" | "net" | "heavy" | "spider"'}];function l(){return e.jsxs(t,{eyebrow:"Component",title:"ClothSimulation",lead:"Verlet integration spring-mass fabric simulation. Wind, gravity, mouse interaction, and optional tearing. Pinned at the top edge, fully interactive.",children:[e.jsx(i,{playgroundId:"ClothSimulation",children:e.jsx(n,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(a,{code:`import { ClothSimulation } from 'own-the-canvas';

<ClothSimulation
  cols={25}
  gravity={0.4}
  wind={0.3}
  tearable={false}
  interactive
  preset="silk"
  width="100%"
  height="100%"
/>

// Tearable spider web
<ClothSimulation preset="spider" tearable />`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(o,{props:r})]})]})}export{l as ClothSimulationPage};
