import * as Blockly from "blockly/core";
import { Order, type JavascriptGenerator } from "blockly/javascript";
import { cardFieldOptions, cardFields, type CardField } from "./card_fields";
import {
  HANDLER_TYPES,
  eventParamOf,
  requireHandler,
  type Generators,
  type ValueCode,
} from "./context";
import {
  describeRanges,
  merchantGroupOptions,
  merchantGroups,
  type MerchantGroupKey,
} from "./merchant_groups";

// Blocks that read the card event. They resolve to `authorization` in before
// transaction and `transaction` in the after handlers, so one block works in
// every handler.
const PLACEMENT_WARNING =
  "Use this inside a before/after transaction or after decline block.";

const COMPARISONS = {
  GT: { label: "over", op: ">" },
  GTE: { label: "at least", op: ">=" },
  LT: { label: "under", op: "<" },
  LTE: { label: "at most", op: "<=" },
} as const;

export const eventValueBlock = {
  type: "investec_event_value",
  message0: "card event: %1",
  args0: [{ type: "field_dropdown", name: "FIELD", options: cardFieldOptions }],
  output: null,
  colour: 230,
  tooltip:
    "A field of the card event — the authorization in before transaction, " +
    "the transaction in after transaction / after decline.",
};

export const amountRandsBlock = {
  type: "investec_amount_rands",
  message0: "amount in rands",
  output: "Number",
  colour: 230,
  tooltip: "The transaction amount in rands (cents ÷ 100), e.g. 12.5.",
};

export const amountCompareBlock = {
  type: "investec_amount_compare",
  message0: "amount is %1 R %2",
  args0: [
    {
      type: "field_dropdown",
      name: "OP",
      options: Object.entries(COMPARISONS).map(([value, { label }]) => [
        label,
        value,
      ]),
    },
    {
      type: "field_number",
      name: "RANDS",
      value: 500,
      min: 0,
      precision: 0.01,
    },
  ],
  output: "Boolean",
  colour: 230,
  tooltip: "Compares the transaction amount with a rand value.",
};

export const merchantGroupBlock = {
  type: "investec_merchant_group",
  message0: "merchant category is %1",
  args0: [
    { type: "field_dropdown", name: "GROUP", options: merchantGroupOptions },
  ],
  output: "Boolean",
  colour: 230,
  extensions: ["investec_merchant_group_tooltip"],
};

const cardBlocks = [
  eventValueBlock,
  amountRandsBlock,
  amountCompareBlock,
  merchantGroupBlock,
];

function provideInRanges(generator: JavascriptGenerator): string {
  return generator.provideFunction_(
    "inMerchantGroup",
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(code, ranges) {
  const mcc = Number(code);
  return ranges.some(([from, to]) => mcc >= from && mcc <= to);
}`,
  );
}

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => ValueCode
> = {
  investec_event_value(block) {
    const field = cardFields[block.getFieldValue("FIELD") as CardField];
    return [`${eventParamOf(block)}.${field.path}`, Order.MEMBER];
  },
  investec_amount_rands(block) {
    return [`${eventParamOf(block)}.centsAmount / 100`, Order.DIVISION];
  },
  investec_amount_compare(block) {
    const comparison =
      COMPARISONS[block.getFieldValue("OP") as keyof typeof COMPARISONS] ??
      COMPARISONS.GT;
    // Compare in cents to avoid floating-point surprises.
    const cents = Math.round(Number(block.getFieldValue("RANDS")) * 100);
    return [
      `${eventParamOf(block)}.centsAmount ${comparison.op} ${cents}`,
      Order.RELATIONAL,
    ];
  },
  investec_merchant_group(block, generator) {
    const group =
      merchantGroups[block.getFieldValue("GROUP") as MerchantGroupKey] ??
      merchantGroups.FUEL;
    const inMerchantGroup = provideInRanges(generator);
    return [
      `${inMerchantGroup}(${eventParamOf(block)}.merchant.category.code, ${JSON.stringify(group.ranges)})`,
      Order.FUNCTION_CALL,
    ];
  },
};

export function installCardBlocks(generatorsByLanguage: Generators = {}) {
  if (!Blockly.Extensions.isRegistered("investec_merchant_group_tooltip")) {
    Blockly.Extensions.register(
      "investec_merchant_group_tooltip",
      function (this: Blockly.Block) {
        // Show the codes behind the selected group.
        this.setTooltip(() => {
          const group =
            merchantGroups[this.getFieldValue("GROUP") as MerchantGroupKey];
          return group
            ? `True when the merchant category code (MCC) is one of: ${describeRanges(group.ranges)}.`
            : "";
        });
      },
    );
  }
  Blockly.defineBlocksWithJsonArray(cardBlocks);
  for (const { type } of cardBlocks) {
    requireHandler(type, HANDLER_TYPES, PLACEMENT_WARNING);
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
