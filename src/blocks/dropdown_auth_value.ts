import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import { cardFields, cardFieldOptions, type CardField } from "./card_fields";
import { BEFORE_TRANSACTION, requireHandler } from "./context";
import type { Generators, ValueCode } from "./context";

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

export function installAuthValueBlock(generators: Generators = {}) {
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

const authorizationValueGenerator = function (block: Blockly.Block): ValueCode {
  const field = cardFields[block.getFieldValue("AUTH_VALUE") as CardField];
  return [`authorization.${field.path}`, Order.MEMBER];
};
