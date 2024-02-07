/**
 * @license
 * Copyright 2023 Devin Pearson
 * SPDX-License-Identifier: MIT
 */

/**
 * @fileoverview Define custom blocks.
 * @author devin@blackhat.co.za
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import * as Blockly from "blockly/core";
import { javascriptGenerator } from "blockly/javascript";
import {
  investecInit,
  investecCardBeforeTransaction,
  investecCardAfterTransaction,
  investecCardAfterDecline,
  investecAuthValue,
  investecTransValue,
  investecConsoleLog,
  investecBeforeTransactionReturn,
  investecCurrencies,
  investecCardBeforeTransactionFn,
  investecCardAfterTransactionFn,
  investecCardAfterDeclineFn,
  investecAuthvalueFn,
  investecTransValueFn,
  investecConsoleLogFn,
  investecBeforeTransactionReturnFn,
} from "./investec";

Blockly.defineBlocksWithJsonArray([
  investecInit,
  investecCardBeforeTransaction,
  investecCardAfterTransaction,
  investecCardAfterDecline,
  investecAuthValue,
  investecTransValue,
  investecConsoleLog,
  investecBeforeTransactionReturn,
  investecCurrencies,
]);

// not building out the code for this block yet
// javascriptGenerator.forBlock["investec_init"] = function (block, generator) {
//   const clientId = generator.valueToCode(block, "CLIENT_ID", Order.ATOMIC);
//   const clientSecret = generator.valueToCode(
//     block,
//     "CLIENT_SECRET",
//     Order.ATOMIC
//   );
//   const apiKey = generator.valueToCode(block, "API_KEY", Order.ATOMIC);
//   const code = `const clientId = ${clientId}\n const clientSecret = ${clientSecret}\n const apiKey = ${apiKey}\n const investec = new Investec(clientId, clientSecret, apiKey)`;
//   return code;
// };

javascriptGenerator.forBlock["investec_card_before_transaction"] =
  investecCardBeforeTransactionFn;
javascriptGenerator.forBlock["investec_card_after_transaction"] =
  investecCardAfterTransactionFn;
javascriptGenerator.forBlock["investec_card_after_decline"] =
  investecCardAfterDeclineFn;
javascriptGenerator.forBlock["investec_auth_value"] = investecAuthvalueFn;
javascriptGenerator.forBlock["investec_trans_value"] = investecTransValueFn;
javascriptGenerator.forBlock["investec_console_log"] = investecConsoleLogFn;
javascriptGenerator.forBlock["investec_before_transaction_return"] =
  investecBeforeTransactionReturnFn;
