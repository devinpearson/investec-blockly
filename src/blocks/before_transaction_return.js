import * as Blockly from "blockly/core";

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
};

export function installBeforeTransactionReturnBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecBeforeTransactionReturnBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_before_transaction_return"] =
      beforeTransactionReturnGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const beforeTransactionReturnGenerator = function (block) {
  const value = block.getFieldValue("VALUE");
  if (value == "APPROVE") {
    return `return true`; // Simplified returns as well.
  } else {
    return `return false`; // Simplified returns as well.
  }
};
