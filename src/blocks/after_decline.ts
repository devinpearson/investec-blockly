import * as Blockly from "blockly/core";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators } from "./context";
import { colours } from "./colours";

export const investecAfterDeclineBlock = {
  type: "investec_card_after_decline",
  message0: "after decline",
  message1: "do %1",
  args1: [{ type: "input_statement", name: "CODE" }],
  colour: colours.handler,
  tooltip: "Runs after a transaction has been declined. Only one allowed.",
};

export function installAfterDeclineBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecAfterDeclineBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_card_after_decline"] =
      afterDeclineGenerator;
  }
}

const afterDeclineGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
) {
  const valueCode = generator.statementToCode(block, "CODE");
  const code = `const afterDecline = async (transaction) => {\n${valueCode}}\n`;
  return code;
};
