import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import pkg from "../../../package.json";
import { Helmet } from "react-helmet-async";
import { sceneIndex } from "./PaperScene";
import { CanvasTop } from "./CanvasTop";

// the sheet peeking out from underneath each page picks up the banner's second colour
const UNDER = ["#f2b134", "#e8795a", "#2f6f73", "#e8795a", "#f2b134", "#f2b134"];

const CSS = `
.page-desk {
  overflow-x: clip;
  padding: 36px 28px 72px;
}

/* A big sheet of cream paper lying on the kraft desk. The shadow is a separate
   rectangle behind it, because clip-path would cut a box-shadow off. */
.page-sheet-wrap {
  position: relative;
  max-width: 980px;
  margin: 0 auto;
}
.page-sheet-wrap::before {
  content: "";
  position: absolute;
  inset: 8px 6px 0;
  box-shadow: 0 3px 2px rgba(var(--shadow-ink), .22), 0 14px 26px -6px rgba(var(--shadow-ink), .3), 0 34px 60px -20px rgba(var(--shadow-ink), .28);
}
/* a second, offset sheet peeking out underneath */
.page-sheet-wrap::after {
  content: "";
  position: absolute;
  inset: 10px -7px -8px 9px;
  background: var(--grain), var(--under, var(--mustard));
  clip-path: var(--cut-sheet);
  z-index: 0;
  transform: rotate(.35deg);
}
.page-sheet {
  position: relative;
  z-index: 1;
  background: var(--grain), var(--bg);
  clip-path: var(--cut-sheet);
}

/* A stretched canvas leaning on the sheet: primed linen face, wrapped side edge with real
   thickness, tension shading, and a cast shadow. */
.page-banner {
  position: relative;
  padding: 22px 40px 22px 30px;
}
.page-canvas {
  position: relative;
  height: 128px;
  overflow: hidden;
  background: var(--grain), #fbf7ec;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.7), inset -3px -3px 10px rgba(43,26,8,.13), inset 2px 2px 6px rgba(255,255,255,.7);
  clip-path: none;
}
.page-canvas svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
/* canvas weave over everything, paint included, plus a faint sheen */
.page-canvas::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(118deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,0) 34%, rgba(255,255,255,0) 70%, rgba(255,255,255,.1) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='5'%3E%3Cpath d='M0 .5H5' stroke='rgba(43,26,8,.13)'/%3E%3Cpath d='M.5 0V5' stroke='rgba(43,26,8,.13)'/%3E%3Cpath d='M0 3H5M3 0V5' stroke='rgba(255,255,255,.18)'/%3E");
  mix-blend-mode: multiply;
}
/* the side edge, drawn as a stack of offset faces on a wrapper so overflow:hidden doesn't cut it */
.page-canvas-wrap {
  position: relative;
  box-shadow: 1px 1px 0 #e6dbc2, 2px 2px 0 #e6dbc2, 3px 3px 0 #e6dbc2, 4px 4px 0 #e6dbc2, 5px 5px 0 #e6dbc2, 6px 6px 0 #d6c8a8, 7px 7px 0 #d6c8a8, 8px 8px 0 #d6c8a8, 9px 9px 0 #d6c8a8, 10px 10px 0 #d6c8a8, 16px 18px 20px rgba(var(--shadow-ink), .32);
}

.page-shell {
  padding: 8px 56px 88px;
}

/* washi tape */
.page-eyebrow {
  display: inline-block;
  position: relative;
  font-family: var(--mono);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-1);
  padding: 5px 16px 5px 14px;
  margin-bottom: 14px;
  background: repeating-linear-gradient(-45deg, rgba(242,177,52,.92) 0 7px, rgba(250,199,92,.92) 7px 14px);
  clip-path: polygon(0 0, 100% 0, calc(100% - 5px) 25%, 100% 50%, calc(100% - 5px) 75%, 100% 100%, 0 100%, 5px 75%, 0 50%, 5px 25%);
  transform: rotate(-1.4deg);
}

.page-title {
  font-family: var(--font-display);
  font-size: clamp(34px, 4.6vw, 50px);
  font-weight: 800;
  font-variation-settings: "opsz" 120;
  letter-spacing: -0.02em;
  color: var(--text-1);
  line-height: 1.08;
  margin-bottom: 14px;
  width: fit-content;
  max-width: 100%;
  padding: 0 .12em .02em 0;
  /* a loaded-brush swipe under the title */
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 40' preserveAspectRatio='none'%3E%3Cpath d='M3 26 C30 11 70 31 120 19 C170 9 220 29 297 13 L293 31 C230 41 170 23 120 35 C70 41 30 31 7 37Z' fill='%23f2b134' fill-opacity='.62'/%3E%3C/svg%3E") left bottom / 100% 42% no-repeat;
}

.page-lead {
  font-size: 18px;
  color: var(--text-2);
  line-height: 1.65;
  max-width: 640px;
  margin-bottom: 40px;
}

.page-h2 {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: -0.01em;
  margin: 44px 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
/* a fat dab of paint */
.page-h2::before {
  content: "";
  flex: none;
  width: 18px;
  height: 15px;
  border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%;
  background: radial-gradient(circle at 34% 28%, #ffe08a 0 14%, var(--mustard) 40%, #c98f12 100%);
  box-shadow: 2px 3px 0 var(--accent);
  transform: rotate(-12deg);
}

.page-h3 {
  font-family: var(--font-display);
  font-size: 19px;
  font-weight: 700;
  color: var(--text-1);
  margin: 28px 0 10px;
}

.page-p {
  font-size: 15.5px;
  color: var(--text-2);
  line-height: 1.75;
  margin-bottom: 16px;
  max-width: 700px;
}

/* a perforated tear line */
.page-divider {
  height: 3px;
  margin: 44px 0;
  background: repeating-linear-gradient(90deg, var(--border-mid) 0 9px, transparent 9px 16px);
}

.page-section { margin-bottom: 48px; }

/* The preview is a window punched through the sheet: framed by a paper mat,
   with the inner edge shadowed so you see the depth of the cut. */
.page-preview {
  border-radius: 2px;
  overflow: hidden;
  background: #17110c;
  height: 320px;
  margin: 44px 34px 34px;
  position: relative;
  /* hung like a painting: canvas edge, cream mat, gilt lip, wooden frame, cast shadow */
  box-shadow:
    0 0 0 12px #f4ecd8,
    0 0 0 13px rgba(43,33,24,.5),
    0 0 0 15px #d8a959,
    0 0 0 16px #8a5a1d,
    0 0 0 27px #8c5a2e,
    0 0 0 28px #4b2d14,
    0 22px 30px 26px rgba(var(--shadow-ink), .3);
}
.page-preview::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 6px 10px rgba(0,0,0,.5), inset 5px 0 8px -3px rgba(0,0,0,.35), inset 0 -2px 0 rgba(255,255,255,.08);
  border-radius: 2px;
}
.page-preview canvas {
  width: 100% !important;
  height: 100% !important;
}
.page-preview-label {
  position: absolute;
  bottom: 12px;
  left: 14px;
  z-index: 2;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-1);
  background: var(--bg);
  font-family: var(--mono);
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px 3px 8px;
  box-shadow: var(--lift-1);
  pointer-events: none;
  clip-path: polygon(0 0, 100% 0, calc(100% - 5px) 50%, 100% 100%, 0 100%);
}

.page-preview-playground-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 26px 0 22px;
  padding: 9px 20px;
  font-size: 13px;
  font-weight: 700;
  font-family: var(--mono);
  color: #fff;
  background: var(--grain), var(--accent);
  text-decoration: none;
  border-radius: 4px;
  box-shadow: 0 3px 0 var(--accent-deep), 0 6px 0 rgba(var(--shadow-ink), .18), 0 10px 14px -4px rgba(var(--shadow-ink), .3);
  transition: transform 160ms var(--ease), box-shadow 160ms var(--ease);
}
.page-preview-playground-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 0 var(--accent-deep), 0 9px 0 rgba(var(--shadow-ink), .16), 0 14px 18px -4px rgba(var(--shadow-ink), .3);
}
.page-preview-playground-link:active {
  transform: translateY(3px);
  box-shadow: 0 0 0 var(--accent-deep), 0 2px 3px rgba(var(--shadow-ink), .3);
}
.page-preview-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2f9e5f;
  animation: preview-pulse 2s ease-in-out infinite;
}
@keyframes preview-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* sticky note with a folded corner */
.page-note {
  position: relative;
  background: #fcebb8;
  padding: 16px 24px 16px 20px;
  font-size: 14.5px;
  color: var(--text-1);
  line-height: 1.65;
  margin: 24px 0;
  clip-path: polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%);
  box-shadow: inset 0 -3px 0 rgba(120,80,0,.08), inset 4px 0 0 var(--mustard);
}
.page-note::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #e3bf60 50%, transparent 50%);
}
.page-note strong { color: var(--accent-deep); }

.page-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  background: var(--bg);
  display: block;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  box-shadow: var(--lift-2);
  border-radius: var(--r);
}
.page-table th {
  background: var(--bg-subtle);
  padding: 9px 16px;
  text-align: left;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-2);
  border-bottom: 2px solid var(--border-mid);
}
.page-table td {
  padding: 11px 16px;
  border-bottom: 1px dashed var(--border);
  color: var(--text-2);
}
.page-table tr:last-child td { border-bottom: none; }
.page-table code {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
}

/* "Use with AI": a ticket stub pinned under the lead. One primary action (copy),
   the assistants as paper chips, the raw markdown as a quiet link. */
.page-ai {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px 8px;
  width: fit-content;
  max-width: 100%;
  margin: -22px 0 40px;
  padding: 12px 16px 12px 14px;
  background: var(--grain), var(--bg-subtle);
  border: 1.5px dashed var(--border-mid);
  border-radius: 6px;
  font-family: var(--mono);
  font-size: 12.5px;
}
.page-ai-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-right: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-2);
}
.page-ai-label svg { color: var(--accent); }
.page-ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 0 13px;
  font: inherit;
  font-weight: 700;
  color: var(--text-1);
  background: var(--bg);
  border: 1px solid var(--border-mid);
  border-radius: 5px;
  box-shadow: 0 2px 0 var(--border-mid);
  cursor: pointer;
  text-decoration: none;
  touch-action: manipulation;
  transition: transform 160ms var(--ease), box-shadow 160ms var(--ease), background 160ms var(--ease);
}
.page-ai-btn:hover { background: var(--accent-soft); transform: translateY(-1px); box-shadow: 0 3px 0 var(--border-mid); }
.page-ai-btn:active { transform: translateY(2px); box-shadow: 0 0 0 var(--border-mid); }
.page-ai-btn.primary {
  min-width: 136px;
  justify-content: center;
  color: #fff;
  background: var(--grain), var(--accent);
  border-color: var(--accent-deep);
  box-shadow: 0 2px 0 var(--accent-deep);
}
.page-ai-btn.primary:hover { background: var(--grain), var(--accent); box-shadow: 0 3px 0 var(--accent-deep); }
.page-ai-btn.primary:active { box-shadow: 0 0 0 var(--accent-deep); }
.page-ai-btn.primary.copied { background: var(--grain), #2f7d55; border-color: #22603f; box-shadow: 0 2px 0 #22603f; }
.page-ai-btn svg { flex: none; }
.page-ai-btn .ext { opacity: .55; }
.page-ai-md {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 34px;
  padding: 0 6px;
  margin-left: 2px;
  color: var(--text-2);
  font-weight: 600;
  text-decoration: underline dotted;
  text-underline-offset: 3px;
}
.page-ai-md:hover { color: var(--accent-deep); text-decoration-style: solid; }
.page-ai-btn:focus-visible, .page-ai-md:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
@media (max-width: 768px) {
  .page-ai { width: 100%; }
  .page-ai-label { width: 100%; }
  .page-ai-btn, .page-ai-md { min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) {
  .page-ai-btn, .page-ai-btn:hover, .page-ai-btn:active { transition: none; transform: none; }
}

@media (max-width: 768px) {
  .page-desk { padding: 20px 12px 56px; }
  .page-shell { padding: 8px 22px 64px; }
  .page-banner { padding: 16px 20px 14px 14px; }
  .page-canvas { height: 96px; }
  .page-preview { height: 240px; margin: 34px 22px 26px; }
}
@media (max-width: 480px) {
  .page-desk { padding: 14px 6px 48px; }
  .page-shell { padding: 8px 16px 56px; }
  .page-preview { margin: 28px 12px 22px; height: 220px; }
}
`;

