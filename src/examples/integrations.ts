// Example workspaces for real-time rules and after-purchase integrations.
// Each lists the environment variables it needs; opening it adds those names
// to the Environment variables panel.
import {
  airtableRecord,
  and,
  approve,
  chain,
  declineIf,
  declinedMessage,
  envFlag,
  env,
  handler,
  ifThen,
  isForeign,
  join,
  merchantGroup,
  not,
  ntfy,
  or,
  purchaseFields,
  spentMessage,
  telegram,
  text,
  timeBetween,
  amountOver,
  webhook,
  type BlockState,
} from "../blockly/snippets";
import type { Example } from "./types";

const workspace = (...blocks: BlockState[]) => ({
  blocks: { languageVersion: 0, blocks },
});

export const teenCardExample: Example = {
  env: ["NTFY_TOPIC"],
  state: workspace(
    handler(
      "investec_card_before_transaction",
      chain(
        declineIf(
          not(or(merchantGroup("GROCERIES"), merchantGroup("TRANSPORT"))),
          "only groceries and transport",
        ),
        declineIf(amountOver(300), "over R300"),
        declineIf(timeBetween("21:00", "06:00"), "after 21:00"),
        approve,
      ),
      40,
      40,
      "Teen card: groceries and transport only, at most R300, nothing " +
        "between 21:00 and 06:00.\n\nSet NTFY_TOPIC to a private topic name " +
        "and subscribe to it in the ntfy app to get a push for every " +
        "purchase and decline.",
    ),
    handler("investec_card_after_transaction", ntfy(spentMessage()), 40, 330),
    handler("investec_card_after_decline", ntfy(declinedMessage()), 40, 530),
  ),
};

export const travelModeExample: Example = {
  env: ["TRAVEL_MODE", "TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID"],
  state: workspace(
    handler(
      "investec_card_before_transaction",
      chain(
        declineIf(
          and(isForeign, not(envFlag("TRAVEL_MODE"))),
          "foreign purchase while travel mode is off",
        ),
        approve,
      ),
      40,
      40,
      "Travel mode: foreign purchases are declined unless TRAVEL_MODE is " +
        "on (true, on, yes or 1). Switch it on before a trip.\n\nA declined " +
        "foreign purchase sends a Telegram alert — it may be fraud. Create " +
        "a bot with @BotFather for TELEGRAM_BOT_TOKEN.",
    ),
    handler(
      "investec_card_after_decline",
      ifThen(isForeign, telegram(join("Possible fraud: ", declinedMessage()))),
      40,
      250,
    ),
  ),
};

export const airtableLogExample: Example = {
  env: ["AIRTABLE_TOKEN", "AIRTABLE_BASE", "AIRTABLE_TABLE"],
  state: workspace(
    handler("investec_card_before_transaction", approve, 40, 40),
    handler(
      "investec_card_after_transaction",
      airtableRecord(purchaseFields([["Status", text("Approved")]])),
      40,
      150,
      "Expense log: every purchase and decline becomes a row in Airtable.\n\n" +
        "Create a table with columns Date, Merchant, Category, City, " +
        "Country, Amount, Currency, Card and Status. AIRTABLE_BASE is the " +
        "app… ID from the base URL; AIRTABLE_TOKEN is a personal access " +
        "token with data.records:write.",
    ),
    handler(
      "investec_card_after_decline",
      airtableRecord(purchaseFields([["Status", text("Declined")]])),
      40,
      640,
    ),
  ),
};

export const makeAutomationExample: Example = {
  env: ["MAKE_WEBHOOK_URL"],
  state: workspace(
    handler(
      "investec_card_after_transaction",
      webhook(
        "MAKE_WEBHOOK_URL",
        purchaseFields([["Status", text("approved")]]),
      ),
      40,
      40,
      "Make.com: every purchase is posted to a Make webhook.\n\nIn Make, " +
        "start a scenario with Webhooks › Custom webhook and copy its URL " +
        "into MAKE_WEBHOOK_URL. Then add, for example, Google Sheets › Add " +
        "a row, and a filtered route (Amount > 1000) to Slack. Zapier's " +
        "Catch Hook works the same way.",
    ),
    handler(
      "investec_card_after_decline",
      webhook(
        "MAKE_WEBHOOK_URL",
        purchaseFields([["Status", text("declined")]]),
      ),
      40,
      420,
    ),
  ),
};

/** get "locked" from (response JSON of GET <STATUS_URL>) */
const remoteLocked: BlockState = {
  type: "investec_object_get",
  fields: { KEY: "locked" },
  inputs: {
    OBJECT: {
      block: {
        type: "investec_http_response",
        fields: { FORMAT: "json", METHOD: "GET" },
        inputs: { URL: { block: env("STATUS_URL") } },
      },
    },
  },
};

export const killSwitchExample: Example = {
  env: ["STATUS_URL"],
  state: workspace(
    handler(
      "investec_card_before_transaction",
      chain(declineIf(remoteLocked, "card locked remotely"), approve),
      40,
      40,
      "Remote kill switch: before each purchase the card fetches " +
        'STATUS_URL and declines while it returns {"locked": true}.\n\n' +
        "STATUS_URL can be a raw GitHub Gist, an Airtable record or a Make " +
        "webhook with a Webhook response. Every purchase waits for this " +
        "call, and if it fails the simulator declines the purchase.",
    ),
  ),
};
