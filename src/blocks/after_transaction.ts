import * as Blockly from "blockly/core";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators } from "./context";

export const investecCardAfterTransactionBlock = {
  type: "investec_card_after_transaction",
  message0: "after transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
  tooltip: "Runs after a transaction has been approved. Only one allowed.",
};

export function installAfterTransactionBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecCardAfterTransactionBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_after_transaction"] =
      afterTransactionGenerator;
  }
}

const afterTransactionGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterTransaction = async (transaction) => {\n${valueCode}}\n`;
  return code;
};
