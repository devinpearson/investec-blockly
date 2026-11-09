import * as Blockly from "blockly/core";
import type { JavascriptGenerator } from "blockly/javascript";

/** Code generators each install function registers its blocks with. */
export type Generators = { javascript?: JavascriptGenerator };

/** Return value of a value block's generator: code and operator precedence. */
export type ValueCode = [string, number];

// Handler (hat) blocks and the name of the parameter each handler receives.
export const BEFORE_TRANSACTION = "investec_card_before_transaction";
export const AFTER_TRANSACTION = "investec_card_after_transaction";
export const AFTER_DECLINE = "investec_card_after_decline";

export const handlerParams: Record<string, string> = {
  [BEFORE_TRANSACTION]: "authorization",
  [AFTER_TRANSACTION]: "transaction",
  [AFTER_DECLINE]: "transaction",
};
export const HANDLER_TYPES = Object.keys(handlerParams);

/** The handler block this block sits inside, or null. */
export function handlerOf(block: Blockly.Block): Blockly.Block | null {
  const root = block.getRootBlock();
  return HANDLER_TYPES.includes(root.type) ? root : null;
}

/**
 * The variable holding the card event in the block's handler: `authorization`
 * in beforeTransaction, `transaction` in afterTransaction / afterDecline.
 */
export function eventParamOf(block: Blockly.Block): string {
  const handler = handlerOf(block);
  return (handler && handlerParams[handler.type]) ?? "authorization";
}

/**
 * Adds an onchange check to a block type that shows `message` as a warning
 * whenever `isValid(block)` is false.
 */
/** A rule about where a block may go, checked by addPlacementWarning. */
export type PlacementRule = {
  isValid: (block: Blockly.Block) => boolean;
  message: string;
};

/**
 * Every placement rule by block type, so tools without a rendered workspace
 * (the MCP server, the skill reference) can check and describe them too.
 */
export const placementRules = new Map<string, PlacementRule>();

export function addPlacementWarning(
  type: string,
  isValid: (block: Blockly.Block) => boolean,
  message: string,
): void {
  placementRules.set(type, { isValid, message });
  const definition = Blockly.Blocks[type];
  if (!definition) throw new Error(`Block type ${type} is not defined`);
  definition.onchange = function (this: Blockly.BlockSvg) {
    if (!this.workspace || this.isInFlyout || this.isDeadOrDying()) return;
    this.setWarningText(isValid(this) ? null : message);
  };
}

/** Warn when the block is not inside one of the given handler types. */
export function requireHandler(
  type: string,
  handlerTypes: string[],
  message: string,
): void {
  addPlacementWarning(
    type,
    (block) => handlerTypes.includes(handlerOf(block)?.type ?? ""),
    message,
  );
}
