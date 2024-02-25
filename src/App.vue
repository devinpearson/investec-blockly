<script setup>
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Main Vue component that includes the Blockly component.
 * @author dcoodien@google.com (Dylan Coodien)
 */
import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";

import "./blocks";
import {
  InvestecToolbox,
  LogicToolbox,
  LoopsToolbox,
  MathToolbox,
  TextToolbox,
  ListsToolbox,
  VariablesToolbox,
  FunctionsToolbox,
} from "./toolbox";
import { javascriptGenerator } from "blockly/javascript";
import {
  installConsoleLogBlock,
  installTransBlock,
  installAuthValueBlock,
  installAfterTransactionBlock,
  installBeforeTransactionBlock,
  installAfterDeclineBlock,
  installBeforeTransactionReturnBlock,
  installCountriesBlock,
  installCurrenciesBlock,
  installMerchantBlock,
} from "./blocks";

installConsoleLogBlock({ javascript: javascriptGenerator });
installTransBlock({ javascript: javascriptGenerator });
installAuthValueBlock({ javascript: javascriptGenerator });
installAfterTransactionBlock({ javascript: javascriptGenerator });
installBeforeTransactionBlock({ javascript: javascriptGenerator });
installAfterDeclineBlock({ javascript: javascriptGenerator });
installBeforeTransactionReturnBlock({ javascript: javascriptGenerator });
installCountriesBlock({ javascript: javascriptGenerator });
installCurrenciesBlock({ javascript: javascriptGenerator });
installMerchantBlock({ javascript: javascriptGenerator });

import * as Blockly from "blockly/core";
const foo = ref();
const code = ref();
const outputRef = ref();
const transaction = {
  currencyCode: "zar",
  centsAmount: 1000,
  merchantCode: "0000",
  merchantName: "Test Merchant",
  merchantCity: "Cape Town",
  merchantCountry: "ZA",
};
const options = {
  media: "media/",
  grid: {
    spacing: 25,
    length: 3,
    colour: "#ccc",
    snap: true,
  },
  toolbox: {
    kind: "categoryToolbox",
    contents: [
      InvestecToolbox,
      LogicToolbox,
      LoopsToolbox,
      MathToolbox,
      TextToolbox,
      ListsToolbox,
      VariablesToolbox,
      FunctionsToolbox,
    ],
  },
};

function showCode() {
  code.value = javascriptGenerator.workspaceToCode(foo.value.workspace);
}

async function runCode() {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  javascriptGenerator.INFINITE_LOOP_TRAP =
    'if (--window.LoopTrap < 0) throw "Infinite loop.";\n';
  var code = encodeURI(
    javascriptGenerator.workspaceToCode(foo.value.workspace)
  );
  javascriptGenerator.INFINITE_LOOP_TRAP = null;
  try {
    const result = await fetch("http://localhost:3010/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction: transaction,
        code: code,
      }),
    });
    const executionItems = await result.json();
    outputRef.value = executionItems;
    console.log(executionItems);
    executionItems.forEach((item) => {
      console.log("\n💻 ", item.type);
      item.logs.forEach((log) => {
        console.log("\n", log.level, log.content);
      });
    });
  } catch (e) {
    alert(e);
  }
}

function saveWorkspace() {
  const state = Blockly.serialization.workspaces.save(foo.value.workspace);
  localStorage.setItem("blockly", JSON.stringify(state));
}

function loadWorkspace() {
  const state = localStorage.getItem("blockly");
  Blockly.serialization.workspaces.load(JSON.parse(state), foo.value.workspace);
}

function clearWorkspace() {
  localStorage.clear();
  foo.value.workspace.clear();
}
</script>

<template>
  <div id="app">
    <BlocklyComponent
      id="blockly2"
      style="height: 480px; width: 600px"
      :options="options"
      ref="foo"
    ></BlocklyComponent>
    <div id="code">
      <button v-on:click="showCode()">Show JavaScript</button>
      <button v-on:click="saveWorkspace()">Save Workspace</button>
      <button v-on:click="loadWorkspace()">Load Workspace</button>
      <button v-on:click="clearWorkspace()">Clear Workspace</button>
      <pre v-html="code"></pre>
    </div>
    <div id="output" style="height: 480px; width: 600px">
      <h1>Simulation Response:</h1>
      <ul v-if="outputRef">
        <li v-for="item in outputRef" :key="item.id">
          <h2>{{ item.type }}</h2>
          <ul v-for="log in item.logs" :key="log.id">
            <li>{{ log.level }}: {{ log.content }}</li>
          </ul>
        </li>
      </ul>
      <p v-else>...run simulation to see results</p>
    </div>
    <div id="form">
      <form @submit.prevent="runCode">
        <p>Transaction:</p>
        <p>
          Currency:
          <input type="text" required v-model="transaction.currencyCode" />
        </p>
        <p>Amount: <input type="number" v-model="transaction.centsAmount" /></p>
        <p>
          Merchant Code:
          <input type="text" required v-model="transaction.merchantCode" />
        </p>
        <p>
          Merchant Name:
          <input type="text" required v-model="transaction.merchantName" />
        </p>
        <p>
          Merchant City:
          <input type="text" required v-model="transaction.merchantCity" />
        </p>
        <p>
          Merchant Country:
          <input type="text" required v-model="transaction.merchantCountry" />
        </p>
        <button type="submit">Run Transaction</button>
      </form>
    </div>
  </div>
</template>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}

#code {
  /* position: absolute;
  left: 0;
  bottom: 0;
  width: 70%;
  height: 50%;
  margin: 0; */
  background-color: beige;
}

/* #blockly1 { */
/* position: absolute;
  left: 0;
  bottom: 0;
  width: 70%;
  height: 50%; */
/* } */

/* #blockly2 { */
/* position: absolute;
  left: 0;
  top: 0;
  width: 70%;
  height: 50%; */
/* } */

#form {
  position: absolute;
  right: 0;
  top: 0;
  width: 30%;
  height: 50%;
}

#output {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 30%;
  height: 50%;
}
</style>

// add form to create transaction simulation // add component to show output
from server simulation // build component to store env variables // potentially
allow user to upload code to card via api
