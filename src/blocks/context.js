import * as Blockly from "blockly/core";

// Handler (hat) blocks and the name of the parameter each handler receives.
export const BEFORE_TRANSACTION = "investec_card_before_transaction";
export const AFTER_TRANSACTION = "investec_card_after_transaction";
export const AFTER_DECLINE = "investec_card_after_decline";

export const handlerParams = {
  [BEFORE_TRANSACTION]: "authorization",
  [AFTER_TRANSACTION]: "transaction",
  [AFTER_DECLINE]: "transaction",
};
export const HANDLER_TYPES = Object.keys(handlerParams);

/** The handler block this block sits inside, or null. */
export function handlerOf(block) {
  const root = block.getRootBlock();
  return HANDLER_TYPES.includes(root.type) ? root : null;
}

/**
 * The variable holding the card event in the block's handler: `authorization`
 * in beforeTransaction, `transaction` in afterTransaction / afterDecline.
 */
export function eventParamOf(block) {
  const handler = handlerOf(block);
  return handler ? handlerParams[handler.type] : "authorization";
}

/**
 * Adds an onchange check to a block type that shows `message` as a warning
 * whenever `isValid(block)` is false.
 */
export function addPlacementWarning(type, isValid, message) {
  const definition = Blockly.Blocks[type];
  definition.onchange = function () {
    if (!this.workspace || this.isInFlyout || this.isDeadOrDying?.()) return;
    this.setWarningText(isValid(this) ? null : message);
  };
}

/** Warn when the block is not inside one of the given handler types. */
export function requireHandler(type, handlerTypes, message) {
  addPlacementWarning(
    type,
    (block) => handlerTypes.includes(handlerOf(block)?.type),
    message,
  );
}
