import React from "react";

const CSS = `
.props-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--r);
}

.props-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.props-table th {
  text-align: left;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-3);
  background: var(--bg-subtle);
  border-bottom: 1px solid var(--border);
}

.props-table td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--border);
  color: var(--text-2);
  vertical-align: top;
}

.props-table tr:last-child td {
  border-bottom: none;
}

.props-table tr:hover td {
  background: var(--accent-soft);
}

.prop-name {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--accent);
  font-weight: 500;
}

.prop-type {
  font-family: var(--mono);
  font-size: 13px;
  color: #0369a1;
}

.prop-default {
  font-family: var(--mono);
  font-size: 13px;
  color: var(--text-3);
}

.prop-desc {
  color: var(--text-2);
  line-height: 1.5;
}

.prop-required {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-mid);
  border-radius: 3px;
  padding: 1px 5px;
  margin-left: 6px;
  vertical-align: middle;
  text-transform: uppercase;
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
