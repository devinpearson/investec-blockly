import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";

export const investecTransBlock = {
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

export function installTransBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecTransBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_trans_value"] =
      transactionValueGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const transactionValueGenerator = function (block) {
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
    return [`transaction.centsAmount`, Order.ATOMIC]; // Simplified returns as well.
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
