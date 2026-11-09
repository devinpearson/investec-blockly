// How a snippet is written, for the MCP server's instructions and the skill.
export const SNIPPET_FORMAT = `# Investec Blockly snippet format

A snippet is a Blockly workspace saved as JSON (Blockly's JSON serialisation, Blockly 10):

\`\`\`json
{
  "blocks": {
    "languageVersion": 0,
    "blocks": [
      {
        "type": "investec_card_before_transaction",
        "x": 40, "y": 40,
        "inputs": { "CODE": { "block": { …first statement…, "next": { "block": { …second statement… } } } } }
      },
      { "type": "investec_card_after_transaction", "x": 40, "y": 400, "inputs": { "CODE": { "block": { … } } } }
    ]
  }
}
\`\`\`

## Handlers (top-level blocks)

| Block | Runs | Event variable |
|---|---|---|
| investec_card_before_transaction | Before the card is charged. Decide here: approve or decline. 5 s limit. | authorization |
| investec_card_after_transaction | After an approved purchase. Notify / record. | transaction |
| investec_card_after_decline | After a declined purchase. Alert. | transaction |

- Each handler may appear at most once. Put statements in its CODE input.
- Card blocks (amount, merchant, card event…) read whichever event their handler receives, so the same block works in all three.
- Before transaction approves when nothing declines it. End with investec_before_transaction_return (VALUE "APPROVE"/"DECLINE") or use investec_decline_with_reason, which declines and stops.
- Only function definitions (procedures_def*) and variables_set may sit outside a handler.

## Block JSON

- Block: \`{ "type": "…", "fields": { "NAME": value }, "inputs": { "NAME": { "block": {…} } }, "next": { "block": {…} } }\`.
- **fields** hold the block's own values: text, numbers, dropdown values (use the option *value*, e.g. "GT", not the label "over").
- **inputs** hold other blocks: value inputs take one value block; statement inputs (CODE, DO0, ELSE, STACK…) take the first block of a statement chain.
- **next** chains the following statement in the same stack.
- Use \`"shadow"\` instead of \`"block"\` for editable default values, e.g. \`"REASON": { "shadow": { "type": "text", "fields": { "TEXT": "over limit" } } }\` — a normal "block" works too.
- Variables: \`{ "type": "variables_get", "fields": { "VAR": { "name": "limit" } } }\` — the variable is created by name.
- Mutating built-ins need **extraState**: controls_if \`{ "elseIfCount": 1, "hasElse": true }\` (inputs IF0/DO0, IF1/DO1, ELSE), text_join and lists_create_with \`{ "itemCount": 3 }\` (inputs ADD0…).
- Ids and x/y are optional; give each handler a different y (about 300 apart) so they don't overlap.

## Writing rules

- Prefer the Investec blocks (amount compare, merchant category, decline because, env flag, ntfy/WhatsApp/Slack/Airtable/webhook) over hand-built logic — they generate correct, readable code.
- Amounts: investec_amount_compare compares in rands (it converts to cents). The raw centsAmount is in cents.
- Never put secrets (API keys, tokens, phone numbers) in text blocks; read them with investec_env and tell the user which environment variables to set.
- Check every snippet with check_snippet (MCP) before giving it to the user.
`;
