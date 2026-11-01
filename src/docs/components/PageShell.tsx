import React from "react";
import { Link } from "react-router-dom";
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
              {children}
            </div>
          </article>
        </div>
      </div>
    </>
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
