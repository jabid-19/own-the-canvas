import React from "react";

const CSS = `
.props-table-wrap {
  overflow-x: auto;
  background: var(--bg);
  border-radius: var(--r);
  box-shadow: 0 2px 0 var(--border-mid), 0 4px 0 rgba(var(--shadow-ink), .1), 0 12px 18px -8px rgba(var(--shadow-ink), .28);
}
.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.props-table th {
  text-align: left;
  padding: 11px 16px;
  font-family: var(--mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-1);
  background: var(--grain), var(--mustard);
}
.props-table td {
  padding: 11px 16px;
  border-bottom: 2px dotted var(--border);
  color: var(--text-2);
  vertical-align: top;
}
.props-table tr:last-child td {
  border-bottom: none;
}
.props-table tbody tr:nth-child(even) td { background: rgba(244,234,214,.55); }
.props-table tr:hover td {
  background: var(--accent-soft);
}
.prop-name {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}
.prop-type {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--navy);
}
.prop-default {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
}
.prop-desc {
  color: var(--text-2);
  line-height: 1.55;
}
.prop-required {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #fff;
  background: var(--accent);
  border-radius: 2px;
  padding: 1px 6px;
  margin-left: 6px;
  vertical-align: middle;
  text-transform: uppercase;
}

/* phones: each prop becomes a stacked card so the description isn't scrolled off-screen */
@media (max-width: 640px) {
  .props-table, .props-table tbody { display: block; }
  .props-table thead { display: none; }
  .props-table tr { display: flex; flex-wrap: wrap; align-items: baseline; gap: 2px 12px; padding: 12px 14px; border-bottom: 2px dotted var(--border); }
  .props-table tr:last-child { border-bottom: none; }
  .props-table td, .props-table tbody tr:nth-child(even) td { padding: 0; border: 0; background: none; }
  .props-table tbody tr:nth-child(even) { background: rgba(244,234,214,.55); }
  .props-table tr:hover td { background: none; }
  .props-table td:nth-child(4) { flex: 0 0 100%; margin-top: 4px; }
  .props-table td:nth-child(3) .prop-default::before { content: "default "; opacity: .6; }
  .props-table td:nth-child(3):has(.prop-default:empty) { display: none; }
}
`;

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

interface PropsTableProps {
  props: PropRow[];
}

export function PropsTable({ props }: PropsTableProps) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="props-table-wrap">
        <table className="props-table">
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {props.map((p) => (
              <tr key={p.name}>
                <td>
                  <span className="prop-name">{p.name}</span>
                  {p.required && <span className="prop-required">required</span>}
                </td>
                <td><span className="prop-type">{p.type}</span></td>
                <td><span className="prop-default">{p.default ?? "—"}</span></td>
                <td><span className="prop-desc">{p.description}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
