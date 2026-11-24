import { execFileSync } from "node:child_process";

// Drives the real server over stdio, the way an AI client does.
const rpc = (messages) =>
  execFileSync("node", ["bin/mcp.mjs"], { input: messages.map((m) => (typeof m === "string" ? m : JSON.stringify(m))).join("\n") + "\n" })
    .toString()
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
const call = (name, args) =>
  rpc([{ jsonrpc: "2.0", id: 1, method: "tools/call", params: { name, arguments: args } }])[0].result;

test("speaks the MCP handshake", () => {
  const res = rpc([
    { jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "t", version: "0" } } },
    { jsonrpc: "2.0", method: "notifications/initialized" },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
    { jsonrpc: "2.0", id: 3, method: "bogus" },
    "not json",
  ]);
  expect(res.map((r) => r.id)).toEqual([1, 2, 3, null]);
  expect(res[0].result.protocolVersion).toBe("2025-06-18");
  expect(res[0].result.serverInfo.name).toBe("own-the-canvas");
  expect(res[1].result.tools.map((t) => t.name)).toEqual(["list_components", "get_component"]);
  expect(res[2].error.code).toBe(-32601);
  expect(res[3].error.code).toBe(-32700);
});

test("lists components with moods and usage rules", () => {
  const out = call("list_components").content[0].text;
  expect(out).toContain("## Usage rules");
  expect(out).toMatch(/- MoonlitSea \[calm, night, .*\]: The open sea at night/);
});

test("get_component returns props, is case-insensitive, and errors on unknown names", () => {
  expect(call("get_component", { name: "moonlitsea" }).content[0].text).toContain("| `horizon` | `number` | `0.42` |");
  const miss = call("get_component", { name: "Nope" });
  expect(miss.isError).toBe(true);
  expect(miss.content[0].text).toContain("KoiPond");
});
