// import * as Blockly from "blockly/core";
// import { Order } from "blockly/javascript";

export const investecInitBlock = {
  type: "investec_init",
  message0: "set client id %1",
  args0: [{ type: "input_value", name: "CLIENT_ID" }],
  message1: "client secret %1",
  args1: [{ type: "input_value", name: "CLIENT_SECRET" }],
  message2: "set api key %1",
  args2: [{ type: "input_value", name: "API_KEY" }],
  previousStatement: null,
  nextStatement: true,
  colour: 230,
};

// export function installConsoleLogBlock(generators = {}) {
//   Blockly.defineBlocksWithJsonArray([investecInitBlock]);
//   if (generators.javascript) {
//     generators.javascript.forBlock["investec_init"] =
//       investecConsoleLogFn;
// generators.javascript.addReservedWords("specialReservedWord");
//   }
// }

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
