// The Streamable HTTP transport (for ChatGPT and other remote MCP clients).
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const server = fileURLToPath(
  new URL("../dist/investec-blockly-mcp.cjs", import.meta.url),
);
const port = 3000 + Math.floor(Math.random() * 900) + 100;
let child;

before(async () => {
  child = spawn(process.execPath, [server, "--http", String(port)], {
    stdio: ["ignore", "ignore", "pipe"],
  });
  // Wait for the "listening" line.
  for await (const chunk of child.stderr) {
    if (String(chunk).includes(`:${port}/mcp`)) break;
  }
});
after(async () => {
  child.kill();
  await once(child, "exit");
});

test("serves the tools over HTTP, without files", async () => {
  const client = new Client({ name: "test", version: "1.0.0" });
  await client.connect(
    new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`)),
  );
  const { tools } = await client.listTools();
  const names = tools.map((tool) => tool.name);
  assert.ok(names.includes("share_snippet"));
  assert.ok(!names.includes("save_snippet"), "no file writes over HTTP");
  const result = await client.callTool({
    name: "check_snippet",
    arguments: {
      workspace: {
        blocks: {
          languageVersion: 0,
          blocks: [{ type: "investec_card_after_transaction" }],
        },
      },
    },
  });
  assert.match(result.content[0].text, /✅/);
  await client.close();
});

test("answers GET / and rejects GET /mcp", async () => {
  assert.equal((await fetch(`http://127.0.0.1:${port}/`)).status, 200);
  assert.equal((await fetch(`http://127.0.0.1:${port}/mcp`)).status, 405);
});