interface PageShellProps {
  eyebrow?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
}

export function PageShell({ eyebrow, title, lead, children }: PageShellProps) {
  return (
    <>
      <Helmet>
        <title>{title} — React Canvas Component | Own The Canvas</title>
        {lead && <meta name="description" content={lead} />}
      </Helmet>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="page-desk">
        <div className="page-sheet-wrap" style={{ "--under": UNDER[sceneIndex(title)] } as React.CSSProperties}>
          <article className="page-sheet">
            <div className="page-banner">
              <div className="page-canvas-wrap">
                <div className="page-canvas">
                  <CanvasTop seed={title} />
                </div>
              </div>
            </div>
            <div className="page-shell">
              {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
              <h1 className="page-title">{title}</h1>
              {lead && <p className="page-lead">{lead}</p>}
              {eyebrow === "Component" && <AskAI title={title} />}
              {children}
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

// Free AI help: hands the user's own assistant a prompt pointing at this component's generated .md
// (scripts/gen-ai-docs.mjs), so it reads the real props instead of guessing.
function AskAI({ title }: { title: string }) {
  const { pathname } = useLocation();
  const [copied, setCopied] = useState(false);
  const prompt = `I want to use the ${title} component from the own-the-canvas React library. Read its docs first: ${pkg.homepage}${pathname}.md. Then help me add it to my project. Only use the props and preset names listed there.`;
  const q = encodeURIComponent(prompt);

  function copy() {
    navigator.clipboard.writeText(prompt).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="page-ai" role="group" aria-label={`Use ${title} with an AI assistant`}>
      <span className="page-ai-label">
        <Icon d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.5 2.5M15.2 15.2l2.5 2.5M6.3 17.7l2.5-2.5M15.2 8.8l2.5-2.5" />
        Use with AI
      </span>
      <button type="button" className={`page-ai-btn primary${copied ? " copied" : ""}`} onClick={copy}>
        {copied ? <Icon d="M5 12.5l4.5 4.5L19 7.5" /> : <Icon d="M9 9h10v10H9zM5 15V5h10" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy prompt"}</span>
      </button>
      <a className="page-ai-btn" href={`https://claude.ai/new?q=${q}`} target="_blank" rel="noopener noreferrer">
        <Logo d={CLAUDE_LOGO} color="#D97757" /> Ask Claude <Icon className="ext" d={EXT} />
      </a>
      <a className="page-ai-btn" href={`https://chatgpt.com/?q=${q}`} target="_blank" rel="noopener noreferrer">
        <Logo d={OPENAI_LOGO} evenOdd /> Ask ChatGPT <Icon className="ext" d={EXT} />
      </a>
      <a className="page-ai-md" href={`${pathname}.md`} target="_blank" rel="noopener noreferrer">
        <Icon d="M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 16h5" />
        Markdown
      </a>
    </div>
  );
}

const EXT = "M14 5h5v5M19 5l-8 8M17 14v5H5V7h5";

// Brand marks: Claude from Simple Icons, OpenAI from LobeHub icons (the official shapes, unmodified).
const CLAUDE_LOGO = "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";
const OPENAI_LOGO = "M9.205 8.658v-2.26c0-.19.072-.333.238-.428l4.543-2.616c.619-.357 1.356-.523 2.117-.523 2.854 0 4.662 2.212 4.662 4.566 0 .167 0 .357-.024.547l-4.71-2.759a.797.797 0 00-.856 0l-5.97 3.473zm10.609 8.8V12.06c0-.333-.143-.57-.429-.737l-5.97-3.473 1.95-1.118a.433.433 0 01.476 0l4.543 2.617c1.309.76 2.189 2.378 2.189 3.948 0 1.808-1.07 3.473-2.76 4.163zM7.802 12.703l-1.95-1.142c-.167-.095-.239-.238-.239-.428V5.899c0-2.545 1.95-4.472 4.591-4.472 1 0 1.927.333 2.712.928L8.23 5.067c-.285.166-.428.404-.428.737v6.898zM12 15.128l-2.795-1.57v-3.33L12 8.658l2.795 1.57v3.33L12 15.128zm1.796 7.23c-1 0-1.927-.332-2.712-.927l4.686-2.712c.285-.166.428-.404.428-.737v-6.898l1.974 1.142c.167.095.238.238.238.428v5.233c0 2.545-1.974 4.472-4.614 4.472zm-5.637-5.303l-4.544-2.617c-1.308-.761-2.188-2.378-2.188-3.948A4.482 4.482 0 014.21 6.327v5.423c0 .333.143.571.428.738l5.947 3.449-1.95 1.118a.432.432 0 01-.476 0zm-.262 3.9c-2.688 0-4.662-2.021-4.662-4.519 0-.19.024-.38.047-.57l4.686 2.71c.286.167.571.167.856 0l5.97-3.448v2.26c0 .19-.07.333-.237.428l-4.543 2.616c-.619.357-1.356.523-2.117.523zm5.899 2.83a5.947 5.947 0 005.827-4.756C22.287 18.339 24 15.84 24 13.296c0-1.665-.713-3.282-1.998-4.448.119-.5.19-.999.19-1.498 0-3.401-2.759-5.947-5.946-5.947-.642 0-1.26.095-1.88.31A5.962 5.962 0 0010.205 0a5.947 5.947 0 00-5.827 4.757C1.713 5.447 0 7.945 0 10.49c0 1.666.713 3.283 1.998 4.448-.119.5-.19 1-.19 1.499 0 3.401 2.759 5.946 5.946 5.946.642 0 1.26-.095 1.88-.309a5.96 5.96 0 004.162 1.713z";

function Logo({ d, color = "currentColor", evenOdd }: { d: string; color?: string; evenOdd?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color} fillRule={evenOdd ? "evenodd" : undefined} aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export function PreviewBox({ children, playgroundId }: { children: React.ReactNode; playgroundId?: string }) {
  return (
    <>
      <div className="page-preview">
        {children}
        <div className="page-preview-label">
          <div className="page-preview-dot" />
          Live preview
        </div>
      </div>
      {playgroundId && (
        <Link to={`/playground?component=${playgroundId}`} className="page-preview-playground-link">
          ⚡ Try in Playground
        </Link>
      )}
    </>
  );
}
