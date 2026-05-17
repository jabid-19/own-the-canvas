import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, MobileMenuButton } from "./Sidebar";

const CSS = `
.docs-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.docs-topbar {
  display: none;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
}

.docs-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.docs-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.docs-topbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--text-1);
  text-decoration: none;
}

.docs-topbar-logo-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: #111111;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .docs-shell { flex-direction: column; }
  .docs-topbar { display: flex; }
}
`;

const LogoIcon = () => (
  <div className="docs-topbar-logo-icon" aria-hidden="true">
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1" fill="white" fillOpacity=".9" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="white" fillOpacity=".5" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="white" fillOpacity=".5" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="white" fillOpacity=".9" />
    </svg>
  </div>
);

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="docs-shell">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <MobileMenuButton onClick={() => setMobileOpen(true)} />

        <div className="docs-main">
          <header className="docs-topbar">
            <Link to="/" className="docs-topbar-logo">
              <LogoIcon />
              own-the-canvas
            </Link>
          </header>

          <main className="docs-content" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
