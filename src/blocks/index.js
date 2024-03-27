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

import { installConsoleLogBlock } from "./console_log";
import { installTransBlock } from "./dropdown_investec_trans";
import { installAuthValueBlock } from "./dropdown_auth_value";
import { installAfterTransactionBlock } from "./after_transaction";
import { installBeforeTransactionBlock } from "./before_transaction";
import { installAfterDeclineBlock } from "./after_decline";
import { installBeforeTransactionReturnBlock } from "./before_transaction_return";
import { installCountriesBlock } from "./countries";
import { installMerchantBlock } from "./merchants";
import { installCurrenciesBlock } from "./currencies";

export {
  installConsoleLogBlock,
  installTransBlock,
  installAuthValueBlock,
  installAfterTransactionBlock,
  installBeforeTransactionBlock,
  installAfterDeclineBlock,
  installBeforeTransactionReturnBlock,
  installCountriesBlock,
  installMerchantBlock,
  installCurrenciesBlock,
};

// add blockly component to send telegram messages
// add blockly component to send slack messages
// add blockly component to call webhooks
// add blockly component to upload to google sheets
