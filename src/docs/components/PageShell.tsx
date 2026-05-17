import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const CSS = `
.page-shell {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 40px 80px;
}

.page-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-1);
  line-height: 1.2;
  margin-bottom: 12px;
}

.page-lead {
  font-size: 17px;
  color: var(--text-2);
  line-height: 1.65;
  max-width: 620px;
  margin-bottom: 40px;
}

.page-h2 {
  font-size: 20px;
  font-weight: 650;
  color: var(--text-1);
  letter-spacing: -0.02em;
  margin: 40px 0 16px;
}

.page-h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-1);
  letter-spacing: -0.01em;
  margin: 28px 0 10px;
}

.page-p {
  font-size: 15px;
  color: var(--text-2);
  line-height: 1.7;
  margin-bottom: 16px;
  max-width: 720px;
}

.page-divider {
  height: 1px;
  background: var(--border);
  margin: 40px 0;
}

.page-section {
  margin-bottom: 48px;
}

/* Preview box */
.page-preview {
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  background: var(--bg-subtle);
  height: 300px;
  margin: 20px 0 8px;
  position: relative;
}
.page-preview canvas {
  width: 100% !important;
  height: 100% !important;
}
.page-preview-label {
  position: absolute;
  bottom: 10px;
  left: 14px;
  font-size: 11px;
  color: var(--text-3);
  font-family: var(--mono);
  display: flex;
  align-items: center;
  gap: 6px;
  pointer-events: none;
}
.page-preview-playground-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: var(--accent);
  text-decoration: none;
  font-family: var(--mono);
  margin-bottom: 20px;
  padding: 6px 14px;
  border-radius: 999px;
  
}
.page-preview-playground-link:hover {
  transform: translateY(-1px) scale(1.03);
  box-shadow: 0 0 0 1px var(--accent), 0 4px 20px color-mix(in srgb, var(--accent) 55%, transparent);
}
.page-preview-playground-link:active {
  transform: translateY(0) scale(0.98);
}
.page-preview-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 5px #22c55e;
  animation: preview-pulse 2s ease-in-out infinite;
}
@keyframes preview-pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

/* Note callout */
.page-note {
  background: var(--accent-soft);
  border: 1px solid var(--accent-mid);
  border-radius: var(--r);
  padding: 14px 18px;
  font-size: 14px;
  color: var(--text-2);
  line-height: 1.6;
  margin: 20px 0;
}
.page-note strong { color: var(--accent); }

/* Table (peer deps etc) */
.page-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border: 1px solid var(--border);
  border-radius: var(--r);
  overflow: hidden;
}
.page-table th {
  background: var(--bg-subtle);
  padding: 8px 14px;
  text-align: left;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-3);
  border-bottom: 1px solid var(--border);
}
.page-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-2);
}
.page-table tr:last-child td { border-bottom: none; }
.page-table code {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
}

@media (max-width: 600px) {
  .page-shell { padding: 32px 20px 60px; }
  .page-title { font-size: 26px; }
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
      <div className="page-shell">
        {eyebrow && <div className="page-eyebrow">{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {lead && <p className="page-lead">{lead}</p>}
        {children}
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
