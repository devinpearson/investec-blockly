# investec-blockly
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A basic example of blockly with blocks created specifically for Investec programmable card.
Built with React, TypeScript and Vite.

Card:
- `before transaction` - creates the beforeTransaction function
- `after transaction` - creates the afterTransaction function
- `after decline` - creates the afterDecline function
- `approve` / `decline` - the return value of beforeTransaction
- `log` - creates a log statement at info, warning or error level
- `card event` - a field of the authorization / transaction (amount, merchant,
  category, country, card ID, ...), whichever handler it is in
- `amount is over / under R…` and `amount in rands`
- `merchant category is` - a group of merchant category codes, e.g. fuel,
  groceries, gambling or travel (hover the block to see the codes)
- `countries`, `currency`, `merchants` - lists of codes

Templates: ready-made rules to drop into a handler — fuel only, block
gambling, decline after hours, decline over a limit or over `MAX_SPEND`, a
Slack message and a webhook post for each purchase.

HTTP (uses `fetch`, only inside the before/after/decline blocks):
- `send request` - calls a URL with an optional body and headers; text bodies
  are sent as-is, anything else as JSON
- `response` - calls a URL and returns the response as JSON or text
- `bearer token` - headers with `Authorization: Bearer <token>`
- `whole card event` - the full authorization/transaction object
- `create object` / `key : value` - an object, e.g. a JSON body or headers
- `get … from` - a property of an object, such as a JSON response
- `send Slack message` - posts to a Slack incoming webhook
- `send Telegram message` - sends a message from a Telegram bot
- `env … as text / number` - reads an environment variable (`process.env`);
  set values in the Environment Variables section of the simulator panel

Date & Time (uses `moment`, in SAST or UTC):
- `transaction hour / minute / day of week / ...` - part of the transaction time
- `transaction is on a weekend` and `transaction is on a <day>`
- `transaction time is between` - a time range, which may cross midnight

The older `authorization:` and `transaction:` blocks still load in saved
workspaces; `card event` replaces both.

The before transaction, after transaction and after decline blocks can each be
used once per workspace.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

You will need to run [investec-card-server](https://github.com/devinpearson/investec-card-server)
in order to run the project. It is expected at `http://localhost:3010`; to use a
different address, set `VITE_SIMULATOR_URL` in a `.env.local` file:

```sh
VITE_SIMULATOR_URL=http://localhost:3010
```

### Compile and Hot-Reload for Development

```sh
npm run start
```

### Compile and Minify for Production

```sh
npm run build
```

### Type-check, lint and format

```sh
npm run typecheck
npm run lint
npm run format
```
