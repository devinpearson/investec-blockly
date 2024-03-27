import * as Blockly from "blockly/core";

export const investecCardAfterTransactionBlock = {
  type: "investec_card_after_transaction",
  message0: "after transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
};

export function installAfterTransactionBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecCardAfterTransactionBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_after_transaction"] =
      afterTransactionGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const afterTransactionGenerator = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterTransaction = async (transaction) => {\n${valueCode}\n}`;
  return code;
};
