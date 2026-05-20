import React from "react";
import App from "../../demo/App";

const CSS = `
.playground-shell {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.playground-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border);
  flex-shrink: 0;
  background: var(--bg);
}

.playground-topbar-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}

.playground-topbar-badge {
  font-size: 11px;
  font-weight: 500;
  color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.25);
  padding: 2px 8px;
  border-radius: 20px;
  font-family: var(--mono);
}

.playground-topbar-note {
  font-size: 12px;
  color: var(--text-3);
}

.playground-frame {
  flex: 1;
  overflow: hidden;
}
`;

export function Playground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="playground-shell">
        <div className="playground-topbar">
          <div className="playground-topbar-title">
            Interactive Playground
            <span className="playground-topbar-badge">live</span>
          </div>
          <span className="playground-topbar-note">All 50+ components · real-time props</span>
        </div>
        <div className="playground-frame">
          <App />
        </div>
      </div>
    </>
  );
}
