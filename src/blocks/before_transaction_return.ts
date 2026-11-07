import * as Blockly from "blockly/core";
import { BEFORE_TRANSACTION, requireHandler } from "./context";
import type { Generators } from "./context";
import { colours } from "./colours";

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
  colour: colours.approve,
  extensions: ["investec_decision_colour"],
  tooltip:
    "Approves or declines the card transaction and stops the before " +
    "transaction code. If nothing is returned the transaction is approved.",
};

export function installBeforeTransactionReturnBlock(
  generators: Generators = {},
) {
  if (!Blockly.Extensions.isRegistered("investec_decision_colour")) {
    // Green for approve, red for decline, following the dropdown.
    Blockly.Extensions.register(
      "investec_decision_colour",
      function (this: Blockly.Block) {
        const colourFor = (value: string) =>
          value === "DECLINE" ? colours.decline : colours.approve;
        this.setColour(colourFor(this.getFieldValue("VALUE")));
        this.getField("VALUE")?.setValidator((value: string) => {
          this.setColour(colourFor(value));
          return value;
        });
      },
    );
  }
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
