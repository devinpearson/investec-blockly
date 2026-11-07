import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators } from "./context";

const LEVELS = { INFO: "log", WARN: "warn", ERROR: "error" } as const;

export const investecConsoleLogBlock = {
  type: "investec_console_log",
  message0: "log %1 %2",
  args0: [
    // Added after the VALUE input; workspaces saved without it default to info.
    {
      type: "field_dropdown",
      name: "LEVEL",
      options: [
        ["info", "INFO"],
        ["warning", "WARN"],
        ["error", "ERROR"],
      ],
    },
    // No type check: logging numbers (e.g. cents amount) is common.
    {
      type: "input_value",
      name: "VALUE",
    },
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 230,
  tooltip:
    "Writes a message to the card's logs at the chosen level (console.log, " +
    "console.warn or console.error).",
};

export function installConsoleLogBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([investecConsoleLogBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_console_log"] =
      consoleLogGenerator;
  }
}

const consoleLogGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
) {
  const method =
    LEVELS[block.getFieldValue("LEVEL") as keyof typeof LEVELS] ?? "log";
  const value = generator.valueToCode(block, "VALUE", Order.NONE) || "''";
  return `console.${method}(${value});\n`;
};
