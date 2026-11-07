export const amountExample = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "investec_card_before_transaction",
        id: "y]q07rP7{zTvq`BoS^C#",
        x: 37,
        y: 37,
        inputs: {
          CODE: {
            block: {
              type: "controls_if",
              id: "WcT@o.V-4#cXn2NHp1he",
              inputs: {
                IF0: {
                  block: {
                    type: "logic_compare",
                    id: "J+Aw5V_wS;]pCw,A+9({",
                    fields: { OP: "LTE" },
                    inputs: {
                      A: {
                        block: {
                          type: "investec_auth_value",
                          id: "~H2z:rH;g~;:[F}L#;a1",
                          fields: { AUTH_VALUE: "CENTS_AMOUNT" },
                        },
                      },
                      B: {
                        block: {
                          type: "math_number",
                          id: "LzhZ[rIT0l4DW@:JuEB}",
                          fields: { NUM: 5000 },
                        },
                      },
                    },
                  },
                },
                DO0: {
                  block: {
                    type: "investec_console_log",
                    id: "haVk+@C{KpE^b~L8ul4Q",
                    inputs: {
                      VALUE: {
                        block: {
                          type: "text",
                          id: "M+anZdu;#1W5j)$2hRI#",
                          fields: { TEXT: "Amount below R50" },
                        },
                      },
                    },
                    next: {
                      block: {
                        type: "investec_before_transaction_return",
                        id: "wGf.td5.0#HSK7d?!r34",
                        fields: { VALUE: "APPROVE" },
                      },
                    },
                  },
                },
              },
              next: {
                block: {
                  type: "investec_console_log",
                  id: "$8}IpQqOE:SN3(2p1N[b",
                  inputs: {
                    VALUE: {
                      block: {
                        type: "text",
                        id: "9((,[E3b{RDC2NERIyN,",
                        fields: { TEXT: "Amount above R50" },
                      },
                    },
                  },
                  next: {
                    block: {
                      type: "investec_before_transaction_return",
                      id: "-e/D-vP?u-d.qz;.N^4,",
                      fields: { VALUE: "DECLINE" },
                    },
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
