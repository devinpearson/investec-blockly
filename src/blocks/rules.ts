import * as Blockly from "blockly/core";
import { Order, type JavascriptGenerator } from "blockly/javascript";
import {
  BEFORE_TRANSACTION,
  HANDLER_TYPES,
  eventParamOf,
  requireHandler,
  type Generators,
  type ValueCode,
} from "./context";

// Building blocks for approve/decline rules.
const PLACEMENT_WARNING =
  "Use this inside a before/after transaction or after decline block.";
const IDENTIFIER = /^[A-Za-z_$][\w$]*$/;

export const declineWithReasonBlock = {
  type: "investec_decline_with_reason",
  message0: "decline because %1",
  args0: [{ type: "input_value", name: "REASON" }],
  previousStatement: null,
  colour: 230,
  tooltip:
    "Logs the reason as a warning and declines the transaction. Ends the " +
    "before transaction code.",
};

export const nameContainsAnyBlock = {
  type: "investec_merchant_name_contains_any",
  message0: "merchant name contains any of %1",
  args0: [
    {
      type: "field_input",
      name: "NAMES",
      text: "woolworths, checkers",
      spellcheck: false,
    },
  ],
  output: "Boolean",
  colour: 230,
  tooltip:
    "True when the merchant name contains any of these comma-separated " +
    "words. Not case-sensitive.",
};

export const isForeignBlock = {
  type: "investec_is_foreign",
  message0: "is a foreign transaction",
  output: "Boolean",
  colour: 230,
  tooltip:
    "True when the merchant is outside South Africa or the currency is not " +
    "rand.",
};

export const envFlagBlock = {
  type: "investec_env_flag",
  message0: "env flag %1 is on",
  args0: [{ type: "field_input", name: "NAME", text: "CARD_LOCKED" }],
  output: "Boolean",
  colour: 290,
  tooltip:
    "True when the environment variable is true, on, yes or 1. Flip it in " +
    "Environment variables without editing the blocks.",
};

const ruleBlocks = [
  declineWithReasonBlock,
  nameContainsAnyBlock,
  isForeignBlock,
  envFlagBlock,
];

/** Comma-separated words from a field, trimmed, lower-cased, no blanks. */
export function parseNames(text: string): string[] {
  return text
    .split(",")
    .map((name) => name.trim().toLowerCase())
    .filter(Boolean);
}

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => string | ValueCode
> = {
  investec_decline_with_reason(block, generator) {
    const reason =
      generator.valueToCode(block, "REASON", Order.NONE) || "'Declined'";
    return `console.warn(${reason});\nreturn false;\n`;
  },
  investec_merchant_name_contains_any(block, generator) {
    const containsAny = generator.provideFunction_(
      "nameContainsAny",
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(name, words) {
  const lower = String(name || '').toLowerCase();
  return words.some((word) => lower.includes(word));
}`,
    );
    const names = JSON.stringify(parseNames(block.getFieldValue("NAMES")));
    return [
      `${containsAny}(${eventParamOf(block)}.merchant.name, ${names})`,
      Order.FUNCTION_CALL,
    ];
  },
  investec_is_foreign(block) {
    const event = eventParamOf(block);
    return [
      `(${event}.merchant.country.code !== 'ZA' || ${event}.currencyCode !== 'zar')`,
      Order.ATOMIC,
    ];
  },
  investec_env_flag(block, generator) {
    const isOn = generator.provideFunction_(
      "envFlagIsOn",
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(value) {
  return ['true', 'on', 'yes', '1'].includes(String(value || '').trim().toLowerCase());
}`,
    );
    const name = block.getFieldValue("NAME").trim();
    const variable = IDENTIFIER.test(name)
      ? `process.env.${name}`
      : `process.env[${generator.quote_(name)}]`;
    return [`${isOn}(${variable})`, Order.FUNCTION_CALL];
  },
};

export function installRuleBlocks(generatorsByLanguage: Generators = {}) {
  Blockly.defineBlocksWithJsonArray(ruleBlocks);
  requireHandler(
    declineWithReasonBlock.type,
    [BEFORE_TRANSACTION],
    "Decline only has an effect inside a before transaction block.",
  );
  for (const type of [nameContainsAnyBlock.type, isForeignBlock.type]) {
    requireHandler(type, HANDLER_TYPES, PLACEMENT_WARNING);
  }
  for (const { type } of ruleBlocks) {
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
