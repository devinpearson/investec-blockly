const text = (value) => ({ shadow: { type: "text", fields: { TEXT: value } } });
const env = (name) => ({
  block: { type: "investec_env", fields: { NAME: name } },
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
    { kind: "block", type: "investec_event_object" },
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
  ],
};
