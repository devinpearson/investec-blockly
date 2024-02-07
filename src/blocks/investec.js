import { Order } from "blockly/javascript";

export const investecInit = {
  type: "investec_init",
  message0: "set client id %1",
  args0: [{ type: "input_value", name: "CLIENT_ID" }],
  message1: "client secret %1",
  args1: [{ type: "input_value", name: "CLIENT_SECRET" }],
  message2: "set api key %1",
  args2: [{ type: "input_value", name: "API_KEY" }],
  previousStatement: null,
  nextStatement: true,
  colour: 230,
};

export const investecCardBeforeTransaction = {
  type: "investec_card_before_transaction",
  message0: "before transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
};

export const investecCardAfterTransaction = {
  type: "investec_card_after_transaction",
  message0: "after transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
};

export const investecCardAfterDecline = {
  type: "investec_card_after_decline",
  message0: "after decline",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
};

export const investecAuthValue = {
  type: "investec_auth_value",
  message0: "authorization: %1",
  args0: [
    {
      type: "field_dropdown",
      name: "AUTH_VALUE",
      options: [
        ["account number", "ACCOUNT_NUMBER"],
        ["datetime", "DATETIME"],
        ["currency code", "CURRENCY_CODE"],
        ["reference", "REFERENCE"],
        ["cents amount", "CENTS_AMOUNT"],
        ["merchant code", "MCC"],
        ["merchant name", "MERCHANT_NAME"],
        ["merchant city", "MERCHANT_CITY"],
        ["merchant country", "MERCHANT_COUNTRY"],
      ],
    },
  ],
  output: null,
  colour: 230,
};

export const investecTransValue = {
  type: "investec_trans_value",
  message0: "transaction: %1",
  args0: [
    {
      type: "field_dropdown",
      name: "AUTH_VALUE",
      options: [
        ["account number", "ACCOUNT_NUMBER"],
        ["datetime", "DATETIME"],
        ["currency code", "CURRENCY_CODE"],
        ["reference", "REFERENCE"],
        ["cents amount", "CENTS_AMOUNT"],
        ["merchant code", "MCC"],
        ["merchant name", "MERCHANT_NAME"],
        ["merchant city", "MERCHANT_CITY"],
        ["merchant country", "MERCHANT_COUNTRY"],
      ],
    },
  ],
  output: null,
  colour: 230,
};

export const investecConsoleLog = {
  type: "investec_console_log",
  message0: "log %1",
  args0: [
    {
      type: "input_value",
      name: "VALUE",
      check: "String",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
};

export const investecBeforeTransactionReturn = {
  type: "investec_before_transaction_return",
  message0: "%1 transaction",
  args0: [
    {
      type: "field_dropdown",
      name: "VALUE",
      options: [
        ["approve", "APPROVE"],
        ["decline", "DECLINE"],
      ],
    },
  ],
  previousStatement: null,
  colour: 230,
};

export const investecCurrencies = {
  type: "investec_currencies",
  message0: "currency: %1",
  args0: [
    {
      type: "field_dropdown",
      name: "CURRENCY",
      options: [
        ["USD", "USD"],
        ["GBP", "GBP"],
        ["EUR", "EUR"],
        ["AUD", "AUD"],
        ["CAD", "CAD"],
        ["CHF", "CHF"],
        ["CNY", "CNY"],
        ["CZK", "CZK"],
        ["DKK", "DKK"],
        ["HKD", "HKD"],
        ["HUF", "HUF"],
        ["ILS", "ILS"],
        ["JPY", "JPY"],
        ["MXN", "MXN"],
        ["NOK", "NOK"],
        ["NZD", "NZD"],
        ["PLN", "PLN"],
        ["RUB", "RUB"],
        ["SEK", "SEK"],
        ["SGD", "SGD"],
        ["THB", "THB"],
        ["TRY", "TRY"],
        ["ZAR", "ZAR"],
      ],
    },
  ],
  output: String,
  colour: 230,
};

export const investecCardBeforeTransactionFn = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const beforeTransaction = async (authorization) => {\n${valueCode}\n}`;
  return code;
};

export const investecCardAfterTransactionFn = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterTransaction = async (transaction) => {\n${valueCode}\n}`;
  return code;
};

export const investecCardAfterDeclineFn = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterDecline = async (transaction) => {\n${valueCode}\n}`;
  return code;
};

export const investecAuthvalueFn = function (block) {
  var mode = block.getFieldValue("AUTH_VALUE");
  if (mode == "ACCOUNT_NUMBER") {
    return [`authorization.accountNumber`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "DATETIME") {
    return [`authorization.dateTime`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "CURRENCY_CODE") {
    return [`authorization.currencyCode`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "REFERENCE") {
    return [`authorization.reference`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "CENTS_AMOUNT") {
    return [`authorization.cents_amount`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MCC") {
    return [`authorization.merchant.category.code`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_NAME") {
    return [`authorization.merchant.name`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_CITY") {
    return [`authorization.merchant.city`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_COUNTRY") {
    return [`authorization.merchant.country.code`, Order.ATOMIC];
  }
};

export const investecTransValueFn = function (block) {
  var mode = block.getFieldValue("AUTH_VALUE");
  if (mode == "ACCOUNT_NUMBER") {
    return [`transaction.accountNumber`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "DATETIME") {
    return [`transaction.dateTime`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "CURRENCY_CODE") {
    return [`transaction.currencyCode`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "REFERENCE") {
    return [`transaction.reference`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "CENTS_AMOUNT") {
    return [`transaction.cents_amount`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MCC") {
    return [`transaction.merchant.category.code`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_NAME") {
    return [`transaction.merchant.name`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_CITY") {
    return [`transaction.merchant.city`, Order.ATOMIC]; // Simplified returns as well.
  } else if (mode == "MERCHANT_COUNTRY") {
    return [`transaction.merchant.country.code`, Order.ATOMIC];
  }
};

export const investecConsoleLogFn = function (block, generator) {
  const value = generator.valueToCode(block, "VALUE", Order.ATOMIC);
  return `console.log(${value})`; // Simplified returns as well.
};

export const investecBeforeTransactionReturnFn = function (block) {
  const value = block.getFieldValue("VALUE");
  console.log(value);
  if (value == "APPROVE") {
    return `return true`; // Simplified returns as well.
  } else {
    return `return false`; // Simplified returns as well.
  }
};
