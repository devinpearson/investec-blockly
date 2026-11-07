import * as Blockly from "blockly/core";
import { Order } from "blockly/javascript";
import type { JavascriptGenerator } from "blockly/javascript";
import type { Generators, ValueCode } from "./context";

// The card runtime exposes environment variables on process.env. In the
// simulator they come from the Environment Variables section of the panel.
export const envBlock = {
  type: "investec_env",
  message0: "env %1",
  args0: [{ type: "field_input", name: "NAME", text: "API_KEY" }],
  output: null,
  colour: 290,
  tooltip:
    "An environment variable (process.env). Use these for secrets such as " +
    "webhook URLs and tokens so they are not saved in the blocks.",
};

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

const envGenerator = function (
  block: Blockly.Block,
  generator: JavascriptGenerator,
): ValueCode {
  const name = block.getFieldValue("NAME").trim();
  return IDENTIFIER.test(name)
    ? [`process.env.${name}`, Order.MEMBER]
    : [`process.env[${generator.quote_(name)}]`, Order.MEMBER];
};

export function installEnvBlock(generators: Generators = {}) {
  Blockly.defineBlocksWithJsonArray([envBlock]);
  if (generators.javascript) {
    generators.javascript.forBlock["investec_env"] = envGenerator;
  }
}
