import React, { useState } from "react";
import { Link } from "react-router-dom";
import MOODS from "../moods.json";
import { searchComponents } from "../search";

const MCP_CMD = "claude mcp add own-the-canvas -- npx -y own-the-canvas";

const ALL = Object.keys(MOODS).map((name) => ({
  name,
  path: "/components/" + name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
}));
// Real results from the same search the sidebar runs, so the card never lies.
const EXAMPLES = ["cozy", "spooky", "calm ocean"].map((q) => ({ q, hits: searchComponents(ALL, q).slice(0, 3) }));

const CSS = `
.feat { margin: 0 0 96px; }
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 34px 30px;
  filter: drop-shadow(0 2px 1px rgba(var(--shadow-ink), .22)) drop-shadow(0 12px 12px rgba(var(--shadow-ink), .18));
}
.feat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 34px 28px 28px;
  background: var(--grain), var(--bg);
  clip-path: var(--cut-b);
}
.feat-card:nth-child(3) { clip-path: var(--cut-c); }
.feat-card:nth-child(4) { clip-path: var(--cut-d); }
.feat-tag {
  align-self: flex-start;
  font-family: var(--mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-1);
  padding: 4px 12px 4px 9px;
  background: repeating-linear-gradient(-45deg, rgba(143,191,159,.95) 0 6px, rgba(165,205,178,.95) 6px 12px);
  clip-path: polygon(0 0, 100% 0, calc(100% - 5px) 50%, 100% 100%, 0 100%);
}
.feat-card h3 {
  font-family: var(--font-display);
  font-size: 23px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: var(--text-1);
}
.feat-card p { font-size: 15px; line-height: 1.65; color: var(--text-2); }
.feat-link {
  margin-top: auto;
  padding-top: 6px;
  font-weight: 700;
  font-size: 14.5px;
  color: var(--accent);
  text-decoration: underline dashed;
  text-underline-offset: 4px;
}
.feat-link:hover { color: var(--accent-deep); text-decoration-style: solid; }

/* the AI card is the headline: full width, text left, a dark chat slip right */
.feat-ai {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 36px;
  align-items: center;
  padding: 40px 40px 36px;
  background: var(--grain), var(--mustard);
  clip-path: var(--cut-a);
}
.feat-ai .feat-tag { background: var(--grain), var(--accent); color: #fff; }
.feat-ai h3 { font-size: clamp(26px, 3vw, 34px); }
.feat-ai p { color: var(--text-1); opacity: .82; font-size: 16px; }
.feat-ai-copy {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
  max-width: 100%;
  padding: 10px 12px 10px 14px;
  font-family: var(--mono);
  font-size: 12px;
  color: var(--text-1);
  background: var(--grain), var(--bg);
  border: none;
  border-radius: var(--r-sm);
  box-shadow: 0 3px 0 #c98f12;
  cursor: pointer;
  text-align: left;
  transition: transform 160ms var(--ease), box-shadow 160ms var(--ease);
}
.feat-ai-copy:hover { transform: translateY(-1px); }
.feat-ai-copy:active { transform: translateY(3px); box-shadow: 0 0 0 #c98f12; }
.feat-ai-copy code { overflow-wrap: anywhere; line-height: 1.5; }
.feat-ai-copy span {
  flex: none;
  margin-left: auto;
  font-family: var(--font);
  font-size: 12px;
  font-weight: 700;
  color: var(--accent);
}
.feat-ai .feat-link { margin-top: 4px; color: var(--accent-deep); }

.feat-chat {
  font-family: var(--mono);
  font-size: 13px;
  line-height: 1.6;
  color: #d9c9ac;
  background: var(--grain), var(--code-bg);
  border-radius: var(--r);
  padding: 18px 20px;
  box-shadow: 0 3px 0 #1c150f, 0 10px 14px -6px rgba(var(--shadow-ink), .45);
  transform: rotate(1deg);
}
.feat-chat div + div { margin-top: 10px; }
.feat-chat .who { color: var(--mustard); font-weight: 700; }
.feat-chat .tool { color: #8fbf9f; }
.feat-chat .dim { color: #a89878; }
.feat-chat .tag { color: #f2b5a6; }

.feat-moods { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
.feat-mood { display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 8px; font-size: 14px; }
.feat-mood q {
  font-family: var(--mono);
  font-size: 12px;
  padding: 2px 8px;
  border: 1px dashed var(--border-mid);
  border-radius: 999px;
  color: var(--text-1);
  quotes: none;
}
.feat-mood a { color: var(--text-2); font-weight: 600; text-decoration: none; }
.feat-mood a:hover { color: var(--accent); text-decoration: underline; }
.feat-kbd {
  font-family: var(--mono);
  font-size: 12px;
  padding: 1px 6px;
  border: 1px solid var(--border-mid);
  border-radius: 3px;
  background: var(--bg-subtle);
  box-shadow: 0 1.5px 0 var(--border-mid);
}
.feat-list { display: flex; flex-direction: column; gap: 6px; font-size: 14.5px; color: var(--text-2); }
.feat-list li { list-style: none; padding-left: 18px; position: relative; }
.feat-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: .55em;
  width: 8px;
  height: 7px;
  border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%;
  background: var(--sage);
}

@media (max-width: 960px) {
  .feat-grid { grid-template-columns: 1fr; }
  .feat-ai { grid-template-columns: 1fr; padding: 32px 24px 28px; gap: 24px; }
}
`;

