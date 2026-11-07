// Builders for serialised Blockly blocks, shared by the toolbox templates and
// the example workspaces. Each returns block JSON as used by
// Blockly.serialization (`{ type, fields, inputs, next }`).
export type BlockState = {
  type: string;
  fields?: Record<string, unknown>;
  inputs?: Record<string, { block: BlockState }>;
  next?: { block: BlockState };
  extraState?: unknown;
  icons?: { comment?: CommentState };
  x?: number;
  y?: number;
};

type CommentState = {
  text: string;
  pinned: boolean;
  height: number;
  width: number;
};

const input = (block: BlockState) => ({ block });

export const text = (value: string): BlockState => ({
  type: "text",
  fields: { TEXT: value },
});

export const env = (
  name: string,
  as: "TEXT" | "NUMBER" = "TEXT",
): BlockState => ({ type: "investec_env", fields: { NAME: name, AS: as } });

export const envFlag = (name: string): BlockState => ({
  type: "investec_env_flag",
  fields: { NAME: name },
});

export const eventValue = (field: string): BlockState => ({
  type: "investec_event_value",
  fields: { FIELD: field },
});

export const rands: BlockState = { type: "investec_amount_rands" };
export const amountText: BlockState = { type: "investec_format_amount" };
export const timeText: BlockState = {
  type: "investec_time_text",
  fields: { ZONE: "120" },
};
export const isForeign: BlockState = { type: "investec_is_foreign" };

export const merchantGroup = (group: string): BlockState => ({
  type: "investec_merchant_group",
  fields: { GROUP: group },
});

export const nameContainsAny = (names: string): BlockState => ({
  type: "investec_merchant_name_contains_any",
  fields: { NAMES: names },
});

export const amountOver = (rands: number): BlockState => ({
  type: "investec_amount_compare",
  fields: { OP: "GT", RANDS: rands },
});

export const timeBetween = (start: string, end: string): BlockState => ({
  type: "investec_time_between",
  fields: { START: start, END: end, ZONE: "120" },
});

export const not = (value: BlockState): BlockState => ({
  type: "logic_negate",
  inputs: { BOOL: input(value) },
});

export const and = (a: BlockState, b: BlockState): BlockState => ({
  type: "logic_operation",
  fields: { OP: "AND" },
  inputs: { A: input(a), B: input(b) },
});

export const or = (a: BlockState, b: BlockState): BlockState => ({
  type: "logic_operation",
  fields: { OP: "OR" },
  inputs: { A: input(a), B: input(b) },
});

/** Joins text and values, e.g. join("Spent ", amountText). */
export const join = (...parts: (string | BlockState)[]): BlockState => ({
  type: "text_join",
  extraState: { itemCount: parts.length },
  inputs: Object.fromEntries(
    parts.map((part, i) => [
      `ADD${i}`,
      input(typeof part === "string" ? text(part) : part),
    ]),
  ),
});

export const decline = (reason: string): BlockState => ({
  type: "investec_decline_with_reason",
  inputs: { REASON: input(text(reason)) },
});

export const approve: BlockState = {
  type: "investec_before_transaction_return",
  fields: { VALUE: "APPROVE" },
};

/** if <condition> then <statements>. */
export const ifThen = (
  condition: BlockState,
  then: BlockState,
): BlockState => ({
  type: "controls_if",
  inputs: { IF0: input(condition), DO0: input(then) },
});

/** if <condition>: decline because <reason>. */
export const declineIf = (condition: BlockState, reason: string) =>
  ifThen(condition, decline(reason));

export const log = (
  value: BlockState,
  level: "INFO" | "WARN" | "ERROR" = "INFO",
): BlockState => ({
  type: "investec_console_log",
  fields: { LEVEL: level },
  inputs: { VALUE: input(value) },
});

