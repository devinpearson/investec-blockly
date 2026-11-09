// Bundles the MCP server, with the editor's blocks, into one Node script.
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  // No public/ copying or .env loading for the server bundle.
  publicDir: false,
  build: {
    ssr: "src/cli.ts",
    outDir: "dist",
    emptyOutDir: true,
    target: "node22",
    minify: false,
    rolldownOptions: {
      // Bundle everything (Blockly is CommonJS without an exports map) except
      // jsdom, which Blockly loads lazily in Node.
      external: ["jsdom"],
      output: {
        format: "cjs",
        entryFileNames: "investec-blockly-mcp.cjs",
        banner: "#!/usr/bin/env node",
      },
    },
  },
  ssr: { noExternal: true, external: ["jsdom"] },
});
