// Drives the built MCP server over stdio like Claude Desktop would.
// Run with `npm run test:mcp` (builds first). simulate_snippet is tested only
// when investec-card-server answers at SIMULATOR_URL (default :3010).
import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const server = fileURLToPath(
  new URL("../dist/investec-blockly-mcp.cjs", import.meta.url),
);
const client = new Client({ name: "test", version: "1.0.0" });

before(async () => {
  await client.connect(
    new StdioClientTransport({
      command: process.execPath,
      args: [server],
      env: { ...process.env, INVESTEC_BLOCKLY_URL: "http://localhost:5173/" },
      stderr: "ignore",
    }),
  );
});
after(() => client.close());

const call = async (name, args = {}) => {
  const result = await client.callTool({ name, arguments: args });
  return {
    text: result.content.map((item) => item.text).join("\n"),
    isError: Boolean(result.isError),
  };
};

const handler = (type, statement) => ({
  type,
  inputs: { CODE: { block: statement } },
});
const workspace = (...blocks) => ({ blocks: { languageVersion: 0, blocks } });
const declineOver = (rands) => ({
  type: "controls_if",
  inputs: {
    IF0: {
      block: {
        type: "investec_amount_compare",
        fields: { OP: "GT", RANDS: rands },
      },
    },
    DO0: {
      block: {
        type: "investec_decline_with_reason",
        inputs: {
          REASON: { block: { type: "text", fields: { TEXT: "too much" } } },
        },
      },
    },
  },
});
const fuelOnly = workspace(
  handler("investec_card_before_transaction", declineOver(500)),
);

test("lists the tools", async () => {
  const { tools } = await client.listTools();
  assert.deepEqual(tools.map((tool) => tool.name).sort(), [
    "check_snippet",
    "get_block",
    "get_example",
    "list_blocks",
    "list_examples",
    "list_templates",
    "save_snippet",
    "share_snippet",
    "simulate_snippet",
  ]);
});

test("list_blocks covers the Investec blocks", async () => {
  const { text } = await call("list_blocks");
  for (const type of [
    "investec_card_before_transaction",
    "investec_amount_compare",
    "investec_ntfy_push",
    "controls_if",
  ]) {
    assert.match(text, new RegExp(type));
  }
});

test("get_block gives dropdown values", async () => {
  const { text } = await call("get_block", {
    types: ["investec_amount_compare"],
  });
  const [block] = JSON.parse(text);
  const op = block.inputs
    .flatMap((input) => input.fields)
    .find((field) => field.name === "OP");
  assert.deepEqual(
    op.options.map(([, value]) => value),
    ["GT", "GTE", "LT", "LTE"],
  );
});

test("every example passes check_snippet", async () => {
  const { text } = await call("list_examples");
  const names = [...text.matchAll(/^- (.+?):/gm)].map((match) => match[1]);
  assert.ok(names.length >= 9);
  for (const name of names) {
    const example = JSON.parse((await call("get_example", { name })).text);
    const result = await call("check_snippet", {
      workspace: example.workspace,
    });
    assert.match(result.text, /✅/, `${name}: ${result.text}`);
    assert.doesNotMatch(result.text, /warning/, `${name}: ${result.text}`);
  }
});

test("check_snippet returns code for a good snippet", async () => {
  const { text } = await call("check_snippet", {
    workspace: JSON.stringify(fuelOnly),
  });
  assert.match(text, /✅/);
  assert.match(text, /authorization\.centsAmount > 50000/);
  assert.match(text, /return false;/);
});

test("check_snippet reports mistakes", async () => {
  const bad = await call("check_snippet", {
    workspace: workspace(
      handler("investec_card_before_transaction", {
        type: "investec_amount_compare_typo",
      }),
    ),
  });
  assert.match(bad.text, /❌/);
  assert.match(bad.text, /list_blocks/);

  const badValue = await call("check_snippet", {
    workspace: workspace(
      handler("investec_card_before_transaction", {
        type: "controls_if",
        inputs: {
          IF0: {
            block: {
              type: "investec_amount_compare",
              fields: { OP: "over", RANDS: 5 },
            },
          },
        },
      }),
    ),
  });
  assert.match(
    badValue.text,
    /field OP can't be "over".*Allowed: GT, GTE, LT, LTE/s,
  );

  const twice = await call("check_snippet", {
    workspace: workspace(
      handler("investec_card_before_transaction", declineOver(1)),
      handler("investec_card_before_transaction", declineOver(2)),
    ),
  });
  assert.match(twice.text, /appears 2 times/);

  const misplaced = await call("check_snippet", {
    workspace: workspace(
      handler("investec_card_after_transaction", {
        type: "investec_before_transaction_return",
        fields: { VALUE: "DECLINE" },
      }),
    ),
  });
  assert.match(
    misplaced.text,
    /warning.*only has an effect inside a before transaction/,
  );
});

test("share_snippet links to the editor", async () => {
  const { text, isError } = await call("share_snippet", {
    workspace: fuelOnly,
    name: "Over R500",
  });
  assert.equal(isError, false);
  assert.match(text, /http:\/\/localhost:5173\/#import=[\w-]+&name=Over\+R500/);
});

test("simulate_snippet approves and declines", async (t) => {
  const url = process.env.SIMULATOR_URL ?? "http://localhost:3010";
  const up = await fetch(url).then(
    (response) => response.ok,
    () => false,
  );
  if (!up) return t.skip(`no investec-card-server at ${url}`);
  const { text, isError } = await call("simulate_snippet", {
    workspace: fuelOnly,
    transactions: [{ centsAmount: 1000 }, { centsAmount: 90000 }],
  });
  assert.equal(isError, false, text);
  const decisions = [...text.matchAll(/Decision: (\w+)/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(decisions, ["approved", "declined"]);
  assert.match(text, /\[warn\] "too much"/);
});

test("the skill's generated reference is up to date", async () => {
  const { execFileSync } = await import("node:child_process");
  const { readFileSync } = await import("node:fs");
  const generated = execFileSync(process.execPath, [server, "reference"], {
    encoding: "utf8",
  });
  const committed = readFileSync(
    new URL(
      "../../skills/investec-card-snippets/reference.md",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(
    generated === committed,
    "skills/investec-card-snippets/reference.md is stale — run npm run skill:reference",
  );
});

test("variables can be given by name", async () => {
  const limit = { VAR: { name: "limit" } };
  const { text } = await call("check_snippet", {
    workspace: workspace({
      type: "investec_card_before_transaction",
      inputs: {
        CODE: {
          block: {
            type: "variables_set",
            fields: limit,
            inputs: {
              VALUE: { block: { type: "math_number", fields: { NUM: 300 } } },
            },
            next: {
              block: {
                type: "investec_console_log",
                inputs: {
                  VALUE: { block: { type: "variables_get", fields: limit } },
                },
              },
            },
          },
        },
      },
    }),
  });
  assert.match(text, /✅/);
  assert.match(text, /limit = 300/);
});
