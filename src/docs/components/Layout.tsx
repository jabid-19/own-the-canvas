import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";

const CSS = `
.docs-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.docs-topbar {
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 16px;
  height: var(--topbar-h);
  border-bottom: 1px solid var(--border);
  background: var(--bg);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.docs-topbar-hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--r-sm);
  border: 1px solid var(--border);
  background: transparent;
  cursor: pointer;
  color: var(--text-2);
  flex-shrink: 0;
  transition: background 150ms var(--ease), color 150ms var(--ease);
}
.docs-topbar-hamburger:hover { background: var(--accent-soft); color: var(--text-1); }

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

.docs-topbar-logo-img {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  object-fit: contain;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .docs-shell { flex-direction: column; }
  .docs-topbar { display: flex; }
}
`;


interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="docs-shell">
        <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="docs-main">
          <header className="docs-topbar">
            <button
              className="docs-topbar-hamburger"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="4" width="12" height="1.5" rx="0.75" fill="currentColor" />
                <rect x="2" y="7.25" width="12" height="1.5" rx="0.75" fill="currentColor" />
                <rect x="2" y="10.5" width="12" height="1.5" rx="0.75" fill="currentColor" />
              </svg>
            </button>
            <Link to="/" className="docs-topbar-logo">
              <img className="docs-topbar-logo-img" src="/logo.png" alt="own-the-canvas logo" />
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
