import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";

export const investecConsoleLogBlock = {
  type: "investec_console_log",
  message0: "log %1",
  args0: [
    {
      type: "input_value",
      name: "VALUE",
      check: "String",
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
  const value = generator.valueToCode(block, "VALUE", Order.ATOMIC);
  return `console.log(${value})\n`; // Simplified returns as well.
};
