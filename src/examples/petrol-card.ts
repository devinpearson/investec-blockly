export const petrolCardExample = {
  blocks: {
    languageVersion: 0,
    blocks: [
      {
        type: "variables_set",
        id: "7U*BhS$x6opL#q0Q.:R+",
        x: 13,
        y: 37,
        fields: { VAR: { id: "hi{PuS#[z~[FUT}ivL7^" } },
        inputs: {
          VALUE: {
            block: {
              type: "lists_create_with",
              id: "ts3`o=~4TPYB?N!^F$OU",
              extraState: { itemCount: 4 },
              inputs: {
                ADD0: {
                  block: {
                    type: "investec_merchants",
                    id: "?,nAXSz@LHwEx)azA%_i",
                    fields: { MERCHANT: "5172" },
                  },
                },
                ADD1: {
                  block: {
                    type: "investec_merchants",
                    id: "X4b?[~C;_4TQVTrCN[d8",
                    fields: { MERCHANT: "5499" },
                  },
                },
                ADD2: {
                  block: {
                    type: "investec_merchants",
                    id: "N#k6:X@5]+gg@;r92Emj",
                    fields: { MERCHANT: "5541" },
                  },
                },
                ADD3: {
                  block: {
                    type: "investec_merchants",
                    id: "[oa2j$t|)j1CF~NF~is~",
                    fields: { MERCHANT: "5542" },
                  },
                },
              },
            },
          },
        },
      },
      {
        type: "investec_card_before_transaction",
        id: "kt[5b9)#_Q%BS]LT,5~?",
        x: 13,
        y: 162,
        inputs: {
          CODE: {
            block: {
              type: "controls_if",
              id: "PZL%[J{#{htVLK4ZX)We",
              inputs: {
                IF0: {
                  block: {
                    type: "logic_compare",
                    id: "M?QIj0HCVN~Hhv!,I.CD",
                    fields: { OP: "GT" },
                    inputs: {
                      A: {
                        block: {
                          type: "lists_indexOf",
                          id: ";bR-Mb[=eV;RysAl`Vaw",
                          fields: { END: "FIRST" },
                          inputs: {
                            VALUE: {
                              block: {
                                type: "variables_get",
                                id: ":9tV|+wQIL=QxdYrb#[W",
                                fields: { VAR: { id: "hi{PuS#[z~[FUT}ivL7^" } },
                              },
                            },
                            FIND: {
                              block: {
                                type: "investec_auth_value",
                                id: "R09t(K_X9Z=5ntnvGL:J",
                                fields: { AUTH_VALUE: "MCC" },
                              },
                            },
                          },
                        },
                      },
                      B: {
                        block: {
                          type: "math_number",
                          id: "/dwzBkbW7,dLO!9=T;s~",
                          fields: { NUM: 0 },
                        },
                      },
                    },
                  },
                },
                DO0: {
                  block: {
                    type: "investec_console_log",
                    id: "s7tIA:)OzIX11SxOn7KJ",
                    inputs: {
                      VALUE: {
                        block: {
                          type: "text",
                          id: "4zw{Vnw0)NDdZ~6Fmsa$",
                          fields: { TEXT: "Petrol Transaction" },
                        },
                      },
                    },
                    next: {
                      block: {
                        type: "investec_before_transaction_return",
                        id: "Z:5!UM=vYw6)u:5lRk=3",
                        fields: { VALUE: "APPROVE" },
                      },
                    },
                  },
                },
              },
              next: {
                block: {
                  type: "investec_console_log",
                  id: "(0vj!$;^riwIK;p?|tC:",
                  inputs: {
                    VALUE: {
                      block: {
                        type: "text",
                        id: "3$C@-e1lX}iz,Ui6=`0P",
                        fields: { TEXT: "Other Transaction" },
                      },
                    },
                  },
                  next: {
                    block: {
                      type: "investec_before_transaction_return",
                      id: "40]aL+cYi*J1!4z9hqqA",
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
  variables: [
    { name: "merchantCodes", id: "hi{PuS#[z~[FUT}ivL7^" },
    { name: "test", id: "CF8,|wW=,r+VI.eAXE7G" },
  ],
};
