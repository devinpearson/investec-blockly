import * as Blockly from "blockly/core";
import { BEFORE_TRANSACTION, requireHandler } from "./context";
import type { Generators } from "./context";

export const investecBeforeTransactionReturnBlock = {
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
  tooltip:
    "Approves or declines the card transaction and stops the before " +
    "transaction code. If nothing is returned the transaction is approved.",
};

export function installBeforeTransactionReturnBlock(
  generators: Generators = {},
) {
  Blockly.defineBlocksWithJsonArray([investecBeforeTransactionReturnBlock]);
  requireHandler(
    "investec_before_transaction_return",
    [BEFORE_TRANSACTION],
    "Approve/decline only has an effect inside a before transaction block.",
  );
  if (generators.javascript) {
    generators.javascript.forBlock["investec_before_transaction_return"] =
      beforeTransactionReturnGenerator;
  }
}

const beforeTransactionReturnGenerator = function (block: Blockly.Block) {
  const approve = block.getFieldValue("VALUE") === "APPROVE";
  return `return ${approve};\n`;
};