/** Links statements so each runs after the previous one. */
export function chain(...statements: BlockState[]): BlockState {
  const copies = statements.map(
    (statement) => JSON.parse(JSON.stringify(statement)) as BlockState,
  );
  for (let i = copies.length - 2; i >= 0; i--) {
    let tail = copies[i]!;
    while (tail.next) tail = tail.next.block;
    tail.next = { block: copies[i + 1]! };
  }
  return copies[0]!;
}

/** create object { key: value, ... } */
export function object(entries: [string, BlockState][]): BlockState {
  const items = entries.map(
    ([key, value]): BlockState => ({
      type: "investec_object_entry",
      fields: { KEY: key },
      inputs: { VALUE: input(value) },
    }),
  );
  return {
    type: "investec_object",
    ...(items.length ? { inputs: { ENTRIES: input(chain(...items)) } } : {}),
  };
}

/** The purchase as named fields, for Airtable columns or a webhook body. */
export const purchaseFields = (
  extra: [string, BlockState][] = [],
): BlockState =>
  object([
    ["Date", eventValue("DATETIME")],
    ["Merchant", eventValue("MERCHANT_NAME")],
    ["Category", eventValue("MERCHANT_CATEGORY_NAME")],
    ["City", eventValue("MERCHANT_CITY")],
    ["Country", eventValue("MERCHANT_COUNTRY_NAME")],
    ["Amount", rands],
    ["Currency", eventValue("CURRENCY_CODE")],
    ["Card", eventValue("CARD_ID")],
    ...extra,
  ]);

export const airtableRecord = (fields: BlockState): BlockState => ({
  type: "investec_airtable_add_record",
  inputs: {
    BASE: input(env("AIRTABLE_BASE")),
    TABLE: input(env("AIRTABLE_TABLE")),
    FIELDS: input(fields),
    TOKEN: input(env("AIRTABLE_TOKEN")),
  },
});

export const webhook = (url: string, data: BlockState): BlockState => ({
  type: "investec_webhook_send",
  inputs: { URL: input(env(url)), DATA: input(data) },
});

export const ntfy = (message: BlockState): BlockState => ({
  type: "investec_ntfy_push",
  inputs: { MESSAGE: input(message), TOPIC: input(env("NTFY_TOPIC")) },
});

export const whatsApp = (message: BlockState): BlockState => ({
  type: "investec_whatsapp_callmebot",
  inputs: {
    MESSAGE: input(message),
    PHONE: input(env("WHATSAPP_PHONE")),
    API_KEY: input(env("CALLMEBOT_API_KEY")),
  },
});

export const telegram = (message: BlockState): BlockState => ({
  type: "investec_telegram_message",
  inputs: {
    TEXT: input(message),
    TOKEN: input(env("TELEGRAM_BOT_TOKEN")),
    CHAT_ID: input(env("TELEGRAM_CHAT_ID")),
  },
});

export const slack = (message: BlockState): BlockState => ({
  type: "investec_slack_message",
  inputs: { TEXT: input(message), URL: input(env("SLACK_WEBHOOK_URL")) },
});

/** "Spent R120.00 at Shell" */
export const spentMessage = () =>
  join("Spent ", amountText, " at ", eventValue("MERCHANT_NAME"));

/** "Declined R120.00 at Shell, Cape Town (South Africa) — Sat 7 Nov 14:32" */
export const declinedMessage = () =>
  join(
    "Declined ",
    amountText,
    " at ",
    eventValue("MERCHANT_NAME"),
    ", ",
    eventValue("MERCHANT_CITY"),
    " (",
    eventValue("MERCHANT_COUNTRY_NAME"),
    ") — ",
    timeText,
  );

export const handler = (
  type:
    | "investec_card_before_transaction"
    | "investec_card_after_transaction"
    | "investec_card_after_decline",
  code: BlockState,
  x: number,
  y: number,
  note?: string,
): BlockState => ({
  type,
  x,
  y,
  inputs: { CODE: input(code) },
  // Setup notes show as a comment (?) icon on the handler.
  ...(note
    ? {
        icons: {
          comment: { text: note, pinned: false, height: 160, width: 320 },
        },
      }
    : {}),
});
