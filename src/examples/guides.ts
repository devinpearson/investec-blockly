// Write-ups shown in the Guide tab for each example, keyed by example name.
// Keep them in step with the example workspaces: what the blocks do, what to
// set up, and transactions that show each outcome.
import type { Guide } from "./types";

const groceries = { merchantCode: "5411", merchantName: "Woolworths" };
const fuel = { merchantCode: "5542", merchantName: "Shell" };
const restaurant = { merchantCode: "5812", merchantName: "Ocean Basket" };

export const guides: Record<string, Guide> = {
  Default: {
    summary:
      "The smallest possible card program: it logs everything the card " +
      "sees — the whole authorization before the purchase and the whole " +
      "transaction after it. A good place to see which fields you can use.",
    steps: [
      "Before transaction logs the whole authorization: account, amount, " +
        "currency, time, card, and the merchant with its category and " +
        "country.",
      "It doesn't return approve or decline — and a before transaction " +
        "that returns nothing approves the purchase.",
      "Because the purchase is approved, after transaction runs and logs " +
        "the whole transaction, which has the same fields.",
    ],
    scenarios: [
      {
        label: "Any purchase",
        expect: "Approved; logs the authorization, then the transaction",
        transaction: { centsAmount: 1000, ...groceries },
      },
    ],
    notes: [
      'In Results, click a logged object to expand it. The "card event" ' +
        "block reads a single field, e.g. merchant name.",
    ],
  },

  "Petrol Card": {
    summary:
      "A fuel-only card: purchases at petrol stations are approved and " +
      "everything else is declined.",
    steps: [
      "A variable, merchantCodes, holds four merchant category codes " +
        "(MCCs): 5172 petroleum products, 5499 convenience stores (garage " +
        "shops), 5541 service stations and 5542 fuel dispensers.",
      "Before transaction looks for the purchase's MCC in that list.",
      'If it is there, it logs "Petrol Transaction" and approves; ' +
        'otherwise it logs "Other Transaction" and declines.',
    ],
    scenarios: [
      {
        label: "Fuel dispenser (5542)",
        expect: "Approved",
        transaction: { centsAmount: 65000, ...fuel },
      },
      {
        label: "Garage shop (5499)",
        expect: "Approved",
        transaction: {
          centsAmount: 4500,
          merchantCode: "5499",
          merchantName: "Engen Quickshop",
        },
      },
      {
        label: "Grocery store (5411)",
        expect: "Declined",
        transaction: { centsAmount: 25000, ...groceries },
      },
    ],
    notes: [
      'The Card category\'s "merchant category is fuel" block does the ' +
        "same check in one block.",
    ],
  },

  Amount: {
    summary:
      "A spending cap: purchases up to R50 are approved, larger ones declined.",
    steps: [
      "Before transaction compares the cents amount with 5000 (R50.00).",
      'At or below it, it logs "Amount below R50" and approves; above it, ' +
        'it logs "Amount above R50" and declines.',
    ],
    scenarios: [
      {
        label: "R45.00",
        expect: "Approved",
        transaction: { centsAmount: 4500, ...groceries },
      },
      {
        label: "Exactly R50.00",
        expect: "Approved (the check is ≤)",
        transaction: { centsAmount: 5000, ...groceries },
      },
      {
        label: "R120.00",
        expect: "Declined",
        transaction: { centsAmount: 12000, ...groceries },
      },
    ],
    notes: [
      'Amounts are in cents. The "amount is over R…" block lets you work ' +
        "in rands instead.",
    ],
  },

  "After Hours": {
    summary:
      "Declines purchases late at night — between 22:00 and 06:00 South " +
      "African time — and logs why.",
    steps: [
      "Before transaction checks whether the transaction time is between " +
        "22:00 and 06:00 SAST. The range crosses midnight.",
      "If it is, it logs a warning and declines; otherwise it approves.",
      "After decline logs the merchant name, so you can see what was stopped.",
    ],
    scenarios: [
      {
        label: "A purchase right now",
        expect: "Approved during the day, declined at night",
        transaction: { centsAmount: 15000, ...restaurant },
      },
    ],
    notes: [
      "The simulator stamps every transaction with the current time, so " +
        "the outcome depends on when you press Run. To see a decline during " +
        "the day, change the block's times so the range includes now.",
    ],
  },

  "Teen Card": {
    summary:
      "A card for a teenager: groceries and transport only, at most R300 a " +
      "purchase and nothing late at night — with a phone notification for " +
      "every purchase and every decline.",
    steps: [
      "Before transaction checks three rules in order, and the first one " +
        "that fails declines with its reason: the merchant must be in the " +
        "groceries or transport groups, the amount must be R300 or less, " +
        "and the time must not be between 21:00 and 06:00.",
      "If every rule passes, the purchase is approved.",
      'After transaction pushes "Spent R… at …" to your phone with ntfy.',
      'After decline pushes "Declined R… at …, city (country) — time".',
    ],
    setup: [
      {
        text: "Install the ntfy app on your phone.",
        link: { label: "ntfy.sh", url: "https://ntfy.sh" },
      },
      {
        text:
          "Subscribe to a topic with a long, hard-to-guess name, e.g. " +
          "card-alerts-7f3k9q.",
      },
      {
        text: "Set NTFY_TOPIC to that topic name under Environment variables.",
      },
    ],
    scenarios: [
      {
        label: "R250 at a grocery store",
        expect: "Approved, purchase pushed",
        transaction: { centsAmount: 25000, ...groceries },
      },
      {
        label: "R250 at a restaurant",
        expect: "Declined: only groceries and transport",
        transaction: { centsAmount: 25000, ...restaurant },
      },
      {
        label: "R500 at a grocery store",
        expect: "Declined: over R300",
        transaction: { centsAmount: 50000, ...groceries },
      },
    ],
    notes: [
      "ntfy topics are public: anyone who knows the name can read the " +
        "messages, so pick a name nobody would guess.",
      "Without NTFY_TOPIC the approve/decline decisions still work; " +
        "only the push step fails, and Results shows why.",
    ],
  },

  "Travel Mode": {
    summary:
      "Stops foreign purchases unless you've switched travel mode on, and " +
      "sends a Telegram alert when one is blocked — it may be fraud.",
    steps: [
      "Before transaction treats a purchase as foreign when the merchant is " +
        "outside South Africa or the currency isn't rand.",
      "A foreign purchase is declined unless the TRAVEL_MODE flag is on " +
        "(true, on, yes or 1). Local purchases are always approved.",
      "After decline: if the declined purchase was foreign, it sends a " +
        '"Possible fraud: Declined R… at …" message with your Telegram bot.',
    ],
    setup: [
      {
        text: "Create a Telegram bot with @BotFather and copy its token into TELEGRAM_BOT_TOKEN.",
        link: {
          label: "Telegram bot guide",
          url: "https://core.telegram.org/bots/tutorial",
        },
      },
      {
        text:
          "Send your bot a message, then open " +
          "https://api.telegram.org/bot<token>/getUpdates and copy the " +
          "chat id into TELEGRAM_CHAT_ID.",
      },
      { text: "Set TRAVEL_MODE to on before a trip and off when you're back." },
    ],
    scenarios: [
      {
        label: "US purchase, travel mode off",
        expect: "Declined, Telegram alert sent",
        transaction: {
          centsAmount: 4999,
          currencyCode: "usd",
          merchantCode: "5812",
          merchantName: "Joe's Diner",
          merchantCity: "New York",
          merchantCountry: "US",
        },
        env: { TRAVEL_MODE: "off" },
      },
      {
        label: "US purchase, travel mode on",
        expect: "Approved",
        transaction: {
          centsAmount: 4999,
          currencyCode: "usd",
          merchantCode: "5812",
          merchantName: "Joe's Diner",
          merchantCity: "New York",
          merchantCountry: "US",
        },
        env: { TRAVEL_MODE: "on" },
      },
      {
        label: "Local purchase",
        expect: "Approved, whatever the flag",
        transaction: {
          centsAmount: 25000,
          ...groceries,
          merchantCountry: "ZA",
        },
      },
    ],
  },

  "Expense Log (Airtable)": {
    summary:
      "An automatic expense log: every purchase and every decline becomes a " +
      "row in an Airtable table, ready for views, charts and filters.",
    steps: [
      "Before transaction approves everything — this example only records.",
      "After transaction adds a row with Date, Merchant, Category, City, " +
        "Country, Amount (in rands), Currency, Card and Status = Approved.",
      "After decline adds the same row with Status = Declined.",
      "Rows are sent with typecast on, so Airtable converts values to each " +
        "column's type.",
    ],
    setup: [
      {
        text:
          "Create a base with a table whose columns are named Date, " +
          "Merchant, Category, City, Country, Amount, Currency, Card and " +
          "Status. Text columns work for all of them; Amount can be a number.",
      },
      {
        text:
          "Create a personal access token with the data.records:write scope " +
          "and access to that base, and set it as AIRTABLE_TOKEN.",
        link: {
          label: "Airtable tokens",
          url: "https://airtable.com/create/tokens",
        },
      },
      {
        text:
          "Set AIRTABLE_BASE to the base ID — the part of the base's URL " +
          "that starts with app.",
      },
      { text: "Set AIRTABLE_TABLE to the table's name, e.g. Transactions." },
    ],
    scenarios: [
      {
        label: "R250 grocery purchase",
        expect: "Approved, row added with Status = Approved",
        transaction: { centsAmount: 25000, ...groceries },
      },
    ],
    notes: [
      "If Airtable rejects the row — a wrong token, base or column name — " +
        "Results shows a warning with the status code, e.g. 401 or 422.",
    ],
  },

  "Make.com Automation": {
    summary:
      "Sends every purchase and decline to a Make.com scenario, which can " +
      "pass it on to almost anything — Google Sheets, Notion, email, Slack " +
      "or your accounting software.",
    steps: [
      "There is no before transaction, so every purchase is approved.",
      "After transaction posts the purchase as JSON — Date, Merchant, " +
        "Category, City, Country, Amount, Currency, Card and Status = " +
        "approved — to MAKE_WEBHOOK_URL.",
      "After decline posts the same data with Status = declined.",
      "Make receives it and runs the rest of your scenario.",
    ],
    setup: [
      {
        text:
          "In Make, create a scenario that starts with Webhooks › Custom " +
          "webhook, and copy its URL into MAKE_WEBHOOK_URL.",
        link: {
          label: "Make webhooks",
          url: "https://www.make.com/en/help/tools/webhooks",
        },
      },
      {
        text:
          'Click "Run once" in Make, then run a purchase here, so Make learns ' +
          "the fields.",
      },
      {
        text:
          "Add the next modules, e.g. Google Sheets › Add a row, and a route " +
          "filtered on Amount > 1000 that posts to Slack.",
      },
    ],
    scenarios: [
      {
        label: "R1,250 fuel purchase",
        expect: "Approved, sent to Make",
        transaction: { centsAmount: 125000, ...fuel },
      },
    ],
    notes: [
      "Zapier's Webhooks by Zapier › Catch Hook works the same way: use its " +
        "URL instead.",
    ],
  },

  "Remote Kill Switch": {
    summary:
      "Lock the card from anywhere: before each purchase the card checks a " +
      'URL you control, and declines while it says {"locked": true}.',
    steps: [
      "Before transaction fetches STATUS_URL and reads its locked value.",
      'While locked is true it declines with "card locked remotely"; ' +
        "otherwise it approves.",
    ],
    setup: [
      {
        text:
          'Put a small JSON file online that contains {"locked": false} — ' +
          "for example a GitHub Gist (use its Raw URL), or a Make webhook " +
          "that answers with a Webhook response.",
      },
      { text: "Set STATUS_URL to that address." },
      {
        text:
          'To lock the card, change it to {"locked": true}; change it back ' +
          "to unlock.",
      },
    ],
    scenarios: [
      {
        label: "R80 coffee",
        expect: "Approved while unlocked, declined while locked",
        transaction: {
          centsAmount: 8000,
          merchantCode: "5814",
          merchantName: "Vida e Caffè",
        },
      },
    ],
    notes: [
      "Every purchase waits for this call, so keep the URL fast.",
      "If the call fails — no STATUS_URL, or the site is down — the " +
        "simulator declines the purchase. Decide whether that's what you " +
        "want on a real card.",
      "Gist raw URLs can be cached for a few minutes, so a change may not " +
        "take effect straight away.",
    ],
  },
};
