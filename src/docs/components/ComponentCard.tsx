import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const CSS = `
.component-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 200ms var(--ease), box-shadow 200ms var(--ease), transform 200ms var(--ease);
  background: var(--bg);
}
.component-card:hover {
  border-color: var(--accent-mid);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}
.component-card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.component-card-preview {
  height: 180px;
  overflow: hidden;
  background: var(--bg-subtle);
  position: relative;
  flex-shrink: 0;
}

.component-card-preview canvas {
  width: 100% !important;
  height: 100% !important;
}

.component-card-preview-badge {
  position: absolute;
  bottom: 8px;
  right: 10px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text-3);
  font-family: var(--mono);
  letter-spacing: 0.04em;
  pointer-events: none;
}

.component-card-body {
  padding: 16px 18px 18px;
  border-top: 1px solid var(--border);
}

.component-card-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-1);
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.component-card-accent {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.component-card-desc {
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.5;
}
`;

function LazyPreview({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setMounted(true); observer.disconnect(); } },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} style={{ width: "100%", height: "100%" }}>{mounted ? children : null}</div>;
}

interface ComponentCardProps {
  name: string;
  description: string;
  path: string;
  accent: string;
  preview: React.ReactNode;
}

export function ComponentCard({ name, description, path, accent, preview }: ComponentCardProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Link to={path} className="component-card" data-testid="component-card">
        <div className="component-card-preview" aria-hidden="true">
          <LazyPreview>{preview}</LazyPreview>
          <div className="component-card-preview-badge">live</div>
        </div>
        <div className="component-card-body">
          <div className="component-card-name">
            <div className="component-card-accent" style={{ background: accent }} />
            {name}
          </div>
          <div className="component-card-desc">{description}</div>
        </div>
      </Link>
    </>
  );
}
