import * as Blockly from "blockly/core";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators } from "./context";

export const investecCardBeforeTransactionBlock = {
  type: "investec_card_before_transaction",
  message0: "before transaction",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: 230,
  tooltip:
    "Runs before the card transaction is approved. Return approve or decline; " +
    "if nothing is returned the transaction is approved. Only one allowed.",
};

export function installBeforeTransactionBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecCardBeforeTransactionBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_before_transaction"] =
      beforeTransactionGenerator;
  }
}

const beforeTransactionGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const beforeTransaction = async (authorization) => {\n${valueCode}}\n`;
  return code;
};
