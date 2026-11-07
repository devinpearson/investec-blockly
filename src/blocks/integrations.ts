import * as Blockly from "blockly/core";
import { Order, type JavascriptGenerator } from "blockly/javascript";
import {
  HANDLER_TYPES,
  eventParamOf,
  requireHandler,
  type Generators,
  type ValueCode,
} from "./context";
import { provideSendRequest } from "./http";

// Services to send purchases to. All requests go through sendRequest, which
// logs a warning when a service answers with an error status.
const ASYNC_WARNING =
  "Use this inside a before/after transaction or after decline block " +
  "(not inside a function block).";

export const airtableRecordBlock = {
  type: "investec_airtable_add_record",
  message0: "add Airtable record",
  message1: "base ID %1",
  args1: [{ type: "input_value", name: "BASE", check: "String" }],
  message2: "table %1",
  args2: [{ type: "input_value", name: "TABLE", check: "String" }],
  message3: "fields %1",
  args3: [{ type: "input_value", name: "FIELDS" }],
  message4: "token %1",
  args4: [{ type: "input_value", name: "TOKEN", check: "String" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Adds a row to an Airtable table. Fields is an object whose keys match " +
    "the column names; values are converted to the column types. Use a " +
    "personal access token with the data.records:write scope.",
  helpUrl: "https://airtable.com/developers/web/api/create-records",
};

export const webhookBlock = {
  type: "investec_webhook_send",
  message0: "send to webhook %1",
  args0: [{ type: "input_value", name: "URL", check: "String" }],
  message1: "data %1",
  args1: [{ type: "input_value", name: "DATA" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Posts data as JSON to a Make.com, Zapier or other webhook URL, which " +
    "can pass it on to Sheets, Notion, email and more.",
};

export const ntfyBlock = {
  type: "investec_ntfy_push",
  message0: "push %1 to phone",
  args0: [{ type: "input_value", name: "MESSAGE" }],
  message1: "ntfy topic %1",
  args1: [{ type: "input_value", name: "TOPIC", check: "String" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Sends a push notification with ntfy.sh: install the ntfy app and " +
    "subscribe to the same topic. A full URL works for a self-hosted server.",
  helpUrl: "https://docs.ntfy.sh/publish/",
};

export const whatsAppBlock = {
  type: "investec_whatsapp_callmebot",
  message0: "send WhatsApp message %1",
  args0: [{ type: "input_value", name: "MESSAGE" }],
  message1: "to phone %1",
  args1: [{ type: "input_value", name: "PHONE", check: "String" }],
  message2: "CallMeBot API key %1",
  args2: [{ type: "input_value", name: "API_KEY", check: "String" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Sends a WhatsApp message to your own number with CallMeBot, a free " +
    "third-party service that is not provided or endorsed by WhatsApp. " +
    "For personal notifications only. Message their bot once to get an API " +
    "key. Phone is in international format, e.g. +27821234567.",
  helpUrl: "https://www.callmebot.com/blog/free-api-whatsapp-messages/",
};

export const formatAmountBlock = {
  type: "investec_format_amount",
  message0: "amount as text",
  output: "String",
  colour: 230,
  tooltip:
    "The amount for messages, e.g. R1,234.50 (or 12.00 USD for other " +
    "currencies).",
};

const integrationBlocks = [
  airtableRecordBlock,
  webhookBlock,
  ntfyBlock,
  whatsAppBlock,
  formatAmountBlock,
];

const value = (
  generator: JavascriptGenerator,
  block: Blockly.Block,
  name: string,
  fallback: string,
) => generator.valueToCode(block, name, Order.COMMA) || fallback;

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => string | ValueCode
> = {
  investec_airtable_add_record(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const base = value(generator, block, "BASE", "''");
    const table = value(generator, block, "TABLE", "''");
    const fields = value(generator, block, "FIELDS", "{}");
    const token = value(generator, block, "TOKEN", "''");
    return (
      `await ${sendRequest}('POST', ` +
      `'https://api.airtable.com/v0/' + encodeURIComponent(${base}) + '/' + encodeURIComponent(${table}), ` +
      `{ records: [{ fields: ${fields} }], typecast: true }, ` +
      `{ Authorization: 'Bearer ' + ${token} });\n`
    );
  },
  investec_webhook_send(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const url = value(generator, block, "URL", "''");
    const data = value(generator, block, "DATA", "{}");
    // Strings are wrapped so the webhook always receives JSON.
    return `await ${sendRequest}('POST', ${url}, typeof (${data}) === 'string' ? { text: ${data} } : ${data});\n`;
  },
  investec_ntfy_push(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const ntfyUrl = generator.provideFunction_(
      "ntfyUrl",
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(topic) {
  const value = String(topic || '').trim();
  return /^https?:\\/\\//.test(value) ? value : 'https://ntfy.sh/' + encodeURIComponent(value);
}`,
    );
    const message = value(generator, block, "MESSAGE", "''");
    const topic = value(generator, block, "TOPIC", "''");
    return `await ${sendRequest}('POST', ${ntfyUrl}(${topic}), String(${message}));\n`;
  },
  investec_whatsapp_callmebot(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const message = value(generator, block, "MESSAGE", "''");
    const phone = value(generator, block, "PHONE", "''");
    const apiKey = value(generator, block, "API_KEY", "''");
    // CallMeBot takes everything in the query string, so each part is encoded.
    return (
      `await ${sendRequest}('GET', 'https://api.callmebot.com/whatsapp.php` +
      `?phone=' + encodeURIComponent(${phone}) + ` +
      `'&text=' + encodeURIComponent(String(${message})) + ` +
      `'&apikey=' + encodeURIComponent(${apiKey}));\n`
    );
  },
  investec_format_amount(block, generator) {
    const formatAmount = generator.provideFunction_(
      "formatAmount",
      `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(cents, currency) {
  const amount = (cents / 100).toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  return currency === 'zar' ? 'R' + amount : amount + ' ' + String(currency).toUpperCase();
}`,
    );
    const event = eventParamOf(block);
    return [
      `${formatAmount}(${event}.centsAmount, ${event}.currencyCode)`,
      Order.FUNCTION_CALL,
    ];
  },
};

export function installIntegrationBlocks(
  generatorsByLanguage: Generators = {},
) {
  Blockly.defineBlocksWithJsonArray(integrationBlocks);
  for (const { type } of integrationBlocks) {
    requireHandler(
      type,
      HANDLER_TYPES,
      type === formatAmountBlock.type
        ? "Use this inside a before/after transaction or after decline block."
        : ASYNC_WARNING,
    );
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
