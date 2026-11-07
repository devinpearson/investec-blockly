export const defaultExample = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "investec_card_before_transaction",
        id: "%zGd+r/wKHb_4eW(/9Y]",
        x: 162,
        y: 38,
        inputs: {
          CODE: {
            block: {
              type: "investec_console_log",
              id: "(=!jmngKtkqe_sk=(@r:",
              inputs: {
                VALUE: {
                  block: {
                    type: "investec_auth_value",
                    id: "gtDT%ilM8e]7k=jU9df%",
                    fields: { AUTH_VALUE: "CENTS_AMOUNT" },
                  },
                },
              },
            },
          },
        },
      },
      {
        type: "investec_card_after_transaction",
        id: ".WWyBGtTI!LH{Sp;HByv",
        x: 163,
        y: 138,
        inputs: {
          CODE: {
            block: {
              type: "investec_console_log",
              id: "ex,}Vl)hWy-%:S!@*,^/",
              inputs: {
                VALUE: {
                  block: {
                    type: "investec_trans_value",
                    id: "D2]Aiql?S`c-wV#zF(!%",
                    fields: { AUTH_VALUE: "MERCHANT_NAME" },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};
