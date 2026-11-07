// Ready-made rules to drop into a handler and adjust. They are statements
// rather than whole handlers, because each handler can only be placed once.
type BlockJson = Record<string, unknown>;

const text = (value: string): BlockJson => ({
  block: { type: "text", fields: { TEXT: value } },
});
const env = (name: string, as: "TEXT" | "NUMBER" = "TEXT"): BlockJson => ({
  block: { type: "investec_env", fields: { NAME: name, AS: as } },
});
const eventValue = (field: string): BlockJson => ({
  block: { type: "investec_event_value", fields: { FIELD: field } },
});
const rands: BlockJson = { block: { type: "investec_amount_rands" } };

/** if <condition>: log a warning, then decline. */
const declineIf = (condition: BlockJson, reason: string) => ({
  kind: "block",
  type: "controls_if",
  inputs: {
    IF0: condition,
    DO0: {
      block: {
        type: "investec_console_log",
        fields: { LEVEL: "WARN" },
        inputs: { VALUE: text(`Declined: ${reason}`) },
        next: {
          block: {
            type: "investec_before_transaction_return",
            fields: { VALUE: "DECLINE" },
          },
        },
      },
    },
  },
});

const merchantGroup = (group: string): BlockJson => ({
  block: { type: "investec_merchant_group", fields: { GROUP: group } },
});

const label = (text: string) => ({ kind: "label", text });

export const templates = {
  kind: "category",
  name: "Templates",
  colour: "#6366F1",
  contents: [
    label("Before transaction rules"),
    label("Fuel purchases only"),
    declineIf(
      {
        block: {
          type: "logic_negate",
          inputs: { BOOL: merchantGroup("FUEL") },
        },
      },
      "not a fuel purchase",
    ),
    label("Block gambling"),
    declineIf(merchantGroup("GAMBLING"), "gambling"),
    label("Decline after hours"),
    declineIf(
      {
        block: {
          type: "investec_time_between",
          fields: { START: "22:00", END: "06:00", ZONE: "120" },
        },
      },
      "after hours",
    ),
    label("Decline over a fixed limit"),
    declineIf(
      {
        block: {
          type: "investec_amount_compare",
          fields: { OP: "GT", RANDS: 1000 },
        },
      },
      "over the limit",
    ),
    label("Decline over MAX_SPEND (env)"),
    declineIf(
      {
        block: {
          type: "logic_compare",
          fields: { OP: "GT" },
          inputs: { A: rands, B: env("MAX_SPEND", "NUMBER") },
        },
      },
      "over MAX_SPEND",
    ),

    label("After transaction notifications"),
    label("Slack message for every purchase"),
    {
      kind: "block",
      type: "investec_slack_message",
      inputs: {
        TEXT: {
          block: {
            type: "text_join",
            extraState: { itemCount: 4 },
            inputs: {
              ADD0: text("Spent R"),
              ADD1: rands,
              ADD2: text(" at "),
              ADD3: eventValue("MERCHANT_NAME"),
            },
          },
        },
        URL: env("SLACK_WEBHOOK_URL"),
      },
    },
    label("Post the purchase to a webhook"),
    {
      kind: "block",
      type: "investec_http_request",
      fields: { METHOD: "POST" },
      inputs: {
        URL: env("WEBHOOK_URL"),
        BODY: {
          block: {
            type: "investec_object",
            inputs: {
              ENTRIES: {
                block: {
                  type: "investec_object_entry",
                  fields: { KEY: "merchant" },
                  inputs: { VALUE: eventValue("MERCHANT_NAME") },
                  next: {
                    block: {
                      type: "investec_object_entry",
                      fields: { KEY: "category" },
                      inputs: { VALUE: eventValue("MERCHANT_CATEGORY_NAME") },
                      next: {
                        block: {
                          type: "investec_object_entry",
                          fields: { KEY: "rands" },
                          inputs: { VALUE: rands },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
};
