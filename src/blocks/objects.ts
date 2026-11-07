import * as Blockly from "blockly/core";
import { Order, type JavascriptGenerator } from "blockly/javascript";
import {
  addPlacementWarning,
  type Generators,
  type ValueCode,
} from "./context";

// Plain JavaScript objects, for request bodies and headers and for reading
// JSON responses. Blockly's built-in blocks have no object support.
const OBJECT = "investec_object";
const ENTRY = "investec_object_entry";
const ENTRY_CHECK = "ObjectEntry";

export const objectBlock = {
  type: OBJECT,
  message0: "create object %1",
  args0: [{ type: "input_dummy" }],
  message1: "%1",
  args1: [{ type: "input_statement", name: "ENTRIES", check: ENTRY_CHECK }],
  output: null,
  colour: 20,
  tooltip:
    "An object built from key/value entries, e.g. a JSON request body or " +
    "request headers.",
};

export const objectEntryBlock = {
  type: ENTRY,
  message0: "%1 : %2",
  args0: [
    { type: "field_input", name: "KEY", text: "key" },
    { type: "input_value", name: "VALUE" },
  ],
  previousStatement: ENTRY_CHECK,
  nextStatement: ENTRY_CHECK,
  colour: 20,
  tooltip: "One key and value of a create object block.",
};

export const objectGetBlock = {
  type: "investec_object_get",
  message0: "get %1 from %2",
  args0: [
    { type: "field_input", name: "KEY", text: "key" },
    { type: "input_value", name: "OBJECT" },
  ],
  inputsInline: true,
  output: null,
  colour: 20,
  tooltip:
    "A property of an object, such as a JSON response. Empty if the object " +
    "or property is missing. Chain blocks to read nested values.",
};

const objectBlocks = [objectBlock, objectEntryBlock, objectGetBlock];

const insideObject = (block: Blockly.Block) =>
  block.getSurroundParent()?.type === OBJECT;

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => string | ValueCode
> = {
  [OBJECT](block, generator) {
    const entries = generator.statementToCode(block, "ENTRIES");
    return [entries ? `{\n${entries}}` : "{}", Order.ATOMIC];
  },
  [ENTRY](block, generator) {
    // Entries only make sense inside an object; elsewhere they'd be a
    // syntax error, so they generate nothing.
    if (!insideObject(block)) return "";
    const key = generator.quote_(block.getFieldValue("KEY"));
    const value =
      generator.valueToCode(block, "VALUE", Order.COMMA) || "undefined";
    return `${key}: ${value},\n`;
  },
  investec_object_get(block, generator) {
    const object =
      generator.valueToCode(block, "OBJECT", Order.MEMBER) || "undefined";
    const key = generator.quote_(block.getFieldValue("KEY"));
    return [`${object}?.[${key}]`, Order.MEMBER];
  },
};

export function installObjectBlocks(generatorsByLanguage: Generators = {}) {
  Blockly.defineBlocksWithJsonArray(objectBlocks);
  addPlacementWarning(
    ENTRY,
    insideObject,
    "Put entries inside a create object block.",
  );
  for (const { type } of objectBlocks) {
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
