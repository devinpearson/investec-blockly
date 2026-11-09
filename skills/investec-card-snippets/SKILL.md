---
name: investec-card-snippets
description: Build Investec programmable-card code as Investec Blockly snippets (Blockly workspace JSON) — approve/decline rules, spending limits, merchant/category/time/country checks, and after-purchase notifications or logging (ntfy, WhatsApp, Slack, Telegram, Airtable, Make.com/Zapier webhooks). Use whenever someone wants card rules, a programmable-card snippet, "decline if…", card notifications, or anything for the Investec Blockly editor, even if they only describe the behaviour they want.
---

# Investec card snippets

Investec Blockly (https://investec-blockly.vercel.app) is a community-made block editor for Investec programmable-card code — not made or supported by Investec. A **snippet** is the editor's workspace JSON. The user opens it in the editor, tries it against test purchases, and copies the generated JavaScript to their card.

## Files

- `reference.md` — the snippet format and every block: fields with allowed values, inputs, placement rules, plus the ready-made templates. **Read it before writing a snippet** and use only the block types and field values it lists. It is generated from the editor's code, so it is the source of truth.
- `examples/*.json` — complete snippets that ship with the editor (teen card, travel mode, Airtable expense log, Make.com, kill switch…). Start from the closest one.
- `scripts/share_link.py` — turns a snippet into a link that opens it in the editor.

## If the investec-blockly MCP server is connected

Prefer its tools: `list_blocks` / `get_block` / `list_templates` / `get_example` to look things up, `check_snippet` after every draft (fix all errors and warnings), `simulate_snippet` to show it working when the user runs investec-card-server, and `share_snippet` for the link. Skip the manual steps below that the tools cover.

## Workflow

1. **Pin down the behaviour.** Which purchases to decline (amounts in rand, merchant categories, shops, countries, times, a switch the user can flip), and what to send or record afterwards. Ask only when a choice really changes the snippet; otherwise pick sensible defaults and say so.
2. **Choose handlers.** Rules go in `investec_card_before_transaction`; notifications/logging after a purchase in `investec_card_after_transaction`; alerts for declines in `investec_card_after_decline`. Each at most once.
3. **Write the workspace JSON** following `reference.md`:
   - prefer the Investec blocks and templates (e.g. `investec_amount_compare`, `investec_merchant_group`, `investec_decline_with_reason`, `investec_env_flag`, `investec_ntfy_push`) over hand-built logic;
   - dropdown fields take the option **value** (`"GT"`, `"FUEL"`, `"120"`), never the label;
   - chain statements with `"next"`; give handlers different `y` positions (~300 apart);
   - secrets and personal details (API keys, tokens, phone numbers, ntfy topics, webhook URLs) come from `investec_env` blocks — never write them into text blocks.
4. **Check it yourself** (without MCP): every `type` exists in `reference.md`, every field name and dropdown value matches, value inputs get value blocks with a compatible output check, statement inputs get statement blocks, card blocks sit inside a handler, approve/decline only in before transaction.
5. **Hand it over:**
   - a link: run `python3 scripts/share_link.py snippet.json --name "<short name>"` (or pipe JSON with `-`) and give the user the URL — it opens the snippet in the editor;
   - and/or the JSON as a `.json` file for the editor's **Import** button;
   - a short explanation: what each handler does, which **environment variables** to set (Environment variables in the Transaction tab, and in Investec Online for the real card), and two or three test purchases to try (e.g. "R600 at a restaurant → declined").

## Things to know about the card environment

- Code runs in Investec's sandbox: `fetch`, `moment` and `process.env` are available, no other libraries and no `setTimeout`. Before transaction must finish within a few seconds or the purchase is declined.
- Before transaction approves by default; declining (or an error) stops the purchase. After transaction / after decline can't change the outcome.
- Amounts arrive in cents (`centsAmount`); `investec_amount_compare` and `investec_amount_rands` work in rand.
- Merchant categories are MCC codes; `investec_merchant_group` covers common groups (fuel, groceries, restaurants, gambling…).
- The simulator ([investec-card-server](https://github.com/devinpearson/investec-card-server)) runs snippets locally; HTTP blocks really send requests when run there.
