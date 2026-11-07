const text = (value: string) => ({
  shadow: { type: "text", fields: { TEXT: value } },
});
const env = (name: string) => ({
  block: { type: "investec_env", fields: { NAME: name } },
});
const entry = (key: string, value: object, next?: object) => ({
  block: {
    type: "investec_object_entry",
    fields: { KEY: key },
    inputs: { VALUE: value },
    ...(next ? { next } : {}),
  },
});
const eventValue = (field: string) => ({
  block: { type: "investec_event_value", fields: { FIELD: field } },
});

export const http = {
  kind: "category",
  name: "HTTP",
  colour: "#A6745C",
  contents: [
    {
      kind: "block",
      type: "investec_http_request",
      inputs: {
        URL: text("https://"),
        BODY: { block: { type: "investec_event_object" } },
      },
    },
    {
      kind: "block",
      type: "investec_http_response",
      inputs: { URL: text("https://") },
    },
    {
      kind: "block",
      type: "investec_bearer_auth",
      inputs: { TOKEN: env("API_TOKEN") },
    },
    { kind: "block", type: "investec_event_object" },
    { kind: "sep" },
    {
      kind: "block",
      type: "investec_object",
      inputs: {
        ENTRIES: entry(
          "merchant",
          eventValue("MERCHANT_NAME"),
          entry("amount", { block: { type: "investec_amount_rands" } }),
        ),
      },
    },
    {
      kind: "block",
      type: "investec_object_entry",
      inputs: { VALUE: text("value") },
    },
    { kind: "block", type: "investec_object_get" },
    { kind: "sep" },
    {
      kind: "block",
      type: "investec_webhook_send",
      inputs: {
        URL: env("MAKE_WEBHOOK_URL"),
        DATA: { block: { type: "investec_event_object" } },
      },
    },
    {
      kind: "block",
      type: "investec_airtable_add_record",
      inputs: {
        BASE: env("AIRTABLE_BASE"),
        TABLE: text("Transactions"),
        TOKEN: env("AIRTABLE_TOKEN"),
      },
    },
    {
      kind: "block",
      type: "investec_ntfy_push",
      inputs: { MESSAGE: text("Card used"), TOPIC: env("NTFY_TOPIC") },
    },
    {
      kind: "block",
      type: "investec_slack_message",
      inputs: { TEXT: text("Card transaction"), URL: env("SLACK_WEBHOOK_URL") },
    },
    {
      kind: "block",
      type: "investec_telegram_message",
      inputs: {
        TEXT: text("Card transaction"),
        TOKEN: env("TELEGRAM_BOT_TOKEN"),
        CHAT_ID: env("TELEGRAM_CHAT_ID"),
      },
    },
    { kind: "sep" },
    { kind: "block", type: "investec_env" },
    { kind: "block", type: "investec_env_flag" },
  ],
};
