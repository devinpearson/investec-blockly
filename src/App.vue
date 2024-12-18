<script setup>
import "./style.css";
import { ref } from "vue";
import BlocklyComponent from "./components/BlocklyComponent.vue";
import TransactionComponent from "./components/TransactionComponent.vue";
import ButtonComponent from "./components/ButtonComponent.vue";
import DropDownComponent from "./components/DropDownComponent.vue";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
hljs.registerLanguage("javascript", javascript);
import "highlight.js/styles/github.css";

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

import { amountExample, defaultExample, petrolCardExample } from "./examples";

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
// const transaction = ref({
//   currencyCode: "zar",
//   centsAmount: 1000,
//   merchantCode: "0000",
//   merchantName: "Test Merchant",
//   merchantCity: "Cape Town",
//   merchantCountry: "ZA",
// });
const workspaceName = ref("Petrol Card");
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
  const codeText = javascriptGenerator.workspaceToCode(foo.value.workspace);
  code.value = hljs.highlight(codeText, { language: "javascript" }).value;
}

async function runCode(transaction) {
  // Generate JavaScript code and run it.
  window.LoopTrap = 1000;
  javascriptGenerator.INFINITE_LOOP_TRAP =
    'if (--window.LoopTrap < 0) throw "Infinite loop.";\n';
  var code = encodeURI(
    javascriptGenerator.workspaceToCode(foo.value.workspace),
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
    console.log(executionItems);
    outputRef.value = executionItems;
  } catch (e) {
    alert(e);
  }
}

function saveWorkspace() {
  const state = Blockly.serialization.workspaces.save(foo.value.workspace);
  //   localStorage.setItem("blockly", JSON.stringify(state));
  localStorage.setItem(workspaceName.value, JSON.stringify(state));
}

function loadWorkspace() {
  //   const state = localStorage.getItem("blockly");
    const state = localStorage.getItem(workspaceName.value);
  //   console.log(workspaceName.value);
    Blockly.serialization.workspaces.load(JSON.parse(state), foo.value.workspace);
  showCode();
}

function loadExample() {
  switch (workspaceName.value) {
    case "Petrol Card":
      Blockly.serialization.workspaces.load(
        petrolCardExample,
        foo.value.workspace,
      );
      break;
    case "Default":
      Blockly.serialization.workspaces.load(
        defaultExample,
        foo.value.workspace,
      );
      break;
    case "Amount":
      Blockly.serialization.workspaces.load(amountExample, foo.value.workspace);
      break;
  }
  //   const state = localStorage.getItem("blockly");
  //   const state = localStorage.getItem(workspaceName.value);
  //   console.log(workspaceName.value);
  //   Blockly.serialization.workspaces.load(JSON.parse(state), foo.value.workspace);
  // Blockly.serialization.workspaces.load(amountExample, foo.value.workspace);
  showCode();
}

function clearWorkspace() {
  //localStorage.clear();
  foo.value.workspace.clear();
}
</script>

<template>
  <div class="mx-2">
    <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
      Programmable Card Simulation
    </h1>
    <div id="app">
      <BlocklyComponent
        id="blockly2"
        style="height: 600px; width: 1040px"
        :options="options"
        ref="foo"
      ></BlocklyComponent>
      <div class="overflow-hidden rounded-lg bg-gray-50 mt-2">
        <div class="px-4 py-5 sm:p-6">
          <div id="code">
            <button-component
              message="Show JavaScript"
              @onButtonClick="showCode"
            ></button-component>
            <button-component
              message="Save Workspace"
              @onButtonClick="saveWorkspace"
            ></button-component>
            <button-component
              message="Load Workspace"
              @onButtonClick="loadWorkspace"
            ></button-component>
            <button-component
              message="Load Example"
              @onButtonClick="loadExample"
            ></button-component>
            <button-component
              message="Clear Workspace"
              @onButtonClick="clearWorkspace"
            ></button-component>
            <drop-down-component
              v-model:workspaceName="workspaceName"
            ></drop-down-component>
            <pre v-html="code" class="mt-2"></pre>
          </div>
        </div>
      </div>
      <transaction-component
        v-model:outputRef="outputRef"
        @on-simulate="runCode"
      ></transaction-component>
    </div>
  </div>
</template>

<style>
svg[display="none"] {
  display: none;
}
</style>
// add form to create transaction simulation // add component to show output
from server simulation // build component to store env variables // potentially
allow user to upload code to card via api
