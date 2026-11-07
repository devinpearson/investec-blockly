// Ready-made rules to drop into a handler and adjust. They are statements
// rather than whole handlers, because each handler can only be placed once.
import {
  airtableRecord,
  amountOver,
  and,
  declineIf,
  declinedMessage,
  env,
  envFlag,
  eventObject,
  isForeign,
  log,
  merchantGroup,
  nameContainsAny,
  not,
  ntfy,
  purchaseFields,
  rands,
  slack,
  spentMessage,
  telegram,
  timeBetween,
  webhook,
  whatsApp,
  type BlockState,
} from "../blockly/snippets";

const label = (text: string) => ({ kind: "label", text });
const block = (state: BlockState) => ({ kind: "block", ...state });

export const templates = {
  kind: "category",
  name: "Templates",
  colour: "#6366F1",
  contents: [
    label("Any handler: inspect"),
    label("Log the whole card event (authorization / transaction)"),
    block(log(eventObject)),

    label("Before transaction: decide"),
    label("Lock the card while CARD_LOCKED is on"),
    block(declineIf(envFlag("CARD_LOCKED"), "card is locked")),
    label("Fuel purchases only"),
    block(declineIf(not(merchantGroup("FUEL")), "not a fuel purchase")),
    label("Block gambling"),
    block(declineIf(merchantGroup("GAMBLING"), "gambling")),
    label("Foreign purchases only in TRAVEL_MODE"),
    block(
      declineIf(
        and(isForeign, not(envFlag("TRAVEL_MODE"))),
        "foreign purchase while travel mode is off",
      ),
    ),
    label("Online purchases only when ONLINE_ENABLED"),
    block(
      declineIf(
        and(merchantGroup("ONLINE"), not(envFlag("ONLINE_ENABLED"))),
        "online purchases are switched off",
      ),
    ),
    label("Allow-listed shops only"),
    block(
      declineIf(
        not(nameContainsAny("woolworths, checkers, pick n pay")),
        "shop is not on the allow-list",
      ),
    ),
    label("Block a shop"),
    block(declineIf(nameContainsAny("uber eats"), "blocked shop")),
    label("Restaurants: at most R500 a meal"),
    block(
      declineIf(
        and(merchantGroup("RESTAURANTS"), amountOver(500)),
        "restaurant spend over R500",
      ),
    ),
    label("No entertainment on weekdays"),
    block(
      declineIf(
        and(
          merchantGroup("ENTERTAINMENT"),
          not({ type: "investec_time_is_weekend", fields: { ZONE: "120" } }),
        ),
        "entertainment on a weekday",
      ),
    ),
    label("Decline after hours"),
    block(declineIf(timeBetween("22:00", "06:00"), "after hours")),
    label("Decline over a fixed limit"),
    block(declineIf(amountOver(1000), "over the limit")),
    label("Decline over MAX_SPEND (env)"),
    block(
      declineIf(
        {
          type: "logic_compare",
          fields: { OP: "GT" },
          inputs: {
            A: { block: rands },
            B: { block: env("MAX_SPEND", "NUMBER") },
          },
        },
        "over MAX_SPEND",
      ),
    ),

    label("After transaction: record & notify"),
    label("Add the purchase to Airtable"),
    block(airtableRecord(purchaseFields())),
    label("Send the purchase to Make.com / Zapier"),
    block(webhook("MAKE_WEBHOOK_URL", purchaseFields())),
    label("Phone push for every purchase (ntfy)"),
    block(ntfy(spentMessage())),
    label("WhatsApp message for every purchase (CallMeBot)"),
    block(whatsApp(spentMessage())),
    label("Slack message for every purchase"),
    block(slack(spentMessage())),

    label("After decline: alert"),
    label("Phone push when a purchase is declined"),
    block(ntfy(declinedMessage())),
    label("WhatsApp alert when a purchase is declined (CallMeBot)"),
    block(whatsApp(declinedMessage())),
    label("Telegram alert when a purchase is declined"),
    block(telegram(declinedMessage())),
  ],
};
