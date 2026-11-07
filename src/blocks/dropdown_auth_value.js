import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import { cardFields, cardFieldOptions } from "./card_fields";
import { BEFORE_TRANSACTION, requireHandler } from "./context";

export const investecAuthValueBlock = {
  type: "investec_auth_value",
  message0: "authorization: %1",
  args0: [
    {
      type: "field_dropdown",
      name: "AUTH_VALUE",
      options: cardFieldOptions,
    },
  ],
  output: null,
  colour: 230,
  tooltip: "A field from the authorization passed to beforeTransaction.",
};

export function installAuthValueBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecAuthValueBlock]);
  requireHandler(
    "investec_auth_value",
    [BEFORE_TRANSACTION],
    "authorization is only available inside a before transaction block. " +
      "Use the transaction block in after transaction / after decline.",
  );
  if (generators.javascript) {
    generators.javascript.forBlock["investec_auth_value"] =
      authorizationValueGenerator;
  }
}

const authorizationValueGenerator = function (block) {
  const field = cardFields[block.getFieldValue("AUTH_VALUE")];
  return [`authorization.${field.path}`, Order.MEMBER];
};
