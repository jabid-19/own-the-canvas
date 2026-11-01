import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Lenis from "lenis";
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
  padding: 0 14px;
  height: var(--topbar-h);
  background: var(--grain), var(--bg);
  box-shadow: 0 2px 0 var(--mustard), 0 5px 0 rgba(var(--shadow-ink), .14), 0 8px 12px -4px rgba(var(--shadow-ink), .25);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 30;
}

.docs-topbar-hamburger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: var(--r);
  border: none;
  background: var(--bg-subtle);
  box-shadow: 0 2px 0 var(--border-mid), 0 4px 6px -1px rgba(var(--shadow-ink), .25);
  cursor: pointer;
  color: var(--text-1);
  flex-shrink: 0;
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease);
}
.docs-topbar-hamburger:active { transform: translateY(2px); box-shadow: none; }

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
  gap: 10px;
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 700;
  color: var(--text-1);
  text-decoration: none;
}

.docs-topbar-logo-img {
  width: 34px;
  height: 34px;
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
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const wrapper = document.getElementById("main-content");
    const content = wrapper?.firstElementChild as HTMLElement | null;
    if (!wrapper || !content) return;

    const lenis = new Lenis({ wrapper, content });
    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Lenis only watches `content`, which is the page's <style> tag (zero height), so it never
    // noticed a new page or late-loading fonts and kept the first page's height as the scroll
    // limit. Re-measure whenever any child of the scroller changes size or is swapped.
    const ro = new ResizeObserver(() => lenis.resize());
    const observeChildren = () => {
      ro.disconnect();
      Array.from(wrapper.children).forEach((c) => ro.observe(c));
      lenis.resize();
    };
    observeChildren();
    const mo = new MutationObserver(observeChildren);
    mo.observe(wrapper, { childList: true });

    return () => {
      ro.disconnect();
      mo.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    lenisRef.current?.scrollTo(0, { immediate: true });
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
              <img className="docs-topbar-logo-img" src="/logo.svg" alt="own-the-canvas logo" />
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
