import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import { cardFields, cardFieldOptions, type CardField } from "./card_fields";
import { AFTER_DECLINE, AFTER_TRANSACTION, requireHandler } from "./context";
import type { Generators, ValueCode } from "./context";
import { colours } from "./colours";

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
  colour: colours.data,
  tooltip:
    "A field from the transaction passed to afterTransaction / afterDecline.",
};

export function installTransBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecTransBlock]);
  requireHandler(
    "investec_trans_value",
    [AFTER_TRANSACTION, AFTER_DECLINE],
    "transaction is only available inside after transaction / after " +
      "decline. Use the authorization block in before transaction.",
  );
  if (generators.javascript) {
    generators.javascript.forBlock["investec_trans_value"] =
      transactionValueGenerator;
  }
}

const transactionValueGenerator = function (block: Blockly.Block): ValueCode {
  const field = cardFields[block.getFieldValue("AUTH_VALUE") as CardField];
  return [`transaction.${field.path}`, Order.MEMBER];
};
