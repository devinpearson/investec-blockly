import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators, ValueCode } from "./context";
import { colours } from "./colours";

// The card runtime exposes environment variables on process.env. In the
// simulator they come from the Environment Variables section of the panel.
export const envBlock = {
  type: "investec_env",
  message0: "env %1 as %2",
  args0: [
    { type: "field_input", name: "NAME", text: "API_KEY" },
    // Added later; older saves without it read as text.
    {
      type: "field_dropdown",
      name: "AS",
      options: [
        ["text", "TEXT"],
        ["number", "NUMBER"],
      ],
    },
  ],
  output: null,
  colour: colours.env,
  tooltip:
    "An environment variable (process.env). Use these for secrets such as " +
    "webhook URLs and tokens so they are not saved in the blocks. Values " +
    "are text; choose number for limits such as MAX_SPEND.",
};

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

const envGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
): ValueCode {
  const name = block.getFieldValue("NAME").trim();
  const variable = IDENTIFIER.test(name)
    ? `process.env.${name}`
    : `process.env[${generator.quote_(name)}]`;
  return block.getFieldValue("AS") === "NUMBER"
    ? [`Number(${variable})`, Order.FUNCTION_CALL]
    : [variable, Order.MEMBER];
};

export function installEnvBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([envBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_env"] = envGenerator;
  }
}
