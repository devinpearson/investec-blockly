import * as Blockly from "blockly/core";

export const investecCardBeforeTransactionBlock = {
  type: "investec_card_before_transaction",
  message0: "before transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
};

export function installBeforeTransactionBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecCardBeforeTransactionBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_before_transaction"] =
      beforeTransactionGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const beforeTransactionGenerator = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const beforeTransaction = async (authorization) => {\n${valueCode}\n}`;
  return code;
};