export function HomeFeatures() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(MCP_CMD).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="feat" aria-labelledby="features-heading">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <h2 className="home-grid-title" id="features-heading">Not just pretty</h2>
      <p className="home-grid-sub">Built for how you actually work: with an AI assistant, on real pages, in production.</p>

      <div className="feat-grid">
        <article className="feat-card feat-ai">
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
            <span className="feat-tag">New · MCP server</span>
            <h3>Describe a vibe. Your AI picks the component.</h3>
            <p>
              Connect Claude Code, Cursor or any MCP client. Ask for "a calm night by the water" and it
              finds the right component and writes code with the real props. Runs on your machine, no API key.
            </p>
            <button type="button" className="feat-ai-copy" onClick={copy} aria-label="Copy MCP setup command">
              <code>{MCP_CMD}</code>
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
            <Link to="/overview#ai" className="feat-link">Cursor and other setups →</Link>
          </div>
          <div className="feat-chat" aria-hidden="true">
            <div><span className="who">you ›</span> add a calm night-by-the-water background to my hero</div>
            <div className="tool">● list_components <span className="dim">→ 68 components, by mood</span></div>
            <div className="tool">● get_component("MoonlitSea") <span className="dim">→ props, presets</span></div>
            <div>
              <span className="tag">&lt;MoonlitSea</span> preset=<span className="who">"midnight"</span> overlay <span className="tag">/&gt;</span>
            </div>
          </div>
        </article>

        <article className="feat-card">
          <span className="feat-tag">Search</span>
          <h3>Search by mood, not by name</h3>
          <p>Press <kbd className="feat-kbd">/</kbd> and type a feeling. Typos are fine.</p>
          <div className="feat-moods">
            {EXAMPLES.map(({ q, hits }) => (
              <div key={q} className="feat-mood">
                <q>{q}</q>
                {hits.map((h) => <Link key={h.name} to={h.path}>{h.name}</Link>)}
              </div>
            ))}
          </div>
        </article>

        <article className="feat-card">
          <span className="feat-tag">Page-aware</span>
          <h3>Effects that land on your page</h3>
          <p>
            Snow piles on your headline, petals settle on buttons, a cat naps on your title. Mark any element
            with <code className="feat-kbd">data-otc-solid</code> and particles collide with it.
          </p>
          <Link to="/components/snow-drift" className="feat-link">See SnowDrift →</Link>
        </article>

        <article className="feat-card">
          <span className="feat-tag">Production</span>
          <h3>Safe to ship</h3>
          <ul className="feat-list">
            <li>Zero dependencies, tree-shakeable</li>
            <li>Pauses offscreen and in background tabs</li>
            <li>Respects reduced motion</li>
            <li>SSR-safe, React 18 and 19</li>
          </ul>
          <Link to="/overview" className="feat-link">Install guide →</Link>
        </article>
      </div>
    </section>
  );
}
