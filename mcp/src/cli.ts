// investec-blockly-mcp — an MCP server for making Investec Blockly snippets
// with Claude, ChatGPT or any MCP client.
//
//   node mcp/dist/investec-blockly-mcp.cjs              stdio (Claude Desktop, Claude Code, Cursor…)
//   node mcp/dist/investec-blockly-mcp.cjs --http 3020  Streamable HTTP at /mcp (ChatGPT, remote clients)
//   node mcp/dist/investec-blockly-mcp.cjs reference    print the block reference as Markdown
import { createServer as createHttpServer } from "node:http";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer, defaultOptions } from "./server";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { blockReference, exampleFiles } from "./reference";

const args = process.argv.slice(2);

async function serveStdio() {
  const server = createServer({ ...defaultOptions(), allowFiles: true });
  await server.connect(new StdioServerTransport());
  console.error("investec-blockly MCP server ready on stdio");
}

function serveHttp(port: number, host: string) {
  const options = defaultOptions();
  const http = createHttpServer(async (req, res) => {
    // Allow browser-based MCP clients and inspectors.
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
    const path = new URL(req.url ?? "/", "http://localhost").pathname;
    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    if (path === "/" && req.method === "GET") {
      res
        .writeHead(200, { "Content-Type": "text/plain" })
        .end("investec-blockly MCP server. Connect your MCP client to /mcp.\n");
      return;
    }
    if (path !== "/mcp") {
      res.writeHead(404).end();
      return;
    }
    if (req.method !== "POST") {
      // Stateless: no server-initiated streams or sessions to delete.
      res
        .writeHead(405, { Allow: "POST", "Content-Type": "application/json" })
        .end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Method not allowed." },
            id: null,
          }),
        );
      return;
    }
    // A fresh server per request keeps requests independent (stateless mode).
    const server = createServer(options);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    res.on("close", () => {
      void transport.close();
      void server.close();
    });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res);
    } catch (e) {
      console.error(e);
      if (!res.headersSent) {
        res.writeHead(500, { "Content-Type": "application/json" }).end(
          JSON.stringify({
            jsonrpc: "2.0",
            error: { code: -32603, message: "Internal server error" },
            id: null,
          }),
        );
      }
    }
  });
  http.listen(port, host, () => {
    console.error(
      `investec-blockly MCP server on http://${host}:${port}/mcp (share links open ${options.editorUrl})`,
    );
  });
}

function usage(code: number): never {
  console.error(`Usage:
  investec-blockly-mcp                 MCP over stdio
  investec-blockly-mcp --http [port]   MCP over Streamable HTTP at /mcp (default port 3020)
      --host <host>                    interface to listen on (default 127.0.0.1)
  investec-blockly-mcp reference       print the block reference (Markdown)
  investec-blockly-mcp skill-files <dir>  write the skill's reference.md and examples/

Environment:
  INVESTEC_BLOCKLY_URL  editor that share links open (default https://investec-blockly.vercel.app/)
  SIMULATOR_URL         investec-card-server for simulate_snippet (default http://localhost:3010)`);
  process.exit(code);
}

if (args.includes("--help") || args.includes("-h")) usage(0);

if (args[0] === "reference") {
  process.stdout.write(blockReference());
} else if (args[0] === "skill-files" && args[1]) {
  // Regenerates the skill's reference.md and examples/ from the blocks.
  const dir = args[1];
  mkdirSync(join(dir, "examples"), { recursive: true });
  writeFileSync(join(dir, "reference.md"), blockReference());
  for (const [file, contents] of Object.entries(exampleFiles())) {
    writeFileSync(join(dir, "examples", file), contents);
  }
  console.error(`Wrote ${dir}/reference.md and ${dir}/examples/`);
} else if (args.includes("--http")) {
  const value = args[args.indexOf("--http") + 1];
  const port =
    value && /^\d+$/.test(value)
      ? Number(value)
      : Number(process.env.PORT ?? 3020);
  const hostIndex = args.indexOf("--host");
  serveHttp(
    port,
    hostIndex >= 0 ? args[hostIndex + 1] ?? "127.0.0.1" : "127.0.0.1",
  );
} else if (args.length === 0) {
  serveStdio().catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  });
} else {
  usage(1);
}
