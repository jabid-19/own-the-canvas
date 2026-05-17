import{j as e,p as a,q as i,A as r,s as t,t as s}from"./index-B9SmDpOO.js";const o=[{name:"audioSource",type:"MediaStream | null",default:"null",description:"Web Audio MediaStream from getUserMedia."},{name:"mode",type:'"bars" | "wave" | "circular" | "mirror"',default:'"bars"',description:"Visualization shape."},{name:"barColor",type:"string",default:'"#ffffff"',description:"Primary bar/wave color."},{name:"waveColor",type:"string",default:'"#ffffff"',description:"Wave line color."},{name:"barCount",type:"number",default:"64",description:"Number of frequency bars."},{name:"sensitivity",type:"number",default:"1",description:"Audio sensitivity multiplier."},{name:"rounded",type:"boolean",default:"true",description:"Rounded bar caps."},{name:"gradient",type:"boolean",default:"false",description:"Gradient fill on bars."},{name:"gapBetweenBars",type:"number",default:"2",description:"Gap between bars in pixels."}];function d(){return e.jsxs(a,{eyebrow:"Component",title:"AudioVisualizer",lead:"Real-time Web Audio API visualizer with four distinct modes. Connect a MediaStream from the user's microphone or any audio source.",children:[e.jsx(i,{playgroundId:"AudioVisualizer",children:e.jsx("div",{style:{background:"#111111",width:"100%",height:"100%"},children:e.jsx(r,{mode:"bars",barCount:64,rounded:!0,gradient:!0,width:"100%",height:"100%"})})}),e.jsxs("section",{className:"page-section","aria-labelledby":"usage-h",children:[e.jsx("h2",{className:"page-h2",id:"usage-h",children:"Usage"}),e.jsx(t,{code:`import { AudioVisualizer } from 'own-the-canvas';
import { useState } from 'react';

function App() {
  const [stream, setStream] = useState<MediaStream | null>(null);

  async function startMic() {
    const s = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(s);
  }

  return (
    <>
      <button onClick={startMic}>Start microphone</button>
      <AudioVisualizer
        audioSource={stream}
        mode="bars"
        barColor="#ffffff"
        barCount={64}
        sensitivity={1}
        gradient
        width="100%"
        height="300px"
      />
    </>
  );
}`,language:"tsx"})]}),e.jsxs("section",{"aria-labelledby":"props-h",children:[e.jsx("h2",{className:"page-h2",id:"props-h",children:"Props"}),e.jsx(s,{props:o})]})]})}export{d as AudioVisualizerPage};
