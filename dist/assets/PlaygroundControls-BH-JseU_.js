import{j as e,a6 as h}from"./index-B5AEuvch.js";const p={display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 0",gap:12},d={fontSize:13,color:"var(--text-2)",flex:1,whiteSpace:"nowrap"},g={fontSize:12,color:"var(--text-3)",fontFamily:"var(--mono)",marginLeft:8};function y({label:o,value:r,min:t,max:i,step:n,onChange:x}){const l=Number.isInteger(n)?r.toFixed(0):String(+r.toPrecision(3));return e.jsxs("div",{style:p,children:[e.jsxs("span",{style:d,children:[o,e.jsx("span",{style:g,children:l})]}),e.jsx("input",{type:"range",min:t,max:i,step:n,value:r,onChange:s=>x(+s.target.value),style:{width:"100%",maxWidth:130,accentColor:"var(--accent)",flexShrink:0}})]})}function f({label:o,value:r,onChange:t}){return e.jsxs("div",{style:p,children:[e.jsx("span",{style:d,children:o}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:8},children:[e.jsx("input",{type:"color",value:r,onChange:i=>t(i.target.value),style:{width:32,height:26,border:"1px solid var(--border)",borderRadius:6,cursor:"pointer",padding:2,background:"var(--bg-subtle)",flexShrink:0}}),e.jsx("span",{style:{...g,marginLeft:0},children:r.toUpperCase()})]})]})}function v({label:o,value:r,onChange:t}){return e.jsxs("div",{style:p,children:[e.jsx("span",{style:d,children:o}),e.jsx("button",{onClick:()=>t(!r),role:"switch","aria-checked":r,style:{width:40,height:22,borderRadius:11,border:"none",cursor:"pointer",background:r?"var(--accent)":"var(--border)",position:"relative",transition:"background 0.2s",flexShrink:0},children:e.jsx("div",{style:{position:"absolute",top:3,left:r?21:3,width:16,height:16,borderRadius:"50%",background:"#fff",transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}})})]})}function m({label:o,value:r,options:t,onChange:i}){return e.jsxs("div",{style:p,children:[e.jsx("span",{style:d,children:o}),e.jsx("select",{value:r,onChange:n=>i(n.target.value),style:{background:"var(--bg-subtle)",color:"var(--text-1)",border:"1px solid var(--border)",borderRadius:6,padding:"4px 8px",fontSize:13,fontFamily:"var(--mono)",cursor:"pointer",flexShrink:0},children:t.map(n=>e.jsx("option",{value:n,children:n},n))})]})}function j({label:o,value:r,onChange:t}){const i=()=>t([...r,"#ffffff"]),n=()=>{r.length>1&&t(r.slice(0,-1))},x=(s,a)=>{const c=[...r];c[s]=a,t(c)},l={width:18,height:18,borderRadius:4,border:"1px solid var(--border)",background:"var(--bg)",color:"var(--text-2)",cursor:"pointer",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0,padding:0};return e.jsxs("div",{style:{padding:"7px 0"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:6,marginBottom:6},children:[e.jsx("span",{style:{...d,flex:"none"},children:o}),e.jsx("button",{onClick:n,disabled:r.length<=1,"aria-label":"Remove color",style:{...l,opacity:r.length<=1?.35:1,cursor:r.length<=1?"not-allowed":"pointer"},children:e.jsx("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none","aria-hidden":"true",children:e.jsx("line",{x1:"2",y1:"5",x2:"8",y2:"5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})})}),e.jsx("button",{onClick:i,"aria-label":"Add color",style:l,children:e.jsxs("svg",{width:"10",height:"10",viewBox:"0 0 10 10",fill:"none","aria-hidden":"true",children:[e.jsx("line",{x1:"5",y1:"2",x2:"5",y2:"8",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"}),e.jsx("line",{x1:"2",y1:"5",x2:"8",y2:"5",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round"})]})})]}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:6},children:r.map((s,a)=>e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:4},children:[e.jsx("input",{type:"color",value:s,onChange:c=>x(a,c.target.value),style:{width:28,height:24,border:"1px solid var(--border)",borderRadius:5,cursor:"pointer",padding:2,background:"var(--bg-subtle)"}}),e.jsx("span",{style:{...g,marginLeft:0,fontSize:11},children:s.toUpperCase()})]},a))})]})}function k(){return e.jsx("div",{style:{height:1,background:"var(--border)",margin:"6px 0"}})}function w({label:o,onClick:r,variant:t="primary"}){return e.jsx("button",{onClick:r,style:{width:"100%",padding:"8px 16px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:600,background:t==="primary"?"var(--accent)":"var(--bg-subtle)",color:t==="primary"?"#fff":"var(--text-1)",border:t==="secondary"?"1px solid var(--border)":"none",marginBottom:8},children:o})}function S({text:o="Live preview"}){return e.jsxs("div",{style:{position:"absolute",bottom:10,left:14,fontSize:11,color:"rgba(255,255,255,0.45)",fontFamily:"var(--mono)",display:"flex",alignItems:"center",gap:6,pointerEvents:"none",zIndex:10},children:[e.jsx("div",{style:{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 5px #22c55e"}}),o]})}const b=`
.playground-controls {
  padding: 14px 18px;
  background: var(--bg-subtle);
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 32px;
}
@media (max-width: 640px) {
  .playground-controls { grid-template-columns: 1fr; }
}
.playground-controls-header {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}
.playground-reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  background: var(--bg);
  color: var(--text-2);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.playground-reset-btn:hover {
  color: var(--text-1);
  border-color: var(--text-3);
}
`;function C({preview:o,controls:r,code:t,onReset:i,previewActions:n}){return e.jsxs("div",{style:{border:"1px solid var(--border)",borderRadius:"var(--r-lg)",overflow:"hidden",marginBottom:20},children:[e.jsx("style",{dangerouslySetInnerHTML:{__html:b}}),e.jsx("div",{style:{height:300,position:"relative",overflow:"hidden"},children:o}),n&&e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",gap:10,padding:"12px 18px",borderTop:"1px solid var(--border)",background:"var(--bg)"},children:n}),e.jsxs("div",{className:"playground-controls",children:[i&&e.jsx("div",{className:"playground-controls-header",children:e.jsx("button",{className:"playground-reset-btn",onClick:i,children:"↺ Reset"})}),r]}),e.jsx("div",{style:{borderTop:"1px solid var(--border)"},children:e.jsx(h,{code:t,language:"tsx"})})]})}export{C as P,m as a,k as b,f as c,y as d,S as e,v as f,j as g,w as h};
