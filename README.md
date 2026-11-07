# investec-blockly
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A basic example of blockly with blocks created specifically for Investec programmable card.

Blocks available:
- `before transaction` - creates the beforeTransaction function
- `after transaction` - creates the afterTransaction function
- `after decline` - creates the afterDecline function
- `authorization` - the fields available from the authorization object
- `transaction` - the fields available from the transaction object
- `log` - creates a log statement at info, warning or error level
- `approve` - creates a return transaction for the beforeTransaction function
- `countries` - a list of countries
- `currency` - a list of currencies
- `merchants` - a list of merchants

HTTP (uses `fetch`, only inside the before/after/decline blocks):
- `send request` - calls a URL; text bodies are sent as-is, anything else as JSON
- `response` - calls a URL and returns the response as JSON or text
- `whole card event` - the full authorization/transaction object, e.g. as a webhook body
- `send Slack message` - posts to a Slack incoming webhook
- `send Telegram message` - sends a message from a Telegram bot
- `env` - reads an environment variable (`process.env`); set values in the
  Environment Variables section of the simulator panel

Date & Time (uses `moment`, in SAST or UTC):
- `transaction hour / minute / day of week / ...` - part of the transaction time
- `transaction is on a weekend`
- `transaction time is between` - a time range, which may cross midnight

The before transaction, after transaction and after decline blocks can each be
used once per workspace.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

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

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```