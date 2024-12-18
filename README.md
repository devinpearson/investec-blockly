# investec-blockly
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
A basic example of blockly with blocks created specifically for Investec programmable card.

Blocks available:
- `before transaction` - creates the beforeTransaction function
- `after transaction` - creates the afterTransaction function
- `after decline` - creates the afterDecline function
- `authorization` - the fields available from the authorization object
- `transaction` - the fields available from the transaction object
- `log` - creates a log statment
- `approve` - creates a return transaction for the beforeTransaction function
- `countries` - a list of countries
- `currency` - a list of currencies
- `merchants` - a list of merchants

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

You will need to run [investec-card-server](https://github.com/devinpearson/investec-card-server)
in order to run the project.

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