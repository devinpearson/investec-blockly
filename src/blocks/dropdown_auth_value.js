import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";

export const investecAuthValueBlock = {
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

export function installAuthValueBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecAuthValueBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_auth_value"] =
      authorizationValueGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const authorizationValueGenerator = function (block) {
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
    return [`authorization.centsAmount`, Order.ATOMIC]; // Simplified returns as well.
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
