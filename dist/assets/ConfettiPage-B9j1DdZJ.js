import{r as n,j as e,p as o,k as s,v as a,s as l,t as c}from"./index-B9SmDpOO.js";const p=[{name:"palette",type:'"monochrome" | "colorful"',default:'"monochrome"',description:'Color variant. "monochrome" uses white/gray shades; "colorful" uses vibrant multi-color.'},{name:"trigger",type:"boolean",default:"false",description:"Rising edge fires a burst."},{name:"particleCount",type:"number",default:"150",description:"Number of confetti pieces per burst."},{name:"spread",type:"number",default:"0.8",description:"Horizontal spread (0–1)."},{name:"gravity",type:"number",default:"0.5",description:"Gravity strength."},{name:"wind",type:"number",default:"0.5",description:"Horizontal wind force."},{name:"continuous",type:"boolean",default:"false",description:"Continuous rain instead of burst."}];function d(){const[r,t]=n.useState(!1);function i(){t(!1),setTimeout(()=>t(!0),50)}return e.jsxs(o,{eyebrow:"Component",title:"Confetti",lead:"Physics-based celebration confetti. Fire a burst on a rising trigger edge, or run as continuous particle rain.",children:[e.jsxs("div",{className:"page-preview",style:{position:"relative"},children:[e.jsx(s,{trigger:r,particleCount:150,spread:.8,width:"100%",height:"100%"}),e.jsx("div",{style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx("button",{onClick:i,style:{padding:"10px 22px",borderRadius:"var(--r)",background:"var(--accent)",color:"#fff",fontSize:14,fontWeight:600,border:"none",cursor:"pointer",fontFamily:"var(--font)"},children:"Launch confetti"})})]}),e.jsx(a,{to:"/playground?component=Confetti",className:"page-preview-playground-link",children:"↗ Try in Playground"}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(l,{code:`import { Confetti } from 'own-the-canvas';
import { useState } from 'react';

function App() {
  const [trigger, setTrigger] = useState(false);

  function fire() {
    setTrigger(false);
    setTimeout(() => setTrigger(true), 50);
  }

  return (
    <>
      <button onClick={fire}>Celebrate!</button>
      <Confetti
        trigger={trigger}
        particleCount={150}
        spread={0.8}
        width="100%"
        height="100%"
      />
    </>
  );
}`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(c,{props:p})]})]})}export{d as ConfettiPage};
