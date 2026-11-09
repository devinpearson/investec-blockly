import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  defaultTransaction,
  simulate,
  validateTransaction,
  type ExecutionItem,
  type TransactionInput,
} from "../../src/lib/simulator";
import { shareUrl } from "../../src/lib/share";
import {
  blockCatalogue,
  checkWorkspace,
  examples,
  templates,
  type BlockInfo,
  type CheckResult,
} from "./engine";
import { SNIPPET_FORMAT } from "./format";

export type ServerOptions = {
  /** Where share links open. */
  editorUrl: string;
  /** investec-card-server, for simulate_snippet. */
  simulatorUrl: string;
  /** Allow writing snippet files (local stdio use only). */
  allowFiles: boolean;
};

export const defaultOptions = (): ServerOptions => ({
  editorUrl:
    process.env.INVESTEC_BLOCKLY_URL ?? "https://investec-blockly.vercel.app/",
  simulatorUrl: process.env.SIMULATOR_URL ?? "http://localhost:3010",
  allowFiles: false,
});

const INSTRUCTIONS = `Investec Blockly builds programmable-card code for Investec cards from Blockly blocks. A snippet is a Blockly workspace (JSON) with up to three handler blocks — before transaction (approve/decline), after transaction and after decline — that the user opens in the editor.

Workflow for making a snippet:
1. Read the snippet format (resource investec-blockly://format, or the format section of list_blocks) and look up blocks with list_blocks / get_block. Start from get_example or list_templates when one is close.
2. Write the workspace JSON and call check_snippet. Fix every error and placement warning it reports, then check again.
3. If the user runs investec-card-server locally, call simulate_snippet with a few transactions to show it approving/declining as intended.
4. Call share_snippet and give the user the link. It opens the snippet in the editor, where they can adjust it and copy the generated code to their card.

Only use block types and field values that list_blocks reports. Card code runs in Investec's sandbox with fetch, moment and process.env but no other libraries; secrets belong in environment variables (investec_env blocks), never in the snippet.`;

const json = (value: unknown) => JSON.stringify(value, null, 2);
const text = (value: string) => ({
  content: [{ type: "text" as const, text: value }],
});

/** A one-line signature for list_blocks. */
function summarise(block: BlockInfo): string {
  const shape =
    block.output !== false
      ? `value${block.output ? ` → ${block.output.join("|")}` : ""}`
      : block.previousStatement || block.nextStatement
        ? "statement"
        : "handler";
  return `- ${block.type} (${shape}): ${block.text.replace(/\s+/g, " ")}${block.tooltip ? ` — ${block.tooltip}` : ""}`;
}

function describeCheck(result: CheckResult): string {
  const lines = [
    result.ok
      ? "✅ The snippet loads in the editor."
      : "❌ The snippet has errors.",
  ];
  for (const problem of result.problems) {
    const where = problem.blockId ? ` [block ${problem.blockId}]` : "";
    lines.push(`- ${problem.severity}${where}: ${problem.message}`);
  }
  if (result.code)
    lines.push("", "Generated card code:", "```js", result.code.trim(), "```");
  return lines.join("\n");
}

function describeRun(
  transaction: TransactionInput,
  items: ExecutionItem[],
): string {
  const decision = items.find((item) => item.type === "before_transaction");
  const lines = [
    `Transaction: R${(transaction.centsAmount / 100).toFixed(2)} ${transaction.currencyCode.toUpperCase()} at ${transaction.merchantName} (${transaction.merchantCity}, ${transaction.merchantCountry}), MCC ${transaction.merchantCode}`,
    `Decision: ${decision ? (decision.authorizationApproved ? "approved" : "declined") : "approved (no before transaction handler)"}`,
  ];
  for (const item of items) {
    lines.push(`${item.type}:`);
    if (!item.logs.length) lines.push("  (no logs)");
    for (const log of item.logs) lines.push(`  [${log.level}] ${log.content}`);
  }
  return lines.join("\n");
}

const workspaceSchema = z
  .union([z.string(), z.record(z.string(), z.unknown()), z.array(z.unknown())])
  .describe(
    'The Blockly workspace: { "blocks": { "languageVersion": 0, "blocks": [ …handler blocks… ] } }, as an object or JSON string.',
  );

