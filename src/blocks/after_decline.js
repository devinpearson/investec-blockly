import * as Blockly from "blockly/core";

export const investecAfterDeclineBlock = {
  type: "investec_card_after_decline",
  message0: "after decline",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
  tooltip: "Runs after a transaction has been declined. Only one allowed.",
};

export function installAfterDeclineBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecAfterDeclineBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_after_decline"] =
      afterDeclineGenerator;
  }
}

const afterDeclineGenerator = function (block, generator) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterDecline = async (transaction) => {\n${valueCode}}\n`;
  return code;
};
