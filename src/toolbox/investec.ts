const text = (value: string) => ({
  shadow: { type: "text", fields: { TEXT: value } },
});

// The card handlers and the blocks that read the card event.
// investec_auth_value / investec_trans_value are still defined so older
// workspaces load, but the single card event block replaces them here.
export const investec = {
  kind: "category",
  name: "Card",
  colour: "#5C81A6",
  contents: [
    { kind: "block", type: "investec_card_before_transaction" },
    { kind: "block", type: "investec_card_after_transaction" },
    { kind: "block", type: "investec_card_after_decline" },
    { kind: "block", type: "investec_before_transaction_return" },
    {
      kind: "block",
      type: "investec_console_log",
      inputs: { VALUE: text("hello") },
    },
    { kind: "sep" },
    { kind: "block", type: "investec_event_value" },
    { kind: "block", type: "investec_amount_compare" },
    { kind: "block", type: "investec_amount_rands" },
    { kind: "block", type: "investec_merchant_group" },
    { kind: "sep" },
    { kind: "block", type: "investec_currencies" },
    { kind: "block", type: "investec_merchants" },
    { kind: "block", type: "investec_countries" },
  ],
};
