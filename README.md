# investec-blockly
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A basic example of blockly with blocks created specifically for Investec programmable card.
Built with React, TypeScript and Vite.

This is a community project. It is not made, endorsed or supported by Investec.

Card:
- `before transaction` - creates the beforeTransaction function
- `after transaction` - creates the afterTransaction function
- `after decline` - creates the afterDecline function
- `approve` / `decline` - the return value of beforeTransaction
- `log` - creates a log statement at info, warning or error level
- `card event` - a field of the authorization / transaction (amount, merchant,
  category, country, card ID, ...), whichever handler it is in
- `amount is over / under R…` and `amount in rands`
- `merchant category is` - a group of merchant category codes, e.g. fuel,
  groceries, gambling or travel (hover the block to see the codes)
- `decline because` - logs a reason and declines
- `merchant name contains any of` - comma-separated words, for allow- and
  block-lists
- `is a foreign transaction` - outside South Africa or not in rand
- `amount as text` - e.g. `R1,234.50`, for messages
- `countries`, `currency`, `merchants` - lists of codes

Templates: ready-made rules to drop into a handler — card lock, fuel only,
block gambling, travel mode, online lock, allow- and block-lists, category
caps, weekday rules, after hours and spending limits; after a purchase, an
Airtable record, a Make.com / Zapier webhook, a phone push, a WhatsApp or a
Slack message; after a decline, a phone push, WhatsApp or Telegram alert.

HTTP (uses `fetch`, only inside the before/after/decline blocks):
- `send request` - calls a URL with an optional body and headers; text bodies
  are sent as-is, anything else as JSON
- `response` - calls a URL and returns the response as JSON or text
- `bearer token` - headers with `Authorization: Bearer <token>`
- `whole card event` - the full authorization/transaction object
- `create object` / `key : value` - an object, e.g. a JSON body or headers
- `get … from` - a property of an object, such as a JSON response
- `add Airtable record` - adds a row to an Airtable table
- `send to webhook` - posts JSON to a Make.com, Zapier or other webhook
- `push to phone` - a push notification via [ntfy.sh](https://ntfy.sh)
- `send WhatsApp message` - a WhatsApp message to your own number via
  [CallMeBot](https://www.callmebot.com/blog/free-api-whatsapp-messages/), a
  free third-party service that is not an official WhatsApp API; fine for
  personal notifications (set `WHATSAPP_PHONE` and `CALLMEBOT_API_KEY`)
- `send Slack message` - posts to a Slack incoming webhook
- `send Telegram message` - sends a message from a Telegram bot
- `env … as text / number` - reads an environment variable (`process.env`);
  set values in the Environment Variables section of the simulator panel
- `env flag … is on` - true for `true`, `on`, `yes` or `1`; use it as a switch

Date & Time (uses `moment`, in SAST or UTC):
- `transaction hour / minute / day of week / ...` - part of the transaction time
- `transaction is on a weekend` and `transaction is on a <day>`
- `transaction time is between` - a time range, which may cross midnight
- `transaction time as text` - e.g. `Sat 7 Nov 14:32`

Share: **Copy link** puts a link on the clipboard that opens the current
workspace — the workspace is packed into the URL fragment, so it never
reaches a server.

Examples (Open… menu): Default, Petrol Card, Amount, After Hours, Teen Card,
Travel Mode, Expense Log (Airtable), Make.com Automation and Remote Kill
Switch. Opening one shows its Guide tab: what the blocks do step by step,
what happens behind the scenes when you press Run, the setup it needs (with
which environment variables are still missing), and "Try it" transactions
that fill in the form and run with one click. The write-ups live in
`src/examples/guides.ts`.

The older `authorization:` and `transaction:` blocks still load in saved
workspaces; `card event` replaces both.

The before transaction, after transaction and after decline blocks can each be
used once per workspace.

## Make snippets with Claude or ChatGPT

An AI assistant can write snippets for you and hand them over as a link that
opens in the editor (`…/#import=…`, the same as the **Copy link** button).
There are two ways to connect one, and they work together.

### Skill: `skills/investec-card-snippets`

Teaches the assistant the snippet format and every block, using a reference
generated from the block code (`reference.md`), the examples (`examples/`)
and `scripts/share_link.py` for links. It needs nothing running.

- **Claude Code:** copy the folder to `~/.claude/skills/` (or `.claude/skills/`
  in a project).
- **Claude.ai / Claude Desktop:** zip the folder and upload it under
  Settings → Capabilities → Skills:

  ```sh
  cd skills && zip -r investec-card-snippets.zip investec-card-snippets
  ```

- **ChatGPT:** make a custom GPT with the contents of `SKILL.md` as its
  instructions and `reference.md` plus a few `examples/*.json` as knowledge
  files.

After changing blocks, regenerate the reference (a test fails if it is stale):

```sh
npm run skill:reference
```

### MCP server: `mcp/`

Runs the editor's own blocks headless in Node, so the assistant can check its
work instead of guessing. Tools:

| Tool | What it does |
|---|---|
| `list_blocks`, `get_block` | The block catalogue, fields, allowed values and placement rules |
| `list_templates`, `list_examples`, `get_example` | Ready-made rules and complete examples to start from |
| `check_snippet` | Loads the snippet like the editor does and reports errors and warnings, plus the generated code |
| `simulate_snippet` | Runs it on investec-card-server (port 3010) with test purchases |
| `share_snippet` | Returns a link that opens the snippet in the editor |
| `save_snippet` | Writes a `.json` file for Import (stdio only) |

Build it once:

```sh
npm install
npm run build:mcp
```

**Claude Desktop** (`claude_desktop_config.json`) or any stdio client:

```json
{
  "mcpServers": {
    "investec-blockly": {
      "command": "node",
      "args": ["/path/to/investec-blockly/mcp/dist/investec-blockly-mcp.cjs"]
    }
  }
}
```

**Claude Code:**

```sh
claude mcp add investec-blockly -- node /path/to/investec-blockly/mcp/dist/investec-blockly-mcp.cjs
```

**ChatGPT** only connects to remote MCP servers over HTTPS. Start the HTTP
transport and expose it with a tunnel, then add `https://<tunnel>/mcp` as a
connector (Settings → Apps & Connectors → Advanced → Developer mode):

```sh
npm run mcp:http            # http://127.0.0.1:3020/mcp
cloudflared tunnel --url http://localhost:3020   # or: ngrok http 3020
```

`simulate_snippet` reaches investec-card-server from wherever the MCP server
runs, so it works when both run on your machine.

Settings (environment variables): `INVESTEC_BLOCKLY_URL` — the editor share
links open (default https://investec-blockly.vercel.app/; use
`http://localhost:5173/` with `npm start`), and `SIMULATOR_URL` — the card
server (default `http://localhost:3010`).

Test it with `npm run test:mcp` (the simulate test runs when the card server
is up).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

The app opens with an About dialog (also under About in the header) that
explains the simulator, checks whether the server is reachable and walks
through starting it.

You will need to run [investec-card-server](https://github.com/devinpearson/investec-card-server)
in order to run the project. It is expected at `http://localhost:3010`; to use a
different address, set `VITE_SIMULATOR_URL` in a `.env.local` file:

```sh
VITE_SIMULATOR_URL=http://localhost:3010
```

### Compile and Hot-Reload for Development

```sh
npm run start
```

### Compile and Minify for Production

```sh
npm run build
```

### Type-check, lint and format

```sh
npm run typecheck
npm run lint
npm run format
```
