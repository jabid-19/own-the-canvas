import React, { useState } from "react";

const CSS = `
.codeblock {
  background: var(--code-bg);
  border: 1px solid var(--code-border);
  border-radius: var(--r);
  overflow: hidden;
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 1.65;
}

.codeblock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 14px;
  border-bottom: 1px solid var(--code-border);
  background: rgba(0,0,0,0.025);
}

.codeblock-lang {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-3);
  letter-spacing: 0.04em;
  text-transform: lowercase;
}

.codeblock-copy {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-2);
  background: none;
  border: 1px solid var(--border);
  border-radius: 5px;
  padding: 2px 10px;
  cursor: pointer;
  font-family: var(--font);
  transition: all 150ms var(--ease);
  line-height: 1.8;
}
.codeblock-copy:hover { color: var(--text-1); border-color: var(--border-mid); }
.codeblock-copy.copied {
  color: var(--success);
  border-color: rgba(22, 163, 74, 0.35);
  background: rgba(22, 163, 74, 0.06);
}

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
  border: 1px solid var(--code-border);
  font-family: var(--mono);
  font-size: 13.5px;
  display: inline-block;
  width: 100%;
}

/* Syntax token colors (monochrome) */
.tok-kw   { color: #111111; font-weight: 600; }
.tok-fn   { color: #333333; }
.tok-str  { color: #555555; }
.tok-tag  { color: #333333; }
.tok-attr { color: #444444; }
.tok-val  { color: #555555; }
.tok-dim  { color: var(--text-2); }
.tok-cmt  { color: var(--text-3); font-style: italic; }
.tok-num  { color: #333333; }
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
    navigator.clipboard.writeText(code).catch(() => {});
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
      background: "var(--code-bg)",
      border: "1px solid var(--code-border)",
      borderRadius: "4px",
      padding: "1px 5px",
      color: "var(--accent)",
    }}>
      {children}
    </code>
  );
}
