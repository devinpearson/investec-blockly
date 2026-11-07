import * as Blockly from "blockly/core";
import { Order, type JavascriptGenerator } from "blockly/javascript";
import {
  HANDLER_TYPES,
  eventParamOf,
  requireHandler,
  type Generators,
  type ValueCode,
} from "./context";

// The card runtime provides `fetch`. Its response exposes ok, status,
// json() and text(). Requests must run inside a handler because the code is
// `await`ed, and Blockly's own function blocks generate non-async functions.
const ASYNC_WARNING =
  "Use this inside a before/after transaction or after decline block " +
  "(not inside a function block).";

const METHODS = [
  ["POST", "POST"],
  ["GET", "GET"],
  ["PUT", "PUT"],
  ["PATCH", "PATCH"],
  ["DELETE", "DELETE"],
];

export const httpRequestBlock = {
  type: "investec_http_request",
  message0: "send %1 request to %2",
  args0: [
    { type: "field_dropdown", name: "METHOD", options: METHODS },
    { type: "input_value", name: "URL", check: "String" },
  ],
  message1: "with body %1",
  args1: [{ type: "input_value", name: "BODY" }],
  // Optional; added after the first release, so older saves load without it.
  message2: "with headers %1",
  args2: [{ type: "input_value", name: "HEADERS" }],
  inputsInline: false,
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Calls a URL with fetch. Text bodies are sent as-is; anything else is " +
    "sent as JSON. Headers take an object, e.g. from the bearer token or " +
    "create object block. Logs a warning if the response is not OK.",
};

export const httpResponseBlock = {
  type: "investec_http_response",
  message0: "response %1 of %2 request to %3",
  args0: [
    {
      type: "field_dropdown",
      name: "FORMAT",
      options: [
        ["JSON", "json"],
        ["text", "text"],
      ],
    },
    // GET first: fetching data is the usual reason to read a response.
    {
      type: "field_dropdown",
      name: "METHOD",
      options: [METHODS[1], METHODS[0], ...METHODS.slice(2)],
    },
    { type: "input_value", name: "URL", check: "String" },
  ],
  message1: "with body %1",
  args1: [{ type: "input_value", name: "BODY" }],
  // Optional; added after the first release, so older saves load without it.
  message2: "with headers %1",
  args2: [{ type: "input_value", name: "HEADERS" }],
  inputsInline: false,
  output: null,
  colour: 20,
  tooltip: "Calls a URL with fetch and returns the response body.",
};

export const eventObjectBlock = {
  type: "investec_event_object",
  message0: "whole card event",
  output: null,
  colour: 20,
  tooltip:
    "The full authorization (before transaction) or transaction object — " +
    "useful as a webhook body.",
};

export const slackMessageBlock = {
  type: "investec_slack_message",
  message0: "send Slack message %1",
  args0: [{ type: "input_value", name: "TEXT" }],
  message1: "to webhook URL %1",
  args1: [{ type: "input_value", name: "URL", check: "String" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Posts a message to a Slack incoming webhook. Keep the webhook URL in " +
    "an environment variable.",
  helpUrl: "https://api.slack.com/messaging/webhooks",
};

export const telegramMessageBlock = {
  type: "investec_telegram_message",
  message0: "send Telegram message %1",
  args0: [{ type: "input_value", name: "TEXT" }],
  message1: "with bot token %1",
  args1: [{ type: "input_value", name: "TOKEN", check: "String" }],
  message2: "to chat ID %1",
  args2: [{ type: "input_value", name: "CHAT_ID" }],
  previousStatement: null,
  nextStatement: null,
  colour: 20,
  tooltip:
    "Sends a message from a Telegram bot. Keep the bot token in an " +
    "environment variable.",
  helpUrl: "https://core.telegram.org/bots/api#sendmessage",
};

export const bearerAuthBlock = {
  type: "investec_bearer_auth",
  message0: "bearer token %1",
  args0: [{ type: "input_value", name: "TOKEN", check: "String" }],
  output: null,
  colour: 20,
  tooltip:
    "Headers with Authorization: Bearer <token>, for the request blocks' " +
    "headers input. Keep the token in an environment variable.",
};

const httpBlocks = [
  httpRequestBlock,
  httpResponseBlock,
  eventObjectBlock,
  slackMessageBlock,
  telegramMessageBlock,
  bearerAuthBlock,
];

function provideSendRequest(generator: JavascriptGenerator): string {
  return generator.provideFunction_(
    "sendRequest",
    `async function ${generator.FUNCTION_NAME_PLACEHOLDER_}(method, url, body, headers) {
  const options = { method, headers: { ...(headers || {}) } };
  if (body !== undefined && body !== null && method !== 'GET') {
    const isText = typeof body === 'string';
    options.headers['Content-Type'] = isText ? 'text/plain' : 'application/json';
    options.body = isText ? body : JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    console.warn(method + ' ' + url + ' returned ' + response.status);
  }
  return response;
}`,
  );
}

const value = (
  generator: JavascriptGenerator,
  block: Blockly.Block,
  name: string,
  fallback = "undefined",
) => generator.valueToCode(block, name, Order.COMMA) || fallback;

const generators: Record<
  string,
  (block: Blockly.Block, generator: JavascriptGenerator) => string | ValueCode
> = {
  investec_http_request(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const method = generator.quote_(block.getFieldValue("METHOD"));
    const url = value(generator, block, "URL", "''");
    const body = value(generator, block, "BODY");
    const headers = value(generator, block, "HEADERS");
    return `await ${sendRequest}(${method}, ${url}, ${body}, ${headers});\n`;
  },
  investec_http_response(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const method = generator.quote_(block.getFieldValue("METHOD"));
    const format = block.getFieldValue("FORMAT");
    const url = value(generator, block, "URL", "''");
    const body = value(generator, block, "BODY");
    const headers = value(generator, block, "HEADERS");
    return [
      `await (await ${sendRequest}(${method}, ${url}, ${body}, ${headers})).${format}()`,
      Order.AWAIT,
    ];
  },
  investec_bearer_auth(block, generator) {
    const token = generator.valueToCode(block, "TOKEN", Order.ADDITION) || "''";
    return [`{ Authorization: 'Bearer ' + ${token} }`, Order.ATOMIC];
  },
  investec_event_object(block) {
    return [eventParamOf(block), Order.ATOMIC];
  },
  investec_slack_message(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const url = value(generator, block, "URL", "''");
    const text = value(generator, block, "TEXT", "''");
    return `await ${sendRequest}('POST', ${url}, { text: String(${text}) });\n`;
  },
  investec_telegram_message(block, generator) {
    const sendRequest = provideSendRequest(generator);
    const token = generator.valueToCode(block, "TOKEN", Order.ADDITION) || "''";
    const chatId = value(generator, block, "CHAT_ID", "''");
    const text = value(generator, block, "TEXT", "''");
    return (
      `await ${sendRequest}('POST', 'https://api.telegram.org/bot' + ${token} + '/sendMessage', ` +
      `{ chat_id: ${chatId}, text: String(${text}) });\n`
    );
  },
};

export function installHttpBlocks(generatorsByLanguage: Generators = {}) {
  Blockly.defineBlocksWithJsonArray(httpBlocks);
  for (const { type } of httpBlocks) {
    // The bearer block is a plain value and can be used anywhere.
    if (type !== bearerAuthBlock.type) {
      requireHandler(type, HANDLER_TYPES, ASYNC_WARNING);
    }
    if (generatorsByLanguage.javascript) {
      generatorsByLanguage.javascript.forBlock[type] = generators[type]!;
    }
  }
}
