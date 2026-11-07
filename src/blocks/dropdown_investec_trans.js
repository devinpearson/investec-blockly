import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import { cardFields, cardFieldOptions } from "./card_fields";

export const investecTransBlock = {
  type: "investec_trans_value",
  message0: "transaction: %1",
  args0: [
    {
      type: "field_dropdown",
      // Kept as AUTH_VALUE so previously saved workspaces still load.
      name: "AUTH_VALUE",
      options: cardFieldOptions,
    },
  ],
  output: null,
  colour: 230,
  tooltip:
    "A field from the transaction passed to afterTransaction / afterDecline.",
};

export function installTransBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecTransBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_trans_value"] =
      transactionValueGenerator;
  }
}

const transactionValueGenerator = function (block) {
  const field = cardFields[block.getFieldValue("AUTH_VALUE")];
  return [`transaction.${field.path}`, Order.MEMBER];
};
