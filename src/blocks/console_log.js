import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";

export const investecConsoleLogBlock = {
  type: "investec_console_log",
  message0: "log %1",
  args0: [
    {
      type: "input_value",
      // No type check: logging numbers (e.g. cents amount) is common.
      name: "VALUE",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
};

export function installConsoleLogBlock(generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecConsoleLogBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_console_log"] =
      consoleLogGenerator;
    // generators.javascript.addReservedWords("specialReservedWord");
  }
}

const consoleLogGenerator = function (block, generator) {
  const value = generator.valueToCode(block, "VALUE", Order.NONE) || "''";
  return `console.log(${value});\n`;
};
