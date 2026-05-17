import{j as e,p as a,q as r,G as t,s as l,t as i}from"./index-B9SmDpOO.js";const o=[{name:"cellSize",type:"number",default:"8",description:"Cell size in px."},{name:"speed",type:"number",default:"10",description:"Simulation updates per second."},{name:"initialDensity",type:"number",default:"0.3",description:"Initial alive cell density 0–1."},{name:"aliveColor",type:"string",default:'"#ffffff"',description:"Color of newly born cells."},{name:"oldColor",type:"string",default:'"#6b7280"',description:"Color of aged cells."},{name:"deadColor",type:"string",default:'"#111111"',description:"Color of dead cells."},{name:"showAge",type:"boolean",default:"true",description:"Color cells by generation age."},{name:"wrapEdges",type:"boolean",default:"true",description:"Wrap cells at canvas edges (toroidal)."},{name:"interactive",type:"boolean",default:"true",description:"Click to toggle cells alive/dead."},{name:"backgroundColor",type:"string",default:'"#111111"',description:"Canvas background color."},{name:"preset",type:"string",default:"—",description:'"default" | "neon" | "matrix" | "minimal" | "fire"'}];function s(){return e.jsxs(a,{eyebrow:"Component",title:"GameOfLife",lead:"Conway's Game of Life — emergent cellular automata where simple rules produce complex living patterns. Click cells to draw. Age-based color gradients reveal generation history.",children:[e.jsx(r,{playgroundId:"GameOfLife",children:e.jsx(t,{width:"100%",height:"100%"})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(l,{code:`import { GameOfLife, GameOfLifeHandle } from 'own-the-canvas';
import { useRef } from 'react';

const ref = useRef<GameOfLifeHandle>(null);

<GameOfLife
  ref={ref}
  cellSize={8}
  speed={10}
  showAge
  interactive
  preset="neon"
  width="100%"
  height="100%"
/>

// Imperative controls
ref.current?.randomize();
ref.current?.clear();
ref.current?.pause();
ref.current?.resume();`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(i,{props:o})]})]})}export{s as GameOfLifePage};
