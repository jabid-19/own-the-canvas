import React, { useState } from "react";

const CSS = `
/* Code sits on a sheet of dark ink-brown paper, stacked on the page */
.codeblock {
  background: var(--grain), var(--code-bg);
  border-radius: 0 0 var(--r) var(--r);
  overflow: hidden;
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 1.7;
  color: #d9c9ac;
  box-shadow: 0 3px 0 #1c150f, 0 6px 0 rgba(var(--shadow-ink), .2), 0 12px 16px -6px rgba(var(--shadow-ink), .35);
}

.codeblock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 2px dashed rgba(217,201,172,.18);
}

.codeblock-lang {
  font-size: 11px;
  font-weight: 700;
  color: var(--text-1);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: var(--mustard);
  padding: 2px 12px 2px 8px;
  clip-path: polygon(0 0, 100% 0, calc(100% - 5px) 50%, 100% 100%, 0 100%);
}

.codeblock-copy {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-1);
  background: var(--bg);
  border: none;
  border-radius: 3px;
  padding: 3px 12px;
  min-height: 28px;
  cursor: pointer;
  font-family: var(--font);
  box-shadow: 0 2px 0 var(--border-mid);
  transition: transform 150ms var(--ease), box-shadow 150ms var(--ease), background 150ms var(--ease);
}
.codeblock-copy:hover { background: #fff; }
.codeblock-copy:active { transform: translateY(2px); box-shadow: none; }
.codeblock-copy.copied { background: var(--sage); }

.codeblock-pre {
  padding: 16px 18px;
  overflow-x: auto;
  scrollbar-width: thin;
  white-space: pre;
}

.codeblock-single {
  border-radius: var(--r);
  padding: 10px 14px;
  background: var(--code-bg);
  font-family: var(--mono);
  font-size: 13.5px;
  display: inline-block;
  width: 100%;
}

/* Syntax colours, tuned for warm dark paper */
.tok-kw   { color: #f6c453; font-weight: 600; }
.tok-fn   { color: #9ed8b8; }
.tok-str  { color: #f2a58f; }
.tok-tag  { color: #86cfd0; }
.tok-attr { color: #e8d3a8; }
.tok-val  { color: #f6c453; }
.tok-dim  { color: #d9c9ac; }
.tok-cmt  { color: #a08f75; font-style: italic; }
.tok-num  { color: #9ed8b8; }
`;

function tokenizeLine(line: string) {
  if (line.trim() === "") return <>&nbsp;</>;

  if (line.trim().startsWith("//")) {
    return <span className="tok-cmt">{line}</span>;
  }

  if (line.startsWith("import") || line.startsWith("export")) {
    return (
      <>
        {line.split(/(\{[^}]+\}|'[^']+'|"[^"]+"|from|import|export|type)/g).map((p, i) => {
          if (p === "import" || p === "export" || p === "from" || p === "type")
            return <span key={i} className="tok-kw">{p}</span>;
          if ((p.startsWith("'") && p.endsWith("'")) || (p.startsWith('"') && p.endsWith('"')))
            return <span key={i} className="tok-str">{p}</span>;
          if (p.startsWith("{"))
            return <span key={i} className="tok-fn">{p}</span>;
          return <span key={i} className="tok-dim">{p}</span>;
        })}
      </>
    );
  }

  // JSX / general
  const parts = line.split(/(<\/?[\w.]+|\/?>|[\w]+={|[\w]+=\{|[\w]+="[^"]*"|\{[^}]+\}|"[^"]*"|'[^']*')/g);
  return (
    <>
      {parts.map((p, i) => {
        if (/^<\/?[\w.]/.test(p)) return <span key={i} className="tok-tag">{p}</span>;
        if (p === "/>" || p === ">") return <span key={i} className="tok-tag">{p}</span>;
        if (/^[\w]+=\{/.test(p) || /^[\w]+={$/.test(p)) {
          const eq = p.indexOf("=");
          return <span key={i}><span className="tok-attr">{p.slice(0, eq)}</span><span className="tok-dim">{p.slice(eq)}</span></span>;
        }
        if (/^[\w]+="[^"]*"$/.test(p)) {
          const eq = p.indexOf("=");
          return <span key={i}><span className="tok-attr">{p.slice(0, eq)}</span><span className="tok-dim">="</span><span className="tok-str">{p.slice(eq + 2, -1)}</span><span className="tok-dim">"</span></span>;
        }
        if ((p.startsWith("{") && p.endsWith("}")) || /^\d+(\.\d+)?$/.test(p.trim()))
          return <span key={i} className="tok-val">{p}</span>;
        if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'")))
          return <span key={i} className="tok-str">{p}</span>;
        return <span key={i} className="tok-dim">{p}</span>;
      })}
    </>
  );
}

interface CodeBlockProps {
  code: string;
  language?: string;
  showHeader?: boolean;
}

export function CodeBlock({ code, language = "tsx", showHeader = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code).catch(() => { });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = code.split("\n");

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="codeblock">
        {showHeader && (
          <div className="codeblock-header">
            <span className="codeblock-lang">{language}</span>
            <button
              className={`codeblock-copy${copied ? " copied" : ""}`}
              onClick={copy}
              aria-label={copied ? "Copied!" : "Copy code"}
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        )}
        <pre className="codeblock-pre">
          <code>
            {lines.map((line, i) => (
              <div key={i}>{tokenizeLine(line)}</div>
            ))}
          </code>
        </pre>
      </div>
    </>
  );
}

export function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: "var(--mono)",
      fontSize: "0.875em",
      background: "var(--accent-soft)",
      borderRadius: "3px",
      padding: "1px 6px",
      color: "var(--accent-deep)",
      boxShadow: "0 1px 0 var(--accent-mid)",
    }}>
      {children}
    </code>
  );
}