const transactionSchema = z
  .object({
    centsAmount: z
      .number()
      .int()
      .nonnegative()
      .optional()
      .describe("Amount in cents, e.g. 25000 for R250"),
    currencyCode: z
      .string()
      .optional()
      .describe("Lower-case ISO currency, e.g. zar, usd"),
    merchantCode: z
      .string()
      .optional()
      .describe("Merchant category code (MCC), e.g. 5542 for fuel"),
    merchantName: z.string().optional(),
    merchantCity: z.string().optional(),
    merchantCountry: z
      .string()
      .optional()
      .describe("ISO 3166 alpha-2, e.g. ZA, US"),
  })
  .describe(
    "Fields to override on the default test transaction (R10 at Test Merchant, Cape Town, ZA)",
  );

export function createServer(
  options: ServerOptions = defaultOptions(),
): McpServer {
  const server = new McpServer(
    { name: "investec-blockly", version: "1.0.0" },
    { instructions: INSTRUCTIONS },
  );

  server.registerResource(
    "snippet-format",
    "investec-blockly://format",
    {
      title: "Snippet format",
      description:
        "How an Investec Blockly snippet (workspace JSON) is structured",
      mimeType: "text/markdown",
    },
    async (uri) => ({ contents: [{ uri: uri.href, text: SNIPPET_FORMAT }] }),
  );

  server.registerTool(
    "list_blocks",
    {
      title: "List blocks",
      description:
        "Every block the editor offers, grouped by toolbox category, with the snippet format. Call get_block for a block's fields and inputs.",
      inputSchema: {
        category: z
          .string()
          .optional()
          .describe(
            "Only this category, e.g. Card, Templates, HTTP, Date & time, Logic",
          ),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ category }) => {
      const blocks = blockCatalogue().filter(
        (block) =>
          !category || block.category.toLowerCase() === category.toLowerCase(),
      );
      const byCategory = new Map<string, BlockInfo[]>();
      for (const block of blocks) {
        byCategory.set(block.category, [
          ...(byCategory.get(block.category) ?? []),
          block,
        ]);
      }
      const sections = [...byCategory].map(
        ([name, list]) => `## ${name}\n${list.map(summarise).join("\n")}`,
      );
      return text(
        [
          category ? "" : SNIPPET_FORMAT,
          ...sections,
          category
            ? ""
            : "\nReady-made rules are available from list_templates.",
        ]
          .filter(Boolean)
          .join("\n\n"),
      );
    },
  );

  server.registerTool(
    "get_block",
    {
      title: "Get block",
      description:
        "Fields (with allowed dropdown values), inputs (with type checks), connections, placement rule and an example state for one or more block types.",
      inputSchema: {
        types: z
          .array(z.string())
          .min(1)
          .describe('Block types, e.g. ["investec_amount_compare"]'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ types }) => {
      const catalogue = blockCatalogue();
      return text(
        json(
          types.map(
            (type) =>
              catalogue.find((block) => block.type === type) ?? {
                type,
                error: "Unknown block type — see list_blocks.",
              },
          ),
        ),
      );
    },
  );

  server.registerTool(
    "list_templates",
    {
      title: "List templates",
      description:
        "Ready-made rule and notification blocks from the editor's Templates category (decline rules, Airtable, webhooks, ntfy, WhatsApp, Slack, Telegram), as block JSON to drop into a handler's STACK.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      text(
        templates()
          .map(
            (template) =>
              `### ${template.section} — ${template.title}\n\`\`\`json\n${JSON.stringify(template.block)}\n\`\`\``,
          )
          .join("\n\n"),
      ),
  );

  server.registerTool(
    "list_examples",
    {
      title: "List examples",
      description:
        "The example snippets in the editor, with what each one does.",
      inputSchema: {},
      annotations: { readOnlyHint: true },
    },
    async () =>
      text(
        Object.entries(examples)
          .map(
            ([name, example]) =>
              `- ${name}: ${example.guide?.summary ?? ""}${example.env?.length ? ` (env: ${example.env.join(", ")})` : ""}`,
          )
          .join("\n"),
      ),
  );

  server.registerTool(
    "get_example",
    {
      title: "Get example",
      description:
        "One example snippet: its workspace JSON, the environment variables it reads, and its write-up (steps, setup, test scenarios).",
      inputSchema: {
        name: z.string().describe("Example name from list_examples"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ name }) => {
      const key = Object.keys(examples).find(
        (candidate) => candidate.toLowerCase() === name.toLowerCase(),
      );
      if (!key) {
        return {
          ...text(
            `No example "${name}". Examples: ${Object.keys(examples).join(", ")}`,
          ),
          isError: true,
        };
      }
      const example = examples[key]!;
      return text(
        json({
          name: key,
          env: example.env ?? [],
          guide: example.guide,
          workspace: example.state,
        }),
      );
    },
  );

  server.registerTool(
    "check_snippet",
    {
      title: "Check snippet",
      description:
        "Loads the workspace exactly as the editor would, reports errors (unknown blocks, bad fields or values, wrong connections, duplicate handlers) and placement warnings, and returns the generated card code.",
      inputSchema: { workspace: workspaceSchema },
      annotations: { readOnlyHint: true },
    },
    async ({ workspace }) => text(describeCheck(checkWorkspace(workspace))),
  );

  server.registerTool(
    "simulate_snippet",
    {
      title: "Simulate snippet",
      description:
        "Runs the snippet's code against test transactions on investec-card-server (the local Investec card simulator) and reports approve/decline and the logs of each handler. HTTP blocks really send their requests.",
      inputSchema: {
        workspace: workspaceSchema,
        transactions: z
          .array(transactionSchema)
          .max(10)
          .optional()
          .describe("Test transactions; defaults to one R10 purchase"),
        env: z
          .record(z.string(), z.string())
          .optional()
          .describe(
            'Environment variables the code reads, e.g. {"MAX_SPEND": "500"}',
          ),
      },
      annotations: { openWorldHint: true },
    },
    async ({ workspace, transactions, env }) => {
      const result = checkWorkspace(workspace);
      if (!result.ok) return { ...text(describeCheck(result)), isError: true };
      const runs: string[] = [];
      for (const override of transactions?.length ? transactions : [{}]) {
        const transaction = { ...defaultTransaction, ...override };
        const invalid = validateTransaction(transaction);
        if (invalid) {
          runs.push(`Skipped a transaction: ${invalid}`);
          continue;
        }
        try {
          const items = await simulate(
            result.code,
            transaction,
            env ?? {},
            options.simulatorUrl,
          );
          runs.push(describeRun(transaction, items));
        } catch (e) {
          return {
            ...text(
              `${(e as Error).message}\nStart it with: git clone https://github.com/devinpearson/investec-card-server && cd investec-card-server && npm install && npm run build && npm start`,
            ),
            isError: true,
          };
        }
      }
      return text(runs.join("\n\n"));
    },
  );

  server.registerTool(
    "share_snippet",
    {
      title: "Share snippet",
      description:
        "Checks the snippet and returns a link that opens it in the Investec Blockly editor. Give the link to the user.",
      inputSchema: {
        workspace: workspaceSchema,
        name: z
          .string()
          .optional()
          .describe('Short name shown when it opens, e.g. "Fuel only"'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ workspace, name }) => {
      const result = checkWorkspace(workspace);
      if (!result.ok || !result.workspace) {
        return { ...text(describeCheck(result)), isError: true };
      }
      const url = await shareUrl(options.editorUrl, result.workspace, name);
      const warnings = result.problems.length
        ? `\n\nWarnings:\n${result.problems.map((problem) => `- ${problem.message}`).join("\n")}`
        : "";
      return text(`Open in Investec Blockly: ${url}${warnings}`);
    },
  );

  if (options.allowFiles) {
    server.registerTool(
      "save_snippet",
      {
        title: "Save snippet",
        description:
          "Checks the snippet and writes it as a .json file the user can load with the editor's Import button.",
        inputSchema: {
          workspace: workspaceSchema,
          path: z
            .string()
            .describe("File path to write, e.g. ./fuel-only.json"),
        },
        annotations: { destructiveHint: false },
      },
      async ({ workspace, path }) => {
        const result = checkWorkspace(workspace);
        if (!result.ok || !result.workspace) {
          return { ...text(describeCheck(result)), isError: true };
        }
        const file = resolve(path.endsWith(".json") ? path : `${path}.json`);
        await writeFile(file, json(result.workspace) + "\n");
        return text(`Saved ${file}. Open it with Import in the editor.`);
      },
    );
  }

  return server;
}
